export interface HeroBannerSlide {
  id: string;
  url: string;
  alt: string;
  badgeText: string;
}

/**
 * Danh sách 5 ảnh banner cầu lông thực tế được tối ưu hóa cho Hero Slider từ public/assets/banners/
 * Định dạng WebP chất lượng cao, tỷ lệ khung hình 3:2 chuẩn hóa chống CLS và tải mượt mà.
 */
export const HERO_SLIDER_IMAGES: readonly HeroBannerSlide[] = [
  {
    id: 'hero-1',
    url: '/assets/banners/home-hero.webp',
    alt: 'Vợt và quả cầu lông trên sân thi đấu chuyên nghiệp Q-Sport',
    badgeText: 'Dụng Cụ Thi Đấu Đỉnh Cao',
  },
  {
    id: 'hero-2',
    url: '/assets/banners/banner-hero-nanoflare-1000z.webp',
    alt: 'Siêu phẩm vợt Yonex Nanoflare 1000Z gia tăng tốc độ đập cầu',
    badgeText: 'Nanoflare 1000Z Siêu Tốc',
  },
  {
    id: 'hero-3',
    url: '/assets/banners/banner-hero-shoes-shbvazm.webp',
    alt: 'Giày cầu lông chuyên nghiệp Yonex SHBVAZM 2026 bám sân giảm chấn',
    badgeText: 'Giày Thi Đấu 2026',
  },
  {
    id: 'hero-4',
    url: '/assets/banners/banner-hero-one-piece.webp',
    alt: 'Bộ sưu tập dụng cụ cầu lông Yonex x One Piece độc quyền chính hãng',
    badgeText: 'Bộ Sưu Tập Giới Hạn',
  },
  {
    id: 'hero-5',
    url: '/assets/banners/banner-hero-graphite-throttle.webp',
    alt: 'Công nghệ khung vợt Graphite Throttle carbon trợ lực tối đa',
    badgeText: 'Khung Carbon Trợ Lực',
  },
] as const;

export const HERO_SLIDER_INTERVAL_MS = 3000;
