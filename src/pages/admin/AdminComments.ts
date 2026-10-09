import { fetchAdminComments } from '../../services/commentService';

export async function renderAdminCommentsPage(statusFilter: string = 'ALL'): Promise<string> {
  const comments = await fetchAdminComments(statusFilter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return `<span style="background: #fef3c7; color: #b45309; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 0.75rem;">PENDING (Chờ duyệt)</span>`;
      case 'APPROVED':
        return `<span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 0.75rem;">APPROVED (Đã duyệt)</span>`;
      case 'HIDDEN':
        return `<span style="background: #fee2e2; color: #b91c1c; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 0.75rem;">HIDDEN (Đã ẩn)</span>`;
      default:
        return `<span style="background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 0.75rem;">${status}</span>`;
    }
  };

  const rowsHtml = comments
    .map(comment => {
      const formattedDate = new Date(comment.created_at).toLocaleString('vi-VN');

      return `
        <tr style="border-bottom: 1px solid var(--color-mint-line);">
          <td style="padding: 12px; font-size: 0.875rem;">
            <strong style="color: var(--color-court); font-size: 0.875rem; display: block;">
              ${comment.product_name || 'Sản phẩm Q-Sport'}
            </strong>
            <span style="font-size: 0.75rem; color: var(--color-muted);">${formattedDate}</span>
          </td>
          <td style="padding: 12px; font-size: 0.875rem;">
            <strong style="color: var(--color-ink); display: block;">${comment.display_name}</strong>
          </td>
          <td style="padding: 12px; font-size: 0.875rem; color: var(--color-ink); max-width: 320px; word-wrap: break-word;">
            ${comment.content}
          </td>
          <td style="padding: 12px; text-align: center;">
            ${getStatusBadge(comment.status)}
          </td>
          <td style="padding: 12px; text-align: right;">
            <div style="display: flex; gap: 6px; justify-content: flex-end; flex-wrap: wrap;">
              ${
                comment.status !== 'APPROVED'
                  ? `<button onclick="window.handleApproveComment('${comment.id}')" class="btn btn-primary" style="padding: 4px 8px; font-size: 0.75rem;">✅ Duyệt</button>`
                  : ''
              }
              ${
                comment.status !== 'HIDDEN'
                  ? `<button onclick="window.handleHideComment('${comment.id}')" class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.75rem;">👁️‍🗨️ Ẩn</button>`
                  : ''
              }
              <button
                onclick="window.handleDeleteComment('${comment.id}')"
                class="btn"
                style="padding: 4px 8px; font-size: 0.75rem; background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5;"
              >
                🗑️ Xóa
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  const filterButtons = [
    { key: 'ALL', label: 'Tất cả bình luận' },
    { key: 'PENDING', label: 'Chờ duyệt (PENDING)' },
    { key: 'APPROVED', label: 'Đã duyệt (APPROVED)' },
    { key: 'HIDDEN', label: 'Đã ẩn (HIDDEN)' },
  ];

  const filterBarHtml = filterButtons
    .map(
      btn => `
      <a
        href="/admin/comments?status=${btn.key}"
        data-link
        class="btn ${statusFilter === btn.key ? 'btn-primary' : 'btn-secondary'}"
        style="font-size: 0.8125rem; padding: 6px 14px;"
      >
        ${btn.label}
      </a>
    `
    )
    .join('');

  return `
    <div class="container" style="padding-top: var(--spacing-32); padding-bottom: var(--spacing-48);">
      <!-- Admin Sub-header Navigation -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-24); border-bottom: 2px solid var(--color-mint-line); padding-bottom: 12px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h1 style="font-family: var(--font-display); font-size: 2rem; color: var(--color-court); margin: 0;">
            💬 QUẢN LÝ BÌNH LUẬN (ADMIN)
          </h1>
          <span style="font-size: 0.875rem; color: var(--color-muted);">Hiển thị: ${comments.length} bình luận</span>
        </div>

        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <a href="/admin/products" data-link class="btn btn-secondary" style="font-size: 0.875rem;">
            🛠️ Quản lý sản phẩm
          </a>
          <a href="/admin/orders" data-link class="btn btn-secondary" style="font-size: 0.875rem;">
            📦 Quản lý đơn hàng
          </a>
          <button onclick="window.handleAdminLogout()" class="btn" style="background: #f1f5f9; color: var(--color-ink); font-size: 0.875rem;">
            🚪 Đăng xuất
          </button>
        </div>
      </div>

      <!-- Status Filter Tabs -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: var(--spacing-20);">
        ${filterBarHtml}
      </div>

      <!-- Comments Table -->
      <div class="card" style="padding: 0; overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: var(--color-mint); border-bottom: 2px solid var(--color-mint-line);">
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court);">SẢN PHẨM & NGÀY</th>
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court);">NGƯỜI GỬI</th>
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court);">NỘI DUNG BÌNH LUẬN</th>
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court); text-align: center;">TRẠNG THÁI</th>
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court); text-align: right;">THAO TÁC KIỂM DUYỆT</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || `<tr><td colspan="5" style="padding: 24px; text-align: center; color: var(--color-muted);">Không có bình luận nào trong danh mục này.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
