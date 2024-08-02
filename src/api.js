import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAlerts = () => {
    const userId = 'currentUserId'; // Replace with the actual user ID logic
    return axios.get(`${API_BASE_URL}/alerts/${userId}`);
};

export const createAlert = (alertData) => {
    return axios.post(`${API_BASE_URL}/alerts`, alertData);
};
