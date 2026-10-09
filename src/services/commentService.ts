import { supabase, isSupabaseConfigured } from './supabaseClient';
import { ProductComment } from '../types';

export interface AdminCommentView extends ProductComment {
  product_name?: string;
}

export interface CommentActionResult {
  success: boolean;
  message: string;
}

const memoryComments: AdminCommentView[] = [
  {
    id: 'cmt-demo-1',
    product_id: 'a0000000-0000-0000-0000-000000000001',
    product_name: 'Vợt Cầu Lông Q-Sport Pro Attack 100',
    display_name: 'Minh Tuấn (CLB Cầu Lông Thủ Đức)',
    content: 'Vợt đập rất đầm tay, vung vát không khí nhanh. Đã mua và rất hài lòng!',
    status: 'APPROVED',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'cmt-demo-2',
    product_id: 'a0000000-0000-0000-0000-000000000001',
    product_name: 'Vợt Cầu Lông Q-Sport Pro Attack 100',
    display_name: 'Hoàng Nam',
    content: 'Giao hàng nhanh tại Thủ Đức, sản phẩm đóng gói cẩn thận có thẻ bảo hành.',
    status: 'APPROVED',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'cmt-demo-3',
    product_id: 'a0000000-0000-0000-0000-000000000002',
    product_name: 'Giày Cầu Lông Q-Sport Speed Grip',
    display_name: 'Văn Thắng',
    content: 'Giày đi rất bám sân và ôm chân. Shop tư vấn chuẩn size.',
    status: 'PENDING',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
];

export function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
      // Fallback
    }
  }

  return memoryComments.filter(c => c.product_id === productId && c.status === 'APPROVED');
}

export async function submitComment(
  productId: string,
  displayName: string,
  content: string
): Promise<CommentActionResult> {
  let name = displayName ? displayName.trim() : '';
  if (!name) {
    name = 'Khách hàng';
  }
  const cleanContent = content ? content.trim() : '';

  if (!cleanContent) {
    return { success: false, message: 'Nội dung bình luận không được để trống' };
  }

  if (cleanContent.length > 500) {
    return { success: false, message: 'Nội dung bình luận không được vượt quá 500 ký tự' };
  }

  const safeName = sanitizeText(name);
  const safeContent = sanitizeText(cleanContent);

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('product_comments').insert([
        {
          product_id: productId,
          display_name: safeName,
          content: safeContent,
          status: 'PENDING',
        },
      ]);

      if (error) {
        return { success: false, message: error.message || 'Không thể gửi bình luận' };
      }

      return { success: true, message: 'Đã gửi bình luận. Bình luận sẽ hiển thị sau khi được duyệt.' };
    } catch {
      // Fallback
    }
  }

  // Local fallback storage
  memoryComments.unshift({
    id: 'cmt-demo-' + Date.now(),
    product_id: productId,
    display_name: safeName,
    content: safeContent,
    status: 'PENDING',
    created_at: new Date().toISOString(),
  });

  return { success: true, message: 'Đã gửi bình luận. Bình luận sẽ hiển thị sau khi được duyệt.' };
}

export async function fetchAdminComments(statusFilter?: string): Promise<AdminCommentView[]> {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('product_comments')
        .select(`
          *,
          product:products(name)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'ALL') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map((item: Record<string, unknown>) => ({
          id: item.id as string,
          product_id: item.product_id as string,
          product_name: item.product ? (item.product as Record<string, unknown>).name as string : undefined,
          display_name: item.display_name as string,
          content: item.content as string,
          status: item.status as 'PENDING' | 'APPROVED' | 'HIDDEN',
          created_at: item.created_at as string,
        }));
      }
    } catch {
      // Fallback
    }
  }

  if (statusFilter && statusFilter !== 'ALL') {
    return memoryComments.filter(c => c.status === statusFilter);
  }
  return memoryComments;
}

export async function updateCommentStatus(
  commentId: string,
  newStatus: 'APPROVED' | 'HIDDEN'
): Promise<CommentActionResult> {
  if (!commentId) {
    return { success: false, message: 'ID bình luận không hợp lệ' };
  }

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('product_comments')
        .update({ status: newStatus })
        .eq('id', commentId);

      if (error) {
        return { success: false, message: error.message || 'Lỗi cập nhật trạng thái bình luận' };
      }

      return { success: true, message: `Đã chuyển bình luận sang trạng thái ${newStatus}` };
    } catch {
      return { success: false, message: 'Lỗi kết nối máy chủ' };
    }
  }

  const found = memoryComments.find(c => c.id === commentId);
  if (found) {
    found.status = newStatus;
  }
  return { success: true, message: `Đã chuyển bình luận sang trạng thái ${newStatus} (Demo Mode)` };
}

export async function deleteComment(commentId: string): Promise<CommentActionResult> {
  if (!commentId) {
    return { success: false, message: 'ID bình luận không hợp lệ' };
  }

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('product_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        return { success: false, message: error.message || 'Lỗi xóa bình luận' };
      }

      return { success: true, message: 'Đã xóa bình luận thành công' };
    } catch {
      return { success: false, message: 'Lỗi kết nối máy chủ' };
    }
  }

  const idx = memoryComments.findIndex(c => c.id === commentId);
  if (idx >= 0) {
    memoryComments.splice(idx, 1);
  }
  return { success: true, message: 'Đã xóa bình luận thành công (Demo Mode)' };
}
