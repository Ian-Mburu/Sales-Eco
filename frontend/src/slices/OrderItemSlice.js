import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchOrderItems = createAsyncThunk(
  'orderItems/fetchAll',
  async () => {
    const response = await API.get('/order-items/');
    return response.data;
  }
);

const orderItemSlice = createSlice({
  name: 'orderItems',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      });
  }
});

export default orderItemSlice.reducer;