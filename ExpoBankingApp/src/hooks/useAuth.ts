import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../state/store';
import { authService } from '../services/auth/authService';
import { faceAuthService } from '../services/auth/faceAuthService';
import { tokenStorageService } from '../services/auth/tokenStorageService';
import { pushNotificationService } from '../services/notification/pushNotificationService';
import { setAuthenticated, logout as logoutAction } from '../state/authSlice';
import { accountApi } from '../state/api/accountApi';
import { transactionApi } from '../state/api/transactionApi';
import { statementApi } from '../state/api/statementApi';
import { productApi } from '../state/api/productApi';
import { authApi } from '../state/api/authApi';
import { setAccounts, setSelectedAccount } from '../state/accountSlice';
import { setTransactions } from '../state/transactionSlice';
import { User } from '../models/User';

export const clearSessionCache = (dispatch: AppDispatch) => {
  dispatch(accountApi.util.resetApiState());
  dispatch(transactionApi.util.resetApiState());
  dispatch(statementApi.util.resetApiState());
  dispatch(productApi.util.resetApiState());
  dispatch(authApi.util.resetApiState());
  dispatch(setAccounts([]));
  dispatch(setSelectedAccount(''));
  dispatch(setTransactions([]));
};

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, isLocked, requiresOtp } = useSelector((state: RootState) => state.auth);

  const login = async (username: string, passwordHash: string) => {
    clearSessionCache(dispatch);
    const data = await authService.login(username, passwordHash);
    dispatch(setAuthenticated({ user: data.user }));
    return data;
  };

  const loginWithFace = async (
    embedding?: number[],
    email?: string,
    deviceProof?: { deviceId: string; challenge: string; signature: string }
  ) => {
    clearSessionCache(dispatch);
    const response = await faceAuthService.verifyFace(embedding, email, deviceProof);
    if (!response?.token || !response?.user) {
      throw new Error('Authentication failed: Missing token or user record in banking response.');
    }
    await tokenStorageService.saveTokens(response.token, response.refreshToken || '');
    const verifiedUser = response.user;
    if (verifiedUser?.email) {
      try {
        pushNotificationService.initialize(verifiedUser.email);
      } catch (e) {
        console.error('Failed to initialize STOMP WebSocket during Face ID login', e);
      }
    }
    dispatch(setAuthenticated({ user: verifiedUser }));
    return response;
  };

  const setAuthUser = (payload: { user: User }) => {
    clearSessionCache(dispatch);
    dispatch(setAuthenticated(payload));
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      await tokenStorageService.clearTokens();
      clearSessionCache(dispatch);
      dispatch(logoutAction());
    }
  };

  return {
    isAuthenticated,
    user,
    isLocked,
    requiresOtp,
    login,
    loginWithFace,
    logout,
    setAuthenticated: setAuthUser,
  };
};

