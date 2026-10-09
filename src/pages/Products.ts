import { renderProductCard } from '../components/ProductCard';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { renderEmptyState } from '../components/StateViews';

export async function renderProductsPage(queryParams: URLSearchParams): Promise<string> {
  const categorySlug = queryParams.get('category') || 'all';
  const searchTerm = queryParams.get('search') || '';
  const sortOption = (queryParams.get('sort') as 'newest' | 'price-asc' | 'price-desc') || 'newest';

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug, search: searchTerm, sort: sortOption }),
  ]);

  const categoryOptionsHtml = categories
    .map(
      cat => `
      <option value="${cat.slug}" ${categorySlug === cat.slug ? 'selected' : ''}>
        ${cat.name}
      </option>
    `
    )
    .join('');

  const productsGridHtml =
    products.length > 0
      ? products.map(p => renderProductCard(p)).join('')
      : renderEmptyState('Chưa có sản phẩm nào phù hợp với bộ lọc.', 'Xem tất cả sản phẩm', '/products');

  return `
    <div class="container" style="padding-top: var(--spacing-32);">
      <!-- Header Title -->
      <div style="margin-bottom: var(--spacing-32); text-align: center;">
        <h1 style="font-family: var(--font-display); font-size: 2.5rem; color: var(--color-court); margin-bottom: var(--spacing-8);">
          DANH SÁCH SẢN PHẨM Q-SPORT
        </h1>
        <p style="color: var(--color-muted); font-size: 1rem;">
          Khám phá dụng cụ cầu lông và phụ kiện thể thao chính hãng
        </p>
      </div>

      <!-- Search, Filter & Sort Bar -->
      <div class="card" style="margin-bottom: var(--spacing-32); padding: var(--spacing-16); background: var(--color-mint); border-color: var(--color-mint-line);">
        <form id="filter-form" onsubmit="event.preventDefault(); window.applyProductFilters();" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-16); align-items: center;">

          <!-- Search Input -->
          <div>
            <label for="search-input" style="font-size: 0.8125rem; font-weight: 600; color: var(--color-court); display: block; margin-bottom: 4px;">Tìm kiếm sản phẩm</label>
            <input
              id="search-input"
              type="text"
              placeholder="Nhập tên sản phẩm..."
              value="${searchTerm}"
              style="width: 100%; padding: 8px 12px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line); font-family: inherit; font-size: 0.875rem;"
            />
          </div>

          <!-- Category Select -->
          <div>
            <label for="category-select" style="font-size: 0.8125rem; font-weight: 600; color: var(--color-court); display: block; margin-bottom: 4px;">Danh mục</label>
            <select
              id="category-select"
              onchange="window.applyProductFilters()"
              style="width: 100%; padding: 8px 12px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line); font-family: inherit; font-size: 0.875rem; background: var(--color-white);"
            >
              <option value="all" ${categorySlug === 'all' ? 'selected' : ''}>Tất cả danh mục</option>
              ${categoryOptionsHtml}
            </select>
          </div>

          <!-- Sort Select -->
          <div>
            <label for="sort-select" style="font-size: 0.8125rem; font-weight: 600; color: var(--color-court); display: block; margin-bottom: 4px;">Sắp xếp theo</label>
            <select
              id="sort-select"
              onchange="window.applyProductFilters()"
              style="width: 100%; padding: 8px 12px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line); font-family: inherit; font-size: 0.875rem; background: var(--color-white);"
            >
              <option value="newest" ${sortOption === 'newest' ? 'selected' : ''}>Mới nhất</option>
              <option value="price-asc" ${sortOption === 'price-asc' ? 'selected' : ''}>Giá: Thấp đến Cao</option>
              <option value="price-desc" ${sortOption === 'price-desc' ? 'selected' : ''}>Giá: Cao đến Thấp</option>
            </select>
          </div>

          <!-- Action Button -->
          <div style="align-self: end;">
            <button type="submit" class="btn btn-primary" style="width: 100%; min-height: 38px; font-size: 0.875rem;">
              Áp dụng bộ lọc
            </button>
          </div>
        </form>
      </div>

      <!-- Products Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--spacing-24);">
        ${productsGridHtml}
      </div>
    </div>
  `;
}
