
LOQ@RAYMUND-PC03 MINGW64 /d/Java/Bank (main)
$ docker run --rm --network container:banking_cloudflared_edge curlimages/curl:latest -v http://banking_gateway:80      
Unable to find image 'curlimages/curl:latest' locally
latest: Pulling from curlimages/curl
8015b0f4edbc: Pull complete
Digest: sha256:7c12af72ceb38b7432ab85e1a265cff6ae58e06f95539d539b654f2cfa64bb13
Status: Downloaded newer image for curlimages/curl:latest   
* Host banking_gateway:80 was resolved.
* IPv6: (none)
* IPv4: 172.22.0.4
*   Trying 172.22.0.4:80...
* Established connection to banking_gateway (172.22.0.4 port 80) from 172.22.0.3 port 46084
  % Total    % Received % Xferd  Average Speed  Time    Time    Time   Current
                                 Dload  Upload  Total   Spent   Left   Speed
  0      0   0      0   0      0      0      0              
                0* using HTTP/1.x
> GET / HTTP/1.1
> Host: banking_gateway
> User-Agent: curl/8.21.0
> Accept: */*
>
* Request completely sent off
< HTTP/1.1 200 OK
< Server: nginx
< Date: Fri, 21 Aug 2026 20:17:07 GMT
< Content-Type: text/html; charset=utf-8
< Content-Length: 21348
< Connection: keep-alive
< X-Frame-Options: DENY
< X-Content-Type-Options: nosniff
< Referrer-Policy: strict-origin-when-cross-origin
< Permissions-Policy: camera=(), microphone=(), geolocation=()
< Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
< Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
< x-nextjs-cache: HIT
< x-nextjs-prerender: 1
< x-nextjs-prerender: 1
< x-nextjs-stale-time: 300
< Cache-Control: s-maxage=31536000
< ETag: "k65deu4vcfggx"
< X-Frame-Options: SAMEORIGIN
< X-Content-Type-Options: nosniff
< Referrer-Policy: strict-origin
< Strict-Transport-Security: max-age=31536000; includeSubDomains
< Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://accounts.google.com https://static.cloudflareinsights.com https://cdn.jsdelivr.net; frame-src 'self' https://challenges.cloudflare.com https://accounts.google.com; style-src 'self' 'unsafe-inline' https://fonts.googlea***************ext-accent" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969****************1.81h3.461a1 1 0 00.95**************/2ktvxzb32wjug.js" id="_R_" async=""></script><script>(self.__next_f=self.__next_f||[]).push([0])</script><script>self.__next_f.push([1,"1:\"$Sreact.fragment\"\n2:I[27033,[\"/_next/static/chunks/31p2j85inabce.js\"],\"Providers\"]\n3:I[88825,[\"/_next/static/chunks/31p2j85inabce.js\"],\"default\"]\n4:I[33086,[\"/_next/static/chunks/31p2j85inabce.js\",\"/_next/static/chunks/20st_29tvwf8l.js\"],\"default\"]\n5:I[33739,[\"/_next/static/chunks/31p2j85inabce.js\"],\"default\"]\n6:I[86291,[\"/_next/static/chu*************[\"/_next/static/chunks/31p2j85inabce.js\"]***xt/static/chunks/206hvwsi612ew.js\"],\"default\"]\n:HL[\"/_next/static/chunks/1s_saaqcb8lp_.css\",\"style\"]\n0:{\"P\":null,\"c\":[\"\",\"\"],\"q\":\"\",\"i\":false,\"f\":[[[\"\",{\"children\":[\"__PAGE__\",{},\"$undefined\",\"$undefined\",4608]},\"$undefined\",\"$undefined\",4624],[[\"$\",\"$1\",\"c\",{\"children\":[[[\"$\",\"link\",\"0\",{\"rel\":\"stylesheet\",\"href\":\"/_next/static/chunks/1s_saaqcb8lp_.css\",\"precedence\":\"next\",\"crossOrigin\":\"$undefined\",\"nonce\":\"$undefined\"}],[\"$\",\"script\",\"script-0\",{\"src\":\"/_next/static/chunks/31p2j85inabce.js\",\"async\":true,\"nonce\":\"$undefined\"}]],[\"$\",\"html\",null,{\"lang\":\"en\",\"children\":[\"$\",\"body\",null,{**********icon.2pud9sv7r78hf.svg\",\"sizes\":\"any\",\"type\":\"image/svg+xml\"}],[\"$\",\"$L13\",\"3\",{}]]\n"])</script></body></html> 0                             
100  21348 100  21348   0      0  2.86M      0              
                0
* Connection #0 to host banking_gateway:80 left intact      

LOQ@RAYMUND-PC03 MINGW64 /d/Java/Bank (main)
$