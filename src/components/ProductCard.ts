import { Product } from '../types';
import { formatVND } from '../utils/formatters';

export function renderProductCard(product: Product): string {
  const isOutOfStock = product.stock_quantity <= 0;

  return `
    <div class="card product-card" style="display: flex; flex-direction: column; justify-content: space-between; position: relative; height: 100%; padding: var(--spacing-16); transition: transform var(--transition-fast), box-shadow var(--transition-fast);">
      ${
        product.is_featured
          ? `<span style="position: absolute; top: var(--spacing-24); left: var(--spacing-24); background: var(--color-cork); color: var(--color-ink); font-size: 0.75rem; font-weight: 700; padding: 2px 10px; border-radius: var(--radius-pill); z-index: 2;">Nổi bật</span>`
          : ''
      }
      ${
        isOutOfStock
          ? `<span style="position: absolute; top: var(--spacing-24); right: var(--spacing-24); background: var(--color-danger); color: var(--color-white); font-size: 0.75rem; font-weight: 700; padding: 2px 10px; border-radius: var(--radius-pill); z-index: 2;">Hết hàng</span>`
          : ''
      }

      <div>
        <a href="/products/${product.slug}" data-link style="display: block; background: var(--color-mint); border-radius: var(--radius-image); overflow: hidden; aspect-ratio: 1 / 1; margin-bottom: var(--spacing-12); text-align: center; position: relative;">
          <img
            src="${product.image_url || '/assets/products/placeholder.jpg'}"
            alt="${product.name}"
            loading="lazy"
            onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\'><rect width=\'200\' height=\'200\' fill=\'%23EAF7EF\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%231F6B4A\' font-size=\'14\' font-family=\'sans-serif\'>Q-Sport Product</text></svg>'"
            style="width: 100%; height: 100%; object-fit: cover; display: block;"
          />
        </a>

        <h3 style="font-size: 1rem; font-weight: 600; line-height: 1.4; margin-bottom: var(--spacing-8); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 2.8em;">
          <a href="/products/${product.slug}" data-link style="color: var(--color-ink);">
            ${product.name}
          </a>
        </h3>

        ${
          product.short_description
            ? `<p style="font-size: 0.8125rem; color: var(--color-muted); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: var(--spacing-12);">${product.short_description}</p>`
            : ''
        }
      </div>

      <div>
        <div style="margin-bottom: var(--spacing-12); display: flex; align-items: baseline; justify-content: space-between;">
          <span class="price-tag" style="font-size: 1.375rem;">${formatVND(product.price)}</span>
          ${
            product.sale_price
              ? `<span style="text-decoration: line-through; color: var(--color-muted); font-size: 0.875rem;">${formatVND(product.sale_price)}</span>`
              : ''
          }
        </div>

        <a href="/products/${product.slug}" data-link class="btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'}" style="width: 100%; font-size: 0.875rem; min-height: 40px; padding: 6px;">
          ${isOutOfStock ? 'Xem chi tiết' : 'Xem chi tiết'}
        </a>
      </div>
    </div>
  `;
}
