// Danh sách trạng thái đơn hàng dùng chung
const ORDER_STATUSES = ['Đang xử lý', 'Đang giao hàng', 'Hoàn thành', 'Đã hủy'];

// Khởi chạy khi tải trang admin
document.addEventListener("DOMContentLoaded", async () => {
    if (!document.getElementById('product-table-body')) return; // Không phải trang admin

    // Kiểm soát truy cập: chỉ cho phép tài khoản quản trị viên
    const session = getSession();
    if (!session || session.role !== 'admin') {
        alert("Bạn cần đăng nhập bằng tài khoản quản trị viên để truy cập trang này!");
        window.location.href = "index.html";
        return;
    }

    try {
        await initData();
    } catch (e) {
        alert('⚠️ Không thể tải dữ liệu. ' + (e.message || 'Vui lòng kiểm tra kết nối.'));
        return;
    }

    renderDashboard();
    renderProducts();
    renderOrders();
    renderCategories();
    renderInventory();
    renderCollections();
    renderContacts();
    renderUsers();
    populateCategorySelect();
});

/* ---------- Thống kê tổng quan ---------- */
function renderDashboard() {
    const container = document.getElementById('dashboard-stats');
    if (!container) return;

    const products = getProducts();
    const orders = getOrders();
    const lowStock = products.filter(p => totalQuantity(p) <= 10).length;

    // Doanh thu và lợi nhuận chỉ tính trên đơn không bị hủy
    const validOrders = orders.filter(o => o.status !== 'Đã hủy');
    const revenue = validOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const profit = validOrders.reduce((sum, o) => {
        if (!o.items) return sum;
        return sum + o.items.reduce((s, i) => s + ((i.price - (i.cost_price || 0)) * i.quantity), 0);
    }, 0);

    const cards = [
        { label: 'Tổng đơn hàng', value: orders.length, icon: 'fa-receipt', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Số sản phẩm', value: products.length, icon: 'fa-bag-shopping', color: 'text-gray-700', bg: 'bg-gray-100' },
        { label: 'Sản phẩm sắp hết', value: lowStock, icon: 'fa-triangle-exclamation', color: 'text-red-500', bg: 'bg-red-50' },
        { label: 'Doanh thu', value: revenue.toLocaleString('vi-VN') + 'đ', icon: 'fa-sack-dollar', color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Lợi nhuận ước tính', value: profit.toLocaleString('vi-VN') + 'đ', icon: 'fa-chart-line', color: 'text-amber-600', bg: 'bg-amber-50' }
    ];

    container.innerHTML = cards.map(c => `
        <div class="bg-white border border-gray-200 rounded-sm p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
            <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-semibold uppercase tracking-wider text-gray-400">${c.label}</span>
                <span class="w-8 h-8 ${c.bg} ${c.color} flex items-center justify-center rounded-sm"><i class="fa-solid ${c.icon}"></i></span>
            </div>
            <div class="text-lg md:text-xl font-bold ${c.color}">${c.value}</div>
        </div>
    `).join('');

    renderDashboardRecentOrders(orders);
    renderDashboardLowStock(products);
    renderDashboardHeader();
}

// Header chào mừng + ngày hiện tại
function renderDashboardHeader() {
    const session = getSession();
    const greetingEl = document.getElementById('dash-greeting');
    const todayEl = document.getElementById('dash-today');
    if (greetingEl) {
        const name = session && session.name ? session.name : 'Admin';
        const h = new Date().getHours();
        const period = h < 12 ? 'Chào buổi sáng' : (h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối');
        greetingEl.innerText = `${period}, ${name}`;
    }
    if (todayEl) {
        const d = new Date();
        const opts = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
        const cap = d.toLocaleDateString('vi-VN', opts);
        todayEl.innerText = cap.charAt(0).toUpperCase() + cap.slice(1);
    }
}

// 5 đơn hàng gần nhất
function renderDashboardRecentOrders(orders) {
    const el = document.getElementById('dashboard-recent-orders');
    if (!el) return;

    const recent = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    if (recent.length === 0) {
        el.innerHTML = `<div class="p-6 text-center text-gray-400 text-xs"><i class="fa-solid fa-receipt text-2xl mb-2 block"></i>Chưa có đơn hàng nào.</div>`;
        return;
    }

    el.innerHTML = recent.map(o => `
        <div class="px-5 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3 min-w-0">
                <span class="w-9 h-9 ${orderStatusDot(o.status)} text-white flex items-center justify-center rounded-sm shrink-0">
                    <i class="fa-solid fa-receipt text-xs"></i>
                </span>
                <div class="min-w-0">
                    <p class="text-xs font-semibold text-gray-800 truncate">#${o.id} · ${o.name}</p>
                    <p class="text-[11px] text-gray-400">${o.date || ''}</p>
                </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <span class="text-xs font-bold text-gray-700">${Number(o.total).toLocaleString('vi-VN')}đ</span>
                <span class="px-2 py-1 rounded font-semibold text-[10px] ${statusBadge(o.status)}">${o.status || 'Đang xử lý'}</span>
            </div>
        </div>
    `).join('');
}

// Danh sách sản phẩm sắp hết
function renderDashboardLowStock(products) {
    const el = document.getElementById('dashboard-low-stock');
    if (!el) return;

    const low = products.filter(p => totalQuantity(p) <= 10).sort((a, b) => totalQuantity(a) - totalQuantity(b)).slice(0, 6);

    if (low.length === 0) {
        el.innerHTML = `<div class="p-6 text-center text-gray-400 text-xs"><i class="fa-solid fa-circle-check text-2xl mb-2 block"></i>Không có sản phẩm nào sắp hết.</div>`;
        return;
    }

    el.innerHTML = low.map(p => `
        <div class="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <img src="${p.img}" class="w-9 h-9 object-cover rounded-sm border shrink-0" alt="">
            <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-800 truncate">${p.name}</p>
                <p class="text-[11px] text-gray-400">${categoryName(p.category)}</p>
            </div>
            <span class="px-2 py-1 rounded font-semibold text-[10px] ${totalQuantity(p) <= 0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'} shrink-0">
                ${totalQuantity(p) <= 0 ? 'Hết hàng' : totalQuantity(p) + ' còn'}
            </span>
        </div>
    `).join('');
}

// Màu dot/badge cho trạng thái đơn hàng trên dashboard
function orderStatusDot(status) {
    const map = {
        'Đang xử lý': 'bg-amber-400',
        'Đang giao hàng': 'bg-blue-400',
        'Hoàn thành': 'bg-green-500',
        'Đã hủy': 'bg-red-400'
    };
    return map[status] || 'bg-gray-400';
}
function statusBadge(status) {
    const map = {
        'Đang xử lý': 'bg-amber-50 text-amber-700',
        'Đang giao hàng': 'bg-blue-50 text-blue-700',
        'Hoàn thành': 'bg-green-50 text-green-700',
        'Đã hủy': 'bg-red-50 text-red-700'
    };
    return map[status] || 'bg-gray-100 text-gray-600';
}

function logoutAdmin() {
    clearSession();
    window.location.href = "index.html";
}

/* ---------- Quản lý sản phẩm ---------- */
function renderProducts() {
    let products = getProducts();
    const tbody = document.getElementById('product-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Lọc theo từ khóa tìm kiếm
    const search = (document.getElementById('product-search')?.value || '').toLowerCase().trim();
    if (search) {
        products = products.filter(p =>
            (p.name || '').toLowerCase().includes(search) ||
            (categoryName(p.category) || '').toLowerCase().includes(search)
        );
    }

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="p-4 text-center text-gray-400">${search ? 'Không tìm thấy sản phẩm phù hợp.' : 'Không có sản phẩm nào.'}</td></tr>`;
        return;
    }

    products.forEach(p => {
        const qty = totalQuantity(p);
        const qtyBadge = qty <= 0
            ? '<span class="px-2 py-1 rounded font-semibold text-[10px] bg-red-50 text-red-600">Hết hàng</span>'
            : qty <= 10
            ? `<span class="px-2 py-1 rounded font-semibold text-[10px] bg-amber-50 text-amber-700">${qty} (sắp hết)</span>`
            : `<span class="px-2 py-1 rounded font-semibold text-[10px] bg-green-50 text-green-700">${qty}</span>`;

        tbody.innerHTML += `
            <tr class="hover:bg-gray-50 border-b border-gray-100">
                <td class="p-4 font-bold">#${p.id}</td>
                <td class="p-4"><img src="${p.img}" class="w-10 h-10 object-cover rounded-sm border" alt=""></td>
                <td class="p-4 font-medium">${p.name}</td>
                <td class="p-4 text-red-600 font-semibold">${Number(p.price).toLocaleString()}đ</td>
                <td class="p-4 text-gray-500">${categoryName(p.category)}</td>
                <td class="p-4 text-gray-500">${p.material} / ${p.size}</td>
                <td class="p-4 text-center">${qtyBadge}</td>
                <td class="p-4 text-center space-x-2">
                    <button onclick="openModalEdit(${p.id})" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-sm cursor-pointer"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="deleteProduct(${p.id})" class="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded-sm cursor-pointer"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function openModalAdd() {
    document.getElementById('modal-title').innerText = "Thêm Sản Phẩm Mới";
    document.getElementById('product-form').reset();
    document.getElementById('inp-id').value = '';
    populateCategorySelect();
    document.getElementById('inp-colors').value = '';
    currentColorStock = {};
    renderColorStockInputs();
    document.getElementById('product-modal').classList.remove('hidden');
    document.getElementById('product-modal').classList.add('flex');
}

// Điền danh sách danh mục vào dropdown (được đồng bộ từ quản lý danh mục)
function populateCategorySelect() {
    const sel = document.getElementById('inp-category');
    if (!sel) return;
    const cats = getCategories();
    const current = sel.value;
    sel.innerHTML = cats.map(c =>
        `<option value="${c.slug}">${c.name}</option>`
    ).join('');
    if (current && cats.some(c => c.slug === current)) sel.value = current;
}

function openModalEdit(id) {
    document.getElementById('modal-title').innerText = "Chỉnh Sửa Sản Phẩm";
    const products = getProducts();
    const p = products.find(item => item.id === id);
    if (!p) return;

    populateCategorySelect();

    document.getElementById('inp-id').value = p.id;
    document.getElementById('inp-name').value = p.name;
    document.getElementById('inp-cost').value = p.cost_price || 0;
    document.getElementById('inp-price').value = p.price;
    document.getElementById('inp-category').value = p.category || 'tui-cheo';
    document.getElementById('inp-material').value = p.material;
    document.getElementById('inp-size').value = p.size;
    document.getElementById('inp-img').value = p.img;
    document.getElementById('inp-desc').value = p.desc || p.description || '';
    document.getElementById('inp-colors').value = p.colors ? p.colors.join(', ') : '#000000';
    // Lưu tồn kho theo màu để render (dùng cho sản phẩm cũ không có stockByColor)
    currentColorStock = {};
    if (p.stockByColor && typeof p.stockByColor === 'object') {
        currentColorStock = { ...p.stockByColor };
    } else {
        const colors = (p.colors && p.colors.length) ? p.colors : ['#000000'];
        const total = Number(p.quantity) || 0;
        colors.forEach((c, idx) => {
            const base = Math.floor(total / colors.length);
            const rem = total % colors.length;
            currentColorStock[c] = idx === 0 ? base + rem : base;
        });
    }
    renderColorStockInputs();

    document.getElementById('product-modal').classList.remove('hidden');
    document.getElementById('product-modal').classList.add('flex');
}

let currentColorStock = {};

// Render các ô nhập số lượng theo màu từ mảng màu trong inp-colors
function renderColorStockInputs() {
    const listEl = document.getElementById('color-stock-list');
    const totalEl = document.getElementById('color-stock-total');
    if (!listEl) return;

    const colors = getColorInputValues();

    if (colors.length === 0) {
        listEl.innerHTML = '<p class="text-[10px] text-gray-400 col-span-2">Chưa có màu nào.</p>';
        if (totalEl) totalEl.innerText = '';
        return;
    }

    listEl.innerHTML = colors.map(color => {
        const val = currentColorStock[color] !== undefined ? currentColorStock[color] : 0;
        return `
            <div class="flex items-center gap-2 border border-gray-100 rounded-sm p-2 bg-white">
                <span class="w-6 h-6 rounded-full border shrink-0" style="background:${color}; border-color:#e5e7eb"></span>
                <span class="text-[10px] font-mono text-gray-500 truncate flex-1">${color}</span>
                <input type="number" min="0" value="${val}" data-color="${color}" oninput="updateColorStockTotal()" class="w-14 p-1.5 border border-gray-200 rounded-sm outline-none focus:border-black text-center">
                <button type="button" onclick="removeColor('${color}')" class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm cursor-pointer" title="Xóa màu"><i class="fa-solid fa-xmark text-[10px]"></i></button>
            </div>
        `;
    }).join('');

    updateColorStockTotal();
}

// Lấy danh sách màu hiện có (duy trì thứ tự, bỏ trùng)
function getColorInputValues() {
    const raw = document.getElementById('inp-colors').value;
    if (!raw) return [];
    return [...new Set(raw.split(',').map(c => c.trim()).filter(c => c))];
}

// Thêm 1 màu mới từ ô chọn màu
function addNewColor() {
    const picker = document.getElementById('new-color-input');
    const color = picker ? picker.value : '#000000';
    const colors = getColorInputValues();
    if (!colors.includes(color)) {
        colors.push(color);
        if (currentColorStock[color] === undefined) currentColorStock[color] = 0;
        document.getElementById('inp-colors').value = colors.join(', ');
        renderColorStockInputs();
    }
}

// Xóa 1 màu khỏi danh sách
function removeColor(color) {
    let colors = getColorInputValues();
    colors = colors.filter(c => c !== color);
    document.getElementById('inp-colors').value = colors.join(', ');
    delete currentColorStock[color];
    renderColorStockInputs();
}

// Cập nhật tổng tồn kho hiển thị theo các ô nhập
function updateColorStockTotal() {
    const inputs = document.querySelectorAll('#color-stock-list input[data-color]');
    const totalEl = document.getElementById('color-stock-total');
    let total = 0;
    inputs.forEach(inp => {
        const v = parseInt(inp.value, 10);
        total += isNaN(v) ? 0 : v;
    });
    if (totalEl) totalEl.innerText = 'Tổng tồn kho: ' + total.toLocaleString('vi-VN') + ' sản phẩm';
}

// Gom số lượng theo màu từ các ô nhập
function collectColorStock() {
    const inputs = document.querySelectorAll('#color-stock-list input[data-color]');
    const stock = {};
    inputs.forEach(inp => {
        const v = parseInt(inp.value, 10);
        stock[inp.dataset.color] = isNaN(v) ? 0 : v;
    });
    return stock;
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('inp-id').value;
    let products = getProducts();

    const colors = document.getElementById('inp-colors').value.split(',').map(c => c.trim()).filter(c => c);
    const stockByColor = collectColorStock();
    const totalQty = Object.values(stockByColor).reduce((s, n) => s + (Number(n) || 0), 0);

    // Tạo id mới: dùng max id hiện có + 1 nếu không phải chỉnh sửa
    const nextId = id ? Number(id) : (products.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1);

    const productData = {
        id: nextId,
        name: document.getElementById('inp-name').value,
        cost_price: Number(document.getElementById('inp-cost').value),
        price: Number(document.getElementById('inp-price').value),
        quantity: totalQty,
        category: document.getElementById('inp-category').value,
        material: document.getElementById('inp-material').value,
        size: document.getElementById('inp-size').value,
        img: document.getElementById('inp-img').value,
        desc: document.getElementById('inp-desc').value,
        colors: colors,
        stockByColor: stockByColor
    };

    if (id) {
        products = products.map(p => p.id === Number(id) ? productData : p);
    } else {
        products.push(productData);
    }

    // Chặn double-submit: disable nút trong lúc chờ API, bỏ guard ngay đầu
    const submitBtn = document.getElementById('btn-save-product');
    if (submitBtn && submitBtn.disabled) return;
    if (submitBtn) submitBtn.disabled = true;

    saveProducts(products).then(() => {
        closeModal();
        renderProducts();
        renderInventory();
        renderDashboard();
    }).catch(err => {
        alert('❌ Không thể lưu sản phẩm. ' + (err.message || 'Vui lòng thử lại.'));
    }).finally(() => {
        if (submitBtn) submitBtn.disabled = false;
    });
}

function deleteProduct(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products).then(() => {
        renderProducts();
        renderInventory();
        renderDashboard();
    }).catch(err => {
        alert('❌ Không thể xóa sản phẩm. ' + (err.message || 'Vui lòng thử lại.'));
    });
}

/* ---------- Quản lý đơn hàng ---------- */

// Trả về badge màu tương ứng trạng thái đơn
function orderStatusBadge(status) {
    const map = {
        'Đang xử lý':      'bg-amber-50 text-amber-700',
        'Đang giao hàng':  'bg-blue-50 text-blue-700',
        'Hoàn thành':      'bg-green-50 text-green-700',
        'Đã hủy':          'bg-red-50 text-red-700'
    };
    const cls = map[status] || 'bg-gray-100 text-gray-600';
    return `<span class="${cls} px-2 py-1 rounded font-semibold text-[10px]">${status || 'Đang xử lý'}</span>`;
}

function renderOrders() {
    let orders = getOrders();
    const tbody = document.getElementById('order-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Lọc theo trạng thái được chọn
    const filterEl = document.getElementById('order-status-filter');
    const filter = filterEl ? filterEl.value : 'all';
    if (filter !== 'all') {
        orders = orders.filter(o => (o.status || 'Đang xử lý') === filter);
    }

    // Lọc theo từ khóa tìm kiếm (mã đơn, tên khách, SĐT, email)
    const search = (document.getElementById('order-search')?.value || '').toLowerCase().trim();
    if (search) {
        orders = orders.filter(o =>
            String(o.id || '').toLowerCase().includes(search) ||
            (o.name || '').toLowerCase().includes(search) ||
            (o.phone || '').toLowerCase().includes(search) ||
            (o.email || '').toLowerCase().includes(search) ||
            (o.username || '').toLowerCase().includes(search)
        );
    }

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-gray-400">Không có đơn hàng nào phù hợp.</td></tr>`;
        return;
    }

    orders.forEach((ord) => {
        let itemsList = ord.items ? ord.items.map(i => `${i.name} (x${i.quantity})`).join(', ') : 'Đơn hàng mua trực tiếp';

        // Dropdown đổi trạng thái
        const statusOptions = ORDER_STATUSES.map(s =>
            `<option value="${s}" ${(ord.status || 'Đang xử lý') === s ? 'selected' : ''}>${s}</option>`
        ).join('');

        const emailLine = ord.email ? `<br><i class="fa-solid fa-envelope"></i> ${ord.email}` : '';
        const noteLine = ord.note ? `<div class="text-[11px] text-amber-700 mt-1"><i class="fa-solid fa-note-sticky"></i> ${ord.note}</div>` : '';

        tbody.innerHTML += `
            <tr class="hover:bg-gray-50 border-b border-gray-100">
                <td class="p-4">
                    <span class="font-bold">#${ord.id}</span><br>
                    <span class="text-gray-600 font-semibold">${ord.name} (Tài khoản: ${ord.username || 'Khách'})</span>
                    <div class="text-[11px] text-gray-400 mt-1">${ord.date || ''} · ${ord.paymentMethod || ''}</div>
                </td>
                <td class="p-4 text-gray-500">
                    <i class="fa-solid fa-phone"></i> ${ord.phone}<br>
                    <i class="fa-solid fa-location-dot"></i> ${ord.address}${emailLine}
                </td>
                <td class="p-4 text-gray-700 max-w-xs truncate">${itemsList}${noteLine}</td>
                <td class="p-4 font-semibold text-red-600">${Number(ord.total).toLocaleString()}đ</td>
                <td class="p-4">${orderStatusBadge(ord.status)}</td>
                <td class="p-4 text-center space-x-2 whitespace-nowrap">
                    <select onchange="setOrderStatus('${ord.id}', this.value)" class="p-1.5 border border-gray-200 rounded-sm bg-white outline-none focus:border-black text-[11px] cursor-pointer">
                        ${statusOptions}
                    </select>
                    <button onclick="deleteOrder('${ord.id}')" class="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded-sm cursor-pointer"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function setOrderStatus(orderId, status) {
    apiFetch('/api/admin/orders/' + orderId, { method: 'PUT', body: { status } })
        .then(async () => {
            await initData();
            renderOrders();
            renderDashboard();
        })
        .catch(err => {
            alert('❌ Không thể cập nhật trạng thái đơn hàng. ' + (err.message || 'Vui lòng thử lại.'));
        });
}

function deleteOrder(orderId) {
    if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    apiFetch('/api/admin/orders/' + orderId, { method: 'DELETE' })
        .then(async () => {
            await initData();
            renderOrders();
            renderDashboard();
        })
        .catch(err => {
            alert('❌ Không thể xóa đơn hàng. ' + (err.message || 'Vui lòng thử lại.'));
        });
}

/* ---------- Quản lý liên hệ khách hàng ---------- */
function renderContacts() {
    const tbody = document.getElementById('contact-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    apiFetch('/api/admin/contacts')
        .then(contacts => {
            if (!Array.isArray(contacts) || contacts.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-gray-400">Chưa có tin nhắn liên hệ nào.</td></tr>`;
                return;
            }
            contacts.forEach((c, idx) => {
                tbody.innerHTML += `
                    <tr class="hover:bg-gray-50 border-b border-gray-100 align-top">
                        <td class="p-4 text-gray-400 font-bold">#${idx + 1}</td>
                        <td class="p-4 text-gray-500">${c.date || ''}</td>
                        <td class="p-4 font-semibold text-gray-800">${c.name || ''}</td>
                        <td class="p-4 text-blue-600">${c.email || ''}</td>
                        <td class="p-4 text-gray-600">${c.subject || ''}</td>
                        <td class="p-4 text-gray-500 max-w-xs break-words">${c.message || ''}</td>
                        <td class="p-4 text-center">
                            <button onclick="deleteContact(${c.id})" class="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded-sm cursor-pointer" title="Xóa tin nhắn">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(err => {
            tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-gray-400">Không thể tải tin nhắn liên hệ.</td></tr>`;
        });
}

function deleteContact(id) {
    if (!confirm("Bạn có chắc muốn xóa tin nhắn liên hệ này?")) return;
    apiFetch('/api/admin/contacts/' + id, { method: 'DELETE' })
        .then(() => renderContacts())
        .catch(err => {
            alert('❌ Không thể xóa tin nhắn. ' + (err.message || 'Vui lòng thử lại.'));
        });
}

/* ---------- Quản lý người dùng ---------- */
function renderUsers() {
    const tbody = document.getElementById('user-table-body');
    if (!tbody) return;
    const search = (document.getElementById('user-search')?.value || '').toLowerCase().trim();
    apiFetch('/api/admin/users' + (search ? '?search=' + encodeURIComponent(search) : ''))
        .then(users => {
            tbody.innerHTML = '';
            if (!Array.isArray(users) || users.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-gray-400">Không có tài khoản người dùng.</td></tr>`;
                return;
            }
            users.forEach((u, idx) => {
                const roleBadge = u.isAdmin
                    ? `<span class="px-2 py-0.5 rounded-sm bg-amber-50 text-amber-700 text-[10px] font-bold">Admin</span>`
                    : `<span class="px-2 py-0.5 rounded-sm bg-gray-100 text-gray-600 text-[10px] font-bold">Khách</span>`;
                const activeBadge = u.active
                    ? `<span class="px-2 py-0.5 rounded-sm bg-green-50 text-green-600 text-[10px] font-bold">Hoạt động</span>`
                    : `<span class="px-2 py-0.5 rounded-sm bg-red-50 text-red-600 text-[10px] font-bold">Đã khóa</span>`;

                const actions = u.isAdmin
                    ? `<span class="text-[10px] text-gray-400">Mặc định</span>`
                    : `<div class="flex items-center justify-center gap-1.5">
                            <button onclick="toggleUserActive('${u.username}', ${u.active})" class="bg-${u.active ? 'red' : 'green'}-50 text-${u.active ? 'red' : 'green'}-600 hover:bg-${u.active ? 'red' : 'green'}-100 px-2.5 py-1.5 rounded-sm cursor-pointer" title="${u.active ? 'Khóa tài khoản' : 'Mở khóa'}">
                                <i class="fa-solid ${u.active ? 'fa-lock' : 'fa-unlock'}"></i>
                            </button>
                            <button onclick="resetUserPassword('${u.username}')" class="bg-amber-50 text-amber-600 hover:bg-amber-100 px-2.5 py-1.5 rounded-sm cursor-pointer" title="Đặt lại mật khẩu">
                                <i class="fa-solid fa-key"></i>
                            </button>
                            <button onclick="deleteUser('${u.username}')" class="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded-sm cursor-pointer" title="Xóa tài khoản">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>`;

                tbody.innerHTML += `
                    <tr class="hover:bg-gray-50 border-b border-gray-100">
                        <td class="p-4 text-gray-400 font-bold">#${idx + 1}</td>
                        <td class="p-4 font-semibold text-gray-800">${u.username}</td>
                        <td class="p-4 text-gray-600">${u.name || '-'}</td>
                        <td class="p-4">${roleBadge}</td>
                        <td class="p-4 text-center text-gray-500">${u.orderCount || 0}</td>
                        <td class="p-4 text-center">${activeBadge}</td>
                        <td class="p-4 text-center">${actions}</td>
                    </tr>`;
            });
        })
        .catch(err => {
            tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-gray-400">Không thể tải danh sách người dùng.</td></tr>`;
        });
}

function toggleUserActive(username, currentActive) {
    if (!confirm(currentActive ? `Khóa tài khoản "${username}"?` : `Mở khóa tài khoản "${username}"?`)) return;
    apiFetch('/api/admin/users/' + encodeURIComponent(username), { method: 'PUT', body: { active: !currentActive } })
        .then(() => renderUsers())
        .catch(err => alert('❌ Không thể cập nhật tài khoản. ' + (err.message || 'Vui lòng thử lại.')));
}

function resetUserPassword(username) {
    const pw = prompt(`Nhập mật khẩu mới cho tài khoản "${username}" (tối thiểu 3 ký tự):`);
    if (pw === null) return;
    if (String(pw).trim().length < 3) { alert('Mật khẩu phải tối thiểu 3 ký tự.'); return; }
    apiFetch('/api/admin/users/' + encodeURIComponent(username), { method: 'PUT', body: { password: pw.trim() } })
        .then(() => alert('✅ Đã đặt lại mật khẩu cho tài khoản "' + username + '".'))
        .catch(err => alert('❌ ' + (err.message || 'Không thể đặt lại mật khẩu.')));
}

function deleteUser(username) {
    if (!confirm(`Xóa tài khoản "${username}"? Hành động này không thể hoàn tác.`)) return;
    apiFetch('/api/admin/users/' + encodeURIComponent(username), { method: 'DELETE' })
        .then(() => renderUsers())
        .catch(err => alert('❌ ' + (err.message || 'Không thể xóa tài khoản.')));
}

/* ---------- Quản lý tồn kho ---------- */
function renderInventory() {
    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;
    const products = getProducts();
    const filterEl = document.getElementById('inventory-filter');
    const filter = filterEl ? filterEl.value : 'all';

    let list = products;
    if (filter === 'low') list = products.filter(p => totalQuantity(p) > 0 && totalQuantity(p) <= 10);
    else if (filter === 'out') list = products.filter(p => totalQuantity(p) <= 0);
    else if (filter === 'instock') list = products.filter(p => totalQuantity(p) > 10);

    // Lọc theo từ khóa tìm kiếm
    const search = (document.getElementById('inventory-search')?.value || '').toLowerCase().trim();
    if (search) {
        list = list.filter(p =>
            (p.name || '').toLowerCase().includes(search) ||
            (categoryName(p.category) || '').toLowerCase().includes(search)
        );
    }

    // Thống kê tồn kho
    renderInventoryStats(products);

    tbody.innerHTML = '';
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="p-4 text-center text-gray-400">Không có sản phẩm phù hợp.</td></tr>`;
        return;
    }

    list.forEach(p => {
        const qty = totalQuantity(p);
        const status = qty <= 0
            ? '<span class="px-2 py-1 rounded font-semibold text-[10px] bg-red-50 text-red-600">Hết hàng</span>'
            : qty <= 10
            ? '<span class="px-2 py-1 rounded font-semibold text-[10px] bg-amber-50 text-amber-700">Sắp hết</span>'
            : '<span class="px-2 py-1 rounded font-semibold text-[10px] bg-green-50 text-green-700">Còn hàng</span>';

        const stockValue = (p.cost_price || 0) * qty;

        // Chi tiết tồn kho theo màu — mỗi màu 1 ô nhập số lượng riêng
        const colorBreaks = (p.stockByColor && typeof p.stockByColor === 'object')
            ? Object.entries(p.stockByColor).map(([c, n]) => ({
                color: c, qty: Number(n) || 0
            }))
            : ((p.colors && p.colors.length) ? p.colors.map(c => ({ color: c, qty: 0 })) : []);

        const colorInputsHtml = colorBreaks.length ? `
            <div class="flex flex-wrap gap-2 mt-1.5">
                ${colorBreaks.map(cb => `
                    <div class="flex items-center gap-1 border border-gray-100 rounded-sm px-1.5 py-1 bg-gray-50">
                        <i class="w-2.5 h-2.5 rounded-full inline-block shrink-0" style="background:${cb.color}"></i>
                        <input type="number" min="0" value="${cb.qty}"
                            oninput="inventoryColorInput('${p.id}')"
                            id="color-stock-${p.id}-${encodeURIComponent(cb.color).replace(/%/g, '')}"
                            data-color="${cb.color}"
                            data-pid="${p.id}"
                            class="color-stock-input w-14 text-center border border-transparent focus:border-gray-300 rounded-sm bg-transparent outline-none text-[11px]" title="Nhập số lượng cho màu này">
                    </div>
                `).join('')}
            </div>
        ` : '<span class="text-[10px] text-gray-400">Chưa có màu</span>';

        tbody.innerHTML += `
            <tr class="hover:bg-gray-50 border-b border-gray-100" data-pid="${p.id}">
                <td class="p-4"><img src="${p.img}" class="w-10 h-10 object-cover rounded-sm border" alt=""></td>
                <td class="p-4">
                    <div class="font-medium">${p.name}</div>
                    <div class="text-[10px] text-gray-400 mt-0.5">Màu sắc</div>
                    ${colorInputsHtml}
                </td>
                <td class="p-4 text-gray-500">${categoryName(p.category)}</td>
                <td class="p-4 text-gray-600">${Number(p.cost_price || 0).toLocaleString()}đ</td>
                <td class="p-4 text-center">
                    <span class="font-bold text-gray-800 text-sm" id="inv-total-${p.id}">${qty}</span>
                    <div class="text-[10px] text-gray-400 mt-0.5">Giá trị: ${stockValue.toLocaleString()}đ</div>
                </td>
                <td class="p-4 text-center">
                    <span class="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold bg-gray-50 text-gray-600" id="inv-color-count-${p.id}">
                        ${colorBreaks.length} màu
                    </span>
                </td>
                <td class="p-4 text-center">
                    <button onclick="saveStock(${p.id})" class="w-8 h-7 flex items-center justify-center bg-black hover:bg-gray-800 text-white rounded-sm cursor-pointer" title="Lưu số lượng theo màu">
                        <i class="fa-solid fa-floppy-disk text-[10px]"></i>
                    </button>
                </td>
                <td class="p-4 text-center">${status}</td>
            </tr>
        `;
    });

    // Nạp lại giá trị ô nhập màu từ data sau khi vẽ (tránh ký tự đặc biệt trong id)
    list.forEach(p => {
        const colorBreaks = (p.stockByColor && typeof p.stockByColor === 'object')
            ? Object.entries(p.stockByColor)
            : [];
        colorBreaks.forEach(([c, n]) => {
            const key = String(c).replace(/[^a-zA-Z0-9]/g, '');
            const el = document.getElementById(`color-stock-${p.id}-${key}`);
            if (el) el.value = Number(n) || 0;
        });
    });
}

// Cập nhật tổng tạm thời theo các ô màu (chưa lưu)
function inventoryColorInput(pid) {
    const row = document.querySelector(`tr[data-pid="${pid}"]`);
    if (!row) return;
    const totalEl = document.getElementById('inv-total-' + pid);
    const inputs = row.querySelectorAll('.color-stock-input');
    let sum = 0;
    inputs.forEach(inp => {
        const v = parseInt(inp.value, 10);
        sum += (isNaN(v) || v < 0) ? 0 : v;
    });
    if (totalEl) totalEl.innerText = sum;
}

// Lưu số lượng tồn kho theo từng màu
function saveStock(id) {
    const row = document.querySelector(`tr[data-pid="${id}"]`);
    if (!row) return;
    const inputs = row.querySelectorAll('.color-stock-input');
    const stockByColor = {};
    inputs.forEach(inp => {
        const color = inp.getAttribute('data-color');
        const v = parseInt(inp.value, 10);
        stockByColor[color] = (isNaN(v) || v < 0) ? 0 : v;
    });
    apiFetch('/api/admin/inventory/' + id, { method: 'PUT', body: { stockByColor } })
        .then(async () => {
            await initData();
            renderInventory();
            renderDashboard();
            renderProducts();
        })
        .catch(err => {
            alert('❌ Không thể lưu tồn kho. ' + (err.message || 'Vui lòng thử lại.'));
            renderInventory();
        });
}

function renderInventoryStats(products) {
    const container = document.getElementById('inventory-stats');
    if (!container) return;
    const totalQty = products.reduce((s, p) => s + totalQuantity(p), 0);
    const low = products.filter(p => totalQuantity(p) > 0 && totalQuantity(p) <= 10).length;
    const out = products.filter(p => totalQuantity(p) <= 0).length;
    const stockValue = products.reduce((s, p) => s + ((p.cost_price || 0) * totalQuantity(p)), 0);

    const cards = [
        { label: 'Tổng sản phẩm', value: products.length, color: 'text-gray-700', icon: 'fa-bag-shopping' },
        { label: 'Tổng tồn kho', value: totalQty, color: 'text-blue-600', icon: 'fa-boxes-stacked' },
        { label: 'Sắp hết', value: low, color: 'text-amber-600', icon: 'fa-triangle-exclamation' },
        { label: 'Hết hàng', value: out, color: 'text-red-500', icon: 'fa-circle-xmark' },
        { label: 'Giá trị tồn kho', value: stockValue.toLocaleString('vi-VN') + 'đ', color: 'text-green-600', icon: 'fa-sack-dollar' }
    ];

    container.innerHTML = cards.map(c => `
        <div class="bg-white border border-gray-200 rounded-sm p-5 shadow-xs">
            <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-semibold uppercase tracking-wider text-gray-400">${c.label}</span>
                <i class="fa-solid ${c.icon} ${c.color}"></i>
            </div>
            <div class="text-lg font-bold ${c.color}">${c.value}</div>
        </div>
    `).join('');
}

// Tăng/giảm giá trị trong ô nhập (chưa lưu)
function adjustStockInput(id, delta) {
    const input = document.getElementById('stock-input-' + id);
    if (!input) return;
    const current = parseInt(input.value, 10);
    const next = isNaN(current) ? 0 : current + delta;
    input.value = Math.max(0, next);
}

// Cập nhật lại giá trị hợp lệ khi người dùng nhập (chưa lưu)
function updateStockValue(id) {
    const input = document.getElementById('stock-input-' + id);
    if (!input) return;
    const value = parseInt(input.value, 10);
    if (isNaN(value) || value < 0) input.value = 0;
}

/* ---------- Quản lý danh mục ---------- */
function renderCategories() {
    const tbody = document.getElementById('category-table-body');
    if (!tbody) return;
    const categories = getCategories();
    const products = getProducts();
    tbody.innerHTML = '';

    if (categories.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-400">Chưa có danh mục nào.</td></tr>`;
        return;
    }

    categories.forEach((c, idx) => {
        const count = products.filter(p => p.category === c.slug).length;
        tbody.innerHTML += `
            <tr class="hover:bg-gray-50 border-b border-gray-100">
                <td class="p-4 text-gray-400 font-bold">#${idx + 1}</td>
                <td class="p-4 font-semibold text-gray-800">${c.name}</td>
                <td class="p-4 text-gray-500 max-w-xs">${c.desc || ''}</td>
                <td class="p-4">
                    <span class="px-2 py-1 rounded font-semibold text-[10px] bg-gray-100 text-gray-700">${count} sản phẩm</span>
                </td>
                <td class="p-4 text-center space-x-2">
                    <button onclick="openCategoryModal(${idx})" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-sm cursor-pointer"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="deleteCategory('${c.slug}')" class="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded-sm cursor-pointer"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function openCategoryModal(index) {
    const categories = getCategories();
    const isEdit = typeof index === 'number' && categories[index];
    document.getElementById('cat-modal-title').innerText = isEdit ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới';
    document.getElementById('cat-form').reset();
    document.getElementById('cat-index').value = isEdit ? index : '';

    if (isEdit) {
        const c = categories[index];
        document.getElementById('cat-name').value = c.name;
        document.getElementById('cat-slug').value = c.slug;
        document.getElementById('cat-slug').disabled = true;
        document.getElementById('cat-desc').value = c.desc || '';
    } else {
        document.getElementById('cat-slug').disabled = false;
    }

    document.getElementById('category-modal').classList.remove('hidden');
    document.getElementById('category-modal').classList.add('flex');
}

function closeCategoryModal() {
    const modal = document.getElementById('category-modal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}

function handleCategorySubmit(event) {
    event.preventDefault();
    const categories = getCategories();
    const index = document.getElementById('cat-index').value;
    const name = document.getElementById('cat-name').value.trim();
    let slug = document.getElementById('cat-slug').value.trim().toLowerCase();
    const desc = document.getElementById('cat-desc').value.trim();

    if (!name || !slug) {
        alert('Vui lòng nhập tên và slug danh mục.');
        return;
    }

    if (index !== '') {
        const oldSlug = categories[Number(index)].slug;
        categories[Number(index)].name = name;
        categories[Number(index)].desc = desc;
    } else {
        if (categories.some(c => c.slug === slug)) {
            alert('Slug này đã tồn tại. Vui lòng chọn slug khác.');
            return;
        }
        categories.push({ slug, name, desc });
    }

    saveCategories(categories).then(() => {
        closeCategoryModal();
        renderCategories();
        populateCategorySelect();
    }).catch(err => {
        alert('❌ Không thể lưu danh mục. ' + (err.message || 'Vui lòng thử lại.'));
    });
}

function deleteCategory(slug) {
    const categories = getCategories();
    const products = getProducts();
    const inUse = products.filter(p => p.category === slug).length;
    let productsPromise = Promise.resolve();

    if (inUse > 0) {
        if (!confirm(`Danh mục này đang có ${inUse} sản phẩm. Xóa danh mục sẽ chuyển các sản phẩm về "Chưa phân loại". Bạn có chắc muốn xóa?`)) return;
        const newProducts = products.map(p => p.category === slug ? { ...p, category: '' } : p);
        productsPromise = saveProducts(newProducts);
    } else {
        if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    }

    const newCategories = categories.filter(c => c.slug !== slug);
    Promise.all([productsPromise, saveCategories(newCategories)]).then(() => {
        renderCategories();
        renderProducts();
        renderDashboard();
        populateCategorySelect();
    }).catch(err => {
        alert('❌ Không thể xóa danh mục. ' + (err.message || 'Vui lòng thử lại.'));
    });
}

/* ---------- Quản lý bộ sưu tập ---------- */
function renderCollections() {
    const container = document.getElementById('collection-list');
    if (!container) return;
    const collections = getCollections();
    const products = getProducts();

    if (collections.length === 0) {
        container.innerHTML = `<div class="col-span-2 p-10 text-center text-gray-400 text-sm">
            <i class="fa-solid fa-gem text-3xl mb-3 block"></i>Chưa có bộ sưu tập nào.
        </div>`;
        return;
    }

    container.innerHTML = collections.map((c, idx) => {
        const items = products.filter(p => p.collection === c.id);
        const count = items.length;
        const img = c.img || (items[0] && items[0].img) || '';
        const thumb = items.slice(0, 3);

        return `
            <div class="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs">
                <div class="relative h-36 bg-gray-100">
                    ${img ? `<img src="${img}" class="w-full h-full object-cover" alt="">` : '<div class="w-full h-full flex items-center justify-center text-gray-300"><i class="fa-solid fa-gem text-3xl"></i></div>'}
                    <span class="absolute top-3 left-3 px-2 py-1 rounded font-semibold text-[10px] bg-black/80 text-white uppercase tracking-wider">${count} sản phẩm</span>
                </div>
                <div class="p-5">
                    <div class="flex items-center justify-between mb-1">
                        <h3 class="font-bold text-gray-800 text-sm uppercase tracking-wide">${c.name}</h3>
                        <div class="flex items-center space-x-1.5">
                            <button onclick="openCollectionModal(${idx})" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-sm cursor-pointer"><i class="fa-solid fa-pen"></i></button>
                            <button onclick="deleteCollection('${c.id}')" class="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded-sm cursor-pointer"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                    <p class="text-xs text-gray-400 font-light mb-4">${c.desc || ''}</p>
                    <div class="flex items-center gap-2 mb-4">
                        ${thumb.map(t => `<img src="${t.img}" class="w-10 h-10 object-cover rounded-sm border" alt="">`).join('')}
                        ${count === 0 ? '<span class="text-[10px] text-gray-400">Chưa có sản phẩm</span>' : ''}
                    </div>
                    <button onclick="openCollectionProducts('${c.id}')" class="w-full border border-gray-200 hover:border-black hover:bg-black hover:text-white text-xs font-semibold uppercase tracking-widest py-2.5 rounded-sm transition-colors cursor-pointer">
                        Quản lý sản phẩm
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function openCollectionModal(index) {
    const collections = getCollections();
    const isEdit = typeof index === 'number' && collections[index];
    document.getElementById('col-modal-title').innerText = isEdit ? 'Chỉnh Sửa Bộ Sưu Tập' : 'Thêm Bộ Sưu Tập';
    document.getElementById('col-form').reset();
    document.getElementById('col-index').value = isEdit ? index : '';

    if (isEdit) {
        const c = collections[index];
        document.getElementById('col-name').value = c.name;
        document.getElementById('col-id').value = c.id;
        document.getElementById('col-id').disabled = true;
        document.getElementById('col-desc').value = c.desc || '';
        document.getElementById('col-img').value = c.img || '';
    } else {
        document.getElementById('col-id').disabled = false;
    }

    document.getElementById('collection-modal').classList.remove('hidden');
    document.getElementById('collection-modal').classList.add('flex');
}

function closeCollectionModal() {
    const modal = document.getElementById('collection-modal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}

function handleCollectionSubmit(event) {
    event.preventDefault();
    const collections = getCollections();
    const index = document.getElementById('col-index').value;
    const name = document.getElementById('col-name').value.trim();
    const id = document.getElementById('col-id').value.trim().toLowerCase();
    const desc = document.getElementById('col-desc').value.trim();
    const img = document.getElementById('col-img').value.trim();

    if (!name || !id) {
        alert('Vui lòng nhập tên và ID bộ sưu tập.');
        return;
    }

    if (index !== '') {
        collections[Number(index)].name = name;
        collections[Number(index)].desc = desc;
        collections[Number(index)].img = img;
    } else {
        if (collections.some(c => c.id === id)) {
            alert('ID này đã tồn tại. Vui lòng chọn ID khác.');
            return;
        }
        collections.push({ id, name, desc, img });
    }

    saveCollections(collections).then(() => {
        closeCollectionModal();
        renderCollections();
    }).catch(err => {
        alert('❌ Không thể lưu bộ sưu tập. ' + (err.message || 'Vui lòng thử lại.'));
    });
}

function deleteCollection(id) {
    const collections = getCollections();
    const products = getProducts();
    const inUse = products.filter(p => p.collection === id).length;
    let productsPromise = Promise.resolve();

    if (inUse > 0) {
        if (!confirm(`Bộ sưu tập này đang có ${inUse} sản phẩm. Xóa sẽ gỡ các sản phẩm khỏi BST này. Bạn có chắc muốn xóa?`)) return;
        const newProducts = products.map(p => p.collection === id ? { ...p, collection: '' } : p);
        productsPromise = saveProducts(newProducts);
    } else {
        if (!confirm("Bạn có chắc muốn xóa bộ sưu tập này?")) return;
    }

    const newCollections = collections.filter(c => c.id !== id);
    Promise.all([productsPromise, saveCollections(newCollections)]).then(() => {
        renderCollections();
        renderProducts();
    }).catch(err => {
        alert('❌ Không thể xóa bộ sưu tập. ' + (err.message || 'Vui lòng thử lại.'));
    });
}

function openCollectionProducts(collectionId) {
    const collection = getCollections().find(c => c.id === collectionId);
    if (!collection) return;
    document.getElementById('cp-title').innerText = collection.name;
    document.getElementById('cp-desc').innerText = 'Chọn các sản phẩm thuộc bộ sưu tập này.';
    document.getElementById('cp-id').value = collectionId;
    const searchInput = document.getElementById('cp-search');
    if (searchInput) searchInput.value = '';

    renderCollectionProductAssign();

    document.getElementById('collection-products-modal').classList.remove('hidden');
    document.getElementById('collection-products-modal').classList.add('flex');
}

// Render danh sách sản phẩm gán vào bộ sưu tập (có lọc theo từ khóa tìm kiếm)
function renderCollectionProductAssign() {
    const list = document.getElementById('collection-product-assign');
    if (!list) return;
    const collectionId = document.getElementById('cp-id').value;
    const searchInput = document.getElementById('cp-search');
    const term = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const products = getProducts();

    let filtered = products;
    if (term) {
        filtered = products.filter(p =>
            p.name.toLowerCase().includes(term) ||
            (p.desc || '').toLowerCase().includes(term) ||
            categoryName(p.category).toLowerCase().includes(term)
        );
    }

    if (filtered.length === 0) {
        list.innerHTML = `<div class="p-6 text-center text-gray-400 text-xs">
            <i class="fa-solid fa-magnifying-glass text-2xl mb-2 block"></i>Không tìm thấy sản phẩm phù hợp.
        </div>`;
        return;
    }

    list.innerHTML = filtered.map(p => `
        <label class="flex items-center gap-3 p-3 border border-gray-100 rounded-sm cursor-pointer hover:bg-gray-50">
            <input type="checkbox" value="${p.id}" ${p.collection === collectionId ? 'checked' : ''} class="w-4 h-4 accent-black shrink-0">
            <img src="${p.img}" class="w-10 h-10 object-cover rounded-sm border" alt="">
            <span class="flex-1">
                <span class="block text-xs font-semibold text-gray-800">${p.name}</span>
                <span class="block text-[10px] text-gray-400">${categoryName(p.category)}</span>
            </span>
        </label>
    `).join('');
}

function closeCollectionProductsModal() {
    const modal = document.getElementById('collection-products-modal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}

function saveCollectionProducts() {
    const collectionId = document.getElementById('cp-id').value;
    const checkboxes = document.querySelectorAll('#collection-product-assign input[type="checkbox"]:checked');
    const selected = Array.from(checkboxes).map(cb => Number(cb.value));
    let products = getProducts();
    products = products.map(p =>
        selected.includes(p.id)
            ? { ...p, collection: collectionId }
            : (p.collection === collectionId ? { ...p, collection: '' } : p)
    );
    saveProducts(products).then(() => {
        closeCollectionProductsModal();
        renderCollections();
        renderProducts();
    }).catch(err => {
        alert('❌ Không thể lưu sản phẩm. ' + (err.message || 'Vui lòng thử lại.'));
    });
}
