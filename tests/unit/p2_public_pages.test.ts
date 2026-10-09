import { describe, it, expect } from 'vitest';
import { getProducts, getProductBySlug, getFeaturedProducts } from '../../src/services/productService';
import { getCategories } from '../../src/services/categoryService';
import { getProductComments, submitComment, sanitizeText } from '../../src/services/commentService';
import { SITE_CONFIG } from '../../src/config/site';

describe('Phase 2 (P2) Public Pages & Services Tests', () => {

  describe('Site Configuration & Mandatory Details', () => {
    it('should configure official store address at Thủ Đức', () => {
      expect(SITE_CONFIG.address).toContain('Thủ Đức');
      expect(SITE_CONFIG.address).toContain('56/1 Đ. Số 2');
    });

    it('should configure mandatory legal representative and email', () => {
      expect(SITE_CONFIG.representative).toBe('Lã Thành Quyết');
      expect(SITE_CONFIG.email).toBe('ltquyet@qsport.vn');
    });

    it('should configure default bank details (MB, 0999999888, La Thanh Quyet)', () => {
      expect(SITE_CONFIG.bankName).toBe('MB');
      expect(SITE_CONFIG.bankAccountNumber).toBe('0999999888');
      expect(SITE_CONFIG.bankAccountHolder).toBe('La Thanh Quyet');
    });

    it('should configure official YouTube channel URL', () => {
      expect(SITE_CONFIG.youtubeChannelUrl).toBe('https://www.youtube.com/@buoctiepmoingay/videos');
    });
  });

  describe('Product Service', () => {
    it('should return all products by default', async () => {
      const products = await getProducts();
      expect(products.length).toBeGreaterThan(0);
    });

    it('should filter products by search term', async () => {
      const results = await getProducts({ search: 'Pro Attack' });
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toContain('Pro Attack');
    });

    it('should filter products by category slug', async () => {
      const results = await getProducts({ categorySlug: 'vot' });
      expect(results.length).toBeGreaterThan(0);
      results.forEach(p => {
        expect(p.category_id).toBe('c0000000-0000-0000-0000-000000000002');
      });
    });

    it('should sort products by price ascending', async () => {
      const results = await getProducts({ sort: 'price-asc' });
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].price).toBeLessThanOrEqual(results[i + 1].price);
      }
    });

    it('should sort products by price descending', async () => {
      const results = await getProducts({ sort: 'price-desc' });
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].price).toBeGreaterThanOrEqual(results[i + 1].price);
      }
    });

    it('should fetch product by slug correctly', async () => {
      const product = await getProductBySlug('vot-cau-long-qsport-pro-attack-100');
      expect(product).not.toBeNull();
      expect(product?.name).toBe('Vợt Cầu Lông Q-Sport Pro Attack 100');
    });

    it('should return null for non-existent slug', async () => {
      const product = await getProductBySlug('non-existent-product-slug-xyz');
      expect(product).toBeNull();
    });

    it('should return featured products list', async () => {
      const featured = await getFeaturedProducts();
      expect(featured.length).toBeGreaterThan(0);
      featured.forEach(p => expect(p.is_featured).toBe(true));
    });
  });

  describe('Category Service', () => {
    it('should return 6 active default categories', async () => {
      const categories = await getCategories();
      expect(categories).toHaveLength(6);
      const slugs = categories.map(c => c.slug);
      expect(slugs).toEqual(['giay', 'vot', 'quan', 'ao', 'balo', 'phu-kien']);
    });
  });

  describe('Comment Service & XSS Sanitizer', () => {
    it('should sanitize HTML special characters to prevent XSS', () => {
      const dangerousInput = '<script>alert("xss")</script>';
      const cleanText = sanitizeText(dangerousInput);
      expect(cleanText).not.toContain('<script>');
      expect(cleanText).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    });

    it('should fetch APPROVED comments for product', async () => {
      const comments = await getProductComments('p0000000-0000-0000-0000-000000000001');
      expect(comments.length).toBeGreaterThan(0);
      comments.forEach(c => expect(c.status).toBe('APPROVED'));
    });

    it('should require non-empty content when submitting comment', async () => {
      const res = await submitComment('p0000000-0000-0000-0000-000000000001', 'Test User', '  ');
      expect(res.success).toBe(false);
      expect(res.message).toContain('không được để trống');
    });

    it('should default display_name to Khách hàng if empty', async () => {
      const res = await submitComment('p0000000-0000-0000-0000-000000000001', '', 'Sản phẩm tuyệt vời!');
      expect(res.success).toBe(true);
      expect(res.message).toContain('sau khi được duyệt');
    });
  });
});
