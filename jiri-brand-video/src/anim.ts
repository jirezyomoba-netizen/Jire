import {Easing, interpolate} from 'remotion';

// Fast out, slow settle: lands on the beat, then rests.
export const settle = Easing.bezier(0.16, 1, 0.3, 1);

export const prog = (f: number, at: number, dur: number, easing = settle) =>
  interpolate(f, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
