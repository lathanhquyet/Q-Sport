export type UserRole = 'ADMIN';

export interface AdminProfile {
  id: string;
  display_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  category_code: string;
  name: string;
  slug: string;
  description?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  product_code: string;
  category_id: string;
  name: string;
  slug: string;
  sku?: string | null;
  short_description?: string | null;
  description?: string | null;
  price: number; // Stored as integer VND
  sale_price?: number | null; // Optional sale price in VND
  stock_quantity: number;
  image_url?: string | null;
  is_active: boolean;
  is_featured: boolean;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text?: string | null;
  sort_order: number;
  created_at: string;
}

export type OrderStatus =
  | 'NEW'
  | 'PROCESSING'
  | 'OUT_OF_STOCK'
  | 'SHIPPED'
  | 'CANCELLED';

export type PaymentMethod = 'COD' | 'VIETQR';

export type PaymentStatus =
  | 'UNPAID'
  | 'PENDING_CONFIRMATION'
  | 'PAID'
  | 'COD_PENDING'
  | 'COD_COLLECTED';

export interface Order {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  customer_note?: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  currency: 'VND';
  customer_reported_paid_at?: string | null;
  paid_at?: string | null;
  paid_confirmed_by?: string | null;
  cancel_reason?: string | null;
  cancelled_at?: string | null;
  cancelled_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name_snapshot: string;
  sku_snapshot?: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
  created_at: string;
}

export type CommentStatus = 'PENDING' | 'APPROVED' | 'HIDDEN';

export interface ProductComment {
  id: string;
  product_id: string;
  display_name: string;
  content: string;
  status: CommentStatus;
  created_at: string;
  moderated_at?: string | null;
  moderated_by?: string | null;
}

export interface PublicStoreSettings {
  store_name: string;
  logo_url?: string | null;
  banner_url?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  about_us?: string | null;
  google_maps_embed_url?: string | null;
  youtube_channel_url?: string | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  bank_account_holder?: string | null;
  payment_instruction?: string | null;
}
