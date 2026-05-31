/* =========================================================
   DJ SKYLIGHT — MAIN SCRIPT
   ========================================================= */

(() => {
  'use strict';

  /* ---------- i18n / Language switch ---------- */
  const translations = {
    fr: {
      'nav.musique': 'Musique',
      'nav.mixs': 'Mixs',
      'nav.materiel': 'Matériel',
      'nav.bio': 'Bio',
      'nav.photos': 'Photos',
      'nav.contact': 'Contact',
      'nav.presskit': 'Mon press-kit',
      'hero.title': 'DJ & compositeur <span class="display red">Caribéen.</span>',
      'hero.tag': 'DJ Antillais — sets explosifs, énergie brute et son unique des Antilles.',
      'hero.cta.contact': 'Contactez-moi',
      'hero.cta.mixs': 'Écouter les mixs',
      'musique.title': 'Dernière sortie',
      'musique.sub': 'Ma dernière sortie musicale.',
      'musique.cta': 'Voir le clip',
      'mixs.title': 'Derniers Mixs...',
      'mixs.sub': 'Sets et mixtapes à écouter sans modération.',
      'mixs.card1.desc': 'Set live TikTok — shatta, bouyon & soca non-stop.',
      'mixs.card2.desc': 'Mon dernier mix 100% bouyon, avec les hits de 2025 !',
      'mixs.card3.desc': 'Mon premier mix 100% bouyon !',
      'mixs.listen': 'Écouter',
      'mixs.discover': 'Découvrir les mixs',
      'materiel.title': 'Matériel',
      'materiel.sub': 'Le matériel que j\'utilise en soirée ou en club.',
      'materiel.s11.label': 'DJM-S11 ou S7 & CDJ 3000',
      'materiel.rev7.label': 'DDJ-REV7 ou REV5',
      'bio.title': 'Biographie.',
      'bio.text': "DJ Skylight est un DJ caribéen de 21 ans, originaire de Martinique. Il découvre le mix à seulement 17 ans, en 2023, et en quelques années à peine, il a su développer un style unique qui attire de plus en plus d'attention dans la scène musicale caribéenne. Dès ses premiers sets, il impressionne par son énergie et sa créativité.",
      'photos.title': 'Photos.',
      'photos.sub': 'Quelques instants capturés en soirée.',
      'contact.title': 'Contactez-moi',
      'contact.sub': 'Booking, collaborations ou questions ? N\'hésitez pas à m\'écrire.',
      'contact.book': 'BOOKEZ VOTRE DATE <span class="display red">Sans plus attendre.</span>',
      'form.nom': 'Nom...',
      'form.prenom': 'Prénom...',
      'form.email': 'Email...',
      'form.message': 'Message...',
      'form.send': 'Envoyer',
      'form.sending': 'Envoi…',
      'form.success': 'Merci ! Votre message a bien été envoyé.',
      'form.error': 'Une erreur est survenue. Réessayez ou écrivez à djskylightfwi@gmail.com.',
      'footer.rights': 'Tous droits réservés',
      'footer.legal': 'Mentions Légales',
      'legal.title': 'Mentions Légales',
      'legal.sub': 'Informations légales du site DJ Skylight.',
      'legal.editor.title': 'Éditeur du site',
      'legal.editor.text': 'Le présent site est édité par DJ Skylight, artiste indépendant.<br>Contact : djskylightfwi@gmail.com — +596 696 30 12 76<br>Localisation : Martinique, Guadeloupe.',
      'legal.host.title': 'Hébergement',
      'legal.host.text': "Le site est hébergé par l'hébergeur choisi par l'éditeur. Les coordonnées complètes de l'hébergeur sont disponibles sur simple demande à l'adresse de contact ci-dessus.",
      'legal.ip.title': 'Propriété intellectuelle',
      'legal.ip.text': "L'ensemble des contenus (textes, visuels, musiques, mixs, logo et identité visuelle) présents sur ce site sont la propriété exclusive de DJ Skylight, sauf mention contraire. Toute reproduction, diffusion ou exploitation, totale ou partielle, sans autorisation écrite préalable est interdite.",
      'legal.data.title': 'Données personnelles',
      'legal.data.text': "Les informations transmises via le formulaire de contact sont uniquement utilisées pour répondre aux demandes de booking et ne sont ni cédées ni vendues à des tiers. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en écrivant à djskylightfwi@gmail.com.",
      'legal.cookies.title': 'Cookies &amp; contenus tiers',
      'legal.cookies.text': 'Ce site intègre des contenus externes (lecteur vidéo YouTube, liens vers les réseaux sociaux) susceptibles de déposer des cookies. Vous pouvez configurer votre navigateur pour les refuser.',
      'legal.links.title': 'Liens hypertextes',
      'legal.links.text': "Le site peut contenir des liens hypertextes vers des sites tiers (réseaux sociaux, plateformes de streaming, partenaires). DJ Skylight n'exerce aucun contrôle sur ces sites et ne saurait être tenu responsable de leur contenu, de leurs politiques de confidentialité ou de leurs pratiques. La consultation de ces sites se fait sous l'entière responsabilité de l'utilisateur.",
      'legal.liability.title': 'Responsabilité',
      'legal.liability.text': "DJ Skylight met tout en œuvre pour assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, il ne peut garantir l'exhaustivité ou l'absence d'erreurs des contenus mis à disposition. L'utilisation du site se fait sous la seule responsabilité de l'utilisateur. DJ Skylight ne saurait être tenu responsable des dommages directs ou indirects résultant de l'accès ou de l'utilisation du site.",
      'legal.credits.title': 'Crédits',
      'legal.credits.text': 'Conception, design et développement : DJ Skylight.<br>Typographies : Adobe Fonts (Typekit) et Poppins (Google Fonts).<br>Icônes : Boxicons (boxicons.com).<br>Photographies et visuels : DJ Skylight, sauf mention contraire.',
      'legal.back': "Retour à l'accueil"
    },
    en: {
      'nav.musique': 'Music',
      'nav.mixs': 'Mixes',
      'nav.materiel': 'Setup',
      'nav.bio': 'Bio',
      'nav.photos': 'Photos',
      'nav.contact': 'Contact',
      'nav.presskit': 'My press kit',
      'hero.title': 'DJ &amp; producer from the <span class="display red">Caribbean</span>',
      'hero.tag': 'Caribbean DJ — explosive sets, raw energy and the unique sound of the West Indies.',
      'hero.cta.contact': 'Contact me',
      'hero.cta.mixs': 'Listen to the mixes',
      'musique.title': 'Latest release',
      'musique.sub': 'My latest musical release.',
      'musique.cta': 'Watch the clip',
      'mixs.title': 'Latest Mixes...',
      'mixs.sub': 'Sets and mixtapes to play on repeat.',
      'mixs.card1.desc': 'TikTok live set — non-stop shatta, bouyon &amp; soca.',
      'mixs.card2.desc': 'My latest 100% bouyon mix, featuring the biggest hits of 2025!',
      'mixs.card3.desc': 'My very first 100% bouyon mix!',
      'mixs.listen': 'Listen',
      'mixs.discover': 'Discover the mixes',
      'materiel.title': 'Setup',
      'materiel.sub': 'The gear I use at parties and in clubs.',
      'materiel.s11.label': 'DJM-S11 or S7 & CDJ 3000',
      'materiel.rev7.label': 'DDJ-REV7 or REV5',
      'bio.title': 'Biography.',
      'bio.text': 'DJ Skylight is a 21-year-old Caribbean DJ from Martinique. He discovered DJing at just 17, back in 2023, and in only a few years, he has carved out a unique style that is drawing more and more attention in the Caribbean music scene. From his very first sets, he impresses with his energy and creativity.',
      'photos.title': 'Photos.',
      'photos.sub': 'A few moments captured at parties.',
      'contact.title': 'Contact me',
      'contact.sub': 'Booking, collaborations or questions? Feel free to reach out.',
      'contact.book': 'BOOK YOUR DATE <span class="display red">Without further delay.</span>',
      'form.nom': 'Last name...',
      'form.prenom': 'First name...',
      'form.email': 'Email...',
      'form.message': 'Message...',
      'form.send': 'Send',
      'form.sending': 'Sending…',
      'form.success': 'Thank you! Your message has been sent.',
      'form.error': 'Something went wrong. Please try again or email djskylightfwi@gmail.com.',
      'footer.rights': 'All rights reserved',
      'footer.legal': 'Legal Notices',
      'legal.title': 'Legal Notices',
      'legal.sub': 'Legal information for the DJ Skylight website.',
      'legal.editor.title': 'Site editor',
      'legal.editor.text': 'This site is published by DJ Skylight, independent artist.<br>Contact: djskylightfwi@gmail.com — +596 696 30 12 76<br>Location: Martinique, Guadeloupe.',
      'legal.host.title': 'Hosting',
      'legal.host.text': "The site is hosted by the host chosen by the editor. Full host details are available on request at the contact address above.",
      'legal.ip.title': 'Intellectual property',
      'legal.ip.text': 'All content (text, visuals, music, mixes, logo and visual identity) on this site is the exclusive property of DJ Skylight, unless otherwise stated. Any reproduction, distribution or exploitation, in whole or in part, without prior written authorization is prohibited.',
      'legal.data.title': 'Personal data',
      'legal.data.text': 'Information submitted through the contact form is used solely to respond to booking requests and is neither sold nor shared with third parties. In accordance with GDPR, you have the right to access, rectify and delete your data by writing to djskylightfwi@gmail.com.',
      'legal.cookies.title': 'Cookies &amp; third-party content',
      'legal.cookies.text': 'This site embeds external content (YouTube video player, social media links) that may set cookies. You can configure your browser to refuse them.',
      'legal.links.title': 'Hyperlinks',
      'legal.links.text': 'The site may contain hyperlinks to third-party sites (social networks, streaming platforms, partners). DJ Skylight does not control these sites and cannot be held responsible for their content, privacy policies or practices. Visiting them is at the user’s sole risk.',
      'legal.liability.title': 'Liability',
      'legal.liability.text': 'DJ Skylight makes every effort to ensure the accuracy and currency of the information published on this site. However, completeness and absence of errors cannot be guaranteed. Use of the site is at the user’s sole risk. DJ Skylight cannot be held responsible for any direct or indirect damages resulting from access to or use of the site.',
      'legal.credits.title': 'Credits',
      'legal.credits.text': 'Design and development: DJ Skylight.<br>Typography: Adobe Fonts (Typekit) and Poppins (Google Fonts).<br>Icons: Boxicons (boxicons.com).<br>Photography and visuals: DJ Skylight, unless otherwise stated.',
      'legal.back': 'Back to home'
    }
  };

  const setLang = (lang) => {
    if (!translations[lang]) return;
    const dict = translations[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (dict[key] !== undefined) el.placeholder = dict[key];
    });
    document.querySelectorAll('.lang-switch').forEach(sw => {
      sw.dataset.lang = lang;
      sw.querySelectorAll('.lang-switch__opt').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.langOpt === lang);
      });
      sw.setAttribute('aria-label',
        lang === 'fr' ? 'Switch language to English' : 'Changer la langue en français');
    });
    try { localStorage.setItem('lang', lang); } catch (_) {}
  };

  let savedLang = null;
  try { savedLang = localStorage.getItem('lang'); } catch (_) {}
  const initial = savedLang
    || ((navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'fr');
  setLang(initial);

  document.querySelectorAll('.lang-switch').forEach(sw => {
    sw.addEventListener('click', () => {
      setLang(sw.dataset.lang === 'fr' ? 'en' : 'fr');
    });
  });

  /* ---------- Page loader ---------- */
  const loader = document.getElementById('loader');
  if (loader) {
    const MIN_DURATION = 800;
    const t0 = performance.now();
    const hideLoader = () => {
      const elapsed = performance.now() - t0;
      const wait = Math.max(0, MIN_DURATION - elapsed);
      setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        setTimeout(() => loader.remove(), 900);
      }, wait);
    };
    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }
  }

  /* ---------- Sticky / scrolled navbar ---------- */
  const nav = document.getElementById('nav');
  const navVeil = document.getElementById('nav-veil');
  if (nav) {
    const onScroll = () => {
      const scrolled = window.scrollY > 50;
      nav.classList.toggle('scrolled', scrolled);
      navVeil?.classList.toggle('hidden', scrolled);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu (Dropdown Pill) ---------- */
  const burger = document.getElementById('burger');
  const mMenu = document.getElementById('mobile-menu');

  const setMenu = (open) => {
    if (!mMenu) return;
    burger?.classList.toggle('open', open);
    mMenu.classList.toggle('open', open);
    mMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
  };

  burger?.addEventListener('click', (e) => {
    e.stopPropagation(); // Évite que le clic ferme immédiatement le menu
    setMenu(!mMenu?.classList.contains('open'));
  });

  burger?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setMenu(!mMenu?.classList.contains('open'));
    }
  });

  // Fermeture quand on clique sur un lien (ou le bouton CTA)
  mMenu?.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) setMenu(false);
  });

  // Fermeture "Pro" : clic n'importe où en dehors du menu
  document.addEventListener('click', (e) => {
    if (mMenu?.classList.contains('open') && !mMenu.contains(e.target)) {
      setMenu(false);
    }
  });

  // Fermeture avec Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mMenu?.classList.contains('open')) setMenu(false);
  });

  /* ---------- Flip cards: tap to flip on touch ---------- */
  if (window.matchMedia('(hover: none)').matches) {
    document.querySelectorAll('.flip').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        card.classList.toggle('flipped');
      });
    });
  }

  /* ---------- Scroll spy ---------- */
  // Include the hero (#accueil): no link targets it, so it clears all active states
  const sections = [...document.querySelectorAll('#accueil, section[id]')];
  // Drive both the desktop nav and the mobile overlay links
  const spyLinks = [...document.querySelectorAll('#menu a, .m-dropdown__links a')];
  if (sections.length && spyLinks.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          spyLinks.forEach(l => l.classList.toggle(
            'active',
            l.getAttribute('href')?.endsWith('#' + e.target.id)
          ));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- Reveal-on-scroll (fade + blur) ---------- */
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        reveal.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

  /* ---------- YouTube embed: autoplay when section visible ---------- */
  let player = null;
  let ytReady = false;
  let ytInitialized = false;

  const initYTPlayer = () => {
    if (ytInitialized) return;
    const container = document.getElementById('ytplayer');
    if (!container || typeof YT === 'undefined' || !YT.Player) return;
    ytInitialized = true;

    player = new YT.Player('ytplayer', {
      videoId: 'GoIJSQp2lNc',
      playerVars: {
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        controls: 1
      },
      events: {
        onReady: () => { ytReady = true; }
      }
    });
  };

  // Defined globally so the YT iframe API can call it
  window.onYouTubeIframeAPIReady = initYTPlayer;

  // Only load API if a player container exists on this page
  if (document.getElementById('ytplayer')) {
    if (window.YT && window.YT.Player) {
      // API already loaded (e.g. cached SPA-like navigation) → init now
      initYTPlayer();
    } else if (!document.querySelector('script[data-yt-api]')) {
      // Dynamically inject the YT iframe API once
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      tag.dataset.ytApi = '1';
      document.head.appendChild(tag);
    }
  }

  const musique = document.getElementById('musique');
  if (musique) {
    new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!ytReady || !player) return;
        try {
          if (e.isIntersecting) {
            player.mute();
            player.playVideo();
          } else {
            player.pauseVideo();
          }
        } catch (_) { /* ignore — player may not be ready yet */ }
      });
    }, { threshold: 0.5 }).observe(musique);
  }

  /* ---------- Contact form → Formspree (AJAX) ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const sendBtn = form.querySelector('button[type="submit"]');
    const sendLabel = sendBtn?.innerHTML;

    // Live-region status message shown below the button
    const status = document.createElement('p');
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.hidden = true;
    form.appendChild(status);

    const t = (key) => {
      const lang = document.documentElement.lang || 'fr';
      return (translations[lang] && translations[lang][key]) || translations.fr[key] || '';
    };

    // Auto-dismiss the status message after a delay, with a smooth fade-out
    const AUTO_HIDE_MS = 8000;
    let hideTimer = null;

    const resetStatus = () => {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      status.hidden = true;
      status.classList.remove('form-status--out', 'form-status--ok', 'form-status--err');
    };

    const fadeOutStatus = () => {
      status.classList.add('form-status--out');
      const onEnd = (e) => {
        if (e.propertyName !== 'opacity') return;
        status.removeEventListener('transitionend', onEnd);
        resetStatus();
      };
      status.addEventListener('transitionend', onEnd);
    };

    const showStatus = (key, kind) => {
      resetStatus();
      status.textContent = t(key);
      status.classList.add(kind);
      status.hidden = false;
      hideTimer = setTimeout(fadeOutStatus, AUTO_HIDE_MS);
    };

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity?.();
        return;
      }

      // Sending state
      resetStatus();
      if (sendBtn) { sendBtn.disabled = true; sendBtn.innerHTML = t('form.sending'); }

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          form.reset();
          showStatus('form.success', 'form-status--ok');
        } else {
          showStatus('form.error', 'form-status--err');
        }
      } catch (_) {
        showStatus('form.error', 'form-status--err');
      } finally {
        if (sendBtn) { sendBtn.disabled = false; sendBtn.innerHTML = sendLabel; }
      }
    });
  }

  /* ---------- Magnetic hover — .glass.book card ---------- */
  const bookCard = document.querySelector('.glass.book');
  if (bookCard && window.matchMedia('(pointer:fine)').matches) {
    const MAX_X = 12;
    const MAX_Y = 8;
    const STIFFNESS = 0.08;
    const DAMPING = 0.82;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let velX = 0, velY = 0;
    let raf = null;
    let hovering = false;

    const tick = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      velX = (velX + dx * STIFFNESS) * DAMPING;
      velY = (velY + dy * STIFFNESS) * DAMPING;
      currentX += velX;
      currentY += velY;

      bookCard.style.transform =
        `translate3d(${currentX.toFixed(2)}px,${currentY.toFixed(2)}px,0)`;

      if (hovering || Math.abs(velX) + Math.abs(velY) > 0.01 ||
        Math.abs(dx) + Math.abs(dy) > 0.01) {
        raf = requestAnimationFrame(tick);
      } else {
        bookCard.style.transform = '';
        raf = null;
      }
    };

    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };

    bookCard.addEventListener('mousemove', (e) => {
      const r = bookCard.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const px = (e.clientX - cx) / (r.width / 2);
      const py = (e.clientY - cy) / (r.height / 2);
      targetX = px * MAX_X;
      targetY = py * MAX_Y;
      hovering = true;
      start();
    });

    bookCard.addEventListener('mouseleave', () => {
      hovering = false;
      targetX = 0;
      targetY = 0;
      start();
    });
  }

  /* ---------- Lightbox gallery ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg) {
    const openLightbox = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.photo-item[data-lightbox]').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) openLightbox(img.src, img.alt);
      });
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }
})();