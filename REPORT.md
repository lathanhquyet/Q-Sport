<p align="center">
  <img src="public/assets/logo.svg" alt="Q-Sport" height="72">
</p>

# Báo cáo đồ án cuối khóa — Website Q-Sport

- **Sinh viên:** Lã Thành Quyết · **Email:** ltquyet@qsport.vn
- **Ngày nộp:** 17/10/2026
- **Link GitHub (Public):** https://github.com/lathanhquyet/Q-Sport
- **Link website đã deploy:** https://q-sport.pages.dev/
- **Commit nghiệm thu (Phase 7):** `519b7e457afcab32792614cd16491e238be3c987` (Branch: `main`)

---

## 1. Mô tả dự án

- **Lĩnh vực:** thương mại điện tử, bán dụng cụ cầu lông và phụ kiện thể thao.
- **Thương hiệu:** **Q-Sport** — thương hiệu **hư cấu** do sinh viên tự đặt ra. Đại diện (hư cấu): Lã Thành Quyết, ltquyet@qsport.vn.
- **Mục tiêu:** khách xem sản phẩm, xem chi tiết, bình luận, thêm giỏ hàng và đặt hàng (COD); chủ cửa hàng quản lý sản phẩm, đơn hàng và bình luận trên trang quản trị.
- **Công nghệ:** HTML, CSS, TypeScript, Vite; Supabase (PostgreSQL, Auth, RLS); Cloudflare Pages; GitHub.

### 1.1 Logo

Logo được thiết kế **trước khi** xây dựng website và dùng đúng file này ở header, footer và favicon.

![Logo Q-Sport](public/assets/logo.png)

- **Ý tưởng:** chữ **Q** là một cây **vợt cầu lông** (đầu vợt oval nghiêng có dây, cán vợt màu vàng), nối với “-Sport”. Dấu gạch ngang màu vàng cùng màu cán vợt.
- **Màu:** xanh court `#1F6B4A` (thương hiệu), vàng cork `#F2A93B` (điểm nhấn), mint `#EAF7EF` (nền).
- **File:** `public/assets/logo.svg`, `logo.png`, `logo-mark.svg/.png`, `favicon.svg`. Quy tắc sử dụng nằm trong `DESIGN.md` mục 2.

## 2. Các trang trong dự án

| Route | Trang | Chức năng chính | Ảnh chụp |
|---|---|---|---|
| `/` | Trang chủ (Home) | Hero, danh mục, sản phẩm nổi bật, giới thiệu ngắn, Google Maps | _[chèn ảnh]_ |
| `/products` | Danh sách sản phẩm | Tìm kiếm, lọc danh mục, sắp xếp | _[chèn ảnh]_ |
| `/products/:slug` | **Chi tiết sản phẩm (Detail)** | Thông tin sản phẩm, thêm giỏ, bình luận | _[chèn ảnh]_ |
| `/about` | **Về chúng tôi (About Us)** | Câu chuyện thương hiệu, YouTube, Google Maps | _[chèn ảnh]_ |
| `/cart` | Giỏ hàng | Thêm/xóa/đổi số lượng | _[chèn ảnh]_ |
| `/checkout` | Thanh toán | Form khách hàng, đặt hàng COD | _[chèn ảnh]_ |
| `/order-success/:code` | Đặt hàng thành công | Hiển thị mã đơn | _[chèn ảnh]_ |
| `/admin/login` | Đăng nhập Admin | Supabase Auth | _[chèn ảnh]_ |
| `/admin/products` | Quản lý sản phẩm | Thêm, sửa, ẩn/hiện, xóa | _[chèn ảnh]_ |
| `/admin/orders` | Quản lý đơn hàng | Xem, đổi trạng thái, hủy có lý do | _[chèn ảnh]_ |
| `/admin/comments` | Quản lý bình luận | Duyệt, ẩn, xóa | _[chèn ảnh]_ |

**Liên kết giữa các trang:** header và footer ở mọi trang có link tới Trang chủ, Sản phẩm, Về chúng tôi và Giỏ hàng; logo dẫn về Trang chủ; thẻ sản phẩm dẫn tới trang chi tiết.

## 3. Các chức năng đã thực hiện

### 3.1 Sử dụng database (Supabase PostgreSQL)

| Bảng | Nội dung |
|---|---|
| `categories` | 6 danh mục: Giày, Vợt, Quần, Áo, Balo, Phụ kiện |
| `products` | Sản phẩm demo (tên, giá, tồn kho, mô tả, ảnh, trạng thái) |
| `orders`, `order_items` | Đơn hàng và dòng hàng (có snapshot tên và giá) |
| `product_comments` | Bình luận (PENDING / APPROVED / HIDDEN) |
| `admin_users` | Danh sách tài khoản Admin |

Bảo mật: bật RLS trên mọi bảng; khách không đọc được đơn hàng; giá và tổng tiền do database tính khi đặt hàng.

### 3.2 Chức năng chỉnh sửa database (yêu cầu ≥ 2)

| Mã | Chức năng | Thao tác DB | Trang |
|---|---|---|---|
| F1 | Đặt hàng COD | INSERT `orders`, `order_items` (qua RPC `create_order`) | `/checkout` |
| F2 | Quản lý sản phẩm (Admin) | INSERT, UPDATE, DELETE `products` | `/admin/products` |
| F3 | Bình luận và duyệt | INSERT, UPDATE `product_comments` | Chi tiết, `/admin/comments` |
| F4 | Đổi trạng thái đơn / hủy đơn | UPDATE `orders` | `/admin/orders` |

### 3.3 Các chức năng khác

- Giỏ hàng lưu `localStorage`, giữ nguyên sau khi tải lại trang.
- Tìm kiếm, lọc theo danh mục, sắp xếp sản phẩm.
- Đăng nhập Admin bằng Supabase Auth, chặn truy cập `/admin/*` với người không phải Admin.
- **Nhúng:** Google Maps (địa chỉ minh họa) và video YouTube ở trang About.
- Giao diện responsive (mobile, tablet, desktop), có trạng thái tải / trống / lỗi.
- Đưa mã lên GitHub (Public) và deploy lên Cloudflare Pages.

_[Ghi thêm hoặc xóa mục cho khớp sản phẩm thực tế, kể cả tính năng Stretch nếu có làm.]_

## 4. Các file .md và chức năng

| File | Chức năng |
|---|---|
| `PRD.md` | **Product Requirements Document** — đặc tả yêu cầu: sản phẩm làm gì, cho ai, những trang nào, dữ liệu gì, tiêu chí nghiệm thu, kế hoạch theo ngày. Là tài liệu để AI coding hiểu đúng và không làm lệch phạm vi. |
| `DESIGN.md` | Quy chuẩn thiết kế: logo, màu, font, bố cục, component, trạng thái, cách viết nội dung. Giúp giao diện nhất quán và để AI sinh code đúng phong cách. |
| `README.md` | Giới thiệu dự án, cấu trúc thư mục, cách cài đặt, cấu hình Supabase, deploy, danh sách kiểm tra. |
| `PROMPTS.md` | Kế hoạch prompt và nhật ký thứ tự các prompt cùng kết quả. |
| `REPORT.md` | Báo cáo này. |

**PRD.md khác DESIGN.md thế nào?** PRD trả lời “làm **gì**” (chức năng, dữ liệu, quy tắc nghiệp vụ). DESIGN trả lời “trông **như thế nào**” (màu sắc, chữ, bố cục, logo). Tách riêng để mỗi file ngắn gọn và AI không lẫn yêu cầu nghiệp vụ với quyết định giao diện.

## 5. Thứ tự prompt và kết quả

> Sao chép từ bảng nhật ký trong `PROMPTS.md` (Phần A) khi hoàn thành. Mỗi dòng: prompt → kết quả.

| # | Công cụ | Prompt (tóm tắt) | Kết quả |
|---|---|---|---|
| 1 | Claude | Review `README.md`, `PRD.md` so với đề kiểm tra; đưa phương án | Xác định PRD quá lớn, thiếu `DESIGN.md`, logo, nhật ký prompt; đề xuất MVP và lịch 8 ngày |
| 2 | Claude | Thiết kế logo Q-Sport; bổ sung/điều chỉnh các file .md | Logo vợt-Q; PRD v2.0, README, DESIGN, PROMPTS, REPORT |
| 3 | Antigravity | _[A0: đọc tài liệu, lập kế hoạch]_ | _[...]_ |
| 4 | Antigravity | _[A1: khởi tạo dự án]_ | _[...]_ |
| 5 | Antigravity | _[A2: database, RLS, seed]_ | _[...]_ |
| 6 | Antigravity | _[A3: trang public]_ | _[...]_ |
| 7 | Antigravity | _[A4: giỏ hàng, checkout]_ | _[...]_ |
| 8 | Antigravity | _[A5: admin]_ | _[...]_ |
| 9 | Antigravity | _[A6: bình luận, Maps, YouTube]_ | _[...]_ |
| 10 | Antigravity | _[A7: GitHub, deploy]_ | _[...]_ |
| 11 | Antigravity | _[A8: rà soát cuối]_ | _[...]_ |

## 6. Tự đánh giá theo thang điểm

| Yêu cầu | Điểm | Đáp ứng | Bằng chứng |
|---|---|---|---|
| 3 trang: Home, About, Detail | 3 | _[ ]_ | Mục 2 |
| Dùng database | 3 | _[ ]_ | Mục 3.1 |
| ≥ 2 chức năng sửa DB | 2 | _[ ]_ | Mục 3.2 |
| Nhúng Google Map / YouTube | 0,5 | _[ ]_ | Trang About |
| File .md | 0,5 | _[ ]_ | Mục 4 |
| GitHub Public | 0,5 | _[ ]_ | Link ở đầu báo cáo |
| Deploy | 0,5 | _[ ]_ | Link ở đầu báo cáo |
| Trừ điểm: trang liên kết nhau | −0,5 nếu thiếu | _[ ]_ | Mục 2 |
| Trừ điểm: logo thương hiệu hư cấu | −0,5 nếu thiếu | _[ ]_ | Mục 1.1 |

## 7. Hạn chế và hướng phát triển

- _[Điền các hạn chế còn tồn tại.]_
- Hướng phát triển (Stretch): thanh toán VietQR, thông báo Telegram, upload ảnh lên Supabase Storage, thống kê đơn theo ngày/tháng/năm.
