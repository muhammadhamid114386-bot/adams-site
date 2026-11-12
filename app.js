(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const form = document.querySelector('#guide-form');
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('[type="submit"]');
  const allowedUrl = (value) => {
    if (!value || typeof value !== 'string') return '';
    try {
      const url = new URL(value, window.location.href);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  };

  document.querySelectorAll('a[href="#get-guide"]').forEach((link) => {
    link.addEventListener('click', () => {
      const section = document.querySelector('#get-guide');
      // Move keyboard focus without interrupting the browser's native anchor scroll.
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
    });
  });

  const preferred = { day: 'Thursday', time: '1:30 PM' };
  const calendar = document.querySelector('.calendar-card');
  calendar.querySelectorAll('[data-day], [data-time]').forEach((button) => {
    button.addEventListener('click', () => {
      const kind = button.hasAttribute('data-day') ? 'day' : 'time';
      preferred[kind] = button.dataset[kind];
      calendar.querySelectorAll(`[data-${kind}]`).forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      const message = calendar.querySelector('.calendar-status');
      message.textContent = `Preferred: ${preferred.day}, ${preferred.time}. ${allowedUrl(config.bookingUrl) ? 'Continue to confirm availability.' : 'Request the guide first to arrange a conversation. This is not a confirmed booking.'}`;
      message.hidden = false;
    });
  });
  if (allowedUrl(config.bookingUrl)) {
    const booking = calendar.querySelector('.booking-link');
    booking.href = allowedUrl(config.bookingUrl);
    booking.target = '_blank';
    booking.rel = 'noopener noreferrer';
    booking.hidden = false;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    status.hidden = true;
    const fields = new FormData(form);
    if (fields.get('website')) return;
    const lead = {
      firstName: String(fields.get('firstName') || '').trim(),
      email: String(fields.get('email') || '').trim(),
      town: String(fields.get('town') || '').trim(),
      preferredDay: preferred.day,
      preferredTime: preferred.time
    };
    if (!lead.firstName || !lead.town) {
      status.textContent = 'Please enter your first name and town.';
      status.hidden = false;
      return;
    }
    const endpoint = allowedUrl(config.formEndpoint);
    let guideUrl = allowedUrl(config.guideUrl);
    if (!endpoint && !guideUrl) {
      status.textContent = 'Guide requests are not available just yet. Please check back soon. Your details have not been sent.';
      status.hidden = false;
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Getting your guide…';
    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(lead),
          signal: AbortSignal.timeout(15000)
        });
        if (!response.ok) throw new Error('request_failed');
        const result = response.headers.get('content-type')?.includes('application/json') ? await response.json() : {};
        guideUrl = allowedUrl(result.guideUrl) || guideUrl;
      }
      const success = document.querySelector('.guide-success');
      const download = success.querySelector('.download-guide');
      if (guideUrl) {
        download.href = guideUrl;
        download.target = '_blank';
        download.rel = 'noopener noreferrer';
        download.hidden = false;
      } else {
        success.querySelector('h3').textContent = 'Thank you for your request.';
        success.querySelector('p').textContent = 'Your details have been sent. Look out for your guide by email.';
        download.hidden = true;
      }
      const bookingUrl = allowedUrl(config.bookingUrl);
      if (bookingUrl) {
        const booking = success.querySelector('.success-booking');
        booking.href = bookingUrl;
        booking.target = '_blank';
        booking.rel = 'noopener noreferrer';
        booking.hidden = false;
      }
      form.hidden = true;
      success.hidden = false;
      success.setAttribute('tabindex', '-1');
      success.focus({ preventScroll: true });
    } catch {
      status.textContent = 'We couldn’t complete your request. Please try again in a moment.';
      status.hidden = false;
    } finally {
      submit.disabled = false;
      submit.textContent = 'Get My Free Guide';
    }
  });

  const videoDialog = document.querySelector('#video-dialog');
  document.querySelector('[data-video-open]').addEventListener('click', () => {
    const url = allowedUrl(config.heroVideoUrl);
    const content = videoDialog.querySelector('.video-content');
    if (url && !content.querySelector('video')) {
      const video = document.createElement('video');
      video.src = url;
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      content.append(video);
    }
    videoDialog.querySelector('.video-unavailable').hidden = Boolean(url);
    videoDialog.showModal();
    const video = content.querySelector('video');
    if (video) video.play().catch(() => {});
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
