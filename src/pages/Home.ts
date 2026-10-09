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

  const categoryChipsHtml = categories
    .map(
      cat => `
      <a href="/products?category=${cat.slug}" data-link class="btn btn-secondary" style="border-radius: var(--radius-pill); font-size: 0.875rem; padding: 6px 18px; min-height: 38px;">
        ${cat.name}
      </a>
    `
    )
    .join('');

  const productsGridHtml = featuredProducts
    .map(product => renderProductCard(product))
    .join('');

  return `
    <!-- Hero Section with Court Lines Pattern -->
    <section style="position: relative; background: var(--color-mint); border-bottom: 1px solid var(--color-mint-line); padding: var(--spacing-72) 0; overflow: hidden;">
      ${renderCourtHeroPattern()}
      <div class="container" style="position: relative; z-index: 1;">
        <div style="max-width: 680px;">
          <span style="background: var(--color-cork); color: var(--color-ink); font-weight: 700; font-size: 0.8125rem; padding: 4px 12px; border-radius: var(--radius-pill); text-transform: uppercase; letter-spacing: 0.5px;">Thương hiệu Cầu Lông Q-Sport</span>
          <h1 style="font-family: var(--font-display); font-size: clamp(2.25rem, 5vw, 4rem); color: var(--color-court); line-height: 1.1; margin: var(--spacing-16) 0;">
            BỨT PHÁ PHONG ĐỘ TRÊN MỌI ĐƯỜNG CẦU
          </h1>
          <p style="font-size: 1.125rem; color: var(--color-ink); margin-bottom: var(--spacing-32); line-height: 1.6;">
            Trang bị vợt, giày và phụ kiện cầu lông chính hãng Q-Sport. Thiết kế hiện đại, công nghệ trợ lực tối ưu cho từng đường cầu đập uy lực.
          </p>
          <div style="display: flex; gap: var(--spacing-16); flex-wrap: wrap;">
            <a href="/products" data-link class="btn btn-primary" style="font-size: 1.125rem; padding: 12px 28px;">
              Mua sắm ngay 🏸
            </a>
            <a href="/about" data-link class="btn btn-secondary" style="font-size: 1.125rem; padding: 12px 28px;">
              Khám phá thương hiệu
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Chips Bar -->
    <section style="padding: var(--spacing-32) 0; background: var(--color-white); border-bottom: 1px solid var(--color-mint-line);">
      <div class="container">
        <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-court); margin-bottom: var(--spacing-16); text-align: center;">
          DANH MỤC SẢN PHẨM NỔI BẬT
        </h2>
        <div style="display: flex; gap: var(--spacing-12); flex-wrap: wrap; justify-content: center;">
          <a href="/products" data-link class="btn btn-primary" style="border-radius: var(--radius-pill); font-size: 0.875rem; padding: 6px 18px; min-height: 38px;">
            Tất cả sản phẩm
          </a>
          ${categoryChipsHtml}
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section style="padding: var(--spacing-48) 0;">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--spacing-32);">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 2.25rem; color: var(--color-court);">
              SẢN PHẨM NỔI BẬT
            </h2>
            <p style="color: var(--color-muted); font-size: 1rem;">Những sản phẩm cầu lông bán chạy được các tay vợt tin dùng</p>
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

    <!-- Short About Snippet & Maps Section -->
    <section style="padding: var(--spacing-48) 0; background: var(--color-mint); border-top: 1px solid var(--color-mint-line);">
      <div class="container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-48); align-items: center;">
          <div>
            <span style="color: var(--color-court); font-weight: 700; font-size: 0.875rem; text-transform: uppercase;">Về Q-Sport</span>
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
