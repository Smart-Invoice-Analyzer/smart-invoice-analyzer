import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: string | null;
  userName: string | null;
  
}

const initialState: AuthState = {
  userName: localStorage.getItem('userName'),
  user: localStorage.getItem('user'),
 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string, name: string}>) => {
      state.user = action.payload.email;
      state.userName = action.payload.name;
      localStorage.setItem('user', action.payload.email);
      localStorage.setItem('userName', action.payload.name);
    },
    logout: (state) => {
      state.user = null;
      state.userName = null;
      localStorage.removeItem('user');
      localStorage.removeItem('userName');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
