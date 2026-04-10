/**
 * Axios instance pre-configured for the academy backend.
 * Base URL is controlled via NEXT_PUBLIC_API_URL in .env.local
 */
import axios from "axios";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://academy-backend-lwwx.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── Response interceptor (global error logging) ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API Error]", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

// ── Convenience helpers ────────────────────────────────────────────────────

/** Resolve a full URL from a path, e.g. apiUrl("/api/courses") */
export const apiUrl = (path) => `${API_BASE}${path}`;

/** GET /api/banners?position=<pos> – returns published banners only */
export const getBanners = (position = "home") =>
  api.get(`/api/banners${position ? `?position=${position}` : ""}`);

/** POST to any endpoint (authenticated – attach token manually if needed) */
export const postData = (url, data, token) =>
  api.post(url, data, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
