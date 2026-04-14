import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiMoon, FiSun,
  FiHeart, FiPackage, FiLogOut, FiSettings, FiChevronDown,
} from 'react-icons/fi'
import { logout } from '../../store/slices/authSlice'
import { toggleCart } from '../../store/slices/cartSlice'
import { toggleDarkMode, closeMobileMenu, toggleMobileMenu } from '../../store/slices/uiSlice'
import { selectCartItemCount } from '../../store/slices/cartSlice'
import { fetchSuggestions, clearSuggestions } from '../../store/slices/productSlice'
import { useDebounce, useClickOutside } from '../../hooks'
import { formatPrice } from '../../utils/helpers'

const NAV_LINKS = [
  { to: '/products', label: 'Products' },
  { to: '/products?category=Electronics', label: 'Electronics' },
  { to: '/products?category=Fashion', label: 'Fashion' },
  { to: '/products?featured=true', label: 'Deals' },
]

export default function Navbar() {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const { pathname } = useLocation()
  const { user, token } = useSelector(s => s.auth)
  const { darkMode, mobileMenuOpen } = useSelector(s => s.ui)
  const { suggestions } = useSelector(s => s.product)
  const cartCount = useSelector(selectCartItemCount)

  const [search, setSearch]         = useState('')
  const [searchFocus, setSearchFocus] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)

  const debouncedSearch = useDebounce(search, 300)
  const searchRef = useClickOutside(() => setSearchFocus(false))
  const userRef   = useClickOutside(() => setUserMenuOpen(false))

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Search suggestions
  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      dispatch(fetchSuggestions(debouncedSearch))
    } else {
      dispatch(clearSuggestions())
    }
  }, [debouncedSearch, dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!search.trim()) return
    navigate(`/products?keyword=${encodeURIComponent(search)}`)
    setSearch('')
    setSearchFocus(false)
    dispatch(clearSuggestions())
    dispatch(closeMobileMenu())
  }

  const handleSuggestionClick = (product) => {
    navigate(`/products/${product._id}`)
    setSearch('')
    setSearchFocus(false)
    dispatch(clearSuggestions())
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-dark-border'
        : 'bg-white dark:bg-dark-surface border-b border-transparent'
    }`}>
      <div className="page-container">
        <div className="flex items-center h-16 gap-4">

          {/* ── Logo ─────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all">
              <span className="text-white font-bold text-sm">SW</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">
              Shop<span className="text-primary-500">Wave</span>
            </span>
          </Link>

          {/* ── Nav Links (desktop) ───────────────── */}
          <nav className="hidden lg:flex items-center gap-1 ml-2">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === to
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-card'
                }`}
              >{label}</Link>
            ))}
          </nav>

          {/* ── Search Bar ────────────────────────── */}
          <div ref={searchRef} className="flex-1 max-w-md relative hidden md:block">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocus(true)}
                  placeholder="Search products, brands…"
                  className="input pl-9 pr-4 py-2 text-sm h-10"
                />
              </div>
            </form>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {searchFocus && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full mt-1 w-full card shadow-card-hover z-50 overflow-hidden"
                >
                  {suggestions.map((p) => (
                    <button key={p._id} onClick={() => handleSuggestionClick(p)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-dark-border text-left transition-colors"
                    >
                      <img src={p.images?.[0]?.url} alt={p.name}
                        className="w-8 h-8 rounded-lg object-cover bg-gray-100"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/32' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.category} · {formatPrice(p.price)}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right Actions ─────────────────────── */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Dark mode toggle */}
            <button onClick={() => dispatch(toggleDarkMode())}
              className="btn-ghost p-2 rounded-xl"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Cart */}
            <button onClick={() => dispatch(toggleCart())}
              className="btn-ghost p-2 rounded-xl relative"
              aria-label="Open cart"
            >
              <FiShoppingCart size={18} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </button>

            {/* User menu */}
            {token ? (
              <div ref={userRef} className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-card transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block max-w-[80px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <FiChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 w-52 card shadow-card-hover z-50 py-1.5 overflow-hidden"
                    >
                      <div className="px-4 py-2.5 border-b border-gray-100 dark:border-dark-border">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      {[
                        { to: '/profile', icon: FiUser, label: 'My Profile' },
                        { to: '/orders',  icon: FiPackage, label: 'My Orders' },
                        { to: '/profile#wishlist', icon: FiHeart, label: 'Wishlist' },
                        ...(user?.role === 'admin' ? [{ to: '/admin', icon: FiSettings, label: 'Admin Panel' }] : []),
                      ].map(({ to, icon: Icon, label }) => (
                        <Link key={to} to={to} onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border hover:text-primary-500 transition-colors"
                        >
                          <Icon size={15} />
                          {label}
                        </Link>
                      ))}
                      <button onClick={() => { dispatch(logout()); setUserMenuOpen(false) }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-gray-100 dark:border-dark-border mt-1"
                      >
                        <FiLogOut size={15} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link to="/login"    className="btn-ghost text-sm px-3 py-2 hidden sm:block">Login</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => dispatch(toggleMobileMenu())}
              className="btn-ghost p-2 lg:hidden"
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Search & Nav ───────────────── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-gray-100 dark:border-dark-border"
            >
              <div className="py-3 space-y-1">
                <form onSubmit={handleSearch} className="px-1 mb-2">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products…"
                      className="input pl-9 py-2 text-sm h-10"
                    />
                  </div>
                </form>
                {NAV_LINKS.map(({ to, label }) => (
                  <Link key={to} to={to}
                    onClick={() => dispatch(closeMobileMenu())}
                    className="block px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg transition-colors"
                  >{label}</Link>
                ))}
                {!token && (
                  <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-dark-border mt-1">
                    <Link to="/login" onClick={() => dispatch(closeMobileMenu())} className="flex-1 btn-secondary text-center text-sm py-2">Login</Link>
                    <Link to="/register" onClick={() => dispatch(closeMobileMenu())} className="flex-1 btn-primary text-center text-sm py-2">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
