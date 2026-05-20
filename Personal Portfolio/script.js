/* ────────────────────────────────
   THEME TOGGLE
──────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('resume-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('resume-theme', next);
});

/* ────────────────────────────────
   NAVBAR — SCROLL SHADOW
──────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ────────────────────────────────
   HAMBURGER MENU
──────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMobile  = document.getElementById('navMobile');
const mobileLinks = navMobile.querySelectorAll('.nav-mobile-link');

function openMenu() {
  hamburger.setAttribute('aria-expanded', 'true');
  navMobile.classList.add('open');
  navMobile.setAttribute('aria-hidden', 'false');
  mobileLinks.forEach(l => l.setAttribute('tabindex', '0'));
}

function closeMenu() {
  hamburger.setAttribute('aria-expanded', 'false');
  navMobile.classList.remove('open');
  navMobile.setAttribute('aria-hidden', 'true');
  mobileLinks.forEach(l => l.setAttribute('tabindex', '-1'));
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
  isOpen ? closeMenu() : openMenu();
});

// Close on mobile link click
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
    hamburger.focus();
  });
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// Close when clicking outside
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) closeMenu();
});

/* ────────────────────────────────
   ACTIVE NAV LINK — INTERSECTION
──────────────────────────────── */
const navLinks   = document.querySelectorAll('.nav-link');
const sections   = document.querySelectorAll('[id^="section-"]');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id.replace('section-', '');
      navLinks.forEach(l => {
        const match = l.dataset.section === id;
        l.classList.toggle('active', match);
      });
      mobileLinks.forEach(l => {
        const href = l.getAttribute('href');
        l.classList.toggle('active', href === `#section-${id}`);
      });
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(s => activeObserver.observe(s));

/* ────────────────────────────────
   SMOOTH SCROLL for nav links
──────────────────────────────── */
document.querySelectorAll('a[href^="#section-"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = navbar.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ────────────────────────────────
   INTERSECTION OBSERVER — REVEALS
──────────────────────────────── */
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

/* ────────────────────────────────
   SKILL BARS — ANIMATE ON VISIBLE
──────────────────────────────── */
const skillSection = document.querySelector('.skills-grid');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach((fill, i) => {
        setTimeout(() => {
          fill.style.width = fill.style.getPropertyValue('--w');
        }, i * 80);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

if (skillSection) skillObserver.observe(skillSection);

/* ────────────────────────────────
   CURSOR GLOW (DESKTOP)
──────────────────────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; width:300px; height:300px; border-radius:50%;
    pointer-events:none; z-index:0;
    background:radial-gradient(circle, rgba(94,162,255,.04) 0%, transparent 70%);
    transform:translate(-50%,-50%);
    transition:left .15s ease, top .15s ease;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

/* ────────────────────────────────
   TILT EFFECT ON PROJECT CARDS
──────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform   = `translateY(-2px) rotateX(${-y*4}deg) rotateY(${x*4}deg)`;
    card.style.transition  = 'transform .1s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform .4s ease, border-color .2s, background .2s';
  });
});

/* ────────────────────────────────
   TYPED TITLE EFFECT
──────────────────────────────── */
const titleEl = document.querySelector('.header-title');
if (titleEl) {
  const titles = [
    'Web Designer & IT Student',
    'Frontend Developer',
    'UI/UX Enthusiast',
    'Network Learner',
  ];
  let ti = 0, ci = 0, deleting = false;
  function typeEffect() {
    const current = titles[ti];
    if (deleting) {
      titleEl.textContent = current.substring(0, ci--);
      if (ci < 0) { deleting = false; ti = (ti + 1) % titles.length; ci = 0; setTimeout(typeEffect, 400); return; }
      setTimeout(typeEffect, 40);
    } else {
      titleEl.textContent = current.substring(0, ci++);
      if (ci > current.length) { deleting = true; setTimeout(typeEffect, 2000); return; }
      setTimeout(typeEffect, 70);
    }
  }
  setTimeout(typeEffect, 1500);
}
