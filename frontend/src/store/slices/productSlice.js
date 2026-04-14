import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchProducts = createAsyncThunk('product/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString()
    const res = await api.get(`/products?${query}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchProduct = createAsyncThunk('product/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/products/${id}`)
    return res.data.product
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchRecommendations = createAsyncThunk('product/recommendations', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/ai/recommendations')
    return res.data
  } catch (err) {
    // Fall back to trending
    try {
      const res2 = await api.get('/ai/trending')
      return { recommendations: res2.data.trending, basis: 'Trending products' }
    } catch {
      return rejectWithValue('Failed to load recommendations')
    }
  }
})

export const fetchSuggestions = createAsyncThunk('product/suggestions', async (q, { rejectWithValue }) => {
  try {
    const res = await api.get(`/products/suggestions?q=${q}`)
    return res.data.suggestions
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const createProduct = createAsyncThunk('product/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/products', data)
    return res.data.product
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateProduct = createAsyncThunk('product/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/products/${id}`, data)
    return res.data.product
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const deleteProduct = createAsyncThunk('product/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products:        [],
    selectedProduct: null,
    recommendations: [],
    recommendBasis:  '',
    suggestions:     [],
    pagination:      { page: 1, pages: 1, total: 0, limit: 12 },
    filters:         { keyword: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 },
    isLoading:       false,
    detailLoading:   false,
    error:           null,
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload, page: 1 }
    },
    setPage(state, action) {
      state.filters.page = action.payload
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null
    },
    clearSuggestions(state) {
      state.suggestions = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,  (s) => { s.isLoading = true })
      .addCase(fetchProducts.fulfilled,(s, a) => { s.isLoading = false; s.products = a.payload.products; s.pagination = a.payload.pagination })
      .addCase(fetchProducts.rejected, (s, a) => { s.isLoading = false; s.error = a.payload })
      .addCase(fetchProduct.pending,   (s) => { s.detailLoading = true })
      .addCase(fetchProduct.fulfilled, (s, a) => { s.detailLoading = false; s.selectedProduct = a.payload })
      .addCase(fetchProduct.rejected,  (s, a) => { s.detailLoading = false; s.error = a.payload })
      .addCase(fetchRecommendations.fulfilled, (s, a) => { s.recommendations = a.payload.recommendations; s.recommendBasis = a.payload.basis })
      .addCase(fetchSuggestions.fulfilled,     (s, a) => { s.suggestions = a.payload })
      .addCase(createProduct.fulfilled, (s, a) => { s.products.unshift(a.payload) })
      .addCase(updateProduct.fulfilled, (s, a) => { const i = s.products.findIndex(p => p._id === a.payload._id); if (i > -1) s.products[i] = a.payload })
      .addCase(deleteProduct.fulfilled, (s, a) => { s.products = s.products.filter(p => p._id !== a.payload) })
  },
})

export const { setFilters, setPage, clearSelectedProduct, clearSuggestions } = productSlice.actions
export default productSlice.reducer
