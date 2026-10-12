import { getVisibleInternalNews, extractYouTubeVideoId, getYouTubeThumbnailUrl, InternalNewsVideo } from '../data/internalNews';

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function renderInternalNewsPage(): string {
  const videos = getVisibleInternalNews();

  if (videos.length === 0) {
    return `
      <div class="container" style="padding-top: var(--spacing-48); padding-bottom: var(--spacing-72); text-align: center;">
        <div class="card" style="max-width: 600px; margin: 0 auto; padding: var(--spacing-48);">
          <span style="font-size: 3rem; display: block; margin-bottom: 16px;">📹</span>
          <h1 style="font-family: var(--font-display); font-size: 2rem; color: var(--color-court); margin-bottom: 12px;">
            CHƯA CÓ TIN NỘI BỘ HOẶC VIDEO NÀO
          </h1>
          <p style="color: var(--color-muted); font-size: 0.9375rem; margin-bottom: 24px; line-height: 1.6;">
            Hiện tại chưa có video nào được kích hoạt hiển thị. Quản trị viên có thể thêm video trong file <code>src/data/internalNews.ts</code> và kích hoạt <code>isVisible: true</code>.
          </p>
          <a href="/products" data-link class="btn btn-primary">Khám phá sản phẩm Q-Sport</a>
        </div>
      </div>
    `;
  }

  const videoCardsHtml = videos.map((video: InternalNewsVideo) => {
    const videoId = extractYouTubeVideoId(video.youtubeUrl) || '';
    const thumbnailUrl = getYouTubeThumbnailUrl(videoId);
    const safeTitle = escapeHtml(video.title);
    const safeDesc = escapeHtml(video.description);
    const dateFormatted = video.publishedAt ? new Date(video.publishedAt).toLocaleDateString('vi-VN') : '';

    return `
      <div class="card internal-news-card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 0; overflow: hidden; border-radius: var(--radius-card); transition: transform 0.25s ease, box-shadow 0.25s ease; border: 1px solid var(--color-mint-line);">
        <div>
          <!-- Thumbnail Container with Play Overlay -->
          <div
            class="video-thumbnail-box"
            style="position: relative; aspect-ratio: 16 / 9; background: #0f172a; overflow: hidden; cursor: pointer;"
            onclick="window.handleOpenVideoModal && window.handleOpenVideoModal('${videoId}', '${safeTitle.replace(/'/g, "\\'")}')"
            role="button"
            tabindex="0"
            aria-label="Xem video ${safeTitle}"
          >
            <img
              src="${thumbnailUrl}"
              alt="${safeTitle}"
              loading="lazy"
              style="width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease;"
              onerror="this.onerror=null; this.src='/assets/products/placeholder.svg';"
            />
            <!-- Play Button Overlay -->
            <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; transition: background 0.2s ease;">
              <div style="width: 56px; height: 56px; background: rgba(16, 185, 129, 0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.4); transform: scale(1); transition: transform 0.2s ease, background 0.2s ease;">
                <span style="color: #ffffff; font-size: 1.5rem; margin-left: 4px;">▶</span>
              </div>
            </div>

            ${
              dateFormatted
                ? `<span style="position: absolute; bottom: 8px; right: 8px; background: rgba(15, 23, 42, 0.85); color: #fff; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; font-weight: 600;">
                    📅 ${dateFormatted}
                  </span>`
                : ''
            }
          </div>

          <!-- Video Content Details -->
          <div style="padding: var(--spacing-20);">
            <h2 style="font-family: var(--font-body); font-size: 1.125rem; font-weight: 700; color: var(--color-ink); line-height: 1.4; margin-bottom: var(--spacing-8); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 3.1em;">
              ${safeTitle}
            </h2>
            <p style="font-size: 0.875rem; color: var(--color-muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; height: 4.5em;">
              ${safeDesc}
            </p>
          </div>
        </div>

        <!-- Video Action Button -->
        <div style="padding: 0 var(--spacing-20) var(--spacing-20) var(--spacing-20);">
          <button
            type="button"
            class="btn btn-primary"
            style="width: 100%; font-size: 0.9375rem; gap: 8px;"
            onclick="window.handleOpenVideoModal && window.handleOpenVideoModal('${videoId}', '${safeTitle.replace(/'/g, "\\'")}')"
          >
            <span>▶ Xem video</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <!-- Internal News Header Banner -->
    <section style="background: #0B1E19; color: var(--color-white); padding: var(--spacing-48) 0; border-bottom: 3px solid var(--color-court); position: relative;">
      <div class="container">
        <div style="max-width: 800px;">
          <div style="display: inline-flex; align-items: center; gap: 6px; background: var(--color-court); color: var(--color-white); font-weight: 700; font-size: 0.8125rem; padding: 4px 12px; border-radius: var(--radius-pill); text-transform: uppercase; margin-bottom: 12px;">
            <span>📹 MEDIA &amp; NỘI DUNG NỘI BỘ</span>
          </div>
          <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); line-height: 1.1; color: var(--color-white); margin-bottom: 12px;">
            TIN NỘI BỘ &amp; VIDEO HƯỚNG DẪN CẦU LÔNG
          </h1>
          <p style="font-size: 1rem; color: #D1E7DD; line-height: 1.6; max-width: 680px;">
            Tổng hợp video hướng dẫn kỹ thuật đập cầu, di chuyển bước chân, kinh nghiệm chọn vợt và các hoạt động cộng đồng chính thức từ Q-Sport.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Responsive Gridview Section -->
    <section style="padding: var(--spacing-48) 0 var(--spacing-72) 0; background: #f8fafc;">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-24); flex-wrap: wrap; gap: 12px;">
          <div>
            <span style="font-size: 0.875rem; color: var(--color-muted);">Hiển thị <strong>${videos.length}</strong> video bài giảng &amp; tin tức</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="https://www.youtube.com/@buoctiepmoingay/videos" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 0.875rem; padding: 6px 14px; min-height: 38px;">
              🔗 Kênh YouTube chính thức ↗
            </a>
          </div>
        </div>

        <!-- Grid Layout: 3 cols (Desktop), 2 cols (Tablet), 1 col (Mobile) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--spacing-24);">
          ${videoCardsHtml}
        </div>
      </div>
    </section>

    <!-- Video Modal Container -->
    <div id="video-modal-backdrop" style="display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); z-index: 1000; align-items: center; justify-content: center; padding: 16px;" onclick="window.handleCloseVideoModal && window.handleCloseVideoModal(event)">
      <div style="width: 100%; max-width: 860px; background: #0f172a; border-radius: var(--radius-card); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);" onclick="event.stopPropagation()">
        <!-- Modal Top Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; background: #1e293b; border-bottom: 1px solid #334155;">
          <h3 id="video-modal-title" style="font-size: 1rem; color: #f8fafc; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80%;">
            Xem Video
          </h3>
          <button
            type="button"
            onclick="window.handleCloseVideoModal && window.handleCloseVideoModal()"
            style="border: none; background: #334155; color: #fff; width: 32px; height: 32px; border-radius: 50%; font-size: 1.125rem; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s ease;"
            aria-label="Đóng video"
          >
            ✕
          </button>
        </div>

        <!-- Video Player Frame -->
        <div style="position: relative; aspect-ratio: 16 / 9; background: #000;">
          <iframe
            id="video-modal-iframe"
            src=""
            title="Q-Sport Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            style="width: 100%; height: 100%; border: none;"
          ></iframe>
        </div>
      </div>
    </div>
  `;
}
