// ─── Format currency ─────────────────────────────────────────
export const formatPrice = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)

// ─── Truncate text ────────────────────────────────────────────
export const truncate = (str, len = 60) =>
  str?.length > len ? str.slice(0, len) + '…' : str

// ─── Generate star array for rating ──────────────────────────
export const getStars = (rating) =>
  Array.from({ length: 5 }, (_, i) => i < Math.round(rating) ? 'filled' : 'empty')

// ─── Time since ───────────────────────────────────────────────
export const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  const intervals = [
    [31536000, 'year'], [2592000, 'month'], [86400, 'day'],
    [3600, 'hour'], [60, 'minute'],
  ]
  for (const [s, label] of intervals) {
    const n = Math.floor(seconds / s)
    if (n >= 1) return `${n} ${label}${n !== 1 ? 's' : ''} ago`
  }
  return 'just now'
}

// ─── Format date ──────────────────────────────────────────────
export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

// ─── Order status config ──────────────────────────────────────
export const ORDER_STATUS = {
  pending:    { label: 'Pending',    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  confirmed:  { label: 'Confirmed',  color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  shipped:    { label: 'Shipped',    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
  delivered:  { label: 'Delivered',  color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  cancelled:  { label: 'Cancelled',  color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

// ─── Get discount label ───────────────────────────────────────
export const getDiscountLabel = (original, current) => {
  if (!original || original <= current) return null
  const pct = Math.round(((original - current) / original) * 100)
  return `${pct}% off`
}

// ─── Clamp number ─────────────────────────────────────────────
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max)

// ─── Debounce ─────────────────────────────────────────────────
export const debounce = (fn, delay) => {
  let timer
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay) }
}

// ─── Categories list ──────────────────────────────────────────
export const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Books', 'Sports', 'Beauty', 'Toys', 'Food']

// ─── Sort options ─────────────────────────────────────────────
export const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'popular',    label: 'Most Popular' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]
