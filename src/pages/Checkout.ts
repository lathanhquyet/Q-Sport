import { getCart, getCartSubtotal } from '../services/cartService';
import { formatVND } from '../utils/formatters';
import { renderEmptyState } from '../components/StateViews';
import { SITE_CONFIG } from '../config/site';

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
    <div class="container" style="padding-top: var(--spacing-32); padding-bottom: var(--spacing-48);">
      <!-- Header -->
      <div style="margin-bottom: var(--spacing-32); text-align: center;">
        <h1 style="font-family: var(--font-display); font-size: 2.25rem; color: var(--color-court); margin-bottom: var(--spacing-8);">
          XÁC NHẬN ĐẶT HÀNG & THANH TOÁN
        </h1>
        <p style="color: var(--color-muted); font-size: 0.9375rem;">
          Vui lòng chọn phương thức thanh toán và nhập đầy đủ thông tin giao hàng
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
              <span style="font-size: 0.75rem; color: var(--color-muted); display: block; margin-top: 4px;">Q-Sport sẽ gọi số điện thoại này để xác nhận đơn hàng.</span>
            </div>

            <div style="margin-bottom: var(--spacing-16);">
              <label for="checkout-address" style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-ink); margin-bottom: 6px;">Địa chỉ nhận hàng chi tiết (*)</label>
              <textarea id="checkout-address" rows="3" required placeholder="Ví dụ: Số 123 Đường Cầu Lông, Phường Thể Thao, Quận 1, TP. Hồ Chí Minh" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line); font-size: 0.9375rem; font-family: inherit;"></textarea>
            </div>

            <div style="margin-bottom: var(--spacing-20);">
              <label for="checkout-note" style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-ink); margin-bottom: 6px;">Ghi chú đơn hàng (Tùy chọn)</label>
              <input id="checkout-note" type="text" placeholder="Ví dụ: Giao ngoài giờ hành chính hoặc gọi trước khi giao" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line); font-size: 0.9375rem; font-family: inherit;" />
            </div>

            <!-- Payment Method Selection -->
            <div style="margin-bottom: var(--spacing-24);">
              <label style="display: block; font-size: 0.875rem; font-weight: 700; color: var(--color-court); margin-bottom: 10px;">
                PHƯƠNG THỨC THANH TOÁN (*)
              </label>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                <!-- Method 1: COD -->
                <label style="display: flex; align-items: center; gap: 12px; padding: 14px; border: 1.5px solid var(--color-mint-line); border-radius: var(--radius-control); cursor: pointer; background: var(--color-white); transition: border-color 0.2s;" id="label-pay-cod">
                  <input type="radio" name="payment_method" value="COD" checked onchange="window.handlePaymentMethodChange && window.handlePaymentMethodChange('COD')" style="width: 18px; height: 18px; accent-color: var(--color-court);" />
                  <div>
                    <strong style="color: var(--color-ink); font-size: 0.9375rem; display: block;">💵 Thanh toán COD (Tiền mặt khi nhận hàng)</strong>
                    <span style="font-size: 0.75rem; color: var(--color-muted);">Khách hàng kiểm tra hàng và thanh toán trực tiếp cho shipper.</span>
                  </div>
                </label>

                <!-- Method 2: VietQR -->
                <label style="display: flex; align-items: center; gap: 12px; padding: 14px; border: 1.5px solid var(--color-mint-line); border-radius: var(--radius-control); cursor: pointer; background: var(--color-white); transition: border-color 0.2s;" id="label-pay-vietqr">
                  <input type="radio" name="payment_method" value="VIETQR" onchange="window.handlePaymentMethodChange && window.handlePaymentMethodChange('VIETQR')" style="width: 18px; height: 18px; accent-color: var(--color-court);" />
                  <div>
                    <strong style="color: var(--color-court); font-size: 0.9375rem; display: block;">📱 Chuyển khoản VietQR (Mã QR Ngân hàng)</strong>
                    <span style="font-size: 0.75rem; color: var(--color-muted);">Quét mã QR tự động bằng app ngân hàng MB Bank / Napas.</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Error Feedback Box -->
            <div id="checkout-error-box" style="display: none; padding: 12px; border-radius: var(--radius-control); background: #fef2f2; border: 1px solid var(--color-danger); color: var(--color-danger); font-size: 0.875rem; margin-bottom: var(--spacing-16);"></div>

            <button type="submit" id="submit-order-btn" class="btn btn-primary" style="width: 100%; min-height: 48px; font-size: 1.0625rem;">
              🚀 Xác nhận đặt hàng
            </button>
          </form>
        </div>

        <!-- Right Column: Order Summary & Info -->
        <div class="card" style="padding: var(--spacing-24); background: var(--color-mint); border-color: var(--color-mint-line); position: sticky; top: 90px;">
          <h2 style="font-family: var(--font-display); font-size: 1.375rem; color: var(--color-court); margin-bottom: var(--spacing-16); border-bottom: 1px solid var(--color-mint-line); padding-bottom: 8px;">
            ĐƠN HÀNG CỦA BẠN (${cart.length} sản phẩm)
          </h2>

          <div style="margin-bottom: var(--spacing-16);">
            ${summaryListHtml}
          </div>

          <!-- Selected Method Banner -->
          <div id="selected-payment-info-box" style="background: var(--color-white); border: 1.5px solid var(--color-court); border-radius: var(--radius-control); padding: 14px; margin-bottom: var(--spacing-20);">
            <strong style="color: var(--color-court); font-size: 0.875rem; display: block;" id="selected-payment-title">💵 Phương thức: Thanh toán COD</strong>
            <span style="font-size: 0.75rem; color: var(--color-muted);" id="selected-payment-desc">Thanh toán trực tiếp khi nhận hàng.</span>
          </div>

          <div style="border-top: 2px solid var(--color-mint-line); padding-top: 16px; display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-weight: 700; font-size: 1.125rem; color: var(--color-ink);">Tổng thanh toán:</span>
            <span class="price-tag" style="font-size: 1.75rem;">${formatVND(subtotal)}</span>
          </div>
        </div>
      </div>

      <!-- VietQR Payment Modal Panel Container -->
      <div id="vietqr-modal-backdrop" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 1000; align-items: center; justify-content: center; padding: 16px;">
        <div class="card" style="width: 100%; max-width: 520px; padding: var(--spacing-24); background: #fff; text-align: center; max-height: 90vh; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 2px solid var(--color-mint-line); padding-bottom: 8px;">
            <h2 style="font-family: var(--font-display); font-size: 1.375rem; color: var(--color-court); margin: 0;">
              📱 THANH TOÁN CHUYỂN KHOẢN VIETQR
            </h2>
            <button type="button" onclick="window.handleCloseVietQRModal && window.handleCloseVietQRModal()" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">✕</button>
          </div>

          <!-- Order Created Confirmation Badge -->
          <div style="background: #dcfce7; border: 1px solid var(--color-mint-line); border-radius: var(--radius-control); padding: 10px; margin-bottom: 16px;">
            <span style="font-weight: 700; color: var(--color-court); font-size: 0.875rem; display: block;">
              ✓ Đã tạo đơn hàng thành công!
            </span>
            <span style="font-size: 0.75rem; color: var(--color-muted);">Vui lòng quét QR bên dưới để hoàn tất chuyển khoản.</span>
          </div>

          <!-- QR Image Box -->
          <div style="background: #f8faf9; border: 1.5px solid var(--color-mint-line); border-radius: var(--radius-card); padding: 16px; margin-bottom: 16px; display: inline-block;">
            <img id="vietqr-image" src="" alt="Mã QR Chuyển Khoản Ngân Hàng VietQR" style="max-width: 260px; width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto;" />
          </div>

          <!-- Payment Details Box -->
          <div style="text-align: left; background: var(--color-mint); border: 1px solid var(--color-mint-line); border-radius: var(--radius-control); padding: 14px; font-size: 0.875rem; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed var(--color-mint-line);">
              <span style="color: var(--color-muted);">Ngân hàng:</span>
              <strong style="color: var(--color-ink);">${SITE_CONFIG.bankName} (Napas 24/7)</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed var(--color-mint-line);">
              <span style="color: var(--color-muted);">Số tài khoản:</span>
              <strong style="color: var(--color-court); font-size: 1rem;" id="vietqr-account-no">${SITE_CONFIG.bankAccountNumber}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed var(--color-mint-line);">
              <span style="color: var(--color-muted);">Chủ tài khoản:</span>
              <strong style="color: var(--color-ink);">${SITE_CONFIG.bankAccountHolder}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed var(--color-mint-line);">
              <span style="color: var(--color-muted);">Số tiền:</span>
              <strong class="price-tag" style="font-size: 1.125rem;" id="vietqr-amount">0 đ</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0;">
              <span style="color: var(--color-muted);">Nội dung chuyển khoản (*):</span>
              <strong style="color: var(--color-smash-orange); font-size: 1.0625rem; font-family: var(--font-display);" id="vietqr-code">QS-XXXXXX</strong>
            </div>
          </div>

          <div style="background: #fef3c7; border: 1px solid #fde68a; color: #b45309; padding: 10px; border-radius: var(--radius-control); font-size: 0.75rem; text-align: left; margin-bottom: 16px; font-weight: 600;">
            ⏳ Trạng thái: Chờ xác nhận thanh toán (Admin sẽ kiểm tra và xác nhận đơn hàng của bạn).
          </div>

          <div style="display: flex; gap: 10px; justify-content: center;">
            <button type="button" onclick="window.handleConfirmVietQRDone && window.handleConfirmVietQRDone()" class="btn btn-primary" style="width: 100%;">
              ✓ Tôi đã chuyển khoản thành công
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
