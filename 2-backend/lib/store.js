const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const COLLECTIONS = {
  products: 'products.json',
  categories: 'categories.json',
  collections: 'collections.json',
  orders: 'orders.json',
  accounts: 'accounts.json',
  contacts: 'contacts.json',
  carts: 'carts.json'
};

function ensureFile(name) {
  const file = path.join(DATA_DIR, name);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2), 'utf8');
  }
  return file;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readAll(key) {
  ensureDataDir();
  const name = COLLECTIONS[key];
  if (!name) throw new Error(`Unknown collection: ${key}`);
  const file = ensureFile(name);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeAll(key, data) {
  ensureDataDir();
  const name = COLLECTIONS[key];
  if (!name) throw new Error(`Unknown collection: ${key}`);
  const file = ensureFile(name);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  return data;
}

function nextId(key) {
  const data = readAll(key);
  return data.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

module.exports = { readAll, writeAll, nextId, DATA_DIR, COLLECTIONS };