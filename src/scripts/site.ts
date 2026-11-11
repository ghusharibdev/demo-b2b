const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Scroll reveal — armed only when the inline head script has confirmed
 * that JavaScript and motion are both available. Items are never hidden
 * for no-JS visitors or people who prefer reduced motion.
 */
const revealItems = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
let revealObserver: IntersectionObserver | undefined;

if (document.documentElement.classList.contains('motion-ready') && 'IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    },
  );

  revealItems.forEach((item) => revealObserver?.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-revealed'));
}

/* Sticky header: a quiet shadow and blur after 20px of scroll. */
const header = document.querySelector<HTMLElement>('[data-site-header]');

if (header) {
  let frame = 0;

  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
    frame = 0;
  };

  updateHeader();
  window.addEventListener(
    'scroll',
    () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateHeader);
    },
    { passive: true },
  );
}

/* Show the designed placeholder if a replacement photo is ever missing. */
document.querySelectorAll<HTMLImageElement>('[data-fallback-image]').forEach((image) => {
  const useFallback = () => {
    image.hidden = true;
  };

  if (image.complete && image.naturalWidth === 0) {
    useFallback();
    return;
  }

  image.addEventListener('error', useFallback, { once: true });
});

/* Collection controls: search, category + brand filters, sort, count, load more. */
const productGrid = document.querySelector<HTMLElement>('[data-product-grid]');
const filterStatus = document.querySelector<HTMLElement>('[data-filter-status]');

if (productGrid) {
  interface CardEntry {
    el: HTMLElement;
    index: number;
    price: number;
    isNew: boolean;
    category: string;
    brand: string;
    search: string;
  }

  const cards = Array.from(productGrid.querySelectorAll<HTMLElement>('[data-product-card]'));
  const totalProducts = cards.length;
  const initialVisible = Math.max(1, Number(productGrid.dataset.initialVisible) || 4);
  const loadStep = Math.max(1, Number(productGrid.dataset.loadStep) || initialVisible);

  const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
  const sortSelect = document.querySelector<HTMLSelectElement>('[data-sort-select]');
  const categoryButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const brandButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-brand-filter]'));
  const productCount = document.querySelector<HTMLElement>('[data-product-count]');
  const clearButton = document.querySelector<HTMLButtonElement>('[data-clear-filters]');
  const loadMoreButton = document.querySelector<HTMLButtonElement>('[data-load-more]');
  const emptyState = document.querySelector<HTMLElement>('[data-empty-state]');

  const normalize = (value: string) =>
    value
      .toLocaleLowerCase('en')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const entries: CardEntry[] = cards.map((el, fallbackIndex) => {
    const name = el.dataset.name ?? '';
    const brand = el.dataset.brand ?? '';
    const fabric = el.dataset.fabric ?? '';
    const category = el.dataset.category ?? '';

    return {
      el,
      index: Number(el.dataset.index ?? fallbackIndex),
      price: Number(el.dataset.price ?? 0),
      isNew: el.dataset.isNew === 'true',
      category,
      brand,
      search: normalize([name, brand, fabric, category].join(' ')),
    };
  });

  let activeCategory = 'all';
  let activeBrand = 'all';
  let sortMode = 'featured';
  let visibleCount = initialVisible;
  let fadeTimer: number | undefined;

  const canAnimate = () =>
    document.documentElement.classList.contains('motion-ready') && !prefersReducedMotion.matches;

  const setPressed = () => {
    categoryButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String((button.dataset.filter ?? 'all') === activeCategory));
    });
    brandButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String((button.dataset.brandFilter ?? 'all') === activeBrand));
    });
  };

  const revealCard = (card: HTMLElement) => {
    // Filtering should always use its own short fade, never the scroll stagger.
    card.style.setProperty('--reveal-delay', '0ms');
    card.classList.add('is-revealed');
    revealObserver?.unobserve(card);
  };

  const getMatches = () => {
    const query = normalize(searchInput?.value ?? '');
    const tokens = query ? query.split(' ') : [];

    return entries.filter((entry) => {
      if (activeCategory !== 'all' && entry.category !== activeCategory) return false;
      if (activeBrand !== 'all' && entry.brand !== activeBrand) return false;
      return tokens.every((token) => entry.search.includes(token));
    });
  };

  const sortMatches = (matches: CardEntry[]) => {
    const sorted = [...matches];

    switch (sortMode) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price || a.index - b.index);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price || a.index - b.index);
        break;
      case 'newest':
        sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew) || a.index - b.index);
        break;
      default:
        sorted.sort((a, b) => a.index - b.index);
    }

    return sorted;
  };

  const commit = (animation: 'none' | 'all' | 'new' = 'none', reveal = true) => {
    const matching = sortMatches(getMatches());
    const visibleEntries = matching.slice(0, visibleCount);
    const visibleSet = new Set(visibleEntries.map((entry) => entry.el));
    const matchingSet = new Set(matching.map((entry) => entry.el));
    const rest = entries
      .filter((entry) => !matchingSet.has(entry.el))
      .sort((a, b) => a.index - b.index);

    productGrid.append(
      ...matching.map((entry) => entry.el),
      ...rest.map((entry) => entry.el),
    );

    entries.forEach(({ el }) => {
      const wasHidden = el.hidden;
      const isVisible = visibleSet.has(el);

      el.classList.remove('is-filter-out', 'is-filter-in');
      el.hidden = !isVisible;

      if (!isVisible) return;
      if (reveal) revealCard(el);

      const shouldAnimate =
        canAnimate() && (animation === 'all' || (animation === 'new' && wasHidden));

      if (shouldAnimate) {
        // Reflow so a repeated filter selection restarts the fade-in.
        void el.offsetWidth;
        el.classList.add('is-filter-in');
      }
    });

    const shownCount = visibleEntries.length;

    if (productCount) {
      productCount.textContent = `Showing ${shownCount} of ${totalProducts} products`;
    }

    if (filterStatus) {
      filterStatus.textContent =
        matching.length === 0
          ? 'No products found.'
          : `Showing ${shownCount} of ${totalProducts} products.`;
    }

    if (emptyState) emptyState.hidden = matching.length !== 0;

    if (matching.length === 0) {
      // The empty-state WhatsApp button asks about what was actually searched for.
      const emptyOrder = document.querySelector<HTMLAnchorElement>('[data-empty-order]');
      const waNumber = emptyOrder?.dataset.waNumber;

      if (emptyOrder && waNumber) {
        const term = normalize(searchInput?.value ?? '');
        const message = term
          ? `Assalam-o-Alaikum, I could not find "${term}" in your latest collection. Do you have it in stock?`
          : 'Assalam-o-Alaikum, I saw your collection, I want to order.';

        emptyOrder.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
      }
    }

    productGrid.hidden = matching.length === 0;
    if (loadMoreButton) loadMoreButton.hidden = shownCount >= matching.length;
    if (clearButton) {
      const isSearching = normalize(searchInput?.value ?? '') !== '';
      clearButton.hidden =
        !isSearching && activeCategory === 'all' && activeBrand === 'all';
    }
  };

  const renderNow = (animation: 'none' | 'all' | 'new' = 'none') => {
    window.clearTimeout(fadeTimer);
    commit(animation);
  };

  const renderWithFade = () => {
    if (!canAnimate()) {
      renderNow('all');
      return;
    }

    window.clearTimeout(fadeTimer);

    for (const { el } of entries) {
      el.classList.remove('is-filter-in');
      if (!el.hidden) el.classList.add('is-filter-out');
    }

    fadeTimer = window.setTimeout(() => commit('all'), 150);
  };

  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter ?? 'all';
      if (filter === activeCategory) return;

      activeCategory = filter;
      visibleCount = initialVisible;
      setPressed();
      renderWithFade();
    });
  });

  brandButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const brand = button.dataset.brandFilter ?? 'all';
      if (brand === activeBrand) return;

      activeBrand = brand;
      visibleCount = initialVisible;
      setPressed();
      renderWithFade();
    });
  });

  searchInput?.addEventListener('input', () => {
    visibleCount = initialVisible;
    renderNow();
  });

  sortSelect?.addEventListener('change', () => {
    sortMode = sortSelect.value;
    visibleCount = initialVisible;
    renderNow();
  });

  loadMoreButton?.addEventListener('click', () => {
    visibleCount += loadStep;
    renderNow('new');
  });

  clearButton?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    activeCategory = 'all';
    activeBrand = 'all';
    sortMode = 'featured';
    if (sortSelect) sortSelect.value = 'featured';
    visibleCount = initialVisible;
    setPressed();
    renderNow();
    searchInput?.focus();
  });

  const revealHashProduct = () => {
    const hash = window.location.hash;

    if (!hash.startsWith('#product-')) return;

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target || !productGrid.contains(target)) return;

    if (target.hidden) {
      if (searchInput) searchInput.value = '';
      activeCategory = 'all';
      activeBrand = 'all';
      sortMode = 'featured';
      if (sortSelect) sortSelect.value = 'featured';
      visibleCount = Math.max(initialVisible, Number(target.dataset.index ?? 0) + 1);
      setPressed();
      commit('none');
    }

    window.setTimeout(() => target.scrollIntoView({ block: 'center' }), 60);
  };

  setPressed();
  commit('none', false);
  revealHashProduct();
  window.addEventListener('hashchange', revealHashProduct);
}

/* Share product link. */
const copyText = async (text: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to the textarea method below.
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-1000px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;

  try {
    const legacyDocument = document as unknown as {
      execCommand?: (commandId: string) => boolean;
    };
    copied = legacyDocument.execCommand ? legacyDocument.execCommand('copy') : false;
  } catch {
    copied = false;
  }

  textarea.remove();
  return copied;
};

const shareTimers = new WeakMap<HTMLElement, number>();

/* Share links always point at the production domain, never at a preview host. */
const siteBaseUrl = document.body.dataset.siteUrl || window.location.origin;

document.querySelectorAll<HTMLButtonElement>('[data-share-button]').forEach((button) => {
  button.addEventListener('click', async () => {
    const slug = button.dataset.shareSlug ?? '';
    const shareUrl = new URL(`/#product-${slug}`, siteBaseUrl).toString();
    const copied = await copyText(shareUrl);
    const status = button.parentElement?.querySelector<HTMLElement>('[data-share-status]');

    // Keep the address bar in sync with the link that was just shared.
    if (copied && slug) {
      window.history.replaceState(null, '', `#product-${slug}`);
    }

    if (!status) return;

    const previousTimer = shareTimers.get(status);
    if (previousTimer) window.clearTimeout(previousTimer);

    status.textContent = copied ? 'Link copied' : 'Copy failed';
    status.classList.add('is-visible');
    shareTimers.set(
      status,
      window.setTimeout(() => {
        status.classList.remove('is-visible');
        status.textContent = '';
      }, 1800),
    );
  });
});

/* Product image lightbox. */
const lightbox = document.querySelector<HTMLDialogElement>('[data-lightbox]');

if (lightbox) {
  const lightboxImage = lightbox.querySelector<HTMLImageElement>('[data-lightbox-image]');
  const lightboxName = lightbox.querySelector<HTMLElement>('[data-lightbox-name]');
  const lightboxSpec = lightbox.querySelector<HTMLElement>('[data-lightbox-spec]');
  const lightboxPrice = lightbox.querySelector<HTMLElement>('[data-lightbox-price]');
  const lightboxOrder = lightbox.querySelector<HTMLAnchorElement>('[data-lightbox-order]');
  const closeButton = lightbox.querySelector<HTMLButtonElement>('[data-lightbox-close]');
  let lastTrigger: HTMLElement | null = null;
  let hashLocked = false;

  const closeLightbox = () => lightbox.close();

  const openLightbox = (card: HTMLElement, trigger: HTMLElement | null) => {
    const image = card.querySelector<HTMLImageElement>('[data-product-image]');
    const name = card.querySelector<HTMLElement>('[data-product-name]');
    const spec = card.querySelector<HTMLElement>('[data-product-spec]');
    const price = card.querySelector<HTMLElement>('[data-product-price]');
    const order = card.querySelector<HTMLAnchorElement>('[data-product-order]');

    if (lightboxImage && image) {
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
    }
    if (lightboxName && name) lightboxName.textContent = name.textContent?.trim() ?? '';
    if (lightboxSpec && spec) lightboxSpec.textContent = spec.textContent?.trim() ?? '';
    if (lightboxPrice && price) lightboxPrice.textContent = price.textContent?.trim() ?? '';
    if (lightboxOrder && order) lightboxOrder.href = order.href;

    lastTrigger = trigger;
    document.body.style.overflow = 'hidden';

    if (!lightbox.open) lightbox.showModal();

    // The open product is part of the URL, so the address bar is shareable.
    const slug = card.id.replace(/^product-/, '');

    if (slug && slug !== card.id) {
      hashLocked = true;
      window.history.replaceState(null, '', `#product-${slug}`);
    }
  };

  document.querySelectorAll<HTMLElement>('[data-lightbox-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const card = trigger.closest<HTMLElement>('[data-product-card]');
      if (!card) return;

      openLightbox(card, trigger);
    });
  });

  closeButton?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  lightbox.addEventListener('close', () => {
    document.body.style.overflow = '';

    if (hashLocked) {
      hashLocked = false;
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    lastTrigger?.focus({ preventScroll: true });
  });

  /* Deep links: /#product-slug opens that product straight away. */
  const openFromHash = () => {
    const hash = window.location.hash;

    if (!hash.startsWith('#product-')) return;
    if (lightbox.open) return;

    const card = document.getElementById(decodeURIComponent(hash.slice(1)));

    if (!card || !card.matches('[data-product-card]')) return;

    openLightbox(card, card.querySelector<HTMLElement>('[data-lightbox-open]'));
  };

  window.addEventListener('hashchange', openFromHash);
  window.setTimeout(openFromHash, 150);
}
