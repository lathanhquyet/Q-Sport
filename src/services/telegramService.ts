import { formatVND } from '../utils/formatters';

export interface TelegramOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface TelegramOrderPayload {
  order_code: string;
  customer_name: string;
  customer_phone?: string;
  shipping_address: string;
  customer_note?: string | null;
  total_amount: number;
  payment_method?: 'COD' | 'VIETQR';
  items: TelegramOrderItem[];
}

export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatTelegramOrderMessage(payload: TelegramOrderPayload): string {
  const safeName = escapeHtml(payload.customer_name || 'Khách hàng');
  const safePhone = escapeHtml(payload.customer_phone || 'Không có');
  const safeOrderCode = escapeHtml(payload.order_code || 'Chưa có mã');
  const safeAddress = escapeHtml(payload.shipping_address || 'Chưa cung cấp');
  const safeNote = escapeHtml(payload.customer_note?.trim() || 'Không có');
  const paymentMethodLabel =
    payload.payment_method === 'VIETQR' ? 'Chuyển khoản VietQR' : 'Thanh toán COD';

  const itemsList =
    payload.items && payload.items.length > 0
      ? payload.items
          .map(item => `• ${escapeHtml(item.name)} — ${item.quantity} × ${formatVND(item.price)}`)
          .join('\n')
      : '• (Không có thông tin chi tiết)';

  return [
    '🛒 <b>THÔNG BÁO ĐƠN HÀNG MỚI</b>',
    '',
    `<b>Người mua hàng:</b> ${safeName}`,
    `<b>Số điện thoại:</b> ${safePhone}`,
    `<b>Mã đơn hàng:</b> ${safeOrderCode}`,
    '',
    '<b>Danh sách sản phẩm:</b>',
    itemsList,
    '',
    `<b>Tổng thành tiền:</b> ${formatVND(payload.total_amount)}`,
    '',
    '<b>Địa chỉ gửi hàng:</b>',
    safeAddress,
    '',
    `<b>Ghi chú:</b> ${safeNote}`,
    `<b>Phương thức thanh toán:</b> ${paymentMethodLabel}`,
  ].join('\n');
}

export async function sendTelegramOrderAlert(
  payload: TelegramOrderPayload
): Promise<{ success: boolean; message: string; not_configured?: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('/api/telegram-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        message: `Máy chủ trả về HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: !!data.success,
      message: data.message || 'Gửi thông báo thành công',
      not_configured: !!data.not_configured,
    };
  } catch (err: any) {
    const isTimeout = err?.name === 'AbortError';
    return {
      success: false,
      message: isTimeout
        ? 'Gửi thông báo Telegram bị quá thời gian (timeout 5s)'
        : `Lỗi mạng khi gửi thông báo Telegram (${err?.message || 'không xác định'})`,
    };
  }
}
