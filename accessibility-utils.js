// Accessibility utilities for AeroVista Daily Brief Builder
// Provides keyboard navigation, ARIA support, and screen reader compatibility

class AccessibilityManager {
  constructor() {
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.currentFocusIndex = 0;
    this.focusableList = [];
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupARIA();
    this.setupFocusManagement();
    this.setupScreenReaderSupport();
  }

  // Keyboard navigation setup
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Tab navigation
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
      
      // Arrow key navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        this.handleArrowNavigation(e);
      }
      
      // Enter and Space for activation
      if (['Enter', ' '].includes(e.key)) {
        this.handleActivation(e);
      }
      
      // Escape for closing modals/dropdowns
      if (e.key === 'Escape') {
        this.handleEscape(e);
      }
    });
  }

  handleTabNavigation(e) {
    // Update focusable elements list
    this.updateFocusableElements();
    
    // Handle shift+tab (backward navigation)
    if (e.shiftKey) {
      e.preventDefault();
      this.focusPrevious();
    } else {
      // Regular tab (forward navigation)
      // Let browser handle default tab behavior
    }
  }

  handleArrowNavigation(e) {
    const target = e.target;
    const container = target.closest('[role="menu"], [role="listbox"], .nav-tabs, .task-list');
    
    if (container) {
      e.preventDefault();
      this.navigateInContainer(container, e.key);
    }
  }

  handleActivation(e) {
    const target = e.target;
    
    // Don't activate if target is an input/textarea
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }
    
    e.preventDefault();
    
    // Activate buttons, links, and interactive elements
    if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.getAttribute('role') === 'button') {
      target.click();
    }
  }

  handleEscape(e) {
    // Close any open modals
    const modals = document.querySelectorAll('.modal-overlay, [role="dialog"]');
    modals.forEach(modal => {
      if (modal.style.display !== 'none') {
        const closeButton = modal.querySelector('[aria-label="Close"], .modal-close');
        if (closeButton) {
          closeButton.click();
        }
      }
    });
  }

  updateFocusableElements() {
    this.focusableList = Array.from(document.querySelectorAll(this.focusableElements))
      .filter(el => !el.disabled && !el.hidden && this.isVisible(el));
  }

  focusNext() {
    this.currentFocusIndex = (this.currentFocusIndex + 1) % this.focusableList.length;
    this.focusableList[this.currentFocusIndex]?.focus();
  }

  focusPrevious() {
    this.currentFocusIndex = this.currentFocusIndex === 0 
      ? this.focusableList.length - 1 
      : this.currentFocusIndex - 1;
    this.focusableList[this.currentFocusIndex]?.focus();
  }

  navigateInContainer(container, direction) {
    const focusableInContainer = Array.from(container.querySelectorAll(this.focusableElements))
      .filter(el => !el.disabled && !el.hidden && this.isVisible(el));
    
    const currentIndex = focusableInContainer.indexOf(document.activeElement);
    let nextIndex = currentIndex;
    
    switch (direction) {
      case 'ArrowDown':
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % focusableInContainer.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        nextIndex = currentIndex === 0 ? focusableInContainer.length - 1 : currentIndex - 1;
        break;
    }
    
    focusableInContainer[nextIndex]?.focus();
  }

  isVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  // ARIA setup
  setupARIA() {
    // Add ARIA labels to interactive elements
    this.addARIALabels();
    
    // Setup live regions for dynamic content
    this.setupLiveRegions();
    
    // Add role attributes where needed
    this.addRoles();
  }

  addARIALabels() {
    // Add labels to buttons without text
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
      const icon = button.querySelector('span');
      if (icon && !button.textContent.trim()) {
        button.setAttribute('aria-label', this.getIconDescription(icon.textContent));
      }
    });
    
    // Add labels to form inputs
    document.querySelectorAll('input, select, textarea').forEach(input => {
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) {
          input.setAttribute('aria-labelledby', label.id || this.generateId(label));
        }
      }
    });
  }

  getIconDescription(icon) {
    const iconMap = {
      '➕': 'Add',
      '✅': 'Complete',
      '🗑️': 'Delete',
      '🔄': 'Refresh',
      '⚙️': 'Settings',
      '📋': 'Task',
      '📊': 'Statistics',
      '🎯': 'Focus',
      '⚠️': 'Warning',
      'ℹ️': 'Information'
    };
    return iconMap[icon] || 'Action';
  }

  setupLiveRegions() {
    // Create live region for announcements
    if (!document.getElementById('aria-live-region')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'aria-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
      document.body.appendChild(liveRegion);
    }
  }

  addRoles() {
    // Add roles to custom components
    document.querySelectorAll('.task-card').forEach(card => {
      if (!card.getAttribute('role')) {
        card.setAttribute('role', 'listitem');
      }
    });
    
    document.querySelectorAll('.nav-tab').forEach(tab => {
      if (!tab.getAttribute('role')) {
        tab.setAttribute('role', 'tab');
      }
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
      if (!modal.getAttribute('role')) {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
      }
    });
  }

  // Focus management
  setupFocusManagement() {
    // Trap focus in modals
    document.addEventListener('focusin', (e) => {
      const modal = e.target.closest('[role="dialog"]');
      if (modal) {
        this.trapFocusInModal(modal);
      }
    });
    
    // Restore focus when closing modals
    this.setupFocusRestoration();
  }

  trapFocusInModal(modal) {
    const focusableElements = modal.querySelectorAll(this.focusableElements);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    document.addEventListener('keydown', function trapFocus(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    });
  }

  setupFocusRestoration() {
    let lastFocusedElement = null;
    
    // Store focus when opening modals
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-modal-trigger], .btn[data-target*="modal"]')) {
        lastFocusedElement = document.activeElement;
      }
    });
    
    // Restore focus when closing modals
    document.addEventListener('click', (e) => {
      if (e.target.matches('.modal-close, [aria-label="Close"]')) {
        if (lastFocusedElement) {
          lastFocusedElement.focus();
          lastFocusedElement = null;
        }
      }
    });
  }

  // Screen reader support
  setupScreenReaderSupport() {
    // Announce dynamic content changes
    this.setupContentAnnouncements();
    
    // Add skip links
    this.addSkipLinks();
    
    // Improve form accessibility
    this.improveFormAccessibility();
  }

  setupContentAnnouncements() {
    // Watch for content changes and announce them
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if new content was added
          const addedContent = Array.from(mutation.addedNodes)
            .filter(node => node.nodeType === Node.ELEMENT_NODE)
            .map(node => node.textContent?.trim())
            .filter(text => text && text.length > 0)
            .join(' ');
          
          if (addedContent) {
            this.announce(addedContent);
          }
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  announce(message) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  addSkipLinks() {
    if (!document.getElementById('skip-links')) {
      const skipLinks = document.createElement('div');
      skipLinks.id = 'skip-links';
      skipLinks.innerHTML = `
        <a href="#main-content" class="skip-link">Skip to main content</a>
        <a href="#navigation" class="skip-link">Skip to navigation</a>
        <a href="#tasks" class="skip-link">Skip to tasks</a>
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: var(--accent);
          color: white;
          padding: 8px;
          text-decoration: none;
          border-radius: 4px;
          z-index: 1000;
          transition: top 0.3s;
        }
        .skip-link:focus {
          top: 6px;
        }
      `;
      
      document.head.appendChild(style);
      document.body.insertBefore(skipLinks, document.body.firstChild);
    }
  }

  improveFormAccessibility() {
    // Add required field indicators
    document.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
      const label = document.querySelector(`label[for="${field.id}"]`);
      if (label && !label.textContent.includes('*')) {
        label.innerHTML += ' <span aria-label="required">*</span>';
      }
    });
    
    // Add error message containers
    document.querySelectorAll('input, select, textarea').forEach(field => {
      if (!field.getAttribute('aria-describedby')) {
        const errorId = field.id + '-error';
        const errorElement = document.createElement('div');
        errorElement.id = errorId;
        errorElement.setAttribute('role', 'alert');
        errorElement.className = 'error-message';
        field.setAttribute('aria-describedby', errorId);
        field.parentNode.appendChild(errorElement);
      }
    });
  }

  // Utility methods
  generateId(element) {
    if (!element.id) {
      element.id = 'element-' + Math.random().toString(36).substr(2, 9);
    }
    return element.id;
  }

  // High contrast mode support
  setupHighContrastMode() {
    // Check for high contrast mode preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      document.body.classList.add('high-contrast');
    }
    
    // Watch for changes
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
    });
  }

  // Reduced motion support
  setupReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduced-motion');
    }
    
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('reduced-motion');
      } else {
        document.body.classList.remove('reduced-motion');
      }
    });
  }
}

// Initialize accessibility manager
document.addEventListener('DOMContentLoaded', () => {
  window.AccessibilityManager = new AccessibilityManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityManager;
}
