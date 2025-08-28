import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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
  getEmployees: () => api.get('/admin/employees'),
  createEmployee: (data) => api.post('/admin/employees', data),
  deleteEmployee: (id) => api.delete(`/admin/employees/${id}`),
  getUsers: () => api.get('/admin/users'),
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