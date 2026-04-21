const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Auto Seed Function ───────────────────────────────────
const autoSeed = async () => {
  try {
    const Product = require('./models/Product');
    const User = require('./models/User');

    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();

    if (productCount === 0 || userCount === 0) {
      console.log('🌱 Database empty — auto seeding...');

      // Clear existing
      await Product.deleteMany();
      await User.deleteMany();

      // Create users
      await User.create({ name: 'Admin User', email: 'admin@shopwave.in', password: 'admin123456', role: 'admin' });
      await User.create({ name: 'Demo User', email: 'demo@shopwave.in', password: 'demo123456', role: 'user' });

      // Sample products
      const sampleProducts = [
        { name: 'Apple iPhone 15 Pro 256GB', description: 'A17 Pro chip, titanium design, 48MP camera system.', price: 134900, originalPrice: 149900, discount: 10, category: 'Electronics', brand: 'Apple', stock: 50, rating: 4.8, numReviews: 320, sold: 1200, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', isPrimary: true }], tags: ['iphone', 'apple', 'smartphone', 'phone', 'mobile', '5g', 'ios'] },
        { name: 'Samsung Galaxy S24 Ultra 512GB', description: 'Built-in S Pen, 200MP camera, Galaxy AI features.', price: 129999, originalPrice: 139999, discount: 7, category: 'Electronics', brand: 'Samsung', stock: 35, rating: 4.7, numReviews: 218, sold: 890, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1706439218479-01f8c0c53503?w=600', isPrimary: true }], tags: ['samsung', 'galaxy', 'smartphone', 'phone', 'mobile', '5g', 'android'] },
        { name: 'OnePlus 12 256GB', description: 'Snapdragon 8 Gen 3, Hasselblad camera, 100W charging.', price: 64999, originalPrice: 69999, discount: 7, category: 'Electronics', brand: 'OnePlus', stock: 60, rating: 4.6, numReviews: 445, sold: 1100, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600', isPrimary: true }], tags: ['oneplus', 'smartphone', 'phone', 'mobile', '5g', 'android'] },
        { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise canceling, 30-hour battery.', price: 24990, originalPrice: 34990, discount: 29, category: 'Electronics', brand: 'Sony', stock: 80, rating: 4.9, numReviews: 567, sold: 2300, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600', isPrimary: true }], tags: ['headphones', 'sony', 'wireless', 'earphones', 'audio', 'noise-canceling'] },
        { name: 'boAt Rockerz 450 Headphones', description: '15 hours battery, 40mm drivers, built-in mic.', price: 1299, originalPrice: 3990, discount: 67, category: 'Electronics', brand: 'boAt', stock: 200, rating: 4.2, numReviews: 45000, sold: 120000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', isPrimary: true }], tags: ['headphones', 'boat', 'bluetooth', 'earphones', 'audio', 'wireless'] },
        { name: 'JBL Tune 760NC Headphones', description: 'ANC headphones with 35 hours playtime.', price: 5999, originalPrice: 9999, discount: 40, category: 'Electronics', brand: 'JBL', stock: 90, rating: 4.3, numReviews: 2300, sold: 5600, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600', isPrimary: true }], tags: ['headphones', 'jbl', 'wireless', 'earphones', 'audio', 'noise-canceling'] },
        { name: 'MacBook Air M3 13"', description: 'M3 chip, all-day battery, Liquid Retina display.', price: 134900, originalPrice: 149900, discount: 10, category: 'Electronics', brand: 'Apple', stock: 25, rating: 4.9, numReviews: 184, sold: 650, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600', isPrimary: true }], tags: ['macbook', 'apple', 'laptop', 'computer', 'm3', 'ultrabook'] },
        { name: 'Dell XPS 15 Intel i7', description: 'OLED display, 12th Gen Intel Core i7.', price: 149990, originalPrice: 169990, discount: 12, category: 'Electronics', brand: 'Dell', stock: 20, rating: 4.6, numReviews: 230, sold: 420, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600', isPrimary: true }], tags: ['dell', 'xps', 'laptop', 'computer', 'windows', 'ultrabook'] },
        { name: 'Samsung 65" 4K QLED TV', description: 'Quantum HDR, Alexa built-in, 4K AI Upscaling.', price: 89990, originalPrice: 119990, discount: 25, category: 'Electronics', brand: 'Samsung', stock: 15, rating: 4.7, numReviews: 890, sold: 340, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600', isPrimary: true }], tags: ['tv', 'television', 'samsung', '4k', 'qled', 'smart-tv'] },
        { name: 'Apple iPad Pro M2 256GB', description: 'M2 chip, Liquid Retina XDR display.', price: 112900, originalPrice: 124900, discount: 10, category: 'Electronics', brand: 'Apple', stock: 30, rating: 4.8, numReviews: 560, sold: 890, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', isPrimary: true }], tags: ['ipad', 'apple', 'tablet', 'm2', 'ipad-pro'] },
        { name: 'Nike Air Max 270 Running Shoes', description: 'Largest heel Air unit for a super-soft ride.', price: 12995, originalPrice: 15995, discount: 19, category: 'Fashion', brand: 'Nike', stock: 120, rating: 4.6, numReviews: 892, sold: 3400, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', isPrimary: true }], tags: ['shoes', 'nike', 'sneakers', 'footwear', 'running-shoes', 'airmax'] },
        { name: 'Adidas Ultraboost 22 Shoes', description: 'BOOST midsole for incredible energy return.', price: 14999, originalPrice: 18000, discount: 17, category: 'Fashion', brand: 'Adidas', stock: 85, rating: 4.5, numReviews: 1200, sold: 2800, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600', isPrimary: true }], tags: ['shoes', 'adidas', 'sneakers', 'footwear', 'running-shoes', 'ultraboost'] },
        { name: "Levi's 511 Slim Fit Jeans", description: 'Slim fit jean, slightly tapered leg, mid rise.', price: 2999, originalPrice: 4999, discount: 40, category: 'Fashion', brand: "Levi's", stock: 200, rating: 4.4, numReviews: 1240, sold: 5600, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', isPrimary: true }], tags: ['jeans', 'levis', 'denim', 'pants', 'trousers', 'clothing'] },
        { name: 'H&M Oversized Cotton T-Shirt', description: 'Relaxed-fit oversized tshirt in soft cotton.', price: 799, originalPrice: 1299, discount: 38, category: 'Fashion', brand: 'H&M', stock: 500, rating: 4.1, numReviews: 3400, sold: 12000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', isPrimary: true }], tags: ['tshirt', 'shirt', 'tops', 'clothing', 'cotton', 'casual'] },
        { name: 'Zara Slim Fit Blazer', description: 'Elegant slim fit blazer for formal occasions.', price: 5990, originalPrice: 8990, discount: 33, category: 'Fashion', brand: 'Zara', stock: 60, rating: 4.3, numReviews: 780, sold: 1200, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600', isPrimary: true }], tags: ['blazer', 'jacket', 'formal', 'zara', 'suit', 'clothing'] },
        { name: "Puma Men's Sports T-Shirt", description: 'Dry Cell technology for intense workouts.', price: 1299, originalPrice: 2499, discount: 48, category: 'Fashion', brand: 'Puma', stock: 300, rating: 4.2, numReviews: 2100, sold: 7800, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600', isPrimary: true }], tags: ['tshirt', 'shirt', 'tops', 'puma', 'clothing', 'casual'] },
        { name: 'Ray-Ban Aviator Sunglasses', description: 'Iconic aviator with gold frame and G-15 lenses.', price: 8990, originalPrice: 11990, discount: 25, category: 'Fashion', brand: 'Ray-Ban', stock: 45, rating: 4.7, numReviews: 1890, sold: 3200, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', isPrimary: true }], tags: ['sunglasses', 'rayban', 'eyewear', 'aviator', 'accessories'] },
        { name: 'Wildcraft 40L Trekking Backpack', description: 'Durable backpack with rain cover.', price: 2499, originalPrice: 3999, discount: 38, category: 'Fashion', brand: 'Wildcraft', stock: 75, rating: 4.4, numReviews: 3200, sold: 5400, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', isPrimary: true }], tags: ['backpack', 'bag', 'wildcraft', 'travel', 'trekking'] },
        { name: 'IKEA KALLAX Shelf Unit', description: 'Clean design shelf unit, works as room divider.', price: 8990, originalPrice: 9990, discount: 10, category: 'Home & Living', brand: 'IKEA', stock: 45, rating: 4.5, numReviews: 432, sold: 890, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', isPrimary: true }], tags: ['shelf', 'furniture', 'ikea', 'storage', 'home-decor'] },
        { name: 'Dyson V15 Cordless Vacuum', description: 'Laser dust detection, adaptive suction.', price: 52900, originalPrice: 62900, discount: 16, category: 'Home & Living', brand: 'Dyson', stock: 30, rating: 4.7, numReviews: 328, sold: 780, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', isPrimary: true }], tags: ['vacuum', 'dyson', 'cleaner', 'cordless', 'home-appliance'] },
        { name: 'Philips Air Fryer HD9200', description: 'Fry with 90% less fat. 4.1L capacity.', price: 7995, originalPrice: 10995, discount: 27, category: 'Home & Living', brand: 'Philips', stock: 65, rating: 4.5, numReviews: 5600, sold: 12000, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1648147866735-6d4a9dec4950?w=600', isPrimary: true }], tags: ['airfryer', 'air-fryer', 'philips', 'kitchen', 'cooking'] },
        { name: 'Prestige Induction Cooktop', description: '8 preset menus, touch panel, auto switch-off.', price: 2499, originalPrice: 3999, discount: 38, category: 'Home & Living', brand: 'Prestige', stock: 100, rating: 4.3, numReviews: 8900, sold: 25000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', isPrimary: true }], tags: ['induction', 'cooktop', 'prestige', 'kitchen', 'cooking'] },
        { name: 'Godrej 564L French Door Fridge', description: 'Inverter technology, frost-free cooling.', price: 68990, originalPrice: 85990, discount: 20, category: 'Home & Living', brand: 'Godrej', stock: 12, rating: 4.4, numReviews: 560, sold: 230, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600', isPrimary: true }], tags: ['fridge', 'refrigerator', 'godrej', 'kitchen', 'home-appliance'] },
        { name: 'Bajaj Room Heater 1000W', description: 'Radiant heater with overheat protection.', price: 1299, originalPrice: 2199, discount: 41, category: 'Home & Living', brand: 'Bajaj', stock: 150, rating: 4.1, numReviews: 3400, sold: 9800, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600', isPrimary: true }], tags: ['heater', 'room-heater', 'bajaj', 'winter', 'home-appliance'] },
        { name: 'Atomic Habits by James Clear', description: 'Build good habits and break bad ones.', price: 499, originalPrice: 799, discount: 38, category: 'Books', brand: 'Penguin Random House', stock: 500, rating: 4.9, numReviews: 12400, sold: 45000, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', isPrimary: true }], tags: ['atomic-habits', 'self-help', 'habits', 'productivity', 'book'] },
        { name: 'Rich Dad Poor Dad', description: 'What the rich teach their kids about money.', price: 399, originalPrice: 599, discount: 33, category: 'Books', brand: 'Manjul Publishing', stock: 400, rating: 4.7, numReviews: 18900, sold: 67000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600', isPrimary: true }], tags: ['rich-dad', 'finance', 'money', 'investing', 'book'] },
        { name: 'The Psychology of Money', description: 'Timeless lessons on wealth and happiness.', price: 449, originalPrice: 699, discount: 36, category: 'Books', brand: 'Jaico Publishing', stock: 350, rating: 4.8, numReviews: 9800, sold: 34000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600', isPrimary: true }], tags: ['psychology-of-money', 'finance', 'money', 'investing', 'book'] },
        { name: 'The Alchemist by Paulo Coelho', description: 'A mystical story about following your dreams.', price: 299, originalPrice: 499, discount: 40, category: 'Books', brand: 'HarperCollins', stock: 600, rating: 4.6, numReviews: 22000, sold: 89000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600', isPrimary: true }], tags: ['alchemist', 'fiction', 'novel', 'coelho', 'book'] },
        { name: 'Zero to One by Peter Thiel', description: 'How to build the future. For entrepreneurs.', price: 549, originalPrice: 799, discount: 31, category: 'Books', brand: 'Virgin Books', stock: 280, rating: 4.5, numReviews: 6700, sold: 21000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600', isPrimary: true }], tags: ['zero-to-one', 'startup', 'business', 'entrepreneurship', 'book'] },
        { name: 'Yonex Astrox 88S Badminton Racket', description: 'Professional racket used by top players.', price: 8999, originalPrice: 11999, discount: 25, category: 'Sports', brand: 'Yonex', stock: 40, rating: 4.7, numReviews: 1200, sold: 2300, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600', isPrimary: true }], tags: ['badminton', 'racket', 'yonex', 'shuttlecock', 'indoor-game'] },
        { name: 'SG Cricket Bat English Willow', description: 'Grade 1 English Willow for competitive cricket.', price: 4999, originalPrice: 7999, discount: 38, category: 'Sports', brand: 'SG', stock: 30, rating: 4.5, numReviews: 890, sold: 1200, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600', isPrimary: true }], tags: ['cricket', 'bat', 'cricket-bat', 'sg', 'willow'] },
        { name: 'Nivia Football Size 5', description: 'Official size football for professional matches.', price: 899, originalPrice: 1499, discount: 40, category: 'Sports', brand: 'Nivia', stock: 150, rating: 4.3, numReviews: 2300, sold: 6700, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600', isPrimary: true }], tags: ['football', 'soccer', 'ball', 'nivia', 'outdoor-game'] },
        { name: 'Cosco Dumbbell Set 20kg', description: 'Vinyl coated dumbbells for home gym.', price: 1999, originalPrice: 3499, discount: 43, category: 'Sports', brand: 'Cosco', stock: 80, rating: 4.2, numReviews: 4500, sold: 11000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', isPrimary: true }], tags: ['dumbbell', 'gym', 'weights', 'fitness', 'exercise'] },
        { name: 'Adidas Pro Boxing Gloves', description: 'Professional boxing gloves with palm padding.', price: 2499, originalPrice: 3999, discount: 38, category: 'Sports', brand: 'Adidas', stock: 55, rating: 4.4, numReviews: 780, sold: 1900, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600', isPrimary: true }], tags: ['boxing', 'gloves', 'adidas', 'gym', 'fitness'] },
        { name: 'Maybelline Fit Me Foundation', description: 'Matte + Poreless Foundation. SPF 18.', price: 499, originalPrice: 699, discount: 29, category: 'Beauty', brand: 'Maybelline', stock: 300, rating: 4.3, numReviews: 5600, sold: 18000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600', isPrimary: true }], tags: ['foundation', 'makeup', 'maybelline', 'cosmetics', 'face'] },
        { name: 'Lakme 9to5 Matte Lipstick', description: 'All-day matte finish with built-in primer.', price: 349, originalPrice: 525, discount: 33, category: 'Beauty', brand: 'Lakme', stock: 400, rating: 4.2, numReviews: 8900, sold: 29000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1586495777744-4e6232bf8987?w=600', isPrimary: true }], tags: ['lipstick', 'makeup', 'lakme', 'cosmetics', 'lips'] },
        { name: 'Biotique Honey Gel Face Wash', description: 'Deep cleansing with honey extracts.', price: 199, originalPrice: 320, discount: 38, category: 'Beauty', brand: 'Biotique', stock: 500, rating: 4.1, numReviews: 12000, sold: 45000, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', isPrimary: true }], tags: ['facewash', 'face-wash', 'biotique', 'skincare', 'cleanser'] },
        { name: 'Wow Vitamin C Serum', description: '20% Vitamin C for brightening skin.', price: 599, originalPrice: 999, discount: 40, category: 'Beauty', brand: 'Wow', stock: 200, rating: 4.4, numReviews: 15600, sold: 52000, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', isPrimary: true }], tags: ['serum', 'vitamin-c', 'skincare', 'wow', 'anti-aging'] },
        { name: 'LEGO Technic Bugatti Chiron', description: '3599 pieces, W16 engine with moving pistons.', price: 34999, originalPrice: 39999, discount: 13, category: 'Toys', brand: 'LEGO', stock: 20, rating: 4.8, numReviews: 234, sold: 560, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600', isPrimary: true }], tags: ['lego', 'technic', 'building-blocks', 'collectible', 'kids-toy'] },
        { name: 'Hot Wheels Track Set', description: 'Exciting track with 2 cars, loops and twists.', price: 1499, originalPrice: 2499, discount: 40, category: 'Toys', brand: 'Hot Wheels', stock: 80, rating: 4.3, numReviews: 3400, sold: 9800, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600', isPrimary: true }], tags: ['hotwheels', 'cars', 'racing', 'kids-toy', 'track'] },
        { name: 'Monopoly Classic Board Game', description: 'Classic property trading game for the whole family.', price: 899, originalPrice: 1499, discount: 40, category: 'Toys', brand: 'Hasbro', stock: 120, rating: 4.5, numReviews: 6700, sold: 18900, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=600', isPrimary: true }], tags: ['monopoly', 'board-game', 'hasbro', 'family-game', 'kids-toy'] },
      ];

      for (const p of sampleProducts) {
        await Product.create(p);
      }

      console.log('✅ Auto seed complete! 41 products added.');
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
  res.json({
    success: true,
    message: 'ShopWave API is running 🚀',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ─── 404 Handler ──────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err.stack);
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
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ShopWave server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;