// src/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loadInitialState = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')) || null;
  
  return {
    user,
    token,
    isAuthenticated: !!token,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    },
    silentRefresh: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    }
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;


// ProductList component
