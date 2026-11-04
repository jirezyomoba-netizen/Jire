// Your clips live in public/clips/. Each card slot names a file and the second it starts from.
// Set a slot to null to show a labelled placeholder instead.
export type ClipSpec = {file: string; start: number} | null;

export const CLIPS: Record<string, ClipSpec> = {
  // Fix 1 "One look, every post": one framing, three outfits
  A: {file: 'outfits.mp4', start: 0}, // puffer jacket
  B: {file: 'outfits.mp4', start: 4.5}, // shirt and shorts
  C: {file: 'outfits.mp4', start: 9.0}, // brown jacket
  // Fix 2 "Make it move": freezes on the jump, then plays
  D: {file: 'studio.mp4', start: 4.5},
  // Fix 3 "Let AI do the heavy lifting": the generated result
  E: {file: 'stream.mp4', start: 0},
  // Proof stack
  P1: {file: 'stream.mp4', start: 4.0},
  P2: {file: 'phone.mp4', start: 2.0},
  P3: {file: 'studio.mp4', start: 9.5},
  P4: {file: 'outfits.mp4', start: 11.5},
  // 15 s cut, one card per bar
  Q1: {file: 'outfits.mp4', start: 9.0},
  Q2: {file: 'studio.mp4', start: 4.0},
  Q3: {file: 'stream.mp4', start: 0},
};

// Text only you can supply. While a value is null it renders as grey [bracketed] text.
export const COPY = {
  promptE: 'Wide shot: a man in robes walks by a desert stream' as string | null, // the prompt you typed to make the stream clip
  classWhen: 'Coming in December' as string | null, // e.g. "Coming soon" or "Starts 1 Dec"
  classLine: 'Learn to make entertaining brand videos and commercials with AI.' as string | null, // one true sentence on what the class teaches
  proofTitles: ['Desert walk', 'On the call', 'Studio shoot', 'Outfit drop'] as (string | null)[], // a 2-4 word name for each proof clip
};
