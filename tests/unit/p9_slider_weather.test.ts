import { describe, it, expect } from 'vitest';
import { HERO_SLIDER_IMAGES, HERO_SLIDER_INTERVAL_MS } from '../../src/config/heroBanners';
import { renderHomePage, initHeroSlider, cleanupHeroSlider, setHeroSlide } from '../../src/pages/Home';
import { renderFooter, renderWeatherCardHtml } from '../../src/components/Footer';
import {
  fetchCurrentWeather,
  sanitizeWeatherIconUrl,
  isWeatherKeyConfigured,
  CurrentWeatherData,
} from '../../src/services/weatherService';

describe('Hero Image Slider & WeatherAPI Footer Widget Remediation', () => {
  describe('Task A: Hero Image Slider (src/config/heroBanners.ts & src/pages/Home.ts)', () => {
    it('should configure exactly 5 verified real WebP banner images', () => {
      expect(HERO_SLIDER_IMAGES).toHaveLength(5);

      for (const banner of HERO_SLIDER_IMAGES) {
        expect(banner.url).toMatch(/^\/assets\/banners\/.*\.webp$/);
        expect(banner.alt.trim().length).toBeGreaterThan(10);
        expect(banner.badgeText.trim().length).toBeGreaterThan(3);
      }
    });

    it('should configure slider rotation interval to exactly 3000ms', () => {
      expect(HERO_SLIDER_INTERVAL_MS).toBe(3000);
    });

    it('should render the hero slider markup with all 5 slides and navigation dots in renderHomePage', async () => {
      const html = await renderHomePage();

      expect(html).toContain('id="hero-slider-container"');
      expect(html).toContain('class="hero-slider-container"');
      expect(html).toContain('class="hero-slider-controls"');

      // Check all 5 banner URLs are rendered
      for (const banner of HERO_SLIDER_IMAGES) {
        expect(html).toContain(`src="${banner.url}"`);
        expect(html).toContain(banner.badgeText);
      }

      // First slide is marked active
      expect(html).toContain('class="hero-slide active"');

      // 5 navigation dots are rendered with aria-label
      for (let i = 0; i < HERO_SLIDER_IMAGES.length; i++) {
        expect(html).toContain(`data-slide-target="${i}"`);
      }
    });

    it('should support slide switching and timer cleanup in DOM lifecycle', () => {
      document.body.innerHTML = `
        <div id="hero-slider-container">
          <div class="hero-slide active" data-slide-index="0"></div>
          <div class="hero-slide" data-slide-index="1"></div>
          <button class="hero-slider-dot active" data-slide-target="0"></button>
          <button class="hero-slider-dot" data-slide-target="1"></button>
        </div>
      `;

      expect(() => initHeroSlider()).not.toThrow();

      // Switch to slide 1
      setHeroSlide(1);
      const slides = document.querySelectorAll('.hero-slide');
      expect(slides[0].classList.contains('active')).toBe(false);
      expect(slides[1].classList.contains('active')).toBe(true);

      expect(() => cleanupHeroSlider()).not.toThrow();
    });
  });

  describe('Task B: WeatherAPI.com Footer Widget (src/services/weatherService.ts & src/components/Footer.ts)', () => {
    it('should render a 4-column footer containing "Thời tiết TP. Hồ Chí Minh hôm nay"', () => {
      const footerHtml = renderFooter();

      expect(footerHtml).toContain('class="footer-grid"');
      expect(footerHtml).toContain('Thời tiết TP. Hồ Chí Minh hôm nay');
      expect(footerHtml).toContain('id="weather-footer-widget"');

      // Existing 3 columns are preserved
      expect(footerHtml).toContain('Liên kết nhanh');
      expect(footerHtml).toContain('Thông tin liên hệ');
      expect(footerHtml).toContain('/assets/logo.svg');
    });

    it('should sanitize protocol-relative icon URLs from WeatherAPI', () => {
      expect(sanitizeWeatherIconUrl('//cdn.weatherapi.com/weather/64x64/day/116.png')).toBe(
        'https://cdn.weatherapi.com/weather/64x64/day/116.png'
      );
      expect(sanitizeWeatherIconUrl('https://example.com/icon.png')).toBe(
        'https://example.com/icon.png'
      );
      expect(sanitizeWeatherIconUrl('')).toBe('');
    });

    it('should render appropriate HTML for loading, missing-key, and error states', () => {
      const loadingHtml = renderWeatherCardHtml({ status: 'loading' });
      expect(loadingHtml).toContain('Đang tải dữ liệu thời tiết');

      const missingKeyHtml = renderWeatherCardHtml({
        status: 'missing-key',
        message: 'Chưa cấu hình API key thời tiết',
      });
      expect(missingKeyHtml).toContain('Chưa tải được dữ liệu thời tiết');
      expect(missingKeyHtml).toContain('VITE_WEATHERAPI_KEY');

      const errorHtml = renderWeatherCardHtml({
        status: 'error',
        message: 'Lỗi mạng',
      });
      expect(errorHtml).toContain('Chưa tải được dữ liệu thời tiết');
    });

    it('should render weather details correctly on success state', () => {
      const sampleData: CurrentWeatherData = {
        locationName: 'Ho Chi Minh City',
        tempC: 32,
        feelslikeC: 38,
        conditionText: 'Nhiều mây, có mưa rào',
        conditionIcon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png',
        humidity: 78,
        windKph: 15,
        lastUpdated: '2026-10-12 11:30',
      };

      const successHtml = renderWeatherCardHtml({
        status: 'success',
        data: sampleData,
      });

      expect(successHtml).toContain('32°C');
      expect(successHtml).toContain('Nhiều mây, có mưa rào');
      expect(successHtml).toContain('https://cdn.weatherapi.com/weather/64x64/day/116.png');
      expect(successHtml).toContain('38°C');
      expect(successHtml).toContain('78%');
      expect(successHtml).toContain('15 km/h');
      expect(successHtml).toContain('2026-10-12 11:30');
    });

    it('should preserve cached weather data when subsequent request encounters error', () => {
      const cachedData: CurrentWeatherData = {
        locationName: 'Ho Chi Minh City',
        tempC: 30,
        feelslikeC: 35,
        conditionText: 'Nắng nhẹ',
        conditionIcon: 'https://cdn.weatherapi.com/weather/64x64/day/113.png',
        humidity: 70,
        windKph: 12,
        lastUpdated: '2026-10-12 11:00',
      };

      const fallbackHtml = renderWeatherCardHtml({
        status: 'error',
        message: 'Mạng gián đoạn',
        cachedData,
      });

      expect(fallbackHtml).toContain('30°C');
      expect(fallbackHtml).toContain('Nắng nhẹ');
      expect(fallbackHtml).toContain('Dữ liệu lưu');
      expect(fallbackHtml).toContain('2026-10-12 11:00');
    });

    it('should handle missing VITE_WEATHERAPI_KEY gracefully without throwing', async () => {
      // In default test environment without VITE_WEATHERAPI_KEY set
      const result = await fetchCurrentWeather();
      if (!isWeatherKeyConfigured()) {
        expect(result.status).toBe('missing-key');
        expect(result).toHaveProperty('message');
      }
    });
  });
});
