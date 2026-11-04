import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {ClipPerBar, EndCard, FollowScene, Hook, PromptScene, TemplateGrid} from './scenes';
import {s} from './theme';

const At: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => (
  <Sequence from={s(a)} durationInFrames={s(b) - s(a)}>
    {children}
  </Sequence>
);

export const MUSIC_15 = 'soundtrack-15.wav'; // original track from scripts/compose-soundtrack.mjs

export const Cut15: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <At a={0} b={2}>
      <Hook line2={[{text: 'Still', at: 0}, {text: 'forgettable?', at: 0.5}]} scribbleAt={1} />
    </At>
    <At a={2} b={4}>
      <TemplateGrid lines={[{text: 'Same scroll.', at: 0}]} stopAt={1} scrollPx={420} />
    </At>
    <At a={4} b={6.25}>
      <PromptScene text="Make my brand impossible to scroll past" morph={[0, 0.25]} type={[0.25, 1.4]} cursor={[1.0, 1.45]} pushIn={1.5} click={2} />
    </At>
    <At a={6.25} b={12}>
      <ClipPerBar
        items={[
          {clip: 'Q1', label: 'One look'},
          {clip: 'Q2', label: 'Make it move'},
          {clip: 'Q3', label: 'AI does the work'},
        ]}
      />
    </At>
    <At a={12} b={14}>
      <FollowScene textAt={0} pushIn={0.5} click={1} lines={["Follow so you don't", 'miss the class.']} />
    </At>
    <At a={14} b={15}>
      <EndCard />
    </At>
    <Audio src={staticFile(MUSIC_15)} />
  </AbsoluteFill>
);
