import axios from 'axios';

/**
 * Centralized API client.
 * Configure the base URL via the VITE_API_URL environment variable.
 * All requests to the backend go through this instance.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hn_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 -> redirect to login (to be wired up when auth exists)
    if (error.response?.status === 401) {
      // Placeholder for auth redirect logic
    }
    return Promise.reject(error);
  }
);

export default apiClient;
