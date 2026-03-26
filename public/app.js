// No Waste Tracker - Main Application Entry Point
// This file serves as the main entry point for the application

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Application Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// Application initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌱 No Waste Tracker - Application Initialized');
    
    // Check if we're on the correct page and initialize accordingly
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    // Set page title dynamically
    updatePageTitle(pageName);
    
    // Initialize common functionality
    initializeCommonFeatures();
    
    // Page-specific initialization
    initializePageSpecific(pageName);
});

// Update page title based on current page
function updatePageTitle(pageName) {
    const titles = {
        'index.html': '🌱 No Waste Tracker - Намалете хранителните отпадъци',
        'dashboard.html': '📊 No Waste Tracker - Dashboard',
        'add-product.html': '➕ No Waste Tracker - Добави продукт',
        'stats.html': '📈 No Waste Tracker - Статистика',
        'recipes.html': '🍳 No Waste Tracker - Рецепти',
        '404.html': '🚫 No Waste Tracker - Страницата не е намерена'
    };
    
    const title = titles[pageName] || '🌱 No Waste Tracker';
    document.title = title;
}

// Initialize common features across all pages
function initializeCommonFeatures() {
    // Add smooth scrolling for anchor links
    initializeSmoothScrolling();
    
    // Add mobile menu functionality (if needed)
    initializeMobileMenu();
    
    // Add theme switching capability
    initializeThemeSwitching();
    
    // Add loading states
    initializeLoadingStates();
}

// Initialize smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize mobile menu (for future enhancement)
function initializeMobileMenu() {
    // This can be expanded when a mobile hamburger menu is added
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
}

// Initialize theme switching (dark/light mode)
function initializeThemeSwitching() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            
            // Save preference to localStorage
            const isLightTheme = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
            
            // Update button text
            themeToggle.textContent = isLightTheme ? '🌙' : '☀️';
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.textContent = '🌙';
        }
    }
}

// Initialize loading states
function initializeLoadingStates() {
    // Add loading state to all buttons that perform actions
    document.querySelectorAll('button[data-action]').forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.textContent;
            this.disabled = true;
            this.textContent = 'Зареждане...';
            
            // Reset after 3 seconds (in case of error)
            setTimeout(() => {
                this.disabled = false;
                this.textContent = originalText;
            }, 3000);
        });
    });
}

// Page-specific initialization
function initializePageSpecific(pageName) {
    switch(pageName) {
        case 'index.html':
            initializeLandingPage();
            break;
        case 'dashboard.html':
            // Dashboard is initialized by dashboard.js
            break;
        case 'add-product.html':
            // Add product page is initialized by add-product.js
            break;
        case 'stats.html':
            // Stats page is initialized by stats.js
            break;
        case 'recipes.html':
            // Recipes page is initialized by recipes.js
            break;
        case '404.html':
            initializeErrorPage();
            break;
        default:
            console.log('Unknown page:', pageName);
    }
}

// Landing page specific initialization
function initializeLandingPage() {
    // Add parallax effect to hero section (subtle)
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }
    
    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
}

// Error page specific initialization
function initializeErrorPage() {
    // Add some interactivity to the 404 page
    const errorCode = document.querySelector('.error-code');
    if (errorCode) {
        errorCode.addEventListener('click', function() {
            // Fun animation when clicking the 404
            this.style.transform = 'scale(0.8) rotate(360deg)';
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0deg)';
            }, 500);
        });
    }
}

// Utility functions for global use
window.appUtils = {
    // Show notification
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '1000',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // Set background color based on type
        const colors = {
            'success': '#27ae60',
            'error': '#e74c3c',
            'warning': '#f39c12',
            'info': '#3498db'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    },
    
    // Format date
    formatDate: function(dateString) {
        const date = new Date(dateString);
        const options = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        };
        return date.toLocaleDateString('bg-BG', options);
    },
    
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updatePageTitle,
        initializeCommonFeatures,
        appUtils
    };
}