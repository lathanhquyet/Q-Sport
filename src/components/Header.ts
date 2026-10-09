import { getCachedAdminSession } from '../services/authService';

export function renderHeader(currentPath: string = '/'): string {
  const isHome = currentPath === '/' || currentPath === '';
  const isProducts = currentPath.startsWith('/products');
  const isAbout = currentPath.startsWith('/about');
  const isCart = currentPath.startsWith('/cart');
  const isAdmin = currentPath.startsWith('/admin');
  const loggedAdmin = getCachedAdminSession();

  return `
    <header style="background: var(--color-white); border-bottom: 1px solid var(--color-mint-line); padding: var(--spacing-12) 0; position: sticky; top: 0; z-index: 100; box-shadow: var(--shadow-sm);">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <a href="/" data-link style="display: flex; align-items: center; gap: 8px;">
          <img src="/assets/logo.svg" alt="Q-Sport" height="38" style="display: block;" />
        </a>

        <nav style="display: flex; gap: var(--spacing-20); align-items: center; font-weight: 500;">
          <a href="/" data-link style="color: ${isHome ? 'var(--color-court)' : 'var(--color-ink)'}; border-bottom: ${isHome ? '2px solid var(--color-court)' : 'none'}; padding-bottom: 2px;">
            Trang chủ
          </a>
          <a href="/products" data-link style="color: ${isProducts ? 'var(--color-court)' : 'var(--color-ink)'}; border-bottom: ${isProducts ? '2px solid var(--color-court)' : 'none'}; padding-bottom: 2px;">
            Sản phẩm
          </a>
          <a href="/about" data-link style="color: ${isAbout ? 'var(--color-court)' : 'var(--color-ink)'}; border-bottom: ${isAbout ? '2px solid var(--color-court)' : 'none'}; padding-bottom: 2px;">
            Về chúng tôi
          </a>
          <a href="/cart" data-link class="btn btn-secondary" style="min-height: 36px; padding: 4px 12px; font-size: 0.875rem; display: flex; align-items: center; gap: 6px; border-color: ${isCart ? 'var(--color-court-dark)' : 'var(--color-court)'}">
            <span>🛒 Giỏ hàng</span>
            <span id="cart-count-badge" style="background: var(--color-court); color: var(--color-white); border-radius: 999px; padding: 1px 7px; font-size: 0.75rem; font-weight: 700;">0</span>
          </a>
          <a href="${loggedAdmin ? '/admin/products' : '/admin/login'}" data-link style="font-size: 0.8125rem; color: ${isAdmin ? 'var(--color-court)' : 'var(--color-muted)'}; text-decoration: none; padding: 4px 8px; border-radius: var(--radius-control); background: ${isAdmin ? 'var(--color-mint)' : 'transparent'}; font-weight: 600;">
            ${loggedAdmin ? '🔑 Admin' : '🔐 Admin'}
          </a>
        </nav>
      </div>
    </header>
  `;
}
