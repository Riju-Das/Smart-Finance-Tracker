import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/authStore";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig{
  _retry?: boolean;
}

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
})

api.interceptors.request.use((config:CustomAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config;
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest:CustomAxiosRequestConfig = error.config;
    const skipRefresh = ["/login", "/register"].some((path) =>
      originalRequest.url?.endsWith(path)
    );
    if (error.response?.status === 401 && !originalRequest._retry && !skipRefresh) {
      originalRequest._retry = true;
      try {
        const res = await api.post<{accessToken:string}>("/refresh");
        const newToken = res.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest);
      }
      catch (err) {
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
)

export default api;