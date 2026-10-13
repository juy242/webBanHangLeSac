const router = require('express').Router();
const store = require('../lib/store');
const auth = require('../lib/auth');

// Carts stored per username in carts.json: { username, items: [...] }
function getCartFor(username) {
  const carts = store.readAll('carts');
  const entry = carts.find(c => c.username === username);
  return entry ? entry.items : [];
}

// GET /api/cart  (auth) -> current user's saved cart
router.get('/', auth.requireAuth, (req, res) => {
  res.json(getCartFor(req.user.username));
});

// POST /api/cart  (auth) -> replace current user's saved cart
router.post('/', auth.requireAuth, (req, res) => {
  const items = Array.isArray(req.body && req.body.items) ? req.body.items : [];
  let carts = store.readAll('carts');
  const idx = carts.findIndex(c => c.username === req.user.username);
  const saved = { username: req.user.username, items, updatedAt: new Date().toISOString() };
  if (idx === -1) carts.push(saved);
  else carts[idx] = saved;
  store.writeAll('carts', carts);
  res.json({ success: true, items });
});

module.exports = router;