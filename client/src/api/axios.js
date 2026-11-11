import axios from 'axios';

const api = axios.create({
  // Se existir a URL da nuvem ele usa, senão usa o localhost (para quando você for testar no PC)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('barber_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;