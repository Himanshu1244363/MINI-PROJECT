# 🌊 ShopWave — AI-Powered E-Commerce Platform

<div align="center">

![ShopWave Banner](https://via.placeholder.com/900x200/f97316/ffffff?text=ShopWave+%E2%80%94+AI-Powered+Shopping)

**A modern, full-stack e-commerce application with AI recommendations, real-time cart, JWT auth, and an admin panel.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb)](https://www.mongodb.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux)](https://redux-toolkit.js.org)

</div>

---

## ✨ Features

### 🛍️ Shopping Experience
- Product listing with **search, filters** (category, price range, rating, sort)
- Detailed product pages with **image gallery**, specs, and **reviews**
- Persistent **shopping cart** (saved to localStorage)
- **Coupon codes** (FIRST10, SAVE20, WELCOME15)
- Wishlist with toggle functionality

### 🤖 AI Features
- **Personalized recommendations** based on browsing history
- **Smart search suggestions** with product preview
- **AI chatbot** (ShopBot) for customer support — rule-based with instant responses
- Trending products feed

### 🔐 Authentication
- JWT-based login/register with bcrypt password hashing
- Role-based access control (user / admin)
- Protected routes, persistent sessions

### 🛒 Checkout & Orders
- 3-step checkout (Address → Payment → Review)
- Multiple payment methods: Razorpay, Stripe, Cash on Delivery
- Order history with status tracking
- Admin order management with status updates

### 👑 Admin Panel
- Dashboard with revenue/order/product stats
- Full product **CRUD** (create, edit, delete)
- Order management with status updates
- User management

### 🎨 UI/UX
- Mobile-first responsive design
- Dark/Light mode toggle (persisted)
- Smooth Framer Motion animations
- Skeleton loading states
- Toast notifications
- Cart drawer with real-time totals

---

## 🗂️ Project Structure

```
shopwave/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── orderController.js
│   │   │   └── aiController.js
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   └── Order.js
│   │   ├── routes/            # Express routes
│   │   ├── middleware/        # JWT auth middleware
│   │   └── utils/             # Seeder, helpers
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/        # Navbar, Footer, Layout
    │   │   ├── product/       # ProductCard, ProductSkeleton
    │   │   ├── cart/          # CartDrawer
    │   │   ├── ai/            # ChatWidget
    │   │   └── ui/            # LoadingSpinner
    │   ├── pages/             # All route pages
    │   ├── store/             # Redux slices + store
    │   ├── utils/             # API client, helpers
    │   ├── hooks/             # Custom React hooks
    │   └── App.jsx
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local) or MongoDB Atlas URI
- npm or yarn

### 1. Clone & Install

```bash
# Clone the repo
git clone https://github.com/yourusername/shopwave.git
cd shopwave

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
# Backend
cd backend
cp .env.example .env
```

Edit `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/shopwave
JWT_SECRET=your_super_secret_key_here_make_it_long
PORT=5000
CLIENT_URL=http://localhost:5173

# Payment (optional for dev)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxx
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- 12 sample products across all categories
- Admin account: `admin@shopwave.in` / `admin123456`
- Demo user: `demo@shopwave.in` / `demo123456`

### 4. Run the App

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Open **http://localhost:5173** 🎉

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET  | `/api/auth/me` | Get current user (🔒) |
| PUT  | `/api/auth/profile` | Update profile (🔒) |
| POST | `/api/auth/wishlist/:id` | Toggle wishlist (🔒) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/products` | List products (filters: keyword, category, minPrice, maxPrice, sort, page) |
| GET  | `/api/products/:id` | Get single product |
| GET  | `/api/products/suggestions?q=` | Search suggestions |
| POST | `/api/products` | Create product (👑 Admin) |
| PUT  | `/api/products/:id` | Update product (👑 Admin) |
| DELETE | `/api/products/:id` | Delete product (👑 Admin) |
| POST | `/api/products/:id/reviews` | Add review (🔒) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order (🔒) |
| GET  | `/api/orders/my` | My orders (🔒) |
| GET  | `/api/orders/:id` | Order detail (🔒) |
| GET  | `/api/orders` | All orders (👑 Admin) |
| PUT  | `/api/orders/:id/status` | Update status (👑 Admin) |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/ai/recommendations` | Personalized picks (🔒) |
| POST | `/api/ai/chat` | Chatbot message |
| GET  | `/api/ai/trending` | Trending products |

---

## 🎨 UI Screens

| Screen | Path | Description |
|--------|------|-------------|
| Home | `/` | Hero, AI picks, categories, CTA |
| Products | `/products` | Grid with filters/search |
| Product Detail | `/products/:id` | Gallery, specs, reviews |
| Cart | `/cart` | Full cart with coupon |
| Checkout | `/checkout` | 3-step wizard |
| Order Success | `/order-success/:id` | Confirmation |
| Orders | `/orders` | Order history |
| Profile | `/profile` | Edit profile, wishlist |
| Login | `/login` | Auth form |
| Register | `/register` | Sign up |
| Admin | `/admin/*` | Dashboard, products, orders |

---

## ⚡ Performance

- **Code splitting** via React lazy() + Suspense on every page
- **Skeleton loaders** while data fetches
- **Lazy image loading** with onError fallbacks
- **Debounced search** (300ms) to minimize API calls
- **Cart persisted** in localStorage — no round-trip on page reload
- **Vite** with manual chunks for vendor/redux/ui bundles

---

## 🌐 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build

# Push to GitHub, then import in vercel.com
# Set VITE_API_URL environment variable to your backend URL
```

### Backend → Render

1. Push backend to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Build command: `npm install`
4. Start command: `node src/server.js`
5. Add environment variables from `.env`

### MongoDB → Atlas (Free Tier)

1. Create cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Get connection string → set as `MONGODB_URI`
3. Add IP `0.0.0.0/0` to Network Access

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License. Use freely for personal and commercial projects.

---

<div align="center">
Made with ❤️ and ☕ | ShopWave v1.0.0
</div>
#   S h o p W a v e _ P r o j e c t  
 