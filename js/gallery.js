const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox img');
const closeButton = document.querySelector('.close-lightbox');
let lastFocused = null;

const filterGallery = (category) => {
  galleryItems.forEach((item) => {
    const matches = category === 'all' || item.dataset.category === category;
    item.style.display = matches ? 'block' : 'none';
  });
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    filterGallery(button.dataset.filter);
  });
});

const openLightbox = (item) => {
  const img = item.querySelector('img');
  if (!img || !lightbox) return;
  lastFocused = item;
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightbox.classList.add('open');
  closeButton?.focus();
};

const closeLightbox = () => {
  if (!lightbox?.classList.contains('open')) return;
  lightbox.classList.remove('open');
  lastFocused?.focus();
};

galleryItems.forEach((item) => {
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.addEventListener('click', () => openLightbox(item));
  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox(item);
    }
  });
});

closeButton?.addEventListener('click', closeLightbox);

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
  // Keep keyboard focus inside the open preview
  if (event.key === 'Tab' && lightbox?.classList.contains('open')) {
    event.preventDefault();
    closeButton?.focus();
  }
});
