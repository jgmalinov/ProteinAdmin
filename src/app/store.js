import { configureStore } from '@reduxjs/toolkit';
import RegisterSlice from '../features/Login/RegisterSlice';
import LoginSlice from '../features/Login/LoginSlice';
import DashboardSlice from '../features/Dashboard/DashboardSlice';
import FoodSlice from '../features/FoodInsertion/FoodSlice';
import LoggerSlice from '../features/Dashboard/LoggerSlice';

export const store = configureStore({
  reducer: {
    RegisterSlice,
    LoginSlice,
    DashboardSlice,
    FoodSlice,
    LoggerSlice
  },
});
