import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiHome } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="page-container py-20 flex flex-col items-center text-center gap-5 max-w-md mx-auto">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}
        className="text-8xl font-black text-gray-100 dark:text-dark-card select-none">
        404
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h1>
        <p className="text-gray-500">The page you're looking for doesn't exist or has been moved.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-3">
        <button onClick={() => window.history.back()} className="btn-secondary flex items-center gap-2">
          <FiArrowLeft size={15} /> Go Back
        </button>
        <Link to="/" className="btn-primary flex items-center gap-2">
          <FiHome size={15} /> Home
        </Link>
      </motion.div>
    </div>
  )
}
