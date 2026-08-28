2026-08-28 12:57:21.474 | 2026-08-28T04:57:21Z INF Starting tunnel tunnelID=ee9afd78-3f61-410e-b26e-4031b81917d6
2026-08-28 12:57:21.474 | 2026-08-28T04:57:21Z INF Version 2026.7.3 (Checksum b3416ec0180fabfc307622bd041a6d6039f268f40d84e99e352fc0633bc1bca8)
2026-08-28 12:57:21.474 | 2026-08-28T04:57:21Z INF GOOS: linux, GOVersion: go1.26.4, GoArch: amd64
2026-08-28 12:57:21.474 | 2026-08-28T04:57:21Z INF Settings: map[grace-period:15s no-autoupdate:true retries:5]
2026-08-28 12:57:21.474 | 2026-08-28T04:57:21Z INF Environmental variables map[TUNNEL_EDGE_BIND_ADDRESS:0.0.0.0 TUNNEL_TOKEN:***** TUNNEL_TRANSPORT_PROTOCOL:http2]
2026-08-28 12:57:21.604 | 2026-08-28T04:57:21Z INF Generated Connector ID: 0443029e-065a-4e63-bf91-91f35758061a
2026-08-28 12:57:21.712 | 2026-08-28T04:57:21Z INF Initial protocol http2
2026-08-28 12:57:21.728 | 2026-08-28T04:57:21Z INF ICMP proxy will use 182.14.14.1 as source for IPv4
2026-08-28 12:57:21.728 | 2026-08-28T04:57:21Z INF ICMP proxy will use ::1 in zone lo as source for IPv6
2026-08-28 12:57:22.121 | 2026/08/28 04:57:22 failed to sufficiently increase receive buffer size (was: 208 kiB, wanted: 7168 kiB, got: 416 kiB). See https://github.com/quic-go/quic-go/wiki/UDP-Buffer-Sizes for details.
2026-08-28 12:57:22.129 | 2026-08-28T04:57:22Z INF ICMP proxy will use 182.14.14.1 as source for IPv4
2026-08-28 12:57:22.129 | 2026-08-28T04:57:22Z INF ICMP proxy will use ::1 in zone lo as source for IPv6
2026-08-28 12:57:22.130 | 2026-08-28T04:57:22Z INF Starting metrics server on [::]:20241/metrics
2026-08-28 12:57:22.596 | 2026-08-28T04:57:22Z INF Tunnel connection curve preferences: [X25519MLKEM768 CurveID(65074) CurveP256] connIndex=0 event=0 ip=198.41.200.193
2026-08-28 12:57:23.716 | 2026-08-28T04:57:23Z INF Registered tunnel connection connIndex=0 connection=5f94f364-66c8-445a-b002-c05e26f9fe8f event=0 ip=198.41.200.193 location=hkg08 protocol=http2
2026-08-28 12:57:23.716 | 2026-08-28T04:57:23Z INF Tunnel connection curve preferences: [X25519MLKEM768 CurveID(65074) CurveP256] connIndex=1 event=0 ip=198.41.192.7
2026-08-28 12:57:23.721 | 2026-08-28T04:57:23Z INF Updated to new configuration config="{\"ingress\":[{\"hostname\":\"novabank.dev.ph\", \"id\":\"1\", \"originRequest\":{}, \"service\":\"http://banking_gateway:80\"}, {\"hostname\":\"socanalyst.developerph.dev\", \"id\":\"0\", \"service\":\"http://soc-nginx-proxy:80\"}, {\"hostname\":\"pay.novabank.dev.ph\", \"originRequest\":{}, \"service\":\"http://banking_gateway:80\"}, {\"hostname\":\"api.novabank.dev.ph\", \"originRequest\":{}, \"service\":\"http://banking_gateway:80\"}, {\"service\":\"http_status:404\"}], \"warp-routing\":{\"enabled\":false}}" version=32
2026-08-28 12:57:24.162 | 2026-08-28T04:57:24Z INF Registered tunnel connection connIndex=1 connection=2270fe36-ccfd-4a6f-8ec0-c4f42d1c8a91 event=0 ip=198.41.192.7 location=mnl10 protocol=http2
2026-08-28 12:57:24.717 | 2026-08-28T04:57:24Z INF Tunnel connection curve preferences: [X25519MLKEM768 CurveID(65074) CurveP256] connIndex=2 event=0 ip=198.41.192.67
2026-08-28 12:57:25.202 | 2026-08-28T04:57:25Z INF Registered tunnel connection connIndex=2 connection=3e067efe-5dae-4477-a461-87c2362116fd event=0 ip=198.41.192.67 location=mnl10 protocol=http2
2026-08-28 12:57:25.717 | 2026-08-28T04:57:25Z INF Tunnel connection curve preferences: [X25519MLKEM768 CurveID(65074) CurveP256] connIndex=3 event=0 ip=198.41.200.73
2026-08-28 12:57:26.699 | 2026-08-28T04:57:26Z INF Registered tunnel connection connIndex=3 connection=facef496-3b8d-40b5-a747-e748566b2e63 event=0 ip=198.41.200.73 location=sin15 protocol=http2
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF +--------------------------------------------------------------------------------------+
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF |                               CONNECTIVITY PRE-CHECKS                                |
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF +--------------------------------------------------------------------------------------+
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF |  COMPONENT         TARGET                     STATUS  DETAILS                        |
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF |  DNS Resolution    region1.v2.argotunnel.com  PASS    DNS Resolved successfully      |
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF |  DNS Resolution    region2.v2.argotunnel.com  PASS    DNS Resolved successfully      |
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF |  UDP Connectivity  region1.v2.argotunnel.com  PASS    QUIC connection successful     |
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF |  UDP Connectivity  region2.v2.argotunnel.com  PASS    QUIC connection successful     |
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF |  TCP Connectivity  region1.v2.argotunnel.com  PASS    HTTP/2 connection successful   |
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF |  TCP Connectivity  region2.v2.argotunnel.com  PASS    HTTP/2 connection successful   |
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF |  Cloudflare API    api.cloudflare.com:443     PASS    API is reachable               |
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF |                                                                                      |
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF |  SUMMARY: Environment is healthy. cloudflared will use 'http2' as primary protocol.  |
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF +--------------------------------------------------------------------------------------+
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF precheck component="DNS Resolution" details="DNS Resolved successfully" run_id=a43de58a-38cb-48b7-b3c5-329fcfb711a9 status=pass target=region1.v2.argotunnel.com
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF precheck component="DNS Resolution" details="DNS Resolved successfully" run_id=a43de58a-38cb-48b7-b3c5-329fcfb711a9 status=pass target=region2.v2.argotunnel.com
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF precheck component="UDP Connectivity" details="QUIC connection successful" run_id=a43de58a-38cb-48b7-b3c5-329fcfb711a9 status=pass target=region1.v2.argotunnel.com
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF precheck component="UDP Connectivity" details="QUIC connection successful" run_id=a43de58a-38cb-48b7-b3c5-329fcfb711a9 status=pass target=region2.v2.argotunnel.com
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF precheck component="TCP Connectivity" details="HTTP/2 connection successful" run_id=a43de58a-38cb-48b7-b3c5-329fcfb711a9 status=pass target=region1.v2.argotunnel.com
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF precheck component="TCP Connectivity" details="HTTP/2 connection successful" run_id=a43de58a-38cb-48b7-b3c5-329fcfb711a9 status=pass target=region2.v2.argotunnel.com
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF precheck component="Cloudflare API" details="API is reachable" run_id=a43de58a-38cb-48b7-b3c5-329fcfb711a9 status=pass target=api.cloudflare.com:443
2026-08-28 12:57:28.451 | 2026-08-28T04:57:28Z INF precheck complete hard_fail=false run_id=a43de58a-38cb-48b7-b3c5-329fcfb711a9 suggested_protocol=http2