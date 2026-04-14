import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiTag } from 'react-icons/fi'
import { removeFromCart, updateQuantity, closeCart, applyCoupon, removeCoupon, selectCartTotal } from '../../store/slices/cartSlice'
import { formatPrice } from '../../utils/helpers'
import { useState } from 'react'

export default function CartDrawer() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { items, isOpen, couponCode, couponDiscount } = useSelector(s => s.cart)
  const { token } = useSelector(s => s.auth)
  const totals    = useSelector(selectCartTotal)
  const [couponInput, setCouponInput] = useState('')

  const handleCheckout = () => {
    dispatch(closeCart())
    navigate(token ? '/checkout' : '/login?redirect=checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-dark-surface z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-dark-border">
              <div className="flex items-center gap-2">
                <FiShoppingBag className="text-primary-500" size={20} />
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Your Cart</h2>
                {items.length > 0 && (
                  <span className="badge bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
              <button onClick={() => dispatch(closeCart())}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card flex items-center justify-center transition-colors">
                <FiX size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-dark-card flex items-center justify-center">
                    <FiShoppingBag size={32} className="text-gray-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Your cart is empty</p>
                    <p className="text-sm text-gray-500 mt-1">Add products to get started</p>
                  </div>
                  <button onClick={() => { dispatch(closeCart()); navigate('/products') }}
                    className="btn-primary text-sm px-6 py-2.5">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        className="flex gap-3 p-3 card"
                      >
                        <img
                          src={item.images?.[0]?.url}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover bg-gray-100 dark:bg-dark-card shrink-0"
                          onError={e => e.target.src = 'https://via.placeholder.com/64'}
                        />
                        <div className="flex-1 min-w-0">
                          <Link to={`/products/${item._id}`} onClick={() => dispatch(closeCart())}
                            className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-500 transition-colors line-clamp-2 leading-snug">
                            {item.name}
                          </Link>
                          <p className="text-sm font-bold text-primary-500 mt-1">{formatPrice(item.price)}</p>
                          <div className="flex items-center justify-between mt-2">
                            {/* Qty controls */}
                            <div className="flex items-center gap-1 bg-gray-100 dark:bg-dark-card rounded-lg p-0.5">
                              <button
                                onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-dark-border transition-colors text-gray-600 dark:text-gray-400"
                              >
                                <FiMinus size={12} />
                              </button>
                              <span className="w-7 text-center text-sm font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                              <button
                                onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                                disabled={item.quantity >= item.stock}
                                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-dark-border transition-colors text-gray-600 dark:text-gray-400 disabled:opacity-40"
                              >
                                <FiPlus size={12} />
                              </button>
                            </div>
                            <button
                              onClick={() => dispatch(removeFromCart(item._id))}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-100 dark:border-dark-border space-y-3">
                {/* Coupon */}
                {couponCode ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
                      <FiTag size={14} />
                      <span>{couponCode} — {couponDiscount}% off applied!</span>
                    </div>
                    <button onClick={() => dispatch(removeCoupon())} className="text-green-500 hover:text-green-700">
                      <FiX size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      className="input flex-1 text-sm py-2"
                    />
                    <button
                      onClick={() => { dispatch(applyCoupon(couponInput)); setCouponInput('') }}
                      className="btn-secondary text-sm px-3 py-2 shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span><span className="font-medium text-gray-900 dark:text-white">{formatPrice(totals.subtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Discount ({couponDiscount}%)</span>
                      <span>-{formatPrice(totals.subtotal - totals.discounted)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className={totals.shipping === 0 ? 'text-green-500 font-medium' : 'text-gray-900 dark:text-white font-medium'}>
                      {totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>GST (18%)</span><span className="font-medium text-gray-900 dark:text-white">{formatPrice(totals.tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100 dark:border-dark-border">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-primary-500">{formatPrice(totals.total)}</span>
                  </div>
                </div>

                <button onClick={handleCheckout} className="btn-primary w-full py-3 text-base font-bold">
                  Proceed to Checkout →
                </button>
                <p className="text-[11px] text-center text-gray-400">🔒 Secure checkout powered by Razorpay</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
