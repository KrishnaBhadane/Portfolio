document.addEventListener('DOMContentLoaded', () => {
  const sceneWrapper = document.getElementById('compositionContainer');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  const modals = {
    about: document.getElementById('modalAbout'),
    education: document.getElementById('modalEducation'),
    skills: document.getElementById('modalSkills'),
    projects: document.getElementById('modalProjects'),
    contact: document.getElementById('modalContact')
  };

  const desktopNavItems = document.querySelectorAll('.nav-item');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const dockItems = document.querySelectorAll('.dock-item');

  const updateActiveNav = (modalKey) => {
    desktopNavItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      item.classList.toggle('active', !!(link && link.dataset.modal === modalKey));
    });

    drawerLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.modal === modalKey);
    });

    dockItems.forEach(item => {
      item.classList.toggle('active', item.dataset.modal === modalKey);
    });
  };

  let toastTimer = null;
  const showToast = (message = 'Copied to clipboard!') => {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
  };

  const openDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('is-open');
    if (drawerBackdrop) drawerBackdrop.classList.add('is-open');
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.add('is-active');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('no-scroll');
  };

  const closeDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('is-open');
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.remove('is-active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('no-scroll');
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  let currentActiveModal = null;

  const openModal = (modalKey) => {
    closeDrawer();
    closeAllModals(false);

    const targetModal = modals[modalKey];
    if (targetModal) {
      currentActiveModal = targetModal;
      targetModal.classList.add('is-active');
      if (modalBackdrop) modalBackdrop.classList.add('is-active');
      document.body.classList.add('no-scroll');
      updateActiveNav(modalKey);
    }
  };

  const closeAllModals = (resetNav = true) => {
    Object.values(modals).forEach(modal => {
      if (modal) modal.classList.remove('is-active');
    });
    if (modalBackdrop) modalBackdrop.classList.remove('is-active');
    currentActiveModal = null;
    document.body.classList.remove('no-scroll');
    if (resetNav) {
      updateActiveNav('home');
    }
  };

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeAllModals(true));
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', () => closeAllModals(true));
  }

  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const modalKey = trigger.dataset.modal;
      if (modalKey) {
        e.preventDefault();
        if (modalKey === 'home') {
          closeDrawer();
          closeAllModals(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          openModal(modalKey);
        }
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (currentActiveModal) {
        closeAllModals(true);
      } else if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
        closeDrawer();
      }
    }
  });

  const copyEmailBtn = document.getElementById('btnCopyEmail');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'krishnabhadane0@gmail.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = email;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        showToast('Email copied to clipboard!');
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  const downloadBtn = document.getElementById('btn-download-cv');
  const cvBtnText = document.getElementById('cvBtnText');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (cvBtnText) {
        const originalText = cvBtnText.textContent;
        cvBtnText.textContent = 'Downloading...';
        setTimeout(() => {
          cvBtnText.textContent = 'CV Downloaded!';
          showToast('Krushna_Bhadane_Resume.pdf prepared!');
          setTimeout(() => {
            cvBtnText.textContent = originalText;
          }, 2500);
        }, 800);
      }
    });
  }

  if (sceneWrapper && window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 992) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('mouseleave', () => {
      mouseX = 0;
      mouseY = 0;
    });

    const animateParallax = () => {
      if (window.innerWidth >= 992) {
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;

        const rotateY = currentX * 6.5;
        const rotateX = -currentY * 6.5;
        const translateX = currentX * 10;
        const translateY = currentY * 10;

        sceneWrapper.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0)`;
      } else {
        sceneWrapper.style.transform = 'none';
      }

      requestAnimationFrame(animateParallax);
    };

    animateParallax();
  }
});
