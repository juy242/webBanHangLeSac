const router = require('express').Router();
const store = require('../lib/store');
const auth = require('../lib/auth');

router.use(auth.requireAuth, auth.requireAdmin);

// ---- Dashboard stats ----
router.get('/dashboard', (req, res) => {
  const orders = store.readAll('orders');
  const products = store.readAll('products');

  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalStock = products.reduce((s, p) => s + Number(p.quantity || 0), 0);
  const lowStock = products.filter(p => Number(p.quantity || 0) <= 10).length;
  const outOfStock = products.filter(p => Number(p.quantity || 0) <= 0).length;
  const stockValue = products.reduce((s, p) => s + Number(p.cost_price || 0) * Number(p.quantity || 0), 0);

  const activeOrders = orders.filter(o => o.status !== 'Đã hủy');
  const revenue = activeOrders.reduce((s, o) => s + Number(o.total || 0), 0);
  const profit = activeOrders.reduce((s, o) => {
    const cost = o.items.reduce((cs, it) => cs + Number(it.cost_price || 0) * it.quantity, 0);
    return s + (Number(o.total || 0) - cost);
  }, 0);

  res.json({
    totalOrders, totalProducts, lowStock, outOfStock, totalStock, stockValue,
    revenue, profit,
    recentOrders: orders.slice(0, 5),
    lowStockList: products.filter(p => Number(p.quantity || 0) <= 10)
      .sort((a, b) => Number(a.quantity) - Number(b.quantity)).slice(0, 6)
  });
});

// ---- Products CRUD ----
router.get('/products', (req, res) => {
  const { search, status } = req.query;
  let products = store.readAll('products');
  if (search) {
    const q = String(search).toLowerCase();
    products = products.filter(p => (p.name + ' ' + (p.category || '')).toLowerCase().includes(q));
  }
  if (status === 'low') products = products.filter(p => Number(p.quantity || 0) <= 10 && Number(p.quantity || 0) > 0);
  else if (status === 'out') products = products.filter(p => Number(p.quantity || 0) <= 0);
  else if (status === 'in') products = products.filter(p => Number(p.quantity || 0) > 10);
  res.json(products);
});

// Bulk replace products (frontend saveProducts whole-array pattern)
router.post('/products/bulk', (req, res) => {
  const body = req.body || {};
  const list = Array.isArray(body.bulk) ? body.bulk : (Array.isArray(body) ? body : []);
  const cleaned = list.map(p => {
    const colors = Array.isArray(p.colors) && p.colors.length ? p.colors : ['#000000'];
    const stockByColor = p.stockByColor && typeof p.stockByColor === 'object' ? { ...p.stockByColor } : {};
    colors.forEach(c => { if (!(c in stockByColor)) stockByColor[c] = 0; });
    return {
      ...p,
      colors,
      stockByColor,
      quantity: Object.values(stockByColor).reduce((s, n) => s + (Number(n) || 0), 0)
    };
  });
  store.writeAll('products', cleaned);
  res.json({ success: true, count: cleaned.length });
});

router.post('/products', (req, res) => {
  const body = req.body || {};
  if (!body.name) return res.status(400).json({ error: 'Thiếu tên sản phẩm' });

  const colors = Array.isArray(body.colors) && body.colors.length ? body.colors : ['#000000'];
  const stockByColor = body.stockByColor && typeof body.stockByColor === 'object'
    ? body.stockByColor
    : {};
  // ensure each color has a value
  colors.forEach(c => { if (!(c in stockByColor)) stockByColor[c] = 0; });
  const quantity = Object.values(stockByColor).reduce((s, n) => s + (Number(n) || 0), 0);

  const product = {
    id: store.nextId('products'),
    name: body.name,
    price: Number(body.price) || 0,
    cost_price: Number(body.cost_price) || 0,
    category: body.category || '',
    collection: body.collection || '',
    material: body.material || '',
    size: body.size || '',
    colors,
    stockByColor,
    quantity,
    desc: body.desc || '',
    img: body.img || ''
  };

  const products = store.readAll('products');
  products.push(product);
  store.writeAll('products', products);
  res.status(201).json(product);
});

router.put('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  let products = store.readAll('products');
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });

  const body = req.body || {};
  const colors = Array.isArray(body.colors) && body.colors.length ? body.colors : (products[idx].colors || ['#000000']);
  const stockByColor = body.stockByColor && typeof body.stockByColor === 'object' ? { ...body.stockByColor } : { ...(products[idx].stockByColor || {}) };
  colors.forEach(c => { if (!(c in stockByColor)) stockByColor[c] = 0; });

  products[idx] = {
    ...products[idx],
    ...body,
    colors,
    stockByColor,
    quantity: Object.values(stockByColor).reduce((s, n) => s + (Number(n) || 0), 0)
  };
  store.writeAll('products', products);
  res.json(products[idx]);
});

router.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  let products = store.readAll('products');
  const before = products.length;
  products = products.filter(p => p.id !== id);
  if (products.length === before) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
  store.writeAll('products', products);
  res.json({ success: true });
});

// ---- Inventory ----
// PUT /api/admin/inventory/:id
// Body A: { stockByColor: { colorHex: qty } }  -> set exact quantities per color (sum = total)
// Body B: { quantity: n }                      -> set total, scale proportionally across colors
router.put('/inventory/:id', (req, res) => {
  const id = Number(req.params.id);

  let products = store.readAll('products');
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });

  const p = products[idx];
  const colors = p.colors && p.colors.length ? p.colors : Object.keys(p.stockByColor || {});
  if (!colors.length) return res.status(400).json({ error: 'Sản phẩm chưa có màu sắc' });

  let stockByColor;
  const hasPerColor = req.body.stockByColor && typeof req.body.stockByColor === 'object';

  if (hasPerColor) {
    // Body A: set exact per-color quantities
    stockByColor = {};
    colors.forEach(c => {
      const n = Number(req.body.stockByColor[c]);
      stockByColor[c] = (isNaN(n) || n < 0) ? 0 : Math.floor(n);
    });
    const total = Object.values(stockByColor).reduce((s, n) => s + n, 0);
    products[idx] = { ...p, stockByColor, quantity: total };
    store.writeAll('products', products);
    return res.json(products[idx]);
  }

  // Body B: scale proportionally
  const newQty = Number(req.body.quantity);
  if (isNaN(newQty) || newQty < 0) return res.status(400).json({ error: 'Số lượng không hợp lệ' });

  const current = Number(p.quantity || 0);
  stockByColor = p.stockByColor && typeof p.stockByColor === 'object' ? { ...p.stockByColor } : {};

  if (current <= 0) {
    // from 0 -> distribute evenly
    const per = Math.floor(newQty / colors.length);
    const rem = newQty % colors.length;
    colors.forEach((c, i) => { stockByColor[c] = i === 0 ? per + rem : per; });
  } else {
    const ratio = newQty / current;
    colors.forEach(c => {
      stockByColor[c] = Math.round((Number(stockByColor[c]) || 0) * ratio);
    });
    // fix rounding drift so total matches
    const sum = Object.values(stockByColor).reduce((s, n) => s + n, 0);
    const diff = newQty - sum;
    if (diff !== 0) stockByColor[colors[0]] = Math.max(0, (stockByColor[colors[0]] || 0) + diff);
  }

  products[idx] = { ...p, stockByColor, quantity: newQty };
  store.writeAll('products', products);
  res.json(products[idx]);
});

// ---- Categories CRUD ----
router.get('/categories', (req, res) => {
  res.json(store.readAll('categories'));
});

router.post('/categories', (req, res) => {
  const body = req.body || {};
  if (body.bulk) {
    store.writeAll('categories', Array.isArray(body.bulk) ? body.bulk : []);
    return res.json({ success: true, count: (body.bulk || []).length });
  }
  const { slug, name, desc } = req.body || {};
  if (!slug || !name) return res.status(400).json({ error: 'Thiếu slug hoặc tên' });
  let categories = store.readAll('categories');
  if (categories.some(c => c.slug === slug)) return res.status(409).json({ error: 'Slug đã tồn tại' });
  const category = { slug, name, desc: desc || '' };
  categories.push(category);
  store.writeAll('categories', categories);
  res.status(201).json(category);
});

router.put('/categories/:slug', (req, res) => {
  let categories = store.readAll('categories');
  const idx = categories.findIndex(c => c.slug === req.params.slug);
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy danh mục' });
  categories[idx] = { ...categories[idx], ...(req.body || {}) };
  store.writeAll('categories', categories);
  res.json(categories[idx]);
});

router.delete('/categories/:slug', (req, res) => {
  const slug = req.params.slug;
  let categories = store.readAll('categories');
  categories = categories.filter(c => c.slug !== slug);
  store.writeAll('categories', categories);
  // move products to unclassified
  let products = store.readAll('products');
  products = products.map(p => p.category === slug ? { ...p, category: '' } : p);
  store.writeAll('products', products);
  res.json({ success: true });
});

// ---- Collections CRUD ----
router.get('/collections', (req, res) => {
  res.json(store.readAll('collections'));
});

router.post('/collections', (req, res) => {
  const body = req.body || {};
  if (body.bulk) {
    store.writeAll('collections', Array.isArray(body.bulk) ? body.bulk : []);
    return res.json({ success: true, count: (body.bulk || []).length });
  }
  const { id, name, desc, img } = body;
  if (!id || !name) return res.status(400).json({ error: 'Thiếu id hoặc tên' });
  let collections = store.readAll('collections');
  if (collections.some(c => c.id === id)) return res.status(409).json({ error: 'Id đã tồn tại' });
  const collection = { id, name, desc: desc || '', img: img || '' };
  collections.push(collection);
  store.writeAll('collections', collections);
  res.status(201).json(collection);
});

router.put('/collections/:id', (req, res) => {
  let collections = store.readAll('collections');
  const idx = collections.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy BST' });
  collections[idx] = { ...collections[idx], ...(req.body || {}) };
  store.writeAll('collections', collections);
  res.json(collections[idx]);
});

router.delete('/collections/:id', (req, res) => {
  const id = req.params.id;
  let collections = store.readAll('collections');
  collections = collections.filter(c => c.id !== id);
  store.writeAll('collections', collections);
  let products = store.readAll('products');
  products = products.map(p => p.collection === id ? { ...p, collection: '' } : p);
  store.writeAll('products', products);
  res.json({ success: true });
});

// ---- Orders ----
// GET ?status= &search= &user=   (user param: customer sees own orders)
router.get('/orders', (req, res) => {
  const { status, search, user } = req.query;
  let orders = store.readAll('orders');

  if (user) orders = orders.filter(o => (o.username === user) || (o.username === req.user.name) || (req.user.role === 'admin'));
  else if (req.user.role !== 'admin') orders = orders.filter(o => o.username === req.user.name || o.username === req.user.username);

  if (status && status !== 'all') orders = orders.filter(o => o.status === status);
  if (search) {
    const q = String(search).toLowerCase();
    orders = orders.filter(o =>
      String(o.id).toLowerCase().includes(q) ||
      String(o.name || '').toLowerCase().includes(q) ||
      String(o.phone || '').toLowerCase().includes(q) ||
      String(o.email || '').toLowerCase().includes(q) ||
      String(o.username || '').toLowerCase().includes(q)
    );
  }
  res.json(orders);
});

router.post('/orders', (req, res) => {
  const body = req.body || {};
  if (body.bulk) {
    store.writeAll('orders', Array.isArray(body.bulk) ? body.bulk : []);
    return res.json({ success: true, count: (body.bulk || []).length });
  }
  res.status(400).json({ error: 'Đặt hàng phải qua /api/orders' });
});

router.put('/orders/:id', (req, res) => {
  const { status } = req.body || {};
  const valid = ['Đang xử lý', 'Đang giao hàng', 'Hoàn thành', 'Đã hủy'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Trạng thái không hợp lệ' });

  let orders = store.readAll('orders');
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });

  const prevStatus = orders[idx].status;

  // Hủy đơn: hoàn lại tồn kho
  if (status === 'Đã hủy' && prevStatus !== 'Đã hủy') {
    let products = store.readAll('products');
    orders[idx].items.forEach(item => {
      products = products.map(p => {
        if (p.id !== item.id) return p;
        const stockMap = p.stockByColor && typeof p.stockByColor === 'object' ? { ...p.stockByColor } : {};
        stockMap[item.color] = (Number(stockMap[item.color]) || 0) + item.quantity;
        return { ...p, stockByColor: stockMap, quantity: Object.values(stockMap).reduce((s, n) => s + n, 0) };
      });
    });
    store.writeAll('products', products);
  }

  // Bỏ hủy (Đã hủy -> trạng thái khác): trừ lại tồn kho để khớp với đơn còn hiệu lực
  if (prevStatus === 'Đã hủy' && status !== 'Đã hủy') {
    let products = store.readAll('products');
    orders[idx].items.forEach(item => {
      products = products.map(p => {
        if (p.id !== item.id) return p;
        const stockMap = p.stockByColor && typeof p.stockByColor === 'object' ? { ...p.stockByColor } : {};
        stockMap[item.color] = Math.max(0, (Number(stockMap[item.color]) || 0) - item.quantity);
        return { ...p, stockByColor: stockMap, quantity: Object.values(stockMap).reduce((s, n) => s + n, 0) };
      });
    });
    store.writeAll('products', products);
  }

  orders[idx] = { ...orders[idx], status };
  store.writeAll('orders', orders);
  res.json(orders[idx]);
});

router.delete('/orders/:id', (req, res) => {
  let orders = store.readAll('orders');
  const before = orders.length;
  orders = orders.filter(o => o.id !== req.params.id);
  if (orders.length === before) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
  store.writeAll('orders', orders);
  res.json({ success: true });
});

// ---- Users (quản lý tài khoản) ----
// GET /api/admin/users?search=
router.get('/users', (req, res) => {
  const { search } = req.query;
  const orders = store.readAll('orders');
  let list = store.readAll('accounts').map(a => ({
    id: a.id,
    username: a.username,
    name: a.name || '',
    role: a.role || 'customer',
    active: a.active !== false,
    isAdmin: auth.isAdminUser(a.username) || a.role === 'admin',
    orderCount: orders.filter(o => o.username === a.username || o.username === a.name).length
  }));
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(u => (u.username + ' ' + u.name).toLowerCase().includes(q));
  }
  list.sort((a, b) => (a.isAdmin ? 0 : 1) - (b.isAdmin ? 0 : 1) || a.username.localeCompare(b.username));
  res.json(list);
});

// PUT /api/admin/users/:username  (update name/role/active, reset password)
router.put('/users/:username', (req, res) => {
  const username = req.params.username;
  if (auth.isAdminUser(username)) {
    return res.status(400).json({ error: 'Không thể sửa tài khoản admin mặc định' });
  }
  let accounts = store.readAll('accounts');
  const idx = accounts.findIndex(a => a.username === username);
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy tài khoản' });

  const body = req.body || {};
  const updated = { ...accounts[idx] };
  if (body.name !== undefined) updated.name = String(body.name);
  if (body.role !== undefined) {
    if (!['customer', 'admin'].includes(body.role)) return res.status(400).json({ error: 'Vai trò không hợp lệ' });
    updated.role = body.role;
  }
  if (body.active !== undefined) updated.active = body.active === true || body.active === 'true';
  if (body.password && String(body.password).length >= 3) {
    updated.passwordHash = auth.hashPassword(body.password);
  }
  accounts[idx] = updated;
  store.writeAll('accounts', accounts);
  res.json({ id: updated.id, username: updated.username, name: updated.name, role: updated.role, active: updated.active !== false });
});

// DELETE /api/admin/users/:username
router.delete('/users/:username', (req, res) => {
  const username = req.params.username;
  if (auth.isAdminUser(username)) return res.status(400).json({ error: 'Không thể xóa tài khoản admin' });
  if (username === req.user.username) return res.status(400).json({ error: 'Không thể xóa tài khoản đang đăng nhập' });
  let accounts = store.readAll('accounts');
  const before = accounts.length;
  accounts = accounts.filter(a => a.username !== username);
  if (accounts.length === before) return res.status(404).json({ error: 'Không tìm thấy tài khoản' });
  store.writeAll('accounts', accounts);
  res.json({ success: true });
});

// ---- Contact messages ----
router.get('/contacts', (req, res) => {
  const contacts = store.readAll('contacts');
  res.json([...contacts].reverse()); // mới nhất lên đầu
});

router.delete('/contacts/:id', (req, res) => {
  const id = Number(req.params.id);
  let contacts = store.readAll('contacts');
  const before = contacts.length;
  contacts = contacts.filter(c => c.id !== id);
  if (contacts.length === before) return res.status(404).json({ error: 'Không tìm thấy tin nhắn' });
  store.writeAll('contacts', contacts);
  res.json({ success: true });
});

module.exports = router;