const router = require('express').Router();
const store = require('../lib/store');

// GET /api/collections
router.get('/', (req, res) => {
  const collections = store.readAll('collections');
  const products = store.readAll('products');
  const withCount = collections.map(c => ({
    ...c,
    productCount: products.filter(p => p.collection === c.id).length,
    productImages: products.filter(p => p.collection === c.id).map(p => p.img)
  }));
  res.json(withCount);
});

module.exports = router;

// NOTE: CRUD collections lives under /api/admin/collections