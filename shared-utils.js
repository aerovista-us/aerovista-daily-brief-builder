// Shared utilities for AeroVista Daily Brief Builder
// Provides consistent data management across all interfaces

class AeroVistaDataManager {
  constructor() {
    this.storageKey = 'aerovista_daily_brief_v1';
    this.data = this.loadData();
    this.listeners = new Set();
  }

  // Load data from localStorage with fallback to default
  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load data from localStorage:', error);
    }
    
    return this.getDefaultData();
  }

  // Get default data structure
  getDefaultData() {
    return {
      tasks: [
        // ✅ COMPLETED (Week-to-Date)
        {
          id: 'cx-eom',
          title: 'CX Pulse — EOM deck & automated send',
          description: 'Delivered to stakeholders with automated Power Automate flow',
          priority: 'high',
          tags: ['time', 'money', 'unblock'],
          status: 'completed',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'sunsets',
          title: 'Sunsets page polish',
          description: 'Live with audio fallback, favicons/OG, updated message',
          priority: 'high',
          tags: ['time', 'money'],
          status: 'completed',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'nfl-weekly',
          title: 'NFL weekly drop',
          description: 'Shipped at 11:00 (Oct 2) with marketing materials',
          priority: 'high',
          tags: ['time', 'money'],
          status: 'completed',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'tv-acquisition',
          title: '82–85″ TV acquisition',
          description: 'Collected, transported, stored safely',
          priority: 'medium',
          tags: ['money'],
          status: 'completed',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'mikee-gray-site',
          title: 'Mikee Gray — Static Site Landing',
          description: 'Custom index.html landing with Tailwind, hero, about, video, sponsors, contact, footer',
          priority: 'high',
          tags: ['time', 'money'],
          status: 'completed',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'mikee-sponsors',
          title: 'Mikee Gray — Sponsor logos embedded',
          description: 'Real sponsor logos (Signal, Big Bear, Union Binding, Wend) linked to official websites',
          priority: 'high',
          tags: ['time', 'money'],
          status: 'completed',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'mikee-github',
          title: 'Mikee Gray — GitHub Pages deployment',
          description: 'Committed and pushed to aerovista-us/Mikee (master branch), GitHub Pages enabled',
          priority: 'high',
          tags: ['time', 'money'],
          status: 'completed',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'nxcore-phase-a',
          title: 'NXCore Phase A — Infrastructure Security',
          description: 'Firewall + Fail2ban enabled, all .env files encrypted with sops, TLS validation confirmed',
          priority: 'high',
          tags: ['time', 'unblock'],
          status: 'completed',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'nxcore-monitoring',
          title: 'NXCore Monitoring Stack Deployment',
          description: 'Prometheus + Loki + Grafana + Alertmanager deployed and reachable',
          priority: 'high',
          tags: ['time', 'unblock'],
          status: 'completed',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'echoverse-transfer-complete',
          title: 'EchoVerse Music Transfer — Complete',
          description: 'NXCore → Extreme SSD ingestion workflow complete, music safely replicated to /srv/media2/EchoVerse_Music',
          priority: 'medium',
          tags: ['time', 'money'],
          status: 'completed',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'moth-emporium-poc',
          title: 'Moth Emporium — Proof of Concept Storefront',
          description: 'Full Next.js + Tailwind storefront ready, including marketing and content-engine report',
          priority: 'medium',
          tags: ['money'],
          status: 'completed',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'avmini-prep',
          title: 'AVmini PC — Hardware Preparation',
          description: 'OptiPlex class collaborator node prepared, OS validated, firmware patched',
          priority: 'medium',
          tags: ['unblock'],
          status: 'completed',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        
        // ▶️ IN PROGRESS (Active)
        {
          id: 'pc-sop',
          title: 'Decommissioned PC — SOP & rebuild',
          description: 'Device connected. Kick off secure wipe, then prep clean OS installer',
          priority: 'high',
          tags: ['unblock'],
          status: 'in-progress',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'nxcore-phase-b',
          title: 'NXCore Phase B — System Enhancement',
          description: 'Observability dashboards under refinement; integrating REST API endpoints for health monitoring',
          priority: 'high',
          tags: ['time', 'unblock'],
          status: 'in-progress',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'nxcore-repair',
          title: 'NXCore Systems Repair & Expansion',
          description: 'Traefik middleware patch, credential reset, security baseline + Prometheus/Loki/Grafana observability',
          priority: 'high',
          tags: ['time', 'unblock'],
          status: 'in-progress',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'echoverse-verify',
          title: 'EchoVerse Music — Checksum Verification',
          description: 'Execute checksum verify run (VERIFY=true) to confirm data integrity on media ingest log',
          priority: 'medium',
          tags: ['time', 'money'],
          status: 'in-progress',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'moth-emporium-launch',
          title: 'Moth Emporium — Creator Launch & Marketing',
          description: 'Product page assets and video content prepping, Marketing Week 1-4 rollout schedule initiated',
          priority: 'medium',
          tags: ['money'],
          status: 'in-progress',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'orbit-logos',
          title: 'Orbit Logo Sheet & Division Emblems',
          description: 'Seven orbiting spheres finalized; 3D orbital crossplane concept with cohesive palette',
          priority: 'medium',
          tags: ['time'],
          status: 'in-progress',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'avmini-software',
          title: 'AVmini PC — Software Stack Setup',
          description: 'GitHub Desktop, Docker Compose, Tailscale, VS Code, and NXCore CLI tools setup pending',
          priority: 'medium',
          tags: ['unblock'],
          status: 'in-progress',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        
        // ⏳ PENDING / Needs Action (High Priority)
        {
          id: 'g2g-sizes',
          title: 'Gray-to-Green — size/placement image set',
          description: 'Waiting on photo shortlist. Pick 6 starter reference photos (lock vibe), then expand to 12',
          priority: 'high',
          tags: ['time', 'money'],
          status: 'pending',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'aerovista-web-billing',
          title: 'AeroVista Web — Billing & Auth Setup',
          description: 'Approve org/folder/billing layout + budgets/alerts (R&D split), confirm centralized Firebase Auth',
          priority: 'high',
          tags: ['time', 'money'],
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'rydesync-routing',
          title: 'RydeSync-Next — Routing & Redis Setup',
          description: 'Decide routing for RydeSync (link-out vs reverse-proxy), approve Redis tier/region & budget thresholds',
          priority: 'high',
          tags: ['time', 'money'],
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'portfolio-consolidation',
          title: 'App Portfolio Consolidation',
          description: 'Consolidate AeroDash versions, complete RydeSync-Next cutover, standardize MindForge/BytePad naming',
          priority: 'high',
          tags: ['time', 'unblock'],
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'n8n-automation',
          title: 'n8n Automation Stack Setup',
          description: 'Finalize install pack (Docker Compose: n8n + Postgres + Traefik/NGINX), enable HTTPS, prefill seed workflows',
          priority: 'high',
          tags: ['time', 'unblock'],
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'service-navigation-sop',
          title: 'Service Navigation SOP Implementation',
          description: 'Implement consistent service inventory, routing, and navigation for NXCore and multi-server environments',
          priority: 'medium',
          tags: ['time', 'unblock'],
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'smh-build-plan',
          title: 'Social Media Hub (SMH) Build Plan',
          description: 'Stand up SMH inside NeXuS environment with shared auth, data, and observability',
          priority: 'medium',
          tags: ['time', 'money'],
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'brand-handoff',
          title: 'AeroVista Brand → Web Handoff',
          description: 'Finalize brand system (SVG logos, color tokens, typography, icon suite, OG templates) for web integration',
          priority: 'medium',
          tags: ['time', 'money'],
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'nxcore-phase-c',
          title: 'NXCore Phase C — PC Provisioning',
          description: 'Early work on PC provisioning (Linux/Windows) and heartbeat system',
          priority: 'high',
          tags: ['time', 'unblock'],
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'n8n-self-hosted-deployment',
          title: 'n8n Self-Hosted Deployment (P1)',
          description: 'Deploy n8n automation stack on call-center Linux server with Docker Compose, HTTPS, and monitoring',
          priority: 'high',
          tags: ['time', 'unblock', 'money'],
          status: 'pending',
          createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'nxcore-routing-cleanup',
          title: 'NXCore Routing & Middleware Cleanup',
          description: 'Fix Traefik StripPrefix issue and credential rotation (Grafana, n8n, Authelia)',
          priority: 'high',
          tags: ['time', 'unblock'],
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'authelia-sso-fix',
          title: 'Authelia SSO Integration',
          description: 'Fix Authelia blank-page rendering and SSO alignment with cert chain',
          priority: 'high',
          tags: ['time', 'unblock'],
          status: 'pending',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'redis-rydesync-budget',
          title: 'Redis RydeSync Budget Approval',
          description: 'Get Redis tier budget approved for RydeSync integration and routing decision',
          priority: 'high',
          tags: ['money', 'unblock'],
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'nxcore-phase-d',
          title: 'NXCore Phase D — CI Integration',
          description: 'CI integration + security backup config in staging',
          priority: 'high',
          tags: ['time', 'unblock'],
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'firebase-functions-gen2',
          title: 'Firebase Functions Gen-2 Deployment',
          description: 'Deploy Firebase Functions (Gen-2) on aerovista-site',
          priority: 'high',
          tags: ['time', 'money'],
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'rydesync-proxy-testing',
          title: 'RydeSync Reverse-Proxy Decision Testing',
          description: 'Begin RydeSync reverse-proxy decision testing',
          priority: 'high',
          tags: ['time', 'money'],
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'daily-brief-json-export',
          title: 'Daily Brief JSON Export & Backup',
          description: 'Draft internal report export from Daily Brief to JSON for backup',
          priority: 'medium',
          tags: ['time'],
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'moth-emporium-etsy',
          title: 'Moth Emporium — Etsy Listing & Pricing',
          description: 'Resume branding content for Moth Emporium (Etsy listing mockup + pricing)',
          priority: 'medium',
          tags: ['money'],
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'jeanie-bday',
          title: 'Jeanie with a Jay — Birthday page',
          description: 'Not yet staged. Drop hero art, embed 1–2 tracks, add share/download CTAs',
          priority: 'medium',
          tags: ['money'],
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'nfl-season',
          title: 'NFL — season .ics + marketing stub',
          description: 'Recurring calendar not created; stub not pinned. Generate basic .ics and paste into one-page stub',
          priority: 'high',
          tags: ['time', 'money'],
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'tv-install',
          title: '82–85″ TV — install scheduling',
          description: 'Ready to schedule. Choose mount (tilt vs full-motion) after confirming VESA/weight, then block 2-hr window',
          priority: 'high',
          tags: ['time', 'unblock'],
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'tv-warranty',
          title: 'TV — warranty & paperwork',
          description: 'Likely not registered yet. Register warranty + upload receipt PDF to asset record',
          priority: 'medium',
          tags: ['time'],
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        
        // 📦 BACKLOG / Keep Warm (Next 1–3 Weeks)
        {
          id: 'neural-core',
          title: 'Neural Core (web-only) — skinny POC',
          description: 'Scaffold Flask, stub /files/list + /music/library',
          priority: 'medium',
          tags: ['unblock'],
          status: 'backlog',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'ollama-node',
          title: 'Ollama headless node',
          description: 'Pick target box; one-line install in README',
          priority: 'medium',
          tags: ['unblock'],
          status: 'backlog',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'rydesync-debug',
          title: 'RydeSync debug',
          description: 'Confirm Accept-Ranges + 206; capture HAR of one failing stream',
          priority: 'medium',
          tags: ['unblock'],
          status: 'backlog',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'icetap-tags',
          title: 'ICETAP/FraudShield — tag groups',
          description: 'Implement one grouped checkbox; add telemetry',
          priority: 'medium',
          tags: ['money'],
          status: 'backlog',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'echoverse-art',
          title: 'EchoVerse art sprints',
          description: 'Lock palette/typography for first cover',
          priority: 'medium',
          tags: ['money'],
          status: 'backlog',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'aerovista-brand',
          title: 'AeroVista branding/DNS tidy',
          description: 'Cloudflare rules; favicons/OGs per division',
          priority: 'low',
          tags: [],
          status: 'backlog',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'sec-ops',
          title: 'Security & Ops hardening',
          description: 'Finalize BIOS/UEFI SOP; inventory ledger; backup scripts',
          priority: 'medium',
          tags: [],
          status: 'backlog',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'g2g-ecom',
          title: 'G2G e-commerce prep',
          description: 'Product page template; size guide; lead capture',
          priority: 'medium',
          tags: ['money'],
          status: 'backlog',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'aerocoreos-polish',
          title: 'AeroCoreOS polish',
          description: 'Standardize dev ports to 5173; favicon packs; README',
          priority: 'low',
          tags: [],
          status: 'backlog',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      activities: [
        {
          id: 'activity-1',
          type: 'created',
          message: 'Daily Brief Builder initialized',
          timestamp: new Date().toISOString()
        },
        {
          id: 'activity-2',
          type: 'completed',
          message: 'CX Pulse EOM deck delivered to stakeholders',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-3',
          type: 'completed',
          message: 'Sunsets page refresh live with audio fallback',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-4',
          type: 'completed',
          message: 'NFL weekly drop shipped at 11:00 (Oct 2)',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-5',
          type: 'completed',
          message: '82-85" TV acquired, transported, and stored safely',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-6',
          type: 'progress',
          message: 'PC rebuild: Device connected and ready for secure wipe',
          timestamp: new Date().toISOString()
        },
        {
          id: 'activity-7',
          type: 'alert',
          message: 'Gray-to-Green: 48h no movement - waiting on photo shortlist',
          timestamp: new Date().toISOString()
        },
        {
          id: 'activity-8',
          type: 'alert',
          message: 'NFL .ics stub: Still missing initial generation step',
          timestamp: new Date().toISOString()
        },
        // Oct 4 recap entries
        {
          id: 'activity-9',
          type: 'progress',
          message: 'TV install prep: specs verified; wall area cleared; wiring path confirmed',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-10',
          type: 'progress',
          message: 'NFL Ops planning: schedule format finalized; .ics generation queued',
          timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-11',
          type: 'completed',
          message: 'Mikee Gray site: landing page, sponsor logos, GitHub Pages deployment completed',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-12',
          type: 'progress',
          message: 'NXCore system: central control center established with zero-trust networking',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-13',
          type: 'progress',
          message: 'EchoVerse Music Transfer: script ready for Extreme SSD to NXCore migration',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-14',
          type: 'progress',
          message: 'Moth Emporium: gel nails dropshipping line with 8-12 SKUs and 60-70% margins',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-15',
          type: 'progress',
          message: 'Orbit logos: seven spheres finalized with 3D orbital crossplane concept',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-16',
          type: 'alert',
          message: 'AeroVista Web: billing layout and Firebase Auth setup pending approval',
          timestamp: new Date().toISOString()
        },
        {
          id: 'activity-17',
          type: 'alert',
          message: 'RydeSync-Next: routing decision and Redis setup needed for hot sync',
          timestamp: new Date().toISOString()
        },
        {
          id: 'activity-18',
          type: 'alert',
          message: 'n8n Automation: Docker Compose stack and HTTPS setup pending',
          timestamp: new Date().toISOString()
        },
        {
          id: 'activity-19',
          type: 'completed',
          message: 'NXCore Phase A: Firewall + Fail2ban enabled, all .env files encrypted with sops',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-20',
          type: 'completed',
          message: 'NXCore Monitoring: Prometheus + Loki + Grafana + Alertmanager deployed and reachable',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-21',
          type: 'completed',
          message: 'EchoVerse Music Transfer: NXCore → Extreme SSD ingestion workflow complete',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-22',
          type: 'completed',
          message: 'Moth Emporium PoC: Full Next.js + Tailwind storefront ready with marketing plan',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-23',
          type: 'completed',
          message: 'AVmini PC: Hardware preparation complete, OS validated, firmware patched',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-24',
          type: 'progress',
          message: 'NXCore Phase B: Observability dashboards under refinement, REST API endpoints integration',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-25',
          type: 'progress',
          message: 'Moth Emporium Launch: Product page assets and video content prepping, Marketing Week 1-4 rollout initiated',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'activity-26',
          type: 'alert',
          message: 'Tomorrow Kick-Off (Oct 24): Finalize AVmini software stack, deploy Firebase Functions Gen-2, begin RydeSync proxy testing',
          timestamp: new Date().toISOString()
        }
      ],
      settings: {
        notifications: true,
        autoRefresh: true,
        theme: 'cyberpunk',
        defaultMode: 'morning'
      },
      risks: [
        'Design momentum (Gray-to-Green, Jeanie) depends on quick asset picks (photos/hero art)',
        'TV install needs a scheduled slot + mount decision to avoid drift',
        'Recurring NFL ops smoother once the .ics + stub exist (reduces weekly overhead)',
        'NXCore system stability depends on Traefik middleware patch and credential reset completion',
        'AeroVista Web deployment blocked by billing layout approval and Firebase Auth configuration',
        'RydeSync-Next routing decision impacts Redis costs and performance for hot sync operations',
        'Portfolio consolidation requires careful version merging to avoid breaking existing functionality'
      ],
      focus: [
        // Today's Top 5 – Oct 24, 2025 (Start-of-Shift) - Updated with comprehensive status report
        'n8n Self-Hosted Deployment (P1): Deploy automation stack on call-center Linux server with Docker Compose, HTTPS, and monitoring',
        'NXCore Routing & Middleware Cleanup: Fix Traefik StripPrefix issue and credential rotation (Grafana, n8n, Authelia)',
        'Authelia SSO Integration: Fix blank-page rendering and SSO alignment with cert chain',
        'Redis RydeSync Budget Approval: Get Redis tier budget approved for RydeSync integration and routing decision',
        'NXCore Phase B→C handoff: Start orchestration pipeline for PC provisioning and heartbeat system'
      ],
      heartfelt: "To everyone who picked up the phone with us—agents, leaders, friends: thank you. We built something real in the space between holds and hellos. This page is a little sunset for a big chapter. Hit play, remember the laughs, the grit, and the wins—and carry it forward. You mattered here. You still do.",
      
      // 45-Day Projection Data
      projection: {
        startDate: new Date('2025-10-24'),
        endDate: new Date('2025-12-08'),
        totalDays: 45,
        currentWeek: 1,
        phases: [
          {
            id: 'phase-c',
            name: 'PC Provisioning & Heartbeat System',
            startWeek: 1,
            endWeek: 2,
            status: 'in-progress',
            description: 'Automated Linux/Windows deployment, real-time health monitoring, zero-trust networking expansion',
            stretchGoals: [
              'Multi-OS Support: Windows 11, Ubuntu 22.04, CentOS Stream',
              'Automated Updates: Zero-downtime update system',
              'Performance Monitoring: Real-time resource utilization tracking',
              'Backup Automation: Automated backup and recovery systems'
            ],
            successMetrics: {
              nodes: '5+ provisioned nodes with heartbeat monitoring',
              uptime: '99.9% uptime across all infrastructure',
              provisioning: '<30 second provisioning time for new nodes',
              security: 'Zero security incidents'
            }
          },
          {
            id: 'phase-d',
            name: 'CI Integration & Security',
            startWeek: 2,
            endWeek: 3,
            status: 'pending',
            description: 'Automated testing, blue-green deployments, security scanning, compliance monitoring',
            stretchGoals: [
              'Advanced CI/CD: Multi-environment promotion pipelines',
              'Security Automation: Automated threat detection and response',
              'Performance Testing: Automated load and stress testing',
              'Documentation Automation: Auto-generated API documentation'
            ],
            successMetrics: {
              testing: '100% automated testing coverage',
              deployment: '<5 minute deployment time',
              security: 'Zero security vulnerabilities in production',
              compliance: '100% compliance with security standards'
            }
          },
          {
            id: 'phase-e',
            name: 'AI/ML Integration',
            startWeek: 3,
            endWeek: 4,
            status: 'pending',
            description: 'Automated model training, real-time data processing, predictive analytics, intelligent automation',
            stretchGoals: [
              'Advanced ML: Deep learning model deployment',
              'Real-time Analytics: Sub-second data processing',
              'Predictive Maintenance: AI-powered system optimization',
              'Natural Language Processing: AI-powered system interaction'
            ],
            successMetrics: {
              accuracy: '95%+ prediction accuracy for system issues',
              response: '<1 second response time for AI queries',
              automation: '50% reduction in manual intervention',
              incidents: '100% automated incident response'
            }
          },
          {
            id: 'phase-f',
            name: 'Full Ecosystem Automation',
            startWeek: 4,
            endWeek: 5,
            status: 'pending',
            description: 'Cross-system orchestration, intelligent routing, automated scaling, self-healing systems',
            stretchGoals: [
              'Autonomous Operations: Fully automated system management',
              'Advanced Analytics: Predictive business intelligence',
              'Multi-Cloud Integration: Seamless cloud provider management',
              'Edge Computing: Distributed processing capabilities'
            ],
            successMetrics: {
              availability: '99.99% system availability',
              response: '<100ms response time across all services',
              automation: '90% reduction in manual operations',
              scaling: '100% automated scaling'
            }
          }
        ],
        weeklyGoals: [
          {
            week: 1,
            name: 'Foundation Completion',
            dates: 'Oct 24-30',
            objectives: [
              'Complete NXCore Phase B (System Enhancement)',
              'Begin NXCore Phase C (PC Provisioning)',
              'Launch Moth Emporium Etsy store',
              'Deploy Firebase Functions Gen-2'
            ],
            stretchGoals: [
              'Complete all 4 kick-off tasks by EOD',
              '3 new nodes provisioned',
              '50% performance improvement',
              '100% test coverage'
            ]
          },
          {
            week: 2,
            name: 'Infrastructure Expansion',
            dates: 'Oct 31-Nov 6',
            objectives: [
              'Complete NXCore Phase C (PC Provisioning)',
              'Begin NXCore Phase D (CI Integration)',
              'Launch AeroVista Web platform',
              'Implement advanced monitoring'
            ],
            stretchGoals: [
              '10+ nodes active',
              '100+ active users',
              'A+ security rating',
              'Full CI/CD pipeline'
            ]
          },
          {
            week: 3,
            name: 'Automation & Integration',
            dates: 'Nov 7-13',
            objectives: [
              'Complete NXCore Phase D (CI Integration)',
              'Begin NXCore Phase E (AI/ML Integration)',
              'Launch NXCore Service Hub',
              'Implement advanced automation'
            ],
            stretchGoals: [
              '50+ services registered',
              'First AI model deployed',
              '1000+ tracks processed',
              'Full ecosystem integration'
            ]
          },
          {
            week: 4,
            name: 'AI & Advanced Features',
            dates: 'Nov 14-20',
            objectives: [
              'Complete NXCore Phase E (AI/ML Integration)',
              'Begin NXCore Phase F (Full Ecosystem Automation)',
              'Launch advanced AI features',
              'Implement predictive analytics'
            ],
            stretchGoals: [
              '5+ AI models active',
              '90% prediction accuracy',
              'Voice-controlled system',
              '3+ cloud regions'
            ]
          },
          {
            week: 5,
            name: 'Ecosystem Maturity',
            dates: 'Nov 21-27',
            objectives: [
              'Complete NXCore Phase F (Full Ecosystem Automation)',
              'Achieve 99.99% uptime',
              'Launch advanced features',
              'Implement global scaling'
            ],
            stretchGoals: [
              '95% automation',
              '99.99% uptime',
              '5+ edge locations',
              '50% cost reduction'
            ]
          },
          {
            week: 6,
            name: 'Production Readiness',
            dates: 'Nov 28-Dec 4',
            objectives: [
              'Production deployment preparation',
              'Security hardening',
              'Compliance certification',
              'Performance optimization'
            ],
            stretchGoals: [
              'Production-ready status',
              'A+ security rating',
              '10x current capacity',
              '10+ global regions'
            ]
          },
          {
            week: 7,
            name: 'Launch & Optimization',
            dates: 'Dec 5-8',
            objectives: [
              'Full ecosystem launch',
              'Performance optimization',
              'User onboarding',
              'Success celebration'
            ],
            stretchGoals: [
              '1000+ users',
              '99.99% uptime',
              '<50ms response time',
              '$1M+ revenue'
            ]
          }
        ],
        productLaunches: [
          {
            name: 'Moth Emporium E-Commerce',
            week: 1,
            description: 'Etsy store launch with 12 SKUs, marketing campaign execution, sales optimization',
            status: 'in-progress'
          },
          {
            name: 'AeroVista Web Platform',
            week: 2,
            description: 'Firebase Functions Gen-2 deployment, RydeSync integration, full platform launch',
            status: 'pending'
          },
          {
            name: 'NXCore Service Hub',
            week: 3,
            description: 'Service registry implementation, advanced monitoring dashboards, full ecosystem integration',
            status: 'pending'
          },
          {
            name: 'EchoVerse Music Platform',
            week: 4,
            description: 'Music library indexing, advanced audio processing, full music platform launch',
            status: 'pending'
          }
        ],
        kpis: {
          uptime: {
            week1: 99.5,
            week2: 99.7,
            week3: 99.8,
            week4: 99.9,
            week5: 99.95,
            week6: 99.99,
            week7: 99.999
          },
          responseTime: {
            week1: 200,
            week2: 100,
            week3: 50,
            week4: 25,
            week5: 10,
            week6: 5,
            week7: 1
          },
          automation: {
            week1: 20,
            week2: 40,
            week3: 60,
            week4: 80,
            week5: 95,
            week6: 98,
            week7: 100
          },
          users: {
            week1: 0,
            week2: 100,
            week3: 500,
            week4: 1000,
            week5: 2000,
            week6: 5000,
            week7: 10000
          },
          revenue: {
            week1: 0,
            week2: 10000,
            week3: 50000,
            week4: 100000,
            week5: 250000,
            week6: 500000,
            week7: 1000000
          }
        }
      }
    };
  }

  // Save data to localStorage
  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
      this.notifyListeners('dataChanged', this.data);
      return true;
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
      return false;
    }
  }

  // Add event listener
  addListener(callback) {
    this.listeners.add(callback);
  }

  // Remove event listener
  removeListener(callback) {
    this.listeners.delete(callback);
  }

  // Notify all listeners
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in data listener:', error);
      }
    });
  }

  // Input validation methods
  validateTask(task) {
    const errors = [];
    
    if (!task.title || typeof task.title !== 'string' || task.title.trim().length === 0) {
      errors.push('Task title is required and must be a non-empty string');
    }
    
    if (task.title && task.title.length > 200) {
      errors.push('Task title must be 200 characters or less');
    }
    
    if (task.description && typeof task.description !== 'string') {
      errors.push('Task description must be a string');
    }
    
    if (task.description && task.description.length > 1000) {
      errors.push('Task description must be 1000 characters or less');
    }
    
    const validPriorities = ['low', 'medium', 'high'];
    if (task.priority && !validPriorities.includes(task.priority)) {
      errors.push('Priority must be one of: low, medium, high');
    }
    
    const validStatuses = ['pending', 'in-progress', 'completed', 'backlog'];
    if (task.status && !validStatuses.includes(task.status)) {
      errors.push('Status must be one of: pending, in-progress, completed, backlog');
    }
    
    const validTags = ['time', 'money', 'unblock'];
    if (task.tags && Array.isArray(task.tags)) {
      const invalidTags = task.tags.filter(tag => !validTags.includes(tag));
      if (invalidTags.length > 0) {
        errors.push(`Invalid tags: ${invalidTags.join(', ')}. Valid tags are: ${validTags.join(', ')}`);
      }
    }
    
    if (task.dueDate && isNaN(new Date(task.dueDate).getTime())) {
      errors.push('Due date must be a valid date');
    }
    
    return errors;
  }

  // Error handling wrapper
  handleError(error, context = 'Unknown operation') {
    console.error(`AeroVista Data Manager Error in ${context}:`, error);
    
    // Show user-friendly error message
    if (typeof window !== 'undefined' && window.showNotification) {
      window.showNotification(`Error: ${error.message || 'An unexpected error occurred'}`, 'error');
    }
    
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }

  // Task management methods with validation and error handling
  addTask(task) {
    try {
      // Validate input
      const validationErrors = this.validateTask(task);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      const newTask = {
        id: task.id || Date.now().toString(),
        title: task.title.trim(),
        description: (task.description || '').trim(),
        priority: task.priority || 'medium',
        tags: task.tags || [],
        status: task.status || 'pending',
        dueDate: task.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.data.tasks.push(newTask);
      this.addActivity('created', `Created task "${newTask.title}"`);
      
      if (!this.saveData()) {
        throw new Error('Failed to save data to localStorage');
      }
      
      return { success: true, task: newTask };
    } catch (error) {
      return this.handleError(error, 'addTask');
    }
  }

  updateTask(id, updates) {
    try {
      const taskIndex = this.data.tasks.findIndex(t => t.id === id);
      if (taskIndex === -1) {
        throw new Error(`Task with id "${id}" not found`);
      }

      // Validate updates if they contain task data
      if (updates.title || updates.description || updates.priority || updates.status || updates.tags) {
        const taskToValidate = { ...this.data.tasks[taskIndex], ...updates };
        const validationErrors = this.validateTask(taskToValidate);
        if (validationErrors.length > 0) {
          throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
        }
      }

      const oldTask = { ...this.data.tasks[taskIndex] };
      this.data.tasks[taskIndex] = {
        ...this.data.tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Add activity for status changes
      if (updates.status && updates.status !== oldTask.status) {
        this.addActivity('statusChanged', `Task "${this.data.tasks[taskIndex].title}" status changed to ${updates.status}`);
      }

      if (!this.saveData()) {
        throw new Error('Failed to save data to localStorage');
      }

      return { success: true, task: this.data.tasks[taskIndex] };
    } catch (error) {
      return this.handleError(error, 'updateTask');
    }
  }

  deleteTask(id) {
    try {
      const taskIndex = this.data.tasks.findIndex(t => t.id === id);
      if (taskIndex === -1) {
        throw new Error(`Task with id "${id}" not found`);
      }

      const task = this.data.tasks[taskIndex];
      this.data.tasks.splice(taskIndex, 1);
      this.addActivity('deleted', `Deleted task "${task.title}"`);
      
      if (!this.saveData()) {
        throw new Error('Failed to save data to localStorage');
      }

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'deleteTask');
    }
  }

  toggleTaskStatus(id) {
    try {
      const task = this.data.tasks.find(t => t.id === id);
      if (!task) {
        throw new Error(`Task with id "${id}" not found`);
      }

      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const updates = { status: newStatus };
      
      if (newStatus === 'completed') {
        updates.completedAt = new Date().toISOString();
      } else {
        updates.completedAt = null;
      }

      const result = this.updateTask(id, updates);
      return result.success ? { success: true, task: result.task } : result;
    } catch (error) {
      return this.handleError(error, 'toggleTaskStatus');
    }
  }

  // Activity management
  addActivity(type, text) {
    const activity = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date().toISOString()
    };
    
    this.data.activities.push(activity);
    
    // Keep only last 100 activities
    if (this.data.activities.length > 100) {
      this.data.activities = this.data.activities.slice(-100);
    }
    
    this.saveData();
    return activity;
  }

  // Get tasks by status
  getTasksByStatus() {
    return {
      completed: this.data.tasks.filter(t => t.status === 'completed'),
      inProgress: this.data.tasks.filter(t => t.status === 'in-progress'),
      pending: this.data.tasks.filter(t => t.status === 'pending'),
      backlog: this.data.tasks.filter(t => t.status === 'backlog')
    };
  }

  // Get top priority tasks
  getTopTasks(limit = 5) {
    return this.data.tasks
      .filter(t => t.status !== 'completed')
      .sort((a, b) => this.getTaskPriority(b) - this.getTaskPriority(a))
      .slice(0, limit);
  }

  // Calculate task priority score
  getTaskPriority(task) {
    let priority = 0;
    
    // Priority weight
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    priority += priorityWeights[task.priority] || 1;
    
    // Tag weights
    if (task.tags.includes('time')) priority += 2;
    if (task.tags.includes('money')) priority += 2;
    if (task.tags.includes('unblock')) priority += 1;
    
    // Status weight
    const statusWeights = { 'in-progress': 2, 'pending': 1, 'backlog': 0 };
    priority += statusWeights[task.status] || 0;
    
    return priority;
  }

  // Get overdue tasks
  getOverdueTasks() {
    const now = new Date();
    return this.data.tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    );
  }

  // Get no-movement alerts
  getNoMovementAlerts(thresholdHours = 48) {
    const threshold = thresholdHours * 60 * 60 * 1000;
    const now = Date.now();
    
    return this.data.tasks.filter(task => {
      if (task.status === 'completed') return false;
      if (!task.tags.includes('time') && !task.tags.includes('money')) return false;
      
      const lastUpdate = new Date(task.updatedAt).getTime();
      return (now - lastUpdate) >= threshold;
    });
  }

  // Get quick wins
  getQuickWins() {
    return [
      'n8n deployment: Finalize install pack and deploy Docker Compose stack (≤45 min)',
      'NXCore routing: Fix Traefik StripPrefix issue and test routing (≤30 min)',
      'Authelia SSO: Debug blank-page rendering and test SSO flow (≤20 min)',
      'Redis budget: Draft budget proposal for RydeSync Redis tier (≤15 min)',
      'AVmini setup: Finalize software stack and test Tailscale join (≤30 min)',
      'EchoVerse Music: Execute checksum verify run (VERIFY=true) (≤15 min)',
      'Firebase Functions: Deploy Gen-2 on aerovista-site (≤20 min)',
      'RydeSync testing: Begin reverse-proxy decision testing (≤30 min)',
      'Daily Brief JSON: Draft internal report export for backup (≤10 min)',
      'Moth Emporium: Resume Etsy listing mockup + pricing (≤45 min)'
    ];
  }

  // Get calendar-worthy deadlines
  getCalendarWorthy() {
    return [
      "<li><b>n8n Self-Hosted Deployment (P1)</b>: deploy automation stack <b>today</b>.</li>",
      "<li><b>NXCore Routing Cleanup</b>: fix Traefik StripPrefix issue <b>today</b>.</li>",
      "<li><b>Authelia SSO Integration</b>: fix blank-page rendering <b>today</b>.</li>",
      "<li><b>Redis RydeSync Budget</b>: get budget approval <b>this week</b>.</li>",
      "<li><b>AVmini software stack</b>: finalize and test Tailscale join <b>today</b>.</li>",
      "<li><b>EchoVerse Music checksum verify</b>: execute VERIFY=true run <b>today</b>.</li>",
      "<li><b>Firebase Functions Gen-2</b>: deploy on aerovista-site <b>today</b>.</li>",
      "<li><b>RydeSync reverse-proxy testing</b>: begin decision testing <b>today</b>.</li>",
      "<li><b>NXCore Phase B→C handoff</b>: start orchestration pipeline <b>today</b>.</li>",
      "<li><b>Daily Brief JSON export</b>: draft internal report export <b>today</b>.</li>"
    ].join('');
  }

  // Get motivation message based on mode
  getMotivation(mode) {
    const motivations = {
      morning: "You've set the stage — one clean push and the week sails easy. ✨",
      midday: "Halfway check: ship one artifact before you check messages again. Momentum > perfection.",
      night: "You kept forward momentum rolling through the weekend — steady, sharp, and setting up an easy Sunday win. ✨"
    };
    return motivations[mode] || motivations.morning;
  }

  // Get 45-day projection data
  getProjection() {
    return this.data.projection;
  }

  // Get current week goals
  getCurrentWeekGoals() {
    const currentWeek = this.data.projection.currentWeek;
    return this.data.projection.weeklyGoals.find(week => week.week === currentWeek);
  }

  // Get phase by ID
  getPhase(phaseId) {
    return this.data.projection.phases.find(phase => phase.id === phaseId);
  }

  // Get product launches for current week
  getCurrentWeekLaunches() {
    const currentWeek = this.data.projection.currentWeek;
    return this.data.projection.productLaunches.filter(launch => launch.week === currentWeek);
  }

  // Get KPI progress for current week
  getCurrentWeekKPIs() {
    const currentWeek = this.data.projection.currentWeek;
    const weekKey = `week${currentWeek}`;
    return {
      uptime: this.data.projection.kpis.uptime[weekKey],
      responseTime: this.data.projection.kpis.responseTime[weekKey],
      automation: this.data.projection.kpis.automation[weekKey],
      users: this.data.projection.kpis.users[weekKey],
      revenue: this.data.projection.kpis.revenue[weekKey]
    };
  }

  // Get stretch goals for current week
  getCurrentWeekStretchGoals() {
    const currentWeek = this.data.projection.currentWeek;
    const weekGoals = this.data.projection.weeklyGoals.find(week => week.week === currentWeek);
    return weekGoals ? weekGoals.stretchGoals : [];
  }

  // Update current week
  updateCurrentWeek(week) {
    this.data.projection.currentWeek = week;
    this.saveData();
  }

  // Get projection progress percentage
  getProjectionProgress() {
    const daysElapsed = Math.floor((new Date() - this.data.projection.startDate) / (1000 * 60 * 60 * 24));
    return Math.min(Math.max((daysElapsed / this.data.projection.totalDays) * 100, 0), 100);
  }

  // Settings management
  updateSettings(updates) {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveData();
    return this.data.settings;
  }

  getSettings() {
    return this.data.settings;
  }

  // Export data
  exportData() {
    return JSON.stringify(this.data, null, 2);
  }

  // Import data
  importData(jsonData) {
    try {
      const importedData = JSON.parse(jsonData);
      this.data = { ...this.getDefaultData(), ...importedData };
      this.saveData();
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Clear all data
  clearData() {
    this.data = this.getDefaultData();
    this.saveData();
    return true;
  }
}

// Create global instance
window.AeroVistaData = new AeroVistaDataManager();

// Utility functions for backward compatibility
window.getTaskPriority = (task) => window.AeroVistaData.getTaskPriority(task);
window.getTopTasks = (limit) => window.AeroVistaData.getTopTasks(limit);
window.getTasksByStatus = () => window.AeroVistaData.getTasksByStatus();
window.getOverdueTasks = () => window.AeroVistaData.getOverdueTasks();
window.getNoMovementAlerts = (hours) => window.AeroVistaData.getNoMovementAlerts(hours);
window.getQuickWins = () => window.AeroVistaData.getQuickWins();
window.getCalendarWorthy = () => window.AeroVistaData.getCalendarWorthy();
window.getMotivation = (mode) => window.AeroVistaData.getMotivation(mode);
