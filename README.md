<p align="center">
  <img src="public/assets/logo.svg" alt="Q-Sport" height="72">
</p>

# Q-Sport Online Store

Website bán hàng của thương hiệu **Q-Sport** (thương hiệu hư cấu, đồ án cuối khóa): cầu lông và phụ kiện thể thao. Frontend dùng HTML/CSS/TypeScript (Vite); dữ liệu và đăng nhập Admin dùng Supabase (PostgreSQL, Auth, RLS).

- **Website (đã deploy):** _điền link Cloudflare Pages tại đây_
- **GitHub (Public):** _điền link repo tại đây_
- **Đại diện:** Lã Thành Quyết — ltquyet@qsport.vn

## 1. Tài liệu trong repo

Đọc theo thứ tự: [`docs/PRD.md`](docs/PRD.md) → [`docs/DESIGN.md`](docs/DESIGN.md) → README này. Khi tài liệu mâu thuẫn, **docs/PRD.md là nguồn yêu cầu chính**; không tự đổi nghiệp vụ, hãy ghi nhận và hỏi chủ dự án.

| File | Chức năng |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Đặc tả yêu cầu sản phẩm: phạm vi MVP, trang, dữ liệu, RLS, tiêu chí nghiệm thu, kế hoạch theo ngày. Là “hợp đồng” để AI coding làm đúng việc. |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Quy chuẩn thiết kế: logo, màu, font, bố cục, component, trạng thái, nội dung chữ. Giúp mọi trang nhất quán. |
| [`README.md`](README.md) | Giới thiệu, cách cài đặt, chạy, cấu hình Supabase, deploy. |
| [`docs/PROMPTS.md`](docs/PROMPTS.md) | Kế hoạch prompt và nhật ký các prompt đã dùng cùng kết quả (phục vụ báo cáo). |
| [`docs/REPORT.md`](docs/REPORT.md) | Báo cáo nộp bài: mô tả dự án, trang, chức năng, file .md, thứ tự prompt. |
| [`docs/TELEGRAM_ORDER_ALERT_SETUP.md`](docs/TELEGRAM_ORDER_ALERT_SETUP.md) | Hướng dẫn cấu hình thông báo đơn hàng Telegram Bot qua Cloudflare Pages Functions. |
| [`docs/SUPABASE_INTEGRATION_GATE_REPORT.md`](docs/SUPABASE_INTEGRATION_GATE_REPORT.md) | Báo cáo đánh giá và kết quả xác minh tích hợp Supabase Cloud. |

## 2. Công nghệ

HTML5, CSS3, TypeScript (strict), Vite · `@supabase/supabase-js` · Supabase PostgreSQL + Auth + RLS · Cloudflare Pages.

## 3. Các tính năng nổi bật của hệ thống

1. **Nhúng API Thời tiết tại Footer:**
   - Cột thứ 4 tại Footer tích hợp WeatherAPI.com (endpoint `current.json`, vị trí TP. Hồ Chí Minh, ngôn ngữ Tiếng Việt).
   - Hiển thị nhiệt độ thực tế (°C), biểu tượng thời tiết, độ ẩm, tốc độ gió và thời gian cập nhật.
   - Cơ chế bộ nhớ đệm (cache) 10 phút tối ưu dung lượng và tốc độ tải trang.

2. **Alert thông báo đơn hàng tức thì qua Bot Telegram:**
   - Tích hợp gửi thông báo realtime ngay khi khách hoàn tất đặt hàng COD hoặc VietQR.
   - Xử lý server-side bảo mật tuyệt đối qua Cloudflare Pages Functions (`/api/telegram-alert`). Token và Chat ID được cấu hình trên Cloudflare Dashboard (không bao giờ lộ ra frontend).
   - Thiết kế cơ chế fail-safe: nếu Telegram gặp lỗi mạng, đơn hàng trong database vẫn được tạo an toàn 100%.

3. **Tạo mã VietQR động khi tạo đơn hàng:**
   - Hỗ trợ thanh toán chuyển khoản ngân hàng VietQR (MB Bank) song song với hình thức COD.
   - Hệ thống tự động sinh mã VietQR chuẩn NAPAS chứa chính xác số tài khoản, tên chủ thẻ, số tiền đơn hàng và mã đơn hàng nội dung chuyển khoản để khách quét mã thanh toán tức thì.

4. **Widget liên hệ đa kênh tiện lợi (Floating Contact):**
   - Tiện ích nổi ở góc màn hình gồm 3 kênh: Facebook Messenger, Zalo cá nhân/OA, và gọi điện Hotline nhanh (`tel:`).
   - Quản lý tập trung qua file cấu hình `src/config/contact.ts`.
   - Kiểm tra an toàn URL ngoài (`noopener noreferrer`), tự động ẩn hoàn toàn trên mọi trang quản trị Admin (`/admin/*`) để tối ưu không gian làm việc.

5. **Các tiện ích nâng cao khác:**
   - **Product Quick Add:** Tùy chọn số lượng (`-`, input, `+`) và thêm vào giỏ trực tiếp trên từng thẻ sản phẩm Product Card.
   - **Admin Real-Time Badges:** Huy hiệu số đếm đơn hàng mới (`NEW`) và bình luận chờ duyệt (`PENDING`) trực tiếp trên 2 nút menu Admin, tự động cập nhật ngầm mỗi 30s.
   - **Hero Image Slider & Gallery:** Slideshow 5+ banner 3:2 tự động chuyển ảnh và gallery chuyển ảnh thumbnail chi tiết trên trang sản phẩm.
   - **Chuyên trang Tin nội bộ & Video:** Danh mục video kỹ thuật cầu lông nhúng YouTube iframe kèm trình phát modal player.

## 4. Cấu trúc thư mục

```text
qsport-online-store/
├── README.md
├── docs/
│   ├── PRD.md
│   ├── DESIGN.md
│   ├── PROMPTS.md
│   ├── REPORT.md
│   ├── TELEGRAM_ORDER_ALERT_SETUP.md
│   └── SUPABASE_INTEGRATION_GATE_REPORT.md
├── .env.example
├── index.html
├── package.json
├── public/
│   ├── _redirects              # SPA fallback cho Cloudflare Pages
│   └── assets/
│       ├── logo.svg  logo.png  logo-mark.svg  logo-mark.png  favicon.svg
│       └── products/           # ảnh sản phẩm miễn phí bản quyền / tự tạo
├── src/
│   ├── main.ts
│   ├── app/            # router, bootstrap
│   ├── config/site.ts  # MAPS_EMBED_URL, YOUTUBE_EMBED_URL, địa chỉ, SĐT
│   ├── components/     # header, footer, product-card, toast...
│   ├── pages/          # home, products, product-detail, cart, checkout, about, admin/*
│   ├── services/       # supabaseClient, productService, cartService, orderService, commentService, authService
│   ├── types/  utils/  styles/
└── supabase/
    ├── migrations/     # schema, RLS, RPC create_order
    └── seed.sql        # 6 danh mục + ~12 sản phẩm demo
```

Chỉ tạo thư mục khi cần; cập nhật mục này nếu cấu trúc đổi.

## 5. Cấu hình môi trường

```bash
cp .env.example .env.local
```

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_KEY
# Khóa công khai WeatherAPI.com (hiển thị thời tiết tại Footer)
VITE_WEATHERAPI_KEY=YOUR_WEATHERAPI_KEY_HERE
```

**Không bao giờ** đặt vào `VITE_*`, source hoặc Git: Supabase secret/service-role key, mật khẩu Admin, connection string có mật khẩu. File `.env.local` phải nằm trong `.gitignore`. Vì repo để **Public**, hãy kiểm tra `git status` và lịch sử commit trước khi push.

## 6. Cài đặt và chạy local

```bash
npm install
npm run dev        # chạy local
npm run build      # build production (thư mục dist)
npm run preview    # xem bản build
npm run typecheck  # kiểm tra TypeScript
npm run lint       # kiểm tra code
npm test           # chạy toàn bộ 175 unit tests (Vitest)
```

Dùng một package manager duy nhất (một lockfile). Không báo “PASS” cho lệnh chưa chạy.

## 7. Thiết lập Supabase

1. Tạo project Supabase; lấy **Project URL** và **publishable (anon) key** đưa vào `.env.local`.
2. Chạy các file trong `supabase/migrations/` theo thứ tự trong SQL Editor hoặc Supabase CLI:
   - `supabase/migrations/20261009000000_create_qsport_schema.sql`
   - `supabase/migrations/20261009000001_create_rpc_create_order.sql`
   - `supabase/migrations/20261009000002_add_short_codes.sql`
   - Sau đó chạy `supabase/seed.sql` để tạo 6 danh mục mặc định và 12 sản phẩm demo.
3. Xác nhận RLS đã **bật** cho mọi bảng trong schema `public`.
4. Tạo tài khoản Admin: Supabase Dashboard → Authentication → Users → Add user (email + mật khẩu tự chọn, **không bao giờ ghi vào repo**).
5. Phân quyền Admin trong schema `qsport`:
   ```sql
   INSERT INTO qsport.admin_users (id, email, full_name, is_active)
   SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', 'Q-Sport Admin'), true
   FROM auth.users
   WHERE email = 'YOUR_ADMIN_EMAIL@domain.com'
   ON CONFLICT (id) DO UPDATE SET is_active = true;
   ```
6. Kiểm tra nhanh quyền: với vai trò `anon`, đọc `products` thành công, đọc `orders` và `admin_users` bị từ chối.
7. Authentication → URL Configuration: thêm domain Cloudflare Pages và `http://localhost:5173`.

Tham khảo: https://supabase.com/docs/guides/database/postgres/row-level-security · https://supabase.com/docs/guides/getting-started/api-keys

## 8. Deploy (Cloudflare Pages)

1. Đưa code lên GitHub (repo **Public**).
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git → chọn repo.
3. Build command: `npm run build` · Output directory: `dist`.
4. Environment variables & Secrets (Production):
   - `VITE_SUPABASE_URL`: URL project Supabase.
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Anon publishable key.
   - `VITE_WEATHERAPI_KEY`: API key WeatherAPI.com (cho widget thời tiết Footer).
   - `TELEGRAM_BOT_TOKEN` & `TELEGRAM_CHAT_ID`: Cấu hình trong phần **Variables and secrets** (an toàn server-side cho alert đơn hàng qua `functions/api/telegram-alert.ts`).
5. Đảm bảo `public/_redirects` có dòng `/*    /index.html   200` để vào thẳng `/about`, `/products/...` không bị 404.
6. Sau deploy, mở **từng URL** trực tiếp: `/`, `/products`, `/products/<slug>`, `/about`, `/cart`, `/checkout`, `/admin/login`.

## 9. Checklist trước khi nộp

- [ ] Menu/footer liên kết được mọi trang; logo Q-Sport đúng file gốc ở header, footer, favicon
- [ ] Đặt hàng COD & VietQR ghi vào `orders`/`order_items`; Admin CRUD sản phẩm; bình luận gửi và duyệt được
- [ ] Widget thời tiết WeatherAPI hoạt động ở Footer; thông báo Telegram Order Alert server-side sẵn sàng
- [ ] Widget liên hệ Messenger, Zalo, Hotline hiển thị đầy đủ
- [ ] Google Maps và YouTube hiển thị
- [ ] Không có secret trong repo hoặc bundle (`git grep -i "service_role"`, kiểm tra `dist/`)
- [ ] Repo ở chế độ **Public**; link GitHub và link website đã điền ở đầu README
- [ ] Đủ các file .md trong `docs/`; `docs/REPORT.md` đã điền đầy đủ, `docs/PROMPTS.md` có đủ thứ tự prompt

## 10. Nguồn ảnh

_Ghi nguồn ảnh sản phẩm/banner (Unsplash, Pexels hoặc tự tạo) tại đây khi thêm ảnh._

## 11. Quy tắc cho Antigravity

Xem mục 11 trong [`docs/PRD.md`](docs/PRD.md). Tóm tắt: làm đúng giai đoạn được giao, nêu kế hoạch trước khi code, không tự push/deploy, không đưa secret vào repo, dùng đúng logo và token trong [`docs/DESIGN.md`](docs/DESIGN.md), ghi từng prompt vào [`docs/PROMPTS.md`](docs/PROMPTS.md).
