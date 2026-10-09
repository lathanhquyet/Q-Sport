import { SITE_CONFIG } from '../config/site';

export function renderAboutPage(): string {
  return `
    <div class="container" style="padding-top: var(--spacing-32);">
      <!-- Page Header -->
      <div style="text-align: center; margin-bottom: var(--spacing-48);">
        <span style="background: var(--color-mint); color: var(--color-court); font-weight: 700; font-size: 0.8125rem; padding: 4px 14px; border-radius: var(--radius-pill); border: 1px solid var(--color-mint-line);">GIỚI THIỆU THƯƠNG HIỆU</span>
        <h1 style="font-family: var(--font-display); font-size: 2.75rem; color: var(--color-court); margin-top: var(--spacing-8);">
          VỀ CHÚNG TÔI — Q-SPORT
        </h1>
        <p style="color: var(--color-muted); font-size: 1.125rem; max-width: 600px; margin: 0 auto;">
          ${SITE_CONFIG.tagline}
        </p>
      </div>

      <!-- Story & Image Section -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-48); align-items: center; margin-bottom: var(--spacing-72);">
        <div>
          <h2 style="font-family: var(--font-display); font-size: 2rem; color: var(--color-court); margin-bottom: var(--spacing-16);">
            CÂU CHUYỆN THƯƠNG HIỆU
          </h2>
          <div style="line-height: 1.7; color: var(--color-ink); max-width: 70ch;">
            <p style="margin-bottom: var(--spacing-16);">
              Q-Sport ra đời với niềm đam mê cháy bỏng dành cho bộ môn cầu lông. Chúng tôi hiểu rằng mỗi đường đập cầu, mỗi bước di chuyển cứu cầu đều đòi hỏi sự chính xác và trang bị hỗ trợ hoàn hảo.
            </p>
            <p style="margin-bottom: var(--spacing-16);">
              Lấy cảm hứng từ những <em>"đường kẻ sân cầu lông"</em> xanh mát và thanh lịch, Q-Sport mang tới những sản phẩm vợt, giày và trang phục thi đấu đạt tiêu chuẩn chất lượng cao nhất cho cộng đồng đam mê thể thao.
            </p>
          </div>
        </div>

        <div class="card" style="padding: var(--spacing-16); background: var(--color-mint); border-color: var(--color-mint-line); text-align: center;">
          <img
            src="/assets/logo.png"
            alt="Q-Sport Logo"
            style="max-width: 280px; width: 100%; height: auto; margin: 0 auto; display: block;"
          />
          <p style="font-size: 0.875rem; color: var(--color-muted); margin-top: var(--spacing-16); font-weight: 500;">
            Đại diện thương hiệu: ${SITE_CONFIG.representative}
          </p>
        </div>
      </div>

      <!-- Vision, Mission & Core Values (3 Blocks) -->
      <div style="margin-bottom: var(--spacing-72);">
        <h2 style="font-family: var(--font-display); font-size: 2rem; color: var(--color-court); text-align: center; margin-bottom: var(--spacing-32);">
          TẦM NHÌN · SỨ MỆNH · GIÁ TRỊ CỐT LÕI
        </h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--spacing-24);">
          <!-- Block 1 -->
          <div class="card" style="padding: var(--spacing-24); background: var(--color-white); border-top: 4px solid var(--color-court);">
            <div style="font-size: 2.25rem; margin-bottom: var(--spacing-12);">🎯</div>
            <h3 style="font-family: var(--font-display); font-size: 1.375rem; color: var(--color-court); margin-bottom: var(--spacing-8);">
              TẦM NHÌN
            </h3>
            <p style="font-size: 0.875rem; color: var(--color-ink); line-height: 1.6;">
              Trở thành thương hiệu cung cấp đồ dùng cầu lông uy tín hàng đầu, mang tinh thần thể thao xanh mát tới mọi tay vợt Việt Nam.
            </p>
          </div>

          <!-- Block 2 -->
          <div class="card" style="padding: var(--spacing-24); background: var(--color-white); border-top: 4px solid var(--color-cork);">
            <div style="font-size: 2.25rem; margin-bottom: var(--spacing-12);">🚀</div>
            <h3 style="font-family: var(--font-display); font-size: 1.375rem; color: var(--color-court); margin-bottom: var(--spacing-8);">
              SỨ MỆNH
            </h3>
            <p style="font-size: 0.875rem; color: var(--color-ink); line-height: 1.6;">
              Cung cấp trang thiết bị thể thao đạt chuẩn chất lượng, dịch vụ tận tâm và khơi dậy niềm đam mê tập luyện thể thao lành mạnh.
            </p>
          </div>

          <!-- Block 3 -->
          <div class="card" style="padding: var(--spacing-24); background: var(--color-white); border-top: 4px solid var(--color-smash);">
            <div style="font-size: 2.25rem; margin-bottom: var(--spacing-12);">💎</div>
            <h3 style="font-family: var(--font-display); font-size: 1.375rem; color: var(--color-court); margin-bottom: var(--spacing-8);">
              GIÁ TRỊ CỐT LÕI
            </h3>
            <p style="font-size: 0.875rem; color: var(--color-ink); line-height: 1.6;">
              Chính trực · Chất lượng vượt trội · Đổi mới liên tục · Tận tâm với khách hàng và cộng đồng cầu lông.
            </p>
          </div>
        </div>
      </div>

      <!-- Embed Media Section (YouTube & Google Maps) -->
      <div style="margin-bottom: var(--spacing-48);">
        <h2 style="font-family: var(--font-display); font-size: 2rem; color: var(--color-court); text-align: center; margin-bottom: var(--spacing-32);">
          KÊNH TRUYỀN THÔNG & VỊ TRÍ CỬA HÀNG
        </h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-32);">
          <!-- YouTube Video / Channel Embed -->
          <div class="card" style="padding: var(--spacing-16);">
            <h3 style="font-size: 1.125rem; font-weight: 600; color: var(--color-court); margin-bottom: var(--spacing-12); display: flex; align-items: center; gap: 8px;">
              <span>📺</span> Kênh YouTube Q-Sport
            </h3>
            <div style="aspect-ratio: 16 / 9; width: 100%; border-radius: var(--radius-image); overflow: hidden; background: #000;">
              <iframe
                title="Kênh YouTube Q-Sport Thể Thao"
                src="${SITE_CONFIG.youtubeEmbedUrl}"
                width="100%"
                height="100%"
                style="border:0;"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                loading="lazy"
              ></iframe>
            </div>
            <p style="font-size: 0.8125rem; color: var(--color-muted); margin-top: var(--spacing-8); text-align: center;">
              Theo dõi kênh YouTube: <a href="${SITE_CONFIG.youtubeChannelUrl}" target="_blank" rel="noopener noreferrer">${SITE_CONFIG.youtubeChannelUrl}</a>
            </p>
          </div>

          <!-- Google Maps Embed -->
          <div class="card" style="padding: var(--spacing-16);">
            <h3 style="font-size: 1.125rem; font-weight: 600; color: var(--color-court); margin-bottom: var(--spacing-12); display: flex; align-items: center; gap: 8px;">
              <span>🗺️</span> Bản đồ Showroom Q-Sport
            </h3>
            <div style="aspect-ratio: 16 / 9; width: 100%; border-radius: var(--radius-image); overflow: hidden;">
              <iframe
                title="Google Maps Bản đồ vị trí Q-Sport Thủ Đức"
                src="${SITE_CONFIG.mapsEmbedUrl}"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <p style="font-size: 0.8125rem; color: var(--color-muted); margin-top: var(--spacing-8); text-align: center;">
              📍 <strong>Địa chỉ minh họa cho đồ án:</strong> ${SITE_CONFIG.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}
