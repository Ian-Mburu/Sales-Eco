import API from '../services/api';


export const fetchProducts = async () => {
    try {
      const response = await API.get('/products/');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  };
  
  export const fetchProductDetail = async (slug) => {
    try {
      const response = await API.get(`/products/${slug}/`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch product details');
    }
  };