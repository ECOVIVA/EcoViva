import axios from 'axios';

// Base URL for the Django backend
const API_URL = 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set the auth token for all requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ecovivaAuthToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const checkIn = async () => {
  try {
    const response = await api.post('/checkin/');
    return response.data;
  } catch (error) {
    console.error('Check-in error:', error);
    throw error;
  }
};

export const getUserProgress = async () => {
  try {
    const response = await api.get('/user/progress/');
    return response.data;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

export default api;
