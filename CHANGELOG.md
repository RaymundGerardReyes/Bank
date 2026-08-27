# Changelog & Architecture Governance

All notable architectural shifts and third-party library constraints for the NovaBank platform are documented here.

## [2026-08-27] - API Documentation Hardening

### Pinned
- **Scalar API Reference Viewer**: Pinned to `@scalar/api-reference@1.62.0` in `ApiReferenceViewer.tsx`.

#### Reasoning (Version Governance)
The Scalar code generator relies on specific OpenAPI schema structures (`x-code-samples` injection, deep object unwrapping). Unpinned CDN links cause breaking UI and snippet generation changes if Scalar pushes updates to their standard renderer. 

By pinning to `1.62.0`, we guarantee that the `x-code-samples` (C#, Go, Python) implemented in `OpenApiConfig.java` will render stably for all developers. 

**Upgrade Process:**
Any upgrade to the Scalar CDN version must be tested locally against the `POST /api/v1/transfers/internal` endpoint to verify that custom snippets and environment variable interpolations (`API_BASE_URL` / `API_TOKEN`) remain intact.
