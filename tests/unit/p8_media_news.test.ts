import { describe, it, expect } from 'vitest';
import {
  extractYouTubeVideoId,
  getYouTubeThumbnailUrl,
  INTERNAL_NEWS_VIDEOS,
  getVisibleInternalNews,
} from '../../src/data/internalNews';
import { getProductImageUrl } from '../../src/config/productImages';
import { renderHeader } from '../../src/components/Header';
import { renderInternalNewsPage } from '../../src/pages/InternalNews';
import { renderAdminNewsGuidePage } from '../../src/pages/admin/AdminNewsGuide';

describe('Media & Video Management Remediation (Tasks A, B, C, D)', () => {
  describe('Task A: Local Repository Asset Paths in getProductImageUrl', () => {
    it('should prioritize local repository paths in /assets/products/ subdirectories', () => {
      const customShoe = getProductImageUrl('PRD03', '/assets/products/Giay/yonexZ65.jpg');
      expect(customShoe).toBe('/assets/products/Giay/yonexZ65.jpg');

      const customRacket = getProductImageUrl('PRD01', '/assets/products/Vot/Linning100.jpg');
      expect(customRacket).toBe('/assets/products/Vot/Linning100.jpg');

      const customShort = getProductImageUrl('PRD07', '/assets/products/Quan/shortActive.jpg');
      expect(customShort).toBe('/assets/products/Quan/shortActive.jpg');

      const customShirt = getProductImageUrl('PRD05', '/assets/products/Ao/shirtDry.jpg');
      expect(customShirt).toBe('/assets/products/Ao/shirtDry.jpg');

      const customBag = getProductImageUrl('PRD09', '/assets/products/Balo/bagCompact.jpg');
      expect(customBag).toBe('/assets/products/Balo/bagCompact.jpg');

      const customAccessory = getProductImageUrl('PRD11', '/assets/products/PhuKien/gripSuper.jpg');
      expect(customAccessory).toBe('/assets/products/PhuKien/gripSuper.jpg');
    });

    it('should support branding and banner local paths', () => {
      const brandingLogo = getProductImageUrl(null, '/assets/branding/logo.png');
      expect(brandingLogo).toBe('/assets/branding/logo.png');

      const bannerMain = getProductImageUrl(null, '/assets/banners/home-main.webp');
      expect(bannerMain).toBe('/assets/banners/home-main.webp');
    });

    it('should retain verified Unsplash mapping for default demo products when no local override path is passed', () => {
      const defaultPrd01 = getProductImageUrl('PRD01');
      expect(defaultPrd01).toContain('images.unsplash.com');

      const defaultPrd12 = getProductImageUrl('PRD12');
      expect(defaultPrd12).toContain('images.unsplash.com');
    });
  });

  describe('Task B: Header Top Menu Redesign & "Tin nội bộ" Link', () => {
    it('should render "Tin nội bộ" in both desktop navigation and mobile drawer', () => {
      const headerHtml = renderHeader('/');
      expect(headerHtml).toContain('href="/news"');
      expect(headerHtml).toContain('Tin nội bộ');
      expect(headerHtml).toContain('mobile-nav-link');
    });

    it('should mark "Tin nội bộ" active when currentPath is /news or /tin-noi-bo', () => {
      const newsHeader = renderHeader('/news');
      expect(newsHeader).toMatch(/href="\/news"[^>]*class="[^"]*active/);

      const aliasHeader = renderHeader('/tin-noi-bo');
      expect(aliasHeader).toMatch(/href="\/news"[^>]*class="[^"]*active/);
    });
  });

  describe('Task C: Internal News Video Data & YouTube Validation', () => {
    it('should accurately extract YouTube Video IDs from watch, youtu.be, shorts, and embed URLs', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=4x9U0h4F4Qk')).toBe('4x9U0h4F4Qk');
      expect(extractYouTubeVideoId('https://youtu.be/7G3s5_dM6E0')).toBe('7G3s5_dM6E0');
      expect(extractYouTubeVideoId('https://www.youtube.com/shorts/u_nS9d1B3vE')).toBe('u_nS9d1B3vE');
      expect(extractYouTubeVideoId('https://www.youtube.com/embed/W2b8rY-yE1M')).toBe('W2b8rY-yE1M');
      expect(extractYouTubeVideoId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('should return null for invalid, non-YouTube or malformed strings', () => {
      expect(extractYouTubeVideoId('')).toBeNull();
      expect(extractYouTubeVideoId('https://example.com/video')).toBeNull();
      expect(extractYouTubeVideoId('invalid-short-id')).toBeNull();
    });

    it('should generate official HQ YouTube thumbnail URLs', () => {
      const thumb = getYouTubeThumbnailUrl('4x9U0h4F4Qk');
      expect(thumb).toBe('https://img.youtube.com/vi/4x9U0h4F4Qk/hqdefault.jpg');
    });

    it('should contain valid video records in INTERNAL_NEWS_VIDEOS', () => {
      expect(INTERNAL_NEWS_VIDEOS.length).toBeGreaterThan(0);

      INTERNAL_NEWS_VIDEOS.forEach(video => {
        expect(video.id).toBeTruthy();
        expect(video.title).toBeTruthy();
        expect(video.description).toBeTruthy();
        expect(video.youtubeUrl).toBeTruthy();
        expect(typeof video.isVisible).toBe('boolean');
        expect(typeof video.order).toBe('number');

        const videoId = extractYouTubeVideoId(video.youtubeUrl);
        expect(videoId).toBeTruthy();
        expect(videoId).toHaveLength(11);
      });
    });

    it('should filter only visible videos sorted by order in getVisibleInternalNews', () => {
      const visible = getVisibleInternalNews();
      expect(visible.length).toBeGreaterThan(0);

      for (let i = 0; i < visible.length - 1; i++) {
        expect(visible[i].isVisible).toBe(true);
        expect(visible[i].order).toBeLessThanOrEqual(visible[i + 1].order);
      }
    });

    it('should render public InternalNews page with gridview and modal player markup', () => {
      const pageHtml = renderInternalNewsPage();
      expect(pageHtml).toContain('TIN NỘI BỘ');
      expect(pageHtml).toContain('video-thumbnail-box');
      expect(pageHtml).toContain('video-modal-backdrop');
      expect(pageHtml).toContain('video-modal-iframe');
    });

    it('should render AdminNewsGuide page with configuration instructions and code template', () => {
      const adminGuideHtml = renderAdminNewsGuidePage();
      expect(adminGuideHtml).toContain('src/data/internalNews.ts');
      expect(adminGuideHtml).toContain('QUẢN LÝ TIN NỘI BỘ');
      expect(adminGuideHtml).toContain('INTERNAL_NEWS_VIDEOS');
    });
  });

  describe('Sky Blue Brand Theme & Homepage Hero Redesign', () => {
    it('should configure mandatory #81D7FF as primary color token and high contrast text', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const variablesCss = fs.readFileSync(path.resolve(__dirname, '../../src/styles/variables.css'), 'utf-8');

      expect(variablesCss).toContain('--color-primary: #81D7FF;');
      expect(variablesCss).toContain('--color-text: #102A43;');
      expect(variablesCss).toContain('--color-primary-light: #EAF8FF;');
      expect(variablesCss).toContain('--color-primary-border: #B8E8FF;');
    });

    it('should ensure main.css pairs primary button with high-contrast text', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const mainCss = fs.readFileSync(path.resolve(__dirname, '../../src/styles/main.css'), 'utf-8');

      expect(mainCss).toContain('background-color: var(--color-primary);');
      expect(mainCss).toContain('color: var(--color-text) !important;');
    });

    it('should render homepage hero with realistic badminton photography asset instead of geometric lines', async () => {
      const { renderHomePage } = await import('../../src/pages/Home');
      const homeHtml = await renderHomePage();

      // Verified hero banner image asset
      expect(homeHtml).toContain('/assets/banners/home-hero.webp');
      expect(homeHtml).toContain('BỨT PHÁ PHONG ĐỘ');
      expect(homeHtml).toContain('Mua sắm ngay');
      expect(homeHtml).toContain('Khám phá danh mục');
      // No longer using isolated geometric pattern box as the only hero visual
      expect(homeHtml).not.toContain('court-hero-pattern');
    });
  });
});
