import axios from 'axios';
import apiBaseURL from '../config';

const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createAlert = async (alertData) => {
  try {
    const response = await apiClient.post('/alerts', alertData);
    return response.data;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};
