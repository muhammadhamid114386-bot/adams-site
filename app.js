(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const allowedUrl = (value) => {
    if (!value || typeof value !== 'string') return '';
    try {
      const url = new URL(value, window.location.href);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  };

  const heroPlayer = document.querySelector('#hero-vsl');
  heroPlayer.setAttribute('poster', new URL(heroPlayer.dataset.poster, document.baseURI).href);

  document.querySelectorAll('a[href="#get-guide"]').forEach((link) => {
    link.addEventListener('click', () => {
      const section = document.querySelector('#get-guide');
      // Move keyboard focus without interrupting the browser's native anchor scroll.
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
    });
  });

  const privacyDialog = document.querySelector('#privacy-dialog');
  document.querySelector('[data-privacy-open]').addEventListener('click', (event) => {
    const url = allowedUrl(config.privacyPolicyUrl);
    if (url) { event.currentTarget.href = url; return; }
    event.preventDefault();
    privacyDialog.showModal();
  });
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.querySelector('[data-dialog-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      dialog.querySelector('video')?.pause();
      document.body.style.overflow = '';
    });
  });
  const observer = new MutationObserver(() => {
    document.body.style.overflow = document.querySelector('dialog[open]') ? 'hidden' : '';
  });
  document.querySelectorAll('dialog').forEach((dialog) => observer.observe(dialog, { attributes: true, attributeFilter: ['open'] }));

  const storyPhone = document.querySelector('.adam-phone');
  const storyVideo = document.querySelector('#adam-story-video');
  const storyTrigger = document.querySelector('.adam-phone-trigger');
  const storyStop = document.querySelector('[data-adam-stop]');
  const storyError = document.querySelector('.adam-inline-error');
  const storyUrl = allowedUrl(config.adamStoryVideoUrl) || storyVideo.getAttribute('src');
  const storyPoster = allowedUrl(config.adamStoryPosterUrl);
  if (storyPoster) {
    document.querySelector('.adam-poster').src = storyPoster;
    storyVideo.poster = storyPoster;
  }
  document.querySelectorAll('[data-adam-story]').forEach((button) => {
    button.addEventListener('click', () => {
      if (storyVideo.src !== new URL(storyUrl, location.href).href) storyVideo.src = storyUrl;
      if (storyVideo.error) storyVideo.load();
      storyError.hidden = true;
      storyVideo.hidden = false;
      storyTrigger.hidden = true;
      storyStop.hidden = false;
      storyPhone.classList.add('adam-phone-playing');
      storyVideo.play().catch((error) => {
        // Native controls remain available if the browser requires another tap.
        if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') storyError.hidden = false;
      });
      if (!storyPhone.contains(button)) {
        storyPhone.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      }
      storyVideo.focus({ preventScroll: true });
    });
  });
  const stopStory = () => {
    storyVideo.pause();
    if (storyVideo.readyState) storyVideo.currentTime = 0;
    storyVideo.hidden = true;
    storyTrigger.hidden = false;
    storyStop.hidden = true;
    storyError.hidden = true;
    storyPhone.classList.remove('adam-phone-playing');
    storyTrigger.focus({ preventScroll: true });
  };
  storyStop.addEventListener('click', stopStory);
  storyPhone.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !storyVideo.hidden && !document.fullscreenElement) {
      event.preventDefault();
      stopStory();
    }
  });
  storyVideo.addEventListener('error', () => { if (!storyVideo.hidden) storyError.hidden = false; });

  const steps = [...document.querySelectorAll('.planning .step')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    let stepObserver;
    try {
      let nextRevealAt = 0;
      stepObserver = new IntersectionObserver((entries) => {
        entries.filter((entry) => entry.isIntersecting)
          .sort((a, b) => steps.indexOf(a.target) - steps.indexOf(b.target))
          .forEach(({ target }) => {
            const now = performance.now();
            const delay = Math.max(0, nextRevealAt - now);
            target.style.transitionDelay = `${delay}ms`;
            target.classList.add('is-visible');
            nextRevealAt = now + delay + 180;
            stepObserver.unobserve(target);
          });
      }, { threshold: 0.2, rootMargin: '0px 0px -12% 0px' });
      steps.forEach((step) => {
        step.classList.add('will-reveal');
        stepObserver.observe(step);
      });
      reducedMotion.addEventListener('change', ({ matches }) => {
        if (!matches) return;
        stepObserver.disconnect();
        steps.forEach((step) => step.classList.remove('will-reveal'));
      });
    } catch {
      stepObserver?.disconnect();
      steps.forEach((step) => step.classList.remove('will-reveal'));
    }
  }

  const aboutReveals = [...document.querySelectorAll('.adam-section [data-adam-reveal]')];
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    let aboutObserver;
    try {
      aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (!isIntersecting) return;
          target.classList.add('adam-revealed');
          aboutObserver.unobserve(target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
      aboutReveals.forEach((element) => {
        element.classList.add('adam-reveal');
        aboutObserver.observe(element);
      });
      reducedMotion.addEventListener('change', ({ matches }) => {
        if (!matches) return;
        aboutObserver.disconnect();
        aboutReveals.forEach((element) => element.classList.remove('adam-reveal'));
      });
    } catch {
      aboutObserver?.disconnect();
      aboutReveals.forEach((element) => element.classList.remove('adam-reveal'));
    }
  }
})();
