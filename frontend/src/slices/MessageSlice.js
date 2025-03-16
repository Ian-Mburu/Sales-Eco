// messageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const sendMessage = createAsyncThunk(
  'messages/send',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await API.post('/messages/create/', messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default messageSlice.reducer;