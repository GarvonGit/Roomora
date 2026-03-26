import axios from 'axios';

const IS_DEV = window.location.hostname === 'localhost';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (IS_DEV ? 'http://localhost:5001/api' : '/api')
});

let activeRequests = 0;

const toggleLoader = (isLoading) => {
  const event = new CustomEvent('global-loader', { detail: { isLoading } });
  window.dispatchEvent(event);
};

api.interceptors.request.use(
  (config) => {
    activeRequests++;
    toggleLoader(true);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    activeRequests--;
    if (activeRequests <= 0) toggleLoader(false);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    activeRequests--;
    if (activeRequests <= 0) toggleLoader(false);
    return response;
  },
  (error) => {
    activeRequests--;
    if (activeRequests <= 0) toggleLoader(false);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
