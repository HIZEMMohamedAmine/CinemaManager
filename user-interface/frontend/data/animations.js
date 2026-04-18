// ============================================
// CINEMAX — Shared Animation Utilities
// ============================================

(function () {
  'use strict';

  // ─── Scroll Reveal with Intersection Observer ───
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Stagger the animations
            const delay = entry.target.dataset.delay || index * 80;
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, Math.min(delay, 600));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // ─── Navbar Scroll Shrink Effect ───
  function initNavbarScroll() {
    const topBar = document.querySelector('.top-bar');
    if (!topBar) return;

    let lastScrollY = 0;
    let ticking = false;

    function onScroll() {
      lastScrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          if (lastScrollY > 60) {
            topBar.classList.add('scrolled');
          } else {
            topBar.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ─── Particle System ───
  function initParticles(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const particleCount = 25;
    const particlesWrapper = document.createElement('div');
    particlesWrapper.className = 'particles-container';
    particlesWrapper.style.cssText = `
      position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1;
    `;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 4 + 1;
      const x = Math.random() * 100;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 15;
      const opacity = Math.random() * 0.4 + 0.1;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${Math.random() > 0.5 ? 'rgba(0, 217, 255, ' + opacity + ')' : 'rgba(168, 85, 247, ' + opacity + ')'};
        border-radius: 50%;
        left: ${x}%;
        bottom: -10px;
        animation: particleFloat ${duration}s linear ${delay}s infinite;
        box-shadow: 0 0 ${size * 3}px ${Math.random() > 0.5 ? 'rgba(0, 217, 255, 0.3)' : 'rgba(168, 85, 247, 0.2)'};
      `;
      particlesWrapper.appendChild(particle);
    }

    container.style.position = 'relative';
    container.appendChild(particlesWrapper);

    // Add particle CSS if not already added
    if (!document.getElementById('particle-styles')) {
      const style = document.createElement('style');
      style.id = 'particle-styles';
      style.textContent = `
        @keyframes particleFloat {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px) rotate(360deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ─── Smooth Number Counter ───
  function animateCounter(element, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;

      if (Number.isInteger(target)) {
        element.textContent = Math.round(current);
      } else {
        element.textContent = current.toFixed(1);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ─── Page Load Transition ───
  function initPageTransition() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease-in-out';

    window.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(() => {
        document.body.style.opacity = '1';
      });
    });
  }

  // ─── Movie Card Stagger Animation ───
  function initCardStagger() {
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach((card, i) => {
      card.style.animationDelay = `${i * 0.08}s`;
    });
  }

  // ─── Shared Auth State UI ───
  function initAuthState() {
    const authContainers = document.querySelectorAll('.auth-buttons');
    if (!authContainers.length) return;

    const userSession = window.localStorage.getItem('userSession');
    if (userSession) {
      try {
        const user = JSON.parse(userSession);
        if (user && user.username) {
          const content = `
            <div style="display: flex; align-items: center; gap: 15px;">
              <span style="color: white; font-weight: 500;">Welcome, ${user.username}</span>
              <a href="../history/history.html" class="btn" style="background: rgba(168, 85, 247, 0.1); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.3); padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-weight: 600;">My Bookings</a>
              <button class="btn btn-login" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.5rem 1.25rem;" onclick="localStorage.removeItem('userSession'); window.location.reload();">Logout</button>
            </div>
          `;
          authContainers.forEach(container => {
            container.innerHTML = content;
          });
        }
      } catch(e) {}
    }
  }

  // ─── Initialize Everything ───
  function init() {
    initNavbarScroll();
    initCardStagger();
    initAuthState();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initScrollReveal();
      });
    } else {
      initScrollReveal();
    }
  }

  // Export for use in other scripts
  window.CineMaxAnimations = {
    initScrollReveal,
    initNavbarScroll,
    initParticles,
    animateCounter,
    initPageTransition,
    initCardStagger,
    initAuthState
  };

  init();
})();
