import React from 'react';
import {AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {prog} from './anim';
import {CLIPS} from './clips';
import {C, FONT} from './theme';

/* ---------- Backgrounds ---------- */

export const DarkGlow: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 90% 45% at 50% 105%, ${C.glow}aa 0%, ${C.navy}55 40%, ${C.black} 75%)`,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Light: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: C.off}}>{children}</AbsoluteFill>
);

/* ---------- Text ---------- */

type KProps = {
  text: string;
  at: number; // frame it lands on
  outAt?: number; // frame it leaves
  size: number;
  weight?: number;
  color?: string;
  italic?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** A word or line that resolves from blur to sharp on its beat. */
export const Kinetic: React.FC<KProps> = ({
  text,
  at,
  outAt,
  size,
  weight = 700,
  color = C.ink,
  italic,
  style,
  children,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = prog(f, at, 14);
  const o = outAt === undefined ? 1 : 1 - prog(f, outAt, 8);
  if (o <= 0) return null;
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        fontStyle: italic ? 'italic' : 'normal',
        color,
        letterSpacing: -size * 0.025,
        lineHeight: 1.08,
        opacity: p * o,
        filter: `blur(${(1 - p) * 16 + (1 - o) * 14}px)`,
        transform: `translateY(${(1 - p) * 18}px) scale(${1 + (1 - p) * 0.06})`,
        ...style,
      }}
    >
      {text}
      {children}
    </span>
  );
};

/** Lines that replace each other in the same slot (text morph). */
export const TextSwap: React.FC<{
  lines: {text: string; at: number}[];
  size: number;
  color?: string;
  weight?: number;
  endAt?: number;
}> = ({lines, size, color, weight, endAt}) => (
  <div style={{display: 'grid', placeItems: 'center'}}>
    {lines.map((l, i) => (
      <div key={i} style={{gridArea: '1 / 1', textAlign: 'center'}}>
        <Kinetic
          text={l.text}
          at={l.at}
          outAt={i < lines.length - 1 ? lines[i + 1].at : endAt}
          size={size}
          color={color}
          weight={weight}
        />
      </div>
    ))}
  </div>
);

/** Placeholder text the user still has to supply. */
export const ph = (v: string | null | undefined, label: string) => v ?? `[${label}]`;
export const isPh = (v: string | null | undefined) => v == null;

/** Hand-drawn circle that draws itself around its parent. */
export const Scribble: React.FC<{at: number; color?: string}> = ({at, color = C.glow}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = prog(f, at, 18);
  const len = 1700;
  return (
    <svg
      viewBox="0 0 520 140"
      preserveAspectRatio="none"
      style={{position: 'absolute', left: '-9%', top: '-28%', width: '118%', height: '156%', overflow: 'visible'}}
    >
      <path
        d="M 30 78 C 22 22, 470 2, 506 58 C 532 112, 90 138, 34 92 C 10 70, 110 26, 230 20"
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
        style={{filter: `drop-shadow(0 0 10px ${color})`}}
      />
    </svg>
  );
};

/* ---------- UI pieces ---------- */

export const Cursor: React.FC<{x: number; y: number; pressed?: boolean}> = ({x, y, pressed}) => (
  <svg
    width={64}
    height={64}
    viewBox="0 0 24 24"
    style={{position: 'absolute', left: x, top: y, transform: `scale(${pressed ? 0.85 : 1})`, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.25))'}}
  >
    <path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11 13.2 L18 13 Z" fill={C.ink} stroke={C.white} strokeWidth={1.4} />
  </svg>
);

/** Expanding ring at a point, starting on a click. */
export const Ripple: React.FC<{at: number; x: number; y: number; color?: string}> = ({at, x, y, color = C.navy}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = prog(f, at, 24);
  if (p >= 1) return null;
  const r = 40 + p * 140;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        border: `6px solid ${color}`,
        opacity: 1 - p,
        boxShadow: `0 0 30px ${color}`,
      }}
    />
  );
};

export const SendButton: React.FC<{size: number; pressed?: boolean}> = ({size, pressed}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: C.navy,
      display: 'grid',
      placeItems: 'center',
      transform: `scale(${pressed ? 0.88 : 1})`,
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24">
      <path d="M12 20 V5 M5 11.5 L12 4.5 L19 11.5" stroke={C.white} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

/** Letter-by-letter typing between two frames. */
export const typed = (text: string, f: number, from: number, to: number) => {
  const n = Math.max(0, Math.min(text.length, Math.floor(((f - from) / Math.max(1, to - from)) * text.length)));
  return text.slice(0, n);
};

/* ---------- Clip card ---------- */

const HUES: Record<string, number> = {A: 222, B: 214, C: 230, D: 200, E: 245, F: 260, G: 190, H: 235};

/** One of your clips inside a rounded card, or a labelled placeholder until you add it. */
export const ClipCard: React.FC<{
  id: string;
  w: number;
  h: number;
  frozen?: boolean;
  grey?: number; // 0..1 desaturation
  traceAt?: number; // frame the accent ring starts tracing
  style?: React.CSSProperties;
}> = ({id, w, h, frozen, grey = 0, traceAt, style}) => {
  const f = useCurrentFrame();
  const src = CLIPS[id];
  const t = frozen ? 0 : f;
  const hue = HUES[id] ?? 220;
  const trace = traceAt === undefined ? 0 : prog(f, traceAt, 30);
  const per = 2 * (w + h);
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        borderRadius: 44,
        overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(10,36,99,.18), 0 6px 14px rgba(0,0,0,.08)',
        filter: `grayscale(${grey})`,
        background: C.white,
        ...style,
      }}
    >
      {src ? (
        frozen ? (
          <Freeze frame={0}>
            <OffthreadVideo src={staticFile(`clips/${src}`)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </Freeze>
        ) : (
          <OffthreadVideo src={staticFile(`clips/${src}`)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        )
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle at ${50 + 30 * Math.sin(t / 40)}% ${45 + 25 * Math.cos(t / 55)}%, hsl(${hue} 70% 62%) 0%, hsl(${hue} 65% 32%) 45%, ${C.navy} 100%)`,
            display: 'grid',
            placeItems: 'center',
            fontFamily: FONT,
            color: C.white,
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{fontSize: Math.max(40, w * 0.11), fontWeight: 800, letterSpacing: -1}}>CLIP {id}</div>
            <div style={{fontSize: Math.max(28, w * 0.05), opacity: 0.75, marginTop: 8}}>your clip here</div>
          </div>
        </div>
      )}
      {traceAt !== undefined && f >= traceAt && (
        <svg style={{position: 'absolute', inset: 0}} width={w} height={h}>
          <rect
            x={4}
            y={4}
            width={w - 8}
            height={h - 8}
            rx={40}
            fill="none"
            stroke={C.glow}
            strokeWidth={8}
            strokeDasharray={per}
            strokeDashoffset={per * (1 - trace)}
          />
        </svg>
      )}
    </div>
  );
};
