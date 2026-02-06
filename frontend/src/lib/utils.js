import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import axios from 'axios';

// Set this to your backend server URL (adjust if needed)
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

export default api;

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
