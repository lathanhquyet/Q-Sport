# Q-Sport — DESIGN.md

Tài liệu thiết kế cho website Q-Sport (thương hiệu hư cấu, cầu lông và phụ kiện thể thao). Antigravity phải làm theo file này khi viết HTML/CSS; nếu cần khác đi, hãy hỏi chủ dự án trước. Yêu cầu nghiệp vụ nằm ở `PRD.md`.

## 1. Ý tưởng thiết kế

**Một ý tưởng duy nhất: “đường kẻ sân”.** Cầu lông có hình ảnh rất riêng: sân với những đường kẻ trắng mảnh trên nền xanh. Giao diện dùng những đường kẻ đó như ngôn ngữ cấu trúc: đường phân cách, khung viền thẻ, nền hero. Phần còn lại giữ yên tĩnh và sáng.

- Tông: sáng, xanh lá pastel làm màu chủ đạo, chữ xanh rêu đậm cho độ tương phản cao.
- Điểm nhớ (dùng đúng một chỗ): **hero** có họa tiết sân cầu lông bằng đường kẻ mảnh, chạy vào một lần khi tải trang.
- Giá tiền nổi bật bằng font số dạng “bảng điểm” (Barlow Condensed) và màu cam đậm; tên sản phẩm đậm, dễ quét.
- Không dùng nền gradient trang trí, không dùng nền kem/đất nung, không bo góc giống hệt nhau cho mọi thứ.

## 2. Logo

Logo là chữ **Q là cây vợt cầu lông** (đầu vợt oval nghiêng có dây, cán vàng), nối với “-Sport”. Dấu gạch ngang màu vàng cùng màu với cán vợt.

| File | Dùng cho |
|---|---|
| `public/assets/logo.svg` | Header, footer, trang About, báo cáo (bản chính, nền trắng hoặc nền mint) |
| `public/assets/logo.png` | Tài liệu, báo cáo Word/PDF, slide (nền trong suốt, 1018×255) |
| `public/assets/logo-mark.svg` / `.png` | Avatar, ảnh chia sẻ, chỗ cần logo vuông (512×512) |
| `public/assets/favicon.svg` | Favicon (bản đơn giản hóa, không có dây vợt để đọc được ở 16px) |

Quy tắc:
- **Chỉ dùng đúng các file trên**; không vẽ lại, không dùng chữ thường thay logo. Nếu cần sửa logo, hỏi chủ dự án.
- Header cao 36–40px (mobile 32px); không nhỏ hơn 24px. Vùng trống quanh logo tối thiểu bằng 1/2 chiều cao logo.
- Chỉ đặt trên nền trắng `#FFFFFF` hoặc mint `#EAF7EF`; không đặt trên ảnh rối hoặc nền tối.
- Không đổi màu, không kéo giãn, không thêm bóng, không xoay.
- Trong HTML dùng `<img src="/assets/logo.svg" alt="Q-Sport" height="40">` và bọc trong link về `/`.
- Favicon: `<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">`.

## 3. Token thiết kế

### 3.1 Màu (Bảng màu mới đợt UI/UX Remediation)

| Token | Hex | Dùng cho |
|---|---|---|
| `--color-court` | `#087F5B` | Màu thương hiệu chính: nút bấm chính, tiêu đề nhấn, icon active |
| `--color-court-dark` | `#066649` | Hover/active của nút chính |
| `--color-mint` | `#E8FFF3` | Nền khối phụ tươi sáng, nền ảnh sản phẩm, nền header phụ |
| `--color-mint-line` | `#B8F2D1` | Đường kẻ sân, viền thẻ, đường phân cách nhẹ |
| `--color-white` | `#FFFFFF` | Nền trang chính, nền thẻ |
| `--color-ink` | `#122B24` | Chữ chính |
| `--color-muted` | `#4A6B60` | Chữ phụ (đạt tương phản ≥ 4.5:1 trên nền sáng) |
| `--color-cork` | `#FFB938` | Điểm nhấn Sport Yellow: huy hiệu "Nổi bật", icon, ngôi sao |
| `--color-smash` | `#FF795B` | **Màu Coral Accent**: Giá tiền, nút mua hàng nổi bật, sale tag |
| `--color-sky` | `#E7F4FF` | Màu Light Sky Blue: Huy hiệu phụ, nền thẻ phụ |
| `--color-danger` | `#E03131` | Lỗi, xóa, hết hàng |
| `--color-success` | `#087F5B` | Thành công (cùng màu court) |

Quy tắc dùng màu: nền trang trắng hoặc mint; chỉ **một** nút chính (xanh court) trong một khối; màu cam chỉ dành cho giá và khuyến mãi; không dùng màu vàng làm chữ trên nền trắng (không đủ tương phản).

### 3.2 Chữ

| Vai trò | Font | Ghi chú |
|---|---|---|
| Tiêu đề lớn, tiêu đề mục, **giá tiền** | **Barlow Condensed** 600/700 | Hỗ trợ tiếng Việt; số rõ ràng như bảng điểm |
| Nội dung, nút, form, bảng | **Be Vietnam Pro** 400/500/700 | Thiết kế cho tiếng Việt, dấu không bị đè |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Be+Vietnam+Pro:wght@400;500;700&display=swap&subset=vietnamese" rel="stylesheet">
```

Fallback: `'Barlow Condensed', 'Arial Narrow', sans-serif` và `'Be Vietnam Pro', system-ui, sans-serif`. Luôn dùng `font-display: swap`.

Thang chữ (mobile → desktop): Hero `40→72px`, H1 `32→48px`, H2 `26→36px`, H3 `20→24px`, body `16px` (line-height 1.6), chú thích `14px`. Giá: `22–28px` (thẻ), `40px` (chi tiết). Độ dài dòng văn bản ≤ 70 ký tự. Dùng chữ thường theo câu, **không** viết HOA toàn bộ cho nhãn.

### 3.3 Khoảng cách, bo góc, đổ bóng

- Thang spacing: 4, 8, 12, 16, 24, 32, 48, 72, 96px.
- Bo góc theo cấp bậc: ảnh sản phẩm `12px`, thẻ `16px`, nút `10px`, ô nhập `10px`, huy hiệu `999px`. Không bo mọi thứ giống nhau.
- Đổ bóng gần như không dùng; thẻ phân tách bằng viền `1px solid var(--color-mint-line)`. Chỉ modal và dropdown có bóng nhẹ.
- Độ rộng nội dung tối đa `1200px`, căn giữa; lề ngang `16px` (mobile) → `32px` (desktop).

### 3.4 CSS variables (dán vào `src/styles/tokens.css`)

```css
:root {
  --color-court: #1F6B4A;
  --color-court-dark: #174F37;
  --color-mint: #EAF7EF;
  --color-mint-line: #BFE3CD;
  --color-white: #FFFFFF;
  --color-ink: #14302A;
  --color-muted: #55705F;
  --color-cork: #F2A93B;
  --color-smash: #C2410C;
  --color-danger: #B3261E;

  --font-display: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  --font-body: 'Be Vietnam Pro', system-ui, sans-serif;

  --radius-image: 12px;
  --radius-card: 16px;
  --radius-control: 10px;
  --radius-pill: 999px;

  --content-max: 1200px;
}
body { background: var(--color-white); color: var(--color-ink); font-family: var(--font-body); }
```

## 4. Họa tiết “đường kẻ sân”

- Dùng SVG nội tuyến (không tải ảnh ngoài): hình chữ nhật sân, đường giữa, đường giao cầu, đường biên đôi, nét `1.5px` màu `--color-mint-line` trên nền mint hoặc trắng.
- **Hero:** họa tiết sân chiếm nền phía sau, một góc cắt ra ngoài khung. Đường kẻ “vẽ” vào một lần khi tải trang (`stroke-dashoffset`, ~1.2s). Tôn trọng `prefers-reduced-motion` (không animation).
- **Nơi khác:** chỉ dùng như đường phân cách mảnh giữa các mục hoặc đường viền chân trang. Không lặp họa tiết sân ở mọi khối.

## 5. Bố cục các trang

Căn trái cho nội dung; căn giữa chỉ cho tiêu đề ngắn và trạng thái trống.

```text
HEADER  [logo]   Trang chủ   Sản phẩm   Về chúng tôi          [ô tìm kiếm] [giỏ (n)]

HOME
+---------------------------------------------------------------+
| Hero (nền sân bằng đường kẻ)                                  |
|  Tiêu đề lớn (Barlow Condensed)          [ảnh sản phẩm nổi]   |
|  1 câu mô tả                                                  |
|  [Mua sắm ngay]  (nút chính)                                  |
+---------------------------------------------------------------+
| Danh mục: Giày | Vợt | Quần | Áo | Balo | Phụ kiện  (chip)    |
| Sản phẩm nổi bật: lưới 4 cột (2 cột mobile)                   |
| Giới thiệu ngắn Q-Sport + link “Về chúng tôi”                 |
| Liên hệ: thông tin | Google Maps (iframe)                     |
+---------------------------------------------------------------+
FOOTER (logo, liên kết, © Q-Sport..., Đại diện, Email)

PRODUCTS
[Bộ lọc danh mục + sắp xếp + còn hàng] | Lưới thẻ sản phẩm | Xem thêm

PRODUCT DETAIL
[Ảnh lớn]            Tên sản phẩm
                     Giá (Barlow Condensed, cam)   Còn hàng / Hết hàng
                     Mô tả ngắn      [- 1 +]  [Thêm vào giỏ]
Mô tả chi tiết
Bình luận (danh sách đã duyệt) + form “Gửi bình luận”

ABOUT
Câu chuyện thương hiệu (cột chữ ≤ 70 ký tự) | ảnh
Tầm nhìn · Sứ mệnh · Giá trị (3 khối)
YouTube (iframe 16:9) | Google Maps (iframe) + “Địa chỉ minh họa cho đồ án”

CART / CHECKOUT
Cột trái: danh sách / form    Cột phải: tóm tắt đơn, tổng tiền, nút chính
(mobile: xếp dọc, nút chính cố định đáy màn hình ở checkout)
```

## 6. Component

**Nút:** chính (nền court, chữ trắng), phụ (viền court, nền trắng), nguy hiểm (viền/chữ danger). Cao tối thiểu 44px. Có trạng thái hover, focus (outline 2px court + offset 2px), disabled (giảm độ đậm, `cursor: not-allowed`), loading (chống bấm đúp).

**Thẻ sản phẩm:** ảnh vuông 1:1 trên nền mint (`object-fit: cover`), tên (tối đa 2 dòng), giá (Barlow Condensed, cam), huy hiệu “Hết hàng” (danger) hoặc “Nổi bật” (cork, chữ ink), nút “Thêm vào giỏ”. Toàn bộ thẻ là link tới trang chi tiết. Mọi thẻ cùng chiều cao.

**Form:** nhãn luôn hiển thị phía trên ô nhập; lỗi hiển thị ngay dưới ô, màu danger, nói rõ cách sửa (ví dụ “Số điện thoại cần 10 chữ số, bắt đầu bằng 0”).

**Bảng Admin:** tiêu đề cột đậm, dòng cách nhau bằng viền mảnh, thao tác ở cột cuối; trên mobile cuộn ngang bên trong khung.

**Toast:** góc dưới phải (mobile: dưới giữa), tự tắt sau 4 giây, có nút đóng; tên hành động nhất quán với nút (“Đã thêm vào giỏ”, “Đã lưu thay đổi”).

**Modal xác nhận:** dùng cho xóa/hủy; hủy đơn có ô nhập lý do bắt buộc.

**Iframe nhúng:** tỷ lệ 16:9 (YouTube) hoặc 4:3 (Maps), `title` mô tả, `loading="lazy"`, bo `--radius-card`.

## 7. Trạng thái và nội dung chữ

Mọi màn hình dữ liệu cần ba trạng thái: **đang tải** (khung xương/skeleton), **trống**, **lỗi**.

| Tình huống | Nội dung mẫu |
|---|---|
| Danh sách trống | “Chưa có sản phẩm nào trong mục này. Xem tất cả sản phẩm.” |
| Giỏ hàng trống | “Giỏ hàng đang trống. Chọn sản phẩm để bắt đầu.” + nút “Xem sản phẩm” |
| Lỗi tải | “Không tải được dữ liệu. Kiểm tra kết nối và thử lại.” + nút “Thử lại” |
| Đặt hàng thành công | “Đặt hàng thành công. Mã đơn của bạn là QS-XXXXXX.” |
| Bình luận gửi xong | “Đã gửi bình luận. Bình luận sẽ hiển thị sau khi được duyệt.” |

Quy tắc viết: tiếng Việt, câu ngắn, động từ rõ ràng, một hành động giữ một tên xuyên suốt. Tên nút chuẩn: **Mua sắm ngay**, **Thêm vào giỏ**, **Đặt hàng**, **Xác nhận đặt hàng**, **Gửi bình luận**, **Lưu thay đổi**, **Xóa**, **Hủy đơn**. Thông báo lỗi không xin lỗi chung chung, nói rõ chuyện gì xảy ra và cách xử lý. Không viết hoa toàn bộ nhãn.

## 8. Hình ảnh

- Ảnh sản phẩm và banner: miễn phí bản quyền (Unsplash, Pexels) hoặc tự tạo; không dùng ảnh, logo hay mô tả của các website tham khảo.
- Ảnh sản phẩm trên nền mint, tỷ lệ 1:1; ảnh hero tỷ lệ ~4:3, nén dưới 300KB, `loading="lazy"` (trừ ảnh hero).
- Luôn có `alt` mô tả; có ảnh placeholder khi lỗi.

## 9. Đáp ứng thiết bị và truy cập

- Mobile-first; breakpoint `640px`, `1024px`. Lưới sản phẩm: 2 cột (mobile) → 3 (tablet) → 4 (desktop).
- Menu mobile thu gọn thành nút; mục tiêu chạm ≥ 44×44px.
- Dùng thẻ ngữ nghĩa (`header`, `nav`, `main`, `footer`), nhãn cho form, thứ tự tab hợp lý, focus nhìn thấy rõ.
- Tương phản chữ/nền ≥ 4.5:1; không truyền đạt thông tin chỉ bằng màu (huy hiệu “Hết hàng” luôn có chữ).
- Chuyển động chỉ gồm: hero vẽ đường kẻ một lần, toast/modal xuất hiện khi người dùng thao tác. Không hiệu ứng trượt-lên cho từng mục.

## 10. Danh sách kiểm tra thiết kế

- [ ] Logo đúng file gốc ở header, footer, favicon
- [ ] Màu và font lấy từ token, không hard-code màu lạ
- [ ] Giá tiền luôn là Barlow Condensed màu `--color-smash`
- [ ] Hero có họa tiết sân; các trang khác dùng tiết chế
- [ ] Mọi trang có header, footer đúng nội dung bắt buộc
- [ ] Đủ ba trạng thái tải / trống / lỗi
- [ ] Xem tốt ở 375px, 768px, 1280px
