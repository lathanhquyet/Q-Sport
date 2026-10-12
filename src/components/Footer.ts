import { SITE_CONFIG } from '../config/site';
import {
  fetchCurrentWeather,
  getStoredWeatherCache,
  WeatherFetchResult,
} from '../services/weatherService';

let weatherRefreshTimer: number | null = null;

/**
 * Hủy timer định kỳ của widget thời tiết khi chuyển trang hoặc unmount
 */
export function cleanupWeatherWidget(): void {
  if (weatherRefreshTimer !== null) {
    window.clearInterval(weatherRefreshTimer);
    weatherRefreshTimer = null;
  }
}

/**
 * Render HTML cho nội dung bên trong thẻ widget thời tiết
 */
export function renderWeatherCardHtml(result: WeatherFetchResult): string {
  if (result.status === 'loading') {
    return `
      <div class="weather-loading-pulse" style="display: flex; align-items: center; gap: 8px; padding: 8px 0;">
        <span style="font-size: 1.25rem;">⏳</span>
        <span style="font-size: 0.8125rem; color: var(--color-text-secondary);">Đang tải dữ liệu thời tiết TP.HCM...</span>
      </div>
    `;
  }

  if (result.status === 'missing-key') {
    return `
      <div style="display: flex; align-items: flex-start; gap: 8px;">
        <span style="font-size: 1.25rem;">🌤️</span>
        <div>
          <p style="font-size: 0.8125rem; color: var(--color-text); font-weight: 600; margin: 0 0 4px 0;">
            Chưa tải được dữ liệu thời tiết
          </p>
          <p style="font-size: 0.75rem; color: var(--color-text-secondary); margin: 0; line-height: 1.4;">
            Chưa cấu hình API key thời tiết (VITE_WEATHERAPI_KEY).
          </p>
        </div>
      </div>
    `;
  }

  if (result.status === 'error') {
    if (result.cachedData) {
      const data = result.cachedData;
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            ${data.conditionIcon ? `<img src="${data.conditionIcon}" alt="${data.conditionText}" width="42" height="42" style="display: block; flex-shrink: 0;" />` : `<span style="font-size: 1.5rem;">🌤️</span>`}
            <div>
              <div style="font-size: 1.5rem; font-weight: 800; color: var(--color-text); line-height: 1;">
                ${data.tempC}°C
              </div>
              <div style="font-size: 0.8125rem; font-weight: 600; color: var(--color-primary-dark); margin-top: 2px;">
                ${data.conditionText}
              </div>
            </div>
          </div>
          <span style="font-size: 0.6875rem; background: #FEF3C7; color: #92400E; padding: 2px 6px; border-radius: var(--radius-pill); font-weight: 600;">Dữ liệu lưu</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 0.75rem; color: var(--color-text-secondary); border-top: 1px solid var(--color-primary-border); padding-top: 8px; margin-top: 6px;">
          <div>🌡️ Cảm giác: <strong style="color: var(--color-text);">${data.feelslikeC}°C</strong></div>
          <div>💧 Độ ẩm: <strong style="color: var(--color-text);">${data.humidity}%</strong></div>
          <div style="grid-column: span 2;">💨 Gió: <strong style="color: var(--color-text);">${data.windKph} km/h</strong></div>
        </div>

        ${data.lastUpdated ? `
          <div style="margin-top: 6px; font-size: 0.6875rem; color: var(--color-text-secondary); text-align: right;">
            Cập nhật lúc: ${data.lastUpdated}
          </div>
        ` : ''}
      `;
    }

    return `
      <div style="display: flex; align-items: flex-start; gap: 8px;">
        <span style="font-size: 1.25rem;">⚠️</span>
        <div>
          <p style="font-size: 0.8125rem; color: var(--color-text); font-weight: 600; margin: 0 0 4px 0;">
            Chưa tải được dữ liệu thời tiết
          </p>
          <p style="font-size: 0.75rem; color: var(--color-text-secondary); margin: 0; line-height: 1.4;">
            Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.
          </p>
        </div>
      </div>
    `;
  }

  // result.status === 'success'
  const data = result.data;
  return `
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        ${data.conditionIcon ? `<img src="${data.conditionIcon}" alt="${data.conditionText}" width="42" height="42" style="display: block; flex-shrink: 0;" />` : `<span style="font-size: 1.5rem;">🌤️</span>`}
        <div>
          <div style="font-size: 1.625rem; font-weight: 800; color: var(--color-text); line-height: 1;">
            ${data.tempC}°C
          </div>
          <div style="font-size: 0.8125rem; font-weight: 600; color: var(--color-primary-dark); margin-top: 2px;">
            ${data.conditionText}
          </div>
        </div>
      </div>
      ${result.fromCache ? `<span style="font-size: 0.6875rem; background: var(--color-primary-light); color: var(--color-primary-dark); padding: 2px 6px; border-radius: var(--radius-pill); font-weight: 600;">Đã lưu</span>` : ''}
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 0.75rem; color: var(--color-text-secondary); border-top: 1px solid var(--color-primary-border); padding-top: 8px; margin-top: 6px;">
      <div>🌡️ Cảm giác: <strong style="color: var(--color-text);">${data.feelslikeC}°C</strong></div>
      <div>💧 Độ ẩm: <strong style="color: var(--color-text);">${data.humidity}%</strong></div>
      <div style="grid-column: span 2;">💨 Gió: <strong style="color: var(--color-text);">${data.windKph} km/h</strong></div>
    </div>

    ${data.lastUpdated ? `
      <div style="margin-top: 6px; font-size: 0.6875rem; color: var(--color-text-secondary); text-align: right;">
        Cập nhật: ${data.lastUpdated}
      </div>
    ` : ''}
  `;
}

/**
 * Khởi tạo widget thời tiết: gọi API và đặt lịch cập nhật mỗi 10 phút
 */
export async function initWeatherWidget(): Promise<void> {
  const container = document.getElementById('weather-footer-widget');
  if (!container) return;

  // Lấy dữ liệu thực tế
  const result = await fetchCurrentWeather();
  const currentContainer = document.getElementById('weather-footer-widget');
  if (currentContainer) {
    currentContainer.innerHTML = renderWeatherCardHtml(result);
  }

  // Đặt lịch định kỳ 10 phút (600,000ms)
  cleanupWeatherWidget();
  weatherRefreshTimer = window.setInterval(async () => {
    const refreshed = await fetchCurrentWeather(true);
    const refreshedContainer = document.getElementById('weather-footer-widget');
    if (refreshedContainer) {
      refreshedContainer.innerHTML = renderWeatherCardHtml(refreshed);
    }
  }, 10 * 60 * 1000);
}

export function renderFooter(): string {
  const cachedData = getStoredWeatherCache();
  const initialWeatherHtml = cachedData
    ? renderWeatherCardHtml({ status: 'success', data: cachedData, fromCache: true })
    : renderWeatherCardHtml({ status: 'loading' });

  return `
    <footer style="margin-top: var(--spacing-72); background: var(--color-primary-light); border-top: 1px solid var(--color-primary-border); padding: var(--spacing-48) 0 var(--spacing-24) 0; color: var(--color-text);">
      <div class="container">
        <!-- 4-Column Responsive Grid (Brand, Quick Links, Contact, Weather TP.HCM) -->
        <div class="footer-grid">
          <!-- Column 1: Brand & Tagline -->
          <div>
            <img src="/assets/logo.svg" alt="Q-Sport" height="36" style="margin-bottom: var(--spacing-12);" />
            <p style="color: var(--color-text-secondary); font-size: 0.875rem; line-height: 1.6;">
              ${SITE_CONFIG.tagline}
            </p>
          </div>

          <!-- Column 2: Quick Links -->
          <div>
            <h4 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-primary-dark); margin-bottom: var(--spacing-12);">Liên kết nhanh</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.875rem;">
              <li><a href="/" data-link>Trang chủ</a></li>
              <li><a href="/products" data-link>Danh sách sản phẩm</a></li>
              <li><a href="/news" data-link>Tin nội bộ &amp; Video</a></li>
              <li><a href="/about" data-link>Về chúng tôi Q-Sport</a></li>
              <li><a href="/cart" data-link>Giỏ hàng</a></li>
            </ul>
          </div>

          <!-- Column 3: Contact Info -->
          <div>
            <h4 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-primary-dark); margin-bottom: var(--spacing-12);">Thông tin liên hệ</h4>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 6px;">
              📍 <strong>Địa chỉ:</strong> ${SITE_CONFIG.address}
            </p>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 6px;">
              📞 <strong>Điện thoại:</strong> ${SITE_CONFIG.phone}
            </p>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary);">
              ✉️ <strong>Email:</strong> ${SITE_CONFIG.email}
            </p>
          </div>

          <!-- Column 4: Weather Widget (WeatherAPI.com - TP. Hồ Chí Minh) -->
          <div>
            <h4 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-primary-dark); margin-bottom: var(--spacing-12);">
              Thời tiết TP. Hồ Chí Minh hôm nay
            </h4>
            <div id="weather-footer-widget" class="weather-footer-card">
              ${initialWeatherHtml}
            </div>
          </div>
        </div>

        <div style="border-top: 1px solid var(--color-primary-border); padding-top: var(--spacing-16); text-align: center; font-size: 0.875rem; color: var(--color-text-secondary);">
          <p style="font-weight: 600; color: var(--color-text); margin-bottom: 4px;">&copy; Q-Sport. Bản quyền thuộc về Q-Sport.</p>
          <p>Đại diện: ${SITE_CONFIG.representative} | Email: ${SITE_CONFIG.email}</p>
          <p>">Đây là sản phẩm demo trong quá trình học Vibecode - Không nhằm mục đích thương mại, tất cả hình ảnh và nội dung đều copy từ các trang XSport, shopVNB và Internet - Website sẽ khoá sau khi kết thúc khoá học</p>
        </div>
      </div>
    </footer>
  `;
}
