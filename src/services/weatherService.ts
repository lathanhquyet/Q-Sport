export interface CurrentWeatherData {
  locationName: string;
  tempC: number;
  feelslikeC: number;
  conditionText: string;
  conditionIcon: string;
  humidity: number;
  windKph: number;
  lastUpdated: string;
}

export type WeatherFetchResult =
  | { status: 'loading' }
  | { status: 'success'; data: CurrentWeatherData; fromCache?: boolean }
  | { status: 'missing-key'; message: string }
  | { status: 'error'; message: string; cachedData?: CurrentWeatherData };

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 phút để tối ưu quota WeatherAPI
let inMemoryWeatherCache: CurrentWeatherData | null = null;
let lastFetchEpochMs = 0;

/**
 * Kiểm tra xem VITE_WEATHERAPI_KEY có được cấu hình trong môi trường hay không
 * Không log hoặc tiết lộ giá trị key.
 */
export function isWeatherKeyConfigured(): boolean {
  const key = import.meta.env.VITE_WEATHERAPI_KEY;
  return typeof key === 'string' && key.trim().length > 0;
}

/**
 * Lấy dữ liệu thời tiết đã cache trong bộ nhớ (nếu còn hiệu lực)
 */
export function getStoredWeatherCache(): CurrentWeatherData | null {
  return inMemoryWeatherCache;
}

/**
 * Chuẩn hóa URL icon từ WeatherAPI (thường trả về //cdn.weatherapi.com/...)
 */
export function sanitizeWeatherIconUrl(iconPath?: string): string {
  if (!iconPath) return '';
  if (iconPath.startsWith('//')) {
    return `https:${iconPath}`;
  }
  return iconPath;
}

/**
 * Gọi WeatherAPI.com lấy dữ liệu thời tiết hiện tại cho TP. Hồ Chí Minh
 * Tôn trọng cache 10 phút, timeout 8 giây và xử lý lỗi an toàn không rò rỉ API key.
 */
export async function fetchCurrentWeather(forceRefresh = false): Promise<WeatherFetchResult> {
  const now = Date.now();

  // 1. Trả về cache nếu còn trong thời hạn TTL và không bị force refresh
  if (!forceRefresh && inMemoryWeatherCache && now - lastFetchEpochMs < CACHE_TTL_MS) {
    return {
      status: 'success',
      data: inMemoryWeatherCache,
      fromCache: true,
    };
  }

  // 2. Kiểm tra API key
  const apiKey = (import.meta.env.VITE_WEATHERAPI_KEY || '').trim();
  if (!apiKey) {
    return {
      status: 'missing-key',
      message: 'Chưa cấu hình API key thời tiết',
    };
  }

  // 3. Thực hiện gọi API với AbortController
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);

  try {
    const endpoint = `https://api.weatherapi.com/v1/current.json?key=${encodeURIComponent(apiKey)}&q=Ho+Chi+Minh&lang=vi`;

    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    window.clearTimeout(timeoutId);

    if (!res.ok) {
      if (inMemoryWeatherCache) {
        return {
          status: 'error',
          message: 'Không thể làm mới dữ liệu thời tiết',
          cachedData: inMemoryWeatherCache,
        };
      }
      return {
        status: 'error',
        message: 'Chưa tải được dữ liệu thời tiết',
      };
    }

    const json = await res.json();
    const current = json.current;
    const location = json.location;

    if (!current) {
      throw new Error('Malformed weather response');
    }

    const weatherData: CurrentWeatherData = {
      locationName: location?.name || 'TP. Hồ Chí Minh',
      tempC: Math.round(Number(current.temp_c ?? 0)),
      feelslikeC: Math.round(Number(current.feelslike_c ?? current.temp_c ?? 0)),
      conditionText: String(current.condition?.text || 'Thời tiết ổn định'),
      conditionIcon: sanitizeWeatherIconUrl(current.condition?.icon),
      humidity: Number(current.humidity ?? 0),
      windKph: Math.round(Number(current.wind_kph ?? 0)),
      lastUpdated: String(current.last_updated || ''),
    };

    inMemoryWeatherCache = weatherData;
    lastFetchEpochMs = Date.now();

    return {
      status: 'success',
      data: weatherData,
      fromCache: false,
    };
  } catch {
    window.clearTimeout(timeoutId);

    if (inMemoryWeatherCache) {
      return {
        status: 'error',
        message: 'Không thể kết nối làm mới thời tiết',
        cachedData: inMemoryWeatherCache,
      };
    }

    return {
      status: 'error',
      message: 'Chưa tải được dữ liệu thời tiết',
    };
  }
}
