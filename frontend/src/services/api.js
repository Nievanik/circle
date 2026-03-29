import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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
