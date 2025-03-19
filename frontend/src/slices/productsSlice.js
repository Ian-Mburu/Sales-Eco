// productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

// Fetch all products
export const getProducts = createAsyncThunk(
  'products/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/products/');
      if (!Array.isArray(response.data)) {
        throw new Error('Expected an array of products');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch single product details
export const getProductDetail = createAsyncThunk(
  'products/getDetail',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/${productId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add product to cart
export const addToCart = createAsyncThunk(
  'products/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await API.post('/cart/add/', { 
        product_id: productId, 
        quantity 
      });
      return { productId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Like/unlike product
export const likeProduct = createAsyncThunk(
  'products/like',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.post(`/products/${productId}/like/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add product to wishlist
export const addToWishlist = createAsyncThunk(
  'products/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.post(`/wishlist/add/${productId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    productDetail: null,
    status: {
      products: 'idle',
      detail: 'idle',
      cart: 'idle',
      like: 'idle',
      wishlist: 'idle'
    },
    error: null,
    currentProductId: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.status.products = 'loading';
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status.products = 'succeeded';
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status.products = 'failed';
        state.error = action.payload;
      })

      // Get Product Detail
      .addCase(getProductDetail.pending, (state) => {
        state.status.detail = 'loading';
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.status.detail = 'succeeded';
        state.productDetail = action.payload;
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.status.detail = 'failed';
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.pending, (state, action) => {
        state.status.cart = 'loading';
        state.currentProductId = action.meta.arg.productId;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status.cart = 'succeeded';
        const index = state.products.findIndex(p => p.id === action.payload.product.id);
        if (index !== -1) {
          state.products[index].is_in_cart = true;
        }
        state.currentProductId = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status.cart = 'failed';
        state.currentProductId = null;
        state.error = action.payload?.detail || action.payload?.message || "Failed to add to cart";
      })

      // Like Product
      .addCase(likeProduct.pending, (state, action) => {
        state.status.like = 'loading';
        state.currentProductId = action.meta.arg;
      })
      .addCase(likeProduct.fulfilled, (state, action) => {
        state.status.like = 'succeeded';
        const updatedProduct = action.payload;
        const index = state.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          state.products[index] = {
            ...state.products[index], // Keep existing properties
            has_liked: updatedProduct.has_liked, // Update like status
            likes_count: updatedProduct.likes_count // Update like count
          };
        }
        state.currentProductId = null;
      })
      .addCase(likeProduct.rejected, (state, action) => {
        state.status.like = 'failed';
        state.currentProductId = null;
        state.error = action.payload?.detail || action.payload?.message || "Failed to like product";
      })

      // Add to Wishlist
      .addCase(addToWishlist.pending, (state, action) => {
        state.status.wishlist = 'loading';
        state.currentProductId = action.meta.arg;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.status.wishlist = 'succeeded';
        const index = state.products.findIndex(p => p.id === action.payload.product.id);
        if (index !== -1) {
          state.products[index].is_in_wishlist = true;
        }
        state.currentProductId = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status.wishlist = 'failed';
        state.currentProductId = null;
        state.error = action.payload?.detail || action.payload?.message || "Failed to add to wishlist";
      });
  }
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;