import React from 'react'
import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

const footerLinks = {
  Shop: [
    { to: '/products', label: 'All Products' },
    { to: '/products?category=Electronics', label: 'Electronics' },
    { to: '/products?category=Fashion', label: 'Fashion' },
    { to: '/products?featured=true', label: 'Deals & Offers' },
    { to: '/products?sort=newest', label: 'New Arrivals' },
  ],
  Account: [
    { to: '/profile', label: 'My Profile' },
    { to: '/orders', label: 'Order History' },
    { to: '/profile#wishlist', label: 'Wishlist' },
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
  ],
  Support: [
    { to: '#', label: 'Help Center' },
    { to: '#', label: 'Return Policy' },
    { to: '#', label: 'Shipping Info' },
    { to: '#', label: 'Track Order' },
    { to: '#', label: 'Contact Us' },
  ],
}

const socials = [
  { icon: FiInstagram, href: '#', label: 'Instagram' },
  { icon: FiTwitter,   href: '#', label: 'Twitter' },
  { icon: FiFacebook,  href: '#', label: 'Facebook' },
  { icon: FiYoutube,   href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-400 mt-16">
      {/* Newsletter strip */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500">
        <div className="page-container py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-bold text-xl">Get exclusive deals in your inbox</h3>
              <p className="text-primary-100 text-sm mt-0.5">Join 50,000+ shoppers. Unsubscribe anytime.</p>
            </div>
            <form className="flex gap-2 w-full sm:w-auto" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-primary-100 focus:outline-none focus:bg-white/30 text-sm"
              />
              <button type="submit" className="px-5 py-2.5 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors text-sm shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="page-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SW</span>
              </div>
              <span className="font-bold text-xl text-white">Shop<span className="text-primary-400">Wave</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-4 max-w-xs">
              India's AI-powered shopping destination. Discover products tailored just for you with smart recommendations.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><FiMail size={14} className="text-primary-400" /><span>support@shopwave.in</span></div>
              <div className="flex items-center gap-2"><FiPhone size={14} className="text-primary-400" /><span>1800-123-4567 (Toll Free)</span></div>
              <div className="flex items-center gap-2"><FiMapPin size={14} className="text-primary-400" /><span>Bangalore, Karnataka, India</span></div>
            </div>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-primary-500 flex items-center justify-center transition-all hover:scale-110">
                  <Icon size={15} className="text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ to, label }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm hover:text-primary-400 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment badges */}
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            {['Visa', 'Mastercard', 'UPI', 'Razorpay', 'COD'].map(method => (
              <span key={method} className="px-3 py-1 bg-gray-800 rounded-md text-xs text-gray-400 border border-gray-700">{method}</span>
            ))}
          </div>
          <p className="text-xs text-center">
            © {new Date().getFullYear()} ShopWave Technologies Pvt. Ltd. · 
            <a href="#" className="hover:text-primary-400 ml-1">Privacy</a> · 
            <a href="#" className="hover:text-primary-400 ml-1">Terms</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
