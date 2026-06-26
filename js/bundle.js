// ==================== MAIN APPLICATION BUNDLE ====================
// This file contains the main application logic
// Dependencies: utils.js (must be loaded before this file)

// ==================== DATA FUNCTIONS ====================

// Product data for the main page
const products = [
  { id: 1, name: 'Floor Grating', tagline: 'Premium drainage solution for car wash facilities', price: '$45.00', image: '1.2.0.png', category: 'flooring' },
  { id: 2, name: 'Floor Grating Pro', tagline: 'Heavy-duty industrial grade flooring system', price: '$65.00', image: '1.2.1.png', category: 'flooring' },
  { id: 3, name: 'Drainage Channel', tagline: 'Efficient water management system', price: '$35.00', image: '2.1.0.png', category: 'drainage' },
  { id: 4, name: 'Channel Grating', tagline: 'Commercial drainage solution', price: '$55.00', image: '2.1.1.png', category: 'drainage' },
  { id: 5, name: 'Cover Plate', tagline: 'Secure and functional access cover', price: '$25.00', image: '2.1.2.png', category: 'accessories' },
  { id: 6, name: 'Channel End Cap', tagline: 'Sealed channel termination', price: '$15.00', image: '2.1.3.png', category: 'accessories' }
];

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'flooring', name: 'Floor Grating' },
  { id: 'drainage', name: 'Drainage' },
  { id: 'accessories', name: 'Accessories' }
];

function getCategories() {
  return categories;
}

function getProductsByCategory(categoryId) {
  if (categoryId === 'all') {
    return products;
  }
  return products.filter(product => product.category === categoryId);
}

function getProductById(productId) {
  return products.find(product => product.id === productId);
}

function getRelatedProducts(productId, limit = 3) {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter(p => p.id !== productId && p.category === product.category)
    .slice(0, limit);
}

// ==================== ANIMATION FUNCTIONS ====================

class AnimationManager {
  constructor() {
    this.scrollRevealElements = [];
    this.parallaxElements = [];
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.setupScrollReveal();
    this.setupParallax();
    this.setupPageTransitions();
    this.setupNavigationScroll();
    this.initialized = true;
  }

  setupScrollReveal() {
    this.scrollRevealElements = $$( '.scroll-reveal');
    
    this.scrollRevealElements.forEach(el => {
      el.classList.add('revealing');
    });
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('revealed');
              entry.target.classList.remove('revealing');
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    this.scrollRevealElements.forEach(el => observer.observe(el));
  }

  setupParallax() {
    this.parallaxElements = $$( '.parallax-bg');
    
    if (this.parallaxElements.length === 0) return;

    const handleParallax = () => {
      const scrollY = window.pageYOffset;
      
      this.parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0.5;
        const rect = el.parentElement.getBoundingClientRect();
        const visible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (visible) {
          const offset = scrollY * speed;
          el.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
      });
    };

    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  setupPageTransitions() {
    const transitionEl = $('.page-transition');
    if (!transitionEl) return;

    document.body.classList.add('page-ready');

    document.querySelectorAll('a[href]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#') || link.target === '_blank') return;
        
        console.log('Navigating to:', href);
        
        if (transitionEl) {
          transitionEl.classList.add('active');
        }
      });
    });
  }

  setupNavigationScroll() {
    const nav = $('.page-nav');
    if (!nav) return;

    const handleNavScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.remove('page-nav--transparent');
        nav.classList.add('page-nav--white');
      } else {
        nav.classList.add('page-nav--transparent');
        nav.classList.remove('page-nav--white');
      }
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

  revealHero() {
    const hero = $('.hero');
    if (hero) {
      hero.classList.add('animate-in');
    }
  }

  animateStaggered(container, selector = '.card', delay = 100) {
    const items = $$(selector, container);
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * delay);
    });
  }

  fadeIn(element, duration = 400) {
    element.style.transition = `opacity ${duration}ms ease`;
    element.style.opacity = '0';
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  }

  fadeOut(element, duration = 400) {
    element.style.transition = `opacity ${duration}ms ease`;
    element.style.opacity = '1';
    
    requestAnimationFrame(() => {
      element.style.opacity = '0';
    });
  }

  slideIn(element, direction = 'left', duration = 400) {
    const transforms = {
      left: 'translateX(-30px)',
      right: 'translateX(30px)',
      up: 'translateY(30px)',
      down: 'translateY(-30px)'
    };
    
    element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
    element.style.opacity = '0';
    element.style.transform = transforms[direction];
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translate(0)';
    });
  }
}

const animations = new AnimationManager();

function initAnimations() {
  animations.init();
  animations.revealHero();
}

function setupLazyLoading() {
  const images = $$('img[loading="lazy"]');
  images.forEach(img => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            img.src = img.dataset.src || img.src;
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '100px' }
    );
    observer.observe(img);
  });
}

function setupMobileNav() {
  const toggle = $('.page-nav__toggle');
  const mobileNav = $('.page-nav__mobile');
  const html = document.documentElement;
  
  console.log('=== Mobile Nav Setup ===');
  console.log('Toggle button found:', !!toggle);
  console.log('Mobile nav found:', !!mobileNav);
  
  if (!toggle || !mobileNav) {
    console.log('Mobile nav elements not found, exiting');
    return;
  }

  let isTouchEvent = false;
  let lastToggleTime = 0;

  const toggleMenu = () => {
    const now = Date.now();
    if (now - lastToggleTime < 300) {
      console.log('Toggle ignored due to debounce');
      return;
    }
    lastToggleTime = now;
    
    console.log('Toggle menu triggered');
    console.log('mobileNav element:', mobileNav);
    console.log('mobileNav classList before:', mobileNav.classList);
    
    const isActive = mobileNav.classList.toggle('active');
    toggle.classList.toggle('active');
    console.log('Mobile nav active:', isActive);
    console.log('mobileNav classList after:', mobileNav.classList);
    
    if (isActive) {
      html.style.overflow = 'hidden';
      html.style.position = 'fixed';
      html.style.width = '100%';
    } else {
      html.style.overflow = '';
      html.style.position = '';
      html.style.width = '';
    }
  };

  const handleTouchStart = (e) => {
    console.log('Touchstart event received:', e);
    isTouchEvent = true;
    toggleMenu();
  };

  const handleClick = (e) => {
    console.log('Click event received:', e);
    if (isTouchEvent) {
      console.log('Skipping click due to touch event');
      isTouchEvent = false;
      return;
    }
    toggleMenu();
  };

  toggle.addEventListener('click', handleClick);
  console.log('Click event listener added to toggle');
  
  toggle.addEventListener('touchstart', handleTouchStart, { passive: true });
  console.log('Touchstart event listener added to toggle');
  
  console.log('=== Mobile Nav Setup Complete ===');

  $$('.page-nav__mobile-btn', mobileNav).forEach(btn => {
    btn.addEventListener('click', () => {
      const href = btn.getAttribute('data-href');
      if (href) {
        console.log('Navigating to:', href);
        window.location.href = href;
      }
      mobileNav.classList.remove('active');
      toggle.classList.remove('active');
      html.style.overflow = '';
      html.style.position = '';
      html.style.width = '';
    });
    
    btn.addEventListener('touchstart', () => {
      btn.style.transform = 'scale(0.98)';
    }, { passive: true });
    
    btn.addEventListener('touchend', () => {
      btn.style.transform = '';
    }, { passive: true });
  });
}

function setupTouchOptimizations() {
  const touchableElements = $$('a, button, .btn, .card, .tag');
  
  touchableElements.forEach(el => {
    el.style.touchAction = 'manipulation';
    el.style.webkitTapHighlightColor = 'transparent';
  });
}

function setupViewportMeta() {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
  }
}

function handleOrientationChange() {
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  });
}

// ==================== MAIN PAGE INITIALIZATION ====================

/**
 * Initialize navigation bar styles
 */
function renderNavigation() {
  const nav = $('.page-nav');
  if (!nav) return;
  
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  
  // Set appropriate initial navigation style
  if (page === 'index.html' || page === 'autoparts.html' || page === '') {
    nav.classList.add('page-nav--transparent');
  } else {
    // About and Contact pages start with white nav
    nav.classList.add('page-nav--white');
  }
}

/**
 * Generate HTML for a product card
 * @param {Object} product Product data
 * @returns {string} HTML string
 */
function renderProductCard(product) {
  return `
    <a href="contact.html" class="card scroll-reveal">
      <div class="card__image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="card__content">
        <h3 class="card__title">${product.name}</h3>
        <p class="card__description">${product.tagline}</p>
        <div class="card__price">${product.price}</div>
      </div>
    </a>
  `;
}

/**
 * Render the grid of products
 * @param {Array} products List of products
 * @param {HTMLElement} container Container element
 */
function renderProductGrid(products, container) {
  if (!container) return;
  
  container.innerHTML = products.map(renderProductCard).join('');
  revealCards(container);
}

/**
 * Render the category filter bar
 * @param {HTMLElement} container Container element
 * @param {string} activeCategory Current active category
 */
function renderFilterBar(container, activeCategory = 'all') {
  if (!container) return;

  const categories = getCategories();
  
  container.innerHTML = `
    <span class="filter-bar__title">Filter:</span>
    ${categories.map(cat => `
      <button class="tag ${cat.id === activeCategory ? 'tag--active' : ''}" data-category="${cat.id}">
        ${cat.name}
      </button>
    `).join('')}
  `;

  $$('.tag', container).forEach(tag => {
    tag.addEventListener('click', () => {
      const category = tag.dataset.category;
      
      $$('.tag', container).forEach(t => t.classList.remove('tag--active'));
      tag.classList.add('tag--active');
      
      const products = getProductsByCategory(category);
      const grid = $('.product-grid');
      renderProductGrid(products, grid);
      
      const newUrl = category === 'all' ? 'index.html' : `index.html?category=${category}`;
      window.history.pushState({}, '', newUrl);
    });
  });
}

/**
 * Initialize the product listing page
 */
function initProductPage() {
  const productGrid = $('.product-grid');
  const filterBar = $('.filter-bar');
  
  if (!productGrid) return;

  if (filterBar) {
    filterBar.innerHTML = '';
  }

  if (productGrid) {
    productGrid.innerHTML = '';
  }
}

/**
 * Initialize the About Us page
 */
function initAboutPage() {
  setupTimelineAnimation();
  setupValuesAnimation();
}

/**
 * Setup scroll animations for the timeline
 */
function setupTimelineAnimation() {
  const items = $$('.timeline-item');
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach(item => observer.observe(item));
}

/**
 * Setup staggered entry animations for values cards
 */
function setupValuesAnimation() {
  const cards = $$('.value-card');
  
  cards.forEach((card) => {
    card.classList.add('revealing');
  });
  
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('revealed');
      card.classList.remove('revealing');
    }, index * 150);
  });
}

/**
 * Global page initialization
 */
function initPage() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  // Set document language to English
  document.documentElement.lang = 'en';

  renderNavigation();
  
  initAnimations();
  setupLazyLoading();
  setupMobileNav();
  
  setupViewportMeta();
  setupTouchOptimizations();
  handleOrientationChange();

  initAutoResizeElements();

  switch (page) {
    case 'index.html':
    case '':
      initProductPage();
      break;

    case 'about.html':
      initAboutPage();
      break;
  }
}

function initAutoResizeElements() {
  const bgImage = $('.hero__bg-image');
  if (bgImage) {
    autoResizeBackgroundImage(bgImage);
  }

  const heroBackground = $('.hero__background');
  if (heroBackground && bgImage) {
    syncImageHeight('.hero__bg-image', '.hero__background');
  }

  const heroSection = $('.hero');
  if (heroSection && bgImage) {
    syncSectionHeightWithImage('.hero__bg-image', '.hero');
    setupSectionHeightSync('.hero__bg-image', '.hero');
  }

  if (heroSection && heroBackground) {
    syncElementHeights('.hero__background', '.hero');
  }

  const heroContent = $('.hero__content');
  if (heroSection && heroContent) {
    syncSectionHeightWithDiv('.hero__content', '.hero', {
      minHeight: 300,
      maxHeight: null,
      debounceDelay: 100,
      syncOnLoad: true,
      syncOnResize: true
    });
  }
}

document.addEventListener('DOMContentLoaded', initPage);
