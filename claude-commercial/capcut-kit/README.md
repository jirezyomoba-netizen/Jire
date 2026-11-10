# CapCut kit: The Businessman Who Discovered Claude (60 s, 9:16, 30 fps)

Watch `timeline-preview.mp4` first. It shows the whole edit with placeholders, graphics, captions
and the sound track. There is no voice in it yet (your recording goes in) and no music anywhere.

## Build the project once
1. New CapCut project, 9:16, 30 fps.
2. Add the 15 clips in `1-placeholders/` to the main track in number order (01 to 15), end to end.
3. Between clip 07 (3A) and clip 08 (4A) add a 1.0 s dissolve. Those two placeholders are each
   0.5 s longer than their slot so the dissolve does not shorten the film. Total must read 1:00.0.
4. Put `3-audio/sfx-and-ambience-60s.wav` on an audio track starting at 0:00. (Use the two
   separate files instead if you want to adjust effects and room tone independently.)
5. Add each PNG in `2-graphics/` as an overlay at the times in `timeline.csv`. They are full-frame
   and transparent, so leave position and scale at 100%.
6. Add `card_R3.png` and `card_R4.png` as overlays at 0:25.0 and 0:26.7.
7. Captions: import `4-captions/captions.srt` if your CapCut version supports it. If not, use
   auto-captions on your voice track and check the words against the file.

## Replace placeholders as the real pieces arrive
Select a placeholder and use CapCut's Replace (replace clip). The new clip takes the same position
and length, so nothing else on the timeline moves. Mute the replaced clip's own audio.
- Flow clips must be at least as long as the placeholder (clip length is printed on it).
- For 3A and 4A, keep the extra 0.5 s on the dissolve side.
- Piece 15 (END) is the last frame of clip 6A held for 2 s.

## Layers, top to bottom
captions · graphics "in front" · cut-out copy of the man · graphics "behind him" · main video.
The cut-out copy is made in CapCut: copy the clip above the "behind" graphics and apply auto cut-out.
`timeline.csv` lists which graphics go behind him and which in front.

## Timings that depend on your voice
Caption and large-word times follow the planned script timing. After adding your recorded voice,
nudge each caption and the Scene 1 words (CUSTOMERS, MARKETING, EMAILS, PAPERWORK) onto the spoken word.
