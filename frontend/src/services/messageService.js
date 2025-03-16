import API from './api';

const messageService = {
  getMessages: async () => {
    try {
      const response = await API.get('/messages/');
      return response.data;
                                                                                                                                                                        } catch (error) {
      throw error.response.data;
    }
  },
  
  sendMessage: async (messageData) => {
    try {
      const response = await API.post('/messages/', messageData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};

export default messageService;