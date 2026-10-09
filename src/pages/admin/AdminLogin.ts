export function renderAdminLoginPage(): string {
  return `
    <div class="container" style="padding-top: var(--spacing-48); padding-bottom: var(--spacing-48); max-width: 460px;">
      <div class="card" style="padding: var(--spacing-32); background: var(--color-white);">
        <div style="text-align: center; margin-bottom: var(--spacing-24);">
          <div style="font-size: 2.5rem; margin-bottom: var(--spacing-8);">🔐</div>
          <h1 style="font-family: var(--font-display); font-size: 1.875rem; color: var(--color-court); margin-bottom: 6px;">
            ĐĂNG NHẬP ADMIN Q-SPORT
          </h1>
          <p style="color: var(--color-muted); font-size: 0.875rem;">
            Dành cho quản trị viên hệ thống Q-Sport
          </p>
        </div>

        <form id="admin-login-form" onsubmit="event.preventDefault(); window.handleAdminLoginSubmit();">
          <div style="margin-bottom: var(--spacing-16);">
            <label for="admin-email" style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-ink); margin-bottom: 6px;">
              Email Admin (*)
            </label>
            <input
              id="admin-email"
              type="email"
              required
              placeholder="admin@qsport.vn"
              style="width: 100%; padding: 10px 14px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line); font-size: 0.9375rem;"
            />
          </div>

          <div style="margin-bottom: var(--spacing-20);">
            <label for="admin-password" style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-ink); margin-bottom: 6px;">
              Mật khẩu (*)
            </label>
            <input
              id="admin-password"
              type="password"
              required
              placeholder="••••••••"
              style="width: 100%; padding: 10px 14px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line); font-size: 0.9375rem;"
            />
          </div>

          <!-- Error Alert -->
          <div id="admin-login-error" style="display: none; padding: 10px 14px; border-radius: var(--radius-control); background: #fef2f2; border: 1px solid var(--color-danger); color: var(--color-danger); font-size: 0.875rem; margin-bottom: var(--spacing-16);"></div>

          <button
            type="submit"
            id="admin-login-btn"
            class="btn btn-primary"
            style="width: 100%; min-height: 44px; font-size: 1rem;"
          >
            Đăng nhập Quản trị
          </button>
        </form>

        <div style="margin-top: var(--spacing-20); text-align: center; border-top: 1px solid var(--color-mint-line); padding-top: 14px;">
          <a href="/" data-link style="font-size: 0.8125rem; color: var(--color-court); text-decoration: none;">
            ← Quay về trang chủ cửa hàng
          </a>
        </div>
      </div>
    </div>
  `;
}
