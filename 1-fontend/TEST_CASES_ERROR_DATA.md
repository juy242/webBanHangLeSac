# Test Cases - Kiem thu Loi va Du lieu LESAC

## 1. Thong tin test

- Backend: `http://localhost:4000`
- Trang khach: `http://localhost:4000/index.html`
- Trang admin: `http://localhost:4000/admin.html`
- Cong cu: DevTools Console/Network, PowerShell, trinh soan thao JSON.
- Luon sao luu thu muc `2-backend/data/` truoc khi test file JSON.
- Khong chay cac case sua/hong file tren du lieu that.

## 2. Smoke test xu ly loi

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| ERR-SMK-01 | Mo trang khi backend dang chay | Trang tai thanh cong, du lieu hien binh thuong | [ ] |
| ERR-SMK-02 | Goi `/api/unknown` | Tra JSON 404, khong hien HTML loi | [ ] |
| ERR-SMK-03 | Nhap du lieu sai vao form dang ky/dat hang | Hien thong bao loi, khong tao du lieu | [ ] |
| ERR-SMK-04 | Tat backend, tai lai trang | Hien loi ket noi than thien, khong treo vo han | [ ] |
| ERR-SMK-05 | Bat lai backend sau loi ket noi | Tai lai trang co the khoi phuc du lieu | [ ] |
| ERR-SMK-06 | Kiem tra terminal sau request loi | Server van chay va nhan request tiep theo | [ ] |

## 3. Loi HTTP va API

| ID | Endpoint / du lieu | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| API-01 | API khong ton tai | Goi `GET /api/not-found` | HTTP 404, JSON co truong `error` | [ ] |
| API-02 | ID san pham khong ton tai | Goi `GET /api/products/999999` | HTTP 404, khong tra san pham rong nham | [ ] |
| API-03 | ID khong phai so | Goi `GET /api/products/abc` | HTTP 404, server khong crash | [ ] |
| API-04 | Method sai | Gui POST den API GET public | HTTP 404/405 phu hop, khong ghi du lieu | [ ] |
| API-05 | JSON sai | Gui body JSON khong hop le | HTTP 400 hoac loi co kiem soat; server van chay | [ ] |
| API-06 | Body rong | Gui request POST voi body rong | Tra 400 neu truong bat buoc thieu | [ ] |
| API-07 | Content-Type sai | Gui object voi Content-Type khong phu hop | Xu ly loi ro rang, khong ghi ban ghi hong | [ ] |
| API-08 | Query sai min/max | Goi products voi `min=abc`, `max=xyz` | Khong lam server crash; ket qua phai duoc quy dinh ro | [ ] |
| API-09 | Query am | Goi products voi `min=-1`, `max=-1` | Ket qua khong gay loi; ghi nhan neu du lieu khong hop ly duoc chap nhan | [ ] |
| API-10 | Query rat dai | Goi search voi chuoi rat dai | API phan hoi co kiem soat, khong treo server | [ ] |
| API-11 | Request lap | Gui cung request POST nhieu lan | Ket qua khong tao du lieu trung ngoai tru khi nghiep vu cho phep | [ ] |
| API-12 | Request dong thoi | Gui nhieu request cap nhat cung ban ghi | Du lieu cuoi nhat nhat quan, JSON van hop le | [ ] |
| API-13 | Loi 500 | Tao loi du lieu co the gay exception | Response 500 co thong bao chung, khong lo stack trace | [ ] |
| API-14 | Header loi | Gui Authorization/Content-Type sai | API tra 4xx, khong tiet lo thong tin noi bo | [ ] |

## 4. Du lieu nhap dang ky va dang nhap

| ID | Du lieu test | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| DATA-AUTH-01 | Thieu name/username/password | Gui dang ky thieu tung truong | HTTP 400, khong tao tai khoan | [ ] |
| DATA-AUTH-02 | Mat khau 0/1/2 ky tu | Dang ky mat khau ngan | HTTP 400, khong ghi accounts | [ ] |
| DATA-AUTH-03 | Username trung | Dang ky username da ton tai | HTTP 409, khong tao ban ghi thu hai | [ ] |
| DATA-AUTH-04 | Chuoi rong/co khoang trang | Nhap truong chi gom khoang trang | Khong coi la du lieu hop le | [ ] |
| DATA-AUTH-05 | Unicode | Nhap ten va mat khau tieng Viet/Unicode | Luu va dang nhap lai dung | [ ] |
| DATA-AUTH-06 | HTML/script | Nhap script vao name/username | Khong thuc thi script khi hien giao dien | [ ] |
| DATA-AUTH-07 | Kieu du lieu sai | Gui password la array/object/null | HTTP 400 hoac tu choi; khong crash | [ ] |
| DATA-AUTH-08 | Login thieu truong | Dang nhap chi co username hoac password | HTTP 400 | [ ] |
| DATA-AUTH-09 | Login sai | Sai password/username | HTTP 401, khong tra token | [ ] |
| DATA-AUTH-10 | User bi khoa | Dang nhap user active=false | HTTP 403, thong bao tai khoan bi khoa | [ ] |

## 5. Du lieu nhap san pham va danh muc

| ID | Du lieu test | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| DATA-PROD-01 | Ten rong | Tao san pham thieu ten | HTTP 400, khong tao san pham | [ ] |
| DATA-PROD-02 | Gia am | Tao/sua voi price am | Khong luu gia am hoac bi tu choi | [ ] |
| DATA-PROD-03 | Gia chu | Gui price la chu | Khong tinh thanh gia 0 mot cach im lang neu du lieu khong hop le | [ ] |
| DATA-PROD-04 | Cost price sai | Gui cost_price am/chu | Khong lam sai loi nhuan; hien loi phu hop | [ ] |
| DATA-PROD-05 | Colors rong | Tao san pham colors=[] | He thong dung mau mac dinh hoac tu choi co thong bao | [ ] |
| DATA-PROD-06 | Stock am | Gui stockByColor co gia tri am | Ton am bi chan/chuyen ve 0 theo quy tac | [ ] |
| DATA-PROD-07 | Stock chu | Gui stockByColor co gia tri chu | Khong tao tong ton sai | [ ] |
| DATA-PROD-08 | ID sai | Sua/xoa san pham khong ton tai | HTTP 404, du lieu cu khong doi | [ ] |
| DATA-PROD-09 | Slug trung | Tao danh muc co slug da co | HTTP 409, khong tao ban ghi trung | [ ] |
| DATA-PROD-10 | Slug ky tu la | Tao slug co HTML/script | Hien thi an toan, khong thuc thi script | [ ] |
| DATA-PROD-11 | Mo ta dai | Nhap mo ta rat dai | Giao dien khong vo, du lieu luu dung hoac bi gioi han | [ ] |
| DATA-PROD-12 | Anh khong ton tai | Nhap URL anh sai | Bang khong vo; hien trang thai anh loi phu hop | [ ] |
| DATA-PROD-13 | Bulk rong | Gui bulk khong phai array | API xu ly theo quy tac, khong lam mat data ngoai y muon | [ ] |
| DATA-PROD-14 | Bulk sai kieu | Gui object/string thay cho danh sach | HTTP 400 hoac ket qua duoc kiem soat | [ ] |

## 6. Du lieu nhap dat hang

| ID | Du lieu test | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| DATA-ORD-01 | Items rong | Gui order voi `items: []` | HTTP 400 `Gio hang trong` | [ ] |
| DATA-ORD-02 | Items khong phai array | Gui items la object/string | HTTP 400, khong tao don | [ ] |
| DATA-ORD-03 | Product ID sai | Gui item voi id khong ton tai | HTTP 400, khong tru ton kho | [ ] |
| DATA-ORD-04 | Quantity 0 | Gui quantity=0 | HTTP 400, khong tao don | [ ] |
| DATA-ORD-05 | Quantity am | Gui quantity am | HTTP 400, khong tao don | [ ] |
| DATA-ORD-06 | Quantity chu | Gui quantity la chu | Khong cho qua du lieu khong hop le | [ ] |
| DATA-ORD-07 | Quantity thap phan | Gui quantity=1.5 | He thong tu choi hoac ap dung quy tac lam tron ro rang | [ ] |
| DATA-ORD-08 | Trung dong cung mau | Gui hai dong cung product/color | Tong quantity duoc cong va kiem tra ton dung | [ ] |
| DATA-ORD-09 | Ton khong du | Dat lon hon stock | HTTP 400, ton kho khong doi | [ ] |
| DATA-ORD-10 | Ten ngan | Gui name 1 ky tu | HTTP 400 | [ ] |
| DATA-ORD-11 | Dien thoai sai | Gui thieu so, co chu, sai prefix | HTTP 400 | [ ] |
| DATA-ORD-12 | Email sai | Gui email thieu @/domain | HTTP 400 | [ ] |
| DATA-ORD-13 | Address rong | Gui address rong/null | HTTP 400 | [ ] |
| DATA-ORD-14 | Note dai/script | Gui ghi chu dai hoac co script | Luu an toan, khong XSS, khong crash | [ ] |
| DATA-ORD-15 | Payment sai | Gui paymentMethod tuy y | He thong dung gia tri mac dinh/quy tac, khong tin gia tri nguy hiem | [ ] |
| DATA-ORD-16 | Request trung | Gui lai cung order request | Kiem tra khong tao don trung ngoai y muon | [ ] |

## 7. Du lieu JSON va file storage

> Sao luu `2-backend/data/` truoc khi thuc hien nhom test nay.

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| FILE-01 | Doi ten tam mot file data | Server tu tao file rong neu file bi thieu; ghi nhan du lieu co bi mat theo thiet ke | [ ] |
| FILE-02 | Tao file JSON rong | Tai API tuong ung | Server khong crash; API tra mang rong hoac loi duoc thong bao ro | [ ] |
| FILE-03 | Tao file JSON khong hop le | Chen ky tu sai JSON, tai API | Server van chay; khong tra stack trace; phai canh bao nguy co du lieu bi coi la rong | [ ] |
| FILE-04 | JSON la object thay vi array | Ghi object vao file products/orders/accounts | API khong crash; xu ly sai kieu du lieu co thong bao/bao loi | [ ] |
| FILE-05 | JSON co field thieu | Xoa mot so field cua san pham/don | Giao dien/API khong crash; hien gia tri mac dinh hop ly | [ ] |
| FILE-06 | JSON co null | Dat null cho price, quantity, items | Khong tinh NaN/undefined tren giao dien va dashboard | [ ] |
| FILE-07 | JSON co so am | Dat quantity/price am | He thong khong hien du lieu nghiep vu sai | [ ] |
| FILE-08 | Ky tu Unicode | Luu ten/mo ta tieng Viet co dau | Doc/ghi khong loi ma hoa | [ ] |
| FILE-09 | Ky tu script | Luu script trong name/desc/message | Khi hien thi khong thuc thi script | [ ] |
| FILE-10 | File khong co quyen ghi | Dat file read-only trong moi truong test | API tra loi loi luu co kiem soat; khong bao thanh cong gia | [ ] |
| FILE-11 | Ghi dong thoi | Gui nhieu request ghi cung file | File van la JSON hop le, khong mat ngau nhien neu nghiep vu yeu cau | [ ] |
| FILE-12 | Khoi dong lai server | Ghi du lieu, stop/start server | Du lieu hop le van con sau restart | [ ] |
| FILE-13 | Data dir khong ton tai | Doi ten thu muc data, khoi dong server | Thu muc/file can thiet duoc tao hoac co thong bao loi ro | [ ] |
| FILE-14 | Khoi phuc backup | Phuc hoi data tu backup sau test | Cac API hien lai du lieu ban dau | [ ] |

## 8. Loi mang va giao dien

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| UI-ERR-01 | DevTools > Network > Offline khi tai trang | Hien thong bao khong tai duoc du lieu, khong treo | [ ] |
| UI-ERR-02 | Ngat mang khi dang tim kiem | Giao dien van phan hoi; khong xoa danh sach sai | [ ] |
| UI-ERR-03 | Ngat mang khi luu gio hang | Hien loi; gio hang local khong bi xoa sai | [ ] |
| UI-ERR-04 | Ngat mang khi dat hang | Hien that bai; nut dat hang mo lai; khong tao don gia | [ ] |
| UI-ERR-05 | Ngat mang khi admin luu | Hien that bai; khong cap nhat giao dien nhu da luu | [ ] |
| UI-ERR-06 | API cham | Gui request va cho lau | Co trang thai loading/disable phu hop, khong tao request trung | [ ] |
| UI-ERR-07 | Response khong phai JSON | Gia lap response HTML/empty | Frontend hien loi co kiem soat, khong crash | [ ] |
| UI-ERR-08 | Reload sau loi | Sua ket noi, tai lai trang | Du lieu tai lai binh thuong | [ ] |
| UI-ERR-09 | Console | Thuc hien cac case loi | Khong co loi unhandled promise/TypeError khong giai thich | [ ] |
| UI-ERR-10 | Mobile | Thuc hien loi validation tren man hinh nho | Thong bao khong bi cat/che nut va form van dung | [ ] |

## 9. Boundary va hieu nang co ban

| ID | Du lieu / dieu kien | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| BOUND-01 | So luong 1 | Dat 1 san pham | Xu ly thanh cong neu con ton | [ ] |
| BOUND-02 | So luong bang ton | Dat dung ton kho | Ton ve 0, don thanh cong | [ ] |
| BOUND-03 | So luong lon | Dat so luong rat lon | Bi tu choi nhanh, khong treo server | [ ] |
| BOUND-04 | Gia 0 | Tao san pham gia 0 | Hien hanh vi ro rang; khong tinh sai doanh thu | [ ] |
| BOUND-05 | Gia rat lon | Tao san pham gia lon | Khong tran so/tinh sai dinh dang tien | [ ] |
| BOUND-06 | Danh sach lon | Nap nhieu san pham/don trong moi truong test | Trang van tai duoc trong thoi gian chap nhan | [ ] |
| BOUND-07 | Search ky tu dac biet | Tim kiem `%`, `_`, quote, emoji | Khong loi query/XSS; ket qua on dinh | [ ] |
| BOUND-08 | Date loi | Dat date sai trong JSON orders | Dashboard khong crash; sap xep co xu ly phu hop | [ ] |
| BOUND-09 | ID trung | Tao du lieu co ID trung | Khong cap nhat/xoa nham ban ghi | [ ] |
| BOUND-10 | Tong ton lon | Nhieu mau co tong ton lon | Tong tinh dung, khong NaN/Infinity | [ ] |

## 10. Tieu chi Pass/Fail

### Pass

- Request sai duoc tra loi bang status code va thong bao phu hop.
- Loi client khong lam server crash.
- Loi luu khong hien thong bao thanh cong gia.
- Don loi khong tru ton va khong tao ban ghi khong day du.
- File JSON sau thao tac van hop le va du lieu khong bi mat ngoai y muon.
- Du lieu null/thieu field khong lam giao dien hien `NaN`, `undefined` hoac crash.
- Input script/HTML khong duoc thuc thi.
- Sau khi phuc hoi ket noi/restart, he thong tai lai du lieu dung.

### Fail

Danh dau Fail neu co mot trong cac loi sau:

- Server dung sau mot request sai.
- API tra 200 cho du lieu khong hop le va ghi du lieu hong.
- Dat hang that bai nhung ton kho van bi tru.
- File JSON bi rong/hong ma giao dien khong canh bao, lam nguoi dung tuong du lieu da bi xoa.
- Loi save nhung giao dien hien da luu thanh cong.
- XSS thuc thi qua ten, mo ta, ghi chu hoac lien he.
- Gia tri am, NaN, Infinity hien trong tien/tong ton.
- Request lap tao don, user, san pham hoac ban ghi trung.

Khi bao loi, ghi ma test, endpoint, method, status code, request body da an thong tin nhay cam, response, log server, file data truoc/sau va anh chup man hinh. Luon phuc hoi backup data sau khi test file.
