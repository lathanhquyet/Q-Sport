import { describe, it, expect, beforeEach } from 'vitest';
import {
  signInAdmin,
  signOutAdmin,
  getCachedAdminSession,
} from '../../src/services/authService';
import {
  createProduct,
  updateProduct,
  toggleProductActive,
  toggleProductFeatured,
  softDeleteProduct,
} from '../../src/services/adminProductService';
import {
  fetchAdminOrders,
  fetchAdminOrderCounts,
  fetchAdminOrderItems,
  updateOrderStatus,
} from '../../src/services/adminOrderService';

describe('Phase 4 (P4) Admin Auth, Product CRUD & Order Management Tests', () => {
  beforeEach(async () => {
    await signOutAdmin();
  });

  describe('Admin Auth (authService)', () => {
    it('should reject login when email or password is empty', async () => {
      const res1 = await signInAdmin('', 'password123');
      expect(res1.success).toBe(false);
      expect(res1.message).toContain('email');

      const res2 = await signInAdmin('admin@qsport.vn', '');
      expect(res2.success).toBe(false);
      expect(res2.message).toContain('mật khẩu');
    });

    it('should reject login with wrong credentials', async () => {
      const res = await signInAdmin('wrong@qsport.vn', 'wrongpass');
      expect(res.success).toBe(false);
    });

    it('should successfully login with valid admin credentials in demo mode', async () => {
      const res = await signInAdmin('admin@qsport.vn', 'admin123');
      expect(res.success).toBe(true);
      expect(res.user?.email).toBe('admin@qsport.vn');

      const session = getCachedAdminSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe('admin@qsport.vn');
    });

    it('should clear admin session on logout', async () => {
      await signInAdmin('admin@qsport.vn', 'admin123');
      expect(getCachedAdminSession()).not.toBeNull();

      await signOutAdmin();
      expect(getCachedAdminSession()).toBeNull();
    });
  });

  describe('Admin Product CRUD (adminProductService)', () => {
    it('should reject product creation when required fields are missing or invalid', async () => {
      const res1 = await createProduct({
        name: '',
        category_id: 'cat-1',
        price: 100000,
        stock_quantity: 10,
      });
      expect(res1.success).toBe(false);
      expect(res1.message).toContain('Tên sản phẩm');

      const res2 = await createProduct({
        name: 'Vợt Test',
        category_id: '',
        price: 100000,
        stock_quantity: 10,
      });
      expect(res2.success).toBe(false);
      expect(res2.message).toContain('danh mục');

      const res3 = await createProduct({
        name: 'Vợt Test',
        category_id: 'cat-1',
        price: -500,
        stock_quantity: 10,
      });
      expect(res3.success).toBe(false);
      expect(res3.message).toContain('Giá');

      const res4 = await createProduct({
        name: 'Vợt Test',
        category_id: 'cat-1',
        price: 500000,
        stock_quantity: -5,
      });
      expect(res4.success).toBe(false);
      expect(res4.message).toContain('tồn kho');
    });

    it('should create product successfully', async () => {
      const res = await createProduct({
        name: 'Vợt Cầu Lông Q-Sport Master 9000',
        category_id: 'cat-vot',
        price: 2500000,
        stock_quantity: 15,
        short_description: 'Vợt cao cấp',
      });
      expect(res.success).toBe(true);
      expect(res.data?.name).toBe('Vợt Cầu Lông Q-Sport Master 9000');
    });

    it('should update product price and stock', async () => {
      const res = await updateProduct('p1', {
        price: 1800000,
        stock_quantity: 20,
      });
      expect(res.success).toBe(true);
    });

    it('should toggle active and featured states', async () => {
      const resActive = await toggleProductActive('p1', true);
      expect(resActive.success).toBe(true);

      const resFeatured = await toggleProductFeatured('p1', false);
      expect(resFeatured.success).toBe(true);
    });

    it('should soft delete product successfully', async () => {
      const res = await softDeleteProduct('p1');
      expect(res.success).toBe(true);
    });
  });

  describe('Admin Order Management (adminOrderService)', () => {
    it('should fetch admin orders and filter by status', async () => {
      const ordersAll = await fetchAdminOrders('ALL');
      expect(ordersAll.length).toBeGreaterThan(0);

      const ordersNew = await fetchAdminOrders('NEW');
      ordersNew.forEach(o => {
        expect(o.order_status).toBe('NEW');
      });
    });

    it('should fetch order snapshot items', async () => {
      const items = await fetchAdminOrderItems('ord-demo-1');
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].product_name_snapshot).toBeDefined();
    });

    it('should update order status to PROCESSING or SHIPPED', async () => {
      const res1 = await updateOrderStatus('ord-demo-1', 'PROCESSING');
      expect(res1.success).toBe(true);

      const res2 = await updateOrderStatus('ord-demo-1', 'SHIPPED');
      expect(res2.success).toBe(true);
    });

    it('should require a mandatory cancel reason when changing status to CANCELLED', async () => {
      const resNoReason = await updateOrderStatus('ord-demo-1', 'CANCELLED', '');
      expect(resNoReason.success).toBe(false);
      expect(resNoReason.message).toContain('lý do bắt buộc');

      const resWithReason = await updateOrderStatus('ord-demo-1', 'CANCELLED', 'Khách báo hủy do đổi địa chỉ');
      expect(resWithReason.success).toBe(true);
    });

    it('should calculate accurate order counts for ALL, NEW, PROCESSING, SHIPPED, CANCELLED filters', async () => {
      const counts = await fetchAdminOrderCounts();
      expect(counts).toBeDefined();
      expect(counts.ALL).toBeGreaterThanOrEqual(3);
      expect(counts.NEW).toBeGreaterThanOrEqual(1);
      expect(counts.PROCESSING).toBeGreaterThanOrEqual(1);
      expect(counts.CANCELLED).toBeGreaterThanOrEqual(1);
    });
  });
});
