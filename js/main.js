/**
 * APHRODITE Portfolio - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('nav-open');
    });

    // Close mobile nav when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('nav-open');
      });
    });
  }

  // 2. Active Link on Scroll
  const sections = document.querySelectorAll('section[id], header[id]');
  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 3. Search Button Interaction
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const query = prompt('Enter search keyword:');
      if (query && query.trim()) {
        alert(`Searching portfolio for: "${query.trim()}"`);
      }
    });
  }

  // 4. Utility for Image Injection:
  window.setPortfolioImage = function(slotName, imagePath, altText = '') {
    const slot = document.querySelector(`[data-slot="${slotName}"]`);
    if (!slot) {
      console.warn(`[APHRODITE Portfolio] Slot "${slotName}" not found.`);
      return false;
    }

    // If it's a background slot (like bio-bg)
    if (slot.classList.contains('bio-bg-placeholder')) {
      slot.style.backgroundImage = `linear-gradient(135deg, rgba(20, 16, 18, 0.75) 0%, rgba(35, 25, 30, 0.65) 100%), url('${imagePath}')`;
      slot.style.backgroundSize = 'cover';
      slot.style.backgroundPosition = 'center';
      return true;
    }

    // For standard image slots
    let img = slot.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      slot.appendChild(img);
    }
    img.src = imagePath;
    img.alt = altText || slotName;
    slot.classList.add('has-image');
    return true;
  };

  // 5. Dynamic Scrolling Watermark Controller
  function initDynamicScrollWatermark() {
    const watermark = document.getElementById('dynamic-scroll-watermark');
    if (!watermark) return;

    const sections = [
      { id: 'home', class: 'section-hero' },
      { id: 'about', class: 'section-about' },
      { id: 'gallery', class: 'section-gallery' },
      { id: 'profile', class: 'section-profile' }
    ];

    let currentSectionClass = 'section-hero';
    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let currentX = 0;
    let currentY = 0;

    // Track cursor movement for interactive drift
    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) - 0.5;
      const normY = (e.clientY / window.innerHeight) - 0.5;
      mouseTargetX = normX * 30; // Max 30px lateral float
      mouseTargetY = normY * 35; // Max 35px vertical drift with cursor
    }, { passive: true });

    // Detect active section to dynamically shift colors
    function updateSectionPalette() {
      const scrollMid = window.pageYOffset + (window.innerHeight * 0.38);

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollMid >= top) {
            if (currentSectionClass !== sections[i].class) {
              sections.forEach(s => watermark.classList.remove(s.class));
              watermark.classList.add(sections[i].class);
              currentSectionClass = sections[i].class;
            }
            break;
          }
        }
      }
    }

    // High-performance requestAnimationFrame loop for liquid smooth physics
    function animateWatermark() {
      // Lerp smooth damping
      currentX += (mouseTargetX - currentX) * 0.07;
      currentY += (mouseTargetY - currentY) * 0.07;

      // Vertical scroll displacement: moves down through sections with scroll velocity
      const scrollY = window.pageYOffset;
      const verticalScrollDrift = Math.sin(scrollY * 0.0018) * 8;

      watermark.style.transform = `translate3d(calc(-50% + ${currentX.toFixed(2)}px), calc(-50% + ${(currentY + verticalScrollDrift).toFixed(2)}px), 0)`;

      requestAnimationFrame(animateWatermark);
    }

    window.addEventListener('scroll', updateSectionPalette, { passive: true });
    updateSectionPalette();
    animateWatermark();
  }

  // 6. Scroll Reveal Controller (Tailwind Staggered Cascades)
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || 0, 10);
          setTimeout(() => {
            el.classList.add('is-revealed');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // 7. Interactive Accents (Subtle 3D Tilt on Profile Card)
  function initInteractiveAccents() {
    const card = document.querySelector('.showcase-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);
      const tiltX = (y / rect.height) * -3;
      const tiltY = (x / rect.width) * 3;
      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  }

  // Initialize all motion modules
  initDynamicScrollWatermark();
  initScrollReveal();
  initInteractiveAccents();

  console.log('APHRODITE Portfolio - Modern Motion & Tailwind engine active.');
});
