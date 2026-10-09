import { Product, Category } from '../types';
import { generateNextProductCode } from './adminProductService';

export interface CSVProductRow {
  product_code?: string;
  name: string;
  category_id: string;
  price: number;
  stock_quantity: number;
  short_description?: string;
  description?: string;
  image_url?: string;
}

export interface ImportRowError {
  row: number;
  data: Partial<CSVProductRow>;
  reason: string;
}

export interface ImportReport {
  totalRows: number;
  successCount: number;
  failureCount: number;
  errors: ImportRowError[];
  importedProducts: Product[];
}

/**
 * Parses and imports products from a CSV string or array of product objects.
 * Validates PRDxx code format if present, or auto-generates next unique PRDxx code if omitted.
 */
export function importProductsData(
  rows: CSVProductRow[],
  existingProducts: Product[],
  categories: Category[]
): ImportReport {
  const report: ImportReport = {
    totalRows: rows.length,
    successCount: 0,
    failureCount: 0,
    errors: [],
    importedProducts: [],
  };

  const currentProductsPool = [...existingProducts];
  const validCategoryIds = new Set(categories.map(c => c.id));
  const validCategorySlugs = new Set(categories.map(c => c.slug));

  rows.forEach((row, index) => {
    const rowNum = index + 1;

    // Validate required fields
    if (!row.name || !row.name.trim()) {
      report.failureCount++;
      report.errors.push({ row: rowNum, data: row, reason: 'Tên sản phẩm không được để trống' });
      return;
    }

    if (!row.category_id || (!validCategoryIds.has(row.category_id) && !validCategorySlugs.has(row.category_id))) {
      report.failureCount++;
      report.errors.push({ row: rowNum, data: row, reason: `Category ID/slug "${row.category_id}" không tồn tại` });
      return;
    }

    if (isNaN(row.price) || row.price < 0) {
      report.failureCount++;
      report.errors.push({ row: rowNum, data: row, reason: 'Giá sản phẩm không hợp lệ (phải >= 0)' });
      return;
    }

    if (isNaN(row.stock_quantity) || row.stock_quantity < 0) {
      report.failureCount++;
      report.errors.push({ row: rowNum, data: row, reason: 'Tồn kho sản phẩm không hợp lệ (phải >= 0)' });
      return;
    }

    // Resolve code
    let finalCode = row.product_code?.trim();

    if (finalCode) {
      // Validate custom code format
      if (!/^PRD\d{2}$/.test(finalCode)) {
        report.failureCount++;
        report.errors.push({
          row: rowNum,
          data: row,
          reason: `Mã sản phẩm "${finalCode}" sai định dạng. Yêu cầu định dạng PRDxx (ví dụ: PRD01)`,
        });
        return;
      }

      // Check duplicate against current pool
      const isDuplicate = currentProductsPool.some(p => p.product_code === finalCode);
      if (isDuplicate) {
        report.failureCount++;
        report.errors.push({
          row: rowNum,
          data: row,
          reason: `Mã sản phẩm "${finalCode}" đã tồn tại trong hệ thống`,
        });
        return;
      }
    } else {
      // Auto-generate next code
      try {
        finalCode = generateNextProductCode(currentProductsPool);
      } catch (err) {
        report.failureCount++;
        report.errors.push({
          row: rowNum,
          data: row,
          reason: (err as Error).message || 'Không thể tự sinh mã sản phẩm mới',
        });
        return;
      }
    }

    // Resolve Category ID if passed as slug
    const resolvedCatId = validCategoryIds.has(row.category_id)
      ? row.category_id
      : categories.find(c => c.slug === row.category_id)?.id || row.category_id;

    const cleanName = row.name.trim();
    const slug = `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newProduct: Product = {
      id: `a0000000-0000-0000-0000-${(currentProductsPool.length + 1).toString(16).padStart(12, '0')}`,
      product_code: finalCode,
      category_id: resolvedCatId,
      name: cleanName,
      slug,
      price: Math.floor(row.price),
      stock_quantity: Math.floor(row.stock_quantity),
      short_description: row.short_description?.trim() || undefined,
      description: row.description?.trim() || undefined,
      image_url: row.image_url?.trim() || '/assets/products/placeholder.svg',
      is_active: true,
      is_featured: false,
      created_at: now,
      updated_at: now,
    };

    currentProductsPool.push(newProduct);
    report.importedProducts.push(newProduct);
    report.successCount++;
  });

  return report;
}
