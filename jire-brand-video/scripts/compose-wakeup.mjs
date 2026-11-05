// Original sound for the 10 s "wake-up call" end card.
// Night (Dm9) with two bell strikes on "wake-up call", a swell into dawn at 2.6 s (Bbmaj9),
// then a warm resolve (Fmaj9) with a gentle plucked arpeggio under the verse.
// Usage: node scripts/compose-wakeup.mjs -> public/wakeup-sound.wav
import {writeFileSync} from 'node:fs';

const SR = 48000;
const LEN = 10;
const N = LEN * SR;
const TAU = Math.PI * 2;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const MASTER = Number(process.env.MASTER ?? 1.25);

const L = new Float32Array(N), R = new Float32Array(N), revL = new Float32Array(N), revR = new Float32Array(N);
let seed = 5;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const put = (i, l, r, rev = 0) => {
  if (i < 0 || i >= N) return;
  L[i] += l; R[i] += r; revL[i] += l * rev; revR[i] += r * rev;
};

const pad = (t0, dur, notes, amp, fc, attack = 0.6, release = 1.2) => {
  const i0 = Math.floor(t0 * SR);
  const voices = [];
  let ps = 1;
  notes.forEach((m) => [-0.1, 0, 0.09].forEach((det) => voices.push({f: mtof(m + det), p: (ps = (ps * 9301 + 49297) % 233280) / 233280})));
  let l1 = 0, l2 = 0, r1 = 0, r2 = 0;
  const a = 1 - Math.exp((-TAU * fc) / SR);
  for (let i = 0; i < (dur + release) * SR; i++) {
    const x = i / SR;
    const env = Math.min(1, x / attack) * (x > dur ? Math.max(0, 1 - (x - dur) / release) : 1);
    let sl = 0, sr = 0;
    voices.forEach((v, k) => {
      const s = 2 * ((v.p + v.f * x) % 1) - 1;
      if (k % 2) sl += s; else sr += s;
    });
    l1 += a * (sl - l1); l2 += a * (l1 - l2);
    r1 += a * (sr - r1); r2 += a * (r1 - r2);
    const g = (amp * env * 2) / voices.length;
    put(i0 + i, l2 * g, r2 * g, 0.5);
  }
};
const bell = (t, m, g) => {
  const i0 = Math.floor(t * SR);
  const f = mtof(m);
  const partials = [[1, 1, 1.4], [2.0, 0.5, 2.2], [2.76, 0.35, 3], [5.4, 0.2, 5], [8.93, 0.1, 7]];
  for (let i = 0; i < 3.5 * SR; i++) {
    const x = i / SR;
    let v = 0;
    for (const [ratio, amp, dec] of partials) v += amp * Math.sin(TAU * f * ratio * x) * Math.exp(-dec * x);
    v *= g * Math.min(1, x * 3000);
    put(i0 + i, v * 0.9, v, 0.6);
  }
};
const pluck = (t, m, g, pan) => {
  const i0 = Math.floor(t * SR);
  const f = mtof(m);
  for (let i = 0; i < 1.6 * SR; i++) {
    const x = i / SR;
    const v = g * (Math.sin(TAU * f * x) + 0.3 * Math.sin(TAU * 2 * f * x) * Math.exp(-6 * x)) * Math.exp(-3.2 * x) * Math.min(1, x * 500);
    put(i0 + i, v * (1 - pan), v * (1 + pan), 0.55);
  }
};
const swell = (t0, dur, g) => {
  const i0 = Math.floor(t0 * SR);
  let lp = 0;
  for (let i = 0; i < dur * SR; i++) {
    const p = i / (dur * SR);
    const a = 1 - Math.exp((-TAU * (400 + 6000 * p * p)) / SR);
    lp += a * (rnd() - lp);
    const v = g * p * p * lp;
    put(i0 + i, v, v, 0.6);
  }
};
const bloom = (t, g) => {
  const i0 = Math.floor(t * SR);
  let lp = 0;
  for (let i = 0; i < 3 * SR; i++) {
    const x = i / SR;
    lp += 0.04 * (rnd() - lp);
    const v = g * (0.8 * Math.sin(TAU * 49 * x) * Math.exp(-2.2 * x) + 1.2 * lp * Math.exp(-1.5 * x));
    put(i0 + i, v, v, 0.7);
  }
};

// harmony
pad(0, 2.6, [50, 53, 57, 60, 64], 0.2, 700, 0.4, 1.0); // Dm9, night
pad(2.6, 2.6, [46, 50, 53, 57, 60, 65], 0.28, 1600, 0.8, 1.2); // Bbmaj9, dawn
pad(5.2, 4.6, [41, 53, 57, 60, 64, 67], 0.3, 2200, 0.6, 0.8); // Fmaj9, morning
// sub notes
pad(2.6, 2.6, [34], 0.12, 200, 0.3, 0.8);
pad(5.2, 4.6, [29], 0.12, 200, 0.3, 0.8);

// the wake-up bells on "wake-up call."
bell(0.9, 81, 0.16);
bell(1.5, 88, 0.12);
// swell into dawn, then a soft bloom
swell(1.8, 0.8, 0.12);
bloom(2.6, 0.22);
// gentle arpeggio under the verse (two notes a beat at 92 BPM)
const arp = [65, 69, 72, 76, 79, 76, 72, 69];
const step = 60 / 92 / 2;
for (let k = 0; 5.25 + k * step < 9.3; k++) pluck(5.25 + k * step, arp[k % arp.length], 0.07, k % 2 ? 0.3 : -0.3);
bell(5.3, 77, 0.07);

// reverb
const reverb = (inp, out, spread) => {
  const combs = [1557, 1617, 1491, 1422, 1277, 1356].map((d) => ({b: new Float32Array(d + spread), i: 0, lp: 0}));
  const aps = [556, 441, 341].map((d) => ({b: new Float32Array(d + spread), i: 0}));
  for (let n = 0; n < N; n++) {
    let s = 0;
    for (const c of combs) {
      const y = c.b[c.i];
      c.lp = y * 0.7 + c.lp * 0.3;
      c.b[c.i] = inp[n] * 0.5 + c.lp * 0.88;
      c.i = (c.i + 1) % c.b.length;
      s += y;
    }
    for (const a of aps) {
      const y = a.b[a.i];
      a.b[a.i] = s + y * 0.5;
      a.i = (a.i + 1) % a.b.length;
      s = y - s * 0.5;
    }
    out[n] += s * 0.1;
  }
};
reverb(revL, L, 0);
reverb(revR, R, 23);

// master: soft clip, fade the last 0.6 s, write 16-bit stereo
let peak = 0;
for (let i = 0; i < N; i++) {
  const fade = Math.min(1, (N - i) / (0.6 * SR));
  L[i] = Math.tanh(L[i]) * fade;
  R[i] = Math.tanh(R[i]) * fade;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const g = Math.min(0.89 / (peak || 1), MASTER);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4);
}
writeFileSync('public/wakeup-sound.wav', buf);
console.log('wakeup sound written');
