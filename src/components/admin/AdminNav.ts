import { AdminBadgeCounts, formatBadgeCount } from '../../services/adminBadgeService';

export interface AdminSubHeaderOptions {
  activeTab: 'products' | 'orders' | 'comments' | 'news';
  title: string;
  subtitle?: string;
  counts?: AdminBadgeCounts;
}

export function renderAdminSubHeader(options: AdminSubHeaderOptions): string {
  const { activeTab, title, subtitle, counts = { newOrders: 0, pendingComments: 0 } } = options;

  const ordersCountText = formatBadgeCount(counts.newOrders);
  const commentsCountText = formatBadgeCount(counts.pendingComments);

  const ordersBadgeBg = counts.newOrders > 0 ? '#ef4444' : '#94a3b8';
  const commentsBadgeBg = counts.pendingComments > 0 ? '#ef4444' : '#94a3b8';

  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-24); border-bottom: 2px solid var(--color-mint-line); padding-bottom: 12px; flex-wrap: wrap; gap: 12px;">
      <div>
        <h1 style="font-family: var(--font-display); font-size: 2rem; color: var(--color-court); margin: 0;">
          ${title}
        </h1>
        ${
          subtitle
            ? `<span style="font-size: 0.875rem; color: var(--color-muted);">${subtitle}</span>`
            : ''
        }
      </div>

      <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <a
          href="/admin/products"
          data-link
          class="btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}"
          style="font-size: 0.875rem;"
        >
          🛠️ Quản lý sản phẩm
        </a>

        <a
          id="admin-nav-orders-link"
          href="/admin/orders"
          data-link
          class="btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}"
          style="font-size: 0.875rem; display: inline-flex; align-items: center;"
          aria-label="Quản lý đơn hàng, ${counts.newOrders} đơn hàng chưa xử lý"
        >
          <span>📦 Quản lý đơn hàng</span>
          <span
            id="admin-nav-orders-badge"
            class="admin-nav-badge"
            data-count="${counts.newOrders}"
            style="background: ${ordersBadgeBg}; color: #ffffff; font-size: 0.6875rem; font-weight: 700; padding: 1px 6px; border-radius: 9999px; min-width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; line-height: 1; margin-left: 6px; opacity: ${
              counts.newOrders > 0 ? '1' : '0.75'
            }; box-shadow: 0 1px 2px rgba(0,0,0,0.12);"
          >${ordersCountText}</span>
        </a>

        <a
          id="admin-nav-comments-link"
          href="/admin/comments"
          data-link
          class="btn ${activeTab === 'comments' ? 'btn-primary' : 'btn-secondary'}"
          style="font-size: 0.875rem; display: inline-flex; align-items: center;"
          aria-label="Quản lý bình luận, ${counts.pendingComments} bình luận chưa xử lý"
        >
          <span>💬 Quản lý bình luận</span>
          <span
            id="admin-nav-comments-badge"
            class="admin-nav-badge"
            data-count="${counts.pendingComments}"
            style="background: ${commentsBadgeBg}; color: #ffffff; font-size: 0.6875rem; font-weight: 700; padding: 1px 6px; border-radius: 9999px; min-width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; line-height: 1; margin-left: 6px; opacity: ${
              counts.pendingComments > 0 ? '1' : '0.75'
            }; box-shadow: 0 1px 2px rgba(0,0,0,0.12);"
          >${commentsCountText}</span>
        </a>

        <a
          href="/admin/news"
          data-link
          class="btn ${activeTab === 'news' ? 'btn-primary' : 'btn-secondary'}"
          style="font-size: 0.875rem;"
        >
          📰 Quản lý Tin nội bộ
        </a>

        <button
          onclick="window.handleAdminLogout()"
          class="btn"
          style="background: #f1f5f9; color: var(--color-ink); font-size: 0.875rem;"
        >
          🚪 Đăng xuất
        </button>
      </div>
    </div>
  `;
}
