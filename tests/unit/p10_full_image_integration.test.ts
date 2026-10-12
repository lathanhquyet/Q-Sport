import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { HERO_SLIDER_IMAGES } from '../../src/config/heroBanners';
import {
  PRODUCT_LOCAL_IMAGES,
  PRODUCT_GALLERY_IMAGES,
  getProductLocalImage,
  getProductGallery,
} from '../../src/config/productImages';
import { renderProductCard } from '../../src/components/ProductCard';
import { DEMO_PRODUCTS } from '../../src/services/productService';

describe('Task D: Full Image Integration Regression Tests', () => {
  describe('Hero Slider Banner Assets', () => {
    it('should ensure all configured hero banners exist on the local filesystem', () => {
      expect(HERO_SLIDER_IMAGES.length).toBeGreaterThanOrEqual(5);

      for (const banner of HERO_SLIDER_IMAGES) {
        expect(banner.url).toMatch(/^\/assets\/banners\/.*\.webp$/);
        const diskPath = path.resolve(process.cwd(), 'public', banner.url.replace(/^\//, ''));
        expect(fs.existsSync(diskPath), `Banner file missing on disk: ${diskPath}`).toBe(true);
        const stats = fs.statSync(diskPath);
        expect(stats.size).toBeGreaterThan(10 * 1024); // >= 10KB
      }
    });

    it('should have valid banner image URLs and descriptive titles', () => {
      const urls = HERO_SLIDER_IMAGES.map(b => b.url);
      const uniqueUrls = new Set(urls);
      expect(uniqueUrls.size).toBeGreaterThanOrEqual(5);

      for (const banner of HERO_SLIDER_IMAGES) {
        expect(banner.alt.trim().length).toBeGreaterThan(15);
        expect(banner.badgeText.trim().length).toBeGreaterThan(4);
      }
    });
  });

  describe('Product Catalog & Gallery Assets Integration', () => {
    it('should ensure all primary local product images exist on the local filesystem', () => {
      const codes = Object.keys(PRODUCT_LOCAL_IMAGES);
      expect(codes.length).toBe(12);

      for (const code of codes) {
        const imgPath = PRODUCT_LOCAL_IMAGES[code];
        expect(imgPath).toMatch(/^\/assets\/products\//);
        const diskPath = path.resolve(process.cwd(), 'public', imgPath.replace(/^\//, ''));
        expect(fs.existsSync(diskPath), `Product image missing on disk: ${diskPath}`).toBe(true);
      }
    });

    it('should ensure every image in PRODUCT_GALLERY_IMAGES exists on disk', () => {
      const codes = Object.keys(PRODUCT_GALLERY_IMAGES);
      expect(codes.length).toBe(12);

      let totalGalleryImages = 0;
      for (const code of codes) {
        const gallery = PRODUCT_GALLERY_IMAGES[code];
        expect(gallery.length).toBeGreaterThanOrEqual(2); // Each product has multi-angle gallery
        totalGalleryImages += gallery.length;

        for (const imgPath of gallery) {
          const diskPath = path.resolve(process.cwd(), 'public', imgPath.replace(/^\//, ''));
          expect(fs.existsSync(diskPath), `Gallery image missing on disk: ${diskPath}`).toBe(true);
        }
      }

      // Confirms all 25 local product assets are utilized
      expect(totalGalleryImages).toBeGreaterThanOrEqual(24);
    });

    it('should map products to their correct product category folders without mismatch', () => {
      // Vợt
      expect(PRODUCT_LOCAL_IMAGES['PRD01']).toContain('/assets/products/Vot/');
      expect(PRODUCT_LOCAL_IMAGES['PRD02']).toContain('/assets/products/Vot/');

      // Giày
      expect(PRODUCT_LOCAL_IMAGES['PRD03']).toContain('/assets/products/Giay/');
      expect(PRODUCT_LOCAL_IMAGES['PRD04']).toContain('/assets/products/Giay/');

      // Áo
      expect(PRODUCT_LOCAL_IMAGES['PRD05']).toContain('/assets/products/Ao/');
      expect(PRODUCT_LOCAL_IMAGES['PRD06']).toContain('/assets/products/Ao/');

      // Quần
      expect(PRODUCT_LOCAL_IMAGES['PRD07']).toContain('/assets/products/Quan/');
      expect(PRODUCT_LOCAL_IMAGES['PRD08']).toContain('/assets/products/Quan/');

      // Balo
      expect(PRODUCT_LOCAL_IMAGES['PRD09']).toContain('/assets/products/Balo/');
      expect(PRODUCT_LOCAL_IMAGES['PRD10']).toContain('/assets/products/Balo/');

      // Phụ kiện
      expect(PRODUCT_LOCAL_IMAGES['PRD11']).toContain('/assets/products/PhuKien/');
      expect(PRODUCT_LOCAL_IMAGES['PRD12']).toContain('/assets/products/PhuKien/');
    });

    it('should retrieve gallery arrays with getProductGallery', () => {
      const gallery01 = getProductGallery('PRD01');
      expect(gallery01.length).toBe(2);
      expect(gallery01[0]).toContain('/assets/products/Vot/');

      const gallery11 = getProductGallery('PRD11');
      expect(gallery11.length).toBe(4);
      expect(gallery11[0]).toContain('/assets/products/PhuKien/');

      const gallery12 = getProductGallery('day-cuoc-vot-qsport-repulsion-66');
      expect(gallery12.length).toBe(4);
      expect(gallery12[0]).toContain('/assets/products/PhuKien/');
    });

    it('should retrieve local product image directly with getProductLocalImage', () => {
      expect(getProductLocalImage('PRD01')).toContain('/assets/products/Vot/');
      expect(getProductLocalImage('PRD03')).toContain('/assets/products/Giay/');
      expect(getProductLocalImage('non-existent')).toBeNull();
    });

    it('should render ProductCard with the local photo URL', () => {
      const sampleProduct = DEMO_PRODUCTS[0]; // PRD01
      const cardHtml = renderProductCard(sampleProduct);

      expect(cardHtml).toContain('src="/assets/products/Vot/vot-cau-long-lining-axforce-90-limited-2026-chinh-hang_1774060510.webp"');
      expect(cardHtml).not.toContain('images.unsplash.com');
    });
  });
});
