/* Mia Quy Nhon — Festive eCard: themes, copy, artwork and shared card renderer */
(function () {
  'use strict';

  const THEMES = {
    christmas: {
      id: 'christmas',
      name: { vi: 'Giáng Sinh Bên Biển', en: 'Coastal Christmas' },
      blurb: { vi: 'Tuyết lấp lánh, chuông ngân vui tươi', en: 'Glistening snow and merry bells' },
      title: 'Merry Christmas',
      subtitle: 'Giáng Sinh An Lành',
      effect: 'snow',
      song: 'jingle',
      dark: false,
      sky: ['#7E3D2C', '#C26A4F', '#E0967A'],
      sea: ['#A8513B', '#5E2B1F'],
      ornament: 'star'
    },
    silentnight: {
      id: 'silentnight',
      name: { vi: 'Đêm Thánh Vô Cùng', en: 'Silent Night' },
      blurb: { vi: 'Trời sao tĩnh lặng, giai điệu dịu êm', en: 'A still, starlit sky and a gentle carol' },
      title: 'Peace & Joy',
      subtitle: 'Giáng Sinh Bình An',
      effect: 'stars',
      song: 'silent',
      dark: false,
      sky: ['#0F2533', '#234E64', '#3F6E80'],
      sea: ['#234E64', '#0B1A24'],
      ornament: 'moon'
    },
    newyear: {
      id: 'newyear',
      name: { vi: 'Chào Năm Mới 2027', en: 'New Year 2027' },
      blurb: { vi: 'Pháo hoa rực rỡ trên biển đêm', en: 'Fireworks over the night sea' },
      title: 'Happy New Year',
      subtitle: 'Chúc Mừng Năm Mới 2027',
      effect: 'fireworks',
      song: 'auld',
      dark: true,
      sky: ['#0B1218', '#16303F', '#234E64'],
      sea: ['#16303F', '#05090C'],
      ornament: 'fireworks'
    },
    tet: {
      id: 'tet',
      name: { vi: 'Xuân Đinh Mùi 2027', en: 'Lunar New Year 2027' },
      blurb: { vi: 'Hoa mai vàng, tiếng đàn ngày Tết', en: 'Golden apricot blossom and a festive melody' },
      title: 'Chúc Mừng Năm Mới',
      subtitle: 'Happy Lunar New Year · Xuân Đinh Mùi',
      effect: 'petals',
      song: 'tet',
      dark: false,
      sky: ['#8A2C1E', '#B5452F', '#E0967A'],
      sea: ['#A8513B', '#6B2418'],
      ornament: 'blossom'
    }
  };

  const MESSAGES = {
    christmas: [
      { vi: 'Chúc bạn một mùa Giáng Sinh ấm áp, an lành bên những người thân yêu.', en: 'Wishing you a warm and peaceful Christmas with the people you love.' },
      { vi: 'Mong mùa lễ hội này mang đến cho bạn thật nhiều niềm vui và khoảnh khắc đáng nhớ.', en: 'May this festive season bring you joy and moments worth remembering.' },
      { vi: 'Gửi bạn hương biển, ánh nến và những điều tốt đẹp nhất mùa Giáng Sinh.', en: 'Sending you sea air, candlelight and every good thing this Christmas.' }
    ],
    silentnight: [
      { vi: 'Chúc bạn một đêm Giáng Sinh tĩnh lặng và bình an.', en: 'Wishing you a still and peaceful Christmas night.' },
      { vi: 'Mong ánh sao đêm nay soi sáng mọi ước nguyện của bạn.', en: 'May tonight’s stars light the way to every wish you hold.' },
      { vi: 'Bình an trong tim, ấm áp trong nhà — Giáng Sinh an lành.', en: 'Peace in your heart and warmth in your home — Merry Christmas.' }
    ],
    newyear: [
      { vi: 'Chúc bạn một năm 2027 rạng rỡ, khỏe mạnh và trọn vẹn.', en: 'Wishing you a radiant, healthy and fulfilling 2027.' },
      { vi: 'Năm mới, khởi đầu mới — mong mọi điều tốt đẹp sẽ đến với bạn.', en: 'A new year, a fresh start — may every good thing find its way to you.' },
      { vi: 'Cảm ơn bạn vì một năm đã qua. Hẹn gặp bạn ở những hành trình mới.', en: 'Thank you for the year behind us. Here’s to new journeys together.' }
    ],
    tet: [
      { vi: 'Chúc Mừng Năm Mới — An khang thịnh vượng, vạn sự như ý.', en: 'Happy Lunar New Year — peace, prosperity and every wish fulfilled.' },
      { vi: 'Xuân Đinh Mùi an lành, gia đình sum vầy, tràn đầy hạnh phúc.', en: 'A gentle spring, a family gathered, and a year full of happiness.' },
      { vi: 'Chúc bạn và gia đình một năm mới sức khỏe dồi dào, may mắn tràn đầy.', en: 'Wishing you and your family good health and good fortune in the year ahead.' }
    ]
  };

  const I18N = {
    vi: {
      pageTitle: 'Gửi Thiệp Mùa Lễ Hội',
      heroEyebrow: 'Mùa lễ hội 2026 – 2027',
      heroTitle: 'Gửi một lời chúc, từ bờ biển Quy Nhơn',
      heroLede: 'Chọn tấm thiệp, thêm khoảnh khắc của riêng bạn và gửi đi lời chúc ấm áp — kèm hiệu ứng và giai điệu mùa lễ hội.',
      step1: 'Chọn thiệp', step2: 'Ảnh của bạn', step3: 'Lời chúc', step4: 'Gửi thiệp',
      uploadTitle: 'Kéo thả hoặc chọn ảnh',
      uploadHint: 'JPG, PNG hoặc HEIC · ảnh sẽ được tối ưu tự động',
      uploadNone: 'Không có ảnh? Thiệp sẽ dùng hình minh hoạ của chủ đề.',
      photoPos: 'Căn chỉnh ảnh', removePhoto: 'Xoá ảnh',
      toName: 'Tên người nhận', toNamePh: 'Ví dụ: Lan Anh',
      message: 'Lời chúc', messagePh: 'Viết đôi lời từ trái tim…',
      suggestions: 'Gợi ý lời chúc', fromName: 'Tên của bạn', fromNamePh: 'Ví dụ: Minh',
      fromEmail: 'Email của bạn', recipients: 'Email người nhận',
      addRecipient: '+ Thêm người nhận', recipientName: 'Tên', recipientEmail: 'Email',
      consent: 'Tôi đồng ý để Mia Quy Nhơn gửi thiệp này thay mặt tôi.',
      preview: 'Xem trước hiệu ứng', send: 'Gửi thiệp', sending: 'Đang gửi…',
      livePreview: 'Xem trước',
      notConfigured: 'Chức năng gửi email chưa được kích hoạt. Bạn vẫn có thể thiết kế và xem trước thiệp.',
      errRequired: 'Vui lòng điền đầy đủ các thông tin bắt buộc.',
      errEmail: 'Địa chỉ email chưa hợp lệ: ',
      errConsent: 'Vui lòng xác nhận đồng ý gửi thiệp.',
      errPhoto: 'Không đọc được ảnh này. Vui lòng thử ảnh khác.',
      errSend: 'Rất tiếc, thiệp chưa được gửi. Vui lòng thử lại sau ít phút.',
      sentTitle: 'Thiệp đã được gửi',
      sentBody: 'Lời chúc của bạn đang trên đường đến với người nhận. Cảm ơn bạn đã chia sẻ mùa lễ hội cùng Mia Quy Nhơn.',
      viewCard: 'Xem thiệp đã gửi', another: 'Gửi thêm thiệp',
      chars: 'ký tự',
      // viewer
      fromLabel: 'Từ', toLabel: 'Gửi',
      envelopeFor: 'Một tấm thiệp dành cho bạn',
      envelopeFrom: 'từ',
      tapToOpen: 'Chạm để mở thiệp',
      soundHint: 'Bật âm thanh để trọn vẹn trải nghiệm',
      replay: 'Xem lại', createOwn: 'Tạo thiệp của bạn', discover: 'Khám phá Mia Quy Nhơn',
      loading: 'Đang mở thiệp…',
      notFound: 'Không tìm thấy tấm thiệp này. Đường dẫn có thể đã hết hạn.',
      previewBadge: 'Bản xem trước',
      footer: 'Mia Quy Nhon | Fusion Collection · Nhơn Hội, Quy Nhơn, Bình Định'
    },
    en: {
      pageTitle: 'Send a Festive Greeting',
      heroEyebrow: 'Festive season 2026 – 2027',
      heroTitle: 'Send a greeting from the Quy Nhơn coast',
      heroLede: 'Choose a card, add a moment of your own and send a warm wish — complete with seasonal motion and music.',
      step1: 'Choose a card', step2: 'Your photo', step3: 'Your message', step4: 'Send',
      uploadTitle: 'Drag & drop or choose a photo',
      uploadHint: 'JPG, PNG or HEIC · optimised automatically',
      uploadNone: 'No photo? The card will use the theme illustration.',
      photoPos: 'Photo position', removePhoto: 'Remove photo',
      toName: 'Recipient’s name', toNamePh: 'e.g. Charlotte',
      message: 'Message', messagePh: 'A few words from the heart…',
      suggestions: 'Suggested wishes', fromName: 'Your name', fromNamePh: 'e.g. James',
      fromEmail: 'Your email', recipients: 'Recipient email',
      addRecipient: '+ Add recipient', recipientName: 'Name', recipientEmail: 'Email',
      consent: 'I agree for Mia Quy Nhon to send this card on my behalf.',
      preview: 'Preview with effects', send: 'Send card', sending: 'Sending…',
      livePreview: 'Preview',
      notConfigured: 'Email sending is not yet enabled. You can still design and preview your card.',
      errRequired: 'Please complete all required fields.',
      errEmail: 'This email address does not look right: ',
      errConsent: 'Please confirm you agree to send the card.',
      errPhoto: 'We could not read this photo. Please try another.',
      errSend: 'We are sorry — the card could not be sent. Please try again in a few minutes.',
      sentTitle: 'Your card is on its way',
      sentBody: 'Your greeting is travelling to its recipient. Thank you for sharing the season with Mia Quy Nhon.',
      viewCard: 'View your card', another: 'Send another card',
      chars: 'characters',
      fromLabel: 'From', toLabel: 'Dear',
      envelopeFor: 'A card for you',
      envelopeFrom: 'from',
      tapToOpen: 'Tap to open',
      soundHint: 'Turn your sound on for the full experience',
      replay: 'Replay', createOwn: 'Create your own card', discover: 'Discover Mia Quy Nhon',
      loading: 'Opening your card…',
      notFound: 'We could not find this card. The link may have expired.',
      previewBadge: 'Preview',
      footer: 'Mia Quy Nhon | Fusion Collection · Nhơn Hội, Quy Nhơn, Bình Định'
    }
  };

  function detectLang() {
    try {
      const saved = localStorage.getItem('mqn-ecard-lang');
      if (saved === 'vi' || saved === 'en') return saved;
    } catch (e) { /* storage unavailable */ }
    return (navigator.language || 'vi').toLowerCase().startsWith('vi') ? 'vi' : 'en';
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ---------- Coastal artwork: Tháp Đôi (Twin Cham Towers) at the shoreline ---------- */
  function tower(x, base, s, fill) {
    // A stepped Cham tower silhouette, centred on x, standing on `base`, scaled by s.
    const p = [[-30, 0], [-30, -80], [-24, -80], [-24, -100], [-18, -100], [-18, -118], [-12, -118],
      [-12, -134], [-5, -134], [0, -150], [5, -134], [12, -134], [12, -118], [18, -118], [18, -100],
      [24, -100], [24, -80], [30, -80], [30, 0]];
    const pts = p.map(([a, b]) => `${(x + a * s).toFixed(1)},${(base + b * s).toFixed(1)}`).join(' ');
    const door = `M${x - 7 * s},${base} v${-26 * s} q${7 * s},${-12 * s} ${14 * s},0 v${26 * s}z`;
    return `<polygon points="${pts}" fill="${fill}"/><path d="${door}" fill="rgba(0,0,0,.28)"/>`;
  }

  function ornament(t) {
    switch (t.ornament) {
      case 'star':
        return `<g fill="#F3DDB0"><path d="M300 52 l5 14 15 1 -12 9 4 15 -12-8 -12 8 4-15 -12-9 15-1z" opacity=".95"/>
          <circle cx="300" cy="72" r="26" fill="#F3DDB0" opacity=".12"/></g>
          ${[[60, 40], [110, 90], [190, 30], [350, 110], [370, 40], [30, 120], [240, 70]].map(([x, y]) =>
            `<circle cx="${x}" cy="${y}" r="2.2" fill="#fff" opacity=".85"/>`).join('')}`;
      case 'moon':
        return `<path d="M318 40 A26 26 0 1 0 334 84 A22 22 0 1 1 318 40z" fill="#F3E6C8"/><circle cx="312" cy="64" r="36" fill="#F3E6C8" opacity=".07"/>
          ${[[40, 30], [80, 80], [140, 40], [200, 22], [250, 90], [360, 120], [20, 110], [170, 110], [380, 30]].map(([x, y], i) =>
            `<circle cx="${x}" cy="${y}" r="${i % 3 ? 1.3 : 2}" fill="#fff" opacity="${i % 2 ? .6 : .95}"/>`).join('')}`;
      case 'fireworks': {
        const burst = (cx, cy, r, c) => Array.from({ length: 14 }, (_, i) => {
          const a = i / 14 * Math.PI * 2;
          return `<line x1="${cx + Math.cos(a) * r * .35}" y1="${cy + Math.sin(a) * r * .35}" x2="${cx + Math.cos(a) * r}" y2="${cy + Math.sin(a) * r}" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`;
        }).join('') + `<circle cx="${cx}" cy="${cy}" r="3" fill="${c}"/>`;
        return burst(110, 70, 40, '#C9A56B') + burst(290, 55, 32, '#E0967A') + burst(220, 110, 22, '#A8C8C7');
      }
      case 'blossom': {
        const flower = (x, y, r) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a =>
          `<ellipse cx="0" cy="${-r}" rx="${r * .62}" ry="${r}" fill="#F6C945" transform="rotate(${a})"/>`).join('')}
          <circle r="${r * .45}" fill="#D9822B"/></g>`;
        return `<circle cx="300" cy="80" r="34" fill="#F4D58D" opacity=".55"/>
          <path d="M400 10 C 340 40, 320 60, 270 70 M330 48 C 320 30, 300 22, 285 20 M360 30 C 370 60, 360 80, 345 95"
            stroke="#4A2A1E" stroke-width="4" fill="none" stroke-linecap="round"/>
          ${flower(272, 70, 9)}${flower(300, 58, 8)}${flower(286, 22, 7)}${flower(345, 95, 8)}${flower(330, 46, 6)}${flower(362, 62, 7)}`;
      }
    }
    return '';
  }

  function artSVG(themeId) {
    const t = THEMES[themeId] || THEMES.christmas;
    const id = 'a' + Math.random().toString(36).slice(2, 8);
    return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${t.sky[0]}"/><stop offset=".65" stop-color="${t.sky[1]}"/><stop offset="1" stop-color="${t.sky[2]}"/>
        </linearGradient>
        <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${t.sea[0]}"/><stop offset="1" stop-color="${t.sea[1]}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#${id}s)"/>
      ${ornament(t)}
      <path d="M0 214 Q 80 200 150 210 T 300 206 T 400 210 V 230 H0z" fill="rgba(0,0,0,.18)"/>
      ${tower(150, 232, .95, 'rgba(40,18,12,.78)')}${tower(232, 232, .72, 'rgba(40,18,12,.7)')}
      <rect y="230" width="400" height="70" fill="url(#${id}w)"/>
      <line x1="0" y1="230.5" x2="400" y2="230.5" stroke="#C9A56B" stroke-width="1.2" opacity=".85"/>
      <g stroke="#C9A56B" stroke-width="1" fill="none" opacity=".55" stroke-linecap="round">
        <path d="M30 252 q12 -5 24 0 t24 0"/><path d="M150 266 q12 -5 24 0 t24 0 t24 0"/>
        <path d="M290 248 q12 -5 24 0 t24 0"/><path d="M70 284 q12 -5 24 0 t24 0"/><path d="M260 286 q12 -5 24 0"/>
      </g>
      <g opacity=".35" fill="#C9A56B"><rect x="140" y="236" width="20" height="2"/><rect x="146" y="242" width="10" height="2"/><rect x="226" y="236" width="14" height="2"/></g>
    </svg>`;
  }

  /* ---------- Shared card renderer (builder preview + viewer) ---------- */
  function renderCard(el, data, opts) {
    opts = opts || {};
    const t = THEMES[data.theme] || THEMES.christmas;
    const lang = data.lang || 'vi';
    const L = I18N[lang];
    const pos = Number.isFinite(+data.photoPosY) ? +data.photoPosY : 50;
    const media = data.photo
      ? `<img src="${esc(data.photo)}" alt="" style="object-position:50% ${pos}%">`
      : artSVG(t.id);
    const logo = (opts.assetBase || '') + (t.dark ? 'assets/img/logo-white.png' : 'assets/img/logo-terracotta.png');
    el.className = `ecard ecard--${t.id}${t.dark ? ' ecard--dark' : ''}`;
    el.innerHTML = `
      <div class="ecard__corner ecard__corner--tl"></div><div class="ecard__corner ecard__corner--br"></div>
      <div class="ecard__arch">${media}</div>
      <div class="ecard__body">
        <h1 class="ecard__title">${esc(t.title)}</h1>
        <p class="ecard__subtitle">${esc(t.subtitle)}</p>
        <div class="ecard__rule"><span></span></div>
        ${data.toName ? `<p class="ecard__to">${esc(L.toLabel)} ${esc(data.toName)},</p>` : ''}
        <p class="ecard__message" data-message>${opts.typewriter ? '' : esc(data.message || '')}</p>
        ${data.fromName ? `<p class="ecard__from">— ${esc(data.fromName)}</p>` : ''}
      </div>
      <footer class="ecard__foot">
        <img class="ecard__logo" src="${logo}" alt="Mia Quy Nhon | Fusion Collection">
        <p class="ecard__tagline">Heritage of the Coast</p>
      </footer>`;
    return el;
  }

  window.MQN = { THEMES, MESSAGES, I18N, detectLang, esc, artSVG, renderCard };
})();
