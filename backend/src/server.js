const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ✅ Render/Proxy ke liye zaruri
app.set('trust proxy', 1);

// ✅ CORS — sabhi networks se kaam karega
app.use(cors({
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests.' }
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Auto Seed ────────────────────────────────────────────
const autoSeed = async () => {
  try {
    const Product = require('./models/Product');
    const User = require('./models/User');
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    if (productCount === 0 || userCount === 0) {
      console.log('🌱 Auto seeding...');
      await Product.deleteMany();
      await User.deleteMany();
      await User.create({ name: 'Admin User', email: 'admin@shopwave.in', password: 'admin123456', role: 'admin' });
      await User.create({ name: 'Demo User', email: 'demo@shopwave.in', password: 'demo123456', role: 'user' });

      const products = [
        // PHONES
        { name: 'Apple iPhone 15 Pro 256GB', description: 'A17 Pro chip, titanium design, 48MP camera.', price: 134900, originalPrice: 149900, discount: 10, category: 'Electronics', brand: 'Apple', stock: 50, rating: 4.8, numReviews: 320, sold: 1200, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', isPrimary: true }], tags: ['iphone', 'apple', 'smartphone', 'phone', 'mobile', '5g'] },
        { name: 'Apple iPhone 14 128GB', description: 'A15 Bionic chip, dual camera, all-day battery.', price: 79900, originalPrice: 89900, discount: 11, category: 'Electronics', brand: 'Apple', stock: 45, rating: 4.7, numReviews: 890, sold: 2300, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600', isPrimary: true }], tags: ['iphone', 'apple', 'smartphone', 'phone', 'mobile'] },
        { name: 'Apple iPhone 13 128GB', description: 'A15 Bionic, dual 12MP camera, Ceramic Shield.', price: 59900, originalPrice: 69900, discount: 14, category: 'Electronics', brand: 'Apple', stock: 60, rating: 4.6, numReviews: 1200, sold: 3400, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600', isPrimary: true }], tags: ['iphone', 'apple', 'smartphone', 'phone', 'mobile'] },
        { name: 'Samsung Galaxy S24 Ultra 512GB', description: 'S Pen, 200MP camera, Galaxy AI features.', price: 129999, originalPrice: 139999, discount: 7, category: 'Electronics', brand: 'Samsung', stock: 35, rating: 4.7, numReviews: 218, sold: 890, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1706439218479-01f8c0c53503?w=600', isPrimary: true }], tags: ['samsung', 'galaxy', 'smartphone', 'phone', 'mobile', '5g'] },
        { name: 'Samsung Galaxy S23 FE 256GB', description: 'Snapdragon 8 Gen 1, 50MP camera, 4500mAh battery.', price: 44999, originalPrice: 54999, discount: 18, category: 'Electronics', brand: 'Samsung', stock: 55, rating: 4.4, numReviews: 560, sold: 1100, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600', isPrimary: true }], tags: ['samsung', 'galaxy', 'smartphone', 'phone', 'mobile', '5g'] },
        { name: 'Samsung Galaxy A54 5G 128GB', description: 'Triple 50MP camera, 5000mAh, Super AMOLED.', price: 38999, originalPrice: 44999, discount: 13, category: 'Electronics', brand: 'Samsung', stock: 80, rating: 4.4, numReviews: 1200, sold: 3400, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600', isPrimary: true }], tags: ['samsung', 'galaxy', 'smartphone', 'phone', 'mobile', '5g'] },
        { name: 'OnePlus 12 256GB', description: 'Snapdragon 8 Gen 3, Hasselblad camera, 100W.', price: 64999, originalPrice: 69999, discount: 7, category: 'Electronics', brand: 'OnePlus', stock: 60, rating: 4.6, numReviews: 445, sold: 1100, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600', isPrimary: true }], tags: ['oneplus', 'smartphone', 'phone', 'mobile', '5g'] },
        { name: 'OnePlus Nord CE3 Lite 5G', description: '108MP camera, 5000mAh, 67W SUPERVOOC.', price: 19999, originalPrice: 25999, discount: 23, category: 'Electronics', brand: 'OnePlus', stock: 90, rating: 4.2, numReviews: 890, sold: 2300, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600', isPrimary: true }], tags: ['oneplus', 'nord', 'smartphone', 'phone', 'mobile', '5g'] },
        { name: 'Xiaomi Redmi Note 13 Pro 256GB', description: '200MP camera, 5100mAh, 67W fast charging.', price: 26999, originalPrice: 31999, discount: 16, category: 'Electronics', brand: 'Xiaomi', stock: 120, rating: 4.3, numReviews: 2300, sold: 5600, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600', isPrimary: true }], tags: ['xiaomi', 'redmi', 'smartphone', 'phone', 'mobile', '5g'] },
        { name: 'Xiaomi 13 Pro 256GB', description: 'Snapdragon 8 Gen 2, Leica camera, 120W charging.', price: 79999, originalPrice: 89999, discount: 11, category: 'Electronics', brand: 'Xiaomi', stock: 40, rating: 4.5, numReviews: 340, sold: 780, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600', isPrimary: true }], tags: ['xiaomi', 'smartphone', 'phone', 'mobile', '5g'] },

        // LAPTOPS
        { name: 'MacBook Air M3 13" 16GB', description: 'M3 chip, all-day battery, Retina display.', price: 134900, originalPrice: 149900, discount: 10, category: 'Electronics', brand: 'Apple', stock: 25, rating: 4.9, numReviews: 184, sold: 650, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600', isPrimary: true }], tags: ['macbook', 'apple', 'laptop', 'computer', 'm3'] },
        { name: 'MacBook Pro M3 14" 18GB', description: 'M3 Pro chip, ProMotion, 22 hours battery.', price: 199900, originalPrice: 219900, discount: 9, category: 'Electronics', brand: 'Apple', stock: 15, rating: 4.9, numReviews: 120, sold: 340, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', isPrimary: true }], tags: ['macbook', 'apple', 'laptop', 'computer', 'm3', 'pro'] },
        { name: 'Dell XPS 15 Intel i7', description: 'OLED display, 12th Gen i7, premium build.', price: 149990, originalPrice: 169990, discount: 12, category: 'Electronics', brand: 'Dell', stock: 20, rating: 4.6, numReviews: 230, sold: 420, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600', isPrimary: true }], tags: ['dell', 'xps', 'laptop', 'computer', 'windows'] },
        { name: 'HP Pavilion 15 AMD Ryzen 5', description: 'Ryzen 5, 16GB RAM, 512GB SSD, Full HD.', price: 64990, originalPrice: 79990, discount: 19, category: 'Electronics', brand: 'HP', stock: 40, rating: 4.3, numReviews: 560, sold: 890, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600', isPrimary: true }], tags: ['hp', 'pavilion', 'laptop', 'computer', 'windows', 'amd'] },
        { name: 'Lenovo IdeaPad Slim 5 i5', description: 'Intel i5 12th Gen, 16GB RAM, 512GB SSD.', price: 59990, originalPrice: 74990, discount: 20, category: 'Electronics', brand: 'Lenovo', stock: 35, rating: 4.4, numReviews: 780, sold: 1200, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600', isPrimary: true }], tags: ['lenovo', 'ideapad', 'laptop', 'computer', 'windows', 'intel'] },
        { name: 'ASUS ROG Strix G15 Gaming', description: 'Ryzen 9, RTX 3070, 16GB RAM, 144Hz.', price: 139990, originalPrice: 159990, discount: 13, category: 'Electronics', brand: 'ASUS', stock: 18, rating: 4.7, numReviews: 340, sold: 560, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600', isPrimary: true }], tags: ['asus', 'rog', 'gaming', 'laptop', 'computer'] },

        // HEADPHONES
        { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise canceling, 30hr battery.', price: 24990, originalPrice: 34990, discount: 29, category: 'Electronics', brand: 'Sony', stock: 80, rating: 4.9, numReviews: 567, sold: 2300, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600', isPrimary: true }], tags: ['headphones', 'sony', 'wireless', 'earphones', 'audio'] },
        { name: 'boAt Rockerz 450 Headphones', description: '15hr battery, 40mm drivers, built-in mic.', price: 1299, originalPrice: 3990, discount: 67, category: 'Electronics', brand: 'boAt', stock: 200, rating: 4.2, numReviews: 45000, sold: 120000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', isPrimary: true }], tags: ['headphones', 'boat', 'bluetooth', 'earphones', 'audio'] },
        { name: 'JBL Tune 760NC Headphones', description: 'ANC, 35 hours playtime, JBL Pure Bass.', price: 5999, originalPrice: 9999, discount: 40, category: 'Electronics', brand: 'JBL', stock: 90, rating: 4.3, numReviews: 2300, sold: 5600, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600', isPrimary: true }], tags: ['headphones', 'jbl', 'wireless', 'earphones', 'audio'] },
        { name: 'Apple AirPods Pro 2nd Gen', description: 'Active Noise Cancellation, MagSafe charging.', price: 24900, originalPrice: 26900, discount: 7, category: 'Electronics', brand: 'Apple', stock: 60, rating: 4.8, numReviews: 2300, sold: 5600, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=600', isPrimary: true }], tags: ['airpods', 'apple', 'earbuds', 'earphones', 'wireless', 'audio'] },
        { name: 'Bose QuietComfort 45', description: 'World-class ANC, 24hr battery, comfortable.', price: 29999, originalPrice: 35999, discount: 17, category: 'Electronics', brand: 'Bose', stock: 30, rating: 4.8, numReviews: 890, sold: 1200, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', isPrimary: true }], tags: ['headphones', 'bose', 'wireless', 'earphones', 'audio', 'anc'] },

        // TVs & TABLETS
        { name: 'Samsung 65" 4K QLED TV', description: 'Quantum HDR, Alexa built-in, 4K AI Upscaling.', price: 89990, originalPrice: 119990, discount: 25, category: 'Electronics', brand: 'Samsung', stock: 15, rating: 4.7, numReviews: 890, sold: 340, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600', isPrimary: true }], tags: ['tv', 'television', 'samsung', '4k', 'qled', 'smart-tv'] },
        { name: 'LG 55" OLED 4K Smart TV', description: 'OLED display, α9 AI Processor, Dolby Vision.', price: 119990, originalPrice: 149990, discount: 20, category: 'Electronics', brand: 'LG', stock: 10, rating: 4.8, numReviews: 450, sold: 230, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600', isPrimary: true }], tags: ['tv', 'television', 'lg', '4k', 'oled', 'smart-tv'] },
        { name: 'Apple iPad Pro M2 256GB', description: 'M2 chip, Liquid Retina XDR display.', price: 112900, originalPrice: 124900, discount: 10, category: 'Electronics', brand: 'Apple', stock: 30, rating: 4.8, numReviews: 560, sold: 890, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', isPrimary: true }], tags: ['ipad', 'apple', 'tablet', 'm2', 'ipad-pro'] },
        { name: 'Samsung Galaxy Tab S9 256GB', description: 'Snapdragon 8 Gen 2, Dynamic AMOLED 2X display.', price: 72999, originalPrice: 85999, discount: 15, category: 'Electronics', brand: 'Samsung', stock: 25, rating: 4.6, numReviews: 340, sold: 560, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', isPrimary: true }], tags: ['tablet', 'samsung', 'galaxy-tab', 'android'] },

        // ── FASHION — SHOES (10) ──────────────────────────────
        { name: 'Nike Air Max 270', description: 'Largest heel Air unit for super-soft ride.', price: 12995, originalPrice: 15995, discount: 19, category: 'Fashion', brand: 'Nike', stock: 120, rating: 4.6, numReviews: 892, sold: 3400, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', isPrimary: true }], tags: ['shoes', 'nike', 'sneakers', 'footwear', 'running-shoes'] },
        { name: 'Nike Air Force 1', description: 'Classic court style, durable leather upper.', price: 9995, originalPrice: 11995, discount: 17, category: 'Fashion', brand: 'Nike', stock: 100, rating: 4.5, numReviews: 2300, sold: 5600, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', isPrimary: true }], tags: ['shoes', 'nike', 'sneakers', 'footwear', 'casual'] },
        { name: 'Adidas Ultraboost 22', description: 'BOOST midsole for incredible energy return.', price: 14999, originalPrice: 18000, discount: 17, category: 'Fashion', brand: 'Adidas', stock: 85, rating: 4.5, numReviews: 1200, sold: 2800, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600', isPrimary: true }], tags: ['shoes', 'adidas', 'sneakers', 'footwear', 'running-shoes'] },
        { name: 'Adidas Stan Smith', description: 'Iconic tennis shoe with clean leather upper.', price: 7999, originalPrice: 9999, discount: 20, category: 'Fashion', brand: 'Adidas', stock: 150, rating: 4.4, numReviews: 3400, sold: 8900, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600', isPrimary: true }], tags: ['shoes', 'adidas', 'sneakers', 'footwear', 'casual'] },
        { name: 'Puma RS-X Sneakers', description: 'Chunky silhouette with mesh and suede panels.', price: 6999, originalPrice: 9999, discount: 30, category: 'Fashion', brand: 'Puma', stock: 95, rating: 4.2, numReviews: 780, sold: 1800, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', isPrimary: true }], tags: ['shoes', 'puma', 'sneakers', 'footwear', 'casual'] },
        { name: 'Reebok Classic Leather', description: 'Timeless design with soft garment leather upper.', price: 5999, originalPrice: 7999, discount: 25, category: 'Fashion', brand: 'Reebok', stock: 110, rating: 4.3, numReviews: 560, sold: 1200, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', isPrimary: true }], tags: ['shoes', 'reebok', 'sneakers', 'footwear', 'casual'] },
        { name: 'Bata Formal Leather Shoes', description: 'Premium leather formal shoes for office wear.', price: 2999, originalPrice: 4999, discount: 40, category: 'Fashion', brand: 'Bata', stock: 200, rating: 4.1, numReviews: 1890, sold: 4500, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600', isPrimary: true }], tags: ['shoes', 'bata', 'formal', 'footwear', 'leather', 'office'] },
        { name: 'Woodland Trekking Boots', description: 'Waterproof leather boots for outdoor adventures.', price: 4999, originalPrice: 7499, discount: 33, category: 'Fashion', brand: 'Woodland', stock: 70, rating: 4.4, numReviews: 2300, sold: 5600, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', isPrimary: true }], tags: ['shoes', 'woodland', 'boots', 'footwear', 'trekking', 'outdoor'] },
        { name: 'Red Tape Oxford Shoes', description: 'Classic oxford design with genuine leather.', price: 2499, originalPrice: 3999, discount: 38, category: 'Fashion', brand: 'Red Tape', stock: 150, rating: 4.0, numReviews: 890, sold: 2300, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600', isPrimary: true }], tags: ['shoes', 'formal', 'oxford', 'footwear', 'leather'] },
        { name: 'Campus Running Shoes', description: 'Lightweight mesh upper with cushioned sole.', price: 1499, originalPrice: 2499, discount: 40, category: 'Fashion', brand: 'Campus', stock: 250, rating: 4.1, numReviews: 5600, sold: 15000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', isPrimary: true }], tags: ['shoes', 'campus', 'running-shoes', 'footwear', 'sports'] },

        // CLOTHING
        { name: "Levi's 511 Slim Fit Jeans", description: 'Slim fit jean, mid rise, slightly tapered.', price: 2999, originalPrice: 4999, discount: 40, category: 'Fashion', brand: "Levi's", stock: 200, rating: 4.4, numReviews: 1240, sold: 5600, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', isPrimary: true }], tags: ['jeans', 'levis', 'denim', 'pants', 'clothing'] },
        { name: "Levi's 501 Original Jeans", description: 'The original straight fit jean since 1873.', price: 3499, originalPrice: 5499, discount: 36, category: 'Fashion', brand: "Levi's", stock: 180, rating: 4.5, numReviews: 2300, sold: 6700, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', isPrimary: true }], tags: ['jeans', 'levis', 'denim', 'pants', 'clothing'] },
        { name: 'H&M Oversized Cotton T-Shirt', description: 'Relaxed oversized fit in soft cotton jersey.', price: 799, originalPrice: 1299, discount: 38, category: 'Fashion', brand: 'H&M', stock: 500, rating: 4.1, numReviews: 3400, sold: 12000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', isPrimary: true }], tags: ['tshirt', 'shirt', 'tops', 'clothing', 'cotton', 'casual'] },
        { name: 'Zara Slim Fit Blazer', description: 'Elegant slim fit blazer for formal occasions.', price: 5990, originalPrice: 8990, discount: 33, category: 'Fashion', brand: 'Zara', stock: 60, rating: 4.3, numReviews: 780, sold: 1200, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600', isPrimary: true }], tags: ['blazer', 'jacket', 'formal', 'zara', 'suit', 'clothing'] },
        { name: "Puma Men's Sports T-Shirt", description: 'Dry Cell technology for intense workouts.', price: 1299, originalPrice: 2499, discount: 48, category: 'Fashion', brand: 'Puma', stock: 300, rating: 4.2, numReviews: 2100, sold: 7800, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600', isPrimary: true }], tags: ['tshirt', 'shirt', 'tops', 'puma', 'clothing', 'gym'] },
        { name: 'Raymond Formal Shirt', description: 'Premium cotton formal shirt for office wear.', price: 1999, originalPrice: 2999, discount: 33, category: 'Fashion', brand: 'Raymond', stock: 200, rating: 4.3, numReviews: 1200, sold: 3400, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1581791538161-8a12c0ba9b22?w=600', isPrimary: true }], tags: ['shirt', 'formal', 'raymond', 'clothing', 'office'] },
        { name: 'Allen Solly Chinos', description: 'Slim fit chinos in stretch cotton fabric.', price: 2499, originalPrice: 3999, discount: 38, category: 'Fashion', brand: 'Allen Solly', stock: 150, rating: 4.2, numReviews: 890, sold: 2300, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600', isPrimary: true }], tags: ['chinos', 'pants', 'trousers', 'clothing', 'formal', 'casual'] },
        { name: 'Ray-Ban Aviator Sunglasses', description: 'Iconic aviator with gold frame and G-15 lenses.', price: 8990, originalPrice: 11990, discount: 25, category: 'Fashion', brand: 'Ray-Ban', stock: 45, rating: 4.7, numReviews: 1890, sold: 3200, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', isPrimary: true }], tags: ['sunglasses', 'rayban', 'eyewear', 'aviator', 'accessories'] },
        { name: 'Wildcraft 40L Trekking Backpack', description: 'Durable backpack with rain cover.', price: 2499, originalPrice: 3999, discount: 38, category: 'Fashion', brand: 'Wildcraft', stock: 75, rating: 4.4, numReviews: 3200, sold: 5400, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', isPrimary: true }], tags: ['backpack', 'bag', 'wildcraft', 'travel', 'trekking'] },
        { name: 'Casio G-Shock Watch', description: 'Shock resistant, water resistant 200m, solar powered.', price: 7995, originalPrice: 10995, discount: 27, category: 'Fashion', brand: 'Casio', stock: 60, rating: 4.6, numReviews: 3400, sold: 7800, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', isPrimary: true }], tags: ['watch', 'casio', 'gshock', 'accessories', 'waterproof'] },
        { name: 'Fossil Gen 6 Smartwatch', description: 'Wear OS, heart rate, GPS, 1.28" AMOLED display.', price: 19999, originalPrice: 28999, discount: 31, category: 'Fashion', brand: 'Fossil', stock: 35, rating: 4.3, numReviews: 780, sold: 1200, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', isPrimary: true }], tags: ['watch', 'smartwatch', 'fossil', 'accessories', 'wearable'] },

        // ── HOME & LIVING (12) ────────────────────────────────
        { name: 'IKEA KALLAX Shelf Unit', description: 'Clean design shelf, works as room divider.', price: 8990, originalPrice: 9990, discount: 10, category: 'Home & Living', brand: 'IKEA', stock: 45, rating: 4.5, numReviews: 432, sold: 890, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', isPrimary: true }], tags: ['shelf', 'furniture', 'ikea', 'storage', 'home'] },
        { name: 'Dyson V15 Cordless Vacuum', description: 'Laser dust detection, adaptive suction.', price: 52900, originalPrice: 62900, discount: 16, category: 'Home & Living', brand: 'Dyson', stock: 30, rating: 4.7, numReviews: 328, sold: 780, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', isPrimary: true }], tags: ['vacuum', 'dyson', 'cleaner', 'cordless', 'home'] },
        { name: 'Philips Air Fryer HD9200', description: 'Fry with 90% less fat. 4.1L capacity.', price: 7995, originalPrice: 10995, discount: 27, category: 'Home & Living', brand: 'Philips', stock: 65, rating: 4.5, numReviews: 5600, sold: 12000, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1648147866735-6d4a9dec4950?w=600', isPrimary: true }], tags: ['airfryer', 'air-fryer', 'philips', 'kitchen', 'cooking'] },
        { name: 'Prestige Induction Cooktop', description: '8 preset menus, touch panel, auto switch-off.', price: 2499, originalPrice: 3999, discount: 38, category: 'Home & Living', brand: 'Prestige', stock: 100, rating: 4.3, numReviews: 8900, sold: 25000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', isPrimary: true }], tags: ['induction', 'cooktop', 'prestige', 'kitchen', 'cooking'] },
        { name: 'Godrej 564L French Door Fridge', description: 'Inverter technology, frost-free cooling.', price: 68990, originalPrice: 85990, discount: 20, category: 'Home & Living', brand: 'Godrej', stock: 12, rating: 4.4, numReviews: 560, sold: 230, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600', isPrimary: true }], tags: ['fridge', 'refrigerator', 'godrej', 'kitchen', 'home'] },
        { name: 'Bajaj Room Heater 1000W', description: 'Radiant heater with overheat protection.', price: 1299, originalPrice: 2199, discount: 41, category: 'Home & Living', brand: 'Bajaj', stock: 150, rating: 4.1, numReviews: 3400, sold: 9800, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600', isPrimary: true }], tags: ['heater', 'room-heater', 'bajaj', 'winter', 'home'] },
        { name: 'Havells Ceiling Fan 1200mm', description: 'Energy efficient BLDC motor, remote control.', price: 3999, originalPrice: 5999, discount: 33, category: 'Home & Living', brand: 'Havells', stock: 80, rating: 4.4, numReviews: 2300, sold: 5600, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600', isPrimary: true }], tags: ['fan', 'ceiling-fan', 'havells', 'home', 'appliance'] },
        { name: 'Crompton Geyser 15L', description: '15L storage water heater, 5 star rated, anti-rust.', price: 6999, originalPrice: 9999, discount: 30, category: 'Home & Living', brand: 'Crompton', stock: 55, rating: 4.3, numReviews: 1200, sold: 2800, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600', isPrimary: true }], tags: ['geyser', 'water-heater', 'crompton', 'home', 'bathroom'] },
        { name: 'Bosch Front Load Washing Machine 8kg', description: 'EcoSilence Drive, Anti-vibration, 1400 RPM.', price: 42990, originalPrice: 55990, discount: 23, category: 'Home & Living', brand: 'Bosch', stock: 20, rating: 4.6, numReviews: 670, sold: 340, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600', isPrimary: true }], tags: ['washing-machine', 'bosch', 'appliance', 'home', 'laundry'] },
        { name: 'Voltas 1.5 Ton 5 Star AC', description: 'Inverter AC, 5 star, auto cleaner, Wi-Fi enabled.', price: 39990, originalPrice: 49990, discount: 20, category: 'Home & Living', brand: 'Voltas', stock: 25, rating: 4.4, numReviews: 890, sold: 450, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600', isPrimary: true }], tags: ['ac', 'air-conditioner', 'voltas', 'home', 'appliance', 'cooling'] },
        { name: 'Nilkamal Queen Bed with Storage', description: 'Solid wood queen size bed with hydraulic storage.', price: 24999, originalPrice: 34999, discount: 29, category: 'Home & Living', brand: 'Nilkamal', stock: 15, rating: 4.3, numReviews: 340, sold: 120, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', isPrimary: true }], tags: ['bed', 'furniture', 'bedroom', 'storage', 'home', 'wooden'] },
        { name: 'Morphy Richards OTG 60L', description: '60L OTG oven with convection, rotisserie, 6 heating modes.', price: 8999, originalPrice: 12999, discount: 31, category: 'Home & Living', brand: 'Morphy Richards', stock: 40, rating: 4.4, numReviews: 1200, sold: 2300, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', isPrimary: true }], tags: ['oven', 'otg', 'kitchen', 'cooking', 'baking', 'home'] },

        // ── BOOKS (10) ────────────────────────────────────────
        { name: 'Atomic Habits by James Clear', description: 'Build good habits and break bad ones.', price: 499, originalPrice: 799, discount: 38, category: 'Books', brand: 'Penguin Random House', stock: 500, rating: 4.9, numReviews: 12400, sold: 45000, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', isPrimary: true }], tags: ['atomic-habits', 'self-help', 'habits', 'productivity', 'book'] },
        { name: 'Rich Dad Poor Dad', description: 'What the rich teach kids about money.', price: 399, originalPrice: 599, discount: 33, category: 'Books', brand: 'Manjul Publishing', stock: 400, rating: 4.7, numReviews: 18900, sold: 67000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600', isPrimary: true }], tags: ['rich-dad', 'finance', 'money', 'investing', 'book'] },
        { name: 'The Psychology of Money', description: 'Timeless lessons on wealth and happiness.', price: 449, originalPrice: 699, discount: 36, category: 'Books', brand: 'Jaico Publishing', stock: 350, rating: 4.8, numReviews: 9800, sold: 34000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600', isPrimary: true }], tags: ['psychology-of-money', 'finance', 'money', 'investing', 'book'] },
        { name: 'The Alchemist by Paulo Coelho', description: 'A mystical story about following dreams.', price: 299, originalPrice: 499, discount: 40, category: 'Books', brand: 'HarperCollins', stock: 600, rating: 4.6, numReviews: 22000, sold: 89000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600', isPrimary: true }], tags: ['alchemist', 'fiction', 'novel', 'coelho', 'book'] },
        { name: 'Zero to One by Peter Thiel', description: 'How to build the future for entrepreneurs.', price: 549, originalPrice: 799, discount: 31, category: 'Books', brand: 'Virgin Books', stock: 280, rating: 4.5, numReviews: 6700, sold: 21000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600', isPrimary: true }], tags: ['zero-to-one', 'startup', 'business', 'entrepreneurship', 'book'] },
        { name: 'Think and Grow Rich', description: 'Napoleon Hill classic on wealth mindset.', price: 299, originalPrice: 499, discount: 40, category: 'Books', brand: 'General Press', stock: 450, rating: 4.6, numReviews: 15600, sold: 56000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', isPrimary: true }], tags: ['think-grow-rich', 'self-help', 'mindset', 'success', 'book'] },
        { name: 'The Lean Startup by Eric Ries', description: 'How to build successful businesses fast.', price: 599, originalPrice: 899, discount: 33, category: 'Books', brand: 'Portfolio', stock: 300, rating: 4.5, numReviews: 5600, sold: 18900, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600', isPrimary: true }], tags: ['lean-startup', 'startup', 'business', 'entrepreneurship', 'book'] },
        { name: 'Deep Work by Cal Newport', description: 'Rules for focused success in distracted world.', price: 499, originalPrice: 799, discount: 38, category: 'Books', brand: 'Piatkus', stock: 280, rating: 4.7, numReviews: 7800, sold: 23000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', isPrimary: true }], tags: ['deep-work', 'productivity', 'focus', 'self-help', 'book'] },
        { name: 'Sapiens by Yuval Noah Harari', description: 'A brief history of humankind. Bestseller.', price: 599, originalPrice: 899, discount: 33, category: 'Books', brand: 'Vintage Books', stock: 350, rating: 4.8, numReviews: 19800, sold: 67000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600', isPrimary: true }], tags: ['sapiens', 'history', 'non-fiction', 'bestseller', 'book'] },
        { name: 'Harry Potter Complete Box Set', description: 'All 7 books in stunning hardcover edition.', price: 3999, originalPrice: 5999, discount: 33, category: 'Books', brand: 'Bloomsbury', stock: 150, rating: 4.9, numReviews: 34000, sold: 89000, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600', isPrimary: true }], tags: ['harry-potter', 'fiction', 'fantasy', 'novel', 'book', 'boxset'] },

        // ── SPORTS (10) ───────────────────────────────────────
        { name: 'Yonex Astrox 88S Badminton Racket', description: 'Professional racket used by top players.', price: 8999, originalPrice: 11999, discount: 25, category: 'Sports', brand: 'Yonex', stock: 40, rating: 4.7, numReviews: 1200, sold: 2300, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600', isPrimary: true }], tags: ['badminton', 'racket', 'yonex', 'shuttlecock', 'indoor-game'] },
        { name: 'SG Cricket Bat English Willow', description: 'Grade 1 English Willow for competitive cricket.', price: 4999, originalPrice: 7999, discount: 38, category: 'Sports', brand: 'SG', stock: 30, rating: 4.5, numReviews: 890, sold: 1200, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600', isPrimary: true }], tags: ['cricket', 'bat', 'cricket-bat', 'sg', 'willow'] },
        { name: 'Nivia Football Size 5', description: 'Official size football for professional matches.', price: 899, originalPrice: 1499, discount: 40, category: 'Sports', brand: 'Nivia', stock: 150, rating: 4.3, numReviews: 2300, sold: 6700, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600', isPrimary: true }], tags: ['football', 'soccer', 'ball', 'nivia', 'outdoor-game'] },
        { name: 'Cosco Dumbbell Set 20kg', description: 'Vinyl coated dumbbells for home gym.', price: 1999, originalPrice: 3499, discount: 43, category: 'Sports', brand: 'Cosco', stock: 80, rating: 4.2, numReviews: 4500, sold: 11000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', isPrimary: true }], tags: ['dumbbell', 'gym', 'weights', 'fitness', 'exercise'] },
        { name: 'Adidas Pro Boxing Gloves', description: 'Professional boxing gloves with palm padding.', price: 2499, originalPrice: 3999, discount: 38, category: 'Sports', brand: 'Adidas', stock: 55, rating: 4.4, numReviews: 780, sold: 1900, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600', isPrimary: true }], tags: ['boxing', 'gloves', 'adidas', 'gym', 'fitness'] },
        { name: 'Decathlon Yoga Mat 8mm', description: 'Extra thick non-slip yoga mat with carry strap.', price: 999, originalPrice: 1499, discount: 33, category: 'Sports', brand: 'Decathlon', stock: 200, rating: 4.4, numReviews: 8900, sold: 25000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600', isPrimary: true }], tags: ['yoga', 'yoga-mat', 'decathlon', 'fitness', 'exercise', 'gym'] },
        { name: 'Boldfit Resistance Bands Set', description: 'Set of 5 resistance bands for full body workout.', price: 799, originalPrice: 1499, discount: 47, category: 'Sports', brand: 'Boldfit', stock: 300, rating: 4.3, numReviews: 5600, sold: 15000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', isPrimary: true }], tags: ['resistance-bands', 'gym', 'fitness', 'exercise', 'workout'] },
        { name: 'Kreedon Basketball Size 7', description: 'Official size outdoor basketball, durable rubber.', price: 1299, originalPrice: 1999, discount: 35, category: 'Sports', brand: 'Kreedon', stock: 100, rating: 4.2, numReviews: 890, sold: 2300, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600', isPrimary: true }], tags: ['basketball', 'ball', 'outdoor', 'sports', 'game'] },
        { name: 'Nivia Tennis Racket Pro', description: 'Aluminum frame racket for recreational tennis.', price: 1499, originalPrice: 2499, discount: 40, category: 'Sports', brand: 'Nivia', stock: 60, rating: 4.1, numReviews: 450, sold: 890, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600', isPrimary: true }], tags: ['tennis', 'racket', 'nivia', 'sports', 'outdoor'] },
        { name: 'Lifelong Folding Treadmill', description: 'Manual treadmill with 3-level incline, foldable design.', price: 12999, originalPrice: 19999, discount: 35, category: 'Sports', brand: 'Lifelong', stock: 25, rating: 4.2, numReviews: 1200, sold: 2300, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', isPrimary: true }], tags: ['treadmill', 'gym', 'fitness', 'exercise', 'cardio'] },

        // ── BEAUTY (10) ───────────────────────────────────────
        { name: 'Maybelline Fit Me Foundation', description: 'Matte + Poreless Foundation. SPF 18.', price: 499, originalPrice: 699, discount: 29, category: 'Beauty', brand: 'Maybelline', stock: 300, rating: 4.3, numReviews: 5600, sold: 18000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600', isPrimary: true }], tags: ['foundation', 'makeup', 'maybelline', 'cosmetics', 'face'] },
        { name: 'Lakme 9to5 Matte Lipstick', description: 'All-day matte finish with built-in primer.', price: 349, originalPrice: 525, discount: 33, category: 'Beauty', brand: 'Lakme', stock: 400, rating: 4.2, numReviews: 8900, sold: 29000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1586495777744-4e6232bf8987?w=600', isPrimary: true }], tags: ['lipstick', 'makeup', 'lakme', 'cosmetics', 'lips'] },
        { name: 'Biotique Honey Gel Face Wash', description: 'Deep cleansing with honey extracts.', price: 199, originalPrice: 320, discount: 38, category: 'Beauty', brand: 'Biotique', stock: 500, rating: 4.1, numReviews: 12000, sold: 45000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', isPrimary: true }], tags: ['facewash', 'face-wash', 'biotique', 'skincare', 'cleanser'] },
        { name: 'Wow Vitamin C Serum', description: '20% Vitamin C for brightening skin.', price: 599, originalPrice: 999, discount: 40, category: 'Beauty', brand: 'Wow', stock: 200, rating: 4.4, numReviews: 15600, sold: 52000, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', isPrimary: true }], tags: ['serum', 'vitamin-c', 'skincare', 'wow', 'anti-aging'] },
        { name: 'LOreal Paris Hyaluron Expert Moisturizer', description: 'Hyaluronic acid moisturizer for plump skin.', price: 699, originalPrice: 999, discount: 30, category: 'Beauty', brand: "L'Oreal", stock: 250, rating: 4.4, numReviews: 7800, sold: 23000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', isPrimary: true }], tags: ['moisturizer', 'skincare', 'loreal', 'hyaluronic', 'face-cream'] },
        { name: 'Neutrogena Sunscreen SPF 50', description: 'Ultra sheer sunscreen, non-greasy, water resistant.', price: 599, originalPrice: 899, discount: 33, category: 'Beauty', brand: 'Neutrogena', stock: 350, rating: 4.5, numReviews: 12000, sold: 35000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', isPrimary: true }], tags: ['sunscreen', 'spf', 'neutrogena', 'skincare', 'sun-protection'] },
        { name: 'The Body Shop Tea Tree Face Wash', description: 'Purifying face wash for blemish-prone skin.', price: 795, originalPrice: 1195, discount: 33, category: 'Beauty', brand: 'The Body Shop', stock: 180, rating: 4.3, numReviews: 4500, sold: 12000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', isPrimary: true }], tags: ['facewash', 'tea-tree', 'body-shop', 'skincare', 'acne'] },
        { name: 'Forest Essentials Face Cream', description: 'Ayurvedic luxurious face cream with pure herbs.', price: 1595, originalPrice: 2395, discount: 33, category: 'Beauty', brand: 'Forest Essentials', stock: 100, rating: 4.6, numReviews: 2300, sold: 5600, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', isPrimary: true }], tags: ['face-cream', 'ayurvedic', 'skincare', 'luxury', 'herbal'] },
        { name: 'Mamaearth Onion Hair Oil', description: 'Promotes hair growth and reduces hair fall.', price: 349, originalPrice: 599, discount: 42, category: 'Beauty', brand: 'Mamaearth', stock: 400, rating: 4.3, numReviews: 18900, sold: 67000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', isPrimary: true }], tags: ['hair-oil', 'onion', 'mamaearth', 'haircare', 'hair-growth'] },
        { name: 'Dove Body Lotion 400ml', description: 'Deep moisturizing body lotion with 1/4 moisturizing cream.', price: 299, originalPrice: 449, discount: 33, category: 'Beauty', brand: 'Dove', stock: 500, rating: 4.4, numReviews: 23000, sold: 78000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', isPrimary: true }], tags: ['body-lotion', 'dove', 'skincare', 'moisturizer', 'body-care'] },

        // ── TOYS (8) ──────────────────────────────────────────
        { name: 'LEGO Technic Bugatti Chiron', description: '3599 pieces, W16 engine with moving pistons.', price: 34999, originalPrice: 39999, discount: 13, category: 'Toys', brand: 'LEGO', stock: 20, rating: 4.8, numReviews: 234, sold: 560, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600', isPrimary: true }], tags: ['lego', 'technic', 'building-blocks', 'collectible', 'kids-toy'] },
        { name: 'Hot Wheels Track Set', description: 'Exciting track with 2 cars, loops and twists.', price: 1499, originalPrice: 2499, discount: 40, category: 'Toys', brand: 'Hot Wheels', stock: 80, rating: 4.3, numReviews: 3400, sold: 9800, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600', isPrimary: true }], tags: ['hotwheels', 'cars', 'racing', 'kids-toy', 'track'] },
        { name: 'Monopoly Classic Board Game', description: 'Classic property trading game for family.', price: 899, originalPrice: 1499, discount: 40, category: 'Toys', brand: 'Hasbro', stock: 120, rating: 4.5, numReviews: 6700, sold: 18900, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=600', isPrimary: true }], tags: ['monopoly', 'board-game', 'hasbro', 'family-game', 'kids-toy'] },
        { name: 'LEGO City Police Station', description: '743 pieces city police set with vehicles.', price: 9999, originalPrice: 12999, discount: 23, category: 'Toys', brand: 'LEGO', stock: 35, rating: 4.7, numReviews: 890, sold: 1200, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600', isPrimary: true }], tags: ['lego', 'city', 'building-blocks', 'police', 'kids-toy'] },
        { name: 'Funskool Scrabble Word Game', description: 'Classic word building board game, 2-4 players.', price: 699, originalPrice: 999, discount: 30, category: 'Toys', brand: 'Funskool', stock: 150, rating: 4.4, numReviews: 3400, sold: 8900, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=600', isPrimary: true }], tags: ['scrabble', 'word-game', 'board-game', 'family-game', 'kids-toy'] },
        { name: 'Remote Control Car Buggy', description: 'Off-road RC car with 4WD, 30km/h speed.', price: 2499, originalPrice: 3999, discount: 38, category: 'Toys', brand: 'Maisto', stock: 60, rating: 4.3, numReviews: 1200, sold: 2800, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600', isPrimary: true }], tags: ['rc-car', 'remote-control', 'toys', 'kids', 'outdoor'] },
        { name: 'Play-Doh Modeling Compound Set', description: '10 color Play-Doh set with tools for kids.', price: 599, originalPrice: 999, discount: 40, category: 'Toys', brand: 'Play-Doh', stock: 200, rating: 4.5, numReviews: 5600, sold: 15000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600', isPrimary: true }], tags: ['playdoh', 'clay', 'art', 'kids-toy', 'creative'] },
        { name: 'Nerf N-Strike Blaster', description: 'Foam dart blaster with 12 darts included.', price: 1299, originalPrice: 1999, discount: 35, category: 'Toys', brand: 'Nerf', stock: 90, rating: 4.4, numReviews: 2300, sold: 5600, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600', isPrimary: true }], tags: ['nerf', 'blaster', 'outdoor', 'kids-toy', 'games'] },
      ];

      for (const p of products) {
        await Product.create(p);
      }
      console.log(`✅ Auto seed complete! ${products.length} products added.`);
    } else {
      console.log(`✅ Database already has ${productCount} products — skipping seed.`);
    }
  } catch (err) {
    console.error('❌ Auto seed error:', err.message);
  }
};

// ─── Database Connection ───────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopwave')
  .then(async () => {
    console.log('✅ MongoDB connected');
    await autoSeed();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
app.use('/api/users',    require('./routes/userRoutes'));
app.use('/api/payment',  require('./routes/paymentRoutes'));
app.use('/api/ai',       require('./routes/aiRoutes'));

// ─── Health Check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ShopWave API is running 🚀', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ──────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, message: `${field} already exists` });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ShopWave server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;