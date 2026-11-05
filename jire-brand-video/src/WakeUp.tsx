import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/400-italic.css';
import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {prog} from './anim';
import {FONT} from './theme';

/* "Wake-up call" end card: 10 s, night turns to dawn behind a cross on a hill. */

const SERIF = "'Playfair Display', Georgia, serif";
const W = 1080;
const H = 1920;

// deterministic pseudo-random for star positions
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const STARS = Array.from({length: 70}, (_, i) => ({x: rand(i) * W, y: rand(i + 99) * 1100, r: 1.5 + rand(i + 7) * 3, p: rand(i + 3) * 6}));

const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([document.fonts.load('600 80px "Playfair Display"'), document.fonts.load('italic 400 80px "Playfair Display"')])
      .catch(() => undefined)
      .then(() => continueRender(handle));
  }, [handle]);
};

/** Text that resolves from blur on its moment and leaves softly. */
const Line: React.FC<{at: number; out?: number; children: React.ReactNode; style: React.CSSProperties}> = ({at, out, children, style}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = prog(f, at, 14);
  const o = out === undefined ? 1 : 1 - prog(f, out, 10);
  if (o <= 0) return null;
  return (
    <div style={{opacity: p * o, filter: `blur(${(1 - p) * 14 + (1 - o) * 10}px)`, transform: `translateY(${(1 - p) * 22}px)`, ...style}}>{children}</div>
  );
};

const Bird: React.FC<{x: number; y: number; s: number; t: number}> = ({x, y, s, t}) => {
  const flap = Math.sin(t * 0.55) * 14;
  return (
    <path
      d={`M ${x - 26 * s} ${y - flap * s} Q ${x - 12 * s} ${y - 6 * s} ${x} ${y} Q ${x + 12 * s} ${y - 6 * s} ${x + 26 * s} ${y - flap * s}`}
      stroke="#3A2238"
      strokeWidth={4 * s}
      fill="none"
      strokeLinecap="round"
    />
  );
};

export const WakeUp: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const S = (sec: number) => Math.round(sec * fps);

  // dawn progress: night until 2.6 s, full morning by 5.6 s
  const d = interpolate(f, [S(2.6), S(5.6)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ease = d * d * (3 - 2 * d);
  const c = (night: string, mid: string, day: string) => interpolateColors(ease, [0, 0.5, 1], [night, mid, day]);

  const skyTop = c('#050A22', '#2B2560', '#F7C98B');
  const skyMid = c('#0A2463', '#7A4A8C', '#FFDDA6');
  const skyLow = c('#14306E', '#E58A5A', '#FFF3DC');
  const hillBack = c('#0E1C48', '#9C5A70', '#E7A37A');
  const hillMid = c('#0A1638', '#6E3A57', '#B8696A');
  const hillFront = c('#050C22', '#3A1F3A', '#6A3A4E');

  const sunY = interpolate(ease, [0, 1], [1560, 1150]);
  const rays = ease;
  const push = interpolate(f, [0, S(10)], [1, 1.06]);
  const cross = {x: 540, y: 1268};

  // two "alarm" pulses from the cross on the bell strikes
  const ring = (at: number) => {
    const p = prog(f, S(at), S(1.1));
    if (f < S(at) || p >= 1) return null;
    return <circle cx={cross.x} cy={cross.y - 40} r={30 + p * 520} fill="none" stroke="#FFE3A3" strokeWidth={6 * (1 - p)} opacity={0.9 * (1 - p)} />;
  };

  const lightText = '#FFFFFF';
  const darkText = '#0A1638';

  return (
    <AbsoluteFill style={{background: '#050A22', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 70%'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={skyTop} />
              <stop offset="0.55" stopColor={skyMid} />
              <stop offset="0.75" stopColor={skyLow} />
            </linearGradient>
            <radialGradient id="glow">
              <stop offset="0" stopColor="#FFF6D8" stopOpacity={1} />
              <stop offset="0.25" stopColor="#FFD27A" stopOpacity={0.9} />
              <stop offset="1" stopColor="#FFB45A" stopOpacity={0} />
            </radialGradient>
          </defs>
          <rect width={W} height={H} fill="url(#sky)" />

          {/* stars fade out as the sun comes up */}
          {STARS.map((st, i) => (
            <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#FFFFFF" opacity={(1 - ease) * (0.45 + 0.55 * Math.abs(Math.sin(f / 9 + st.p)))} />
          ))}

          {/* sun, glow and slowly turning rays */}
          <g opacity={rays}>
            {Array.from({length: 18}).map((_, i) => {
              const a = (i / 18) * Math.PI * 2 + f / 220;
              const x2 = 540 + Math.cos(a) * 1400;
              const y2 = sunY + Math.sin(a) * 1400;
              const a2 = a + 0.05;
              return (
                <polygon
                  key={i}
                  points={`540,${sunY} ${x2},${y2} ${540 + Math.cos(a2) * 1400},${sunY + Math.sin(a2) * 1400}`}
                  fill="#FFF1C9"
                  opacity={0.22}
                />
              );
            })}
          </g>
          <circle cx={540} cy={sunY} r={620} fill="url(#glow)" opacity={0.25 + 0.75 * ease} />
          <circle cx={540} cy={sunY} r={130} fill="#FFF4D6" opacity={ease} />

          {/* hills: back, middle (with the cross), front */}
          <path d="M0 1330 C 200 1240 360 1260 520 1320 C 700 1390 880 1250 1080 1290 L1080 1920 L0 1920 Z" fill={hillBack} />
          <path d="M0 1460 C 180 1400 360 1300 540 1290 C 720 1300 900 1400 1080 1450 L1080 1920 L0 1920 Z" fill={hillMid} />
          <path d="M0 1460 C 180 1400 360 1300 540 1290 C 720 1300 900 1400 1080 1450" fill="none" stroke="#FFE3A3" strokeWidth={5} opacity={0.75 * ease} />
          <g fill={hillFront}>
            <rect x={cross.x - 9} y={cross.y - 150} width={18} height={160} rx={3} />
            <rect x={cross.x - 52} y={cross.y - 118} width={104} height={16} rx={3} />
          </g>
          {ring(0.9)}
          {ring(1.5)}
          <path d="M0 1640 C 260 1560 420 1600 600 1660 C 800 1720 940 1620 1080 1600 L1080 1920 L0 1920 Z" fill={hillFront} />

          {/* birds cross the morning sky */}
          {f > S(5.8) &&
            [0, 1, 2].map((i) => {
              const t = f - S(5.8);
              return <Bird key={i} x={-80 + t * (5.2 + i * 0.6) + i * 70} y={1010 - i * 60 - t * 0.6} s={0.9 - i * 0.15} t={t + i * 4} />;
            })}
        </svg>
      </AbsoluteFill>

      {/* words */}
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 360, textAlign: 'center'}}>
        <div style={{display: 'grid', placeItems: 'center', width: 940}}>
          <div style={{gridArea: '1/1'}}>
            <Line at={S(0.25)} out={S(2.4)} style={{fontFamily: FONT, fontWeight: 600, fontSize: 84, color: lightText, letterSpacing: -1, textShadow: '0 4px 30px rgba(0,0,0,.45)'}}>
              This is a
            </Line>
            <Line at={S(0.9)} out={S(2.4)} style={{fontFamily: SERIF, fontWeight: 600, fontSize: 132, color: '#FFE3A3', lineHeight: 1.05, textShadow: '0 4px 40px rgba(255,200,110,.45)'}}>
              wake-up call.
            </Line>
          </div>
          <div style={{gridArea: '1/1'}}>
            <Line at={S(2.8)} out={S(5.0)} style={{fontFamily: FONT, fontWeight: 600, fontSize: 84, color: lightText, letterSpacing: -1, textShadow: '0 4px 30px rgba(40,20,60,.5)'}}>
              Whatever you do,
            </Line>
            <Line at={S(3.5)} out={S(5.0)} style={{fontFamily: SERIF, fontWeight: 600, fontSize: 116, color: '#FFFFFF', lineHeight: 1.05, whiteSpace: 'nowrap', textShadow: '0 4px 40px rgba(255,190,100,.6)'}}>
              remember God.
            </Line>
          </div>
          <div style={{gridArea: '1/1'}}>
            <Line at={S(5.3)} style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 72, color: darkText, lineHeight: 1.22, whiteSpace: 'nowrap'}}>
              “Awake thou that sleepest…
            </Line>
            <Line at={S(5.75)} style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 72, color: darkText, lineHeight: 1.22, whiteSpace: 'nowrap'}}>
              and Christ shall give
            </Line>
            <Line at={S(6.2)} style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 72, color: darkText, lineHeight: 1.22, whiteSpace: 'nowrap'}}>
              thee light.”
            </Line>
            <Line at={S(6.8)} style={{fontFamily: FONT, fontWeight: 600, fontSize: 44, color: darkText, opacity: 0.8, marginTop: 36, letterSpacing: 2}}>
              EPHESIANS 5:14 (KJV)
            </Line>
          </div>
        </div>
      </AbsoluteFill>
      <Audio src={staticFile('wakeup-sound.wav')} />
    </AbsoluteFill>
  );
};
