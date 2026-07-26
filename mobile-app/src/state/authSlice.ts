import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../models/User';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  requiresOtp: boolean;
  isLocked: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  requiresOtp: false,
  isLocked: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<{ user: User }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.requiresOtp = false;
      state.isLocked = false;
    },
    setRequiresOtp: (state, action: PayloadAction<boolean>) => {
      state.requiresOtp = action.payload;
    },
    setLocked: (state, action: PayloadAction<boolean>) => {
      state.isLocked = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.requiresOtp = false;
      state.isLocked = false;
    },
  },
});

export const { setAuthenticated, setRequiresOtp, setLocked, logout } = authSlice.actions;
export default authSlice.reducer;
