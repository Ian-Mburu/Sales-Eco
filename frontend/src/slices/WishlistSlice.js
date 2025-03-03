import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/wishlist/');
      return response.data;
    } catch (error) {
      console.error("Wishlist fetch error:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch");
    }
  }
);



export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (itemId, { dispatch }) => {
    await API.delete(`/wishlist/${itemId}/`);
    dispatch(fetchWishlist()); // Refetch wishlist after deletion
    return itemId;
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
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export default wishlistSlice.reducer;