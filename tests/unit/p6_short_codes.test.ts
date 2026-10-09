import { describe, it, expect } from 'vitest';
import { Product } from '../../src/types';
import { DEMO_CATEGORIES } from '../../src/services/categoryService';
import { DEMO_PRODUCTS } from '../../src/services/productService';
import { generateNextProductCode, createProduct } from '../../src/services/adminProductService';
import { importProductsData, CSVProductRow } from '../../src/services/importService';

describe('Phase 6 (P6) Short Code Standardization & Auto-Generation Tests', () => {
  describe('1. Standard 5-Character Code Format Audit', () => {
    it('should ensure all 6 demo categories have valid CATxx category_codes', () => {
      expect(DEMO_CATEGORIES.length).toBe(6);
      DEMO_CATEGORIES.forEach(cat => {
        expect(cat.category_code).toBeDefined();
        expect(cat.category_code).toMatch(/^CAT\d{2}$/);
      });
    });

    it('should ensure all 12 demo products have valid PRDxx product_codes', () => {
      expect(DEMO_PRODUCTS.length).toBe(12);
      DEMO_PRODUCTS.forEach(prod => {
        expect(prod.product_code).toBeDefined();
        expect(prod.product_code).toMatch(/^PRD\d{2}$/);
      });
    });

    it('should verify category_codes and product_codes are unique within demo datasets', () => {
      const catCodes = DEMO_CATEGORIES.map(c => c.category_code);
      const prodCodes = DEMO_PRODUCTS.map(p => p.product_code);

      expect(new Set(catCodes).size).toBe(catCodes.length);
      expect(new Set(prodCodes).size).toBe(prodCodes.length);
    });
  });

  describe('2. Automatic Atomic Code Generation (Mock Logic)', () => {
    it('should generate next unique product code PRD13 after PRD12', () => {
      const nextCode = generateNextProductCode(DEMO_PRODUCTS);
      expect(nextCode).toBe('PRD13');
    });

    it('should auto-assign PRD13 when creating product without supplying product_code', async () => {
      const result = await createProduct({
        name: 'Vợt Cầu Lông Q-Sport Test Auto Code',
        category_id: 'c0000000-0000-0000-0000-000000000002',
        price: 850000,
        stock_quantity: 10,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.product_code).toBe('PRD13');
      expect(result.data?.id).toMatch(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);
    });

    it('should accept custom product_code if provided in valid PRDxx format', async () => {
      const result = await createProduct({
        name: 'Vợt Cầu Lông Custom Code',
        category_id: 'c0000000-0000-0000-0000-000000000002',
        product_code: 'PRD88',
        price: 990000,
        stock_quantity: 5,
      });

      expect(result.success).toBe(true);
      expect(result.data?.product_code).toBe('PRD88');
    });

    it('should reject creation if custom product_code format is invalid', async () => {
      const result = await createProduct({
        name: 'Vợt Cầu Lông Invalid Code',
        category_id: 'c0000000-0000-0000-0000-000000000002',
        product_code: 'PRD1234', // Invalid format
        price: 990000,
        stock_quantity: 5,
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('không đúng định dạng PRDxx');
    });

    it('should throw exception when code space is exhausted (>99 items)', () => {
      const fullProductsPool: Product[] = Array.from({ length: 99 }, (_, i) => ({
        ...DEMO_PRODUCTS[0],
        id: `a0000000-0000-0000-0000-${(i + 1).toString(16).padStart(12, '0')}`,
        product_code: `PRD${(i + 1).toString().padStart(2, '0')}`,
      }));

      expect(() => generateNextProductCode(fullProductsPool)).toThrowError(
        'Đã hết không gian mã sản phẩm khả dụng'
      );
    });
  });

  describe('3. CSV Data Import & Duplicate Handling', () => {
    it('should import CSV rows with auto-generated unique PRDxx codes when omitted', () => {
      const csvRows: CSVProductRow[] = [
        {
          name: 'Áo Tập Lông Q-Sport Import 1',
          category_id: 'c0000000-0000-0000-0000-000000000004',
          price: 180000,
          stock_quantity: 20,
        },
        {
          name: 'Áo Tập Lông Q-Sport Import 2',
          category_id: 'c0000000-0000-0000-0000-000000000004',
          price: 190000,
          stock_quantity: 25,
        },
      ];

      const report = importProductsData(csvRows, DEMO_PRODUCTS, DEMO_CATEGORIES);

      expect(report.successCount).toBe(2);
      expect(report.failureCount).toBe(0);
      expect(report.importedProducts[0].product_code).toBe('PRD13');
      expect(report.importedProducts[1].product_code).toBe('PRD14');
    });

    it('should reject CSV row if product_code already exists in system', () => {
      const csvRows: CSVProductRow[] = [
        {
          product_code: 'PRD01', // Already exists in DEMO_PRODUCTS
          name: 'Sản Phẩm Trùng Mã',
          category_id: 'c0000000-0000-0000-0000-000000000001',
          price: 500000,
          stock_quantity: 10,
        },
      ];

      const report = importProductsData(csvRows, DEMO_PRODUCTS, DEMO_CATEGORIES);

      expect(report.successCount).toBe(0);
      expect(report.failureCount).toBe(1);
      expect(report.errors[0].reason).toContain('đã tồn tại trong hệ thống');
    });

    it('should reject CSV row with invalid category_id or malformed product_code', () => {
      const csvRows: CSVProductRow[] = [
        {
          product_code: 'INVALID_CODE',
          name: 'Sản Phẩm Mã Sai',
          category_id: 'c0000000-0000-0000-0000-000000000001',
          price: 500000,
          stock_quantity: 10,
        },
        {
          product_code: 'PRD99',
          name: 'Sản Phẩm Sai Danh Mục',
          category_id: 'invalid-category-id',
          price: 500000,
          stock_quantity: 10,
        },
      ];

      const report = importProductsData(csvRows, DEMO_PRODUCTS, DEMO_CATEGORIES);

      expect(report.successCount).toBe(0);
      expect(report.failureCount).toBe(2);
      expect(report.errors[0].reason).toContain('sai định dạng');
      expect(report.errors[1].reason).toContain('không tồn tại');
    });
  });

  describe('4. Internal UUID Key Integrity & RPC Backward Compatibility', () => {
    it('should confirm all products still have valid internal UUID primary keys', () => {
      DEMO_PRODUCTS.forEach(product => {
        expect(product.id).toBeDefined();
        // Valid RFC 4122 hex UUID regex
        expect(product.id).toMatch(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);
      });
    });

    it('should confirm category foreign keys reference internal UUIDs rather than short codes', () => {
      DEMO_PRODUCTS.forEach(product => {
        expect(product.category_id).toMatch(/^c0000000-0000-0000-0000-00000000000[1-6]$/);
      });
    });
  });
});
