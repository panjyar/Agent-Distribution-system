import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance for admin
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for agent
const agentApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add admin token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add agent token to requests
agentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agentToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle admin response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Handle agent response errors
agentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('agentToken');
      localStorage.removeItem('agentName');
      window.location.href = '/agent-login';
    }
    return Promise.reject(error);
  }
);

// Admin APIs
export const registerAdmin = (data) => api.post('/admin/register', data);
export const loginAdmin = (data) => api.post('/admin/login', data);

// Agent APIs (Admin creates agents)
export const createAgent = (data) => api.post('/agents', data);
export const getAgents = () => api.get('/agents');
export const deleteAgent = (id) => api.delete(`/agents/${id}`);

// Upload APIs (Admin uploads and distributes to agents)
export const uploadFile = (formData) => {
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const getDistributedData = () => api.get('/upload/distributed');

// Agent Auth APIs
export const loginAgentAPI = (data) => agentApi.post('/agent-auth/login', data);

// Sub-Agent APIs (Agent creates sub-agents)
export const createSubAgent = (data) => agentApi.post('/sub-agents', data);
export const getSubAgents = () => agentApi.get('/sub-agents');
export const deleteSubAgent = (id) => agentApi.delete(`/sub-agents/${id}`);

// Agent Task APIs (Agent views their assigned tasks)
export const getAgentTasks = () => agentApi.get('/agent-tasks');
export const getAgentDistributedData = () => agentApi.get('/agent-tasks/distributed');

// Agent Upload APIs (Agent uploads and distributes to sub-agents)
export const agentUploadFile = (formData) => {
  return agentApi.post('/agent-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default api;