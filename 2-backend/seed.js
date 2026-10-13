const fs = require('fs');
const path = require('path');
const store = require('./lib/store');

const DATA_DIR = store.DATA_DIR;

function seed(key, data) {
  const file = path.join(DATA_DIR, store.COLLECTIONS[key]);
  if (fs.existsSync(file)) return false;
  store.writeAll(key, data);
  return true;
}

const defaultCollections = [
  { id: 'bst-dong', name: 'BST Thu Đông', desc: 'Những thiết kế ấm áp, sang trọng cho mùa thu đông.' },
  { id: 'bst-limit', name: 'BST Giới Hạn', desc: 'Sản phẩm độc quyền, số lượng có hạn.' }
];

const defaultCategories = [
  { slug: 'tui-cheo', name: 'Túi đeo chéo', desc: 'Túi xách đeo chéo gọn gàng, năng động.' },
  { slug: 'tui-vai', name: 'Túi đeo vai', desc: 'Túi xách đeo vai thanh lịch, sang trọng.' },
  { slug: 'tui-tote', name: 'Túi tote', desc: 'Túi vải tote bền bỉ, đựng được nhiều đồ.' },
  { slug: 'vi-truyen-thong', name: 'Ví truyền thống', desc: 'Ví da truyền thống nhiều ngăn tiện dụng.' },
  { slug: 'vi-the', name: 'Ví đựng thẻ', desc: 'Ví đựng thẻ mỏng nhẹ, hiện đại.' },
  { slug: 'bst', name: 'Bộ sưu tập (BST)', desc: 'Những sản phẩm giới hạn thuộc bộ sưu tập.' }
];

const rawProducts = [
  { id: 1, name: "Airy Shoulder Bag", price: 699000, cost_price: 400000, quantity: 25, category: "tui-vai", material: "Da PU cao cấp bề mặt vân hạt mịn", size: "24 x 15 x 7 cm", colors: ["#d8b4fe", "#741616ff", "#fbcfe8"], desc: "Thiết kế thanh lịch, tinh tế.", img: "assets/images/3.jpeg" },
  { id: 2, name: "Bella Saddle Bag", price: 699000, cost_price: 410000, quantity: 12, category: "tui-vai", material: "Da PU cao cấp bề mặt vân hạt mịn", size: "24 x 15 x 7 cm", colors: ["#000404ff", "rgb(75, 20, 158)", "#fbcfe8"], desc: "Thiết kế thanh lịch, tinh tế.", img: "assets/images/3.jpeg" },
  { id: 3, name: "Luna Crescent Bag", price: 550000, cost_price: 320000, quantity: 30, category: "tui-vai", material: "Da tổng hợp mờ mềm mại", size: "22 x 18 x 6 cm", colors: ["#000000", "#e5e7eb", "#9ca3af"], desc: "Dáng túi vầng trăng khuyết mềm mại, ôm form người cực tốt. Khóa kéo kim loại trơn tru bảo vệ đồ đạc an toàn.", img: "assets/images/4.jpeg" },
  { id: 4, name: "Aria Minimal Bag", price: 580000, cost_price: 340000, quantity: 18, category: "tui-vai", material: "Da mịn màng, chống thấm nước nhẹ", size: "25 x 16 x 7.5 cm", colors: ["#ffffff", "#1f2937", "#f3f4f6"], desc: "Đường nét cắt may dứt khoát làm tôn lên vẻ tinh tế đơn giản. Thích hợp cho cả những buổi họp công sở hay cà phê cuối tuần.", img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=500" },
  { id: 5, name: "Sienna Shoulder Slouch", price: 620000, cost_price: 360000, quantity: 22, category: "tui-vai", material: "Da nhân tạo cao cấp siêu mềm", size: "28 x 20 x 10 cm", colors: ["#78350f", "#000000", "#d1d5db"], desc: "Thiết kế hơi rủ tự nhiên tạo cảm giác phóng khoáng nhưng không kém phần sang trọng. Quai đeo bản to giảm áp lực vai.", img: "assets/images/6.jpeg" },
  { id: 6, name: "Mirri Crossbody Bag", price: 435000, cost_price: 250000, quantity: 40, category: "tui-cheo", material: "Da thuần chay mềm mịn chống trầy xước", size: "20 x 13 x 6 cm", colors: ["#f59e0b", "#000000", "#ef4444"], desc: "Túi đeo chéo phom hộp cứng cáp, điểm nhấn khóa kim loại mạ vàng sang trọng. Rất thích hợp diện đi chơi hoặc dự tiệc nhẹ.", img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=500" },
  { id: 7, name: "Scarlet Box Bag", price: 495000, cost_price: 280000, quantity: 35, category: "tui-cheo", material: "Da nappa tổng hợp cao cấp giữ phom tốt", size: "22 x 16 x 8 cm", colors: ["#dc2626", "#000000", "#fbcfe8"], desc: "Sự kết hợp hoàn hảo giữa phong cách cổ điển và hơi thở đường phố hiện đại. Dây đeo có thể tùy chỉnh độ dài linh hoạt.", img: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=500" },
  { id: 8, name: "Bella Saddle Bag", price: 460000, cost_price: 260000, quantity: 28, category: "tui-cheo", material: "Da lộn kết hợp da sáp nhẹ", size: "19 x 17 x 7 cm", colors: ["#b45309", "#374151", "#fbcfe8"], desc: "Dáng túi yên ngựa bo tròn nữ tính, nắp đậy nam châm ẩn tinh tế. Một lựa chọn nhẹ nhàng cho những bộ outfit trơn màu.", img: "assets/images/anh.jpeg" },
  { id: 9, name: "Olivia Camera Bag", price: 410000, cost_price: 230000, quantity: 45, category: "tui-cheo", material: "Da sần saffiano chịu lực tốt", size: "18 x 12 x 6.5 cm", colors: ["#000000", "#6b7280", "#9333ea"], desc: "Form dáng vuông vắn nhỏ gọn mô phỏng chiếc máy ảnh. Hai ngăn kéo riêng biệt giúp bạn phân loại son, điện thoại tiện lợi.", img: "assets/images/images-2.jpeg" },
  { id: 10, name: "Nova Flap Bag", price: 480000, cost_price: 270000, quantity: 33, category: "tui-cheo", material: "Da trơn lì không bám vân tay", size: "21 x 14 x 5.5 cm", colors: ["#1e293b", "#94a3b8", "#f43f5e"], desc: "Thiết kế nắp gập chéo bất đối xứng tạo điểm nhấn phá cách nhẹ nhàng cho tổng thể form dáng basic.", img: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=500" },
  { id: 11, name: "Mikala Work Tote", price: 575000, cost_price: 320000, quantity: 26, category: "tui-tote", material: "Da phối hợp vải canvas sợi đôi bền bỉ", size: "35 x 30 x 12 cm", colors: ["#d97706", "#1f2937", "#f3f4f6"], desc: "Chiếc túi tote cỡ lớn hoàn hảo cho môi trường công sở hoặc trường học, thoải mái đựng vừa laptop 14 inch và tài liệu A4.", img: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=500" },
  { id: 12, name: "Canvas Eco Tote", price: 320000, cost_price: 180000, quantity: 50, category: "tui-tote", material: "Vải Canvas 100% thô tự nhiên dày dặn", size: "38 x 40 cm", colors: ["#fef08a", "#e5e7eb", "#000000"], desc: "Túi vải mềm mại, thân thiện với môi trường, in logo chìm tinh tế. Phù hợp cho những chuyến đi dạo, đi biển.", img: "assets/images/images.jpg" },
  { id: 13, name: "Urban Daily Tote", price: 590000, cost_price: 330000, quantity: 20, category: "tui-tote", material: "Da mềm hạt cuội (Pebbled Leather)", size: "33 x 28 x 10 cm", colors: ["#374151", "#9ca3af", "#b45309"], desc: "Kết cấu túi đứng form vừa phải, quai xách tay bọc da êm ái cùng dây đeo vai phụ có thể tháo rời linh hoạt.", img: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=500" },
  { id: 14, name: "Harper Shopping Bag", price: 650000, cost_price: 380000, quantity: 15, category: "tui-tote", material: "Da lộn nhân tạo cao cấp siêu mượt", size: "36 x 32 x 14 cm", colors: ["#78350f", "#4b5563", "#fbcfe8"], desc: "Không gian chứa đồ cực lớn cùng tông màu đất trầm ấm. Mặt trong có ngăn nhỏ kéo khóa để ví và chìa khóa an toàn.", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=500" },
  { id: 15, name: "Classic Long Wallet", price: 295000, cost_price: 160000, quantity: 60, category: "vi-truyen-thong", material: "Da bò saffiano chống trầy nước", size: "19 x 10 x 2 cm", colors: ["#000000", "#b45309", "#dc2626"], desc: "Ví dài cầm tay kết cấu nhiều ngăn thông minh giữ cho tiền mặt, giấy tờ và các loại thẻ của bạn luôn ngay ngắn, ngăn nắp.", img: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=500" },
  { id: 16, name: "Elegance Zip Wallet", price: 270000, cost_price: 150000, quantity: 55, category: "vi-truyen-thong", material: "Da PU lì vân tăm mờ", size: "15 x 10 x 2 cm", colors: ["#374151", "#fbcfe8", "#9333ea"], desc: "Kích thước lửng gọn gàng vừa vặn trong lòng bàn tay. Khóa kéo bọc quanh viền ngăn chặn rơi rớt giấy tờ nhỏ.", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500" },
  { id: 17, name: "Trifold Leather Wallet", price: 310000, cost_price: 180000, quantity: 52, category: "vi-truyen-thong", material: "Da nappa hạt mịn tự nhiên", size: "12 x 9.5 x 3 cm", colors: ["#78350f", "#000000", "#6b7280"], desc: "Thiết kế gập ba tiết kiệm diện tích tối đa nhưng vẫn cung cấp đầy đủ ngăn chứa ảnh lưu niệm và các giấy tờ tùy thân.", img: "assets/images/shopping.jpeg" },
  { id: 18, name: "Minimal Card Holder", price: 185000, cost_price: 95000, quantity: 80, category: "vi-the", material: "Da sáp phân tầng tự nhiên", size: "11 x 8 x 0.5 cm", colors: ["#d97706", "#1e293b", "#f43f5e"], desc: "Thiết kế siêu mỏng nhẹ ôm sát túi quần hoặc túi xách, chuyên dụng chứa các loại thẻ thanh toán căn cước thiết yếu.", img: "https://images.unsplash.com/photo-1575410227392-c2593d7c65b5?q=80&w=500" },
  { id: 19, name: "Zip Slate Card Case", price: 210000, cost_price: 110000, quantity: 70, category: "vi-the", material: "Da hạt sần bền bỉ phối kim loại", size: "13 x 8.5 x 1 cm", colors: ["#4b5563", "#000000", "#e5e7eb"], desc: "Bổ sung một ngăn khóa kéo hông nhỏ gọn để gấp tiền mặt hoặc một vài đồng xu tiện dụng.", img: "https://images.unsplash.com/photo-1575410227392-c2593d7c65b5?q=80&w=500" },
  { id: 20, name: "Carbon Fiber Card Wallet", price: 250000, cost_price: 135000, quantity: 65, category: "vi-the", material: "Sợi carbon cao cấp chống xước siêu bền", size: "10 x 7 x 1.2 cm", colors: ["#111827", "#9ca3af", "#ef4444"], desc: "Tích hợp công nghệ chống quét trộm sóng RFID bảo mật cao cấp, thiết kế hiện đại mạnh mẽ.", img: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=500" },
  { id: 21, name: "LESAC Signature Hobo", price: 850000, cost_price: 500000, quantity: 8, collection: "bst-dong", category: "bst", material: "Da thuộc thảo mộc mềm mịn thượng hạng", size: "30 x 22 x 8 cm", colors: ["#78350f", "#000000", "#b45309"], desc: "Sản phẩm giới hạn thuộc BST Thu Đông. Toát lên vẻ thượng lưu cao quý bậc nhất.", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500" },
  { id: 22, name: "Ethereal Clutch Velvet", price: 720000, cost_price: 420000, quantity: 10, collection: "bst-limit", category: "bst", material: "Nhung tuyết mịn phối quai xích mạ vàng", size: "22 x 12 x 5 cm", colors: ["#581c87", "#000000", "#991b1b"], desc: "Chiếc túi sinh ra dành riêng cho những buổi tiệc dạ hội xa hoa lộng lẫy.", img: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=500" }
];

// Build stockByColor from quantity split across colors (mirror frontend migration)
const products = rawProducts.map(p => {
  const { quantity, colors, ...rest } = p;
  const per = Math.floor(quantity / colors.length);
  const rem = quantity % colors.length;
  const stockByColor = {};
  colors.forEach((c, idx) => { stockByColor[c] = idx === 0 ? per + rem : per; });
  return { ...rest, quantity, colors, stockByColor };
});

// Custom spread of fields already carried over via rest spread
const adminAccounts = [
  { id: 1, username: 'admin1', role: 'admin', name: 'Admin 1', passwordHash: null, isAdmin: true },
  { id: 2, username: 'admin2', role: 'admin', name: 'Admin 2', passwordHash: null, isAdmin: true }
];

const created = [];
if (seed('collections', defaultCollections)) created.push('collections');
if (seed('categories', defaultCategories)) created.push('categories');
if (seed('products', products)) created.push('products');
if (seed('orders', [])) created.push('orders');
if (seed('accounts', adminAccounts)) created.push('accounts');
if (seed('contacts', [])) created.push('contacts');
if (seed('carts', [])) created.push('carts');

console.log('Seeded collections:', created.length ? created.join(', ') : '(none, all exist already)');