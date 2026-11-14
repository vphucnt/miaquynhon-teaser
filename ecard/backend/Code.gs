/**
 * Mia Quy Nhon | Fusion Collection — Festive eCard backend (Google Apps Script)
 * ---------------------------------------------------------------------------
 * • Receives cards from the builder page, stores them in a Google Sheet and the
 *   photo in a Google Drive folder, and emails each recipient a link to the card.
 * • Serves card data back to the viewer page (card.html?id=...).
 *
 * Set-up (once): see ecard/README.md
 *   1. Paste this file into a new Apps Script project (script.google.com).
 *   2. Edit CONFIG below, then run `setup` once and approve the permissions.
 *   3. Deploy → New deployment → Web app → Execute as: Me · Access: Anyone.
 *   4. Copy the /exec URL into ecard/assets/js/config.js (apiUrl).
 */

const CONFIG = {
  // Public address of the eCard site (where index.html and card.html live), with trailing slash.
  ECARD_BASE_URL: 'https://vphucnt.github.io/miaquynhon-teaser/ecard/',
  SENDER_NAME: 'Mia Quy Nhon',                 // Display name on outgoing emails
  BCC: '',                                      // Optional: a marketing inbox to receive a copy
  MAX_RECIPIENTS: 5,
  MAX_MESSAGE: 400,
  MAX_PHOTO_BYTES: 4 * 1024 * 1024,             // ~4 MB after browser compression
  PER_SENDER_PER_HOUR: 15,                      // anti-abuse
  DAILY_LIMIT: 400                              // stay under the Gmail/Workspace sending quota
};

const THEMES = {
  christmas:   { vi: 'Giáng Sinh',          en: 'Christmas',        title: 'Merry Christmas',  sub: 'Giáng Sinh An Lành', color: '#A8513B' },
  silentnight: { vi: 'Giáng Sinh',          en: 'Christmas',        title: 'Peace & Joy',      sub: 'Giáng Sinh Bình An', color: '#234E64' },
  newyear:     { vi: 'Năm Mới',             en: 'New Year',         title: 'Happy New Year',   sub: 'Chúc Mừng Năm Mới 2027', color: '#16303F' },
  tet:         { vi: 'Tết Đinh Mùi',        en: 'Lunar New Year',   title: 'Chúc Mừng Năm Mới', sub: 'Happy Lunar New Year', color: '#9B3524' }
};

const HEADERS = ['id', 'created', 'theme', 'lang', 'fromName', 'fromEmail', 'toName', 'toEmail',
  'message', 'photoFileId', 'photoPosY', 'views', 'firstViewed'];

/* ------------------------------------------------------------------ set-up */
function setup() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('SHEET_ID')) {
    const ss = SpreadsheetApp.create('Mia Quy Nhon — Festive eCards');
    const sh = ss.getSheets()[0];
    sh.setName('Cards');
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
    props.setProperty('SHEET_ID', ss.getId());
  }
  if (!props.getProperty('FOLDER_ID')) {
    const folder = DriveApp.createFolder('Mia Quy Nhon — eCard Photos');
    props.setProperty('FOLDER_ID', folder.getId());
  }
  // Touch MailApp so the authorisation prompt includes sending permission.
  Logger.log('Remaining daily email quota: ' + MailApp.getRemainingDailyQuota());
  Logger.log('Sheet: https://docs.google.com/spreadsheets/d/' + props.getProperty('SHEET_ID'));
}

function sheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('Not set up: run setup() first');
  return SpreadsheetApp.openById(id).getSheetByName('Cards');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------------ GET: read a card */
function doGet(e) {
  try {
    const p = (e && e.parameter) || {};
    if (p.action !== 'card' || !/^[a-f0-9-]{36}$/i.test(p.id || '')) return json_({ ok: false, error: 'bad request' });
    const sh = sheet_();
    const cell = sh.getRange('A:A').createTextFinder(p.id).matchEntireCell(true).findNext();
    if (!cell) return json_({ ok: false, error: 'not found' });
    const row = cell.getRow();
    const v = sh.getRange(row, 1, 1, HEADERS.length).getValues()[0];
    const r = {}; HEADERS.forEach((h, i) => { r[h] = v[i]; });

    let photo = '';
    if (r.photoFileId) {
      try {
        const blob = DriveApp.getFileById(r.photoFileId).getBlob();
        photo = 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes());
      } catch (err) { /* photo removed */ }
    }
    // View tracking
    sh.getRange(row, HEADERS.indexOf('views') + 1).setValue((Number(r.views) || 0) + 1);
    if (!r.firstViewed) sh.getRange(row, HEADERS.indexOf('firstViewed') + 1).setValue(new Date());

    return json_({ ok: true, card: {
      theme: r.theme, lang: r.lang, fromName: r.fromName, toName: r.toName,
      message: r.message, photo: photo, photoPosY: Number(r.photoPosY) || 50
    } });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}

/* ------------------------------------------------------------------ POST: send a card */
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents || '{}');
    if (d.action !== 'send') return json_({ ok: false, error: 'bad request' });
    if (d.website) return json_({ ok: true, ids: [] });           // honeypot: silently drop bots

    // ---- validate
    const EMAIL = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[a-z]{2,}$/i;
    const theme = THEMES[d.theme] ? d.theme : 'christmas';
    const lang = d.lang === 'en' ? 'en' : 'vi';
    const clean = (s, n) => String(s || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n);
    const message = clean(d.message, CONFIG.MAX_MESSAGE);
    const fromName = clean(d.fromName, 60);
    const fromEmail = clean(d.fromEmail, 120).toLowerCase();
    const recipients = (Array.isArray(d.recipients) ? d.recipients : []).slice(0, CONFIG.MAX_RECIPIENTS)
      .map(r => ({ name: clean(r.name, 60), email: clean(r.email, 120).toLowerCase() }));
    if (!message || !fromName || !EMAIL.test(fromEmail) || !recipients.length || recipients.some(r => !EMAIL.test(r.email))) {
      return json_({ ok: false, error: 'invalid input' });
    }

    // ---- rate limits
    const cache = CacheService.getScriptCache();
    const sk = 'snd:' + fromEmail;
    const sent = Number(cache.get(sk) || 0);
    if (sent + recipients.length > CONFIG.PER_SENDER_PER_HOUR) return json_({ ok: false, error: 'Sending limit reached — please try again later.' });
    const props = PropertiesService.getScriptProperties();
    const dk = 'day:' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd');
    const today = Number(props.getProperty(dk) || 0);
    if (today + recipients.length > CONFIG.DAILY_LIMIT || MailApp.getRemainingDailyQuota() < recipients.length) {
      return json_({ ok: false, error: 'Daily sending limit reached — please try again tomorrow.' });
    }

    // ---- photo
    let photoFileId = '', photoBlob = null;
    const m = String(d.photo || '').match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
    if (m) {
      const bytes = Utilities.base64Decode(m[2]);
      if (bytes.length > CONFIG.MAX_PHOTO_BYTES) return json_({ ok: false, error: 'photo too large' });
      photoBlob = Utilities.newBlob(bytes, m[1], 'ecard-' + Date.now() + (m[1] === 'image/png' ? '.png' : '.jpg'));
      const folder = DriveApp.getFolderById(props.getProperty('FOLDER_ID'));
      photoFileId = folder.createFile(photoBlob).getId();
    }
    const posY = Math.max(0, Math.min(100, Number(d.photoPosY) || 50));

    // ---- store + send
    const lock = LockService.getScriptLock(); lock.waitLock(20000);
    const ids = [];
    try {
      const sh = sheet_();
      recipients.forEach(r => {
        const id = Utilities.getUuid();
        sh.appendRow([id, new Date(), theme, lang, fromName, fromEmail, r.name, r.email, message, photoFileId, posY, 0, '']);
        sendEmail_({ id, theme, lang, fromName, fromEmail, toName: r.name, toEmail: r.email, message, photoBlob });
        ids.push(id);
      });
    } finally { lock.releaseLock(); }

    cache.put(sk, String(sent + recipients.length), 3600);
    props.setProperty(dk, String(today + recipients.length));
    return json_({ ok: true, ids, url: CONFIG.ECARD_BASE_URL + 'card.html?id=' + ids[0] });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}

/* ------------------------------------------------------------------ email */
function esc_(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function sendEmail_(c) {
  const t = THEMES[c.theme];
  const url = CONFIG.ECARD_BASE_URL + 'card.html?id=' + c.id;
  const vi = c.lang === 'vi';
  const subject = vi
    ? c.fromName + ' gửi bạn một tấm thiệp ' + t.vi + ' · A ' + t.en + ' card for you'
    : c.fromName + ' has sent you a ' + t.en + ' card · Thiệp ' + t.vi + ' dành cho bạn';
  const greet = c.toName ? (vi ? 'Gửi ' : 'Dear ') + esc_(c.toName) + ',' : (vi ? 'Xin chào,' : 'Hello,');
  const lead = vi
    ? '<strong>' + esc_(c.fromName) + '</strong> vừa gửi bạn một tấm thiệp mùa lễ hội từ bờ biển Quy Nhơn — kèm hiệu ứng và giai điệu riêng.'
    : '<strong>' + esc_(c.fromName) + '</strong> has sent you a festive card from the Quy Nhơn coast — complete with its own motion and music.';
  const leadAlt = vi
    ? esc_(c.fromName) + ' has sent you a festive card from the Quy Nhơn coast.'
    : esc_(c.fromName) + ' vừa gửi bạn một tấm thiệp mùa lễ hội từ bờ biển Quy Nhơn.';
  const cta = vi ? 'Mở thiệp · Open your card' : 'Open your card · Mở thiệp';
  const hero = c.photoBlob ? 'cid:photo' : CONFIG.ECARD_BASE_URL + 'assets/img/email-' + c.theme + '.jpg';
  const logo = CONFIG.ECARD_BASE_URL + 'assets/img/logo-white.png';
  const preview = esc_(c.message).slice(0, 140) + (c.message.length > 140 ? '…' : '');

  const html =
'<!DOCTYPE html><html><body style="margin:0;padding:0;background:#EFE4D2;">' +
'<div style="display:none;max-height:0;overflow:hidden;">' + preview + '</div>' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFE4D2;"><tr><td align="center" style="padding:28px 12px;">' +
'<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FBF7F0;border-radius:6px;overflow:hidden;font-family:Mulish,Helvetica,Arial,sans-serif;color:#1A1C1B;">' +
  '<tr><td align="center" style="background:' + t.color + ';padding:22px;"><img src="' + logo + '" width="150" alt="Mia Quy Nhon | Fusion Collection" style="display:block;width:150px;height:auto;border:0;"></td></tr>' +
  '<tr><td><a href="' + url + '"><img src="' + hero + '" width="560" alt="' + esc_(t.title) + '" style="display:block;width:100%;height:auto;max-height:420px;object-fit:cover;border:0;"></a></td></tr>' +
  '<tr><td align="center" style="padding:30px 36px 6px;">' +
    '<div style="font-family:\'Playfair Display\',Georgia,serif;font-style:italic;font-size:34px;line-height:1.1;color:' + t.color + ';">' + esc_(t.title) + '</div>' +
    '<div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#234E64;font-weight:700;margin-top:8px;">' + esc_(t.sub) + '</div>' +
    '<div style="width:120px;height:1px;background:#C9A56B;margin:20px auto;"></div>' +
  '</td></tr>' +
  '<tr><td style="padding:0 40px;font-size:15px;line-height:1.65;">' +
    '<p style="margin:0 0 10px;font-family:\'Playfair Display\',Georgia,serif;font-style:italic;font-size:18px;color:' + t.color + ';">' + greet + '</p>' +
    '<p style="margin:0 0 6px;">' + lead + '</p>' +
    '<p style="margin:0 0 22px;color:#8A8B8C;font-size:13px;font-style:italic;">' + leadAlt + '</p>' +
  '</td></tr>' +
  '<tr><td align="center" style="padding:4px 36px 34px;">' +
    '<a href="' + url + '" style="display:inline-block;background:#A8513B;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:15px 30px;border-radius:999px;">' + cta + '</a>' +
    '<p style="margin:14px 0 0;font-size:12px;color:#8A8B8C;">' + (vi ? 'Bật âm thanh để trọn vẹn trải nghiệm · Turn your sound on' : 'Turn your sound on · Bật âm thanh để trọn vẹn trải nghiệm') + '</p>' +
  '</td></tr>' +
  '<tr><td align="center" style="background:#EFE4D2;padding:20px 30px;font-size:11px;line-height:1.6;color:#8A8B8C;">' +
    '<div style="font-family:\'Playfair Display\',Georgia,serif;font-style:italic;font-size:14px;color:#A8513B;margin-bottom:4px;">Heritage of the Coast</div>' +
    'Mia Quy Nhon | Fusion Collection · Nhơn Hội, Quy Nhơn, Bình Định<br>' +
    '<a href="https://miaquynhon.com" style="color:#A8513B;">miaquynhon.com</a><br>' +
    (vi ? 'Thiệp được gửi thay mặt ' : 'Sent on behalf of ') + esc_(c.fromName) + ' (' + esc_(c.fromEmail) + ').' +
  '</td></tr>' +
'</table></td></tr></table></body></html>';

  const plain = (c.toName ? (vi ? 'Gửi ' : 'Dear ') + c.toName + ',\n\n' : '') +
    c.fromName + (vi ? ' vừa gửi bạn một tấm thiệp mùa lễ hội.' : ' has sent you a festive card.') + '\n\n' + url +
    '\n\nMia Quy Nhon | Fusion Collection — Heritage of the Coast';

  const opts = { name: CONFIG.SENDER_NAME, htmlBody: html, replyTo: c.fromEmail };
  if (c.photoBlob) opts.inlineImages = { photo: c.photoBlob };
  if (CONFIG.BCC) opts.bcc = CONFIG.BCC;
  MailApp.sendEmail(c.toEmail, subject, plain, opts);
}

/* Quick manual test from the Apps Script editor */
function testSend() {
  const me = Session.getActiveUser().getEmail();
  sendEmail_({ id: '00000000-0000-0000-0000-000000000000', theme: 'christmas', lang: 'vi', fromName: 'Mia Quy Nhon',
    fromEmail: me, toName: 'Test', toEmail: me, message: 'Chúc bạn một mùa Giáng Sinh an lành.', photoBlob: null });
}
