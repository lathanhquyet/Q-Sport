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
      <a href="/products?category=${cat.slug}" data-link class="btn btn-secondary" style="border-radius: var(--radius-pill); font-size: 0.875rem; padding: 6px 18px; min-height: 38px; display: inline-flex; align-items: center; gap: 6px; border-color: var(--color-primary-border);">
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
    <!-- Sky Blue Hero Section (Realistic Badminton Sports Imagery & Balanced 2-Column Layout) -->
    <section style="position: relative; background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #BAE6FD 100%); color: var(--color-text); border-bottom: 2px solid var(--color-primary); padding: var(--spacing-48) 0; overflow: hidden;">
      <div class="container" style="position: relative; z-index: 1;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-40); align-items: center;">

          <!-- Column 1: Headline, Description & Action CTAs -->
          <div>
            <div style="display: inline-flex; align-items: center; gap: 8px; background: var(--color-surface); color: var(--color-primary-dark); font-weight: 800; font-size: 0.8125rem; padding: 6px 16px; border-radius: var(--radius-pill); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: var(--spacing-16); border: 1.5px solid var(--color-primary); box-shadow: var(--shadow-sm);">
              <span>⚡ Q-SPORT BADMINTON STORE</span>
            </div>

            <h1 style="font-family: var(--font-display); font-size: clamp(2.25rem, 5vw, 3.75rem); color: var(--color-text); line-height: 1.1; letter-spacing: 0.5px; margin-bottom: var(--spacing-16);">
              BỨT PHÁ PHONG ĐỘ <br />
              <span style="color: var(--color-primary-dark);">TRÊN MỌI ĐƯỜNG CẦU</span>
            </h1>

            <p style="font-size: 1.0625rem; color: var(--color-text-secondary); margin-bottom: var(--spacing-24); line-height: 1.6; max-width: 580px;">
              Trang bị vợt, giày và phụ kiện cầu lông cao cấp chính hãng Q-Sport. Khung carbon High Modulus trợ lực tối đa cho cú đập cầu uy lực, phản tạt linh hoạt và tốc độ bao sân đỉnh cao.
            </p>

            <div style="display: flex; gap: var(--spacing-16); flex-wrap: wrap; align-items: center; margin-bottom: var(--spacing-32);">
              <a href="/products" data-link class="btn btn-primary" style="font-size: 1.0625rem; font-weight: 700; padding: 12px 28px;">
                Mua sắm ngay 🏸
              </a>
              <a href="#categories" class="btn btn-secondary" style="font-size: 1.0625rem; padding: 12px 24px; background: var(--color-surface);">
                Khám phá danh mục
              </a>
            </div>

            <!-- Honest Value Badges Bar -->
            <div style="display: flex; gap: var(--spacing-20); flex-wrap: wrap; font-size: 0.8125rem; color: var(--color-text-secondary); border-top: 1px solid var(--color-primary-border); padding-top: var(--spacing-16);">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 1.125rem;">🚚</span>
                <span>Giao hàng COD &amp; VietQR toàn quốc</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 1.125rem;">🏸</span>
                <span>Thiết bị cầu lông chính hãng</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 1.125rem;">🔄</span>
                <span>Tư vấn &amp; Đổi trả dễ dàng</span>
              </div>
            </div>
          </div>

          <!-- Column 2: Realistic Badminton Photography Showcase -->
          <div style="position: relative;">
            <div style="position: relative; border-radius: var(--radius-card); overflow: hidden; box-shadow: 0 20px 40px rgba(16, 42, 67, 0.15); border: 4px solid var(--color-surface); aspect-ratio: 16 / 11; background: var(--color-primary-light);">
              <img
                src="/assets/banners/home-hero.webp"
                alt="Vận động viên và dụng cụ cầu lông chuyên nghiệp Q-Sport"
                loading="eager"
                onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80';"
                style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;"
              />
              <!-- Floating Media Badge -->
              <div style="position: absolute; bottom: 16px; left: 16px; background: rgba(16, 42, 67, 0.88); backdrop-filter: blur(8px); color: var(--color-white); padding: 8px 16px; border-radius: var(--radius-pill); font-size: 0.8125rem; font-weight: 700; display: flex; align-items: center; gap: 8px; border: 1px solid rgba(255, 255, 255, 0.2);">
                <span style="color: var(--color-primary);">●</span>
                <span>Dụng Cụ Thi Đấu Đỉnh Cao</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Category Navigation Section -->
    <section id="categories" style="padding: var(--spacing-32) 0; background: var(--color-surface); border-bottom: 1px solid var(--color-primary-border);">
      <div class="container">
        <div style="text-align: center; margin-bottom: var(--spacing-16);">
          <span style="color: var(--color-primary-dark); font-weight: 700; font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.5px;">DANH MỤC THIẾT BỊ CẦU LÔNG</span>
          <h2 style="font-family: var(--font-display); font-size: 1.75rem; color: var(--color-text); margin-top: 4px;">
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
    <section style="padding: var(--spacing-48) 0; background: var(--color-page-background);">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--spacing-32); flex-wrap: wrap; gap: 16px;">
          <div>
            <span style="color: var(--color-primary-dark); font-weight: 700; font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.5px;">SẢN PHẨM BÁN CHẠY</span>
            <h2 style="font-family: var(--font-display); font-size: 2.25rem; color: var(--color-text); margin-top: 4px;">
              SẢN PHẨM NỔI BẬT
            </h2>
            <p style="color: var(--color-text-secondary); font-size: 0.9375rem;">Những sản phẩm cầu lông cao cấp được các tay vợt tin dùng nhiều nhất</p>
          </div>
          <a href="/products" data-link class="btn btn-secondary" style="font-size: 0.875rem;">
            Xem tất cả sản phẩm &rarr;
          </a>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--spacing-24);">
          ${productsGridHtml || renderSkeletonGrid(4)}
        </div>
      </div>
    </section>

    <!-- Sports Performance Pillars Grid -->
    <section style="padding: var(--spacing-48) 0; background: var(--color-surface); border-top: 1px solid var(--color-primary-border); border-bottom: 1px solid var(--color-primary-border);">
      <div class="container">
        <div style="text-align: center; margin-bottom: var(--spacing-32);">
          <span style="color: var(--color-primary-dark); font-weight: 700; font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.5px;">ĐẶC QUYỀN THƯƠNG HIỆU</span>
          <h2 style="font-family: var(--font-display); font-size: 2rem; color: var(--color-text); margin-top: 4px;">
            TẠI SAO CHỌN DỤNG CỤ CẦU LÔNG Q-SPORT?
          </h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--spacing-24);">
          <div class="card" style="padding: var(--spacing-24); background: var(--color-primary-light); border-color: var(--color-primary-border);">
            <div style="font-size: 2.25rem; margin-bottom: 12px;">⚡</div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-primary-dark); margin-bottom: 8px;">
              KHUNG VÁT HÀNG KHÔNG
            </h3>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.6;">
              Tối ưu hóa khí động học, giảm sức cản không khí giúp tốc độ vung vợt nhanh nhạy trong từng cú phản tạt.
            </p>
          </div>

          <div class="card" style="padding: var(--spacing-24); background: var(--color-primary-light); border-color: var(--color-primary-border);">
            <div style="font-size: 2.25rem; margin-bottom: 12px;">🛡️</div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-primary-dark); margin-bottom: 8px;">
              CARBON HIGH MODULUS
            </h3>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.6;">
              Chất liệu sợi carbon cao cấp gia tăng độ bền khung, chịu lực căng cước cao cho đường đập cầu uy lực.
            </p>
          </div>

          <div class="card" style="padding: var(--spacing-24); background: var(--color-primary-light); border-color: var(--color-primary-border);">
            <div style="font-size: 2.25rem; margin-bottom: 12px;">👟</div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-primary-dark); margin-bottom: 8px;">
              ĐẾ CAO SU TỔ ONG ANTI-SLIP
            </h3>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.6;">
              Đế giày tổ ong bám sân tuyệt đối, giảm chấn bảo vệ gót chân và khớp gối khi bật nhảy cứu cầu.
            </p>
          </div>

          <div class="card" style="padding: var(--spacing-24); background: var(--color-primary-light); border-color: var(--color-primary-border);">
            <div style="font-size: 2.25rem; margin-bottom: 12px;">📱</div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-primary-dark); margin-bottom: 8px;">
              THANH TOÁN COD &amp; VIETQR
            </h3>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.6;">
              Hỗ trợ thanh toán tiền mặt COD khi nhận hàng hoặc quét mã VietQR tự động qua app ngân hàng tiện lợi.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Short About Snippet & Maps Section -->
    <section style="padding: var(--spacing-48) 0; background: var(--color-primary-light); border-top: 1px solid var(--color-primary-border);">
      <div class="container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-48); align-items: center;">
          <div>
            <span style="color: var(--color-primary-dark); font-weight: 700; font-size: 0.875rem; text-transform: uppercase;">Về Q-Sport Store</span>
            <h2 style="font-family: var(--font-display); font-size: 2.25rem; color: var(--color-text); margin: var(--spacing-8) 0 var(--spacing-16) 0;">
              ĐỒNG HÀNH CÙNG ĐAM MÊ CẦU LÔNG
            </h2>
            <p style="color: var(--color-text); margin-bottom: var(--spacing-16); line-height: 1.6;">
              Q-Sport là thương hiệu tập trung cung cấp thiết bị cầu lông và phụ kiện thể thao chất lượng cao. Chúng tôi mang tới sự tinh tế trong từng đường kẻ sân và trải nghiệm mua sắm tối ưu nhất.
            </p>
            <p style="color: var(--color-text-secondary); font-size: 0.875rem; margin-bottom: var(--spacing-24);">
              📍 Showroom: ${SITE_CONFIG.address} (Địa chỉ minh họa cho đồ án)
            </p>
            <a href="/about" data-link class="btn btn-primary">Tìm hiểu thêm về Q-Sport</a>
          </div>

          <div class="card" style="padding: var(--spacing-12); background: var(--color-surface); border-radius: var(--radius-card);">
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
            <p style="font-size: 0.75rem; color: var(--color-text-secondary); text-align: center; margin-top: var(--spacing-8);">
              📍 Địa chỉ minh họa cho đồ án: ${SITE_CONFIG.address}
            </p>
          </div>
        </div>
      </div>
    </section>
  `;
}
