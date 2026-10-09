import { getCart, getCartSubtotal } from '../services/cartService';
import { formatVND } from '../utils/formatters';
import { renderEmptyState } from '../components/StateViews';

export function renderCheckoutPage(): string {
  const cart = getCart();

  if (cart.length === 0) {
    return `
      <div class="container" style="padding-top: var(--spacing-32);">
        ${renderEmptyState('Giỏ hàng của bạn đang trống. Chọn sản phẩm trước khi tiến hành checkout.', 'Xem danh sách sản phẩm 🏸', '/products')}
      </div>
    `;
  }

  const subtotal = getCartSubtotal();

  const summaryListHtml = cart
    .map(
      item => `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--color-mint-line); padding: 10px 0; font-size: 0.875rem;">
        <div>
          <strong style="color: var(--color-ink); display: block;">${item.name}</strong>
          <span style="color: var(--color-muted); font-size: 0.75rem;">Số lượng: ${item.quantity} x ${formatVND(item.price)}</span>
        </div>
        <span class="price-tag" style="font-size: 1rem;">${formatVND(item.price * item.quantity)}</span>
      </div>
    `
    )
    .join('');

  return `
    <div class="container" style="padding-top: var(--spacing-32);">
      <!-- Header -->
      <div style="margin-bottom: var(--spacing-32); text-align: center;">
        <h1 style="font-family: var(--font-display); font-size: 2.25rem; color: var(--color-court); margin-bottom: var(--spacing-8);">
          XÁC NHẬN ĐẶT HÀNG & THANH TOÁN (COD)
        </h1>
        <p style="color: var(--color-muted); font-size: 0.9375rem;">
          Vui lòng nhập đầy đủ thông tin nhận hàng để Q-Sport giao hàng tận nơi
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-32); align-items: start;">
        <!-- Left Column: Checkout Form -->
        <div class="card" style="padding: var(--spacing-24);">
          <h2 style="font-family: var(--font-display); font-size: 1.375rem; color: var(--color-court); margin-bottom: var(--spacing-20); border-bottom: 2px solid var(--color-mint-line); padding-bottom: 8px;">
            THÔNG TIN NGƯỜI NHẬN HÀNG
          </h2>

          <form id="checkout-form" onsubmit="event.preventDefault(); window.handleCheckoutSubmit();">
            <div style="margin-bottom: var(--spacing-16);">
              <label for="checkout-name" style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-ink); margin-bottom: 6px;">Họ và tên người nhận (*)</label>
              <input id="checkout-name" type="text" required placeholder="Ví dụ: Nguyễn Văn A" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line); font-size: 0.9375rem; font-family: inherit;" />
            </div>

            <div style="margin-bottom: var(--spacing-16);">
              <label for="checkout-phone" style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-ink); margin-bottom: 6px;">Số điện thoại liên hệ (*)</label>
              <input id="checkout-phone" type="tel" required placeholder="Ví dụ: 0987654321 (10 chữ số)" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line); font-size: 0.9375rem; font-family: inherit;" />
              <span style="font-size: 0.75rem; color: var(--color-muted); display: block; margin-top: 4px;">Q-Sport sẽ gọi số điện thoại này để xác nhận giao hàng.</span>
            </div>

            <div style="margin-bottom: var(--spacing-16);">
              <label for="checkout-address" style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-ink); margin-bottom: 6px;">Địa chỉ nhận hàng chi tiết (*)</label>
              <textarea id="checkout-address" rows="3" required placeholder="Ví dụ: Số 123 Đường Cầu Lông, Phường Thể Thao, Quận 1, TP. Hồ Chí Minh" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line); font-size: 0.9375rem; font-family: inherit;"></textarea>
            </div>

            <div style="margin-bottom: var(--spacing-20);">
              <label for="checkout-note" style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-ink); margin-bottom: 6px;">Ghi chú đơn hàng (Tùy chọn)</label>
              <input id="checkout-note" type="text" placeholder="Ví dụ: Giao ngoài giờ hành chính hoặc gọi trước khi giao" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line); font-size: 0.9375rem; font-family: inherit;" />
            </div>

            <!-- Error Feedback Box -->
            <div id="checkout-error-box" style="display: none; padding: 12px; border-radius: var(--radius-control); background: #fef2f2; border: 1px solid var(--color-danger); color: var(--color-danger); font-size: 0.875rem; margin-bottom: var(--spacing-16);"></div>

            <button type="submit" id="submit-order-btn" class="btn btn-primary" style="width: 100%; min-height: 48px; font-size: 1.0625rem;">
              🚀 Xác nhận đặt hàng COD
            </button>
          </form>
        </div>

        <!-- Right Column: Order Summary & Payment Badge -->
        <div class="card" style="padding: var(--spacing-24); background: var(--color-mint); border-color: var(--color-mint-line); position: sticky; top: 90px;">
          <h2 style="font-family: var(--font-display); font-size: 1.375rem; color: var(--color-court); margin-bottom: var(--spacing-16); border-bottom: 1px solid var(--color-mint-line); padding-bottom: 8px;">
            ĐƠN HÀNG CỦA BẠN (${cart.length} sản phẩm)
          </h2>

          <div style="margin-bottom: var(--spacing-16);">
            ${summaryListHtml}
          </div>

          <!-- Payment Method Card -->
          <div style="background: var(--color-white); border: 1.5px solid var(--color-court); border-radius: var(--radius-control); padding: 14px; margin-bottom: var(--spacing-20);">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.5rem;">💵</span>
              <div>
                <strong style="color: var(--color-court); font-size: 0.9375rem; display: block;">Thanh toán COD (Tiền mặt khi nhận hàng)</strong>
                <span style="font-size: 0.75rem; color: var(--color-muted);">Khách hàng kiểm tra hàng và thanh toán trực tiếp cho shipper.</span>
              </div>
            </div>
          </div>

          <div style="border-top: 2px solid var(--color-mint-line); padding-top: 16px; display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-weight: 700; font-size: 1.125rem; color: var(--color-ink);">Tổng thanh toán:</span>
            <span class="price-tag" style="font-size: 1.75rem;">${formatVND(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
