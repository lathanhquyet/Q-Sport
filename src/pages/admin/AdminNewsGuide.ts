import { INTERNAL_NEWS_VIDEOS } from '../../data/internalNews';
import { renderAdminSubHeader } from '../../components/admin/AdminNav';
import { AdminBadgeCounts } from '../../services/adminBadgeService';

export function renderAdminNewsGuidePage(counts?: AdminBadgeCounts): string {
  const videoRowsHtml = INTERNAL_NEWS_VIDEOS.map(v => `
    <tr style="border-bottom: 1px solid var(--color-mint-line);">
      <td style="padding: 12px; font-size: 0.8125rem; font-family: monospace; font-weight: 600;">${v.id}</td>
      <td style="padding: 12px; font-size: 0.875rem;">
        <strong>${v.title}</strong>
        <div style="font-size: 0.75rem; color: var(--color-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px;">
          ${v.youtubeUrl}
        </div>
      </td>
      <td style="padding: 12px; font-size: 0.8125rem; text-align: center;">${v.order}</td>
      <td style="padding: 12px; font-size: 0.8125rem; text-align: center;">
        <span style="padding: 3px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; background: ${v.isVisible ? '#dcfce7' : '#fee2e2'}; color: ${v.isVisible ? '#15803d' : '#b91c1c'};">
          ${v.isVisible ? '🟢 Hiển thị' : '⚪ Ẩn'}
        </span>
      </td>
      <td style="padding: 12px; font-size: 0.8125rem; text-align: right;">
        <a href="${v.youtubeUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 0.75rem; padding: 4px 8px; min-height: 28px;">
          Xem URL ↗
        </a>
      </td>
    </tr>
  `).join('');

  return `
    <div class="container" style="padding-top: var(--spacing-32); padding-bottom: var(--spacing-72);">
      ${renderAdminSubHeader({
        activeTab: 'news',
        title: '📰 QUẢN LÝ TIN NỘI BỘ (CODE-CONFIG)',
        subtitle: 'Cấu hình video YouTube qua source code TypeScript',
        counts,
      })}

      <!-- Current Video List Table -->
      <div class="card" style="margin-bottom: var(--spacing-32); padding: 0; overflow-x: auto;">
        <div style="padding: 16px; background: var(--color-mint); border-bottom: 1px solid var(--color-mint-line);">
          <strong style="color: var(--color-court); font-size: 1rem;">DANH SÁCH VIDEO ĐANG CẤU HÌNH TRONG CODE (${INTERNAL_NEWS_VIDEOS.length} VIDEOS)</strong>
        </div>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 2px solid var(--color-mint-line); font-size: 0.8125rem; color: var(--color-court);">
              <th style="padding: 10px 12px;">ID</th>
              <th style="padding: 10px 12px;">TIÊU ĐỀ &amp; URL</th>
              <th style="padding: 10px 12px; text-align: center;">THỨ TỰ</th>
              <th style="padding: 10px 12px; text-align: center;">TRẠNG THÁI</th>
              <th style="padding: 10px 12px; text-align: right;">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            ${videoRowsHtml}
          </tbody>
        </table>
      </div>

      <!-- Video Management Guidance & Code Template -->
      <div class="card" style="background: #f8fafc; border: 1.5px dashed var(--color-court); padding: var(--spacing-24);">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: var(--spacing-12);">
          <span style="font-size: 1.5rem;">⚙️</span>
          <h2 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-court); margin: 0; text-transform: uppercase;">
            Quy trình quản lý danh sách Video qua file mã nguồn
          </h2>
        </div>

        <p style="font-size: 0.875rem; color: var(--color-ink); line-height: 1.5; margin-bottom: var(--spacing-16);">
          Để phục vụ đồ án với kiến trúc nhẹ nhất mà không phát sinh thêm bảng cơ sở dữ liệu Supabase hay backend quản lý, toàn bộ danh sách video YouTube được lưu trữ tĩnh trong file mã nguồn:
          <br />
          <code style="background: #e2e8f0; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-weight: 700;">src/data/internalNews.ts</code>
        </p>

        <!-- Step-by-Step Instructions -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-16); margin-bottom: var(--spacing-20);">
          <div style="background: #fff; border: 1px solid var(--color-mint-line); border-radius: var(--radius-control); padding: var(--spacing-16);">
            <strong style="color: var(--color-court); font-size: 0.875rem; display: block; margin-bottom: 8px;">1. Các bước thêm hoặc sửa video:</strong>
            <ol style="font-size: 0.8125rem; color: var(--color-ink); padding-left: 20px; line-height: 1.6; margin: 0;">
              <li>Mở file <code>src/data/internalNews.ts</code> trong trình biên soạn mã.</li>
              <li>Thêm một phần tử vào mảng <code>INTERNAL_NEWS_VIDEOS</code> theo mẫu dưới.</li>
              <li>Chỉnh sửa thứ tự sắp xếp (<code>order</code>) và bật/tắt hiển thị (<code>isVisible: true/false</code>).</li>
              <li>Chạy kiểm thử: <code>npm run test</code> để đảm bảo URL video hợp lệ.</li>
              <li>Commit và push lên GitHub <code>origin main</code>. Cloudflare Pages sẽ tự động cập nhật sản phẩm.</li>
            </ol>
          </div>

          <div style="background: #fff; border: 1px solid var(--color-mint-line); border-radius: var(--radius-control); padding: var(--spacing-16);">
            <strong style="color: var(--color-court); font-size: 0.875rem; display: block; margin-bottom: 8px;">2. Các định dạng YouTube được hỗ trợ:</strong>
            <ul style="font-size: 0.8125rem; color: var(--color-ink); padding-left: 20px; line-height: 1.6; margin: 0;">
              <li>Dạng xem chuẩn: <code>https://www.youtube.com/watch?v=VIDEO_ID</code></li>
              <li>Dạng rút gọn: <code>https://youtu.be/VIDEO_ID</code></li>
              <li>Dạng Shorts: <code>https://www.youtube.com/shorts/VIDEO_ID</code></li>
              <li>Dạng nhúng: <code>https://www.youtube.com/embed/VIDEO_ID</code></li>
            </ul>
          </div>
        </div>

        <!-- Valid TypeScript Snippet -->
        <strong style="color: var(--color-court); font-size: 0.875rem; display: block; margin-bottom: 8px;">📋 3. Mẫu code TypeScript hợp lệ:</strong>
        <pre style="background: #0f172a; color: #e2e8f0; padding: 14px; border-radius: 8px; font-size: 0.8125rem; overflow-x: auto; line-height: 1.4; margin-bottom: var(--spacing-16);">{
  id: 'vid-07',
  title: 'Tiêu đề video mới của bạn',
  description: 'Mô tả nội dung ngắn gọn của video hướng dẫn',
  youtubeUrl: 'https://www.youtube.com/watch?v=XXXXXXXXXXX',
  publishedAt: '2026-10-12',
  isVisible: true,
  order: 7,
}</pre>

        <div style="background: #e6fffa; border-left: 4px solid var(--color-court); padding: 8px 12px; font-size: 0.8125rem; color: var(--color-ink);">
          💡 <em>Lưu ý: Không tạo form lưu tạm thời trên trình duyệt vì dữ liệu sẽ bị mất khi người dùng reload trang. Việc lưu qua Git đảm bảo video được lưu vĩnh viễn và đồng bộ cùng website.</em>
        </div>
      </div>
    </div>
  `;
}
