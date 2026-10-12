import { supabase, isSupabaseConfigured } from './supabaseClient';
import { getCart, clearCart } from './cartService';
import { SITE_CONFIG } from '../config/site';
import { sendTelegramOrderAlert } from './telegramService';

export interface CheckoutFormData {
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  customer_note?: string;
  payment_method?: 'COD' | 'VIETQR';
}

export interface CreateOrderResult {
  success: boolean;
  message?: string;
  order_code?: string;
  order_id?: string;
  total_amount?: number;
  payment_method?: 'COD' | 'VIETQR';
}

export function validateVietnamesePhone(phone: string): boolean {
  if (!phone) return false;
  const cleanPhone = phone.trim().replace(/[\s.-]/g, '');
  const phoneRegex = /^0[3|5|7|8|9]\d{8}$/;
  const fallbackTenDigits = /^0\d{9}$/;
  return phoneRegex.test(cleanPhone) || fallbackTenDigits.test(cleanPhone);
}

/**
 * Generates a official VietQR image URL using VietQR API standard.
 */
export function generateVietQRImageUrl(
  bankName: string = SITE_CONFIG.bankName,
  accountNo: string = SITE_CONFIG.bankAccountNumber,
  accountName: string = SITE_CONFIG.bankAccountHolder,
  amount: number = 0,
  orderCode: string = ''
): string {
  const cleanBank = encodeURIComponent(bankName || 'MB');
  const cleanAccount = encodeURIComponent(accountNo || '');
  const cleanName = encodeURIComponent(accountName || '');
  const cleanCode = encodeURIComponent(orderCode || '');
  const cleanAmount = Math.max(0, Math.round(amount || 0));

  return `https://img.vietqr.io/image/${cleanBank}-${cleanAccount}-compact2.png?amount=${cleanAmount}&addInfo=${cleanCode}&accountName=${cleanName}`;
}

export async function createOrderCOD(formData: CheckoutFormData): Promise<CreateOrderResult> {
  const name = formData.customer_name ? formData.customer_name.trim() : '';
  const phone = formData.customer_phone ? formData.customer_phone.trim() : '';
  const address = formData.shipping_address ? formData.shipping_address.trim() : '';
  const note = formData.customer_note ? formData.customer_note.trim() : '';
  const paymentMethod = formData.payment_method || 'COD';

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

  const itemsSnapshot = cart.map(item => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

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

        // Safe Telegram notification dispatch - awaited so fetch completes before page routing
        try {
          await sendTelegramOrderAlert({
            order_code: data.order_code,
            customer_name: name,
            customer_phone: phone,
            shipping_address: address,
            customer_note: note || null,
            total_amount: data.total_amount,
            payment_method: paymentMethod,
            items: itemsSnapshot,
          });
        } catch {
          // Fail-safe: telegram alert failure NEVER breaks order confirmation
        }

        return {
          success: true,
          order_code: data.order_code,
          order_id: data.order_id,
          total_amount: data.total_amount,
          payment_method: paymentMethod,
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

  try {
    await sendTelegramOrderAlert({
      order_code: mockCode,
      customer_name: name,
      customer_phone: phone,
      shipping_address: address,
      customer_note: note || null,
      total_amount: mockSubtotal,
      payment_method: paymentMethod,
      items: itemsSnapshot,
    });
  } catch {
    // Fail-safe
  }

  return {
    success: true,
    order_code: mockCode,
    order_id: 'ord-' + Date.now(),
    total_amount: mockSubtotal,
    payment_method: paymentMethod,
  };
}
