# LESAC Backend

Backend API cho website LESAC (túi xách & ví premium). Dữ liệu lưu dưới dạng **JSON file** (không dùng CSDL), nằm trong thư mục `data/`.

## Công nghệ
- Node.js + Express
- Lưu trữ: JSON file trong `data/`
- Auth: token đơn giản (kèm theo `lib/auth.js`)

## Cài đặt & chạy
```bash
cd 2-backend
npm install          # cài Express (npm.cmd trên Windows)
npm start            # chạy server tại http://localhost:4000
```
Hoặc chạy dev (tự reload): `npm run dev`

Server cũng **phục vụ luôn frontend** tại `../1-fontend`:
- Trang khách: `http://localhost:4000/index.html`
- Trang admin: `http://localhost:4000/admin.html`

## Khởi tạo dữ liệu (seed)
```bash
node seed.js
```
Chỉ tạo file nếu chưa tồn tại. Xóa hết file trong `data/` rồi chạy lại để reset về dữ liệu gốc.

## Cấu trúc thư mục
```
2-backend/
├── server.js          # entry point, middleware, gắn routes, phục vụ frontend
├── seed.js            # tạo dữ liệu mẫu vào data/
├── data/              # JSON files (products, categories, collections, orders, accounts, contacts)
├── lib/
│   ├── store.js       # đọc/ghi JSON file, sinh id
│   ├── auth.js        # hash mật khẩu, tạo/verify token, middleware admin
│   └── validators.js  # kiểm tra SĐT, email
└── routes/
    ├── auth.js        # đăng ký / đăng nhập / me
    ├── products.js    # API công khai: danh sách + lọc + chi tiết
    ├── categories.js  # danh sách (public)
    ├── collections.js # danh sách (public)
    ├── orders.js      # tạo đơn hàng + trừ tồn kho
    ├── contact.js     # lưu liên hệ
    └── admin.js       # dashboard + CRUD sản phẩm/danh mục/BST + tồn kho + đơn hàng
```

## Tài khoản mặc định
| Vai trò | Tài khoản | Mật khẩu |
|---|---|---|
| Admin | `admin1` / `admin2` | `123` |
| Khách | (đăng ký qua API) | - |

## API tóm tắt

### Công khai
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/register` | Đăng ký khách hàng |
| POST | `/api/auth/login` | Đăng nhập (admin + khách), trả token |
| GET | `/api/auth/me` | Lấy user từ token |
| GET | `/api/products` | Danh sách + lọc (`category`, `search`, `min`, `max`, `sort`, `collection`) |
| GET | `/api/products/:id` | Chi tiết sản phẩm |
| GET | `/api/categories` | Danh mục (kèm productCount) |
| GET | `/api/collections` | Bộ sưu tập (kèm productCount) |
| POST | `/api/orders` | Tạo đơn hàng (cần token, tự trừ tồn theo màu) |
| POST | `/api/contact` | Lưu liên hệ |

### Admin (cần header `Authorization: Bearer <token>` admin)
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/admin/dashboard` | Thống kê: doanh thu, lợi nhuận, tồn kho, đơn gần đây |
| GET/POST | `/api/admin/products` | Danh sách / thêm sản phẩm |
| PUT/DELETE | `/api/admin/products/:id` | Sửa / xóa sản phẩm |
| PUT | `/api/admin/inventory/:id` | Cập nhật tồn kho (scale theo màu) |
| GET/POST | `/api/admin/categories` | Danh mục |
| PUT/DELETE | `/api/admin/categories/:slug` | Sửa / xóa danh mục |
| GET/POST | `/api/admin/collections` | Bộ sưu tập |
| PUT/DELETE | `/api/admin/collections/:id` | Sửa / xóa BST |
| GET | `/api/admin/orders` | Đơn hàng (lọc `status`, `search`, `user`) |
| PUT | `/api/admin/orders/:id` | Đổi trạng thái (hủy → hoàn lại tồn kho) |
| DELETE | `/api/admin/orders/:id` | Xóa đơn |

## Xác thực
Gửi token qua header:
```
Authorization: Bearer <token>
```
Token có hiệu lực 7 ngày. Admin xem được tất cả; khách chỉ xem đơn của mình.

## Lưu ý
- Mật khẩu admin nằm trong `lib/auth.js` (`ADMINS`) — chỉ dùng cho demo, KHÔNG dùng trong production.
- Token dùng thuật toán đơn giản (không phải JWT chuẩn) — khi lên production nên thay bằng JWT thật + bcrypt.
- Khi hủy đơn hàng, tồn kho tự động được hoàn lại.