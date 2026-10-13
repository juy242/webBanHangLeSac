const router = require('express').Router();
const store = require('../lib/store');

// GET /api/products  ?category=&search=&min=&max=&sort=&collection=
router.get('/', (req, res) => {
  const { category, search, min, max, sort, collection } = req.query;
  let products = store.readAll('products');

  if (category && category !== 'all' && category !== 'bst') {
    products = products.filter(p => p.category === category);
  } else if (category === 'bst') {
    products = products.filter(p => !!p.collection);
  }
  if (collection) {
    products = products.filter(p => p.collection === collection);
  }
  if (search) {
    const q = String(search).toLowerCase();
    products = products.filter(p => (p.name + ' ' + (p.desc || '')).toLowerCase().includes(q));
  }
  if (min !== undefined && min !== '') products = products.filter(p => p.price >= Number(min));
  if (max !== undefined && max !== '') products = products.filter(p => p.price <= Number(max));

  if (sort === 'asc') products.sort((a, b) => a.price - b.price);
  else if (sort === 'desc') products.sort((a, b) => b.price - a.price);

  res.json(products);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = store.readAll('products').find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
  res.json(product);
});

module.exports = router;