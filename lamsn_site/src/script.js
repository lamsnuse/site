/* ============================================================
   LaMSN — Main JavaScript
   Sections:
     1. Chatbot knowledge base
     2. Header scroll behaviour
     3. Mobile menu (drawer + accordion)
     4. Smooth scroll for all anchor links
     5. Scroll-reveal animations (IntersectionObserver)
     6. Formations tab filter
     7. Contact & newsletter forms
     8. Chatbot widget
   ============================================================ */

// ─────────────────────────────────────────────────────────────
// 1. CHATBOT KNOWLEDGE BASE
// ─────────────────────────────────────────────────────────────
const chatbotKnowledge = [
  {
    keywords: ['quoi', 'lamsn', 'maison', 'sciences', 'numériques', 'institut', 'présentation', "c'est quoi"],
    answer: "LaMSN (La Maison des Sciences Numériques) est un Institut Fédératif de Recherche Interdisciplinaire de l'Université Sorbonne Paris Nord. Nous faisons le pont entre l'excellence académique et l'innovation industrielle avec 7 équipes de recherche, 30+ formations et plus de 200 chercheurs.",
  },
  {
    keywords: ['université', 'sorbonne', 'paris nord', 'affiliation', 'institution'],
    answer: "LaMSN est affilié à l'Université Sorbonne Paris Nord. Notre adresse est : 20 Avenue George Sand, 93210 Saint-Denis, France.",
  },
  {
    keywords: ['mission', 'vision', 'objectif', 'but', "raison d'être"],
    answer: "Notre mission est de fédérer les compétences en recherche et en formation pour répondre aux défis numériques de notre société. Nous développons l'excellence en recherche, formons les talents de demain, transférons les connaissances vers l'industrie, et contribuons à la souveraineté numérique française.",
  },
  {
    keywords: ['chiffres', 'statistiques', 'stats', 'nombre', 'équipes', 'chercheurs', 'formations'],
    answer: "LaMSN en chiffres : 30+ formations du DUT au Master, 7 équipes de recherche, 200+ enseignants-chercheurs, 50+ partenaires industriels, et un taux d'insertion professionnelle de 95%.",
  },
  {
    keywords: ['transformation numérique', 'digital', 'numérisation'],
    answer: "Nous accompagnons la transformation numérique à travers la recherche fondamentale et appliquée, en collaborant étroitement avec les entreprises et les institutions publiques.",
  },
  {
    keywords: ['gouvernance', 'structure', 'organisation', 'pilotage'],
    answer: "LaMSN dispose d'une structure fédérative pilotée par un conseil scientifique et un directoire, assurant la cohérence et l'efficacité de nos actions de recherche et de formation.",
  },
  {
    keywords: ['recherche', 'domaines', 'excellence', 'équipes', 'laboratoires'],
    answer: "LaMSN compte 7 équipes de recherche d'excellence : Confiance & Éthique Numériques, Santé & Numérique, Cybersécurité, Arts Numériques, FinTechs & Transition Énergétique, e-Humanities, et Cynotechnie & Innovation.",
  },
  {
    keywords: ['éthique', 'confiance', 'données', 'identité', 'sécurité'],
    answer: "L'équipe Confiance & Éthique Numériques travaille sur la sécurité, la sûreté et l'éthique dans le monde numérique. Ses domaines d'expertise incluent : gestion des données et identité numérique, sécurité de l'information, personnalisation technique et éthique, et contrôle d'accès temporel.",
  },
  {
    keywords: ['santé', 'e-santé', 'télémédecine', 'médical', 'biomédical'],
    answer: "L'équipe Santé & Numérique développe des solutions numériques pour améliorer les soins et la recherche médicale. Ses domaines : télémédecine et télésanté, intelligence artificielle en santé, systèmes d'information hospitaliers, et apprentissage médical numérique.",
  },
  {
    keywords: ['cybersécurité', 'sécurité', 'crypto', 'hacking', 'protection'],
    answer: "L'équipe Cybersécurité se spécialise dans la protection des systèmes d'information. Ses expertises : sécurité des réseaux, cryptographie avancée, détection d'intrusions, et forensique numérique.",
  },
  {
    keywords: ['arts', 'création', 'musique', 'graphique', 'artistique', 'design'],
    answer: "L'équipe Arts Numériques explore les frontières entre mathématiques, informatique et expression artistique. Ses activités : génération aléatoire de musique, arts graphiques numériques, deep learning créatif, et pavages et structures mathématiques.",
  },
  {
    keywords: ['fintech', 'finance', 'blockchain', 'bitcoin', 'énergie', 'durable'],
    answer: "L'équipe FinTechs & Transition Énergétique développe des solutions pour la finance responsable. Ses domaines : technologies blockchain, finance durable, smart grids, et économie circulaire numérique.",
  },
  {
    keywords: ['humanities', 'lettres', 'patrimoine', 'corpus', 'bibliothèque', 'langue'],
    answer: "L'équipe e-Humanities valorise les ressources patrimoniales et développe des outils de recherche innovants : numérisation de patrimoine, corpus textuels et oraux, bibliothèques numériques, et dictionnaires électroniques.",
  },
  {
    keywords: ['cynotechnie', 'chien', 'animal', 'assistance'],
    answer: "L'équipe Cynotechnie & Innovation développe des technologies au service de la relation homme-animal : technologies d'assistance, formation innovante, recherche appliquée, et partenariats industriels.",
  },
  {
    keywords: ['ia', 'intelligence artificielle', 'machine learning', 'deep learning'],
    answer: "L'intelligence artificielle est transversale à plusieurs équipes de recherche : Santé & Numérique (IA médicale), Arts Numériques (deep learning créatif), et Confiance & Éthique Numériques (éthique de l'IA).",
  },
  {
    keywords: ['formation', 'cursus', 'études', 'diplôme', 'catalogue', 'programme'],
    answer: "LaMSN propose plus de 30 formations du DUT au Master : DUT Informatique, MMI, Réseaux & Télécommunications, Licences Pro ASUR et Conception Web, Masters EID2, Informatique Biomédicale, Ingénierie Images et Réseaux, Design d'Interface, et formations d'ingénieur.",
  },
  {
    keywords: ['dut', 'bac+2', 'deux ans', 'technicien'],
    answer: "Nos DUT (Bac+2) : DUT Informatique (développement et systèmes), Métiers du Multimédia et de l'Internet MMI (webdesign et communication digitale), et Réseaux et Télécommunications (infrastructure réseau).",
  },
  {
    keywords: ['licence', 'bac+3', 'professionnelle', 'lp', 'trois ans'],
    answer: "Nos Licences Professionnelles (Bac+3) : Administration et Sécurité des Réseaux (ASUR) — spécialisation en administration système et sécurité réseau, et Conception, Rédaction et Réalisation Web — développement web et création de contenus numériques.",
  },
  {
    keywords: ['master', 'bac+5', 'cinq ans', 'mastère'],
    answer: "Nos Masters (Bac+5) : EID2 (data science et machine learning), Informatique Biomédicale (systèmes d'information de santé), Ingénierie et Innovation en Images et Réseaux, et Design d'Interface Multimédia et Internet.",
  },
  {
    keywords: ['ingénieur', 'école ingénieur', 'diplôme ingénieur'],
    answer: "Nos formations d'ingénieur (Bac+5) : Ingénieur Informatique (généraliste), Mathématiques Appliquées et Calcul Scientifique, et Télécommunications et Réseaux.",
  },
  {
    keywords: ['en ligne', 'distance', 'e-learning', 'mooc'],
    answer: "LaMSN propose des formations en ligne adaptées à votre rythme. Consultez notre section Formations en Ligne pour découvrir les modules disponibles.",
  },
  {
    keywords: ['inscription', 'candidature', 'postuler', 'admission'],
    answer: "Pour postuler à nos formations, rendez-vous sur la page du catalogue des formations et cliquez sur 'Détails de la formation' pour accéder aux modalités d'inscription.",
  },
  {
    keywords: ['insertion', 'emploi', 'travail', 'débouchés', 'métier', 'carrière'],
    answer: "Nos formations affichent un taux d'insertion professionnelle de 95%. Nos diplômés exercent dans le développement logiciel, la data science, la cybersécurité, la santé numérique, le webdesign, et bien d'autres métiers du numérique.",
  },
  {
    keywords: ['entreprise', 'partenariat', 'collaboration', 'industriel'],
    answer: "LaMSN propose plusieurs types de partenariats : Recherche Collaborative (accès aux laboratoires, publications conjointes), Recrutement & Stages (apprentissage, recrutement de diplômés), et Partenariat Stratégique (chaire industrielle, laboratoire commun).",
  },
  {
    keywords: ['stage', 'alternance', 'apprentissage', 'recrutement'],
    answer: "Pour les entreprises, nous proposons : stages de fin d'études, apprentissage en alternance, recrutement de jeunes diplômés, et formation continue sur mesure.",
  },
  {
    keywords: ['service', 'prestation', 'expertise', 'consulting'],
    answer: "Nos services aux entreprises : Expertise Technique sur les technologies émergentes, Formation Sur Mesure adaptée à vos besoins, Prestations de Service (études et développements), et Accès aux Infrastructures (plateformes technologiques de pointe).",
  },
  {
    keywords: ['contact', 'joindre', 'téléphone', 'email', 'mail', 'adresse'],
    answer: "Vous pouvez nous contacter :\n📍 Adresse : 20 Avenue George Sand, 93210 Saint-Denis\n📞 Téléphone : 01 55 93 93 93 ou 07 63 99 30 33\n✉️ Email : celia.agnoli@lamsn.sorbonne-paris-nord.fr\n🕐 Horaires : Lundi - Vendredi : 9h00 - 17h00",
  },
  {
    keywords: ['adresse', 'localisation', 'saint-denis', 'trouver'],
    answer: "Notre adresse est : 20 Avenue George Sand, 93210 Saint-Denis, France. Nous sommes situés sur le campus de l'Université Sorbonne Paris Nord.",
  },
  {
    keywords: ['horaires', 'ouvert', 'heures', 'quand'],
    answer: "Nos horaires d'ouverture : Lundi - Vendredi : 9h00 - 17h00",
  },
  {
    keywords: ['actualités', 'news', 'événements', 'colloque', 'conférence'],
    answer: "Consultez notre section Actualités pour découvrir nos dernières nouvelles et événements à venir. Inscrivez-vous également à notre newsletter pour rester informé.",
  },
  {
    keywords: ['newsletter', 'suivre', 'actualités par mail'],
    answer: "Inscrivez-vous à notre newsletter LaMSN pour recevoir nos actualités et invitations aux événements directement dans votre boîte mail. Le formulaire d'inscription est disponible dans la section Actualités.",
  },
  {
    keywords: ['réseaux sociaux', 'linkedin', 'facebook', 'instagram'],
    answer: "Suivez-nous sur les réseaux sociaux (LinkedIn, Bluesky, Facebook, Instagram) pour ne rien manquer de nos actualités. Les liens sont disponibles dans la section Contact.",
  },
];

const defaultChatResponse = `Je n'ai pas trouvé d'information spécifique sur cette question.\n\nPour obtenir une réponse personnalisée :\n📞 Appelez-nous : 01 55 93 93 93\n✉️ Email : celia.agnoli@lamsn.sorbonne-paris-nord.fr\n📝 Ou utilisez le formulaire de contact`;

const welcomeMessage = `Bonjour ! 👋 Je suis l'assistant virtuel de LaMSN.\n\nJe peux vous aider avec :\n• 🎓 Nos formations (DUT, Licence, Master, Ingénieur)\n• 🔬 Nos domaines de recherche\n• 🤝 Les partenariats entreprises\n• 📞 Nos coordonnées\n\nQue souhaitez-vous savoir ?`;

const suggestedQuestions = [
  'Quelles formations proposez-vous ?',
  'Quels sont vos domaines de recherche ?',
  'Comment contacter LaMSN ?',
  'Comment devenir partenaire ?',
  "Qu'est-ce que LaMSN ?",
];

function findChatResponse(message) {
  const normalized = message.toLowerCase().trim();
  const words = normalized.split(/\s+/);
  let best = null;

  for (const item of chatbotKnowledge) {
    let score = 0;
    for (const kw of item.keywords) {
      const k = kw.toLowerCase();
      if (normalized === k)             score += 10;
      else if (normalized.includes(k))  score += 5;
      else {
        for (const w of words) {
          if (k.split(/\s+/).includes(w) && w.length > 2) score += 1;
        }
      }
    }
    if (score > 0 && (!best || score > best.score)) best = { item, score };
  }

  return (best && best.score >= 2) ? best.item.answer : defaultChatResponse;
}

// ─────────────────────────────────────────────────────────────
// DOM READY
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Initialise lucide icons
  if (window.lucide) lucide.createIcons();

  // Copyright year
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─────────────────────────────────────────────────────────
  // 2. HEADER SCROLL BEHAVIOUR
  // ─────────────────────────────────────────────────────────
  const header = document.getElementById('main-header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');

  function updateHeader() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
      mobileMenuBtn && (mobileMenuBtn.style.color = '#293358');
    } else {
      header.classList.remove('scrolled');
      mobileMenuBtn && (mobileMenuBtn.style.color = 'white');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // ─────────────────────────────────────────────────────────
  // 3. MOBILE MENU
  // ─────────────────────────────────────────────────────────
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileDrawer  = document.getElementById('mobile-drawer');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');

  function openMobileMenu() {
    mobileOverlay.classList.add('open');
    mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileOverlay.classList.remove('open');
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileMenuBtn?.addEventListener('click', openMobileMenu);
  mobileCloseBtn?.addEventListener('click', closeMobileMenu);
  mobileOverlay?.addEventListener('click', closeMobileMenu);

  // Mobile accordion (À Propos, Excellence, Formations sub-menus)
  document.querySelectorAll('.mobile-accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const body   = btn.nextElementSibling;
      const isOpen = body.classList.contains('open');
      // Close all
      document.querySelectorAll('.mobile-accordion-body').forEach(b => b.classList.remove('open'));
      document.querySelectorAll('.mobile-accordion-btn').forEach(b => b.classList.remove('open'));
      // Toggle this
      if (!isOpen) { body.classList.add('open'); btn.classList.add('open'); }
    });
  });

  // ─────────────────────────────────────────────────────────
  // 4. SMOOTH SCROLL
  // ─────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      closeMobileMenu();
    });
  });

  // data-scroll-to on buttons
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.scrollTo);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ─────────────────────────────────────────────────────────
  // 5. SCROLL-REVEAL ANIMATIONS
  // ─────────────────────────────────────────────────────────
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll(
    '.animate-on-scroll, .reveal-left, .reveal-right, .reveal-scale'
  ).forEach(el => revealObserver.observe(el));

  // ─────────────────────────────────────────────────────────
  // 5b. HERO TYPING ANIMATION
  // ─────────────────────────────────────────────────────────
  const heroTypingEl = document.getElementById('hero-typing');
  const heroCursorEl = document.getElementById('hero-cursor');
  if (heroTypingEl) {
    const heroText = 'Sciences Numériques';
    let heroIdx = 0;
    function typeHero() {
      if (heroIdx <= heroText.length) {
        heroTypingEl.textContent = heroText.slice(0, heroIdx);
        heroIdx++;
        setTimeout(typeHero, heroIdx === 1 ? 200 : 65);
      } else {
        // Keep cursor blinking for 2s then fade it out
        if (heroCursorEl) {
          setTimeout(() => {
            heroCursorEl.style.transition = 'opacity 0.6s';
            heroCursorEl.style.opacity = '0';
          }, 2200);
        }
      }
    }
    // Start after the h1 fade-in animation (~700ms delay-100 + 600ms transition)
    setTimeout(typeHero, 900);
  }

  // ─────────────────────────────────────────────────────────
  // 5c. ANIMATED COUNTER NUMBERS
  // ─────────────────────────────────────────────────────────
  function animateCounter(el) {
    const target  = parseInt(el.dataset.count, 10);
    const suffix  = el.dataset.suffix || '';
    const dur     = 1400;
    let start     = null;
    function step(ts) {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / dur, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - pct, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (pct < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.count-up[data-count]').forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsRow = document.getElementById('hero-stats');
  if (statsRow) counterObserver.observe(statsRow);

  // ─────────────────────────────────────────────────────────
  // 5d. HERO PARALLAX (subtle content drift on scroll)
  // ─────────────────────────────────────────────────────────
  const heroParallaxEl = document.querySelector('.hero-parallax');
  if (heroParallaxEl) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroParallaxEl.style.transform = `translateY(${y * 0.08}px)`;
      }
    }, { passive: true });
  }

  // ─────────────────────────────────────────────────────────
  // 6. FORMATIONS TABS
  // ─────────────────────────────────────────────────────────
  const tabBtns        = document.querySelectorAll('.tab-btn');
  const formationCards = document.querySelectorAll('.formation-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const level = btn.dataset.level;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      formationCards.forEach(card => {
        const show = level === 'all' || card.dataset.level === level;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  // ─────────────────────────────────────────────────────────
  // 7. FORMS
  // ─────────────────────────────────────────────────────────
  document.getElementById('contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    alert('Message envoyé ! Nous vous répondrons dans les plus brefs délais.');
    e.target.reset();
  });

  document.getElementById('newsletter-form')?.addEventListener('submit', e => {
    e.preventDefault();
    alert('Inscription à la newsletter réussie !');
    e.target.reset();
  });

  // ─────────────────────────────────────────────────────────
  // 8. CHATBOT WIDGET
  // ─────────────────────────────────────────────────────────
  const chatToggle   = document.getElementById('chatbot-toggle');
  const chatWindow   = document.getElementById('chatbot-window');
  const chatClose    = document.getElementById('chatbot-close');
  const chatMessages = document.getElementById('chatbot-messages');
  const chatInput    = document.getElementById('chatbot-input');
  const chatSend     = document.getElementById('chatbot-send');
  let chatStarted    = false;

  function openChat() {
    chatWindow.classList.add('open');
    chatToggle.classList.add('hidden-btn');
    if (!chatStarted) {
      appendBotMessage(welcomeMessage);
      renderSuggestions();
      chatStarted = true;
    }
    setTimeout(() => chatInput?.focus(), 120);
  }

  function closeChat() {
    chatWindow.classList.remove('open');
    chatToggle.classList.remove('hidden-btn');
  }

  chatToggle?.addEventListener('click', openChat);
  chatClose?.addEventListener('click', closeChat);

  function escHtml(str) {
    return str
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function now() {
    return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  function scrollBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendBotMessage(text) {
    const div = document.createElement('div');
    div.className = 'flex gap-3';
    div.innerHTML = `
      <div style="width:32px;height:32px;border-radius:50%;background:rgba(71,138,201,0.12);
                  flex-shrink:0;display:flex;align-items:center;justify-content:center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
             fill="none" stroke="#478ac9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
          <path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>
        </svg>
      </div>
      <div style="max-width:75%;background:#f5f5f5;border-radius:1rem;border-top-left-radius:4px;padding:.75rem 1rem">
        <p style="font-size:.875rem;line-height:1.6;color:#293358;white-space:pre-line">${escHtml(text)}</p>
        <span style="font-size:.7rem;color:#666;display:block;margin-top:4px">${now()}</span>
      </div>`;
    chatMessages.appendChild(div);
    scrollBottom();
  }

  function appendUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'flex gap-3';
    div.style.flexDirection = 'row-reverse';
    div.innerHTML = `
      <div style="width:32px;height:32px;border-radius:50%;background:#293358;
                  flex-shrink:0;display:flex;align-items:center;justify-content:center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
             fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <div style="max-width:75%;background:#478ac9;border-radius:1rem;border-top-right-radius:4px;padding:.75rem 1rem">
        <p style="font-size:.875rem;line-height:1.6;color:white">${escHtml(text)}</p>
        <span style="font-size:.7rem;color:rgba(255,255,255,.7);display:block;margin-top:4px">${now()}</span>
      </div>`;
    chatMessages.appendChild(div);
    scrollBottom();
  }

  function showTyping() {
    const div = document.createElement('div');
    div.id = 'chat-typing';
    div.className = 'flex gap-3';
    div.innerHTML = `
      <div style="width:32px;height:32px;border-radius:50%;background:rgba(71,138,201,0.12);
                  flex-shrink:0;display:flex;align-items:center;justify-content:center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
             fill="none" stroke="#478ac9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
          <path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>
        </svg>
      </div>
      <div style="background:#f5f5f5;border-radius:1rem;border-top-left-radius:4px;padding:.75rem 1rem">
        <div style="display:flex;gap:4px">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>`;
    chatMessages.appendChild(div);
    scrollBottom();
  }

  function renderSuggestions() {
    const div = document.createElement('div');
    div.id = 'chat-suggestions';
    div.style.paddingTop = '4px';
    div.innerHTML = `
      <p style="font-size:.75rem;color:#666;margin-bottom:.5rem">Questions suggérées :</p>
      <div style="display:flex;flex-wrap:wrap;gap:.375rem">
        ${suggestedQuestions.map(q => `
          <button data-q="${escHtml(q)}"
            style="font-size:.75rem;background:white;border:1px solid rgba(71,138,201,.3);
                   color:#478ac9;padding:.35rem .75rem;border-radius:9999px;cursor:pointer">
            ${escHtml(q)} →
          </button>`).join('')}
      </div>`;
    chatMessages.appendChild(div);
    div.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('chat-suggestions')?.remove();
        handleUserInput(btn.dataset.q);
      });
    });
    scrollBottom();
  }

  function handleUserInput(text) {
    if (!text?.trim()) return;
    appendUserMessage(text);
    showTyping();
    setTimeout(() => {
      document.getElementById('chat-typing')?.remove();
      appendBotMessage(findChatResponse(text));
    }, 600 + Math.random() * 400);
  }

  chatSend?.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';
    handleUserInput(text);
  });

  chatInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); chatSend.click(); }
  });

  // ─────────────────────────────────────────────────────────
  // 9. VIDEO THUMBNAIL AUTO-INJECTION
  //    Reads data-video-src on cards, extracts YouTube / Google Drive IDs,
  //    injects a real <img> thumbnail + overlay above the play button.
  // ─────────────────────────────────────────────────────────
  function getVideoThumbUrl(src) {
    if (!src) return null;
    // YouTube — youtu.be/ID or youtube.com/watch?v=ID or /embed/ID or /v/ID
    const yt = src.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([A-Za-z0-9_-]{11})/);
    if (yt) return `https://img.youtube.com/vi/${yt[1]}/mqdefault.jpg`;
    // Google Drive — /file/d/ID or open?id=ID
    const gd = src.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([A-Za-z0-9_-]+)/);
    if (gd) return `https://drive.google.com/thumbnail?id=${gd[1]}&sz=w640`;
    return null;
  }

  document.querySelectorAll('[data-video-src]').forEach(card => {
    const thumb = card.querySelector('.video-card-thumb');
    if (!thumb) return;
    const thumbUrl = getVideoThumbUrl(card.dataset.videoSrc);
    if (!thumbUrl) return;

    const img = document.createElement('img');
    img.src       = thumbUrl;
    img.alt       = '';
    img.className = 'video-thumb';
    img.onerror   = () => img.remove(); // silently fall back to gradient

    const overlay = document.createElement('div');
    overlay.className = 'video-thumb-overlay';

    // Insert before existing children so play button stays on top
    thumb.prepend(overlay);
    thumb.prepend(img);
  });

}); // end DOMContentLoaded
