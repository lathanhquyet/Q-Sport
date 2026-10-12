import { describe, it, expect } from 'vitest';
import { CONTACT_CONFIG } from '../../src/config/contact';
import {
  renderFloatingContact,
  formatHotlineTel,
  isValidExternalUrl,
} from '../../src/components/FloatingContact';

describe('Phase 13 (P13) Centralized Floating Contact Configuration & Widget Tests', () => {
  describe('1. Centralized Contact Configuration (src/config/contact.ts)', () => {
    it('should read default configuration from CONTACT_CONFIG without hardcoding', () => {
      expect(CONTACT_CONFIG).toBeDefined();
      expect(CONTACT_CONFIG.hotline).toBe('0987 654 321');
      expect(typeof CONTACT_CONFIG.messengerUrl).toBe('string');
      expect(typeof CONTACT_CONFIG.zaloUrl).toBe('string');
    });
  });

  describe('2. Hotline & Tel URL Normalization (formatHotlineTel)', () => {
    it('should format local Vietnamese phone numbers starting with 0 to international E.164 tel: format', () => {
      expect(formatHotlineTel('0987 654 321')).toBe('tel:+84987654321');
      expect(formatHotlineTel('0987654321')).toBe('tel:+84987654321');
      expect(formatHotlineTel('0987-654-321')).toBe('tel:+84987654321');
      expect(formatHotlineTel('0987.654.321')).toBe('tel:+84987654321');
    });

    it('should handle already internationalized phone numbers properly', () => {
      expect(formatHotlineTel('+84987654321')).toBe('tel:+84987654321');
      expect(formatHotlineTel('84987654321')).toBe('tel:+84987654321');
    });

    it('should return safe fallback for empty or non-numeric input', () => {
      expect(formatHotlineTel('')).toBe('tel:');
      expect(formatHotlineTel('   ')).toBe('tel:');
    });
  });

  describe('3. External URL Validation (isValidExternalUrl)', () => {
    it('should accept valid HTTP and HTTPS URLs', () => {
      expect(isValidExternalUrl('https://m.me/qsport')).toBe(true);
      expect(isValidExternalUrl('https://facebook.com/qsport')).toBe(true);
      expect(isValidExternalUrl('https://zalo.me/0987654321')).toBe(true);
      expect(isValidExternalUrl('http://zalo.me/0987654321')).toBe(true);
    });

    it('should reject invalid, placeholder, relative or dangerous URL schemes', () => {
      expect(isValidExternalUrl('')).toBe(false);
      expect(isValidExternalUrl('   ')).toBe(false);
      expect(isValidExternalUrl('#')).toBe(false);
      expect(isValidExternalUrl('javascript:alert(1)')).toBe(false);
      expect(isValidExternalUrl('fake-url')).toBe(false);
      expect(isValidExternalUrl('tel:0987654321')).toBe(false);
    });
  });

  describe('4. Floating Contact Widget Rendering (renderFloatingContact)', () => {
    it('should render Hotline button with tel:+84987654321 link', () => {
      const html = renderFloatingContact('/');
      expect(html).toContain('id="qsport-floating-contact"');
      expect(html).toContain('floating-btn-hotline');
      expect(html).toContain('href="tel:+84987654321"');
      expect(html).toContain('0987 654 321');
    });

    it('should NOT render Messenger or Zalo links when URLs are empty or unconfigured', () => {
      const html = renderFloatingContact('/', {
        messengerUrl: '',
        zaloUrl: '',
        hotline: '0987 654 321',
      });

      expect(html).not.toContain('floating-btn-messenger');
      expect(html).not.toContain('floating-btn-zalo');
      expect(html).not.toContain('href=""');
      expect(html).not.toContain('href="#"');
    });

    it('should render active Messenger link with target="_blank" and rel="noopener noreferrer" when configured with valid URL', () => {
      const validMessenger = 'https://m.me/qsportstore';
      const html = renderFloatingContact('/', {
        messengerUrl: validMessenger,
        zaloUrl: '',
        hotline: '0987 654 321',
      });

      expect(html).toContain('floating-btn-messenger');
      expect(html).toContain(`href="${validMessenger}"`);
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener noreferrer"');
    });

    it('should render active Zalo link with target="_blank" and rel="noopener noreferrer" when configured with valid URL', () => {
      const validZalo = 'https://zalo.me/0987654321';
      const html = renderFloatingContact('/', {
        messengerUrl: '',
        zaloUrl: validZalo,
        hotline: '0987 654 321',
      });

      expect(html).toContain('floating-btn-zalo');
      expect(html).toContain(`href="${validZalo}"`);
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener noreferrer"');
    });

    it('should render all 3 contact channels when both Messenger and Zalo are configured', () => {
      const html = renderFloatingContact('/', {
        messengerUrl: 'https://m.me/qsport',
        zaloUrl: 'https://zalo.me/0987654321',
        hotline: '0987 654 321',
      });

      expect(html).toContain('floating-btn-messenger');
      expect(html).toContain('floating-btn-zalo');
      expect(html).toContain('floating-btn-hotline');
    });
  });

  describe('5. Admin Route Hiding & Single Mount Rules', () => {
    it('should hide widget on all Admin routes (/admin/*)', () => {
      expect(renderFloatingContact('/admin')).toBe('');
      expect(renderFloatingContact('/admin/')).toBe('');
      expect(renderFloatingContact('/admin/products')).toBe('');
      expect(renderFloatingContact('/admin/orders')).toBe('');
      expect(renderFloatingContact('/admin/comments')).toBe('');
      expect(renderFloatingContact('/admin/news')).toBe('');
      expect(renderFloatingContact('/admin/login')).toBe('');
    });

    it('should render widget on customer-facing routes', () => {
      expect(renderFloatingContact('/')).toContain('id="qsport-floating-contact"');
      expect(renderFloatingContact('/products')).toContain('id="qsport-floating-contact"');
      expect(renderFloatingContact('/products/vot-cau-long')).toContain('id="qsport-floating-contact"');
      expect(renderFloatingContact('/cart')).toContain('id="qsport-floating-contact"');
      expect(renderFloatingContact('/checkout')).toContain('id="qsport-floating-contact"');
      expect(renderFloatingContact('/order-success/QS-12345')).toContain('id="qsport-floating-contact"');
      expect(renderFloatingContact('/news')).toContain('id="qsport-floating-contact"');
      expect(renderFloatingContact('/about')).toContain('id="qsport-floating-contact"');
    });

    it('should not duplicate widget elements during SPA route navigation', () => {
      document.body.innerHTML = '<div id="app"></div>';
      const appEl = document.getElementById('app')!;

      // Simulating navigation to Home
      appEl.innerHTML = `<main>Home</main>${renderFloatingContact('/')}`;
      expect(document.querySelectorAll('#qsport-floating-contact').length).toBe(1);

      // Simulating navigation to Products
      appEl.innerHTML = `<main>Products</main>${renderFloatingContact('/products')}`;
      expect(document.querySelectorAll('#qsport-floating-contact').length).toBe(1);

      // Simulating navigation to Admin Products
      appEl.innerHTML = `<main>Admin Products</main>${renderFloatingContact('/admin/products')}`;
      expect(document.querySelectorAll('#qsport-floating-contact').length).toBe(0);

      // Simulating navigation back to Cart
      appEl.innerHTML = `<main>Cart</main>${renderFloatingContact('/cart')}`;
      expect(document.querySelectorAll('#qsport-floating-contact').length).toBe(1);
    });
  });
});
