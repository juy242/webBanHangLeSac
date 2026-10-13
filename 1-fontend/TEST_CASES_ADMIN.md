# Test Cases - Trang Admin LESAC

## 1. Thong tin test

- URL: `http://localhost:4000/admin.html`
- Tai khoan: tai khoan admin dung trong `2-backend/README.md`.
- Tai khoan khach: mot tai khoan customer rieng.
- Du lieu can chuan bi:
  - San pham con hang, sap het hang va het hang.
  - Mot san pham co it nhat hai mau.
  - It nhat mot danh muc, bo suu tap va don hang.
  - Mot lien he khach hang.
- Khong dung du lieu production khi test xoa/sua.
- Sau moi test thay doi du lieu, ghi lai du lieu truoc va sau test.

## 2. Smoke test admin

| ID | Chuc nang | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| ADM-SMK-01 | Dang nhap admin | Dang nhap admin tu trang khach | Chuyen den `admin.html` va hien dashboard | [ ] |
| ADM-SMK-02 | Tai dashboard | Tai lai trang admin | Dashboard hien day du thong ke, don gan day va ton kho sap het | [ ] |
| ADM-SMK-03 | Dieu huong | Mo tung muc tren sidebar | Dung section hien thi, tieu de header cap nhat | [ ] |
| ADM-SMK-04 | San pham | Mo quan ly san pham | Danh sach san pham hien dung, co tim kiem va thao tac sua/xoa | [ ] |
| ADM-SMK-05 | Don hang | Mo quan ly don hang | Don hien dung, co tim kiem, loc va doi trang thai | [ ] |
| ADM-SMK-06 | Dang xuat | Bam `Dang xuat` | Xoa phien va chuyen ve trang khach | [ ] |

## 3. Kiem soat truy cap va phan quyen

| ID | Dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| AUTH-ADM-01 | Chua dang nhap | Mo truc tiep `admin.html` | Bi chan va chuyen ve `index.html` | [ ] |
| AUTH-ADM-02 | Dang nhap customer | Dang nhap tai khoan khach, mo `admin.html` | Bi chan; khong hien du lieu admin | [ ] |
| AUTH-ADM-03 | Token rong | Xoa `LESAC_TOKEN`, tai lai admin | Khong truy cap duoc dashboard/API admin | [ ] |
| AUTH-ADM-04 | Token sai | Sua token trong Local Storage, tai lai admin | Bi tu choi; khong duoc coi la admin | [ ] |
| AUTH-ADM-05 | Sua role client | Sua session customer thanh admin trong Local Storage | Server van tu choi API admin | [ ] |
| AUTH-ADM-06 | Gọi API khong token | Goi `/api/admin/products` khong Authorization | API tra ve loi 401/403, khong tra du lieu | [ ] |
| AUTH-ADM-07 | Logout | Dang nhap admin, bam dang xuat, bam Back trinh duyet | Khong xem/thao tac duoc du lieu admin sau logout | [ ] |
| AUTH-ADM-08 | Session het han | Dung token het han hoac token khong hop le | Hien loi dang nhap va khong lam vo trang | [ ] |

## 4. Dashboard tong quan

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| DASH-01 | Co san pham va don | Mo dashboard | Hien tong don, so san pham, san pham sap het, doanh thu, loi nhuan | [ ] |
| DASH-02 | Doi chieu tong don | Dem so ban ghi trong `data/orders.json` | Tong don tren dashboard khop du lieu | [ ] |
| DASH-03 | Doi chieu san pham | Dem so san pham trong `data/products.json` | So san pham khop du lieu | [ ] |
| DASH-04 | San pham sap het | Tao/kiem tra san pham co tong ton <= 10 | San pham xuat hien trong danh sach sap het | [ ] |
| DASH-05 | San pham het hang | Kiem tra san pham ton = 0 | Duoc phan loai dung la het hang/sap het theo quy tac | [ ] |
| DASH-06 | Doanh thu | Doi chieu tong cac don khong bi huy | Doanh thu khong tinh don `Da huy` | [ ] |
| DASH-07 | Loi nhuan | Doi chieu gia ban - gia von x so luong | Loi nhuan hien dung | [ ] |
| DASH-08 | Don gan day | Tao nhieu don khac ngay | Hien toi da 5 don moi nhat, sap xep dung | [ ] |
| DASH-09 | Ngay hien tai | Mo dashboard | Ngay hien dung dinh dang va ngay he thong | [ ] |
| DASH-10 | Khong co du lieu | Dung bo du lieu rong trong moi truong test | Hien thong bao rong, khong loi JavaScript | [ ] |

## 5. Quan ly san pham

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| PROD-01 | Du lieu hop le | Bam them san pham, dien ten, gia von, gia ban, danh muc, chat lieu, size, anh | Tao san pham thanh cong, hien trong danh sach va trang khach | [ ] |
| PROD-02 | Ten rong | De trong ten, gui form | Form khong gui; hien loi truong bat buoc | [ ] |
| PROD-03 | Gia am | Nhap gia am | He thong tu choi hoac khong luu gia am | [ ] |
| PROD-04 | Gia khong phai so | Nhap chu vao truong gia | Hien loi validation; khong luu du lieu sai | [ ] |
| PROD-05 | Mau san pham | Them hai mau, nhap ton cho tung mau | Tong quantity bang tong ton cua cac mau | [ ] |
| PROD-06 | Them mau trung | Them lai mau da co | Khong tao dong mau trung hoac xu ly nhat quan | [ ] |
| PROD-07 | Sua san pham | Mo sua, thay ten/gia/mo ta, luu | Thay doi hien dung sau khi luu va tai lai trang | [ ] |
| PROD-08 | Sua ton theo mau | Sua stockByColor, luu | Ton tung mau va tong quantity cap nhat dung | [ ] |
| PROD-09 | Huy form | Mo form them/sua, bam huy | Modal dong; du lieu cu khong thay doi | [ ] |
| PROD-10 | Xoa san pham | Xoa san pham test, xac nhan | San pham bien mat khoi admin va trang khach | [ ] |
| PROD-11 | Huy xoa | Bam xoa, huy hop thoai | San pham van con nguyen | [ ] |
| PROD-12 | Tim theo ten | Nhap tu khoa ten | Chi hien san pham phu hop | [ ] |
| PROD-13 | Tim theo danh muc | Nhap ten danh muc | Hien dung san pham thuoc danh muc | [ ] |
| PROD-14 | Tu khoa khong ton tai | Nhap chuoi bat ky khong co ket qua | Hien thong bao khong tim thay | [ ] |
| PROD-15 | Anh loi | Nhap URL anh khong ton tai | Khong lam vo bang; hien placeholder/trang thai loi phu hop | [ ] |
| PROD-16 | Du lieu rat dai/script | Nhap HTML/script vao ten/mo ta | Khong thuc thi script; hien thi an toan | [ ] |
| PROD-17 | Refresh | Sua va luu, tai lai admin | Du lieu da luu van con dung | [ ] |

## 6. Quan ly ton kho

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| INV-01 | Loc tat ca | Mo ton kho, chon `Tat ca` | Hien toan bo san pham | [ ] |
| INV-02 | Loc sap het | Chon `Sap het (<= 10)` | Chi hien san pham ton > 0 va <= 10 | [ ] |
| INV-03 | Loc het hang | Chon `Het hang` | Chi hien san pham ton <= 0 | [ ] |
| INV-04 | Loc con hang | Chon `Con hang` | Chi hien san pham ton > 10 | [ ] |
| INV-05 | Tim ton kho | Nhap ten san pham | Ket qua loc dung | [ ] |
| INV-06 | Cap nhat theo mau | Nhap ton mau A/B va bam luu | Ton tung mau duoc luu dung; tong quantity bang tong hai mau | [ ] |
| INV-07 | Dat ve 0 | Nhap 0 cho tat ca mau | San pham hien trang thai het hang | [ ] |
| INV-08 | So am | Nhap so am | He thong chuyen ve 0 hoac tu choi; khong luu ton am | [ ] |
| INV-09 | Chu/decimal | Nhap chu hoac so thap phan | Du lieu khong hop le khong duoc luu sai | [ ] |
| INV-10 | Nut tang/giam | Bam tang/giam so luong | Gia tri thay doi dung, khong nho hon 0 | [ ] |
| INV-11 | Thong ke ton | So sanh tong quantity, san pham sap het, het hang, gia tri kho | Cac chi so khop du lieu thuc te | [ ] |
| INV-12 | Dong bo san pham | Cap nhat ton kho, mo muc san pham | So luong hien cung gia tri o ca hai muc | [ ] |
| INV-13 | Dong bo trang khach | Cap nhat ton kho ve 0 | Trang khach khong cho mua san pham do | [ ] |
| INV-14 | Loi server khi luu | Ngat backend khi bam luu | Hien loi, du lieu giao dien khong bao da luu thanh cong | [ ] |

## 7. Quan ly danh muc

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| CAT-01 | Du lieu hop le | Them ten, slug va mo ta | Danh muc tao thanh cong, co trong dropdown san pham | [ ] |
| CAT-02 | Ten rong | De trong ten | Khong cho luu | [ ] |
| CAT-03 | Slug rong | De trong slug | Khong cho luu | [ ] |
| CAT-04 | Slug trung | Tao slug da ton tai | Hien loi trung slug, khong tao ban ghi | [ ] |
| CAT-05 | Sua danh muc | Sua ten/mo ta | Danh muc cap nhat dung | [ ] |
| CAT-06 | Sua slug | Sua slug sang slug moi | San pham va dropdown xu ly dung theo thiet ke | [ ] |
| CAT-07 | Xoa danh muc rong | Xoa danh muc khong co san pham | Danh muc bi xoa | [ ] |
| CAT-08 | Xoa danh muc dang dung | Xoa danh muc co san pham | Hien canh bao; san pham duoc chuyen ve khong phan loai | [ ] |
| CAT-09 | Huy xoa | Huy hop thoai xoa | Danh muc va san pham khong thay doi | [ ] |
| CAT-10 | Doi soat dem | So sanh so san pham trong danh muc voi du lieu | So dem hien dung | [ ] |

## 8. Quan ly bo suu tap

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| COL-01 | Du lieu hop le | Them ID, ten, mo ta, anh | Bo suu tap hien trong danh sach va trang khach | [ ] |
| COL-02 | ID rong | De trong ID | Khong cho luu | [ ] |
| COL-03 | Ten rong | De trong ten | Khong cho luu | [ ] |
| COL-04 | ID trung | Tao ID da ton tai | Hien loi trung ID | [ ] |
| COL-05 | Sua bo suu tap | Sua ten/mo ta/anh | Thay doi hien dung sau khi tai lai | [ ] |
| COL-06 | Gan san pham | Mo gan san pham, chon san pham va luu | San pham hien trong bo suu tap | [ ] |
| COL-07 | Bo gan san pham | Bo chon san pham da gan, luu | San pham khong con trong bo suu tap | [ ] |
| COL-08 | Tim san pham de gan | Nhap tu khoa trong modal gan san pham | Hien dung ket qua tim kiem | [ ] |
| COL-09 | Xoa bo suu tap dang dung | Xoa bo suu tap co san pham | Hien canh bao; san pham bo lien ket bo suu tap | [ ] |
| COL-10 | Huy thao tac | Dong modal khi chua luu | Du lieu khong thay doi | [ ] |

## 9. Quan ly don hang

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| ORD-ADM-01 | Co don hang | Mo muc quan ly don | Hien ma don, khach, lien he, san pham, tong tien, trang thai | [ ] |
| ORD-ADM-02 | Tim ma don | Nhap ma don | Chi hien don phu hop | [ ] |
| ORD-ADM-03 | Tim ten khach | Nhap ten khach | Hien dung don cua khach | [ ] |
| ORD-ADM-04 | Tim so dien thoai | Nhap so dien thoai | Hien dung don lien quan | [ ] |
| ORD-ADM-05 | Loc dang xu ly | Chon `Dang xu ly` | Chi hien don dung trang thai | [ ] |
| ORD-ADM-06 | Loc dang giao | Chon `Dang giao hang` | Chi hien don dung trang thai | [ ] |
| ORD-ADM-07 | Loc hoan thanh | Chon `Hoan thanh` | Chi hien don dung trang thai | [ ] |
| ORD-ADM-08 | Loc da huy | Chon `Da huy` | Chi hien don da huy | [ ] |
| ORD-ADM-09 | Doi trang thai | Chuyen `Dang xu ly` sang `Dang giao hang` | Trang thai luu dung sau refresh | [ ] |
| ORD-ADM-10 | Hoan thanh | Chuyen don sang `Hoan thanh` | Don hien dung va doanh thu van duoc tinh | [ ] |
| ORD-ADM-11 | Huy don | Chuyen don sang `Da huy` | Don bi huy va ton kho duoc hoan lai dung mot lan | [ ] |
| ORD-ADM-12 | Huy don hai lan | Huy lai don da huy | Khong hoan kho them lan nua | [ ] |
| ORD-ADM-13 | Xoa don | Xoa don test va xac nhan | Don bi xoa khoi danh sach | [ ] |
| ORD-ADM-14 | Huy xoa | Bam xoa va huy hop thoai | Don van con nguyen | [ ] |
| ORD-ADM-15 | Don khong ton tai | Goi cap nhat/xoa ID sai | API tra loi 404; giao dien khong crash | [ ] |
| ORD-ADM-16 | Doi soat tong tien | So sanh don admin voi lich su khach | Ma, san pham, tong tien va trang thai khop nhau | [ ] |

## 10. Quan ly lien he khach hang

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| CONTACT-01 | Co lien he | Khach gui form lien he, admin mo muc lien he | Lien he hien ten, email, chu de, noi dung, ngay gui | [ ] |
| CONTACT-02 | Khong co lien he | Dung data rong | Hien thong bao chua co lien he | [ ] |
| CONTACT-03 | Xoa lien he | Xoa mot lien he | Lien he bien mat sau refresh | [ ] |
| CONTACT-04 | Xoa sai ID | Goi xoa ID khong ton tai | Hien loi phu hop, khong xoa nham ban ghi | [ ] |
| CONTACT-05 | Noi dung HTML/script | Khach gui noi dung co script | Admin khong thuc thi script khi hien thi | [ ] |
| CONTACT-06 | Loi API | Tat backend, mo muc lien he | Hien loi ket noi, giao dien khong bi treo | [ ] |

## 11. Quan ly nguoi dung

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| USER-01 | Co customer | Mo muc nguoi dung | Hien username, ten, vai tro, trang thai | [ ] |
| USER-02 | Tim nguoi dung | Nhap username/ten | Ket qua loc dung | [ ] |
| USER-03 | Khoa tai khoan | Bam khoa user dang active | Trang thai chuyen sang bi khoa | [ ] |
| USER-04 | Dang nhap user bi khoa | Dang nhap bang user vua khoa | API tu choi, thong bao tai khoan bi khoa | [ ] |
| USER-05 | Mo khoa tai khoan | Bam mo khoa user | User dang nhap lai duoc | [ ] |
| USER-06 | Doi mat khau | Chon reset password, nhap mat khau moi | Mat khau moi dung; mat khau cu khong dung | [ ] |
| USER-07 | Mat khau moi rong | Reset voi mat khau rong | Khong cho luu hoac hien loi | [ ] |
| USER-08 | Xoa user | Xoa tai khoan test | User bien mat; khong dang nhap lai duoc | [ ] |
| USER-09 | Huy xoa user | Bam xoa va huy | User van con nguyen | [ ] |
| USER-10 | Xem du lieu nhay cam | Mo danh sach user | Khong hien password/passwordHash tren giao dien | [ ] |

## 12. Responsive va kha nang phuc hoi

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| UI-ADM-01 | Mo admin o man hinh 1440px | Sidebar va bang hien day du | [ ] |
| UI-ADM-02 | Mo admin o man hinh 768px | Sidebar/menu khong che noi dung | [ ] |
| UI-ADM-03 | Mo admin o man hinh 375px | Bam menu ba gach, sidebar mo/dong dung | [ ] |
| UI-ADM-04 | Bang nhieu cot tren mobile | Cuon ngang duoc, khong vo layout | [ ] |
| UI-ADM-05 | Refresh sau CRUD | Du lieu sau them/sua/xoa van dung | [ ] |
| UI-ADM-06 | Backend ngat | Mo tung muc admin | Hien thong bao loi ket noi, khong xoa du lieu local sai | [ ] |
| UI-ADM-07 | Double click luu | Bam luu nhieu lan | Khong tao ban ghi trung hoac request gay loi | [ ] |

## 13. Tieu chi Pass/Fail

### Pass

- Chi admin hop le truy cap va thao tac duoc du lieu admin.
- Moi thao tac them, sua, xoa duoc luu dung sau refresh.
- Tong ton, doanh thu, loi nhuan va so dem khop du lieu JSON.
- Cap nhat ton theo mau khong tao ton am.
- Huy don hoan kho dung mot lan.
- Tai khoan bi khoa khong dang nhap duoc.
- Du lieu nhay cam khong bi hien tren giao dien.
- Khong co loi Console hoac request 5xx khong giai thich.

### Fail

Danh dau Fail neu co mot trong cac loi sau:

- Customer truy cap duoc admin.
- Admin dashboard tinh sai doanh thu/lợi nhuan/ton kho.
- Sua/xoa thanh cong tren giao dien nhung mat sau refresh.
- Huy don hoan kho nhieu lan hoac khong hoan kho.
- Co the luu gia tri am, du lieu script duoc thuc thi, hoac password hien tren UI.
- Tao duoc danh muc/bo suu tap trung ID/slug.
- Loi API lam trang admin bi treo hoac mat du lieu.

Khi bao loi, ghi ma test, tai khoan, ID san pham/don/user, du lieu truoc-sau, anh chup man hinh va request/response trong DevTools > Network.
