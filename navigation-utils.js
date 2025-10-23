// Streamlined Navigation Utilities for AeroVista Daily Brief Builder
// Provides consistent, slim navigation across all interfaces

class AeroVistaNavigation {
  constructor() {
    this.currentPage = this.detectCurrentPage();
    this.navItems = this.getNavigationItems();
  }

  // Detect current page
  detectCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('daily_brief_builder.html')) return 'brief';
    if (path.includes('mobile-brief.html')) return 'mobile';
    if (path.includes('task-manager.html')) return 'tasks';
    if (path.includes('calendar-view.html')) return 'calendar';
    if (path.includes('index.html') || path === '/') return 'home';
    return 'home';
  }

  // Get navigation items
  getNavigationItems() {
    return [
      {
        id: 'home',
        title: 'Home',
        icon: '🏠',
        url: 'index.html',
        description: 'AeroVista landing page'
      },
      {
        id: 'brief',
        title: 'Daily Brief',
        icon: '🌅',
        url: 'daily_brief_builder.html',
        description: 'Intelligent task prioritization'
      },
      {
        id: 'mobile',
        title: 'Mobile',
        icon: '📱',
        url: 'mobile-brief.html',
        description: 'Mobile-optimized interface'
      },
      {
        id: 'tasks',
        title: 'Task Manager',
        icon: '📋',
        url: 'task-manager.html',
        description: 'Advanced task management'
      },
      {
        id: 'calendar',
        title: 'Calendar',
        icon: '📅',
        url: 'calendar-view.html',
        description: 'Scheduling and time management'
      }
    ];
  }

  // Generate streamlined header
  generateHeader() {
    const currentItem = this.navItems.find(item => item.id === this.currentPage);
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    return `
      <header class="aerovista-header">
        <div class="header-content">
          <div class="header-left">
            <div class="logo">
              <span class="logo-icon">✈️</span>
              <span class="logo-text">AeroVista</span>
            </div>
            <div class="current-page">
              <span class="page-icon">${currentItem ? currentItem.icon : '🏠'}</span>
              <span class="page-title">${currentItem ? currentItem.title : 'Home'}</span>
            </div>
          </div>
          
          <div class="header-center">
            <div class="quick-nav">
              ${this.generateQuickNav()}
            </div>
          </div>
          
          <div class="header-right">
            <div class="time-display">${currentTime}</div>
            <div class="status-indicator" id="status-indicator">
              <span class="status-dot"></span>
              <span class="status-text">Online</span>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  // Generate quick navigation
  generateQuickNav() {
    const quickItems = this.navItems.filter(item => item.id !== this.currentPage);
    return quickItems.map(item => `
      <a href="${item.url}" class="quick-nav-item" title="${item.description}">
        <span class="quick-nav-icon">${item.icon}</span>
        <span class="quick-nav-text">${item.title}</span>
      </a>
    `).join('');
  }

  // Generate main navigation
  generateMainNav() {
    return this.navItems.map(item => `
      <a href="${item.url}" class="nav-item ${item.id === this.currentPage ? 'active' : ''}" title="${item.description}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-text">${item.title}</span>
      </a>
    `).join('');
  }

  // Generate mobile navigation
  generateMobileNav() {
    return `
      <div class="mobile-nav">
        <div class="mobile-nav-header">
          <div class="mobile-logo">
            <span class="logo-icon">✈️</span>
            <span class="logo-text">AeroVista</span>
          </div>
          <button class="mobile-nav-toggle" onclick="toggleMobileNav()">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
        <div class="mobile-nav-content" id="mobile-nav-content">
          ${this.navItems.map(item => `
            <a href="${item.url}" class="mobile-nav-item ${item.id === this.currentPage ? 'active' : ''}">
              <span class="mobile-nav-icon">${item.icon}</span>
              <span class="mobile-nav-text">${item.title}</span>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Generate breadcrumb navigation
  generateBreadcrumb() {
    const breadcrumbs = [
      { title: 'AeroVista', url: 'index.html' }
    ];

    if (this.currentPage !== 'home') {
      const currentItem = this.navItems.find(item => item.id === this.currentPage);
      if (currentItem) {
        breadcrumbs.push({
          title: currentItem.title,
          url: currentItem.url
        });
      }
    }

    return `
      <nav class="breadcrumb">
        ${breadcrumbs.map((crumb, index) => `
          ${index > 0 ? '<span class="breadcrumb-separator">›</span>' : ''}
          <a href="${crumb.url}" class="breadcrumb-item">${crumb.title}</a>
        `).join('')}
      </nav>
    `;
  }

  // Generate floating action button
  generateFAB() {
    const fabActions = [
      { icon: '➕', action: 'addTask', title: 'Add Task' },
      { icon: '📅', action: 'schedule', title: 'Schedule' },
      { icon: '⚙️', action: 'settings', title: 'Settings' }
    ];

    return `
      <div class="fab-container">
        <button class="fab-main" onclick="toggleFAB()">
          <span class="fab-icon">⚡</span>
        </button>
        <div class="fab-actions" id="fab-actions">
          ${fabActions.map(action => `
            <button class="fab-action" onclick="handleFABAction('${action.action}')" title="${action.title}">
              <span class="fab-action-icon">${action.icon}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Generate status bar
  generateStatusBar() {
    return `
      <div class="status-bar">
        <div class="status-left">
          <span class="status-item">
            <span class="status-icon">📊</span>
            <span class="status-text">Tasks: <span id="task-count">0</span></span>
          </span>
          <span class="status-item">
            <span class="status-icon">⏰</span>
            <span class="status-text">Scheduled: <span id="schedule-count">0</span></span>
          </span>
        </div>
        <div class="status-right">
          <span class="status-item">
            <span class="status-icon">💾</span>
            <span class="status-text">Auto-saved</span>
          </span>
        </div>
      </div>
    `;
  }

  // Initialize navigation
  init() {
    this.injectStyles();
    this.updateStatus();
    this.bindEvents();
    
    // Add mobile-specific initialization
    if (window.innerWidth <= 768) {
      this.initMobileNav();
    }
  }

  // Initialize mobile navigation
  initMobileNav() {
    // Add mobile-specific event listeners
    document.addEventListener('click', (e) => {
      if (e.target.closest('.mobile-nav-toggle')) {
        this.toggleMobileNav();
      }
    });
  }

  // Toggle mobile navigation
  toggleMobileNav() {
    const navContent = document.getElementById('mobile-nav-content');
    if (navContent) {
      navContent.classList.toggle('active');
    }
  }

  // Inject navigation styles
  injectStyles() {
    const styles = `
      <style>
        /* Streamlined Navigation Styles */
        .aerovista-header {
          background: linear-gradient(135deg, var(--bg-secondary), var(--panel));
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          color: var(--accent);
        }

        .logo-icon {
          font-size: 1.2rem;
        }

        .current-page {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text);
          font-weight: 600;
        }

        .page-icon {
          font-size: 1.1rem;
        }

        .header-center {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .quick-nav {
          display: flex;
          gap: 0.5rem;
        }

        .quick-nav-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          background: var(--panel2);
          border-radius: 6px;
          text-decoration: none;
          color: var(--text);
          font-size: 0.85rem;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .quick-nav-item:hover {
          background: var(--accent);
          color: white;
          transform: translateY(-1px);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .time-display {
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          color: var(--muted);
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: var(--muted);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: var(--success);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .main-nav {
          display: flex;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--panel);
          border-top: 1px solid var(--border);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          text-decoration: none;
          color: var(--text-secondary);
          border-radius: 6px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }

        .nav-item:hover {
          background: var(--panel2);
          color: var(--text);
        }

        .nav-item.active {
          background: var(--accent);
          color: white;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
          font-size: 0.85rem;
        }

        .breadcrumb-item {
          color: var(--accent);
          text-decoration: none;
        }

        .breadcrumb-separator {
          color: var(--muted);
        }

        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border);
          font-size: 0.8rem;
          color: var(--muted);
        }

        .status-left, .status-right {
          display: flex;
          gap: 1rem;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .status-icon {
          font-size: 0.9rem;
        }

        /* Mobile Navigation */
        .mobile-nav {
          display: none;
        }

        .mobile-nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--panel);
          border-bottom: 1px solid var(--border);
        }

        .mobile-nav-toggle {
          display: flex;
          flex-direction: column;
          gap: 3px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .mobile-nav-toggle span {
          width: 20px;
          height: 2px;
          background: var(--text);
          transition: all 0.3s ease;
        }

        .mobile-nav-content {
          display: none;
          background: var(--panel);
          border-bottom: 1px solid var(--border);
        }

        .mobile-nav-content.active {
          display: block;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          text-decoration: none;
          color: var(--text);
          border-bottom: 1px solid var(--border);
        }

        .mobile-nav-item:last-child {
          border-bottom: none;
        }

        .mobile-nav-item.active {
          background: var(--accent);
          color: white;
        }

        /* FAB (Floating Action Button) */
        .fab-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
        }

        .fab-main {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--accent);
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 174, 239, 0.3);
          transition: all 0.3s ease;
        }

        .fab-main:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 174, 239, 0.4);
        }

        .fab-actions {
          position: absolute;
          bottom: 70px;
          right: 0;
          display: none;
          flex-direction: column;
          gap: 0.5rem;
        }

        .fab-actions.active {
          display: flex;
        }

        .fab-action {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--panel);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .fab-action:hover {
          background: var(--accent);
          color: white;
          transform: scale(1.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .header-content {
            padding: 0.5rem;
          }

          .header-center {
            display: none;
          }

          .quick-nav {
            display: none;
          }

          .main-nav {
            display: none;
          }

          .mobile-nav {
            display: block;
          }

          .breadcrumb {
            padding: 0.5rem;
            font-size: 0.8rem;
          }

          .status-bar {
            padding: 0.5rem;
            font-size: 0.75rem;
          }

          .fab-container {
            bottom: 1rem;
            right: 1rem;
          }
        }

        @media (max-width: 480px) {
          .header-left {
            gap: 0.5rem;
          }

          .logo-text {
            display: none;
          }

          .current-page {
            font-size: 0.9rem;
          }

          .time-display {
            display: none;
          }
        }
      </style>
    `;

    if (!document.getElementById('aerovista-nav-styles')) {
      const styleElement = document.createElement('div');
      styleElement.id = 'aerovista-nav-styles';
      styleElement.innerHTML = styles;
      document.head.appendChild(styleElement);
    }
  }

  // Update status information
  updateStatus() {
    if (window.AeroVistaData) {
      const taskCount = window.AeroVistaData.data.tasks.length;
      const scheduleCount = window.AeroVistaData.data.timeBlocks ? window.AeroVistaData.data.timeBlocks.length : 0;
      
      const taskCountEl = document.getElementById('task-count');
      const scheduleCountEl = document.getElementById('schedule-count');
      
      if (taskCountEl) taskCountEl.textContent = taskCount;
      if (scheduleCountEl) scheduleCountEl.textContent = scheduleCount;
    }
  }

  // Bind navigation events
  bindEvents() {
    // Mobile nav toggle
    window.toggleMobileNav = () => {
      window.AeroVistaNav.toggleMobileNav();
    };

    // FAB toggle
    window.toggleFAB = () => {
      const fabActions = document.getElementById('fab-actions');
      if (fabActions) {
        fabActions.classList.toggle('active');
      }
    };

    // FAB action handler
    window.handleFABAction = (action) => {
      switch (action) {
        case 'addTask':
          if (window.showAddTaskModal) window.showAddTaskModal();
          break;
        case 'schedule':
          if (window.showScheduler) window.showScheduler();
          break;
        case 'settings':
          alert('Settings coming soon!');
          break;
      }
      window.toggleFAB();
    };

    // Update status every 30 seconds
    setInterval(() => this.updateStatus(), 30000);
  }
}

// Initialize navigation
window.AeroVistaNav = new AeroVistaNavigation();

// Export functions for global access
window.generateHeader = () => window.AeroVistaNav.generateHeader();
window.generateMobileNav = () => window.AeroVistaNav.generateMobileNav();
window.generateBreadcrumb = () => window.AeroVistaNav.generateBreadcrumb();
window.generateFAB = () => window.AeroVistaNav.generateFAB();
window.generateStatusBar = () => window.AeroVistaNav.generateStatusBar();
