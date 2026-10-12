/**
 * Cloudflare Pages Function: POST /api/telegram-alert
 * Dispatches a formatted order alert to Telegram Bot without leaking server credentials.
 * Secrets: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID configured in Cloudflare Pages Dashboard.
 */

interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

interface Context {
  request: Request;
  env: Env;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount || 0)) + ' đ';
}

function formatTelegramMessage(payload: any): string {
  const safeName = escapeHtml(payload.customer_name || 'Khách hàng');
  const safePhone = escapeHtml(payload.customer_phone || 'Không có');
  const safeOrderCode = escapeHtml(payload.order_code || 'Chưa có mã');
  const safeAddress = escapeHtml(payload.shipping_address || 'Chưa cung cấp');
  const safeNote = escapeHtml((payload.customer_note || '').trim() || 'Không có');
  const paymentMethodLabel =
    payload.payment_method === 'VIETQR' ? 'Chuyển khoản VietQR' : 'Thanh toán COD';

  const itemsList =
    Array.isArray(payload.items) && payload.items.length > 0
      ? payload.items
          .map(
            (item: any) =>
              `• ${escapeHtml(item.name || 'Sản phẩm')} — ${item.quantity || 1} × ${formatVND(item.price || 0)}`
          )
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
    `<b>Tổng thành tiền:</b> ${formatVND(payload.total_amount || 0)}`,
    '',
    '<b>Địa chỉ gửi hàng:</b>',
    safeAddress,
    '',
    `<b>Ghi chú:</b> ${safeNote}`,
    `<b>Phương thức thanh toán:</b> ${paymentMethodLabel}`,
  ].join('\n');
}

// Simple memory set for deduplication against duplicate clicks/replays
const recentAlertedOrderCodes = new Set<string>();

export async function onRequestPost(context: Context): Promise<Response> {
  const { request, env } = context;

  // 1. Anti-CSRF: Reject cross-site invocation
  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite && secFetchSite === 'cross-site') {
    return new Response(
      JSON.stringify({ success: false, message: 'Truy cập bị từ chối (Cross-site request)' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Never expose token to client response or logs
  const botToken = env?.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = env?.TELEGRAM_CHAT_ID?.trim();

  if (!botToken || !chatId) {
    return new Response(
      JSON.stringify({
        success: false,
        not_configured: true,
        message: 'Telegram Bot Token hoặc Chat ID chưa được cấu hình trên Cloudflare Pages.',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  try {
    const payload = await request.json();

    // 2. Strict Input Validation
    if (
      !payload ||
      typeof payload.order_code !== 'string' ||
      !/^QS-[A-Z0-9]{4,10}$/i.test(payload.order_code.trim())
    ) {
      return new Response(
        JSON.stringify({ success: false, message: 'Mã đơn hàng không hợp lệ theo chuẩn Q-Sport' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const orderCode = payload.order_code.trim().toUpperCase();

    // 3. Deduplication: Avoid duplicate alerts for the same order code
    if (recentAlertedOrderCodes.has(orderCode)) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Thông báo cho mã đơn này đã được gửi trước đó.',
          deduplicated: true,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 4. Length Constraints to prevent payload bombing
    if (payload.customer_name && String(payload.customer_name).length > 100) {
      payload.customer_name = String(payload.customer_name).substring(0, 100);
    }
    if (payload.shipping_address && String(payload.shipping_address).length > 300) {
      payload.shipping_address = String(payload.shipping_address).substring(0, 300);
    }
    if (payload.customer_note && String(payload.customer_note).length > 300) {
      payload.customer_note = String(payload.customer_note).substring(0, 300);
    }
    if (Array.isArray(payload.items) && payload.items.length > 50) {
      payload.items = payload.items.slice(0, 50);
    }

    const messageText = formatTelegramMessage(payload);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${encodeURIComponent(botToken)}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!telegramRes.ok) {
      const errData: any = await telegramRes.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          success: false,
          message:
            errData.description || `Telegram API trả về mã lỗi HTTP ${telegramRes.status}`,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (recentAlertedOrderCodes.size > 1000) {
      recentAlertedOrderCodes.clear();
    }
    recentAlertedOrderCodes.add(orderCode);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Đã gửi thông báo đơn hàng thành công qua Telegram.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    const isTimeout = err?.name === 'AbortError';
    return new Response(
      JSON.stringify({
        success: false,
        message: isTimeout
          ? 'Telegram API timeout (5s)'
          : 'Lỗi máy chủ khi gửi thông báo Telegram',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
