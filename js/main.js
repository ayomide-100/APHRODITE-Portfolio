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

  console.log('APHRODITE Portfolio loaded.');
});
