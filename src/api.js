import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vaporization.github.io/noaa-weather-app/', // Update to your Flask server URL
});

export const fetchAlerts = async (userId) => {
  const response = await api.get(`/api/alerts/${userId}`);
  return response.data;
};

export const createAlert = async (alertData) => {
  const response = await api.post('/api/alerts', alertData);
  return response.data;
};
