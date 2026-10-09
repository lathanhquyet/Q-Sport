export function renderAdminLoginPage(): string {
  return `
    <div class="container" style="padding-top: var(--spacing-48); padding-bottom: var(--spacing-48); max-width: 520px;">
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

        <!-- Admin Setup Guide Toggle -->
        <div style="margin-top: var(--spacing-24); border-top: 1px solid var(--color-mint-line); padding-top: 16px;">
          <button
            type="button"
            onclick="const g = document.getElementById('admin-setup-guide'); if (g) g.hidden = !g.hidden;"
            style="width: 100%; font-size: 0.8125rem; color: var(--color-court); background: var(--color-mint); border: 1px solid var(--color-mint-line); border-radius: var(--radius-control); padding: 8px 12px; font-weight: 600; text-align: center; cursor: pointer;"
          >
            ℹ️ Hướng dẫn tạo & phân quyền tài khoản Admin an toàn
          </button>

          <div id="admin-setup-guide" hidden style="margin-top: 12px; background: #f8faf9; border: 1px solid var(--color-mint-line); border-radius: var(--radius-control); padding: 14px; font-size: 0.8125rem; color: var(--color-ink); line-height: 1.5;">
            <p style="font-weight: 700; color: var(--color-court); margin-bottom: 6px;">Quy trình 2 bước khởi tạo Admin an toàn:</p>
            <ol style="padding-left: 18px; margin-bottom: 10px;">
              <li style="margin-bottom: 4px;">Tạo user trong Supabase Dashboard &rarr; <strong>Authentication &rarr; Users</strong> (hoặc qua Sign Up).</li>
              <li>Mở <strong>SQL Editor</strong> và chạy lệnh gán quyền Admin vào bảng <code>qsport.admin_users</code>:</li>
            </ol>
            <pre style="background: #1e293b; color: #f8fafc; padding: 10px; border-radius: 6px; font-size: 0.75rem; overflow-x: auto; margin-bottom: 8px;"><code>INSERT INTO qsport.admin_users (id, email, full_name, is_active)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', 'Q-Sport Admin'), true
FROM auth.users
WHERE email = 'YOUR_ADMIN_EMAIL@domain.com'
ON CONFLICT (id) DO UPDATE SET is_active = true;</code></pre>
            <p style="font-size: 0.75rem; color: var(--color-muted); font-style: italic;">
              ⚠️ Lưu ý: Không hardcode mật khẩu trong source code. Luôn bật RLS trên bảng <code>qsport.admin_users</code>.
            </p>
          </div>
        </div>

        <div style="margin-top: var(--spacing-16); text-align: center;">
          <a href="/" data-link style="font-size: 0.8125rem; color: var(--color-court); text-decoration: none;">
            ← Quay về trang chủ cửa hàng
          </a>
        </div>
      </div>
    </div>
  `;
}
