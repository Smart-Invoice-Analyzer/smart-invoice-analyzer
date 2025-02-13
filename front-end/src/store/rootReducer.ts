import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // authSlice dosyasını doğru yoldan import edin

const rootReducer = combineReducers({
  auth: authReducer, // auth dilimini ekleyin
});

export type RootState = ReturnType<typeof rootReducer>; // rootReducer'ın türünü export edebilirsiniz
export default rootReducer;
