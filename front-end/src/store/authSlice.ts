import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: string | null;
  userName: string | null;
  surname: string | null;
  password: string | null;
  username: string | null;
  userId: string | null;
  token: string | null;
  age: string |null;
  gender: string | null;
}

const initialState: AuthState = {
  userId: localStorage.getItem('userId'),
  userName: localStorage.getItem('name'),
  user: localStorage.getItem('email'),
  surname: localStorage.getItem('surname'),
  password: localStorage.getItem('password'),
  username: localStorage.getItem('username'),
  token: localStorage.getItem('token'),
  age: localStorage.getItem('age'),
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
        userId: string;
        token: string;
        age: string;
        gender: string

      }>
    ) => {
      const { email, name, password, username, surname, userId,token, age, gender } = action.payload;

      // State güncelleme
      state.userId = userId;
      state.user = email;
      state.userName = name;
      state.surname = surname;
      state.password = password;
      state.username = username;
      state.token = token;
      state.age = age;
      state.gender = gender;

      // localStorage güncelleme
      localStorage.setItem('email', email);
      localStorage.setItem('name', name);
      localStorage.setItem('password', password);
      localStorage.setItem('username', username);
      localStorage.setItem('surname', surname);
      localStorage.setItem('userId', userId);
      localStorage.setItem('token',token);
      localStorage.setItem('age',age);
      localStorage.setItem('gender',gender)
    },
    logout: (state) => {
      // State sıfırlama
      state.user = null;
      state.userName = null;
      state.username = null;
      state.password = null;
      state.userId = null;
      state.surname = null;

      // localStorage temizleme
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      localStorage.removeItem('password');
      localStorage.removeItem('username');
      localStorage.removeItem('surname');
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('gender');
      localStorage.removeItem('age')
    },
    updateProfile: (
      state,
      action: PayloadAction<{
        name: string;
        surname: string;
        password: string;
        email: string;
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
