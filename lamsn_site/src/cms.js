/**
 * LaMSN CMS — Shared data layer
 * Fetches content from JSON files in /data/ and injects live content into all pages.
 * Content is managed via Decap CMS at /admin/.
 */
(function () {
  'use strict';

  // ── Data fetching ─────────────────────────────────────────────

  const _cache = {};

  async function fetchJSON(path) {
    if (_cache[path]) return _cache[path];
    try {
      const res = await fetch(path);
      if (!res.ok) return null;
      const data = await res.json();
      _cache[path] = data;
      return data;
    } catch { return null; }
  }

  async function loadAll() {
    const [actu, vids, forms, parts, mbs] = await Promise.all([
      fetchJSON('/data/actualites.json'),
      fetchJSON('/data/videos.json'),
      fetchJSON('/data/formations.json'),
      fetchJSON('/data/partenaires.json'),
      fetchJSON('/data/membres.json'),
    ]);
    return {
      actualites:  actu?.items  || [],
      videos:      vids?.items  || [],
      formations:  forms?.items || [],
      partenaires: parts?.items || [],
      membres:     mbs?.items?.length ? mbs.items : [],
    };
  }

  // ── Utilities ─────────────────────────────────────────────────

  function escH(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function fmtDate(d) {
    if (!d) return { day: '—', mon: '' };
    const dt = new Date(d + 'T00:00:00');
    const day = dt.getDate().toString().padStart(2, '0');
    const mon = dt.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
    return { day, mon: mon.charAt(0).toUpperCase() + mon.slice(1) };
  }

  const CAT_COLORS = {
    'Événement':   'bg-blue-100 text-blue-700',
    'Partenariat': 'bg-green-100 text-green-700',
    'Formation':   'bg-purple-100 text-purple-700',
    'Recherche':   'bg-orange-100 text-orange-700',
    'Prix':        'bg-yellow-100 text-yellow-700',
    'Conférence':  'bg-blue-100 text-blue-700',
  };
  function catCls(cat) { return CAT_COLORS[cat] || 'bg-gray-100 text-gray-700'; }

  const LVL_COLORS = {
    'Licence 3':   'bg-green-100 text-green-700',
    'Licence Pro': 'bg-teal-100 text-teal-700',
    'Master 1':    'bg-purple-100 text-purple-700',
    'Master 2':    'bg-purple-100 text-purple-700',
    'Doctorat':    'bg-red-100 text-red-700',
  };
  const LVL_DATA = {
    'Licence 3': 'licence', 'Licence Pro': 'licence',
    'Master 1': 'master', 'Master 2': 'master', 'Doctorat': 'master',
  };

  const AVATAR_GRADS = [
    'linear-gradient(135deg,#293358,#478ac9)',
    'linear-gradient(135deg,#354878,#00d4ff)',
    'linear-gradient(135deg,#ff6b00,#ffaa44)',
    'linear-gradient(135deg,#2a9d8f,#57cc99)',
  ];

  function initials(nom) {
    return nom.split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase();
  }

  function getYTThumb(url) {
    const m = url.match(/(?:youtu\.be\/|[?&]v=|embed\/)([A-Za-z0-9_-]{11})/);
    return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : '';
  }

  function getYTId(url) {
    const m = url.match(/(?:youtu\.be\/|[?&]v=|embed\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  function getVimeoId(url) {
    const m = url.match(/vimeo\.com\/(\d+)/);
    return m ? m[1] : null;
  }

  // ── Google Drive helpers ──────────────────────────────────────

  function getGDriveId(url) {
    if (!url || !url.includes('drive.google.com')) return null;
    const m = url.match(/\/d\/([A-Za-z0-9_-]{25,})|[?&]id=([A-Za-z0-9_-]{25,})/);
    return m ? (m[1] || m[2]) : null;
  }

  function gDriveImg(url) {
    const id = getGDriveId(url);
    return id ? `https://drive.google.com/uc?export=view&id=${id}` : url;
  }

  function normaliseImg(url) {
    if (!url) return url;
    if (url.includes('drive.google.com/thumbnail') || url.includes('drive.google.com/uc?')) return url;
    return getGDriveId(url) ? gDriveImg(url) : url;
  }

  // ── Video Lightbox ────────────────────────────────────────────

  let _lbItems = [];

  function setupLightbox() {
    if (document.getElementById('cms-lightbox')) return;
    const lb = document.createElement('div');
    lb.id = 'cms-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.style.cssText = [
      'position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9999',
      'display:none;align-items:center;justify-content:center;padding:20px 24px',
    ].join(';');
    lb.innerHTML = `
      <div class="cms-lb-inner" onclick="event.stopPropagation()">
        <button id="cms-lb-close" aria-label="Fermer"
          style="position:absolute;top:-44px;right:0;background:none;border:none;color:#fff;
                 font-size:26px;cursor:pointer;line-height:1;opacity:.7;transition:opacity .15s"
          onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='.7'">✕</button>

        <div class="cms-lb-player">
          <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;
                      border-radius:12px;background:#000" id="cms-lb-content"></div>
        </div>

        <div class="cms-lb-details">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap">
            <span id="cms-lb-badge"
              style="display:none;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;
                     background:rgba(71,138,201,0.25);color:#7ec8f5;letter-spacing:0.03em"></span>
            <span id="cms-lb-date"
              style="font-size:12px;color:rgba(255,255,255,0.45)"></span>
          </div>
          <h2 id="cms-lb-title"
            style="font-family:'Merriweather',serif;font-size:1.2rem;font-weight:700;
                   color:#fff;line-height:1.45;margin:0 0 14px"></h2>
          <p id="cms-lb-desc"
            style="font-size:0.875rem;color:rgba(255,255,255,0.65);line-height:1.75;margin:0"></p>
        </div>
      </div>`;
    lb.addEventListener('click', closeLightbox);
    setTimeout(() => {
      const btn = lb.querySelector('#cms-lb-close');
      if (btn) btn.addEventListener('click', closeLightbox);
    }, 0);
    document.body.appendChild(lb);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  function closeLightbox() {
    const lb = document.getElementById('cms-lightbox');
    if (!lb) return;
    lb.style.display = 'none';
    const c = document.getElementById('cms-lb-content');
    if (c) c.innerHTML = '';
    document.body.style.overflow = '';
  }

  function openVideo(v) {
    setupLightbox();
    const lb      = document.getElementById('cms-lightbox');
    if (!lb) return;
    const content = document.getElementById('cms-lb-content');
    const titleEl = document.getElementById('cms-lb-title');
    const descEl  = document.getElementById('cms-lb-desc');
    const badgeEl = document.getElementById('cms-lb-badge');
    const dateEl  = document.getElementById('cms-lb-date');

    if (titleEl) titleEl.textContent = v.titre || '';
    if (descEl)  descEl.textContent  = v.description || '';
    if (badgeEl) {
      const type = v.type || '';
      badgeEl.textContent = type;
      badgeEl.style.display = type ? '' : 'none';
    }
    if (dateEl) {
      const rawDate = v.date || '';
      if (rawDate) {
        const dt = new Date(rawDate + (rawDate.includes('T') ? '' : 'T00:00:00'));
        dateEl.textContent = dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
      } else {
        dateEl.textContent = '';
      }
    }

    const url = v.url || '';

    function setEmbed(html) {
      content.innerHTML = html;
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    const ytId = getYTId(url);
    if (ytId) {
      setEmbed(`<iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0"
        frameborder="0" allowfullscreen allow="autoplay; encrypted-media"
        style="position:absolute;top:0;left:0;width:100%;height:100%"></iframe>`);
      return;
    }

    const vimeoId = getVimeoId(url);
    if (vimeoId) {
      setEmbed(`<iframe src="https://player.vimeo.com/video/${vimeoId}?autoplay=1"
        frameborder="0" allowfullscreen allow="autoplay"
        style="position:absolute;top:0;left:0;width:100%;height:100%"></iframe>`);
      return;
    }

    const gdId = getGDriveId(url);
    if (gdId) {
      setEmbed(`<iframe src="https://drive.google.com/file/d/${gdId}/preview"
        frameborder="0" allowfullscreen allow="autoplay"
        style="position:absolute;top:0;left:0;width:100%;height:100%"></iframe>`);
      return;
    }

    // Direct URL fallback
    setEmbed(`<video src="${escH(url)}" controls autoplay
      style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain"></video>`);
  }

  window.cmsPlay = function (idx) { openVideo(_lbItems[idx]); };
  window.cmsPlayVideo = function (url, title, desc, type, date) {
    openVideo({ url, titre: title, description: desc, type, date });
  };

  // ── News detail modal ─────────────────────────────────────────

  function openCmsActuModal(card) {
    const overlay = document.getElementById('news-modal-overlay');
    if (!overlay) return;
    const closeBtn   = document.getElementById('nm-close');
    const hero       = document.getElementById('nm-hero');
    const dateEl     = document.getElementById('nm-date');
    const catEl      = document.getElementById('nm-cat');
    const titleEl    = document.getElementById('nm-title');
    const excerptEl  = document.getElementById('nm-excerpt');
    const bodyEl     = document.getElementById('nm-body');

    const title    = card.dataset.title    || '';
    const date     = card.dataset.date     || '';
    const category = card.dataset.category || '';
    const badge    = card.dataset.badge    || 'bg-gray-100 text-gray-700';
    const excerpt  = card.dataset.excerpt  || '';
    const imgSrc   = card.dataset.img      || '';
    const body     = card.dataset.body     || '';

    const oldImg = hero.querySelector('img');
    if (oldImg) oldImg.remove();
    const oldPh = hero.querySelector('.nm-placeholder');
    if (oldPh) oldPh.remove();

    if (imgSrc) {
      const img = new Image();
      img.className = 'news-modal-img';
      img.alt = title;
      img.onerror = function() {
        this.remove();
        const ph = document.createElement('div');
        ph.className = 'news-modal-img-placeholder nm-placeholder';
        ph.style.cssText = 'background:linear-gradient(135deg,#293358,#478ac9);height:200px';
        hero.insertBefore(ph, hero.firstChild);
      };
      img.src = imgSrc;
      hero.insertBefore(img, closeBtn);
    } else {
      const ph = document.createElement('div');
      ph.className = 'news-modal-img-placeholder nm-placeholder';
      ph.style.cssText = 'background:linear-gradient(135deg,#293358,#354878);height:200px';
      hero.insertBefore(ph, closeBtn);
    }

    dateEl.textContent = date;
    catEl.className = 'inline-block text-xs font-semibold px-3 py-1 rounded-full ' + badge;
    catEl.textContent = category;
    titleEl.textContent = title;
    if (excerptEl) {
      excerptEl.textContent = excerpt;
      excerptEl.style.display = excerpt ? '' : 'none';
    }
    bodyEl.innerHTML = body;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('news-modal-box').scrollTop = 0;
    if (closeBtn) closeBtn.focus();
  }

  // ── Render: Actualités ────────────────────────────────────────

  function renderActu(containerId, limit, mode, data) {
    const el = document.getElementById(containerId);
    if (!el) return;

    let items = (data.actualites || [])
      .filter(a => a.publie)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    if (limit > 0) items = items.slice(0, limit);
    if (!items.length) return;

    const READ_ARROW = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;

    el.innerHTML = items.map((a) => {
      const d = fmtDate(a.date);
      const badge = catCls(a.categorie);
      const imgNorm = normaliseImg(a.image) || '';
      const dateDisplay = a.date
        ? new Date(a.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        : '';
      const bodyHtml = (a.contenu || '')
        .split('\n').filter(l => l.trim())
        .map(l => `<p>${escH(l)}</p>`).join('') || `<p>${escH(a.resume)}</p>`;

      const dataAttrs = `data-title="${escH(a.titre)}"
             data-date="${escH(dateDisplay)}"
             data-category="${escH(a.categorie)}"
             data-badge="${escH(badge)}"
             data-excerpt="${escH(a.resume)}"
             data-img="${escH(imgNorm)}"
             data-body="${escH(bodyHtml)}"`;

      if (mode === 'magazine') {
        const FALLBACK_BG = {
          'Événement':   'linear-gradient(135deg,#1a2340,#293358)',
          'Partenariat': 'linear-gradient(135deg,#354878,#478ac9)',
          'Formation':   'linear-gradient(135deg,#354878,#478ac9)',
          'Recherche':   'linear-gradient(135deg,#293358,#354878)',
        };
        const bg = FALLBACK_BG[a.categorie] || 'linear-gradient(135deg,#293358,#354878)';
        return `
          <div class="news-card" role="button" tabindex="0" ${dataAttrs}>
            <div class="news-card-img-wrap">
              ${imgNorm
                ? `<img src="${escH(imgNorm)}" alt="" class="news-card-img"
                        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
                : ''
              }
              <div class="news-card-img-placeholder" style="${imgNorm ? 'display:none;' : ''}background:${bg}">
                <div style="text-align:center">
                  <div style="font-family:'Merriweather',serif;font-size:2rem;font-weight:700;color:white;line-height:1">${d.day}</div>
                  <div style="font-size:0.8rem;color:rgba(255,255,255,0.8);text-transform:uppercase;letter-spacing:0.07em">${d.mon}</div>
                </div>
              </div>
              <span class="news-card-cat-badge ${badge}">${escH(a.categorie)}</span>
            </div>
            <div class="news-card-body">
              <div class="news-card-date">${escH(dateDisplay)}</div>
              <h3 class="news-card-title">${escH(a.titre)}</h3>
              <p class="news-card-excerpt">${escH(a.resume)}</p>
              <span style="display:inline-flex;align-items:center;gap:4px;margin-top:auto;padding-top:0.75rem;font-size:0.75rem;font-weight:600;color:#478ac9">
                Lire l'article ${READ_ARROW}
              </span>
            </div>
          </div>`;
      }

      // Horizontal list card (actualites.html)
      return `
        <div class="flex gap-4 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm card-hover"
             role="button" tabindex="0" style="cursor:pointer"
             ${dataAttrs}>
          ${a.image
            ? `<div class="flex-shrink-0 w-24 h-auto bg-lamsn-gray-light">
                 <img src="${escH(imgNorm)}" alt="" style="width:96px;height:100%;object-fit:cover;display:block"
                      onerror="this.style.display='none'">
               </div>`
            : `<div class="flex-shrink-0 w-16 h-16 bg-lamsn-gray-light rounded-lg flex flex-col items-center justify-center m-4 mt-5">
                 <span class="text-2xl font-bold text-lamsn-blue-dark">${d.day}</span>
                 <span class="text-xs text-lamsn-gray-medium uppercase">${d.mon}</span>
               </div>`
          }
          <div class="flex-1 min-w-0 p-5 ${a.image ? 'border-l border-gray-100' : ''}">
            <span class="inline-block text-xs font-medium px-2 py-0.5 rounded-full ${badge} mb-2">${escH(a.categorie)}</span>
            <h3 class="font-semibold text-lamsn-blue-dark mb-1 line-clamp-2">${escH(a.titre)}</h3>
            <p class="text-sm text-lamsn-gray-medium line-clamp-2">${escH(a.resume)}</p>
            <span style="display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-size:0.75rem;font-weight:600;color:#478ac9">
              Lire l'article ${READ_ARROW}
            </span>
          </div>
        </div>`;
    }).join('');

    el.addEventListener('click', function(e) {
      const card = e.target.closest('[data-title]');
      if (card) openCmsActuModal(card);
    });
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('[data-title]');
        if (card) { e.preventDefault(); openCmsActuModal(card); }
      }
    });
  }

  // ── Render: Vidéos ────────────────────────────────────────────

  function renderVideos(containerId, limit, data) {
    const el = document.getElementById(containerId);
    if (!el) return;

    let items = (data.videos || [])
      .filter(v => v.actif)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    if (limit > 0) items = items.slice(0, limit);
    if (!items.length) return;

    _lbItems = items;

    el.innerHTML = items.map((v, i) => {
      const customThumb = normaliseImg(v.thumbnail);
      const ytThumb     = getYTThumb(v.url || '');
      const gdId        = getGDriveId(v.url || '');

      let staticThumb = '';
      if (customThumb) {
        staticThumb = `<img class="video-thumb" src="${escH(customThumb)}" alt=""
                            onerror="this.style.display='none'">`;
      } else if (ytThumb) {
        staticThumb = `<img class="video-thumb" src="${escH(ytThumb)}" alt=""
                            onerror="this.style.display='none'">`;
      } else if (gdId) {
        const thumbUrl = `https://drive.google.com/thumbnail?id=${gdId}&sz=w640-h360`;
        staticThumb = `<img class="video-thumb" src="${thumbUrl}" alt=""
                            onerror="this.style.display='none'">`;
      }

      return `
        <div class="video-card animate-on-scroll bg-white rounded-2xl overflow-hidden shadow-md card-hover"
             style="cursor:pointer" onclick="cmsPlay(${i})"
             data-vid-type="${escH(v.type||'local')}"
             data-vid-title="${escH(v.titre)}"
             data-vid-desc="${escH(v.description)}">
          <div class="video-card-thumb">
            ${staticThumb}
            <div class="video-thumb-overlay"></div>
            <button class="video-play-btn" aria-label="Lire la vidéo">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="#293358" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
          </div>
          <div class="p-5">
            <span class="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 mb-2">
              ${escH(v.type || 'Vidéo')}
            </span>
            <h3 class="font-semibold text-lamsn-blue-dark mb-1 line-clamp-2">${escH(v.titre)}</h3>
            <p class="text-sm text-lamsn-gray-medium line-clamp-2">${escH(v.description)}</p>
          </div>
        </div>`;
    }).join('');
  }

  // ── Render: Formations ────────────────────────────────────────

  function renderFormations(containerId, data) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const items = (data.formations || []).filter(f => f.actif);
    if (!items.length) return;

    const html = items.map(f => `
      <div class="formation-card card-hover border border-lamsn-blue-light border-2 rounded-xl p-6 bg-white shadow-sm" data-level="${LVL_DATA[f.niveau] || 'autre'}">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-medium px-2.5 py-1 rounded-full ${LVL_COLORS[f.niveau] || 'bg-gray-100 text-gray-700'}">${escH(f.niveau)}</span>
          ${f.places ? `<span class="text-xs text-lamsn-gray-medium">${f.places} places</span>` : ''}
        </div>
        <h3 class="font-serif text-lg font-bold text-lamsn-blue-dark mb-2 line-clamp-2">${escH(f.nom)}</h3>
        <p class="text-sm text-lamsn-gray-medium leading-relaxed mb-4">${escH(f.description)}</p>
        ${f.duree ? `<div class="text-xs text-lamsn-gray-medium flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${escH(f.duree)}</div>` : ''}
      </div>`).join('');

    el.insertAdjacentHTML('afterbegin', html);
  }

  // ── Render: Partenaires ───────────────────────────────────────

  function renderPartners(containerId, data) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const items = (data.partenaires || []).filter(p => p.actif);
    if (!items.length) {
      const sec = el.closest('section');
      if (sec) sec.style.display = 'none';
      return;
    }

    el.innerHTML = items.map(p => `
      <div class="text-center">
        <div class="bg-white rounded-xl p-5 shadow-sm card-hover flex flex-col items-center gap-3 h-full border border-gray-100">
          ${p.logo
            ? `<img src="${escH(normaliseImg(p.logo))}" alt="${escH(p.nom)}" style="height:48px;max-width:140px;object-fit:contain"
                    onerror="this.style.display='none'">`
            : `<div style="width:52px;height:52px;background:rgba(41,51,88,.08);border-radius:10px;
                           display:flex;align-items:center;justify-content:center;font-size:22px">🏢</div>`
          }
          <div>
            <div class="font-semibold text-lamsn-blue-dark text-sm">${escH(p.nom)}</div>
            <div class="text-xs text-lamsn-gray-medium mt-1">${escH(p.type)}</div>
          </div>
          ${p.site ? `<a href="${escH(p.site)}" target="_blank" rel="noopener noreferrer"
                         class="text-xs text-lamsn-blue-light hover:underline mt-auto">Visiter →</a>` : ''}
        </div>
      </div>`).join('');
  }

  // ── Render: Membres ───────────────────────────────────────────

  function renderMembers(containerId, data) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const items = (data.membres || []).filter(m => m.actif);
    if (!items.length) {
      const sec = el.closest('section');
      if (sec) sec.style.display = 'none';
      return;
    }

    el.innerHTML = items.map((m, i) => {
      const roleText    = m.role || '';
      const etageMatch  = roleText.match(/^(RdC|R\+\d+)/);
      const bureauMatch = roleText.match(/Bureau\s*(\d+)/i);
      const etage  = etageMatch  ? etageMatch[1]  : '';
      const bureau = bureauMatch ? bureauMatch[1] : '';
      const phone  = m.specialite || '';
      const isRdc  = etage === 'RdC';
      const etageStyle = isRdc
        ? 'background:#dcfce7;color:#166534'
        : 'background:#ede9fe;color:#5b21b6';

      return `
        <div class="bg-white rounded-xl p-4 border border-gray-100 text-center
                    hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default"
             style="box-shadow:0 1px 4px rgba(41,51,88,.07)"
             data-mb-etage="${escH(etage)}" data-mb-nom="${escH(m.nom)}">
          <div style="width:54px;height:54px;border-radius:50%;margin:0 auto 10px;overflow:hidden;
                      flex-shrink:0;display:flex;align-items:center;justify-content:center;
                      ${m.photo ? '' : 'background:' + AVATAR_GRADS[i % AVATAR_GRADS.length]}">
            ${m.photo
              ? `<img src="${escH(normaliseImg(m.photo))}" alt="${escH(m.nom)}"
                      style="width:100%;height:100%;object-fit:cover">`
              : `<span style="font-size:18px;font-weight:700;color:#fff;letter-spacing:-.5px">${escH(initials(m.nom))}</span>`
            }
          </div>
          <div style="font-weight:700;color:#293358;font-size:0.78rem;line-height:1.35;margin-bottom:7px">${escH(m.nom)}</div>
          <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:3px;margin-bottom:8px">
            ${etage  ? `<span style="font-size:10px;font-weight:600;padding:2px 7px;border-radius:20px;${etageStyle}">${escH(etage)}</span>` : ''}
            ${bureau ? `<span style="font-size:10px;padding:2px 7px;border-radius:20px;background:#f0f4ff;color:#354878">B.${escH(bureau)}</span>` : ''}
          </div>
          ${phone ? `<a href="tel:${escH(phone.replace(/\s/g,''))}"
                       style="font-size:11px;color:#478ac9;display:inline-flex;align-items:center;
                              gap:3px;text-decoration:none;white-space:nowrap"
                       title="${escH(phone)}">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1
                       4.99 12 19.79 19.79 0 0 1 1.72 3.37a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1
                       2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0
                       6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/>
            </svg>
            ${escH(phone)}
          </a>` : ''}
          ${m.email ? `<div style="margin-top:5px"><a href="mailto:${escH(m.email)}"
            style="font-size:10px;color:#9ca3af;display:block;white-space:nowrap;
                   overflow:hidden;text-overflow:ellipsis;max-width:100%">${escH(m.email)}</a></div>` : ''}
        </div>`;
    }).join('');
  }

  // ── Boot ──────────────────────────────────────────────────────

  async function boot() {
    setupLightbox();

    const data = await loadAll();

    renderActu('cms-actu-home',   4, 'magazine', data);
    renderActu('cms-actu-page',   0, 'magazine', data);
    renderVideos('cms-videos-home', 6, data);
    renderVideos('cms-videos-all',  0, data);
    renderFormations('cms-formations-grid', data);
    renderPartners('cms-partners-grid', data);
    renderMembers('cms-members-grid', data);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
