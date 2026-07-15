// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Scroll-spy: highlight the nav link for the section in view
const sections = document.querySelectorAll('main .section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    });
  },
  { rootMargin: '-50% 0px -50% 0px' }
);

sections.forEach((section) => spyObserver.observe(section));

// Reveal-on-scroll for cards and timeline items
const revealTargets = document.querySelectorAll('.card, .timeline-item');
revealTargets.forEach((el) => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealTargets.forEach((el) => revealObserver.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Project video/image modal
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoModalPlayer');
const modalImage = document.getElementById('videoModalImage');

function openVideoModal(src) {
  modalImage.hidden = true;
  modalImage.removeAttribute('src');
  videoPlayer.hidden = false;
  videoPlayer.src = src;
  videoModal.hidden = false;
  document.body.style.overflow = 'hidden';
  videoPlayer.play().catch(() => {});
}

function openImageModal(src) {
  videoPlayer.hidden = true;
  videoPlayer.pause();
  videoPlayer.removeAttribute('src');
  videoPlayer.load();
  modalImage.hidden = false;
  modalImage.src = src;
  videoModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  videoModal.hidden = true;
  videoPlayer.pause();
  videoPlayer.removeAttribute('src');
  videoPlayer.load();
  modalImage.removeAttribute('src');
  document.body.style.overflow = '';
}

document.querySelectorAll('.card-link[data-video], .card-link[data-image]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    if (link.dataset.video) {
      openVideoModal(link.dataset.video);
    } else {
      openImageModal(link.dataset.image);
    }
  });
});

videoModal.querySelectorAll('[data-close-modal]').forEach((el) => {
  el.addEventListener('click', closeVideoModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !videoModal.hidden) closeVideoModal();
});
