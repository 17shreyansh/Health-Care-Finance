import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

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