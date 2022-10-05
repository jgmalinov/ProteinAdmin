import { configureStore } from '@reduxjs/toolkit';
import RegisterSlice from '../features/Login/RegisterSlice';


export const store = configureStore({
  reducer: {
    RegisterSlice
  },
});
