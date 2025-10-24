// Mystical Animations Controller - Moth Wing Power
class MysticalAnimations {
    constructor() {
        this.animatedElements = new Set();
        this.intersectionObserver = null;
        this.mousePosition = { x: 0, y: 0 };
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.bindEvents();
        this.initializeAnimations();
    }
    
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, options);
    }
    
    bindEvents() {
        // Mouse movement tracking
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            this.handleMouseMovement();
        });
        
        // Scroll animations
        window.addEventListener('scroll', () => {
            this.handleScrollAnimations();
        });
        
        // Resize handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            this.handleReducedMotion(e.matches);
        });
        
        // Initialize with current preference
        this.handleReducedMotion(mediaQuery.matches);
    }
    
    initializeAnimations() {
        // Add entrance animations to cards
        const cards = document.querySelectorAll('.mystical-card');
        cards.forEach((card, index) => {
            card.classList.add('card-entrance-effect');
            card.style.animationDelay = `${index * 0.1}s`;
            this.intersectionObserver.observe(card);
        });
        
        // Add text reveal animations
        const headings = document.querySelectorAll('h2, h3, h4');
        headings.forEach((heading, index) => {
            heading.classList.add('text-reveal-effect');
            heading.style.animationDelay = `${index * 0.2}s`;
            this.intersectionObserver.observe(heading);
        });
        
        // Add floating animations to specific elements
        const floatingElements = document.querySelectorAll('.floating-card');
        floatingElements.forEach((element, index) => {
            element.classList.add('float-effect');
            element.style.animationDelay = `${index * 0.5}s`;
        });
        
        // Add shimmer effects to buttons
        const buttons = document.querySelectorAll('.mystical-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.classList.add('shimmer-effect');
            });
            
            button.addEventListener('mouseleave', () => {
                button.classList.remove('shimmer-effect');
            });
        });
        
        // Add glow effects to interactive elements
        const interactiveElements = document.querySelectorAll('.mystical-input, .mystical-checkbox, .mystical-range');
        interactiveElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('glow-effect');
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('glow-effect');
            });
        });
    }
    
    animateElement(element) {
        if (this.animatedElements.has(element)) return;
        
        this.animatedElements.add(element);
        
        // Add stagger effect based on element type
        const staggerDelay = this.getStaggerDelay(element);
        element.style.animationDelay = `${staggerDelay}s`;
        
        // Add specific animations based on element class
        if (element.classList.contains('mystical-card')) {
            element.classList.add('card-entrance-effect');
        } else if (element.tagName.match(/^H[1-6]$/)) {
            element.classList.add('text-reveal-effect');
        } else if (element.classList.contains('mystical-metric')) {
            element.classList.add('pulse-effect');
        }
    }
    
    getStaggerDelay(element) {
        const siblings = Array.from(element.parentNode.children);
        const index = siblings.indexOf(element);
        return index * 0.1;
    }
    
    handleMouseMovement() {
        // Create parallax effect for floating elements
        const floatingElements = document.querySelectorAll('.floating-card');
        floatingElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (this.mousePosition.x - centerX) / 50;
            const deltaY = (this.mousePosition.y - centerY) / 50;
            
            element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        // Add mouse-following glow effect
        this.createMouseGlow();
    }
    
    createMouseGlow() {
        let glowElement = document.getElementById('mouse-glow');
        if (!glowElement) {
            glowElement = document.createElement('div');
            glowElement.id = 'mouse-glow';
            glowElement.style.cssText = `
                position: fixed;
                width: 100px;
                height: 100px;
                background: radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                transition: all 0.3s ease;
                opacity: 0;
            `;
            document.body.appendChild(glowElement);
        }
        
        glowElement.style.left = `${this.mousePosition.x - 50}px`;
        glowElement.style.top = `${this.mousePosition.y - 50}px`;
        glowElement.style.opacity = '0.5';
        
        // Fade out after a short delay
        setTimeout(() => {
            glowElement.style.opacity = '0';
        }, 100);
    }
    
    handleScrollAnimations() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Parallax effect for background elements
        const parallaxElements = document.querySelectorAll('.mystical-section');
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Progress bar animations
        const progressBars = document.querySelectorAll('.mystical-progress-fill');
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < windowHeight && rect.bottom > 0;
            
            if (isVisible) {
                const width = bar.style.width || '0%';
                bar.style.width = width;
                bar.classList.add('progress-animation');
            }
        });
    }
    
    handleResize() {
        // Recalculate animations on resize
        this.animatedElements.clear();
        
        // Reinitialize animations
        setTimeout(() => {
            this.initializeAnimations();
        }, 100);
    }
    
    handleReducedMotion(reduced) {
        if (reduced) {
            // Disable all animations
            document.querySelectorAll('*').forEach(element => {
                element.style.animation = 'none';
                element.style.transition = 'none';
            });
        } else {
            // Re-enable animations
            this.initializeAnimations();
        }
    }
    
    // Public methods for external control
    addAnimation(element, animationClass, duration = 1000) {
        element.classList.add(animationClass);
        element.style.animationDuration = `${duration}ms`;
        
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }
    
    removeAnimation(element, animationClass) {
        element.classList.remove(animationClass);
    }
    
    pauseAnimations() {
        document.querySelectorAll('*').forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }
    
    resumeAnimations() {
        document.querySelectorAll('*').forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
    
    // Special effect methods
    createShimmerEffect(element) {
        element.classList.add('shimmer-effect');
        setTimeout(() => {
            element.classList.remove('shimmer-effect');
        }, 2000);
    }
    
    createGlowEffect(element, duration = 3000) {
        element.classList.add('glow-effect');
        setTimeout(() => {
            element.classList.remove('glow-effect');
        }, duration);
    }
    
    createPulseEffect(element, duration = 2000) {
        element.classList.add('pulse-effect');
        setTimeout(() => {
            element.classList.remove('pulse-effect');
        }, duration);
    }
    
    createBounceEffect(element) {
        element.classList.add('bounce-effect');
        setTimeout(() => {
            element.classList.remove('bounce-effect');
        }, 2000);
    }
    
    createShakeEffect(element) {
        element.classList.add('shake-effect');
        setTimeout(() => {
            element.classList.remove('shake-effect');
        }, 500);
    }
    
    createMorphEffect(element, duration = 4000) {
        element.classList.add('morph-effect');
        setTimeout(() => {
            element.classList.remove('morph-effect');
        }, duration);
    }
    
    createWaveEffect(element, duration = 3000) {
        element.classList.add('wave-effect');
        setTimeout(() => {
            element.classList.remove('wave-effect');
        }, duration);
    }
    
    createTwinkleEffect(element, duration = 2000) {
        element.classList.add('twinkle-effect');
        setTimeout(() => {
            element.classList.remove('twinkle-effect');
        }, duration);
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mysticalAnimations = new MysticalAnimations();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MysticalAnimations;
}
