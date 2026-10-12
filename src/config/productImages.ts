/**
 * Q-Sport Local Product Image Catalog & Gallery Mapping.
 * Maps every single local image asset in public/assets/products/{Vot, Giay, Ao, Quan, Balo, PhuKien}
 * directly to catalog products PRD01 - PRD12.
 */

// 1. Primary local image for catalog listing
export const PRODUCT_LOCAL_IMAGES: Record<string, string> = {
  // Vợt
  'PRD01': '/assets/products/Vot/vot-cau-long-lining-axforce-90-limited-2026-chinh-hang_1774060510.webp',
  'PRD02': '/assets/products/Vot/vot-cau-long-yonex-nanoflare-700-pro-chinh-hang_1727042472.webp',

  // Giày
  'PRD03': '/assets/products/Giay/1giay-cau-long-asics-gel-rocket-12-men-ocean-haze-concrete-chinh-hang-1071a116-403_1783911358.webp',
  'PRD04': '/assets/products/Giay/1giay-cau-long-lining-blade-2-se-unisex-p-aytw001-2v-chinh-hang_1788144496.webp',

  // Áo
  'PRD05': '/assets/products/Ao/1.ao-cau-long-yonex.webp',
  'PRD06': '/assets/products/Ao/2.ao-yonex-trmyob26147-dark-navy.webp',

  // Quần
  'PRD07': '/assets/products/Quan/quan-cau-long-yonex-tsm3609-mys26-navy-chinh-hang_1784495239.webp',
  'PRD08': '/assets/products/Quan/quan-cau-long-yonex-tsm3609-mys26-white-chinh-hang_1784495245.webp',

  // Balo
  'PRD09': '/assets/products/Balo/balo_cau_long_yonex_1024x1024.png',
  'PRD10': '/assets/products/Balo/ahihi_master_1024x1024.webp',

  // Phụ kiện
  'PRD11': '/assets/products/PhuKien/vo-cau-long-yonex-sksssrl2964-sc18-white-chinh-hang_1789782282.webp',
  'PRD12': '/assets/products/PhuKien/1day-cuoc-cang-vot-hundred-jp66_1785358194.webp',
};

// 2. Full product image galleries integrating ALL 25 local product assets
export const PRODUCT_GALLERY_IMAGES: Record<string, string[]> = {
  // PRD01: Vợt Cầu Lông Q-Sport Pro Attack 100
  'PRD01': [
    '/assets/products/Vot/vot-cau-long-lining-axforce-90-limited-2026-chinh-hang_1774060510.webp',
    '/assets/products/Vot/vot-cau-long-yonex-astrox-99-tour-2025-black-green-chinh-hang_1756252431.webp',
  ],

  // PRD02: Vợt Cầu Lông Q-Sport Speed Control 200
  'PRD02': [
    '/assets/products/Vot/vot-cau-long-yonex-nanoflare-700-pro-chinh-hang_1727042472.webp',
    '/assets/products/Vot/vot-cau-long-yonex-astrox-100-game-va-grayish-beige-chinh-hang_1758652101.webp',
  ],

  // PRD03: Giày Cầu Lông Q-Sport GripMaster Green
  'PRD03': [
    '/assets/products/Giay/1giay-cau-long-asics-gel-rocket-12-men-ocean-haze-concrete-chinh-hang-1071a116-403_1783911358.webp',
    '/assets/products/Giay/giay-cau-long-mizuno-wave-claw-4-trang-chinh-hang-71ga264302_1773716444.webp',
  ],

  // PRD04: Giày Cầu Lông Q-Sport AirFlex Pastel
  'PRD04': [
    '/assets/products/Giay/1giay-cau-long-lining-blade-2-se-unisex-p-aytw001-2v-chinh-hang_1788144496.webp',
    '/assets/products/Giay/giay-cau-long-yonex-subaxia-gt-men-dark-gray-chinh-hang_1768944576.webp',
  ],

  // PRD05: Áo Thi Đấu Cầu Lông Q-Sport Pro Dry Green
  'PRD05': [
    '/assets/products/Ao/1.ao-cau-long-yonex.webp',
    '/assets/products/Ao/3.yonex-vietnamopen2026.webp',
  ],

  // PRD06: Áo T-Shirt Thể Thao Q-Sport Basic White
  'PRD06': [
    '/assets/products/Ao/2.ao-yonex-trmyob26147-dark-navy.webp',
    '/assets/products/Ao/3.yonex-vietnamopen2026.webp',
  ],

  // PRD07: Quần Short Cầu Lông Q-Sport Active Black
  'PRD07': [
    '/assets/products/Quan/quan-cau-long-yonex-tsm3609-mys26-navy-chinh-hang_1784495239.webp',
    '/assets/products/Quan/vay-cau-long-yonex-tsi3571-mys26-navy-chinh-hang_1784495661.webp',
  ],

  // PRD08: Quần Short Cầu Lông Q-Sport Pro Match Green
  'PRD08': [
    '/assets/products/Quan/quan-cau-long-yonex-tsm3609-mys26-white-chinh-hang_1784495245.webp',
    '/assets/products/Quan/vay-cau-long-yonex-tsi3342-act35-white-chinh-hang_1784679307.webp',
  ],

  // PRD09: Balo Cầu Lông Q-Sport Tour 6 Rackets
  'PRD09': [
    '/assets/products/Balo/balo_cau_long_yonex_1024x1024.png',
    '/assets/products/Balo/ahihi_master_1024x1024.webp',
  ],

  // PRD10: Túi Xách Vợt Cầu Lông Q-Sport Compact Bag
  'PRD10': [
    '/assets/products/Balo/ahihi_master_1024x1024.webp',
    '/assets/products/Balo/balo_cau_long_yonex_1024x1024.png',
  ],

  // PRD11: Quấn Cán Vợt Q-Sport Super Grip (Bộ 3 cái) & Phụ kiện tất, bình nước
  'PRD11': [
    '/assets/products/PhuKien/vo-cau-long-yonex-sksssrl2964-sc18-white-chinh-hang_1789782282.webp',
    '/assets/products/PhuKien/vo-cau-long-lining-awss387-6-chinh-hang_1790899002.webp',
    '/assets/products/PhuKien/vo-cau-long-victor-sk1503-a-trang-xam-chinh-hang_1789786445.webp',
    '/assets/products/PhuKien/binh-nuoc-yonex-ac094cr-2000ml_1723258397.webp',
  ],

  // PRD12: Dây Cước Vợt Q-Sport Repulsion 66 & Ống cầu lông
  'PRD12': [
    '/assets/products/PhuKien/1day-cuoc-cang-vot-hundred-jp66_1785358194.webp',
    '/assets/products/PhuKien/day-cuoc-cang-vot-gosen-ryzonic-62_1765835996.webp',
    '/assets/products/PhuKien/cau-long-vina-star-1.webp',
    '/assets/products/PhuKien/ong-cau-long-vbcs-pro_1748630815.webp',
  ],
};

// Fallback Unsplash mapping (giữ tương thích với regression test suite)
export const PRODUCT_REAL_IMAGES: Record<string, string> = {
  'PRD01': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
  'PRD02': 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?auto=format&fit=crop&w=800&q=80',
  'PRD03': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  'PRD04': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
  'PRD05': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
  'PRD06': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  'PRD07': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80',
  'PRD08': 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80',
  'PRD09': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  'PRD10': 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
  'PRD11': 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80',
  'PRD12': 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=800&q=80',
};

export const PRODUCT_SLUG_TO_CODE: Record<string, string> = {
  'vot-cau-long-qsport-pro-attack-100': 'PRD01',
  'vot-cau-long-qsport-speed-control-200': 'PRD02',
  'giay-cau-long-qsport-gripmaster-green': 'PRD03',
  'giay-cau-long-qsport-airflex-pastel': 'PRD04',
  'ao-thi-dau-qsport-pro-dry-green': 'PRD05',
  'ao-t-shirt-the-thao-qsport-basic-white': 'PRD06',
  'quan-short-qsport-active-black': 'PRD07',
  'quan-short-qsport-pro-match-green': 'PRD08',
  'balo-cau-long-qsport-tour-6-rackets': 'PRD09',
  'tui-xach-vot-qsport-compact-bag': 'PRD10',
  'quan-can-vot-qsport-super-grip-3-pcs': 'PRD11',
  'day-cuoc-vot-qsport-repulsion-66': 'PRD12',
};

/**
 * Lấy URL ảnh local trong repository public/assets/products/ cho sản phẩm
 */
export function getProductLocalImage(productCodeOrSlug?: string | null): string | null {
  if (!productCodeOrSlug) return null;
  if (PRODUCT_LOCAL_IMAGES[productCodeOrSlug]) return PRODUCT_LOCAL_IMAGES[productCodeOrSlug];
  const code = PRODUCT_SLUG_TO_CODE[productCodeOrSlug];
  if (code && PRODUCT_LOCAL_IMAGES[code]) return PRODUCT_LOCAL_IMAGES[code];
  return null;
}

/**
 * Returns the photographic URL for a given product code or slug, or falls back safely.
 */
export function getProductImageUrl(productCodeOrSlug?: string | null, fallbackUrl?: string | null): string {
  // Direct local repository asset paths taking precedence if explicitly set by admin or user
  if (fallbackUrl && (
    fallbackUrl.startsWith('/assets/products/Giay/') ||
    fallbackUrl.startsWith('/assets/products/Vot/') ||
    fallbackUrl.startsWith('/assets/products/Quan/') ||
    fallbackUrl.startsWith('/assets/products/Ao/') ||
    fallbackUrl.startsWith('/assets/products/Balo/') ||
    fallbackUrl.startsWith('/assets/products/PhuKien/') ||
    fallbackUrl.startsWith('/assets/branding/') ||
    fallbackUrl.startsWith('/assets/banners/')
  )) {
    return fallbackUrl;
  }

  if (!productCodeOrSlug) {
    return fallbackUrl || '/assets/products/placeholder.svg';
  }
  // Direct product code match (e.g. PRD01)
  if (PRODUCT_REAL_IMAGES[productCodeOrSlug]) {
    return PRODUCT_REAL_IMAGES[productCodeOrSlug];
  }
  // Slug match fallback
  const codeFromSlug = PRODUCT_SLUG_TO_CODE[productCodeOrSlug];
  if (codeFromSlug && PRODUCT_REAL_IMAGES[codeFromSlug]) {
    return PRODUCT_REAL_IMAGES[codeFromSlug];
  }
  // Safe fallback to existing image_url or default placeholder SVG
  return fallbackUrl || '/assets/products/placeholder.svg';
}

/**
 * Lấy danh sách toàn bộ ảnh gallery của sản phẩm để hiển thị thumbnail switcher
 */
export function getProductGallery(productCodeOrSlug?: string | null): string[] {
  if (!productCodeOrSlug) return [];

  const code = PRODUCT_LOCAL_IMAGES[productCodeOrSlug]
    ? productCodeOrSlug
    : PRODUCT_SLUG_TO_CODE[productCodeOrSlug] || '';

  if (code && PRODUCT_GALLERY_IMAGES[code]) {
    return PRODUCT_GALLERY_IMAGES[code];
  }

  const local = getProductLocalImage(productCodeOrSlug);
  if (local) return [local];

  const single = getProductImageUrl(productCodeOrSlug);
  return single ? [single] : [];
}
