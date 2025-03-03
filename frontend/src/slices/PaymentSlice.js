// src/features/paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchPayments = createAsyncThunk(
  'payments/fetchAll',
  async () => {
    try {
      const response = await API.get('/payments/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch payments');
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/create',
  async (paymentData) => {
    try {
      const response = await API.post('/payments/', paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Payment failed');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  }
});

export default paymentSlice.reducer;