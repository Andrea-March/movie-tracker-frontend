import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Istanza axios con baseURL e header dinamico per il token
export const api = axios.create({
  baseURL: API_URL,
});

// Interceptor per aggiungere Authorization ad ogni richiesta
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});