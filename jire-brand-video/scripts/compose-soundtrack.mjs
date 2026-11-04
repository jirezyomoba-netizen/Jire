// Original soundtrack for the jire_ai Brand Builders video, composed in code.
// 120 BPM, D minor, chords: Dm9 -> Bbmaj9 -> Fmaj7 -> Cadd9 (one per 2 s bar).
// Arranged to the storyboard: soft intro, riser, drop on the send-button click,
// one-beat dropouts before big transitions, lift under the proof, final hit into the loop.
// UI sound effects (typing, clicks, pops, whooshes) are mixed in on the exact frames.
// Usage: node scripts/compose-soundtrack.mjs -> public/soundtrack-60.wav, public/soundtrack-15.wav
import {writeFileSync} from 'node:fs';

const SR = 48000;
const BPM = 120;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const TAU = Math.PI * 2;
const MASTER = Number(process.env.MASTER ?? 0.63);
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

const CHORDS = [
  {root: 38, notes: [50, 53, 57, 60, 64]}, // Dm9
  {root: 34, notes: [46, 50, 53, 57, 60]}, // Bbmaj9
  {root: 41, notes: [53, 57, 60, 64, 69]}, // Fmaj7 (add A)
  {root: 36, notes: [48, 55, 60, 62, 67]}, // Cadd9
];
const ARP = [0, 2, 4, 2, 1, 3, 4, 3, 0, 2, 4, 2, 1, 3, 4, 2];

function compose(len, plan) {
  const N = Math.ceil(len * SR);
  const L = new Float32Array(N);
  const R = new Float32Array(N);
  const revL = new Float32Array(N); // reverb send
  const revR = new Float32Array(N);
  const dlyL = new Float32Array(N); // delay send
  const dlyR = new Float32Array(N);
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
  const clamp01 = (x) => Math.max(0, Math.min(1, x));

  const inDrop = (t) => plan.dropouts.some(([a, b]) => t >= a - 1e-6 && t < b - 1e-6);
  const section = (t) => (t < plan.drop ? 'intro' : t < plan.end ? (plan.lift && t >= plan.lift[0] && t < plan.lift[1] ? 'lift' : 'main') : 'outro');
  // sidechain pump from the kick
  const kicks = [];
  const pump = (t) => {
    let g = 1;
    for (let k = kicks.length - 1; k >= 0; k--) {
      const d = t - kicks[k];
      if (d >= 0 && d < 0.4) {
        g = 1 - 0.55 * Math.exp(-d * 9);
        break;
      }
    }
    return g;
  };

  const put = (i, l, r, rev = 0, dly = 0) => {
    if (i < 0 || i >= N) return;
    L[i] += l;
    R[i] += r;
    revL[i] += l * rev;
    revR[i] += r * rev;
    dlyL[i] += l * dly;
    dlyR[i] += r * dly;
  };

  // ---- drums ----
  const kick = (t, g = 0.95) => {
    const i0 = Math.floor(t * SR);
    for (let i = 0; i < 0.45 * SR; i++) {
      const x = i / SR;
      const ph = TAU * (48 * x + (90 / 22) * (1 - Math.exp(-22 * x)));
      const v = g * (Math.sin(ph) * Math.exp(-6.5 * x) + 0.25 * rnd() * Math.exp(-180 * x));
      put(i0 + i, v, v);
    }
  };
  const clap = (t, g = 0.32) => {
    const i0 = Math.floor(t * SR);
    let lp = 0;
    for (let i = 0; i < 0.3 * SR; i++) {
      const x = i / SR;
      const env = (x < 0.03 ? (Math.floor(x / 0.01) % 2 ? 0.6 : 1) : 1) * Math.exp(-14 * x);
      const n = rnd();
      lp += 0.35 * (n - lp);
      const v = g * (n - lp) * env + g * 0.4 * Math.sin(TAU * 190 * x) * Math.exp(-30 * x);
      put(i0 + i, v * 0.9, v, 0.35);
    }
  };
  const hat = (t, g = 0.07, open = false) => {
    const i0 = Math.floor(t * SR);
    let prev = 0;
    const d = open ? 0.22 : 0.045;
    for (let i = 0; i < d * SR; i++) {
      const x = i / SR;
      const n = rnd();
      const hp = n - prev;
      prev = n;
      const v = g * hp * Math.exp(-(open ? 12 : 70) * x);
      put(i0 + i, v * 0.8, v, 0.1);
    }
  };

  // ---- tonal layers ----
  const pad = (t0, dur, notes, amp, cutoff) => {
    let vs = 3;
    const i0 = Math.floor(t0 * SR);
    const n = Math.floor((dur + 0.6) * SR);
    const voices = [];
    notes.forEach((m) => [-0.12, 0.0, 0.11].forEach((det) => voices.push({f: mtof(m + det), p: (vs = (vs * 9301 + 49297) % 233280) / 233280})));
    let l1 = 0, l2 = 0, r1 = 0, r2 = 0;
    for (let i = 0; i < n; i++) {
      const x = i / SR;
      const t = t0 + x;
      const env = clamp01(x / 0.35) * (x > dur ? Math.max(0, 1 - (x - dur) / 0.6) : 1);
      let sl = 0, sr = 0;
      voices.forEach((v, k) => {
        const s = 2 * ((v.p + v.f * x) % 1) - 1;
        if (k % 2) sl += s; else sr += s;
      });
      const fc = typeof cutoff === 'function' ? cutoff(t) : cutoff;
      const a = 1 - Math.exp((-TAU * fc) / SR);
      l1 += a * (sl - l1); l2 += a * (l1 - l2);
      r1 += a * (sr - r1); r2 += a * (r1 - r2);
      const g = (amp * env * pump(t)) / voices.length;
      put(i0 + i, l2 * g * 2, r2 * g * 2, 0.45);
    }
  };
  const pluck = (t, m, g, pan, bright) => {
    const i0 = Math.floor(t * SR);
    const f = mtof(m);
    let lp = 0;
    for (let i = 0; i < 0.5 * SR; i++) {
      const x = i / SR;
      const raw = Math.sin(TAU * f * x) + 0.5 * Math.sin(TAU * 2 * f * x) * Math.exp(-10 * x) + 0.2 * Math.sin(TAU * 3 * f * x) * Math.exp(-18 * x);
      const a = 1 - Math.exp((-TAU * bright) / SR);
      lp += a * (raw - lp);
      const v = g * lp * Math.exp(-7 * x) * Math.min(1, x * 400);
      put(i0 + i, v * (1 - pan), v * (1 + pan), 0.3, 0.35);
    }
  };
  const bass = (t, m, dur, g = 0.42) => {
    const i0 = Math.floor(t * SR);
    const f = mtof(m);
    for (let i = 0; i < dur * SR; i++) {
      const x = i / SR;
      const env = Math.min(1, x * 200) * Math.min(1, (dur - x) * 60);
      const v = g * env * (Math.sin(TAU * f * x) + 0.18 * Math.sin(TAU * 2 * f * x)) * pump(t + x);
      put(i0 + i, v, v);
    }
  };
  const riser = (t0, dur, g = 0.16) => {
    const i0 = Math.floor(t0 * SR);
    let lp = 0, ph = 0;
    for (let i = 0; i < dur * SR; i++) {
      const x = i / SR;
      const p = x / dur;
      const a = 1 - Math.exp((-TAU * (300 + 7000 * p * p)) / SR);
      lp += a * (rnd() - lp);
      ph += (TAU * (200 + 900 * p * p)) / SR;
      const v = g * p * p * (lp + 0.25 * Math.sin(ph));
      put(i0 + i, v, v * 0.95, 0.5);
    }
  };
  const impact = (t, g = 0.5) => {
    kick(t, 1);
    const i0 = Math.floor(t * SR);
    let lp = 0;
    for (let i = 0; i < 2.2 * SR; i++) {
      const x = i / SR;
      lp += 0.08 * (rnd() - lp);
      const v = g * (lp * 1.6 + 0.6 * Math.sin(TAU * 40 * x)) * Math.exp(-2.4 * x);
      put(i0 + i, v, v, 0.6);
    }
  };

  // ---- UI sound effects ----
  const blip = (t, f, d, g, rev = 0.15) => {
    const i0 = Math.floor(t * SR);
    for (let i = 0; i < d * SR; i++) {
      const x = i / SR;
      const v = g * Math.sin(TAU * f * x) * Math.exp((-6 / d) * x) * Math.min(1, x * 2000);
      put(i0 + i, v, v, rev);
    }
  };
  const tick = (t) => blip(t, 4200 + 400 * rnd(), 0.025, 0.07, 0.05);
  const click = (t) => {
    blip(t, 2400, 0.03, 0.2, 0.05);
    blip(t + 0.015, mtof(81), 0.45, 0.12, 0.4);
    blip(t + 0.015, mtof(88), 0.45, 0.07, 0.4);
  };
  const pop = (t, m) => blip(t, mtof(m), 0.18, 0.13, 0.3);
  const whoosh = (t, g = 0.09) => {
    const d = 0.4;
    const i0 = Math.floor((t - d) * SR);
    let lp = 0;
    for (let i = 0; i < d * SR; i++) {
      const p = i / (d * SR);
      const a = 1 - Math.exp((-TAU * (500 + 4500 * p)) / SR);
      lp += a * (rnd() - lp);
      const v = g * lp * Math.sin(Math.PI * Math.min(1, p * 1.1)) * 2;
      put(i0 + i, v * (1 - p * 0.6), v * (0.4 + p * 0.6), 0.3);
    }
  };
  const scribble = (t) => {
    const i0 = Math.floor(t * SR);
    let lp = 0;
    for (let i = 0; i < 0.32 * SR; i++) {
      const x = i / SR;
      lp += 0.3 * (rnd() - lp);
      const v = 0.08 * (rnd() - lp) * (0.5 + 0.5 * Math.sin(TAU * 18 * x));
      put(i0 + i, v, v);
    }
  };
  const ping = (t) => {
    blip(t, mtof(84), 0.6, 0.11, 0.5);
    blip(t + 0.12, mtof(91), 0.7, 0.09, 0.5);
  };

  // ---- arrangement ----
  const bars = Math.ceil(len / BAR);
  // kick positions first, so the sidechain pump is known before any layer renders
  for (let q = 0; q * BEAT < len - 1e-6; q++) {
    const t = q * BEAT;
    if (inDrop(t) || t >= plan.end) continue;
    if (section(t) === 'intro') {
      if (t >= plan.arpFrom && q % 2 === 0) kicks.push(t);
    } else kicks.push(t);
  }
  kicks.push(plan.end);
  kicks.sort((a, b) => a - b);
  for (let b = 0; b < bars; b++) {
    const t0 = b * BAR;
    if (t0 >= len) break;
    const ch = CHORDS[b % 4];
    const sec = section(t0);
    // pad: filtered in the intro, opening up towards the drop
    const cutoff = (t) => (t < plan.drop ? 500 + 1500 * clamp01(t / plan.drop) : sec === 'lift' ? 3200 : t >= plan.end ? 1400 : 2400);
    const padAmp = t0 >= plan.end ? 0.32 : sec === 'intro' ? 0.22 : 0.26;
    pad(t0, Math.min(BAR, len - t0), ch.notes, padAmp, cutoff);

    for (let k = 0; k < 16; k++) {
      const t = t0 + (k * BEAT) / 4;
      if (t >= len - 0.05 || t >= plan.end) continue;
      const beat = k % 4 === 0;
      const dropped = inDrop(t);
      // arpeggio
      const arpOn = sec === 'intro' ? t >= plan.arpFrom && k % 2 === 0 : true;
      if (arpOn && !(dropped && k % 2)) {
        const note = ch.notes[ARP[k]] + 12 + (sec === 'lift' && k % 4 === 3 ? 12 : 0);
        const g = sec === 'intro' ? 0.05 : 0.065;
        pluck(t, note, g, k % 2 ? 0.35 : -0.35, sec === 'intro' ? 1800 : 3600);
      }
      if (dropped) continue;
      if (sec === 'intro') {
        if (t >= plan.arpFrom && beat && (k === 0 || k === 8)) kick(t, 0.5);
        if (t >= plan.arpFrom && k % 4 === 2) hat(t, 0.035);
      } else {
        if (beat) kick(t);
        if (k === 4 || k === 12) clap(t);
        if (k % 2 === 0 && !beat) hat(t, 0.075);
        if (k % 4 === 2) hat(t, 0.05, k === 14);
        if (sec === 'lift' && k % 2 === 1) hat(t, 0.04);
        // bass: root on the beat, octave on the off-beat
        if (k % 2 === 0) bass(t, ch.root + (k % 4 === 2 ? 12 : 0), BEAT / 2 - 0.01);
      }
    }
  }
  plan.risers.forEach(([a, b]) => riser(a, b - a));
  impact(plan.drop, 0.35);
  impact(plan.end, 0.55);
  // final chord rings into the loop
  pad(plan.end, len - plan.end, CHORDS[0].notes.concat([62]), 0.3, 1600);

  // sound effects
  plan.words.forEach((t) => blip(t, mtof(86), 0.12, 0.06, 0.4));
  plan.ticks.forEach(([a, b, step]) => { for (let t = a; t < b - 1e-6; t += step) tick(t); });
  plan.clicks.forEach(click);
  plan.pops.forEach((t, i) => pop(t, [74, 77, 81, 86][i % 4]));
  plan.whooshes.forEach((t) => whoosh(t));
  plan.scribbles.forEach(scribble);
  plan.pings.forEach(ping);

  // ---- effects: dotted-eighth ping-pong delay, then a small plate-style reverb ----
  const dTime = Math.floor(BEAT * 0.75 * SR);
  for (let i = dTime; i < N; i++) {
    revL[i] += 0.25 * dlyR[i - dTime];
    revR[i] += 0.25 * dlyL[i - dTime];
    dlyL[i] += 0.38 * dlyR[i - dTime];
    dlyR[i] += 0.38 * dlyL[i - dTime];
    L[i] += 0.5 * dlyR[i - dTime];
    R[i] += 0.5 * dlyL[i - dTime];
  }
  const reverb = (inp, out, spread) => {
    const combs = [1557, 1617, 1491, 1422, 1277, 1356].map((d) => ({b: new Float32Array(d + spread), i: 0, lp: 0}));
    const aps = [556, 441, 341].map((d) => ({b: new Float32Array(d + spread), i: 0}));
    for (let n = 0; n < N; n++) {
      let s = 0;
      for (const c of combs) {
        const y = c.b[c.i];
        c.lp = y * 0.75 + c.lp * 0.25;
        c.b[c.i] = inp[n] * 0.5 + c.lp * 0.86;
        c.i = (c.i + 1) % c.b.length;
        s += y;
      }
      for (const a of aps) {
        const y = a.b[a.i];
        a.b[a.i] = s + y * 0.5;
        a.i = (a.i + 1) % a.b.length;
        s = y - s * 0.5;
      }
      out[n] += s * 0.09;
    }
  };
  reverb(revL, L, 0);
  reverb(revR, R, 23);

  // ---- master: gentle glue + soft clip, peak at -1 dBFS ----
  let peak = 0;
  for (let i = 0; i < N; i++) {
    L[i] = Math.tanh(L[i] * 0.9);
    R[i] = Math.tanh(R[i] * 0.9);
    peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  }
  // short fades so the loop point never clicks
  const fade = Math.floor(0.01 * SR);
  for (let i = 0; i < fade; i++) {
    const g = i / fade;
    L[N - 1 - i] *= g;
    R[N - 1 - i] *= g;
  }
  // loudness: aim for about -14 LUFS (social platforms), never above -1 dBFS peak
  const g = Math.min(0.89 / (peak || 1), MASTER);
  const buf = Buffer.alloc(44 + N * 4);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + N * 4, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4);
  }
  return buf;
}

writeFileSync(
  'public/soundtrack-60.wav',
  compose(60, {
    drop: 14,
    end: 58,
    arpFrom: 4, // arpeggio enters with the light UI world
    lift: [40, 50],
    dropouts: [[13.5, 14], [39.5, 40], [57.5, 58]],
    risers: [[10, 13.5], [36, 39.5]],
    words: [0, 1, 2, 2.5, 4, 6, 16, 24.5, 26, 28, 32, 40, 44, 55],
    ticks: [[10.5, 13.5, 0.125], [32.5, 34.5, 0.125]],
    clicks: [14, 35, 56.5],
    pops: [16.5, 17, 17.5, 18],
    whooshes: [14.25, 20, 22, 30, 40, 42, 44, 46],
    scribbles: [3],
    pings: [50],
  }),
);
writeFileSync(
  'public/soundtrack-15.wav',
  compose(15, {
    drop: 6,
    end: 14,
    arpFrom: 2,
    dropouts: [[5.5, 6], [13.5, 14]],
    risers: [[4, 5.5]],
    words: [0, 0.5, 2, 6.25, 8.25, 10.25, 12],
    ticks: [[4.25, 5.4, 0.125]],
    clicks: [6, 13],
    pops: [],
    whooshes: [6.25, 8.25, 10.25],
    scribbles: [1],
    pings: [],
  }),
);
console.log('soundtracks written');
