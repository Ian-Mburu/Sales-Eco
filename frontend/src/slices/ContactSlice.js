import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const submitContact = createAsyncThunk(
  'contact/submit',
  async (formData) => {
    const response = await API.post('/contact/', formData);
    return response.data;
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitContact.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitContact.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitContact.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default contactSlice.reducer;