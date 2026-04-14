// OrderSuccess.jsx
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi'

export function OrderSuccess() {
  const { id } = useParams()
  return (
    <div className="page-container py-20 flex flex-col items-center text-center gap-6 max-w-lg mx-auto">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
        <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
          <FiCheckCircle size={48} className="text-green-500" />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-500 mb-1">Your order has been placed successfully.</p>
        <p className="text-xs text-gray-400 font-mono bg-gray-100 dark:bg-dark-card px-3 py-1 rounded-lg inline-block mt-1">
          Order ID: {id}
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-3 w-full">
        <Link to="/orders" className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2">
          <FiPackage size={16} /> View Orders
        </Link>
        <Link to="/products" className="flex-1 btn-primary py-3 flex items-center justify-center gap-2">
          Continue Shopping <FiArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  )
}
export default OrderSuccess
