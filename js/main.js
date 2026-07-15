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

// Currently working on — fetched from a Cloudflare Worker
const CURRENTLY_WORKER_URL = 'https://portfolio-currently.YOUR_SUBDOMAIN.workers.dev';

function timeAgo(isoDate) {
  const seconds = Math.floor((Date.now() - new Date(isoDate)) / 1000);
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [name, secondsInUnit] of units) {
    const count = Math.floor(seconds / secondsInUnit);
    if (count >= 1) return `${count} ${name}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

const currentlyCard = document.getElementById('currentlyCard');

fetch(CURRENTLY_WORKER_URL)
  .then((response) => {
    if (!response.ok) throw new Error('Worker request failed');
    return response.json();
  })
  .then((repo) => {
    currentlyCard.innerHTML = `
      <h3 class="card-title"><a href="${repo.url}" target="_blank" rel="noopener">${repo.name}</a></h3>
      <p class="card-desc">${repo.description || 'No description provided.'}</p>
      <p class="card-year mono">${repo.language ? `${repo.language} · ` : ''}pushed ${timeAgo(repo.pushed_at)}</p>
    `;
  })
  .catch(() => {
    currentlyCard.innerHTML = '<p class="card-desc">Check back soon.</p>';
  });
