// src/features/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, fetchProductDetail } from '../services/productService';
import axios from 'axios';

const initialState = {
  products: [],
  product: null,  
  productsStatus: 'idle',
  productStatus: 'idle',
  cartStatus: 'idle', 
  error: null,
};

export const getProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    return fetchProducts();
  }
);

export const getProductDetail = createAsyncThunk(
  'products/fetchDetail',
  async (slug) => {
    return fetchProductDetail(slug);
  }
);

export const addToCart = createAsyncThunk(
  'cart/add',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/cart/add/', { product_id: productId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add to cart');
    }
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
        state.products = action.payload.results || [];
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