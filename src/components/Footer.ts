import { SITE_CONFIG } from '../config/site';

export function renderFooter(): string {
  return `
    <footer style="margin-top: var(--spacing-72); background: var(--color-primary-light); border-top: 1px solid var(--color-primary-border); padding: var(--spacing-48) 0 var(--spacing-24) 0; color: var(--color-text);">
      <div class="container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--spacing-32); margin-bottom: var(--spacing-32);">
          <div>
            <img src="/assets/logo.svg" alt="Q-Sport" height="36" style="margin-bottom: var(--spacing-12);" />
            <p style="color: var(--color-text-secondary); font-size: 0.875rem; line-height: 1.6;">
              ${SITE_CONFIG.tagline}
            </p>
          </div>

          <div>
            <h4 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-primary-dark); margin-bottom: var(--spacing-12);">Liên kết nhanh</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.875rem;">
              <li><a href="/" data-link>Trang chủ</a></li>
              <li><a href="/products" data-link>Danh sách sản phẩm</a></li>
              <li><a href="/news" data-link>Tin nội bộ &amp; Video</a></li>
              <li><a href="/about" data-link>Về chúng tôi Q-Sport</a></li>
              <li><a href="/cart" data-link>Giỏ hàng</a></li>
            </ul>
          </div>

          <div>
            <h4 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-primary-dark); margin-bottom: var(--spacing-12);">Thông tin liên hệ</h4>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 6px;">
              📍 <strong>Địa chỉ:</strong> ${SITE_CONFIG.address}
            </p>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 6px;">
              📞 <strong>Điện thoại:</strong> ${SITE_CONFIG.phone}
            </p>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary);">
              ✉️ <strong>Email:</strong> ${SITE_CONFIG.email}
            </p>
          </div>
        </div>

        <div style="border-top: 1px solid var(--color-primary-border); padding-top: var(--spacing-16); text-align: center; font-size: 0.875rem; color: var(--color-text-secondary);">
          <p style="font-weight: 600; color: var(--color-text); margin-bottom: 4px;">&copy; Q-Sport. Bản quyền thuộc về Q-Sport.</p>
          <p>Đại diện: ${SITE_CONFIG.representative} | Email: ${SITE_CONFIG.email}</p>
          <p>Đây là sản phẩm demo trong quá trình học Vibecode - Mọi hình ảnh và nội dung đều tham khảo và copy từ các trang XSport, VNBshop và Internet</p>
        </div>
      </div>
    </footer>
  `;
}
