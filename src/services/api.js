import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Order API
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrderPriceEstimate: (orderData) => api.post('/orders/estimate', orderData),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  getOrderTracking: (orderId) => api.get(`/orders/${orderId}/track`),
  updateOrderStatus: (orderId, status, notes) => 
    api.patch(`/orders/${orderId}/status`, { status, notes }),
};

// Admin API
export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  getDashboardData: () => api.get('/admin/dashboard'),
  getActivityLogs: (page = 1, limit = 50, orderId = null) => {
    const params = { page, limit };
    if (orderId) params.orderId = orderId;
    return api.get('/admin/logs', { params });
  },
  getOrders: (status = null, mobileId = null, page = 1, limit = 20) => {
    const params = { page, limit };
    if (status) params.status = status;
    if (mobileId) params.mobileId = mobileId;
    return api.get('/admin/orders', { params });
  },
  getMobileUnits: () => api.get('/admin/mobiles'),
  updateOrderStatus: (orderId, status, notes) => 
    api.patch(`/admin/orders/${orderId}/status`, { status, notes }),
  updateMobileUnit: (mobileId, updates) => 
    api.patch(`/admin/mobiles/${mobileId}`, updates),
};

// Mobile API
export const mobileAPI = {
  getMobiles: () => api.get('/mobiles'),
  getAvailableMobiles: (lat, lng) => 
    api.get('/mobiles/available', { params: { lat, lng } }),
  getMobile: (mobileId) => api.get(`/mobiles/${mobileId}`),
  updateMobileLocation: (mobileId, lat, lng) => 
    api.patch(`/mobiles/${mobileId}/location`, { lat, lng }),
  updateMobileAvailability: (mobileId, is_available, available_from) => 
    api.patch(`/mobiles/${mobileId}/availability`, { is_available, available_from }),
};

// Upload API
export const uploadAPI = {
  uploadVehicleImage: (formData) => 
    api.post('/upload/vehicle-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  deleteVehicleImage: (filename) => api.delete(`/upload/vehicle-image/${filename}`),
  getImageInfo: (filename) => api.get(`/upload/vehicle-image/${filename}`),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
