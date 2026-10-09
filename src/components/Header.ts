import { getCachedAdminSession } from '../services/authService';

export function renderHeader(currentPath: string = '/'): string {
  const isHome = currentPath === '/' || currentPath === '' || currentPath === '/index.html';
  const isProducts = currentPath.startsWith('/products');
  const isAbout = currentPath.startsWith('/about');
  const isCart = currentPath.startsWith('/cart');
  const isAdmin = currentPath.startsWith('/admin');
  const loggedAdmin = getCachedAdminSession();

  return `
    <header class="header-root">
      <div class="container header-container">
        <!-- Section 1: Brand / Logo -->
        <div class="header-brand">
          <a href="/" data-link class="brand-link" aria-label="Q-Sport Trang chủ">
            <img src="/assets/logo.svg" alt="Q-Sport" height="38" class="header-logo" />
          </a>
        </div>

        <!-- Section 2: Main Desktop Navigation -->
        <nav class="header-nav" aria-label="Thực đơn chính">
          <a href="/" data-link class="nav-link ${isHome ? 'active' : ''}">
            Trang chủ
          </a>
          <a href="/products" data-link class="nav-link ${isProducts ? 'active' : ''}">
            Sản phẩm
          </a>
          <a href="/about" data-link class="nav-link ${isAbout ? 'active' : ''}">
            Về chúng tôi
          </a>
        </nav>

        <!-- Section 3: Action Controls -->
        <div class="header-actions">
          <a href="/cart" data-link class="btn btn-secondary header-cart-btn ${isCart ? 'active-cart' : ''}" aria-label="Giỏ hàng Q-Sport">
            <span>🛒 Giỏ hàng</span>
            <span id="cart-count-badge" class="cart-badge">0</span>
          </a>

          <a href="${loggedAdmin ? '/admin/products' : '/admin/login'}" data-link class="header-admin-btn ${isAdmin ? 'active-admin' : ''}" aria-label="Quản trị Admin">
            ${loggedAdmin ? '🔑 Admin' : '🔐 Admin'}
          </a>

          <!-- Mobile Menu Toggle Button -->
          <button
            type="button"
            id="mobile-menu-toggle"
            class="mobile-menu-toggle"
            aria-expanded="false"
            aria-controls="mobile-nav-drawer"
            aria-label="Mở thực đơn di động"
            onclick="window.toggleMobileMenu && window.toggleMobileMenu()"
          >
            <span class="hamburger-icon">☰</span>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div id="mobile-nav-drawer" class="mobile-nav-drawer" aria-label="Thực đơn di động" hidden>
        <div class="mobile-nav-content">
          <a href="/" data-link class="mobile-nav-link ${isHome ? 'active' : ''}">
            🏠 Trang chủ
          </a>
          <a href="/products" data-link class="mobile-nav-link ${isProducts ? 'active' : ''}">
            🏸 Sản phẩm
          </a>
          <a href="/about" data-link class="mobile-nav-link ${isAbout ? 'active' : ''}">
            ℹ️ Về chúng tôi
          </a>
          <a href="/cart" data-link class="mobile-nav-link ${isCart ? 'active' : ''}">
            🛒 Giỏ hàng
          </a>
          <a href="${loggedAdmin ? '/admin/products' : '/admin/login'}" data-link class="mobile-nav-link ${isAdmin ? 'active' : ''}">
            ${loggedAdmin ? '🔑 Quản trị Admin' : '🔐 Đăng nhập Admin'}
          </a>
        </div>
      </div>
    </header>
  `;
}
