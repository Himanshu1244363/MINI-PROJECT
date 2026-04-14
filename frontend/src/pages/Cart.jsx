// ═══════════════════════════════════════════════════════
// Cart.jsx
// ═══════════════════════════════════════════════════════
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag } from 'react-icons/fi'
import { removeFromCart, updateQuantity, selectCartTotal } from '../store/slices/cartSlice'
import { formatPrice } from '../utils/helpers'

export function Cart() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { items } = useSelector(s => s.cart)
  const { token } = useSelector(s => s.auth)
  const totals    = useSelector(selectCartTotal)

  if (items.length === 0) {
    return (
      <div className="page-container py-20 flex flex-col items-center gap-5 text-center">
        <div className="w-24 h-24 rounded-3xl bg-gray-100 dark:bg-dark-card flex items-center justify-center">
          <FiShoppingBag size={40} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your cart is empty</h2>
        <p className="text-gray-500">Add some products to get started</p>
        <Link to="/products" className="btn-primary px-8 py-3">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div className="page-container py-8">
      <h1 className="section-title mb-6">Shopping Cart <span className="text-gray-400 font-normal text-xl">({items.length} items)</span></h1>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {items.map(item => (
              <motion.div key={item._id} layout exit={{ opacity: 0, height: 0 }}
                className="card p-4 flex gap-4">
                <img src={item.images?.[0]?.url} alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover bg-gray-100 shrink-0"
                  onError={e => e.target.src = 'https://via.placeholder.com/80'} />
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item._id}`}
                    className="font-semibold text-gray-900 dark:text-white hover:text-primary-500 line-clamp-2 text-sm leading-snug">
                    {item.name}
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-dark-card rounded-lg p-0.5">
                      <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-dark-border transition-colors">
                        <FiMinus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-dark-border transition-colors disabled:opacity-40">
                        <FiPlus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                      <button onClick={() => dispatch(removeFromCart(item._id))} className="text-gray-400 hover:text-red-500 transition-colors">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit sticky top-20 space-y-3">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span><span className="font-medium text-gray-900 dark:text-white">{formatPrice(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Shipping</span>
              <span className={totals.shipping === 0 ? 'text-green-500 font-medium' : 'font-medium text-gray-900 dark:text-white'}>
                {totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>GST (18%)</span><span className="font-medium text-gray-900 dark:text-white">{formatPrice(totals.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-100 dark:border-dark-border">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-primary-500">{formatPrice(totals.total)}</span>
            </div>
          </div>
          <button onClick={() => navigate(token ? '/checkout' : '/login?redirect=checkout')}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 font-bold">
            Proceed to Checkout <FiArrowRight size={16} />
          </button>
          <Link to="/products" className="block text-center text-sm text-gray-500 hover:text-primary-500">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Cart
