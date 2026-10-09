import { fetchAdminOrders, fetchAdminOrderCounts, OrderStatus } from '../../services/adminOrderService';
import { formatVND } from '../../utils/formatters';

export async function renderAdminOrdersPage(statusFilter: string = 'ALL'): Promise<string> {
  const [orders, counts] = await Promise.all([
    fetchAdminOrders(statusFilter),
    fetchAdminOrderCounts(),
  ]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'NEW':
        return `<span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 0.75rem;">NEW (Mới)</span>`;
      case 'PROCESSING':
        return `<span style="background: #fef3c7; color: #b45309; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 0.75rem;">PROCESSING (Đang xử lý)</span>`;
      case 'SHIPPED':
        return `<span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 0.75rem;">SHIPPED (Đã giao)</span>`;
      case 'CANCELLED':
        return `<span style="background: #fee2e2; color: #b91c1c; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 0.75rem;">CANCELLED (Đã hủy)</span>`;
      default:
        return `<span style="background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 0.75rem;">${status}</span>`;
    }
  };

  const rowsHtml = orders.map(order => {
    const formattedDate = new Date(order.created_at).toLocaleString('vi-VN');

    return `
      <tr style="border-bottom: 1px solid var(--color-mint-line);">
        <td style="padding: 12px; font-size: 0.875rem;">
          <strong style="font-family: var(--font-display); color: var(--color-court); font-size: 1.0625rem; display: block;">
            ${order.order_code}
          </strong>
          <span style="font-size: 0.75rem; color: var(--color-muted);">${formattedDate}</span>
        </td>
        <td style="padding: 12px; font-size: 0.875rem;">
          <strong style="color: var(--color-ink); display: block;">${order.customer_name}</strong>
          <span style="font-size: 0.75rem; color: var(--color-muted);">SĐT: ${order.customer_phone}</span>
        </td>
        <td style="padding: 12px; font-size: 0.8125rem; color: var(--color-ink); max-width: 220px; word-wrap: break-word;">
          ${order.shipping_address}
          ${order.customer_note ? `<div style="font-size: 0.75rem; color: var(--color-muted); font-style: italic; margin-top: 2px;">Note: ${order.customer_note}</div>` : ''}
        </td>
        <td style="padding: 12px; font-size: 0.9375rem; font-weight: 700; color: var(--color-court);">
          ${formatVND(order.total_amount)}
        </td>
        <td style="padding: 12px; text-align: center;">
          ${getStatusBadge(order.order_status)}
          ${order.cancel_reason ? `<div style="font-size: 0.75rem; color: #b91c1c; margin-top: 4px;">Lý do: ${order.cancel_reason}</div>` : ''}
        </td>
        <td style="padding: 12px; text-align: right;">
          <div style="display: flex; gap: 6px; justify-content: flex-end;">
            <button
              onclick="window.handleViewOrderDetail('${order.id}', '${order.order_code}')"
              class="btn btn-secondary"
              style="padding: 4px 10px; font-size: 0.75rem;"
            >
              👁️ Chi tiết
            </button>
            <button
              onclick="window.handleOpenChangeOrderStatus('${order.id}', '${order.order_code}', '${order.order_status}')"
              class="btn btn-primary"
              style="padding: 4px 10px; font-size: 0.75rem;"
            >
              ⚙️ Đổi trạng thái
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  const filterButtons = [
    { key: 'ALL', label: 'Tất cả đơn', count: counts.ALL || 0 },
    { key: 'NEW', label: 'Mới (NEW)', count: counts.NEW || 0 },
    { key: 'PROCESSING', label: 'Đang xử lý', count: counts.PROCESSING || 0 },
    { key: 'SHIPPED', label: 'Đã giao', count: counts.SHIPPED || 0 },
    { key: 'CANCELLED', label: 'Đã hủy', count: counts.CANCELLED || 0 },
  ];

  const filterBarHtml = filterButtons
    .map(
      btn => `
      <a
        href="/admin/orders?status=${btn.key}"
        data-link
        class="btn ${statusFilter === btn.key ? 'btn-primary' : 'btn-secondary'}"
        style="font-size: 0.8125rem; padding: 6px 14px; display: inline-flex; align-items: center; gap: 6px; border-radius: var(--radius-pill);"
      >
        <span>${btn.label}</span>
        <span class="order-count-badge" style="background: ${statusFilter === btn.key ? 'var(--color-white)' : 'var(--color-mint)'}; color: ${statusFilter === btn.key ? 'var(--color-court)' : 'var(--color-court)'}; border-radius: 999px; padding: 1px 7px; font-size: 0.75rem; font-weight: 700;">
          ${btn.count}
        </span>
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
            📦 QUẢN LÝ ĐƠN HÀNG (ADMIN)
          </h1>
          <span style="font-size: 0.875rem; color: var(--color-muted);">Hiển thị: ${orders.length} đơn hàng trong danh mục</span>
        </div>

        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <a href="/admin/products" data-link class="btn btn-secondary" style="font-size: 0.875rem;">
            🛠️ Quản lý sản phẩm
          </a>
          <a href="/admin/comments" data-link class="btn btn-secondary" style="font-size: 0.875rem;">
            💬 Quản lý bình luận
          </a>
          <button onclick="window.handleAdminLogout()" class="btn" style="background: #f1f5f9; color: var(--color-ink); font-size: 0.875rem;">
            🚪 Đăng xuất
          </button>
        </div>
      </div>

      <!-- Status Filter Tabs with Counts -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: var(--spacing-20); overflow-x: auto; padding-bottom: 4px;">
        ${filterBarHtml}
      </div>

      <!-- Orders Table -->
      <div class="card" style="padding: 0; overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: var(--color-mint); border-bottom: 2px solid var(--color-mint-line);">
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court);">MÃ ĐƠN & NGÀY</th>
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court);">KHÁCH HÀNG</th>
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court);">ĐỊA CHỈ GIAO</th>
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court);">TỔNG TIỀN</th>
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court); text-align: center;">TRẠNG THÁI</th>
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court); text-align: right;">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || `<tr><td colspan="6" style="padding: 24px; text-align: center; color: var(--color-muted);">Không có đơn hàng nào trong trạng thái này.</td></tr>`}
          </tbody>
        </table>
      </div>

      <!-- Order Detail Modal Container -->
      <div id="order-detail-modal-backdrop" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; padding: 16px;">
        <div class="card" style="width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; padding: var(--spacing-24); background: #fff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--color-mint-line); padding-bottom: 8px;">
            <h2 id="order-detail-modal-title" style="font-family: var(--font-display); font-size: 1.375rem; color: var(--color-court); margin: 0;">CHI TIẾT ĐƠN HÀNG</h2>
            <button onclick="window.handleCloseOrderDetailModal()" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">✕</button>
          </div>
          <div id="order-detail-modal-body">
            <!-- Items loaded dynamically -->
          </div>
        </div>
      </div>

      <!-- Update Order Status Modal Container -->
      <div id="order-status-modal-backdrop" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; padding: 16px;">
        <div class="card" style="width: 100%; max-width: 480px; padding: var(--spacing-24); background: #fff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--color-mint-line); padding-bottom: 8px;">
            <h2 id="order-status-modal-title" style="font-family: var(--font-display); font-size: 1.375rem; color: var(--color-court); margin: 0;">CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG</h2>
            <button onclick="window.handleCloseOrderStatusModal()" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">✕</button>
          </div>

          <form id="order-status-form" onsubmit="event.preventDefault(); window.handleSaveOrderStatusSubmit();">
            <input type="hidden" id="status-order-id" value="" />

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 6px;">Chọn trạng thái mới (*)</label>
              <select id="status-select" onchange="window.handleStatusSelectChange(this.value)" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line); font-size: 0.9375rem;">
                <option value="NEW">NEW (Đơn mới)</option>
                <option value="PROCESSING">PROCESSING (Đang đóng gói/xử lý)</option>
                <option value="SHIPPED">SHIPPED (Đã giao hàng)</option>
                <option value="CANCELLED">CANCELLED (Hủy đơn hàng)</option>
              </select>
            </div>

            <!-- Mandatory Cancel Reason Input (only shown when CANCELLED is selected) -->
            <div id="cancel-reason-container" style="display: none; margin-bottom: 16px;">
              <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-danger); margin-bottom: 6px;">
                Lý do hủy đơn hàng (Bắt buộc) (*)
              </label>
              <textarea id="cancel-reason-input" rows="3" placeholder="Nhập lý do khách hủy hoặc hết hàng..." style="width: 100%; padding: 10px 14px; border-radius: var(--radius-control); border: 1px solid var(--color-danger); font-size: 0.9375rem;"></textarea>
            </div>

            <div id="status-error-box" style="display: none; padding: 10px; background: #fef2f2; border: 1px solid var(--color-danger); color: var(--color-danger); border-radius: var(--radius-control); font-size: 0.8125rem; margin-bottom: 14px;"></div>

            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" onclick="window.handleCloseOrderStatusModal()" class="btn btn-secondary">Hủy</button>
              <button type="submit" class="btn btn-primary">Lưu trạng thái</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}
