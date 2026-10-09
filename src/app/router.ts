import { renderHeader } from '../components/Header';
import { renderFooter } from '../components/Footer';
import { renderHomePage } from '../pages/Home';
import { renderProductsPage } from '../pages/Products';
import { renderProductDetailPage } from '../pages/ProductDetail';
import { renderAboutPage } from '../pages/About';
import { renderCartPage } from '../pages/Cart';
import { renderCheckoutPage } from '../pages/Checkout';
import { renderOrderSuccessPage } from '../pages/OrderSuccess';
import { renderErrorState } from '../components/StateViews';
import {
  addToCart,
  getCartTotalCount,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  onCartChange,
} from '../services/cartService';
import { createOrderCOD } from '../services/orderService';

export async function handleRouting(): Promise<void> {
  const appElement = document.getElementById('app');
  if (!appElement) return;

  const path = window.location.pathname;
  const search = window.location.search;
  const queryParams = new URLSearchParams(search);

  let mainContentHtml = '';

  try {
    if (path === '/' || path === '' || path === '/index.html') {
      mainContentHtml = await renderHomePage();
    } else if (path === '/products') {
      mainContentHtml = await renderProductsPage(queryParams);
    } else if (path.startsWith('/products/')) {
      const slug = path.replace('/products/', '').trim();
      mainContentHtml = await renderProductDetailPage(slug);
    } else if (path === '/about') {
      mainContentHtml = renderAboutPage();
    } else if (path === '/cart') {
      mainContentHtml = renderCartPage();
    } else if (path === '/checkout') {
      mainContentHtml = renderCheckoutPage();
    } else if (path.startsWith('/order-success')) {
      const parts = path.split('/');
      const code = parts[parts.length - 1] || 'QS-SUCCESS';
      mainContentHtml = renderOrderSuccessPage(code);
    } else if (path === '/admin/login' || path.startsWith('/admin')) {
      mainContentHtml = `
        <div class="container" style="padding-top: var(--spacing-48); text-align: center; max-width: 480px;">
          <div class="card" style="padding: var(--spacing-32);">
            <h1 style="font-family: var(--font-display); font-size: 2rem; color: var(--color-court); margin-bottom: 16px;">ĐĂNG NHẬP ADMIN Q-SPORT</h1>
            <p style="color: var(--color-muted); font-size: 0.875rem; margin-bottom: 24px;">Trang dành riêng cho Quản trị viên hệ thống.</p>
            <form onsubmit="event.preventDefault(); alert('Chức năng Đăng nhập Admin thuộc Phase 4.');">
              <input type="email" placeholder="Email Admin" required style="width: 100%; padding: 10px; margin-bottom: 12px; border: 1px solid var(--color-mint-line); border-radius: var(--radius-control);" />
              <input type="password" placeholder="Mật khẩu" required style="width: 100%; padding: 10px; margin-bottom: 16px; border: 1px solid var(--color-mint-line); border-radius: var(--radius-control);" />
              <button type="submit" class="btn btn-primary" style="width: 100%;">Đăng nhập Admin</button>
            </form>
          </div>
        </div>
      `;
    } else {
      mainContentHtml = `
        <div class="container" style="padding-top: var(--spacing-48);">
          ${renderErrorState('Trang bạn tìm kiếm không tồn tại (Lỗi 404).', "window.location.href='/'")}
        </div>
      `;
    }
  } catch {
    mainContentHtml = `
      <div class="container" style="padding-top: var(--spacing-48);">
        ${renderErrorState('Không thể tải giao diện trang. Vui lòng kiểm tra lại kết nối.', 'location.reload()')}
      </div>
    `;
  }

  // Render Full Layout
  appElement.innerHTML = `
    ${renderHeader(path)}
    <main style="min-height: 60vh;">
      ${mainContentHtml}
    </main>
    ${renderFooter()}
  `;

  updateHeaderCartBadge();
  attachGlobalEventListeners();
}

function updateHeaderCartBadge(): void {
  const badge = document.getElementById('cart-count-badge');
  if (badge) {
    badge.textContent = getCartTotalCount().toString();
  }
}

// Subscribe to cart changes
onCartChange(() => {
  updateHeaderCartBadge();
});

function attachGlobalEventListeners(): void {
  document.querySelectorAll('a[data-link]').forEach(anchor => {
    anchor.addEventListener('click', (e: Event) => {
      const href = (anchor as HTMLAnchorElement).getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        window.history.pushState({}, '', href);
        handleRouting();
      }
    });
  });
}

// Global Window Helpers for Cart & Checkout
(window as any).handleCartQtyChange = (productId: string, newQty: number) => {
  updateCartQuantity(productId, newQty);
  handleRouting();
};

(window as any).handleRemoveCartItem = (productId: string) => {
  removeFromCart(productId);
  handleRouting();
};

(window as any).handleClearAllCart = () => {
  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?')) {
    clearCart();
    handleRouting();
  }
};

(window as any).addToCartFromDetail = (id: string, name: string, price: number, image: string) => {
  const qtyInput = document.getElementById('detail-qty-input') as HTMLInputElement;
  const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

  const result = addToCart(
    {
      id,
      name,
      price,
      image_url: image,
    },
    qty
  );

  const feedback = document.getElementById('cart-add-feedback');
  if (feedback) {
    feedback.textContent = `✓ ${result.message}`;
    feedback.style.display = 'block';
    setTimeout(() => {
      feedback.style.display = 'none';
    }, 3000);
  }
};

(window as any).handleCheckoutSubmit = async () => {
  const submitBtn = document.getElementById('submit-order-btn') as HTMLButtonElement;
  const errorBox = document.getElementById('checkout-error-box');

  const nameInput = document.getElementById('checkout-name') as HTMLInputElement;
  const phoneInput = document.getElementById('checkout-phone') as HTMLInputElement;
  const addressInput = document.getElementById('checkout-address') as HTMLTextAreaElement;
  const noteInput = document.getElementById('checkout-note') as HTMLInputElement;

  if (errorBox) errorBox.style.display = 'none';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Đang khởi tạo đơn hàng...';
  }

  try {
    const result = await createOrderCOD({
      customer_name: nameInput?.value || '',
      customer_phone: phoneInput?.value || '',
      shipping_address: addressInput?.value || '',
      customer_note: noteInput?.value || '',
    });

    if (result.success && result.order_code) {
      window.history.pushState({}, '', `/order-success/${result.order_code}`);
      handleRouting();
    } else {
      if (errorBox) {
        errorBox.textContent = `⚠️ ${result.message || 'Đặt hàng không thành công. Vui lòng kiểm tra lại.'}`;
        errorBox.style.display = 'block';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 Xác nhận đặt hàng COD';
      }
    }
  } catch {
    if (errorBox) {
      errorBox.textContent = '⚠️ Đã xảy ra lỗi mạng khi tạo đơn hàng. Vui lòng thử lại.';
      errorBox.style.display = 'block';
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '🚀 Xác nhận đặt hàng COD';
    }
  }
};

window.addEventListener('popstate', handleRouting);
