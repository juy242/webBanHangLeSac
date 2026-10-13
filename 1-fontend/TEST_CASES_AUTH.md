# Test Cases - Dang Ky va Dang Nhap LESAC

## 1. Thong tin test

- URL trang khach hang: `http://localhost:4000/index.html`
- Tai khoan test khach: tao moi trong qua trinh test.
- Tai khoan admin: xem thong tin trong `2-backend/README.md`.
- Trinh duyet: Chrome hoac Edge moi nhat.
- Truoc moi nhom test, xoa session cu neu can:
  - DevTools > Application > Local Storage.
  - Xoa `LESAC_TOKEN` va session cua LESAC.
- Ket qua mong doi chung:
  - Thong bao loi ro rang.
  - Khong bi reload mat du lieu bat thuong.
  - Khong hien token hoac mat khau tren giao dien.
  - Khong co loi bat ngoi trong Console.

## 2. Smoke test xac thuc

| ID | Chuc nang | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| AUTH-SMK-01 | Mo form | Mo trang, bam bieu tuong tai khoan | Modal dang nhap mo, hien tab dang nhap va dang ky | [ ] |
| AUTH-SMK-02 | Dang ky | Chuyen tab dang ky, nhap du lieu hop le, gui form | Dang ky thanh cong, thong bao thanh cong, phien nguoi dung duoc tao | [ ] |
| AUTH-SMK-03 | Dang nhap | Dang xuat, mo lai form, nhap dung tai khoan vua tao | Dang nhap thanh cong, hien loi chao va ten nguoi dung | [ ] |
| AUTH-SMK-04 | Dang xuat | Bam nut tai khoan khi da dang nhap, xac nhan dang xuat | Session bi xoa, giao dien tro ve trang thai chua dang nhap | [ ] |
| AUTH-SMK-05 | Dang nhap lai | Tai lai trang sau khi dang nhap | Trang thai dang nhap duoc khoi phuc dung | [ ] |

## 3. Dang ky tai khoan

| ID | Du lieu test | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| REG-01 | `Nguyen Van A`, username moi, mat khau `abc123` | Dien day du form dang ky va gui | Tao tai khoan khach thanh cong; khong bi loi | [ ] |
| REG-02 | Bo trong ho ten | De trong ten, dien username va mat khau, gui | Form bi tu choi; yeu cau nhap day du thong tin | [ ] |
| REG-03 | Bo trong username | De trong username va gui | Hien loi thieu thong tin; khong tao tai khoan | [ ] |
| REG-04 | Bo trong mat khau | De trong mat khau va gui | Hien loi thieu thong tin; khong tao tai khoan | [ ] |
| REG-05 | Ca ba truong rong | Gui form rong | Hien thong bao loi; khong tao request thanh cong | [ ] |
| REG-06 | Mat khau 1 ky tu | Nhap mat khau `a` | Bi tu choi vi mat khau toi thieu 3 ky tu | [ ] |
| REG-07 | Mat khau 2 ky tu | Nhap mat khau `ab` | Bi tu choi vi mat khau toi thieu 3 ky tu | [ ] |
| REG-08 | Mat khau dung 3 ky tu | Nhap mat khau `abc` | Duoc chap nhan theo quy tac hien tai | [ ] |
| REG-09 | Username trung | Dang ky lai username da ton tai | Hien loi tai khoan da ton tai; khong ghi them ban ghi | [ ] |
| REG-10 | Ho ten co dau | Nhap ho ten tieng Viet co dau | Tao thanh cong va hien dung ten | [ ] |
| REG-11 | Khoang trang dau/cuoi | Nhap username hoac ten co khoang trang dau/cuoi | He thong xu ly nhat quan; khong tao cac tai khoan trung do khoang trang | [ ] |
| REG-12 | Username dai | Nhap username rat dai | Giao dien khong vo; he thong tu choi hoac xu ly co gioi han | [ ] |
| REG-13 | Ky tu dac biet | Nhap username co dau cach, ky tu HTML/script | Khong thuc thi script; thong bao loi hoac xu ly an toan | [ ] |
| REG-14 | Mat khau Unicode | Nhap mat khau co ky tu Unicode | Ket qua nhat quan khi dang ky va dang nhap lai | [ ] |
| REG-15 | Gui nhieu lan | Bam nut dang ky lien tuc | Chi tao mot tai khoan; khong tao ban ghi trung | [ ] |
| REG-16 | Tai khoan sau dang ky | Dang ky thanh cong, dong mo lai trang | Ten tai khoan va trang thai phien hien dung | [ ] |

## 4. Dang nhap tai khoan khach

| ID | Du lieu test | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| LOGIN-01 | Username/mat khau dung | Nhap thong tin dung va gui | Dang nhap thanh cong, dong modal, hien ten nguoi dung | [ ] |
| LOGIN-02 | Sai mat khau | Nhap username dung, mat khau sai | Hien loi dang nhap; van o trang chua dang nhap | [ ] |
| LOGIN-03 | Username khong ton tai | Nhap username khong ton tai | Hien loi tai khoan hoac mat khau khong dung | [ ] |
| LOGIN-04 | Bo trong username | De trong username | Khong cho dang nhap; hien thong bao loi | [ ] |
| LOGIN-05 | Bo trong mat khau | De trong mat khau | Khong cho dang nhap; hien thong bao loi | [ ] |
| LOGIN-06 | Ca hai truong rong | Gui form rong | Khong tao phien; thong bao loi hien dung | [ ] |
| LOGIN-07 | Sai chu hoa/thuong | Nhap username khac hoa hoac sai mat khau chu hoa | Ket qua dung theo quy tac he thong; khong dang nhap nham | [ ] |
| LOGIN-08 | Khoang trang | Nhap username/mat khau co khoang trang dau/cuoi | Giao dien xu ly nhat quan; khong dang nhap nham tai khoan | [ ] |
| LOGIN-09 | Gui nhieu lan | Bam nut dang nhap lien tuc | Khong tao nhieu phien loi; giao dien khong bi treo | [ ] |
| LOGIN-10 | Tai lai trang | Dang nhap thanh cong, tai lai trang | Van nhan dien dung tai khoan | [ ] |
| LOGIN-11 | Mo tab moi | Dang nhap o tab A, mo trang o tab B | Trang thai phien nhat quan giua cac tab | [ ] |
| LOGIN-12 | Token bi xoa | Xoa `LESAC_TOKEN`, tai lai trang | Tro ve trang thai chua dang nhap; khong hien lich su don | [ ] |
| LOGIN-13 | Token khong hop le | Sua token trong Local Storage, tai lai trang | Khong duoc coi la dang nhap hop le; API tu choi token | [ ] |
| LOGIN-14 | Backend tat | Tat server, thu dang nhap | Hien thong bao ket noi that bai; trang khong bi vo | [ ] |

## 5. Dang nhap tai khoan admin

| ID | Du lieu test | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| ADMIN-AUTH-01 | Tai khoan admin dung | Nhap tai khoan admin va mat khau dung tren trang khach | Dang nhap thanh cong va chuyen sang `admin.html` | [ ] |
| ADMIN-AUTH-02 | Admin sai mat khau | Nhap username admin, mat khau sai | Hien loi sai mat khau; khong chuyen trang | [ ] |
| ADMIN-AUTH-03 | Khach truy cap admin | Dang nhap tai khoan khach, mo `admin.html` | Khong duoc thao tac chuc nang admin | [ ] |
| ADMIN-AUTH-04 | Chua dang nhap truy cap admin | Xoa session, mo truc tiep `admin.html` | Bi chan hoac khong truy cap duoc API admin | [ ] |
| ADMIN-AUTH-05 | Sua role tren client | Sua thong tin session thanh `admin` trong Local Storage | Server van tu choi API admin neu token khong phai token admin | [ ] |
| ADMIN-AUTH-06 | Gọi API admin khong token | Mo DevTools va goi request den API admin khong Authorization | API tra ve loi unauthorized/forbidden; khong lo du lieu | [ ] |

## 6. Session va logout

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| SESSION-01 | Dang nhap, dong tab, mo lai trang | Phien van con neu token chua het han | [ ] |
| SESSION-02 | Dang xuat va bam nut quay lai trinh duyet | Khong truy cap duoc du lieu can dang nhap | [ ] |
| SESSION-03 | Dang xuat, mo lich su don bang menu | Khong hien lich su; yeu cau dang nhap hoac an nut | [ ] |
| SESSION-04 | Dang xuat khi co gio hang | Gio hang xu ly dung theo yeu cau; khong bi gan nham sang tai khoan khac | [ ] |
| SESSION-05 | Dang nhap tai khoan A, dang xuat, dang nhap B | B khong thay don hang cua A; gio hang cua B tach biet | [ ] |
| SESSION-06 | Dang xuat va huy hop thoai | Phien van dang nhap, du lieu khong bi thay doi | [ ] |
| SESSION-07 | Dang nhap sau khi da co gio hang | Gio hang duoc dong bo dung voi tai khoan hien tai | [ ] |

## 7. Kiem thu phan quyen va bao mat

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| SEC-01 | Gui password trong URL hoac query string | Mat khau khong xuat hien tren URL | [ ] |
| SEC-02 | Xem request login trong Network | Password chi nam trong request HTTPS/POST khi moi truong ho tro; response khong tra password | [ ] |
| SEC-03 | Nhap script vao ten/username | Script khong duoc thuc thi trong modal, greeting hoac trang | [ ] |
| SEC-04 | Dung token khach goi API `/api/admin/products` | Server tu choi truy cap | [ ] |
| SEC-05 | Doi role tren Local Storage | Khong the nang quyen neu khong co token hop le tu server | [ ] |
| SEC-06 | Dung token cu sau khi logout | Token cu khong duoc dung de truy cap thao tac can xac thuc | [ ] |
| SEC-07 | Gui request dang ky sai kieu du lieu | Server tra loi loi 4xx, khong bi crash va khong ghi JSON hong | [ ] |

## 8. Tieu chi Pass/Fail va bao loi

### Pass

- Ket qua thuc te khop ket qua mong doi.
- Thong bao loi ro rang va dung truong hop.
- Khong tao tai khoan/don hang trung.
- Session, token va phan quyen hoat dong dung.
- Khong co loi Console hoac request 5xx khong giai thich.

### Fail

Danh dau Fail neu co mot trong cac van de sau:

- Dang ky tai khoan khong hop le van thanh cong.
- Dang nhap sai van vao duoc he thong.
- Tai khoan khach truy cap duoc API admin.
- Logout nhung van xem duoc du lieu rieng tu.
- Tai khoan A nhin thay gio hang hoac don cua tai khoan B.
- Token bi lo tren giao dien/URL.
- Refresh trang lam mat session hop le.

Khi bao loi, ghi lai:

1. Ma test case.
2. Moi truong, trinh duyet va kich thuoc man hinh.
3. Tai khoan test, khong ghi mat khau that.
4. Cac buoc tai hien loi.
5. Ket qua thuc te va ket qua mong doi.
6. Anh chup man hinh.
7. Loi Console va request/response trong Network neu co.
