import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from '../cart/CartDrawer'

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <Navbar />
      <main className="flex-1 page-enter">
        <Outlet />
      </main>
      {/* Don't show footer on admin pages */}
      {!pathname.startsWith('/admin') && <Footer />}
      {/* Cart drawer overlay */}
      <CartDrawer />
    </div>
  )
}
