// src/services/PaymentService.js
import API from '../services/api';

const paymentService = {
  async processPayment(paymentData) {
    try {
      const response = await API.post('/payments/process/', paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment processing failed');
    }
  },

  async getPaymentHistory() {
    try {
      const response = await API.get('/payments/');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch payment history');
    }
  }
};

export default paymentService;