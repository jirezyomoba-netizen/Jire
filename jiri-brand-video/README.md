# jiri_ai: Brand Builders video

The 60 s and 15 s videos from the plan doc *60s Video Plan: Brand Builders*, built in
[Remotion](https://www.remotion.dev/). The style is animated app-style motion graphics in the manner of @icyyfx_.
Every move is locked to a 120 BPM grid (1 beat = 0.5 s, 1 bar = 2 s).

## Run it

```bash
npm install
npm run studio      # live preview in the browser
npm run render:60   # -> out/jiri-brand-builders-60s.mp4 (1080x1920, 60 fps)
npm run render:15   # -> out/jiri-brand-builders-15s.mp4
```

If Remotion can't download its own browser, point it at an installed headless Chrome:
`REMOTION_BROWSER=/path/to/chrome-headless-shell npm run render:60`.

## What you still need to add

| What | Where |
| --- | --- |
| Your 8 clips (A–H) | Copy them into `public/clips/` and set the file names in `src/clips.ts`. Until then each card shows a labelled placeholder |
| The real prompt for clip E | `COPY.promptE` in `src/clips.ts` |
| Class date or "coming soon", and one true line on what it teaches | `COPY.classWhen`, `COPY.classLine` |
| Proof card titles | `COPY.proofTitles` |
| Licensed music (about 120 BPM, no vocals) | Put it in `public/` and change `MUSIC_60` / `MUSIC_15` in `src/Main60.tsx` and `src/Cut15.tsx` |

Anything still missing renders as grey *[bracketed]* text, so it can't be mistaken for final copy.

## About the guide tracks

`npm run guide` writes `public/guide-60.wav` and `public/guide-15.wav`. These are **timing
guides, not music**. They hold a kick on every beat, a drop at 14 s (6 s in the 15 s cut), one-beat
dropouts before the big transitions, and clicks, typing ticks, whooshes and pops on the exact frames
the visuals hit. Use them to check the sync, then replace them with your licensed track. Line the
licensed track up so its drop lands on 14.0 s.

## Changing the tempo

Set `BPM` in `src/theme.ts` to your track's tempo. All scene timings are written in 120 BPM grid
seconds and convert through `s()`, so the whole video re-times to stay on the beat. The total length
changes with it.

## Files

- `src/theme.ts`: tempo, frame rate, colours (navy #0A2463, glow #3D5A9E), font
- `src/components.tsx`: kinetic text, scribble, cursor, ripple, send button, clip cards
- `src/scenes.tsx`: one component per storyboard row
- `src/Main60.tsx`, `src/Cut15.tsx`: where each scene sits on the timeline
