import { CONTACT_CONFIG, ContactConfig } from '../config/contact';

/**
 * Validates whether a given URL is a valid external HTTP/HTTPS web address.
 * Disallows empty strings, javascript: schemes, relative paths, or hash links.
 */
export function isValidExternalUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Formats a phone number into an international E.164 tel: URL.
 * Converts Vietnamese local 0-prefix (e.g. 0987 654 321) to tel:+84987654321.
 */
export function formatHotlineTel(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return 'tel:';
  }
  const cleanDigits = phone.replace(/\D/g, '');
  if (!cleanDigits) {
    return 'tel:';
  }

  if (cleanDigits.startsWith('0')) {
    return `tel:+84${cleanDigits.slice(1)}`;
  }
  if (cleanDigits.startsWith('84')) {
    return `tel:+${cleanDigits}`;
  }
  return `tel:+${cleanDigits}`;
}

/**
 * Renders the Floating Contact Widget HTML.
 *
 * Rules:
 * - Hidden on all Admin routes (/admin/*).
 * - Reads values from CONTACT_CONFIG without hardcoding.
 * - Messenger link rendered ONLY when messengerUrl is a valid URL.
 * - Zalo link rendered ONLY when zaloUrl is a valid URL.
 * - Hotline rendered as tel:+84... link.
 * - External links open in new tab with rel="noopener noreferrer".
 */
export function renderFloatingContact(
  pathname: string = (typeof window !== 'undefined' ? window.location.pathname : '/'),
  customConfig?: ContactConfig
): string {
  // 1. Hide on all admin routes
  if (pathname.startsWith('/admin')) {
    return '';
  }

  const config = customConfig || CONTACT_CONFIG;
  const telUrl = formatHotlineTel(config.hotline);

  // Check valid URLs for external chat apps
  const hasValidMessenger = isValidExternalUrl(config.messengerUrl);
  const hasValidZalo = isValidExternalUrl(config.zaloUrl);

  const messengerHtml = hasValidMessenger
    ? `
      <a
        href="${config.messengerUrl.trim()}"
        target="_blank"
        rel="noopener noreferrer"
        class="floating-contact-btn floating-btn-messenger"
        aria-label="Chat qua Facebook Messenger với Q-Sport"
        title="Chat qua Facebook Messenger"
      >
        <span class="floating-btn-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.42 3.12 7.15.16.14.26.35.26.57l-.07 1.77c-.03.7.63 1.19 1.25.92l1.98-.88c.18-.08.38-.09.57-.03.92.26 1.89.4 2.89.4 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.06 12.06l-2.56-2.73-5 2.73 5.5-5.84 2.62 2.73 4.94-2.73-5.5 5.84z"/>
          </svg>
        </span>
        <span class="floating-btn-label">Messenger</span>
      </a>
    `
    : '';

  const zaloHtml = hasValidZalo
    ? `
      <a
        href="${config.zaloUrl.trim()}"
        target="_blank"
        rel="noopener noreferrer"
        class="floating-contact-btn floating-btn-zalo"
        aria-label="Liên hệ Zalo cá nhân Q-Sport"
        title="Liên hệ Zalo cá nhân"
      >
        <span class="floating-btn-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.5 5.43 3.84 7.02-.17.98-.67 2.74-.77 3.19-.13.56.2.55.43.39.31-.22 2.65-1.8 3.69-2.52.9.25 1.84.38 2.81.38 5.52 0 10-4.03 10-9s-4.48-9-10-9zm1.75 12.2h-3.5v-1.15l1.98-2.61h-1.9v-1.15h3.42v1.14l-2 2.62h2v1.15z"/>
          </svg>
        </span>
        <span class="floating-btn-label">Zalo</span>
      </a>
    `
    : '';

  const hotlineHtml = `
    <a
      href="${telUrl}"
      class="floating-contact-btn floating-btn-hotline"
      aria-label="Gọi hotline hỗ trợ ${config.hotline}"
      title="Hotline: ${config.hotline}"
    >
      <span class="floating-btn-icon pulse-animation">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      </span>
      <span class="floating-btn-label">${config.hotline}</span>
    </a>
  `;

  return `
    <aside
      id="qsport-floating-contact"
      class="floating-contact-widget"
      aria-label="Kênh hỗ trợ và liên hệ trực tiếp Q-Sport"
    >
      ${messengerHtml}
      ${zaloHtml}
      ${hotlineHtml}
    </aside>
  `;
}
