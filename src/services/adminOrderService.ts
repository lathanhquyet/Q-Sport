import { supabase, isSupabaseConfigured } from './supabaseClient';

export type OrderStatus = 'NEW' | 'PROCESSING' | 'SHIPPED' | 'CANCELLED';

export interface AdminOrder {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  customer_note?: string;
  payment_method: string;
  payment_status: string;
  order_status: OrderStatus;
  total_amount: number;
  cancel_reason?: string;
  created_at: string;
  updated_at?: string;
}

export interface AdminOrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name_snapshot: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface OrderActionResult {
  success: boolean;
  message?: string;
  order?: AdminOrder;
}

export async function fetchAdminOrders(statusFilter?: string): Promise<AdminOrder[]> {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'ALL') {
        query = query.eq('order_status', statusFilter);
      }

      const { data, error } = await query;
      if (error || !data) {
        return getMockOrders(statusFilter);
      }

      return data.map((item: Record<string, unknown>) => ({
        id: item.id as string,
        order_code: item.order_code as string,
        customer_name: item.customer_name as string,
        customer_phone: item.customer_phone as string,
        shipping_address: item.shipping_address as string,
        customer_note: (item.customer_note as string) || undefined,
        payment_method: (item.payment_method as string) || 'COD',
        payment_status: (item.payment_status as string) || 'COD_PENDING',
        order_status: item.order_status as OrderStatus,
        total_amount: Number(item.total_amount),
        cancel_reason: (item.cancel_reason as string) || undefined,
        created_at: item.created_at as string,
        updated_at: (item.updated_at as string) || undefined,
      }));
    } catch {
      return getMockOrders(statusFilter);
    }
  }

  return getMockOrders(statusFilter);
}

export async function fetchAdminOrderItems(orderId: string): Promise<AdminOrderItem[]> {
  if (!orderId) return [];

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error || !data) {
        return getMockOrderItems(orderId);
      }

      return data.map((item: Record<string, unknown>) => ({
        id: item.id as string,
        order_id: item.order_id as string,
        product_id: (item.product_id as string) || undefined,
        product_name_snapshot: item.product_name_snapshot as string,
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity),
        line_total: Number(item.line_total),
      }));
    } catch {
      return getMockOrderItems(orderId);
    }
  }

  return getMockOrderItems(orderId);
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  cancelReason?: string
): Promise<OrderActionResult> {
  if (!orderId) {
    return { success: false, message: 'Mã ID đơn hàng không hợp lệ' };
  }

  const validStatuses: OrderStatus[] = ['NEW', 'PROCESSING', 'SHIPPED', 'CANCELLED'];
  if (!validStatuses.includes(newStatus)) {
    return { success: false, message: 'Trạng thái đơn hàng không hợp lệ' };
  }

  if (newStatus === 'CANCELLED') {
    const cleanReason = cancelReason ? cancelReason.trim() : '';
    if (!cleanReason) {
      return { success: false, message: 'Vui lòng nhập lý do bắt buộc khi hủy đơn hàng' };
    }
  }

  const updateData: Record<string, unknown> = {
    order_status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (newStatus === 'CANCELLED') {
    updateData.cancel_reason = cancelReason?.trim();
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error || !data) {
        return { success: false, message: error?.message || 'Lỗi cập nhật trạng thái đơn hàng trên máy chủ' };
      }

      return { success: true, message: `Đã chuyển đơn hàng sang trạng thái ${newStatus}` };
    } catch {
      return { success: false, message: 'Lỗi mạng khi cập nhật đơn hàng' };
    }
  }

  return { success: true, message: `Đã chuyển đơn hàng sang trạng thái ${newStatus} (Demo Mode)` };
}

// Mock fallback orders for development/demo
function getMockOrders(statusFilter?: string): AdminOrder[] {
  const all: AdminOrder[] = [
    {
      id: 'ord-demo-1',
      order_code: 'QS-9A8B7C',
      customer_name: 'Nguyễn Văn A',
      customer_phone: '0987654321',
      shipping_address: '123 Đường Cầu Lông, Quận 1, TP. HCM',
      customer_note: 'Giao giờ hành chính',
      payment_method: 'COD',
      payment_status: 'COD_PENDING',
      order_status: 'NEW',
      total_amount: 2900000,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'ord-demo-2',
      order_code: 'QS-3D2E1F',
      customer_name: 'Trần Thị B',
      customer_phone: '0398765432',
      shipping_address: '456 Võ Văn Ngân, Thủ Đức, TP. HCM',
      payment_method: 'COD',
      payment_status: 'COD_PENDING',
      order_status: 'PROCESSING',
      total_amount: 1450000,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'ord-demo-3',
      order_code: 'QS-7F6E5D',
      customer_name: 'Lê Văn C',
      customer_phone: '0771234567',
      shipping_address: '789 Phạm Văn Đồng, Thủ Đức',
      payment_method: 'COD',
      payment_status: 'COD_PENDING',
      order_status: 'CANCELLED',
      cancel_reason: 'Khách hàng đổi ý mua mẫu khác',
      total_amount: 850000,
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  if (statusFilter && statusFilter !== 'ALL') {
    return all.filter(o => o.order_status === statusFilter);
  }
  return all;
}

function getMockOrderItems(orderId: string): AdminOrderItem[] {
  return [
    {
      id: 'item-1',
      order_id: orderId,
      product_name_snapshot: 'Vợt Cầu Lông Q-Sport Pro Attack 100',
      unit_price: 1450000,
      quantity: 2,
      line_total: 2900000,
    },
  ];
}
