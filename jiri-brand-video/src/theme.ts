// Every timing in this project comes from the music grid.
// Change BPM to match your licensed track and the whole video re-times.
export const FPS = 60;
export const BPM = 120;
export const W = 1080;
export const H = 1920;
export const BEAT = (FPS * 60) / BPM; // 30 frames at 120 BPM
export const BAR = BEAT * 4; // 120 frames = 2 s
/** Seconds on the 120 BPM grid -> frames (scales with BPM). */
export const s = (sec: number) => Math.round(sec * (120 / BPM) * FPS);

export const C = {
  navy: '#0A2463',
  glow: '#3D5A9E',
  off: '#F5F6F8',
  ink: '#0E1116',
  grey: '#D9DCE1',
  greyDark: '#B9BEC7',
  mid: '#6B7280',
  white: '#FFFFFF',
  black: '#000000',
  deep: '#06122E',
};
export const FONT = "Inter, 'Inter Display', system-ui, sans-serif";
