import { Product } from '../types';
import { formatVND } from '../utils/formatters';
import { getProductLocalImage } from '../config/productImages';

export function renderProductCard(product: Product): string {
  const isOutOfStock = product.stock_quantity <= 0;
  const displayImage =
    getProductLocalImage(product.product_code || product.slug) ||
    product.image_url ||
    '/assets/products/placeholder.svg';

  const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;

  const colorsHtml = hasColors
    ? `
      <div class="quick-add-selector quick-colors" style="margin-bottom: 6px;">
        <span style="font-size: 0.75rem; font-weight: 600; color: var(--color-muted); display: block; margin-bottom: 4px;">Màu sắc:</span>
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          ${product.colors!
            .map(
              (c, i) => `
            <button
              type="button"
              class="quick-variant-chip ${i === 0 ? 'active' : ''}"
              data-product-id="${product.id}"
              data-variant-type="color"
              data-variant-value="${c}"
              onclick="window.selectQuickVariant('${product.id}', 'color', '${c}', this)"
              style="padding: 2px 8px; font-size: 0.75rem; border: 1px solid var(--color-mint-line); border-radius: var(--radius-control); background: ${
                i === 0 ? 'var(--color-court)' : 'var(--color-white)'
              }; color: ${i === 0 ? '#fff' : 'var(--color-ink)'}; cursor: pointer;"
            >
              ${c}
            </button>
          `
            )
            .join('')}
        </div>
      </div>
    `
    : '';

  const sizesHtml = hasSizes
    ? `
      <div class="quick-add-selector quick-sizes" style="margin-bottom: 6px;">
        <span style="font-size: 0.75rem; font-weight: 600; color: var(--color-muted); display: block; margin-bottom: 4px;">Size:</span>
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          ${product.sizes!
            .map(
              (s, i) => `
            <button
              type="button"
              class="quick-variant-chip ${i === 0 ? 'active' : ''}"
              data-product-id="${product.id}"
              data-variant-type="size"
              data-variant-value="${s}"
              onclick="window.selectQuickVariant('${product.id}', 'size', '${s}', this)"
              style="padding: 2px 8px; font-size: 0.75rem; border: 1px solid var(--color-mint-line); border-radius: var(--radius-control); background: ${
                i === 0 ? 'var(--color-court)' : 'var(--color-white)'
              }; color: ${i === 0 ? '#fff' : 'var(--color-ink)'}; cursor: pointer;"
            >
              ${s}
            </button>
          `
            )
            .join('')}
        </div>
      </div>
    `
    : '';

  return `
    <div
      class="card product-card"
      id="product-card-${product.id}"
      data-product-id="${product.id}"
      data-product-name="${product.name}"
      data-product-price="${product.price}"
      data-product-image="${displayImage}"
      data-product-stock="${product.stock_quantity}"
      data-product-slug="${product.slug}"
      style="display: flex; flex-direction: column; justify-content: space-between; position: relative; height: 100%; padding: var(--spacing-16); transition: transform var(--transition-fast), box-shadow var(--transition-fast);"
    >
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
        <a href="/products/${product.slug}" data-link class="product-image-box">
          <img
            src="${displayImage}"
            alt="${product.name}"
            loading="lazy"
            onerror="this.onerror=null; this.src='/assets/products/placeholder.svg';"
            style="width: 100%; height: 100%; object-fit: contain; display: block; border-radius: 8px;"
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

        ${colorsHtml}
        ${sizesHtml}

        <div class="quick-add-actions" style="margin-top: 4px;">
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; border: 1px solid var(--color-mint-line); border-radius: var(--radius-control); background: var(--color-white); overflow: hidden;">
              <button
                type="button"
                onclick="window.changeQuickAddQty('${product.id}', -1)"
                ${isOutOfStock ? 'disabled' : ''}
                style="border: none; background: transparent; padding: 6px 10px; font-weight: 700; cursor: pointer; color: var(--color-ink);"
                aria-label="Giảm số lượng"
              >-</button>
              <input
                id="quick-qty-${product.id}"
                type="number"
                value="1"
                min="1"
                max="${product.stock_quantity || 1}"
                readonly
                style="width: 36px; text-align: center; border: none; font-weight: 600; font-size: 0.875rem; background: transparent;"
                aria-label="Số lượng"
              />
              <button
                type="button"
                onclick="window.changeQuickAddQty('${product.id}', 1)"
                ${isOutOfStock ? 'disabled' : ''}
                style="border: none; background: transparent; padding: 6px 10px; font-weight: 700; cursor: pointer; color: var(--color-ink);"
                aria-label="Tăng số lượng"
              >+</button>
            </div>

            <button
              type="button"
              id="quick-add-btn-${product.id}"
              onclick="window.handleQuickAddToCart('${product.id}', this)"
              class="btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'}"
              style="flex: 1; min-height: 38px; font-size: 0.8125rem; padding: 6px 10px;"
              ${isOutOfStock ? 'disabled' : ''}
            >
              ${isOutOfStock ? 'Tạm hết hàng' : '🛒 Thêm vào giỏ'}
            </button>
          </div>

          <div id="quick-add-feedback-${product.id}" style="display: none; font-size: 0.75rem; font-weight: 600; color: var(--color-court); margin-bottom: 6px; text-align: center;"></div>

          <a href="/products/${product.slug}" data-link class="btn btn-secondary" style="width: 100%; font-size: 0.8125rem; min-height: 36px; padding: 6px; display: block; text-align: center;">
            Xem chi tiết
          </a>
        </div>
      </div>
    </div>
  `;
}
