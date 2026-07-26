import { InternalAxiosRequestConfig } from 'axios';
import { tokenStorageService } from '../../auth/tokenStorageService';
import { HTTP_HEADERS } from '../../../utils/constants';

export const authInterceptor = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const token = await tokenStorageService.getAccessToken();
  if (token && !config.headers[HTTP_HEADERS.AUTHORIZATION]) {
    config.headers[HTTP_HEADERS.AUTHORIZATION] = `Bearer ${token}`;
  }
  return config;
};
