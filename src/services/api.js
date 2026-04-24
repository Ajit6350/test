/**
 * Quant Bridge — API Service.
 * Centralized HTTP client for backend communication.
 */
import axios from 'axios';

// In dev mode, Vite proxy handles /api -> localhost:7860
// In production (Vercel), set VITE_API_URL to your HF Space URL
const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qb_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 (expired token)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('qb_access_token');
      // Could redirect to login here
    }
    return Promise.reject(err);
  }
);

/**
 * Get the WebSocket URL for real-time data.
 * Uses Vite proxy in dev, direct HF Space URL in production.
 */
export const getWsUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (apiUrl) {
    // Production: connect directly to HF Space
    const wsProtocol = apiUrl.startsWith('https') ? 'wss:' : 'ws:';
    const host = apiUrl.replace(/^https?:\/\//, '');
    return `${wsProtocol}//${host}/ws/ticker`;
  }
  
  // Dev mode: use Vite proxy (same origin)
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws/ticker`;
};

export { api as API };
export default api;
