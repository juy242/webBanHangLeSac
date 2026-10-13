const router = require('express').Router();
const store = require('../lib/store');
const auth = require('../lib/auth');
const { isVietnamesePhone, isValidEmail } = require('../lib/validators');

// GET /api/orders  (list own orders for customers, all orders for admins)
router.get('/', auth.requireAuth, (req, res) => {
  const orders = store.readAll('orders');
  if (req.user.role === 'admin') return res.json(orders);
  res.json(orders.filter(o => o.username === req.user.name || o.username === req.user.username));
});

// POST /api/orders  (create order, deduct stock by color)
router.post('/', auth.requireAuth, (req, res) => {
  const { items, name, phone, email, address, note, paymentMethod } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Giỏ hàng trống' });
  }
  if (!name || String(name).trim().length < 2) {
    return res.status(400).json({ error: 'Họ tên phải từ 2 ký tự' });
  }
  if (!isVietnamesePhone(phone)) {
    return res.status(400).json({ error: 'Số điện thoại không hợp lệ' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email không hợp lệ' });
  }
  if (!address) {
    return res.status(400).json({ error: 'Vui lòng nhập địa chỉ' });
  }

  const products = store.readAll('products');
  const cart = [];

  // Gộp tổng số lượng theo từng (sản phẩm, màu) để kiểm tra tồn kho chính xác
  const requested = {}; // key `${id}|${color}` -> tổng số lượng
  const lines = [];
  for (const item of items) {
    const product = products.find(p => p.id === Number(item.id));
    if (!product) return res.status(400).json({ error: `Sản phẩm #${item.id} không tồn tại` });
    const qty = Number(item.quantity) || 0;
    const color = item.color || (product.colors && product.colors[0]) || '#000000';
    if (qty <= 0) return res.status(400).json({ error: 'Số lượng không hợp lệ' });
    lines.push({ product, qty, color });
    const key = `${item.id}|${color}`;
    requested[key] = (requested[key] || 0) + qty;
  }

  // Kiểm tra theo tổng từng (sản phẩm, màu): tránh bán quá tồn khi đơn trùng dòng
  for (const key of Object.keys(requested)) {
    const [pid, color] = key.split('|');
    const product = products.find(p => p.id === Number(pid));
    const stockMap = product.stockByColor && typeof product.stockByColor === 'object' ? { ...product.stockByColor } : {};
    const stock = Number(stockMap[color] ?? product.quantity ?? 0) || 0;
    if (requested[key] > stock) {
      return res.status(400).json({ error: `"${product.name}" màu này chỉ còn ${stock} sản phẩm` });
    }
  }

  lines.forEach(line => {
    cart.push({ ...line.product, quantity: line.qty, color: line.color });
  });

  // Deduct stock (mỗi dòng màu trong giỏ trừ riêng cho đúng màu tương ứng)
  const updatedProducts = products.map(p => {
    const productLines = cart.filter(c => c.id === p.id);
    if (!productLines.length) return p;
    const stockMap = p.stockByColor && typeof p.stockByColor === 'object' ? { ...p.stockByColor } : {};
    productLines.forEach(line => {
      stockMap[line.color] = Math.max(0, (Number(stockMap[line.color]) || 0) - line.quantity);
    });
    const total = Object.values(stockMap).reduce((s, n) => s + (Number(n) || 0), 0);
    return { ...p, stockByColor: stockMap, quantity: total };
  });
  store.writeAll('products', updatedProducts);

  const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const orderId = 'LESAC' + Math.floor(1000 + Math.random() * 9000);
  const order = {
    id: orderId,
    date: new Date().toLocaleString('vi-VN'),
    items: cart,
    total,
    name: String(name).trim(),
    phone: String(phone).trim(),
    address: String(address).trim(),
    email: String(email).trim(),
    note: note || '',
    username: req.user.name || req.user.username,
    paymentMethod: paymentMethod === 'qr' ? 'Chuyển khoản QR' : 'Thanh toán tại nhà',
    status: 'Đang xử lý'
  };

  const orders = store.readAll('orders');
  orders.unshift(order);
  store.writeAll('orders', orders);

  res.status(201).json({ orderId: order.id, total, order });
});

module.exports = router;

// NOTE: order listing / status update live under /api/admin/orders
//       (customers see their own orders via GET /api/admin/orders?user=...)