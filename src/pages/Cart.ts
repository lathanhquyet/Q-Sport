import { getCart, getCartSubtotal } from '../services/cartService';
import { formatVND } from '../utils/formatters';
import { renderEmptyState } from '../components/StateViews';

export function renderCartPage(): string {
  const cart = getCart();

  if (cart.length === 0) {
    return `
      <div class="container" style="padding-top: var(--spacing-32);">
        ${renderEmptyState('Giỏ hàng của bạn đang trống. Chọn sản phẩm để bắt đầu mua sắm.', 'Xem danh sách sản phẩm 🏸', '/products')}
      </div>
    `;
  }

  const subtotal = getCartSubtotal();

  const itemsTableHtml = cart
    .map(
      item => `
      <tr style="border-bottom: 1px solid var(--color-mint-line);">
        <td style="padding: var(--spacing-16) 0;">
          <div style="display: flex; gap: var(--spacing-16); align-items: center;">
            <img src="${item.image_url || '/assets/products/placeholder.jpg'}" alt="${item.name}" style="width: 72px; height: 72px; object-fit: cover; border-radius: var(--radius-image); background: var(--color-mint);" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'><rect width=\'100\' height=\'100\' fill=\'%23EAF7EF\'/></svg>'" />
            <div>
              <a href="/products/${item.slug || ''}" data-link style="font-weight: 600; color: var(--color-ink); display: block; margin-bottom: 4px;">${item.name}</a>
              <span style="font-size: 0.8125rem; color: var(--color-muted);">Đơn giá: ${formatVND(item.price)}</span>
            </div>
          </div>
        </td>

        <td style="padding: var(--spacing-16); text-align: center;">
          <div style="display: inline-flex; align-items: center; border: 1px solid var(--color-mint-line); border-radius: var(--radius-control); background: var(--color-white);">
            <button type="button" onclick="window.handleCartQtyChange('${item.product_id}', ${item.quantity - 1})" style="padding: 4px 10px; font-weight: 700;">-</button>
            <span style="padding: 0 10px; font-weight: 600; font-size: 0.875rem;">${item.quantity}</span>
            <button type="button" onclick="window.handleCartQtyChange('${item.product_id}', ${item.quantity + 1})" style="padding: 4px 10px; font-weight: 700;">+</button>
          </div>
        </td>

        <td style="padding: var(--spacing-16); text-align: right;">
          <span class="price-tag" style="font-size: 1.125rem;">${formatVND(item.price * item.quantity)}</span>
        </td>

        <td style="padding: var(--spacing-16); text-align: right;">
          <button type="button" onclick="window.handleRemoveCartItem('${item.product_id}')" title="Xóa mặt hàng" style="color: var(--color-danger); font-size: 1.125rem; padding: 4px 8px; border-radius: var(--radius-control);">
            🗑️
          </button>
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <div class="container" style="padding-top: var(--spacing-32);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-24);">
        <h1 style="font-family: var(--font-display); font-size: 2.25rem; color: var(--color-court);">
          GIỎ HÀNG CỦA BẠN (${cart.length} mặt hàng)
        </h1>
        <button type="button" onclick="window.handleClearAllCart()" class="btn btn-secondary" style="font-size: 0.8125rem; min-height: 36px;">
          Xóa toàn bộ giỏ hàng
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-32); align-items: start;">
        <!-- Cart Items List -->
        <div class="card" style="padding: var(--spacing-20);">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid var(--color-mint-line); text-align: left; font-size: 0.8125rem; color: var(--color-muted); text-transform: uppercase;">
                <th style="padding-bottom: 12px;">Sản phẩm</th>
                <th style="padding-bottom: 12px; text-align: center;">Số lượng</th>
                <th style="padding-bottom: 12px; text-align: right;">Thành tiền</th>
                <th style="padding-bottom: 12px; text-align: right;">Xóa</th>
              </tr>
            </thead>
            <tbody>
              ${itemsTableHtml}
            </tbody>
          </table>
        </div>

        <!-- Summary Box -->
        <div class="card" style="padding: var(--spacing-24); background: var(--color-mint); border-color: var(--color-mint-line); position: sticky; top: 90px;">
          <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-court); margin-bottom: var(--spacing-16); border-bottom: 1px solid var(--color-mint-line); padding-bottom: 8px;">
            TÓM TẮT ĐƠN HÀNG
          </h2>

          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.9375rem;">
            <span style="color: var(--color-muted);">Tạm tính:</span>
            <span style="font-weight: 600; color: var(--color-ink);">${formatVND(subtotal)}</span>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 0.9375rem;">
            <span style="color: var(--color-muted);">Phí vận chuyển:</span>
            <span style="font-weight: 600; color: var(--color-court);">Miễn phí vận chuyển</span>
          </div>

          <div style="border-top: 2px solid var(--color-mint-line); padding-top: 16px; margin-bottom: var(--spacing-24); display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-weight: 700; font-size: 1.125rem; color: var(--color-ink);">Tổng cộng:</span>
            <span class="price-tag" style="font-size: 1.75rem;">${formatVND(subtotal)}</span>
          </div>

          <a href="/checkout" data-link class="btn btn-primary" style="width: 100%; min-height: 48px; font-size: 1.0625rem;">
            Tiến hành đặt hàng (COD) &rarr;
          </a>
        </div>
      </div>
    </div>
  `;
}
