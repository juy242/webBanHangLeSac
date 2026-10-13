// Biến trạng thái toàn cục phía trang khách
let products = getProducts();
let currentProductsRender = [...products];
let cart = getCart();
let currentCategoryFilter = 'all';
let currentSearchTerm = '';
let currentPriceMin = 0;
let currentPriceMax = Infinity;
let currentUser = null;
let selectedColor = "";
let currentProduct = null;

// Khởi chạy khi tải trang khách
document.addEventListener("DOMContentLoaded", async () => {
    if (!document.getElementById('product-grid')) return; // Không phải trang khách
    try {
        await initData();
    } catch (e) {
        console.error("Lỗi tải dữ liệu:", e.message);
    }
    applyFilters(); // cập nhật currentProductsRender từ cache vừa nạp rồi render
    updateCartUI();
    checkUserSession();
    setupAuthListeners();
    initLocationSelects();
});

/* ---------- Điều hướng giữa các "section" ---------- */
function showSection(section) {
    const hero = document.getElementById('hero-section');
    const product = document.getElementById('product-section');
    const contact = document.getElementById('contact-section');
    const checkout = document.getElementById('checkout-section');
    const historySection = document.getElementById('order-history-section');
    const collectionSection = document.getElementById('collection-section');

    if (hero) hero.classList.add('hidden');
    if (product) product.classList.add('hidden');
    if (contact) contact.classList.add('hidden');
    if (checkout) checkout.classList.add('hidden');
    if (historySection) historySection.classList.add('hidden');
    if (collectionSection) collectionSection.classList.add('hidden');

    if (section === 'hero') {
        if (hero) hero.classList.remove('hidden');
        if (product) product.classList.remove('hidden');
    } else if (section === 'contact') {
        if (contact) contact.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'collection') {
        if (collectionSection) collectionSection.classList.remove('hidden');
        renderCollection();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'checkout') {
        if (checkout) checkout.classList.remove('hidden');
        renderCheckoutUI();
        window.scrollTo({ top: checkout.offsetTop - 120, behavior: 'smooth' });
    } else if (section === 'history') {
        if (historySection) historySection.classList.remove('hidden');
        renderOrderHistory();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/* ---------- Hiển thị lưới sản phẩm ---------- */
function renderProductGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    products = getProducts(); // Đồng bộ mới nhất từ admin
    grid.innerHTML = "";

    if (currentProductsRender.length === 0) {
        grid.innerHTML = `<div class="col-span-2 md:col-span-4 py-16 text-center text-sm text-gray-400">
            <i class="fa-solid fa-box-open text-3xl mb-3 block"></i>Không tìm thấy sản phẩm phù hợp.
        </div>`;
        return;
    }

    currentProductsRender.forEach(p => {
        const div = document.createElement('div');
        div.className = "group relative flex flex-col justify-between bg-white p-3 border border-gray-50 shadow-xs hover:shadow-md rounded-sm transition-all duration-300";
        div.innerHTML = productCardHTML(p);
        grid.appendChild(div);
    });
}

// HTML thẻ sản phẩm (dùng chung cho lưới sản phẩm và bộ sưu tập)
function productCardHTML(p) {
    return `
        <div class="overflow-hidden bg-gray-100 rounded-xs aspect-[4/3] relative">
            <img src="${p.img}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0">
            <button onclick="openProductDetail(${p.id})" class="absolute bottom-2 left-2 right-2 bg-black/90 text-white text-[10px] uppercase font-bold tracking-wider py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xs shadow-md cursor-pointer hover:bg-black">
                Xem chi tiết
            </button>
        </div>
        <div class="mt-4 space-y-1 flex-1 flex flex-col justify-between">
            <div>
                <h3 class="text-xs font-semibold text-gray-800 tracking-wide line-clamp-1">${p.name}</h3>
                <p class="text-[10px] text-gray-400 font-light line-clamp-2 mt-0.5">${p.desc || ''}</p>
                <div class="text-[9px] bg-gray-50 p-1.5 rounded-xs mt-2 text-gray-500 space-y-0.5">
                    <p><strong>Chất liệu:</strong> ${p.material}</p>
                    <p><strong>Size:</strong> ${p.size}</p>
                </div>
            </div>
            <div class="pt-3 text-right border-t border-gray-50 mt-2">
                <span class="text-xs font-bold text-black font-sans">${Number(p.price).toLocaleString('vi-VN')} đ</span>
            </div>
        </div>
    `;
}

/* ---------- Bộ sưu tập ---------- */
function renderCollection() {
    const grid = document.getElementById('collection-product-grid');
    if (!grid) return;
    const all = getProducts();
    const collections = getCollections();

    grid.innerHTML = '';

    const collectionProducts = all.filter(p => p.collection && getCollections().some(c => c.id === p.collection));
    const orphanBst = all.filter(p => p.category === 'bst' && !p.collection);

    if (collectionProducts.length === 0 && orphanBst.length === 0) {
        grid.innerHTML = `<div class="col-span-2 md:col-span-4 py-16 text-center text-sm text-gray-400">
            <i class="fa-solid fa-box-open text-3xl mb-3 block"></i>Chưa có sản phẩm nào trong bộ sưu tập.
        </div>`;
        return;
    }

    // Render từng bộ sưu tập
    collections.forEach(col => {
        const items = all.filter(p => p.collection === col.id);
        if (items.length === 0) return;

        const section = document.createElement('div');
        section.className = "col-span-2 md:col-span-4 mb-4";
        section.innerHTML = `
            <div class="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                ${col.img ? `<img src="${col.img}" class="w-16 h-16 object-cover rounded-sm" alt="">` : `<div class="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center text-gray-300"><i class="fa-solid fa-gem text-xl"></i></div>`}
                <div>
                    <h3 class="text-lg font-bold uppercase tracking-widest text-black">${col.name}</h3>
                    <p class="text-xs text-gray-400 font-light mt-0.5">${col.desc || ''} · <span class="text-gray-500 font-medium">${items.length} sản phẩm</span></p>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                ${items.map(p => productCardHTML(p)).join('')}
            </div>
        `;
        grid.appendChild(section);
    });

    // Sản phẩm BST còn lại chưa gán vào bộ sưu tập
    if (orphanBst.length > 0) {
        const section = document.createElement('div');
        section.className = "col-span-2 md:col-span-4 mt-4";
        section.innerHTML = `
            <h3 class="text-lg font-bold uppercase tracking-widest text-black mb-6">BST Độc quyền</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                ${orphanBst.map(p => productCardHTML(p)).join('')}
            </div>
        `;
        grid.appendChild(section);
    }
}

/* ---------- Liên hệ ---------- */
async function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
        alert("⚠️ Vui lòng nhập đầy đủ Họ và tên, Email và Nội dung liên hệ.");
        return;
    }

    try {
        await apiFetch('/api/contact', {
            method: 'POST',
            body: { name, email, subject, message }
        });
        alert(`Cảm ơn ${name}! Chúng tôi đã nhận được yêu cầu "${subject}" và sẽ phản hồi qua email ${email} trong thời gian sớm nhất.`);
        event.target.reset();
    } catch (e) {
        alert(`❌ Gửi liên hệ thất bại: ${e.message}`);
    }
}

/* ---------- Lọc sản phẩm theo danh mục ---------- */
const CATEGORY_TITLES = {
    'all': 'Tất cả sản phẩm',
    'tui': 'Tất cả các dòng túi xách',
    'tui-cheo': 'Túi đeo chéo Premium',
    'tui-vai': 'Túi kẹp nách đeo vai',
    'tui-tote': 'Túi Tote đựng laptop cỡ lớn',
    'vi': 'Các mẫu ví cao cấp',
    'vi-truyen-thong': 'Ví bóp truyền thống',
    'vi-the': 'Ví đựng thẻ Minimalist',
    'bst': 'Bộ sưu tập độc quyền giới hạn'
};

// Kiểm tra 1 sản phẩm có khớp danh mục đang chọn không
function matchCategory(p) {
    const c = currentCategoryFilter;
    if (c === 'all') return true;
    if (c === 'tui') return p.category && p.category.startsWith('tui');
    if (c === 'vi') return p.category && p.category.startsWith('vi');
    return p.category === c;
}

// Áp dụng đồng thời: danh mục + từ khóa + khoảng giá, rồi sắp xếp và render
function applyFilters() {
    products = getProducts();
    const term = currentSearchTerm.trim().toLowerCase();

    currentProductsRender = products.filter(p => {
        if (!matchCategory(p)) return false;
        if (term && !(p.name.toLowerCase().includes(term) || (p.desc || '').toLowerCase().includes(term))) return false;
        const price = Number(p.price);
        if (price < currentPriceMin || price > currentPriceMax) return false;
        return true;
    });

    // Cập nhật tiêu đề: ưu tiên hiển thị từ khóa tìm kiếm
    const title = document.getElementById('collection-title');
    if (title) {
        title.innerText = term
            ? `Kết quả cho "${currentSearchTerm.trim()}"`
            : (CATEGORY_TITLES[currentCategoryFilter] || 'Sản Phẩm');
    }

    applyCurrentSort();
    renderProductGrid();
}

// Sắp xếp danh sách đang hiển thị theo lựa chọn trong ô "Sắp xếp"
function applyCurrentSort() {
    const sortSelect = document.getElementById('sort-select');
    const type = sortSelect ? sortSelect.value : 'default';
    if (type === 'asc') {
        currentProductsRender.sort((a, b) => a.price - b.price);
    } else if (type === 'desc') {
        currentProductsRender.sort((a, b) => b.price - a.price);
    }
}

function filterProducts(category) {
    currentCategoryFilter = category;
    // Chọn danh mục thì bỏ từ khóa tìm kiếm hiện tại
    currentSearchTerm = '';
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    applyFilters();
    // Đảm bảo khu vực sản phẩm luôn được hiển thị (kể cả khi đang ở trang Liên hệ / Bộ sưu tập)
    showSection('hero');
}

// Lọc theo khoảng giá (value dạng "min-max", để trống cận là không giới hạn)
function filterByPrice(value) {
    if (!value || value === 'all') {
        currentPriceMin = 0;
        currentPriceMax = Infinity;
    } else {
        const [min, max] = value.split('-');
        currentPriceMin = min ? Number(min) : 0;
        currentPriceMax = max ? Number(max) : Infinity;
    }
    applyFilters();
}

/* ---------- Tìm kiếm sản phẩm ---------- */
function toggleMobileMenu(open) {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        if (open) menu.classList.remove('hidden');
        else menu.classList.add('hidden');
    }
}

function closeMobileMenu() {
    toggleMobileMenu(false);
}

function toggleSearch() {
    const bar = document.getElementById('search-bar');
    if (!bar) return;
    bar.classList.toggle('hidden');

    const input = document.getElementById('search-input');
    if (!bar.classList.contains('hidden')) {
        // Mở: focus vào ô nhập
        if (input) input.focus();
    } else {
        // Đóng: xóa nội dung và hiện lại toàn bộ sản phẩm
        if (input && input.value) {
            input.value = "";
            searchProducts("");
        }
    }
}

function searchProducts(term) {
    currentSearchTerm = term || '';
    // Tìm kiếm trên toàn bộ danh mục
    currentCategoryFilter = 'all';
    // Đảm bảo khu vực sản phẩm đang hiển thị
    showSection('hero');
    applyFilters();
}

/* ---------- Sắp xếp sản phẩm theo giá ---------- */
function sortProducts() {
    // Sắp xếp luôn tôn trọng các bộ lọc đang áp dụng
    applyFilters();
}

/* ---------- Giỏ hàng ---------- */
function toggleCartDrawer(open) {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    if (open) {
        drawer.classList.remove('translate-x-full');
    } else {
        drawer.classList.add('translate-x-full');
    }
}

function updateCartQty(cartKey, delta) {
    const item = cart.find(i => i.cartKey === cartKey);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.cartKey !== cartKey);
    }

    saveCart(cart);
    updateCartUI();

    const checkoutSec = document.getElementById('checkout-section');
    if (checkoutSec && !checkoutSec.classList.contains('hidden')) {
        renderCheckoutUI();
    }
}

function removeCartItem(cartKey) {
    cart = cart.filter(i => i.cartKey !== cartKey);
    saveCart(cart);
    updateCartUI();

    const checkoutSec = document.getElementById('checkout-section');
    if (checkoutSec && !checkoutSec.classList.contains('hidden')) {
        renderCheckoutUI();
    }
}

function updateCartUI() {
    const itemsContainer = document.getElementById('cart-items');
    const totalCountBadge = document.getElementById('cart-badge');
    const totalCountText = document.getElementById('cart-count');
    const totalSumText = document.getElementById('cart-total');

    if (!itemsContainer) return;
    itemsContainer.innerHTML = "";
    let totalQty = 0;
    let totalPrice = 0;

    // Trạng thái giỏ hàng trống
    if (cart.length === 0) {
        itemsContainer.innerHTML = `<div class="py-16 text-center text-gray-400">
            <i class="fa-solid fa-bag-shopping text-3xl mb-3 block"></i>
            <p class="text-xs">Giỏ hàng của bạn đang trống.</p>
        </div>`;
    }

    cart.forEach(item => {
        totalQty += item.quantity;
        totalPrice += item.price * item.quantity;

        const div = document.createElement('div');
        div.className = "flex items-center justify-between border-b border-gray-100 pb-3 gap-3";
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="w-12 h-12 object-cover rounded-sm bg-gray-50">
            <div class="flex-1 text-left">
                <h4 class="text-xs font-semibold text-gray-800 line-clamp-1">${item.name}</h4>
                <div class="flex items-center gap-1.5 mt-0.5">
                    <span class="w-3 h-3 rounded-full border border-gray-200 inline-block" style="background-color:${item.color || '#000'}"></span>
                    <p class="text-[11px] text-red-600 font-sans">${Number(item.price).toLocaleString('vi-VN')}đ</p>
                </div>
            </div>
            <div class="flex items-center space-x-2 border border-gray-200 px-2 py-0.5 rounded-sm bg-white">
                <button onclick="updateCartQty('${item.cartKey}', -1)" class="text-xs text-gray-400 hover:text-black cursor-pointer px-1">-</button>
                <span class="text-xs font-bold font-sans w-4 text-center">${item.quantity}</span>
                <button onclick="updateCartQty('${item.cartKey}', 1)" class="text-xs text-gray-400 hover:text-black cursor-pointer px-1">+</button>
            </div>
            <button onclick="removeCartItem('${item.cartKey}')" title="Xóa khỏi giỏ" class="text-gray-300 hover:text-red-500 cursor-pointer px-1"><i class="fa-solid fa-trash-can text-xs"></i></button>
        `;
        itemsContainer.appendChild(div);
    });

    if (totalCountBadge) totalCountBadge.innerText = totalQty;
    if (totalCountText) totalCountText.innerText = totalQty;
    if (totalSumText) totalSumText.innerText = totalPrice.toLocaleString('vi-VN') + " đ";
}

function goToCheckout() {
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }
    toggleCartDrawer(false);
    showSection('checkout');
}

/* ---------- Trang thanh toán ---------- */
function renderCheckoutUI() {
    const listContainer = document.getElementById('checkout-items-list');
    const subtotalText = document.getElementById('checkout-subtotal');
    const totalText = document.getElementById('checkout-total-bill');

    if (!listContainer) return;
    listContainer.innerHTML = "";
    let totalBill = 0;

    cart.forEach(item => {
        totalBill += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = "flex items-center justify-between gap-4 bg-white p-3 rounded-xs border border-gray-100 shadow-xs";
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="relative">
                    <img src="${item.img}" alt="${item.name}" class="w-14 h-14 object-cover rounded-sm border border-gray-100">
                    <span class="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-sans font-bold">${item.quantity}</span>
                </div>
                <div>
                    <h4 class="text-xs font-bold text-gray-800">${item.name}</h4>
                    <p class="text-[11px] text-gray-400 mt-0.5">Số lượng: ${item.quantity}</p>
                </div>
            </div>
            <span class="text-xs font-bold text-gray-900 font-sans">VND ${(item.price * item.quantity).toLocaleString('vi-VN')}</span>
        `;
        listContainer.appendChild(div);
    });

    if (subtotalText) subtotalText.innerText = totalBill.toLocaleString('vi-VN') + " VND";
    if (totalText) totalText.innerText = totalBill.toLocaleString('vi-VN') + " VND";
}

// Bỏ dấu tiếng Việt (dùng cho nội dung chuyển khoản QR)
function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/[^a-zA-Z0-9 ]/g, "");
    return str.trim();
}

async function submitOrder() {
    const nameInput = document.getElementById('checkout-fullname');
    const phoneInput = document.getElementById('checkout-userphone');
    const addressInput = document.getElementById('checkout-useraddress');
    const methodInput = document.querySelector('input[name="payment-method"]:checked');

    if (!nameInput || !phoneInput || !addressInput || !methodInput) return;

    const emailInput = document.getElementById('checkout-useremail');
    const noteInput = document.getElementById('checkout-note');

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    const email = emailInput ? emailInput.value.trim() : "";
    const note = noteInput ? noteInput.value.trim() : "";
    const method = methodInput.value;

    // --- Kiểm tra hợp lệ form Thông tin đặt hàng ---
    if (cart.length === 0) {
        alert("⚠️ Giỏ hàng đang trống, không thể đặt hàng!");
        return;
    }

    // Họ và tên: bắt buộc, tối thiểu 2 ký tự
    if (name.length < 2) {
        alert("⚠️ Vui lòng nhập Họ và tên hợp lệ (ít nhất 2 ký tự)!");
        nameInput.focus();
        return;
    }

    // Số điện thoại: bắt buộc + đúng định dạng Việt Nam (10 số, bắt đầu bằng 0, hoặc +84)
    if (!phone) {
        alert("⚠️ Vui lòng nhập Số điện thoại!");
        phoneInput.focus();
        return;
    }
    const phoneRegex = /^(0\d{9}|\+84\d{9})$/;
    if (!phoneRegex.test(phone.replace(/[\s.]/g, ''))) {
        alert("⚠️ Số điện thoại không hợp lệ!\nVui lòng nhập 10 số bắt đầu bằng 0 (ví dụ: 0912345678).");
        phoneInput.focus();
        return;
    }

    // Email: bắt buộc + đúng định dạng
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        alert("⚠️ Vui lòng nhập Email!");
        if (emailInput) emailInput.focus();
        return;
    }
    if (!emailRegex.test(email)) {
        alert("⚠️ Email không hợp lệ! Vui lòng kiểm tra lại (ví dụ: ten@gmail.com).");
        if (emailInput) emailInput.focus();
        return;
    }

    // Địa chỉ: bắt buộc (số nhà + chọn đủ Tỉnh/Quận/Phường)
    const provEl = document.getElementById('select-province');
    const distEl = document.getElementById('select-district');
    const wardEl = document.getElementById('select-ward');
    const detailEl = document.getElementById('checkout-detail-address');

    if (detailEl && !detailEl.value.trim()) {
        alert("⚠️ Vui lòng nhập địa chỉ cụ thể (số nhà, tên đường)!");
        detailEl.focus();
        return;
    }
    if ((provEl && !provEl.value) || (distEl && !distEl.value) || (wardEl && !wardEl.value)) {
        alert("⚠️ Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã!");
        if (provEl && !provEl.value) provEl.focus();
        else if (distEl && !distEl.value) distEl.focus();
        else if (wardEl) wardEl.focus();
        return;
    }
    if (!address) {
        alert("⚠️ Địa chỉ nhận hàng không hợp lệ, vui lòng kiểm tra lại!");
        return;
    }

    if (!currentUser) {
        alert("⚠️ Vui lòng đăng nhập để đặt hàng!");
        return;
    }

    let totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Chặn double-submit: disable nút trong lúc chờ API, bỏ guard ngay đầu
    const submitBtn = document.getElementById('btn-submit-order');
    if (submitBtn && submitBtn.disabled) return;
    if (submitBtn) submitBtn.disabled = true;

    try {
        const items = cart.map(item => ({
            id: item.id,
            quantity: item.quantity,
            color: item.color
        }));

        const response = await apiFetch('/api/orders', {
            method: 'POST',
            body: {
                items: items,
                name: name,
                phone: phone,
                email: email,
                address: address,
                note: note,
                paymentMethod: method
            }
        });

        const orderId = response.orderId || (response.order && response.order.id);

        // Làm mới cache để lịch sử đơn hàng hiển thị đơn mới
        try {
            await initData();
        } catch (e) {
            console.error("Lỗi làm mới dữ liệu:", e.message);
        }

        // Đơn đã tạo: xóa giỏ ngay để chặn việc bấm "Đặt hàng" lần nữa tạo đơn trùng
        cart = [];
        clearCart();
        updateCartUI();

        if (method === 'qr') {
            const cleanDesc = removeVietnameseTones(`${orderId} KH ${name}`);
            const qrUrl = `https://img.vietqr.io/image/${BANK_CONFIG.id}-${BANK_CONFIG.accountNo}-compact2.jpg?amount=${totalAmount}&addInfo=${encodeURIComponent(cleanDesc)}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`;

            const qrImg = document.getElementById('qr-image');
            const qrAmt = document.getElementById('qr-amount-text');
            const qrDesc = document.getElementById('qr-desc-text');

            if (qrImg) qrImg.src = qrUrl;
            if (qrAmt) qrAmt.innerText = totalAmount.toLocaleString('vi-VN') + " đ";
            if (qrDesc) qrDesc.innerText = cleanDesc;

            const modal = document.getElementById('qr-modal');
            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.remove('opacity-0'), 50);
            }
        } else {
            alert(`🎉 Đặt hàng thành công! Mã đơn hàng của bạn là #${orderId}. Cảm ơn bạn đã mua sắm tại LESAC.`);
            clearOrderForm();
            showSection('history');
        }
    } catch (e) {
        alert(`❌ Đặt hàng thất bại: ${e.message}`);
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

function closeQrModal() {
    const modal = document.getElementById('qr-modal');
    if (!modal) return;
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        clearOrderForm();
        showSection('history');
    }, 300);
}

function clearOrderForm() {
    cart = [];
    clearCart();
    updateCartUI();

    ['checkout-fullname', 'checkout-userphone', 'checkout-useremail', 'checkout-useraddress', 'checkout-note', 'checkout-detail-address'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    showSection('hero');
}

/* ---------- Đăng nhập / Đăng ký ---------- */
function openAuthModal() {
    if (currentUser) {
        if (confirm("Bạn có chắc chắn muốn đăng xuất tài khoản LESAC không?")) {
            clearSession();
            currentUser = null;
            checkUserSession();
            alert("Đã đăng xuất thành công!");
            window.location.reload();
        }
        return;
    }
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 50);
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('form-login');
    const regForm = document.getElementById('form-register');
    const loginBtn = document.getElementById('tab-login-btn');
    const regBtn = document.getElementById('tab-register-btn');

    if (!loginForm || !regForm) return;

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
        if (loginBtn) loginBtn.className = "w-1/2 pb-3 border-b-2 border-black text-black cursor-pointer";
        if (regBtn) regBtn.className = "w-1/2 pb-3 border-b-2 border-transparent text-gray-400 hover:text-black cursor-pointer";
    } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
        if (loginBtn) loginBtn.className = "w-1/2 pb-3 border-b-2 border-transparent text-gray-400 hover:text-black cursor-pointer";
        if (regBtn) regBtn.className = "w-1/2 pb-3 border-b-2 border-black text-black cursor-pointer";
    }
}

function setupAuthListeners() {
    const regForm = document.getElementById('form-register');
    const loginForm = document.getElementById('form-login');

    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const user = document.getElementById('reg-user').value;
            const pass = document.getElementById('reg-pass').value;

            try {
                const data = await apiFetch('/api/auth/register', {
                    method: 'POST',
                    body: { name: name, username: user, password: pass }
                });

                if (data.token) localStorage.setItem('LESAC_TOKEN', data.token);
                saveSession({ ...data.user });
                currentUser = { ...data.user };

                alert("✨ Đăng ký thành công!");
                loginForm.reset();
                switchAuthTab('login');
                closeAuthModal();
                checkUserSession();
            } catch (e) {
                alert(`❌ ${e.message}`);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = document.getElementById('login-user').value.trim();
            const pass = document.getElementById('login-pass').value.trim();

            try {
                const data = await apiFetch('/api/auth/login', {
                    method: 'POST',
                    body: { username: user, password: pass }
                });

                localStorage.setItem('LESAC_TOKEN', data.token);
                saveSession({ ...data.user });
                currentUser = { ...data.user };

                if (data.isAdmin) {
                    alert(`Đăng nhập thành công quyền Quản trị viên [${currentUser.name}]!`);
                    window.location.href = "admin.html";
                    return;
                }

                alert(`Chào mừng quay trở lại với LESAC!`);
                loginForm.reset();
                closeAuthModal();
                await initData(); // nạp lại đơn hàng theo tài khoản vừa đăng nhập
                const hadServerCart = await loadCartFromServer(); // nạp giỏ hàng của tài khoản
                cart = getCart();
                updateCartUI();
                checkUserSession();
                if (hadServerCart) {
                    alert('Đã khôi phục giỏ hàng của bạn.');
                }
            } catch (e) {
                alert(`❌ ${e.message}`);
            }
        });
    }
}

function checkUserSession() {
    const greeting = document.getElementById('user-greeting');
    const authBtn = document.getElementById('auth-btn');
    const historyBtn = document.getElementById('nav-history-btn');
    const adminBar = document.getElementById('admin-top-bar');

    currentUser = getSession();

    if (currentUser) {
        if (greeting) {
            greeting.innerText = `Hi, ${currentUser.name}`;
            greeting.classList.remove('hidden');
        }
        if (authBtn) {
            authBtn.innerHTML = `<i class="fa-solid fa-right-from-bracket text-base text-red-600"></i>`;
            authBtn.title = "Đăng xuất tài khoản";
        }
        // Hiện nút lịch sử đơn hàng khi đã đăng nhập
        if (historyBtn) {
            historyBtn.classList.remove('hidden');
        }
        // Nếu là admin đang xem trang khách thì hiện thanh admin bar
        if (currentUser.role === 'admin' && adminBar) {
            adminBar.classList.remove('hidden');
        }
    } else {
        if (greeting) {
            greeting.classList.add('hidden');
            greeting.innerText = "";
        }
        if (authBtn) {
            authBtn.innerHTML = `<i class="fa-regular fa-user text-base"></i>`;
            authBtn.title = "Đăng nhập / Đăng ký";
        }
        if (historyBtn) {
            historyBtn.classList.add('hidden');
        }
    }
}

/* ---------- Modal chi tiết sản phẩm ---------- */
function openProductDetail(id) {
    products = getProducts();
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;

    const imgEl = document.getElementById('modal-img');
    const nameEl = document.getElementById('modal-name');
    const priceEl = document.getElementById('modal-price');
    const matEl = document.getElementById('modal-material');
    const sizeEl = document.getElementById('modal-size');

    if (imgEl) imgEl.src = currentProduct.img;
    if (nameEl) nameEl.innerText = currentProduct.name;
    if (priceEl) priceEl.innerText = Number(currentProduct.price).toLocaleString('vi-VN') + " VND";
    if (matEl) matEl.innerText = currentProduct.material;
    if (sizeEl) sizeEl.innerText = currentProduct.size;

    const colorContainer = document.getElementById('modal-colors');
    if (colorContainer) {
        colorContainer.innerHTML = "";
        const colors = currentProduct.colors && currentProduct.colors.length ? currentProduct.colors : ["#000000"];

        // Tìm màu đầu tiên còn hàng để chọn mặc định
        const firstAvailable = colors.find(c => colorStock(currentProduct, c) > 0) || colors[0];
        selectedColor = firstAvailable;

        colors.forEach(color => {
            const stock = colorStock(currentProduct, color);
            const outOfStock = stock <= 0;
            const btn = document.createElement('button');
            btn.className = "relative w-8 h-8 rounded-full border-2 transition-all cursor-pointer hover:border-black";
            btn.style.backgroundColor = color;
            btn.style.borderColor = (color === selectedColor) ? "#000" : "transparent";
            btn.title = outOfStock ? "Hết hàng" : ("Còn " + stock + " sản phẩm");

            if (outOfStock) {
                btn.classList.add("opacity-40", "cursor-not-allowed");
                const cross = document.createElement('span');
                cross.className = "absolute inset-0 flex items-center justify-center";
                cross.innerHTML = '<i class="fa-solid fa-ban text-red-600 text-xs"></i>';
                btn.appendChild(cross);
            }

            btn.onclick = () => {
                if (outOfStock) return;
                selectedColor = color;
                [...colorContainer.children].forEach(c => c.style.borderColor = "transparent");
                btn.style.borderColor = "#000";
                updateModalColorStock();
            };
            colorContainer.appendChild(btn);
        });

        // Hiển thị số lượng còn lại của màu đang chọn
        updateModalColorStock();
    }

    // Reset số lượng mặc định khi mở modal
    const qtyInput = document.getElementById('modal-qty');
    if (qtyInput) qtyInput.value = "1";

    const modal = document.getElementById('product-detail-modal');
    if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 50);
    }
}

// Hiển thị số lượng còn lại của màu đang chọn (dưới phần chọn màu, trên ô số lượng)
function updateModalColorStock() {
    const el = document.getElementById('modal-color-stock');
    if (!el || !currentProduct) return;
    if (!selectedColor) { selectedColor = "#000000"; }

    const stock = colorStock(currentProduct, selectedColor);
    if (stock <= 0) {
        el.innerHTML = '<span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-500 bg-red-50 border border-red-100 px-2 py-1 rounded-sm"><i class="fa-solid fa-circle-xmark"></i> Màu này đã hết hàng</span>';
    } else {
        el.innerHTML = '<span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-700 bg-gray-50 border border-gray-100 px-2 py-1 rounded-sm"><i class="fa-solid fa-boxes-stacked text-gray-400"></i> Còn <strong>' + stock.toLocaleString('vi-VN') + '</strong> sản phẩm</span>';
    }
}

function closeProductModal() {
    const modal = document.getElementById('product-detail-modal');
    if (!modal) return;
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function addModalToCart() {
    if (!currentProduct) return;
    if (!selectedColor) { selectedColor = "#000000"; }

    const qtyInput = document.getElementById('modal-qty');
    let qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
    if (!qty || qty < 1) qty = 1;

    // Kiểm tra tồn kho theo màu đã chọn
    const colorAvail = colorStock(currentProduct, selectedColor);
    const cartKey = `${currentProduct.id}_${selectedColor}`;
    const exist = cart.find(item => item.cartKey === cartKey);
    const inCart = exist ? exist.quantity : 0;

    if (colorAvail <= 0) {
        alert("Màu này đã hết hàng.");
        return;
    }
    if (inCart + qty > colorAvail) {
        alert(`Chỉ còn ${colorAvail} sản phẩm màu này trong kho.`);
        return;
    }

    if (exist) { exist.quantity += qty; }
    else { cart.push({ ...currentProduct, quantity: qty, color: selectedColor, cartKey: cartKey }); }

    saveCart(cart);
    updateCartUI();
    closeProductModal();
    toggleCartDrawer(true);
}

function changeModalQty(delta) {
    const qtyInput = document.getElementById('modal-qty');
    if (!qtyInput) return;
    const current = parseInt(qtyInput.value, 10);
    const next = (isNaN(current) ? 1 : current) + delta;
    qtyInput.value = Math.max(1, next);
}

/* ---------- Chọn địa chỉ Tỉnh / Quận / Phường ---------- */
function initLocationSelects() {
    const provinceSelect = document.getElementById('select-province');
    const districtSelect = document.getElementById('select-district');
    const wardSelect = document.getElementById('select-ward');

    if (!provinceSelect) return;

    provinceSelect.innerHTML = '<option value="">--- Tỉnh/ Thành phố ---</option>';
    Object.keys(vietnamLocations).forEach(prov => {
        provinceSelect.innerHTML += `<option value="${prov}">${prov}</option>`;
    });

    provinceSelect.onchange = function () {
        const prov = this.value;
        if (districtSelect) districtSelect.innerHTML = '<option value="">--- Quận/ Huyện ---</option>';
        if (wardSelect) wardSelect.innerHTML = '<option value="">--- Phường/ Xã ---</option>';

        if (vietnamLocations[prov] && districtSelect) {
            Object.keys(vietnamLocations[prov]).forEach(dist => {
                districtSelect.innerHTML += `<option value="${dist}">${dist}</option>`;
            });
        }
        updateFullAddress();
    };

    if (districtSelect) {
        districtSelect.onchange = function () {
            const prov = provinceSelect.value;
            const dist = this.value;
            if (wardSelect) wardSelect.innerHTML = '<option value="">--- Phường/ Xã ---</option>';

            if (vietnamLocations[prov] && vietnamLocations[prov][dist] && wardSelect) {
                vietnamLocations[prov][dist].forEach(ward => {
                    wardSelect.innerHTML += `<option value="${ward}">${ward}</option>`;
                });
            }
            updateFullAddress();
        };
    }

    if (wardSelect) {
        wardSelect.onchange = updateFullAddress;
    }
}

function updateFullAddress() {
    const detailEl = document.getElementById('checkout-detail-address');
    const wardEl = document.getElementById('select-ward');
    const distEl = document.getElementById('select-district');
    const provEl = document.getElementById('select-province');
    const targetAddress = document.getElementById('checkout-useraddress');

    if (!targetAddress) return;

    const detail = detailEl ? detailEl.value : "";
    const ward = wardEl ? wardEl.value : "";
    const dist = distEl ? distEl.value : "";
    const prov = provEl ? provEl.value : "";

    let fullAddrParts = [detail, ward, dist, prov].filter(item => item && item.indexOf('---') === -1);
    targetAddress.value = fullAddrParts.join(', ');
}

/* ---------- Lịch sử đơn hàng (chỉ đơn của người đang đăng nhập) ---------- */
function renderOrderHistory() {
    const container = document.getElementById('history-orders-list');
    if (!container) return;

    currentUser = getSession();
    let orders = getOrders();
    container.innerHTML = "";

    if (!currentUser) {
        container.innerHTML = `<p class="text-xs text-red-500">Vui lòng đăng nhập để xem lịch sử đơn hàng.</p>`;
        return;
    }

    // Admin thấy tất cả, khách hàng chỉ thấy đơn của chính mình
    let myOrders = orders;
    if (currentUser.role !== 'admin') {
        myOrders = orders.filter(o => o.username === currentUser.name || o.name === currentUser.name);
    }

    if (myOrders.length === 0) {
        container.innerHTML = `<p class="text-xs text-gray-400">Bạn chưa có đơn hàng nào.</p>`;
        return;
    }

    myOrders.forEach(ord => {
        let itemsHtml = ord.items ? ord.items.map(i => `<div class="text-xs text-gray-600">- ${i.name} (SL: ${i.quantity}) - ${(i.price * i.quantity).toLocaleString()}đ</div>`).join('') : '';
        container.innerHTML += `
            <div class="bg-white border border-gray-200 p-5 rounded-sm shadow-xs space-y-2">
                <div class="flex justify-between items-center border-b pb-2">
                    <span class="font-bold text-sm">Đơn hàng: #${ord.id}</span>
                    <span class="text-xs bg-gray-100 px-2 py-1 rounded font-semibold">${ord.status}</span>
                </div>
                <div class="text-xs text-gray-500">Ngày đặt: ${ord.date} | Hình thức: ${ord.paymentMethod}</div>
                <div class="py-1">${itemsHtml}</div>
                <div class="flex flex-wrap justify-between items-center gap-2 pt-2 border-t text-xs font-bold">
                    <span class="break-all">Địa chỉ nhận: ${ord.address}</span>
                    <span class="text-red-600 text-sm whitespace-nowrap">Tổng tiền: ${Number(ord.total).toLocaleString()}đ</span>
                </div>
            </div>
        `;
    });
}
