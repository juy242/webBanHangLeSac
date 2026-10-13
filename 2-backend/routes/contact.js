const router = require('express').Router();
const store = require('../lib/store');
const { isValidEmail } = require('../lib/validators');

// POST /api/contact
router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !isValidEmail(email) || !message) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ và đúng thông tin liên hệ' });
  }
  const contacts = store.readAll('contacts');
  contacts.push({
    id: store.nextId('contacts'),
    name, email, subject: subject || '', message,
    date: new Date().toLocaleString('vi-VN')
  });
  store.writeAll('contacts', contacts);
  res.status(201).json({ success: true });
});

module.exports = router;