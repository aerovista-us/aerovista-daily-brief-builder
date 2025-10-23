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
          id: 'nxcore-system',
          title: 'NXCore System Overview & Hub',
          description: 'Central private-cloud control center connecting all divisions via zero-trust, containerized networking',
          priority: 'high',
          tags: ['time', 'money', 'unblock'],
          status: 'in-progress',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
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
          id: 'echoverse-transfer',
          title: 'EchoVerse Music Transfer',
          description: 'Transfer script to copy EchoVerse_Music from Extreme SSD to NXCore media storage with checksum verification',
          priority: 'medium',
          tags: ['time', 'money'],
          status: 'in-progress',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'moth-emporium',
          title: 'Moth Emporium — Gel Nails Dropshipping',
          description: 'Art-forward pre-painted gel nails line with 8-12 SKUs, 60-70% margin targets, hybrid supply chain',
          priority: 'medium',
          tags: ['money'],
          status: 'in-progress',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
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
          id: 'avmini-setup',
          title: 'AVmini PC — Collaborator Setup',
          description: 'Hardware prepared as first collaborator workstation with Tailscale, Docker, GitHub Desktop, VS Code, Node.js LTS',
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
        // Today's Top 5 – Sun Oct 5, 2025 (08:00 PT) - Updated with 123/ directory projects
        'Gray-to-Green image set: pick 6 starter photos; export 2 mock composites; prep palette shortlist',
        'NXCore system: complete Traefik middleware patch; implement Prometheus/Loki/Grafana observability',
        'AeroVista Web: approve billing layout + Firebase Auth setup; deploy Functions Gen-2',
        'RydeSync-Next: decide routing (link-out vs reverse-proxy); approve Redis tier and budget thresholds',
        'Portfolio consolidation: merge AeroDash versions; complete RydeSync cutover; standardize naming'
      ],
      heartfelt: "To everyone who picked up the phone with us—agents, leaders, friends: thank you. We built something real in the space between holds and hellos. This page is a little sunset for a big chapter. Hit play, remember the laughs, the grit, and the wins—and carry it forward. You mattered here. You still do."
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
      'Start PC secure wipe (runs unattended)',
      'Register TV warranty + upload receipt (≤10 min)',
      'Pick 6 Gray-to-Green photos to lock direction',
      'Export basic NFL .ics from last schedule template',
      'Drop hero art on Jeanie page and verify OG/Twitter cards',
      'Review NXCore Service Registry JSON schema and update service entries',
      'Test EchoVerse Music Transfer script with sample files',
      'Finalize Orbit logo exports for UHD transparent variants',
      'Set up AVmini PC with Tailscale and Docker for collaborator access',
      'Create Moth Emporium Etsy POC with first 3 SKU listings'
    ];
  }

  // Get calendar-worthy deadlines
  getCalendarWorthy() {
    return [
      "<li><b>Gray-to-Green photos</b>: pick 6 starter photos <b>today</b>.</li>",
      "<li><b>TV warranty</b>: register warranty <b>within 30 days</b>.</li>",
      "<li><b>Jeanie Birthday page</b>: drop hero art <b>this week</b>.</li>",
      "<li><b>NFL season .ics</b>: generate calendar <b>before next game</b>.</li>",
      "<li><b>PC SOP</b>: kick off secure wipe <b>today</b>.</li>",
      "<li><b>NXCore repair</b>: complete Traefik middleware patch <b>this week</b>.</li>",
      "<li><b>AeroVista Web billing</b>: approve org/folder layout <b>by Tuesday</b>.</li>",
      "<li><b>RydeSync routing</b>: decide link-out vs reverse-proxy <b>by Wednesday</b>.</li>",
      "<li><b>n8n automation</b>: finalize Docker Compose stack <b>this week</b>.</li>",
      "<li><b>EchoVerse transfer</b>: run migration script <b>when ready</b>.</li>"
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
