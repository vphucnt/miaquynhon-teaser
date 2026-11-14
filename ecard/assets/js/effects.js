/* Mia Quy Nhon — Festive eCard: canvas particle effects
 * snow (Christmas) · stars (Silent Night) · fireworks (New Year) · petals (Tết)
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
      const n = { snow: 140, stars: 40, petals: 46, fireworks: 0 }[type] || 0;
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
        case 'petals':
          return { x: Math.random() * w, y: initial ? Math.random() * h : -20, r: rnd(5, 11), vy: rnd(25, 60),
            sway: rnd(20, 55), ph: Math.random() * 6.3, rot: Math.random() * 6.3, vr: rnd(-1.4, 1.4),
            flip: Math.random() * 6.3, kind: Math.random() < 0.72 ? 'flower' : 'petal' };
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
        if (p.y > h + 20) { Object.assign(p, this.spawn(false)); continue; }
        if (this.type === 'snow') {
          if (p.gold) {
            x.globalAlpha = 0.55 + 0.45 * Math.sin(T * 3 + p.tw); x.fillStyle = GOLD;
          } else { x.globalAlpha = 0.85; x.fillStyle = '#fff'; }
          x.beginPath(); x.arc(px, p.y, p.r, 0, 6.283); x.fill();
        } else if (this.type === 'stars') {
          x.globalAlpha = 0.4 + 0.5 * Math.sin(T * 2.5 + p.tw); x.fillStyle = '#F3DDB0';
          x.beginPath(); x.arc(px, p.y, p.r, 0, 6.283); x.fill();
        } else if (this.type === 'petals') {
          p.rot += p.vr * dt; p.flip += dt * 2;
          x.save(); x.translate(px, p.y); x.rotate(p.rot); x.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.flip)));
          x.globalAlpha = 0.95;
          if (p.kind === 'flower') {
            x.fillStyle = '#F6C945';
            for (let k = 0; k < 5; k++) {
              x.rotate(Math.PI * 2 / 5);
              x.beginPath(); x.ellipse(0, -p.r * 0.55, p.r * 0.36, p.r * 0.55, 0, 0, 6.283); x.fill();
            }
            x.fillStyle = '#D9822B'; x.beginPath(); x.arc(0, 0, p.r * 0.22, 0, 6.283); x.fill();
          } else {
            x.fillStyle = '#F8D66A'; x.beginPath(); x.ellipse(0, 0, p.r * 0.35, p.r * 0.6, 0, 0, 6.283); x.fill();
          }
          x.restore();
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
