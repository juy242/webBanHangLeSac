const router = require('express').Router();
const store = require('../lib/store');
const auth = require('../lib/auth');
const { isVietnamesePhone, isValidEmail } = require('../lib/validators');

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, username, password } = req.body || {};
  if (!name || !username || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ họ tên, tài khoản và mật khẩu' });
  }
  if (String(password).length < 3) {
    return res.status(400).json({ error: 'Mật khẩu tối thiểu 3 ký tự' });
  }
  let accounts = store.readAll('accounts');
  if (accounts.some(a => a.username === username)) {
    return res.status(409).json({ error: 'Tài khoản đã tồn tại' });
  }
  const account = {
    id: store.nextId('accounts'),
    name,
    username,
    passwordHash: auth.hashPassword(password),
    role: 'customer',
    active: true
  };
  accounts.push(account);
  store.writeAll('accounts', accounts);

  const token = auth.createToken({ id: account.id, username: account.username, name: account.name, role: account.role });
  res.status(201).json({ token, user: { id: account.id, name: account.name, username: account.username, role: account.role } });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập tài khoản và mật khẩu' });
  }

  // Admin check
  if (auth.isAdminUser(username)) {
    if (auth.authenticateAdmin(username, password)) {
      const token = auth.createToken({ username, name: username, role: 'admin' });
      return res.json({ token, user: { username, name: username, role: 'admin' }, isAdmin: true });
    }
    return res.status(401).json({ error: 'Sai mật khẩu' });
  }

  // Customer check
  const account = store.readAll('accounts').find(a => a.username === username);
  if (!account || account.passwordHash !== auth.hashPassword(password)) {
    return res.status(401).json({ error: 'Tài khoản hoặc mật khẩu không đúng' });
  }
  if (account.active === false) {
    return res.status(403).json({ error: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.' });
  }
  const token = auth.createToken({ id: account.id, username: account.username, name: account.name, role: account.role });
  res.json({ token, user: { id: account.id, name: account.name, username: account.username, role: account.role } });
});

// GET /api/auth/me  (current user from token)
router.get('/me', auth.requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;