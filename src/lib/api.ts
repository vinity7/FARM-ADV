import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ──
export const loginUser = (phone: string, password: string) =>
  api.post('/auth/login', { phone, password });

export const registerUser = (data: { name: string; phone: string; district: string; password: string }) =>
  api.post('/auth/register', data);

export const getMe = () => api.get('/auth/me');

// ── AI Query ──
export const sendQuery = (formData: FormData) =>
  api.post('/query', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ── Market Prices ──
export const getAllPrices = () => api.get('/prices');
export const getCropPrice = (crop: string) => api.get(`/prices/${crop}`);

// ── Calendar ──
export const getCalendar = (district: string) => api.get(`/calendar/${district}`);

export default api;
