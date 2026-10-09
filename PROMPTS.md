# PROMPTS.md — Kế hoạch và nhật ký prompt

File này phục vụ phần báo cáo “Viết rõ thứ tự các prompt trong conversation và kết quả của từng prompt”.

- **Phần A:** nhật ký các prompt đã dùng (ghi thêm một dòng ngay sau mỗi prompt, đừng để cuối cùng mới viết).
- **Phần B:** bộ prompt kế hoạch gửi cho Antigravity, dán lần lượt theo từng giai đoạn.

---

## A. Nhật ký prompt

Cách ghi: số thứ tự · công cụ · nội dung prompt (tóm tắt hoặc nguyên văn) · kết quả · file thay đổi.

| # | Ngày | Công cụ | Prompt | Kết quả | File |
|---|---|---|---|---|---|
| 1 | 09/10/2026 | Claude | Đưa `README.md`, `PRD.md` và đề kiểm tra cuối khóa (PDF); yêu cầu review 2 file .md, so sánh với đề và đưa phương án thực hiện. | Chỉ ra PRD cũ quá lớn so với 8 ngày, thiếu `DESIGN.md`, thiếu nhật ký prompt, chưa có logo; giỏ hàng `localStorage` không tính là sửa DB. Đề xuất MVP, lịch 8 ngày, danh sách file .md. | (không đổi file) |
| 2 | 09/10/2026 | Claude | Xác nhận Q-Sport là thương hiệu hư cấu; nhờ thiết kế logo giả định, bổ sung và điều chỉnh các file .md còn thiếu/chưa phù hợp để giao cho Antigravity code. | Tạo logo (vợt cầu lông làm chữ Q): `logo.svg`, `logo.png`, `logo-mark.svg/.png`, `favicon.svg`. Viết lại `PRD.md` (v2.0 MVP), `README.md`; tạo mới `DESIGN.md`, `PROMPTS.md`, `REPORT.md`, `.env.example`, `public/_redirects`. | `PRD.md`, `README.md`, `DESIGN.md`, `PROMPTS.md`, `REPORT.md`, `public/assets/*`, `.env.example`, `public/_redirects` |
| 3 | 09/10/2026 | Antigravity | Tiếp nhận PRD v2.0 và DESIGN.md, đồng bộ cấu hình dự án P0, logo chính thức, _redirects, token màu và font theo quy chuẩn thiết kế. | Cập nhật implementation_plan.md, giải nén logo chính thức vào public/assets/, bổ sung _redirects, cấu hình Barlow Condensed + Be Vietnam Pro, site.ts, kiểm thử PASS 100%. | `PRD.md`, `DESIGN.md`, `README.md`, `implementation_plan.md`, `walkthrough.md`, `index.html`, `src/styles/*`, `src/config/site.ts`, `src/main.ts`, `public/assets/*`, `public/_redirects`, `PROMPTS.md` |
| 4 | 09/10/2026 | Antigravity | Triển khai P1: Database Migration, Seed, RLS Policies, Admin Auth & Postgres RPC create_order theo PRD v2.0. | Tạo 2 migrations SQL (schema + create_order RPC), seed.sql (6 danh mục + 12 sản phẩm demo), test suite p1_schema.test.ts, cập nhật README.md. Kiểm thử 22/22 tests PASS 100%. | `supabase/migrations/*`, `supabase/seed.sql`, `tests/unit/p1_schema.test.ts`, `README.md`, `PROMPTS.md`, `tsconfig.json`, `package.json` |
| 5 | 09/10/2026 | Antigravity | Triển khai P2: Shared Layout, Trang chủ, Danh sách sản phẩm, Chi tiết sản phẩm & Trang Về chúng tôi theo PRD v2.0. | Xây dựng SPA router, Header/Footer, CourtPattern SVG, ProductCard, Products, ProductDetail, About (nhúng Maps Thủ Đức & YouTube), cập nhật schema qsport. Kiểm thử 40/40 tests PASS 100%. | `src/app/*`, `src/components/*`, `src/pages/*`, `src/services/*`, `supabase/*`, `tests/unit/p2_public_pages.test.ts`, `PROMPTS.md` |
| 6 | 09/10/2026 | Antigravity | Triển khai P3: Giỏ hàng (localStorage), Checkout COD qua Postgres RPC qsport.create_order, Trang Order Success & P3 Test Suite. | Xây dựng cartService, orderService, Cart page, Checkout COD page, OrderSuccess page, validate SĐT Việt Nam, RPC server-side calculation. Kiểm thử 55/55 tests PASS 100%. | `src/services/cartService.ts`, `src/services/orderService.ts`, `src/pages/Cart.ts`, `src/pages/Checkout.ts`, `src/pages/OrderSuccess.ts`, `src/app/router.ts`, `tests/unit/p3_cart_checkout.test.ts`, `PROMPTS.md` |

---

## B. Bộ prompt kế hoạch cho Antigravity

Chuẩn bị: đặt các file trong gói tài liệu (`PRD.md`, `DESIGN.md`, `README.md`, `PROMPTS.md`, `REPORT.md`, `.env.example`, `public/`) vào thư mục gốc của repo trước khi bắt đầu. Sau mỗi prompt: kiểm tra kết quả, chạy thử, rồi ghi vào Phần A.

### A0 — Khởi động và kế hoạch (09/10)

```text
Đọc toàn bộ PRD.md, DESIGN.md và README.md trong repo. Chưa viết code.
Hãy trả lời ngắn gọn:
1) Bạn hiểu MVP gồm những trang và chức năng nào (theo PRD mục 2 và 5)?
2) Liệt kê các điểm mâu thuẫn hoặc mơ hồ nếu có.
3) Đề xuất cấu trúc thư mục và danh sách file sẽ tạo ở giai đoạn P0.
Không làm các mục Stretch. Chờ tôi xác nhận rồi mới bắt đầu.
```

### A1 — P0: Khởi tạo dự án (09/10)

```text
Thực hiện giai đoạn P0 theo PRD mục 10:
- Khởi tạo dự án Vite + TypeScript (strict), cấu hình ESLint.
- Giữ nguyên public/assets/* và public/_redirects, .env.example đã có; thêm .gitignore (bỏ .env.local, node_modules, dist).
- Tạo src/styles/tokens.css từ DESIGN.md mục 3.4, nạp font theo DESIGN.md mục 3.2.
- Tạo router SPA (History API) với các route trong PRD mục 5 (trang tạm thời ghi tên trang), header và footer dùng đúng logo public/assets/logo.svg và nội dung footer bắt buộc.
- Scripts: dev, build, preview, typecheck, lint.
Chạy npm run build, npm run typecheck, npm run lint và báo kết quả thật. Không push, không deploy.
```

### A2 — P1: Database, RLS, seed (10/10)

```text
Thực hiện giai đoạn P1: viết SQL migration trong supabase/migrations/ và supabase/seed.sql theo PRD mục 6.
- Bảng: categories, products, orders, order_items, product_comments, admin_users, đúng cột và ràng buộc trong PRD.
- Bật RLS cho mọi bảng; policy theo PRD mục 6.1 (anon chỉ đọc sản phẩm/danh mục active và bình luận APPROVED, chỉ thêm bình luận PENDING; không đọc orders/order_items).
- Viết Postgres function create_order (SECURITY DEFINER) nhận danh sách product_id + quantity + thông tin khách, kiểm tra sản phẩm active và tồn kho, tính giá từ bảng products, ghi orders + order_items trong một transaction, trả về order_code.
- Seed 6 danh mục và khoảng 12 sản phẩm demo (tên hư cấu hoặc chung, không dùng logo hãng thật).
- Viết hướng dẫn chạy migration và kiểm tra quyền anon vào README mục 6 nếu thiếu.
Không dùng service_role trong code frontend. Giải thích từng policy ngắn gọn.
```

### A3 — P2: Trang public (11/10)

```text
Thực hiện giai đoạn P2: xây dựng Trang chủ, Danh sách sản phẩm, Chi tiết sản phẩm (/products/:slug) và Về chúng tôi (/about) theo PRD mục 5 và DESIGN.md mục 4–9.
- Đọc dữ liệu từ Supabase qua src/services; có trạng thái đang tải, trống, lỗi.
- Hero có họa tiết đường kẻ sân (SVG nội tuyến) theo DESIGN.md mục 4, tôn trọng prefers-reduced-motion.
- Header/footer có link tới Trang chủ, Sản phẩm, Về chúng tôi, Giỏ hàng ở mọi trang.
- Giá tiền dùng Barlow Condensed màu --color-smash, định dạng vi-VN.
- Ảnh dùng nguồn miễn phí bản quyền, lưu trong public/assets/products/, ghi nguồn vào README mục 9.
Chạy build, typecheck, lint và kiểm tra vào thẳng từng URL khi chạy npm run dev.
```

### A4 — P3: Giỏ hàng và checkout COD (12/10)

```text
Thực hiện giai đoạn P3: giỏ hàng (localStorage) và checkout COD theo PRD mục 2.1, 6, 9 (AC-03, AC-04).
- Giỏ: thêm, xóa, tăng/giảm, xóa hết; giữ nguyên sau reload; đồng bộ lại giá/trạng thái từ Supabase trước khi checkout; localStorage lỗi thì báo thân thiện, không crash.
- Checkout: validate họ tên, số điện thoại Việt Nam, địa chỉ; gọi RPC create_order; chống bấm đúp; hiện trang /order-success/:code.
- Không để trình duyệt quyết định giá hay tổng tiền.
Mô tả cách tôi kiểm tra bằng tay (đặt 1 đơn, xem bản ghi trong Supabase).
```

### A5 — P4: Admin sản phẩm và đơn hàng (13/10)

```text
Thực hiện giai đoạn P4: /admin/login (Supabase Auth), /admin/products (thêm, sửa, ẩn/hiện, xóa), /admin/orders (danh sách, chi tiết, đổi trạng thái NEW → PROCESSING → SHIPPED; hủy đơn bắt buộc nhập lý do).
- Chỉ user có trong admin_users mới vào được các route /admin/*; kiểm tra quyền ở database (RLS), không chỉ ẩn nút.
- Xóa sản phẩm đã có trong đơn thì xóa mềm (deleted_at); không xóa cứng lịch sử đơn.
- Có modal xác nhận trước thao tác phá hủy, thông báo thành công/lỗi, chống bấm đúp.
Báo cáo các policy RLS đã thêm hoặc sửa.
```

### A6 — P5: Bình luận, Maps, YouTube (14/10)

```text
Thực hiện giai đoạn P5:
- Bình luận ở trang chi tiết: form gửi (tên hiển thị, nội dung, giới hạn độ dài), lưu PENDING, chỉ hiển thị APPROVED; nội dung phải được escape (không dùng innerHTML với dữ liệu người dùng).
- /admin/comments: duyệt, ẩn, xóa.
- Nhúng Google Maps (About/Home) và YouTube (About) bằng iframe có title và loading="lazy"; đọc URL từ src/config/site.ts. Nếu URL chưa điền, hiện thông báo thay thế. Thêm chú thích “Địa chỉ minh họa cho đồ án”. Không tự bịa URL.
```

### A7 — P6: GitHub và deploy (15/10)

```text
Chuẩn bị đưa dự án lên GitHub (Public) và deploy Cloudflare Pages theo README mục 7:
- Quét repo để chắc chắn không có secret (service_role, mật khẩu, .env.local); liệt kê kết quả.
- Kiểm tra .gitignore, .env.example, README (điền placeholder còn thiếu).
- Hướng dẫn từng bước tạo repo, push, kết nối Cloudflare Pages; KHÔNG tự push hoặc deploy, chờ tôi xác nhận.
- Danh sách URL cần kiểm tra trực tiếp sau deploy.
```

### A8 — P7: Rà soát cuối (16/10)

```text
Rà soát toàn bộ tiêu chí nghiệm thu AC-01 đến AC-14 trong PRD mục 9. Với mỗi mục ghi: đã chạy kiểm tra gì, kết quả (PASS / chưa chạy / lỗi), bằng chứng (lệnh, URL, màn hình).
Chạy build, typecheck, lint. Liệt kê lỗi còn tồn tại và đề xuất cách sửa nhỏ nhất. Không thêm tính năng mới.
```

---

## C. Mẹo

- Ghi vào Phần A ngay sau mỗi prompt: số thứ tự, nội dung, kết quả, file thay đổi.
- Chụp ảnh màn hình kết quả quan trọng (trang chủ, chi tiết, giỏ hàng, admin, bản deploy) để đưa vào `REPORT.md`.
- Nếu một prompt cho kết quả sai, vẫn ghi lại và ghi rõ cách đã sửa; đó là phần có giá trị của báo cáo.
