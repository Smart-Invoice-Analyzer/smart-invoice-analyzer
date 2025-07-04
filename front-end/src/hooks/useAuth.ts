import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { login, logout } from "../store/authSlice";
import { loginUserAPI } from "../api/auth";
import { n } from "framer-motion/dist/types.d-B50aGbjN";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
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
          user_id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          name: response.user.name,
          surname: response.user.surname,
          password: response.user.password,
          token: response.user.token,
          date_of_birth: response.user.date_of_birth,
          gender: response.user.gender

        })
      );
    } catch (error) {
      console.error("Login failed", error);
      throw new Error("Giriş başarısız. Bilgileri kontrol edin.");
    }
  };

  const logoutUser = () => {
    // localStorage.removeItem("token"); // Token'ı temizle
    dispatch(logout());
    setTimeout(() => {
      navigate('/');
    }, 50);
  };

  return {
    user,
    loginUser,
    logoutUser,
  };
};
