import { describe, it, expect } from 'vitest';
import { DEMO_PRODUCTS, getProducts, enrichProductWithRealImage } from '../../src/services/productService';
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
      expect(PRODUCT_REAL_IMAGES['PRD12']).toContain('unsplash.com');
      expect(getProductImageUrl('PRD01')).toBe(PRODUCT_REAL_IMAGES['PRD01']);
      expect(getProductImageUrl('PRD_INVALID', '/assets/products/fallback.svg')).toBe('/assets/products/fallback.svg');
    });

    it('should enrich raw database records (SVG image_url) with Unsplash photo URLs', () => {
      const dbRecord = {
        id: 'a0000000-0000-0000-0000-000000000001',
        product_code: 'PRD01',
        name: 'Vợt Cầu Lông Q-Sport Pro Attack 100',
        slug: 'vot-cau-long-qsport-pro-attack-100',
        price: 1450000,
        stock_quantity: 15,
        image_url: '/assets/products/racket-attack.svg',
        category_id: 'c0000000-0000-0000-0000-000000000002',
        is_active: true,
        is_featured: true,
        created_at: '2026-10-09T00:00:00Z',
        updated_at: '2026-10-09T00:00:00Z',
      };

      const enriched = enrichProductWithRealImage(dbRecord);
      expect(enriched.image_url).toBe(PRODUCT_REAL_IMAGES['PRD01']);
      expect(enriched.name).toBe(dbRecord.name);
      expect(enriched.price).toBe(dbRecord.price);
      expect(enriched.stock_quantity).toBe(dbRecord.stock_quantity);
    });

    it('should fallback to mapping by slug when product_code is missing or null', () => {
      const dbRecordWithoutCode = {
        id: 'a0000000-0000-0000-0000-000000000003',
        product_code: undefined as any,
        name: 'Giày Cầu Lông Q-Sport GripMaster Green',
        slug: 'giay-cau-long-qsport-gripmaster-green',
        price: 1150000,
        stock_quantity: 12,
        image_url: '/assets/products/shoe-green.svg',
        category_id: 'c0000000-0000-0000-0000-000000000001',
        is_active: true,
        is_featured: true,
        created_at: '2026-10-09T00:00:00Z',
        updated_at: '2026-10-09T00:00:00Z',
      };

      const enriched = enrichProductWithRealImage(dbRecordWithoutCode);
      expect(enriched.image_url).toBe(PRODUCT_REAL_IMAGES['PRD03']);
    });

    it('should retain current fallback image when product_code and slug are both unknown', () => {
      const customProduct = {
        id: 'custom-id-999',
        product_code: 'PRD_UNKNOWN',
        name: 'Sản phẩm thử nghiệm',
        slug: 'san-pham-thu-nghiem-unknown',
        price: 500000,
        stock_quantity: 5,
        image_url: '/assets/products/custom-illustration.svg',
        category_id: 'c0000000-0000-0000-0000-000000000001',
        is_active: true,
        is_featured: false,
        created_at: '2026-10-09T00:00:00Z',
        updated_at: '2026-10-09T00:00:00Z',
      };

      const enriched = enrichProductWithRealImage(customProduct);
      expect(enriched.image_url).toBe('/assets/products/custom-illustration.svg');
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
