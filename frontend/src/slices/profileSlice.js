import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserProfile } from '../services/profileService';
import API from '../services/api';

const initialState = {
  profile: null,
  status: 'idle',
  error: null,
  lastUpdated: null
};

// Helper function for cache-busted requests
const getProfileWithCacheBust = async () => {
  const timestamp = Date.now();
  return fetchUserProfile(`?cache=${timestamp}`);
};

export const getUserProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await getProfileWithCacheBust();
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'profile/update',
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await API.patch('/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Immediately refresh profile data after update
      await dispatch(getUserProfile());
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    forceProfileRefresh(state) {
      state.lastUpdated = Date.now();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = {
          ...action.payload,
          // Add cache-buster for images
          image: action.payload.image + `?v=${Date.now()}`
        };
        state.lastUpdated = Date.now();
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'updating';
      })
      .addCase(updateUserProfile.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { forceProfileRefresh } = profileSlice.actions;
export default profileSlice.reducer;