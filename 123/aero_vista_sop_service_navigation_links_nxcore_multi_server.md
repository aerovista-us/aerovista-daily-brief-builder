# AeroVista SOP — Service Navigation & Links (NXCore & Multi‑Server)

**SOP ID:** AV‑SOP‑NAV‑001
**Owner:** Nexus TechWorks (Platform / Infra)
**Effective Date:** 2025‑10‑14
**Review Cadence:** Quarterly (Jan/Apr/Jul/Oct) or after any major infra change
**Applies To:** NXCore and any AeroVista‑managed servers/services (on‑prem, Tailscale, cloud)

---

## 1) Purpose

Define a consistent, secure, and scalable method to inventory, route, and present links/navigation for all AeroVista services across one or more servers. Treat navigation as infrastructure so humans always land on the correct, secure, canonical URL with minimal friction.

## 2) Scope

- Reverse proxy & routing (Traefik‑based)
- DNS & URL conventions (internal + public
- Human‑facing Hub page and Service Registry
- Status/observability link integration
- Security (TLS, SSO, ACLs)
- Lifecycle (add/change/deprecate)
- Audits & maintenance

## 3) Principles

1. **One canonical URL per service.** All other hosts/paths 301 → canonical.
2. **Subdomain‑per‑service.** Don’t mix styles. Prefer `service.domain` over deep paths.
3. **Proxy owns the edge.** Only reverse proxy exposes 80/443; containers stay private.
4. **SSO everywhere.** Role‑aware navigation; admin surfaces never public.
5. **Single Source of Truth.** Service Registry drives the Hub, Status, and docs links.
6. **Observable by default.** Every service has a health endpoint wired to monitoring.

## 4) Roles & Responsibilities

- **Platform (Nexus TechWorks):** Owns Traefik, DNS, certs, Service Registry, Hub build, status wiring.
- **Service Owners (Divisions):** Keep entries accurate (purpose, owner, audience), expose `/healthz`, maintain runbooks.
- **Security:** Enforces TLS/SSO/HSTS, Tailscale ACLs, review of admin surface exposure.
- **Ops:** Runs quarterly Nav Audit, executes deprecations/redirects, validates bookmarks and links.

## 5) Environments & URL Conventions

### 5.1 Internal (Tailscale / LAN)

- Pattern: `*.aerovista.local` and/or `*.ts.net` (tailnet).
- Examples: `files.aerovista.local`, `n8n.aerovista.local`, `portainer.aerovista.local`.

### 5.2 Public

- Pattern: `*.aerovista.us` (or approved customer domain).
- Mirror names between internal and public where read‑only mirrors are needed. **Never expose admin UIs publicly.**

### 5.3 Naming Rules

- Use short, functional names (e.g., `files`, `n8n`, `status`, `docs`, `rydesync`).
- Avoid environment suffixes in hostnames; route by DNS/segment.
- Reserve `status.*` for uptime pages only.

## 6) Reverse Proxy Reference (Traefik)

### 6.1 Standard Labels Template

```yaml
# docker-compose service example
services:
  filebrowser:
    image: filebrowser/filebrowser:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.files.rule=Host(`files.aerovista.local`)"
      - "traefik.http.routers.files.entrypoints=websecure"
      - "traefik.http.routers.files.tls=true"
      - "traefik.http.services.files.loadbalancer.server.port=80"
      # Canonical host enforcement (optional)
      - "traefik.http.middlewares.files-redirect.redirectregex.regex=^https?://[^/]+/(.*)"
      - "traefik.http.middlewares.files-redirect.redirectregex.replacement=https://files.aerovista.local/$$1"
      - "traefik.http.routers.files.middlewares=files-redirect"
```

### 6.2 Edge Rules

- Only Traefik publishes 80/443.
- One router per hostname; avoid regex unless required.
- Attach middlewares for HSTS, security headers, and canonical redirects.
- Maintain ACME/CertResolver config for TLS; prefer wildcard certs where appropriate.

## 7) Service Registry (Single Source of Truth)

- Location (example): `/srv/core/landing/service-registry.json` (served by proxy/Hub).
- Used by: Hub page, Status page mapping, internal docs.

### 7.1 JSON Schema (reference)

```json
[
  {
    "id": "filebrowser",
    "name": "Files",
    "category": "Pinned",      
    "audience": "staff",       
    "url": "https://files.aerovista.local",
    "health": "https://files.aerovista.local/healthz",
    "owner": "Nexus",
    "status": "prod",          
    "lifecycle": "active",     
    "updated_at": "2025-10-14T08:00:00Z",
    "notes": "Primary file UI"
  }
]
```

### 7.2 Required Fields

- `id`, `name`, `url`, `owner`, `audience` (public/staff/admin), `status` (alpha/beta/prod/deprecated), `health` (if available), `lifecycle` (active/deprecating/deprecated).

### 7.3 Governance

- Changes via PR to infra repo; CI validates schema and rebuilds Hub.
- Every service owner must update `updated_at` on change.

## 8) Hub Page (Human Navigation)

- Hostname: `hub.aerovista.local` (or intranet root).
- Sections: **Pinned**, **By Division**, **Admin** (role‑gated), **Docs & Playbooks**, **Recent/Changed**.
- Each card shows: Name, 1‑line purpose, **canonical URL**, status pill (UP/DEGRADED), quick menu (Docs • Health • Owner).
- Dark mode by default; keyboard search/filter.
- Hub fetches `service-registry.json` and renders dynamically; no hardcoded URLs.

## 9) Status & Observability

- Uptime page: `status.aerovista.local` (e.g., Uptime‑Kuma/Healthchecks).
- Map services 1:1 with Registry `id` and `name`.
- Alerts link to the corresponding Hub card and runbook.
- Central logs (e.g., Loki/Grafana) exposed as `logs.aerovista.local` (staff‑only).

## 10) Security & SSO

- Enforce TLS, HSTS, modern ciphers.
- Implement SSO (OIDC via Authentik/Keycloak/Cloud IdP) with role claims consumed by Traefik.
- Admin surfaces gated by **network (Tailscale ACLs) + SSO + optional IP allowlist**.
- Align cookie domains with hostnames to prevent login loops.
- **Never public‑expose** admin UIs (Portainer, Traefik, n8n admin, etc.).

## 11) Procedures (Checklists)

### 11.1 Add a New Service

1. **Choose hostname** (`shortname.aerovista.local`).
2. **Expose health check** at `/healthz`.
3. **Add Traefik labels** (router, service port, TLS, middlewares).
4. **Add Service Registry entry** (all required fields).
5. **Wire status monitor** (map to Registry `id`).
6. **SSO / ACLs**: assign roles, verify least privilege.
7. **Test canonical redirects** from any non‑canonical access.
8. **PR + CI**: validate, deploy, confirm Hub shows card.
9. **Announce** in release notes/runbook if user‑facing.

### 11.2 Change a Service URL or Port

1. Update Traefik labels; apply 301 from old host/path → new canonical.
2. Update DNS if hostname changes.
3. Update Service Registry `url`, `updated_at`, and notes.
4. Update Status mapping and runbooks.
5. Validate bookmarks via click‑through (QA).
6. Announce change window + completion.

### 11.3 Deprecate/Retire a Service

1. Set `status: deprecated`, `lifecycle: deprecating`, add **sunset date**.
2. Place banner on Hub card; keep 301 to replacement where applicable.
3. After sunset: flip `lifecycle: deprecated`, keep 301 in place for 90 days, then remove.
4. Archive logs, backups, runbooks; close monitors.

### 11.4 Quarterly Navigation Audit

**Inventory** (export Registry + auto‑discover via Traefik/Docker):

- Service name, purpose, audience, owner, uptime SLO.
- Host → protocol → port → path → **canonical URL**.
- Health endpoint, docs link, backup location, lifecycle tag.

**Hygiene Checks**

- One canonical URL per service; all others 301.
- Valid TLS certs + HSTS; modern ciphers.
- SSO works; admin UIs are internal‑only.
- Health endpoints respond and are monitored.
- Registry entries present and current (timestamps).
- Label consistency; no shadow ports exposed.

**Outputs**

- Audit report with **Fix List** (owners + due dates).
- Updated Registry; PRs merged.

### 11.5 Emergency Link Fix (Break/Fix)

1. Post incident in Ops channel; assign Incident Lead.
2. If routing is broken, temporarily publish **read‑only notice** at affected host with link to fallback.
3. Verify Traefik rules and certs; roll back last change if needed.
4. Update Registry and Status to reflect incident.
5. RCA within 48 hours; add test to prevent recurrence.

## 12) Acceptance Criteria (Done‑Definition)

- Service is reachable only via its **canonical URL** over HTTPS.
- Hub card appears with correct metadata and health.
- Status monitor green; alerts route to owner runbook.
- Admin surfaces are **not publicly accessible**.
- Registry PR merged; docs updated.

## 13) Artifacts & Locations

- **Traefik config & labels:** `infra/compose/*.yml`
- **Service Registry:** `/srv/core/landing/service-registry.json` (source of truth in repo)
- **Hub page assets:** `/srv/core/landing/`
- **Status monitor:** `status.aerovista.local`
- **Runbooks:** `docs/runbooks/<service>.md`

## 14) Change Management

- All changes via PR with reviewer from Platform + Security for admin‑facing services.
- Version this SOP; record deltas in **Changelog**.

## 15) Changelog

- **v1.0 (2025‑10‑14):** Initial SOP established (subdomain‑per‑service, Registry‑driven Hub, quarterly audit).

---

### Appendices

**A) Minimal Registry Seed (example)**

```json
[
  {"id":"files","name":"Files","category":"Pinned","audience":"staff","url":"https://files.aerovista.local","health":"https://files.aerovista.local/healthz","owner":"Nexus","status":"prod","lifecycle":"active"},
  {"id":"n8n","name":"Workflows","category":"Pinned","audience":"staff","url":"https://n8n.aerovista.local","health":"https://n8n.aerovista.local/healthz","owner":"Nexus","status":"beta","lifecycle":"active"},
  {"id":"status","name":"Status","category":"Pinned","audience":"public","url":"https://status.aerovista.local","owner":"Nexus","status":"prod","lifecycle":"active"},
  {"id":"docs","name":"Docs & Playbooks","category":"Docs","audience":"staff","url":"https://docs.aerovista.local","owner":"Nexus","status":"prod","lifecycle":"active"}
]
```

**B) Security Header Middleware (Traefik snippet)**

```yaml
labels:
  - "traefik.http.middlewares.sec-headers.headers.stsSeconds=31536000"
  - "traefik.http.middlewares.sec-headers.headers.stsIncludeSubdomains=true"
  - "traefik.http.middlewares.sec-headers.headers.stsPreload=true"
  - "traefik.http.middlewares.sec-headers.headers.contentTypeNosniff=true"
  - "traefik.http.middlewares.sec-headers.headers.browserXssFilter=true"
  - "traefik.http.routers.files.middlewares=files-redirect,sec-headers"
```

**C) Hub Build Contract**

- Fetch `/service-registry.json` → render cards with filters/search.
- Status pill derives from live health checks or last probe.
- Respect user roles (SSO claims) to show/hide Admin section.
- Provide deep links: Docs • Health • Owner contact.
