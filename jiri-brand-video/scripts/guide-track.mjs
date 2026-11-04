// Generates beat-locked GUIDE tracks so every cut can be checked against the grid.
// They are timing guides, not music: replace them with your licensed 120 BPM track.
// Usage: node scripts/guide-track.mjs  ->  public/guide-60.wav, public/guide-15.wav
import {writeFileSync} from 'node:fs';

const SR = 48000;
const BPM = 120;
const BEAT = 60 / BPM;

function render(len, plan) {
  const L = new Float32Array(Math.ceil(len * SR));
  const add = (t, fn, dur, gain = 1) => {
    const i0 = Math.floor(t * SR);
    const n = Math.floor(dur * SR);
    for (let i = 0; i < n && i0 + i < L.length; i++) L[i0 + i] += gain * fn(i / SR);
  };
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
  const kick = (t, g = 0.9) =>
    add(t, (x) => Math.sin(2 * Math.PI * (45 * x + (75 / 18) * (1 - Math.exp(-18 * x)))) * Math.exp(-9 * x), 0.35, g);
  const bass = (t, g = 0.35) => add(t, (x) => Math.sin(2 * Math.PI * 55 * x) * Math.min(1, x * 80) * Math.exp(-3 * x), BEAT, g);
  const hat = (t, g = 0.12) => add(t, () => rnd() * 0.6, 0.03, g);
  const tick = (t, g = 0.25) => add(t, (x) => Math.sin(2 * Math.PI * 3800 * x) * Math.exp(-120 * x), 0.04, g);
  const click = (t) => {
    add(t, (x) => rnd() * Math.exp(-200 * x), 0.03, 0.5);
    add(t + 0.02, (x) => Math.sin(2 * Math.PI * 1760 * x) * Math.exp(-14 * x), 0.4, 0.3);
  };
  const pop = (t) => add(t, (x) => Math.sin(2 * Math.PI * (600 + 900 * x) * x) * Math.exp(-30 * x), 0.15, 0.35);
  const whoosh = (t) => add(t, (x) => rnd() * Math.sin(Math.PI * Math.min(1, x / 0.35)), 0.35, 0.18);
  const scribble = (t) => add(t, (x) => rnd() * (0.5 + 0.5 * Math.sin(2 * Math.PI * 22 * x)), 0.3, 0.15);
  const ping = (t) => {
    add(t, (x) => Math.sin(2 * Math.PI * 1320 * x) * Math.exp(-8 * x), 0.5, 0.25);
    add(t + 0.12, (x) => Math.sin(2 * Math.PI * 1760 * x) * Math.exp(-8 * x), 0.5, 0.25);
  };
  const hit = (t) => {
    kick(t, 1);
    add(t, (x) => rnd() * Math.exp(-4 * x), 1.6, 0.25);
  };

  const inDrop = (t) => plan.dropouts.some(([a, b]) => t >= a - 1e-6 && t < b - 1e-6);
  for (let b = 0; b * BEAT < len - 1e-6; b++) {
    const t = b * BEAT;
    if (inDrop(t)) continue;
    if (t < plan.drop) {
      if (b % 2 === 0) kick(t, 0.55);
      hat(t + BEAT / 2, 0.06);
    } else if (t < plan.end) {
      kick(t);
      bass(t);
      hat(t + BEAT / 2);
      if (plan.lift && t >= plan.lift[0] && t < plan.lift[1]) {
        hat(t + BEAT / 4, 0.07);
        hat(t + (3 * BEAT) / 4, 0.07);
      }
    }
  }
  plan.ticks.forEach(([a, b, step]) => {
    for (let t = a; t < b - 1e-6; t += step) tick(t);
  });
  plan.words.forEach((t) => tick(t, 0.4));
  plan.clicks.forEach(click);
  plan.pops.forEach(pop);
  plan.whooshes.forEach((t) => whoosh(t - 0.3));
  plan.scribbles.forEach(scribble);
  plan.pings.forEach(ping);
  hit(plan.end);

  // normalise to -1 dBFS
  let peak = 0;
  for (const v of L) peak = Math.max(peak, Math.abs(v));
  const g = 0.89 / (peak || 1);
  const buf = Buffer.alloc(44 + L.length * 4);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + L.length * 4, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(L.length * 4, 40);
  for (let i = 0; i < L.length; i++) {
    const v = Math.max(-32768, Math.min(32767, Math.round(L[i] * g * 32767)));
    buf.writeInt16LE(v, 44 + i * 4);
    buf.writeInt16LE(v, 46 + i * 4);
  }
  return buf;
}

writeFileSync(
  'public/guide-60.wav',
  render(60, {
    drop: 14,
    end: 58,
    lift: [40, 50],
    dropouts: [[13.5, 14], [39.5, 40], [57.5, 58]],
    words: [0, 1, 2, 2.5, 4, 6, 16, 24.5, 26, 28, 32, 40, 44, 55],
    ticks: [[10.5, 13.5, 0.125], [32.5, 34.5, 0.125]],
    clicks: [14, 35, 56.5],
    pops: [16.5, 17, 17.5, 18],
    whooshes: [14.25, 20, 22, 30, 40, 42, 44, 46, 48],
    scribbles: [3],
    pings: [50],
  }),
);
writeFileSync(
  'public/guide-15.wav',
  render(15, {
    drop: 6,
    end: 14,
    dropouts: [[5.5, 6], [13.5, 14]],
    words: [0, 0.5, 2, 6.25, 8.25, 10.25, 12],
    ticks: [[4.25, 5.4, 0.125]],
    clicks: [6, 13],
    pops: [],
    whooshes: [6.25, 8.25, 10.25],
    scribbles: [1],
    pings: [],
  }),
);
console.log('guide tracks written');
