/* Mia Quy Nhon — Festive eCard: recipient viewer */
(function () {
  'use strict';
  const { TEMPLATES, getTemplate, MESSAGES, I18N, detectLang, renderCard } = window.MQN;
  const CFG = window.ECARD_CONFIG || {};
  const $ = s => document.querySelector(s);
  const qp = new URLSearchParams(location.search);
  // Also accept hash routes (#preview, #demo-c-coastal) for hosts that strip query strings
  const hash = location.hash.replace(/^#/, '');
  if (hash === 'preview') qp.set('preview', '1');
  if (hash.startsWith('demo-')) qp.set('demo', hash.slice(5));
  const music = new window.MQN.MusicBox();
  let fx = null, data = null, L = I18N[detectLang()];

  const ICON_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  const ICON_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';

  function setLoading(msg) { $('#loading p').textContent = msg; $('#loading').hidden = false; }

  async function load() {
    if (qp.get('preview')) {
      let raw = (window.name && window.name.startsWith('{')) ? window.name : null;
      if (!raw) { try { raw = localStorage.getItem('mqn-ecard-preview'); } catch (e) { /* storage blocked */ } }
      if (raw) return Object.assign(JSON.parse(raw), { preview: true });
    }
    let demo = qp.get('demo');
    if (demo) {
      const lang = detectLang();
      const tp = getTemplate(demo);
      demo = tp.id;
      const m = MESSAGES[tp.occasion][0];
      return { theme: demo, lang, toName: lang === 'vi' ? 'Lan Anh' : 'Charlotte', fromName: 'Mia Quy Nhon',
        message: lang === 'vi' ? `${m.vi}\n${m.en}` : `${m.en}\n${m.vi}`, photo: '', preview: true };
    }
    const id = qp.get('id');
    if (!id || !CFG.apiUrl) return null;
    const res = await fetch(`${CFG.apiUrl}?action=card&id=${encodeURIComponent(id)}`);
    const out = await res.json();
    return out.ok ? out.card : null;
  }

  function typewrite(el, text) {
    return new Promise(resolve => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = text; return resolve(); }
      let i = 0; el.textContent = ''; el.classList.add('typing');
      const step = () => {
        i += text[i] === ' ' ? 2 : 1;
        el.textContent = text.slice(0, i);
        if (i < text.length) setTimeout(step, 26 + Math.random() * 30);
        else { el.classList.remove('typing'); resolve(); }
      };
      setTimeout(step, 400);
    });
  }

  function open() {
    const env = $('#envelope');
    if (env.classList.contains('is-open')) return;
    const theme = getTemplate(data.theme);
    env.classList.add('is-open');
    document.body.classList.add('is-open');
    music.chime();
    setTimeout(() => music.play(theme.song, theme.voice), 700);
    $('#sound').hidden = false; $('#sound').innerHTML = ICON_ON;

    setTimeout(() => {
      $('#envWrap').classList.add('is-gone');
      $('#cardWrap').hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => $('#cardWrap').classList.add('is-shown')));
      fx.burstConfetti();
      fx.start(theme.effect);
      setTimeout(() => typewrite($('#card [data-message]'), data.message || ''), 900);
      $('#dock').classList.add('is-on');
    }, 1250);
  }

  function replay() {
    const wrap = $('#cardWrap');
    wrap.classList.remove('is-shown');
    setTimeout(() => {
      wrap.classList.add('is-shown');
      fx.burstConfetti();
      music.play(getTemplate(data.theme).song, getTemplate(data.theme).voice);
      typewrite($('#card [data-message]'), data.message || '');
    }, 500);
  }

  async function init() {
    setLoading(L.loading);
    try { data = await load(); } catch (e) { console.error(e); data = null; }
    if (!data) { setLoading(L.notFound); $('#dock').classList.add('is-on'); labelDock(); $('#replay').hidden = true; return; }

    data.theme = getTemplate(data.theme).id;
    L = I18N[data.lang === 'en' ? 'en' : 'vi'];
    document.documentElement.lang = data.lang === 'en' ? 'en' : 'vi';
    const theme = getTemplate(data.theme);
    document.body.style.background = `radial-gradient(120% 90% at 50% 0%, ${theme.stage[0]} 0%, ${theme.stage[1]} 38%, ${theme.stage[2]} 100%) fixed`;
    document.querySelector('meta[name=theme-color]').content = theme.stage[1];
    $('#loading').hidden = true;

    $('#envIntro').textContent = L.envelopeFor;
    $('#envFrom').textContent = data.fromName ? `${L.envelopeFrom} ${data.fromName}` : '';
    $('#envName').textContent = data.toName || '';
    $('#tapLabel').textContent = L.tapToOpen;
    $('#soundHint').textContent = L.soundHint;
    $('#envWrap').hidden = false;
    renderCard($('#card'), data, { typewriter: true });
    labelDock();
    if (data.preview) { const b = document.createElement('div'); b.className = 'badge'; b.textContent = L.previewBadge; document.body.appendChild(b); }

    fx = new window.MQN.Effects($('#fx'), { onBurst: k => music.pop(k) });
    fx.start(theme.effect === 'fireworks' ? 'stars' : theme.effect === 'confetti' ? 'sparkle' : theme.effect); // gentle ambience before opening
    $('#envelope').addEventListener('click', open);
  }

  function labelDock() {
    $('#replay').textContent = L.replay;
    $('#createOwn').textContent = L.createOwn;
    $('#createOwn').href = `index.html${data ? `?theme=${data.theme}` : ''}`;
    $('#discover').textContent = L.discover;
    $('#discover').href = CFG.siteUrl || 'https://miaquynhon.com';
  }

  $('#sound').addEventListener('click', () => {
    const m = !music.muted; music.setMuted(m);
    $('#sound').innerHTML = m ? ICON_OFF : ICON_ON;
    $('#sound').setAttribute('aria-pressed', String(m));
  });
  $('#replay').addEventListener('click', replay);
  document.addEventListener('visibilitychange', () => {
    if (!music.ctx) return;
    if (document.hidden) music.ctx.suspend(); else music.ctx.resume();
  });

  init();
})();
