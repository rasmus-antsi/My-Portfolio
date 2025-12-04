// Navigation Scroll Effect
const navigation = document.getElementById('navigation');
let isScrolled = false;

window.addEventListener('scroll', () => {
  if (window.scrollY > 50 && !isScrolled) {
    navigation.classList.add('scrolled');
    isScrolled = true;
  } else if (window.scrollY <= 50 && isScrolled) {
    navigation.classList.remove('scrolled');
    isScrolled = false;
  }
});

// Mobile Menu Toggle
let mobileMenuOpen = false;

function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  
  mobileMenuOpen = !mobileMenuOpen;
  
  if (mobileMenuOpen) {
    mobileMenu.classList.add('open');
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
  } else {
    mobileMenu.classList.remove('open');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  }
}

// Smooth Scroll to Section
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    toggleMobileMenu(); // Close mobile menu if open
  }
}

// Custom Cursor
const customCursor = document.getElementById('custom-cursor');
const customCursorDot = document.getElementById('custom-cursor-dot');
let cursorX = 0;
let cursorY = 0;
let isPointer = false;

// Check if device supports hover (desktop)
const isDesktop = window.matchMedia('(min-width: 768px)').matches && window.matchMedia('(hover: hover)').matches;

if (customCursor && customCursorDot && isDesktop) {
  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    if (customCursor) {
      customCursor.style.left = `${cursorX}px`;
      customCursor.style.top = `${cursorY}px`;
    }
    if (customCursorDot) {
      customCursorDot.style.left = `${cursorX}px`;
      customCursorDot.style.top = `${cursorY}px`;
    }
    
    const target = e.target;
    const computedStyle = window.getComputedStyle(target);
    const isClickable = computedStyle.cursor === 'pointer' || 
                       target.tagName === 'BUTTON' || 
                       target.tagName === 'A' ||
                       target.closest('button') ||
                       target.closest('a');
    
    if (isClickable && !isPointer) {
      customCursor?.classList.add('pointer');
      isPointer = true;
    } else if (!isClickable && isPointer) {
      customCursor?.classList.remove('pointer');
      isPointer = false;
    }
  });
}

// Particles Background - Optimized for mobile
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  
  // Detect mobile device
  const isMobile = window.innerWidth <= 767 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  const particles = [];
  // Reduce particle count on mobile for better performance
  const particleCount = isMobile ? 20 : 50;
  const mouse = { x: 0, y: 0 };
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
    });
  }
  
  // Mouse move handler
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  // Animation loop - optimized frame rate for mobile
  let lastTime = performance.now();
  const targetFPS = isMobile ? 30 : 60;
  const frameInterval = 1000 / targetFPS;
  
  const animate = (currentTime) => {
    const elapsed = currentTime - lastTime;
    
    if (elapsed < frameInterval) {
      requestAnimationFrame(animate);
      return;
    }
    lastTime = currentTime;
    
    ctx.fillStyle = isMobile ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle, i) => {
      // Move particle
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      
      // Mouse interaction - skip on mobile for performance
      if (!isMobile) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          particle.vx -= dx * 0.0001;
          particle.vy -= dy * 0.0001;
        }
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(82, 255, 168, ${isMobile ? 0.3 : 0.5})`;
      ctx.fill();
      
      // Draw connections - skip on mobile for performance
      if (!isMobile) {
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(82, 255, 168, ${0.2 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      }
    });
    
    requestAnimationFrame(animate);
  };
  
  // Start animation
  requestAnimationFrame(animate);
}

// Hero Section Animations
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('hero-title')?.classList.add('visible');
    document.getElementById('hero-description')?.classList.add('visible');
    document.getElementById('hero-icons')?.classList.add('visible');
    document.getElementById('hero-scroll')?.classList.add('visible');
  }, 100);
});

// Intersection Observer for Section Animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe sections
const sections = document.querySelectorAll('.about-left, .about-right, .work-header, .work-card, .work-footer, .skills-header, .skill-item, .skills-right, .contact-content');
sections.forEach((section) => {
  observer.observe(section);
});

// Language Switching
let currentLanguage = 'en';

function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'et' : 'en';
  updateLanguage();
  localStorage.setItem('language', currentLanguage);
}

function updateLanguage() {
  document.documentElement.lang = currentLanguage;
  
  // Update all elements with data-en and data-et attributes
  document.querySelectorAll('[data-en][data-et]').forEach((element) => {
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.value = element.getAttribute(`data-${currentLanguage}`);
    } else {
      element.textContent = element.getAttribute(`data-${currentLanguage}`);
    }
  });
  
  // Update title
  const title = document.querySelector('title');
  if (title && title.hasAttribute('data-en')) {
    title.textContent = title.getAttribute(`data-${currentLanguage}`);
  }
  
  // Update lang display
  const langDisplay = document.getElementById('lang-display');
  if (langDisplay) {
    langDisplay.textContent = currentLanguage.toUpperCase();
  }
}

// Load saved language preference
window.addEventListener('load', () => {
  const savedLang = localStorage.getItem('language');
  if (savedLang === 'et' || savedLang === 'en') {
    currentLanguage = savedLang;
  }
  updateLanguage();
});

// About Section Counting Animation
const aboutSection = document.getElementById('about');
const statProjects = document.getElementById('stat-projects');
const statYears = document.getElementById('stat-years');
const statClients = document.getElementById('stat-clients');
const statAwards = document.getElementById('stat-awards');

const aboutObserver = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      const targetValues = { projects: 100, years: 8, clients: 1, awards: 100 };
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;

        if (statProjects) {
          const value = Math.floor(targetValues.projects * progress);
          statProjects.textContent = value >= 100 ? '100+' : value;
        }
        if (statYears) {
          statYears.textContent = Math.floor(targetValues.years * progress);
        }
        if (statClients) {
          statClients.textContent = Math.floor(targetValues.clients * progress);
        }
        if (statAwards) {
          const value = Math.floor(targetValues.awards * progress);
          statAwards.textContent = value >= 100 ? '100+' : value;
        }

        if (step >= steps) {
          clearInterval(timer);
          if (statProjects) statProjects.textContent = '100+';
          if (statYears) statYears.textContent = targetValues.years;
          if (statClients) statClients.textContent = targetValues.clients;
          if (statAwards) statAwards.textContent = '100+';
        }
      }, interval);

      aboutObserver.disconnect();
    }
  },
  { threshold: 0.2 }
);

if (aboutSection) {
  aboutObserver.observe(aboutSection);
}

// Skills Section Progress Bar Animation
const skillsSection = document.getElementById('skills');
const skillItems = document.querySelectorAll('.skill-item');

const skillsObserver = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      skillItems.forEach((item, index) => {
        setTimeout(() => {
          const level = parseInt(item.dataset.level);
          const barFill = item.querySelector('.skill-bar-fill');
          const percentage = item.querySelector('.skill-percentage');
          
          if (barFill && percentage) {
            const duration = 1500;
            const steps = 60;
            const increment = level / steps;
            let currentStep = 0;

            const timer = setInterval(() => {
              currentStep++;
              const currentLevel = Math.min(increment * currentStep, level);
              
              barFill.style.width = `${currentLevel}%`;
              percentage.textContent = `${Math.round(currentLevel)}%`;

              if (currentStep >= steps) {
                clearInterval(timer);
                barFill.style.width = `${level}%`;
                percentage.textContent = `${level}%`;
              }
            }, duration / steps);
          }
        }, index * 100);
      });

      skillsObserver.disconnect();
    }
  },
  { threshold: 0.2 }
);

if (skillsSection) {
  skillsObserver.observe(skillsSection);
}

// Work Section Hover Effects
const workCards = document.querySelectorAll('.work-card');

workCards.forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.classList.add('hovered');
  });
  
  card.addEventListener('mouseleave', () => {
    card.classList.remove('hovered');
  });
});

// Tech Tags Animation Delay
const techTags = document.querySelectorAll('.tech-tag');
techTags.forEach((tag, index) => {
  tag.style.animationDelay = `${index * 50 + 500}ms`;
});

// Feature Cards Animation Delay
const featureCards = document.querySelectorAll('.about-feature-card');
featureCards.forEach((card, index) => {
  card.style.animationDelay = `${index * 100 + 300}ms`;
});

// Work Cards Animation Delay
workCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 150}ms`;
});

// Contact Social Items Animation Delay
const socialItems = document.querySelectorAll('.contact-social-item');
socialItems.forEach((item, index) => {
  item.style.animationDelay = `${index * 100 + 400}ms`;
});

