import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-invoice-analyzer-server.onrender.com/swagger.json", // Swagger'dan aldığın base URL'yi buraya koy
  headers: {
    "Content-Type": "application/json",
  },
});

// Token varsa ekleyelim
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
