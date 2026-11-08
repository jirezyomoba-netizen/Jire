import React from 'react';
import {AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {prog} from '../anim';
import edl from './edl.json';

/* Talking-head edit: jump cuts with punch-ins, word-by-word captions, graphics, B-roll, music bed. */

const FPS = 30;
const F = (sec: number) => Math.round(sec * FPS);
const NAVY = '#0A2463';
const GLOW = '#3D5A9E';
const FONT = "Inter, 'Inter Display', system-ui, sans-serif";
const W: Record<number, {w: string; s: number; e: number}> = Object.fromEntries(edl.words.map((w) => [w.i, w]));
const at = (i: number) => W[i].s; // when word i is spoken, on the edited timeline
export const TALK_END = edl.duration;
export const TALK_TOTAL = edl.duration + 2.2; // plus the end card

/* ---------- the speaker: one sequence per cut, alternating punch-ins ---------- */
const Cuts: React.FC = () => (
  <>
    {edl.segments.map((sg, k) => {
      const from = F(sg.at);
      const dur = F(sg.at + (sg.out - sg.in)) - from;
      const zoom = k % 3 === 1 ? 1.12 : k % 3 === 2 ? 1.06 : 1.0;
      return (
        <Sequence key={k} from={from} durationInFrames={dur}>
          <Speaker src={staticFile('talk/graded.mp4')} startFrom={F(sg.in)} dur={dur} zoom={zoom} />
          <Audio
            src={staticFile('talk/voice.wav')}
            startFrom={F(sg.in)}
            endAt={F(sg.in) + dur}
            volume={(f) => interpolate(f, [0, 2, dur - 2, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
          />
        </Sequence>
      );
    })}
  </>
);

const Speaker: React.FC<{src: string; startFrom: number; dur: number; zoom: number}> = ({src, startFrom, dur, zoom}) => {
  const f = useCurrentFrame();
  const push = 1 + 0.03 * (f / Math.max(1, dur)); // slow push within each cut
  return (
    <AbsoluteFill style={{transform: `scale(${zoom * push})`, transformOrigin: '50% 42%'}}>
      <OffthreadVideo src={src} startFrom={startFrom} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </AbsoluteFill>
  );
};

/* ---------- B-roll of the work, full screen, voice continues ---------- */
const BROLL: {a: number; b: number; src: string; start: number; label: string}[] = [
  {a: at(154), b: at(161), src: 'talk/broll/brand-ui.mp4', start: 0, label: 'Brand promo'},
  {a: at(161), b: at(165), src: 'talk/broll/wakeup.mp4', start: 0, label: 'Animated end card'},
  {a: at(165), b: at(185), src: 'clips/outfits.mp4', start: 9.0, label: 'AI photo & video'},
  {a: at(185), b: at(192), src: 'clips/studio.mp4', start: 4.0, label: 'AI studio shoot'},
  {a: at(192), b: 48.58, src: 'clips/stream.mp4', start: 0.5, label: 'AI cinematic scene'},
];
const Broll: React.FC = () => (
  <>
    {BROLL.map((c, k) => (
      <Sequence key={k} from={F(c.a)} durationInFrames={F(c.b) - F(c.a)}>
        <BrollShot {...c} first={k === 0} last={k === BROLL.length - 1} dur={F(c.b) - F(c.a)} />
      </Sequence>
    ))}
  </>
);
const BrollShot: React.FC<{src: string; start: number; label: string; first: boolean; last: boolean; dur: number}> = ({src, start, label, first, last, dur}) => {
  const f = useCurrentFrame();
  const inP = first ? prog(f, 0, 8) : 1;
  const outP = last ? 1 - prog(f, dur - 8, 8) : 1;
  const scale = 1.06 - 0.06 * (f / dur);
  return (
    <AbsoluteFill style={{opacity: inP * outP, background: '#05091A'}}>
      <AbsoluteFill style={{transform: `scale(${scale})`, filter: `blur(${(1 - inP) * 20}px)`}}>
        <OffthreadVideo src={staticFile(src)} startFrom={F(start)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <span style={{fontFamily: FONT, fontWeight: 700, fontSize: 40, color: '#fff', background: 'rgba(10,36,99,.85)', padding: '14px 26px', borderRadius: 999, transform: `translateY(${(1 - prog(f, 0, 10)) * -30}px)`, opacity: prog(f, 0, 10)}}>
          {label}
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- graphics ---------- */
const Chip: React.FC<{text: string; at: number; out: number; strike?: number; hero?: boolean}> = ({text, at: a, out, strike, hero}) => {
  const f = useCurrentFrame();
  const p = prog(f, F(a), 10);
  const o = 1 - prog(f, F(out), 8);
  if (f < F(a) || o <= 0) return null;
  const s = strike !== undefined ? prog(f, F(strike), 8) : 0;
  return (
    <span
      style={{
        position: 'relative',
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: hero ? 64 : 46,
        color: hero ? '#fff' : NAVY,
        background: hero ? GLOW : 'rgba(255,255,255,.95)',
        padding: hero ? '18px 34px' : '14px 26px',
        borderRadius: 999,
        boxShadow: '0 16px 40px -16px rgba(0,0,0,.5)',
        opacity: p * o * (1 - 0.45 * s),
        transform: `scale(${0.6 + 0.4 * p + (hero ? 0.08 * Math.sin(Math.min(1, (f - F(a)) / 10) * Math.PI) : 0)})`,
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
      {s > 0 && <span style={{position: 'absolute', left: '12%', right: `${12 + (1 - s) * 76}%`, top: '50%', height: 6, background: '#E5484D', borderRadius: 3}} />}
    </span>
  );
};
const Row: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 170}) => (
  <div style={{position: 'absolute', top, left: 40, right: 40, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18}}>{children}</div>
);

const NameCard: React.FC = () => {
  const f = useCurrentFrame();
  const a = F(at(25));
  const b = F(at(35)) - 4;
  if (f < a || f > b + 10) return null;
  const p = prog(f, a, 14);
  const o = 1 - prog(f, b, 10);
  return (
    <div style={{position: 'absolute', top: 160, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: p * o, transform: `translateY(${(1 - p) * -40}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(255,255,255,.96)', borderRadius: 999, padding: '16px 34px 16px 16px', boxShadow: '0 20px 50px -20px rgba(0,0,0,.5)'}}>
        <div style={{width: 84, height: 84, borderRadius: '50%', background: NAVY, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 44}}>J</div>
        <div style={{fontFamily: FONT}}>
          <div style={{fontWeight: 800, fontSize: 44, color: '#0B1430', lineHeight: 1.05}}>Jire</div>
          <div style={{fontWeight: 600, fontSize: 30, color: GLOW}}>AI content creator · @jire_ai</div>
        </div>
      </div>
    </div>
  );
};

const FollowCard: React.FC = () => {
  const f = useCurrentFrame();
  const a = F(at(291)) - 6;
  const click = F(at(291)) + 18;
  const b = F(at(300)) + 30;
  if (f < a || f > b + 10) return null;
  const p = prog(f, a, 12);
  const o = 1 - prog(f, b, 10);
  const done = f >= click;
  const press = f >= click && f < click + 6 ? 0.92 : 1;
  return (
    <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: p * o, transform: `translateY(${(1 - p) * -40}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(255,255,255,.97)', borderRadius: 999, padding: '14px 14px 14px 16px', boxShadow: '0 20px 50px -20px rgba(0,0,0,.5)'}}>
        <div style={{width: 80, height: 80, borderRadius: '50%', background: NAVY, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 42}}>J</div>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 42, color: '#0B1430'}}>@jire_ai</div>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 36, color: done ? NAVY : '#fff', background: done ? '#fff' : NAVY, border: `4px solid ${NAVY}`, borderRadius: 999, padding: '14px 30px', transform: `scale(${press})`}}>
          {done ? 'Following' : 'Follow'}
        </div>
      </div>
    </div>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 16);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 50% at 50% 110%, ${GLOW}cc 0%, ${NAVY} 45%, #040817 85%)`, opacity: p, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24, fontFamily: FONT}}>
      <div style={{width: 170, height: 170, borderRadius: '50%', background: '#fff', color: NAVY, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 90, transform: `scale(${0.7 + 0.3 * p})`}}>J</div>
      <div style={{color: '#fff', fontWeight: 800, fontSize: 110, letterSpacing: -3, filter: `blur(${(1 - p) * 12}px)`}}>@jire_ai</div>
      <div style={{color: '#C9D6FF', fontWeight: 600, fontSize: 44, opacity: prog(f, 10, 14)}}>AI videos · photo shoots · flyers</div>
      <div style={{marginTop: 30, color: NAVY, background: '#fff', fontWeight: 800, fontSize: 42, borderRadius: 999, padding: '20px 44px', opacity: prog(f, 18, 14)}}>Follow for AI tips</div>
    </AbsoluteFill>
  );
};

/* ---------- captions: 1–4 words at a time, the spoken word highlighted ---------- */
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const g = edl.groups.find((x) => t >= x.s - 0.05 && t < x.e + 0.15);
  if (!g || t > TALK_END) return null;
  const pop = prog(f, F(g.s - 0.05), 5);
  // exactly one highlighted word: the last one that has started
  const active = [...g.words].reverse().find((w) => t >= w.s - 0.02)?.i;
  return (
    <div style={{position: 'absolute', top: 1270, left: 50, right: 50, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 18px', transform: `scale(${0.92 + 0.08 * pop})`}}>
      {g.words.map((w) => {
        const on = w.i === active;
        return (
          <span
            key={w.i}
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 82,
              lineHeight: 1.15,
              color: on ? '#fff' : '#fff',
              background: on ? GLOW : 'transparent',
              borderRadius: 18,
              padding: '0 14px',
              textShadow: on ? 'none' : '0 6px 18px rgba(0,0,0,.55)',
              WebkitTextStroke: on ? '0' : '12px #0B1430',
              paintOrder: 'stroke fill',
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

export const TalkingHead: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Cuts />
    <Broll />
    {/* what Jire creates, popping in as each is said */}
    <Row>
      <Chip text="AI images" at={at(37)} out={at(47) + 1.0} />
      <Chip text="AI flyers" at={at(39)} out={at(47) + 1.0} />
      <Chip text="AI content" at={at(43)} out={at(47) + 1.0} />
      <Chip text="AI videos" at={at(46)} out={at(47) + 1.0} hero />
    </Row>
    {/* hours of work turn into minutes */}
    <Row>
      <Chip text="10 hrs" at={at(93)} out={at(106) + 0.4} strike={at(98)} />
      <Chip text="20 hrs" at={at(95)} out={at(106) + 0.4} strike={at(98) + 0.1} />
      <Chip text="days" at={at(97)} out={at(106) + 0.4} strike={at(98) + 0.2} />
    </Row>
    <Row top={300}>
      <Chip text="→ minutes" at={at(102)} out={at(106) + 0.4} hero />
    </Row>
    {/* where to use AI */}
    <Row>
      <Chip text="Business" at={at(247)} out={at(253) + 1.2} />
      <Chip text="Brand" at={at(250)} out={at(253) + 1.2} />
      <Chip text="Project" at={at(253)} out={at(253) + 1.2} hero />
    </Row>
    <NameCard />
    <FollowCard />
    <Captions />
    <Sequence from={F(TALK_END)} durationInFrames={F(TALK_TOTAL) - F(TALK_END)}>
      <EndCard />
    </Sequence>
    <Audio src={staticFile('talk/music-bed.wav')} volume={0.16} />
    <Audio src={staticFile('talk/sfx.wav')} volume={0.35} />
  </AbsoluteFill>
);
