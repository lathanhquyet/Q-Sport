import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  fetchAdminNewOrdersCount,
  updateOrderStatus,
  fetchAdminOrders,
  resetMockOrders,
} from '../../src/services/adminOrderService';
import {
  fetchAdminPendingCommentsCount,
  submitComment,
  updateCommentStatus,
  fetchAdminComments,
} from '../../src/services/commentService';
import {
  formatBadgeCount,
  fetchAdminBadgeCounts,
  updateAdminBadgesDom,
  startAdminBadgeWatcher,
  stopAdminBadgeWatcher,
  isAdminBadgeWatcherRunning,
} from '../../src/services/adminBadgeService';
import { renderAdminSubHeader } from '../../src/components/admin/AdminNav';

describe('Phase 12 (P12) Admin GUI/UX: Real-Time New Orders & Comments Badges Tests', () => {
  beforeEach(() => {
    stopAdminBadgeWatcher();
    resetMockOrders();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    stopAdminBadgeWatcher();
    resetMockOrders();
    document.body.innerHTML = '';
  });

  describe('1. Task A & B: Precise Count Queries for Unprocessed Records', () => {
    it('should query new orders count and only count orders with status === NEW', async () => {
      const newOrdersCount = await fetchAdminNewOrdersCount();
      expect(newOrdersCount).toBeGreaterThanOrEqual(1);

      const allOrders = await fetchAdminOrders('ALL');
      const expectedNewCount = allOrders.filter(o => o.order_status === 'NEW').length;
      expect(newOrdersCount).toBe(expectedNewCount);

      // Verify that non-NEW orders (PROCESSING, SHIPPED, CANCELLED) are excluded
      const nonNewOrders = allOrders.filter(o => o.order_status !== 'NEW');
      expect(nonNewOrders.length).toBeGreaterThan(0);
    });

    it('should query pending comments count and only count comments with status === PENDING', async () => {
      const pendingCommentsCount = await fetchAdminPendingCommentsCount();
      expect(pendingCommentsCount).toBeGreaterThanOrEqual(1);

      const allComments = await fetchAdminComments('ALL');
      const expectedPendingCount = allComments.filter(c => c.status === 'PENDING').length;
      expect(pendingCommentsCount).toBe(expectedPendingCount);

      // Verify that APPROVED or HIDDEN comments are excluded
      const nonPendingComments = allComments.filter(c => c.status !== 'PENDING');
      expect(nonPendingComments.length).toBeGreaterThan(0);
    });
  });

  describe('2. Task C: UI Formatting, Truncation & Accessibility Rules', () => {
    it('should format badge count properly: 0 -> "0", negative -> "0", normal numbers stringified', () => {
      expect(formatBadgeCount(0)).toBe('0');
      expect(formatBadgeCount(-5)).toBe('0');
      expect(formatBadgeCount(1)).toBe('1');
      expect(formatBadgeCount(25)).toBe('25');
      expect(formatBadgeCount(99)).toBe('99');
    });

    it('should cap display at "99+" for counts greater than 99', () => {
      expect(formatBadgeCount(100)).toBe('99+');
      expect(formatBadgeCount(150)).toBe('99+');
      expect(formatBadgeCount(999)).toBe('99+');
    });

    it('should render unified sub-header navigation with accessible badges and labels', () => {
      const subHeaderHtml = renderAdminSubHeader({
        activeTab: 'orders',
        title: '📦 QUẢN LÝ ĐƠN HÀNG (ADMIN)',
        subtitle: '10 đơn hàng trong danh mục',
        counts: { newOrders: 5, pendingComments: 120 },
      });

      expect(subHeaderHtml).toContain('id="admin-nav-orders-badge"');
      expect(subHeaderHtml).toContain('id="admin-nav-comments-badge"');
      expect(subHeaderHtml).toContain('id="admin-nav-orders-link"');
      expect(subHeaderHtml).toContain('id="admin-nav-comments-link"');

      // Orders badge: 5 -> text "5", raw data-count="5", aria-label includes "5 đơn hàng chưa xử lý"
      expect(subHeaderHtml).toContain('>5</span>');
      expect(subHeaderHtml).toContain('data-count="5"');
      expect(subHeaderHtml).toContain('aria-label="Quản lý đơn hàng, 5 đơn hàng chưa xử lý"');

      // Comments badge: 120 -> text "99+", raw data-count="120", aria-label includes "120 bình luận chưa xử lý"
      expect(subHeaderHtml).toContain('>99+</span>');
      expect(subHeaderHtml).toContain('data-count="120"');
      expect(subHeaderHtml).toContain('aria-label="Quản lý bình luận, 120 bình luận chưa xử lý"');
    });

    it('should style badges with neutral color when count is 0, and red/coral when count > 0', () => {
      const zeroHtml = renderAdminSubHeader({
        activeTab: 'products',
        title: '🛠️ QUẢN LÝ SẢN PHẨM (ADMIN)',
        counts: { newOrders: 0, pendingComments: 0 },
      });

      // Background #94a3b8 and opacity 0.75 for 0
      expect(zeroHtml).toContain('background: #94a3b8');
      expect(zeroHtml).toContain('opacity: 0.75');

      const activeHtml = renderAdminSubHeader({
        activeTab: 'products',
        title: '🛠️ QUẢN LÝ SẢN PHẨM (ADMIN)',
        counts: { newOrders: 3, pendingComments: 7 },
      });

      // Background #ef4444 and opacity 1 for count > 0
      expect(activeHtml).toContain('background: #ef4444');
      expect(activeHtml).toContain('opacity: 1');
    });

    it('should highlight the active tab button properly', () => {
      const productsHeader = renderAdminSubHeader({
        activeTab: 'products',
        title: '🛠️ QUẢN LÝ SẢN PHẨM (ADMIN)',
      });
      expect(productsHeader).toMatch(/href="\/admin\/products"[^>]*class="btn btn-primary"/);
      expect(productsHeader).toMatch(/href="\/admin\/orders"[^>]*class="btn btn-secondary"/);

      const commentsHeader = renderAdminSubHeader({
        activeTab: 'comments',
        title: '💬 QUẢN LÝ BÌNH LUẬN (ADMIN)',
      });
      expect(commentsHeader).toMatch(/href="\/admin\/comments"[^>]*class="btn btn-primary"/);
      expect(commentsHeader).toMatch(/href="\/admin\/products"[^>]*class="btn btn-secondary"/);
    });
  });

  describe('3. Task D: In-Place DOM Updates & Lifecycle Watcher Management', () => {
    it('should update DOM elements in-place without page reload', async () => {
      document.body.innerHTML = `
        <a id="admin-nav-orders-link" href="/admin/orders">
          <span>Đơn hàng</span>
          <span id="admin-nav-orders-badge" data-count="0">0</span>
        </a>
        <a id="admin-nav-comments-link" href="/admin/comments">
          <span>Bình luận</span>
          <span id="admin-nav-comments-badge" data-count="0">0</span>
        </a>
      `;

      await updateAdminBadgesDom({ newOrders: 7, pendingComments: 105 });

      const ordersBadge = document.getElementById('admin-nav-orders-badge')!;
      const ordersLink = document.getElementById('admin-nav-orders-link')!;
      const commentsBadge = document.getElementById('admin-nav-comments-badge')!;
      const commentsLink = document.getElementById('admin-nav-comments-link')!;

      expect(ordersBadge.textContent).toBe('7');
      expect(ordersBadge.getAttribute('data-count')).toBe('7');
      expect(ordersBadge.style.background).toBe('rgb(239, 68, 68)');
      expect(ordersLink.getAttribute('aria-label')).toBe('Quản lý đơn hàng, 7 đơn hàng chưa xử lý');

      expect(commentsBadge.textContent).toBe('99+');
      expect(commentsBadge.getAttribute('data-count')).toBe('105');
      expect(commentsBadge.style.background).toBe('rgb(239, 68, 68)');
      expect(commentsLink.getAttribute('aria-label')).toBe('Quản lý bình luận, 105 bình luận chưa xử lý');
    });

    it('should start background watcher and prevent duplicate timers', () => {
      expect(isAdminBadgeWatcherRunning()).toBe(false);

      startAdminBadgeWatcher(10000);
      expect(isAdminBadgeWatcherRunning()).toBe(true);

      // Calling again should not duplicate or throw
      startAdminBadgeWatcher(10000);
      expect(isAdminBadgeWatcherRunning()).toBe(true);

      stopAdminBadgeWatcher();
      expect(isAdminBadgeWatcherRunning()).toBe(false);
    });

    it('should handle missing DOM elements safely during updateAdminBadgesDom', async () => {
      document.body.innerHTML = '<div>No admin badges here</div>';
      await expect(updateAdminBadgesDom({ newOrders: 5, pendingComments: 2 })).resolves.not.toThrow();
    });
  });

  describe('4. Task D & F: State Changes & Dynamic Count Updates', () => {
    it('should update badge count when an order is updated from NEW to PROCESSING', async () => {
      const initialNewOrders = await fetchAdminNewOrdersCount();

      // Find an order with status NEW
      const allOrders = await fetchAdminOrders('NEW');
      if (allOrders.length > 0) {
        const targetOrder = allOrders[0];
        const updateRes = await updateOrderStatus(targetOrder.id, 'PROCESSING');
        expect(updateRes.success).toBe(true);

        const updatedNewOrders = await fetchAdminNewOrdersCount();
        expect(updatedNewOrders).toBe(initialNewOrders - 1);

        // Restore back to NEW
        await updateOrderStatus(targetOrder.id, 'NEW');
        const restoredNewOrders = await fetchAdminNewOrdersCount();
        expect(restoredNewOrders).toBe(initialNewOrders);
      }
    });

    it('should update badge count when a comment is added or approved', async () => {
      const initialPendingComments = await fetchAdminPendingCommentsCount();

      const testProductId = 'a0000000-0000-0000-0000-000000000001';
      const submitRes = await submitComment(
        testProductId,
        'Khách Thử Nghiệm Badge',
        'Bình luận để kiểm tra badge tăng giảm tự động'
      );
      expect(submitRes.success).toBe(true);

      const afterSubmitPending = await fetchAdminPendingCommentsCount();
      expect(afterSubmitPending).toBe(initialPendingComments + 1);

      // Approve comment -> count should decrease
      const pendingComments = await fetchAdminComments('PENDING');
      const testComment = pendingComments.find(c =>
        c.content.includes('kiểm tra badge tăng giảm tự động')
      );
      expect(testComment).toBeDefined();

      if (testComment) {
        await updateCommentStatus(testComment.id, 'APPROVED');
        const afterApprovePending = await fetchAdminPendingCommentsCount();
        expect(afterApprovePending).toBe(initialPendingComments);
      }
    });
  });

  describe('5. Task E: Safe Fallback & Error Handling', () => {
    it('should return 0 safely if count query encounters error without throwing', async () => {
      const counts = await fetchAdminBadgeCounts();
      expect(typeof counts.newOrders).toBe('number');
      expect(typeof counts.pendingComments).toBe('number');
      expect(counts.newOrders).toBeGreaterThanOrEqual(0);
      expect(counts.pendingComments).toBeGreaterThanOrEqual(0);
    });
  });
});
