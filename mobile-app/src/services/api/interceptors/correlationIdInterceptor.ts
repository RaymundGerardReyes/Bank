import { InternalAxiosRequestConfig } from 'axios';
import { generateUUID } from '../../../utils/formatters';
import { HTTP_HEADERS } from '../../../utils/constants';

export const correlationIdInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (!config.headers[HTTP_HEADERS.CORRELATION_ID]) {
    config.headers[HTTP_HEADERS.CORRELATION_ID] = generateUUID();
  }
  return config;
};
