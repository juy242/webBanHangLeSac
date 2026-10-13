# Test Cases - Dat Hang LESAC

## 1. Thong tin test

- URL: `http://localhost:4000/index.html`
- Tai khoan: mot tai khoan khach hang hop le.
- San pham can chuan bi:
  - San pham A con it nhat 5 san pham trong kho.
  - San pham B co nhieu mau va ton kho khac nhau theo mau.
  - Mot san pham co ton kho bang 0.
- Truoc khi test, ghi lai ton kho ban dau cua san pham va mau dang test.
- Sau moi case tao don thanh cong, can huy don trong trang admin hoac dung du lieu test rieng.

## 2. Smoke test dat hang

| ID | Chuc nang | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| ORD-SMK-01 | Mo checkout | Dang nhap, them san pham A vao gio, bam dat hang | Form thong tin dat hang hien dung; danh sach san pham va tong tien dung | [ ] |
| ORD-SMK-02 | Dat COD | Dien thong tin hop le, chon thanh toan tai nha, bam dat hang | Tao don thanh cong, hien ma don va trang lich su | [ ] |
| ORD-SMK-03 | Kiem tra ton kho | Ghi ton kho truoc va sau khi dat | Ton kho giam dung bang so luong da dat | [ ] |
| ORD-SMK-04 | Dat QR | Them san pham, dien form hop le, chon thanh toan QR | Hien modal QR voi dung so tien va ma don | [ ] |
| ORD-SMK-05 | Xem lich su | Dong modal QR hoac hoan tat don COD, mo lich su | Don vua tao hien dung san pham, tong tien va trang thai | [ ] |

## 3. Dieu kien mo checkout va gio hang

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| CART-ORD-01 | Gio hang co san pham | Them san pham A, bam nut dat hang | Chuyen den khu vuc checkout | [ ] |
| CART-ORD-02 | Gio hang rong | Mo gio hang rong, bam dat hang | Khong mo checkout; hien thong bao gio hang rong | [ ] |
| CART-ORD-03 | Nhieu san pham | Them A va B voi so luong khac nhau | Checkout hien du cac dong, mau, so luong va gia | [ ] |
| CART-ORD-04 | Hai mau cung san pham | Them B mau 1 va mau 2 | Hien hai dong rieng; khong tron mau hoac ton kho | [ ] |
| CART-ORD-05 | Sua gio trong checkout | Tang/giam so luong tu gio hang roi quay lai checkout | Danh sach va tong tien cap nhat dung | [ ] |
| CART-ORD-06 | Xoa dong hang | Xoa mot san pham truoc khi dat | Dong bi xoa, tong tien cap nhat, khong gui san pham da xoa | [ ] |
| CART-ORD-07 | Tai lai checkout | Mo checkout, tai lai trang | Trang thai gio hang va tong tien duoc phuc hoi dung | [ ] |

## 4. Kiem tra thong tin nguoi nhan

| ID | Du lieu test | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| INFO-01 | Ho ten hop le | Nhap `Nguyen Van A` | Cho phep tiep tuc | [ ] |
| INFO-02 | Ho ten rong | De trong ho ten, dien cac truong con lai, dat hang | Hien loi bat buoc nhap ho ten; khong tao don | [ ] |
| INFO-03 | Ho ten 1 ky tu | Nhap `A` | Hien loi ho ten toi thieu 2 ky tu | [ ] |
| INFO-04 | Ho ten co dau | Nhap ho ten tieng Viet | Don luu dung chu co dau | [ ] |
| INFO-05 | So dien thoai dung | Nhap `0912345678` | Cho phep tiep tuc | [ ] |
| INFO-06 | So dien thoai dang +84 | Nhap `+84912345678` | Cho phep tiep tuc | [ ] |
| INFO-07 | So dien thoai 9 so | Nhap `091234567` | Hien loi so dien thoai khong hop le | [ ] |
| INFO-08 | So dien thoai 11 so | Nhap `09123456789` | Hien loi so dien thoai khong hop le | [ ] |
| INFO-09 | So dien thoai co chu | Nhap `09123abc78` | Hien loi so dien thoai khong hop le | [ ] |
| INFO-10 | Email dung | Nhap `customer@example.com` | Cho phep tiep tuc | [ ] |
| INFO-11 | Email rong | De trong email va dat hang | Hien loi bat buoc nhap email | [ ] |
| INFO-12 | Email sai | Nhap `customer@` hoac `customer.example.com` | Hien loi email khong hop le | [ ] |
| INFO-13 | Dia chi chi tiet rong | Khong nhap so nha/ten duong | Hien loi bat buoc nhap dia chi cu the | [ ] |
| INFO-14 | Chua chon tinh | Nhap dia chi chi tiet, bo trong tinh | Khong cho dat; yeu cau chon tinh/thanh pho | [ ] |
| INFO-15 | Chua chon quan | Chon tinh, bo trong quan | Khong cho dat; yeu cau chon quan/huyen | [ ] |
| INFO-16 | Chua chon phuong | Chon tinh va quan, bo trong phuong | Khong cho dat; yeu cau chon phuong/xa | [ ] |
| INFO-17 | Dia chi day du | Nhap so nha, chon tinh, quan va phuong | Dia chi tong hop day du duoc gui len don | [ ] |
| INFO-18 | Ghi chu rong | De trong ghi chu | Van cho phep dat hang | [ ] |
| INFO-19 | Ghi chu co noi dung | Nhap yeu cau giao hang | Ghi chu duoc luu dung trong don | [ ] |
| INFO-20 | Du lieu rat dai | Nhap chuoi rat dai vao ho ten, dia chi, ghi chu | Giao dien khong vo; xu ly loi neu vuot gioi han | [ ] |

## 5. Phuong thuc thanh toan

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| PAY-01 | COD mac dinh | Mo checkout moi | `Thanh toan tai nha` duoc chon mac dinh | [ ] |
| PAY-02 | COD thanh cong | Chon COD, dien thong tin hop le, dat hang | Don luu phuong thuc `Thanh toan tai nha` | [ ] |
| PAY-03 | Chuyen khoan QR | Chon phuong thuc QR va dat hang | Don tao thanh cong, modal QR hien ra | [ ] |
| PAY-04 | QR dung tong tien | Tao don QR co nhieu san pham | So tien tren QR bang tong tien don | [ ] |
| PAY-05 | QR dung ma don | Tao don QR | Noi dung chuyen khoan co ma don dung | [ ] |
| PAY-06 | Dong modal QR | Bam dong modal QR | Gio hang duoc xoa, chuyen sang lich su don | [ ] |
| PAY-07 | Doi phuong thuc | Chuyen COD sang QR va nguoc lai truoc khi dat | Chi phuong thuc dang chon duoc gui len server | [ ] |

## 6. Tao don va tinh tien

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| CREATE-01 | Mot san pham, so luong 1 | Dat san pham A | Tong tien bang gia san pham | [ ] |
| CREATE-02 | Nhieu san pham | Dat A va B | Tong tien bang tong gia tung dong nhan so luong | [ ] |
| CREATE-03 | So luong lon hon 1 | Dat 3 san pham A | Tong tien bang gia A x 3 | [ ] |
| CREATE-04 | So sanh frontend/backend | Ghi tong tien tren checkout, dat don | Tong tien response/API va lich su khop giao dien | [ ] |
| CREATE-05 | Ma don | Dat don thanh cong | Ma don duoc tao, hien trong thong bao va lich su | [ ] |
| CREATE-06 | Xoa gio hang sau thanh cong | Dat don COD thanh cong, mo gio hang | Gio hang rong, khong the tao lai don tu gio cu | [ ] |
| CREATE-07 | Tai lai sau thanh cong | Dat don, tai lai trang | Don van nam trong lich su; khong tao don moi | [ ] |
| CREATE-08 | Dang nhap sai tai khoan | Tao don bang tai khoan A, dang nhap tai khoan B | Don chi thuoc tai khoan A | [ ] |

## 7. Ton kho va mau sac

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| STOCK-01 | Ton kho du | Dat so luong nho hon ton mau dang chon | Don thanh cong, ton mau giam dung | [ ] |
| STOCK-02 | Dat vua du ton | Dat dung so luong ton kho cua mau | Don thanh cong, ton mau ve 0 | [ ] |
| STOCK-03 | Vuot ton mau | Dat lon hon ton cua mau da chon | Don bi tu choi, hien so luong con lai | [ ] |
| STOCK-04 | San pham het hang | Mo san pham co ton 0, thu them vao gio | Khong cho them hoac khong cho dat | [ ] |
| STOCK-05 | Khac mau | Dat mau A, trong khi mau B con hang | Chi tru kho mau A; khong tru mau B | [ ] |
| STOCK-06 | Hai dong cung mau | Tao hai dong cung san pham va cung mau, tong vuot ton | Don bi tu choi theo tong so luong | [ ] |
| STOCK-07 | Hai dong cung mau du ton | Tao hai dong cung san pham va cung mau, tong khong vuot ton | Don thanh cong, tru tong dung mot lan | [ ] |
| STOCK-08 | Don that bai | Dat vuot ton kho | Ton kho khong thay doi sau khi request that bai | [ ] |
| STOCK-09 | Hai tab cung dat | Mo cung san pham tren hai tab, cung dat gan dong thoi | He thong khong de ton kho am hoac ban qua ton | [ ] |
| STOCK-10 | Huy don | Dat thanh cong, admin huy don | Ton kho duoc hoan lai dung mot lan | [ ] |

## 8. Dang nhap va phan quyen khi dat hang

| ID | Dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| AUTH-ORD-01 | Chua dang nhap | Co gio hang, mo checkout, bam dat hang | Yeu cau dang nhap; khong tao don | [ ] |
| AUTH-ORD-02 | Dang nhap tai khoan khach | Dang nhap roi dat hang hop le | Don duoc tao gan voi tai khoan dang nhap | [ ] |
| AUTH-ORD-03 | Token bi xoa | Mo checkout, xoa token roi bam dat hang | API tu choi; hien loi dang nhap | [ ] |
| AUTH-ORD-04 | Token sai | Sua token roi bam dat hang | Don khong duoc tao; ton kho khong doi | [ ] |
| AUTH-ORD-05 | Tao don khong co items | Gui request voi `items: []` | API tra loi gio hang rong | [ ] |
| AUTH-ORD-06 | Tao don khong co ten | Gui request thieu ten | API tra loi du lieu khong hop le | [ ] |
| AUTH-ORD-07 | Tao don khong co dia chi | Gui request thieu address | API tu choi; khong tao don | [ ] |

## 9. Double submit va kha nang phuc hoi

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| REC-01 | Bam nut dat hang lien tuc 5 lan | Chi tao mot don; nut bi khoa trong luc cho API | [ ] |
| REC-02 | Bam dat hang, ngat mang ngay sau do | Hien thong bao that bai; nut duoc mo lai | [ ] |
| REC-03 | Dat hang khi server 500 | Hien loi than thien; khong xoa gio hang neu chua tao don | [ ] |
| REC-04 | Refresh trong luc gui don | Khong lam server crash; kiem tra khong co don trung | [ ] |
| REC-05 | Mo lai trang sau loi | Gio hang con dung neu don chua tao thanh cong | [ ] |
| REC-06 | Gui request lai cung du lieu | Khong tu dong tao nhieu don do thao tac giao dien lap lai | [ ] |

## 10. Lich su va doi soat sau dat hang

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| HIS-ORD-01 | Dat don COD, mo lich su | Don hien trang thai `Dang xu ly` | [ ] |
| HIS-ORD-02 | Dat don QR, dong modal | Don QR hien trong lich su | [ ] |
| HIS-ORD-03 | Kiem tra san pham trong don | Mo chi tiet lich su don | Dung ten, mau, so luong va gia tai thoi diem dat | [ ] |
| HIS-ORD-04 | Kiem tra thong tin nguoi nhan | Xem chi tiet don | Dung ten, dien thoai, email, dia chi va ghi chu | [ ] |
| HIS-ORD-05 | Tai khoan khac | Dang nhap tai khoan B va mo lich su | Khong xem duoc don cua tai khoan A | [ ] |
| HIS-ORD-06 | Don bi huy | Admin huy don, quay lai trang khach | Trang thai don hien dung; khong tinh vao doanh thu neu co dashboard | [ ] |

## 11. Tieu chi Pass/Fail

### Pass

- Chi tao mot don cho mot lan dat hang thanh cong.
- Tong tien frontend, API va lich su khop nhau.
- Ton kho giam dung theo san pham va mau.
- Don loi khong lam thay doi ton kho.
- Don gan dung tai khoan dang nhap.
- COD va QR luu dung phuong thuc thanh toan.
- Thong tin nguoi nhan duoc luu day du.

### Fail

Danh dau Fail neu co mot trong cac loi sau:

- Dat hang khi chua dang nhap.
- Dat vuot ton kho hoac ton kho bi am.
- Dat hang that bai nhung van tru kho.
- Bam nhieu lan tao nhieu don trung.
- Tong tien sai.
- Mau san pham trong don khac voi mau da chon.
- Tai khoan nay xem duoc don cua tai khoan khac.
- Huy don lam hoan kho nhieu lan.

Khi bao loi, luu lai ma test, ma san pham, mau san pham, ton kho truoc/sau, tai khoan test, ma don, anh chup man hinh va request/response trong DevTools > Network.
