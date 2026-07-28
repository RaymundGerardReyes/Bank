export function generateCspHeader(nonce?: string): string {
  const scriptSrc = nonce ? `'self' 'nonce-${nonce}'` : "'self'";
  return [
    "default-src 'self'",
    `script-src ${scriptSrc} 'unsafe-inline'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' http://localhost:8085 https:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}
