import { NativeModules, Platform } from 'react-native';

const DEFAULT_LAN_HOST = '10.0.0.35';
const secureUrlFallback = 'https://bank.raymundgerardestaca.dev/api/proxy';

function resolveRuntimeUrl(rawUrl: string): string {
  if (!rawUrl) return rawUrl;

  // Web platform runs directly in the host browser
  if (Platform.OS === 'web') {
    return rawUrl;
  }

  // Detect Metro bundler host from scriptURL if available
  let bundlerHost: string | null = null;
  try {
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    if (typeof scriptURL === 'string') {
      const match = scriptURL.match(/^https?:\/\/([^/:]+)/);
      if (match && match[1]) {
        const host = match[1];
        // If not localhost/127.0.0.1 and not an exp.direct tunnel, use the bundler host
        if (host !== 'localhost' && host !== '127.0.0.1' && !host.endsWith('.exp.direct')) {
          bundlerHost = host;
        }
      }
    }
  } catch {
    // Ignore runtime introspection errors
  }

  const targetHost = bundlerHost || DEFAULT_LAN_HOST;

  // Automatically rewrite loopback URLs to the reachable host on mobile devices
  if (rawUrl.includes('127.0.0.1') || rawUrl.includes('localhost')) {
    return rawUrl.replace('127.0.0.1', targetHost).replace('localhost', targetHost);
  }

  return rawUrl;
}

const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || secureUrlFallback;
const rawGatewayUrl = process.env.EXPO_PUBLIC_GATEWAY_URL || secureUrlFallback;

export const ENV = {
  API_BASE_URL: resolveRuntimeUrl(rawApiBaseUrl),
  GATEWAY_URL: resolveRuntimeUrl(rawGatewayUrl),
  CERTIFICATE_PIN_HASH: process.env.EXPO_PUBLIC_CERTIFICATE_PIN_HASH || '',
  AUTO_LOCK_TIMEOUT_MS: Number(process.env.EXPO_PUBLIC_AUTO_LOCK_TIMEOUT_MS) || 300000,
  ENABLE_SECURE_SCREEN: String(process.env.EXPO_PUBLIC_ENABLE_SECURE_SCREEN).includes('true'),
  ENABLE_ROOT_DETECTION: String(process.env.EXPO_PUBLIC_ENABLE_ROOT_DETECTION).includes('true'),
};

console.log('=== VERIFYING SANITIZED RUNTIME BASEURL ===');
console.log('Resolved Value:', ENV.API_BASE_URL);
console.log('===========================================');
