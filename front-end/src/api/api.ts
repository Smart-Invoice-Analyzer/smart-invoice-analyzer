import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-invoice-analyzer-server.onrender.com/swagger.json", 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common ['Authorization'] = `Bearer ${token}`
  }
  return config;
});

export default api;
