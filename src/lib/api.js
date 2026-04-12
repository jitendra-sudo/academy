/**
 * Axios instance pre-configured for the academy backend.
 * Base URL is controlled via NEXT_PUBLIC_API_URL in .env.local
 */
import axios from "axios";

export const API_BASE ="https://academy-backend-zxwe.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API Error]", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

export const apiUrl = (path) => `${API_BASE}${path}`;
// ─── Banners ─────────────────────────────────────────────────────────────────
export const getBanners = (position = "") =>
  api.get(`/api/banners${position ? `?position=${position}` : ""}`);

export const getAllBanners = () => api.get("/api/banners");

export const createBanner = (data, token) =>
  api.post("/api/banners", data, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });

export const updateBanner = (id, data, token) =>
  api.put(`/api/banners/${id}`, data, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });

export const deleteBanner = (id, token) =>
  api.delete(`/api/banners/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// ─── Generic ──────────────────────────────────────────────────────────────────
export const postData = (url, data, token) =>
  api.post(url, data, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
