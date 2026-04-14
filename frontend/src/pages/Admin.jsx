import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiPackage, FiShoppingBag, FiUsers, FiTrendingUp, FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../store/slices/productSlice'
import { fetchAllOrders, updateOrderStatus } from '../store/slices/orderSlice'
import { formatPrice, formatDate, ORDER_STATUS, CATEGORIES } from '../utils/helpers'
import toast from 'react-hot-toast'

// ── Dashboard ─────────────────────────────────────────────────
function Dashboard() {
  const { products } = useSelector(s => s.product)
  const { allOrders } = useSelector(s => s.order)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }))
    dispatch(fetchAllOrders())
  }, [dispatch])

  const stats = [
    { label: 'Total Products', value: products.length, icon: FiPackage, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Orders',   value: allOrders.length, icon: FiShoppingBag, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Revenue',        value: formatPrice(allOrders.reduce((s, o) => s + o.totalPrice, 0)), icon: FiTrendingUp, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Pending Orders', value: allOrders.filter(o => o.orderStatus === 'pending').length, icon: FiUsers, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-dark-border">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-card">
              <tr>{['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {allOrders.slice(0, 8).map(order => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-dark-card transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{order.trackingNumber || order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">{order.user?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 font-semibold text-primary-500">{formatPrice(order.totalPrice)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${ORDER_STATUS[order.orderStatus]?.color}`}>
                      {ORDER_STATUS[order.orderStatus]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Product Management ────────────────────────────────────────
const EMPTY_PRODUCT = { name: '', description: '', price: '', originalPrice: '', discount: 0, category: 'Electronics', brand: '', stock: 0, images: [{ url: '', isPrimary: true }], isFeatured: false, tags: '' }

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || EMPTY_PRODUCT)
  const handleSave = () => { onSave(form); onClose() }
  const isEdit = !!product?._id

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-dark-surface rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-border">
          <h3 className="font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Product' : 'Add Product'}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card flex items-center justify-center"><FiX size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Product Name', full: true },
              { key: 'brand', label: 'Brand' },
              { key: 'price', label: 'Price (₹)', type: 'number' },
              { key: 'originalPrice', label: 'Original Price (₹)', type: 'number' },
              { key: 'stock', label: 'Stock', type: 'number' },
              { key: 'discount', label: 'Discount (%)', type: 'number' },
            ].map(({ key, label, type = 'text', full }) => (
              <div key={key} className={full ? 'sm:col-span-2' : ''}>
                <label className="label">{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="input" />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="input resize-none" />
            </div>
            <div>
              <label className="label">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Image URL</label>
              <input value={form.images?.[0]?.url || ''} onChange={e => setForm({ ...form, images: [{ url: e.target.value, isPrimary: true }] })} placeholder="https://…" className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Tags (comma separated)</label>
              <input value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="electronics, apple, ios" className="input" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="accent-primary-500 w-4 h-4" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Featured product</span>
          </label>
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-100 dark:border-dark-border">
          <button onClick={onClose} className="flex-1 btn-secondary py-2.5">Cancel</button>
          <button onClick={handleSave} className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2">
            <FiSave size={15} /> {isEdit ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function ProductsAdmin() {
  const dispatch = useDispatch()
  const { products, isLoading } = useSelector(s => s.product)
  const [modal, setModal] = useState(null) // null | 'create' | product object

  useEffect(() => { dispatch(fetchProducts({ limit: 100 })) }, [dispatch])

  const handleSave = (form) => {
    const data = { ...form, tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags }
    if (form._id) {
      dispatch(updateProduct({ id: form._id, data })).then(() => toast.success('Product updated!'))
    } else {
      dispatch(createProduct(data)).then(() => toast.success('Product created!'))
    }
  }

  const handleDelete = (id) => {
    if (confirm('Delete this product?')) dispatch(deleteProduct(id)).then(() => toast.success('Product deleted'))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Products ({products.length})</h2>
        <button onClick={() => setModal('create')} className="btn-primary text-sm flex items-center gap-2 px-4 py-2.5">
          <FiPlus size={15} /> Add Product
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-card">
              <tr>{['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-dark-card transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-gray-100" onError={e => e.target.src='https://via.placeholder.com/36'} />
                      <span className="font-medium text-gray-900 dark:text-white max-w-[160px] truncate">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.category}</td>
                  <td className="px-4 py-3 font-semibold text-primary-500">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.stock === 0 ? 'bg-red-100 text-red-700' : p.stock < 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-amber-500">⭐ {p.rating?.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setModal(p)} className="w-7 h-7 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center text-blue-500 transition-colors">
                        <FiEdit2 size={13} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="w-7 h-7 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center text-red-500 transition-colors">
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <ProductModal product={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />
      )}
    </div>
  )
}

// ── Orders Admin ──────────────────────────────────────────────
function OrdersAdmin() {
  const dispatch = useDispatch()
  const { allOrders } = useSelector(s => s.order)
  useEffect(() => { dispatch(fetchAllOrders()) }, [dispatch])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Orders ({allOrders.length})</h2>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-card">
              <tr>{['Order', 'Customer', 'Items', 'Total', 'Status', 'Update'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {allOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-dark-card">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs text-gray-600">{order.trackingNumber || order._id.slice(-8)}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">{order.user?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-gray-500">{order.orderItems?.length}</td>
                  <td className="px-4 py-3 font-semibold text-primary-500">{formatPrice(order.totalPrice)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${ORDER_STATUS[order.orderStatus]?.color}`}>{ORDER_STATUS[order.orderStatus]?.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <select value={order.orderStatus}
                      onChange={e => dispatch(updateOrderStatus({ id: order._id, status: e.target.value })).then(() => toast.success('Status updated'))}
                      className="text-xs border border-gray-200 dark:border-dark-border rounded-lg px-2 py-1 bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300">
                      {Object.keys(ORDER_STATUS).map(s => <option key={s} value={s}>{ORDER_STATUS[s].label}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Admin Layout ──────────────────────────────────────────────
const NAV = [
  { to: '/admin', label: 'Dashboard', icon: FiTrendingUp, exact: true },
  { to: '/admin/products', label: 'Products', icon: FiPackage },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
]

export default function Admin() {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-white dark:bg-dark-surface border-r border-gray-100 dark:border-dark-border p-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Admin Panel</p>
        <nav className="space-y-1">
          {NAV.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to)
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card'}`}>
                <Icon size={16} />{label}
              </Link>
            )
          })}
        </nav>
      </aside>
      {/* Content */}
      <main className="flex-1 p-6 bg-gray-50 dark:bg-dark-bg overflow-auto">
        <Routes>
          <Route index      element={<Dashboard />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="orders"   element={<OrdersAdmin />} />
        </Routes>
      </main>
    </div>
  )
}
