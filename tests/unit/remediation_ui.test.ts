import { describe, it, expect } from 'vitest';
import { DEMO_PRODUCTS, getProducts } from '../../src/services/productService';
import { PRODUCT_REAL_IMAGES, getProductImageUrl } from '../../src/config/productImages';

describe('UI/UX Remediation Tests (Task A, Task B, Task C)', () => {
  describe('Task C: Product Unsplash Images Audit & Validation', () => {
    it('should configure valid Unsplash HTTP/HTTPS image URLs for all 12 demo products', () => {
      expect(DEMO_PRODUCTS).toHaveLength(12);

      DEMO_PRODUCTS.forEach(product => {
        expect(product.image_url).toBeDefined();
        expect(product.image_url).toMatch(/^https:\/\/images\.unsplash\.com\/photo-/);
      });
    });

    it('should map unique high-resolution real photography URLs for each product code', () => {
      const keys = Object.keys(PRODUCT_REAL_IMAGES);
      expect(keys).toHaveLength(12);
      expect(PRODUCT_REAL_IMAGES['PRD01']).toContain('unsplash.com');
      expect(PRODUCT_REAL_IMAGES['PRD02']).toContain('unsplash.com');

      // Check fallback helper return
      expect(getProductImageUrl('PRD_INVALID', '/assets/products/fallback.svg')).toBe('/assets/products/fallback.svg');
    });
  });

  describe('Task C: Auto Filtering, Combined Conditions & Sorting', () => {
    it('should filter by search term instantly', async () => {
      const results = await getProducts({ search: 'Attack' });
      expect(results.length).toBeGreaterThan(0);
      results.forEach(p => {
        expect(p.name.toLowerCase()).toContain('attack');
      });
    });

    it('should filter by category slug instantly', async () => {
      const results = await getProducts({ categorySlug: 'giay' });
      expect(results.length).toBe(2);
      results.forEach(p => {
        expect(p.category_id).toBe('c0000000-0000-0000-0000-000000000001');
      });
    });

    it('should apply combined filters (search + category + sort price-asc)', async () => {
      const results = await getProducts({
        categorySlug: 'ao',
        search: 'Q-Sport',
        sort: 'price-asc',
      });

      expect(results.length).toBe(2);
      expect(results[0].price).toBeLessThanOrEqual(results[1].price);
    });

    it('should sort products by price descending', async () => {
      const results = await getProducts({ sort: 'price-desc' });
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].price).toBeGreaterThanOrEqual(results[i + 1].price);
      }
    });

    it('should return empty list when search term has no match', async () => {
      const results = await getProducts({ search: 'NonExistentProductXYZ123' });
      expect(results).toHaveLength(0);
    });
  });
});
