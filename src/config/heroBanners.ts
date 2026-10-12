export interface HeroBannerSlide {
  id: string;
  url: string;
  alt: string;
  badgeText: string;
}

/**
 * Danh sách 5 ảnh banner cầu lông/thể thao thực tế từ public/assets/banners/
 * Ưu tiên định dạng WebP tối ưu hiệu năng và không gây layout shift.
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
    url: '/assets/banners/banner-player-smash.webp',
    alt: 'Vận động viên bật nhảy thực hiện cú đập cầu smash uy lực',
    badgeText: 'Tốc Độ & Sức Mạnh Smash',
  },
  {
    id: 'hero-3',
    url: '/assets/banners/banner-racket-speed.webp',
    alt: 'Khung vợt cầu lông carbon công nghệ khí động học tăng tốc vung vợt',
    badgeText: 'Khung Carbon Trợ Lực',
  },
  {
    id: 'hero-4',
    url: '/assets/banners/banner-match-court.webp',
    alt: 'Mặt sân thảm cầu lông tiêu chuẩn và vạch kẻ thi đấu',
    badgeText: 'Bao Quát Mọi Đường Cầu',
  },
  {
    id: 'hero-5',
    url: '/assets/banners/banner-tournament.webp',
    alt: 'Trang thiết bị phụ kiện cầu lông chính hãng phục vụ giải đấu',
    badgeText: 'Chính Hãng Q-Sport',
  },
] as const;

export const HERO_SLIDER_INTERVAL_MS = 3000;
