import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiStar, FiZap } from 'react-icons/fi'
import { addToCart, openCart } from '../../store/slices/cartSlice'
import { toggleWishlist } from '../../store/slices/authSlice'
import { formatPrice } from '../../utils/helpers'

export default function ProductCard({ product, index = 0 }) {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { user }  = useSelector(s => s.auth)
  const [imgError, setImgError] = useState(false)
  const [adding, setAdding]     = useState(false)

  if (!product) return null

  const { _id, name, price, originalPrice, discount, images, rating, numReviews, stock, category } = product
  const image       = images?.[0]?.url
  const isWishlisted = user?.wishlist?.includes(_id)
  const isOutOfStock = stock === 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return
    setAdding(true)
    dispatch(addToCart(product))
    dispatch(openCart())
    setTimeout(() => setAdding(false), 600)
  }

  const handleBuyNow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return
    dispatch(addToCart(product))
    navigate('/checkout')
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    dispatch(toggleWishlist(_id))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link to={`/products/${_id}`} className="group block">
        <div className="card overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-square bg-gray-50 dark:bg-dark-surface overflow-hidden">
            {imgError || !image ? (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <span className="text-4xl">📦</span>
              </div>
            ) : (
              <img src={image} alt={name} loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}

            {/* Badges */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
              {discount > 0 && (
                <span className="badge bg-green-500 text-white text-[10px] px-2 py-0.5">{discount}% OFF</span>
              )}
              {isOutOfStock && (
                <span className="badge bg-gray-800 text-white text-[10px] px-2 py-0.5">Out of Stock</span>
              )}
              {product.isFeatured && (
                <span className="badge bg-primary-500 text-white text-[10px] px-2 py-0.5">⭐ Featured</span>
              )}
            </div>

            {/* Wishlist */}
            <button onClick={handleWishlist}
              className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                ${isWishlisted
                  ? 'bg-red-500 text-white opacity-100'
                  : 'bg-white/90 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-500'
                }`}>
              <FiHeart size={14} className={isWishlisted ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Content */}
          <div className="p-3.5">
            <p className="text-[11px] font-medium text-primary-500 uppercase tracking-wider mb-1">{category}</p>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
              {name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex items-center">
                {[1,2,3,4,5].map(i => (
                  <FiStar key={i} size={11}
                    className={i <= Math.round(rating) ? 'text-amber-400 fill-current' : 'text-gray-300 dark:text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({numReviews?.toLocaleString() || 0})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="font-bold text-gray-900 dark:text-white">{formatPrice(price)}</span>
              {originalPrice > price && (
                <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
              )}
            </div>

            {/* ✅ Buttons — Add to Cart + Buy Now */}
            <div className="flex gap-2">
              <button onClick={handleAddToCart} disabled={isOutOfStock || adding}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95
                  ${isOutOfStock
                    ? 'bg-gray-100 dark:bg-dark-border text-gray-400 cursor-not-allowed'
                    : adding
                      ? 'bg-green-500 text-white'
                      : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100'
                  }`}>
                <FiShoppingCart size={12} />
                {adding ? '✓' : 'Cart'}
              </button>

              <button onClick={handleBuyNow} disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95
                  ${isOutOfStock
                    ? 'bg-gray-100 dark:bg-dark-border text-gray-400 cursor-not-allowed'
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}>
                <FiZap size={12} />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}