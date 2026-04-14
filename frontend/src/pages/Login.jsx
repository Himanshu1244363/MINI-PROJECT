import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import { loginUser, registerUser } from '../store/slices/authSlice'

export function Login() {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const [params]   = useSearchParams()
  const { isLoading, token } = useSelector(s => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)

  useEffect(() => { if (token) navigate('/') }, [token])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(form))
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-white font-bold text-xl">SW</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your ShopWave account</p>
        </div>

        <div className="card p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <FiMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={show ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="btn-primary w-full py-3 text-base font-bold flex items-center justify-center gap-2">
              {isLoading ? 'Signing in…' : 'Sign In'} <FiArrowRight size={16} />
            </button>
          </form>

          {/* Demo accounts */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">🧪 Demo Accounts</p>
            <div className="space-y-1">
              {[['demo@shopwave.in', 'demo123456', 'Customer'], ['admin@shopwave.in', 'admin123456', 'Admin']].map(([email, pwd, role]) => (
                <button key={email} onClick={() => setForm({ email, password: pwd })}
                  className="block w-full text-left text-xs text-blue-700 dark:text-blue-300 hover:underline">
                  {role}: {email} / {pwd}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-500 font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, token } = useSelector(s => s.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { if (token) navigate('/') }, [token])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setError('')
    dispatch(registerUser({ name: form.name, email: form.email, password: form.password }))
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-white font-bold text-xl">SW</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
          <p className="text-gray-500 mt-1">Join ShopWave and start shopping smarter</p>
        </div>

        <div className="card p-8 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-xl text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <FiUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe" className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <FiMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={show ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" required value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Confirm your password" className="input pl-10" />
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="btn-primary w-full py-3 text-base font-bold flex items-center justify-center gap-2">
              {isLoading ? 'Creating account…' : 'Create Account'} <FiArrowRight size={16} />
            </button>
          </form>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login