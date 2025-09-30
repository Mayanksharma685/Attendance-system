import axios from "axios";

// 🔹 Main API base (student + teacher endpoints)
export const API_BASE =
  (import.meta as any).env.VITE_API_BASE || "http://localhost:4000/api";


// 🔹 Separate base for QR attendance endpoints
export const QR_API_BASE = `${API_BASE}/qr`;

// 🔹 Reusable Axios client for general APIs
export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});
