import { getProductBySlug } from '../services/productService';
import { getProductComments } from '../services/commentService';
import { formatVND, formatDateTime } from '../utils/formatters';
import { renderErrorState } from '../components/StateViews';

export async function renderProductDetailPage(slug: string): Promise<string> {
  const product = await getProductBySlug(slug);

  if (!product) {
    return `
      <div class="container" style="padding-top: var(--spacing-48);">
        ${renderErrorState('Sản phẩm không tồn tại hoặc đã bị ẩn.', "window.location.href='/products'")}
      </div>
    `;
  }

  const comments = await getProductComments(product.id);
  const isOutOfStock = product.stock_quantity <= 0;

  const commentsListHtml =
    comments.length > 0
      ? comments
          .map(
            cmt => `
        <div style="border-bottom: 1px solid var(--color-mint-line); padding: var(--spacing-16) 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="color: var(--color-court); font-size: 0.9375rem;">${cmt.display_name}</strong>
            <span style="font-size: 0.75rem; color: var(--color-muted);">${formatDateTime(cmt.created_at)}</span>
          </div>
          <p style="font-size: 0.875rem; color: var(--color-ink); line-height: 1.5;">${cmt.content}</p>
        </div>
      `
          )
          .join('')
      : `<p style="color: var(--color-muted); font-size: 0.875rem; padding: var(--spacing-16) 0;">Chưa có bình luận nào được duyệt cho sản phẩm này. Hãy là người đầu tiên để lại ý kiến!</p>`;

  return `
    <div class="container" style="padding-top: var(--spacing-32);">
      <!-- Breadcrumb -->
      <nav style="font-size: 0.875rem; color: var(--color-muted); margin-bottom: var(--spacing-24);">
        <a href="/" data-link>Trang chủ</a> &gt;
        <a href="/products" data-link>Sản phẩm</a> &gt;
        <span style="color: var(--color-ink); font-weight: 500;">${product.name}</span>
      </nav>

      <!-- Main Detail Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-48); margin-bottom: var(--spacing-48);">

        <!-- Product Image -->
        <div class="card" style="padding: var(--spacing-16); background: var(--color-mint); text-align: center;">
          <img
            src="${product.image_url || '/assets/products/placeholder.svg'}"
            alt="${product.name}"
            style="width: 100%; max-height: 440px; object-fit: contain; border-radius: var(--radius-image);"
            onerror="this.onerror=null; this.src='/assets/products/placeholder.svg';"
          />
        </div>

        <!-- Product Info & Actions -->
        <div>
          ${
            product.is_featured
              ? `<span style="background: var(--color-cork); color: var(--color-ink); font-size: 0.75rem; font-weight: 700; padding: 2px 10px; border-radius: var(--radius-pill);">Sản phẩm nổi bật</span>`
              : ''
          }
          <h1 style="font-family: var(--font-body); font-size: 1.875rem; font-weight: 700; color: var(--color-ink); margin: var(--spacing-8) 0 var(--spacing-12) 0;">
            ${product.name}
          </h1>

          ${product.sku ? `<p style="font-size: 0.8125rem; color: var(--color-muted); margin-bottom: var(--spacing-12);">Mã SKU: <strong>${product.sku}</strong></p>` : ''}

          <div style="display: flex; align-items: baseline; gap: var(--spacing-16); margin-bottom: var(--spacing-16);">
            <span class="price-tag" style="font-size: 2.25rem;">${formatVND(product.price)}</span>
            <span style="font-size: 0.875rem; padding: 2px 10px; border-radius: var(--radius-pill); font-weight: 600; background: ${isOutOfStock ? '#fee2e2' : '#dcfce7'}; color: ${isOutOfStock ? 'var(--color-danger)' : 'var(--color-court)'};">
              ${isOutOfStock ? 'Hết hàng' : `Còn hàng (Tồn kho: ${product.stock_quantity})`}
            </span>
          </div>

          <p style="color: var(--color-ink); line-height: 1.6; margin-bottom: var(--spacing-24);">
            ${product.short_description || ''}
          </p>

          <!-- Add to Cart Form -->
          <div class="card" style="padding: var(--spacing-20); background: var(--color-mint); border-color: var(--color-mint-line); margin-bottom: var(--spacing-24);">
            <div style="display: flex; gap: var(--spacing-16); align-items: center; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; border: 1px solid var(--color-mint-line); border-radius: var(--radius-control); background: var(--color-white);">
                <button type="button" onclick="window.changeDetailQty(-1)" style="padding: 8px 14px; font-weight: 700; font-size: 1.125rem;" ${isOutOfStock ? 'disabled' : ''}>-</button>
                <input id="detail-qty-input" type="number" value="1" min="1" max="${product.stock_quantity || 1}" readonly style="width: 48px; text-align: center; border: none; font-weight: 600; font-size: 1rem; background: transparent;" />
                <button type="button" onclick="window.changeDetailQty(1)" style="padding: 8px 14px; font-weight: 700; font-size: 1.125rem;" ${isOutOfStock ? 'disabled' : ''}>+</button>
              </div>

              <button
                type="button"
                id="add-to-cart-btn"
                onclick="window.addToCartFromDetail('${product.id}', '${product.name}', ${product.price}, '${product.image_url || ''}')"
                class="btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'}"
                style="flex: 1; min-height: 44px;"
                ${isOutOfStock ? 'disabled' : ''}
              >
                ${isOutOfStock ? 'Sản phẩm tạm hết hàng' : '🛒 Thêm vào giỏ hàng'}
              </button>
            </div>
            <div id="cart-add-feedback" style="margin-top: 8px; font-size: 0.875rem; font-weight: 600; color: var(--color-court); display: none;"></div>
          </div>
        </div>
      </div>

      <!-- Long Description -->
      <div class="card" style="margin-bottom: var(--spacing-48); padding: var(--spacing-32);">
        <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-court); margin-bottom: var(--spacing-16); border-bottom: 2px solid var(--color-mint-line); padding-bottom: 8px;">
          MÔ TẢ CHI TIẾT SẢN PHẨM
        </h2>
        <div style="line-height: 1.7; color: var(--color-ink);">
          <p>${product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}</p>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="card" style="padding: var(--spacing-32);">
        <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-court); margin-bottom: var(--spacing-16); border-bottom: 2px solid var(--color-mint-line); padding-bottom: 8px;">
          BÌNH LUẬN & ĐÁNH GIÁ SẢN PHẨM
        </h2>

        <!-- Approved Comments List -->
        <div style="margin-bottom: var(--spacing-32);">
          ${commentsListHtml}
        </div>

        <!-- Submit Comment Form -->
        <div style="background: var(--color-mint); padding: var(--spacing-20); border-radius: var(--radius-card); border: 1px solid var(--color-mint-line);">
          <h3 style="font-size: 1.125rem; font-weight: 600; color: var(--color-court); margin-bottom: var(--spacing-12);">Gửi bình luận của bạn</h3>
          <form id="comment-form" onsubmit="event.preventDefault(); window.handleCommentSubmit('${product.id}');">
            <div style="margin-bottom: var(--spacing-12);">
              <label for="comment-name" style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--color-ink); margin-bottom: 4px;">Tên hiển thị</label>
              <input id="comment-name" type="text" placeholder="Nhập tên của bạn (hoặc để trống là Khách hàng)" style="width: 100%; padding: 8px 12px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line); font-size: 0.875rem;" />
            </div>

            <div style="margin-bottom: var(--spacing-12);">
              <label for="comment-content" style="display: block; font-size: 0.8125rem; font-weight: 600; color: var(--color-ink); margin-bottom: 4px;">Nội dung bình luận (*)</label>
              <textarea id="comment-content" rows="3" required placeholder="Nhập cảm nhận của bạn về sản phẩm..." style="width: 100%; padding: 8px 12px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line); font-size: 0.875rem; font-family: inherit;"></textarea>
            </div>

            <div id="comment-feedback" style="margin-bottom: var(--spacing-12); font-size: 0.875rem; font-weight: 600; display: none;"></div>

            <button type="submit" class="btn btn-primary" style="min-height: 40px; font-size: 0.875rem;">
              Gửi bình luận
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}
