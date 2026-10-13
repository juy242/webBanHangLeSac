const router = require('express').Router();
const store = require('../lib/store');

// GET /api/categories
router.get('/', (req, res) => {
  const categories = store.readAll('categories');
  const products = store.readAll('products');
  const withCount = categories.map(c => ({
    ...c,
    productCount: products.filter(p => p.category === c.slug).length
  }));
  res.json(withCount);
});

module.exports = router;

// NOTE: CRUD categories lives under /api/admin/categories