<p align="center">
  <img src="public/assets/logo.svg" alt="Q-Sport" height="72">
</p>

# Q-Sport Online Store

Website bán hàng của thương hiệu **Q-Sport** (thương hiệu hư cấu, đồ án cuối khóa): cầu lông và phụ kiện thể thao. Frontend dùng HTML/CSS/TypeScript (Vite); dữ liệu và đăng nhập Admin dùng Supabase (PostgreSQL, Auth, RLS).

- **Website (đã deploy):** _điền link Cloudflare Pages tại đây_
- **GitHub (Public):** _điền link repo tại đây_
- **Đại diện:** Lã Thành Quyết — ltquyet@qsport.vn

## 1. Tài liệu trong repo

Đọc theo thứ tự: `PRD.md` → `DESIGN.md` → README này. Khi tài liệu mâu thuẫn, **PRD.md là nguồn yêu cầu chính**; không tự đổi nghiệp vụ, hãy ghi nhận và hỏi chủ dự án.

| File | Chức năng |
|---|---|
| `PRD.md` | Đặc tả yêu cầu sản phẩm: phạm vi MVP, trang, dữ liệu, RLS, tiêu chí nghiệm thu, kế hoạch theo ngày. Là “hợp đồng” để AI coding làm đúng việc. |
| `DESIGN.md` | Quy chuẩn thiết kế: logo, màu, font, bố cục, component, trạng thái, nội dung chữ. Giúp mọi trang nhất quán. |
| `README.md` | Giới thiệu, cách cài đặt, chạy, cấu hình Supabase, deploy. |
| `PROMPTS.md` | Kế hoạch prompt và nhật ký các prompt đã dùng cùng kết quả (phục vụ báo cáo). |
| `REPORT.md` | Báo cáo nộp bài: mô tả dự án, trang, chức năng, file .md, thứ tự prompt. |

## 2. Công nghệ

HTML5, CSS3, TypeScript (strict), Vite · `@supabase/supabase-js` · Supabase PostgreSQL + Auth + RLS · Cloudflare Pages.

Chọn phiên bản dependency theo trạng thái repo hiện tại; không đổi framework lớn khi chưa được duyệt.

## 3. Cấu trúc thư mục

```text
qsport-online-store/
├── PRD.md  DESIGN.md  README.md  PROMPTS.md  REPORT.md
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

## 4. Cấu hình môi trường

```bash
cp .env.example .env.local
```

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_KEY
```

**Không bao giờ** đặt vào `VITE_*`, source hoặc Git: Supabase secret/service-role key, mật khẩu Admin, connection string có mật khẩu. File `.env.local` phải nằm trong `.gitignore`. Vì repo để **Public**, hãy kiểm tra `git status` và lịch sử commit trước khi push.

## 5. Cài đặt và chạy local

```bash
npm install
npm run dev        # chạy local
npm run build      # build production (thư mục dist)
npm run preview    # xem bản build
npm run typecheck  # kiểm tra TypeScript
npm run lint       # kiểm tra code
```

Dùng một package manager duy nhất (một lockfile). Không báo “PASS” cho lệnh chưa chạy.

## 6. Thiết lập Supabase

1. Tạo project Supabase; lấy **Project URL** và **publishable (anon) key** đưa vào `.env.local`.
2. Chạy các file trong `supabase/migrations/` theo thứ tự trong SQL Editor hoặc Supabase CLI:
   - `supabase/migrations/20261009000000_create_qsport_schema.sql`
   - `supabase/migrations/20261009000001_create_rpc_create_order.sql`
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

## 7. Deploy (Cloudflare Pages)

1. Đưa code lên GitHub (repo **Public**).
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git → chọn repo.
3. Build command: `npm run build` · Output directory: `dist`.
4. Environment variables (Production): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.
5. Đảm bảo `public/_redirects` có dòng `/*    /index.html   200` để vào thẳng `/about`, `/products/...` không bị 404.
6. Sau deploy, mở **từng URL** trực tiếp: `/`, `/products`, `/products/<slug>`, `/about`, `/cart`, `/checkout`, `/admin/login`.

## 8. Checklist trước khi nộp

- [ ] Menu/footer liên kết được mọi trang; logo Q-Sport đúng file gốc ở header, footer, favicon
- [ ] Đặt hàng COD ghi vào `orders`/`order_items`; Admin CRUD sản phẩm; bình luận gửi và duyệt được
- [ ] Google Maps và YouTube hiển thị
- [ ] Không có secret trong repo hoặc bundle (`git grep -i "service_role"`, kiểm tra `dist/`)
- [ ] Repo ở chế độ **Public**; link GitHub và link website đã điền ở đầu README
- [ ] Đủ 5 file .md; `REPORT.md` đã điền đầy đủ, `PROMPTS.md` có đủ thứ tự prompt

## 9. Nguồn ảnh

_Ghi nguồn ảnh sản phẩm/banner (Unsplash, Pexels hoặc tự tạo) tại đây khi thêm ảnh._

## 10. Quy tắc cho Antigravity

Xem mục 11 trong `PRD.md`. Tóm tắt: làm đúng giai đoạn được giao, nêu kế hoạch trước khi code, không tự push/deploy, không đưa secret vào repo, dùng đúng logo và token trong `DESIGN.md`, ghi từng prompt vào `PROMPTS.md`.
