// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5173/api';

// Helper function for making API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

// Auth API
export const authAPI = {
  login: (email, password) => 
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
    
  register: (name, email, password) => 
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
    
  getCurrentUser: () => apiCall('/auth/me'),
};

// Resources API
export const resourcesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/resources${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiCall(`/resources/${id}`),
  
  create: (resourceData) => 
    apiCall('/resources', {
      method: 'POST',
      body: JSON.stringify(resourceData),
    }),
    
  update: (id, resourceData) => 
    apiCall(`/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resourceData),
    }),
    
  delete: (id) => 
    apiCall(`/resources/${id}`, {
      method: 'DELETE',
    }),
};

// Borrowing API
export const borrowingAPI = {
  createRequest: (resourceId, borrowData) => 
    apiCall('/borrow', {
      method: 'POST',
      body: JSON.stringify({ resourceId, ...borrowData }),
    }),
    
  getUserBorrows: () => apiCall('/borrow/user'),
  
  renewRequest: (borrowId) => 
    apiCall(`/borrow/${borrowId}/renew`, {
      method: 'POST',
    }),
    
  returnItem: (borrowId) => 
    apiCall(`/borrow/${borrowId}/return`, {
      method: 'POST',
    }),
    
  approveBorrow: (borrowId) => 
    apiCall(`/borrow/${borrowId}/approve`, {
      method: 'POST',
    }),
    
  rejectBorrow: (borrowId) => 
    apiCall(`/borrow/${borrowId}/reject`, {
      method: 'POST',
    }),
};

// Feedback API
export const feedbackAPI = {
  create: (borrowId, feedbackData) => 
    apiCall('/feedback', {
      method: 'POST',
      body: JSON.stringify({ borrowId, ...feedbackData }),
    }),
    
  getUserFeedback: () => apiCall('/feedback/user'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiCall('/dashboard/stats'),
  getRecentActivity: () => apiCall('/dashboard/activity'),
};
