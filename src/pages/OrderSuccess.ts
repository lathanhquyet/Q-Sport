import { SITE_CONFIG } from '../config/site';

export function renderOrderSuccessPage(orderCode: string): string {
  return `
    <div class="container" style="padding-top: var(--spacing-48); text-align: center; max-width: 640px;">
      <div class="card" style="padding: var(--spacing-48); background: var(--color-mint); border-color: var(--color-mint-line);">
        <div style="font-size: 3.5rem; margin-bottom: var(--spacing-16);">🎉</div>
        <h1 style="font-family: var(--font-display); font-size: 2.25rem; color: var(--color-court); margin-bottom: var(--spacing-12);">
          ĐẶT HÀNG THÀNH CÔNG!
        </h1>
        <p style="color: var(--color-ink); font-size: 1.0625rem; margin-bottom: var(--spacing-24); line-height: 1.6;">
          Cảm ơn bạn đã mua sắm tại Q-Sport. Đơn hàng của bạn đã được ghi nhận thành công trên hệ thống.
        </p>

        <div style="background: var(--color-white); border: 2px dashed var(--color-court); border-radius: var(--radius-card); padding: var(--spacing-20); margin-bottom: var(--spacing-24);">
          <span style="font-size: 0.8125rem; color: var(--color-muted); display: block; margin-bottom: 4px;">MÃ ĐƠN HÀNG CỦA BẠN:</span>
          <strong style="font-family: var(--font-display); font-size: 2rem; color: var(--color-court); letter-spacing: 1px;">${orderCode || 'QS-SUCCESS'}</strong>
          <span style="display: block; margin-top: 8px; font-size: 0.8125rem; color: var(--color-court); font-weight: 600;">
            Phương thức: COD (Thanh toán khi nhận hàng)
          </span>
        </div>

        <p style="font-size: 0.875rem; color: var(--color-muted); margin-bottom: var(--spacing-32); line-height: 1.5;">
          Nhân viên Q-Sport sẽ gọi điện tới số điện thoại của bạn để xác nhận đơn hàng trước khi giao. Mọi thắc mắc xin liên hệ Hotline/Email: <strong>${SITE_CONFIG.email}</strong>.
        </p>

        <div style="display: flex; gap: var(--spacing-16); justify-content: center; flex-wrap: wrap;">
          <a href="/products" data-link class="btn btn-primary">
            Tiếp tục mua sắm sản phẩm 🏸
          </a>
          <a href="/" data-link class="btn btn-secondary">
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  `;
}
