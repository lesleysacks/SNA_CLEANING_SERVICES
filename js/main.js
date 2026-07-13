const nav = document.querySelector('.nav');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const backToTop = document.querySelector('.back-to-top');
const loader = document.querySelector('.page-loader');
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.counter');
const sliderButtons = document.querySelectorAll('.slider-btn');
const testimonialCards = document.querySelectorAll('.testimonial-card');

const setNavState = () => {
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
};

const revealOnScroll = () => {
  revealItems.forEach((item) => {
    const top = item.getBoundingClientRect().top;
    if (top < window.innerHeight - 120) {
      item.classList.add('visible');
    }
  });
};

const animateCounters = () => {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    const duration = 1200;
    const startTime = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = `${value}${target === 100 ? '%' : '+'}`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = `${target}${target === 100 ? '%' : '+'}`;
      }
    };

    requestAnimationFrame(tick);
  });
};

const initTestimonials = () => {
  let activeIndex = 0;
  const showCard = (index) => {
    testimonialCards.forEach((card, cardIndex) => {
      card.classList.toggle('active', cardIndex === index);
    });
  };

  sliderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const direction = button.dataset.direction === 'next' ? 1 : -1;
      activeIndex = (activeIndex + direction + testimonialCards.length) % testimonialCards.length;
      showCard(activeIndex);
    });
  });

  showCard(activeIndex);
};

const initMenu = () => {
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
};

const handleBackToTop = () => {
  if (!backToTop) return;
  backToTop.classList.toggle('visible', window.scrollY > 600);
};

const initLoader = () => {
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
  }
};

window.addEventListener('scroll', () => {
  setNavState();
  revealOnScroll();
  handleBackToTop();
});

window.addEventListener('DOMContentLoaded', () => {
  setNavState();
  revealOnScroll();
  handleBackToTop();
  initLoader();
  initMenu();
  initTestimonials();
  if (counters.length) {
    animateCounters();
  }
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
