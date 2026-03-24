import axios from 'axios';

const IS_DEV = window.location.hostname === 'localhost';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (IS_DEV ? 'http://localhost:5001/api' : 'https://roomora-tb9l.onrender.com/api')
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
