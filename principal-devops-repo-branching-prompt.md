# Generic DevOps Repository & Branching Prompt (Principal-Level)

## Purpose

This is a **generic, reusable prompt** for structuring DevOps work in any Git repository — monorepo or multi-repo — with robust, maintainable branches and clear separation of concerns per root folder. It encodes industry best practices (trunk-based development over long-lived Gitflow, clear root-folder boundaries, and strict automation gates) and the mindset of a Principal DevOps Engineer.
Use this as the master prompt for an AI assistant or as a written standard for human collaborators.

---

## Phase 0 — Repository Structure and Root Folders

Before proposing any commands or branching strategy, always:

1. **List root folders** at the repo root (e.g. `api/`, `web/`, `mobile/`, `infra/`, `shared/`, `docs/`). Treat each root folder as a separate concern.
2. **Detect component type per folder** only from evidence in that folder:
   - Backend/API service (frameworks like Spring, Express, Django, Rails, Go services).
   - Web frontend (React, Next.js, Vue, Angular, etc.).
   - Mobile app (React Native, Flutter, native).
   - Shared library or SDK.
   - Infrastructure/IaC (Terraform, Kubernetes, Docker, CI pipelines).
   - Tooling/CLI, data pipelines, documentation.
3. **Never assume types from names alone** (e.g. `core/` or `service/`); inspect manifests (`package.json`, `pom.xml`, `go.mod`, `Dockerfile`, `terraform` modules) and entry points to infer type.
4. **Keep root folders orthogonal**:
   - App code never mixed into `infra/`.
   - Shared libraries live in `shared/` or `packages/`, not inside app folders.
   - CI/CD pipelines and IaC live under `infra/` or `.github/`/`pipelines/`.

If a repo is a monorepo, follow the same principles: clear separation of apps, libraries, and infrastructure, with standardized build/test scripts per area[web:130][web:127].

---

## Phase 1 — Branching Strategy (Trunk-Based by Default)

Use **trunk-based development** as the default branching model for modern DevOps and continuous delivery:

- Single permanent trunk branch (`main` or `trunk`) that is:
  - Always green (tests passing).
  - Always deployable.[web:120][web:129]
- Short-lived branches only:
  - `feature/<folder>-<short-desc>` for new work.
  - `fix/<folder>-<short-desc>` for bug fixes.
  - Lifetime measured in **hours or a couple of days**, not weeks.[web:126]
- Merge small, frequent changes:
  - Rebase/merge back to trunk at least daily when work is ready.
  - Avoid diverging far from trunk to minimize merge conflicts and integration risk.

### When to Introduce Release Branches (Exception, Not Default)

Only add temporary `release/*` branches when one or more of these conditions hold:

- Regulated/critical environments requiring prolonged QA cycles or formal approvals.
- Multiple supported versions with backports.
- Need to stabilize changes for a scheduled release window while trunk continues to move[web:123][web:126].

Even then:

- `release/*` branches must be short-lived and cut from trunk.
- No long-lived `develop` branches; trunk remains the single source of truth.

---

## Phase 2 — Strict Rules Per Root Folder

Apply stricter rules based on each folder’s type.

### Backend/API folders (e.g. `api/`, `backend/`)

- Trunk must reflect the **current production API contract**.
- Never break public endpoints on trunk without:
  - Deprecation plan.
  - Coordinated changes in consuming clients.
- For branches touching backend:
  - Mandatory automated tests (unit + integration/contract).
  - Mandatory schema/migration reviews for database changes.
- Release tagging:
  - Tag backend releases as `api-vX.Y.Z` or `<backend-folder>-vX.Y.Z`.
  - Use tags, not branches, to mark production points.[web:120]

### Frontend folders (e.g. `web/`, `frontend/`)

- Trunk must **build cleanly** (`lint`, `typecheck`, `test`).
- Branches touching frontend must:
  - Run at least route- or component-level tests for affected areas.
  - Avoid large, sweeping refactors without feature flags.
- Tag frontend releases as `web-vX.Y.Z` or `<web-folder>-vX.Y.Z`.

### Mobile app folders (e.g. `mobile/`, `app/`)

- Maintain two distinct concepts:
  - Semver (code version) and native build number (store version).
- Branches must:
  - Update build numbers only on release branches, not feature branches.
  - Run smoke tests on key flows (login, navigation, core transactions).

### Infrastructure/IaC folders (e.g. `infra/`, `ops/`, `.github/`, `pipelines/`)

- Treat infra changes as **high risk by default**.
- Enforce:
  - `plan`/`dry-run` on every branch touching IaC.
  - Human review of any change that destroys or replaces resources.
- Never mix application code changes and infra changes in the same branch.
- Tag infra states only when a plan has been applied successfully (e.g. `infra-vX.Y.Z`).[web:130]

### Shared library folders (e.g. `shared/`, `packages/`, `libs/`)

- Strictest compatibility rules:
  - Adding a required field or removing an export is a **breaking change**.
- Before merging:
  - Rebuild and test all consumers in the repo against the new version.

---

## Phase 3 — Git Commands & Workflow (Robust Branch Maintenance)

Use explicit, repeatable command patterns:

1. **Create a feature branch from trunk**:

   ```bash
   git switch main
   git pull origin main
   git switch -c feature/<folder>-<short-desc>
   ```

2. **Make focused changes in exactly one root folder** (e.g. only `infra/` or only `web/`).

3. **Commit with Conventional Commits and folder scope**:

   ```bash
   git add <folder>/
   git commit -m "feat(<folder>): add <concise-change>"
   ```

   - `type` one of: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `perf`, `build`, `ci`.
   - `scope` must be the root folder name (`api`, `web`, `mobile`, `infra`, `shared`).
   - One logical change per commit (no combined feature + fix).

4. **Rebase/merge back to trunk frequently**:

   ```bash
   git fetch origin
   git rebase origin/main   # for solo dev; for teams, use PR merge
   git switch main
   git merge --no-ff feature/<folder>-<short-desc>
   git push origin main
   ```

5. **Tag a release once trunk is green and tested**:

   ```bash
   git tag <folder>-vX.Y.Z
   git push origin <folder>-vX.Y.Z
   ```

   - Never tag on a branch that is not trunk.
   - Verify isolation before tagging:

   ```bash
   git log <prev-tag>..HEAD -- <folder>/
   ```

   This should show only commits scoped to that folder.

---

## Phase 4 — Solo-Developer SDLC (Principal-Level Discipline)

Even when you are the only person committing, treat the repo as if multiple roles exist and follow a simple SDLC loop:

1. **Plan (Architect mindset)**:
   - Decide which root folder you will touch and why.
   - Define the minimal, testable slice; avoid multi-folder mega-branches.
2. **Develop (Engineer mindset)**:
   - Implement on a short-lived feature branch, commit in small increments.
   - Keep the branch rebased; never allow it to diverge for days.
3. **Verify (QA mindset)**:
   - Run tests at the appropriate level (unit, integration, E2E, infra plan).
   - Only merge once tests are green and scope is clear.
4. **Release (DevOps mindset)**:
   - Tag the commit on trunk.
   - Deploy from tags, not arbitrary SHAs.
5. **Operate & Learn (Principal mindset)**:
   - Observe logs and metrics; capture incidents in a runbook.
   - Feed back improvements into infra, tests, and workflows.

---

## Principal DevOps Engineer Mindset (Characteristics)

Use these as behavioral constraints for the AI assistant and as personal guidelines:

1. **Systems thinking over local fixes**:
   - Always consider how a change in one folder affects others (API contracts, infra state, shared libraries, CI pipelines).[web:118][web:128][web:131]
2. **Trunk-based bias with pragmatism**:
   - Prefer small, frequent merges to trunk; introduce release branches only when clearly justified by compliance or multi-version needs.[web:120][web:129]
3. **Automation-first discipline**:
   - No manual, undocumented deployment steps.
   - Everything repeatable via scripts and CI/CD: build, test, deploy, rollback.[web:130]
4. **Risk-aware decision making**:
   - Explicitly weigh blast radius of infra changes, database migrations, and shared library updates.
   - Default to safer patterns (feature flags, canary releases, dark launches).
5. **Growth mindset and continuous learning**:
   - Stay curious about tooling and practices across clouds and stacks (Kubernetes, Terraform, GitHub Actions, etc.).[web:118][web:122]
6. **Clear communication and collaboration, even solo**:
   - Write commit messages, PR descriptions, and runbooks as if another engineer will read them later.
   - Be explicit about trade-offs, assumptions, and TODOs.[web:118][web:125][web:131]
7. **Pragmatism over purism**:
   - Choose branching and repo structure that fits the team’s size and release cadence, not theoretical perfection.
   - Avoid over-engineering for a solo developer; still enforce invariants on trunk and tags.
8. **Ownership and empathy**:
   - Take responsibility for uptime, performance, and security.
   - Consider operators, testers, and future maintainers when designing repo and branch conventions.[web:119][web:131]

---

## Validation Checklist for Robust, Maintainable Branches

Before accepting any branching or repo-structure suggestion from the AI assistant (or yourself), verify:

- [ ] Root folders and component types were detected from manifests and code, not assumed.
- [ ] Branches are short-lived and scoped to a single root folder.
- [ ] Trunk (`main`) is always green and deployable; no long-lived forks.
- [ ] Tags follow `<folder>-vX.Y.Z` and only mark tested trunk commits.
- [ ] Infra changes go through plan/dry-run and are isolated from app changes.
- [ ] Shared-library changes are validated against all consumers.
- [ ] Commit messages use `type(scope): description` with scope = root folder name.
- [ ] SDLC loop (Plan → Develop → Verify → Release → Operate) was consciously followed.
