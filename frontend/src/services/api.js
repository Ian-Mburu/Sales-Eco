// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// src/services/productService.js

export const fetchProducts = () => API.get('/products/');
export const fetchProductDetail = (slug) => API.get(`/products/${slug}/`);
export const likeProduct = (productId) => API.post('/products/like/', { productId });