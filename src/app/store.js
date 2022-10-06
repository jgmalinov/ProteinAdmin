import { configureStore } from '@reduxjs/toolkit';
import RegisterSlice from '../features/Login/RegisterSlice';
import LoginSlice from '../features/Login/LoginSlice';


export const store = configureStore({
  reducer: {
    RegisterSlice,
    LoginSlice
  },
});
