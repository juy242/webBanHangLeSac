# Test Cases - Kiem tra moi truong LESAC

## 1. Muc dich

Xac nhan moi truong da san sang truoc khi chay cac test case chuc nang, bao mat va du lieu.

## 2. Thong tin moi truong

- He dieu hanh: Windows.
- Thu muc project: `d:\lesac`.
- Backend: `d:\lesac\2-backend`.
- Frontend: `d:\lesac\1-fontend`.
- Port mac dinh: `4000`.
- Trinh duyet de xuat: Chrome hoac Edge moi nhat.
- Node.js va npm phai duoc cai dat va nam trong PATH.

## 3. Smoke test moi truong

| ID | Hang muc | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|---|
| ENV-SMK-01 | Node.js | Mo PowerShell, chay `node --version` | Hien phien ban Node.js, khong bao khong tim thay lenh | [ ] |
| ENV-SMK-02 | npm | Chay `npm --version` | Hien phien ban npm, khong bao `npm is not recognized` | [ ] |
| ENV-SMK-03 | Thu muc backend | Chay `cd d:\lesac\2-backend` | Cwd dung thu muc backend | [ ] |
| ENV-SMK-04 | package.json | Chay `Test-Path .\package.json` | Ket qua `True` | [ ] |
| ENV-SMK-05 | Dependencies | Chay `npm install` | Cai dat thanh cong, khong co loi blocking | [ ] |
| ENV-SMK-06 | Khoi dong server | Chay `npm start` | Terminal hien backend dang chay tai port 4000 | [ ] |
| ENV-SMK-07 | Health check | Mo `http://localhost:4000/api/health` | Tra JSON co `ok: true` va thoi gian | [ ] |
| ENV-SMK-08 | Trang khach | Mo `http://localhost:4000/index.html` | Trang LESAC tai thanh cong | [ ] |
| ENV-SMK-09 | Trang admin | Mo `http://localhost:4000/admin.html` | Trang admin tai thanh cong hoac yeu cau dang nhap admin | [ ] |
| ENV-SMK-10 | Log server | Quan sat terminal backend | Request duoc log, khong co exception khong xu ly | [ ] |

## 4. Node.js va npm

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| NODE-01 | Chay `node --version` | Node.js duoc nhan dien va co version hop le | [ ] |
| NODE-02 | Chay `npm --version` | npm duoc nhan dien va co version hop le | [ ] |
| NODE-03 | Dong mo lai PowerShell, chay lai hai lenh tren | PATH van hoat dong trong terminal moi | [ ] |
| NODE-04 | Chay `npm install` trong `2-backend` | `node_modules` va `package-lock.json` duoc tao/cap nhat dung | [ ] |
| NODE-05 | Chay `npm start` | Server khoi dong, khong loi module missing | [ ] |
| NODE-06 | Chay `npm run dev` | Server dev khoi dong va tu reload khi sua file | [ ] |
| NODE-07 | Chay lenh sai thu muc | Chay `npm start` tai `d:\lesac` | Hien loi de hieu; khong nham tuong server dang chay | [ ] |
| NODE-08 | Kiem tra package script | Mo `package.json` | Co script `start` va `dev` dung | [ ] |

## 5. Cau truc thu muc va file

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| PATH-01 | Kiem tra `d:\lesac\1-fontend` | Thu muc ton tai va co `index.html` | [ ] |
| PATH-02 | Kiem tra frontend admin | Co `admin.html` | [ ] |
| PATH-03 | Kiem tra CSS | Co `assets\css\style.css` | [ ] |
| PATH-04 | Kiem tra JavaScript | Co `js\shop.js`, `js\admin.js`, `js\storage.js`, `js\data.js` | [ ] |
| PATH-05 | Kiem tra backend entry | Co `server.js` | [ ] |
| PATH-06 | Kiem tra routes | Co cac route auth, products, categories, collections, cart, orders, contact, admin | [ ] |
| PATH-07 | Kiem tra lib | Co `auth.js`, `store.js`, `validators.js` | [ ] |
| PATH-08 | Kiem tra data | Co thu muc `2-backend\data` | [ ] |
| PATH-09 | Kiem tra seed | Co `seed.js` va chay duoc khi can khoi tao data | [ ] |
| PATH-10 | Kiem tra file test | Cac file test case nam dung trong `1-fontend` va mo duoc | [ ] |

## 6. Port va tien trinh server

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| PORT-01 | Khoi dong server khi port 4000 dang trong | Server bind thanh cong port 4000 | [ ] |
| PORT-02 | Chay them mot server tren cung port | Hien loi port dang duoc su dung, khong lam server dau tien dung | [ ] |
| PORT-03 | Dung server bang `Ctrl+C` | Tien trinh dung sach, port duoc giai phong | [ ] |
| PORT-04 | Khoi dong lai sau khi dung | Server lai phuc vu binh thuong | [ ] |
| PORT-05 | Mo trang khi server da dung | Trinh duyet hien loi ket noi, khong hien trang cu gia | [ ] |
| PORT-06 | Dung bien moi truong `PORT` | Server chay tren port duoc cau hinh neu duoc ho tro | [ ] |
| PORT-07 | Kiem tra nhieu tab | Cac tab cung truy cap dung mot backend | [ ] |

## 7. API va static frontend

| ID | Request | Ket qua mong doi | Trang thai |
|---|---|---|---|
| HTTP-01 | `GET /api/health` | HTTP 200 va JSON hop le | [ ] |
| HTTP-02 | `GET /api/products` | HTTP 200 va danh sach san pham | [ ] |
| HTTP-03 | `GET /api/categories` | HTTP 200 va danh sach danh muc | [ ] |
| HTTP-04 | `GET /api/collections` | HTTP 200 va danh sach bo suu tap | [ ] |
| HTTP-05 | `GET /index.html` | HTTP 200 va content-type HTML | [ ] |
| HTTP-06 | `GET /admin.html` | HTTP 200 va content-type HTML | [ ] |
| HTTP-07 | Tai CSS/JS trong DevTools Network | Asset tra 200, khong co 404 | [ ] |
| HTTP-08 | Tai anh san pham | Anh tai dung, khong lam vo card | [ ] |
| HTTP-09 | Goi API khong ton tai | HTTP 404 JSON, khong tra loi HTML server | [ ] |
| HTTP-10 | Kiem tra request console | Khong co CORS error khi frontend cung origin backend | [ ] |

## 8. Du lieu ban dau va seed

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| DATA-ENV-01 | Sao luu thu muc `2-backend\data` | Co ban backup truoc test | [ ] |
| DATA-ENV-02 | Mo cac file JSON | File la JSON hop le va dung cau truc mong doi | [ ] |
| DATA-ENV-03 | Kiem tra products | Co san pham co ten, gia, mau va ton kho hop le | [ ] |
| DATA-ENV-04 | Kiem tra categories | Co danh muc de test loc san pham | [ ] |
| DATA-ENV-05 | Kiem tra collections | Co bo suu tap de test trang bo suu tap | [ ] |
| DATA-ENV-06 | Kiem tra accounts | Co tai khoan admin demo; khong co password plain text cua customer | [ ] |
| DATA-ENV-07 | Chay `node seed.js` | Khong ghi de file dang co neu dung quy tac seed | [ ] |
| DATA-ENV-08 | Xoa data tren moi truong test roi chay seed | Tao lai cac file data mau | [ ] |
| DATA-ENV-09 | Restart server | Du lieu van doc duoc sau restart | [ ] |
| DATA-ENV-10 | Phuc hoi backup | Du lieu quay lai trang thai truoc test | [ ] |

## 9. Trinh duyet va giao dien

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| BROWSER-01 | Mo bang Chrome version moi | Trang hoat dong binh thuong | [ ] |
| BROWSER-02 | Mo bang Edge version moi | Trang hoat dong binh thuong | [ ] |
| BROWSER-03 | Mo DevTools Console | Khong co loi JavaScript blocking khi tai trang | [ ] |
| BROWSER-04 | Mo DevTools Network | API/asset deu co status phu hop | [ ] |
| BROWSER-05 | Xoa cache va hard reload | Trang van tai duoc day du | [ ] |
| BROWSER-06 | Mo cua so an danh | Trang tai; session cu khong bi dung lai | [ ] |
| BROWSER-07 | Chan third-party font/icon | Layout van dung chap nhan, khong crash | [ ] |
| BROWSER-08 | Kiem tra viewport mobile | Trang khong tran ngang, nut chinh van bam duoc | [ ] |

## 10. Restart va kha nang phuc hoi

| ID | Buoc thuc hien | Ket qua mong doi | Trang thai |
|---|---|---|---|
| REC-ENV-01 | Dung server, mo trang | Hien loi ket noi ro rang | [ ] |
| REC-ENV-02 | Khoi dong lai server | Trang tai lai va goi API thanh cong | [ ] |
| REC-ENV-03 | Sua mot file JS khi dung `npm run dev` | Server tu reload, khong can chay lai thu cong | [ ] |
| REC-ENV-04 | Server gap request loi | Server van phuc vu request tiep theo | [ ] |
| REC-ENV-05 | Dong terminal roi mo terminal moi | Can chay lai `npm start` de phuc vu; khong gia dinh server tu dong chay | [ ] |
| REC-ENV-06 | Restart may | Sau khi vao Windows, xac nhan quy trinh khoi dong lai server hoat dong | [ ] |
| REC-ENV-07 | Du lieu thay doi truoc restart | Thay doi da luu van con sau restart | [ ] |

## 11. Tieu chi Pass/Fail

### Pass

- Node.js/npm duoc nhan dien trong terminal moi.
- `npm install` va `npm start` chay thanh cong.
- Health check tra HTTP 200.
- Frontend, admin, CSS, JavaScript va anh tai dung.
- API khong co 404/500 bat thuong khi tai trang.
- File JSON hop le, du lieu doc duoc va khong mat sau restart.
- Server dung/khoi dong lai duoc va phuc hoi sau loi request.
- Moi truong test co backup data truoc khi sua/xoa.

### Fail

Danh dau Fail neu co mot trong cac loi sau:

- `node` hoac `npm` khong duoc nhan dien.
- Thieu dependency hoac module missing.
- Server khong bind duoc port ma khong co thong bao ro.
- `/api/health` khong tra 200.
- Frontend tai HTML nhung thieu CSS/JS/anh.
- File JSON hong lam server crash hoac lam mat du lieu ma khong canh bao.
- Server khong khoi dong lai sau khi dung.
- Du lieu thay doi bi mat sau restart.

Khi bao loi, ghi he dieu hanh, version Node/npm, thu muc dang chay lenh, lenh da chay, port, status code, log terminal va anh chup man hinh. Khong dua token/mat khau vao bao cao.
