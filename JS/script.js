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
      'nav.contact': 'Réserver',
      'nav.presskit': 'Mon press-kit',
      'hero.title': 'DJ & compositeur <span class="display red">Caribéen.</span>',
      'hero.tag': 'DJ Antillais — sets explosifs, énergie brute et son unique des Antilles.',
      'hero.cta.contact': 'Envoyer ma demande',
      'hero.cta.mixs': 'Écouter les mixs',
      'booking.avail': 'Disponible en Martinique & Guadeloupe',
      'booking.types': 'Clubs, soirées privées, events, festivals',
      'booking.cta': 'Envoyer ma demande',
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
      'materiel.sub': 'Le matériel sur lequel je mixe régulièrement.',
      'materiel.s11.label': 'DJM-S11 ou S7 & CDJ 3000',
      'materiel.rev7.label': 'DDJ-REV7 ou REV5',
      'bio.title': 'Biographie.',
      'bio.text': "DJ Skylight est un DJ caribéen de 21 ans, originaire de Martinique. Il découvre le mix à seulement 17 ans, en 2023, et en quelques années à peine, il a su développer un style unique qui attire de plus en plus d'attention dans la scène musicale caribéenne. Dès ses premiers sets, il impressionne par son énergie et sa créativité.",
      'photos.title': 'Photos.',
      'photos.sub': 'Quelques instants capturés en soirée.',
      'contact.title': 'Réservez <span class="sig">votre date</span>',
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
      'footer.cgu': 'CGU',
      'legal.title': 'Mentions Légales',
      'legal.sub': 'Informations légales du site DJ Skylight.',
      'legal.editor.title': 'Éditeur du site',
      'legal.editor.text': 'Le présent site est édité par DJ Skylight, artiste indépendant.<br>Contact : djskylightfwi@gmail.com — +596 696 30 12 76<br>Localisation : Martinique, Guadeloupe.',
      'legal.host.title': 'Hébergement',
      'legal.host.text': "Le site est hébergé par o2switch, SAS immatriculée au RCS de Clermont-Ferrand.<br>Siège social : Chemin des Pardiaux, 63000 Clermont-Ferrand, France.<br>Téléphone : 04 44 44 60 40<br>Site web : <a href='https://www.o2switch.fr' target='_blank' rel='noopener'>https://www.o2switch.fr</a>",
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
      'legal.credits.text': "Conception, design et développement : DJ Skylight.<br>Typographies : Adobe Fonts (Typekit) et Poppins (Google Fonts).<br>Icônes : Boxicons (boxicons.com).<br>Photographies : <a href='https://www.instagram.com/vthvnvse/' target='_blank' rel='noopener'>@vthvnvse</a>",
      'legal.back': "Retour à l'accueil",
      'cgu.title': "Conditions Générales d'Utilisation",
      'cgu.sub': "Règles d'utilisation du site DJ Skylight.",
      'cgu.object.title': 'Objet',
      'cgu.object.text': "Les présentes conditions générales d'utilisation (CGU) ont pour objet d'encadrer les modalités d'accès et d'utilisation du site de DJ Skylight. En naviguant sur ce site, l'utilisateur reconnaît avoir pris connaissance des présentes CGU et s'engage à les respecter.",
      'cgu.acceptance.title': 'Acceptation des conditions',
      'cgu.acceptance.text': "L'accès et l'utilisation du site impliquent l'acceptation pleine et entière des présentes CGU. Si l'utilisateur n'accepte pas tout ou partie de ces conditions, il lui est demandé de ne pas utiliser le site. DJ Skylight se réserve le droit de modifier ces conditions à tout moment.",
      'cgu.access.title': 'Accès au site',
      'cgu.access.text': "Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. Tous les frais liés à l'accès au site (matériel, connexion, logiciels) sont à la charge de l'utilisateur. DJ Skylight s'efforce de maintenir le site accessible en continu, mais ne saurait être tenu responsable d'une indisponibilité, qu'elle soit liée à une maintenance, une panne technique ou un cas de force majeure.",
      'cgu.usage.title': 'Utilisation du site',
      'cgu.usage.text': "L'utilisateur s'engage à faire un usage du site conforme à la loi et aux présentes CGU. Il s'interdit notamment de porter atteinte au bon fonctionnement du site, d'y introduire des contenus illicites, ou de tenter d'accéder de manière non autorisée à ses systèmes. Tout usage frauduleux ou contraire aux présentes conditions pourra entraîner la restriction d'accès au site, sans préjudice d'éventuelles poursuites.",
      'cgu.ip.title': 'Propriété intellectuelle',
      'cgu.ip.text': "L'ensemble des contenus (textes, visuels, musiques, mixs, logo et identité visuelle) présents sur ce site sont la propriété exclusive de DJ Skylight, sauf mention contraire. Toute reproduction, diffusion ou exploitation, totale ou partielle, sans autorisation écrite préalable est interdite.",
      'cgu.links.title': 'Liens externes',
      'cgu.links.text': "Le site peut contenir des liens vers des sites tiers (réseaux sociaux, plateformes de streaming, partenaires). DJ Skylight n'exerce aucun contrôle sur ces sites et ne saurait être tenu responsable de leur contenu, de leurs politiques de confidentialité ou de leurs pratiques. La consultation de ces sites se fait sous l'entière responsabilité de l'utilisateur.",
      'cgu.data.title': 'Données personnelles',
      'cgu.data.text': "Les informations transmises via le formulaire de contact sont uniquement utilisées pour répondre aux demandes de booking et ne sont ni cédées ni vendues à des tiers. Pour plus de détails, l'utilisateur peut consulter les <a href='mentions.html'>mentions légales</a>.",
      'cgu.liability.title': 'Responsabilité',
      'cgu.liability.text': "DJ Skylight met tout en œuvre pour assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, il ne peut garantir l'exhaustivité ou l'absence d'erreurs des contenus mis à disposition. L'utilisation du site se fait sous la seule responsabilité de l'utilisateur. DJ Skylight ne saurait être tenu responsable des dommages directs ou indirects résultant de l'accès ou de l'utilisation du site.",
      'cgu.modif.title': 'Modification des CGU',
      'cgu.modif.text': "DJ Skylight se réserve le droit de modifier les présentes CGU à tout moment, afin de les adapter aux évolutions du site ou de la réglementation. Les conditions applicables sont celles en vigueur au moment de la consultation du site. L'utilisateur est invité à les consulter régulièrement.",
      'cgu.law.title': 'Droit applicable',
      'cgu.law.text': "Les présentes CGU sont régies par le droit français. En cas de litige relatif à l'utilisation du site, et à défaut de résolution amiable, les tribunaux français seront seuls compétents."
    },
    en: {
      'nav.musique': 'Music',
      'nav.mixs': 'Mixes',
      'nav.materiel': 'Setup',
      'nav.bio': 'Bio',
      'nav.photos': 'Photos',
      'nav.contact': 'Book',
      'nav.presskit': 'My press kit',
      'hero.title': 'DJ &amp; producer from the <span class="display red">Caribbean</span>',
      'hero.tag': 'Caribbean DJ — explosive sets, raw energy and the unique sound of the West Indies.',
      'hero.cta.contact': 'Book a date',
      'hero.cta.mixs': 'Listen to the mixes',
      'booking.avail': 'Available in Martinique & Guadeloupe',
      'booking.types': 'Clubs, private parties, events, festivals',
      'booking.cta': 'Book a date',
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
      'materiel.sub': 'The equipment I use during my DJ sets.',
      'materiel.s11.label': 'DJM-S11 or S7 & CDJ 3000',
      'materiel.rev7.label': 'DDJ-REV7 or REV5',
      'bio.title': 'Biography.',
      'bio.text': 'DJ Skylight is a 21-year-old Caribbean DJ from Martinique. He discovered DJing at just 17, back in 2023, and in only a few years, he has carved out a unique style that is drawing more and more attention in the Caribbean music scene. From his very first sets, he impresses with his energy and creativity.',
      'photos.title': 'Photos.',
      'photos.sub': 'A few moments captured at parties.',
      'contact.title': 'Book <span class="sig">your date</span>',
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
      'footer.cgu': 'Terms of Use',
      'legal.title': 'Legal Notices',
      'legal.sub': 'Legal information for the DJ Skylight website.',
      'legal.editor.title': 'Site editor',
      'legal.editor.text': 'This site is published by DJ Skylight, independent artist.<br>Contact: djskylightfwi@gmail.com — +596 696 30 12 76<br>Location: Martinique, Guadeloupe.',
      'legal.host.title': 'Hosting',
      'legal.host.text': "The site is hosted by o2switch, SAS registered with the Clermont-Ferrand Trade and Companies Register.<br>Registered office: Chemin des Pardiaux, 63000 Clermont-Ferrand, France.<br>Phone: 04 44 44 60 40<br>Website: <a href='https://www.o2switch.fr' target='_blank' rel='noopener'>https://www.o2switch.fr</a>",
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
      'legal.credits.text': "Design and development: DJ Skylight.<br>Typography: Adobe Fonts (Typekit) and Poppins (Google Fonts).<br>Icons: Boxicons (boxicons.com).<br>Photography: <a href='https://www.instagram.com/vthvnvse/' target='_blank' rel='noopener'>@vthvnvse</a>",
      'legal.back': 'Back to home',
      'cgu.title': 'Terms of Use',
      'cgu.sub': 'Rules for using the DJ Skylight website.',
      'cgu.object.title': 'Purpose',
      'cgu.object.text': 'These terms of use (ToU) govern access to and use of the DJ Skylight website. By browsing this site, the user acknowledges having read these terms and agrees to comply with them.',
      'cgu.acceptance.title': 'Acceptance of terms',
      'cgu.acceptance.text': 'Accessing and using the site implies full acceptance of these terms. If the user does not accept all or part of these terms, they are asked not to use the site. DJ Skylight reserves the right to modify these terms at any time.',
      'cgu.access.title': 'Access to the site',
      'cgu.access.text': 'The site is freely accessible to any user with Internet access. All costs related to accessing the site (hardware, connection, software) are the user’s responsibility. DJ Skylight strives to keep the site continuously available but cannot be held responsible for any unavailability, whether due to maintenance, technical failure or force majeure.',
      'cgu.usage.title': 'Use of the site',
      'cgu.usage.text': 'The user agrees to use the site in compliance with the law and these terms. In particular, the user shall not disrupt the proper functioning of the site, introduce unlawful content, or attempt to gain unauthorized access to its systems. Any fraudulent use or use contrary to these terms may result in restricted access to the site, without prejudice to possible legal action.',
      'cgu.ip.title': 'Intellectual property',
      'cgu.ip.text': 'All content (text, visuals, music, mixes, logo and visual identity) on this site is the exclusive property of DJ Skylight, unless otherwise stated. Any reproduction, distribution or exploitation, in whole or in part, without prior written authorization is prohibited.',
      'cgu.links.title': 'External links',
      'cgu.links.text': 'The site may contain links to third-party sites (social networks, streaming platforms, partners). DJ Skylight does not control these sites and cannot be held responsible for their content, privacy policies or practices. Visiting them is at the user’s sole risk.',
      'cgu.data.title': 'Personal data',
      'cgu.data.text': "Information submitted through the contact form is used solely to respond to booking requests and is neither sold nor shared with third parties. For more details, the user may refer to the <a href='mentions.html'>legal notices</a>.",
      'cgu.liability.title': 'Liability',
      'cgu.liability.text': 'DJ Skylight makes every effort to ensure the accuracy and currency of the information published on this site. However, completeness and absence of errors cannot be guaranteed. Use of the site is at the user’s sole risk. DJ Skylight cannot be held responsible for any direct or indirect damages resulting from access to or use of the site.',
      'cgu.modif.title': 'Changes to the terms',
      'cgu.modif.text': 'DJ Skylight reserves the right to modify these terms at any time, in order to adapt them to changes in the site or regulations. The applicable terms are those in force at the time the site is visited. Users are encouraged to review them regularly.',
      'cgu.law.title': 'Applicable law',
      'cgu.law.text': 'These terms are governed by French law. In the event of a dispute relating to use of the site, and failing an amicable resolution, the French courts shall have sole jurisdiction.'
    }
  };

  const FADE_MS = 260;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reflète la langue dans l'URL : ?lang=en pour l'anglais, URL propre pour le FR par défaut.
  const syncUrl = (lang) => {
    try {
      const url = new URL(window.location.href);
      if (lang === 'en') url.searchParams.set('lang', 'en');
      else url.searchParams.delete('lang');
      history.replaceState(null, '', url);
    } catch (_) {}
  };

  const applyText = (dict) => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (dict[key] !== undefined) el.placeholder = dict[key];
    });
  };

  const setLang = (lang, animate) => {
    if (!translations[lang]) return;
    const dict = translations[lang];

    // Feedback immédiat : <html lang>, pill FR/EN, stockage et URL.
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-switch').forEach(sw => {
      sw.dataset.lang = lang;
      sw.querySelectorAll('.lang-switch__opt').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.langOpt === lang);
      });
      sw.setAttribute('aria-label',
        lang === 'fr' ? 'Switch language to English' : 'Changer la langue en français');
    });
    try { localStorage.setItem('lang', lang); } catch (_) {}
    syncUrl(lang);

    // Swap du texte, avec fondu si demandé.
    if (animate && !prefersReduced) {
      const switches = document.querySelectorAll('.lang-switch');
      switches.forEach(sw => sw.classList.add('is-switching'));
      setTimeout(() => switches.forEach(sw => sw.classList.remove('is-switching')), 600);

      // Armer la transition (lang-anim), forcer un reflow, PUIS déclencher le flou
      // (lang-out) — sinon le navigateur saute l'état sortant sans l'animer.
      document.body.classList.add('lang-anim');
      void document.body.offsetWidth;
      document.body.classList.add('lang-out');
      setTimeout(() => {
        // FLIP : le swap de texte change la largeur des voisins (« Réserver » → « Book »),
        // ce qui décale le toggle ancré à droite. On mémorise sa position avant le swap,
        // puis on le fait glisser jusqu'à sa nouvelle place au lieu d'un saut brutal.
        const sws = Array.from(document.querySelectorAll('.lang-switch'));
        const before = sws.map(sw => sw.getBoundingClientRect().left);

        applyText(dict);

        sws.forEach((sw, i) => {
          const dx = before[i] - sw.getBoundingClientRect().left;
          if (Math.abs(dx) < 0.5) return;
          sw.style.transition = 'none';
          sw.style.transform = `translateX(${dx}px)`;
          void sw.offsetWidth;
          sw.style.transition = 'transform .45s cubic-bezier(.22, 1, .36, 1)';
          sw.style.transform = '';
          setTimeout(() => {
            sw.style.transition = '';
            sw.style.transform = '';
          }, 480);
        });

        requestAnimationFrame(() => {
          document.body.classList.remove('lang-out');
          setTimeout(() => document.body.classList.remove('lang-anim'), FADE_MS);
        });
      }, FADE_MS);
    } else {
      applyText(dict);
    }
  };

  let savedLang = null;
  try { savedLang = localStorage.getItem('lang'); } catch (_) {}
  let urlLang = null;
  try { urlLang = new URL(window.location.href).searchParams.get('lang'); } catch (_) {}
  if (urlLang && !translations[urlLang]) urlLang = null;
  // Priorité : URL (lien partagé explicite) > préférence stockée > langue navigateur.
  const initial = urlLang || savedLang
    || ((navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'fr');
  setLang(initial);

  document.querySelectorAll('.lang-switch').forEach(sw => {
    sw.addEventListener('click', () => {
      setLang(sw.dataset.lang === 'fr' ? 'en' : 'fr', true);
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
    form.appendChild(status);

    const t = (key) => {
      const lang = document.documentElement.lang || 'fr';
      return (translations[lang] && translations[lang][key]) || translations.fr[key] || '';
    };

    // The card expands/collapses smoothly via the .is-open class (see CSS)
    const AUTO_HIDE_MS = 8000;
    let hideTimer = null;

    const collapseStatus = () => {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      status.classList.remove('is-open');
    };

    const showStatus = (key, kind, autoHide = true) => {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      status.textContent = t(key);
      status.classList.remove('form-status--ok', 'form-status--err');
      status.classList.add(kind, 'is-open');
      // Errors stay until the next submit; only success auto-dismisses
      if (autoHide) hideTimer = setTimeout(collapseStatus, AUTO_HIDE_MS);
    };

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity?.();
        return;
      }

      // Sending state — collapse any previous message smoothly
      collapseStatus();
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
          showStatus('form.error', 'form-status--err', false);
        }
      } catch (_) {
        showStatus('form.error', 'form-status--err', false);
      } finally {
        if (sendBtn) { sendBtn.disabled = false; sendBtn.innerHTML = sendLabel; }
      }
    });
  }

  /* ---------- Lightbox gallery ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  if (lightbox && lightboxImg) {
    const lightboxItems = [...document.querySelectorAll('.photo-item[data-lightbox]')];
    let currentLightboxIndex = 0;

    const showLightboxPhoto = (index) => {
      if (!lightboxItems.length) return;
      currentLightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
      const img = lightboxItems[currentLightboxIndex].querySelector('img');
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    };

    const openLightbox = (index) => {
      showLightboxPhoto(index);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const navigateLightbox = (direction) => {
      if (!lightbox.classList.contains('open')) return;
      showLightboxPhoto(currentLightboxIndex + direction);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    lightboxItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        openLightbox(index);
      });
    });

    lightboxPrev?.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext?.addEventListener('click', () => navigateLightbox(1));
    lightboxClose?.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }
})();
