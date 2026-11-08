import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/900.css';
import '@fontsource/playfair-display/900.css';
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {prog} from '../anim';
import edl from './edl.json';

/* Version 2: the reference's text language.
   Giant red titles BEHIND the speaker (cutout on top), thin one-word-at-a-time captions,
   a blue serif name reveal, coloured accent words, flash transitions, a 3D wall of work. */

const FPS = 30;
const F = (sec: number) => Math.round(sec * FPS);
const RED = '#F01A10';
const BLUE = '#3D5CFF';
const NAVY = '#0A2463';
const HEAVY = "'Montserrat', 'Inter', sans-serif";
const THIN = "'Montserrat', 'Inter', sans-serif";
const SERIF = "'Playfair Display', Georgia, serif";
const W: Record<number, {w: string; s: number; e: number}> = Object.fromEntries(edl.words.map((w) => [w.i, w]));
const at = (i: number) => W[i].s;
export const V2_END = edl.duration;
export const V2_TOTAL = edl.duration + 2.4;

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['300 60px Montserrat', '500 60px Montserrat', '900 60px Montserrat', '900 60px "Playfair Display"'].map((x) => document.fonts.load(x)))
      .catch(() => undefined)
      .then(() => continueRender(h));
  }, [h]);
};

/* ---------- moments: flash transitions and section titles ---------- */
const FLASHES = [at(23) - 0.12, at(35) - 0.1, at(90) - 0.1, at(109) - 0.1, 39.4, 48.58, at(240) - 0.1, at(291) - 0.15, V2_END];

type Swap = {at: number; lines: string[]; color?: string};
const TITLES: {a: number; b: number; swaps: Swap[]}[] = [
  {a: 0, b: at(7) - 0.05, swaps: [{at: 0.05, lines: ['Will AI', 'take jobs?']}, {at: at(4), lines: ['Yes', 'or no?']}]},
  {a: at(37) - 0.05, b: at(47) + 0.9, swaps: [
    {at: at(37), lines: ['AI', 'images']}, {at: at(39), lines: ['AI', 'flyers']}, {at: at(43), lines: ['AI', 'content']}, {at: at(46), lines: ['AI', 'videos']},
  ]},
  {a: at(93) - 0.05, b: at(106) + 0.5, swaps: [
    {at: at(93), lines: ['10', 'hours']}, {at: at(95), lines: ['20', 'hours']}, {at: at(97), lines: ['Days']}, {at: at(102), lines: ['Just', 'minutes'], color: BLUE},
  ]},
  {a: at(115) - 0.05, b: at(118) + 1.2, swaps: [{at: at(115), lines: ['On your', 'thumbs']}]},
  {a: at(232) - 0.05, b: at(234) + 0.9, swaps: [{at: at(232), lines: ['Unimagin-', 'able']}, {at: at(234), lines: ['Unpredict-', 'able']}]},
  {a: at(236) - 0.05, b: at(239) + 0.5, swaps: [{at: at(236), lines: ['Jump on', 'it now']}]},
  {a: at(247) - 0.05, b: at(253) + 1.1, swaps: [{at: at(247), lines: ['Business']}, {at: at(250), lines: ['Brand']}, {at: at(253), lines: ['Project'], color: BLUE}]},
  {a: at(291) - 0.05, b: at(300) - 0.1, swaps: [{at: at(291), lines: ['Follow', 'for more']}]},
];

/* ---------- picture: styled background + optional cutout layer ---------- */
const Picture: React.FC<{layer: 'base' | 'cut'}> = ({layer}) => (
  <>
    {edl.segments.map((sg, k) => {
      const from = F(sg.at);
      const dur = F(sg.at + (sg.out - sg.in)) - from;
      const zoom = k % 3 === 1 ? 1.12 : k % 3 === 2 ? 1.06 : 1.0;
      return (
        <Sequence key={k} from={from} durationInFrames={dur}>
          <Shot layer={layer} startFrom={F(sg.in)} dur={dur} zoom={zoom} />
          {layer === 'base' && (
            <Audio
              src={staticFile('talk/voice.wav')}
              startFrom={F(sg.in)}
              endAt={F(sg.in) + dur}
              volume={(f) => interpolate(f, [0, 2, dur - 2, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
            />
          )}
        </Sequence>
      );
    })}
  </>
);

const Shot: React.FC<{layer: 'base' | 'cut'; startFrom: number; dur: number; zoom: number}> = ({layer, startFrom, dur, zoom}) => {
  const f = useCurrentFrame();
  const push = 1 + 0.035 * (f / Math.max(1, dur));
  const punch = 1 + 0.06 * (1 - prog(f, 0, 7)); // each cut lands with a small punch
  return (
    <AbsoluteFill style={{transform: `scale(${zoom * push * punch})`, transformOrigin: '50% 42%'}}>
      {layer === 'base' ? (
        <OffthreadVideo src={staticFile('talk/styled.mp4')} startFrom={startFrom} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      ) : (
        <OffthreadVideo src={staticFile('talk/cutout.webm')} startFrom={startFrom} muted transparent style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      )}
    </AbsoluteFill>
  );
};

/* ---------- giant title that sits behind the speaker ---------- */
const BigTitle: React.FC<{a: number; b: number; swaps: Swap[]}> = ({a, b, swaps}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (t < a || t > b + 0.3) return null;
  const cur = [...swaps].reverse().find((s) => t >= s.at - 0.02) ?? swaps[0];
  const since = f - F(cur.at);
  const p = prog(since, 0, 7);
  const out = 1 - prog(f, F(b), 7);
  const longest = Math.max(...cur.lines.map((l) => l.length));
  const size = Math.min(250, Math.floor(1010 / (longest * 0.66)));
  return (
    <div style={{position: 'absolute', top: 150, left: 34, right: 34, opacity: out, filter: `blur(${(1 - p) * 14}px)`, transform: `scale(${1.1 - 0.1 * p})`, transformOrigin: '50% 40%'}}>
      {cur.lines.map((l, i) => (
        <div key={i} style={{fontFamily: HEAVY, fontWeight: 900, fontSize: size, lineHeight: 0.92, letterSpacing: -size * 0.055, color: cur.color ?? RED, textAlign: 'center', whiteSpace: 'nowrap'}}>
          {l}
        </div>
      ))}
    </div>
  );
};

/* ---------- thin captions: each word fades in where it sits, the phrase builds up ---------- */
const ACCENT_RED = new Set(['hijack', 'jobs?', 'minutes', 'crush', 'thumbs', 'unimaginable', 'unpredictable.', 'jump', 'business,', 'brand,', 'project.', 'follow', 'amazing', 'beautiful', 'now.']);
const RED_LIGHT = '#FF4A3D';
const BLUE_LIGHT = '#7F98FF';
const accent = (w: string) => (/^ai[,.?]?$/i.test(w) ? BLUE_LIGHT : ACCENT_RED.has(w.toLowerCase()) ? RED_LIGHT : '#FFFFFF');
const accentWeight = (w: string) => (accent(w) === '#FFFFFF' ? 300 : 500);

const ThinCaptions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (t > V2_END) return null;
  const g = edl.groups.find((x) => t >= x.s - 0.05 && t < x.e + 0.25);
  if (!g) return null;
  const leave = 1 - prog(f, F(g.e + 0.12), 5);
  return (
    <div style={{position: 'absolute', top: 1455, left: 60, right: 60, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 26px', opacity: leave}}>
      {g.words.map((w) => {
        const p = prog(f, F(w.s - 0.04), 6);
        return (
          <span
            key={w.i}
            style={{
              fontFamily: THIN,
              fontWeight: accentWeight(w.w),
              fontSize: 70,
              lineHeight: 1.2,
              color: accent(w.w),
              opacity: p,
              filter: `blur(${(1 - p) * 10}px)`,
              transform: `translateY(${(1 - p) * 14}px)`,
              textShadow: '0 2px 16px rgba(0,0,0,.65)',
              letterSpacing: 0.5,
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- name reveal: "Hi  I'm" thin, then the name in a heavy blue serif ---------- */
const NameReveal: React.FC = () => {
  const f = useCurrentFrame();
  const a = F(at(23));
  const b = F(at(35)) - 2;
  if (f < a || f > b + 8) return null;
  const out = 1 - prog(f, b, 8);
  const hi = prog(f, a, 8);
  const im = prog(f, F(at(25)), 8);
  const nm = prog(f, F(at(26)), 10);
  const role = prog(f, F(at(32)), 10);
  return (
    <div style={{position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center', opacity: out}}>
      <div style={{fontFamily: THIN, fontWeight: 300, fontSize: 72, color: '#fff', display: 'flex', justifyContent: 'center', gap: 70, textShadow: '0 2px 16px rgba(0,0,0,.6)'}}>
        <span style={{opacity: hi, filter: `blur(${(1 - hi) * 10}px)`}}>Hi</span>
        <span style={{opacity: im, filter: `blur(${(1 - im) * 10}px)`}}>I'm</span>
      </div>
      <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 260, lineHeight: 0.95, color: BLUE, letterSpacing: -6, opacity: nm, filter: `blur(${(1 - nm) * 18}px)`, transform: `scale(${1.08 - 0.08 * nm})`, textShadow: '0 10px 40px rgba(20,40,160,.45)'}}>
        Jire
      </div>
      <div style={{fontFamily: THIN, fontWeight: 300, fontSize: 52, color: '#fff', marginTop: 6, opacity: role, letterSpacing: 2, textShadow: '0 2px 16px rgba(0,0,0,.6)'}}>
        <span style={{color: BLUE}}>AI</span> content creator
      </div>
    </div>
  );
};

/* ---------- 3D wall of the work, then the work in a rounded card ---------- */
const TILES: {src: string; start: number}[] = [
  {src: 'talk/broll/brand-ui.mp4', start: 0},
  {src: 'clips/outfits.mp4', start: 9.0},
  {src: 'talk/broll/wakeup.mp4', start: 0.5},
  {src: 'clips/studio.mp4', start: 4.0},
  {src: 'clips/stream.mp4', start: 0},
  {src: 'clips/phone.mp4', start: 2.0},
  {src: 'clips/outfits.mp4', start: 0.5},
  {src: 'clips/studio.mp4', start: 9.5},
  {src: 'clips/stream.mp4', start: 4.0},
];
const Backdrop: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 60% at 30% 20%, #1C3C78 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 80% 80%, #142E63 0%, transparent 60%), #071027`}} />
);
const Wall: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 12);
  const drift = interpolate(f, [0, dur], [0, -220]);
  return (
    <AbsoluteFill style={{opacity: 1 - prog(f, dur - 6, 6)}}>
      <Backdrop />
      <AbsoluteFill style={{perspective: 1700}}>
        <div
          style={{
            position: 'absolute',
            left: -260,
            top: 120 + drift,
            width: 1600,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 40,
            transform: `rotateX(${24 - 6 * p}deg) rotateY(-18deg) rotateZ(10deg) scale(${0.85 + 0.15 * p})`,
            transformStyle: 'preserve-3d',
          }}
        >
          {TILES.map((tl, i) => (
            <div key={i} style={{aspectRatio: '4/5', borderRadius: 28, overflow: 'hidden', boxShadow: '0 40px 80px -30px rgba(0,0,0,.8)', opacity: prog(f, i * 2, 10)}}>
              <OffthreadVideo src={staticFile(tl.src)} startFrom={F(tl.start)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Card: React.FC<{src: string; start: number; dur: number}> = ({src, start, dur}) => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 10);
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{position: 'absolute', left: 90, top: 330, width: 900, height: 1125, borderRadius: 40, overflow: 'hidden', boxShadow: '0 50px 100px -30px rgba(0,0,0,.85)', transform: `scale(${0.9 + 0.1 * p + 0.04 * (f / dur)})`, opacity: p}}>
        <OffthreadVideo src={staticFile(src)} startFrom={F(start)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- white flash transition ---------- */
const Flash: React.FC = () => {
  const f = useCurrentFrame();
  let o = 0;
  for (const t of FLASHES) {
    const d = f - F(t);
    if (d >= -2 && d <= 7) o = Math.max(o, d < 0 ? (d + 3) / 3 : 1 - d / 8);
  }
  return o > 0 ? <AbsoluteFill style={{background: '#fff', opacity: 0.92 * o}} /> : null;
};

/* ---------- follow + end card ---------- */
const Handle: React.FC = () => {
  const f = useCurrentFrame();
  const a = F(at(292));
  const b = F(at(300)) + 20;
  if (f < a || f > b + 8) return null;
  const p = prog(f, a, 10);
  return (
    <div style={{position: 'absolute', top: 1600, left: 0, right: 0, textAlign: 'center', opacity: p * (1 - prog(f, b, 8)), filter: `blur(${(1 - p) * 12}px)`}}>
      <span style={{fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: BLUE_LIGHT, letterSpacing: -3, textShadow: '0 10px 40px rgba(0,0,0,.55)'}}>@jire_ai</span>
    </div>
  );
};
const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 14);
  return (
    <AbsoluteFill style={{background: '#050B1E', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <Backdrop />
      <div style={{position: 'relative', textAlign: 'center'}}>
        <div style={{fontFamily: THIN, fontWeight: 300, fontSize: 64, color: '#fff', opacity: p, letterSpacing: 2}}>follow</div>
        <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 210, color: BLUE, letterSpacing: -5, lineHeight: 1, opacity: prog(f, 4, 12), filter: `blur(${(1 - prog(f, 4, 12)) * 16}px)`}}>jire_ai</div>
        <div style={{fontFamily: THIN, fontWeight: 300, fontSize: 50, color: '#fff', marginTop: 24, opacity: prog(f, 12, 12)}}>
          <span style={{color: RED}}>AI</span> videos · photo shoots · flyers
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TalkingHeadV2: React.FC = () => {
  useFonts();
  const wallA = 39.4;
  const wallB = at(185);
  const mid = at(192);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Picture layer="base" />
      {TITLES.map((tt, i) => (
        <BigTitle key={i} {...tt} />
      ))}
      <Picture layer="cut" />
      <Sequence from={F(wallA)} durationInFrames={F(wallB) - F(wallA)}>
        <Wall dur={F(wallB) - F(wallA)} />
      </Sequence>
      <Sequence from={F(wallB)} durationInFrames={F(mid) - F(wallB)}>
        <Card src="clips/studio.mp4" start={4.0} dur={F(mid) - F(wallB)} />
      </Sequence>
      <Sequence from={F(mid)} durationInFrames={F(48.58) - F(mid)}>
        <Card src="clips/stream.mp4" start={0.5} dur={F(48.58) - F(mid)} />
      </Sequence>
      <NameReveal />
      <Handle />
      <ThinCaptions />
      <Sequence from={F(V2_END)} durationInFrames={F(V2_TOTAL) - F(V2_END)}>
        <EndCard />
      </Sequence>
      <Flash />
      <Audio src={staticFile('talk/music-bed.wav')} volume={0.34} />
      <Audio src={staticFile('talk/sfx-v2.wav')} volume={0.85} />
    </AbsoluteFill>
  );
};
