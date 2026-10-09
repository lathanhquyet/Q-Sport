import { renderHeader } from '../components/Header';
import { renderFooter } from '../components/Footer';
import { renderProductCard } from '../components/ProductCard';
import { renderHomePage } from '../pages/Home';
import { renderProductsPage } from '../pages/Products';
import { renderProductDetailPage } from '../pages/ProductDetail';
import { renderAboutPage } from '../pages/About';
import { renderCartPage } from '../pages/Cart';
import { renderCheckoutPage } from '../pages/Checkout';
import { renderOrderSuccessPage } from '../pages/OrderSuccess';
import { getProducts } from '../services/productService';
import { Product } from '../types';
import { renderAdminLoginPage } from '../pages/admin/AdminLogin';
import { renderAdminProductsPage } from '../pages/admin/AdminProducts';
import { renderAdminOrdersPage } from '../pages/admin/AdminOrders';
import { renderAdminCommentsPage } from '../pages/admin/AdminComments';
import { renderErrorState } from '../components/StateViews';
import {
  addToCart,
  getCartTotalCount,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  onCartChange,
} from '../services/cartService';
import { createOrderCOD, generateVietQRImageUrl } from '../services/orderService';
import { SITE_CONFIG } from '../config/site';
import {
  signInAdmin,
  signOutAdmin,
  getCachedAdminSession,
  checkCurrentAdminSession,
} from '../services/authService';
import {
  createProduct,
  updateProduct,
  toggleProductActive,
  toggleProductFeatured,
  softDeleteProduct,
  fetchAdminProducts,
} from '../services/adminProductService';
import {
  updateOrderStatus,
  fetchAdminOrderItems,
  OrderStatus,
} from '../services/adminOrderService';
import {
  submitComment,
  updateCommentStatus,
  deleteComment,
} from '../services/commentService';
import { formatVND } from '../utils/formatters';

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
    } else if (path === '/admin/login') {
      const currentAdmin = getCachedAdminSession();
      if (currentAdmin) {
        window.history.pushState({}, '', '/admin/products');
        handleRouting();
        return;
      }
      mainContentHtml = renderAdminLoginPage();
    } else if (path === '/admin/products') {
      const admin = await checkCurrentAdminSession();
      if (!admin) {
        window.history.pushState({}, '', '/admin/login');
        handleRouting();
        return;
      }
      mainContentHtml = await renderAdminProductsPage();
    } else if (path === '/admin/orders') {
      const admin = await checkCurrentAdminSession();
      if (!admin) {
        window.history.pushState({}, '', '/admin/login');
        handleRouting();
        return;
      }
      const statusParam = queryParams.get('status') || 'ALL';
      mainContentHtml = await renderAdminOrdersPage(statusParam);
    } else if (path === '/admin/comments') {
      const admin = await checkCurrentAdminSession();
      if (!admin) {
        window.history.pushState({}, '', '/admin/login');
        handleRouting();
        return;
      }
      const statusParam = queryParams.get('status') || 'ALL';
      mainContentHtml = await renderAdminCommentsPage(statusParam);
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
        // Automatically close mobile menu drawer on navigation
        closeMobileMenu();
        handleRouting();
      }
    });
  });

  // ESC Key listener to close mobile drawer
  document.removeEventListener('keydown', handleGlobalKeyDown);
  document.addEventListener('keydown', handleGlobalKeyDown);
}

function handleGlobalKeyDown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    closeMobileMenu();
  }
}

function closeMobileMenu(): void {
  const drawer = document.getElementById('mobile-nav-drawer');
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  if (drawer) drawer.hidden = true;
  if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
}

(window as any).toggleMobileMenu = () => {
  const drawer = document.getElementById('mobile-nav-drawer');
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  if (!drawer || !toggleBtn) return;

  const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
  const newExpandedState = !isExpanded;

  toggleBtn.setAttribute('aria-expanded', newExpandedState ? 'true' : 'false');
  drawer.hidden = !newExpandedState;
};

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

(window as any).changeDetailQty = (delta: number) => {
  const input = document.getElementById('detail-qty-input') as HTMLInputElement;
  if (input) {
    const current = parseInt(input.value, 10) || 1;
    const max = parseInt(input.getAttribute('max') || '99', 10);
    const newQty = Math.max(1, Math.min(max, current + delta));
    input.value = newQty.toString();
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

let currentVietQROrderCode = '';

(window as any).handlePaymentMethodChange = (method: 'COD' | 'VIETQR') => {
  const title = document.getElementById('selected-payment-title');
  const desc = document.getElementById('selected-payment-desc');
  if (title && desc) {
    if (method === 'VIETQR') {
      title.textContent = '📱 Phương thức: Chuyển khoản VietQR';
      desc.textContent = 'Quét mã QR tự động qua ứng dụng ngân hàng MB Bank / Napas.';
    } else {
      title.textContent = '💵 Phương thức: Thanh toán COD';
      desc.textContent = 'Thanh toán tiền mặt trực tiếp cho shipper khi nhận hàng.';
    }
  }
};

(window as any).handleCheckoutSubmit = async () => {
  const submitBtn = document.getElementById('submit-order-btn') as HTMLButtonElement;
  const errorBox = document.getElementById('checkout-error-box');

  const nameInput = document.getElementById('checkout-name') as HTMLInputElement;
  const phoneInput = document.getElementById('checkout-phone') as HTMLInputElement;
  const addressInput = document.getElementById('checkout-address') as HTMLTextAreaElement;
  const noteInput = document.getElementById('checkout-note') as HTMLInputElement;
  const selectedPayRadio = document.querySelector('input[name="payment_method"]:checked') as HTMLInputElement;
  const paymentMethod = (selectedPayRadio?.value || 'COD') as 'COD' | 'VIETQR';

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
      payment_method: paymentMethod,
    });

    if (result.success && result.order_code) {
      if (paymentMethod === 'VIETQR') {
        currentVietQROrderCode = result.order_code;
        const qrModal = document.getElementById('vietqr-modal-backdrop');
        const qrImage = document.getElementById('vietqr-image') as HTMLImageElement;
        const qrAmount = document.getElementById('vietqr-amount');
        const qrCode = document.getElementById('vietqr-code');

        const qrUrl = generateVietQRImageUrl(
          SITE_CONFIG.bankName,
          SITE_CONFIG.bankAccountNumber,
          SITE_CONFIG.bankAccountHolder,
          result.total_amount || 0,
          result.order_code
        );

        if (qrImage) qrImage.src = qrUrl;
        if (qrAmount) qrAmount.textContent = formatVND(result.total_amount || 0);
        if (qrCode) qrCode.textContent = result.order_code;

        if (qrModal) qrModal.style.display = 'flex';

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '🚀 Xác nhận đặt hàng';
        }
      } else {
        window.history.pushState({}, '', `/order-success/${result.order_code}`);
        handleRouting();
      }
    } else {
      if (errorBox) {
        errorBox.textContent = `⚠️ ${result.message || 'Đặt hàng không thành công. Vui lòng kiểm tra lại.'}`;
        errorBox.style.display = 'block';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 Xác nhận đặt hàng';
      }
    }
  } catch {
    if (errorBox) {
      errorBox.textContent = '⚠️ Đã xảy ra lỗi mạng khi tạo đơn hàng. Vui lòng thử lại.';
      errorBox.style.display = 'block';
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '🚀 Xác nhận đặt hàng';
    }
  }
};

(window as any).handleConfirmVietQRDone = () => {
  const qrModal = document.getElementById('vietqr-modal-backdrop');
  if (qrModal) qrModal.style.display = 'none';
  if (currentVietQROrderCode) {
    window.history.pushState({}, '', `/order-success/${currentVietQROrderCode}`);
    handleRouting();
  }
};

(window as any).handleCloseVietQRModal = () => {
  const qrModal = document.getElementById('vietqr-modal-backdrop');
  if (qrModal) qrModal.style.display = 'none';
  if (currentVietQROrderCode) {
    window.history.pushState({}, '', `/order-success/${currentVietQROrderCode}`);
    handleRouting();
  }
};

// Global Window Helpers for Comments
(window as any).handleCommentSubmit = async (productId: string) => {
  const nameInput = document.getElementById('comment-name') as HTMLInputElement;
  const contentInput = document.getElementById('comment-content') as HTMLTextAreaElement;
  const feedback = document.getElementById('comment-feedback');
  const submitBtn = document.getElementById('submit-comment-btn') as HTMLButtonElement;

  if (!productId) return;

  // Anti double-submit & loading UI
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Đang gửi...';
  }

  if (feedback) {
    feedback.textContent = '⏳ Đang lưu bình luận...';
    feedback.style.display = 'block';
    feedback.style.background = '#e0f2fe';
    feedback.style.border = '1px solid #7dd3fc';
    feedback.style.color = '#0369a1';
  }

  try {
    const res = await submitComment(
      productId,
      nameInput?.value || '',
      contentInput?.value || ''
    );

    if (feedback) {
      if (res.success) {
        feedback.textContent = `✓ ${res.message || 'Bình luận đã được gửi và đang chờ quản trị viên phê duyệt.'}`;
        feedback.style.background = '#dcfce7';
        feedback.style.border = '1px solid var(--color-mint-line)';
        feedback.style.color = 'var(--color-court)';
      } else {
        feedback.textContent = `⚠️ ${res.message || 'Không thể gửi bình luận.'}`;
        feedback.style.background = '#fef2f2';
        feedback.style.border = '1px solid var(--color-danger)';
        feedback.style.color = 'var(--color-danger)';
      }
      feedback.style.display = 'block';
    }

    if (res.success) {
      // Only reset inputs on successful submit
      if (nameInput) nameInput.value = '';
      if (contentInput) contentInput.value = '';
    }
  } catch {
    if (feedback) {
      feedback.textContent = '⚠️ Lỗi kết nối khi gửi bình luận. Vui lòng thử lại.';
      feedback.style.background = '#fef2f2';
      feedback.style.border = '1px solid var(--color-danger)';
      feedback.style.color = 'var(--color-danger)';
      feedback.style.display = 'block';
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Gửi bình luận';
    }
  }
};

(window as any).handleApproveComment = async (commentId: string) => {
  await updateCommentStatus(commentId, 'APPROVED');
  handleRouting();
};

(window as any).handleHideComment = async (commentId: string) => {
  await updateCommentStatus(commentId, 'HIDDEN');
  handleRouting();
};

(window as any).handleDeleteComment = async (commentId: string) => {
  if (confirm('Bạn có chắc chắn muốn xóa vĩnh viễn bình luận này?')) {
    await deleteComment(commentId);
    handleRouting();
  }
};

// Global Window Helpers for Admin Auth & Actions
(window as any).handleAdminLoginSubmit = async () => {
  const emailInput = document.getElementById('admin-email') as HTMLInputElement;
  const passInput = document.getElementById('admin-password') as HTMLInputElement;
  const errorBox = document.getElementById('admin-login-error');
  const loginBtn = document.getElementById('admin-login-btn') as HTMLButtonElement;

  if (errorBox) errorBox.style.display = 'none';

  if (loginBtn) {
    loginBtn.disabled = true;
    loginBtn.textContent = '⏳ Đang xác thực tài khoản...';
  }

  const res = await signInAdmin(emailInput?.value || '', passInput?.value || '');

  if (res.success) {
    window.history.pushState({}, '', '/admin/products');
    handleRouting();
  } else {
    if (errorBox) {
      errorBox.textContent = `⚠️ ${res.message || 'Đăng nhập không thành công'}`;
      errorBox.style.display = 'block';
    }
    if (loginBtn) {
      loginBtn.disabled = false;
      loginBtn.textContent = 'Đăng nhập Quản trị';
    }
  }
};

(window as any).handleAdminLogout = async () => {
  if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản Admin?')) {
    await signOutAdmin();
    window.history.pushState({}, '', '/admin/login');
    handleRouting();
  }
};

// Global Window Helpers for Admin Products
(window as any).handleOpenAddProductModal = () => {
  const modal = document.getElementById('product-modal-backdrop');
  const title = document.getElementById('product-modal-title');
  const idInput = document.getElementById('modal-product-id') as HTMLInputElement;
  const form = document.getElementById('product-modal-form') as HTMLFormElement;

  if (form) form.reset();
  if (idInput) idInput.value = '';
  if (title) title.textContent = 'THÊM SẢN PHẨM MỚI';
  if (modal) modal.style.display = 'flex';
};

(window as any).handleOpenEditProduct = async (productId: string) => {
  const products = await fetchAdminProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('product-modal-backdrop');
  const title = document.getElementById('product-modal-title');
  const idInput = document.getElementById('modal-product-id') as HTMLInputElement;
  const nameInput = document.getElementById('modal-product-name') as HTMLInputElement;
  const catInput = document.getElementById('modal-product-category') as HTMLSelectElement;
  const priceInput = document.getElementById('modal-product-price') as HTMLInputElement;
  const stockInput = document.getElementById('modal-product-stock') as HTMLInputElement;
  const imageInput = document.getElementById('modal-product-image') as HTMLInputElement;
  const shortDescInput = document.getElementById('modal-product-short-desc') as HTMLInputElement;
  const descInput = document.getElementById('modal-product-desc') as HTMLTextAreaElement;
  const activeInput = document.getElementById('modal-product-active') as HTMLInputElement;
  const featuredInput = document.getElementById('modal-product-featured') as HTMLInputElement;

  if (title) title.textContent = `CHỈNH SỬA SẢN PHẨM: ${product.name}`;
  if (idInput) idInput.value = product.id;
  if (nameInput) nameInput.value = product.name;
  if (catInput) catInput.value = product.category_id;
  if (priceInput) priceInput.value = product.price.toString();
  if (stockInput) stockInput.value = product.stock_quantity.toString();
  if (imageInput) imageInput.value = product.image_url || '';
  if (shortDescInput) shortDescInput.value = product.short_description || '';
  if (descInput) descInput.value = product.description || '';
  if (activeInput) activeInput.checked = product.is_active;
  if (featuredInput) featuredInput.checked = product.is_featured;

  if (modal) modal.style.display = 'flex';
};

(window as any).handleCloseProductModal = () => {
  const modal = document.getElementById('product-modal-backdrop');
  if (modal) modal.style.display = 'none';
};

(window as any).handleSaveProductSubmit = async () => {
  const idInput = document.getElementById('modal-product-id') as HTMLInputElement;
  const nameInput = document.getElementById('modal-product-name') as HTMLInputElement;
  const catInput = document.getElementById('modal-product-category') as HTMLSelectElement;
  const priceInput = document.getElementById('modal-product-price') as HTMLInputElement;
  const stockInput = document.getElementById('modal-product-stock') as HTMLInputElement;
  const imageInput = document.getElementById('modal-product-image') as HTMLInputElement;
  const shortDescInput = document.getElementById('modal-product-short-desc') as HTMLInputElement;
  const descInput = document.getElementById('modal-product-desc') as HTMLTextAreaElement;
  const activeInput = document.getElementById('modal-product-active') as HTMLInputElement;
  const featuredInput = document.getElementById('modal-product-featured') as HTMLInputElement;
  const errorBox = document.getElementById('modal-product-error');

  if (errorBox) errorBox.style.display = 'none';

  const productId = idInput?.value;
  const inputPayload = {
    name: nameInput?.value || '',
    category_id: catInput?.value || '',
    price: parseFloat(priceInput?.value || '0'),
    stock_quantity: parseInt(stockInput?.value || '0', 10),
    image_url: imageInput?.value || '',
    short_description: shortDescInput?.value || '',
    description: descInput?.value || '',
    is_active: activeInput?.checked ?? true,
    is_featured: featuredInput?.checked ?? false,
  };

  let res;
  if (productId) {
    res = await updateProduct(productId, inputPayload);
  } else {
    res = await createProduct(inputPayload);
  }

  if (res.success) {
    (window as any).handleCloseProductModal();
    handleRouting();
  } else {
    if (errorBox) {
      errorBox.textContent = `⚠️ ${res.message || 'Lỗi lưu sản phẩm'}`;
      errorBox.style.display = 'block';
    }
  }
};

(window as any).handleToggleActive = async (id: string, currentActive: boolean) => {
  await toggleProductActive(id, currentActive);
  handleRouting();
};

(window as any).handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
  await toggleProductFeatured(id, currentFeatured);
  handleRouting();
};

(window as any).handleDeleteProduct = async (id: string, name: string) => {
  if (confirm(`Bạn có chắc chắn muốn xóa mềm sản phẩm "${name}"? Sản phẩm sẽ bị ẩn khỏi trang public.`)) {
    await softDeleteProduct(id);
    handleRouting();
  }
};

// Global Window Helpers for Admin Orders
(window as any).handleViewOrderDetail = async (orderId: string, orderCode: string) => {
  const modal = document.getElementById('order-detail-modal-backdrop');
  const title = document.getElementById('order-detail-modal-title');
  const body = document.getElementById('order-detail-modal-body');

  if (title) title.textContent = `CHI TIẾT ĐƠN HÀNG: ${orderCode}`;
  if (body) body.innerHTML = '<div style="padding: 20px; text-align: center;">⏳ Đang tải danh sách sản phẩm...</div>';
  if (modal) modal.style.display = 'flex';

  const items = await fetchAdminOrderItems(orderId);
  const total = items.reduce((sum, i) => sum + i.line_total, 0);

  const itemsHtml = items
    .map(
      item => `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--color-mint-line); padding: 10px 0; font-size: 0.875rem;">
        <div>
          <strong style="color: var(--color-ink); display: block;">${item.product_name_snapshot}</strong>
          <span style="font-size: 0.75rem; color: var(--color-muted);">Số lượng: ${item.quantity} x ${formatVND(item.unit_price)}</span>
        </div>
        <span style="font-weight: 700; color: var(--color-court); font-size: 0.9375rem;">${formatVND(item.line_total)}</span>
      </div>
    `
    )
    .join('');

  if (body) {
    body.innerHTML = `
      <div style="margin-bottom: 16px;">
        ${itemsHtml || '<div style="color: var(--color-muted);">Không có dữ liệu chi tiết sản phẩm.</div>'}
      </div>
      <div style="border-top: 2px solid var(--color-mint-line); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 700;">Tổng tiền đơn hàng:</span>
        <span style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-court); font-weight: 700;">${formatVND(total)}</span>
      </div>
    `;
  }
};

(window as any).handleCloseOrderDetailModal = () => {
  const modal = document.getElementById('order-detail-modal-backdrop');
  if (modal) modal.style.display = 'none';
};

(window as any).handleOpenChangeOrderStatus = (orderId: string, orderCode: string, currentStatus: string) => {
  const modal = document.getElementById('order-status-modal-backdrop');
  const title = document.getElementById('order-status-modal-title');
  const idInput = document.getElementById('status-order-id') as HTMLInputElement;
  const select = document.getElementById('status-select') as HTMLSelectElement;
  const reasonBox = document.getElementById('cancel-reason-container');
  const reasonInput = document.getElementById('cancel-reason-input') as HTMLTextAreaElement;
  const errorBox = document.getElementById('status-error-box');

  if (errorBox) errorBox.style.display = 'none';
  if (title) title.textContent = `CẬP NHẬT TRẠNG THÁI: ${orderCode}`;
  if (idInput) idInput.value = orderId;
  if (select) select.value = currentStatus;
  if (reasonInput) reasonInput.value = '';

  if (reasonBox) {
    reasonBox.style.display = currentStatus === 'CANCELLED' ? 'block' : 'none';
  }

  if (modal) modal.style.display = 'flex';
};

(window as any).handleStatusSelectChange = (value: string) => {
  const reasonBox = document.getElementById('cancel-reason-container');
  if (reasonBox) {
    reasonBox.style.display = value === 'CANCELLED' ? 'block' : 'none';
  }
};

(window as any).handleCloseOrderStatusModal = () => {
  const modal = document.getElementById('order-status-modal-backdrop');
  if (modal) modal.style.display = 'none';
};

(window as any).handleSaveOrderStatusSubmit = async () => {
  const idInput = document.getElementById('status-order-id') as HTMLInputElement;
  const select = document.getElementById('status-select') as HTMLSelectElement;
  const reasonInput = document.getElementById('cancel-reason-input') as HTMLTextAreaElement;
  const errorBox = document.getElementById('status-error-box');

  if (errorBox) errorBox.style.display = 'none';

  const orderId = idInput?.value;
  const newStatus = (select?.value || 'NEW') as OrderStatus;
  const cancelReason = reasonInput?.value || '';

  const res = await updateOrderStatus(orderId, newStatus, cancelReason);

  if (res.success) {
    (window as any).handleCloseOrderStatusModal();
    handleRouting();
  } else {
    if (errorBox) {
      errorBox.textContent = `⚠️ ${res.message || 'Lỗi cập nhật trạng thái đơn hàng'}`;
      errorBox.style.display = 'block';
    }
  }
};

(window as any).handleAutoProductFilter = async () => {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const categorySelect = document.getElementById('category-select') as HTMLSelectElement;
  const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;

  const search = searchInput?.value?.trim() || '';
  const category = categorySelect?.value || 'all';
  const sort = (sortSelect?.value as 'newest' | 'price-asc' | 'price-desc') || 'newest';

  const products = await getProducts({ categorySlug: category, search, sort });
  const gridContainer = document.getElementById('products-grid');
  const countBadge = document.getElementById('products-count-badge');

  if (countBadge) countBadge.textContent = products.length.toString();

  if (gridContainer) {
    if (products.length > 0) {
      gridContainer.innerHTML = products.map((p: Product) => renderProductCard(p)).join('');
    } else {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-48); background: var(--color-mint); border-radius: var(--radius-card); border: 1px dashed var(--color-mint-line);">
          <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-court); margin-bottom: 8px;">Không tìm thấy sản phẩm phù hợp</h3>
          <p style="color: var(--color-muted); font-size: 0.9375rem; margin-bottom: 20px;">Vui lòng thử điều chỉnh từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
          <button onclick="window.handleResetProductFilters()" class="btn btn-primary" style="font-size: 0.875rem;">
            🔄 Xóa tất cả bộ lọc
          </button>
        </div>
      `;
    }
  }

  const params = new URLSearchParams();
  if (category && category !== 'all') params.set('category', category);
  if (search) params.set('search', search);
  if (sort && sort !== 'newest') params.set('sort', sort);
  const newUrl = `/products${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newUrl);
};

(window as any).applyProductFilters = () => {
  (window as any).handleAutoProductFilter();
};

(window as any).handleResetProductFilters = () => {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const categorySelect = document.getElementById('category-select') as HTMLSelectElement;
  const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;

  if (searchInput) searchInput.value = '';
  if (categorySelect) categorySelect.value = 'all';
  if (sortSelect) sortSelect.value = 'newest';

  (window as any).handleAutoProductFilter();
};

window.addEventListener('popstate', handleRouting);
