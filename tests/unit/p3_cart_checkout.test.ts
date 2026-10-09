import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getCartSubtotal,
  getCartTotalCount,
} from '../../src/services/cartService';
import { validateVietnamesePhone, createOrderCOD } from '../../src/services/orderService';

describe('Phase 3 (P3) Cart & COD Checkout Tests', () => {
  beforeEach(() => {
    clearCart();
  });

  describe('Cart Operations (cartService)', () => {
    it('should start with an empty cart', () => {
      expect(getCart()).toEqual([]);
      expect(getCartSubtotal()).toBe(0);
      expect(getCartTotalCount()).toBe(0);
    });

    it('should add item to cart and calculate correct count and subtotal', () => {
      const res = addToCart({
        id: 'p1',
        name: 'Vợt Q-Sport Test',
        price: 1000000,
        stock_quantity: 10,
      }, 2);

      expect(res.success).toBe(true);
      const cart = getCart();
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(2);
      expect(getCartTotalCount()).toBe(2);
      expect(getCartSubtotal()).toBe(2000000);
    });

    it('should increment quantity if adding same item twice', () => {
      addToCart({ id: 'p1', name: 'Vợt Q-Sport', price: 500000, stock_quantity: 10 }, 1);
      addToCart({ id: 'p1', name: 'Vợt Q-Sport', price: 500000, stock_quantity: 10 }, 3);

      const cart = getCart();
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(4);
      expect(getCartSubtotal()).toBe(2000000);
    });

    it('should respect stock quantity limit when adding to cart', () => {
      const res = addToCart({ id: 'p1', name: 'Giày Q-Sport', price: 800000, stock_quantity: 3 }, 5);
      expect(res.success).toBe(true);
      const cart = getCart();
      expect(cart[0].quantity).toBe(3);
    });

    it('should update cart item quantity', () => {
      addToCart({ id: 'p1', name: 'Áo Q-Sport', price: 200000, stock_quantity: 10 }, 2);
      updateCartQuantity('p1', 5);

      const cart = getCart();
      expect(cart[0].quantity).toBe(5);
      expect(getCartSubtotal()).toBe(1000000);
    });

    it('should remove item if updated quantity is 0 or negative', () => {
      addToCart({ id: 'p1', name: 'Quần Q-Sport', price: 150000, stock_quantity: 10 }, 2);
      updateCartQuantity('p1', 0);

      expect(getCart()).toEqual([]);
    });

    it('should remove specific item from cart', () => {
      addToCart({ id: 'p1', name: 'Mặt hàng 1', price: 100000, stock_quantity: 10 }, 1);
      addToCart({ id: 'p2', name: 'Mặt hàng 2', price: 200000, stock_quantity: 10 }, 1);

      removeFromCart('p1');
      const cart = getCart();
      expect(cart).toHaveLength(1);
      expect(cart[0].product_id).toBe('p2');
    });

    it('should clear all items from cart', () => {
      addToCart({ id: 'p1', name: 'Mặt hàng 1', price: 100000, stock_quantity: 10 }, 1);
      addToCart({ id: 'p2', name: 'Mặt hàng 2', price: 200000, stock_quantity: 10 }, 1);

      clearCart();
      expect(getCart()).toEqual([]);
      expect(getCartTotalCount()).toBe(0);
    });
  });

  describe('Checkout Phone Validation (orderService)', () => {
    it('should validate valid Vietnamese 10-digit phone numbers', () => {
      expect(validateVietnamesePhone('0987654321')).toBe(true);
      expect(validateVietnamesePhone('0398765432')).toBe(true);
      expect(validateVietnamesePhone('0771234567')).toBe(true);
      expect(validateVietnamesePhone('0861234567')).toBe(true);
      expect(validateVietnamesePhone('0581234567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validateVietnamesePhone('')).toBe(false);
      expect(validateVietnamesePhone('123456')).toBe(false);
      expect(validateVietnamesePhone('098765432101')).toBe(false);
      expect(validateVietnamesePhone('abc0987654')).toBe(false);
      expect(validateVietnamesePhone('1987654321')).toBe(false);
    });
  });

  describe('COD Checkout & RPC Contract (orderService)', () => {
    it('should reject checkout when customer name is missing', async () => {
      addToCart({ id: 'p1', name: 'Vợt Test', price: 500000 }, 1);
      const res = await createOrderCOD({
        customer_name: '',
        customer_phone: '0987654321',
        shipping_address: '123 Thủ Đức',
      });

      expect(res.success).toBe(false);
      expect(res.message).toContain('họ và tên');
    });

    it('should reject checkout when phone is invalid', async () => {
      addToCart({ id: 'p1', name: 'Vợt Test', price: 500000 }, 1);
      const res = await createOrderCOD({
        customer_name: 'Nguyễn Văn A',
        customer_phone: '12345',
        shipping_address: '123 Thủ Đức',
      });

      expect(res.success).toBe(false);
      expect(res.message).toContain('Số điện thoại không đúng định dạng');
    });

    it('should reject checkout when shipping address is missing', async () => {
      addToCart({ id: 'p1', name: 'Vợt Test', price: 500000 }, 1);
      const res = await createOrderCOD({
        customer_name: 'Nguyễn Văn A',
        customer_phone: '0987654321',
        shipping_address: '',
      });

      expect(res.success).toBe(false);
      expect(res.message).toContain('địa chỉ nhận hàng');
    });

    it('should reject checkout when cart is empty', async () => {
      const res = await createOrderCOD({
        customer_name: 'Nguyễn Văn A',
        customer_phone: '0987654321',
        shipping_address: '56/1 Đ. Số 2, Thủ Đức',
      });

      expect(res.success).toBe(false);
      expect(res.message).toContain('Giỏ hàng của bạn đang trống');
    });

    it('should successfully place COD order, clear cart, and return order code QS-XXXXXX', async () => {
      addToCart({ id: 'p1', name: 'Vợt Q-Sport Pro Attack 100', price: 1450000 }, 2);

      const res = await createOrderCOD({
        customer_name: 'Lã Thành Quyết',
        customer_phone: '0987654321',
        shipping_address: '56/1 Đ. Số 2, Thủ Đức, Hồ Chí Minh',
        customer_note: 'Giao ngoài giờ hành chính',
      });

      expect(res.success).toBe(true);
      expect(res.order_code).toMatch(/^QS-[A-Z0-9]{6}$/);
      expect(res.total_amount).toBe(2900000);
      // Cart should be automatically cleared on success
      expect(getCart()).toEqual([]);
    });
  });
});
