import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { login, logout } from "../store/authSlice";
import { loginUserAPI } from "../api/auth";

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const loginUser = async (username_or_email: string, password: string) => {
    try {
      const response = await loginUserAPI({ username_or_email, password });

      // Eğer API token döndürüyorsa, localStorage'e kaydedelim
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      // Redux'a kullanıcı bilgilerini kaydet
      dispatch(
        login({
          userId: response.user.id,
          username: response.user.username,
          email: response.user.email,
          name: response.user.name,
          surname: response.user.surname,
          password: response.user.password,
          token: response.user.token,
          age: response.user.age,
          gender: response.user.age
          
        })
      );
    } catch (error) {
      console.error("Login failed", error);
      throw new Error("Giriş başarısız. Bilgileri kontrol edin.");
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token"); // Token'ı temizle
    dispatch(logout());
  };

  return {
    user,
    loginUser,
    logoutUser,
  };
};
