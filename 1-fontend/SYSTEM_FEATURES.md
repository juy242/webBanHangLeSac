# LESAC - Tài liệu đặc tả chức năng hệ thống

> Tài liệu này mô tả toàn bộ chức năng hiện có của website **LESAC (Túi Xách & Ví Premium)** - một bài tập web tĩnh, dùng `localStorage` làm nơi lưu trữ. Mục đích: làm cơ sở để triển khai **Backend** sau này.

---

## 1. Tổng quan kiến trúc

| Thành phần | Công nghệ |
|---|---|
| Frontend | HTML, Tailwind CSS (CDN v4), Font Awesome, Montserrat |
| Ngôn ngữ | JavaScript thuần (không framework) |
| Lưu trữ hiện tại | `localStorage` (từng trình duyệt, dữ liệu không dùng chung) |
| Trang | `index.html` (trang khách), `admin.html` (trang quản trị) |
| File JS | `data.js`, `storage.js`, `shop.js`, `admin.js` |

### 1.1 Các khóa lưu trong localStorage (`storage.js`)

| Khóa | Nội dung | Mô tả |
|---|---|---|
| `LESAC_PRODUCTS` | mảng sản phẩm | Dữ liệu sản phẩm (gồm tồn kho theo màu) |
| `LESAC_CATEGORIES` | mảng danh mục | Danh mục sản phẩm |
| `LESAC_COLLECTIONS` | mảng bộ sưu tập | BST (bộ sưu tập) |
| `LESAC_CART` | mảng giỏ hàng | Giỏ hàng của khách (trên trình duyệt) |
| `LESAC_ORDERS` | mảng đơn hàng | Đơn hàng đã đặt |
| `LESAC_ACCOUNTS` | mảng tài khoản khách | Tài khoản đăng ký (khách hàng) |
| `LESAC_USER_SESSION` | đối tượng session | Phiên đăng nhập hiện tại |

> Ghi chú triển khai BE: các mục trên tương ứng với bảng CSDL: `products`, `categories`, `collections`, `cart_items`, `orders`, `order_items`, `accounts`, `sessions`.

---

## 2. Cấu trúc dữ liệu

### 2.1 Sản phẩm (`products`)

```
{
  id: number,
  name: string,
  price: number,          // giá bán
  cost_price: number,     // giá vốn
  quantity: number,       // tổng tồn kho (= tổng stockByColor)
  stockByColor: object,   // { mã_màu: số_lượng } - tồn kho theo từng màu
  category: string,       // slug danh mục
  collection: string,     // id bộ sưu tập (rỗng nếu không thuộc BST)
  material: string,       // chất liệu
  size: string,           // kích thước
  colors: string[],       // mảng mã màu (hex)
  desc: string,           // mô tả
  img: string             // URL hình ảnh
}
```

### 2.2 Danh mục (`categories`)

```
{ id/slug: string, name: string, desc: string }
```

### 2.3 Bộ sưu tập (`collections`)

```
{ id: string, name: string, desc: string, img: string }
```

### 2.4 Giỏ hàng (`cart`)

Mỗi item trong giỏ lưu **toàn bộ** thông tin sản phẩm kèm màu đã chọn:

```
{
  ...sản_phẩm,
  quantity: number,      // số lượng
  color: string,         // mã màu đã chọn
  cartKey: string        // khóa duy nhất = `${productId}_${color}`
}
```

> `cartKey` giúp phân biệt cùng 1 sản phẩm nhưng khác màu.

### 2.5 Đơn hàng (`orders`)

```
{
  id: string,             // "LESAC" + 4 số ngẫu nhiên (VD: LESAC1234)
  date: string,           // ngày đặt (toLocaleString)
  items: [ ...cart_items ], // snapshot sản phẩm khi đặt
  total: number,          // tổng tiền
  name: string,           // tên khách nhận
  phone: string,          // SĐT
  address: string,        // địa chỉ đầy đủ (số nhà, phường, quận, tỉnh)
  email: string,
  note: string,           // ghi chú
  username: string,       // tài khoản đặt (hoặc 'Khách vãng lai')
  paymentMethod: string,  // 'Chuyển khoản QR' | 'Thanh toán tại nhà'
  status: string          // 'Đang xử lý' | 'Đang giao hàng' | 'Hoàn thành' | 'Đã hủy'
}
```

### 2.6 Tài khoản

- **Khách hàng** (`accounts`): `{ id, name, user, pass }` — đăng ký/đăng nhập.
- **Admin** (`ADMIN_ACCOUNTS` cố định trong code): `admin1/123`, `admin2/123`.

---

## 3. Chức năng trang khách (`index.html` + `shop.js`)

### 3.1 Điều hướng (header)
- Logo LESAC → về trang chủ.
- Nav desktop (hover dropdown): **Túi** (đeo chéo / đeo vai / tote), **Ví** (truyền thống / đựng thẻ), **Bộ sưu tập**, **Liên hệ**.
- Nav mobile: hamburger menu trượt xuống.
- Icon: tìm kiếm, giỏ hàng (có badge số lượng), tài khoản.
- Hiển thị tên người dùng đã đăng nhập + nút "Đơn hàng" (lịch sử).

### 3.2 Trang chủ (Hero)
- Banner giới thiệu thương hiệu, nút "Khám phá ngay" → xem sản phẩm.

### 3.3 Danh sách sản phẩm & bộ lọc
- Lưới sản phẩm 2 cột (mobile) / 4 cột (desktop).
- **Lọc theo danh mục** (chọn từ nav / footer).
- **Tìm kiếm** theo tên, mô tả.
- **Lọc khoảng giá**: Dưới 300k, 300k-500k, 500k-700k, trên 700k.
- **Sắp xếp** theo giá: thấp→cao, cao→thấp.
- Thẻ sản phẩm: hình ảnh (hiệu ứng grayscale→màu khi hover), tên, mô tả, chất liệu, size, giá, nút "Xem chi tiết".

### 3.4 Bộ sưu tập (Collection / BST)
- Banner riêng, hiển thị từng BST theo nhóm, số lượng sản phẩm mỗi BST.
- Sản phẩm BST chưa gán vào BST nào → nhóm "BST Độc quyền".
- Nút "Xem tất cả BST" → lọc danh mục bst.

### 3.5 Chi tiết sản phẩm (Modal) **\*nổi bật**
- Hiển thị ảnh, tên, giá, chất liệu, kích thước.
- **Chọn màu sắc**: các chấm tròn; màu **hết hàng bị mờ + icon cấm, không chọn được**.
- **Hiển thị tồn kho theo màu**: dòng "Còn X sản phẩm" hoặc "Màu này đã hết hàng".
- **Chọn số lượng** (− / +), mặc định 1.
- Nút "Thêm vào giỏ hàng" kiểm tra tồn theo màu, báo nếu vượt số còn.

### 3.6 Giỏ hàng (Drawer bên phải)
- Danh sách item: ảnh, tên, chấm màu đã chọn, giá, nút − / + / xóa.
- Tạm tính tổng, badge số lượng trên icon giỏ.
- Nút "Tiến hành đặt hàng" → đến trang thanh toán.

### 3.7 Thanh toán (Checkout)
- **Thông tin đặt hàng**: họ tên, SĐT, email, địa chỉ.
- **Địa chỉ 3 cấp**: Tỉnh/Thành → Quận/Huyện → Phường/Xã (có validate đầy đủ).
- **Ghi chú**.
- **Phương thức thanh toán**:
  - *Thanh toán tại nhà (COD)*.
  - *Chuyển khoản QR*: tạo mã VietQR (MB bank), hiện modal QR, xác nhận → xem lịch sử.
- **Validate**: tên ≥2 ký tự, SĐT 10 số bắt đầu 0 hoặc +84, email hợp lệ, địa chỉ đầy đủ.
- **Trừ tồn kho theo màu** sau khi đặt hàng thành công.
- Tạo đơn hàng với mã duy nhất, lưu snapshot sản phẩm.

### 3.8 Đăng nhập / Đăng ký (Modal)
- **Đăng ký**: họ tên, tên tài khoản, mật khẩu (kiểm tra trùng tài khoản).
- **Đăng nhập**: kiểm tra tài khoản admin → chuyển sang `admin.html`; tài khoản khách → đăng nhập tại trang.
- Đăng xuất (khi đã đăng nhập).
- Admin đăng nhập trên trang khách → hiện thanh admin bar (nút quay lại admin).

### 3.9 Lịch sử đơn hàng
- Chỉ khi **đã đăng nhập** (nút "Đơn hàng" trên header).
- Khách thấy đơn của mình; **admin thấy tất cả đơn**.
- Hiển thị mã đơn, ngày, hình thức thanh toán, danh sách sản phẩm, địa chỉ, tổng tiền, trạng thái.

### 3.10 Liên hệ
- Thông tin cửa hàng (địa chỉ, hotline, email, giờ mở cửa), mạng xã hội.
- Form gửi liên hệ (tên, email, chủ đề, nội dung) → chỉ hiện alert thông báo.

---

## 4. Chức năng trang quản trị (`admin.html` + `admin.js`)

> **Quyền truy cập**: chỉ tài khoản admin (`session.role === 'admin'`) mới vào được; ngược lại bị đưa về trang khách.

### 4.1 Tổng quan (Dashboard)
- **Lời chào** theo giờ + tên admin, hiển thị ngày hiện tại.
- **5 card thống kê**: Tổng đơn hàng, Số sản phẩm, Sản phẩm sắp hết (≤10), Doanh thu (trừ đơn hủy), Lợi nhuận ước tính (theo cost_price).
- **Đơn hàng gần đây** (5 đơn mới nhất, kèm badge trạng thái).
- **Tồn kho sắp hết** (≤10, sắp tăng dần).

### 4.2 Quản lý sản phẩm
- Bảng sản phẩm: ID, ảnh, tên, giá, danh mục, chất liệu/size, số lượng (badge màu), thao tác.
- **Tìm kiếm** theo tên, danh mục.
- **Thêm / Sửa** (modal): tên, giá vốn, giá bán, danh mục (dropdown), **màu sắc & số lượng theo màu** (chọn màu, nút "Thêm màu", nhập số lượng từng màu, xóa màu, tổng tồn tự tính), chất liệu, kích thước, link ảnh, mô tả.
- **Xóa** sản phẩm.

### 4.3 Quản lý tồn kho
- **5 card**: Tổng sản phẩm, Tổng tồn kho, Sắp hết, Hết hàng, Giá trị tồn kho.
- Bảng: ảnh, tên (+ **chip tồn theo từng màu**), danh mục, giá vốn, tồn kho, cập nhật, lưu, trạng thái.
- **Cập nhật số lượng**: dùng nút − / + hoặc nhập trực tiếp, sau đó **bấm nút "Lưu"** mới ghi nhận (chia tỉ lệ lại theo màu).
- **Lọc**: tất cả, sắp hết, hết hàng, còn hàng. **Tìm kiếm** theo tên/danh mục.

### 4.4 Quản lý danh mục
- Bảng: STT, tên, mô tả, số sản phẩm, thao tác.
- **Thêm / Sửa / Xóa** danh mục (slug duy nhất).
- Xóa danh mục đang có sản phẩm → chuyển sản phẩm về "Chưa phân loại".

### 4.5 Quản lý bộ sưu tập (BST)
- Lưới card BST: ảnh bìa, tên, mô tả, số sản phẩm, ảnh sản phẩm đại diện.
- **Thêm / Sửa / Xóa** BST.
- **Quản lý sản phẩm trong BST**: modal checkbox chọn sản phẩm, có tìm kiếm.
- Xóa BST đang có sản phẩm → gỡ sản phẩm khỏi BST.

### 4.6 Quản lý đơn hàng
- Bảng: mã đơn/khách, thông tin liên hệ, sản phẩm đặt, tổng tiền, trạng thái, cập nhật trạng thái.
- **Lọc theo trạng thái**, **tìm kiếm** (mã đơn, tên, SĐT, email, tài khoản).
- **Đổi trạng thái**: Đang xử lý → Đang giao hàng → Hoàn thành / Đã hủy.
- **Xóa** đơn hàng.

---

## 5. Luồng nghiệp vụ chính

### 5.1 Luồng mua hàng
```
Xem sản phẩm → Chọn màu (kiểm tra tồn theo màu) → Chọn số lượng
→ Thêm vào giỏ → Điền thông tin đặt hàng + chọn thanh toán
→ Đặt hàng → Trừ tồn kho theo màu → (QR nếu chọn) → Lưu đơn → Xem lịch sử
```

### 5.2 Luồng quản trị
```
Đăng nhập admin → Dashboard → Quản lý sản phẩm / tồn kho / danh mục / BST / đơn hàng
```

---

## 6. Gợi ý triển khai Backend (mapping)

| Chức năng frontend | Gợi ý API / bảng | Ghi chú |
|---|---|---|
| Danh sách sản phẩm | `GET /api/products` (có filter/search/sort/price) | Phân trang |
| Chi tiết sản phẩm | `GET /api/products/:id` | Gồm stockByColor |
| Giỏ hàng | `POST/GET /api/cart` | Lưu theo session/user |
| Đặt hàng | `POST /api/orders` | Transaction trừ tồn kho |
| Xem lịch sử đơn | `GET /api/orders?user=...` | Phân quyền |
| Đăng ký/Đăng nhập | `POST /api/auth/register`, `POST /api/auth/login` | JWT/session, hash mật khẩu |
| Admin | `GET/POST/PUT/DELETE /api/admin/products|categories|collections|inventory|orders` | Phân quyền role |
| Tồn kho | `PUT /api/admin/inventory/:id` | Cập nhật theo màu |
| Liên hệ | `POST /api/contact` | Gửi email/admin |

---

## 7. Lưu ý / cải tiến tiềm năng

- **Bảo mật**: mật khẩu admin hiện nằm cứng trong code → BE nên dùng hash + role-based access.
- **Đơn hủy**: hiện **không hoàn lại tồn kho** khi hủy đơn → BE nên xử lý hoàn kho khi status chuyển "Đã hủy".
- **Liên hệ**: chỉ alert giả → BE nên lưu vào bảng `contacts` + gửi email.
- **Giỏ hàng**: hiện lưu localStorage từng trình duyệt → BE nên đồng bộ theo tài khoản.
- **Đặt hàng**: mã đơn sinh ngẫu nhiên, có thể trùng → BE nên tạo mã tuần tự duy nhất.
- **Phân trang** các danh sách (sản phẩm, đơn hàng) khi dữ liệu lớn.
