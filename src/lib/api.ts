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

export const registerUser = (data: { name: string; phone: string; district: string; password: string; language?: string }) =>
  api.post('/auth/register', data);

export const getMe = () => api.get('/auth/me');

export const updateProfile = (data: { language: string }) =>
  api.put('/auth/profile', data);

// ── AI Query ──
export const sendQuery = (formData: FormData) =>
  api.post('/query', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ── Market Prices ──
export const getAllPrices = () => api.get('/prices');
export const getCropPrice = (crop: string) => api.get(`/prices/${crop}`);

// ── Ledger ──
export const getLedger = () => api.get('/ledger');
export const addLedgerEntry = (data: any) => api.post('/ledger', data);
export const deleteLedgerEntry = (id: string) => api.delete(`/ledger/${id}`);

// ── Scans ──
export const getScans = () => api.get('/scan');
export const saveScan = (data: any) => api.post('/scan', data);

export default api;
