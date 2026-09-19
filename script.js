/**
 * MAX MEMORIES - SCRIPT.JS
 * Gestione interattiva: Supporto Bilingue (IT / EN), Lightbox unificato, Dark Mode, Navigazione e Condivisione
 */

// Sorgenti delle 14 foto nell'esatto ordine visivo della pagina (0-13)
const photoSources = [
  "photos/FotoProfilo.jpeg", // 0: Hero
  "photos/Barca.jpeg",       // 1: Sardegna 1
  "photos/Tramonto.jpeg",    // 2: Sardegna 2
  "photos/Sardegna.jpeg",   // 3: Sardegna 3
  "photos/Ancora.jpeg",     // 4: Sardegna 4
  "photos/laureaM.jpeg",    // 5: Lauree 1
  "photos/LaureaG.jpeg",    // 6: Lauree 2
  "photos/facce.jpeg",      // 7: Lauree 3
  "photos/Amici.jpeg",      // 8: Lauree 4
  "photos/Uni.jpeg",        // 9: Altri Ricordi 1
  "photos/polimiRun.jpeg",  // 10: Altri Ricordi 2
  "photos/Gelato.jpeg",     // 11: Altri Ricordi 3
  "photos/PrimoPiano.jpeg", // 12: Altri Ricordi 4
  "photos/Orizzonte.jpeg"   // 13: Australia
];

let currentLang = 'it';

// Funzione generatrice catalogo foto localizzato
function getPhotosForLang(lang) {
  const meta = (typeof photoTranslations !== 'undefined' && photoTranslations[lang])
    ? photoTranslations[lang]
    : ((typeof photoTranslations !== 'undefined' && photoTranslations.it) ? photoTranslations.it : []);
  
  return photoSources.map((src, i) => ({
    src,
    title: meta[i] ? meta[i].title : "Foto Ricordo",
    category: meta[i] ? meta[i].category : "Memorie",
    desc: meta[i] ? meta[i].desc : ""
  }));
}

let allPhotos = getPhotosForLang('it');

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. GESTIONE SISTEMA BILINGUE (IT / EN)
  // ==========================================
  const langToggleBtn = document.getElementById('lang-toggle');
  const chipIt = document.getElementById('lang-chip-it');
  const chipEn = document.getElementById('lang-chip-en');
  const metaDescription = document.getElementById('meta-description');

  function setLanguage(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) return;
    currentLang = lang;

    // 1. Attributo lingua HTML e Titolo Documento
    document.documentElement.setAttribute('lang', lang);
    if (translations[lang].pageTitle) {
      document.title = translations[lang].pageTitle;
    }
    if (metaDescription && translations[lang].pageMetaDesc) {
      metaDescription.setAttribute('content', translations[lang].pageMetaDesc);
    }

    // 2. Aggiornamento testi di tutti gli elementi marcati con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key] !== undefined) {
        el.textContent = translations[lang][key];
      }
    });

    // 3. Aggiornamento attributi title con data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (translations[lang][key] !== undefined) {
        el.setAttribute('title', translations[lang][key]);
      }
    });

    // 4. Aggiornamento attributi aria-label con data-i18n-aria
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (translations[lang][key] !== undefined) {
        el.setAttribute('aria-label', translations[lang][key]);
      }
    });

    // 5. Stato visivo chip del pulsante di selezione lingua
    if (chipIt && chipEn) {
      if (lang === 'en') {
        chipIt.classList.remove('active');
        chipEn.classList.add('active');
      } else {
        chipIt.classList.add('active');
        chipEn.classList.remove('active');
      }
    }

    // 5. Aggiornamento catalogo foto e Lightbox attivo
    allPhotos = getPhotosForLang(lang);
    if (modal && modal.classList.contains('active')) {
      updateLightbox(currentPhotoIndex);
    }

    // 6. Salvataggio preferenza utente
    localStorage.setItem('max-memories-lang', lang);

    // 7. Aggiorna etichetta tema (Modalità Notte / Giorno)
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (typeof updateThemeToggleText === 'function') {
      updateThemeToggleText(isDark ? 'dark' : 'light');
    }

    // 8. Ricalcolo dell'altezza header per scroll perfetto
    updateHeaderHeightCSS();
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'it' ? 'en' : 'it';
      setLanguage(nextLang);
    });
  }

  // ==========================================
  // 2. LIGHTBOX MODAL FULLSCREEN
  // ==========================================
  const modal = document.getElementById('lightbox-modal');
  const modalImage = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalCounter = document.getElementById('lightbox-counter');
  const modalCaptionTitle = document.getElementById('lightbox-caption-title');
  const modalCaptionDesc = document.getElementById('lightbox-caption-desc');
  const modalClose = document.getElementById('lightbox-close');
  const modalPrev = document.getElementById('lightbox-prev');
  const modalNext = document.getElementById('lightbox-next');

  let currentPhotoIndex = 0;

  function updateLightbox(index) {
    if (index < 0) index = allPhotos.length - 1;
    if (index >= allPhotos.length) index = 0;
    currentPhotoIndex = index;

    const data = allPhotos[currentPhotoIndex];
    if (modalImage) {
      modalImage.src = data.src;
      modalImage.alt = data.title;
    }
    if (modalTitle) {
      const titlePrefix = (translations && translations[currentLang] && translations[currentLang].modalTitle)
        ? translations[currentLang].modalTitle
        : "🔍 Visualizzazione Ricordo";
      modalTitle.textContent = titlePrefix;
    }
    if (modalCounter) modalCounter.textContent = `${currentPhotoIndex + 1} / ${allPhotos.length}`;
    if (modalCaptionTitle) modalCaptionTitle.textContent = data.title;
    if (modalCaptionDesc) modalCaptionDesc.textContent = `${data.desc} [${data.category}]`;
    preloadNeighborPhotos(currentPhotoIndex);
  }

  function preloadNeighborPhotos(index) {
    if (!allPhotos || allPhotos.length <= 1) return;
    const nextIdx = (index + 1) % allPhotos.length;
    const prevIdx = (index - 1 + allPhotos.length) % allPhotos.length;
    [nextIdx, prevIdx].forEach(idx => {
      if (allPhotos[idx] && allPhotos[idx].src) {
        const img = new Image();
        img.src = allPhotos[idx].src;
      }
    });
  }

  function openLightbox(index) {
    updateLightbox(index);
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Registra i click per l'apertura del Lightbox su tutti gli elementi marcati
  document.querySelectorAll('[data-photo-index]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const index = parseInt(el.getAttribute('data-photo-index'), 10);
      if (!isNaN(index)) {
        openLightbox(index);
      }
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeLightbox);
  if (modalPrev) modalPrev.addEventListener('click', () => updateLightbox(currentPhotoIndex - 1));
  if (modalNext) modalNext.addEventListener('click', () => updateLightbox(currentPhotoIndex + 1));

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });
  }

  // Tasti tastiera per la navigazione nel Lightbox
  document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightbox(currentPhotoIndex - 1);
    if (e.key === 'ArrowRight') updateLightbox(currentPhotoIndex + 1);
  });

  // Gesti Touch / Swipe per smartphone nel Lightbox
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const swipeThreshold = 40; // soglia minima in pixel

  if (modal) {
    modal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleLightboxSwipe();
    }, { passive: true });
  }

  function handleLightboxSwipe() {
    if (!modal || !modal.classList.contains('active')) return;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
      if (diffX < 0) {
        updateLightbox(currentPhotoIndex + 1);
      } else {
        updateLightbox(currentPhotoIndex - 1);
      }
    }
  }

  // ==========================================
  // 3. TEMA CHIARO / SCURO (DARK MODE)
  // ==========================================
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleText = document.getElementById('theme-toggle-text');
  const storedTheme = localStorage.getItem('max-memories-theme');

  function updateThemeToggleText(theme) {
    if (!themeToggleText || typeof translations === 'undefined' || !translations[currentLang]) return;
    if (theme === 'dark') {
      themeToggleText.textContent = translations[currentLang].themeToggleLabelLight || "Modalità Giorno";
    } else {
      themeToggleText.textContent = translations[currentLang].themeToggleLabel || "Modalità Notte";
    }
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('max-memories-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('max-memories-theme', 'light');
    }
    updateThemeToggleText(theme);
  }

  if (storedTheme === 'dark') {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    });
  }

  // ==========================================
  // 4. MENU MOBILE (HAMBURGER) E DISPOSIZIONE CONTROLLI
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const toolsGroup = document.getElementById('header-tools-group');
  const navMobileSlot = document.getElementById('nav-mobile-tools');
  const headerActions = document.querySelector('.header-actions');

  // Disposizione intelligente dei controlli Lingua e Modalità Notte:
  // Su smartphone (<= 768px): posizionati nel menu a tendina dopo "Verso l'Australia"
  // Su desktop (> 768px): posizionati nella barra in alto (header-actions)
  function adaptNavbarForViewport() {
    const isMobile = window.innerWidth <= 768;
    if (!toolsGroup) return;

    if (isMobile) {
      if (navMobileSlot && !navMobileSlot.contains(toolsGroup)) {
        navMobileSlot.appendChild(toolsGroup);
      }
    } else {
      if (headerActions && !headerActions.contains(toolsGroup)) {
        headerActions.insertBefore(toolsGroup, mobileToggle);
      }
    }
    updateHeaderHeightCSS();
  }

  window.addEventListener('resize', adaptNavbarForViewport);
  adaptNavbarForViewport();

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('active', isActive);
      mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================
  // 5. PULSANTE CONDIVIDI E NOTIFICA TOAST LOCALIZZATA
  // ==========================================
  const shareBtn = document.getElementById('btn-share');
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout = null;

  function showToast(msg) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = msg;
    toast.classList.add('active');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  }

  const SHARE_URL = 'https://gianbetto.github.io/Max_Memories/';

  function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((resolve, reject) => {
        try {
          const successful = document.execCommand('copy');
          textArea.remove();
          successful ? resolve() : reject();
        } catch (err) {
          textArea.remove();
          reject(err);
        }
      });
    }
  }

  function fallbackCopyToClipboard() {
    copyTextToClipboard(SHARE_URL).then(() => {
      const msg = (translations && translations[currentLang] && translations[currentLang].toastShareSuccess)
        ? translations[currentLang].toastShareSuccess
        : '🔗 Link della bacheca copiato negli appunti!';
      showToast(msg);
    }).catch(() => {
      const fallback = (translations && translations[currentLang] && translations[currentLang].toastShareFallback)
        ? translations[currentLang].toastShareFallback
        : `🔗 Copia il link: ${SHARE_URL}`;
      showToast(fallback);
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const shareTitle = document.title;
      const shareDesc = (translations && translations[currentLang] && translations[currentLang].pageMetaDesc)
        ? translations[currentLang].pageMetaDesc
        : shareTitle;

      if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
        navigator.share({
          title: shareTitle,
          text: shareDesc,
          url: SHARE_URL
        }).catch(err => {
          if (err.name !== 'AbortError') {
            fallbackCopyToClipboard();
          }
        });
      } else {
        fallbackCopyToClipboard();
      }
    });
  }

  // ==========================================
  // 6. RIPOSIZIONAMENTO ACCURATO DELLO SCROLL (OFFSET TOPBAR)
  // ==========================================
  function getHeaderHeight() {
    const header = document.querySelector('.main-header');
    return header ? header.offsetHeight : 80;
  }

  function updateHeaderHeightCSS() {
    const h = getHeaderHeight();
    document.documentElement.style.setProperty('--header-height', `${h}px`);
  }

  window.addEventListener('resize', updateHeaderHeightCSS);
  window.addEventListener('load', updateHeaderHeightCSS);
  updateHeaderHeightCSS();

  function scrollToSection(targetElement) {
    if (!targetElement) return;
    const headerHeight = getHeaderHeight();
    const extraBreathingRoom = 24; // Spazio extra sopra il titolo
    const elementRect = targetElement.getBoundingClientRect();
    const targetScrollY = elementRect.top + window.pageYOffset - headerHeight - extraBreathingRoom;

    window.scrollTo({
      top: Math.max(0, targetScrollY),
      behavior: 'smooth'
    });
  }

  // Gestione click su tutti i link interni (#)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const targetSection = document.querySelector(href);
      if (targetSection) {
        e.preventDefault();
        scrollToSection(targetSection);

        if (history.pushState) {
          history.pushState(null, '', href);
        }

        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }
      }
    });
  });

  // Gestione atterraggio con hash nell'URL
  if (window.location.hash) {
    setTimeout(() => {
      const initialTarget = document.querySelector(window.location.hash);
      if (initialTarget) {
        scrollToSection(initialTarget);
      }
    }, 180);
  }

  // Scroll Spy per evidenziare la voce attiva nella topbar
  const trackedSections = document.querySelectorAll('section[id], header[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  function handleScrollSpy() {
    const scrollPos = window.pageYOffset;
    const headerH = getHeaderHeight();
    let currentId = '';

    trackedSections.forEach(sec => {
      const secTop = sec.offsetTop - headerH - 80;
      const secHeight = sec.offsetHeight;
      if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      allNavLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', handleScrollSpy, { passive: true });
  handleScrollSpy();

  // ==========================================
  // 7. INIZIALIZZAZIONE LINGUA ALL'AVVIO
  // ==========================================
  const urlParams = new URLSearchParams(window.location.search);
  const langQueryParam = urlParams.get('lang');
  const storedLang = localStorage.getItem('max-memories-lang');

  let startingLang = 'it';
  if (langQueryParam === 'en' || langQueryParam === 'it') {
    startingLang = langQueryParam;
  } else if (storedLang === 'en' || storedLang === 'it') {
    startingLang = storedLang;
  }

  setLanguage(startingLang);

});
