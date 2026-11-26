// Mark that JS is running, so reveal animations only hide content when they can also show it.
document.documentElement.classList.add('js');

const WHATSAPP_NUMBER = '27738449868';
const BUSINESS_EMAIL = 'andremuller093@gmail.com';
const FOUNDED_YEAR = 2009;

const nav = document.querySelector('.nav');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const backToTop = document.querySelector('.back-to-top');
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.counter');
const sliderButtons = document.querySelectorAll('.slider-btn');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const quoteForm = document.querySelector('.contact-form');

const onScroll = () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
};

const initReveal = () => {
  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -60px 0px' }
  );
  revealItems.forEach((item) => observer.observe(item));
};

const animateCounters = () => {
  counters.forEach((counter) => {
    const since = Number(counter.dataset.since || 0);
    const target = since ? new Date().getFullYear() - since : Number(counter.dataset.target || 0);
    const suffix = counter.dataset.suffix ?? '+';
    const duration = 1200;
    const startTime = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      counter.textContent = `${Math.floor(progress * target)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
      else counter.textContent = `${target}${suffix}`;
    };

    requestAnimationFrame(tick);
  });
};

const initTestimonials = () => {
  if (!testimonialCards.length) return;
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
  if (!menuToggle || !navLinks) return;
  const setOpen = (open) => {
    navLinks.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  };
  menuToggle.addEventListener('click', () => setOpen(!navLinks.classList.contains('open')));
  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
};

// Quote form: sends the request as a pre-filled WhatsApp message (no server needed),
// and offers the same details by email as an alternative.
const initQuoteForm = () => {
  if (!quoteForm) return;
  const status = quoteForm.querySelector('.form-status');
  const emailLink = quoteForm.querySelector('.email-alt');

  const buildMessage = () => {
    const data = new FormData(quoteForm);
    const fields = [
      ['Name', 'name'],
      ['Phone', 'phone'],
      ['Email', 'email'],
      ['Service', 'service'],
      ['Property type', 'property'],
      ['Area / suburb', 'area'],
      ['How often', 'frequency'],
      ['Preferred date', 'date'],
    ];
    const details = fields
      .map(([label, key]) => [label, String(data.get(key) || '').trim()])
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`);
    const message = String(data.get('message') || '').trim();
    return ['Hi SNA Cleaning Services, I would like a quote.', '', ...details, ...(message ? ['', message] : [])].join('\n');
  };

  const updateEmailLink = () => {
    if (!emailLink) return;
    const subject = encodeURIComponent('Quote request – SNA Cleaning Services');
    emailLink.href = `mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${encodeURIComponent(buildMessage())}`;
  };

  quoteForm.addEventListener('input', updateEmailLink);
  updateEmailLink();

  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!quoteForm.reportValidity()) return;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, '_blank', 'noopener');
    if (status) {
      status.textContent = 'Thank you! WhatsApp has opened with your request — just press send.';
    }
  });
};

window.addEventListener('scroll', onScroll, { passive: true });

const init = () => {
  onScroll();
  initReveal();
  initMenu();
  initTestimonials();
  initQuoteForm();
  if (counters.length) animateCounters();
  document.querySelectorAll('.current-year').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

