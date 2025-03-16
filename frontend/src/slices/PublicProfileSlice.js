// src/slices/PublicProfileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const getPublicProfile = createAsyncThunk(
  'publicProfile/get',
  async (username, { rejectWithValue }) => {
    try {
      const response = await API.get(`/profile/${username}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const publicProfileSlice = createSlice({
  name: 'publicProfile',
  initialState: {
    profile: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPublicProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPublicProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(getPublicProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default publicProfileSlice.reducer;