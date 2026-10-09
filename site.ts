/**
 * Cấu hình cố định của website Q-Sport (thương hiệu hư cấu, đồ án cuối khóa).
 * Chủ dự án điền các giá trị đánh dấu TODO. Không tự bịa URL.
 * Đây chỉ là thông tin công khai: KHÔNG đặt secret vào file này.
 */

export const SITE = {
  name: 'Q-Sport',
  tagline: 'Cầu lông và phụ kiện thể thao',
  representative: 'Lã Thành Quyết',
  email: 'ltquyet@qsport.vn',

  // TODO: điền số điện thoại minh họa (để trống nếu chưa có)
  phone: '',

  // Địa chỉ minh họa cho đồ án (không phải địa chỉ thật)
  address: 'Địa chỉ minh họa cho đồ án',
  addressNote: 'Địa chỉ minh họa cho đồ án',

  /**
   * TODO: Google Maps -> Chia sẻ -> Nhúng bản đồ -> chỉ chép giá trị src của iframe.
   * Ví dụ dạng: https://www.google.com/maps/embed?pb=...
   * Để trống thì giao diện hiện thông báo thay thế.
   */
  MAPS_EMBED_URL: '',

  /**
   * TODO: YouTube -> Chia sẻ -> Nhúng -> chỉ chép giá trị src của iframe.
   * Ví dụ dạng: https://www.youtube.com/embed/VIDEO_ID
   * Để trống thì giao diện hiện thông báo thay thế.
   */
  YOUTUBE_EMBED_URL: '',

  // Footer bắt buộc theo PRD mục 5: hiển thị chính xác, không sửa chữ.
  footer: {
    copyright: '© Q-Sport. Bản quyền thuộc về Q-Sport.',
    representative: 'Đại diện: Lã Thành Quyết',
    email: 'Email: ltquyet@qsport.vn',
  },

  // Logo: chỉ dùng đúng các file này (xem DESIGN.md mục 2).
  logo: {
    main: '/assets/logo.svg',
    mark: '/assets/logo-mark.svg',
    favicon: '/assets/favicon.svg',
  },

  // Phí vận chuyển MVP (VND, số nguyên). Xem PRD mục 12.
  shippingFee: 0,
} as const;

/** Chỉ cho phép nhúng từ các nguồn đã biết; không cho HTML/JS tùy ý (PRD mục 7). */
const ALLOWED_EMBED_HOSTS = [
  'www.google.com', // Google Maps embed: /maps/embed...
  'www.youtube.com',
  'www.youtube-nocookie.com',
] as const;

export type EmbedKind = 'maps' | 'youtube';

/** Trả về URL hợp lệ để gán vào iframe.src, hoặc null nếu chưa cấu hình/không hợp lệ. */
export function getSafeEmbedUrl(url: string, kind: EmbedKind): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return null;
    if (!(ALLOWED_EMBED_HOSTS as readonly string[]).includes(u.hostname)) return null;
    if (kind === 'maps' && !u.pathname.startsWith('/maps/embed')) return null;
    if (kind === 'youtube' && !u.pathname.startsWith('/embed/')) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export const mapsEmbedUrl = (): string | null =>
  getSafeEmbedUrl(SITE.MAPS_EMBED_URL, 'maps');

export const youtubeEmbedUrl = (): string | null =>
  getSafeEmbedUrl(SITE.YOUTUBE_EMBED_URL, 'youtube');
