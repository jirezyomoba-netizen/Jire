# Source analysis: @icyyfx_ ("icy")

The evidence behind `SKILL.md`. Read this when planning a **product launch** or a
**motion-graphic / text-led** video, or when asked where a method came from.

## Access log (2026-11-04)

| Source | Result |
|---|---|
| `x.com/icyyfx_/media` (profile media tab) | Redirects to X login. **Not accessible**, so I could not browse the account's full catalogue. |
| `x.com/mimithedesigner` | Not analysed. The user switched to @icyyfx_. |
| Individual post pages | Accessible when the user supplies the link. The video file was downloaded and inspected frame by frame. |

**How each video was inspected:** I extracted frames at 2–8 fps with timestamps burned in, and
ran scene-change detection. For audio I used a loudness contour (EBU R128, momentary) and a log-frequency
spectrogram. I can't hear the audio, so the audio notes describe measured structure only
(where energy is and where it drops). I make no claims about lyrics or instruments.

**Coverage so far: 1 video.** Formats with no examples yet: talking head, B-roll,
silhouette, and text over *live* footage. Their sections in `SKILL.md` are general craft
guidance and are marked as such. Add more posts to extend this file.

---

## Source index

| # | Link | Posted (UTC) | Format | Duration | Frame |
|---|---|---|---|---|---|
| 1 | https://x.com/icyyfx_/status/2116964927734972835 | 2026-11-01 18:45 (decoded from post ID) | Product launch, as a motion-graphic UI demo with text-led storytelling | 12.3 s | 1280×720, 16:9, 60 fps (highest variant served) |

Post text: "need better style?"

---

## Video 1: "need better style?" (BAIXO)

### Timeline: visible evidence only

| Time | Picture | Text on screen |
|---|---|---|
| 0.00–0.25 | Black frame with a blue radial glow. One word fades from a blurred cyan glow to sharp white. | "Need" |
| 0.50 | Hard switch to an off-white background. Words enter staggered ("style?" still fading in at 0.50). Six small rounded-square photos of people in outfits float to the right of the text. | "Need better style?" |
| 0.75–1.75 | Hold. Photos drift slightly. | same |
| 2.00 | Text blurs and turns blue, the background tints cyan and the photos scatter. | same, blurred |
| 2.25–3.00 | One outfit photo zooms in as a rounded card: white long-sleeve printed tee, grey jeans, bag. A blue glowing ring traces the card edge. A small callout box points to the tee with a product thumbnail. | Print on the shirt reads "…STOCKHOLM 1996" |
| 3.125 | Card blurs with an RGB-split (chromatic) smear and exits. | — |
| 3.25–4.50 | A pill-shaped input field ("+" icon) slides in from the right, with a mouse cursor. The text types out letter by letter and the field grows to two lines. | "Find me clothes similar to this tee" |
| 5.375–6.25 | Push-in to the field's send button (black circle, up arrow). Light-blue tint. The cursor becomes a pointing hand at about 6.125 and clicks. | — |
| 6.375–6.50 | Motion-blur transition. Product cards fly in from the right. | "All your" (blue) |
| 6.625–7.25 | Left: a line of text ("your favourites" blue, then settling to black). Right: a vertical, scrolling stack of product cards with names and prices. | "All your favourites"; cards: "Sprayed 1996 logo t-shirt $420", "Trompe-l'œil photocopy jeans $950", a third denim jacket card only partly legible |
| 7.33 | Text gone for a moment; cards remain. | — |
| 7.50–7.83 | Text re-enters. | "All in favourites" |
| 8.00–8.67 | Cards continue to drift. | "All in one place" |
| 8.83 | Whole frame motion-blurs out. | — |
| 9.00–10.67 | Bold black wordmark centred on off-white, slowly scaling down. | "BAIXO" |
| 10.83–12.30 | Hard cut to black. White glowing text starts large and soft, then shrinks and settles. | "icy.mp4" |

No hard cuts registered above a 0.25 scene threshold. Every scene change is a designed
transition: blur, smear, zoom, or the light/dark switch at 0.5 s and 10.83 s.

### Audio: measured
- Music bed is continuous from about 0.3 s (0.0–0.3 s is silent). Loud mix: mean volume −7.1 dB, peaks at 0 dB.
- Strong low-frequency energy through most of the video, with rhythmic transients visible across the spectrum.
- **Low-end dropouts at about 7.0–7.4 s, about 8.65 s and about 10.75 s.** Each falls just before a
  visual change: the text reset and re-entry (7.33–7.50), the blur-out to the wordmark (8.83) and
  the cut to the end card (10.83).
- Pitch-varying bands at roughly 1–3 kHz are present. They could be vocals or a lead synth; I can't tell which.
- No voiceover can be confirmed.

### Interpretation (my reading, not a fact)
- **First three seconds:** a one-word cold open on black, then a flip to a bright UI world and a
  question aimed at the viewer. By about 2.5 s one outfit is singled out. The hook works through a
  brightness reset plus a direct question, then gets specific fast.
- **Who it's for / what it says:** the on-screen copy speaks to shoppers who want style help. The
  message is: show it an outfit, ask in plain words, get matching items in one place. The
  "icy.mp4" sign-off suggests it also serves as a showcase of the creator's motion work. **I can't
  verify from the video whether BAIXO is a shipping product or a concept piece.**
- **Story development:** problem (question) → example input (outfit) → action (typed request + click)
  → payoff (results with prices) → benefit lines → name → signature. The product is *shown working*
  before it is named.
- **Pacing:** about 2 s per beat in the first half, slowing for the wordmark (about 1.8 s) and sign-off
  (about 1.5 s). The typed prompt (about 1.2 s) is the longest single action and works as the demo.
- **Visual–sound fit:** transitions coincide with dropouts in the music's low end. The edit appears
  built to the track.
- **Ending / CTA:** no explicit call to action, URL, handle prompt or "try it". The video ends on the
  creator signature. The opening and closing are both black with glowing type, so the end leads
  visually back into the start and the video loops cleanly.

### What is worth learning
1. **A contrast reset as the hook.** Dark open, flip to light within 0.5 s. A change in brightness is a
   cheap attention reset that doesn't depend on copy.
2. **Show the problem space, don't describe it.** A cloud of outfit photos stands in for "too many options".
3. **The input is the demo.** Typing a real request in real time explains how the product works without
   narration. The cursor becomes the protagonist.
4. **The push-in on the action button** turns a click into a small climax.
5. **The payoff carries proof-like detail.** Real-looking item names and prices make the result concrete.
6. **Text morphing between benefit lines** fits two ideas into one visual slot without a hard cut.
7. **Name after value.** The brand reveal comes once the viewer already understands the benefit.
8. **A small, consistent transition set** (blur, RGB smear, zoom) keeps a fast piece coherent.
9. **Bookended styling** makes the end lead back into the start for looping.

### What could be improved
- **The hook is generic.** "Need better style?" could open any fashion ad. A sharper version would name
  the specific situation (e.g. "you saw a tee you love, now what?").
- **Legibility on phones:** product names and prices on the result cards are very small in a
  1280-wide frame and only hold for about 2 s. They are likely unreadable on a phone feed.
- **16:9 in a vertical-first feed.** It may be cropped or appear small. A 9:16 or 4:5 cut would fill more screen.
- **No call to action.** Viewers learn the name but not what to do: download, waitlist, link, follow.
- **The "All in favourites" in-between state** (7.50–7.83) reads as a half-finished line if a viewer
  lands on it, so morphs are best kept short.
- **The match isn't made explicit.** The results include a t-shirt, but nothing on screen ties it back
  to the tee in the example image.

### Dependencies
- **Audience/brand:** none required. It explains itself without prior knowledge of BAIXO.
- **Production:** no camera, talent or location. It depends on **motion-design skill and UI mockups**
  (tools not identifiable from the video; I'm not guessing). For a non-designer, an easier version is a
  screen recording of a real product with cursor zooms and kinetic captions.
- **Not inferable:** budget, software, time spent, or how the post performed. Its techniques are
  observations, not proof of results.
