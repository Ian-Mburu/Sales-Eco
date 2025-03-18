// productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const getProducts = createAsyncThunk(
  'products/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/products/');
      // Ensure the response data is an array
      if (!Array.isArray(response.data)) {
        throw new Error('Expected an array of products');
      }
      return response.data; // This should be an array
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getProductDetail = createAsyncThunk(
  'products/getDetail',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/${productId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  'products/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await API.post('/cart/add/', { product_id: productId, quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const likeProduct = createAsyncThunk(
  'products/like',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.post(`/products/${productId}/like/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'products/wishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.post(`/wishlist/add/${productId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    productDetail: null,
    productsStatus: 'idle',
    productDetailStatus: 'idle',
    error: null,
    cartStatus: 'idle',
    likeStatus: 'idle',
    wishlistStatus: 'idle',
    currentProductId: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.productsStatus = 'loading';
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.productsStatus = 'succeeded';
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.productsStatus = 'failed';
        state.error = action.payload;
      })
      
      // Add to Cart
      .addCase(addToCart.pending, (state, action) => {
        state.cartStatus = 'loading';
        state.currentProductId = action.meta.arg.productId;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.cartStatus = 'succeeded';
        state.currentProductId = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.cartStatus = 'failed';
        state.currentProductId = null;
        state.error = action.payload;
      })
      
      // Like Product
      .addCase(likeProduct.pending, (state, action) => {
        state.likeStatus = 'loading';
        state.currentProductId = action.meta.arg;
      })
      .addCase(likeProduct.fulfilled, (state, action) => {
        state.likeStatus = 'succeeded';
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index >= 0) {
          state.products[index] = action.payload;
        }
        state.currentProductId = null;
      })
      .addCase(likeProduct.rejected, (state, action) => {
        state.likeStatus = 'failed';
        state.currentProductId = null;
        state.error = action.payload;
      })
      
      // Wishlist
      .addCase(addToWishlist.pending, (state, action) => {
        state.wishlistStatus = 'loading';
        state.currentProductId = action.meta.arg;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlistStatus = 'succeeded';
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index >= 0) {
          state.products[index] = action.payload;
        }
        state.currentProductId = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.wishlistStatus = 'failed';
        state.currentProductId = null;
        state.error = action.payload;
      });
  }
});

export default productsSlice.reducer;