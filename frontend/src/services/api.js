import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Request interceptor to add token and simulated date
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const simulatedDate = sessionStorage.getItem('simulated_date');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Attach time-travel override if the developer selected one
  if (simulatedDate) {
    config.headers['X-Simulated-Date'] = simulatedDate;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
