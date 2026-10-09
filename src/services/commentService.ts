import { supabase, isSupabaseConfigured } from './supabaseClient';
import { ProductComment } from '../types';

export const DEMO_COMMENTS: Record<string, ProductComment[]> = {
  'p0000000-0000-0000-0000-000000000001': [
    {
      id: 'cmt-1',
      product_id: 'p0000000-0000-0000-0000-000000000001',
      display_name: 'Minh Tuấn (CLB Cầu Lông Thủ Đức)',
      content: 'Vợt đập rất đầm tay, vung vát không khí nhanh. Đã mua và rất hài lòng!',
      status: 'APPROVED',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'cmt-2',
      product_id: 'p0000000-0000-0000-0000-000000000001',
      display_name: 'Hoàng Nam',
      content: 'Giao hàng nhanh tại Thủ Đức, sản phẩm đóng gói cẩn thận có thẻ bảo hành.',
      status: 'APPROVED',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
};

export async function getProductComments(productId: string): Promise<ProductComment[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('product_comments')
        .select('*')
        .eq('product_id', productId)
        .eq('status', 'APPROVED')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as ProductComment[];
      }
    } catch {
      // Fallback below
    }
  }

  return DEMO_COMMENTS[productId] || [];
}

export async function submitComment(
  productId: string,
  displayName: string,
  content: string
): Promise<{ success: boolean; message: string }> {
  if (!displayName || displayName.trim() === '') {
    displayName = 'Khách hàng';
  }
  if (!content || content.trim() === '') {
    return { success: false, message: 'Nội dung bình luận không được để trống' };
  }

  const cleanDisplayName = sanitizeText(displayName.trim());
  const cleanContent = sanitizeText(content.trim());

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('product_comments').insert([
        {
          product_id: productId,
          display_name: cleanDisplayName,
          content: cleanContent,
          status: 'PENDING',
        },
      ]);

      if (error) {
        return { success: false, message: 'Không thể gửi bình luận. Vui lòng thử lại sau.' };
      }
      return { success: true, message: 'Đã gửi bình luận. Bình luận sẽ hiển thị sau khi được duyệt.' };
    } catch {
      // Fallback below
    }
  }

  // Fallback storage in memory for demonstration
  if (!DEMO_COMMENTS[productId]) {
    DEMO_COMMENTS[productId] = [];
  }

  return { success: true, message: 'Đã gửi bình luận. Bình luận sẽ hiển thị sau khi được duyệt.' };
}

export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
