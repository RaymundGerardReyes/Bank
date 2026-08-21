export function generateCspHeader(nonce?: string): string {
  const scriptSrc = nonce ? `'self' 'nonce-${nonce}'` : "'self'";
  const platformDomain = process.env.PLATFORM_DOMAIN || process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || "";
  
  const domainConnectHttps = platformDomain ? `https://${platformDomain}` : "";
  const domainConnectHttp = platformDomain ? `http://${platformDomain}` : "";

  return [
    "default-src 'self'",
    `script-src ${scriptSrc} 'unsafe-inline' 'unsafe-eval'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: http:",
    `connect-src 'self' wss: ws: https: http: ${domainConnectHttps} ${domainConnectHttp} *`,
    "font-src 'self' data: https: http:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].filter(Boolean).join("; ");
}
