import { STORAGE_KEYS } from '../../utils/constants';

// Simulated Keychain/Keystore secure storage for tokens
let inMemoryAccessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;

export const tokenStorageService = {
  saveTokens: async (accessToken: string, refreshToken: string): Promise<void> => {
    inMemoryAccessToken = accessToken;
    inMemoryRefreshToken = refreshToken;
    // In production React Native bare workflow, use react-native-keychain
  },
  getAccessToken: async (): Promise<string | null> => {
    return inMemoryAccessToken;
  },
  getRefreshToken: async (): Promise<string | null> => {
    return inMemoryRefreshToken;
  },
  clearTokens: async (): Promise<void> => {
    inMemoryAccessToken = null;
    inMemoryRefreshToken = null;
  },
};
