# Test Cases - Phan quyen va Bao mat LESAC

## 1. Thong tin test

- Backend: `http://localhost:4000`
- Trang khach: `http://localhost:4000/index.html`
- Trang admin: `http://localhost:4000/admin.html`
- API health: `http://localhost:4000/api/health`
- Tai khoan test:
  - Admin hop le theo `2-backend/README.md`.
  - Customer A va Customer B.
  - Mot customer bi khoa trong qua trinh test.
- Cong cu: DevTools, tab Application, Network va Console.
- Khong su dung mat khau production trong test.

## 2. Smoke test phan quyen

| ID | Chuc nang | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| SEC-SMK-01 | Admin hop le | Dang nhap admin va mo `admin.html` | Truy cap dashboard thanh cong | [ ] |
| SEC-SMK-02 | Customer truy cap admin | Dang nhap customer va mo `admin.html` | Bi chan va chuyen ve trang khach | [ ] |
| SEC-SMK-03 | Chua dang nhap | Xoa session, mo `admin.html` | Bi chan; khong tai du lieu admin | [ ] |
| SEC-SMK-04 | Customer dung API | Dung token customer goi API admin | API tra ve 403; khong tra du lieu admin | [ ] |
| SEC-SMK-05 | Khong token | Goi API can dang nhap khong Authorization | API tra ve 401 | [ ] |
| SEC-SMK-06 | Logout | Dang nhap admin, logout, goi lai API admin | Phien bi xoa; request tiep theo bi tu choi | [ ] |

## 3. Xac thuc Bearer token

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| TOKEN-01 | Khong co header | Goi `GET /api/auth/me` khong header | Tra ve 401 `Chua dang nhap` | [ ] |
| TOKEN-02 | Header sai format | Goi API voi `Authorization: Token abc` | Tra ve 401 | [ ] |
| TOKEN-03 | Bearer rong | Goi voi `Authorization: Bearer ` | Tra ve 401 | [ ] |
| TOKEN-04 | Token random | Goi API voi token bat ky | Tra ve 401; khong crash server | [ ] |
| TOKEN-05 | Token bi sua body | Sua phan body truoc dau cham | Chu ky khong khop; tra ve 401 | [ ] |
| TOKEN-06 | Token bi sua chu ky | Sua mot ky tu phan chu ky | Tra ve 401 | [ ] |
| TOKEN-07 | Token customer goi API auth | Dung token customer goi `/api/auth/me` | Tra ve dung user customer, khong lo passwordHash | [ ] |
| TOKEN-08 | Token admin goi API auth | Dung token admin goi `/api/auth/me` | Tra ve role admin, khong lo thong tin mat khau | [ ] |
| TOKEN-09 | Token het han | Dung token co exp qua han | Tra ve 401 | [ ] |
| TOKEN-10 | Token sau logout | Logout tren giao dien, thu dung token cu trong Network | Server khong duoc xem la logout neu token con han; ghi ro day la hanh vi can xem xet bao mat | [ ] |
| TOKEN-11 | Token khong phai Bearer | Dung chu ky sai va prefix sai | Khong duoc chap nhan | [ ] |
| TOKEN-12 | Payload role bi sua | Sua role customer thanh admin nhung giu chu ky cu | Tra ve 401; khong nang quyen | [ ] |

## 4. Phan quyen API admin

| ID | API / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| RBAC-01 | Customer - dashboard | Dung token customer goi `/api/admin/dashboard` | 403, khong tra thong ke | [ ] |
| RBAC-02 | Customer - products | Dung token customer goi GET/POST/PUT/DELETE products admin | Tat ca thao tac bi tu choi | [ ] |
| RBAC-03 | Customer - inventory | Dung token customer goi API inventory | 403, ton kho khong doi | [ ] |
| RBAC-04 | Customer - categories | Dung token customer them/sua/xoa danh muc | 403, du lieu khong doi | [ ] |
| RBAC-05 | Customer - collections | Dung token customer them/sua/xoa bo suu tap | 403, du lieu khong doi | [ ] |
| RBAC-06 | Customer - orders | Dung token customer doi/xoa don qua admin API | 403, don va ton kho khong doi | [ ] |
| RBAC-07 | Customer - contacts | Dung token customer xem/xoa lien he admin | 403, du lieu lien he khong lo | [ ] |
| RBAC-08 | Customer - users | Dung token customer xem/khoa/xoa user | 403, user khong bi thay doi | [ ] |
| RBAC-09 | Admin hop le | Dung token admin goi cac API admin GET | Tra ve dung du lieu | [ ] |
| RBAC-10 | Admin thao tac | Dung token admin them/sua/xoa du lieu test | Thao tac thanh cong theo quyen | [ ] |
| RBAC-11 | Role khong hop le | Gui body user voi role bat ky, vi du `superadmin` | API tu choi 400; khong gan role sai | [ ] |
| RBAC-12 | Sua role customer thanh admin | Admin sua user test thanh admin | Kiem tra co duoc phep theo yeu cau nghiep vu; khong cho nang quyen tuy tien neu khong duoc phep | [ ] |

## 5. Bao ve API can dang nhap

| ID | API | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| AUTHZ-01 | `GET /api/cart` | Goi khong token | Tra ve 401 | [ ] |
| AUTHZ-02 | `POST /api/cart` | Gui gio hang khong token | Tra ve 401; file carts khong doi | [ ] |
| AUTHZ-03 | `GET /api/orders` | Goi khong token | Tra ve 401 | [ ] |
| AUTHZ-04 | `POST /api/orders` | Gui don khong token | Tra ve 401; khong tao don, khong tru kho | [ ] |
| AUTHZ-05 | `GET /api/auth/me` | Goi khong token | Tra ve 401 | [ ] |
| AUTHZ-06 | API public | Goi products/categories/collections khong token | Tra ve du lieu public binh thuong | [ ] |
| AUTHZ-07 | Contact public | Gui lien he khong token voi du lieu hop le | Tao lien he thanh cong; khong yeu cau dang nhap | [ ] |

## 6. Co lap du lieu giua cac tai khoan

| ID | Dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| ISO-01 | Customer A/B | Dang nhap A, luu gio hang, dang xuat, dang nhap B | B khong thay gio hang cua A | [ ] |
| ISO-02 | Don hang A/B | A tao don, dang nhap B xem `/api/orders` | B khong thay don cua A | [ ] |
| ISO-03 | Token A | Dung token A sau khi dang nhap B | API tra du lieu theo A, khong theo B | [ ] |
| ISO-04 | Sua cart | B POST cart cua minh | Gio hang A khong bi thay doi | [ ] |
| ISO-05 | Tham so user | Customer goi `/api/admin/orders?user=customerA` | Khong xem duoc don cua user khac qua query | [ ] |
| ISO-06 | User ID sai | Sua id/username trong request client | Server dung user trong token, khong tin du lieu client de phan quyen | [ ] |
| ISO-07 | Lich su tren UI | Dang nhap B, mo lich su don | Chi hien don cua B | [ ] |
| ISO-08 | Logout chuyen tai khoan | Logout A, login B tren cung trinh duyet | Khong con du lieu rieng cua A trong giao dien B | [ ] |

## 7. Tai khoan va mat khau

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| PASS-01 | Mat khau khong hop le | Dang ky mat khau 1-2 ky tu | API tra 400; khong tao user | [ ] |
| PASS-02 | Password khong luu plain text | Dang ky user, kiem tra `accounts.json` | Chi luu passwordHash, khong luu mat khau goc | [ ] |
| PASS-03 | Password trong response | Dang ky/dang nhap, xem response Network | Response khong chua password/passwordHash | [ ] |
| PASS-04 | Sai mat khau | Dang nhap username dung, password sai | 401; khong cap token hop le | [ ] |
| PASS-05 | User bi khoa | Admin set active=false, user dang nhap | Tra 403 tai khoan bi khoa | [ ] |
| PASS-06 | Mo khoa user | Admin set active=true, user dang nhap lai | Dang nhap thanh cong | [ ] |
| PASS-07 | Reset mat khau | Admin dat mat khau moi cho user test | Mat khau moi dung, mat khau cu sai | [ ] |
| PASS-08 | Reset mat khau ngan | Admin reset voi mat khau duoi 3 ky tu | Khong doi passwordHash hoac tra loi loi | [ ] |
| PASS-09 | Username trung | Dang ky username da ton tai | 409; khong ghi them tai khoan | [ ] |
| PASS-10 | User khong ton tai | Dang nhap username khong ton tai | Loi chung, khong tiet lo thong tin nhay cam | [ ] |
| PASS-11 | Tai khoan admin demo | Thu dang nhap sai password admin | Khong cap token admin | [ ] |
| PASS-12 | Mat khau Unicode/ky tu dac biet | Dang ky va dang nhap lai | Ket qua nhat quan, khong cat mat khau | [ ] |

## 8. Input validation va chong XSS

| ID | Vi tri | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| INPUT-01 | Register name | Nhap `<script>alert(1)</script>` | Script khong thuc thi trong greeting/modal | [ ] |
| INPUT-02 | Register username | Nhap HTML/script vao username | Request bi tu choi hoac hien thi an toan | [ ] |
| INPUT-03 | Contact name | Gui ten co HTML/script | Admin hien du lieu dang text, khong thuc thi script | [ ] |
| INPUT-04 | Contact message | Gui noi dung co script/HTML | Khong thuc thi khi hien tren admin | [ ] |
| INPUT-05 | Product name | Admin tao ten co HTML/script | Khong thuc thi tren bang admin/trang khach | [ ] |
| INPUT-06 | Product description | Admin nhap HTML/script vao mo ta | Hien thi an toan hoac tu choi | [ ] |
| INPUT-07 | Address/note | Dat hang voi chuoi HTML/script | Khong thuc thi trong lich su/admin | [ ] |
| INPUT-08 | JSON sai kieu | Gui array/string thay cho object body | Tra 400, server khong crash | [ ] |
| INPUT-09 | Body rat lon | Gui truong text rat dai | Server xu ly loi co kiem soat, khong treo | [ ] |
| INPUT-10 | ID path traversal | Dung ID co `../` trong endpoint | Khong doc/ghi file ngoai data, tra loi 400/404 | [ ] |

## 9. Token va luu tru phia trinh duyet

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| STORAGE-01 | Mo Application > Local Storage sau login | Chi luu token/session can thiet, khong luu mat khau plain text | [ ] |
| STORAGE-02 | Sua session role | Sua role trong Local Storage roi refresh | Khong nang quyen tren server | [ ] |
| STORAGE-03 | Copy token sang trinh duyet khac | Dung token hop le trong cung thoi han | Hanh vi phu hop voi thiet ke token; ghi nhan rui ro neu khong co thu hoi token | [ ] |
| STORAGE-04 | Xoa token | Xoa token, refresh trang | Giao dien tro ve chua dang nhap | [ ] |
| STORAGE-05 | Token qua han | Dung token qua 7 ngay | API tra 401 | [ ] |
| STORAGE-06 | Token trong URL/log | Kiem tra URL, title, console va thong bao | Token khong bi hien tren UI/URL | [ ] |
| STORAGE-07 | HTTPS | Kiem tra moi truong deploy | Production phai dung HTTPS; khong gui token qua HTTP cong khai | [ ] |

## 10. Bao mat phien va request

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| SESSION-SEC-01 | Dang nhap, mo nhieu tab | Phien nhat quan; khong hien nham user | [ ] |
| SESSION-SEC-02 | Logout o tab A | Tai tab B, thu thao tac can auth | Hanh vi duoc xac dinh; khong tu dong cap quyen moi | [ ] |
| SESSION-SEC-03 | Replay request dat hang | Gui lai request dat hang cu | Khong tao don trung neu da co co che idempotency/ngan lap; neu chua co, ghi nhan rui ro | [ ] |
| SESSION-SEC-04 | Replay request admin | Gui lai request xoa/sua | Ket qua khong gay xoa nham du lieu khac | [ ] |
| SESSION-SEC-05 | Sai Content-Type | Gui body khong phai JSON | Tra loi loi 4xx; server khong crash | [ ] |
| SESSION-SEC-06 | Request song song | Gui nhieu request cap nhat cung du lieu | Du lieu cuoi nhat nhat quan, khong hong JSON | [ ] |
| SESSION-SEC-07 | Loi server | Tao request gay loi validation | Server tiep tuc phuc vu request tiep theo | [ ] |

## 11. Tieu chi Pass/Fail

### Pass

- Moi API protected tu choi request thieu token hoac token sai.
- Customer khong goi duoc API admin.
- Server lay danh tinh va role tu token da ky, khong tin role do client tu gui.
- Customer chi xem duoc gio hang va don cua chinh minh.
- Mat khau khong luu plain text va khong xuat hien trong response/UI.
- Tai khoan bi khoa khong dang nhap duoc.
- Input HTML/script khong duoc thuc thi.
- Request loi khong lam server crash hoac hong file JSON.

### Fail

Danh dau Fail neu co mot trong cac loi sau:

- Customer truy cap duoc dashboard, users, products hoac orders admin.
- Sua Local Storage role la co the tro thanh admin tren server.
- Customer xem duoc don/gio hang cua tai khoan khac.
- Token sai van duoc chap nhan.
- Password/passwordHash lo ra trong response hoac giao dien.
- XSS thuc thi khi hien ten, mo ta, ghi chu hoac noi dung lien he.
- Tai khoan bi khoa van dang nhap duoc.
- Request loi lam server dung hoac file JSON hong.

Khi bao loi, ghi ma test, endpoint, method, status code, tai khoan/role, request body da an mat khau, response, anh chup man hinh va log server. Khong dua token that vao bao cao.
