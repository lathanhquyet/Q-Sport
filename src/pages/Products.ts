import { renderProductCard } from '../components/ProductCard';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';

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
      : `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-48); background: var(--color-mint); border-radius: var(--radius-card); border: 1px dashed var(--color-mint-line);">
          <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-court); margin-bottom: 8px;">Không tìm thấy sản phẩm phù hợp</h3>
          <p style="color: var(--color-muted); font-size: 0.9375rem; margin-bottom: 20px;">Vui lòng thử điều chỉnh từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
          <button onclick="window.handleResetProductFilters()" class="btn btn-primary" style="font-size: 0.875rem;">
            🔄 Xóa tất cả bộ lọc
          </button>
        </div>
      `;

  return `
    <div class="container" style="padding-top: var(--spacing-32); padding-bottom: var(--spacing-48);">
      <!-- Header Title -->
      <div style="margin-bottom: var(--spacing-32); text-align: center;">
        <h1 style="font-family: var(--font-display); font-size: 2.5rem; color: var(--color-court); margin-bottom: var(--spacing-8);">
          DANH SÁCH SẢN PHẨM Q-SPORT
        </h1>
        <p style="color: var(--color-muted); font-size: 1rem;">
          Khám phá dụng cụ cầu lông và phụ kiện thể thao chính hãng (<span id="products-count-badge" style="font-weight: 700; color: var(--color-court);">${products.length}</span> sản phẩm)
        </p>
      </div>

      <!-- Search, Filter & Sort Bar (Auto Filter - No Apply Button Needed) -->
      <div class="card" style="margin-bottom: var(--spacing-32); padding: var(--spacing-20); background: var(--color-mint); border-color: var(--color-mint-line);">
        <form id="filter-form" onsubmit="event.preventDefault(); window.handleAutoProductFilter();" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--spacing-16); align-items: center;">

          <!-- Search Input -->
          <div>
            <label for="search-input" style="font-size: 0.8125rem; font-weight: 700; color: var(--color-court); display: block; margin-bottom: 6px;">🔍 Tìm kiếm sản phẩm</label>
            <input
              id="search-input"
              type="text"
              placeholder="Nhập tên sản phẩm..."
              value="${searchTerm}"
              oninput="window.handleAutoProductFilter()"
              style="width: 100%; padding: 10px 14px; border-radius: var(--radius-control); border: 1.5px solid var(--color-mint-line); font-family: inherit; font-size: 0.9375rem; background: var(--color-white);"
            />
          </div>

          <!-- Category Select -->
          <div>
            <label for="category-select" style="font-size: 0.8125rem; font-weight: 700; color: var(--color-court); display: block; margin-bottom: 6px;">🏸 Danh mục</label>
            <select
              id="category-select"
              onchange="window.handleAutoProductFilter()"
              style="width: 100%; padding: 10px 14px; border-radius: var(--radius-control); border: 1.5px solid var(--color-mint-line); font-family: inherit; font-size: 0.9375rem; background: var(--color-white); cursor: pointer;"
            >
              <option value="all" ${categorySlug === 'all' ? 'selected' : ''}>Tất cả danh mục</option>
              ${categoryOptionsHtml}
            </select>
          </div>

          <!-- Sort Select -->
          <div>
            <label for="sort-select" style="font-size: 0.8125rem; font-weight: 700; color: var(--color-court); display: block; margin-bottom: 6px;">⚡ Sắp xếp theo</label>
            <select
              id="sort-select"
              onchange="window.handleAutoProductFilter()"
              style="width: 100%; padding: 10px 14px; border-radius: var(--radius-control); border: 1.5px solid var(--color-mint-line); font-family: inherit; font-size: 0.9375rem; background: var(--color-white); cursor: pointer;"
            >
              <option value="newest" ${sortOption === 'newest' ? 'selected' : ''}>Mới nhất</option>
              <option value="price-asc" ${sortOption === 'price-asc' ? 'selected' : ''}>Giá: Thấp đến Cao</option>
              <option value="price-desc" ${sortOption === 'price-desc' ? 'selected' : ''}>Giá: Cao đến Thấp</option>
            </select>
          </div>
        </form>
      </div>

      <!-- Products Grid Container -->
      <div id="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--spacing-24);">
        ${productsGridHtml}
      </div>
    </div>
  `;
}
