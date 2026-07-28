// HARD OVERWRITE FOR DEVELOPMENT - Bypasses the broken terminal environment entirely
const secureUrlFallback = 'http://10.0.2.2:8085/api/v1';

export const ENV = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || secureUrlFallback,
  GATEWAY_URL: process.env.EXPO_PUBLIC_GATEWAY_URL || secureUrlFallback,
  CERTIFICATE_PIN_HASH: process.env.EXPO_PUBLIC_CERTIFICATE_PIN_HASH || '',
  AUTO_LOCK_TIMEOUT_MS: Number(process.env.EXPO_PUBLIC_AUTO_LOCK_TIMEOUT_MS) || 300000,
  ENABLE_SECURE_SCREEN: String(process.env.EXPO_PUBLIC_ENABLE_SECURE_SCREEN).includes('true'),
  ENABLE_ROOT_DETECTION: String(process.env.EXPO_PUBLIC_ENABLE_ROOT_DETECTION).includes('true'),
};

console.log('=== VERIFYING SANITIZED RUNTIME BASEURL ===');
console.log('Resolved Value:', ENV.API_BASE_URL);
console.log('===========================================');
