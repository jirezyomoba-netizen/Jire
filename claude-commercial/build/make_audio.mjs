// Sound effects and room tone for the 60 s edit, synthesised from spec.json. No music.
// Writes three 60 s stereo WAVs: sfx-only, ambience-only, and both mixed.
import {readFileSync, writeFileSync} from 'node:fs';
const spec = JSON.parse(readFileSync('spec.json', 'utf8'));
const SR = 48000, LEN = 60, N = SR * LEN, TAU = Math.PI * 2;
let seed = 3;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const db = (d) => Math.pow(10, d / 20);
const mk = () => [new Float32Array(N), new Float32Array(N)];
const put = (buf, i, v, pan) => { if (i >= 0 && i < N) { buf[0][i] += v * Math.min(1, 1 - pan); buf[1][i] += v * Math.min(1, 1 + pan); } };

// each generator returns a mono Float32Array peaking near 1
const gen = {
  noise(len, shape, lpHz, hpHz = 0) {
    const n = Math.floor(len * SR), o = new Float32Array(n); let lp = 0, hp = 0;
    const a = 1 - Math.exp(-TAU * lpHz / SR), b = 1 - Math.exp(-TAU * (hpHz || 1) / SR);
    for (let i = 0; i < n; i++) { lp += a * (rnd() - lp); hp += b * (lp - hp); o[i] = (hpHz ? lp - hp : lp) * shape(i / n, i / SR); }
    return o;
  },
  paper: (l) => gen.noise(l, (p) => Math.sin(Math.PI * p) ** 2 * (0.7 + 0.3 * Math.sin(p * 40)), 7000, 1500),
  buzz(l) { const n = Math.floor(l * SR), o = new Float32Array(n); for (let i = 0; i < n; i++) { const x = i / SR; const gate = (x % 0.3) < 0.22 ? 1 : 0; o[i] = gate * (Math.sign(Math.sin(TAU * 165 * x)) * 0.35 + Math.sin(TAU * 82 * x) * 0.6) * Math.min(1, (l - x) * 30); } return o; },
  ping(l) { const n = Math.floor(0.5 * SR), o = new Float32Array(n); for (let i = 0; i < n; i++) { const x = i / SR; o[i] = (Math.sin(TAU * 1568 * x) + 0.4 * Math.sin(TAU * 3136 * x)) * Math.exp(-14 * x) * Math.min(1, x * 2000) * 0.7; } return o; },
  exhale: (l) => gen.noise(l, (p) => Math.sin(Math.PI * Math.min(1, p * 1.4)) * (1 - p), 1800, 300),
  creak(l) { const n = Math.floor(l * SR), o = new Float32Array(n); let ph = 0; for (let i = 0; i < n; i++) { const p = i / n; ph += TAU * (140 + 60 * Math.sin(p * 9)) / SR; o[i] = Math.sign(Math.sin(ph)) * 0.25 * Math.sin(Math.PI * p) * (0.5 + 0.5 * Math.sin(p * 70)); } return gen.smooth(o, 1200); },
  smooth(o, hz) { let lp = 0; const a = 1 - Math.exp(-TAU * hz / SR); for (let i = 0; i < o.length; i++) { lp += a * (o[i] - lp); o[i] = lp; } return o; },
  whoosh: (l) => { const n = Math.floor(l * SR), o = new Float32Array(n); let lp = 0; for (let i = 0; i < n; i++) { const p = i / n; const a = 1 - Math.exp(-TAU * (400 + 5000 * p) / SR); lp += a * (rnd() - lp); o[i] = lp * Math.sin(Math.PI * p) * 1.6; } return o; },
  air: (l) => gen.noise(l, (p) => Math.sin(Math.PI * p) ** 2, 2500, 400),
  swish: (l) => gen.noise(l, (p) => Math.sin(Math.PI * p) ** 2, 6000, 1200),
  key() { const n = Math.floor(0.05 * SR), o = new Float32Array(n); const f = 1800 + 900 * Math.abs(rnd()); for (let i = 0; i < n; i++) { const x = i / SR; o[i] = (rnd() * 0.6 + Math.sin(TAU * f * x) * 0.4) * Math.exp(-110 * x); } return o; },
  keys(l, rate) { const n = Math.floor(l * SR), o = new Float32Array(n); let t = 0; while (t < l - 0.05) { const k = gen.key(), g = 0.6 + 0.4 * Math.abs(rnd()), i0 = Math.floor(t * SR); for (let i = 0; i < k.length && i0 + i < n; i++) o[i0 + i] += k[i] * g; t += (1 / rate) * (0.6 + 0.8 * Math.abs(rnd())); } return o; },
  typing: (l) => gen.keys(l, 7), typing_fast: (l) => gen.keys(l, 13), textrun: (l) => gen.keys(l, 18).map((v, i, a) => v * 0.6 * (1 - i / a.length)),
  tick: () => gen.keys(0.3, 9), scroll: (l) => gen.keys(l, 6).map((v) => v * 0.7),
  click() { const n = Math.floor(0.08 * SR), o = new Float32Array(n); for (let i = 0; i < n; i++) { const x = i / SR; o[i] = (rnd() * Math.exp(-300 * x) + Math.sin(TAU * 2400 * x) * Math.exp(-90 * x) * 0.5); } return o; },
  tap() { const n = Math.floor(0.15 * SR), o = new Float32Array(n); for (let i = 0; i < n; i++) { const x = i / SR; o[i] = Math.sin(TAU * 220 * x) * Math.exp(-45 * x) + rnd() * Math.exp(-250 * x) * 0.5; } return o; },
  pop() { const n = Math.floor(0.15 * SR), o = new Float32Array(n); for (let i = 0; i < n; i++) { const x = i / SR; o[i] = Math.sin(TAU * (500 + 2200 * x) * x) * Math.exp(-32 * x); } return o; },
  pen: (l) => gen.noise(l, (p, x) => (0.35 + 0.65 * Math.abs(Math.sin(TAU * 5.5 * x))) * Math.min(1, p * 20) * Math.min(1, (1 - p) * 20), 5200, 1800),
  impact() { const n = Math.floor(0.9 * SR), o = new Float32Array(n); let lp = 0; for (let i = 0; i < n; i++) { const x = i / SR; lp += 0.05 * (rnd() - lp); o[i] = Math.sin(TAU * (48 * x + 3 * (1 - Math.exp(-20 * x)))) * Math.exp(-6 * x) + lp * Math.exp(-5 * x) * 1.2; } return o; },
  confirm() { const n = Math.floor(0.9 * SR), o = new Float32Array(n); [[0, 880], [0.14, 1318.5]].forEach(([d, f]) => { const i0 = Math.floor(d * SR); for (let i = 0; i0 + i < n; i++) { const x = i / SR; o[i0 + i] += Math.sin(TAU * f * x) * Math.exp(-7 * x) * Math.min(1, x * 400) * 0.5; } }); return o; },
};

const sfx = mk();
for (const [t, type, len, d, pan] of spec.sfx) {
  const s = gen[type](len); let pk = 0; for (const v of s) pk = Math.max(pk, Math.abs(v));
  const g = db(d) / (pk || 1), i0 = Math.floor(t * SR), sweep = type === 'whoosh';
  for (let i = 0; i < s.length; i++) put(sfx, i0 + i, s[i] * g, sweep ? -0.6 + 1.2 * (i / s.length) : pan);
}

// room tone: shaped noise per time of day, slow level drift, crossfaded
const amb = mk();
const tones = { dusk: [500, 60, 0.0], night: [260, 50, 0.0], morning: [900, 80, 1.0] };
for (const A of spec.amb) {
  const [a, b] = A.tl, n = Math.floor((b - a) * SR), i0 = Math.floor(a * SR), [lpHz, hpHz, birds] = tones[A.type];
  for (let ch = 0; ch < 2; ch++) {
    let lp = 0, hp = 0, rms = 0; const tmp = new Float32Array(n);
    const ka = 1 - Math.exp(-TAU * lpHz / SR), kb = 1 - Math.exp(-TAU * hpHz / SR);
    for (let i = 0; i < n; i++) { lp += ka * (rnd() - lp); hp += kb * (lp - hp); const x = i / SR;
      let v = (lp - hp) * (0.85 + 0.15 * Math.sin(TAU * 0.11 * x + ch));
      if (A.type === 'night') v += Math.sin(TAU * 100 * x) * 0.012 + Math.sin(TAU * 200 * x) * 0.006; // air-conditioning hum
      tmp[i] = v; rms += v * v; }
    rms = Math.sqrt(rms / n);
    for (let i = 0; i < n; i++) { const x = i / SR, fade = Math.min(1, x / 0.5, (b - a - x) / 0.5); amb[ch][i0 + i] += tmp[i] / rms * db(A.db) * Math.max(0, fade); }
  }
  if (birds) for (let t = a + 1.5; t < b - 2; t += 2.5 + 3 * Math.abs(rnd())) { // faint, distant chirps
    const pan = rnd() * 0.8, f0 = 2600 + 900 * Math.abs(rnd()), reps = 2 + Math.floor(Math.abs(rnd()) * 3);
    for (let r = 0; r < reps; r++) { const i1 = Math.floor((t + r * 0.13) * SR); for (let i = 0; i < 0.09 * SR; i++) { const x = i / SR; put(amb, i1 + i, Math.sin(TAU * (f0 + 5000 * x) * x) * Math.sin(Math.PI * x / 0.09) * db(-44), pan); } }
  }
}
for (let i = Math.floor(59.2 * SR); i < N; i++) { const g = Math.max(0, (N - i) / (0.8 * SR)); amb[0][i] *= g; amb[1][i] *= g; }

const write = (path, bufs) => {
  const out = Buffer.alloc(44 + N * 4);
  out.write('RIFF', 0); out.writeUInt32LE(36 + N * 4, 4); out.write('WAVEfmt ', 8); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22);
  out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34); out.write('data', 36); out.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) for (let c = 0; c < 2; c++) { let v = 0; for (const b of bufs) v += b[c][i]; out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), 44 + i * 4 + c * 2); }
  writeFileSync(path, out);
};
const K = '../capcut-kit/3-audio/';
write(K + 'sfx-only-60s.wav', [sfx]); write(K + 'ambience-only-60s.wav', [amb]); write(K + 'sfx-and-ambience-60s.wav', [sfx, amb]);
console.log('audio written');
