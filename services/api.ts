import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 8000,
});

// Siempre obtiene un token fresco de Firebase (se auto-renueva antes de expirar)
api.interceptors.request.use(async (config) => {
  try {
    const token = auth.currentUser
      ? await auth.currentUser.getIdToken()
      : localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// En 401 fuerza refresh del token y reintenta la request una vez
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const token = await auth.currentUser?.getIdToken(true);
        if (token) {
          localStorage.setItem('token', token);
          error.config.headers.Authorization = `Bearer ${token}`;
          return api(error.config);
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
