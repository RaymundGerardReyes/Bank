type LogCategory = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'AUTH' | 'PAYMENT' | 'SECURITY' | 'API';

/**
 * Sanitizes log contexts to prevent leaking sensitive banking data in logs.
 */
const sanitizeContext = (data?: Record<string, unknown>): Record<string, unknown> | undefined => {
  if (!data) return undefined;
  const SENSITIVE_KEYS = ['password', 'pin', 'token', 'accessToken', 'refreshToken', 'cvv', 'accountNumber'];
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeContext(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const formatMessage = (category: LogCategory, message: string): string => {
  const timestamp = new Date().toISOString();
  return `[${category}] ${timestamp} - ${message}`;
};

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => {
    if (__DEV__) {
      console.log(formatMessage('DEBUG', message), sanitizeContext(context) || '');
    }
  },
  info: (message: string, context?: Record<string, unknown>) => {
    console.log(formatMessage('INFO', message), sanitizeContext(context) || '');
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(formatMessage('WARN', message), sanitizeContext(context) || '');
  },
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
    console.error(formatMessage('ERROR', message), error || '', sanitizeContext(context) || '');
  },
  auth: (message: string, context?: Record<string, unknown>) => {
    console.log(formatMessage('AUTH', message), sanitizeContext(context) || '');
  },
  payment: (message: string, context?: Record<string, unknown>) => {
    console.log(formatMessage('PAYMENT', message), sanitizeContext(context) || '');
  },
  security: (message: string, context?: Record<string, unknown>) => {
    console.warn(formatMessage('SECURITY', message), sanitizeContext(context) || '');
  },
  api: (message: string, context?: Record<string, unknown>) => {
    if (__DEV__) {
      console.log(formatMessage('API', message), sanitizeContext(context) || '');
    }
  },
};

