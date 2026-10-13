const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const collectionRoutes = require('./routes/collections');
const orderRoutes = require('./routes/orders');
const contactRoutes = require('./routes/contact');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request log
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Public API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/cart', cartRoutes);

// Admin API
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Serve the frontend static files (the 1-fontend folder)
const FRONTEND_DIR = path.join(__dirname, '..', '1-fontend');
app.use(express.static(FRONTEND_DIR));

// 404 for unknown API
app.use('/api', (req, res) => res.status(404).json({ error: 'Không tìm thấy API' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Lỗi máy chủ' });
});

app.listen(PORT, () => {
  console.log(`LESAC backend running at http://localhost:${PORT}`);
  console.log(`API base: http://localhost:${PORT}/api`);
  console.log(`Frontend: http://localhost:${PORT}/index.html  (and /admin.html)`);
});