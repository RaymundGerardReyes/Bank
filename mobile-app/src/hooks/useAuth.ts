import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../state/store';
import { authService } from '../services/auth/authService';
import { setAuthenticated, logout as logoutAction } from '../state/authSlice';
import { User } from '../models/User';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, isLocked, requiresOtp } = useSelector((state: RootState) => state.auth);

  const login = async (username: string, passwordHash: string) => {
    const data = await authService.login(username, passwordHash);
    dispatch(setAuthenticated({ user: data.user }));
    return data;
  };

  const logout = async () => {
    await authService.logout();
    dispatch(logoutAction());
  };

  return {
    isAuthenticated,
    user,
    isLocked,
    requiresOtp,
    login,
    logout,
  };
};
