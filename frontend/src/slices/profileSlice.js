import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserProfile } from '../services/profileService';

const initialState = {
  profile: null,
  status: 'idle',
  error: null,
};

// Async thunk for fetching user profile
export const getUserProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
      try {
        return await fetchUserProfile();
      } catch (error) {
        return rejectWithValue(error.response?.data?.detail || error.message);
      }
    }
  );

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default profileSlice.reducer;
