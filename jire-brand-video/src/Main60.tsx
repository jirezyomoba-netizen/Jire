import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {COPY} from './clips';
import {BigSlide, ClassNote, EndCard, FixLook, FixMove, FollowScene, Hook, PromptScene, Proof, TemplateGrid} from './scenes';
import {s} from './theme';

/** A scene placed from `a` to `b` seconds on the 120 BPM grid. */
const At: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => (
  <Sequence from={s(a)} durationInFrames={s(b) - s(a)}>
    {children}
  </Sequence>
);

export const MUSIC_60 = 'soundtrack-60.wav'; // original track from scripts/compose-soundtrack.mjs

export const Main60: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <At a={0} b={4}>
      <Hook
        line1={[{text: 'Posting', at: 0}, {text: 'daily.', at: 1}]}
        line2={[{text: 'Still', at: 2}, {text: 'forgettable?', at: 2.5}]}
        scribbleAt={3}
      />
    </At>
    <At a={4} b={10}>
      <TemplateGrid lines={[{text: 'Same templates.', at: 0}, {text: 'Same scroll.', at: 2}]} stopAt={4} endAt={5.6} />
    </At>
    <At a={10} b={14.25}>
      <PromptScene text="Make my brand impossible to scroll past" morph={[0, 0.5]} type={[0.5, 3.5]} cursor={[2.6, 3.4]} pushIn={3.5} click={4} />
    </At>
    <At a={14.25} b={16}>
      <BigSlide text="3 fixes." dur={1.75} />
    </At>
    <At a={16} b={24}>
      <FixLook />
    </At>
    <At a={24} b={32}>
      <FixMove />
    </At>
    <At a={32} b={40}>
      <PromptScene
        from="none"
        barY={760}
        title={{lines: ['3. Let AI do the', 'heavy lifting'], at: 0}}
        text={COPY.promptE ?? '[the prompt you used for this clip]'}
        placeholder={COPY.promptE == null}
        morph={[0, 0]}
        type={[0.5, 2.5]}
        cursor={[2.1, 2.8]}
        pushIn={2.5}
        click={3}
        result={{at: 4, shimmer: [3.5, 4], clip: 'E'}}
      />
    </At>
    <At a={40} b={50}>
      <Proof clips={['P1', 'P2', 'P3', 'P4']} />
    </At>
    <At a={50} b={54}>
      <ClassNote />
    </At>
    <At a={54} b={58}>
      <FollowScene textAt={1} pushIn={2} click={2.5} />
    </At>
    <At a={58} b={60}>
      <EndCard />
    </At>
    <Audio src={staticFile(MUSIC_60)} />
  </AbsoluteFill>
);
