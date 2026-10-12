import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderProductCard } from '../../src/components/ProductCard';
import { Product } from '../../src/types';
import {
  addToCart,
  getCart,
  clearCart,
  CartItem,
} from '../../src/services/cartService';
import {
  escapeHtml,
  formatTelegramOrderMessage,
  sendTelegramOrderAlert,
  TelegramOrderPayload,
} from '../../src/services/telegramService';
import { createOrderCOD } from '../../src/services/orderService';

describe('Phase 11 — Product Quick Add & Telegram Order Alert', () => {
  beforeEach(() => {
    localStorage.clear();
    clearCart();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('11.1 — Product Quick Add Component UI', () => {
    const mockProduct: Product = {
      id: 'prod-test-01',
      product_code: 'PRD01',
      category_id: 'cat-01',
      name: 'Vợt Cầu Lông Q-Sport Pro Attack 100',
      slug: 'vot-cau-long-qsport-pro-attack-100',
      price: 1450000,
      stock_quantity: 10,
      is_active: true,
      is_featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it('renders quantity selector and Quick Add button on in-stock product card', () => {
      const html = renderProductCard(mockProduct);

      expect(html).toContain('id="quick-qty-prod-test-01"');
      expect(html).toContain('id="quick-add-btn-prod-test-01"');
      expect(html).toContain('🛒 Thêm vào giỏ');
      expect(html).toContain('onclick="window.changeQuickAddQty(\'prod-test-01\', -1)"');
      expect(html).toContain('onclick="window.changeQuickAddQty(\'prod-test-01\', 1)"');
      expect(html).toContain('Xem chi tiết');
    });

    it('does NOT render fake color or size selectors when product has no configured variants', () => {
      const html = renderProductCard(mockProduct);

      expect(html).not.toContain('quick-colors');
      expect(html).not.toContain('quick-sizes');
    });

    it('renders color and size selectors ONLY when product has variants configured', () => {
      const variantProduct: Product = {
        ...mockProduct,
        id: 'prod-variant-02',
        colors: ['Xanh Navy', 'Trắng'],
        sizes: ['M', 'L', 'XL'],
      };

      const html = renderProductCard(variantProduct);

      expect(html).toContain('quick-colors');
      expect(html).toContain('quick-sizes');
      expect(html).toContain('Xanh Navy');
      expect(html).toContain('Trắng');
      expect(html).toContain('M');
      expect(html).toContain('L');
      expect(html).toContain('XL');
    });

    it('disables Quick Add and quantity buttons when product is out of stock', () => {
      const outOfStockProduct: Product = {
        ...mockProduct,
        id: 'prod-out-stock',
        stock_quantity: 0,
      };

      const html = renderProductCard(outOfStockProduct);

      expect(html).toContain('Tạm hết hàng');
      expect(html).toContain('Hết hàng');
      expect(html).toContain('disabled');
    });
  });

  describe('11.1 — Quick Add Cart Mechanics & Variant Merging', () => {
    it('adds item with quantity and updates cart', () => {
      const product = {
        id: 'p1',
        name: 'Vợt Q-Sport',
        price: 1000000,
        stock_quantity: 10,
      };

      const res = addToCart(product, 3);
      expect(res.success).toBe(true);

      const cart = getCart();
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(3);
      expect(cart[0].price).toBe(1000000);
    });

    it('merges identical variants and preserves distinct variants separately', () => {
      const productNavy = {
        id: 'p2',
        name: 'Áo Yonex',
        price: 300000,
        selected_color: 'Navy',
        selected_size: 'L',
        stock_quantity: 10,
      };

      const productWhite = {
        id: 'p2',
        name: 'Áo Yonex',
        price: 300000,
        selected_color: 'White',
        selected_size: 'L',
        stock_quantity: 10,
      };

      addToCart(productNavy, 2);
      addToCart(productWhite, 1);
      // Add Navy again
      addToCart(productNavy, 1);

      const cart = getCart();
      expect(cart).toHaveLength(2);

      const navyItem = cart.find(
        (i: CartItem) => i.selected_color === 'Navy' && i.selected_size === 'L'
      );
      const whiteItem = cart.find(
        (i: CartItem) => i.selected_color === 'White' && i.selected_size === 'L'
      );

      expect(navyItem).toBeDefined();
      expect(navyItem?.quantity).toBe(3); // 2 + 1
      expect(whiteItem).toBeDefined();
      expect(whiteItem?.quantity).toBe(1);
    });

    it('caps quantity at maximum available stock', () => {
      const product = {
        id: 'p3',
        name: 'Giày Yonex',
        price: 2000000,
        stock_quantity: 5,
      };

      addToCart(product, 3);
      const res = addToCart(product, 5); // Total would be 8 > 5

      expect(res.success).toBe(true);
      expect(res.message).toContain('giới hạn tồn kho');

      const cart = getCart();
      expect(cart[0].quantity).toBe(5);
    });
  });

  describe('11.2 — Telegram Order Alert Formatting & Escaping', () => {
    it('escapes dangerous HTML characters in user inputs', () => {
      const raw = '<b>Test & "Quotes" <script>alert(1)</script></b>';
      const escaped = escapeHtml(raw);

      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;b&gt;');
      expect(escaped).toContain('&amp;');
      expect(escaped).toContain('&quot;Quotes&quot;');
    });

    it('formats Telegram HTML alert with all required information', () => {
      const payload: TelegramOrderPayload = {
        order_code: 'QS-A1B2C3',
        customer_name: 'Nguyễn Văn A',
        customer_phone: '0987654321',
        shipping_address: '123 Nguyễn Trãi, Q1, TP. HCM',
        customer_note: 'Giao giờ hành chính',
        total_amount: 3450000,
        payment_method: 'COD',
        items: [
          { name: 'Vợt Cầu Lông Nanoflare', quantity: 2, price: 1500000 },
          { name: 'Quả Cầu Lòng VinaStar', quantity: 1, price: 450000 },
        ],
      };

      const message = formatTelegramOrderMessage(payload);

      expect(message).toContain('🛒 <b>THÔNG BÁO ĐƠN HÀNG MỚI</b>');
      expect(message).toContain('<b>Người mua hàng:</b> Nguyễn Văn A');
      expect(message).toContain('<b>Số điện thoại:</b> 0987654321');
      expect(message).toContain('<b>Mã đơn hàng:</b> QS-A1B2C3');
      expect(message).toContain('• Vợt Cầu Lông Nanoflare — 2 × 1.500.000 đ');
      expect(message).toContain('• Quả Cầu Lòng VinaStar — 1 × 450.000 đ');
      expect(message).toContain('<b>Tổng thành tiền:</b> 3.450.000 đ');
      expect(message).toContain('123 Nguyễn Trãi, Q1, TP. HCM');
      expect(message).toContain('<b>Ghi chú:</b> Giao giờ hành chính');
      expect(message).toContain('<b>Phương thức thanh toán:</b> Thanh toán COD');
    });

    it('handles empty note and empty phone gracefully', () => {
      const payload: TelegramOrderPayload = {
        order_code: 'QS-999999',
        customer_name: 'Trần Thị B',
        shipping_address: 'Quận 3',
        total_amount: 1000000,
        items: [{ name: 'Balo Yonex', quantity: 1, price: 1000000 }],
      };

      const message = formatTelegramOrderMessage(payload);

      expect(message).toContain('<b>Ghi chú:</b> Không có');
      expect(message).toContain('<b>Số điện thoại:</b> Không có');
    });
  });

  describe('11.2 — Telegram Alert Service Fail-Safe Dispatch', () => {
    it('dispatches alert to /api/telegram-alert with timeout signal', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, message: 'OK' }),
      });
      global.fetch = mockFetch;

      const result = await sendTelegramOrderAlert({
        order_code: 'QS-TEST',
        customer_name: 'Test Customer',
        shipping_address: 'Test Addr',
        total_amount: 500000,
        items: [],
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/telegram-alert',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(result.success).toBe(true);
    });

    it('never throws even if network or server errors out', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network failure'));
      global.fetch = mockFetch;

      const result = await sendTelegramOrderAlert({
        order_code: 'QS-FAIL',
        customer_name: 'Test Customer',
        shipping_address: 'Test Addr',
        total_amount: 500000,
        items: [],
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Lỗi mạng khi gửi thông báo Telegram');
    });

    it('completes order creation successfully even if Telegram alert fails', async () => {
      // Add item to cart
      addToCart({ id: 'p-order-test', name: 'Vợt Test', price: 500000 }, 1);

      // Mock fetch failure for Telegram
      global.fetch = vi.fn().mockRejectedValue(new Error('Telegram down'));

      const result = await createOrderCOD({
        customer_name: 'Khách hàng A',
        customer_phone: '0912345678',
        shipping_address: 'Hà Nội',
        customer_note: 'Giao nhanh',
      });

      expect(result.success).toBe(true);
      expect(result.order_code).toBeDefined();
      expect(result.total_amount).toBe(500000);
      expect(getCart()).toHaveLength(0); // Cart is cleared upon success
    });
  });
});
