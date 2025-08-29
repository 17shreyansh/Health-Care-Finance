import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getHealth: () => api.get('/admin/health'),
  getEmployees: (params) => api.get('/admin/employees', { params }),
  createEmployee: (data) => api.post('/admin/employees', data),
  deleteEmployee: (id) => api.delete(`/admin/employees/${id}`),
  getUsers: (params) => api.get('/admin/users', { params }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export const employeeAPI = {
  getDashboard: () => api.get('/employees/dashboard'),
  getReferrals: () => api.get('/employees/referrals'),
};

export const userAPI = {
  getProfile: (userId) => api.get(`/users/profile/${userId}`),
  getMe: () => api.get('/users/me'),
};

export default api;