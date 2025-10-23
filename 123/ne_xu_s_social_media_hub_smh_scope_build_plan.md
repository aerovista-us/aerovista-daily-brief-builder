# NeXuS + Social Media Hub (SMH) — Scope & Build Plan

_Last updated: 2025-10-22 (PT)_

## 0) Goals
- Stand up **SMH** inside the NeXuS environment with shared auth, data, and observability.
- Upgrade/standardize **databases + Prisma** for multi‑app use (Option A: `@av/data`).
- Identify and uplift **shared services** to support SMH (tokens, storage, queueing, alerts).
- Deliver phased, testable increments with clear acceptance criteria.

---

## 1) Current State (short)
- **Auth/Admin app** (Next.js + NextAuth + Prisma) running locally; DB connection in flux.
- **SQLite** local DBs powering NeXuS content search (FTS5) and Music library.
- **PostgreSQL** planned as centralized “Nexus” DB but needs standardization (roles, schema, pooling).

---

## 2) Target Architecture (high level)
**Frontend:** Next.js (App Router) + Tailwind + shadcn (admin UI)

**Backend services:**
- **Core API** (FastAPI): SMH Publisher, Token Manager, Webhooks, Analytics collectors
- **Data Gateway** (FastAPI): wraps local SQLite FTS (docs/music) with HTTP endpoints

**Data tier:**
- **PostgreSQL 16** (db: `nexus`, schema: `core`) via **PgBouncer**
- **SQLite** (docs/music) sidecar files with FTS5 + triggers (read via gateway)

**Infra add‑ons:** Traefik, Redis (queues), MinIO/S3 (media), n8n (orchestration), Loki+Grafana (logs), Prometheus (metrics), Uptime Kuma (synthetics), Authelia (SSO optional), Vault/Env (secrets).

---

## 3) Database & Prisma Upgrades
### 3.1 Postgres standardization
- **DB:** `nexus`; **schema:** `core`
- **Roles:** `nexus_app` (RW), `nexus_ro` (RO), `nexus_migrate` (migrations)
- **Pooling:** PgBouncer `POOL_MODE=transaction` (port 6432)
- **Backups:** nightly `pg_dump`, weekly base backups

### 3.2 `@av/data` (shared data package)
- Owns **`schema.prisma`**, migrations, and **singleton PrismaClient**
- Exports helpers: `prisma`, pagination utils, soft‑delete helpers, audit logger
- Only this package runs `prisma migrate deploy`

### 3.3 Initial models (core)
```prisma
model User { id String @id @default(cuid()); email String? @unique; name String?; passwordHash String?; role Role @default(USER); createdAt DateTime @default(now()); updatedAt DateTime @updatedAt; memberships Membership[] }
model Organization { id String @id @default(cuid()); name String; slug String @unique; memberships Membership[]; createdAt DateTime @default(now()); updatedAt DateTime @updatedAt }
model Membership { id String @id @default(cuid()); userId String; organizationId String; role OrgRole @default(VIEWER); user User @relation(fields:[userId], references:[id]); organization Organization @relation(fields:[organizationId], references:[id]); @@unique([userId, organizationId]) }

// Social Hub (SMH)
model SocialAccount { id String @id @default(cuid()); orgId String; platform Platform; externalId String; handle String?; meta Json?; createdAt DateTime @default(now()); updatedAt DateTime @updatedAt; organization Organization @relation(fields:[orgId], references:[id]); tokens OAuthToken[] }
model OAuthToken { id String @id @default(cuid()); accountId String; accessToken String; refreshToken String?; expiresAt DateTime?; scopes String[]; status TokenStatus @default(VALID); errorMsg String?; createdAt DateTime @default(now()); updatedAt DateTime @updatedAt; account SocialAccount @relation(fields:[accountId], references:[id]) }
model Campaign { id String @id @default(cuid()); orgId String; name String; notes String?; status CampaignStatus @default(DRAFT); budgetCents Int?; startAt DateTime?; endAt DateTime?; createdAt DateTime @default(now()); updatedAt DateTime @updatedAt; organization Organization @relation(fields:[orgId], references:[id]); posts CampaignPost[] }
model CampaignPost { id String @id @default(cuid()); campaignId String; platform Platform; text String; mediaUrl String?; publishAt DateTime; status PostStatus @default(SCHEDULED); result Json?; createdAt DateTime @default(now()); updatedAt DateTime @updatedAt; campaign Campaign @relation(fields:[campaignId], references:[id]) }
model AnalyticsMetric { id String @id @default(cuid()); postId String; platform Platform; impressions Int @default(0); clicks Int @default(0); likes Int @default(0); comments Int @default(0); shares Int @default(0); spendCents Int @default(0); capturedAt DateTime @default(now()); post CampaignPost @relation(fields:[postId], references:[id]) }

enum Role { USER ADMIN SUPERADMIN }
enum OrgRole { OWNER ADMIN EDITOR VIEWER }
enum Platform { LINKEDIN INSTAGRAM FACEBOOK YOUTUBE REDDIT X TIKTOK }
enum TokenStatus { VALID REFRESH_PENDING ERROR REVOKED }
enum CampaignStatus { DRAFT ACTIVE PAUSED COMPLETED }
enum PostStatus { SCHEDULED SENDING SENT FAILED CANCELED }
```

### 3.4 SQLite sidecars (unchanged API; safer access)
- **Docs:** `/srv/nexus/db/docs.sqlite` → served via Data Gateway endpoints `/docs`, `/search`
- **Music:** `/srv/nexus/db/music.sqlite` → endpoints `/music/search`, `/music/track/:id`
- Writes go through the gateway to keep FTS triggers consistent.

---

## 4) Shared Services to Upgrade/Expand
1. **Auth/SSO**: NextAuth base; add OAuth (Google/GitHub) + org invites; optional Authelia for SSO across services.
2. **Token Manager**: proactive refresh (48–72h window), reactive on 401/403, rotation handling, alerts.
3. **Queue/Workers**: Redis + worker container (Celery/RQ) for publish jobs + analytics polling.
4. **Object Storage**: MinIO/S3 for media (uploads, transformed assets) with signed URLs.
5. **Orchestration**: n8n for optional workflows (alerts, sheets sync, Slack/Email notifications).
6. **Observability**: Loki + Promtail, Grafana dashboards, Prometheus exporters, Uptime Kuma checks.
7. **Secrets**: .env → Docker secrets or Vault (min: docker secrets + rotate).
8. **Networking**: Traefik labels, TLS via Tailscale certs, service health routes.

---

## 5) SMH Build (phased)
### Phase A — Foundations (week 1)
- Create `@av/data` package; move models; wire PgBouncer; run migrations
- Data Gateway for SQLite (docs/music) read endpoints; basic CRUD for docs
- NextAuth app: org invites, roles UI, connect social accounts placeholder
- Token Manager API scaffolding (`/tokens`, `/tokens/refresh`)

**Acceptance:**
- Login → Dashboard works off Postgres `core`
- `GET /search?q=...` returns results from docs.sqlite; `POST /docs` inserts update FTS
- Token table visible; manual refresh endpoint returns updated expiry

### Phase B — Publisher & Calendar (week 2)
- Publisher API + job queue (Redis) for LinkedIn + Instagram (mock to start)
- Calendar view in dashboard; create/schedule `CampaignPost`
- Preflight checks (token validity; media pre-upload stub)

**Acceptance:**
- Schedule → job enqueued → mock publish → `status= SENT` with response IDs

### Phase C — Analytics & Alerts (week 3)
- Collect insights (impressions/likes/etc.) for LinkedIn/IG; write `AnalyticsMetric`
- Grafana dashboard + alerting; n8n fail alerts

**Acceptance:**
- Time‑series charts per platform; daily alert digest; failure pings

### Phase D — Hardening & Extras (week 4)
- Real platform adapters, rate-limit handling, error taxonomy
- Media pipeline (MinIO), signed URLs, thumbnailer
- RBAC enforcement across orgs; audit logs

**Acceptance:**
- Live posts to at least one real platform under a test org; clean rollbacks; audit trail

---

## 6) Deliverables
- `packages/data/` (schema, migrations, prisma client, helpers)
- `services/core-api/` (FastAPI: tokens, publisher, analytics, webhooks)
- `services/data-gateway/` (FastAPI: SQLite read/CRUD)
- `apps/admin/` (Next.js dashboard with login, orgs, calendar, tokens)
- `deploy/compose.yml` (Postgres + PgBouncer + Redis + MinIO + Traefik + Loki + Prom)
- Grafana dashboards JSON + Uptime Kuma checks

---

## 7) Security & Compliance
- Encrypt tokens at rest; never log raw tokens
- Rotate secrets; scope-permissions per platform
- RO vs RW DB roles; audit logs on sensitive mutations
- CSP, HTTPS everywhere (Tailscale certs acceptable internally)

---

## 8) Risks & Mitigations
- **Platform API changes** → Version adapters, feature-flags
- **Rate limits** → Queues + backoff; per‑platform caps; `Retry-After`
- **Token revocations** → Reauth flows; alerting; pause queues per account
- **SQLite lock contention** → Gateway single-writer model; WAL mode

---

## 9) Next 48h Checklist
- [ ] Stand up Postgres16 + PgBouncer on NXCore; create roles/schema
- [ ] Create `@av/data`; move NextAuth + SMH models; run `migrate deploy`
- [ ] Wire admin app to `@av/data` client; confirm auth works against `core`
- [ ] Spin up Data Gateway; verify `/search` hits docs.sqlite
- [ ] Stub Token Manager endpoints; dashboard page for tokens with status chips

---

## 10) Nice-to-haves (later)
- AI captioning/alt‑text suggester
- Sentiment summary on comments
- Budget pacing forecaster
- Team approvals workflow (draft → review → approved)

