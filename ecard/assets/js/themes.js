/* Mia Quy Nhon — Festive eCard: occasions, templates, copy and the shared card renderer */
(function () {
  'use strict';

  const OCCASIONS = {
    christmas: { id: 'christmas', name: { vi: 'Giáng Sinh', en: 'Christmas' } },
    newyear: { id: 'newyear', name: { vi: 'Năm Mới 2027', en: 'New Year 2027' } }
  };

  const SONGS_LABEL = {
    jingle: 'Jingle Bells', silent: 'Silent Night', wewish: 'We Wish You a Merry Christmas', deck: 'Deck the Halls',
    auld: 'Auld Lang Syne', midnight: { vi: 'Điệu valse giao thừa', en: 'Midnight Waltz' }, coastal: { vi: 'Bình minh trên biển', en: 'Coastal Dawn' }
  };

  // Light card on ivory unless stated. art = colours for the motif artwork.
  const IVORY = { bg: '#FBF7F0', title: '#A8513B', sub: '#234E64', text: '#1A1C1B', accent: '#C9A56B' };
  const NIGHT = { bg: '#13293A', title: '#E6CB98', sub: '#A8C8C7', text: '#F2EADF', accent: '#C9A56B', dark: true };
  const ONYX = { bg: '#1A1C1B', title: '#E6CB98', sub: '#C9A56B', text: '#EFE4D2', accent: '#C9A56B', dark: true };
  const INK = 'rgba(40,18,12,.8)';

  const TEMPLATES = [
    /* ------------------------------------------------------------ Christmas */
    { id: 'c-coastal', occasion: 'christmas', layout: 'arch', name: { vi: 'Giáng Sinh bên biển', en: 'Coastal Christmas' },
      title: 'Merry Christmas', subtitle: 'Giáng Sinh An Lành', card: IVORY, pattern: 'none',
      stage: ['#C26A4F', '#A8513B', '#6B3223'], motif: 'towers-star',
      art: { sky: ['#7E3D2C', '#C26A4F', '#E0967A'], sea: ['#A8513B', '#5E2B1F'], ink: INK },
      effect: 'snow', song: 'jingle' },
    { id: 'c-silent', occasion: 'christmas', layout: 'medallion', ring: 'stars', name: { vi: 'Đêm thánh', en: 'Silent Night' },
      title: 'Silent Night', subtitle: 'Đêm Thánh Vô Cùng', card: Object.assign({}, IVORY, { title: '#234E64', sub: '#A8513B' }), pattern: 'stars',
      stage: ['#3F6E80', '#234E64', '#0B1A24'], motif: 'towers-moon',
      art: { sky: ['#0F2533', '#234E64', '#3F6E80'], sea: ['#234E64', '#0B1A24'], ink: 'rgba(8,20,28,.85)' },
      effect: 'stars', song: 'silent' },
    { id: 'c-pines', occasion: 'christmas', layout: 'full', name: { vi: 'Rừng thông tuyết', en: 'Snowy Pines' },
      title: 'Season’s Greetings', subtitle: 'Mùa Lễ Hội An Vui', card: { bg: '#F7F4EE', title: '#2F4A3E', sub: '#A8513B', text: '#1A1C1B', accent: '#C9A56B' }, pattern: 'none',
      stage: ['#4B6B5D', '#2F4A3E', '#16241E'], motif: 'pines',
      art: { sky: ['#9FBDB8', '#CFE0DD', '#EEF3F1'], ink: '#2F4A3E', ink2: '#7E9A90' },
      effect: 'snow', song: 'wewish' },
    { id: 'c-baubles', occasion: 'christmas', layout: 'editorial', name: { vi: 'Quả châu vàng', en: 'Golden Baubles' },
      title: 'Joy & Wonder', subtitle: 'Niềm Vui Mùa Giáng Sinh', card: { bg: '#7E3D2C', title: '#F3DDB0', sub: '#E0967A', text: '#F6EEE3', accent: '#C9A56B', dark: true }, pattern: 'dots',
      stage: ['#A8513B', '#7E3D2C', '#3F1A11'], motif: 'baubles',
      art: { sky: ['#8C4433', '#7E3D2C', '#6B3223'] },
      effect: 'sparkle', song: 'deck' },
    { id: 'c-wreath', occasion: 'christmas', layout: 'arch', name: { vi: 'Vòng hoa', en: 'Festive Wreath' },
      title: 'Merry Christmas', subtitle: 'Giáng Sinh Hạnh Phúc', card: Object.assign({}, IVORY, { sub: '#2F4A3E' }), pattern: 'stripes',
      stage: ['#4B6B5D', '#2F4A3E', '#18261F'], motif: 'wreath',
      art: { sky: ['#F7F1E7', '#EFE4D2', '#E6D7BF'] },
      effect: 'snowflakes', song: 'jingle', voice: 'celesta' },
    { id: 'c-candle', occasion: 'christmas', layout: 'postcard', stamp: 'Noël', name: { vi: 'Ánh nến', en: 'Candlelight' },
      title: 'Peace & Light', subtitle: 'Bình An & Ấm Áp', card: NIGHT, pattern: 'none',
      stage: ['#234E64', '#13293A', '#05090C'], motif: 'candles',
      art: { sky: ['#0B1A24', '#16303F', '#234E64'] },
      effect: 'sparkle', song: 'silent', voice: 'harp' },
    { id: 'c-snowflake', occasion: 'christmas', layout: 'polaroid', caption: 'Noël · 2026', name: { vi: 'Bông tuyết', en: 'Snowflake' },
      title: 'Let It Snow', subtitle: 'Giáng Sinh An Lành', card: { bg: '#E3EEED', title: '#234E64', sub: '#A8513B', text: '#1A1C1B', accent: '#5E8D99' }, pattern: 'snow',
      stage: ['#A8C8C7', '#5E8D99', '#234E64'], motif: 'snowflakes',
      art: { sky: ['#234E64', '#3F6E80', '#7FA7AD'] },
      effect: 'snowflakes', song: 'wewish', voice: 'celesta' },
    { id: 'c-gift', occasion: 'christmas', layout: 'medallion', ring: 'wreath', name: { vi: 'Món quà', en: 'The Gift' },
      title: 'Warmest Wishes', subtitle: 'Gửi Trao Yêu Thương', card: { bg: '#FFF6EF', title: '#A8513B', sub: '#7E3D2C', text: '#1A1C1B', accent: '#E0967A' }, pattern: 'dots',
      stage: ['#F0B79F', '#E0967A', '#A8513B'], motif: 'gift',
      art: { sky: ['#F6D9C9', '#EFC1AB', '#E0967A'] },
      effect: 'snow', song: 'deck' },
    { id: 'c-bells', occasion: 'christmas', layout: 'editorial', name: { vi: 'Chuông ngân', en: 'Ringing Bells' },
      title: 'Merry & Bright', subtitle: 'Chuông Ngân Mùa Lễ Hội', card: { bg: '#F7F1E7', title: '#7E3D2C', sub: '#234E64', text: '#1A1C1B', accent: '#C9A56B' }, pattern: 'stars',
      stage: ['#D8B98A', '#B08A52', '#5E4220'], motif: 'bells',
      art: { sky: ['#EFE4D2', '#F3E9DA', '#FBF7F0'] },
      effect: 'snow', song: 'jingle' },
    { id: 'c-noel', occasion: 'christmas', layout: 'full', name: { vi: 'Đêm Noël', en: 'Noël Night' },
      title: 'Joyeux Noël', subtitle: 'Giáng Sinh An Lành', card: { bg: '#0F2533', title: '#F3DDB0', sub: '#E0967A', text: '#EFE4D2', accent: '#C9A56B', dark: true }, pattern: 'none',
      stage: ['#2F4A3E', '#1E3329', '#0D1712'], motif: 'pines-night',
      art: { sky: ['#0F2533', '#234E64', '#3F6E80'], ink: '#1E3329', ink2: '#3F5E54' },
      effect: 'snow', song: 'silent' },

    /* ------------------------------------------------------------ New Year 2027 */
    { id: 'n-seafire', occasion: 'newyear', layout: 'arch', name: { vi: 'Pháo hoa trên biển', en: 'Fireworks by the Sea' },
      title: 'Happy New Year', subtitle: 'Chúc Mừng Năm Mới 2027', card: NIGHT, pattern: 'none',
      stage: ['#234E64', '#102330', '#05090C'], motif: 'towers-fireworks',
      art: { sky: ['#0B1218', '#16303F', '#234E64'], sea: ['#16303F', '#05090C'], ink: 'rgba(5,9,12,.85)' },
      effect: 'fireworks', song: 'auld' },
    { id: 'n-2027', occasion: 'newyear', layout: 'editorial', name: { vi: 'Xin chào 2027', en: 'Hello 2027' },
      title: 'Hello 2027', subtitle: 'Xin Chào Năm Mới', card: IVORY, pattern: 'confetti',
      stage: ['#3F6E80', '#234E64', '#0F2533'], motif: 'numerals',
      art: { sky: ['#16303F', '#234E64', '#16303F'] },
      effect: 'confetti', song: 'midnight' },
    { id: 'n-cheers', occasion: 'newyear', layout: 'full', name: { vi: 'Nâng ly', en: 'Cheers' },
      title: 'Cheers to 2027', subtitle: 'Nâng Ly Chào Năm Mới', card: ONYX, pattern: 'none',
      stage: ['#3A332B', '#1A1C1B', '#000000'], motif: 'champagne',
      art: { sky: ['#1A1C1B', '#2A2622', '#1A1C1B'] },
      effect: 'sparkle', song: 'auld', voice: 'celesta' },
    { id: 'n-midnight', occasion: 'newyear', layout: 'medallion', ring: 'rays', name: { vi: 'Khoảnh khắc giao thừa', en: 'Midnight' },
      title: 'At the Stroke of Midnight', subtitle: 'Khoảnh Khắc Giao Thừa', card: Object.assign({}, IVORY, { title: '#234E64', sub: '#A8513B' }), pattern: 'stars',
      stage: ['#3F6E80', '#234E64', '#0B1A24'], motif: 'clock',
      art: { sky: ['#0F2533', '#16303F', '#234E64'] },
      effect: 'stars', song: 'midnight' },
    { id: 'n-deco', occasion: 'newyear', layout: 'editorial', name: { vi: 'Hoàng kim', en: 'Golden Deco' },
      title: 'A Golden Year', subtitle: 'Năm Mới Hoàng Kim 2027', card: ONYX, pattern: 'deco',
      stage: ['#4A3D2A', '#1A1C1B', '#000000'], motif: 'deco',
      art: { sky: ['#1A1C1B', '#23201C', '#1A1C1B'] },
      effect: 'sparkle', song: 'auld', voice: 'harp' },
    { id: 'n-confetti', occasion: 'newyear', layout: 'polaroid', caption: '01 · 01 · 2027', name: { vi: 'Hoa giấy', en: 'Confetti' },
      title: 'Let’s Celebrate', subtitle: 'Chúc Mừng Năm Mới', card: { bg: '#FCEDE5', title: '#A8513B', sub: '#234E64', text: '#1A1C1B', accent: '#E0967A' }, pattern: 'confetti',
      stage: ['#F0B79F', '#E0967A', '#A8513B'], motif: 'confetti',
      art: { sky: ['#FBF7F0', '#FBF7F0', '#F3E9DA'] },
      effect: 'confetti', song: 'midnight', voice: 'celesta' },
    { id: 'n-lanterns', occasion: 'newyear', layout: 'arch', name: { vi: 'Đèn trời', en: 'Sky Lanterns' },
      title: 'Make a Wish', subtitle: 'Ước Nguyện Năm Mới', card: { bg: '#FFF8EC', title: '#A8513B', sub: '#234E64', text: '#1A1C1B', accent: '#C9A56B' }, pattern: 'none',
      stage: ['#7E3D2C', '#3E2A33', '#13293A'], motif: 'lanterns',
      art: { sky: ['#1E3A4C', '#6E3A33', '#D98C6A'], sea: ['#3E2A33', '#13293A'] },
      effect: 'lanterns', song: 'coastal' },
    { id: 'n-boats', occasion: 'newyear', layout: 'full', name: { vi: 'Thuyền thúng', en: 'Basket Boats' },
      title: 'New Year by the Sea', subtitle: 'Đón Năm Mới Bên Biển', card: { bg: '#0F2533', title: '#E6CB98', sub: '#A8C8C7', text: '#F2EADF', accent: '#C9A56B', dark: true }, pattern: 'none',
      stage: ['#234E64', '#0F2533', '#05090C'], motif: 'boats',
      art: { sky: ['#05090C', '#0F2533', '#234E64'], sea: ['#16303F', '#05090C'] },
      effect: 'fireworks', song: 'coastal', voice: 'harp' },
    { id: 'n-sunrise', occasion: 'newyear', layout: 'postcard', stamp: '2027', name: { vi: 'Bình minh đầu năm', en: 'First Sunrise' },
      title: 'A Bright New Year', subtitle: 'Năm Mới Rạng Rỡ', card: { bg: '#FFF8F2', title: '#A8513B', sub: '#234E64', text: '#1A1C1B', accent: '#C9A56B' }, pattern: 'none',
      stage: ['#F3C9A8', '#E0967A', '#A8513B'], motif: 'towers-sunrise',
      art: { sky: ['#C9765A', '#E8A88A', '#FBE3C6'], sea: ['#C26A4F', '#7E3D2C'], ink: 'rgba(60,25,15,.78)' },
      effect: 'sparkle', song: 'coastal' },
    { id: 'n-sparklers', occasion: 'newyear', layout: 'medallion', ring: 'rays', name: { vi: 'Pháo bông', en: 'Sparklers' },
      title: 'Shine Bright', subtitle: 'Năm Mới Lấp Lánh', card: { bg: '#A8513B', title: '#F3DDB0', sub: '#EFE4D2', text: '#FBF4EA', accent: '#E6CB98', dark: true }, pattern: 'dots',
      stage: ['#C26A4F', '#7E3D2C', '#3F1A11'], motif: 'sparklers',
      art: { sky: ['#1A1C1B', '#2B1A15', '#1A1C1B'] },
      effect: 'sparkle', song: 'auld' }
  ];

  const BY_ID = Object.fromEntries(TEMPLATES.map(t => [t.id, t]));
  // Links sent with earlier theme names keep working
  const ALIAS = { christmas: 'c-coastal', silentnight: 'c-silent', newyear: 'n-seafire', tet: 'n-seafire' };
  const getTemplate = tid => BY_ID[tid] || BY_ID[ALIAS[tid]] || TEMPLATES[0];

  const MESSAGES = {
    christmas: [
      { vi: 'Chúc bạn một mùa Giáng Sinh ấm áp, an lành bên những người thân yêu.', en: 'Wishing you a warm and peaceful Christmas with the people you love.' },
      { vi: 'Mong mùa lễ hội này mang đến cho bạn thật nhiều niềm vui và khoảnh khắc đáng nhớ.', en: 'May this festive season bring you joy and moments worth remembering.' },
      { vi: 'Gửi bạn hương biển, ánh nến và những điều tốt đẹp nhất mùa Giáng Sinh.', en: 'Sending you sea air, candlelight and every good thing this Christmas.' },
      { vi: 'Bình an trong tim, ấm áp trong nhà — Giáng Sinh an lành.', en: 'Peace in your heart and warmth in your home — Merry Christmas.' }
    ],
    newyear: [
      { vi: 'Chúc bạn một năm 2027 rạng rỡ, khỏe mạnh và trọn vẹn.', en: 'Wishing you a radiant, healthy and fulfilling 2027.' },
      { vi: 'Năm mới, khởi đầu mới — mong mọi điều tốt đẹp sẽ đến với bạn.', en: 'A new year, a fresh start — may every good thing find its way to you.' },
      { vi: 'Cảm ơn bạn vì một năm đã qua. Hẹn gặp bạn ở những hành trình mới.', en: 'Thank you for the year behind us. Here’s to new journeys together.' },
      { vi: 'Nâng ly chào năm mới — chúc bạn và gia đình an khang, hạnh phúc.', en: 'Raising a glass to the year ahead — health and happiness to you and yours.' }
    ]
  };

  const I18N = {
    vi: {
      pageTitle: 'Gửi Thiệp Mùa Lễ Hội',
      heroEyebrow: 'Mùa lễ hội 2026 – 2027',
      heroTitle: 'Gửi một lời chúc, từ bờ biển Quy Nhơn',
      heroLede: 'Chọn tấm thiệp, thêm khoảnh khắc của riêng bạn và gửi đi lời chúc ấm áp — kèm hiệu ứng và giai điệu mùa lễ hội.',
      step1: 'Chọn thiệp', step2: 'Ảnh của bạn', step3: 'Lời chúc', step4: 'Gửi thiệp',
      templatesCount: 'mẫu thiệp',
      uploadTitle: 'Kéo thả hoặc chọn ảnh',
      uploadHint: 'JPG, PNG hoặc HEIC · ảnh sẽ được tối ưu tự động',
      uploadNone: 'Không có ảnh? Thiệp sẽ dùng hình minh hoạ của mẫu.',
      photoPos: 'Căn chỉnh ảnh', removePhoto: 'Xoá ảnh',
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
      templatesCount: 'designs',
      uploadTitle: 'Drag & drop or choose a photo',
      uploadHint: 'JPG, PNG or HEIC · optimised automatically',
      uploadNone: 'No photo? The card will use its own illustration.',
      photoPos: 'Photo position', removePhoto: 'Remove photo',
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

  function songLabel(t, lang) {
    const s = SONGS_LABEL[t.song];
    return typeof s === 'string' ? s : s[lang || 'vi'];
  }

  const artSVG = tid => { const t = getTemplate(tid); return window.MQN.motifSVG(t.motif, t.art); };

  /* ---------- Shared card renderer (builder preview, thumbnails, viewer) ---------- */
  function renderCard(el, data, opts) {
    opts = opts || {};
    const t = getTemplate(data.theme);
    const L = I18N[data.lang === 'en' ? 'en' : 'vi'];
    const c = t.card;
    const pos = Number.isFinite(+data.photoPosY) ? +data.photoPosY : 50;
    const media = data.photo
      ? `<img src="${esc(data.photo)}" alt="" style="object-position:50% ${pos}%">`
      : window.MQN.motifSVG(t.motif, t.art);
    const logo = (opts.assetBase || '') + (c.dark ? 'assets/img/logo-white.png' : 'assets/img/logo-terracotta.png');

    let extra = '';
    if (t.layout === 'medallion') extra = window.MQN.ringSVG(t.ring, c.accent);
    if (t.layout === 'full') extra = '<div class="ecard__veil"></div>';
    if (t.layout === 'polaroid') extra = `<p class="ecard__caption">${esc(t.caption || '')}</p>`;
    if (t.layout === 'postcard') extra = `<div class="ecard__stamp"><span>${esc(t.stamp || '')}</span><small>Quy Nhơn</small></div>
      <svg class="ecard__postmark" viewBox="0 0 120 60" aria-hidden="true"><circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="30" cy="30" r="17" fill="none" stroke="currentColor" stroke-width=".8"/>
      <path d="M58 18 q8 -6 16 0 t16 0 t16 0 M58 30 q8 -6 16 0 t16 0 t16 0 M58 42 q8 -6 16 0 t16 0 t16 0" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>`;

    el.className = `ecard ecard--${t.layout}${c.dark ? ' ecard--dark' : ''}${opts.thumb ? ' ecard--thumb' : ''}`;
    el.setAttribute('data-template', t.id);
    el.style.cssText = `--c-bg:${c.bg};--c-title:${c.title};--c-sub:${c.sub};--c-text:${c.text};--c-accent:${c.accent};--pattern:${window.MQN.patternURI(t.pattern, c.accent)}`;
    el.innerHTML = `
      <div class="ecard__corner ecard__corner--tl"></div><div class="ecard__corner ecard__corner--br"></div>
      <div class="ecard__media"><div class="ecard__arch">${media}</div>${extra}</div>
      <div class="ecard__head">
        <h1 class="ecard__title">${esc(t.title)}</h1>
        <p class="ecard__subtitle">${esc(t.subtitle)}</p>
        <div class="ecard__rule"><span></span></div>
      </div>
      <div class="ecard__text">
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

  window.MQN = window.MQN || {};
  Object.assign(window.MQN, { OCCASIONS, TEMPLATES, getTemplate, MESSAGES, I18N, detectLang, esc, artSVG, songLabel, renderCard });
})();
