import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async () => {
    const response = await API.get('/orders/');
    return response.data;
  }
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData) => {
    const response = await API.post('/orders/', orderData);
    return response.data;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  }
});

export default orderSlice.reducer;