# Host Port Registry

This document serves as the central allocation registry for all Docker Compose projects running on this host infrastructure. It ensures every host-published port has a clear owner and prevents collision.

## Port Range Allocation Policy

- **8000–8099**: HTTP Application Gateways (e.g., Nginx, Traefik)
- **8100–8199**: Development / Staging Gateways
- **8200–8299**: Administrative / Debug Services (e.g., pgAdmin, Redis Insight)
- **8300–8399**: Reserved (Do not assign automatically)
- **Standard Ports**: (80, 443, 5432, 3000) are mapped based on protocol standard but should generally not be exposed on the host without proper abstraction.

## Final Port Inventory (Active & Reserved)

This table tracks explicit host-port ownership across all projects on this host. A deployment script (`check_port_collisions.sh`) checks this table before deployment.

| Host Port | Container Port | Project   | Service  | Visibility | Status   | Owner/Env Variable |
| --------- | -------------: | --------- | -------- | ---------- | -------- | ------------------ |
| 8080      |             80 | banking   | nginx    | External   | ACTIVE   | NGINX_HTTP_PORT    |
| 443       |            443 | banking   | nginx    | External   | ACTIVE   | NGINX_SSL_PORT     |
| 5435      |           5432 | banking   | database | Localhost  | ACTIVE   | DB_HOST_PORT       |
| 3001      |           3000 | banking   | web-app  | Localhost  | ACTIVE   | WEB_APP_DEBUG_PORT |
| 8086      |              - | banking   | backend  | Localhost  | ACTIVE   | PORT (Local Dev)   |
| 8083      |              - | -         | -        | -          | RESERVED | -                  |
| 8084      |              - | -         | -        | -          | RESERVED | -                  |

## Internal-Only Ports (NOT Host-Published)

These ports are intentionally kept off the host network and rely strictly on Docker's internal networking (`app-net`).

| Container Port | Project | Service | Host Published? | Justification | Env Variable / Reference |
| -------------: | ------- | ------- | --------------- | ------------- | ------------------------ |
|           8080 | banking | backend | NO              | Proxied via Nginx Gateway | BACKEND_UPSTREAM_PORT |
|           3000 | banking | web-app | NO/DEV ONLY     | Proxied via Nginx Gateway | - |
|           5432 | banking | database| NO/DEV ONLY     | Backend talks to DB internally | DB_PORT |

## External Dependencies (Not Managed by Compose)

| External Port | Service | Purpose | Env Variable |
| ------------: | ------- | ------- | ------------ |
|           587 | Google  | SMTP Mail Sending | MAIL_PORT |

## Collision Prevention Protocol

1. Check this registry to see if the port is `RESERVED` or `ACTIVE` by another project.
2. Check the host environment dynamically using `check_port_collisions.sh`.
3. If a collision occurs, DO NOT reassign randomly. Identify the owner, report the collision, and block deployment. Operator intervention is required.
