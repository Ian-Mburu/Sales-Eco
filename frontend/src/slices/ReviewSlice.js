import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchReviews = createAsyncThunk(
  'reviews/fetchAll',
  async () => {
    const response = await API.get('/reviews/');
    return response.data;
  }
);

export const createReview = createAsyncThunk(
    'reviews/create',
    async (reviewData, { rejectWithValue }) => {
      try {
        const response = await API.post('/reviews/', reviewData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to submit review');
      }
    }
  );

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  }
});

export default reviewSlice.reducer;