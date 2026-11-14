/* Mia Quy Nhon — Festive eCard: synthesised music box (Web Audio, no audio files).
 * Public-domain melodies: Jingle Bells, Silent Night, We Wish You a Merry Christmas,
 * Deck the Halls, Auld Lang Syne. Original melodies: Midnight Waltz, Coastal Dawn. */
(function () {
  'use strict';

  const SONGS = {
    jingle: {
      bpm: 128, voice: 'musicbox', transpose: 0,
      melody: 'E5:1 E5:1 E5:2 E5:1 E5:1 E5:2 E5:1 G5:1 C5:1.5 D5:.5 E5:4 F5:1 F5:1 F5:1.5 F5:.5 F5:1 E5:1 E5:1 E5:.5 E5:.5 E5:1 D5:1 D5:1 E5:1 D5:2 G5:2 ' +
              'E5:1 E5:1 E5:2 E5:1 E5:1 E5:2 E5:1 G5:1 C5:1.5 D5:.5 E5:4 F5:1 F5:1 F5:1 F5:1 F5:1 E5:1 E5:1 E5:.5 E5:.5 G5:1 G5:1 F5:1 D5:1 C5:4',
      bass: 'C3:2 G3:2 C3:2 G3:2 C3:2 G3:2 C3:2 G3:2 F3:2 C4:2 C3:2 G3:2 G2:2 D3:2 G2:2 D3:2 ' +
            'C3:2 G3:2 C3:2 G3:2 C3:2 G3:2 C3:2 G3:2 F3:2 C4:2 C3:2 G3:2 G2:2 D3:2 C3:4',
      bells: true
    },
    silent: {
      bpm: 92, voice: 'musicbox', transpose: 12,
      melody: 'G4:1.5 A4:.5 G4:1 E4:3 G4:1.5 A4:.5 G4:1 E4:3 D5:2 D5:1 B4:3 C5:2 C5:1 G4:3 ' +
              'A4:2 A4:1 C5:1.5 B4:.5 A4:1 G4:1.5 A4:.5 G4:1 E4:3 A4:2 A4:1 C5:1.5 B4:.5 A4:1 G4:1.5 A4:.5 G4:1 E4:3 ' +
              'D5:2 D5:1 F5:1.5 D5:.5 B4:1 C5:3 E5:3 C5:1 G4:1 E4:1 G4:1.5 F4:.5 D4:1 C4:6',
      bass: 'C3:3 C3:3 C3:3 C3:3 G2:3 G2:3 C3:3 C3:3 F2:3 F2:3 C3:3 C3:3 F2:3 F2:3 C3:3 C3:3 G2:3 G2:3 C3:3 C3:3 C3:3 G2:3 C3:6'
    },
    auld: {
      bpm: 96, voice: 'musicbox', transpose: 0,
      melody: 'G4:1 C5:1.5 C5:.5 C5:1 E5:1 D5:1.5 C5:.5 D5:1 E5:.5 D5:.5 C5:1.5 C5:.5 E5:1 G5:1 A5:3 A5:1 ' +
              'G5:1.5 E5:.5 E5:1 C5:1 D5:1.5 C5:.5 D5:1 E5:.5 D5:.5 C5:1.5 A4:.5 A4:1 G4:1 C5:3 A5:1 ' +
              'G5:1.5 E5:.5 E5:1 C5:1 D5:1.5 C5:.5 D5:1 A5:1 G5:1.5 E5:.5 E5:1 G5:1 A5:3 C6:1 ' +
              'G5:1.5 E5:.5 E5:1 C5:1 D5:1.5 C5:.5 D5:1 E5:.5 D5:.5 C5:1.5 A4:.5 A4:1 G4:1 C5:3',
      bass: 'R:1 C3:4 G2:4 C3:4 F2:4 C3:4 G2:4 F2:2 G2:2 C3:4 F2:4 C3:4 G2:4 F2:4 C3:4 G2:4 F2:2 G2:2 C3:3'
    },
    wewish: {
      bpm: 120, voice: 'musicbox', transpose: 12,
      melody: 'D4:1 G4:1 G4:.5 A4:.5 G4:.5 F#4:.5 E4:1 E4:1 E4:1 A4:1 A4:.5 B4:.5 A4:.5 G4:.5 F#4:1 D4:1 D4:1 ' +
              'B4:1 B4:.5 C5:.5 B4:.5 A4:.5 G4:1 E4:1 D4:.5 D4:.5 E4:1 A4:1 F#4:1 G4:2',
      bass: 'R:1 G2:3 C3:3 A2:3 D3:3 B2:3 C3:3 D3:3 G2:2'
    },
    deck: {
      bpm: 132, voice: 'musicbox', transpose: 12,
      melody: 'G4:1.5 F4:.5 E4:1 D4:1 C4:1 D4:1 E4:1 C4:1 D4:.5 E4:.5 F4:.5 D4:.5 E4:1.5 D4:.5 C4:1 B3:1 C4:2 ' +
              'G4:1.5 F4:.5 E4:1 D4:1 C4:1 D4:1 E4:1 C4:1 D4:.5 E4:.5 F4:.5 D4:.5 E4:1.5 D4:.5 C4:1 B3:1 C4:2 ' +
              'D4:1.5 E4:.5 F4:1 D4:1 E4:1.5 F4:.5 G4:1 D4:1 E4:.5 F#4:.5 G4:1 A4:.5 B4:.5 C5:1 B4:1 A4:1 G4:2 ' +
              'G4:1.5 F4:.5 E4:1 D4:1 C4:1 D4:1 E4:1 C4:1 A4:.5 A4:.5 A4:.5 A4:.5 G4:1.5 F4:.5 E4:1 D4:1 C4:2',
      bass: 'C3:4 C3:4 G2:4 G2:2 C3:2 C3:4 C3:4 G2:4 G2:2 C3:2 G2:4 C3:4 D3:4 G2:4 C3:4 C3:4 F2:4 G2:2 C3:2'
    },
    midnight: {
      bpm: 138, voice: 'musicbox', transpose: 0,
      melody: 'G4:1 C5:1 E5:1 G5:2 E5:1 F5:1 E5:1 D5:1 C5:3 A4:1 C5:1 F5:1 A5:2 G5:1 F5:1 E5:1 D5:1 E5:3 ' +
              'G4:1 C5:1 E5:1 G5:2 C6:1 B5:1 A5:1 G5:1 F5:3 D5:1 E5:1 F5:1 G5:1 E5:1 D5:1 C5:3 R:3',
      bass: 'C3:3 C3:3 G2:3 C3:3 F2:3 F2:3 G2:3 C3:3 C3:3 A2:3 G2:3 F2:3 G2:3 G2:3 C3:3 C3:3'
    },
    coastal: {
      bpm: 100, voice: 'pluck', transpose: 0,
      melody: 'E5:1 G5:1 A5:2 G5:1 E5:1 D5:2 C5:1 D5:1 E5:1 G5:1 D5:4 E5:1 G5:1 A5:1 C6:1 A5:2 G5:2 E5:1 D5:1 C5:1 A4:1 C5:4 ' +
              'A5:1 C6:1 D6:2 C6:1 A5:1 G5:2 E5:1 G5:1 A5:1 C6:1 G5:4 A5:1 G5:1 E5:1 D5:1 E5:2 G5:2 D5:1 C5:1 A4:1 G4:1 C5:4',
      bass: 'A2:4 G2:4 C3:4 G2:4 A2:4 C3:4 G2:4 C3:4 D3:4 C3:4 A2:4 G2:4 A2:4 C3:4 G2:4 C3:4'
    }
  };

  const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function parse(seq, transpose) {
    return seq.trim().split(/\s+/).map(tok => {
      const [n, d] = tok.split(':');
      if (n === 'R') return { f: 0, d: +d };
      const m = n.match(/^([A-G])(#|b)?(\d)$/);
      const midi = 12 * (+m[3] + 1) + NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (transpose || 0);
      return { f: 440 * Math.pow(2, (midi - 69) / 12), d: +d };
    });
  }

  class MusicBox {
    constructor() {
      this.ctx = null; this.master = null; this.playing = false; this.muted = false;
      this.timer = null; this.song = null;
    }

    ensure() {
      if (this.ctx) return this.ctx;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      const ctx = this.ctx = new AC();
      this.master = ctx.createGain();
      this.master.gain.value = 0;
      // Gentle hall reverb from a synthesised impulse response
      const conv = ctx.createConvolver();
      const len = ctx.sampleRate * 2.4, ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const ch = ir.getChannelData(c);
        for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
      }
      conv.buffer = ir;
      const wet = ctx.createGain(); wet.gain.value = 0.32;
      const dry = ctx.createGain(); dry.gain.value = 0.85;
      this.bus = ctx.createGain();
      this.bus.connect(dry); this.bus.connect(conv); conv.connect(wet);
      dry.connect(this.master); wet.connect(this.master);
      this.master.connect(ctx.destination);
      return ctx;
    }

    tone(freq, t, dur, opts) {
      const ctx = this.ctx; opts = opts || {};
      const voice = opts.voice || 'musicbox', vol = opts.vol || 0.18;
      const out = ctx.createGain();
      out.connect(this.bus);
      const partials = (voice === 'pluck' || voice === 'harp')
        ? [[1, 1, 'triangle'], [2, .35, 'sine'], [3, .12, 'sine']]
        : voice === 'celesta'
          ? [[1, 1, 'sine'], [4, .28, 'sine'], [2, .18, 'sine'], [6.2, .05, 'sine']]
        : voice === 'bass'
          ? [[1, 1, 'sine'], [2, .15, 'sine']]
          : [[1, 1, 'sine'], [2, .42, 'sine'], [3.01, .16, 'sine'], [4.2, .08, 'sine']];
      const decay = voice === 'bass' ? Math.min(dur * 1.1, 2.2) : voice === 'pluck' ? 0.9 : voice === 'harp' ? 1.8 : voice === 'celesta' ? 1.1 : 1.6;
      partials.forEach(([mul, amp, type]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.setValueAtTime(freq * mul, t);
        if (voice === 'pluck' || voice === 'harp') o.frequency.exponentialRampToValueAtTime(freq * mul * 0.997, t + 0.25);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol * amp, t + (voice === 'bass' ? 0.04 : 0.006));
        g.gain.exponentialRampToValueAtTime(0.0001, t + decay / Math.sqrt(mul));
        o.connect(g); g.connect(out);
        o.start(t); o.stop(t + decay + 0.05);
      });
    }

    sleigh(t) {
      // Soft sleigh-bell shimmer: filtered noise burst
      const ctx = this.ctx, len = ctx.sampleRate * 0.12;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
      const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = buf; f.type = 'highpass'; f.frequency.value = 7000; g.gain.value = 0.05;
      src.connect(f); f.connect(g); g.connect(this.bus); src.start(t);
    }

    play(songId, voiceOverride) {
      if (!this.ensure()) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.stop(true);
      const s = Object.assign({}, SONGS[songId] || SONGS.jingle);
      if (voiceOverride) s.voice = voiceOverride;
      this.song = s; this.playing = true;
      const spb = 60 / s.bpm;
      const mel = parse(s.melody, s.transpose), bass = parse(s.bass, s.transpose ? 12 : 0);
      const total = mel.reduce((a, n) => a + n.d, 0);
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(this.master.gain.value, now);
      this.master.gain.linearRampToValueAtTime(this.muted ? 0 : 0.9, now + 1.2);

      // Simple look-ahead scheduler so the loop is seamless
      let loopStart = now + 0.15, events = [];
      const buildLoop = (start) => {
        let b = 0;
        mel.forEach(n => { if (n.f) events.push({ t: start + b * spb, f: n.f, d: n.d * spb, v: s.voice }); b += n.d; });
        b = 0;
        bass.forEach(n => { if (n.f) events.push({ t: start + b * spb, f: n.f, d: n.d * spb, v: 'bass' }); b += n.d; });
        if (s.bells) for (let i = 0; i < total; i += 1) events.push({ t: start + i * spb, bell: true });
        events.sort((a, b2) => a.t - b2.t);
      };
      buildLoop(loopStart);
      const tick = () => {
        if (!this.playing) return;
        const horizon = this.ctx.currentTime + 0.6;
        while (events.length && events[0].t < horizon) {
          const e = events.shift();
          if (e.bell) this.sleigh(e.t);
          else this.tone(e.f, e.t, e.d, { voice: e.v, vol: e.v === 'bass' ? 0.11 : 0.17 });
        }
        if (!events.length) { loopStart += total * spb + spb * 2; buildLoop(loopStart); }
        this.timer = setTimeout(tick, 120);
      };
      tick();
    }

    chime() {
      // Opening flourish: a rising arpeggio of bells
      if (!this.ensure()) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const t = this.ctx.currentTime + 0.02;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(this.muted ? 0 : 0.9, t);
      [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568].forEach((f, i) =>
        this.tone(f, t + i * 0.075, 1.2, { vol: 0.11 }));
    }

    pop(intensity) {
      // Soft firework thump + crackle, kept well under the music
      if (!this.ctx || this.muted || !this.playing) return;
      const ctx = this.ctx, t = ctx.currentTime, len = ctx.sampleRate * 0.6;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6) * (Math.random() < 0.08 ? 1.6 : 0.6);
      const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = buf; f.type = 'lowpass'; f.frequency.value = 1800 + Math.random() * 1200;
      g.gain.value = 0.05 * (intensity || 1);
      src.connect(f); f.connect(g); g.connect(this.bus); src.start(t);
    }

    setMuted(m) {
      this.muted = m;
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(this.master.gain.value, t);
      this.master.gain.linearRampToValueAtTime(m ? 0 : 0.9, t + 0.4);
    }

    stop(immediate) {
      this.playing = false;
      clearTimeout(this.timer);
      if (this.ctx && !immediate) {
        const t = this.ctx.currentTime;
        this.master.gain.cancelScheduledValues(t);
        this.master.gain.setValueAtTime(this.master.gain.value, t);
        this.master.gain.linearRampToValueAtTime(0, t + 0.5);
      }
    }
  }

  window.MQN = window.MQN || {};
  window.MQN.MusicBox = MusicBox;
  window.MQN.SONGS = SONGS;
})();
