import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  user: string | null;
  userName: string | null;
  surname: string | null;
  password: string | null;
  username: string | null;
  user_id: string | null;
  token: string | null;
  date_of_birth: string | null;
  gender: string | null;
}

const initialState: AuthState = {
  user_id: localStorage.getItem('user_id'),
  userName: localStorage.getItem('name'),
  user: localStorage.getItem('email'),
  surname: localStorage.getItem('surname'),
  password: localStorage.getItem('password'),
  username: localStorage.getItem('username'),
  token: localStorage.getItem('token'),
  date_of_birth: localStorage.getItem('date_of_birth'),
  gender: localStorage.getItem('gender')
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        email: string;
        name: string;
        password: string;
        username: string;
        surname: string;
        user_id: string;
        token: string;
        date_of_birth: string;
        gender: string


      }>
    ) => {
      const { email, name, password, username, surname, user_id, token, date_of_birth, gender } = action.payload;

      // State güncelleme
      state.user_id = user_id;
      state.user = email;
      state.userName = name;
      state.surname = surname;
      state.password = password;
      state.username = username;
      state.token = token;
      state.date_of_birth = date_of_birth;
      state.gender = gender;

      // localStorage güncelleme
      localStorage.setItem('email', email);
      localStorage.setItem('name', name);
      localStorage.setItem('password', password);
      localStorage.setItem('username', username);
      localStorage.setItem('surname', surname);
      localStorage.setItem('user_Id', user_id);
      localStorage.setItem('token', token);
      localStorage.setItem('date_of_birth', date_of_birth);
      localStorage.setItem('gender', gender)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    logout: (state) => {
      // State sıfırlama
      state.user = null;
      state.userName = null;
      state.username = null;
      state.password = null;
      state.user_id = null;
      state.surname = null;

      // localStorage temizleme
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      localStorage.removeItem('password');
      localStorage.removeItem('username');
      localStorage.removeItem('surname');
      localStorage.removeItem('user_id');
      localStorage.removeItem('token');
      localStorage.removeItem('gender');
      localStorage.removeItem('age');
      localStorage.setItem('darkMode', 'false');
      localStorage.removeItem('darkMode')

      window.location.reload();

    },
    updateProfile: (
      state,
      action: PayloadAction<{
        name: string;
        surname: string;
        password: string;
        email: string;
        userId: string
      }>
    ) => {
      const { name, surname, password, email } = action.payload;

      // State güncelleme
      state.userName = name;
      state.surname = surname;
      state.password = password;
      state.user = email;

      // localStorage güncelleme
      localStorage.setItem('name', name);
      localStorage.setItem('surname', surname);
      localStorage.setItem('password', password);
      localStorage.setItem('email', email);
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
