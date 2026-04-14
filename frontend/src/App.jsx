import React, { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuthInit, useDarkMode } from './hooks'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'
import ChatWidget from './components/ai/ChatWidget'

// Lazy-loaded pages for code splitting
const Home       = lazy(() => import('./pages/Home'))
const Products   = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart       = lazy(() => import('./pages/Cart'))
const Checkout   = lazy(() => import('./pages/Checkout'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const Orders     = lazy(() => import('./pages/Orders'))
const Profile    = lazy(() => import('./pages/Profile'))
const Login      = lazy(() => import('./pages/Login'))
const Register   = lazy(() => import('./pages/Register'))
const Admin      = lazy(() => import('./pages/Admin'))
const NotFound   = lazy(() => import('./pages/NotFound'))

// Protected route wrapper
const PrivateRoute = ({ children }) => {
  const { token } = useSelector(s => s.auth)
  return token ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }) => {
  const { user, token } = useSelector(s => s.auth)
  if (!token) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  useAuthInit()
  useDarkMode()

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index        element={<Home />} />
          <Route path="products"      element={<Products />} />
          <Route path="products/:id"  element={<ProductDetail />} />
          <Route path="cart"          element={<Cart />} />
          <Route path="login"         element={<Login />} />
          <Route path="register"      element={<Register />} />

          {/* Protected routes */}
          <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="order-success/:id" element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
          <Route path="orders"   element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="profile"  element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Admin routes */}
          <Route path="admin/*" element={<AdminRoute><Admin /></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      {/* Floating AI chat widget */}
      <ChatWidget />
    </Suspense>
  )
}
