// Drop your clips into public/clips/ and put the file names here.
// While a value is null, a labelled placeholder card is shown instead.
export const CLIPS: Record<string, string | null> = {
  A: null, // Fix 1: shared look
  B: null, // Fix 1: shared look
  C: null, // Fix 1: shared look
  D: null, // Fix 2: most dynamic clip (first frame must work as a still)
  E: null, // Fix 3: the clip you have the real prompt for
  F: null, // Proof
  G: null, // Proof
  H: null, // Proof
};

// Text you still need to supply. Placeholders render in grey brackets.
export const COPY = {
  promptE: null as string | null, // the real prompt you used for clip E
  classWhen: null as string | null, // e.g. "Coming soon" or a date
  classLine: null as string | null, // one true line on what the class teaches
  proofTitles: [null, null, null, null, null] as (string | null)[],
};
