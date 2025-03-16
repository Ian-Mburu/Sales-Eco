import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/notifications/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    status: 'idle',
    error: null
  },
  reducers: {
    markAsViewed: (state, action) => {
      const notification = state.notifications.find(
        n => n.id === action.payload
      );
      if (notification) notification.viewed = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { markAsViewed } = notificationSlice.actions;
export default notificationSlice.reducer;