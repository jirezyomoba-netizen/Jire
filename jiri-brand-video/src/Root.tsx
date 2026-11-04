import React from 'react';
import {Composition} from 'remotion';
import {Cut15} from './Cut15';
import {Main60} from './Main60';
import {FPS, H, s, W} from './theme';

export const Root: React.FC = () => (
  <>
    <Composition id="BrandBuilders60" component={Main60} durationInFrames={s(60)} fps={FPS} width={W} height={H} />
    <Composition id="BrandBuilders15" component={Cut15} durationInFrames={s(15)} fps={FPS} width={W} height={H} />
  </>
);
