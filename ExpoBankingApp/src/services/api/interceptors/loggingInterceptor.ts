import { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from '../../../utils/logger';

export const loggingRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const headers = typeof (config.headers as any)?.toJSON === 'function'
    ? (config.headers as any).toJSON()
    : { ...config.headers };
  logger.api(`OUTBOUND ${config.method?.toUpperCase()} ${config.url}`, {
    params: config.params,
    headers,
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
