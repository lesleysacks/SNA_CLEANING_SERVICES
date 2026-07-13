const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox img');
const closeButton = document.querySelector('.close-lightbox');

const filterGallery = (category) => {
  galleryItems.forEach((item) => {
    const matches = category === 'all' || item.dataset.category === category;
    item.style.display = matches ? 'block' : 'none';
  });
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    filterGallery(button.dataset.filter);
  });
});

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add('open');
  });
});

closeButton?.addEventListener('click', () => {
  lightbox.classList.remove('open');
});

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    lightbox.classList.remove('open');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    lightbox.classList.remove('open');
  }
});
