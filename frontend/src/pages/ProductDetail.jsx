import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiStar, FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiMinus, FiPlus, FiArrowLeft, FiChevronRight } from 'react-icons/fi'
import { fetchProduct, clearSelectedProduct, fetchProducts } from '../store/slices/productSlice'
import { addToCart, openCart } from '../store/slices/cartSlice'
import { toggleWishlist } from '../store/slices/authSlice'
import { formatPrice, formatDate } from '../utils/helpers'
import ProductCard from '../components/product/ProductCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id }    = useParams()
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { selectedProduct: product, detailLoading, products } = useSelector(s => s.product)
  const { user }  = useSelector(s => s.auth)

  const [qty, setQty]         = useState(1)
  const [selImg, setSelImg]   = useState(0)
  const [tab, setTab]         = useState('description')
  const [review, setReview]   = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchProduct(id))
    return () => dispatch(clearSelectedProduct())
  }, [id, dispatch])

  useEffect(() => {
    if (product) {
      dispatch(fetchProducts({ category: product.category, limit: 4 }))
    }
  }, [product, dispatch])

  if (detailLoading) return <div className="flex justify-center py-32"><LoadingSpinner size="lg" text="Loading product…" /></div>
  if (!product) return (
    <div className="page-container py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h2>
      <button onClick={() => navigate('/products')} className="btn-primary">Browse Products</button>
    </div>
  )

  const { name, description, price, originalPrice, discount, images, rating, numReviews, stock, category, brand, reviews, specifications, tags } = product
  const isWishlisted = user?.wishlist?.includes(product._id)

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: qty }))
    dispatch(openCart())
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setSubmitting(true)
    try {
      await api.post(`/products/${id}/reviews`, review)
      toast.success('Review submitted!')
      dispatch(fetchProduct(id))
      setReview({ rating: 5, comment: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const related = products.filter(p => p._id !== product._id).slice(0, 4)

  return (
    <div className="page-container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-500">Home</Link>
        <FiChevronRight size={14} />
        <Link to="/products" className="hover:text-primary-500">Products</Link>
        <FiChevronRight size={14} />
        <Link to={`/products?category=${category}`} className="hover:text-primary-500">{category}</Link>
        <FiChevronRight size={14} />
        <span className="text-gray-900 dark:text-white truncate max-w-[200px]">{name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 mb-16">
        {/* ── Image Gallery ─────────────────────── */}
        <div className="space-y-3">
          <motion.div layoutId={`img-${product._id}`}
            className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-dark-card">
            <img
              src={images?.[selImg]?.url || images?.[0]?.url}
              alt={name}
              className="w-full h-full object-contain p-4"
              onError={e => e.target.src = 'https://via.placeholder.com/600?text=Product'}
            />
          </motion.div>
          {images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${selImg === i ? 'border-primary-500' : 'border-transparent hover:border-gray-300'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ─────────────────────── */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <span className="badge bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-2">{category}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug">{name}</h1>
              <p className="text-sm text-gray-500 mt-1">by <span className="font-medium text-gray-700 dark:text-gray-300">{brand}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => dispatch(toggleWishlist(product._id))}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'btn-secondary'}`}>
                <FiHeart size={16} className={isWishlisted ? 'fill-current' : ''} />
              </button>
              <button className="w-10 h-10 rounded-xl btn-secondary flex items-center justify-center">
                <FiShare2 size={16} />
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg">
              <FiStar size={14} className="text-amber-500 fill-current" />
              <span className="text-sm font-bold text-amber-600">{rating?.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-500">{numReviews?.toLocaleString()} reviews</span>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              {stock > 0 ? `✓ ${stock > 10 ? 'In Stock' : `Only ${stock} left!`}` : '✗ Out of Stock'}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6 p-4 bg-gray-50 dark:bg-dark-card rounded-2xl">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(price)}</span>
            {originalPrice > price && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(originalPrice)}</span>
                <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">{discount}% OFF</span>
              </>
            )}
          </div>

          {/* Qty + Add to cart */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-card rounded-xl p-1">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-dark-border transition-colors text-gray-700 dark:text-gray-300">
                <FiMinus size={14} />
              </button>
              <span className="w-10 text-center font-bold text-gray-900 dark:text-white">{qty}</span>
              <button onClick={() => setQty(q => Math.min(stock, q + 1))} disabled={qty >= stock}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-dark-border transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-40">
                <FiPlus size={14} />
              </button>
            </div>
            <button onClick={handleAddToCart} disabled={!stock}
              className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed">
              <FiShoppingCart size={18} />
              {stock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2"><FiTruck size={15} className="text-blue-500" /> Free delivery on orders above ₹499</div>
            <div className="flex items-center gap-2"><FiShield size={15} className="text-green-500" /> 7-day return policy · Secure payment</div>
          </div>

          {/* Tags */}
          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
              {tags.map(tag => (
                <Link key={tag} to={`/products?keyword=${tag}`}
                  className="badge bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition-colors text-[11px] px-2.5 py-1">
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────── */}
      <div className="mb-10">
        <div className="flex gap-1 border-b border-gray-200 dark:border-dark-border mb-6">
          {[['description', 'Description'], ['specs', 'Specifications'], ['reviews', `Reviews (${numReviews})`]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${tab === key ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'description' && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">{description}</p>
        )}

        {tab === 'specs' && (
          <div className="max-w-xl space-y-1">
            {specifications?.map(({ key, value }) => (
              <div key={key} className="flex gap-4 py-2.5 border-b border-gray-100 dark:border-dark-border last:border-0">
                <span className="w-32 text-sm text-gray-500 shrink-0">{key}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'reviews' && (
          <div className="max-w-2xl space-y-6">
            {/* Review form */}
            {user ? (
              <form onSubmit={handleReview} className="card p-5 space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Write a Review</h3>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button type="button" key={n} onClick={() => setReview(r => ({...r, rating: n}))}
                      className="text-2xl transition-transform hover:scale-110">
                      <span className={n <= review.rating ? 'text-amber-400' : 'text-gray-300'}>★</span>
                    </button>
                  ))}
                  <span className="text-sm text-gray-500 ml-1">{review.rating}/5</span>
                </div>
                <textarea value={review.comment} onChange={e => setReview(r => ({...r, comment: e.target.value}))}
                  placeholder="Share your experience…" rows={3} required
                  className="input resize-none" />
                <button type="submit" disabled={submitting} className="btn-primary text-sm px-6 py-2.5">
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="card p-5 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-3">Login to write a review</p>
                <Link to="/login" className="btn-primary text-sm px-6 py-2.5">Login</Link>
              </div>
            )}

            {/* Reviews list */}
            {reviews?.length === 0
              ? <p className="text-gray-500">No reviews yet. Be the first!</p>
              : reviews?.map((r) => (
                <div key={r._id} className="card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 font-bold text-sm">
                        {r.name?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{r.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(r.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(n => (
                        <span key={n} className={`text-sm ${n <= r.rating ? 'text-amber-400' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{r.comment}</p>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="section-title mb-6">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  )
}
