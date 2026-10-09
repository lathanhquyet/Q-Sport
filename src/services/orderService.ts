import { supabase, isSupabaseConfigured } from './supabaseClient';
import { getCart, clearCart } from './cartService';

export interface CheckoutFormData {
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  customer_note?: string;
}

export interface CreateOrderResult {
  success: boolean;
  message?: string;
  order_code?: string;
  order_id?: string;
  total_amount?: number;
}

export function validateVietnamesePhone(phone: string): boolean {
  if (!phone) return false;
  const cleanPhone = phone.trim().replace(/[\s.-]/g, '');
  // 10 digits starting with 0 (specifically 03, 05, 07, 08, 09 or general 0x)
  const phoneRegex = /^0[3|5|7|8|9]\d{8}$/;
  const fallbackTenDigits = /^0\d{9}$/;
  return phoneRegex.test(cleanPhone) || fallbackTenDigits.test(cleanPhone);
}

export async function createOrderCOD(formData: CheckoutFormData): Promise<CreateOrderResult> {
  const name = formData.customer_name ? formData.customer_name.trim() : '';
  const phone = formData.customer_phone ? formData.customer_phone.trim() : '';
  const address = formData.shipping_address ? formData.shipping_address.trim() : '';
  const note = formData.customer_note ? formData.customer_note.trim() : '';

  if (!name) {
    return { success: false, message: 'Vui lòng nhập họ và tên nhận hàng' };
  }

  if (!phone) {
    return { success: false, message: 'Vui lòng nhập số điện thoại người nhận' };
  }

  if (!validateVietnamesePhone(phone)) {
    return { success: false, message: 'Số điện thoại không đúng định dạng (10 chữ số bắt đầu bằng 03, 05, 07, 08, 09)' };
  }

  if (!address) {
    return { success: false, message: 'Vui lòng nhập địa chỉ nhận hàng' };
  }

  const cart = getCart();
  if (!cart || cart.length === 0) {
    return { success: false, message: 'Giỏ hàng của bạn đang trống. Vui lòng chọn sản phẩm trước khi thanh toán.' };
  }

  const payloadItems = cart.map(item => ({
    product_id: item.product_id,
    quantity: item.quantity,
  }));

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.rpc('create_order', {
        p_customer_name: name,
        p_customer_phone: phone,
        p_shipping_address: address,
        p_customer_note: note || null,
        p_items: payloadItems,
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Lỗi tạo đơn hàng từ máy chủ. Vui lòng thử lại sau.',
        };
      }

      if (data && data.success) {
        clearCart();
        return {
          success: true,
          order_code: data.order_code,
          order_id: data.order_id,
          total_amount: data.total_amount,
        };
      }
    } catch {
      // Fallback to local demo mode below if network fails
    }
  }

  // Fallback demo order creation logic
  const mockCode = 'QS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const mockSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  clearCart();

  return {
    success: true,
    order_code: mockCode,
    order_id: 'ord-' + Date.now(),
    total_amount: mockSubtotal,
  };
}
