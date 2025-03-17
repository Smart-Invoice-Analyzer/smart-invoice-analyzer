import api from "./api";

interface LoginPayload {
  username_or_email: string;
  password: string;
}

export const loginUserAPI = async (payload: LoginPayload) => {
  const response = await api.post("/users/login", payload);
  return response.data; // API'nin döndüğü JWT token gibi verileri alabiliriz
};
