import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {prog, lerp} from './anim';
import {COPY} from './clips';
import {ClipCard, Cursor, DarkGlow, isPh, Kinetic, Light, ph, Ripple, Scribble, SendButton, TextSwap, typed} from './components';
import {C, FONT, s, W} from './theme';

/* All scene timings are seconds on the 120 BPM grid, relative to the scene start. */

/* ---------- Hook: words land on beats, scribble circles the key word ---------- */
export const Hook: React.FC<{
  line1?: {text: string; at: number}[];
  line2: {text: string; at: number}[];
  scribbleAt: number;
}> = ({line1, line2, scribbleAt}) => (
  <DarkGlow>
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 30, paddingBottom: 200}}>
      {line1 && (
        <div style={{display: 'flex', gap: 34}}>
          {line1.map((w) => (
            <Kinetic key={w.text} text={w.text} at={s(w.at)} size={124} color={C.white} />
          ))}
        </div>
      )}
      <div style={{display: 'flex', gap: 34, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 980}}>
        {line2.map((w, i) => (
          <Kinetic key={w.text} text={w.text} at={s(w.at)} size={124} color={C.white}>
            {i === line2.length - 1 && <Scribble at={s(scribbleAt)} />}
          </Kinetic>
        ))}
      </div>
    </AbsoluteFill>
  </DarkGlow>
);

/* ---------- Grid of identical template posts; scroll stops; one tile glows ---------- */
const TILE = 280;
const GAP = 36;
const GRID_LEFT = (W - (3 * TILE + 2 * GAP)) / 2;
const GRID_TOP = 600;
export const GLOW_TILE = {x: GRID_LEFT + TILE + GAP + TILE / 2, y: 1144}; // centre after the stop

const Tile: React.FC<{glow: number; dim: number}> = ({glow, dim}) => (
  <div
    style={{
      width: TILE,
      height: TILE,
      borderRadius: 28,
      background: C.white,
      padding: 22,
      boxSizing: 'border-box',
      opacity: 1 - dim * 0.65,
      transform: `scale(${1 + glow * 0.12})`,
      boxShadow: glow ? `0 0 ${50 * glow}px ${C.glow}, 0 0 0 ${6 * glow}px ${C.navy}` : '0 4px 10px rgba(0,0,0,.05)',
      zIndex: glow ? 2 : 1,
      position: 'relative',
    }}
  >
    <div style={{height: 150, borderRadius: 16, background: glow ? `linear-gradient(135deg, ${C.glow}, ${C.navy})` : C.grey}} />
    <div style={{height: 20, width: '80%', borderRadius: 10, background: C.grey, marginTop: 20}} />
    <div style={{height: 20, width: '55%', borderRadius: 10, background: C.grey, marginTop: 14}} />
  </div>
);

export const TemplateGrid: React.FC<{lines: {text: string; at: number}[]; stopAt: number; scrollPx?: number; endAt?: number}> = ({
  lines,
  stopAt,
  scrollPx = 900,
  endAt,
}) => {
  const f = useCurrentFrame();
  const offset = -scrollPx * Math.min(1, f / s(stopAt));
  const g = prog(f, s(stopAt), 20);
  const flip = prog(f, 0, 10);
  return (
    <Light>
      <AbsoluteFill style={{opacity: flip}}>
        <div style={{position: 'absolute', top: 250, width: '100%'}}>
          <TextSwap lines={lines.map((l) => ({text: l.text, at: s(l.at)}))} size={96} endAt={endAt !== undefined ? s(endAt) : undefined} />
        </div>
        <div style={{position: 'absolute', top: 470, left: 0, right: 0, bottom: 0, overflow: 'hidden', maskImage: 'linear-gradient(transparent, black 12%, black 88%, transparent)'}}>
          {Array.from({length: 30}).map((_, i) => {
            const r = Math.floor(i / 3);
            const c = i % 3;
            const isGlow = r === 4 && c === 1;
            return (
              <div key={i} style={{position: 'absolute', left: GRID_LEFT + c * (TILE + GAP), top: GRID_TOP - 470 + r * (TILE + GAP) + offset}}>
                <Tile glow={isGlow ? g : 0} dim={isGlow ? 0 : g} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Light>
  );
};

/* ---------- Prompt bar: tile morphs into it, text types, push-in, click ---------- */
export const PromptScene: React.FC<{
  text: string;
  placeholder?: boolean;
  morph: [number, number];
  type: [number, number];
  cursor: [number, number];
  pushIn: number;
  click: number;
  from?: 'tile' | 'none';
  barY?: number;
  title?: {lines: string[]; at: number};
  result?: {at: number; shimmer: [number, number]; clip: string};
}> = ({text, placeholder, morph, type, cursor, pushIn, click, from = 'tile', barY = 1000, title, result}) => {
  const f = useCurrentFrame();
  const m = from === 'tile' ? prog(f, s(morph[0]), s(morph[1] - morph[0])) : 1;
  const barW = 940;
  const barH = 250;
  const w = lerp(TILE * 1.12, barW, m);
  const h = lerp(TILE * 1.12, barH, m);
  const cx = W / 2;
  const cy = lerp(GLOW_TILE.y, barY, m);
  const btn = {x: cx + barW / 2 - 40 - 65, y: barY};
  const push = prog(f, s(pushIn), s(0.5));
  const scale = 1 + push * (result ? 0.6 : 0.9);
  const pressed = f >= s(click) && f < s(click) + 8;
  const cp = prog(f, s(cursor[0]), s(cursor[1] - cursor[0]));
  const cur = {x: lerp(860, btn.x + 6, cp), y: lerp(1720, btn.y + 10, cp)};
  const unpush = result ? prog(f, s(result.shimmer[0]), 18) : 0;
  const shown = typed(text, f, s(type[0]), s(type[1]));
  const res = result ? prog(f, s(result.at), 24) : 0;
  return (
    <Light>
      {title && (
        <div style={{position: 'absolute', top: 230, width: '100%', textAlign: 'center'}}>
          {title.lines.map((l, i) => (
            <div key={i}>
              <Kinetic text={l} at={s(title.at) + i * 6} size={84} />
            </div>
          ))}
        </div>
      )}
      <AbsoluteFill
        style={{
          transform: `scale(${lerp(scale, 1, unpush)})`,
          transformOrigin: `${btn.x}px ${btn.y}px`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: cx - w / 2,
            top: cy - h / 2,
            width: w,
            height: h,
            borderRadius: lerp(28, barH / 2, m),
            background: C.white,
            boxShadow: `0 0 ${40 * (1 - m)}px ${C.glow}, 0 20px 50px rgba(10,36,99,.14)`,
            display: 'flex',
            alignItems: 'center',
            padding: `0 40px 0 64px`,
            boxSizing: 'border-box',
            gap: 24,
          }}
        >
          <div
            style={{
              flex: 1,
              fontFamily: FONT,
              fontSize: 54,
              lineHeight: 1.2,
              color: placeholder ? C.mid : C.ink,
              fontStyle: placeholder ? 'italic' : 'normal',
              opacity: m,
            }}
          >
            {shown}
            {f >= s(type[0]) && <span style={{color: C.navy, opacity: Math.floor(f / 15) % 2 ? 1 : 0.2}}>|</span>}
          </div>
          <div style={{opacity: m}}>
            <SendButton size={130} pressed={pressed} />
          </div>
        </div>
        {f >= s(cursor[0]) && unpush < 1 && <Cursor x={cur.x} y={cur.y} pressed={pressed} />}
        <Ripple at={s(click)} x={btn.x} y={btn.y} color={C.glow} />
      </AbsoluteFill>
      {result && f >= s(result.shimmer[0]) && f < s(result.at) && (
        <div style={{position: 'absolute', top: barY + 220, width: '100%', textAlign: 'center', fontFamily: FONT, fontSize: 56, fontWeight: 600}}>
          <span
            style={{
              background: `linear-gradient(90deg, ${C.greyDark} 0%, ${C.navy} ${((f % 30) / 30) * 100}%, ${C.greyDark} 100%)`,
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Generating…
          </span>
        </div>
      )}
      {result && res > 0 && (
        <div style={{position: 'absolute', left: W / 2 - 240, top: barY + 190, transform: `scale(${0.6 + 0.4 * res})`, opacity: res, transformOrigin: 'top center'}}>
          <ClipCard id={result.clip} w={480} h={600} traceAt={s(result.at)} />
        </div>
      )}
    </Light>
  );
};

/* ---------- "3 fixes." kinetic slide on the drop ---------- */
export const BigSlide: React.FC<{text: string; dur: number}> = ({text, dur}) => {
  const f = useCurrentFrame();
  const D = s(dur);
  const x = interpolate(f, [0, 16, D - 16, D], [900, 40, -40, -1300], {extrapolateRight: 'clamp'});
  const blur = interpolate(f, [0, 16, D - 16, D], [28, 0, 0, 30], {extrapolateRight: 'clamp'});
  return (
    <DarkGlow>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 160}}>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 250, color: C.white, letterSpacing: -8, transform: `translateX(${x}px)`, filter: `blur(${blur}px)`, whiteSpace: 'nowrap'}}>
          {text}
        </div>
      </AbsoluteFill>
    </DarkGlow>
  );
};

/* ---------- Fix 1: brand kit pours into clips with one look ---------- */
export const FixLook: React.FC = () => {
  const f = useCurrentFrame();
  const swatches = [C.navy, C.glow, C.off];
  const kitOut = prog(f, s(4), 20);
  const a = prog(f, s(4), 24);
  const bc = prog(f, s(6), 24);
  return (
    <Light>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <Kinetic text="1. One look," at={0} size={96} />
        <br />
        <Kinetic text="every post" at={8} size={96} />
      </div>
      {kitOut < 1 && (
        <div
          style={{
            position: 'absolute',
            left: 160,
            top: 760,
            width: 760,
            height: 560,
            borderRadius: 44,
            background: C.white,
            boxShadow: '0 30px 60px rgba(10,36,99,.14)',
            padding: 56,
            boxSizing: 'border-box',
            fontFamily: FONT,
            opacity: (1 - kitOut) * prog(f, 0, 14),
            transform: `scale(${1 - kitOut * 0.3})`,
          }}
        >
          <div style={{fontSize: 44, color: C.mid, fontWeight: 600}}>Brand kit</div>
          <div style={{display: 'flex', gap: 40, marginTop: 50}}>
            {swatches.map((col, i) => {
              const p = prog(f, s(0.5 + i * 0.5), 16);
              return (
                <div
                  key={col}
                  style={{width: 170, height: 170, borderRadius: '50%', background: col, border: `4px solid ${C.grey}`, transform: `scale(${p})`}}
                />
              );
            })}
          </div>
          <div
            style={{
              marginTop: 50,
              display: 'inline-block',
              padding: '18px 34px',
              borderRadius: 60,
              background: C.off,
              fontSize: 48,
              fontWeight: 700,
              color: C.ink,
              transform: `scale(${prog(f, s(2), 16)})`,
            }}
          >
            Aa · one font
          </div>
        </div>
      )}
      {bc > 0 && (
        <>
          <div style={{position: 'absolute', left: lerp(-400, 30, bc), top: 900, opacity: bc}}>
            <ClipCard id="B" w={300} h={375} />
          </div>
          <div style={{position: 'absolute', left: lerp(1480, 750, bc), top: 900, opacity: bc}}>
            <ClipCard id="C" w={300} h={375} />
          </div>
        </>
      )}
      {a > 0 && (
        <div style={{position: 'absolute', left: W / 2 - 230, top: 760, transform: `scale(${0.7 + 0.3 * a})`, opacity: a, zIndex: 3}}>
          <ClipCard id="A" w={460} h={575} traceAt={s(4)} />
        </div>
      )}
    </Light>
  );
};

/* ---------- Fix 2: frozen grey still snaps alive ---------- */
export const FixMove: React.FC = () => {
  const f = useCurrentFrame();
  const alive = f >= s(2);
  const sat = prog(f, s(2), 10);
  const tilt = interpolate(f, [s(6), s(6.5), s(7.5), s(8)], [0, 16, 16, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const hit = alive ? 1 + 0.06 * (1 - prog(f, s(2), 16)) : 1;
  return (
    <Light>
      <div style={{position: 'absolute', top: 260, width: '100%'}}>
        <TextSwap
          lines={[
            {text: 'Flat.', at: s(0.5)},
            {text: 'Alive.', at: s(2)},
            {text: '2. Make it move', at: s(4)},
          ]}
          size={110}
        />
      </div>
      <div style={{position: 'absolute', left: W / 2 - 300, top: 620, perspective: 1400}}>
        <div style={{transform: `rotateY(${tilt}deg) scale(${hit})`}}>
          <ClipCard id="D" w={600} h={750} frozen={!alive} grey={1 - sat} />
        </div>
      </div>
    </Light>
  );
};

/* ---------- Proof: your clips stack in, one per bar ---------- */
export const Proof: React.FC<{clips: string[]}> = ({clips}) => {
  const f = useCurrentFrame();
  // Hold still while the first two cards land, then scroll so the newest card stays in view.
  const scroll = interpolate(f, [s(3.5), s(10)], [0, 860], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Light>
      <div style={{position: 'absolute', top: 640, left: 0, right: 0, bottom: 0, overflow: 'hidden', maskImage: 'linear-gradient(transparent, black 8%, black 90%, transparent)'}}>
        {clips.map((id, i) => {
          const p = prog(f, s(i * 2), 24);
          if (p <= 0) return null;
          const title = COPY.proofTitles[i];
          return (
            <div
              key={id + i}
              style={{
                position: 'absolute',
                left: lerp(1200, 110, p),
                top: 140 + i * 430 - scroll,
                display: 'flex',
                alignItems: 'center',
                gap: 44,
                opacity: p,
              }}
            >
              <ClipCard id={id} w={300} h={375} />
              <div style={{fontFamily: FONT, fontSize: 48, fontWeight: 600, color: isPh(title) ? C.mid : C.ink, fontStyle: isPh(title) ? 'italic' : 'normal', width: 480}}>
                {ph(title, 'short title')}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 0, height: 600, left: 0, right: 0, background: C.off, paddingTop: 300, boxSizing: 'border-box'}}>
        <TextSwap
          lines={[
            {text: 'All made with AI.', at: 0},
            {text: 'All by @jiri_ai.', at: s(4)},
          ]}
          size={96}
        />
      </div>
    </Light>
  );
};

/* ---------- Class: notification pill expands into a card ---------- */
export const ClassNote: React.FC = () => {
  const f = useCurrentFrame();
  const drop = prog(f, 0, 22);
  const ex = prog(f, s(2), 24);
  const h = lerp(210, 560, ex);
  return (
    <Light>
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: lerp(-260, 640, drop),
          width: 900,
          height: h,
          borderRadius: lerp(105, 52, ex),
          background: C.ink,
          padding: '42px 48px',
          boxSizing: 'border-box',
          fontFamily: FONT,
          color: C.white,
          boxShadow: '0 30px 70px rgba(0,0,0,.25)',
          overflow: 'hidden',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
          <div style={{width: 124, height: 124, borderRadius: '50%', background: C.navy, display: 'grid', placeItems: 'center', fontSize: 64, fontWeight: 800, flexShrink: 0}}>J</div>
          <div>
            <div style={{fontSize: 52, fontWeight: 700}}>Brand Builders class</div>
            <div style={{fontSize: 42, color: isPh(COPY.classWhen) ? '#9AA3B2' : '#C9D3E6', fontStyle: isPh(COPY.classWhen) ? 'italic' : 'normal', marginTop: 4}}>
              {ph(COPY.classWhen, 'date or coming soon')}
            </div>
          </div>
        </div>
        <div style={{marginTop: 60, fontSize: 56, lineHeight: 1.25, fontWeight: 600, opacity: prog(f, s(2.25), 16), fontStyle: isPh(COPY.classLine) ? 'italic' : 'normal', color: isPh(COPY.classLine) ? '#9AA3B2' : C.white}}>
          {ph(COPY.classLine, 'one true line on what the class teaches')}
        </div>
      </div>
    </Light>
  );
};

/* ---------- Follow: push-in and click on the beat ---------- */
export const FollowScene: React.FC<{textAt: number; pushIn: number; click: number; lines?: string[]}> = ({
  textAt,
  pushIn,
  click,
  lines = ['Follow so you', "don't miss it."],
}) => {
  const f = useCurrentFrame();
  const inP = prog(f, 0, 20);
  const push = prog(f, s(pushIn), s(0.5));
  const done = f >= s(click);
  const pressed = done && f < s(click) + 8;
  const btn = {x: W / 2, y: 1350};
  const cp = prog(f, s(pushIn) - 20, 26);
  return (
    <Light>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        {lines.map((l, i) => (
          <div key={l}>
            <Kinetic text={l} at={s(textAt) + i * 8} size={96} />
          </div>
        ))}
      </div>
      <AbsoluteFill style={{transform: `scale(${1 + push * 0.5})`, transformOrigin: `${btn.x}px ${btn.y}px`}}>
        <div
          style={{
            position: 'absolute',
            left: 110,
            top: 760,
            width: 860,
            height: 720,
            borderRadius: 52,
            background: C.white,
            boxShadow: '0 30px 70px rgba(10,36,99,.14)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: FONT,
            opacity: inP,
            transform: `translateY(${(1 - inP) * 80}px)`,
          }}
        >
          <div style={{width: 220, height: 220, borderRadius: '50%', background: C.navy, marginTop: 70, display: 'grid', placeItems: 'center', color: C.white, fontSize: 110, fontWeight: 800}}>J</div>
          <div style={{fontSize: 76, fontWeight: 800, color: C.ink, marginTop: 40, letterSpacing: -2}}>@jiri_ai</div>
          <div
            style={{
              marginTop: 60,
              width: 440,
              height: 130,
              borderRadius: 65,
              background: done ? C.white : C.navy,
              border: `5px solid ${C.navy}`,
              color: done ? C.navy : C.white,
              display: 'grid',
              placeItems: 'center',
              fontSize: 56,
              fontWeight: 700,
              transform: `scale(${pressed ? 0.92 : 1})`,
            }}
          >
            {done ? 'Following' : 'Follow'}
          </div>
        </div>
        {f >= s(pushIn) - 20 && <Cursor x={lerp(900, btn.x + 60, cp)} y={lerp(1800, btn.y + 20, cp)} pressed={pressed} />}
        <Ripple at={s(click)} x={btn.x} y={btn.y} color={C.glow} />
      </AbsoluteFill>
    </Light>
  );
};

/* ---------- End card: signature settles, matches the opening for the loop ---------- */
export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 30);
  return (
    <DarkGlow>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 200}}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 150,
            color: C.white,
            letterSpacing: -4,
            transform: `scale(${1.5 - 0.5 * p})`,
            filter: `blur(${(1 - p) * 20}px)`,
            textShadow: `0 0 40px ${C.glow}`,
          }}
        >
          jiri_ai
        </div>
      </AbsoluteFill>
    </DarkGlow>
  );
};

/* ---------- 15 s cut: one clip card per bar ---------- */
export const ClipPerBar: React.FC<{items: {clip: string; label: string}[]}> = ({items}) => {
  const f = useCurrentFrame();
  const i = Math.min(items.length - 1, Math.floor(f / s(2)));
  const local = f - i * s(2);
  const p = prog(local, 0, 20);
  return (
    <Light>
      <div style={{position: 'absolute', top: 270, width: '100%', textAlign: 'center'}}>
        <Kinetic key={i} text={items[i].label} at={i * s(2)} size={92} />
      </div>
      <div style={{position: 'absolute', left: W / 2 - 300, top: 620, transform: `scale(${0.85 + 0.15 * p})`, opacity: p}}>
        <ClipCard id={items[i].clip} w={600} h={750} traceAt={i * s(2)} />
      </div>
    </Light>
  );
};
