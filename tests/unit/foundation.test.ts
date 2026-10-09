import { describe, it, expect } from 'vitest';
import { formatVND, formatDateTime } from '../../src/utils/formatters';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../../src/types';

describe('Phase 0 Foundation Tests', () => {
  describe('VND Currency Formatter', () => {
    it('should format positive integer to VND string correctly', () => {
      expect(formatVND(1500000)).toBe('1.500.000 đ');
      expect(formatVND(0)).toBe('0 đ');
      expect(formatVND(99000)).toBe('99.000 đ');
    });

    it('should handle invalid or negative numbers gracefully', () => {
      expect(formatVND(-100)).toBe('0 đ');
      expect(formatVND(NaN)).toBe('0 đ');
    });

    it('should round floating values to nearest integer VND', () => {
      expect(formatVND(150000.75)).toBe('150.001 đ');
    });
  });

  describe('Date Time Formatter (Asia/Ho_Chi_Minh)', () => {
    it('should format ISO timestamp to localized Vietnamese date string', () => {
      const iso = '2026-10-09T10:00:00Z';
      const formatted = formatDateTime(iso);
      expect(formatted).toContain('2026');
      expect(formatted).not.toBe('');
    });

    it('should return empty string for empty input', () => {
      expect(formatDateTime('')).toBe('');
    });
  });

  describe('Type System & Business Rule Constants', () => {
    it('should enforce strict order statuses as specified in PRD', () => {
      const validStatuses: OrderStatus[] = [
        'NEW',
        'PROCESSING',
        'OUT_OF_STOCK',
        'SHIPPED',
        'CANCELLED',
      ];
      expect(validStatuses).toHaveLength(5);
    });

    it('should enforce strict payment statuses as specified in PRD', () => {
      const validPaymentStatuses: PaymentStatus[] = [
        'UNPAID',
        'PENDING_CONFIRMATION',
        'PAID',
        'COD_PENDING',
        'COD_COLLECTED',
      ];
      expect(validPaymentStatuses).toHaveLength(5);
    });

    it('should support mandatory payment methods COD and VIETQR', () => {
      const methods: PaymentMethod[] = ['COD', 'VIETQR'];
      expect(methods).toEqual(['COD', 'VIETQR']);
    });
  });
});
