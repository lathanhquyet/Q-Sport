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
  // PRD12: Dây Cước Vợt Q-Sport Repulsion 66
  'PRD12': 'https://images.unsplash.com/photo-1617083934555-563d39589d31?auto=format&fit=crop&w=800&q=80',
};

/**
 * Returns the photographic URL for a given product code or falls back to SVG asset.
 */
export function getProductImageUrl(productCode: string, fallbackUrl?: string): string {
  return PRODUCT_REAL_IMAGES[productCode] || fallbackUrl || '/assets/products/placeholder.svg';
}
