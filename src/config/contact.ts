/**
 * Centralized Contact Configuration for Q-Sport Online Store
 *
 * Quản lý tập trung thông tin liên hệ khách hàng (Hotline, Zalo, Messenger).
 * Cấu hình này được sử dụng đồng bộ bởi Floating Contact Widget và toàn hệ thống.
 */

export interface ContactConfig {
  messengerUrl: string;
  zaloUrl: string;
  hotline: string;
}

export const CONTACT_CONFIG: ContactConfig = {
  // Link Messenger do chủ dự án cung cấp (để trống khi chưa có liên kết chính thức)
  messengerUrl: '',

  // Link Zalo cá nhân do chủ dự án cung cấp (để trống khi chưa có liên kết chính thức)
  zaloUrl: '',

  // Hotline mặc định theo yêu cầu đặc tả (0987 654 321)
  hotline: '0987 654 321',
};
