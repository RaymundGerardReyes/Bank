import { AxiosError } from 'axios';
import { logger } from '../../../utils/logger';

export const errorInterceptor = (error: AxiosError): Promise<never> => {
  if (error.response) {
    logger.error(`API Error ${error.response.status}: ${error.config?.url}`, error.response.data);
    if (error.response.status === 401) {
      // Trigger token refresh or logout
    }
  } else if (error.request) {
    logger.error(`Network Error: ${error.config?.url}`, error.message);
  } else {
    logger.error('Client Error:', error.message);
  }
  return Promise.reject(error);
};
