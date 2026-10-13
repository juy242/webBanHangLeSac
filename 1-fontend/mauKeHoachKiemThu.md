# KẾ HOẠCH KIỂM THỬ PHẦN MỀM LESAC

**Định dạng:** IEEE 829  
**Mã tài liệu:** `LESAC-TP-SYS-001`  
**Phiên bản:** 1.0  
**Cấp độ:** Kiểm thử hệ thống và chấp nhận người dùng (System/UAT)  
**Ngày lập:** 26/09/2026  
**Trạng thái:** Dự thảo phục vụ môn Kiểm thử phần mềm

## 1. Mã định danh kế hoạch kiểm thử

| Thuộc tính | Giá trị |
|---|---|
| Sản phẩm | Website thương mại điện tử LESAC |
| Phiên bản phần mềm | 1.0 - frontend tích hợp backend JSON |
| Cấp độ | System test, integration test và UAT |
| Người lập | Nhóm kiểm thử sinh viên |
| Phiên bản tài liệu | 1.0 |

Kế hoạch áp dụng cho phiên bản hiện có trong workspace. Mọi thay đổi về chức năng, API, dữ liệu hoặc môi trường phải được ghi nhận, đánh giá impact và chạy lại regression liên quan.

## 2. Tài liệu tham chiếu

| Tài liệu | Ghi chú |
|---|---|
| [SYSTEM_FEATURES.md](SYSTEM_FEATURES.md) | Đặc tả chức năng và mapping frontend/backend |
| [2-backend/README.md](../2-backend/README.md) | Cài đặt, API, tài khoản demo và kiến trúc backend |
| [2-backend/package.json](../2-backend/package.json) | Node.js/Express và script chạy |
| [TEST_CASES_ENVIRONMENT.md](TEST_CASES_ENVIRONMENT.md) | Kiểm tra môi trường |
| [TEST_CASES_CUSTOMER.md](TEST_CASES_CUSTOMER.md) | Trang khách hàng |
| [TEST_CASES_AUTH.md](TEST_CASES_AUTH.md) | Đăng ký/đăng nhập |
| [TEST_CASES_ORDER.md](TEST_CASES_ORDER.md) | Đặt hàng |
| [TEST_CASES_ADMIN.md](TEST_CASES_ADMIN.md) | Trang admin |
| [TEST_CASES_SECURITY.md](TEST_CASES_SECURITY.md) | Phân quyền và bảo mật |
| [TEST_CASES_ERROR_DATA.md](TEST_CASES_ERROR_DATA.md) | Lỗi và dữ liệu |
| IEEE 829 | Khung nội dung kế hoạch kiểm thử |

**Lưu ý:** `SYSTEM_FEATURES.md` có phần mô tả localStorage cũ. Khi tài liệu khác code hiện tại, kế hoạch này ưu tiên hành vi thực tế của `server.js`, các route trong `2-backend/routes/` và giao diện đang chạy.

## 3. Giới thiệu

LESAC là website bán túi xách và ví thời trang, gồm trang khách hàng, trang quản trị và backend API. Backend dùng Node.js/Express, phục vụ frontend và lưu dữ liệu bằng file JSON trong `2-backend/data/`.

Mục đích kế hoạch là xác định phạm vi, rủi ro, phương pháp, môi trường, trách nhiệm và tiêu chí đánh giá phiên bản hiện tại trước khi trình bày/nghiệm thu.

### Phạm vi

- Khách xem sản phẩm, tìm kiếm, lọc, thêm giỏ hàng và đặt hàng.
- Đăng ký, đăng nhập, đăng xuất và lịch sử đơn hàng.
- Admin quản lý dashboard, sản phẩm, tồn kho, danh mục, bộ sưu tập, đơn hàng, liên hệ và người dùng.
- API, lưu trữ JSON, phân quyền, dữ liệu biên và xử lý lỗi.
- Giao diện desktop/mobile ở mức kiểm thử thủ công.

### Ràng buộc

- Đây là dự án học tập, không có hạ tầng kiểm thử production.
- Dữ liệu dùng JSON file, chưa có database transaction.
- Token tự xây dựng, chưa phải JWT chuẩn.
- CDN, Google Fonts, Font Awesome và VietQR phụ thuộc mạng ngoài.
- Chưa đặt mục tiêu code coverage tự động.

Mọi thay đổi phải được ghi vào nhật ký nhóm, cập nhật test case, chạy smoke test và regression các luồng rủi ro cao.

## 4. Đối tượng kiểm thử (Test Items)

| Mã | Đối tượng | Thành phần |
|---|---|---|
| TI-01 | Trang khách | `index.html`, `js/shop.js`, `js/storage.js`, `assets/` |
| TI-02 | Trang admin | `admin.html`, `js/admin.js` |
| TI-03 | Xác thực | `routes/auth.js`, `lib/auth.js`, modal auth |
| TI-04 | Sản phẩm | `routes/products.js`, danh sách/chi tiết |
| TI-05 | Giỏ hàng | `routes/cart.js`, cart drawer |
| TI-06 | Đặt hàng | `routes/orders.js`, checkout, COD/QR |
| TI-07 | Danh mục/BST | `routes/categories.js`, `routes/collections.js`, CRUD admin |
| TI-08 | Liên hệ | `routes/contact.js`, form và admin list |
| TI-09 | Admin API | `routes/admin.js`, CRUD, tồn kho, đơn, users |
| TI-10 | Lưu trữ | `lib/store.js`, `2-backend/data/*.json` |
| TI-11 | Máy chủ | `server.js`, port 4000, 404/error handler |

Yêu cầu bàn giao: có `server.js`, `package.json`, frontend, routes, lib và data; chạy được `npm install`, `npm start`, health check Pass.

## 5. Vấn đề rủi ro phần mềm

| Rủi ro | Mức độ | Ảnh hưởng | Biện pháp kiểm thử |
|---|---|---|---|
| Trừ sai tồn kho/bán vượt tồn | Cao | Sai dữ liệu kinh doanh | Test theo màu, trùng dòng, vượt tồn, hủy đơn |
| Bypass quyền admin | Cao | Lộ/sửa dữ liệu | Test token, role, API trực tiếp, URL admin |
| JSON hỏng/ghi đồng thời | Cao | Mất dữ liệu/server lỗi | Backup, test file hỏng, request song song, restart |
| Sai tổng tiền/doanh thu/lợi nhuận | Cao | Sai thanh toán/báo cáo | Đối chiếu UI, API và JSON |
| Token/secret mặc định | Cao | Nguy cơ giả mạo phiên | Test chữ ký/expiry, ghi nhận giới hạn production |
| XSS từ dữ liệu nhập | Cao | Rủi ro bảo mật | Test tên, mô tả, ghi chú, liên hệ |
| CDN/VietQR mất mạng | Trung bình | Giao diện/QR không tải | Test offline và fallback |
| Tài liệu cũ khác code | Trung bình | Viết test sai baseline | Ưu tiên behavior thực tế, ghi discrepancy |
| Mã đơn ngẫu nhiên trùng | Trung bình | Nhầm đơn | Tạo nhiều đơn và kiểm tra uniqueness |

## 6. Các tính năng sẽ kiểm thử

| Mã | Tính năng dưới góc nhìn người dùng | Rủi ro |
|---|---|---|
| F-01 | Mở trang, menu, banner, danh sách sản phẩm | Trung bình |
| F-02 | Xem chi tiết, chọn màu và số lượng | Cao |
| F-03 | Tìm kiếm, lọc và sắp xếp | Trung bình |
| F-04 | Thêm/sửa/xóa/lưu giỏ hàng | Cao |
| F-05 | Đăng ký, đăng nhập, đăng xuất, giữ phiên | Cao |
| F-06 | Nhập người nhận và địa chỉ 3 cấp | Cao |
| F-07 | Đặt COD và QR | Cao |
| F-08 | Xem lịch sử đơn hàng | Cao |
| F-09 | Gửi liên hệ | Trung bình |
| F-10 | Admin xem dashboard | Cao |
| F-11 | Admin CRUD sản phẩm | Cao |
| F-12 | Admin cập nhật tồn theo màu | Cao |
| F-13 | Admin quản lý danh mục/BST | Trung bình |
| F-14 | Admin cập nhật/hủy/xóa đơn | Cao |
| F-15 | Admin quản lý liên hệ/người dùng | Cao |
| F-16 | Từ chối truy cập trái phép | Cao |
| F-17 | Lỗi, dữ liệu biên, mất mạng, restart | Cao |
| F-18 | Responsive desktop/mobile | Trung bình |

## 7. Các tính năng không kiểm thử

| Phạm vi loại trừ | Lý do |
|---|---|
| Giao dịch ngân hàng thật | QR chỉ tạo hình ảnh VietQR, chưa có cổng payment |
| Gửi email thật | Chưa tích hợp SMTP/email provider |
| Vận chuyển, mã giảm giá, hoàn tiền | Không có trong phiên bản hiện tại |
| Load/stress production | JSON file và hạ tầng local không phù hợp benchmark |
| Penetration test chuyên sâu | Chỉ kiểm tra thủ công rủi ro phổ biến |
| Native mobile app | Sản phẩm là website responsive |
| Toàn bộ trình duyệt cũ | Chỉ kiểm tra Chrome/Edge hiện hành |
| Automated unit test/code coverage | Chưa có test runner/instrumentation |

Các mục trên nằm ngoài phạm vi và không được hiểu là đã được chứng minh sẵn sàng production.

## 8. Phương pháp tiếp cận (Approach/Strategy)

1. Kiểm tra môi trường và smoke test trước mỗi phiên chạy.
2. Risk-based testing, ưu tiên auth, đặt hàng, tồn kho và phân quyền.
3. Black-box testing theo equivalence partitioning và boundary value cho form, giá, số lượng, email, điện thoại.
4. Integration testing frontend - API - JSON bằng giao diện và DevTools Network.
5. Negative/error testing cho token sai, API sai, mất mạng, JSON hỏng và restart.
6. Sau thay đổi, chạy smoke test và regression các case liên quan.

**Công cụ:** VS Code, Chrome/Edge DevTools, PowerShell, trình soạn thảo JSON; Postman hoặc công cụ HTTP tương đương là tùy chọn.

**Cấu hình:** Windows, Node.js/npm tương thích `package.json`, Chrome/Edge desktop và viewport 375px/768px; backend tại `http://localhost:4000`.

**Metrics:** tổng test, Pass/Fail/Blocked, tỷ lệ thực thi/Pass, lỗi theo severity, lỗi mở/đóng/tái mở, thời gian chạy và nguyên nhân blocked.

**Quản lý cấu hình:** ghi phiên bản kế hoạch/test case, commit hoặc trạng thái workspace, Node/npm, trình duyệt và seed data; backup `2-backend/data/` trước test destructive. Khi tài liệu/code khác nhau, ghi discrepancy và dùng behavior thực tế làm baseline.

## 9. Tiêu chí đạt/không đạt

### Đạt

- 100% smoke test Pass.
- 100% test rủi ro Cao được thực thi.
- Không còn lỗi Critical/High mở.
- Test còn lại đạt tối thiểu 95% Pass hoặc có giải thích được duyệt.
- Không có lỗi làm server không khởi động, mất dữ liệu, vượt tồn, sai tổng tiền hoặc bypass admin.
- Dữ liệu nhất quán sau thao tác và restart.

### Không đạt

- Còn lỗi Critical/High chưa có biện pháp giảm thiểu.
- Customer truy cập/thao tác API admin.
- Đơn tạo sai/trùng, trừ sai tồn, tổng tiền sai.
- JSON bị hỏng/mất dữ liệu do thao tác bình thường.
- Không chạy được smoke test do môi trường/dependency.

**Defect** là khiếm khuyết trong code/thiết kế/dữ liệu; **failure** là biểu hiện sai quan sát được khi chạy. Báo cáo cần có cả bước tái hiện và bằng chứng.

## 10. Tiêu chí tạm dừng và khôi phục

### Tạm dừng

- Backend không khởi động hoặc `/api/health` không hoạt động.
- Thiếu dependency/data/tài khoản khiến trên 30% test không thể chạy.
- Có lỗi làm mất/hỏng JSON chưa phục hồi được backup.
- Có lỗi Critical khiến test tiếp theo làm sai dữ liệu.
- Build/code thay đổi giữa phiên mà chưa có baseline.

### Khôi phục

- Khởi động lại backend và xác nhận health check Pass.
- Cài lại dependency hoặc phục hồi data backup.
- Tạo lại tài khoản/dữ liệu test.
- Developer cung cấp bản sửa và phạm vi thay đổi.
- Chạy smoke, test case bị ảnh hưởng và regression liên quan.

## 11. Sản phẩm bàn giao kiểm thử

- Kế hoạch này: `LESAC-TP-SYS-001`.
- Bộ test case môi trường, khách hàng, auth, đặt hàng, admin, bảo mật và lỗi/dữ liệu.
- Ma trận truy xuất chức năng - test case - kết quả.
- Nhật ký chạy test có ngày, người chạy, môi trường và trạng thái.
- Báo cáo lỗi có ID, severity, bước tái hiện, expected/actual, bằng chứng và trạng thái.
- Báo cáo tổng kết và khuyến nghị go/no-go.
- Log terminal, ảnh DevTools, request/response và backup data khi cần.

Code frontend/backend là đối tượng được kiểm thử, không phải deliverable của hoạt động kiểm thử.

## 12. Nhiệm vụ kiểm thử còn lại

- Chưa load/stress test production.
- Chưa xác minh thanh toán ngân hàng thật, email thật và vận chuyển.
- Chưa có automated unit/integration test và code coverage.
- Chưa penetration test chuyên sâu/audit bảo mật độc lập.
- Chưa xác nhận đầy đủ Safari, Firefox và thiết bị thật iOS/Android.
- Cần xem lại điểm khác nhau giữa `SYSTEM_FEATURES.md` và backend khi có release mới.

## 13. Yêu cầu môi trường kiểm thử

**Phần cứng:** máy Windows tối thiểu 4 GB RAM, kết nối mạng; thiết bị thật là tùy chọn.

**Phần mềm:** Node.js/npm, Chrome hoặc Edge hiện hành, VS Code, PowerShell và Express dependency.

**Dữ liệu:** sản phẩm nhiều màu/còn hàng/sắp hết/hết hàng, admin, hai customer test, đơn ở nhiều trạng thái và backup data.

**Cấu hình chạy:**

```powershell
cd d:\lesac\2-backend
npm install
npm start
```

URL: `http://localhost:4000/api/health`, `http://localhost:4000/index.html`, `http://localhost:4000/admin.html`.

## 14. Nhân sự và đào tạo

| Vai trò | Trách nhiệm/đào tạo |
|---|---|
| Test lead | IEEE 829, phạm vi, rủi ro, tiến độ và báo cáo |
| Manual tester | Test case, boundary/negative testing, DevTools, bug report |
| Developer | Express, JavaScript, route, auth, JSON store và phân tích lỗi |
| Người đánh giá | Xem xét kế hoạch và kết quả |

Trước khi test, nhóm cần được hướng dẫn chạy Node/npm, khởi động server, dùng DevTools, đọc JSON, gọi API và phân loại severity/priority.

## 15. Trách nhiệm


## 16. Lịch trình

Dùng ngày tương đối tính từ khi có build ổn định (T0).

| Mốc | Thời gian | Kết quả |
|---|---|---|
| Phân tích và chuẩn bị tài liệu | T0 đến T0+1 | Kế hoạch, risk list, data |
| Chuẩn bị môi trường | T0+1 đến T0+2 | Node/npm, server, seed Pass |
| Smoke test | T0+2 | Build có thể test |
| Khách hàng/auth/đặt hàng | T0+3 đến T0+5 | Kết quả chức năng chính |
| Admin/phân quyền/bảo mật | T0+6 đến T0+7 | Kết quả quản trị/security |
| Lỗi/dữ liệu/responsive | T0+8 | Kết quả negative/recovery |
| Regression | T0+9 đến T0+10 | Verify bản sửa |
| Tổng kết/go-no-go | T0+11 | Báo cáo cuối |

Nếu trễ, giữ smoke và các luồng rủi ro Cao; giảm exploratory hoặc trình duyệt phụ trước khi giảm phạm vi chính.

## 17. Rủi ro kế hoạch và phương án dự phòng

| Rủi ro kế hoạch | Phương án |
|---|---|
| Không nhận diện Node/npm | Kiểm tra PATH, dùng `npm.cmd`, đổi máy nếu cần |
| Trễ bản sửa | Test baseline cũ, cập nhật lịch tương đối |
| Thiếu tester | Ưu tiên rủi ro Cao, chia nhóm frontend/backend/admin |
| Data hỏng | Dừng destructive test, phục hồi backup |
| CDN/VietQR mất mạng | Kiểm thử fallback và ghi nhận giới hạn |
| Đổi yêu cầu muộn | Change request, impact analysis, cập nhật scope/test |
| Thiếu công cụ API | Dùng DevTools hoặc PowerShell |
| Lỗi nghiêm trọng chưa sửa | Dừng luồng phụ thuộc, escalation |
| JSON không hỗ trợ đồng thời | Giảm concurrency, ghi rõ giới hạn và đề xuất database/transaction |

## 18. Phê duyệt



Phê duyệt xác nhận phạm vi và tiêu chí của kế hoạch, không xác nhận các tính năng ngoài phạm vi đã sẵn sàng production.

## 19. Thuật ngữ

| Thuật ngữ | Định nghĩa |
|---|---|
| API | Giao diện để frontend giao tiếp với backend |
| Backend | Node.js/Express xử lý API, auth và lưu dữ liệu |
| Frontend | HTML/CSS/JavaScript cho khách và admin |
| JSON store | Lưu dữ liệu bằng file JSON thay vì database |
| Test case | Kịch bản có điều kiện, bước và kết quả mong đợi |
| Smoke test | Kiểm tra nhanh chức năng cốt lõi của build |
| Regression | Chạy lại chức năng sau thay đổi |
| Defect | Khiếm khuyết trong code, thiết kế hoặc dữ liệu |
| Failure | Hành vi sai quan sát được khi chạy |
| Severity | Mức độ ảnh hưởng: Critical/High/Medium/Low |
| Priority | Mức độ ưu tiên xử lý lỗi |
| UAT | Kiểm thử chấp nhận người dùng |
| CRUD | Create, Read, Update, Delete |
| RBAC | Phân quyền theo vai trò |
| Token | Chuỗi xác thực gửi trong header Bearer |
| Baseline | Phiên bản/cấu hình làm mốc so sánh |
| Go/No-go | Quyết định chuyển hoặc không chuyển giai đoạn |
| Blocked | Test chưa chạy được vì thiếu điều kiện |