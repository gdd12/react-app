// Get rid of this file. Does not work as expected with errors
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const SendRequest = async (endpoint, method, data, token) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}/${endpoint}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An error occurred while making the request');
  }
};
