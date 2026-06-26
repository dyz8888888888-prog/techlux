// ==================== UTILITY FUNCTIONS ====================
// This file contains all utility functions used across the application
// Make sure to load this file before bundle.js in HTML

function $(selector, context = document) {
  return context.querySelector(selector);
}

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateRequired(value) {
  return value !== null && value.trim().length > 0;
}

function validateMinLength(value, min) {
  return value && value.length >= min;
}

function showError(input, message) {
  input.classList.add('input--error');
  const errorEl = document.createElement('span');
  errorEl.className = 'input-error-message';
  errorEl.textContent = message;
  
  const existingError = input.parentNode.querySelector('.input-error-message');
  if (existingError) {
    existingError.remove();
  }
  
  input.parentNode.appendChild(errorEl);
}

function clearError(input) {
  input.classList.remove('input--error');
  const errorEl = input.parentNode.querySelector('.input-error-message');
  if (errorEl) {
    errorEl.remove();
  }
}

function formatPrice(price) {
  return price;
}

function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function setUrlParam(param, value) {
  const url = new URL(window.location);
  if (value) {
    url.searchParams.set(param, value);
  } else {
    url.searchParams.delete(param);
  }
  window.history.pushState({}, '', url);
}

function scrollToElement(element, offset = 0) {
  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function revealCards(container, selector = '.card', delay = 100) {
  requestAnimationFrame(() => {
    const cards = $$(selector, container);
    cards.forEach((card) => {
      card.classList.add('revealing');
    });
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('revealed');
        card.classList.remove('revealing');
      }, index * delay);
    });
  });
}

function autoResizeElement(element, options = {}) {
  const defaults = {
    maxWidth: null,
    maxHeight: null,
    minWidth: null,
    minHeight: null,
    padding: 0,
    animate: true,
    animationDuration: 300,
    debounceDelay: 150
  };

  const config = { ...defaults, ...options };

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      requestAnimationFrame(() => {
        resizeElement(entry.target);
      });
    }
  });

  const resizeElement = (el) => {
    const contentRect = el.getBoundingClientRect();
    let newWidth = contentRect.width;
    let newHeight = contentRect.height;

    if (config.maxWidth !== null && newWidth > config.maxWidth) {
      newWidth = config.maxWidth;
    }
    if (config.maxHeight !== null && newHeight > config.maxHeight) {
      newHeight = config.maxHeight;
    }
    if (config.minWidth !== null && newWidth < config.minWidth) {
      newWidth = config.minWidth;
    }
    if (config.minHeight !== null && newHeight < config.minHeight) {
      newHeight = config.minHeight;
    }

    const computedStyle = window.getComputedStyle(el);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;

    const contentWidth = newWidth - paddingLeft - paddingRight - config.padding * 2;
    const contentHeight = newHeight - paddingTop - paddingBottom - config.padding * 2;

    if (config.animate) {
      el.style.transition = `width ${config.animationDuration}ms ease, height ${config.animationDuration}ms ease`;
    }

    el.style.width = `${newWidth}px`;
    el.style.height = `${newHeight}px`;

    el.style.setProperty('--content-width', `${contentWidth}px`);
    el.style.setProperty('--content-height', `${contentHeight}px`);
  };

  const debouncedResize = debounce(() => {
    if (element.isConnected) {
      resizeElement(element);
    }
  }, config.debounceDelay);

  if (element) {
    resizeObserver.observe(element);
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', debouncedResize);

    resizeElement(element);
  }

  return {
    destroy: () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', debouncedResize);
    },
    update: () => {
      if (element.isConnected) {
        resizeElement(element);
      }
    }
  };
}

function autoResizeBackgroundImage(element) {
  if (!element) return;

  const getMobileBackgroundSize = (parentWidth, parentHeight, imgWidth, imgHeight) => {
    const imgAspectRatio = imgWidth / imgHeight;
    const parentAspectRatio = parentWidth / parentHeight;
    
    if (parentWidth <= 320) {
      return '85%';
    } else if (parentWidth <= 428) {
      return '90%';
    } else if (parentWidth <= 480) {
      return 'contain';
    } else if (parentWidth <= 768) {
      return 'contain';
    }
    
    if (parentAspectRatio > imgAspectRatio) {
      return 'auto 100%';
    } else {
      return '100% auto';
    }
  };

  const syncWithParent = () => {
    const parent = element.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const parentWidth = parentRect.width;
    const parentHeight = parentRect.height;

    const img = new Image();
    img.onload = () => {
      const backgroundSize = getMobileBackgroundSize(parentWidth, parentHeight, img.width, img.height);
      element.style.backgroundSize = backgroundSize;
    };
    img.src = '/1.1.png';
  };

  const debouncedSync = debounce(syncWithParent, 100);

  syncWithParent();
  window.addEventListener('resize', debouncedSync);
  window.addEventListener('orientationchange', debouncedSync);

  return {
    destroy: () => {
      window.removeEventListener('resize', debouncedSync);
      window.removeEventListener('orientationchange', debouncedSync);
    }
  };
}

function getImagePixelDimensions(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height
      });
    };
    img.onerror = reject;
    img.src = src;
  });
}

async function syncImageHeight(sourceSelector, targetSelector) {
  const sourceElement = document.querySelector(sourceSelector);
  const targetElement = document.querySelector(targetSelector);

  if (!sourceElement || !targetElement) {
    console.warn('Source or target element not found');
    return;
  }

  const computedStyle = window.getComputedStyle(sourceElement);
  const backgroundImage = computedStyle.backgroundImage;
  
  const match = backgroundImage.match(/url\(["']?([^"']+)["']?\)/);
  if (!match) {
    console.warn('No background image found on source element');
    return;
  }

  const imageUrl = match[1];
  
  try {
    const dimensions = await getImagePixelDimensions(imageUrl);
    
    const parentRect = targetElement.parentElement.getBoundingClientRect();
    const parentHeight = parentRect.height;
    
    let targetHeight = dimensions.height;
    
    if (targetHeight > parentHeight) {
      targetHeight = parentHeight;
    }
    
    targetElement.style.height = `${targetHeight}px`;
    targetElement.style.minHeight = `${targetHeight}px`;
    

    
    return {
      originalHeight: dimensions.height,
      appliedHeight: targetHeight,
      aspectRatio: dimensions.aspectRatio
    };
  } catch (error) {
    console.error('Error syncing image height:', error);
    return null;
  }
}

function syncSectionHeightWithDiv(divSelector, sectionSelector, options = {}) {
  const {
    minHeight = 200,
    maxHeight = null,
    debounceDelay = 100,
    syncOnLoad = true,
    syncOnResize = true
  } = options;

  const divElement = document.querySelector(divSelector);
  const sectionElement = document.querySelector(sectionSelector);

  if (!divElement || !sectionElement) {
    console.warn('Div or section element not found');
    return { destroy: () => {} };
  }

  const isElementVisible = (element) => {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
  };

  const isElementLoaded = (element) => {
    return element && element.isConnected;
  };

  const syncHeight = () => {
    if (!isElementLoaded(divElement) || !isElementLoaded(sectionElement)) {
      console.warn('One or both elements are not loaded');
      return;
    }

    if (!isElementVisible(divElement)) {
      console.warn('Div element is not visible');
      return;
    }

    try {
      const divRect = divElement.getBoundingClientRect();
      let divHeight = divRect.height;

      const divComputedStyle = window.getComputedStyle(divElement);
      const divPaddingTop = parseFloat(divComputedStyle.paddingTop) || 0;
      const divPaddingBottom = parseFloat(divComputedStyle.paddingBottom) || 0;

      const sectionComputedStyle = window.getComputedStyle(sectionElement);
      const sectionPaddingTop = parseFloat(sectionComputedStyle.paddingTop) || 0;
      const sectionPaddingBottom = parseFloat(sectionComputedStyle.paddingBottom) || 0;

      let targetHeight = divHeight + divPaddingTop + divPaddingBottom;

      if (maxHeight !== null && targetHeight > maxHeight) {
        targetHeight = maxHeight;
      }

      if (targetHeight < minHeight) {
        targetHeight = minHeight;
      }

      sectionElement.style.minHeight = `${targetHeight}px`;
      sectionElement.style.height = 'auto';



      return {
        divHeight: divHeight,
        appliedSectionHeight: targetHeight,
        minHeight: minHeight,
        maxHeight: maxHeight
      };
    } catch (error) {
      console.error('Error syncing section height with div:', error);
      return null;
    }
  };

  const debouncedSyncHeight = debounce(syncHeight, debounceDelay);

  let resizeObserver = null;

  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === divElement) {
          debouncedSyncHeight();
        }
      }
    });

    resizeObserver.observe(divElement);
  } else {
    console.warn('ResizeObserver not supported, falling back to window resize');
    window.addEventListener('resize', debouncedSyncHeight);
  }

  if (syncOnLoad) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(syncHeight);
      });
    } else {
      requestAnimationFrame(syncHeight);
    }
  }

  if (syncOnResize && !resizeObserver) {
    window.addEventListener('resize', debouncedSyncHeight);
  }

  return {
    sync: syncHeight,
    destroy: () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', debouncedSyncHeight);
    },
    update: () => {
      syncHeight();
    }
  };
}

async function syncSectionHeightWithImage(imageSelector, sectionSelector) {
  const imageElement = document.querySelector(imageSelector);
  const sectionElement = document.querySelector(sectionSelector);

  if (!imageElement || !sectionElement) {
    console.warn('Image or section element not found');
    return;
  }

  const computedStyle = window.getComputedStyle(imageElement);
  const backgroundImage = computedStyle.backgroundImage;
  
  const match = backgroundImage.match(/url\(["']?([^"']+)["']?\)/);
  if (!match) {
    console.warn('No background image found on image element');
    return;
  }

  const imageUrl = match[1];
  
  try {
    const dimensions = await getImagePixelDimensions(imageUrl);
    
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
    
    const contentElement = sectionElement.querySelector('.hero__content');
    let contentHeight = 0;
    if (contentElement) {
      const contentRect = contentElement.getBoundingClientRect();
      contentHeight = contentRect.height;
    }
    
    const requiredSectionHeight = Math.max(dimensions.height + paddingTop + paddingBottom, contentHeight);
    
    const windowHeight = window.innerHeight;
    const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
    const maxSectionHeight = windowHeight - navHeight - 40;
    
    let finalHeight = Math.min(requiredSectionHeight, maxSectionHeight);
    
    if (window.innerWidth <= 768) {
      finalHeight = Math.max(finalHeight, window.innerHeight * 0.6);
    }
    
    sectionElement.style.minHeight = `${finalHeight}px`;
    

    
    return {
      imageHeight: dimensions.height,
      contentHeight: contentHeight,
      appliedSectionHeight: finalHeight,
      aspectRatio: dimensions.aspectRatio
    };
  } catch (error) {
    console.error('Error syncing section height with image:', error);
    return null;
  }
}

function setupSectionHeightSync(childSelector, parentSelector) {
  const childElement = document.querySelector(childSelector);
  const parentElement = document.querySelector(parentSelector);

  if (!childElement || !parentElement) {
    console.warn('Child or parent element not found for height sync');
    return null;
  }

  const updateParentHeight = () => {
    const childRect = childElement.getBoundingClientRect();
    const childHeight = childRect.height;
    
    const parentStyle = window.getComputedStyle(parentElement);
    const parentPaddingTop = parseFloat(parentStyle.paddingTop) || 0;
    const parentPaddingBottom = parseFloat(parentStyle.paddingBottom) || 0;
    
    const contentElement = parentElement.querySelector('.hero__content');
    let contentHeight = 0;
    if (contentElement) {
      const contentRect = contentElement.getBoundingClientRect();
      contentHeight = contentRect.height;
    }
    
    const requiredHeight = Math.max(childHeight, contentHeight);
    const minHeight = Math.max(requiredHeight + parentPaddingTop + parentPaddingBottom, 400);
    
    parentElement.style.minHeight = `${minHeight}px`;
    
  };

  let resizeObserver = null;
  
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === childElement) {
          debounce(() => updateParentHeight(), 50)();
        }
      }
    });
    
    resizeObserver.observe(childElement);
    
    const contentElement = parentElement.querySelector('.hero__content');
    if (contentElement) {
      resizeObserver.observe(contentElement);
    }
  } else {
    const debouncedUpdate = debounce(updateParentHeight, 150);
    window.addEventListener('resize', debouncedUpdate);
    
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          shouldUpdate = true;
          break;
        }
      }
      if (shouldUpdate) {
        debouncedUpdate();
      }
    });
    
    mutationObserver.observe(childElement, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    return {
      destroy: () => {
        window.removeEventListener('resize', debouncedUpdate);
        mutationObserver.disconnect();
      }
    };
  }

  const handleOrientationChange = debounce(updateParentHeight, 200);
  window.addEventListener('orientationchange', handleOrientationChange);

  updateParentHeight();

  return {
    destroy: () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('orientationchange', handleOrientationChange);
    },
    update: updateParentHeight
  };
}

function syncElementHeights(sourceSelector, targetSelector) {
  const sourceElement = document.querySelector(sourceSelector);
  const targetElement = document.querySelector(targetSelector);

  if (!sourceElement || !targetElement) {
    return { destroy: () => {}, update: () => {} };
  }

  const updateHeight = () => {
    if (!sourceElement.isConnected || !targetElement.isConnected) {
      return;
    }

    requestAnimationFrame(() => {
      const sourceRect = sourceElement.getBoundingClientRect();
      const sourceHeight = sourceRect.height;
      
      const computedStyle = window.getComputedStyle(sourceElement);
      const marginTop = parseFloat(computedStyle.marginTop) || 0;
      const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
      
      const targetComputed = window.getComputedStyle(targetElement);
      const targetPaddingTop = parseFloat(targetComputed.paddingTop) || 0;
      const targetPaddingBottom = parseFloat(targetComputed.paddingBottom) || 0;
      
      let targetHeight = sourceHeight + marginTop + marginBottom;
      
      targetElement.style.minHeight = `${targetHeight}px`;
      targetElement.style.height = `${targetHeight}px`;
    });
  };

  let resizeObserver = null;
  
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === sourceElement) {
          if (!sourceElement.isConnected || !targetElement.isConnected) {
            resizeObserver.disconnect();
            return;
          }
          updateHeight();
        }
      }
    });
    resizeObserver.observe(sourceElement);
  }

  const debouncedUpdate = debounce(updateHeight, 50);
  
  window.addEventListener('resize', debouncedUpdate);
  window.addEventListener('orientationchange', debouncedUpdate);

  updateHeight();

  return {
    destroy: () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', debouncedUpdate);
    },
    update: updateHeight
  };
}

// End of utility functions
// These functions are now available globally for use in other scripts
