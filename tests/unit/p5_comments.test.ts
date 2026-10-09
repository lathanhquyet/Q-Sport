import { describe, it, expect } from 'vitest';
import {
  getProductComments,
  submitComment,
  fetchAdminComments,
  updateCommentStatus,
  deleteComment,
  sanitizeText,
} from '../../src/services/commentService';

describe('Phase 5 (P5) Product Comments & Moderation Tests', () => {
  const TEST_PRODUCT_ID = 'a0000000-0000-0000-0000-000000000001';

  describe('Public Comment Submission & Sanitization (commentService)', () => {
    it('should sanitize HTML special characters to prevent XSS attacks', () => {
      const rawScript = '<script>alert("XSS")</script>';
      const sanitized = sanitizeText(rawScript);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    });

    it('should reject comment submission when content is empty', async () => {
      const res = await submitComment(TEST_PRODUCT_ID, 'Nguyễn Văn A', '   ');
      expect(res.success).toBe(false);
      expect(res.message).toContain('không được để trống');
    });

    it('should reject comment submission when content exceeds 500 characters', async () => {
      const longContent = 'A'.repeat(501);
      const res = await submitComment(TEST_PRODUCT_ID, 'Nguyễn Văn A', longContent);
      expect(res.success).toBe(false);
      expect(res.message).toContain('500 ký tự');
    });

    it('should submit valid comment and set default status to PENDING', async () => {
      const res = await submitComment(
        TEST_PRODUCT_ID,
        'Khách Hàng Mới',
        'Sản phẩm dùng rất êm tay và chắc chắn!'
      );

      expect(res.success).toBe(true);
      expect(res.message).toContain('sau khi được duyệt');

      // Admin should see it in PENDING status
      const adminComments = await fetchAdminComments('PENDING');
      const found = adminComments.find(c => c.content.includes('dùng rất êm tay'));
      expect(found).toBeDefined();
      expect(found?.status).toBe('PENDING');
    });

    it('should NOT display PENDING comments on public storefront', async () => {
      const publicComments = await getProductComments(TEST_PRODUCT_ID);
      const pendingComment = publicComments.find(c => c.content.includes('dùng rất êm tay'));
      expect(pendingComment).toBeUndefined();
    });
  });

  describe('Admin Comment Moderation (commentService)', () => {
    it('should allow Admin to approve a comment and render it publicly', async () => {
      // Find the pending comment ID
      const adminPending = await fetchAdminComments('PENDING');
      const target = adminPending.find(c => c.content.includes('dùng rất êm tay'));
      expect(target).toBeDefined();

      if (target) {
        // Approve it
        const res = await updateCommentStatus(target.id, 'APPROVED');
        expect(res.success).toBe(true);

        // Now public storefront should display it
        const publicComments = await getProductComments(TEST_PRODUCT_ID);
        const approvedComment = publicComments.find(c => c.id === target.id);
        expect(approvedComment).toBeDefined();
        expect(approvedComment?.status).toBe('APPROVED');
      }
    });

    it('should allow Admin to hide an approved comment', async () => {
      const adminApproved = await fetchAdminComments('APPROVED');
      const target = adminApproved[0];
      expect(target).toBeDefined();

      if (target) {
        const res = await updateCommentStatus(target.id, 'HIDDEN');
        expect(res.success).toBe(true);

        // Public storefront should no longer display it
        const publicComments = await getProductComments(TEST_PRODUCT_ID);
        const hiddenComment = publicComments.find(c => c.id === target.id);
        expect(hiddenComment).toBeUndefined();
      }
    });

    it('should allow Admin to delete a comment permanently', async () => {
      const adminComments = await fetchAdminComments('ALL');
      const target = adminComments[0];
      expect(target).toBeDefined();

      if (target) {
        const res = await deleteComment(target.id);
        expect(res.success).toBe(true);

        const afterDelete = await fetchAdminComments('ALL');
        const deleted = afterDelete.find(c => c.id === target.id);
        expect(deleted).toBeUndefined();
      }
    });
  });
});
