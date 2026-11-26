# Hệ Thống Quản Trị Tuyển Sinh ITC — Phiên Bản v2.0 (Server Production Architecture)

Hệ thống quản trị tuyển sinh nội bộ cho **Phòng Tuyển Sinh — Trường Cao đẳng Công nghệ Thông tin TP.HCM (ITC)**, được xây dựng hoàn chỉnh theo chuẩn kỹ thuật và nghiệp vụ trong [Bao_cao_hoan_thien_web_tuyen_sinh_ITC.docx](Bao_cao_hoan_thien_web_tuyen_sinh_ITC.docx), đáp ứng đầy đủ toàn bộ hạng mục **P0 (`DEV01–DEV06`)**, **P1 (`DEV07–DEV11`)**, nền tảng **P2 (`DEV12`)** và vượt qua **16/16 kịch bản nghiệm thu** tự động.

---

## 1. Kiến Trúc & Đóng Gói 1 Tệp Duy Nhất (`server.js`)

- **Đóng gói 1 tệp mã nguồn duy nhất ([server.js](server.js))**: Gom trọn bộ **12 module Backend** (Node.js >= 22.5 + SQLite WAL/FULL + RBAC/Session + WebSocket xác thực + SLA/KPI + Import Engine + OOXML `.docx` + Excel `.xlsx` động + Backup/Restore) và **18 tài nguyên Frontend** (`index.html`, `app.css`, `app.js`, `api.js`, `sync.js`, `charts.js`, `utils.js` cùng 11 phân hệ nghiệp vụ) vào duy nhất tệp `server.js`.
- **Phục vụ giao diện trực tiếp từ RAM theo danh sách cho phép (`STATIC_ASSETS`)**: Không cần thư mục `public/` hay `src/` rời rạc, triệt tiêu hoàn toàn nguy cơ đọc nhầm tệp hệ thống (path traversal), không phụ thuộc CDN bên ngoài (chạy tốt trong mạng LAN không Internet) và vẫn giữ nguyên **Content-Security-Policy chặt** (`script-src 'self'`).
- **Cơ sở dữ liệu quan hệ có giao dịch (SQLite WAL + FULL Sync)**: Sử dụng `node:sqlite` tích hợp sẵn của Node.js (`PRAGMA journal_mode = WAL; PRAGMA synchronous = FULL; PRAGMA foreign_keys = ON`), đảm bảo **ghi bền commit trước khi gửi ACK/broadcast**.
- **Đồng bộ Realtime cấp bản ghi + Optimistic Locking + Outbox ngoại tuyến**:
  - Cập nhật theo ID & phiên bản (`version`, `field_versions_json`): sửa 2 trường độc lập tự gộp sạch, sửa trùng 1 trường trả về `HTTP 409 Conflict` hiển thị bảng chọn xử lý xung đột rõ ràng.
  - Mọi thao tác ghi kèm `X-Idempotency-Key` chống trùng khi mất mạng thử lại; client giữ hàng đợi Outbox riêng không bị ghi đè khi nhận cập nhật mới.
  - Tự động chuyển sang HTTP Polling Fallback khi WebSocket rớt kết nối và tự tắt polling ngay khi WebSocket nối lại.

---

## 2. Cấu Trúc Thư Mục Dự Án

```text
ServerTuyenSinh/
├── server.js                 # TỆP MÃ NGUỒN DUY NHẤT (Full-stack Backend + Frontend + --seed-demo)
├── package.json              # Khai báo 3 thư viện khóa phiên bản (ws, xlsx, jszip) & scripts
├── tests/
│   └── acceptance.test.js    # Bộ kiểm thử tự động 16/16 tình huống nghiệm thu (Mục 8)
├── data/                     # Tự sinh khi chạy: SQLite DB & thư mục backups/ có phiên bản
└── README.md                 # Tài liệu vận hành, phân quyền và sao lưu/khôi phục
```

---

## 3. Cài Đặt & Khởi Chạy

Yêu cầu: **Node.js >= 22.5** (đã kiểm chứng trên Node v24.15.0).

```bash
# 1. Cài đặt phụ thuộc
npm install

# 2. Chạy bộ kiểm thử nghiệm thu 16 tình huống
npm test

# 3. Khởi chạy máy chủ (mặc định cổng 3000, lắng nghe toàn mạng LAN 0.0.0.0)
npm start
```

Mở trình duyệt truy cập: `http://localhost:3000` (hoặc `http://<IP-LAN-may-chu>:3000`).

> **Khởi tạo dữ liệu sạch (Mục 9 báo cáo)**: Khi chạy `npm start` lần đầu, hệ thống chỉ tạo tài khoản quản trị/nhân sự, danh mục niên khóa `2027–2029` và kế hoạch KPI 2027 chính thức — **tuyệt đối không tự tạo hồ sơ thí sinh mẫu hay lấy state từ trình duyệt đầu tiên**. Nếu muốn nạp dữ liệu mẫu để tập huấn/kiểm thử riêng, chạy thủ công:
> ```bash
> npm run seed-demo
> ```

---

## 4. Tài Khoản Mặc Định & Phân Quyền RBAC

> **Quan trọng trước khi vận hành chính thức**: Hãy đổi ngay mật khẩu mặc định qua nút **Đổi MK** hoặc thiết lập biến môi trường `ITC_DEFAULT_ADMIN_PASSWORD`, `ITC_DEFAULT_STAFF_PASSWORD`, `ITC_DEFAULT_ADMIN_PIN` trước lần khởi tạo đầu tiên.

| Vai trò | Họ và tên | Email đăng nhập | Mật khẩu mặc định | Phạm vi mặc định (`scope`) |
| --- | --- | --- | --- | --- |
| **Super Admin** | Nguyễn Hữu Tài | `tai.nh@itc.edu.vn` | `ItcAdmin@2027!` | `all` (toàn phòng) |
| **Super Admin** | Phan Bích Lệ | `phanbichle28@gmail.com` | `ItcAdmin@2027!` | `all` (toàn phòng) |
| **Chuyên viên (Zalo 1)** | Tô Nhựt Điển | `dien.tn@itc.edu.vn` | `ItcStaff@2027!` | `own` (hồ sơ được giao) |
| **Chuyên viên (Zalo 2)** | Võ Văn Lâm | `lam.v@itc.edu.vn` | `ItcStaff@2027!` | `own` (hồ sơ được giao) |
| **Chuyên viên (Zalo 3)** | Nguyễn Thị Thùy Trâm | `tram.ntt@itc.edu.vn` | `ItcStaff@2027!` | `own` (hồ sơ được giao) |
| **Chuyên viên (Zalo 4)** | Võ Đặng Kim Trang | `trang.vdk@itc.edu.vn` | `ItcStaff@2027!` | `own` (hồ sơ được giao) |

- **Mã PIN xác thực tăng cường mặc định (cho thao tác Khôi phục hệ thống)**: `202700` (hoặc nhập lại mật khẩu Super Admin).
- **Chính sách bảo vệ tại máy chủ**:
  - Mọi API HTTP, Export Excel/Word, Backup/Restore và kết nối WebSocket đều xác thực phiên tại server.
  - Khóa tài khoản lập tức thu hồi toàn bộ phiên HTTP cũ và ngắt kết nối WebSocket đang mở (mã đóng `4001`).
  - Bảo vệ tối thiểu **01 Super Admin hoạt động** trong hệ thống, đồng thời vẫn cho phép khóa một tài khoản Admin khác nếu xảy ra sự cố lộ thông tin.

---

## 5. Mô Tả Chi Tiết 11 Phân Hệ Chức Năng

1. **0. Việc Hôm Nay (`today.js`)**: Bảng tác chiến mỗi ngày của nhân sự gồm lead mới chưa gọi, hồ sơ sắp/đang quá SLA, lịch hẹn gọi lại đến hạn, hồ sơ thiếu giấy tờ/chờ xác minh trạng thái và công việc đang mở.
2. **1. CRM Thí Sinh (`crm.js`)**:
   - Tìm kiếm, lọc đa tiêu chí (nhân sự, trạng thái liên hệ, giai đoạn, cờ nghi trùng), phân trang và giữ nguyên bộ lọc khi quay lại danh sách.
   - Ngăn **Chi tiết hồ sơ (Drawer)**: chỉnh sửa có kiểm soát xung đột, nhật ký cuộc gọi/Zalo/SMS, lịch hẹn gọi lại, danh mục giấy tờ còn thiếu, xác nhận mốc độc lập (`submitted` / `enrolled` / `withdrawn`) và bàn giao nhân sự (giữ lịch sử bàn giao & giữ nguyên thành tích mốc cũ).
   - Nhập **Excel** và **Dán nhanh 8 cột** dùng chung một schema chuẩn, có màn hình xem trước ánh xạ cột, đối chiếu trùng và ghi nhận mã đợt nhập (`import_batches`).
   - Hỗ trợ phân biệt SĐT thí sinh và SĐT phụ huynh, cho phép 2 anh/chị em dùng chung SĐT phụ huynh tồn tại như 2 hồ sơ riêng sau khi xác minh.
3. **2. Data Tuyến Tỉnh (`regional.js`)**: Quản lý 3 tuyến (Miền Tây, Miền Trung – Tây Nguyên, TP.HCM) với đầy đủ Trường THPT, Tỉnh/TP, Sự kiện, Nguồn, Ngày thu thập; tải mẫu & nhập lại Excel bảo toàn nguyên vẹn Trường/Tỉnh; chuyển hồ sơ sang CRM có đối chiếu chống trùng KPI.
4. **3. Bóc Tách Zalo (`zalo.js`)**: Tách nhiều ứng viên từ một đoạn chat Zalo hoặc văn bản OCR kèm ảnh đối chiếu; đưa vào vùng chờ xác minh; **không tự gán ngành CNTT** khi chưa rõ và không lấy nhầm đoạn chat làm tên nhân sự; đối chiếu trùng trước khi duyệt nhập CRM.
5. **4. Giám Sát SLA (`sla.js`)**:
   - Tách rõ **Tỷ lệ đã xử lý** và **Tỷ lệ đúng hạn SLA (&le;15 phút trong giờ trực hành chính)**.
   - Phân loại chuẩn 6 nhóm: `on_time`, `overdue_handled`, `overdue_unhandled`, `unassigned`, `after_hours_pending`, `insufficient_timestamp` (thiếu mốc thời gian không tự tính là đạt).
   - Đồng hồ hạn báo cáo Tuần (Thứ 7 `<09:30`) và báo cáo Tháng (trước ngày 25 — chốt 23:59 ngày 24) liên kết trực tiếp với trạng thái bản chốt báo cáo thực tế.
6. **5. Tiến Độ KPI (`kpi.js`)**:
   - Lọc tuyệt đối theo niên khóa (`2027`, `2028`, `2029`...) và chu kỳ 12 tháng tương ứng (`11/(Y-1)` đến `10/Y`).
   - Tính số phát sinh tháng theo đúng thời điểm sự kiện trong `milestone_events`; số lũy kế hồ sơ tính gồm nhập học và loại trừ rút hồ sơ; chuỗi phủ định (`Chưa nộp hồ sơ`, `Chưa nhập học`) không làm tăng số hoàn thành.
   - Đánh giá chậm tiến độ theo **tỷ lệ ngày đã trôi qua trong tháng** (khắc phục cảnh báo sai ngày đầu tháng).
   - Trình biên tập **Kế hoạch KPI 12 tháng có phiên bản**, kiểm tra tổng toàn phòng (mặc định 2027: `4.000 ĐK / 1.440 HS / 900 NH`).
7. **6. Việc BGH & Họp (`executive.js`)**: Quản lý thống nhất Việc BGH giao, Chỉ đạo điều hành và Lịch họp + Biên bản, đồng bộ tự động vào báo cáo.
8. **7. Giao Việc & Hỗ Trợ (`tasks.js`)**: Quản lý công việc nội bộ và hỗ trợ đơn vị ngoài phòng với người phụ trách chính, checklist đầu việc, trao đổi bình luận, minh chứng hoàn thành, lý do gia hạn và quy trình lãnh đạo nghiệm thu.
9. **8. Xuất Báo Cáo (`reports.js`)**:
   - Một truy vấn kỳ dùng chung (`startDate`, `endDate`, `cutoffAt`, `intakeYear`, checkbox hạng mục) cho Live Preview, Snapshot, Word và Excel.
   - Tách rõ **Phát sinh trong kỳ** và **Lũy kế đến thời điểm chốt**.
   - Hỗ trợ lưu bản nháp **Snapshot**, phê duyệt đóng băng số liệu và mở lại (có ghi lý do + audit log).
   - Xuất tệp **Word chuẩn OOXML (`.docx`)** thật giữ trọn tiếng Việt, bảng biểu và khối chữ ký; in/xuất **PDF** chuẩn A4; xuất **Excel động (`.xlsx`)** sinh đúng các sheet theo hạng mục đã chọn.
   - Thông báo Email/Zalo hiển thị **trung thực trạng thái** (`prepared` / `approved` / `queued`) — tuyệt đối không báo gửi thành công khi chưa cấu hình SMTP thật.
10. **9. Quản Trị & Server (`admin.js`)**: Quản trị tài khoản/RBAC/Scope, Danh mục nhân sự ID ổn định tách biệt Zalo Slot (thêm/đổi tên không mất dữ liệu), Mở/Khóa sổ niên khóa, Nhật ký Audit chỉ đọc từ server, Sao lưu có phiên bản/tải bản ngoài máy, Khôi phục có Dry-run + Checkpoint + Xác thực tăng cường, và bảng Sức khỏe Hệ thống (`/api/health`).
11. **10. Phân Tích Nguồn (`analytics.js`)**: Thống kê tỷ lệ chuyển đổi (Đăng ký → Nộp HS → Nhập học) theo Nguồn, Ngành, Trường THPT và Tỉnh/TP, đối soát khớp tổng toàn phòng.

---

## 6. Biến Môi Trường & Vận Hành

| Biến môi trường | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `PORT` | `3000` | Cổng HTTP/WebSocket |
| `HOST` | `0.0.0.0` | Địa chỉ lắng nghe (LAN) |
| `ITC_DATA_DIR` | `./data` | Thư mục lưu SQLite DB |
| `ITC_BACKUP_DIR` | `./data/backups` | Thư mục lưu bản sao lưu theo dấu thời gian |
| `ITC_SESSION_TTL_HOURS` | `12` | Thời hạn phiên đăng nhập (giờ) |
| `ITC_MAX_BODY_BYTES` | `5242880` | Giới hạn kích thước request (5 MB) |
| `ITC_ALLOWED_ORIGINS` | *(cùng host)* | Danh sách Origin bổ sung cho WebSocket (cách nhau dấu phẩy) |
| `ITC_BACKUP_RETENTION` | `30` | Số bản sao lưu gần nhất được giữ lại |
| `SMTP_HOST` | *(trống)* | Khai báo máy chủ SMTP khi tích hợp gửi thư thật |

### Quy trình Sao lưu & Khôi phục
- Hệ thống tự sao lưu có phiên bản mỗi 6 giờ (kể cả khi không ai mở trình duyệt) và cho phép tạo thủ công bất cứ lúc nào trong **Mục 9 → Sao lưu & Khôi phục**.
- Định kỳ tải bản sao lưu ngoài máy chủ (nút **Tải bản ngoài máy**) lưu sang ổ NAS/Cloud nội bộ trường.
- Khi cần khôi phục: chạy bước **1. Kiểm thử toàn vẹn & Tác động (Dry-run)** để xác minh `schemaVersion`, `checksumSha256` và khóa ngoại trước khi xác nhận khôi phục bằng mật khẩu/PIN Super Admin. Hệ thống tự tạo checkpoint `pre_restore` trước khi ghi đè nguyên tử.

---

## 7. Kết Quả Kiểm Thử Nghiệm Thu Tự Động (`npm test`)

Toàn bộ **16/16 tình huống nghiệm thu** tại Mục 8 của báo cáo đánh giá đều được tự động hóa và kiểm chứng đạt **100%** trong [tests/acceptance.test.js](tests/acceptance.test.js):

1. Quyền truy cập HTTP/WS 401, RBAC 403, khóa tài khoản ngắt HTTP & WebSocket (code `4001`) tức thì, bảo vệ Super Admin cuối cùng.
2. Phạm vi hồ sơ (`own`/`all`) chặn truy cập chéo 403 trên API, lọc đúng Export Excel và lọc luồng WebSocket, thực thi `can_export`.
3. Escape HTML chống XSS, từ chối enum/kiểu dữ liệu sai (`400`) và payload vượt dung lượng (`413`) không làm hỏng dữ liệu.
4. Phân tách chuẩn tháng (`50` T11 vs `2` T12) và đa niên khóa (`2027` vs `2028`), kế hoạch 2027 khớp `4.000 / 1.440 / 900`.
5. Trạng thái phủ định (`Chưa nộp hồ sơ`, `Chưa nhập học`, `Rút hồ sơ`) không làm tăng số hoàn thành; trạng thái lạ vào `pending_verify`.
6. Mốc tuyển sinh độc lập (ĐK T11, Nộp T12, Nhập học T08) đếm đúng từng tháng và giữ đầy đủ lịch sử.
7. Đủ 6 phân loại SLA (`on_time`, `overdue_handled`, `overdue_unhandled`, `unassigned`, `after_hours_pending`, `insufficient_timestamp`) & hạn báo cáo tháng trước ngày 25.
8. Chống trùng Excel + Zalo không đếm KPI 2 lần; 2 anh/chị em dùng chung SĐT phụ huynh tồn tại riêng biệt.
9. Vòng tải mẫu tuyến tỉnh & nhập lại bảo toàn Trường/Tỉnh; dán nhanh 8 cột CRM khớp từng cột; Zalo 2 người tạo 2 dòng xem trước, không tự đổi ngành Kế toán sang CNTT.
10. Sửa đồng thời khác trường tự gộp, cùng trường trả `409 Conflict`; xóa hồ sơ A từ bản cũ không xóa hồ sơ B mới thêm.
11. Chống lặp thao tác khi mất mạng thử lại bằng `X-Idempotency-Key` & bảo toàn Outbox.
12. Giả lập lỗi ghi đĩa trả `HTTP 500` (không báo lưu thành công giả); khôi phục có kiểm tra PIN, Dry-run và checkpoint.
13. Báo cáo lọc chuẩn kỳ (loại ngoài kỳ, tách lũy kế) và Snapshot đã duyệt giữ nguyên số liệu bất biến.
14. Tệp `.docx` chuẩn OOXML ZIP tiếng Việt có bảng & khối ký; Excel sinh động theo checkbox; thông báo Email trung thực trạng thái `prepared`.
15. Thêm nhân sự mới phân công & vào KPI ngay; đổi tên giữ nguyên liên kết ID; bàn giao giữ lịch sử & thành tích mốc cũ.
16. Vận hành đa tab WebSocket (presence chống đếm trùng tab), đo độ trễ commit+WS thực tế, CSP chặn inline script & dữ liệu bền vững qua khởi động lại máy chủ.
