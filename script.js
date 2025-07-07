// Hamburger menu functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a');

function toggleMenu() {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('toggle'); 
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMenu);

// Close menu when clicking on navigation links
links.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
            document.body.style.overflow = '';
        }
    });
});

// Close menu when clicking outside of it
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('toggle');
        document.body.style.overflow = '';
    }
});

// Hero Background Slider with Smooth Crossfade Effect
const heroSection = document.querySelector('.hero');
const heroBackgrounds = [
    'images/slide1.jpg',
    'images/slide2.jpg',
    'images/slide3.jpg'
];
const heroDots = document.querySelectorAll('.hero-dot');
let currentHeroBgIndex = 0;
let heroBgSliderInterval;

// Create multiple background layers for ultra-smooth crossfade
function createMultiLayerHeroSlider() {
    const heroContainer = document.querySelector('.hero');
    
    // Create background layers for each image
    const bgLayers = heroBackgrounds.map((bg, index) => {
        const layer = document.createElement('div');
        layer.className = `hero-bg-layer hero-bg-${index}`;
        layer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('${bg}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            opacity: ${index === 0 ? 1 : 0};
            transition: opacity 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: ${-index - 1};
            pointer-events: none;
            will-change: opacity;
        `;
        heroContainer.appendChild(layer);
        return layer;
    });
    
    let currentLayerIndex = 0;
    
    function crossfadeToNext() {
        const nextIndex = (currentLayerIndex + 1) % bgLayers.length;
        
        // Update dots with smooth animation
        heroDots.forEach(dot => dot.classList.remove('active'));
        heroDots[nextIndex].classList.add('active');
        
        // Smooth crossfade: fade out current, fade in next
        bgLayers[currentLayerIndex].style.opacity = '0';
        bgLayers[nextIndex].style.opacity = '1';
        
        currentLayerIndex = nextIndex;
    }
    
    function crossfadeToIndex(targetIndex) {
        if (targetIndex !== currentLayerIndex) {
            // Update dots
            heroDots.forEach(dot => dot.classList.remove('active'));
            heroDots[targetIndex].classList.add('active');
            
            // Fade out current
            bgLayers[currentLayerIndex].style.opacity = '0';
            // Fade in target
            bgLayers[targetIndex].style.opacity = '1';
            
            currentLayerIndex = targetIndex;
        }
    }
    
    return { crossfadeToNext, crossfadeToIndex };
}

// Initialize hero slider
function initHeroSlider() {
    if (!heroSection || heroDots.length === 0) return;
    
    // Preload images first
    preloadHeroImages();
    
    // Create multi-layer slider
    const slider = createMultiLayerHeroSlider();
    
    // Set initial state
    heroDots[0].classList.add('active');
    
    // Start auto-slider
    function startHeroBgSlider() {
        heroBgSliderInterval = setInterval(slider.crossfadeToNext, 6000);
    }
    
    function resetHeroBgSlider() {
        clearInterval(heroBgSliderInterval);
        startHeroBgSlider();
    }
    
    // Dot click handlers
    heroDots.forEach(dot => {
        dot.addEventListener('click', (event) => {
            const bgIndex = parseInt(event.target.dataset.slide);
            slider.crossfadeToIndex(bgIndex);
            resetHeroBgSlider();
        });
    });
    
    // Start after a brief delay
    setTimeout(startHeroBgSlider, 4000);
}

// Preload images for smooth transitions
function preloadHeroImages() {
    heroBackgrounds.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Enhanced scroll animations with staggered effect
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal');
            
            // Staggered animation for project items
            if (entry.target.classList.contains('projects-container')) {
                const projectItems = entry.target.querySelectorAll('.project-item');
                projectItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, index * 150);
                });
            }
        }
    });
}, observerOptions);

// Observe all scroll-hidden elements
document.querySelectorAll('.scroll-hidden').forEach(el => {
    observer.observe(el);
});

// Header scroll behavior
let lastScrollY = 0;
let ticking = false;

function updateHeader() {
    const scrollY = window.scrollY;
    const header = document.querySelector('header');

    if (scrollY > lastScrollY && scrollY > 100) {
        header.classList.add('header-hidden');
        header.classList.remove('header-visible');
    } else {
        header.classList.remove('header-hidden');
        header.classList.add('header-visible');
    }

    lastScrollY = scrollY;
    ticking = false;
}

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// CTA Button click handler
document.querySelector('.cta-button').addEventListener('click', function() {
    this.style.animation = 'pulse 0.6s ease-in-out';
    
    setTimeout(() => {
        this.style.animation = '';
    }, 600);
    
    document.querySelector('.projects-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Parallax effect for hero section
function parallaxScroll() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }
}

window.addEventListener('scroll', parallaxScroll);

// Enhanced project item hover effects
document.querySelectorAll('.project-item').forEach(item => {
    const overlay = item.querySelector('.project-overlay');
    const image = item.querySelector('.content-embed');
    
    item.addEventListener('mouseenter', () => {
        if (image) {
            image.style.transform = 'scale(1.1)';
            image.style.filter = 'brightness(0.7)';
        }
    });
    
    item.addEventListener('mouseleave', () => {
        if (image) {
            image.style.transform = 'scale(1)';
            image.style.filter = 'brightness(1)';
        }
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
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

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
    
    // Initialize hero slider
    initHeroSlider();
    
    // Add intersection observer for projects section
    const projectsSection = document.querySelector('.projects-section');
    if (projectsSection) {
        observer.observe(projectsSection);
    }
});

// Handle window resize
window.addEventListener('resize', throttle(() => {
    if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('toggle');
        document.body.style.overflow = '';
    }
}, 250));

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        toggleMenu();
    }
});

// Video autoplay on scroll
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
            video.play();
        } else {
            video.pause();
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('video').forEach(video => {
    videoObserver.observe(video);
});