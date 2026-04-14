import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiEdit3, FiHeart, FiPackage, FiSave, FiShield } from 'react-icons/fi'
import { updateProfile } from '../store/slices/authSlice'
import { formatPrice } from '../utils/helpers'

export default function Profile() {
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector(s => s.auth)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', avatar: user?.avatar || '' })
  const [tab, setTab] = useState('profile')

  const handleSave = async (e) => {
    e.preventDefault()
    await dispatch(updateProfile(form))
    setEditing(false)
  }

  return (
    <div className="page-container py-8 max-w-4xl">
      <h1 className="section-title mb-6">My Account</h1>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-dark-border mb-6">
        {[['profile', FiUser, 'Profile'], ['wishlist', FiHeart, 'Wishlist'], ['security', FiShield, 'Security']].map(([key, Icon, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${tab === key ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Avatar card */}
          <div className="card p-6 flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-glow">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className={`badge mt-2 ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {user?.role === 'admin' ? '👑 Admin' : '👤 Customer'}
              </span>
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <Link to="/orders" className="card p-3 text-center hover:shadow-card-hover transition-all">
                <FiPackage className="mx-auto mb-1 text-primary-500" />
                <p className="text-xs text-gray-500">Orders</p>
              </Link>
              <button onClick={() => setTab('wishlist')} className="card p-3 text-center hover:shadow-card-hover transition-all">
                <FiHeart className="mx-auto mb-1 text-red-500" />
                <p className="text-xs text-gray-500">Wishlist</p>
              </button>
            </div>
          </div>

          {/* Edit form */}
          <div className="md:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 dark:text-white">Personal Information</h3>
              {!editing && (
                <button onClick={() => setEditing(true)} className="btn-ghost text-sm flex items-center gap-1.5">
                  <FiEdit3 size={14} /> Edit
                </button>
              )}
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  disabled={!editing} className="input disabled:bg-gray-50 dark:disabled:bg-dark-card disabled:cursor-not-allowed" />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input value={user?.email} disabled className="input bg-gray-50 dark:bg-dark-card cursor-not-allowed text-gray-500" />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              {editing && (
                <div className="flex gap-3">
                  <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2 px-6 py-2.5">
                    <FiSave size={15} /> {isLoading ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary px-6 py-2.5">Cancel</button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {tab === 'wishlist' && (
        <div>
          {!user?.wishlist?.length ? (
            <div className="card p-12 text-center flex flex-col items-center gap-4">
              <FiHeart size={40} className="text-gray-300" />
              <h3 className="font-bold text-gray-900 dark:text-white">Your wishlist is empty</h3>
              <Link to="/products" className="btn-primary px-6 py-2.5">Discover Products</Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">{user.wishlist.length} saved items</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {user.wishlist.map((item, i) => (
                  <Link key={i} to={`/products/${item._id || item}`}
                    className="card p-3 hover:shadow-card-hover transition-all text-center">
                    <div className="w-full aspect-square rounded-xl bg-gray-100 dark:bg-dark-card mb-2 flex items-center justify-center">
                      {item.images?.[0]?.url ? (
                        <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span className="text-3xl">❤️</span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2">{item.name || 'Saved Item'}</p>
                    {item.price && <p className="text-xs text-primary-500 font-bold mt-1">{formatPrice(item.price)}</p>}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'security' && (
        <div className="max-w-md card p-6 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Change Password</h3>
          <div><label className="label">Current Password</label><input type="password" className="input" placeholder="••••••••" /></div>
          <div><label className="label">New Password</label><input type="password" className="input" placeholder="••••••••" /></div>
          <div><label className="label">Confirm New Password</label><input type="password" className="input" placeholder="••••••••" /></div>
          <button className="btn-primary px-6 py-2.5">Update Password</button>
        </div>
      )}
    </div>
  )
}
