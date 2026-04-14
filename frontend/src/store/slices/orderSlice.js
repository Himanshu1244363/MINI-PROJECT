// orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export const createOrder = createAsyncThunk('order/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/orders', data)
    return res.data.order
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to place order')
  }
})

export const fetchMyOrders = createAsyncThunk('order/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/orders/my')
    return res.data.orders
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchAllOrders = createAsyncThunk('order/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/orders', { params })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const markOrderPaid = createAsyncThunk('order/markPaid', async ({ id, paymentData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/orders/${id}/pay`, paymentData)
    return res.data.order
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateOrderStatus = createAsyncThunk('order/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/orders/${id}/status`, { status })
    return res.data.order
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders:       [],
    allOrders:    [],
    currentOrder: null,
    isLoading:    false,
    error:        null,
  },
  reducers: {
    clearCurrentOrder(state) { state.currentOrder = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending,   (s) => { s.isLoading = true })
      .addCase(createOrder.fulfilled, (s, a) => { s.isLoading = false; s.currentOrder = a.payload; toast.success('Order placed successfully! 🎉') })
      .addCase(createOrder.rejected,  (s, a) => { s.isLoading = false; s.error = a.payload; toast.error(a.payload) })
      .addCase(fetchMyOrders.pending,   (s) => { s.isLoading = true })
      .addCase(fetchMyOrders.fulfilled, (s, a) => { s.isLoading = false; s.orders = a.payload })
      .addCase(fetchMyOrders.rejected,  (s, a) => { s.isLoading = false; s.error = a.payload })
      .addCase(fetchAllOrders.fulfilled, (s, a) => { s.allOrders = a.payload.orders })
      .addCase(markOrderPaid.fulfilled,  (s, a) => { s.currentOrder = a.payload })
      .addCase(updateOrderStatus.fulfilled, (s, a) => {
        const i = s.allOrders.findIndex(o => o._id === a.payload._id)
        if (i > -1) s.allOrders[i] = a.payload
      })
  },
})

export const { clearCurrentOrder } = orderSlice.actions
export default orderSlice.reducer
