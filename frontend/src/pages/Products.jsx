import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi'
import { fetchProducts, setFilters, setPage } from '../store/slices/productSlice'
import ProductCard from '../components/product/ProductCard'
import ProductSkeleton from '../components/product/ProductSkeleton'
import { CATEGORIES, SORT_OPTIONS, formatPrice } from '../utils/helpers'

export default function Products() {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const { products, pagination, filters, isLoading } = useSelector(s => s.product)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [localPrice, setLocalPrice] = useState([0, 150000])

  // ✅ FIX: URL params change hone par filters RESET karke naye set karo
  useEffect(() => {
    const keyword  = searchParams.get('keyword')  || ''
    const category = searchParams.get('category') || ''
    const sort     = searchParams.get('sort')     || 'newest'
    const featured = searchParams.get('featured') || ''

    dispatch(setFilters({
      keyword,
      category,
      sort,
      featured,
      minPrice: '',
      maxPrice: '',
      page: 1,
    }))
  }, [searchParams, dispatch])

  // Fetch on filters change
  useEffect(() => {
    dispatch(fetchProducts({ ...filters, page: filters.page || 1 }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [filters, dispatch])

  const handleFilter = (key, val) => dispatch(setFilters({ [key]: val }))

  const handleClearFilters = () => dispatch(setFilters({
    keyword: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1, featured: ''
  }))

  const applyPriceFilter = () => dispatch(setFilters({ minPrice: localPrice[0], maxPrice: localPrice[1] }))

  const hasActiveFilters = filters.category || filters.keyword || filters.minPrice || filters.maxPrice

  return (
    <div className="page-container py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="section-title">
            {filters.keyword
              ? `"${filters.keyword}"`
              : filters.category
                ? filters.category
                : 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {!isLoading && `${pagination.total?.toLocaleString() || 0} products found`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={filters.sort}
              onChange={e => handleFilter('sort', e.target.value)}
              className="input text-sm pr-8 py-2 appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <FiChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all
              ${filtersOpen || hasActiveFilters
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 border-primary-200 dark:border-primary-800'
                : 'btn-secondary'
              }`}
          >
            <FiFilter size={15} />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-60 space-y-6 pr-2">
                {hasActiveFilters && (
                  <button onClick={handleClearFilters} className="flex items-center gap-1.5 text-sm text-primary-500 font-medium hover:underline">
                    <FiX size={14} /> Clear all filters
                  </button>
                )}

                {/* Category */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Category</h3>
                  <div className="space-y-1.5">
                    <button onClick={() => handleFilter('category', '')}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!filters.category ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card'}`}>
                      All Categories
                    </button>
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => handleFilter('category', cat)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${filters.category === cat ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{formatPrice(localPrice[0])}</span>
                      <span>{formatPrice(localPrice[1])}</span>
                    </div>
                    <input type="range" min={0} max={150000} step={500} value={localPrice[1]}
                      onChange={e => setLocalPrice([localPrice[0], +e.target.value])}
                      className="w-full accent-primary-500" />
                    <button onClick={applyPriceFilter} className="btn-primary w-full text-sm py-2">Apply</button>
                  </div>
                </div>

                {/* Rating filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Min Rating</h3>
                  {[4, 3, 2].map(r => (
                    <button key={r} onClick={() => handleFilter('rating', r)}
                      className={`flex items-center gap-2 w-full text-sm px-3 py-2 rounded-lg transition-colors mb-1 ${filters.rating == r ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card'}`}>
                      {'⭐'.repeat(r)} <span className="text-xs">& above</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <div className={`grid gap-4 ${filtersOpen ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'}`}>
            {isLoading ? (
              <ProductSkeleton count={12} />
            ) : products.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center gap-4 text-center">
                <span className="text-5xl">🔍</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No products found</h3>
                <p className="text-gray-500 max-w-sm">Try adjusting your filters or search terms</p>
                <button onClick={handleClearFilters} className="btn-primary px-6 py-2.5">Clear Filters</button>
              </div>
            ) : (
              products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => dispatch(setPage(page))}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${filters.page === page ? 'bg-primary-500 text-white shadow-glow' : 'btn-secondary hover:border-primary-300'}`}>
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}