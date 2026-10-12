export interface InternalNewsVideo {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  publishedAt?: string;
  isVisible: boolean;
  order: number;
}

/**
 * Extracts a YouTube Video ID from various URL formats:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/shorts/VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Pattern matches 11-character YouTube video IDs
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);

  if (match && match[1]) {
    return match[1];
  }

  // Direct 11-char ID check
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Generates official YouTube high-quality thumbnail URL from video ID.
 */
export function getYouTubeThumbnailUrl(videoId: string): string {
  if (!videoId) return '/assets/products/placeholder.svg';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Default internal news and tutorial videos for Q-Sport Badminton Store.
 * Managed directly in source code for maximum performance and zero infrastructure cost.
 */
export const INTERNAL_NEWS_VIDEOS: InternalNewsVideo[] = [
  {
    id: 'vid-01',
    title: 'Hướng dẫn kỹ thuật đập cầu (Smash) uy lực chuẩn thi đấu',
    description: 'Phân tích điểm tiếp xúc cầu, kỹ thuật xoay cổ tay và dồn trọng tâm giúp cú đập cầu cắm sân và đạt vận tốc tối đa.',
    youtubeUrl: 'https://www.youtube.com/watch?v=vMts0wdQfKI',
    publishedAt: '2026-10-10',
    isVisible: true,
    order: 1,
  },
  {
    id: 'vid-02',
    title: 'Cách chọn vợt cầu lông phù hợp: Công, thủ hay toàn diện?',
    description: 'Bí quyết xem thông số trọng lượng 3U/4U, điểm cân bằng Head Heavy/Light và độ cứng thân vợt từ chuyên gia Q-Sport.',
    youtubeUrl: 'https://www.youtube.com/watch?v=4_hy-Ns0KPM',
    publishedAt: '2026-10-08',
    isVisible: true,
    order: 2,
  },
  {
    id: 'vid-03',
    title: 'Bộ bài tập bước chân di chuyển (Footwork) 6 góc sân cơ bản',
    description: 'Cải thiện tốc độ bao sân, giữ thăng bằng và giảm tải áp lực lên khớp gối với phương pháp bước chân hiện đại.',
    youtubeUrl: 'https://www.youtube.com/watch?v=iULiKhJKlQg',
    publishedAt: '2026-10-05',
    isVisible: true,
    order: 3,
  },
  {
    id: 'vid-04',
    title: 'Quy trình đan cước vợt 4 nút chuẩn quốc tế:',
    description: 'Trải nghiệm kỹ thuật căng vợt điện tử chính xác từng lbs, bảo vệ gen vợt và tối ưu độ nảy của mặt vợt.',
    youtubeUrl: 'https://www.youtube.com/watch?v=kVq9Kqg7JSo',
    publishedAt: '2026-09-28',
    isVisible: true,
    order: 4,
  },
  {
    id: 'vid-05',
    title: 'Kinh nghiệm chọn giày cầu lông: Chống lật cổ chân và bám sân',
    description: 'Đánh giá công nghệ đệm khí giảm chấn, đế cao su tự nhiên bám sàn gỗ/thảm và cách chọn size giày chuẩn.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Is5et_xZHt4',
    publishedAt: '2026-09-20',
    isVisible: true,
    order: 5,
  },
  {
    id: 'vid-06',
    title: 'Hành trình Q-Sport: Đồng hành cùng phong trào cầu lông Việt Nam',
    description: 'Khám phá câu chuyện thương hiệu Q-Sport, sứ mệnh mang dụng cụ cầu lông chất lượng cao đến mọi tay vợt đam mê.',
    youtubeUrl: 'https://www.youtube.com/watch?v=PEB-b8Xb1Sk',
    publishedAt: '2026-09-15',
    isVisible: true,
    order: 6,
  },
  {
    id: 'vid-07',
    title: 'Lỗi phát cầu lông: Phát Cầu - Nhận Cầu như thế nào Mới Đúng ???',
    description: 'Lỗi phát cầu lông: Phát Cầu - Nhận Cầu như thế nào Mới Đúng ??',
    youtubeUrl: 'https://www.youtube.com/watch?v=iQBhBivaBYU',
    publishedAt: '2026-09-15',
    isVisible: true,
    order: 7,
  },
];

/**
 * Retrieves visible internal news videos sorted by order.
 */
export function getVisibleInternalNews(): InternalNewsVideo[] {
  return INTERNAL_NEWS_VIDEOS
    .filter(v => v.isVisible)
    .sort((a, b) => a.order - b.order);
}
