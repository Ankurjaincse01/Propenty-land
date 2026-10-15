import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const adminApi = {
  get: (url: string) => api.get(url, { headers: authHeaders() }),
  post: (url: string, body?: any) => api.post(url, body, { headers: authHeaders() }),
  put: (url: string, body?: any) => api.put(url, body, { headers: authHeaders() }),
  patch: (url: string, body?: any) => api.patch(url, body, { headers: authHeaders() }),
  delete: (url: string) => api.delete(url, { headers: authHeaders() }),
};

export default api;
