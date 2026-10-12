import { fetchAdminNewOrdersCount } from './adminOrderService';
import { fetchAdminPendingCommentsCount } from './commentService';

export interface AdminBadgeCounts {
  newOrders: number;
  pendingComments: number;
}

export function formatBadgeCount(count: number): string {
  const safeCount = Math.max(0, Math.floor(count || 0));
  if (safeCount > 99) {
    return '99+';
  }
  return safeCount.toString();
}

let lastKnownCounts: AdminBadgeCounts = {
  newOrders: 0,
  pendingComments: 0,
};

/**
 * Safely fetches new orders count and pending comments count for Admin.
 * Keeps last known valid counts if a transient network failure occurs.
 */
export async function fetchAdminBadgeCounts(): Promise<AdminBadgeCounts> {
  try {
    const [newOrdersRes, pendingCommentsRes] = await Promise.allSettled([
      fetchAdminNewOrdersCount(),
      fetchAdminPendingCommentsCount(),
    ]);

    if (newOrdersRes.status === 'fulfilled' && typeof newOrdersRes.value === 'number') {
      lastKnownCounts.newOrders = Math.max(0, newOrdersRes.value);
    }

    if (pendingCommentsRes.status === 'fulfilled' && typeof pendingCommentsRes.value === 'number') {
      lastKnownCounts.pendingComments = Math.max(0, pendingCommentsRes.value);
    }

    return { ...lastKnownCounts };
  } catch {
    return { ...lastKnownCounts };
  }
}

/**
 * Updates badge DOM elements in-place without triggering full page re-render.
 * Does not update DOM if admin view is not active or user has navigated away.
 */
export async function updateAdminBadgesDom(providedCounts?: AdminBadgeCounts): Promise<void> {
  const ordersBadge = document.getElementById('admin-nav-orders-badge');
  const commentsBadge = document.getElementById('admin-nav-comments-badge');

  // Guard: If admin navigation elements are not mounted in DOM, do nothing
  if (!ordersBadge && !commentsBadge) {
    return;
  }

  // Guard: If window location has moved away from admin view, do nothing
  if (typeof window !== 'undefined' && window.location.pathname) {
    const currentPath = window.location.pathname;
    if (currentPath.length > 1 && (!currentPath.startsWith('/admin/') || currentPath === '/admin/login')) {
      return;
    }
  }

  const counts = providedCounts || (await fetchAdminBadgeCounts());

  // 1. Update Orders Badge
  const ordersLink = document.getElementById('admin-nav-orders-link');

  if (ordersBadge) {
    ordersBadge.textContent = formatBadgeCount(counts.newOrders);
    ordersBadge.setAttribute('data-count', counts.newOrders.toString());
    ordersBadge.style.background = counts.newOrders > 0 ? '#ef4444' : '#94a3b8';
    ordersBadge.style.opacity = counts.newOrders > 0 ? '1' : '0.75';
  }

  if (ordersLink) {
    ordersLink.setAttribute(
      'aria-label',
      `Quản lý đơn hàng, ${counts.newOrders} đơn hàng chưa xử lý`
    );
  }

  // 2. Update Comments Badge
  const commentsLink = document.getElementById('admin-nav-comments-link');

  if (commentsBadge) {
    commentsBadge.textContent = formatBadgeCount(counts.pendingComments);
    commentsBadge.setAttribute('data-count', counts.pendingComments.toString());
    commentsBadge.style.background = counts.pendingComments > 0 ? '#ef4444' : '#94a3b8';
    commentsBadge.style.opacity = counts.pendingComments > 0 ? '1' : '0.75';
  }

  if (commentsLink) {
    commentsLink.setAttribute(
      'aria-label',
      `Quản lý bình luận, ${counts.pendingComments} bình luận chưa xử lý`
    );
  }
}

let badgeWatcherInterval: any = null;

/**
 * Starts a single lightweight background timer to refresh badges periodically.
 * Does not spawn duplicate timers if already running.
 */
export function startAdminBadgeWatcher(intervalMs: number = 30000): void {
  if (badgeWatcherInterval) {
    return; // Already watching
  }

  // Initial immediate update
  updateAdminBadgesDom().catch(() => {});

  badgeWatcherInterval = setInterval(() => {
    updateAdminBadgesDom().catch(() => {});
  }, intervalMs);
}

/**
 * Stops and cleans up the badge watcher interval.
 */
export function stopAdminBadgeWatcher(): void {
  if (badgeWatcherInterval) {
    clearInterval(badgeWatcherInterval);
    badgeWatcherInterval = null;
  }
}

export function isAdminBadgeWatcherRunning(): boolean {
  return badgeWatcherInterval !== null;
}
