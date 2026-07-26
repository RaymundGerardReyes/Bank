import axios from 'axios';
import { ENV } from '../../config/env';
import { correlationIdInterceptor } from './interceptors/correlationIdInterceptor';
import { authInterceptor } from './interceptors/authInterceptor';
import { idempotencyInterceptor } from './interceptors/idempotencyInterceptor';
import { errorInterceptor } from './interceptors/errorInterceptor';

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(correlationIdInterceptor);
apiClient.interceptors.request.use(authInterceptor);
apiClient.interceptors.request.use(idempotencyInterceptor);
apiClient.interceptors.response.use((response) => response, errorInterceptor);
