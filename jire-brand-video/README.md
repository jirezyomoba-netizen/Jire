# jire_ai: Brand Builders video

The 60 s and 15 s videos from the plan doc *60s Video Plan: Brand Builders*, built in
[Remotion](https://www.remotion.dev/). The style is animated app-style motion graphics in the manner of @icyyfx_.
Every move is locked to a 120 BPM grid (1 beat = 0.5 s, 1 bar = 2 s), and the soundtrack is composed on the same grid.

## Run it

```bash
npm install
npm run studio      # live preview in the browser
npm run render:60   # -> out/jire-brand-builders-60s.mp4 (1080x1920, 60 fps)
npm run render:15   # -> out/jire-brand-builders-15s.mp4
```

If Remotion can't download its own browser, point it at an installed headless Chrome:
`REMOTION_BROWSER=/path/to/chrome-headless-shell npm run render:60`.

## Clips

Your clips go in `public/clips/` (git-ignored). Each card slot in `src/clips.ts` names a file and the
second it starts from:

| Slot | File | Starts at | Used for |
| --- | --- | --- | --- |
| A, B, C | outfits.mp4 | 0 / 4.5 / 9.0 s | Fix 1, "One look": three outfits, one framing |
| D | studio.mp4 | 4.5 s | Fix 2, "Make it move": freezes on the jump, then plays |
| E | stream.mp4 | 0 s | Fix 3, the generated result |
| P1–P4 | stream / phone / studio / outfits | 4 / 2 / 9.5 / 11.5 s | Proof stack |
| Q1–Q3 | outfits / studio / stream | 9 / 4 / 0 s | 15 s cut |

To add more clips, convert them to H.264 MP4 (`ffmpeg -i in.mov -an -c:v libx264 -crf 18 -pix_fmt yuv420p out.mp4`)
and point a slot at them.

## Text still to supply

Set these in `COPY` in `src/clips.ts`. Until then they render as grey *[bracketed]* text:

- `promptE`: the prompt you typed to make the stream clip
- `classWhen`: "Coming soon" or a date
- `classLine`: one true sentence on what the class teaches
- `proofTitles`: a 2–4 word name for each of the 4 proof clips

## Soundtrack

`npm run music` composes the original soundtrack into `public/soundtrack-60.wav` and
`public/soundtrack-15.wav` (`scripts/compose-soundtrack.mjs`). It's in D minor at 120 BPM, with pads, a plucked arpeggio,
sub bass, drums, risers and UI sound effects on the exact frames. The drop lands on the send-button click,
there are one-beat dropouts before the big transitions, and it's mixed to about -14 LUFS. Run
`MASTER=0.5 npm run music` for a quieter mix. `npm run guide` still makes the bare timing click track.

## Changing the tempo

Set `BPM` in `src/theme.ts` to your track's tempo. All scene timings are written in 120 BPM grid
seconds and convert through `s()`, so the whole video re-times to stay on the beat. The total length
changes with it.

## Files

- `src/theme.ts`: tempo, frame rate, colours (navy #0A2463, glow #3D5A9E), font
- `src/components.tsx`: kinetic text, scribble, cursor, ripple, send button, clip cards
- `src/scenes.tsx`: one component per storyboard row
- `src/Main60.tsx`, `src/Cut15.tsx`: where each scene sits on the timeline
