import { useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProfile } from '../store/slices/authSlice'

// ─── Initialize dark mode on mount ───────────────────────────
export const useDarkMode = () => {
  const { darkMode } = useSelector(s => s.ui)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])
  return darkMode
}

// ─── Fetch user on app load ───────────────────────────────────
export const useAuthInit = () => {
  const dispatch  = useDispatch()
  const { token, initialized } = useSelector(s => s.auth)
  useEffect(() => {
    if (token && !initialized) {
      dispatch(fetchProfile())
    }
  }, [token, initialized, dispatch])
}

// ─── Intersection Observer for lazy loading ───────────────────
export const useIntersectionObserver = (callback, options = {}) => {
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callback()
    }, { threshold: 0.1, ...options })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [callback])
  return ref
}

// ─── Click outside handler ────────────────────────────────────
export const useClickOutside = (handler) => {
  const ref = useRef(null)
  useEffect(() => {
    const listener = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [handler])
  return ref
}

// ─── Local pagination ─────────────────────────────────────────
export const useLocalPagination = (items, perPage = 12) => {
  const [page, setPage] = React.useState(1)
  const total = Math.ceil(items.length / perPage)
  const current = items.slice((page - 1) * perPage, page * perPage)
  return { current, page, total, setPage }
}

// ─── Debounced value ──────────────────────────────────────────
import { useState } from 'react'
export const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}
