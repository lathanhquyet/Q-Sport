import { SITE_CONFIG } from '../config/site';

/**
 * Escapes HTML characters in notice text to prevent XSS.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Renders the Persistent Demo Notice Bar.
 *
 * Rules:
 * - Hidden on all Admin routes (/admin/*).
 * - Displayed across all customer-facing routes.
 * - Semantic <aside> with accessible region label.
 * - Dual track marquee animation for continuous seamless scroll.
 * - Respects prefers-reduced-motion via CSS media query.
 */
export function renderDemoNotice(
  pathname: string = (typeof window !== 'undefined' ? window.location.pathname : '/'),
  customText?: string
): string {
  // 1. Hide on all admin routes
  if (pathname.startsWith('/admin')) {
    return '';
  }

  const rawText = (customText !== undefined ? customText : SITE_CONFIG.demoNoticeText || '').trim();
  if (!rawText) {
    return '';
  }

  const safeText = escapeHtml(rawText);

  return `
    <aside class="demo-notice-bar" role="region" aria-label="Thông báo website thử nghiệm học tập">
      <div class="demo-notice-marquee">
        <div class="demo-notice-track">
          <span class="demo-notice-text">${safeText}</span>
        </div>
        <div class="demo-notice-track" aria-hidden="true">
          <span class="demo-notice-text">${safeText}</span>
        </div>
      </div>
    </aside>
  `;
}
