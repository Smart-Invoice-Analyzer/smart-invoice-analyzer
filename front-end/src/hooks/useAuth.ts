import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { login, logout } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const loginUser = (email: string,name: string, password: string,username:string, surname:string,userId: string) => {
    dispatch(login({email,name,password,username,surname,userId}));
  };

  const logoutUser = (email: string,name: string, password: string,username:string) => {
    dispatch(logout());
  };

  return {
    user,
    loginUser,
    logoutUser,
  };
};
