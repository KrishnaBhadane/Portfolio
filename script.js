/* ===========================
   PORTFOLIO SCRIPT
   =========================== */

// ── Navbar Scroll ──────────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── Active nav link highlight ───────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const highlightNav = () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
};
window.addEventListener('scroll', highlightNav);

// ── Mobile Hamburger ────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
});

// Close mobile menu when a link is clicked
navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksContainer.classList.remove('open');
  });
});

// ── Intersection Observer – General Fade-Up ────────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-up');
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
fadeEls.forEach(el => fadeObserver.observe(el));

// ── Intersection Observer – Timeline Items ─────────────────────────────────────
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        timelineObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
timelineItems.forEach((item, i) => {
  // Cascade delay
  item.style.transitionDelay = `${i * 0.12}s`;
  timelineObserver.observe(item);
});

// ── Skill Bar Animations ────────────────────────────────────────────────────────
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);
skillFills.forEach(fill => skillObserver.observe(fill));

// ── Scroll-reveal for cards (project, creative, skill category) ────────────────
const revealCards = document.querySelectorAll(
  '.project-card, .creative-card, .creative-highlight, .skill-category-card, .stat-card'
);
const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealCards.forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(28px)';
  card.style.transition = `opacity 0.55s ease ${(i % 6) * 0.08}s, transform 0.55s ease ${(i % 6) * 0.08}s, border-color 0.3s, box-shadow 0.3s`;
  cardObserver.observe(card);
});

// ── Contact Form (Formspree) ────────────────────────────────────────────────────
// ⚠️  Replace YOUR_FORM_ID below with the ID from your Formspree dashboard
//     e.g. if your endpoint is https://formspree.io/f/xpwzabcd → use "xpwzabcd"
const FORMSPREE_ID = 'mbdqjvvv';

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide any previous status
    formSuccess.classList.remove('show');
    formError.classList.remove('show');

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Client-side validation
    if (!name || !email || !message) { shakeForm(); return; }
    if (!isValidEmail(email)) {
      const emailInput = document.getElementById('email');
      emailInput.style.borderColor = '#ef4444';
      emailInput.focus();
      setTimeout(() => { emailInput.style.borderColor = ''; }, 2000);
      return;
    }

    // Sync hidden _replyto so Formspree lets you reply directly to sender
    document.getElementById('replyto').value = email;

    // Send to Formspree
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      });

      if (response.ok) {
        contactForm.reset();
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      } else {
        formError.classList.add('show');
        setTimeout(() => formError.classList.remove('show'), 6000);
      }
    } catch (_) {
      formError.classList.add('show');
      setTimeout(() => formError.classList.remove('show'), 6000);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm() {
  contactForm.style.animation = 'shake 0.4s ease';
  setTimeout(() => { contactForm.style.animation = ''; }, 400);
}

// Shake keyframes injected via JS (avoids extra CSS)
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
  @keyframes fa-spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .fa-spin-slow { animation: fa-spin-slow 4s linear infinite; }
`;
document.head.appendChild(shakeStyle);

// ── Smooth typing cursor on hero name ─────────────────────────────────────────
const heroName = document.querySelector('.hero-name');
if (heroName) {
  // Add subtle glow hover on hero name
  heroName.addEventListener('mouseenter', () => {
    heroName.style.filter = 'drop-shadow(0 0 20px rgba(99,102,241,0.4))';
  });
  heroName.addEventListener('mouseleave', () => {
    heroName.style.filter = '';
  });
}

// ── Scroll Top Button (auto-created) ──────────────────────────────────────────
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
scrollTopBtn.setAttribute('id', 'scrollTopBtn');
scrollTopBtn.style.cssText = `
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #06b6d4);
  border: none;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  z-index: 999;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s;
  box-shadow: 0 4px 20px rgba(99,102,241,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollTopBtn.style.opacity = '1';
    scrollTopBtn.style.transform = 'scale(1)';
  } else {
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.transform = 'scale(0.8)';
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

scrollTopBtn.addEventListener('mouseenter', () => {
  scrollTopBtn.style.boxShadow = '0 8px 30px rgba(99,102,241,0.6)';
  scrollTopBtn.style.transform = 'scale(1.1)';
});
scrollTopBtn.addEventListener('mouseleave', () => {
  scrollTopBtn.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)';
  scrollTopBtn.style.transform = 'scale(1)';
});

// ── Init: trigger hero animations on load ─────────────────────────────────────
window.addEventListener('load', () => {
  // Hero fade-up elements already handled by observer
  // Animate hero elements that are immediately visible
  document.querySelectorAll('.hero .fade-up').forEach(el => {
    // Small offset to ensure they appear on load
    setTimeout(() => el.classList.add('visible'), 100);
  });
});
