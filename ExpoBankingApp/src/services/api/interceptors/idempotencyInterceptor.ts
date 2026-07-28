import { InternalAxiosRequestConfig } from 'axios';
import { generateUUID } from '../../../utils/formatters';
import { HTTP_HEADERS } from '../../../utils/constants';

const IDEMPOTENT_METHODS = ['POST', 'PUT'];
const MONEY_MOVEMENT_PATHS = ['/transfers/internal', '/transactions/deposit', '/transactions/withdraw', '/transactions/external-payment'];

export const idempotencyInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const method = config.method?.toUpperCase() || '';
  const url = config.url || '';

  if (IDEMPOTENT_METHODS.includes(method) && MONEY_MOVEMENT_PATHS.some((path) => url.includes(path))) {
    if (!config.headers[HTTP_HEADERS.IDEMPOTENCY_KEY]) {
      config.headers[HTTP_HEADERS.IDEMPOTENCY_KEY] = generateUUID();
    }
  }
  return config;
};
