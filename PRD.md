# Q-Sport Online Store — Product Requirements Document (PRD)

- **Phiên bản:** 2.0 (MVP cho đồ án cuối khóa — thay thế bản 1.0)
- **Thương hiệu:** Q-Sport (thương hiệu **hư cấu**, lĩnh vực cầu lông và phụ kiện thể thao)
- **Đại diện:** Lã Thành Quyết — ltquyet@qsport.vn
- **Ngôn ngữ giao diện:** Tiếng Việt · **Múi giờ:** Asia/Ho_Chi_Minh · **Tiền tệ:** VND (số nguyên)
- **Hạn nộp:** 17/10/2026 (buổi học cuối)
- **Tài liệu liên quan:** `DESIGN.md` (giao diện, logo), `README.md` (cài đặt/deploy), `PROMPTS.md` (nhật ký prompt), `REPORT.md` (báo cáo nộp bài)

> **Thay đổi so với bản 1.0:** Bản 1.0 là đặc tả cho cửa hàng thương mại đầy đủ (8 phase). Bản 2.0 giữ nguyên hướng sản phẩm nhưng thu gọn thành MVP làm được trong ~8 ngày và bám sát thang điểm đồ án. Telegram, VietQR, audit log, Edge Functions chuyển sang mục **Stretch** (mục 3).

## 1. Mục tiêu

Website bán hàng Q-Sport: khách xem sản phẩm, xem chi tiết, bình luận, thêm giỏ hàng và đặt hàng (COD). Admin đăng nhập để quản lý sản phẩm, đơn hàng và bình luận. Dữ liệu lưu trên Supabase PostgreSQL.

### 1.1 Ánh xạ yêu cầu đề kiểm tra → tính năng

| Yêu cầu đề (điểm) | Đáp ứng bằng |
|---|---|
| ≥3 trang: Home, About, Detail (3đ) | `/`, `/about`, `/products/:slug` (cộng thêm Products, Cart, Checkout, Admin) |
| Có database (3đ) | Supabase PostgreSQL: categories, products, orders, order_items, product_comments, admin_users |
| ≥2 chức năng sửa DB (2đ) | **F1** Đặt hàng (insert) · **F2** Admin CRUD sản phẩm (insert/update/delete) · **F3** Bình luận + duyệt (insert/update) · **F4** Admin đổi trạng thái đơn (update) |
| Nhúng Maps hoặc YouTube (0,5đ) | Cả hai: Google Maps (About/Home) và YouTube (About) |
| File .md (0,5đ) | PRD.md, DESIGN.md, README.md, PROMPTS.md, REPORT.md |
| GitHub Public (0,5đ) | Repo public, không chứa secret |
| Deploy (0,5đ) | Cloudflare Pages |
| Trừ điểm: trang không liên kết | Header/footer có link đến Home, Products, About, Cart ở **mọi** trang |
| Trừ điểm: thương hiệu hư cấu phải có logo | Logo có sẵn tại `public/assets/logo.svg`, dùng đúng logo này ở header, footer, favicon, báo cáo |

> Lưu ý: giỏ hàng lưu `localStorage` **không** tính là chức năng sửa database. Điểm F1 nằm ở bước checkout ghi đơn vào Supabase.

## 2. Phạm vi MVP (bắt buộc)

### 2.1 Khách truy cập (không cần đăng nhập)
- Xem trang chủ, danh sách sản phẩm, chi tiết sản phẩm, trang Về chúng tôi.
- Tìm theo tên, lọc theo danh mục, sắp xếp (mới nhất / giá tăng / giá giảm).
- Giỏ hàng trong `localStorage`: thêm, xóa, tăng/giảm số lượng, xóa hết; giữ nguyên khi reload.
- Checkout: nhập họ tên, số điện thoại, địa chỉ, ghi chú; thanh toán **COD**.
- Gửi bình luận cho sản phẩm (chờ Admin duyệt mới hiển thị).

### 2.2 Admin
- Đăng nhập bằng Supabase Auth (email + mật khẩu). Không có đăng ký Admin công khai.
- Sản phẩm: thêm, sửa, ẩn/hiện, xóa (xóa mềm nếu sản phẩm đã có trong đơn).
- Đơn hàng: xem danh sách và chi tiết, đổi trạng thái (`NEW → PROCESSING → SHIPPED`, hoặc `CANCELLED` kèm lý do).
- Bình luận: duyệt, ẩn, xóa.

### 2.3 Quy tắc cố định
- Danh mục khởi tạo: Giày, Vợt, Quần, Áo, Balo, Phụ kiện (seed bằng SQL, không hard-code trong frontend).
- Giá lưu `BIGINT` VND; hiển thị định dạng `vi-VN` + `đ`.
- Hết hàng / ẩn: vẫn xem được (hết hàng) nhưng không thêm vào giỏ; sản phẩm ẩn không hiện ở public.
- Giá và tổng tiền luôn do **database** tính lại khi tạo đơn, không tin giá từ trình duyệt.

## 3. Stretch (chỉ làm khi MVP đã PASS toàn bộ mục 9 và được chủ dự án duyệt)

1. Thanh toán VietQR (ảnh QR + nút “Đã chuyển” → `PENDING_CONFIRMATION`; Admin xác nhận `PAID`).
2. Thông báo Telegram qua Supabase Edge Function (token nằm trong Edge Function Secrets).
3. Upload ảnh sản phẩm lên Supabase Storage.
4. Quản lý danh mục trong Admin; bộ lọc đơn theo ngày/tháng/năm.
5. Dashboard thống kê; lịch sử trạng thái đơn.

Không tự ý làm Stretch hoặc thêm tính năng ngoài PRD.

## 4. Kiến trúc

| Thành phần | Quyết định |
|---|---|
| Frontend | HTML5, CSS3, TypeScript (strict), Vite. Không dùng framework UI lớn. |
| Routing | SPA dùng History API; bắt buộc có `public/_redirects` (`/*  /index.html  200`). Nếu deploy gặp lỗi 404 khi vào thẳng URL, chuyển sang hash routing và ghi lại trong README. |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (chỉ Admin) |
| Logic đặt hàng | **Postgres function (RPC) `create_order`** — nhận danh sách `product_id` + `quantity` + thông tin khách, tính giá từ bảng `products`, ghi `orders` + `order_items` trong một transaction. Không cần Edge Function ở MVP. |
| Bảo mật dữ liệu | RLS bật trên mọi bảng `public`; grants tối thiểu |
| Hosting | Cloudflare Pages (build: `npm run build`, output: `dist`) |
| Cấu hình nhúng | `src/config/site.ts` chứa `MAPS_EMBED_URL`, `YOUTUBE_EMBED_URL`, địa chỉ, SĐT (xem mục 7) |

## 5. Sitemap và nội dung trang

| Route | Trang | Nội dung chính |
|---|---|---|
| `/` | Trang chủ | Hero + CTA “Mua sắm ngay”; danh mục; sản phẩm nổi bật; giới thiệu ngắn; khối liên hệ + Google Maps; footer |
| `/products` | Danh sách sản phẩm | Tìm kiếm, lọc danh mục, sắp xếp, lưới thẻ sản phẩm, phân trang hoặc “Xem thêm” |
| `/products/:slug` | **Chi tiết sản phẩm** | Ảnh, tên, giá, tồn kho, mô tả, nút thêm giỏ, bình luận đã duyệt, form gửi bình luận |
| `/cart` | Giỏ hàng | Danh sách, số lượng, tạm tính, nút “Đặt hàng” |
| `/checkout` | Thanh toán | Form khách hàng, tóm tắt đơn, COD, nút xác nhận |
| `/order-success/:code` | Đặt hàng thành công | Mã đơn, tóm tắt, link về trang chủ |
| `/about` | **Về chúng tôi** | Câu chuyện thương hiệu, tầm nhìn/sứ mệnh/giá trị, YouTube, Google Maps, thông tin liên hệ |
| `/admin/login` | Đăng nhập Admin | Email + mật khẩu |
| `/admin/products` | Quản lý sản phẩm | Bảng + form thêm/sửa/xóa |
| `/admin/orders` | Quản lý đơn | Danh sách, chi tiết, đổi trạng thái |
| `/admin/comments` | Quản lý bình luận | Duyệt/ẩn/xóa |

Header (mọi trang public): logo Q-Sport (link `/`), Trang chủ, Sản phẩm, Về chúng tôi, icon giỏ hàng kèm số lượng. Header và footer phải có mặt ở mọi trang để các trang liên kết với nhau.

**Footer bắt buộc, hiển thị chính xác:**
- `© Q-Sport. Bản quyền thuộc về Q-Sport.`
- `Đại diện: Lã Thành Quyết`
- `Email: ltquyet@qsport.vn`

## 6. Mô hình dữ liệu (MVP)

| Bảng | Cột chính |
|---|---|
| `categories` | `id uuid`, `name`, `slug` (unique), `sort_order`, `is_active` |
| `products` | `id uuid`, `category_id`, `name`, `slug` (unique), `sku` (unique, nullable), `short_description`, `description`, `price bigint ≥ 0`, `stock_quantity int ≥ 0`, `image_url`, `is_active`, `is_featured`, `deleted_at`, `created_at`, `updated_at` |
| `orders` | `id uuid`, `order_code` (unique, dễ đọc, không chứa dữ liệu cá nhân), `customer_name`, `customer_phone`, `shipping_address`, `customer_note`, `payment_method` (`COD`), `payment_status` (`COD_PENDING`), `order_status` (`NEW`, `PROCESSING`, `SHIPPED`, `CANCELLED`), `total_amount bigint`, `cancel_reason`, `created_at`, `updated_at` |
| `order_items` | `id uuid`, `order_id`, `product_id` (nullable), `product_name_snapshot`, `unit_price bigint`, `quantity int > 0`, `line_total bigint` |
| `product_comments` | `id uuid`, `product_id`, `display_name`, `content`, `status` (`PENDING`, `APPROVED`, `HIDDEN`), `created_at` |
| `admin_users` | `user_id uuid` (tham chiếu `auth.users.id`) — chỉ user có trong bảng này là Admin |

Ràng buộc: CHECK giá/số lượng không âm; index cho `products.slug`, `products.category_id`, `orders.created_at`, `order_items.order_id`, `product_comments(product_id, status)`; không cascade xóa lịch sử đơn; `order_items` giữ snapshot tên và giá.

### 6.1 RLS tối thiểu

| Bảng | Public (anon) | Admin |
|---|---|---|
| `categories` | Đọc bản `is_active` | CRUD |
| `products` | Đọc bản `is_active` và chưa xóa mềm | CRUD |
| `orders`, `order_items` | **Không đọc, không ghi trực tiếp** (chỉ tạo qua RPC `create_order`) | Đọc, cập nhật trạng thái |
| `product_comments` | Đọc `APPROVED`; thêm mới (luôn `PENDING`, qua RLS `WITH CHECK`) | Duyệt/ẩn/xóa |
| `admin_users` | Không | Đọc bản thân |

Không dùng policy `USING (true)` cho `orders`, `order_items`, `admin_users`. Phải kiểm tra bằng tay (hoặc script) rằng `anon` không đọc được `orders`.

## 7. Nhúng Google Maps và YouTube

- URL embed đặt trong `src/config/site.ts`; **chủ dự án điền** `MAPS_EMBED_URL` và `YOUTUBE_EMBED_URL` (Antigravity không tự bịa URL).
- Địa chỉ cửa hàng là **địa chỉ minh họa** cho đồ án; đặt dòng chú thích “Địa chỉ minh họa cho đồ án” cạnh bản đồ.
- `<iframe>` có `title`, `loading="lazy"`, `referrerpolicy`, và có thông báo thay thế nếu URL chưa cấu hình.

## 8. Hình ảnh và thương hiệu

- Logo dùng **duy nhất** các file trong `public/assets/` (`logo.svg`, `logo-mark.svg`, `favicon.svg`, bản PNG). Không tạo logo khác. Quy tắc dùng logo xem `DESIGN.md`.
- Ảnh sản phẩm/banner: dùng ảnh miễn phí bản quyền (Unsplash, Pexels) hoặc ảnh tự tạo, lưu trong `public/assets/products/`, ghi nguồn trong `README.md`. **Không** sao chép ảnh, logo, nội dung từ shopvnb.com, votcaulongshop.vn, xbsports.vn.
- Có placeholder khi ảnh lỗi; ảnh cùng tỷ lệ, không méo.
- Seed khoảng 12 sản phẩm demo (hãng/tên sản phẩm hư cấu hoặc dạng chung, không dùng logo hãng thật).

## 9. Tiêu chí nghiệm thu (Acceptance Criteria)

- [ ] **AC-01** Có ≥3 trang chính (Home, About, Detail) và mọi trang liên kết qua menu/footer; vào thẳng từng URL đều không lỗi (cả local và bản deploy).
- [ ] **AC-02** Danh sách và chi tiết sản phẩm đọc dữ liệu từ Supabase; sản phẩm ẩn không hiện.
- [ ] **AC-03** Giỏ hàng thêm/xóa/đổi số lượng, giữ nguyên sau reload; giỏ rỗng không đặt hàng được.
- [ ] **AC-04** Checkout COD tạo đúng `orders` + `order_items`, tổng tiền do DB tính, trạng thái `NEW` / `COD_PENDING`; bấm đúp không tạo đơn trùng.
- [ ] **AC-05** Admin đăng nhập; public không vào được `/admin/*` và không đọc được `orders`.
- [ ] **AC-06** Admin thêm, sửa, ẩn, xóa sản phẩm và thấy thay đổi ở trang public.
- [ ] **AC-07** Admin đổi trạng thái đơn; hủy đơn bắt buộc nhập lý do; không xóa cứng đơn.
- [ ] **AC-08** Khách gửi bình luận → `PENDING`; chỉ `APPROVED` hiển thị; nội dung được escape (không chạy HTML/script).
- [ ] **AC-09** Google Maps và YouTube hiển thị ở About (hoặc Home).
- [ ] **AC-10** Logo Q-Sport đúng file gốc ở header, footer, favicon; footer đúng nội dung bắt buộc.
- [ ] **AC-11** Giao diện theo `DESIGN.md`, responsive mobile/tablet/desktop, có loading/empty/error state.
- [ ] **AC-12** Không có secret trong source/bundle/Git; `npm run build`, `typecheck`, `lint` chạy được.
- [ ] **AC-13** Repo GitHub **Public**; website đã deploy và mở được bằng link.
- [ ] **AC-14** Có đủ 5 file .md và `REPORT.md` đã điền.

## 10. Kế hoạch triển khai (thay cho 8 phase của bản 1.0)

| Giai đoạn | Nội dung | Điều kiện hoàn thành |
|---|---|---|
| **P0** (09/10) | Tài liệu nền, logo, khởi tạo repo Vite + TS, `.env.example`, `_redirects` | `npm run dev` và `npm run build` chạy |
| **P1** (10/10) | Migration, seed, RLS, tạo Admin | Anon đọc được sản phẩm, không đọc được orders |
| **P2** (11/10) | Layout, Home, Products, Detail, About, header/footer | AC-01, AC-02, AC-10 |
| **P3** (12/10) | Giỏ hàng, checkout COD (RPC `create_order`) | AC-03, AC-04 |
| **P4** (13/10) | Admin login + CRUD sản phẩm, quản lý đơn | AC-05, AC-06, AC-07 |
| **P5** (14/10) | Bình luận + duyệt, nhúng Maps/YouTube | AC-08, AC-09 |
| **P6** (15/10) | Push GitHub Public, deploy Cloudflare Pages, kiểm tra từng URL | AC-12, AC-13 |
| **P7** (16/10) | Hoàn thiện `REPORT.md`, rà toàn bộ AC | AC-14 |
| Dự phòng (17/10) | Chỉ sửa lỗi, nộp bài | — |

Nếu trễ lịch: cắt theo thứ tự — bỏ bộ lọc nâng cao → bỏ sắp xếp → bỏ trang order-success (hiện thông báo tại chỗ) → giữ nguyên F1, F2, F3 và 3 trang bắt buộc.

## 11. Quy tắc làm việc cho Antigravity

1. Đọc `PRD.md`, `DESIGN.md`, `README.md` trước khi code.
2. Mỗi prompt/phase: nêu ngắn gọn mục tiêu, file sẽ sửa và cách kiểm tra **trước khi** code.
3. Chỉ làm đúng giai đoạn được giao; không làm Stretch, không đổi nghiệp vụ hay schema khi chưa được duyệt.
4. Không tự push, deploy, xóa dữ liệu, hoặc đổi secret nếu chưa được cho phép rõ ràng.
5. Không đưa Supabase secret/service-role key vào code, `VITE_*`, hay Git. Frontend chỉ dùng publishable (hoặc anon) key.
6. Dùng đúng logo trong `public/assets/`; dùng token màu/font trong `DESIGN.md`.
7. Không báo “PASS” cho lệnh chưa chạy; ghi rõ lệnh đã chạy và kết quả thật.
8. Sau mỗi prompt, thêm một mục vào `PROMPTS.md` (nội dung prompt, kết quả, file thay đổi) — phục vụ báo cáo.
9. Giữ diff nhỏ, dễ review.

## 12. Quyết định còn mở (chủ dự án điền)

- `MAPS_EMBED_URL` (địa điểm minh họa) và `YOUTUBE_EMBED_URL` (video giới thiệu/hướng dẫn cầu lông).
- Số điện thoại, địa chỉ minh họa hiển thị ở About/footer.
- Phí vận chuyển MVP: mặc định **0đ** (hiển thị rõ “Miễn phí vận chuyển” hoặc “Phí ship sẽ được xác nhận khi liên hệ”).
- Tài khoản Admin: email + mật khẩu tự tạo trên Supabase Dashboard rồi thêm `user_id` vào `admin_users` (không ghi mật khẩu vào repo).
