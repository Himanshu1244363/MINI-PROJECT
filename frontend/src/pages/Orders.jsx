import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiPackage, FiClock, FiTruck, FiCheckCircle } from 'react-icons/fi'
import { fetchMyOrders } from '../store/slices/orderSlice'
import { formatPrice, formatDate, ORDER_STATUS } from '../utils/helpers'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const STATUS_ICONS = {
  pending: FiClock,
  confirmed: FiCheckCircle,
  processing: FiPackage,
  shipped: FiTruck,
  delivered: FiCheckCircle,
  cancelled: FiClock,
}

export default function Orders() {
  const dispatch  = useDispatch()
  const { orders, isLoading } = useSelector(s => s.order)

  useEffect(() => { dispatch(fetchMyOrders()) }, [dispatch])

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading orders…" /></div>

  return (
    <div className="page-container py-8 max-w-3xl">
      <h1 className="section-title mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="card p-12 flex flex-col items-center gap-4 text-center">
          <FiPackage size={48} className="text-gray-300" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No orders yet</h3>
          <p className="text-gray-500">Your order history will appear here</p>
          <Link to="/products" className="btn-primary px-8 py-2.5">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const status = ORDER_STATUS[order.orderStatus] || ORDER_STATUS.pending
            const StatusIcon = STATUS_ICONS[order.orderStatus] || FiClock
            return (
              <motion.div key={order._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="card p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Order ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{order.trackingNumber || order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`badge ${status.color} flex items-center gap-1`}>
                    <StatusIcon size={11} />
                    {status.label}
                  </span>
                </div>

                {/* Items */}
                <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
                  {order.orderItems?.slice(0, 4).map((item) => (
                    <img key={item._id} src={item.image} alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-gray-100 dark:bg-dark-card shrink-0"
                      onError={e => e.target.src = 'https://via.placeholder.com/56'}
                    />
                  ))}
                  {order.orderItems?.length > 4 && (
                    <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-dark-card flex items-center justify-center text-sm text-gray-500 shrink-0">
                      +{order.orderItems.length - 4}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{order.orderItems?.length} items · {order.paymentMethod?.toUpperCase()}</p>
                    <p className="font-bold text-primary-500">{formatPrice(order.totalPrice)}</p>
                  </div>
                  <div className="flex gap-2">
                    {order.orderStatus === 'delivered' && (
                      <Link to={`/products`} className="btn-secondary text-sm px-3 py-1.5">Buy Again</Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
