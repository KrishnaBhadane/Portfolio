// ==========================================================================
// KRUSHNA BHADANE - INTERACTIVE UI & 3D PARALLAX
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const sceneWrapper = document.getElementById('compositionContainer');
  const navItems = document.querySelectorAll('.nav-item');

  // --- Interactive Navigation Tabs ---
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // --- 3D Scene Mouse Parallax & Tilt Effect for Hero ---
  if (sceneWrapper && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX / innerWidth - 0.5) * 2;
      mouseY = (e.clientY / innerHeight - 0.5) * 2;
    });

    const animateParallax = () => {
      // Smooth interpolation (lerp)
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      const rotateY = currentX * 7;
      const rotateX = -currentY * 7;
      const translateX = currentX * 10;
      const translateY = currentY * 10;

      sceneWrapper.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0)`;

      requestAnimationFrame(animateParallax);
    };

    animateParallax();
  }

  // --- Download CV Button Feedback ---
  const downloadBtn = document.getElementById('btn-download-cv');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      const span = downloadBtn.querySelector('span');
      if (span) {
        const originalText = span.innerText;
        span.innerText = 'Downloading...';
        setTimeout(() => {
          span.innerText = 'CV Downloaded!';
          setTimeout(() => {
            span.innerText = originalText;
          }, 2500);
        }, 1000);
      }
    });
  }
});
