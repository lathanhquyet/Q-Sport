import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Product } from '../types';
import { getProducts } from './productService';

export interface AdminProductInput {
  name: string;
  category_id: string;
  price: number;
  stock_quantity: number;
  short_description?: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface ActionResult {
  success: boolean;
  message?: string;
  data?: Product;
}

function generateSlug(name: string): string {
  const clean = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return `${clean}-${Math.random().toString(36).substring(2, 6)}`;
}

export async function fetchAdminProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error || !data) {
        return getProducts();
      }

      const now = new Date().toISOString();
      return data.map((item: Record<string, unknown>) => ({
        id: item.id as string,
        category_id: item.category_id as string,
        name: item.name as string,
        slug: item.slug as string,
        sku: (item.sku as string) || undefined,
        short_description: (item.short_description as string) || undefined,
        description: (item.description as string) || undefined,
        price: Number(item.price),
        stock_quantity: Number(item.stock_quantity),
        image_url: (item.image_url as string) || undefined,
        is_active: Boolean(item.is_active),
        is_featured: Boolean(item.is_featured),
        created_at: (item.created_at as string) || now,
        updated_at: (item.updated_at as string) || now,
        category: item.category ? {
          id: (item.category as Record<string, unknown>).id as string,
          name: (item.category as Record<string, unknown>).name as string,
          slug: (item.category as Record<string, unknown>).slug as string,
        } : undefined,
      }));
    } catch {
      return getProducts();
    }
  }

  // Fallback local products
  return getProducts();
}

export async function createProduct(input: AdminProductInput): Promise<ActionResult> {
  if (!input.name || !input.name.trim()) {
    return { success: false, message: 'Tên sản phẩm không được để trống' };
  }
  if (!input.category_id) {
    return { success: false, message: 'Vui lòng chọn danh mục sản phẩm' };
  }
  if (input.price < 0) {
    return { success: false, message: 'Giá sản phẩm không được nhỏ hơn 0' };
  }
  if (input.stock_quantity < 0) {
    return { success: false, message: 'Số lượng tồn kho không được nhỏ hơn 0' };
  }

  const slug = generateSlug(input.name);
  const payload = {
    name: input.name.trim(),
    slug,
    category_id: input.category_id,
    price: Math.floor(input.price),
    stock_quantity: Math.floor(input.stock_quantity),
    short_description: input.short_description?.trim() || null,
    description: input.description?.trim() || null,
    image_url: input.image_url?.trim() || '/assets/products/placeholder.svg',
    is_active: input.is_active ?? true,
    is_featured: input.is_featured ?? false,
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single();

      if (error || !data) {
        return { success: false, message: error?.message || 'Lỗi thêm sản phẩm vào Supabase' };
      }

      return { success: true, message: 'Thêm sản phẩm mới thành công', data: data as unknown as Product };
    } catch {
      return { success: false, message: 'Lỗi mạng khi thêm sản phẩm' };
    }
  }

  // Fallback demo product creation
  const now = new Date().toISOString();
  const demoProduct: Product = {
    id: 'p-demo-' + Date.now(),
    ...payload,
    price: payload.price,
    stock_quantity: payload.stock_quantity,
    image_url: payload.image_url || undefined,
    short_description: payload.short_description || undefined,
    description: payload.description || undefined,
    created_at: now,
    updated_at: now,
  };

  return { success: true, message: 'Thêm sản phẩm mới thành công (Demo Mode)', data: demoProduct };
}

export async function updateProduct(id: string, input: Partial<AdminProductInput>): Promise<ActionResult> {
  if (!id) {
    return { success: false, message: 'ID sản phẩm không hợp lệ' };
  }

  if (input.price !== undefined && input.price < 0) {
    return { success: false, message: 'Giá sản phẩm không được nhỏ hơn 0' };
  }
  if (input.stock_quantity !== undefined && input.stock_quantity < 0) {
    return { success: false, message: 'Số lượng tồn kho không được nhỏ hơn 0' };
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name) updateData.name = input.name.trim();
  if (input.category_id) updateData.category_id = input.category_id;
  if (input.price !== undefined) updateData.price = Math.floor(input.price);
  if (input.stock_quantity !== undefined) updateData.stock_quantity = Math.floor(input.stock_quantity);
  if (input.short_description !== undefined) updateData.short_description = input.short_description.trim() || null;
  if (input.description !== undefined) updateData.description = input.description.trim() || null;
  if (input.image_url !== undefined) updateData.image_url = input.image_url.trim() || null;
  if (input.is_active !== undefined) updateData.is_active = input.is_active;
  if (input.is_featured !== undefined) updateData.is_featured = input.is_featured;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        return { success: false, message: error?.message || 'Lỗi cập nhật sản phẩm' };
      }

      return { success: true, message: 'Cập nhật sản phẩm thành công', data: data as unknown as Product };
    } catch {
      return { success: false, message: 'Lỗi mạng khi cập nhật sản phẩm' };
    }
  }

  return { success: true, message: 'Cập nhật sản phẩm thành công (Demo Mode)' };
}

export async function toggleProductActive(id: string, currentActive: boolean): Promise<ActionResult> {
  return updateProduct(id, { is_active: !currentActive });
}

export async function toggleProductFeatured(id: string, currentFeatured: boolean): Promise<ActionResult> {
  return updateProduct(id, { is_featured: !currentFeatured });
}

export async function softDeleteProduct(id: string): Promise<ActionResult> {
  if (!id) return { success: false, message: 'ID sản phẩm không hợp lệ' };

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString(), is_active: false })
        .eq('id', id);

      if (error) {
        return { success: false, message: error.message || 'Lỗi xóa sản phẩm' };
      }

      return { success: true, message: 'Đã xóa mềm sản phẩm thành công' };
    } catch {
      return { success: false, message: 'Lỗi mạng khi xóa sản phẩm' };
    }
  }

  return { success: true, message: 'Đã xóa mềm sản phẩm thành công (Demo Mode)' };
}
