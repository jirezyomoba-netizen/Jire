import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/900.css';
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {prog} from '../anim';
import vo from './vo.json';
const C = vo.cues;

/* "The Businessman Who Discovered Claude" — 60 s.
   Scene 1 is the approved Flow clip. Scenes 2-5 are motion graphics with a neutral, illustrative
   chat screen (not the official Claude interface). Scene 6 returns to the man for the message. */

const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
const NAVY = '#0A2463', BLUE = '#3D5CFF', INK = '#0B1430', OFF = '#F5F6F8', RED = '#F01A10';
const M = "'Montserrat','Inter',sans-serif";
const UI = "Inter,system-ui,sans-serif";

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['300 60px Montserrat', '500 60px Montserrat', '900 60px Montserrat'].map((x) => document.fonts.load(x))).catch(() => undefined).then(() => continueRender(h));
  }, [h]);
};
const useT = () => useCurrentFrame() / FPS;
/** 0→1 from second a over d seconds (eased). */
const P = (f: number, a: number, d = 0.3) => prog(f, F(a), Math.max(1, F(d)));
const typed = (text: string, t: number, a: number, b: number) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((t - a) / (b - a)) * text.length))));

/* ---------- shared pieces ---------- */
const Big: React.FC<{lines: string[]; a: number; b: number; color?: string; top?: number; size?: number}> = ({lines, a, b, color = '#fff', top = 230, size}) => {
  const f = useCurrentFrame();
  if (f < F(a) || f > F(b) + 8) return null;
  const p = P(f, a, 0.22), o = 1 - P(f, b, 0.22);
  const longest = Math.max(...lines.map((l) => l.length));
  const fs = size ?? Math.min(230, Math.floor(960 / (longest * 0.8)));
  return (
    <div style={{position: 'absolute', top, left: 30, right: 30, textAlign: 'center', opacity: p * o, filter: `blur(${(1 - p) * 14}px)`, transform: `scale(${1.1 - 0.1 * p + 0.03 * ((f - F(a)) / Math.max(1, F(b - a)))})`}}>
      {lines.map((l) => (
        <div key={l} style={{fontFamily: M, fontWeight: 900, fontSize: fs, lineHeight: 0.95, letterSpacing: -fs * 0.05, color, whiteSpace: 'nowrap'}}>{l}</div>
      ))}
    </div>
  );
};
const Chip: React.FC<{text: string; a: number; b: number; x: number; y: number; big?: boolean}> = ({text, a, b, x, y, big}) => {
  const f = useCurrentFrame();
  if (f < F(a) || f > F(b) + 8) return null;
  const p = P(f, a, 0.18), o = 1 - P(f, b, 0.2);
  return (
    <div style={{position: 'absolute', left: x, top: y, background: '#fff', color: NAVY, borderRadius: 999, padding: big ? '28px 50px' : '20px 36px', fontFamily: M, fontWeight: 500, fontSize: big ? 62 : 44, boxShadow: '0 16px 36px -12px rgba(0,0,0,.45)', opacity: p * o, transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: 'left center', whiteSpace: 'nowrap'}}>{text}</div>
  );
};
const Cursor: React.FC<{x: number; y: number; press?: boolean}> = ({x, y, press}) => (
  <svg width={70} height={70} viewBox="0 0 24 24" style={{position: 'absolute', left: x, top: y, transform: `scale(${press ? 0.85 : 1})`, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.35))'}}>
    <path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11 13.2 L18 13 Z" fill={INK} stroke="#fff" strokeWidth={1.4} />
  </svg>
);
const Ring: React.FC<{at: number; x: number; y: number}> = ({at, x, y}) => {
  const f = useCurrentFrame(); const p = P(f, at, 0.7);
  if (f < F(at) || p >= 1) return null;
  const r = 30 + p * 150;
  return <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `6px solid ${BLUE}`, opacity: 1 - p}} />;
};
const Flash: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame(); const d = f - F(at);
  if (d < -3 || d > 8) return null;
  return <AbsoluteFill style={{background: '#fff', opacity: d < 0 ? (d + 3) / 3 : 1 - d / 8}} />;
};
const Night: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 50% at 50% 108%, #2B4A9C 0%, ${NAVY} 42%, #050B1E 82%)`}}>{children}</AbsoluteFill>
);
const Day: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 100% 60% at 50% -5%, #FFF4DC 0%, ${OFF} 55%, #E7ECF5 100%)`}}>{children}</AbsoluteFill>
);
const Illustrative: React.FC<{dark?: boolean}> = ({dark}) => (
  <div style={{position: 'absolute', top: 1690, left: 0, right: 0, textAlign: 'center', fontFamily: UI, fontSize: 28, color: dark ? 'rgba(255,255,255,.55)' : 'rgba(11,20,48,.5)'}}>Illustrative screen</div>
);

/* ---------- Scene 1: the approved clip, words behind him ---------- */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const vid = {width: '100%', height: '100%', objectFit: 'cover' as const};
  const bubbles = [['New message', 600, 1130, 5.2], ['3 new emails', 520, 1010, 5.8], ['Order enquiry', 640, 890, 6.3], ['Reminder: proposal', 470, 770, 6.8]] as const;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <OffthreadVideo src={staticFile('ad/s1.mp4')} muted playbackRate={0.9767} style={vid} />
      <Big lines={['CUSTOMERS']} a={C.customers} b={C.marketing - 0.08} top={150} />
      <Big lines={['MARKETING']} a={C.marketing} b={C.emails - 0.08} top={150} />
      <Big lines={['EMAILS']} a={C.emails} b={C.paperwork - 0.08} top={150} />
      <Big lines={['PAPERWORK']} a={C.paperwork} b={C.paperwork + 1.5} top={150} />
      <OffthreadVideo src={staticFile('ad/s1_cut.webm')} muted transparent playbackRate={0.9767} style={{...vid, position: 'absolute', inset: 0}} />
      {bubbles.map(([txt, x, y, a]) => {
        const p = P(f, a, 0.18), o = 1 - P(f, 7.8, 0.25);
        if (f < F(a) || o <= 0) return null;
        return (
          <div key={txt} style={{position: 'absolute', left: x, top: y, background: '#fff', color: INK, borderRadius: 34, padding: '20px 30px 20px 24px', fontFamily: M, fontWeight: 500, fontSize: 36, boxShadow: '0 18px 40px -12px rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', gap: 16, opacity: p * o, transform: `scale(${0.6 + 0.4 * p})`}}>
            <span style={{width: 20, height: 20, borderRadius: '50%', background: '#E5484D'}} />{txt}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- Scene 2: the search, then the discovery ---------- */
const S2: React.FC = () => {
  const f = useCurrentFrame(); const t = useT();
  const q = 'a smarter way to work';
  const lit = t >= 6; // chat screen from 6 s
  const cp = P(f, 2.9, 0.6); const c2 = P(f, 4.9, 0.6);
  const cur = t < 4.6 ? {x: 880 - 60 * cp, y: 1500 - 640 * cp} : {x: 820 - 260 * c2, y: 860 + 250 * c2};
  const results = ['Hire more staff?', 'Work longer hours?', 'An AI assistant that helps you think, plan and write'];
  return (
    <AbsoluteFill>
      {!lit && (
        <Night>
          <Big lines={['ONE', 'EVENING']} a={0.3} b={2.2} top={260} size={170} />
          <div style={{position: 'absolute', left: 90, right: 90, top: 760, height: 130, borderRadius: 65, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 44px', gap: 24, boxShadow: '0 30px 70px -20px rgba(0,0,0,.7)', opacity: P(f, 0.5), transform: `translateY(${(1 - P(f, 0.5)) * 40}px)`}}>
            <svg width={52} height={52} viewBox="0 0 24 24"><circle cx={10.5} cy={10.5} r={6.5} stroke={INK} strokeWidth={2.4} fill="none" /><path d="M15.5 15.5 L21 21" stroke={INK} strokeWidth={2.4} strokeLinecap="round" /></svg>
            <span style={{fontFamily: UI, fontSize: 52, color: INK}}>{typed(q, t, 0.9, 2.9)}<span style={{color: BLUE, opacity: Math.floor(f / 15) % 2 ? 1 : 0.2}}>|</span></span>
          </div>
          {results.map((r, i) => {
            const p = P(f, 3.7 + i * 0.25, 0.3); const hot = i === 2;
            const glow = hot ? P(f, 4.7, 0.3) : 0;
            return (
              <div key={r} style={{position: 'absolute', left: 90, right: 90, top: 950 + i * 150, minHeight: 124, borderRadius: 28, background: hot ? `rgba(61,92,255,${0.18 + 0.5 * glow})` : 'rgba(255,255,255,.08)', border: `2px solid rgba(255,255,255,${hot ? 0.3 + 0.6 * glow : 0.12})`, padding: '26px 36px', fontFamily: UI, fontSize: 42, lineHeight: 1.25, color: hot ? '#fff' : 'rgba(255,255,255,.55)', opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${1 + 0.03 * glow})`, textDecoration: hot ? 'none' : 'line-through', textDecorationColor: 'rgba(255,255,255,.35)'}}>{r}</div>
            );
          })}
          {t > 2.9 && <Cursor x={cur.x} y={cur.y} press={(t > 3.5 && t < 3.7) || (t > 5.5 && t < 5.7)} />}
          <Ring at={3.5} x={840} y={880} />
          <Ring at={5.5} x={580} y={1130} />
        </Night>
      )}
      {lit && (
        <Day>
          <div style={{position: 'absolute', top: 430, left: 0, right: 0, textAlign: 'center', opacity: P(f, 6.15, 0.4), filter: `blur(${(1 - P(f, 6.15, 0.4)) * 16}px)`}}>
            <div style={{fontFamily: M, fontWeight: 300, fontSize: 60, color: '#59607A'}}>An AI assistant called</div>
            <div style={{fontFamily: M, fontWeight: 900, fontSize: 250, color: NAVY, letterSpacing: -10, lineHeight: 1.05, opacity: P(f, C.claude2 - 10.15, 0.3), transform: `scale(${1.15 - 0.15 * P(f, C.claude2 - 10.15, 0.3)})`}}>Claude</div>
          </div>
          <div style={{position: 'absolute', left: 90, right: 90, top: 1040, height: 250, borderRadius: 44, background: '#fff', boxShadow: '0 30px 70px -24px rgba(10,36,99,.35)', padding: '40px 44px', opacity: P(f, 7.0, 0.4), transform: `translateY(${(1 - P(f, 7.0, 0.4)) * 50}px)`}}>
            <div style={{fontFamily: UI, fontSize: 48, color: '#8A90A6'}}>How can I help you today?<span style={{color: BLUE, opacity: Math.floor(f / 15) % 2 ? 1 : 0}}> |</span></div>
            <div style={{position: 'absolute', right: 34, bottom: 30, width: 96, height: 96, borderRadius: '50%', background: NAVY, display: 'grid', placeItems: 'center'}}>
              <svg width={44} height={44} viewBox="0 0 24 24"><path d="M12 20 V5 M5 11.5 L12 4.5 L19 11.5" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
          <Illustrative />
        </Day>
      )}
      <Flash at={6} />
    </AbsoluteFill>
  );
};

/* ---------- Scene 3: three requests, three drafts ---------- */
const ASKS = [
  {a: 0.2, chip: '1. Organise my tasks', ask: 'Organise my tasks for this week, most important first.', ans: ['Mon  Reply to pending customer orders', 'Tue  Finish the supplier proposal', 'Wed  Plan this month’s marketing', 'Thu  Follow up on unpaid invoices', 'Fri  Review the week and plan next']},
  {a: 3.5, chip: '2. Marketing ideas', ask: 'Give me 5 marketing ideas I can do on a small budget.', ans: ['Short customer story videos', 'A referral reward for regulars', 'Weekly tips on WhatsApp Status', 'Team up with a nearby business', 'Before-and-after posts']},
  {a: 6.7, chip: '3. Customer reply', ask: 'Draft a polite reply to a customer whose order is late.', ans: ['Good afternoon, and thank you for', 'your patience. I am sorry your order', 'is late. It will reach you by Friday,', 'and I will confirm once it ships.']},
];
const S3: React.FC = () => {
  const f = useCurrentFrame(); const t = useT();
  const k = t < 3.5 ? 0 : t < 6.7 ? 1 : 2; const X = ASKS[k]; const a = X.a;
  const inP = P(f, a, 0.25);
  return (
    <Day>
      <Chip text={X.chip} a={a} b={k === 2 ? 9.7 : ASKS[k + 1].a - 0.25} x={70} y={270} />
      <div key={k} style={{position: 'absolute', left: 70, right: 70, top: 410, opacity: inP, transform: `translateX(${(1 - inP) * 120}px)`}}>
        <div style={{marginLeft: 150, background: NAVY, color: '#fff', borderRadius: '40px 40px 10px 40px', padding: '32px 40px', fontFamily: UI, fontSize: 46, lineHeight: 1.25, minHeight: 180, boxShadow: '0 20px 50px -20px rgba(10,36,99,.5)'}}>
          {typed(X.ask, t, a + 0.15, a + 1.25)}{t < a + 1.3 && <span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0.2}}>|</span>}
        </div>
        <div style={{marginTop: 40, marginRight: 60, background: '#fff', borderRadius: '10px 40px 40px 40px', padding: '36px 40px', fontFamily: UI, fontSize: 44, color: INK, boxShadow: '0 30px 70px -28px rgba(10,36,99,.35)', minHeight: 560, opacity: P(f, a + 1.45, 0.25)}}>
          <div style={{fontFamily: M, fontWeight: 500, fontSize: 30, color: '#8A90A6', letterSpacing: 3, marginBottom: 22}}>DRAFT</div>
          {X.ans.map((line, i) => {
            const p = P(f, a + 1.6 + i * 0.22, 0.25);
            return (
              <div key={line} style={{display: 'flex', gap: 20, alignItems: 'baseline', padding: '13px 0', borderBottom: k < 2 && i < X.ans.length - 1 ? '2px solid #EEF0F5' : 'none', opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}>
                {k === 1 && <span style={{fontFamily: M, fontWeight: 900, color: BLUE, width: 44}}>{i + 1}</span>}
                <span style={{fontWeight: k === 0 ? 500 : 400}}>{line}</span>
              </div>
            );
          })}
        </div>
      </div>
      <Illustrative />
    </Day>
  );
};

/* ---------- Scene 4: a clear plan ---------- */
const TASKS = ['Reply to pending customer orders', 'Finish the supplier proposal', 'Plan this month’s marketing', 'Follow up on unpaid invoices', 'Review the week'];
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const done = TASKS.filter((_, i) => f >= F(4.2 + i * 0.9)).length;
  const cardP = P(f, 2.6, 0.4);
  return (
    <Day>
      <Big lines={['CLEARER', 'DIRECTION']} a={C.clearer - 30.2} b={2.6} color={NAVY} top={520} />
      <div style={{position: 'absolute', left: 70, right: 70, top: 380, background: '#fff', borderRadius: 48, padding: '50px 48px', boxShadow: '0 40px 90px -30px rgba(10,36,99,.4)', opacity: cardP, transform: `translateY(${(1 - cardP) * 80}px)`}}>
        <div style={{fontFamily: M, fontWeight: 900, fontSize: 70, color: INK, letterSpacing: -2}}>This week’s plan</div>
        <div style={{marginTop: 26, height: 22, borderRadius: 11, background: '#E9EEFA', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${interpolate(f, [F(4.2), F(8.4)], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}%`, background: BLUE, borderRadius: 11}} />
        </div>
        <div style={{fontFamily: M, fontWeight: 500, fontSize: 34, color: '#59607A', marginTop: 14}}>{done} of {TASKS.length} done</div>
        {TASKS.map((task, i) => {
          const p = P(f, 3.0 + i * 0.15, 0.3); const tick = P(f, 4.2 + i * 0.9, 0.2);
          return (
            <div key={task} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '30px 0', borderTop: '2px solid #EEF0F5', marginTop: i === 0 ? 30 : 0, opacity: p, transform: `translateX(${(1 - p) * 40}px)`}}>
              <div style={{width: 66, height: 66, borderRadius: 20, border: `5px solid ${tick > 0 ? BLUE : '#C9CFDD'}`, background: tick > 0 ? BLUE : '#fff', display: 'grid', placeItems: 'center', transform: `scale(${1 + 0.25 * Math.sin(Math.min(1, tick) * Math.PI)})`, flexShrink: 0}}>
                {tick > 0 && <svg width={40} height={40} viewBox="0 0 24 24"><path d="M5 12.5 L10 17.5 L19 7.5" stroke="#fff" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <div style={{fontFamily: UI, fontSize: 46, color: tick > 0.5 ? '#8A90A6' : INK, textDecoration: tick > 0.5 ? 'line-through' : 'none'}}>{task}</div>
            </div>
          );
        })}
      </div>
    </Day>
  );
};

/* ---------- Scene 5: part of the workflow, and still in control ---------- */
const S5: React.FC = () => {
  const f = useCurrentFrame(); const t = useT();
  const words = [['Brainstorm', 0.6], ['Research', 1.4], ['Write', 2.6], ['Plan', 3.2]] as const;
  const draft = t >= 5.2;
  const strike = P(f, 5.8, 0.4); const mine = 'Your order ships tomorrow morning.';
  const btn = {x: 760, y: 880}; const K5 = C.control - 40.1; const cp = P(f, K5 - 0.6, 0.5); const sent = t >= K5;
  return (
    <Day>
      {!draft && words.map(([w, a], i) => <Chip key={w} text={w} a={a} b={4.9} x={i % 2 ? 560 : 110} y={640 + Math.floor(i / 2) * 190} big />)}
      {!draft && <div style={{position: 'absolute', top: 400, left: 0, right: 0, textAlign: 'center', fontFamily: M, fontWeight: 300, fontSize: 62, color: '#59607A', opacity: P(f, 0.3) * (1 - P(f, 4.9, 0.2))}}>Part of my daily workflow</div>}
      {draft && (
        <>
          <Chip text="My edit" a={5.3} b={9.9} x={70} y={330} />
          <div style={{position: 'absolute', left: 70, right: 70, top: 470, background: '#fff', borderRadius: 48, padding: '50px 48px 150px', boxShadow: '0 40px 90px -30px rgba(10,36,99,.4)', fontFamily: UI, fontSize: 48, lineHeight: 1.4, color: INK, opacity: P(f, 5.2, 0.3), transform: `translateY(${(1 - P(f, 5.2, 0.3)) * 60}px)`}}>
            <div style={{fontFamily: M, fontWeight: 500, fontSize: 30, color: '#8A90A6', letterSpacing: 3, marginBottom: 22}}>REPLY TO CUSTOMER</div>
            Good afternoon, and thank you for your patience. I am sorry your order is late.{' '}
            <span style={{position: 'relative', color: strike > 0.5 ? '#A9AFBF' : INK, background: `rgba(240,26,16,${0.12 * Math.min(1, P(f, 5.5, 0.2))})`}}>
              It will reach you by Friday.
              <span style={{position: 'absolute', left: 0, top: '52%', height: 5, width: `${strike * 100}%`, background: RED}} />
            </span>{' '}
            <span style={{color: BLUE, fontWeight: 600}}>{typed(mine, t, 6.2, 7.0)}{t > 6.1 && t < 7.1 && <span>|</span>}</span>
            <div style={{position: 'absolute', right: 44, bottom: 40, background: sent ? '#fff' : NAVY, color: sent ? NAVY : '#fff', border: `5px solid ${NAVY}`, borderRadius: 999, padding: '20px 54px', fontFamily: M, fontWeight: 900, fontSize: 46, transform: `scale(${t > K5 && t < K5 + 0.2 ? 0.92 : 1})`}}>{sent ? 'Sent by me' : 'Send'}</div>
          </div>
          {t > K5 - 0.6 && <Cursor x={900 - (900 - btn.x) * cp} y={1700 - (1700 - btn.y) * cp} press={t > K5 && t < K5 + 0.2} />}
          <Ring at={K5} x={btn.x + 20} y={btn.y + 10} />
          <Big lines={['STILL IN', 'CONTROL']} a={K5 + 0.1} b={9.9} color={NAVY} top={1230} size={120} />
        </>
      )}
    </Day>
  );
};

/* ---------- Scene 6: back to the man, the message, the end card ---------- */
const S6: React.FC = () => {
  const f = useCurrentFrame(); const t = useT();
  const push = 1.02 + 0.07 * (f / F(10));
  const st: React.CSSProperties = {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${push})`, transformOrigin: '50% 38%'};
  const N = C.s6need - 50, SM = C.s6smarter - 50, D = C.s6discover - 50, E = C.s6what - 50; const end = P(f, E, 0.4);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={staticFile('ad/portrait.png')} style={st} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,11,30,.55) 0%, rgba(5,11,30,0) 38%, rgba(5,11,30,0) 62%, rgba(5,11,30,.75) 100%)'}} />
      {t < E && (
        <>
          <div style={{position: 'absolute', top: 150, left: 40, right: 40, textAlign: 'center', fontFamily: M, fontWeight: 300, fontSize: 64, color: '#fff', lineHeight: 1.2, opacity: P(f, 0.4) * (1 - P(f, N - 0.1, 0.2)), textShadow: '0 2px 18px rgba(0,0,0,.6)'}}>Sometimes, you don’t need<br /><span style={{fontWeight: 900}}>more hands.</span></div>
          <div style={{position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center', fontFamily: M, fontWeight: 300, fontSize: 58, color: '#fff', opacity: P(f, N) * (1 - P(f, D - 0.1, 0.2)), textShadow: '0 2px 18px rgba(0,0,0,.6)'}}>You need a</div>
          <Big lines={['SMARTER', 'WAY']} a={SM} b={D - 0.1} top={200} size={150} />
        </>
      )}
      {t >= E && (
        <div style={{position: 'absolute', top: 170, left: 50, right: 50, textAlign: 'center', fontFamily: M, fontWeight: 300, fontSize: 88, lineHeight: 1.1, color: '#fff', opacity: end, filter: `blur(${(1 - end) * 12}px)`, textShadow: '0 2px 20px rgba(0,0,0,.6)'}}>What would you<br />create with it?</div>
      )}
      <Img src={staticFile('ad/portrait_cut.png')} style={st} />
      {t >= D && t < E && (
        <div style={{position: 'absolute', top: 1330, left: 0, right: 0, textAlign: 'center', opacity: P(f, D, 0.2) * (1 - P(f, E - 0.15, 0.15))}}>
          <span style={{fontFamily: M, fontWeight: 300, fontSize: 60, color: '#fff'}}>Discover </span>
          <span style={{fontFamily: M, fontWeight: 900, fontSize: 96, color: '#fff'}}>Claude.</span>
        </div>
      )}
      {t >= E && (
        <>
          <div style={{position: 'absolute', top: 1440, left: 0, right: 0, textAlign: 'center', opacity: P(f, E + 0.9)}}>
            <span style={{fontFamily: M, fontWeight: 900, fontSize: 92, color: NAVY, background: '#fff', padding: '14px 46px 18px', borderRadius: 999}}>@jire_ai</span>
          </div>
          <div style={{position: 'absolute', top: 1640, left: 0, right: 0, textAlign: 'center', fontFamily: M, fontWeight: 500, fontSize: 30, color: 'rgba(255,255,255,.85)', opacity: P(f, E + 1.4)}}>Independent creator video · Made with AI</div>
        </>
      )}
      <AbsoluteFill style={{background: '#000', opacity: P(f, 9.8, 0.2)}} />
    </AbsoluteFill>
  );
};

/* ---------- captions: the script, 2-4 words at a time (Scenes 1-5; Scene 6 is on screen) ---------- */
const LINES: [number, number, string][] = [
  [0.4, 9.6, "Running a business isn't easy. Between customers, marketing, emails and endless paperwork, sometimes it feels like there aren't enough hours in the day."],
  [10.4, 19.2, 'Then one evening, while searching for a smarter way to work, I discovered something interesting. An AI assistant called Claude.'],
  [20.4, 29.4, 'I started by asking it to help me organise my business tasks, develop marketing ideas and write better responses to my customers.'],
  [30.4, 39.7, 'Suddenly, I had a clearer direction. My ideas were organised, my tasks were easier to plan, and I could focus on growing my business.'],
  [40.4, 49.6, 'From brainstorming to research, writing and planning, Claude became part of my daily workflow. And the best part? I was still in control.'],
];
const CAPS = vo.caps.filter((c) => c.line < 5).map((c) => ({s: c.s - 0.05, e: c.e + 0.18, text: c.text}));
void LINES;
const Captions: React.FC = () => {
  const f = useCurrentFrame(); const t = f / FPS;
  const c = CAPS.find((x) => t >= x.s && t < x.e);
  if (!c) return null;
  const p = prog(f, F(c.s), 5);
  const dark = t < 16 || (t >= 0 && t < 10);
  return (
    <div style={{position: 'absolute', top: 1560, left: 60, right: 60, textAlign: 'center', fontFamily: M, fontWeight: 500, fontSize: 52, color: dark ? '#fff' : INK, opacity: p, transform: `translateY(${(1 - p) * 10}px)`, textShadow: dark ? '0 2px 6px rgba(0,0,0,.95), 0 0 22px rgba(0,0,0,.9)' : '0 0 14px rgba(255,255,255,.9)'}}>{c.text}</div>
  );
};

export const AD_FRAMES = F(60);
export const ClaudeAd: React.FC = () => {
  useFonts();
  const seq = (a: number, b: number, el: React.ReactNode) => <Sequence from={F(a)} durationInFrames={F(b) - F(a)}>{el}</Sequence>;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {seq(0, 10, <S1 />)}
      {seq(10, 20, <S2 />)}
      {seq(20, 30, <S3 />)}
      {seq(30, 40, <S4 />)}
      {seq(40, 50, <S5 />)}
      {seq(50, 60, <S6 />)}
      <Captions />
      <Flash at={10} />
      <Flash at={30} />
      <Flash at={50} />
      <Audio src={staticFile('ad/sound.wav')} volume={0.9} />
      <Audio src={staticFile('ad/vo.wav')} />
    </AbsoluteFill>
  );
};
