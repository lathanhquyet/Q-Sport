/**
  * Format money amount in VND according to Vietnamese standards.
  * Ensures integer representation without decimals.
  */
export function formatVND(amount: number): string {
  if (isNaN(amount) || amount < 0) {
    return '0 đ';
  }
  const formatted = new Intl.NumberFormat('vi-VN').format(Math.round(amount));
  return `${formatted} đ`;
}

/**
 * Format ISO date string into Vietnamese localized date string.
 */
export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}
