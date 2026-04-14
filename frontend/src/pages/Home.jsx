import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiArrowRight, FiZap, FiShield, FiTruck, FiRefreshCw, FiStar } from 'react-icons/fi'
import { fetchProducts, fetchRecommendations } from '../store/slices/productSlice'
import ProductCard from '../components/product/ProductCard'
import ProductSkeleton from '../components/product/ProductSkeleton'

const CATEGORIES = [
  { name: 'Electronics', emoji: '📱', color: 'from-blue-500 to-blue-600', to: '/products?category=Electronics' },
  { name: 'Fashion',     emoji: '👗', color: 'from-pink-500 to-rose-500', to: '/products?category=Fashion' },
  { name: 'Home & Living', emoji: '🛋️', color: 'from-amber-500 to-orange-500', to: '/products?category=Home+%26+Living' },
  { name: 'Books',       emoji: '📚', color: 'from-green-500 to-emerald-600', to: '/products?category=Books' },
  { name: 'Sports',      emoji: '⚽', color: 'from-indigo-500 to-purple-600', to: '/products?category=Sports' },
  { name: 'Beauty',      emoji: '💄', color: 'from-rose-400 to-pink-600', to: '/products?category=Beauty' },
]

const FEATURES = [
  { icon: FiTruck,      title: 'Free Delivery',   desc: 'On orders above ₹499', color: 'text-blue-500' },
  { icon: FiRefreshCw,  title: '7-Day Returns',   desc: 'Hassle-free returns',  color: 'text-green-500' },
  { icon: FiShield,     title: 'Secure Payments', desc: '100% safe checkout',  color: 'text-purple-500' },
  { icon: FiZap,        title: 'AI Recommendations', desc: 'Personalized picks', color: 'text-primary-500' },
]

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { products, recommendations, recommendBasis, isLoading } = useSelector(s => s.product)
  const { token } = useSelector(s => s.auth)

  useEffect(() => {
    dispatch(fetchProducts({ sort: 'popular', limit: 8 }))
    if (token) dispatch(fetchRecommendations())
    else dispatch(fetchProducts({ sort: 'rating', limit: 8, featured: true }))
  }, [dispatch, token])

  const featured = products.slice(0, 8)

  return (
    <div>
      {/* ── Hero Section ──────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 min-h-[520px] flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        {/* Orange glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/20 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="page-container relative z-10 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-300 mb-6">
              <FiZap size={14} className="text-primary-400" />
              AI-Powered Shopping Experience
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5">
              Discover products <span className="gradient-text">made for you</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md leading-relaxed">
              Shop smarter with AI-powered recommendations tailored to your taste. Millions of products, one perfect match.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/products')} className="btn-primary px-7 py-3 text-base flex items-center gap-2 group">
                Shop Now
                <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              {!token && (
                <Link to="/register" className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20 px-7 py-3 text-base">
                  Join Free
                </Link>
              )}
            </div>
            {/* Trust stats */}
            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-white/10">
              {[['2M+', 'Products'], ['500K+', 'Customers'], ['4.8★', 'Rating']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{val}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero product cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:grid grid-cols-2 gap-3"
          >
            {featured.slice(0, 4).map((product, i) => (
              <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`card p-3 hover:shadow-card-hover transition-all cursor-pointer ${i % 2 === 1 ? 'mt-6' : ''}`}
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <img src={product.images?.[0]?.url} alt={product.name}
                  className="w-full h-32 object-cover rounded-xl bg-gray-100 mb-2"
                  onError={e => e.target.src = 'https://via.placeholder.com/200x128?text=Product'}
                />
                <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">{product.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-primary-500 font-bold">₹{product.price?.toLocaleString()}</p>
                  <div className="flex items-center gap-0.5">
                    <FiStar size={10} className="text-amber-400 fill-current" />
                    <span className="text-[10px] text-gray-500">{product.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Feature Highlights ─────────────────── */}
      <section className="page-container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="card p-4 flex items-start gap-3 hover:shadow-card-hover transition-all">
              <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-dark-border flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Category Grid ──────────────────────── */}
      <section className="page-container pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" className="text-sm text-primary-500 font-medium hover:underline flex items-center gap-1">
            All categories <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map(({ name, emoji, color, to }, i) => (
            <motion.div key={name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}>
              <Link to={to} className="group flex flex-col items-center gap-2 p-4 card hover:shadow-card-hover hover:-translate-y-1 transition-all">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                  {emoji}
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">{name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── AI Recommendations / Featured ─────── */}
      <section className="bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/10 py-12">
        <div className="page-container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FiZap size={16} className="text-primary-500" />
                <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">AI Picks</span>
              </div>
              <h2 className="section-title">{token ? recommendBasis || 'Recommended for You' : 'Trending Now'}</h2>
            </div>
            <Link to="/products" className="btn-secondary text-sm hidden sm:flex items-center gap-1">
              See All <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {isLoading
              ? <ProductSkeleton count={8} />
              : (recommendations.length > 0 ? recommendations : featured).slice(0, 8).map((p, i) => (
                  <ProductCard key={p._id} product={p} index={i} />
                ))
            }
          </div>
        </div>
      </section>

      {/* ── Popular Products ───────────────────── */}
      <section className="page-container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">🔥 Most Popular</h2>
          <Link to="/products?sort=popular" className="text-sm text-primary-500 font-medium hover:underline flex items-center gap-1">
            View all <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {isLoading
            ? <ProductSkeleton count={4} />
            : featured.slice(0, 4).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
          }
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────── */}
      <section className="page-container pb-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 md:p-12">
          <div className="absolute right-0 top-0 w-72 h-72 bg-primary-500/20 rounded-full filter blur-3xl" />
          <div className="relative z-10 max-w-lg">
            <p className="text-primary-400 font-semibold text-sm mb-2">Limited Time Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Up to 70% off on top brands</h2>
            <p className="text-gray-400 mb-6">Use code <span className="text-primary-400 font-mono font-bold">SAVE20</span> for extra 20% off on orders above ₹1000</p>
            <Link to="/products?featured=true" className="btn-primary inline-flex items-center gap-2 px-7 py-3 text-base">
              Shop the Sale <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
