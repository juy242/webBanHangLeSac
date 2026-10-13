// Lớp truy cập dữ liệu: kết nối backend API (JSON file storage).
// Chiến lược: nạp dữ liệu 1 lần vào bộ nhớ đệm (cache) khi khởi động, các hàm
// get* đọc cache đồng bộ (giữ nguyên API cũ), save* cập nhật cache rồi ghi bất
// đồng bộ lên API. Cart + session/token vẫn nằm localStorage (trạng thái trình duyệt).

const API_BASE = ''; // cùng origin (server phục vụ cả API lẫn frontend)

const TOKEN_KEY = 'LESAC_TOKEN';
const SESSION_KEY = 'LESAC_USER_SESSION';
const CART_KEY = 'LESAC_CART';

// Thông tin ngân hàng dùng để sinh mã VietQR khi thanh toán chuyển khoản
const BANK_CONFIG = {
    id: 'MB',
    accountNo: '0987654321',
    accountName: 'LESAC PREMIUM SHOP'
};

/* ---------- Fetch wrapper ---------- */
async function apiFetch(path, { method = 'GET', body, auth = true } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
        const token = getToken();
        if (token) headers['Authorization'] = 'Bearer ' + token;
    }
    let res;
    try {
        res = await fetch(API_BASE + path, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined
        });
    } catch (e) {
        throw new Error('Không thể kết nối máy chủ. Vui lòng kiểm tra backend.');
    }
    let data = null;
    try { data = await res.json(); } catch (e) { /* body rỗng */ }
    if (!res.ok) {
        const msg = (data && data.error) ? data.error : `Lỗi máy chủ (${res.status})`;
        const err = new Error(msg);
        err.status = res.status;
        throw err;
    }
    return data;
}

/* ================= Bộ nhớ đệm (cache) ================= */
const _cache = {
    products: [],
    categories: [],
    collections: [],
    orders: [],
    ready: false
};

// Nạp toàn bộ dữ liệu dùng chung từ API khi khởi động
async function initData() {
    const [products, categories, collections] = await Promise.all([
        apiFetch('/api/products'),
        apiFetch('/api/categories'),
        apiFetch('/api/collections')
    ]);
    _cache.products = products;
    _cache.categories = categories;
    _cache.collections = collections;
    _cache.orders = [];
    // Đơn hàng cần đăng nhập; khách vãng lai bỏ qua (không làm hỏng trang)
    try {
        _cache.orders = await apiFetch('/api/orders');
    } catch (e) {
        _cache.orders = [];
    }
    _cache.ready = true;
}

/* ================= Phiên / Token (localStorage) ================= */
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}
function saveSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}
function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
}
function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
}

/* ================= Giỏ hàng (localStorage + đồng bộ theo tài khoản) ================= */
function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
}
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    syncCartToServer(cart); // đăng nhập thì lưu lên server (fire-and-forget)
}
function clearCart() {
    localStorage.removeItem(CART_KEY);
    if (getToken()) syncCartToServer([]);
}

// Lưu giỏ hàng lên server theo tài khoản hiện tại (bỏ qua nếu chưa đăng nhập)
async function syncCartToServer(cart) {
    if (!getToken()) return;
    try {
        await apiFetch('/api/cart', { method: 'POST', body: { items: cart || [] } });
    } catch (e) { /* không chặn luồng nếu lỗi */ }
}

// Nạp giỏ hàng từ server (chỉ khi đã đăng nhập); trả về false nếu chưa đăng nhập
async function loadCartFromServer() {
    if (!getToken()) return false;
    try {
        const items = await apiFetch('/api/cart');
        if (Array.isArray(items) && items.length) {
            localStorage.setItem(CART_KEY, JSON.stringify(items));
            return true;
        }
    } catch (e) { /* bỏ qua */ }
    return false;
}

/* ================= Sản phẩm ================= */
function getProducts() {
    return _cache.products;
}
function getProduct(id) {
    return _cache.products.find(p => p.id === Number(id)) || null;
}
async function saveProducts(products) {
    _cache.products = products;
    return apiFetch('/api/admin/products/bulk', { method: 'POST', body: { bulk: products } });
}

// Tổng tồn kho của sản phẩm (theo stockByColor nếu có, ngược lại quantity cũ)
function totalQuantity(product) {
    const stock = product.stockByColor;
    if (stock && typeof stock === 'object') {
        return Object.values(stock).reduce((s, n) => s + (Number(n) || 0), 0);
    }
    return Number(product.quantity) || 0;
}

// Tồn kho của 1 màu cụ thể (0 nếu không có)
function colorStock(product, color) {
    const stock = product.stockByColor;
    if (stock && typeof stock === 'object') {
        return Number(stock[color]) || 0;
    }
    return Number(product.quantity) || 0;
}

/* ================= Danh mục sản phẩm ================= */
function getCategories() {
    return _cache.categories;
}
async function saveCategories(categories) {
    _cache.categories = categories;
    return apiFetch('/api/admin/categories', { method: 'POST', body: { bulk: categories } });
}
// Trả về tên hiển thị của danh mục theo slug
function categoryName(slug) {
    const cat = getCategories().find(c => c.slug === slug);
    return cat ? cat.name : (slug || 'Chưa phân loại');
}

/* ================= Bộ sưu tập ================= */
function getCollections() {
    return _cache.collections;
}
async function saveCollections(collections) {
    _cache.collections = collections;
    return apiFetch('/api/admin/collections', { method: 'POST', body: { bulk: collections } });
}
// Trả về tên bộ sưu tập theo id
function collectionName(id) {
    const col = getCollections().find(c => c.id === id);
    return col ? col.name : 'Không thuộc BST';
}

/* ================= Đơn hàng ================= */
function getOrders() {
    return _cache.orders;
}
async function saveOrders(orders) {
    _cache.orders = orders;
    return apiFetch('/api/admin/orders', { method: 'POST', body: { bulk: orders } });
}

/* ================= Tài khoản / Auth ================= */
async function getAccounts() {
    return apiFetch('/api/auth/me');
}
async function saveAccounts(accounts) {
    return apiFetch('/api/auth/register', { method: 'POST', body: accounts });
}