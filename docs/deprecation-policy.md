# API Deprecation Policy

1. **Versioning**: All APIs are prefixed with `/api/v1/`. Breaking changes require `/api/v2/`.
2. **Sunset Header**: Deprecated endpoints will return a `Sunset` HTTP header with a final termination date.
3. **Grace Period**: Clients will be given a minimum of 6 months to migrate to new endpoints.
