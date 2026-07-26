# Incident Runbook

## Database Connection Failures
1. Check `docker-compose logs db`.
2. Verify connection limits in `application-prod.yml` (Hikari `maximum-pool-size: 50`).
3. Scale up read replicas if load is high.

## High Latency on API
1. Correlate logs using `X-Request-Id`.
2. Verify Nginx `access.log` to check if edge is queuing requests.
3. If CPU > 75%, verify HPA is spinning up new pods in Kubernetes.
