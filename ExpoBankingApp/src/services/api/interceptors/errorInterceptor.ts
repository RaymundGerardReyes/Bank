import { AxiosError } from 'axios';
import { logger } from '../../../utils/logger';

export const errorInterceptor = (error: AxiosError): Promise<never> => {
  if (error.response) {
    const url = error.config?.url || '';
    if (url.includes('/fx/rates') && error.response.status === 401) {
      logger.info(`[FX] Public FX rates fallback active (${url})`);
    } else {
      logger.error(`API Error ${error.response.status}: ${url}`, error.response.data);
    }
    if (error.response.status === 401) {
      // Trigger token refresh or logout if needed
    }
  } else if (error.request) {
    logger.error(
      `Network Error Diagnostic - Full Target Destination: [${error.config?.baseURL || ''}${error.config?.url || ''}]`,
      error.message
    );
  } else {
    logger.error('Client Error:', error.message);
  }
  return Promise.reject(error);
};
