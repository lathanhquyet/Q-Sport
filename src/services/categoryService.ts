import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Category } from '../types';

export const DEMO_CATEGORIES: Category[] = [
  { id: 'c0000000-0000-0000-0000-000000000001', category_code: 'CAT01', name: 'Giày', slug: 'giay', description: 'Giày cầu lông bám sân', sort_order: 1, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c0000000-0000-0000-0000-000000000002', category_code: 'CAT02', name: 'Vợt', slug: 'vot', description: 'Vợt cầu lông chính hãng Q-Sport', sort_order: 2, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c0000000-0000-0000-0000-000000000003', category_code: 'CAT03', name: 'Quần', slug: 'quan', description: 'Quần thể thao thoáng khí', sort_order: 3, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c0000000-0000-0000-0000-000000000004', category_code: 'CAT04', name: 'Áo', slug: 'ao', description: 'Áo thi đấu thấm hút mồ hôi', sort_order: 4, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c0000000-0000-0000-0000-000000000005', category_code: 'CAT05', name: 'Balo', slug: 'balo', description: 'Balo đựng vợt chuyên dụng', sort_order: 5, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c0000000-0000-0000-0000-000000000006', category_code: 'CAT06', name: 'Phụ kiện', slug: 'phu-kien', description: 'Quấn cán, cước, phụ kiện thể thao', sort_order: 6, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch {
      // Fallback
    }
  }

  return DEMO_CATEGORIES;
}
