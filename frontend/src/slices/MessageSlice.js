// messageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';


export const getMessageThread = createAsyncThunk(
  'messages/getThread',
  async (threadId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/messages/threads/${threadId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


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
    threads: {},
    currentThread: null,
    status: 'idle',
    error: null
  },
  reducers: {
    addMessageToThread: (state, action) => {
      const { threadId, message } = action.payload;
      if (!state.threads[threadId]) {
        state.threads[threadId] = [];
      }
      state.threads[threadId].push(message);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessageThread.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getMessageThread.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentThread = action.payload;
        // Store thread in threads object
        state.threads[action.payload.id] = action.payload.messages;
      })
      .addCase(getMessageThread.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { threadId, message } = action.payload;
        if (!state.threads[threadId]) {
          state.threads[threadId] = [];
        }
        state.threads[threadId].push(message);
      });
  }
});

export const { addMessageToThread } = messageSlice.actions;
export default messageSlice.reducer;