import axios from 'axios';

const api = axios.create({
  // baseURL: import.meta.env.VITE_BACKEND_URL,
  baseURL: `https://videosharingplatform-backend.onrender.com/api/v1`,
  withCredentials: true,   // 👈 needed if cookies are used
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

