import API from '../services/api';

export const fetchUserProfile = async () => {
    try {
      const response = await API.get('/profile/');
      return response.data;
    } catch (error) {
      console.error("Profile fetch error:", error.response?.data || error.message);
      throw error;
    }
  };
