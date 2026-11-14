/* Mia Quy Nhon — Festive eCard: builder page */
(function () {
  'use strict';
  const { OCCASIONS, TEMPLATES, getTemplate, MESSAGES, I18N, detectLang, esc, songLabel, renderCard } = window.MQN;
  const CFG = window.ECARD_CONFIG || {};
  const $ = s => document.querySelector(s);
  const PREVIEW_KEY = 'mqn-ecard-preview';

  const state = {
    lang: detectLang(),
    occasion: 'christmas',
    theme: 'c-coastal',
    photo: '',
    photoPosY: 50,
    message: '',
    fromName: '',
    recipients: [{ name: '', email: '' }]
  };
  const t = k => I18N[state.lang][k] || k;

  /* ---------- i18n ---------- */
  function applyLang() {
    document.documentElement.lang = state.lang;
    document.title = `${t('pageTitle')} — Mia Quy Nhon`;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));
    try { localStorage.setItem('mqn-ecard-lang', state.lang); } catch (e) { /* ignore */ }
    renderOccasions(); renderTemplates(); renderChips(); renderRecipients(); update();
  }
  document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => { state.lang = b.dataset.lang; applyLang(); }));

  /* ---------- Step 1: occasion + template ---------- */
  const stageBg = t => `radial-gradient(120% 90% at 50% 0%, ${t.stage[0]} 0%, ${t.stage[1]} 38%, ${t.stage[2]} 100%)`;
  const sample = () => (MESSAGES[state.occasion][0] || {})[state.lang] || '';

  function renderOccasions() {
    $('#occasions').innerHTML = Object.values(OCCASIONS).map(o => {
      const n = TEMPLATES.filter(t => t.occasion === o.id).length;
      return `<button type="button" class="occasion" role="tab" data-occasion="${o.id}" aria-selected="${o.id === state.occasion}">${esc(o.name[state.lang])}<small>${n} ${esc(t('templatesCount'))}</small></button>`;
    }).join('');
  }
  $('#occasions').addEventListener('click', e => {
    const b = e.target.closest('.occasion'); if (!b || b.dataset.occasion === state.occasion) return;
    state.occasion = b.dataset.occasion;
    state.theme = TEMPLATES.find(x => x.occasion === state.occasion).id;
    renderOccasions(); renderTemplates(); renderChips(); update();
  });

  function renderTemplates() {
    const list = TEMPLATES.filter(x => x.occasion === state.occasion);
    $('#templates').innerHTML = list.map(x => `
      <button type="button" class="tpl" role="radio" aria-checked="${x.id === state.theme}" data-theme="${x.id}" aria-label="${esc(x.name[state.lang])}">
        <div class="tpl__card" style="background:${stageBg(x)}"><div class="tpl__mini"></div></div>
        <span class="tpl__name">${esc(x.name[state.lang])}</span>
        <span class="tpl__song">♪ ${esc(songLabel(x, state.lang))}</span>
      </button>`).join('');
    $('#templates').querySelectorAll('.tpl').forEach(b =>
      renderCard(b.querySelector('.tpl__mini'), { theme: b.dataset.theme, lang: state.lang, message: sample() }, { thumb: true }));
  }
  $('#templates').addEventListener('click', e => {
    const b = e.target.closest('.tpl'); if (!b) return;
    state.theme = b.dataset.theme;
    document.querySelectorAll('.tpl').forEach(x => x.setAttribute('aria-checked', String(x === b)));
    update();
  });

  /* ---------- Step 2: photo ---------- */
  const drop = $('#drop'), input = $('#photo');
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('is-over'); }));
  drop.addEventListener('drop', e => { const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (f) loadPhoto(f); });
  input.addEventListener('change', () => { if (input.files[0]) loadPhoto(input.files[0]); });

  function loadPhoto(file) {
    hideError();
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const max = CFG.maxPhotoEdge || 1400;
      const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      const g = c.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
      g.drawImage(img, 0, 0, c.width, c.height);
      state.photo = c.toDataURL('image/jpeg', CFG.photoQuality || 0.84);
      state.photoPosY = 50; $('#photoPos').value = 50;
      URL.revokeObjectURL(url);
      $('#photoThumb').src = state.photo;
      $('#photoTools').classList.add('is-on');
      update();
    };
    img.onerror = () => { URL.revokeObjectURL(url); showError(t('errPhoto')); };
    img.src = url;
  }
  $('#photoPos').addEventListener('input', e => { state.photoPosY = +e.target.value; update(); });
  $('#photoRemove').addEventListener('click', () => {
    state.photo = ''; input.value = ''; $('#photoTools').classList.remove('is-on'); update();
  });

  /* ---------- Step 3: message ---------- */
  const max = CFG.maxMessage || 400;
  $('#message').maxLength = max; $('#max').textContent = max;
  function renderChips() {
    $('#chips').innerHTML = (MESSAGES[state.occasion] || []).map((m, i) =>
      `<button type="button" class="chip" data-i="${i}">${esc(m[state.lang])}</button>`).join('');
  }
  $('#chips').addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    const m = MESSAGES[state.occasion][+b.dataset.i];
    const txt = state.lang === 'vi' ? `${m.vi}\n${m.en}` : `${m.en}\n${m.vi}`;
    $('#message').value = txt.slice(0, max); state.message = $('#message').value; update();
  });
  $('#message').addEventListener('input', e => { state.message = e.target.value; update(); });
  $('#fromName').addEventListener('input', e => { state.fromName = e.target.value; update(); });

  /* ---------- Step 4: recipients ---------- */
  function renderRecipients() {
    $('#recipients').innerHTML = state.recipients.map((r, i) => `
      <div class="recipient" data-i="${i}">
        <input class="input" data-k="name" maxlength="60" placeholder="${esc(t('recipientName'))}" value="${esc(r.name)}" aria-label="${esc(t('recipientName'))}">
        <input class="input" data-k="email" type="email" maxlength="120" placeholder="${esc(t('recipientEmail'))}" value="${esc(r.email)}" aria-label="${esc(t('recipientEmail'))}">
        ${state.recipients.length > 1 ? `<button type="button" class="recipient__del" aria-label="Remove">×</button>` : '<span></span>'}
      </div>`).join('');
    $('#addRecipient').hidden = state.recipients.length >= (CFG.maxRecipients || 5);
  }
  $('#recipients').addEventListener('input', e => {
    const row = e.target.closest('.recipient'); if (!row) return;
    state.recipients[+row.dataset.i][e.target.dataset.k] = e.target.value;
    if (+row.dataset.i === 0) update();
  });
  $('#recipients').addEventListener('click', e => {
    if (!e.target.closest('.recipient__del')) return;
    state.recipients.splice(+e.target.closest('.recipient').dataset.i, 1); renderRecipients(); update();
  });
  $('#addRecipient').addEventListener('click', () => { state.recipients.push({ name: '', email: '' }); renderRecipients(); });

  /* ---------- Live preview ---------- */
  function cardData(recipient) {
    return {
      theme: state.theme, lang: state.lang, photo: state.photo, photoPosY: state.photoPosY,
      message: state.message.trim(), fromName: state.fromName.trim(),
      toName: ((recipient || state.recipients[0]).name || '').trim()
    };
  }
  let raf = 0;
  function update() {
    $('#count').textContent = state.message.length;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const d = cardData();
      if (!d.message) d.message = sample();
      renderCard($('#card'), d);
      $('#stage').style.background = stageBg(getTemplate(state.theme));
    });
  }

  /* ---------- Validation, preview, send ---------- */
  const EMAIL = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[a-z]{2,}$/i;
  function showError(msg) { const e = $('#error'); e.textContent = msg; e.classList.add('is-on'); e.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  function hideError() { $('#error').classList.remove('is-on'); }

  $('#previewBtn').addEventListener('click', () => {
    const d = cardData();
    if (!d.message) d.message = sample();
    let json = JSON.stringify(d);
    try { localStorage.setItem(PREVIEW_KEY, json); } catch (e) {
      try { localStorage.setItem(PREVIEW_KEY, JSON.stringify(Object.assign({}, d, { photo: '' }))); } catch (e2) { /* storage blocked */ }
    }
    let w = null;
    try { w = window.open('card.html?preview=1', '_blank'); } catch (e) { /* popups blocked */ }
    if (!w) { window.name = json; location.href = 'card.html#preview'; }   // same-tab fallback
  });

  $('#form').addEventListener('submit', async e => {
    e.preventDefault(); hideError();
    if (!CFG.apiUrl) { $('#configNotice').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const fromEmail = $('#fromEmail').value.trim();
    const recipients = state.recipients.map(r => ({ name: r.name.trim(), email: r.email.trim() })).filter(r => r.email || r.name);
    if (!state.message.trim() || !state.fromName.trim() || !fromEmail || !recipients.length || recipients.some(r => !r.email)) {
      return showError(t('errRequired'));
    }
    const bad = [fromEmail, ...recipients.map(r => r.email)].find(x => !EMAIL.test(x));
    if (bad) return showError(t('errEmail') + bad);
    if (!$('#consent').checked) return showError(t('errConsent'));

    const btn = $('#sendBtn'); btn.disabled = true; btn.textContent = t('sending');
    try {
      const res = await fetch(CFG.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'send', theme: state.theme, lang: state.lang,
          message: state.message.trim(), fromName: state.fromName.trim(), fromEmail,
          recipients, photo: state.photo, photoPosY: state.photoPosY,
          website: $('#website').value
        })
      });
      const out = await res.json();
      if (!out.ok) throw new Error(out.error || 'send failed');
      $('#form').hidden = true; $('#done').hidden = false;
      $('#viewSent').href = out.url || `card.html?id=${encodeURIComponent(out.ids && out.ids[0])}`;
      $('#done').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      console.error(err);
      showError(err && /limit/i.test(err.message) ? err.message : t('errSend'));
    } finally {
      btn.disabled = false; btn.textContent = t('send');
    }
  });

  $('#another').addEventListener('click', () => {
    $('#done').hidden = true; $('#form').hidden = false;
    state.recipients = [{ name: '', email: '' }]; $('#consent').checked = false;
    renderRecipients(); update();
    $('#templates').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- Init ---------- */
  const qp = new URLSearchParams(location.search);
  if (qp.get('theme')) { const tp = getTemplate(qp.get('theme')); state.theme = tp.id; state.occasion = tp.occasion; }
  if (CFG.apiUrl) $('#configNotice').remove(); else $('#configNotice').classList.add('is-on');
  applyLang();
})();
