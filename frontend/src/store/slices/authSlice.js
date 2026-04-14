import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'
import toast from 'react-hot-toast'

// ─── Async Thunks ─────────────────────────────────────────────
export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data)
    localStorage.setItem('token', res.data.token)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data)
    localStorage.setItem('token', res.data.token)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/auth/profile', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const toggleWishlist = createAsyncThunk('auth/toggleWishlist', async (productId, { rejectWithValue }) => {
  try {
    const res = await api.post(`/auth/wishlist/${productId}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

// ─── Slice ─────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:      null,
    token:     localStorage.getItem('token'),
    isLoading: false,
    error:     null,
    initialized: false,
  },
  reducers: {
    logout(state) {
      state.user  = null
      state.token = null
      state.error = null
      localStorage.removeItem('token')
      toast.success('Logged out successfully')
    },
    clearError(state) { state.error = null },
    setInitialized(state) { state.initialized = true },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending,   (s) => { s.isLoading = true; s.error = null })
    builder.addCase(registerUser.fulfilled, (s, a) => { s.isLoading = false; s.user = a.payload.user; s.token = a.payload.token; toast.success('Welcome to ShopWave! 🎉') })
    builder.addCase(registerUser.rejected,  (s, a) => { s.isLoading = false; s.error = a.payload; toast.error(a.payload) })
    // Login
    builder.addCase(loginUser.pending,   (s) => { s.isLoading = true; s.error = null })
    builder.addCase(loginUser.fulfilled, (s, a) => { s.isLoading = false; s.user = a.payload.user; s.token = a.payload.token; toast.success(`Welcome back, ${a.payload.user.name}! 👋`) })
    builder.addCase(loginUser.rejected,  (s, a) => { s.isLoading = false; s.error = a.payload; toast.error(a.payload) })
    // Fetch Profile
    builder.addCase(fetchProfile.fulfilled, (s, a) => { s.user = a.payload.user; s.initialized = true })
    builder.addCase(fetchProfile.rejected,  (s) => { s.token = null; localStorage.removeItem('token'); s.initialized = true })
    // Update Profile
    builder.addCase(updateProfile.fulfilled, (s, a) => { s.user = a.payload.user; toast.success('Profile updated!') })
    // Wishlist
    builder.addCase(toggleWishlist.fulfilled, (s, a) => { if (s.user) s.user.wishlist = a.payload.wishlist })
  },
})

export const { logout, clearError, setInitialized } = authSlice.actions
export default authSlice.reducer
