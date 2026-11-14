/* Mia Quy Nhon — Festive eCard: canvas particle effects
 * snow · snowflakes · stars · sparkle · fireworks · confetti · lanterns
 * plus a confetti burst on opening. */
(function () {
  'use strict';

  const GOLD = '#C9A56B', CORAL = '#E0967A', SEA = '#A8C8C7', IVORY = '#EFE4D2', TERRA = '#A8513B';
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[(Math.random() * arr.length) | 0];

  class Effects {
    constructor(canvas, opts) {
      this.c = canvas; this.x = canvas.getContext('2d');
      this.type = null; this.parts = []; this.rockets = []; this.confetti = []; this.stars = [];
      this.onBurst = (opts && opts.onBurst) || null;
      this.reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.last = 0; this.running = false; this.nextRocket = 0;
      this.resize = this.resize.bind(this); this.frame = this.frame.bind(this);
      window.addEventListener('resize', this.resize);
      this.resize();
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = this.c.clientWidth || window.innerWidth; this.h = this.c.clientHeight || window.innerHeight;
      this.c.width = this.w * dpr; this.c.height = this.h * dpr;
      this.x.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (this.type === 'stars') this.seedStars();
    }

    density(n) { return Math.round(n * (this.reduced ? 0.35 : 1) * Math.min(1.4, Math.max(0.55, this.w / 1200))); }

    start(type) {
      this.type = type; this.parts = []; this.rockets = [];
      if (type === 'stars') this.seedStars();
      const n = { snow: 140, snowflakes: 46, stars: 40, sparkle: 90, confetti: 90, lanterns: 22, fireworks: 0 }[type] || 0;
      for (let i = 0; i < this.density(n); i++) this.parts.push(this.spawn(true));
      if (!this.running) { this.running = true; this.last = performance.now(); requestAnimationFrame(this.frame); }
    }

    stop() { this.running = false; this.x.clearRect(0, 0, this.w, this.h); }

    seedStars() {
      this.stars = Array.from({ length: this.density(180) }, () => ({
        x: Math.random() * this.w, y: Math.random() * this.h * 0.85, r: rnd(.4, 1.7),
        p: Math.random() * Math.PI * 2, s: rnd(.6, 2.2)
      }));
    }

    spawn(initial) {
      const w = this.w, h = this.h;
      switch (this.type) {
        case 'snow': {
          const gold = Math.random() < 0.18;
          return { x: Math.random() * w, y: initial ? Math.random() * h : -10, r: gold ? rnd(1, 2.2) : rnd(1.2, 3.6),
            vy: rnd(18, 55), sway: rnd(10, 30), ph: Math.random() * 6.3, gold, tw: Math.random() * 6.3 };
        }
        case 'stars': // falling gold dust
          return { x: Math.random() * w, y: initial ? Math.random() * h : -10, r: rnd(.6, 1.8), vy: rnd(8, 22),
            sway: rnd(4, 14), ph: Math.random() * 6.3, tw: Math.random() * 6.3 };
        case 'snowflakes':
          return { x: Math.random() * w, y: initial ? Math.random() * h : -20, r: rnd(4, 11), vy: rnd(16, 42),
            sway: rnd(12, 34), ph: Math.random() * 6.3, rot: Math.random() * 6.3, vr: rnd(-.6, .6), a: rnd(.45, .95) };
        case 'sparkle': // gold dust drifting upwards with twinkling stars
          return { x: Math.random() * w, y: initial ? Math.random() * h : h + 10, r: rnd(.6, 2.2), vy: -rnd(8, 26),
            sway: rnd(6, 18), ph: Math.random() * 6.3, tw: Math.random() * 6.3, star: Math.random() < .16 };
        case 'confetti':
          return { x: Math.random() * w, y: initial ? Math.random() * h : -12, vy: rnd(40, 90), sway: rnd(14, 40), ph: Math.random() * 6.3,
            w: rnd(5, 9), h: rnd(3, 5), rot: Math.random() * 6.3, vr: rnd(-4, 4), col: pick([GOLD, GOLD, CORAL, TERRA, SEA, '#234E64']) };
        case 'lanterns':
          return { x: Math.random() * w, y: initial ? rnd(h * .2, h) : h + 30, r: rnd(7, 15), vy: -rnd(12, 26),
            sway: rnd(6, 16), ph: Math.random() * 6.3, tw: Math.random() * 6.3 };
      }
      return null;
    }

    burstConfetti() {
      const cx = this.w / 2, cy = this.h * 0.45, n = this.density(160);
      for (let i = 0; i < n; i++) {
        const a = rnd(-Math.PI, 0), sp = rnd(260, 720);
        this.confetti.push({ x: cx + rnd(-40, 40), y: cy, vx: Math.cos(a) * sp * rnd(.5, 1.2), vy: Math.sin(a) * sp,
          w: rnd(5, 10), h: rnd(3, 6), rot: Math.random() * 6.3, vr: rnd(-9, 9), life: rnd(2.2, 3.6),
          col: pick([GOLD, GOLD, CORAL, IVORY, TERRA, SEA]) });
      }
      if (!this.running) { this.running = true; this.last = performance.now(); requestAnimationFrame(this.frame); }
    }

    launchRocket() {
      const w = this.w, h = this.h;
      const tx = rnd(w * 0.12, w * 0.88), ty = rnd(h * 0.1, h * 0.42);
      this.rockets.push({ x: tx + rnd(-60, 60), y: h + 10, tx, ty, t: 0, dur: rnd(1.0, 1.5),
        sx: 0, sy: h + 10, col: pick([GOLD, CORAL, SEA, IVORY, '#F3DDB0']) });
    }

    explode(r) {
      const n = this.density(90) + 20, big = Math.random() < 0.35;
      const col2 = pick([GOLD, CORAL, SEA, IVORY]);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rnd(-.05, .05), sp = rnd(80, big ? 300 : 220);
        this.parts.push({ fw: true, x: r.x, y: r.y, px: r.x, py: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          life: rnd(1.3, 2.2), age: 0, col: Math.random() < 0.7 ? r.col : col2, glitter: Math.random() < 0.3 });
      }
      if (this.onBurst) this.onBurst(big ? 1.3 : 0.9);
    }

    frame(now) {
      if (!this.running) return;
      const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
      const x = this.x, w = this.w, h = this.h, T = now / 1000;
      x.clearRect(0, 0, w, h);

      if (this.type === 'stars') {
        this.stars.forEach(s => {
          const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(T * s.s + s.p));
          x.globalAlpha = a; x.fillStyle = '#fff';
          x.beginPath(); x.arc(s.x, s.y, s.r, 0, 6.283); x.fill();
        });
        x.globalAlpha = 1;
        if (Math.random() < dt * 0.25 && !this.reduced) {
          this.parts.push({ shoot: true, x: rnd(w * 0.1, w * 0.9), y: rnd(0, h * 0.3), vx: rnd(-520, -380), vy: rnd(160, 240), life: 1.1, age: 0 });
        }
      }

      if (this.type === 'fireworks' && !this.reduced) {
        this.nextRocket -= dt;
        if (this.nextRocket <= 0) { this.launchRocket(); if (Math.random() < 0.35) this.launchRocket(); this.nextRocket = rnd(0.7, 1.8); }
      } else if (this.type === 'fireworks' && this.reduced) {
        this.nextRocket -= dt;
        if (this.nextRocket <= 0) { this.launchRocket(); this.nextRocket = rnd(2.5, 4); }
      }

      // rockets
      for (let i = this.rockets.length - 1; i >= 0; i--) {
        const r = this.rockets[i]; r.t += dt;
        const k = Math.min(1, r.t / r.dur), e = 1 - Math.pow(1 - k, 3);
        const nx = r.x + (r.tx - r.x) * e, ny = r.sy + (r.ty - r.sy) * e;
        x.strokeStyle = r.col; x.globalAlpha = 0.8; x.lineWidth = 2;
        x.beginPath(); x.moveTo(nx, ny); x.lineTo(nx - (r.tx - r.x) * 0.02, ny + 18); x.stroke();
        x.globalAlpha = 1;
        if (k >= 1) { this.explode({ x: r.tx, y: r.ty, col: r.col }); this.rockets.splice(i, 1); }
      }

      // ambient particles
      for (let i = this.parts.length - 1; i >= 0; i--) {
        const p = this.parts[i];
        if (p.fw) {
          p.age += dt; if (p.age > p.life) { this.parts.splice(i, 1); continue; }
          p.px = p.x; p.py = p.y;
          p.vx *= 1 - dt * 1.6; p.vy = p.vy * (1 - dt * 1.6) + 70 * dt;
          p.x += p.vx * dt; p.y += p.vy * dt;
          const a = 1 - p.age / p.life;
          x.globalAlpha = p.glitter ? a * (Math.random() < 0.5 ? 1 : 0.2) : a;
          x.strokeStyle = p.col; x.lineWidth = 2;
          x.beginPath(); x.moveTo(p.px, p.py); x.lineTo(p.x, p.y); x.stroke();
          continue;
        }
        if (p.shoot) {
          p.age += dt; if (p.age > p.life) { this.parts.splice(i, 1); continue; }
          p.x += p.vx * dt; p.y += p.vy * dt;
          const g = x.createLinearGradient(p.x, p.y, p.x - p.vx * 0.18, p.y - p.vy * 0.18);
          g.addColorStop(0, 'rgba(255,248,230,.95)'); g.addColorStop(1, 'rgba(255,248,230,0)');
          x.globalAlpha = 1 - p.age / p.life; x.strokeStyle = g; x.lineWidth = 1.6;
          x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(p.x - p.vx * 0.18, p.y - p.vy * 0.18); x.stroke();
          continue;
        }
        p.y += p.vy * dt; p.ph += dt;
        const px = p.x + Math.sin(p.ph) * p.sway;
        if ((p.vy > 0 && p.y > h + 20) || (p.vy < 0 && p.y < -40)) { Object.assign(p, this.spawn(false)); continue; }
        if (this.type === 'snow') {
          if (p.gold) {
            x.globalAlpha = 0.55 + 0.45 * Math.sin(T * 3 + p.tw); x.fillStyle = GOLD;
          } else { x.globalAlpha = 0.85; x.fillStyle = '#fff'; }
          x.beginPath(); x.arc(px, p.y, p.r, 0, 6.283); x.fill();
        } else if (this.type === 'stars') {
          x.globalAlpha = 0.4 + 0.5 * Math.sin(T * 2.5 + p.tw); x.fillStyle = '#F3DDB0';
          x.beginPath(); x.arc(px, p.y, p.r, 0, 6.283); x.fill();
        } else if (this.type === 'snowflakes') {
          p.rot += p.vr * dt;
          x.save(); x.translate(px, p.y); x.rotate(p.rot); x.globalAlpha = p.a;
          x.strokeStyle = '#fff'; x.lineWidth = Math.max(1, p.r / 7); x.lineCap = 'round';
          x.beginPath();
          for (let k = 0; k < 6; k++) {
            x.moveTo(0, 0); x.lineTo(0, -p.r);
            x.moveTo(0, -p.r * .55); x.lineTo(-p.r * .25, -p.r * .78);
            x.moveTo(0, -p.r * .55); x.lineTo(p.r * .25, -p.r * .78);
            x.rotate(Math.PI / 3);
          }
          x.stroke(); x.restore();
        } else if (this.type === 'sparkle') {
          const a = 0.35 + 0.65 * Math.abs(Math.sin(T * 2.2 + p.tw));
          x.globalAlpha = a; x.fillStyle = p.star ? '#FFF4D6' : GOLD;
          if (p.star) {
            const s = p.r * 3.2 * a;
            x.beginPath(); x.moveTo(px, p.y - s); x.quadraticCurveTo(px, p.y, px + s, p.y); x.quadraticCurveTo(px, p.y, px, p.y + s);
            x.quadraticCurveTo(px, p.y, px - s, p.y); x.quadraticCurveTo(px, p.y, px, p.y - s); x.fill();
          } else { x.beginPath(); x.arc(px, p.y, p.r, 0, 6.283); x.fill(); }
        } else if (this.type === 'confetti') {
          p.rot += p.vr * dt;
          x.save(); x.translate(px, p.y); x.rotate(p.rot); x.scale(1, Math.sin(p.rot * 1.6));
          x.globalAlpha = 0.9; x.fillStyle = p.col; x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); x.restore();
        } else if (this.type === 'lanterns') {
          const fl = 0.8 + 0.2 * Math.sin(T * 6 + p.tw);
          const g = x.createRadialGradient(px, p.y, 0, px, p.y, p.r * 3);
          g.addColorStop(0, `rgba(255,213,138,${.45 * fl})`); g.addColorStop(1, 'rgba(255,213,138,0)');
          x.globalAlpha = 1; x.fillStyle = g; x.beginPath(); x.arc(px, p.y, p.r * 3, 0, 6.283); x.fill();
          x.fillStyle = '#F2A65A'; x.beginPath();
          x.moveTo(px - p.r * .75, p.y - p.r); x.lineTo(px + p.r * .75, p.y - p.r); x.lineTo(px + p.r * .55, p.y + p.r); x.lineTo(px - p.r * .55, p.y + p.r); x.fill();
          x.fillStyle = `rgba(255,236,190,${fl})`; x.beginPath();
          x.moveTo(px - p.r * .4, p.y - p.r * .7); x.lineTo(px + p.r * .4, p.y - p.r * .7); x.lineTo(px + p.r * .28, p.y + p.r * .7); x.lineTo(px - p.r * .28, p.y + p.r * .7); x.fill();
        }
      }

      // confetti
      for (let i = this.confetti.length - 1; i >= 0; i--) {
        const c = this.confetti[i]; c.life -= dt;
        if (c.life <= 0 || c.y > h + 30) { this.confetti.splice(i, 1); continue; }
        c.vx *= 1 - dt * 1.2; c.vy = c.vy * (1 - dt * 1.2) + 520 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.rot += c.vr * dt;
        x.save(); x.translate(c.x, c.y); x.rotate(c.rot); x.scale(1, Math.sin(c.rot * 1.7));
        x.globalAlpha = Math.min(1, c.life); x.fillStyle = c.col; x.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        x.restore();
      }
      x.globalAlpha = 1;
      requestAnimationFrame(this.frame);
    }
  }

  window.MQN = window.MQN || {};
  window.MQN.Effects = Effects;
})();
