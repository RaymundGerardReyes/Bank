# Legacy NovaBank Checkout — Comprehensive Root-Cause Reanalysis and Refactor Plan

## 1. Actual Root Cause
The `ERR_INVALID_RESPONSE` (and the `404 Not Found` with `upstream_addr="-"`) is caused by a **Host header mismatch between the Cloudflare Tunnel ingress and the Nginx virtual host `server_name`**. 

When Nginx receives a request with a `Host` header that does not exactly match any `server_name` in its configuration, it routes the request to the `default_server` block. The default server block in `nginx.conf` explicitly executes:
```nginx
return 404 "Nginx Gateway: Host header mismatch. Please verify that your .env domains match the requested URL.";
```
Because the 404 is generated locally by a `return` directive, Nginx does not attempt to proxy the request. This perfectly explains the Nginx access log: `status=404` and `upstream_addr="-"`.

## 2. Evidence Proving It
- **The internal `wget` test:** `wget -S -O- --header="Host: pay.novabank.ph" http://127.0.0.1/checkout/...` returns 404 inside the container. This isolates the failure to Nginx's virtual host selection.
- **The Access Log:** `status=404` with `upstream_addr="-"` proves Nginx intercepted the request locally and never executed a `proxy_pass`.
- **The Decrypted Host Variable:** Your local tests using `pay.raymundgerardestaca.dev` reveal that the actual decrypted value of `${PAYMENT_WEBHOOK_HOST}` at runtime is likely *not* `pay.novabank.ph`. Therefore, Nginx is bound to `pay.raymundgerardestaca.dev`, and a request for `pay.novabank.ph` falls through to the 404 default server.

## 3. Why the Previous Fixes Failed
Previous fixes assumed the Nginx routing was working and focused on downstream issues:
- **Cloudflare HTTP/2 vs QUIC:** Tunnel protocol issues were blamed, but Cloudflare was correctly delivering traffic to Nginx.
- **BFF / API Routing:** We tried to fix `checkoutService.ts` and add `/api/proxy/` routes to Nginx. While these bugs (like the double `/v1/v1/` prefix) were real, they were *Stage 2* issues. The browser could never reach Stage 2 because the *Stage 1* HTML document fetch was being rejected by Nginx with a 404.

## 4. Which Previous Assumptions Were Wrong
- **Assumption:** Nginx was correctly routing traffic to Next.js. **Reality:** The traffic hit the default server block and died immediately.
- **Assumption:** Port 8080 was Nginx or Next.js. **Reality:** Port 8080 (`curl http://127.0.0.1:8080`) hit an entirely different service (like the backend container which might be fronted by an Apache proxy or Tomcat).
- **Assumption:** Nginx was returning 404 because Next.js returned 404. **Reality:** If Next.js returned 404, `upstream_addr` would have contained the Next.js container IP.

## 5. Correct End-to-End Request Flow
**Stage 1: Document Request**
1. **Browser** -> `https://pay.novabank.ph/checkout/pi_123`
2. **Cloudflare Edge** -> Routes via Cloudflare Tunnel.
3. **cloudflared** -> Forwards to `http://banking_gateway:80` with `Host: pay.novabank.ph`.
4. **banking_gateway (Nginx)** -> Matches `server_name pay.novabank.ph;`.
5. **Nginx** -> Matches `location ^~ /checkout/` -> Executes `proxy_pass http://nextjs;`.
6. **Next.js (web-app:3000)** -> Renders `/checkout/[sessionId]/page.tsx` -> Returns HTTP 200 containing `CheckoutOrchestrator`.

**Stage 2: Client-Side Hydration & API Call**
7. **Browser (CheckoutOrchestrator)** -> Makes fetch to `/checkout/sessions/pi_123` (or API).
8. **Nginx** -> Proxies API call directly to Spring Boot backend.
9. **Spring Boot (backend:8080)** -> Returns JSON state.

## 6. Exact Legacy Architectural Inconsistency
The architecture became overcomplicated by forcing the isolated, public checkout flow through the Next.js BFF (`/api/proxy/`). 
The BFF is designed for authenticated users (attaching HTTP-only cookies and internal API keys). The checkout page is a public payment link. Routing public unauthenticated checkout API calls through the BFF adds an unnecessary network hop and risks triggering Next.js middleware blocks (which we saw returning 401s or 404s).

## 7. Refactoring Strategy
We will implement a clean, direct routing architecture for the webhook/payment domain:
1. **Unify the Domain Variable:** Ensure the Nginx `server_name` explicitly binds to the actual Cloudflare hostname (no `.env` decryption mismatches).
2. **Bypass the BFF for Checkout:** The Next.js checkout page will call the Spring Boot API directly via Nginx.
3. **Nginx Consolidation:** The `pay.novabank.ph` server block will act purely as an API gateway for payments and a UI proxy for Next.js isolated to `/checkout/`.

## 8. Files/Configuration That Must Change
1. **`infra/nginx/nginx.conf`**:
   - Refine the webhook server block.
   - Map `location /api/v1/checkout/` directly to `http://springboot`.
   - Ensure the server block strictly binds to the correct webhook host.
2. **`web-app/src/services/checkout/checkoutService.ts`**:
   - Change `httpClient.get` calls to explicitly use `/api/v1/checkout/sessions/...` to hit Nginx directly, bypassing the Next.js BFF. (I have already partially applied this fix in a previous step, but we must ensure it bypasses the `/api/proxy/` logic in `httpClient`).

## 9. Files/Configuration That Should NOT Be Changed
- **`compose.yaml`**: The Cloudflare Tunnel mapping (`http://banking_gateway:80`) is correct and should not be modified.
- **Spring Boot Controllers**: The backend endpoints (`CheckoutSessionController`) are correct.
- **Next.js Middleware**: Do not touch `middleware.ts`; bypassing the BFF avoids all middleware complexity naturally.

## 10. Validation Plan
1. Restart the Nginx container and verify the running template output.
2. Execute the exact curl test locally: `curl -H "Host: pay.novabank.ph" http://localhost/checkout/<sessionId>` -> Expect `HTTP 200`.
3. Verify the browser Network tab shows the API call reaching `/api/v1/checkout/sessions/<sessionId>` and returning JSON.

## 11. Expected Result After Refactor
Opening `https://pay.novabank.ph/checkout/<sessionId>` will instantly load the Next.js UI (HTTP 200). The React application will then fetch session details directly from the Spring Boot API, rendering the secure checkout interface without 404s, 502s, or double `/v1/v1/` prefix errors.

---
> [!IMPORTANT]
> **User Review Required**
> Do you approve this architectural re-alignment? Once approved, I will implement the Nginx config cleanup and ensure the `checkoutService.ts` API calls bypass the Next.js BFF layer completely.
