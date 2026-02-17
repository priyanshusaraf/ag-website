import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import axios from 'axios';

// Set this to your backend server URL (adjust if needed)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

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
