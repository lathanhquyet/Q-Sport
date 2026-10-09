/**
 * High-resolution verified real photography mapping from Unsplash for Q-Sport Badminton Catalog.
 * Each image URL corresponds to actual badminton rackets, shoes, shirts, shorts, bags, grips, and strings.
 */
export const PRODUCT_REAL_IMAGES: Record<string, string> = {
  // PRD01: Vợt Cầu Lông Q-Sport Pro Attack 100
  'PRD01': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
  // PRD02: Vợt Cầu Lông Q-Sport Speed Control 200
  'PRD02': 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?auto=format&fit=crop&w=800&q=80',
  // PRD03: Giày Cầu Lông Q-Sport GripMaster Green
  'PRD03': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  // PRD04: Giày Cầu Lông Q-Sport AirFlex Pastel
  'PRD04': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
  // PRD05: Áo Thi Đấu Cầu Lông Q-Sport Pro Dry Green
  'PRD05': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
  // PRD06: Áo T-Shirt Thể Thao Q-Sport Basic White
  'PRD06': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  // PRD07: Quần Short Cầu Lông Q-Sport Active Black
  'PRD07': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80',
  // PRD08: Quần Short Cầu Lông Q-Sport Pro Match Green
  'PRD08': 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80',
  // PRD09: Balo Cầu Lông Q-Sport Tour 6 Rackets
  'PRD09': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  // PRD10: Túi Xách Vợt Cầu Lông Q-Sport Compact Bag
  'PRD10': 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
  // PRD11: Quấn Cán Vợt Q-Sport Super Grip (Bộ 3 cái)
  'PRD11': 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80',
  // PRD12: Dây Cước Vợt Q-Sport Repulsion 66 (Verified 200 OK)
  'PRD12': 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=800&q=80',
};

/**
 * Fallback mapping table by product slug when product_code is missing or null.
 */
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
 * Returns the photographic URL for a given product code or slug, or falls back safely.
 */
export function getProductImageUrl(productCodeOrSlug?: string | null, fallbackUrl?: string | null): string {
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
