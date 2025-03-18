import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access')}`
  },
});

// Function to refresh the access token
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token available');

    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
      refresh,
    });

    const newAccessToken = response.data.access;
    localStorage.setItem('token', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login'; // Redirect to login if refresh fails
    throw error;
  }
};

// Intercept requests to add the token
API.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Intercept responses to check for expired token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.response?.data?.code === 'token_not_valid') {
      try {
        const newToken = await refreshToken();
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return API.request(error.config); // Retry the original request
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;



const API_URL = "/api/cart/"; 

// Get Cart Items
export const getCartItems = async () => {
  try {
      const response = await API.get(API_URL); // Use API instance
      return response.data;
  } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
  }
};

// Add Item to Cart
export const addToCart = async (product_id, quantity = 1) => {
  try {
      const response = await API.post(`${API_URL}add/`, { product_id, quantity });
      return response.data;
  } catch (error) {
      console.error("Error adding to cart:", error);
      return null;
  }
};

// Update Cart Item Quantity
export const updateCartItem = async (cart_id, quantity) => {
  try {
      const response = await API.put(`${API_URL}update/${cart_id}/`, { quantity });
      return response.data;
  } catch (error) {
      console.error("Error updating cart item:", error);
      return null;
  }
};

// Remove Item from Cart
export const removeFromCart = async (cart_id) => {
  try {
      await API.delete(`${API_URL}remove/${cart_id}/`);
      return { success: true };
  } catch (error) {
      console.error("Error removing from cart:", error);
      return { success: false };
  }
};