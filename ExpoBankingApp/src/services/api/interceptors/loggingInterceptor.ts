import { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from '../../../utils/logger';

export const loggingRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  logger.api(`OUTBOUND ${config.method?.toUpperCase()} ${config.url}`, {
    params: config.params,
    headers: { ...config.headers },
  });
  return config;
};

export const loggingResponseInterceptor = (response: AxiosResponse) => {
  logger.api(`INBOUND ${response.status} ${response.config.url}`, {
    status: response.status,
    data: response.data,
  });
  return response;
};
