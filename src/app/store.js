import { configureStore } from '@reduxjs/toolkit'
import AuthSlice  from '../slices/authSlice'
export const store = configureStore({
  reducer: {
    auth:AuthSlice,
  },
})