import { renderCourtHeroPattern } from '../components/CourtPattern';
import { renderProductCard } from '../components/ProductCard';
import { getFeaturedProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { renderSkeletonGrid } from '../components/StateViews';
import { SITE_CONFIG } from '../config/site';

export async function renderHomePage(): Promise<string> {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  const categoryIconMap: Record<string, string> = {
    'giay': '👟',
    'vot': '🏸',
    'quan': '🩳',
    'ao': '👕',
    'balo': '🎒',
    'phu-kien': '🧦',
  };

  const categoryChipsHtml = categories
    .map(
      cat => `
      <a href="/products?category=${cat.slug}" data-link class="btn btn-secondary" style="border-radius: var(--radius-pill); font-size: 0.875rem; padding: 6px 18px; min-height: 38px; display: inline-flex; align-items: center; gap: 6px;">
        <span>${categoryIconMap[cat.slug] || '🏸'}</span>
        <span>${cat.name}</span>
      </a>
    `
    )
    .join('');

  const productsGridHtml = featuredProducts
    .map(product => renderProductCard(product))
    .join('');

  return `
    <!-- Performance Sports Hero Section -->
    <section style="position: relative; background: #0B1E19; color: var(--color-white); border-bottom: 3px solid var(--color-court); padding: var(--spacing-72) 0; overflow: hidden;">
      ${renderCourtHeroPattern()}
      <div class="container" style="position: relative; z-index: 1;">
        <div style="max-width: 720px;">
          <div style="display: inline-flex; align-items: center; gap: 8px; background: var(--color-cork); color: var(--color-ink); font-weight: 800; font-size: 0.8125rem; padding: 6px 14px; border-radius: var(--radius-pill); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: var(--spacing-16);">
            <span>⚡ BADMINTON PERFORMANCE STORE</span>
          </div>

          <h1 style="font-family: var(--font-display); font-size: clamp(2.5rem, 5.5vw, 4.25rem); color: var(--color-white); line-height: 1.05; letter-spacing: 0.5px; margin-bottom: var(--spacing-20); text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
            BỨT PHÁ PHONG ĐỘ <br />
            <span style="color: var(--color-cork);">TRÊN MỌI ĐƯỜNG CẦU</span>
          </h1>

          <p style="font-size: 1.125rem; color: #D1E7DD; margin-bottom: var(--spacing-32); line-height: 1.6; max-width: 620px;">
            Trang bị vợt, giày và phụ kiện cầu lông chính hãng Q-Sport. Khung vát hàng không trợ lực tối ưu cho cú đập cầu uy lực và phản tạt siêu tốc.
          </p>

          <div style="display: flex; gap: var(--spacing-16); flex-wrap: wrap; align-items: center;">
            <a href="/products" data-link class="btn" style="background: var(--color-smash-orange); color: var(--color-white) !important; font-size: 1.125rem; font-weight: 700; padding: 14px 32px; border-radius: var(--radius-control); box-shadow: 0 4px 14px rgba(194, 65, 12, 0.4);">
              Mua sắm ngay 🏸
            </a>
            <a href="/about" data-link class="btn btn-secondary" style="border-color: var(--color-mint-line); color: var(--color-white) !important; background: rgba(255,255,255,0.08); font-size: 1.125rem; padding: 14px 28px;">
              Khám phá thương hiệu
            </a>
          </div>

          <!-- Feature Highlights Bar -->
          <div style="margin-top: var(--spacing-48); display: flex; gap: var(--spacing-24); flex-wrap: wrap; font-size: 0.875rem; color: var(--color-mint-line); border-top: 1px dashed rgba(184, 242, 209, 0.2); padding-top: var(--spacing-20);">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.25rem;">🚚</span>
              <span>Giao hàng COD & VietQR toàn quốc</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.25rem;">💯</span>
              <span>100% Chính hãng Q-Sport</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.25rem;">🔄</span>
              <span>Bảo hành & Đổi trả dễ dàng</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Navigation Section -->
    <section style="padding: var(--spacing-32) 0; background: var(--color-white); border-bottom: 1px solid var(--color-mint-line);">
      <div class="container">
        <div style="text-align: center; margin-bottom: var(--spacing-16);">
          <span style="color: var(--color-court); font-weight: 700; font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.5px;">DANH MỤC THIẾT BỊ CẦU LÔNG</span>
          <h2 style="font-family: var(--font-display); font-size: 1.75rem; color: var(--color-ink); margin-top: 4px;">
            LỰA CHỌN THEO NHU CẦU THI ĐẤU
          </h2>
        </div>

        <div style="display: flex; gap: var(--spacing-12); flex-wrap: wrap; justify-content: center;">
          <a href="/products" data-link class="btn btn-primary" style="border-radius: var(--radius-pill); font-size: 0.875rem; padding: 6px 20px; min-height: 38px;">
            Tất cả sản phẩm
          </a>
          ${categoryChipsHtml}
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section style="padding: var(--spacing-48) 0; background: #FAFDFB;">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--spacing-32); flex-wrap: wrap; gap: 16px;">
          <div>
            <span style="color: var(--color-court); font-weight: 700; font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.5px;">SẢN PHẨM BÁN CHẠY</span>
            <h2 style="font-family: var(--font-display); font-size: 2.25rem; color: var(--color-court); margin-top: 4px;">
              SẢN PHẨM NỔI BẬT
            </h2>
            <p style="color: var(--color-muted); font-size: 0.9375rem;">Những sản phẩm cầu lông cao cấp được các tay vợt tin dùng nhiều nhất</p>
          </div>
          <a href="/products" data-link class="btn btn-secondary" style="font-size: 0.875rem; border-color: var(--color-court);">
            Xem tất cả sản phẩm &rarr;
          </a>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--spacing-24);">
          ${productsGridHtml || renderSkeletonGrid(4)}
        </div>
      </div>
    </section>

    <!-- Sports Performance Pillars Grid -->
    <section style="padding: var(--spacing-48) 0; background: var(--color-white); border-top: 1px solid var(--color-mint-line); border-bottom: 1px solid var(--color-mint-line);">
      <div class="container">
        <div style="text-align: center; margin-bottom: var(--spacing-32);">
          <span style="color: var(--color-court); font-weight: 700; font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.5px;">ĐẶC QUYỀN THƯƠNG HIỆU</span>
          <h2 style="font-family: var(--font-display); font-size: 2rem; color: var(--color-court); margin-top: 4px;">
            TẠI SAO CHỌN DỤNG CỤ CẦU LÔNG Q-SPORT?
          </h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--spacing-24);">
          <div class="card" style="padding: var(--spacing-24); background: var(--color-mint); border-color: var(--color-mint-line);">
            <div style="font-size: 2.25rem; margin-bottom: 12px;">⚡</div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-court); margin-bottom: 8px;">
              KHUNG VÁT HÀNG KHÔNG
            </h3>
            <p style="font-size: 0.875rem; color: var(--color-muted); line-height: 1.6;">
              Tối ưu hóa khí động học, giảm sức cản không khí giúp tốc độ vung vợt nhanh nhạy trong từng cú phản tạt.
            </p>
          </div>

          <div class="card" style="padding: var(--spacing-24); background: var(--color-mint); border-color: var(--color-mint-line);">
            <div style="font-size: 2.25rem; margin-bottom: 12px;">🛡️</div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-court); margin-bottom: 8px;">
              CARBON HIGH MODULUS
            </h3>
            <p style="font-size: 0.875rem; color: var(--color-muted); line-height: 1.6;">
              Chất liệu sợi carbon cao cấp gia tăng độ bền khung, chịu lực căng cước cao cho đường đập cầu uy lực.
            </p>
          </div>

          <div class="card" style="padding: var(--spacing-24); background: var(--color-mint); border-color: var(--color-mint-line);">
            <div style="font-size: 2.25rem; margin-bottom: 12px;">👟</div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-court); margin-bottom: 8px;">
              ĐẾ CAO SU TỔ ONG ANTI-SLIP
            </h3>
            <p style="font-size: 0.875rem; color: var(--color-muted); line-height: 1.6;">
              Đế giày tổ ong bám sân tuyệt đối, giảm chấn bảo vệ gót chân và khớp gối khi bật nhảy cứu cầu.
            </p>
          </div>

          <div class="card" style="padding: var(--spacing-24); background: var(--color-mint); border-color: var(--color-mint-line);">
            <div style="font-size: 2.25rem; margin-bottom: 12px;">📱</div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-court); margin-bottom: 8px;">
              THANH TOÁN COD & VIETQR
            </h3>
            <p style="font-size: 0.875rem; color: var(--color-muted); line-height: 1.6;">
              Hỗ trợ thanh toán tiền mặt COD khi nhận hàng hoặc quét mã VietQR tự động qua app ngân hàng tiện lợi.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Short About Snippet & Maps Section -->
    <section style="padding: var(--spacing-48) 0; background: var(--color-mint); border-top: 1px solid var(--color-mint-line);">
      <div class="container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-48); align-items: center;">
          <div>
            <span style="color: var(--color-court); font-weight: 700; font-size: 0.875rem; text-transform: uppercase;">Về Q-Sport Store</span>
            <h2 style="font-family: var(--font-display); font-size: 2.25rem; color: var(--color-court); margin: var(--spacing-8) 0 var(--spacing-16) 0;">
              ĐỒNG HÀNH CÙNG ĐAM MÊ CẦU LÔNG
            </h2>
            <p style="color: var(--color-ink); margin-bottom: var(--spacing-16); line-height: 1.6;">
              Q-Sport là thương hiệu tập trung cung cấp thiết bị cầu lông và phụ kiện thể thao chất lượng cao. Chúng tôi mang tới sự tinh tế trong từng đường kẻ sân và trải nghiệm mua sắm tối ưu nhất.
            </p>
            <p style="color: var(--color-muted); font-size: 0.875rem; margin-bottom: var(--spacing-24);">
              📍 Showroom: ${SITE_CONFIG.address} (Địa chỉ minh họa cho đồ án)
            </p>
            <a href="/about" data-link class="btn btn-primary">Tìm hiểu thêm về Q-Sport</a>
          </div>

          <div class="card" style="padding: var(--spacing-12); background: var(--color-white); border-radius: var(--radius-card);">
            <div style="aspect-ratio: 4 / 3; width: 100%; overflow: hidden; border-radius: var(--radius-image);">
              <iframe
                title="Bản đồ vị trí Q-Sport Store Thủ Đức"
                src="${SITE_CONFIG.mapsEmbedUrl}"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <p style="font-size: 0.75rem; color: var(--color-muted); text-align: center; margin-top: var(--spacing-8);">
              📍 Địa chỉ minh họa cho đồ án: ${SITE_CONFIG.address}
            </p>
          </div>
        </div>
      </div>
    </section>
  `;
}
