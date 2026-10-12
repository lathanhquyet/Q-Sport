# HƯỚNG DẪN CẤU HÌNH THÔNG BÁO ĐƠN HÀNG Q-SPORT QUA TELEGRAM BOT

Tài liệu này hướng dẫn quản trị viên thiết lập hệ thống tự động gửi thông báo khi có đơn hàng mới từ website Q-Sport về tài khoản cá nhân hoặc nhóm Telegram quản trị.

---

## 1. TỔNG QUAN KIẾN TRÚC BẢO MẬT

- **Cơ chế server-side**: Thông báo được gửi thông qua **Cloudflare Pages Functions** (`/api/telegram-alert`), chạy độc lập trên serverless edge của Cloudflare.
- **Bảo mật tuyệt đối**: `TELEGRAM_BOT_TOKEN` và `TELEGRAM_CHAT_ID` là các biến môi trường bí mật (Secrets) lưu trên Cloudflare Dashboard. Chúng **không bao giờ** được gửi xuống trình duyệt, không xuất hiện trong mã nguồn JavaScript hay file `.env` commit lên GitHub.
- **Fail-safe**: Trong trường hợp Telegram gặp sự cố mạng hoặc chậm trễ, đơn hàng của khách hàng vẫn được tạo thành công 100%, không bao giờ bị lỗi hay rollback.

---

## 2. CÁC BƯỚC THIẾT LẬP

### BƯỚC A — TẠO TELEGRAM BOT & LẤY BOT TOKEN
1. Mở ứng dụng Telegram trên điện thoại hoặc máy tính.
2. Tìm kiếm tài khoản chính thức: `@BotFather` (có tích xanh xác thực).
3. Gửi lệnh: `/start` rồi gửi tiếp `/newbot`.
4. Nhập tên hiển thị cho Bot (ví dụ: `Q-Sport Order Alert Bot`).
5. Nhập username cho Bot (phải kết thúc bằng chữ `bot`, ví dụ: `qsport_order_alert_bot`).
6. BotFather sẽ trả về thông điệp thành công kèm **HTTP API Token** (dạng chuỗi ký tự như: `7123456789:AAFnXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`).
7. **Lưu ý**: Đây chính là `TELEGRAM_BOT_TOKEN`. Hãy giữ bí mật token này.

---

### BƯỚC B — LẤY TELEGRAM CHAT ID

#### Cách 1: Nhận thông báo về tài khoản cá nhân
1. Tìm bot bạn vừa tạo trên Telegram và bấm **Start** (hoặc gửi `/start`).
2. Mở trình duyệt và truy cập đường link sau (thay `<BOT_TOKEN>` bằng Token ở Bước A):
   ```
   https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
   ```
3. Tìm đoạn `"chat":{"id":123456789,...}` trong chuỗi JSON trả về.
4. Con số đó chính là `TELEGRAM_CHAT_ID` của bạn (ví dụ: `123456789`).

#### Cách 2: Nhận thông báo vào Nhóm Telegram Quản trị (Admin Group)
1. Tạo một nhóm mới trên Telegram (hoặc dùng nhóm hiện có).
2. Thêm bot vừa tạo vào nhóm với tư cách thành viên (hoặc Administrator).
3. Gửi một tin nhắn bất kỳ vào nhóm (ví dụ: `Xin chào bot`).
4. Truy cập URL:
   ```
   https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
   ```
5. Tìm đoạn `"chat":{"id":-100xxxxxxxxxx,...}`.
6. Chat ID của nhóm Telegram thường bắt đầu bằng dấu trừ `-` hoặc `-100` (ví dụ: `-1001234567890`).

---

### BƯỚC C — CẤU HÌNH SERVER-SIDE SECRETS TRÊN CLOUDFLARE PAGES

1. Đăng nhập vào trang quản trị: [https://dash.cloudflare.com/](https://dash.cloudflare.com/)
2. Chọn **Workers & Pages** > chọn project **q-sport**.
3. Vào tab **Settings** > chọn mục **Environment variables**.
4. Tại mục **Production** (và **Preview** nếu muốn thử nghiệm trước):
   - Bấm **Add variable**.
   - Biến 1:
     - Variable name: `TELEGRAM_BOT_TOKEN`
     - Value: `<Dán Token nhận từ BotFather>`
     - Chọn kiểu **Encrypt** (Secret).
   - Biến 2:
     - Variable name: `TELEGRAM_CHAT_ID`
     - Value: `<Dán Chat ID lấy ở Bước B>`
     - Chọn kiểu **Encrypt** (Secret).
5. Bấm **Save** để lưu lại cấu hình.

---

### BƯỚC D — REDEPLOY & KIỂM THỬ ĐƠN HÀNG

1. Vào tab **Deployments** trên Cloudflare Pages > chọn bản build mới nhất > bấm **Retry deployment** (hoặc push một commit mới lên nhánh `main` để Cloudflare Pages tự động build lại).
2. Mở website [https://q-sport.pages.dev/](https://q-sport.pages.dev/).
3. Chọn sản phẩm bất kỳ bằng tính năng **Quick Add** hoặc mở trang chi tiết sản phẩm và thêm vào giỏ.
4. Vào trang Checkout, nhập thông tin nhận hàng và bấm **Xác nhận đặt hàng**.
5. Kiểm tra ứng dụng Telegram: Bot sẽ gửi ngay lập tức thông báo với định dạng:

```html
🛒 THÔNG BÁO ĐƠN HÀNG MỚI

Người mua hàng: Nguyễn Văn A
Số điện thoại: 0987654321
Mã đơn hàng: QS-XXXXXX

Danh sách sản phẩm:
• Vợt Cầu Lông Q-Sport Pro Attack 100 — 1 × 1.450.000 đ

Tổng thành tiền: 1.450.000 đ

Địa chỉ gửi hàng:
123 Nguyễn Trãi, Phường 2, Quận 5, TP. Hồ Chí Minh

Ghi chú: Giao giờ hành chính
Phương thức thanh toán: Thanh toán COD
```

---

## 3. KHẮC PHỤC SỰ CỐ THƯỜNG GẶP

| Hiện tượng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Không nhận được thông báo | Chưa bấm `Start` bot | Mở chat riêng với bot và bấm nút **Start** |
| Bot không gửi vào nhóm | Bot chưa có quyền gửi tin | Kiểm tra quyền của bot trong Group Telegram |
| Sai Chat ID | Chat ID thiếu dấu `-` hoặc `-100` | Kiểm tra lại JSON từ `getUpdates` để copy đúng số âm |
| Đơn hàng vẫn tạo nhưng không có tin nhắn | Token chưa được cấu hình hoặc sai tên biến | Kiểm tra biến `TELEGRAM_BOT_TOKEN` và `TELEGRAM_CHAT_ID` trên Cloudflare Pages |
