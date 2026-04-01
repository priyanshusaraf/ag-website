import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 45000, // 45s to survive Render cold starts
});

const MAX_RETRIES = 2;
const RETRY_DELAY = 2000;
const RETRYABLE_CODES = new Set(['ECONNABORTED', 'ETIMEDOUT', 'ERR_NETWORK']);

api.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;

    const isRetryable =
      RETRYABLE_CODES.has(error.code) ||
      (!error.response && error.message === 'Network Error') ||
      (error.response && error.response.status >= 502 && error.response.status <= 504);

    if (isRetryable && config.__retryCount < MAX_RETRIES) {
      config.__retryCount += 1;
      await new Promise(r => setTimeout(r, RETRY_DELAY * config.__retryCount));
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Resolve an image URL so it works in both dev and production.
 * - URLs starting with /uploads/ are served by the backend → prepend backend origin.
 * - Absolute URLs (http/https) are returned as-is.
 * - Everything else (e.g. /imagecompressor/..., /harris-tweed-collection/...) is a
 *   frontend public asset and returned as-is.
 */
export function resolveImageUrl(src) {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    // Already absolute — but fix legacy localhost URLs for deployed site
    if (src.includes('localhost:5000/uploads/')) {
      const path = src.replace(/^https?:\/\/[^/]+/, '');
      const backendOrigin = API_BASE.replace(/\/api\/?$/, '');
      return `${backendOrigin}${path}`;
    }
    return src;
  }
  if (src.startsWith('/uploads/')) {
    const backendOrigin = API_BASE.replace(/\/api\/?$/, '');
    return `${backendOrigin}${src}`;
  }
  return src;
}
