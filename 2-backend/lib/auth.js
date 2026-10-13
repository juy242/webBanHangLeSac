const crypto = require('crypto');

const SECRET = process.env.LESAC_SECRET || 'lesac-dev-secret';
const TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

const ADMINS = [
  { username: 'admin1', password: '123' },
  { username: 'admin2', password: '123' }
];

function hashPassword(pw) {
  return crypto.createHash('sha256').update(String(pw)).digest('hex');
}

// Simple opaque token -> { username, role, exp }
function createToken(payload) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + TOKEN_TTL })).toString('base64');
  return `${body}.${crypto.createHash('sha256').update(body + SECRET).digest('hex')}`;
}

function verifyToken(token) {
  try {
    const [body, sig] = String(token).split('.');
    const expected = crypto.createHash('sha256').update(body + SECRET).digest('hex');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64').toString());
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

function isAdminUser(username) {
  return ADMINS.some(a => a.username === username);
}

function authenticateAdmin(username, password) {
  return ADMINS.some(a => a.username === username && a.password === password);
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload) return res.status(401).json({ error: 'Chưa đăng nhập' });
  req.user = payload;
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Không có quyền admin' });
  }
  next();
}

module.exports = {
  hashPassword,
  createToken,
  verifyToken,
  isAdminUser,
  authenticateAdmin,
  requireAuth,
  requireAdmin
};