import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// Load cart from localStorage
const loadCart = () => {
  try {
    const stored = localStorage.getItem('shopwave_cart')
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

const saveCart = (items) => {
  localStorage.setItem('shopwave_cart', JSON.stringify(items))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items:        loadCart(),
    isOpen:       false,
    couponCode:   '',
    couponDiscount: 0,
  },
  reducers: {
    addToCart(state, { payload }) {
      const existing = state.items.find(i => i._id === payload._id)
      if (existing) {
        if (existing.quantity < payload.stock) {
          existing.quantity += (payload.quantity || 1)
          toast.success('Quantity updated!')
        } else {
          toast.error('Max stock reached')
        }
      } else {
        state.items.push({ ...payload, quantity: payload.quantity || 1 })
        toast.success('Added to cart! 🛒')
      }
      saveCart(state.items)
    },
    removeFromCart(state, { payload }) {
      state.items = state.items.filter(i => i._id !== payload)
      saveCart(state.items)
      toast.success('Removed from cart')
    },
    updateQuantity(state, { payload: { id, quantity } }) {
      const item = state.items.find(i => i._id === id)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i._id !== id)
        } else if (quantity <= item.stock) {
          item.quantity = quantity
        }
      }
      saveCart(state.items)
    },
    clearCart(state) {
      state.items = []
      state.couponCode = ''
      state.couponDiscount = 0
      saveCart([])
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen
    },
    openCart(state)  { state.isOpen = true  },
    closeCart(state) { state.isOpen = false },
    applyCoupon(state, { payload }) {
      const coupons = { FIRST10: 10, SAVE20: 20, WELCOME15: 15 }
      const discount = coupons[payload.toUpperCase()]
      if (discount) {
        state.couponCode = payload.toUpperCase()
        state.couponDiscount = discount
        toast.success(`Coupon applied! ${discount}% off 🎉`)
      } else {
        toast.error('Invalid coupon code')
      }
    },
    removeCoupon(state) {
      state.couponCode = ''
      state.couponDiscount = 0
    },
  },
})

// Selectors
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0)

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

export const selectCartTotal = (state) => {
  const subtotal = selectCartSubtotal(state)
  const discount = state.cart.couponDiscount
  const discounted = subtotal - (subtotal * discount / 100)
  const shipping = discounted > 499 ? 0 : 49
  const tax = Math.round(discounted * 0.18 * 100) / 100
  return { subtotal, discounted, shipping, tax, total: discounted + shipping + tax }
}

export const { addToCart, removeFromCart, updateQuantity, clearCart,
               toggleCart, openCart, closeCart, applyCoupon, removeCoupon } = cartSlice.actions
export default cartSlice.reducer
