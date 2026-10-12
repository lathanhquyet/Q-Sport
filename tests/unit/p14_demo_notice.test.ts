import { describe, it, expect } from 'vitest';
import { renderDemoNotice } from '../../src/components/DemoNotice';
import { SITE_CONFIG } from '../../src/config/site';

describe('Phase 14 — Persistent Learning Demo Notice Component', () => {
  it('renders demo notice on all customer-facing routes', () => {
    const customerRoutes = [
      '/',
      '',
      '/products',
      '/products/vot-cau-long-qsport-pro-attack-100',
      '/cart',
      '/checkout',
      '/about',
      '/news',
      '/tin-noi-bo',
      '/order-success/QS-123456',
    ];

    customerRoutes.forEach(route => {
      const html = renderDemoNotice(route);
      expect(html).toContain('class="demo-notice-bar"');
      expect(html).toContain('role="region"');
      expect(html).toContain('aria-label="Thông báo website thử nghiệm học tập"');
      expect(html).toContain('demo-notice-marquee');
      expect(html).toContain('demo-notice-track');
    });
  });

  it('hides demo notice on all admin routes (/admin/*)', () => {
    const adminRoutes = [
      '/admin',
      '/admin/',
      '/admin/login',
      '/admin/products',
      '/admin/orders',
      '/admin/comments',
      '/admin/news',
    ];

    adminRoutes.forEach(route => {
      const html = renderDemoNotice(route);
      expect(html).toBe('');
    });
  });

  it('contains the complete required non-commercial educational text', () => {
    const html = renderDemoNotice('/');
    expect(SITE_CONFIG.demoNoticeText).toBeDefined();
    expect(html).toContain('WEBSITE DEMO HỌC TẬP — KHÔNG NHẰM MỤC ĐÍCH THƯƠNG MẠI');
    expect(html).toContain('XSport, ShopVNB');
    expect(html).toContain('Vibecode');
    expect(html).toContain('Quyền sở hữu thuộc về chủ sở hữu tương ứng');
  });

  it('includes duplicate track with aria-hidden for seamless loop without screen reader duplication', () => {
    const html = renderDemoNotice('/');
    expect(html).toContain('aria-hidden="true"');
    // Ensure 2 tracks exist
    const trackMatches = html.match(/demo-notice-track/g);
    expect(trackMatches?.length).toBe(2);
  });

  it('supports custom text and returns empty string if text is blank', () => {
    const customHtml = renderDemoNotice('/', 'Test Custom Notice');
    expect(customHtml).toContain('Test Custom Notice');

    const emptyHtml = renderDemoNotice('/', '');
    expect(emptyHtml).toBe('');
  });

  it('escapes HTML special characters to prevent XSS injection', () => {
    const malicious = '<script>alert("xss")</script>&"quote"';
    const html = renderDemoNotice('/', malicious);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&amp;');
  });
});
