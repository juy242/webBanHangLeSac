function isVietnamesePhone(phone) {
  return /^(0|\+84)(\d{9,10})$/.test(String(phone).replace(/\s/g, ''));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
}

module.exports = { isVietnamesePhone, isValidEmail };