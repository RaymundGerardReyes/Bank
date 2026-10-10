import { InternalAxiosRequestConfig } from 'axios';
import { tokenStorageService } from '../../auth/tokenStorageService';
import { HTTP_HEADERS } from '../../../utils/constants';

export const authInterceptor = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const token = await tokenStorageService.getAccessToken();
  if (token) {
    if (!config.headers[HTTP_HEADERS.AUTHORIZATION]) {
      config.headers[HTTP_HEADERS.AUTHORIZATION] = `Bearer ${token}`;
    }
    // Attach bank_session cookie to satisfy Next.js BFF proxy edge middleware
    if (!config.headers['Cookie']) {
      config.headers['Cookie'] = `bank_session=${token}`;
    }
  }
  return config;
};
