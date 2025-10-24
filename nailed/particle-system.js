// Mystical Particle System - Moth Wing Power
class MysticalParticleSystem {
    constructor() {
        this.container = document.getElementById('particle-container');
        this.particles = [];
        this.particleTypes = [
            'dust-particle',
            'shimmer-particle', 
            'golden-dust',
            'moth-wing-particle',
            'sparkle-particle',
            'magical-powder',
            'mystical-orb'
        ];
        this.maxParticles = 20;
        this.animationId = null;
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.createParticles();
        this.startAnimation();
        this.bindEvents();
    }
    
    createParticles() {
        // Clear existing particles
        this.container.innerHTML = '';
        this.particles = [];
        
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle(i);
        }
    }
    
    createParticle(index) {
        const particle = document.createElement('div');
        const particleType = this.particleTypes[index % this.particleTypes.length];
        
        particle.className = `particle ${particleType}`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${6 + Math.random() * 10}s`;
        
        // Add random variations
        if (Math.random() > 0.5) {
            particle.style.transform = 'scaleX(-1)';
        }
        
        if (Math.random() > 0.7) {
            particle.style.opacity = '0.5';
        }
        
        this.container.appendChild(particle);
        this.particles.push({
            element: particle,
            type: particleType,
            index: index
        });
    }
    
    startAnimation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.animate();
    }
    
    stopAnimation() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        // Update particle positions and effects
        this.particles.forEach((particle, index) => {
            this.updateParticle(particle, index);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updateParticle(particle, index) {
        const element = particle.element;
        const rect = element.getBoundingClientRect();
        
        // Reset particle if it's off screen
        if (rect.top < -50) {
            element.style.left = `${Math.random() * 100}%`;
            element.style.animationDelay = `${Math.random() * 5}s`;
        }
        
        // Add subtle mouse interaction
        this.addMouseInteraction(element);
    }
    
    addMouseInteraction(element) {
        element.addEventListener('mouseenter', () => {
            element.style.animationPlayState = 'paused';
            element.style.transform += ' scale(1.5)';
            element.style.opacity = '1';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.animationPlayState = 'running';
            element.style.transform = element.style.transform.replace(' scale(1.5)', '');
        });
    }
    
    bindEvents() {
        // Pause particles when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseParticles();
            } else {
                this.resumeParticles();
            }
        });
        
        // Adjust particle count based on performance
        window.addEventListener('resize', () => {
            this.adjustParticleCount();
        });
        
        // Mouse movement effects
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
    }
    
    pauseParticles() {
        this.particles.forEach(particle => {
            particle.element.style.animationPlayState = 'paused';
        });
    }
    
    resumeParticles() {
        this.particles.forEach(particle => {
            particle.element.style.animationPlayState = 'running';
        });
    }
    
    adjustParticleCount() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Reduce particles on smaller screens
        if (width < 768) {
            this.maxParticles = 10;
        } else if (width < 1024) {
            this.maxParticles = 15;
        } else {
            this.maxParticles = 20;
        }
        
        // Recreate particles with new count
        this.createParticles();
    }
    
    handleMouseMove(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Create temporary sparkle effect near mouse
        this.createSparkleEffect(mouseX, mouseY);
    }
    
    createSparkleEffect(x, y) {
        if (Math.random() > 0.1) return; // Only 10% chance
        
        const sparkle = document.createElement('div');
        sparkle.className = 'particle sparkle-particle';
        sparkle.style.position = 'fixed';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        sparkle.style.animation = 'sparkleFloat 1s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1000);
    }
    
    // Public methods for external control
    addParticle(type = null) {
        const particleType = type || this.particleTypes[Math.floor(Math.random() * this.particleTypes.length)];
        const index = this.particles.length;
        
        this.createParticle(index);
    }
    
    removeParticle(index) {
        if (index >= 0 && index < this.particles.length) {
            const particle = this.particles[index];
            if (particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
            this.particles.splice(index, 1);
        }
    }
    
    clearParticles() {
        this.particles.forEach(particle => {
            if (particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
        });
        this.particles = [];
    }
    
    setParticleCount(count) {
        this.maxParticles = Math.max(0, Math.min(50, count));
        this.createParticles();
    }
    
    toggleParticles() {
        if (this.isRunning) {
            this.stopAnimation();
        } else {
            this.startAnimation();
        }
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        window.mysticalParticleSystem = new MysticalParticleSystem();
    }
});

// Handle reduced motion preference changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches && window.mysticalParticleSystem) {
        window.mysticalParticleSystem.stopAnimation();
        window.mysticalParticleSystem.clearParticles();
    } else if (!e.matches && window.mysticalParticleSystem) {
        window.mysticalParticleSystem.createParticles();
        window.mysticalParticleSystem.startAnimation();
    }
});

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.monitorInterval = null;
    }
    
    start() {
        this.monitorInterval = setInterval(() => {
            this.updateFPS();
        }, 1000);
    }
    
    stop() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
        }
    }
    
    updateFPS() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.fps = Math.round(1000 / deltaTime);
        this.lastTime = currentTime;
        
        // Adjust particle count based on performance
        if (window.mysticalParticleSystem) {
            if (this.fps < 30) {
                window.mysticalParticleSystem.setParticleCount(10);
            } else if (this.fps < 45) {
                window.mysticalParticleSystem.setParticleCount(15);
            } else {
                window.mysticalParticleSystem.setParticleCount(20);
            }
        }
    }
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    const performanceMonitor = new PerformanceMonitor();
    performanceMonitor.start();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MysticalParticleSystem, PerformanceMonitor };
}
