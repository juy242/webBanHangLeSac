# Test Cases - Trang Khach Hang LESAC

## Thong tin chung

- Moi test duoc thuc hien tai: `http://localhost:4000/index.html`
- Trinh duyet de xuat: Chrome hoac Edge moi nhat.
- Du lieu can chuan bi:
  - Mot san pham con hang va co it nhat hai mau.
  - Mot san pham sap het hang.
  - Mot san pham het hang.
  - Mot tai khoan khach hang moi.
- Ket qua mong doi: khong co loi trong Console, API tra ve dung trang thai va du lieu khong bi mat sau khi tai lai trang.

## A. Smoke test

| ID | Chuc nang | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| SMK-01 | Mo trang | Mo `index.html` | Trang tai thanh cong, hien logo, menu, danh sach san pham | [ ] |
| SMK-02 | Tai du lieu | Tai lai trang | San pham, danh muc va bo suu tap hien dung; khong co loi Console | [ ] |
| SMK-03 | Mo chi tiet | Chon mot san pham va bam `Xem chi tiet` | Modal chi tiet mo, hien anh, ten, gia, mau va ton kho | [ ] |
| SMK-04 | Them gio hang | Chon mau, so luong 1, bam them vao gio | Gio hang mo, san pham va badge so luong cap nhat | [ ] |
| SMK-05 | Dat hang | Dang nhap, dien thong tin hop le va dat COD | Tao don thanh cong, hien ma don va gio hang duoc xoa | [ ] |

## B. Hien thi va dieu huong

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| UI-01 | Trang chu | Mo trang khach hang | Hien hero, danh sach san pham va gia dinh dang VND | [ ] |
| UI-02 | Menu desktop | Bam `Tui`, `Vi`, `Bo suu tap`, `Lien he` | Dung khu vuc hoac danh muc duoc hien thi | [ ] |
| UI-03 | Menu mobile | Thu nho man hinh, bam menu ba gach | Menu mobile mo; cac muc dieu huong hoat dong | [ ] |
| UI-04 | Bo suu tap | Mo muc `Bo suu tap` | Hien dung san pham theo tung bo suu tap | [ ] |
| UI-05 | Lien he | Mo muc `Lien he` | Form lien he hien day du va khong bi che khuất | [ ] |
| UI-06 | Responsive | Kiem tra man hinh 375px, 768px, 1440px | Khong bi tran ngang, khong bi chong len nhau, nut bam dung vi tri | [ ] |
| UI-07 | Anh loi | Tam thoi dung URL mot anh san pham | Phan con lai cua the san pham van hien, khong lam vo bo cuc | [ ] |

## C. Tim kiem, loc va sap xep

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| FIL-01 | Co san pham danh muc tui | Chon `Tui` | Chi hien san pham co danh muc tui | [ ] |
| FIL-02 | Co san pham danh muc vi | Chon `Vi` | Chi hien san pham co danh muc vi | [ ] |
| FIL-03 | Tu khoa hop le | Mo tim kiem, nhap mot phan ten san pham | Ket qua chi chua san pham phu hop, khong phan biet hoa thuong | [ ] |
| FIL-04 | Tu khoa khong ton tai | Nhap chuoi khong co san pham | Hien thong bao khong tim thay san pham phu hop | [ ] |
| FIL-05 | Tu khoa rong | Xoa toan bo tu khoa | Danh sach tro ve theo bo loc hien tai | [ ] |
| FIL-06 | Khoang gia | Chon tung muc gia | Chi hien san pham nam trong khoang gia da chon | [ ] |
| FIL-07 | Gia bien | Kiem tra san pham dung bang moc gia | San pham duoc phan loai dung theo quy tac khoang gia | [ ] |
| FIL-08 | Sap xep tang dan | Chon `Gia thap den cao` | Gia cac san pham tang dan | [ ] |
| FIL-09 | Sap xep giam dan | Chon `Gia cao den thap` | Gia cac san pham giam dan | [ ] |
| FIL-10 | Ket hop bo loc | Chon danh muc, khoang gia va sap xep | Tat ca dieu kien duoc ap dung dong thoi | [ ] |

## D. Chi tiet san pham va gio hang

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| CART-01 | San pham con hang | Mo chi tiet san pham | Hien dung ten, gia, mo ta, chat lieu, size va anh | [ ] |
| CART-02 | San pham nhieu mau | Chuyen doi giua cac mau | Mau duoc chon thay doi; ton kho hien dung theo mau | [ ] |
| CART-03 | So luong hop le | Chon mau, tang so luong, them vao gio | Gio hang luu dung mau va so luong | [ ] |
| CART-04 | So luong vuot ton | Chon so luong lon hon ton kho | Khong cho them; hien thong bao phu hop | [ ] |
| CART-05 | Them cung san pham khac mau | Them san pham mau A va mau B | Gio hang tao hai dong rieng, khong gop sai mau | [ ] |
| CART-06 | Tang so luong | Bam dau `+` trong gio hang | So luong, tong tien va badge tang dung | [ ] |
| CART-07 | Giam so luong | Bam dau `-` | So luong va tong tien giam dung; khong am | [ ] |
| CART-08 | Xoa san pham | Bam bieu tuong thung rac | Dong san pham bi xoa, tong tien cap nhat | [ ] |
| CART-09 | Gio hang rong | Xoa tat ca san pham | Hien trang thai gio hang rong; khong cho checkout | [ ] |
| CART-10 | Bao luu gio hang | Them san pham, tai lai trang | Gio hang van duoc bao luu dung | [ ] |
| CART-11 | Tinh tien | Them nhieu san pham va so luong | Tong tien bang tong `gia x so luong` cua tung dong | [ ] |
| CART-12 | Chuyen checkout | Co san pham trong gio, bam dat hang | Mo form checkout va hien dung danh sach san pham | [ ] |

## E. Dang ky, dang nhap va phien lam viec

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| AUTH-01 | Du lieu hop le | Dang ky ten, username moi, mat khau tu 3 ky tu | Dang ky thanh cong, thong bao thanh cong, hien phien nguoi dung | [ ] |
| AUTH-02 | Bo trong truong | De trong mot hoac nhieu truong dang ky | Khong gui form, hien thong bao loi | [ ] |
| AUTH-03 | Mat khau ngan | Nhap mat khau duoi 3 ky tu | Dang ky bi tu choi | [ ] |
| AUTH-04 | Username trung | Dang ky lai username da ton tai | Hien loi tai khoan da ton tai | [ ] |
| AUTH-05 | Dang nhap dung | Nhap dung username va mat khau | Dang nhap thanh cong, hien ten tai khoan | [ ] |
| AUTH-06 | Sai mat khau | Nhap sai mat khau | Khong dang nhap, hien thong bao loi | [ ] |
| AUTH-07 | Tai khoan khong ton tai | Nhap username khong ton tai | Khong dang nhap, hien thong bao loi | [ ] |
| AUTH-08 | Giu phien | Dang nhap, tai lai trang | Van hien dung trang thai dang nhap | [ ] |
| AUTH-09 | Dang xuat | Bam bieu tuong tai khoan, xac nhan dang xuat | Phien bi xoa, nut lich su don an di | [ ] |
| AUTH-10 | Gio hang tai khoan | Dang nhap sau khi co gio hang | Gio hang duoc tai va hien dung san pham cua tai khoan | [ ] |

## F. Checkout va dat hang

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| ORD-01 | Chua dang nhap | Co san pham, mo checkout va bam dat hang | Yeu cau dang nhap, khong tao don | [ ] |
| ORD-02 | Bo trong ho ten | De trong ho ten, bam dat hang | Hien loi bat buoc nhap ho ten | [ ] |
| ORD-03 | Ho ten ngan | Nhap 1 ky tu | Hien loi ho ten toi thieu 2 ky tu | [ ] |
| ORD-04 | So dien thoai dung | Nhap `0912345678` | Cho phep tiep tuc | [ ] |
| ORD-05 | So dien thoai sai | Nhap thieu so, chu cai hoac sai dau so | Hien loi so dien thoai khong hop le | [ ] |
| ORD-06 | Email dung | Nhap `test@example.com` | Cho phep tiep tuc | [ ] |
| ORD-07 | Email sai | Nhap `test@` hoac `test.example.com` | Hien loi email khong hop le | [ ] |
| ORD-08 | Dia chi thieu | De trong dia chi chi tiet | Hien loi yeu cau nhap dia chi | [ ] |
| ORD-09 | Dia chi chua du | Chi chon tinh, bo trong quan hoac phuong | Khong cho dat; yeu cau chon du 3 cap | [ ] |
| ORD-10 | Dia chi day du | Nhap so nha, chon tinh, quan, phuong | Dia chi day du duoc hien va gui len don | [ ] |
| ORD-11 | Ghi chu | Nhap ghi chu dac biet | Ghi chu duoc luu trong don hang | [ ] |
| ORD-12 | COD | Chon `Thanh toan tai nha`, dat hang | Tao don thanh cong, hien ma don, chuyen lich su | [ ] |
| ORD-13 | QR | Chon `Thanh toan chuyen khoan`, dat hang | Hien ma QR dung so tien va ma don | [ ] |
| ORD-14 | Bam nhieu lan | Bam nut dat hang lien tuc | Chi tao mot don; nut bi khoa trong luc gui | [ ] |
| ORD-15 | Vuot ton kho | Dat so luong lon hon ton kho | Don bi tu choi, hien loi va khong tru kho | [ ] |
| ORD-16 | Thanh cong | Dat don hop le | Gio hang rong, tong tien dung, don xuat hien trong lich su | [ ] |
| ORD-17 | Refresh sau dat | Dat don thanh cong va tai lai trang | Don van ton tai; khong tao don trung | [ ] |

## G. Lich su don hang

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| HIS-01 | Da dang nhap | Mo `Don hang` | Hien cac don cua tai khoan hien tai | [ ] |
| HIS-02 | Chua co don | Dung tai khoan moi mo lich su | Hien thong bao chua co don hang | [ ] |
| HIS-03 | Co nhieu don | Tao hoac dung nhieu don | Don hien dung ma, ngay, san pham, tong tien, trang thai | [ ] |
| HIS-04 | Khac tai khoan | Dang nhap tai khoan B | Khong hien don cua tai khoan A | [ ] |
| HIS-05 | Don QR | Dat don bang QR, dong modal QR | Don van hien trong lich su | [ ] |

## H. Form lien he

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| CON-01 | Du lieu hop le | Nhap ho ten, email, chu de, noi dung va gui | Hien thong bao gui thanh cong, form duoc xoa | [ ] |
| CON-02 | Thieu ho ten | De trong ho ten va gui | Hien thong bao loi, khong goi API thanh cong | [ ] |
| CON-03 | Thieu email | De trong email va gui | Hien thong bao loi | [ ] |
| CON-04 | Thieu noi dung | De trong noi dung va gui | Hien thong bao loi | [ ] |
| CON-05 | Email sai | Nhap email sai dinh dang | Yeu cau sua email hoac API tu choi | [ ] |
| CON-06 | Ky tu dac biet | Nhap HTML/script trong noi dung | Du lieu duoc xu ly an toan, khong thuc thi script | [ ] |

## I. Kiem thu loi va kha nang phuc hoi

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| ERR-01 | Dung backend, tai lai trang | Trang hien thong bao loi than thien, khong bi treo vo han | [ ] |
| ERR-02 | Mo trang voi DevTools > Network, gia lap Offline | Hien loi tai du lieu; khong mat du lieu local khong lien quan | [ ] |
| ERR-03 | Dang san pham, tam thoi ngat mang khi dat | Hien dat hang that bai; nut dat hang hoat dong lai; khong tao don gia | [ ] |
| ERR-04 | Goi lai request dat hang sau khi da thanh cong | Khong tao don trung neu nguoi dung bam lai | [ ] |
| ERR-05 | Xoa localStorage token va tai lai | Nguoi dung tro ve trang thai chua dang nhap | [ ] |
| ERR-06 | Nhap chuoi rat dai vao ten, dia chi, ghi chu | Giao dien khong vo; API xu ly loi neu vuot gioi han | [ ] |

## Tieu chi Pass/Fail

- **Pass:** Ket qua thuc te khop ket qua mong doi, khong co loi Console/Network bat thuong.
- **Fail:** Sai ket qua mong doi, mat du lieu, tao don trung, tinh sai tien, tru sai kho, hoac lam vo giao dien.
- Khi ghi Fail, can luu:
  - ID test case.
  - Cac buoc tai hien loi.
  - Ket qua thuc te.
  - Anh chup man hinh.
  - Loi trong Console/Network neu co.
  - Du lieu tai khoan, ma san pham va ma don lien quan.
