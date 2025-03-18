import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/wishlist/');
      return response.data;
    } catch (error) {
      console.error("Fetch Wishlist Error:", error.response?.data);  // Log the error
      return rejectWithValue(error.response?.data?.detail || "Failed to fetch wishlist");
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.post(`/wishlist/add/${productId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to add to wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (itemId, { rejectWithValue }) => {
    try {
      await API.delete(`/wishlist/${itemId}/`);
      return itemId;
    } catch (error) {
      console.error("Remove Wishlist Error:", error.response?.data);
      return rejectWithValue(error.response?.data?.detail || "Failed to remove item");
    }
  }
);



export const fetchProductDetails = createAsyncThunk(
  'product/fetchDetails',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/${slug}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch product details");
    }
  }
);



const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default wishlistSlice.reducer;