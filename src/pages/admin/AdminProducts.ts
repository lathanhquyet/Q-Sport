import { fetchAdminProducts } from '../../services/adminProductService';
import { getCategories } from '../../services/categoryService';
import { formatVND } from '../../utils/formatters';

export async function renderAdminProductsPage(): Promise<string> {
  const [products, categories] = await Promise.all([
    fetchAdminProducts(),
    getCategories(),
  ]);

  const categoryMap = new Map(categories.map(c => [c.id, c.name]));

  const categoryOptionsHtml = categories
    .map(c => `<option value="${c.id}">${c.name}</option>`)
    .join('');

  const rowsHtml = products.map(product => {
    const categoryName = categoryMap.get(product.category_id) || 'Chưa phân loại';
    const isActive = product.is_active;
    const isFeatured = product.is_featured;

    return `
      <tr style="border-bottom: 1px solid var(--color-mint-line);">
        <td style="padding: 12px; font-size: 0.875rem;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img
              src="${product.image_url || '/assets/products/placeholder.svg'}"
              alt="${product.name}"
              style="width: 44px; height: 44px; object-fit: contain; border-radius: var(--radius-control); background: #f8fafc; border: 1px solid var(--color-mint-line);"
              onerror="this.src='/assets/products/placeholder.svg';"
            />
            <div>
              <strong style="color: var(--color-ink); display: block;">${product.name}</strong>
              <span style="font-size: 0.75rem; color: var(--color-muted);">SKU: ${product.sku || 'N/A'}</span>
            </div>
          </div>
        </td>
        <td style="padding: 12px; font-size: 0.875rem;">
          <span style="background: var(--color-mint); padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; color: var(--color-court); font-weight: 600;">
            ${categoryName}
          </span>
        </td>
        <td style="padding: 12px; font-size: 0.875rem; font-weight: 700; color: var(--color-court);">
          ${formatVND(product.price)}
        </td>
        <td style="padding: 12px; font-size: 0.875rem;">
          <span style="font-weight: 600; color: ${product.stock_quantity > 0 ? 'var(--color-ink)' : 'var(--color-danger)'};">
            ${product.stock_quantity}
          </span>
        </td>
        <td style="padding: 12px; text-align: center;">
          <button
            onclick="window.handleToggleFeatured('${product.id}', ${isFeatured})"
            style="border: none; background: none; cursor: pointer; font-size: 1.25rem;"
            title="${isFeatured ? 'Đang nổi bật (Bấm để hủy)' : 'Chưa nổi bật (Bấm để chọn)'}"
          >
            ${isFeatured ? '⭐' : '☆'}
          </button>
        </td>
        <td style="padding: 12px; text-align: center;">
          <button
            onclick="window.handleToggleActive('${product.id}', ${isActive})"
            class="btn ${isActive ? 'btn-secondary' : 'btn-primary'}"
            style="padding: 4px 10px; font-size: 0.75rem;"
          >
            ${isActive ? '🟢 Đang bán' : '🔴 Ẩn/Ngừng'}
          </button>
        </td>
        <td style="padding: 12px; text-align: right;">
          <div style="display: flex; gap: 6px; justify-content: flex-end;">
            <button
              onclick="window.handleOpenEditProduct('${product.id}')"
              class="btn btn-secondary"
              style="padding: 4px 8px; font-size: 0.75rem;"
            >
              ✏️ Sửa
            </button>
            <button
              onclick="window.handleDeleteProduct('${product.id}', '${product.name.replace(/'/g, "\\'")}')"
              class="btn"
              style="padding: 4px 8px; font-size: 0.75rem; background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5;"
            >
              🗑️ Xóa
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="container" style="padding-top: var(--spacing-32); padding-bottom: var(--spacing-48);">
      <!-- Admin Sub-header Navigation -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-24); border-bottom: 2px solid var(--color-mint-line); padding-bottom: 12px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h1 style="font-family: var(--font-display); font-size: 2rem; color: var(--color-court); margin: 0;">
            🛠️ QUẢN LÝ SẢN PHẨM (ADMIN)
          </h1>
          <span style="font-size: 0.875rem; color: var(--color-muted);">Tổng số: ${products.length} sản phẩm</span>
        </div>

        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <a href="/admin/orders" data-link class="btn btn-secondary" style="font-size: 0.875rem;">
            📦 Quản lý đơn hàng
          </a>
          <a href="/admin/comments" data-link class="btn btn-secondary" style="font-size: 0.875rem;">
            💬 Quản lý bình luận
          </a>
          <button onclick="window.handleAdminLogout()" class="btn" style="background: #f1f5f9; color: var(--color-ink); font-size: 0.875rem;">
            🚪 Đăng xuất
          </button>
        </div>
      </div>

      <!-- Control Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-20);">
        <button onclick="window.handleOpenAddProductModal()" class="btn btn-primary" style="font-size: 0.9375rem;">
          ➕ Thêm sản phẩm mới
        </button>
      </div>

      <!-- Products Table -->
      <div class="card" style="padding: 0; overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: var(--color-mint); border-bottom: 2px solid var(--color-mint-line);">
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court);">SẢN PHẨM</th>
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court);">DANH MỤC</th>
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court);">GIÁ BÁN</th>
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court);">TỒN KHO</th>
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court); text-align: center;">NỔI BẬT</th>
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court); text-align: center;">TRẠNG THÁI</th>
              <th style="padding: 12px; font-size: 0.8125rem; font-weight: 700; color: var(--color-court); text-align: right;">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || `<tr><td colspan="7" style="padding: 24px; text-align: center; color: var(--color-muted);">Chưa có sản phẩm nào. Bấm "Thêm sản phẩm mới" để bắt đầu.</td></tr>`}
          </tbody>
        </table>
      </div>

      <!-- Add/Edit Product Modal Container -->
      <div id="product-modal-backdrop" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; padding: 16px;">
        <div class="card" style="width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; padding: var(--spacing-24); background: #fff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--color-mint-line); padding-bottom: 8px;">
            <h2 id="product-modal-title" style="font-family: var(--font-display); font-size: 1.375rem; color: var(--color-court); margin: 0;">THÊM SẢN PHẨM MỚI</h2>
            <button onclick="window.handleCloseProductModal()" style="border: none; background: none; font-size: 1.5rem; cursor: pointer;">✕</button>
          </div>

          <form id="product-modal-form" onsubmit="event.preventDefault(); window.handleSaveProductSubmit();">
            <input type="hidden" id="modal-product-id" value="" />

            <div style="margin-bottom: 12px;">
              <label style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 4px;">Tên sản phẩm (*)</label>
              <input id="modal-product-name" type="text" required placeholder="Ví dụ: Vợt Cầu Lông Q-Sport Power" style="width: 100%; padding: 8px 12px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line);" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div>
                <label style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 4px;">Danh mục (*)</label>
                <select id="modal-product-category" required style="width: 100%; padding: 8px 12px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line);">
                  ${categoryOptionsHtml}
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 4px;">Giá bán (VND) (*)</label>
                <input id="modal-product-price" type="number" min="0" required placeholder="1250000" style="width: 100%; padding: 8px 12px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line);" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div>
                <label style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 4px;">Số lượng tồn kho (*)</label>
                <input id="modal-product-stock" type="number" min="0" required placeholder="10" style="width: 100%; padding: 8px 12px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line);" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 4px;">Đường dẫn ảnh (Image URL)</label>
                <input id="modal-product-image" type="text" placeholder="/assets/products/placeholder.svg" style="width: 100%; padding: 8px 12px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line);" />
              </div>
            </div>

            <div style="margin-bottom: 12px;">
              <label style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 4px;">Mô tả ngắn</label>
              <input id="modal-product-short-desc" type="text" placeholder="Tóm tắt đặc điểm nổi bật" style="width: 100%; padding: 8px 12px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line);" />
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 4px;">Mô tả chi tiết</label>
              <textarea id="modal-product-desc" rows="3" placeholder="Chi tiết thông số kỹ thuật, chất liệu..." style="width: 100%; padding: 8px 12px; border-radius: var(--radius-control); border: 1px solid var(--color-mint-line);"></textarea>
            </div>

            <div style="display: flex; gap: 16px; margin-bottom: 16px;">
              <label style="display: flex; align-items: center; gap: 6px; font-size: 0.875rem; cursor: pointer;">
                <input id="modal-product-active" type="checkbox" checked /> Bật kinh doanh (is_active)
              </label>
              <label style="display: flex; align-items: center; gap: 6px; font-size: 0.875rem; cursor: pointer;">
                <input id="modal-product-featured" type="checkbox" /> Nổi bật (is_featured)
              </label>
            </div>

            <div id="modal-product-error" style="display: none; padding: 8px 12px; background: #fef2f2; border: 1px solid var(--color-danger); color: var(--color-danger); border-radius: var(--radius-control); font-size: 0.8125rem; margin-bottom: 12px;"></div>

            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" onclick="window.handleCloseProductModal()" class="btn btn-secondary">Hủy</button>
              <button type="submit" class="btn btn-primary">Lưu sản phẩm</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}
