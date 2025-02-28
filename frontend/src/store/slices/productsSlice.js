// src/features/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, fetchProductDetail } from '../../services/productService';

const initialState = {
  products: [],
  product: null,
  status: 'idle',
  error: null,
};

export const getProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    const response = await fetchProducts();
    console.log('API Response:', response); 
    return response.data;
  }
);


export const getProductDetail = createAsyncThunk(
  'products/fetchDetail',
  async (slug) => {
    const response = await fetchProductDetail(slug);
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => { // Add error case
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getProductDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.product = action.payload;
      });
  },
});

export default productsSlice.reducer;