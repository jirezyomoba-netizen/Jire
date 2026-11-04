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

**Coverage so far: 4 posts, 3 distinct animations** (videos 3 and 4 share one animation).
All four are motion-graphic product/feature concepts with text-led storytelling. Formats
with no examples yet: talking head, B-roll, silhouette, and text over *live* footage. Their
sections in `SKILL.md` are general craft guidance and are marked as such. Add more posts to extend this file.

Post dates are decoded from each post ID (X IDs encode the creation time). The video files are not stored in this repo.

---

## Source index

| # | Link | Posted (UTC) | Post text | Format | Duration | Frame |
|---|---|---|---|---|---|---|
| 1 | https://x.com/icyyfx_/status/2116964927734972835 | 2026-11-01 18:45 | "need better style?" | Product launch: motion-graphic UI demo | 12.3 s | 1280×720, 16:9, 60 fps |
| 2 | https://x.com/icyyfx_/status/2105729319771222402 | 2026-10-01 18:39 | "imessage update" | Feature concept for an existing third-party app: UI demo plus kinetic type | 11.2 s | 720×720, 1:1, 60 fps |
| 3 | https://x.com/icyyfx_/status/2104983924476637507 | 2026-09-29 17:17 | "headphones on" | Repackage of #4: vertical frame with caption, the animation, and an edit-timeline screenshot (sound-design showcase) | 15.3 s | 720×1280, 9:16, 60 fps |
| 4 | https://x.com/icyyfx_/status/2103520781435375974 | 2026-09-25 16:23 | "need to save time ui animation" | Feature concept: UI demo (shortcut automation) | 15.3 s | 720×720, 1:1, 60 fps |

(Resolutions are the highest variants X served.)

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

---

## Video 2: "imessage update"

### Timeline: visible evidence only

| Time | Picture | Text on screen |
|---|---|---|
| 0.00–1.00 | Phone mock-up showing a lock screen (dark wallpaper with a purple ring). It rises and scales into frame. A message notification sits on the lock screen. | "Friend 1 / To you & the homies / Has anyone seen the new imessage update?" |
| 1.25 | The phone blurs and the notification flashes blue as the scene changes. | — |
| 1.50–2.25 | White background. One blue chat bubble, centred. | "What does it look like?" |
| 2.50–3.00 | The bubble squashes horizontally and shrinks into a blue text cursor. | — |
| 3.25–3.75 | Words type out beside the blue cursor, which drifts up the frame. | "share easier" |
| 4.00–4.50 | A message input bar slides in ("+" button, placeholder "iMessage", blue send arrow). The "+" stretches into a vertical pill. | "iMessage" |
| 5.00–5.25 | The pill becomes a menu with three toggles, a blue "Send" button and an "X". | "MUSIC", "PHOTOS", "LOCATION", "Send" |
| 5.50 | Blur-out. | — |
| 5.75–7.00 | Dark background with a blue glow at the bottom. Words build one by one, then the line scales up and slides sideways through the frame. | "See what friends share" |
| 7.25–8.50 | White. Rounded photo tiles of three different people appear one at a time, each with a small avatar badge. | — |
| 9.00–9.50 | The tiles land on a dark map card (place names visible) while a blue outline traces the card edge. | map labels |
| 10.00–11.20 | Black end card with a glow. | "icy.mp4" |

### Audio: measured
Continuous music bed from the first frame, with no low-end dropouts like video 1's. Mean volume −10.3 dB, peaks at 0 dB.
Strong transients at about 1.3 s and about 4.9 s fall on the phone→bubble change and the menu pop-open.

### Interpretation
- **First three seconds:** a familiar system object (a lock-screen notification) carries the hook as an
  in-world question from a "friend", then the next beat (a bubble) asks the question the viewer would ask.
  The question is spread across two characters instead of a caption.
- **Who it's for / what it says:** people who use that messaging app, and anyone who follows concept
  design. The message: a proposed update makes sharing music, photos and location quicker. **This is
  presented as an "update" for another company's product. Nothing on screen says it is official, so I
  read it as an unofficial concept.**
- **Story:** rumour (notification) → curiosity (question) → promise ("share easier") → mechanism (input bar
  → share menu) → benefit headline ("See what friends share") → social payoff (friends on a map) → signature.
- **Pacing:** about 1–1.5 s per beat, the fastest of the set. The kinetic-type line (about 1.25 s) is the only
  full-screen text.
- **Ending / CTA:** no CTA. It ends on the signature.

### Worth learning
1. **Let in-world UI ask the question** (a notification, a chat bubble). The hook doesn't feel like an ad.
2. **Morph one element into the next** (bubble → cursor, "+" → menu). Continuity carries the eye with no cuts.
3. **Promise, then mechanism, then benefit, then people.** It finishes on the human outcome (friends on a map), not the feature.

### Could be improved
- The menu labels (MUSIC/PHOTOS/LOCATION) are very small in a 720-pixel square and are on screen for under a second.
- "share easier" is vague. A concrete action ("send your location in one tap") would be clearer.
- No signal that it's a concept, and no CTA.

### Dependencies
- **Leans on brand recognition** of an existing app, which brings borrowed attention and familiarity. That doesn't
  transfer to an unknown product, and using another company's name and UI in your own marketing carries
  trademark/confusion risk. Label concept work as a concept.
- Needs motion-design skill and UI mock-ups (tools not identifiable).

---

## Video 4: "need to save time ui animation" (analysed before #3, which reuses it)

### Timeline: visible evidence only

| Time | Picture | Text on screen |
|---|---|---|
| 0.00–0.25 | Dark navy gradient with small "star" specks. Words slide in staggered. | "Need to save time?" |
| 0.50 | "save" gets a light highlight and "time?" a solid blue text-selection box. | same |
| 0.75–1.00 | A hand-drawn-style scribble circles/underlines "save". Text starts to blur out. | same |
| 1.25–1.75 | White. A rounded card scales in as words assemble. | "What do you want your shortcut to do?" |
| 2.00–2.50 | A pill-shaped reply chip appears under the card with a small send arrow. | "When I leave work message the gc" |
| 2.75–3.00 | Hard push-in on the end of the chip. A cyan ripple ring pulses around the send arrow. | "…message the gc" |
| 3.50–4.50 | A chat message appears (avatar, name "Icy", time stamp, a jokey one-line message with crude wording), then a map card ("The White House / Auckland") and reaction chips (🔥 3, 😂 1). The card tilts in 3D. | message text, map labels |
| 5.00 | The card spins away and blurs into a grey tile. | — |
| 5.50–6.00 | A dark widget card. | "Currently around"; "No.friends", "No.friends 2", "No.friends 3" with "…ago" times |
| 6.50–7.00 | The widget collapses into a dark notification pill. | "No.friends / are you coming?" |
| 7.50–13.50 | **The section from 1.25 s replays** (prompt card → chip → push-in → message + map → widget → notification). The opening question does not replay. | same as above |
| 14.00–15.30 | Black end card with a glow. The text exits with horizontal motion blur. | "icy.mp4" |

### Audio: measured
Continuous music bed with strong low end throughout and many short transients. Mean volume −10.4 dB, peaks at 0 dB.

### Interpretation
- **First three seconds:** a question hook aimed at the viewer, with type treated like a document (selection
  highlight, scribble). By 2.5 s the viewer sees the input that answers it.
- **Who it's for / what it says:** people who repeat the same phone task. The message: set up a plain-language
  shortcut ("when I leave work, message the group chat") and the phone does it, so your friends know.
  **I can't tell whether this is a real product. It reads as a concept.**
- **Story:** pain (question) → setup (natural-language rule) → trigger (send) → automatic outcome
  (message + location) → social result (friends nearby, "are you coming?") → **repeat** → signature.
- **Repeating the demo:** showing the flow twice gives a second chance to catch the small text, and it
  works like a loop inside the video.
- **Ending / CTA:** none. It ends on the signature.

### Worth learning
1. **A natural-language input as the demo** (also in #1). The viewer reads the feature as a sentence they'd say.
2. **Annotate the hook's key word** (highlight, scribble) to steer attention within the first second.
3. **End the demo on a human reaction** ("are you coming?"), not on the UI.
4. **Repeat a short demo** when its details are small or fast.

### Could be improved
- Most UI text after 3 s is tiny in a 720-pixel square.
- The crude joke in the mock message may not suit every brand. Placeholder copy is still on-brand copy.
- The replay doubles the length without new information. A 7–8 s cut would also work.

### Dependencies
No brand recognition needed. Motion-design skill and UI mock-ups required.

---

## Video 3: "headphones on" (repackage of #4)

### Timeline: visible evidence only

| Time | Picture | Text on screen |
|---|---|---|
| 0.00–15.30 (whole video) | **Vertical 9:16 layout on white.** Top: a fixed caption. Middle: video #4's animation in a rounded square, following #4's sequence and timing (question hook from 0 s, prompt card at about 1.25 s, replay from about 7.5 s, "icy.mp4" end card at about 14 s). Bottom: a static screenshot of an edit timeline. | Caption: "headphones on 🎧" |
| bottom panel (checked at 1 s and 14 s, unchanged) | One video track with two clips named "need to save time.mov" plus a short end clip. Nine audio tracks (A1–A9) packed with staggered clips, many marked "fx". | clip names, track labels |

### Audio: measured (and compared with #4)
Quieter and more dynamic than #4: mean volume −17.5 dB vs −10.4 dB, peaks at 0 dB. The low end drops to near-silence in
places (about 3.5–5.2 s) and there are many sharp, isolated transients. The spectrogram pattern from about
0.9–7 s repeats from about 7.9–14 s, matching the replayed visuals. **So the soundtrack isn't identical to #4's.
It's a different mix or edit.** I can't tell from the audio alone which sounds are effects and which are music.

### Interpretation
- **First three seconds:** the hook is an *instruction* ("headphones on"). It tells the viewer how to watch
  (with sound) before showing anything. The animation's own question hook still plays underneath.
- **Who it's for / what it says:** other designers and editors, plus potential clients. The message: the
  sound is designed in detail. The nine stacked audio tracks are the visible proof of effort.
- **Repurposing:** the same animation was re-posted 4 days later with a new frame, a new caption and a
  process screenshot. One piece of work becomes two posts.
- **Ending / CTA:** none beyond the signature. The caption works as an instruction, not a CTA.

### Worth learning
1. **Repackage, don't remake:** a new aspect ratio + new caption + one behind-the-scenes element = a new post.
2. **Show the work as proof** (the timeline). Visible craft builds credibility without claiming expertise in words.
3. **A viewing instruction as the hook** suits sound-led pieces.

### Could be improved
- The animation sits in a small square, so the UI text is even smaller than in #4.
- The timeline is a static screenshot. A moving playhead would link each sound to what's on screen.

### Dependencies
Needs an existing finished piece and real process material. Speaks most to people who already value craft (peers, clients).

---

## Cross-video patterns (videos 1–4)

| # | Pattern | Seen in | When it's useful | Limits | Depends on |
|---|---|---|---|---|---|
| P1 | **Question hook in the first second** ("Need …?" or an in-world question) | 1, 2, 4 (3 via #4) | Problem-solving products. Quick to understand. | Becomes generic unless the situation is specific. The weakest part in 1 and 4. | Nothing |
| P2 | **Dark open → bright UI world** | 1, 4 (2: dark lock screen → white) | Attention reset. Separates "problem" from "solution". | Loses impact if every post does it. | Nothing |
| P3 | **Natural-language or typed input as the demo** | 1, 2, 4 | Software, AI, search and automation features. Explains without voiceover. | Needs a real, demonstrable flow. Small text needs time. | A product with an input step |
| P4 | **Push-in + click/ripple on the action button** | 1, 4 (2: "Send" in menu) | Gives a climax to an otherwise flat UI. | Overuse feels mechanical. | Nothing |
| P5 | **Element-to-element morphs instead of cuts** | 1, 2, 4 | Smooth continuity in short pieces. | Needs motion-design skill. A phone-edit version uses zooms/whips. | Skill/time |
| P6 | **Outcome shown socially or concretely** (prices, friends on a map, "are you coming?") | 1, 2, 4 | Makes the benefit human and specific. | Mock data must not pass as real results. | Real or clearly illustrative data |
| P7 | **Consistent signature end card** | 1, 2, 3, 4 | Recognisable series identity and portfolio branding. | Takes the slot where a CTA would go. | Building recognition over time |
| P8 | **Minimal lowercase caption echoing the hook** | 1, 2, 3, 4 | Lets the video carry the message. Fits a design-portfolio voice. | Gives no context or CTA for new viewers. | An audience that already follows the creator helps |
| P9 | **Short duration (11–15 s) with a looping end** | 1, 2, 3, 4 | Rewatches and feed pace. | Little room for proof or a CTA. | Nothing |
| P10 | **Repackaging one piece** (new ratio + caption + process proof) | 3 | Doubles output from one piece of work. Shows craft. | Repeats content for existing followers. | An existing finished piece |
| P11 | **Concept redesign of a known product** | 2 | Borrowed attention. Portfolio pieces. | Trademark/confusion risk. Doesn't transfer to unknown products. | **Someone else's brand recognition** |

**Consistent gaps across the set:** no explicit CTA (0 of 4), UI text too small for phones (all 4),
and generic question wording (1 and 4). The skill corrects these by default.

**Not inferable:** tools, budget, time spent, or whether any post drove sales or sign-ups. View counts were not
used, and no technique is assumed to have caused performance.
