import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
 
  user: string | null;
  userName: string | null;
  surname: string | null;
  password: string | null;
  username: string | null;
  userId : string| null;
}

const initialState: AuthState = {
  userId: localStorage.getItem('userId'),
  userName: localStorage.getItem('name'),
  user: localStorage.getItem('email'),
  surname: localStorage.getItem('surname'),
  password: localStorage.getItem('password'),
  username: localStorage.getItem('username')
 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string, name: string, password: string,username: string, surname: string,userId: string}>) => {

      state.userId = action.payload.userId;
      state.user = action.payload.email;
      state.userName = action.payload.name;
      state.surname = action.payload.surname;
      state.password = action.payload.password;
      state.username = action.payload.username;
      localStorage.setItem('email', action.payload.email);
      localStorage.setItem('name', action.payload.name);
      localStorage.setItem('password',action.payload.password);
      localStorage.setItem('username',action.payload.username);
      localStorage.setItem('surname',action.payload.surname);
      localStorage.setItem('userId',action.payload.userId);
    },
    logout: (state) => {
      state.user = null;
      state.userName = null;
      state.username = null;
      state.password =null;
      state.userId = null;
      localStorage.removeItem('user');
      localStorage.removeItem('userName');
      localStorage.removeItem('password');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('surname');
      localStorage.removeItem('name');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
