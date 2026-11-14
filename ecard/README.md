# Mia Quy Nhon — Festive eCards · Thiệp điện tử mùa lễ hội

Ứng dụng gửi thiệp Giáng Sinh & Năm Mới mang nhận diện Mia Quy Nhon | Fusion Collection.

- `index.html` — trang tạo thiệp: chọn chủ đề → tải ảnh → viết lời chúc → nhập email gửi.
- `card.html` — trang người nhận mở thiệp: phong bì có dấu sáp, chạm để mở, hiệu ứng động và nhạc.
- `backend/Code.gs` — máy chủ miễn phí trên Google Apps Script: lưu thiệp (Google Sheet), lưu ảnh (Google Drive) và gửi email.

## Mẫu thiệp: 2 dịp × 10 mẫu

Mỗi mẫu là một tổ hợp riêng gồm **bố cục** (6 kiểu: vòm Chăm, tràn viền, huy chương tròn, bưu thiếp, ảnh polaroid, tạp chí), **bảng màu** và **hoạ tiết minh hoạ**, kèm hiệu ứng động và nhạc.

| Giáng Sinh | Bố cục | Hiệu ứng | Nhạc |
|---|---|---|---|
| Giáng Sinh bên biển · Coastal Christmas | Vòm | Tuyết | Jingle Bells |
| Đêm thánh · Silent Night | Huy chương | Trời sao | Silent Night |
| Rừng thông tuyết · Snowy Pines | Tràn viền | Tuyết | We Wish You a Merry Christmas |
| Quả châu vàng · Golden Baubles | Tạp chí | Kim tuyến | Deck the Halls |
| Vòng hoa · Festive Wreath | Vòm | Bông tuyết | Jingle Bells (celesta) |
| Ánh nến · Candlelight | Bưu thiếp | Kim tuyến | Silent Night (harp) |
| Bông tuyết · Snowflake | Polaroid | Bông tuyết | We Wish You… (celesta) |
| Món quà · The Gift | Huy chương + vòng hoa | Tuyết | Deck the Halls |
| Chuông ngân · Ringing Bells | Tạp chí | Tuyết | Jingle Bells |
| Đêm Noël · Noël Night | Tràn viền | Tuyết | Silent Night |

| Năm Mới 2027 | Bố cục | Hiệu ứng | Nhạc |
|---|---|---|---|
| Pháo hoa trên biển · Fireworks by the Sea | Vòm | Pháo hoa | Auld Lang Syne |
| Xin chào 2027 · Hello 2027 | Tạp chí | Hoa giấy | Điệu valse giao thừa |
| Nâng ly · Cheers | Tràn viền | Kim tuyến | Auld Lang Syne (celesta) |
| Khoảnh khắc giao thừa · Midnight | Huy chương | Trời sao | Điệu valse giao thừa |
| Hoàng kim · Golden Deco | Tạp chí | Kim tuyến | Auld Lang Syne (harp) |
| Hoa giấy · Confetti | Polaroid | Hoa giấy | Điệu valse giao thừa (celesta) |
| Đèn trời · Sky Lanterns | Vòm | Đèn trời bay lên | Bình minh trên biển |
| Thuyền thúng · Basket Boats | Tràn viền | Pháo hoa | Bình minh trên biển (harp) |
| Bình minh đầu năm · First Sunrise | Bưu thiếp | Kim tuyến | Bình minh trên biển |
| Pháo bông · Sparklers | Huy chương | Kim tuyến | Auld Lang Syne |

Âm nhạc được tổng hợp trực tiếp trong trình duyệt (Web Audio) — không dùng file âm thanh. Các bài Giáng Sinh và Auld Lang Syne thuộc phạm vi công cộng; “Điệu valse giao thừa” và “Bình minh trên biển” là giai điệu tự sáng tác.

Thêm/sửa mẫu: `assets/js/themes.js` (danh sách `TEMPLATES`) và hoạ tiết trong `assets/js/motifs.js`. Khi thêm mẫu mới, cập nhật bảng `TEMPLATES` trong `backend/Code.gs` và tạo ảnh banner `assets/img/email-<id>.jpg`.

## Xem thử ngay (không cần cài đặt)

- Trang tạo thiệp: `/ecard/index.html` — nút **Xem trước hiệu ứng** mở thiệp đầy đủ hiệu ứng.
- Thiệp mẫu: `/ecard/card.html#demo-c-coastal` (thay bằng mã mẫu bất kỳ, ví dụ `n-lanterns`).
- Mở sẵn một mẫu: `/ecard/index.html?theme=n-2027`.

Khi chưa cấu hình máy chủ, trang vẫn chạy ở chế độ xem trước; nút **Gửi thiệp** sẽ hiển thị thông báo.

## Kích hoạt gửi email (khoảng 10 phút)

1. Đăng nhập tài khoản Google sẽ dùng để gửi thư (nên dùng tài khoản Google Workspace của khách sạn — hạn mức 1.500 email/ngày; tài khoản Gmail cá nhân chỉ 100/ngày).
2. Vào <https://script.google.com> → **New project** → dán toàn bộ nội dung `backend/Code.gs`.
3. Kiểm tra `CONFIG` ở đầu file — đặc biệt `ECARD_BASE_URL` phải là địa chỉ công khai của thư mục `ecard/` (mặc định: GitHub Pages của repo này). Có thể điền `BCC` để bộ phận Marketing nhận bản sao.
4. Chọn hàm `setup` → **Run** → cấp quyền. Hệ thống tự tạo Google Sheet “Mia Quy Nhon — Festive eCards” và thư mục Drive lưu ảnh.
5. (Tuỳ chọn) chạy `testSend` để nhận một email mẫu vào hộp thư của bạn.
6. **Deploy → New deployment → Web app** · *Execute as:* **Me** · *Who has access:* **Anyone** → **Deploy** → sao chép URL kết thúc bằng `/exec`.
7. Dán URL đó vào `assets/js/config.js` → `apiUrl: 'https://script.google.com/macros/s/…/exec'`, rồi commit.

Mỗi lần sửa `Code.gs`, cần **Deploy → Manage deployments → Edit → New version** để cập nhật.

## Vận hành & bảo mật

- Email được gửi với tên hiển thị “Mia Quy Nhon”; khi người nhận bấm *Trả lời*, thư sẽ về email của người gửi thiệp.
- Chống lạm dụng: tối đa 5 người nhận/lần, 15 thiệp/giờ cho mỗi email người gửi, 400 thiệp/ngày toàn hệ thống, trường ẩn chặn bot. Có thể điều chỉnh trong `CONFIG`.
- Ảnh được nén ngay trên trình duyệt (cạnh dài tối đa 1.400 px) trước khi tải lên, lưu riêng tư trong Drive — không chia sẻ công khai.
- Google Sheet ghi lại từng thiệp, số lượt mở (`views`) và thời điểm mở đầu tiên — hữu ích cho báo cáo chiến dịch.
- Đường dẫn thiệp dùng mã ngẫu nhiên (UUID), không thể đoán.
- Dữ liệu cá nhân (tên, email) chỉ dùng để gửi thiệp. Nếu muốn dùng cho marketing, cần bổ sung ô đồng ý riêng theo quy định bảo vệ dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP).

## Tuỳ chỉnh nhanh

- Lời chúc gợi ý, tiêu đề thiệp, bảng màu, bố cục: `assets/js/themes.js`; hoạ tiết minh hoạ: `assets/js/motifs.js`.
- Giai điệu: `assets/js/music.js` (ký hiệu nốt dạng `E5:1` = nốt Mi quãng 5, 1 phách).
- Màu sắc & bố cục: `assets/css/ecard.css` (bảng màu Cham Terracotta, Crescent Gold, Tidal Indigo…).
- Ảnh banner trong email khi khách không tải ảnh: `assets/img/email-<mã mẫu>.jpg`.

Phông chữ Playfair Display và Mulish được tải từ Google Fonts nên hiển thị đúng trên mọi thiết bị.
