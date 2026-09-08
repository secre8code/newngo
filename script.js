document.title = document.title.replaceAll('Ananta', 'Hope');
const description = document.querySelector('meta[name="description"]');
if (description) description.content = description.content.replaceAll('Ananta', 'Hope');
document.body.innerHTML = document.body.innerHTML.replaceAll('Ananta', 'Hope').replaceAll('ananta', 'hope');

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');

const desktopNav = document.querySelector('.desktop-nav');
if (desktopNav && !desktopNav.querySelector('.gallery-link')) {
  const galleryLink = document.createElement('a');
  galleryLink.className = 'gallery-link';
  galleryLink.href = 'gallery.html';
  galleryLink.textContent = 'Gallery';
  desktopNav.appendChild(galleryLink);
}

document.body.classList.add('page-enter');

if (window.matchMedia('(pointer: fine)').matches) {
  const cursorDot = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  cursorRing.className = 'cursor-ring';
  document.body.append(cursorDot, cursorRing);
  window.addEventListener('mousemove', (event) => {
    cursorDot.style.left = `${event.clientX}px`;
    cursorDot.style.top = `${event.clientY}px`;
    cursorRing.style.left = `${event.clientX}px`;
    cursorRing.style.top = `${event.clientY}px`;
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });
  document.querySelectorAll('a, button, .program-card, .story').forEach((element) => {
    element.addEventListener('mouseenter', () => cursorRing.classList.add('is-hovering'));
    element.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hovering'));
  });
}

menuToggle?.addEventListener('click', () => {
  const isOpen = header.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('.desktop-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
  revealObserver.observe(element);
});

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;
    document.querySelectorAll('.filter-button').forEach((filterButton) => filterButton.classList.remove('is-active'));
    button.classList.add('is-active');
    document.querySelectorAll('.gallery-item').forEach((item) => {
      const shouldShow = selectedFilter === 'all' || item.dataset.category === selectedFilter;
      item.classList.toggle('is-filtered-out', !shouldShow);
    });
  });
});

const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach((item, index) => {
  const countLabel = item.querySelector('figcaption span');
  if (countLabel) countLabel.textContent = `${String(index + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;
});

if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.program-card, .story, .gallery-item').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -3;
      const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 3;
      card.classList.add('tilt-active');
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('tilt-active');
      card.style.transform = '';
    });
  });
}

const statValues = document.querySelectorAll('.stat strong');
const countObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const stat = entry.target;
    const original = stat.textContent.trim();
    const suffix = original.endsWith('k') ? 'k' : '';
    const target = Number.parseFloat(original);
    const startedAt = performance.now();
    const duration = 1200;
    const animateCount = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target < 20 ? Math.round(target * eased) : (target * eased).toFixed(1);
      stat.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(animateCount);
    };
    requestAnimationFrame(animateCount);
    observer.unobserve(stat);
  });
}, { threshold: 0.6 });
statValues.forEach((stat) => countObserver.observe(stat));

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 80);
  document.documentElement.style.setProperty('--scroll-y', window.scrollY);
}, { passive: true });
