/* Mia Quy Nhon — Festive eCard: SVG artwork library.
 * Every motif draws into a 400×400 viewBox and keeps its key elements inside
 * x 80–320 / y 90–310, so it crops gracefully into arches, circles, full-bleed
 * cards and 12:7 email banners. */
(function () {
  'use strict';

  let uid = 0;
  const id = p => `${p}${++uid}`;
  const f = n => +n.toFixed(1);

  // Deterministic pseudo-random so artwork is identical on every render
  function rng(seed) {
    let s = 0; for (const c of String(seed)) s = (s * 31 + c.charCodeAt(0)) >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  function skyDefs(a) {
    const s = id('s'), w = id('w');
    return {
      s, w,
      defs: `<linearGradient id="${s}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a.sky[0]}"/><stop offset=".6" stop-color="${a.sky[1]}"/><stop offset="1" stop-color="${a.sky[2]}"/></linearGradient>` +
        (a.sea ? `<linearGradient id="${w}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a.sea[0]}"/><stop offset="1" stop-color="${a.sea[1]}"/></linearGradient>` : '')
    };
  }

  const dots = (r, n, col, op, yMax) => Array.from({ length: n }, () =>
    `<circle cx="${f(r() * 400)}" cy="${f(r() * (yMax || 400))}" r="${f(.8 + r() * 1.8)}" fill="${col}" opacity="${f((op || .8) * (.5 + r() * .5))}"/>`).join('');

  const spark = (x, y, s, col) =>
    `<path d="M${x} ${y - s} Q${x + s * .15} ${y - s * .15} ${x + s} ${y} Q${x + s * .15} ${y + s * .15} ${x} ${y + s} Q${x - s * .15} ${y + s * .15} ${x - s} ${y} Q${x - s * .15} ${y - s * .15} ${x} ${y - s}z" fill="${col}"/>`;

  function tower(x, base, s, fill) {
    const p = [[-30, 0], [-30, -80], [-24, -80], [-24, -100], [-18, -100], [-18, -118], [-12, -118],
      [-12, -134], [-5, -134], [0, -150], [5, -134], [12, -134], [12, -118], [18, -118], [18, -100],
      [24, -100], [24, -80], [30, -80], [30, 0]];
    const pts = p.map(([a, b]) => `${f(x + a * s)},${f(base + b * s)}`).join(' ');
    const door = `M${f(x - 7 * s)},${base} v${f(-26 * s)} q${f(7 * s)},${f(-12 * s)} ${f(14 * s)},0 v${f(26 * s)}z`;
    return `<polygon points="${pts}" fill="${fill}"/><path d="${door}" fill="rgba(0,0,0,.28)"/>`;
  }

  function sea(w, y, gold) {
    return `<rect y="${y}" width="400" height="${400 - y}" fill="url(#${w})"/>
      <line x1="0" y1="${y + .5}" x2="400" y2="${y + .5}" stroke="${gold}" stroke-width="1.2" opacity=".85"/>
      <g stroke="${gold}" stroke-width="1" fill="none" opacity=".5" stroke-linecap="round">
        <path d="M60 ${y + 22} q12 -5 24 0 t24 0"/><path d="M170 ${y + 38} q12 -5 24 0 t24 0 t24 0"/>
        <path d="M290 ${y + 18} q12 -5 24 0 t24 0"/><path d="M100 ${y + 62} q12 -5 24 0 t24 0"/><path d="M260 ${y + 70} q12 -5 24 0"/>
      </g>`;
  }

  function burst(cx, cy, r, c, n) {
    n = n || 16;
    return Array.from({ length: n }, (_, i) => {
      const a = i / n * Math.PI * 2;
      return `<line x1="${f(cx + Math.cos(a) * r * .32)}" y1="${f(cy + Math.sin(a) * r * .32)}" x2="${f(cx + Math.cos(a) * r)}" y2="${f(cy + Math.sin(a) * r)}" stroke="${c}" stroke-width="2" stroke-linecap="round"/>` +
        `<circle cx="${f(cx + Math.cos(a) * r * 1.12)}" cy="${f(cy + Math.sin(a) * r * 1.12)}" r="1.6" fill="${c}"/>`;
    }).join('') + `<circle cx="${cx}" cy="${cy}" r="3" fill="${c}"/>`;
  }

  function pine(x, base, h, col, snow) {
    const w = h * .62, t = [];
    for (let i = 0; i < 3; i++) {
      const top = base - h + i * h * .24, bot = base - h * .28 + i * h * .12 - (2 - i) * h * .1;
      const ww = w * (.55 + i * .22) / 2;
      t.push(`<polygon points="${f(x)},${f(top)} ${f(x - ww)},${f(bot)} ${f(x + ww)},${f(bot)}" fill="${col}"/>`);
      if (snow) t.push(`<polygon points="${f(x)},${f(top)} ${f(x - ww * .32)},${f(top + (bot - top) * .3)} ${f(x)},${f(top + (bot - top) * .22)} ${f(x + ww * .32)},${f(top + (bot - top) * .3)}" fill="${snow}"/>`);
    }
    return `<rect x="${f(x - h * .03)}" y="${f(base - h * .3)}" width="${f(h * .06)}" height="${f(h * .3)}" fill="#3B2A22"/>` + t.join('');
  }

  function snowflake(cx, cy, r, col, sw) {
    let s = '';
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3, c = Math.cos(a), si = Math.sin(a);
      s += `<line x1="${cx}" y1="${cy}" x2="${f(cx + c * r)}" y2="${f(cy + si * r)}"/>`;
      [.45, .72].forEach(k => {
        const bx = cx + c * r * k, by = cy + si * r * k, l = r * (k === .45 ? .28 : .2);
        [-1, 1].forEach(d => {
          const b = a + d * Math.PI / 4;
          s += `<line x1="${f(bx)}" y1="${f(by)}" x2="${f(bx + Math.cos(b) * l)}" y2="${f(by + Math.sin(b) * l)}"/>`;
        });
      });
    }
    return `<g stroke="${col}" stroke-width="${sw || 2}" stroke-linecap="round" fill="none">${s}<circle cx="${cx}" cy="${cy}" r="${f(r * .1)}"/></g>`;
  }

  function leaf(x, y, a, len, col) {
    return `<path d="M0 0 Q${f(len * .5)} ${f(-len * .32)} ${len} 0 Q${f(len * .5)} ${f(len * .32)} 0 0z" fill="${col}" transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})"/>`;
  }

  function holly(x, y, s, leafCol, berry) {
    return leaf(x, y, -160, 34 * s, leafCol) + leaf(x, y, -20, 34 * s, leafCol) + leaf(x, y, -90, 28 * s, leafCol) +
      `<circle cx="${x - 5 * s}" cy="${y + 2}" r="${5 * s}" fill="${berry}"/><circle cx="${x + 5 * s}" cy="${y + 3}" r="${5 * s}" fill="${berry}"/><circle cx="${x}" cy="${y - 4 * s}" r="${5 * s}" fill="${berry}"/>`;
  }

  /* --------------------------------------------------------------- motifs */
  const M = {};

  M.towers = (a, variant) => {
    const g = skyDefs(a), r = rng('t' + variant);
    let orn = '';
    if (variant === 'star') orn = `<circle cx="292" cy="122" r="30" fill="#F3DDB0" opacity=".14"/><path d="M292 102 l5.5 14 15 1 -12 9.5 4 15 -12.5-8.5 -12.5 8.5 4-15 -12-9.5 15-1z" fill="#F3DDB0"/>` + dots(r, 16, '#fff', .9, 240);
    if (variant === 'moon') orn = `<circle cx="292" cy="128" r="40" fill="#F3E6C8" opacity=".08"/><path d="M296 100 A28 28 0 1 0 314 148 A23 23 0 1 1 296 100z" fill="#F3E6C8"/>` + dots(r, 24, '#fff', .9, 250);
    if (variant === 'fireworks') orn = burst(118, 132, 40, '#C9A56B') + burst(296, 118, 34, '#E0967A') + burst(214, 92, 22, '#A8C8C7') + dots(r, 14, '#fff', .7, 250);
    if (variant === 'sunrise') orn = `<circle cx="300" cy="272" r="70" fill="#FBE3C6" opacity=".35"/><circle cx="300" cy="272" r="40" fill="#F6D49A"/>` +
      Array.from({ length: 9 }, (_, i) => { const an = Math.PI + (i + 1) / 10 * Math.PI; return `<line x1="${f(300 + Math.cos(an) * 52)}" y1="${f(272 + Math.sin(an) * 52)}" x2="${f(300 + Math.cos(an) * 82)}" y2="${f(272 + Math.sin(an) * 82)}" stroke="#FBE3C6" stroke-width="2" stroke-linecap="round" opacity=".7"/>`; }).join('');
    return `<defs>${g.defs}</defs><rect width="400" height="400" fill="url(#${g.s})"/>${orn}
      <path d="M0 252 Q 80 238 150 248 T 300 244 T 400 248 V 272 H0z" fill="rgba(0,0,0,.18)"/>
      ${tower(172, 274, 1, a.ink)}${tower(250, 274, .74, a.ink)}${sea(g.w, 272, '#C9A56B')}`;
  };

  M.pines = (a, night) => {
    const g = skyDefs(a), r = rng('p' + night);
    const far = [[70, 300, 80], [130, 300, 100], [330, 300, 90], [270, 300, 70]].map(([x, b, h]) => pine(x, b, h, a.ink2 || '#7E9A90', '#F4F1EA')).join('');
    const near = [[160, 318, 150], [245, 322, 175], [105, 330, 105], [318, 330, 120]].map(([x, b, h]) => pine(x, b, h, a.ink, '#FFFFFF')).join('');
    return `<defs>${g.defs}</defs><rect width="400" height="400" fill="url(#${g.s})"/>
      ${night ? `<path d="M300 100 A24 24 0 1 0 316 142 A20 20 0 1 1 300 100z" fill="#F3E6C8"/>` + dots(r, 40, '#fff', .9, 260) : dots(r, 30, '#fff', .9, 400)}
      ${far}<path d="M0 312 Q120 292 220 306 T400 300 V400 H0z" fill="#F8F6F1"/>${near}
      <path d="M0 336 Q140 322 240 334 T400 330 V400 H0z" fill="#FFFFFF"/>`;
  };

  M.baubles = a => {
    const g = skyDefs(a), r = rng('b');
    const b = (x, y, rad, col, band, gid) => `
      <line x1="${x}" y1="0" x2="${x}" y2="${y - rad - 10}" stroke="#C9A56B" stroke-width="1.2"/>
      <radialGradient id="${gid}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".35" stop-color="${col}"/><stop offset="1" stop-color="${col}" stop-opacity=".85"/></radialGradient>
      <circle cx="${x}" cy="${y}" r="${rad}" fill="url(#${gid})"/>
      <rect x="${x - rad * .22}" y="${y - rad - 10}" width="${rad * .44}" height="12" rx="2" fill="#C9A56B"/>
      <path d="M${x - rad * .98} ${y + rad * .1} Q${x} ${y + rad * .32} ${x + rad * .98} ${y + rad * .1}" stroke="${band}" stroke-width="${rad * .1}" fill="none" opacity=".9"/>
      <path d="M${x - rad * .86} ${y - rad * .38} Q${x} ${y - rad * .2} ${x + rad * .86} ${y - rad * .38}" stroke="${band}" stroke-width="1.5" fill="none" stroke-dasharray="2 5" opacity=".9"/>`;
    return `<defs>${g.defs}</defs><rect width="400" height="400" fill="url(#${g.s})"/>${dots(r, 26, '#F3DDB0', .6)}
      ${b(150, 190, 40, '#C9A56B', '#7E3D2C', id('g'))}${b(232, 248, 50, '#EFE4D2', '#A8513B', id('g'))}${b(300, 168, 32, '#E0967A', '#F3DDB0', id('g'))}
      ${b(100, 282, 28, '#E0967A', '#F3DDB0', id('g'))}${b(312, 296, 24, '#C9A56B', '#7E3D2C', id('g'))}
      ${spark(206, 140, 9, '#F3DDB0')}${spark(118, 116, 6, '#F3DDB0')}${spark(270, 340, 7, '#F3DDB0')}`;
  };

  M.wreath = a => {
    const g = skyDefs(a), r = rng('w');
    let leaves = '';
    for (let i = 0; i < 44; i++) {
      const an = i / 44 * Math.PI * 2, rr = 84 + (r() - .5) * 18;
      const x = 200 + Math.cos(an) * rr, y = 196 + Math.sin(an) * rr;
      leaves += leaf(x, y, an * 180 / Math.PI + 90 + (r() - .5) * 70, 30 + r() * 10, i % 3 ? '#2F4A3E' : '#4F7262');
    }
    let berries = '';
    for (let i = 0; i < 12; i++) {
      const an = i / 12 * Math.PI * 2 + .2, x = 200 + Math.cos(an) * 86, y = 196 + Math.sin(an) * 86;
      berries += `<circle cx="${f(x)}" cy="${f(y)}" r="5" fill="#A8513B"/><circle cx="${f(x + 7)}" cy="${f(y + 4)}" r="4" fill="#C26A4F"/><circle cx="${f(x - 1)}" cy="${f(y - 1)}" r="1.4" fill="#fff" opacity=".6"/>`;
    }
    return `<defs>${g.defs}</defs><rect width="400" height="400" fill="url(#${g.s})"/>${dots(r, 24, '#C9A56B', .5)}
      ${leaves}${berries}
      <g fill="#A8513B"><path d="M200 284 C170 262 150 286 168 300 C180 308 196 294 200 284z"/><path d="M200 284 C230 262 250 286 232 300 C220 308 204 294 200 284z"/>
      <path d="M196 288 L180 330 L190 326 L196 336 L201 292z"/><path d="M204 288 L220 330 L210 326 L204 336 L199 292z"/></g>
      <circle cx="200" cy="286" r="8" fill="#7E3D2C"/>`;
  };

  M.candles = a => {
    const g = skyDefs(a), r = rng('c');
    const candle = (x, h, w) => {
      const top = 312 - h, gl = id('gl');
      return `<radialGradient id="${gl}"><stop offset="0" stop-color="#FFE6A8" stop-opacity=".5"/><stop offset="1" stop-color="#FFE6A8" stop-opacity="0"/></radialGradient>
        <circle cx="${x}" cy="${top - 18}" r="${w * 1.5}" fill="url(#${gl})"/>
        <rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" rx="3" fill="#F4EBDD"/>
        <rect x="${x - w / 2}" y="${top}" width="${w * .28}" height="${h}" fill="#fff" opacity=".45"/>
        <path d="M${x - w / 2} ${top + 6} q${w * .2} 10 ${w * .35} 0 q${w * .25} 14 ${w * .5} 0 q${w * .1} 6 ${w * .15} 0" fill="#F4EBDD"/>
        <line x1="${x}" y1="${top}" x2="${x}" y2="${top - 6}" stroke="#3B2A22" stroke-width="1.5"/>
        <path d="M${x} ${top - 34} C${x + 9} ${top - 18} ${x + 7} ${top - 6} ${x} ${top - 5} C${x - 7} ${top - 6} ${x - 9} ${top - 18} ${x} ${top - 34}z" fill="#F6C860"/>
        <path d="M${x} ${top - 22} C${x + 4} ${top - 14} ${x + 3} ${top - 8} ${x} ${top - 7} C${x - 3} ${top - 8} ${x - 4} ${top - 14} ${x} ${top - 22}z" fill="#fff" opacity=".8"/>`;
    };
    return `<defs>${g.defs}</defs><rect width="400" height="400" fill="url(#${g.s})"/>${dots(r, 30, '#F3DDB0', .5, 240)}
      ${candle(150, 120, 34)}${candle(205, 160, 40)}${candle(258, 95, 32)}
      <path d="M90 312 H310 Q320 312 320 320 V324 H80 V320 Q80 312 90 312z" fill="#C9A56B"/>
      ${holly(108, 314, 1, '#2F4A3E', '#A8513B')}${holly(296, 316, .9, '#2F4A3E', '#A8513B')}`;
  };

  M.snowflakes = a => {
    const g = skyDefs(a), r = rng('sf');
    let small = '';
    for (let i = 0; i < 16; i++) small += snowflake(f(r() * 400), f(r() * 400), f(8 + r() * 12), '#fff', 1.2).replace('<g ', `<g opacity="${f(.35 + r() * .5)}" `);
    return `<defs>${g.defs}</defs><rect width="400" height="400" fill="url(#${g.s})"/>${small}
      <circle cx="200" cy="200" r="100" fill="#fff" opacity=".08"/>
      ${snowflake(200, 200, 86, '#fff', 3.2)}${snowflake(200, 200, 40, '#C9A56B', 1.6)}`;
  };

  M.gift = a => {
    const g = skyDefs(a), r = rng('gf');
    return `<defs>${g.defs}</defs><rect width="400" height="400" fill="url(#${g.s})"/>${dots(r, 22, '#fff', .8)}
      <ellipse cx="200" cy="316" rx="110" ry="10" fill="rgba(0,0,0,.12)"/>
      <rect x="122" y="196" width="156" height="118" rx="3" fill="#A8513B"/>
      <rect x="112" y="172" width="176" height="32" rx="3" fill="#7E3D2C"/>
      <rect x="190" y="172" width="20" height="142" fill="#C9A56B"/>
      <rect x="122" y="236" width="156" height="14" fill="#C9A56B" opacity=".9"/>
      <path d="M200 172 C160 130 130 150 150 168 C160 178 190 176 200 172z" fill="#C9A56B"/>
      <path d="M200 172 C240 130 270 150 250 168 C240 178 210 176 200 172z" fill="#C9A56B"/>
      <path d="M200 172 C170 150 156 160 166 168z M200 172 C230 150 244 160 234 168z" fill="#9C7E4E"/>
      <circle cx="200" cy="172" r="9" fill="#B08A52"/>
      <path d="M270 210 l26 40" stroke="#C9A56B" stroke-width="1.2"/>
      <rect x="282" y="246" width="34" height="22" rx="3" fill="#EFE4D2" transform="rotate(30 299 257)"/>
      ${spark(110, 140, 10, '#fff')}${spark(300, 126, 8, '#fff')}${spark(316, 196, 6, '#fff')}`;
  };

  M.bells = a => {
    const g = skyDefs(a), r = rng('bl');
    const bell = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})">
      <path d="M-42 44 Q-44 -26 0 -40 Q44 -26 42 44 L52 56 L-52 56z" fill="#C9A56B"/>
      <path d="M-30 30 Q-32 -18 -6 -32" stroke="#F3DDB0" stroke-width="4" fill="none" opacity=".7"/>
      <rect x="-52" y="50" width="104" height="8" rx="4" fill="#B08A52"/>
      <circle cx="0" cy="66" r="10" fill="#B08A52"/><circle cx="0" cy="-44" r="7" fill="none" stroke="#B08A52" stroke-width="4"/></g>`;
    return `<defs>${g.defs}</defs><rect width="400" height="400" fill="url(#${g.s})"/>${dots(r, 26, '#C9A56B', .55)}
      ${bell(160, 214, -16)}${bell(242, 214, 16)}
      <path d="M200 156 C170 120 140 140 158 156 C170 166 192 160 200 156z M200 156 C230 120 260 140 242 156 C230 166 208 160 200 156z" fill="#A8513B"/>
      <path d="M196 160 L182 196 L192 192 L196 202 L201 162z M204 160 L218 196 L208 192 L204 202 L199 162z" fill="#A8513B"/>
      <circle cx="200" cy="158" r="8" fill="#7E3D2C"/>
      ${holly(200, 146, .9, '#2F4A3E', '#C26A4F')}
      <g stroke="#C9A56B" stroke-width="2" stroke-linecap="round" opacity=".8"><path d="M98 170 l-16 -8 M96 196 l-20 0 M98 222 l-16 8"/><path d="M302 170 l16 -8 M304 196 l20 0 M302 222 l16 8"/></g>`;
  };

  M.numerals = a => {
    const g = skyDefs(a), r = rng('n'), gg = id('gold');
    return `<defs>${g.defs}<linearGradient id="${gg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3DDB0"/><stop offset=".5" stop-color="#C9A56B"/><stop offset="1" stop-color="#9C7E4E"/></linearGradient></defs>
      <rect width="400" height="400" fill="url(#${g.s})"/>${dots(r, 50, '#F3DDB0', .7)}
      ${burst(120, 112, 26, '#C9A56B', 12)}${burst(300, 300, 22, '#E0967A', 12)}
      <text x="200" y="244" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-style="italic" font-weight="500" font-size="118" fill="url(#${gg})" letter-spacing="-2">2027</text>
      <line x1="110" y1="268" x2="290" y2="268" stroke="#C9A56B" stroke-width="1"/>
      ${spark(200, 268, 6, '#C9A56B')}${spark(316, 132, 9, '#F3DDB0')}${spark(92, 290, 7, '#F3DDB0')}`;
  };

  M.champagne = a => {
    const g = skyDefs(a), r = rng('ch'), liq = id('lq');
    const flute = (x, rot) => `<g transform="translate(${x} 214) rotate(${rot})">
      <path d="M-22 -104 L22 -104 Q24 -40 4 -6 L4 60 Q30 66 30 72 L-30 72 Q-30 66 -4 60 L-4 -6 Q-24 -40 -22 -104z" fill="rgba(255,255,255,.14)" stroke="#F3DDB0" stroke-width="1.6"/>
      <path d="M-20 -78 L20 -78 Q21 -36 3 -10 L-3 -10 Q-21 -36 -20 -78z" fill="url(#${liq})"/>
      ${[[-8, -40], [5, -56], [-3, -66], [8, -30], [0, -22]].map(([bx, by]) => `<circle cx="${bx}" cy="${by}" r="1.8" fill="#FFF4D6"/>`).join('')}</g>`;
    return `<defs>${g.defs}<linearGradient id="${liq}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6DFA6"/><stop offset="1" stop-color="#C9A56B"/></linearGradient></defs>
      <rect width="400" height="400" fill="url(#${g.s})"/>${dots(r, 40, '#F3DDB0', .6)}
      ${flute(176, 14)}${flute(224, -14)}
      ${burst(200, 112, 30, '#F3DDB0', 14)}
      ${spark(140, 120, 8, '#F3DDB0')}${spark(266, 132, 6, '#F3DDB0')}${spark(250, 96, 5, '#F3DDB0')}`;
  };

  M.clock = a => {
    const g = skyDefs(a), r = rng('cl');
    let ticks = '';
    for (let i = 0; i < 60; i++) {
      const an = i / 60 * Math.PI * 2, l = i % 5 ? 6 : 14;
      ticks += `<line x1="${f(200 + Math.sin(an) * 84)}" y1="${f(205 - Math.cos(an) * 84)}" x2="${f(200 + Math.sin(an) * (84 - l))}" y2="${f(205 - Math.cos(an) * (84 - l))}" stroke="#C9A56B" stroke-width="${i % 5 ? 1 : 2.4}"/>`;
    }
    const hand = (deg, len, w) => `<line x1="200" y1="205" x2="${f(200 + Math.sin(deg * Math.PI / 180) * len)}" y2="${f(205 - Math.cos(deg * Math.PI / 180) * len)}" stroke="#F3DDB0" stroke-width="${w}" stroke-linecap="round"/>`;
    return `<defs>${g.defs}</defs><rect width="400" height="400" fill="url(#${g.s})"/>${dots(r, 50, '#fff', .8)}
      <circle cx="200" cy="205" r="104" fill="none" stroke="#C9A56B" stroke-width="1" opacity=".5"/>
      <circle cx="200" cy="205" r="94" fill="rgba(255,255,255,.05)" stroke="#C9A56B" stroke-width="3"/>${ticks}
      <text x="200" y="152" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="22" fill="#F3DDB0">XII</text>
      ${hand(-6, 46, 5)}${hand(-6, 70, 3)}<circle cx="200" cy="205" r="6" fill="#C9A56B"/>
      ${burst(318, 104, 20, '#E0967A', 12)}${burst(88, 120, 16, '#A8C8C7', 10)}`;
  };

  M.deco = a => {
    const g = skyDefs(a);
    let rays = '';
    for (let i = 0; i <= 18; i++) {
      const an = Math.PI + i / 18 * Math.PI;
      rays += `<line x1="${f(200 + Math.cos(an) * 64)}" y1="${f(300 + Math.sin(an) * 64)}" x2="${f(200 + Math.cos(an) * 220)}" y2="${f(300 + Math.sin(an) * 220)}" stroke="#C9A56B" stroke-width="${i % 2 ? .8 : 1.8}" opacity="${i % 2 ? .5 : .9}"/>`;
    }
    return `<defs>${g.defs}</defs><rect width="400" height="400" fill="url(#${g.s})"/>${rays}
      ${[80, 110, 140].map((rr, i) => `<path d="M${200 - rr} 300 A${rr} ${rr} 0 0 1 ${200 + rr} 300" fill="none" stroke="#C9A56B" stroke-width="${i === 1 ? 2.5 : 1}"/>`).join('')}
      <path d="M150 300 A50 50 0 0 1 250 300z" fill="#C9A56B"/>
      <rect x="40" y="300" width="320" height="2" fill="#C9A56B"/><rect x="60" y="310" width="280" height="1" fill="#C9A56B" opacity=".7"/>
      <g fill="none" stroke="#C9A56B" stroke-width="1.4"><path d="M60 80 h40 v12 h12 v12"/><path d="M340 80 h-40 v12 h-12 v12"/></g>
      ${spark(200, 140, 12, '#F3DDB0')}${spark(128, 170, 5, '#F3DDB0')}${spark(272, 170, 5, '#F3DDB0')}`;
  };

  M.confetti = a => {
    const g = skyDefs(a), r = rng('cf'), cols = ['#A8513B', '#C9A56B', '#E0967A', '#234E64', '#A8C8C7'];
    let s = '';
    for (let i = 0; i < 70; i++) {
      const x = f(r() * 400), y = f(r() * 400), c = cols[(r() * cols.length) | 0], rot = f(r() * 180), k = r();
      if (k < .45) s += `<rect x="${x}" y="${y}" width="${f(6 + r() * 8)}" height="${f(3 + r() * 4)}" fill="${c}" transform="rotate(${rot} ${x} ${y})"/>`;
      else if (k < .75) s += `<circle cx="${x}" cy="${y}" r="${f(2 + r() * 3)}" fill="${c}"/>`;
      else s += `<path d="M${x} ${y} q6 -8 12 0 t12 0" stroke="${c}" stroke-width="2.4" fill="none" stroke-linecap="round" transform="rotate(${rot} ${x} ${y})"/>`;
    }
    return `<defs>${g.defs}</defs><rect width="400" height="400" fill="url(#${g.s})"/>${s}
      <circle cx="200" cy="200" r="74" fill="${a.sky[1]}" opacity=".92"/><circle cx="200" cy="200" r="66" fill="none" stroke="#C9A56B" stroke-width="1.4"/>
      <text x="200" y="196" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-style="italic" font-size="44" fill="#A8513B">2027</text>
      <text x="200" y="224" text-anchor="middle" font-family="Mulish, Arial, sans-serif" font-weight="700" letter-spacing="4" font-size="11" fill="#234E64">CHEERS</text>`;
  };

  M.lanterns = a => {
    const g = skyDefs(a), r = rng('ln');
    const lantern = (x, y, s, op) => {
      const gl = id('lg');
      return `<radialGradient id="${gl}"><stop offset="0" stop-color="#FFD58A" stop-opacity=".7"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient>
        <circle cx="${x}" cy="${y}" r="${f(30 * s)}" fill="url(#${gl})" opacity="${op}"/>
        <path d="M${f(x - 11 * s)} ${f(y - 16 * s)} L${f(x + 11 * s)} ${f(y - 16 * s)} L${f(x + 8 * s)} ${f(y + 14 * s)} L${f(x - 8 * s)} ${f(y + 14 * s)}z" fill="#F2A65A" opacity="${op}"/>
        <path d="M${f(x - 6 * s)} ${f(y - 12 * s)} L${f(x + 6 * s)} ${f(y - 12 * s)} L${f(x + 4 * s)} ${f(y + 10 * s)} L${f(x - 4 * s)} ${f(y + 10 * s)}z" fill="#FFE2A6" opacity="${op}"/>
        <ellipse cx="${x}" cy="${f(y + 15 * s)}" rx="${f(5 * s)}" ry="${f(2 * s)}" fill="#FFF3D1" opacity="${op}"/>`;
    };
    const L = [[200, 150, 1.5], [128, 196, 1.1], [276, 192, 1.2], [160, 116, .8], [252, 108, .75], [96, 132, .6], [318, 140, .65], [214, 220, .7], [60, 220, .5], [340, 230, .5]];
    return `<defs>${g.defs}</defs><rect width="400" height="400" fill="url(#${g.s})"/>${dots(r, 30, '#fff', .7, 200)}
      ${L.map(([x, y, s]) => lantern(x, y, s, 1)).join('')}
      ${sea(g.w, 286, '#C9A56B')}
      ${L.slice(0, 3).map(([x, y, s]) => `<ellipse cx="${x}" cy="${f(300 + (y - 150) * .1)}" rx="${f(6 * s)}" ry="${f(16 * s)}" fill="#F2A65A" opacity=".35"/>`).join('')}`;
  };

  M.boats = a => {
    const g = skyDefs(a), r = rng('bt');
    const boat = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
      <line x1="10" y1="-4" x2="14" y2="-46" stroke="#3B2A22" stroke-width="2"/>
      <circle cx="14" cy="-48" r="8" fill="#FFD58A" opacity=".35"/><rect x="10" y="-54" width="8" height="10" rx="2" fill="#F2A65A"/>
      <path d="M-34 0 A34 18 0 0 0 34 0z" fill="#5A3A26"/><ellipse cx="0" cy="0" rx="34" ry="7" fill="#3B2A22"/>
      <path d="M-30 4 L-18 14 M-18 4 L-6 16 M-6 4 L6 17 M6 4 L18 16 M18 4 L28 12 M-26 12 L-14 2 M-12 16 L0 4 M2 17 L14 4 M16 15 L28 4" stroke="#8A6242" stroke-width="1.2"/></g>`;
    return `<defs>${g.defs}</defs><rect width="400" height="400" fill="url(#${g.s})"/>${dots(r, 40, '#fff', .8, 250)}
      ${burst(130, 120, 44, '#C9A56B', 18)}${burst(280, 104, 36, '#E0967A', 16)}${burst(212, 180, 24, '#A8C8C7', 12)}
      ${sea(g.w, 262, '#C9A56B')}
      <g opacity=".35">${[[130, 300, 44], [280, 296, 36]].map(([x, y, rr]) => `<ellipse cx="${x}" cy="${y}" rx="${rr * .3}" ry="${rr * .7}" fill="#C9A56B"/>`).join('')}</g>
      ${boat(122, 300, 1.05)}${boat(220, 286, .8)}${boat(300, 316, 1.2)}`;
  };

  M.sparklers = a => {
    const g = skyDefs(a), r = rng('sp');
    const star = (x, y, n, len) => {
      let s = '';
      for (let i = 0; i < n; i++) {
        const an = r() * Math.PI * 2, l = len * (.3 + r() * .7);
        const x2 = x + Math.cos(an) * l, y2 = y + Math.sin(an) * l;
        s += `<line x1="${x}" y1="${y}" x2="${f(x2)}" y2="${f(y2)}" stroke="${r() < .6 ? '#FFE6A8' : '#F3DDB0'}" stroke-width="${f(.6 + r() * 1.2)}" stroke-linecap="round" opacity="${f(.5 + r() * .5)}"/>`;
        if (r() < .4) s += spark(f(x2), f(y2), f(2 + r() * 3), '#FFF4D6');
      }
      const gl = id('sg');
      return `<radialGradient id="${gl}"><stop offset="0" stop-color="#FFF4D6" stop-opacity=".9"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient><circle cx="${x}" cy="${y}" r="${len * .5}" fill="url(#${gl})"/>${s}`;
    };
    return `<defs>${g.defs}</defs><rect width="400" height="400" fill="url(#${g.s})"/>${dots(r, 30, '#F3DDB0', .5)}
      <line x1="150" y1="330" x2="190" y2="170" stroke="#6E6A66" stroke-width="3" stroke-linecap="round"/>
      <line x1="252" y1="330" x2="226" y2="182" stroke="#6E6A66" stroke-width="3" stroke-linecap="round"/>
      ${star(186, 168, 46, 70)}${star(228, 184, 40, 58)}`;
  };

  /* Motif registry: name → (art palette) → svg inner markup */
  const REG = {
    'towers-star': a => M.towers(a, 'star'), 'towers-moon': a => M.towers(a, 'moon'),
    'towers-fireworks': a => M.towers(a, 'fireworks'), 'towers-sunrise': a => M.towers(a, 'sunrise'),
    'pines': a => M.pines(a, false), 'pines-night': a => M.pines(a, true),
    baubles: M.baubles, wreath: M.wreath, candles: M.candles, snowflakes: M.snowflakes, gift: M.gift, bells: M.bells,
    numerals: M.numerals, champagne: M.champagne, clock: M.clock, deco: M.deco, confetti: M.confetti,
    lanterns: M.lanterns, boats: M.boats, sparklers: M.sparklers
  };

  function motifSVG(name, art) {
    const fn = REG[name] || REG['towers-star'];
    return `<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${fn(art)}</svg>`;
  }

  /* Decorative rings for the medallion layout */
  function ringSVG(kind, accent) {
    let s = '';
    if (kind === 'wreath') {
      const r = rng('ring');
      for (let i = 0; i < 40; i++) {
        const an = i / 40 * Math.PI * 2, x = 100 + Math.cos(an) * 90, y = 100 + Math.sin(an) * 90;
        s += leaf(x, y, an * 180 / Math.PI + 90 + (r() - .5) * 60, 16, i % 3 ? '#2F4A3E' : '#4F7262');
        if (i % 5 === 0) s += `<circle cx="${f(x)}" cy="${f(y)}" r="3.4" fill="#A8513B"/>`;
      }
    } else if (kind === 'stars') {
      for (let i = 0; i < 24; i++) {
        const an = i / 24 * Math.PI * 2;
        s += i % 2 ? `<circle cx="${f(100 + Math.cos(an) * 92)}" cy="${f(100 + Math.sin(an) * 92)}" r="1.6" fill="${accent}"/>`
          : spark(f(100 + Math.cos(an) * 92), f(100 + Math.sin(an) * 92), 4.5, accent);
      }
      s += `<circle cx="100" cy="100" r="86" fill="none" stroke="${accent}" stroke-width=".8"/>`;
    } else if (kind === 'rays') {
      for (let i = 0; i < 48; i++) {
        const an = i / 48 * Math.PI * 2, l = i % 2 ? 6 : 12;
        s += `<line x1="${f(100 + Math.cos(an) * 86)}" y1="${f(100 + Math.sin(an) * 86)}" x2="${f(100 + Math.cos(an) * (86 + l))}" y2="${f(100 + Math.sin(an) * (86 + l))}" stroke="${accent}" stroke-width="1.2"/>`;
      }
    } else {
      s = `<circle cx="100" cy="100" r="88" fill="none" stroke="${accent}" stroke-width="1"/><circle cx="100" cy="100" r="93" fill="none" stroke="${accent}" stroke-width=".6" stroke-dasharray="1 4"/>`;
    }
    return `<svg class="ecard__ring" viewBox="0 0 200 200" aria-hidden="true">${s}</svg>`;
  }

  /* Card background patterns (data URIs) */
  function patternURI(kind, accent) {
    const a = accent || '#C9A56B';
    const P = {
      dots: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><circle cx="9" cy="9" r="1.1" fill="${a}" opacity=".45"/></svg>`,
      stripes: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="M-2 16 L16 -2" stroke="${a}" stroke-width=".8" opacity=".25"/></svg>`,
      snow: `<svg xmlns="http://www.w3.org/2000/svg" width="46" height="46"><g stroke="${a}" stroke-width=".9" opacity=".35" stroke-linecap="round"><path d="M12 6v12M6 9l12 6M6 15l12-6"/><path d="M34 28v10M29.7 30.5l8.6 5M29.7 35.5l8.6-5"/></g></svg>`,
      stars: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><path d="M10 5 Q10.6 9.4 15 10 Q10.6 10.6 10 15 Q9.4 10.6 5 10 Q9.4 9.4 10 5z" fill="${a}" opacity=".4"/><circle cx="30" cy="30" r="1" fill="${a}" opacity=".5"/></svg>`,
      deco: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"><g fill="none" stroke="${a}" stroke-width=".8" opacity=".3"><path d="M0 20 A20 20 0 0 1 40 20"/><path d="M8 20 A12 12 0 0 1 32 20"/><path d="M-20 10 A20 20 0 0 1 20 10" transform="translate(0 0)"/></g></svg>`,
      confetti: `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70"><g opacity=".45"><rect x="8" y="10" width="7" height="3" fill="#A8513B" transform="rotate(30 8 10)"/><circle cx="48" cy="18" r="2" fill="#C9A56B"/><rect x="40" y="50" width="7" height="3" fill="#234E64" transform="rotate(-25 40 50)"/><circle cx="16" cy="52" r="1.6" fill="#E0967A"/><path d="M56 36 q3 -4 6 0 t6 0" stroke="#A8C8C7" stroke-width="1.6" fill="none"/></g></svg>`
    };
    return P[kind] ? `url("data:image/svg+xml,${encodeURIComponent(P[kind])}")` : 'none';
  }

  window.MQN = window.MQN || {};
  Object.assign(window.MQN, { motifSVG, ringSVG, patternURI });
})();
