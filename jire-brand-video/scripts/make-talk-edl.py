"""Build the cut list and caption timeline for the talking-head edit from word timestamps.
Usage: python3 make-talk-edl.py transcript.json out.json"""
import json, sys

words = [w for s in json.load(open(sys.argv[1])) for w in s["words"]]
for w in words:
    w["w"] = w["w"].strip()
    # Whisper can stretch a word's end into the pause after it: cap it by word length
    w["e"] = min(w["e"], w["s"] + 0.22 + 0.075 * len(w["w"]))

# Spelling fixes for captions (what was said, spelled the way the brand uses it)
FIX = {26: "Jire", 3: "jobs?"}
for i, t in FIX.items():
    words[i]["w"] = t

# Kept phrases as inclusive word-index ranges, in order
KEEP = [(0, 6), (7, 22), (23, 34), (35, 45), (46, 47), (71, 72), (73, 82), (83, 89), (90, 106),
        (109, 118), (119, 138), (149, 159), (160, 171), (185, 198), (226, 234), (235, 239),
        (240, 253), (262, 270), (271, 278), (291, 298), (300, 311), (336, 336)]
MAX_GAP = 0.45  # split a kept phrase where the speaker pauses longer than this

def pieces(a, b):
    out, start = [], a
    for i in range(a, b):
        if words[i + 1]["s"] - words[i]["e"] > MAX_GAP:
            out.append((start, i)); start = i + 1
    out.append((start, b))
    return out

segs, t = [], 0.0
for a, b in KEEP:
    for x, y in pieces(a, b):
        src_in = max(0.0, words[x]["s"] - 0.07)
        nxt = words[y + 1]["s"] if y + 1 < len(words) else words[y]["e"] + 0.3
        src_out = min(words[y]["e"] + 0.12, nxt - 0.02)
        segs.append({"in": round(src_in, 3), "out": round(src_out, 3), "at": round(t, 3), "w": [x, y]})
        t += src_out - src_in

seg_of = {i: k for k, sg in enumerate(segs) for i in range(sg["w"][0], sg["w"][1] + 1)}
# Map each kept word to the new timeline
cap_words = []
for sg in segs:
    for i in range(sg["w"][0], sg["w"][1] + 1):
        w = words[i]
        cap_words.append({"i": i, "w": w["w"], "s": round(sg["at"] + w["s"] - sg["in"], 3),
                          "e": round(sg["at"] + min(w["e"], sg["out"]) - sg["in"], 3)})

# Join split tokens like "go" + "-to" into one caption word
merged = []
for cw in cap_words:
    if cw["w"].startswith("-") and merged:
        merged[-1]["w"] += cw["w"]; merged[-1]["e"] = cw["e"]
    else:
        merged.append(cw)
cap_words = merged

# Caption groups: up to 4 words, break after punctuation
groups, cur = [], []
for cw in cap_words:
    cur.append(cw)
    nxt = cap_words[cap_words.index(cw) + 1]["w"].lower() if cw is not cap_words[-1] else ""
    soft_break = len(cur) >= 3 and nxt in {"and", "i'm", "but", "or", "so", "to", "that"}
    seg_end = cw is not cap_words[-1] and seg_of[cw["i"]] != seg_of[cap_words[cap_words.index(cw) + 1]["i"]] and cap_words[cap_words.index(cw) + 1]["i"] != cw["i"] + 1
    if len(cur) >= 4 or soft_break or seg_end or cw["w"][-1:] in ".?!," or cw is cap_words[-1]:
        groups.append(cur); cur = []
json.dump({"duration": round(t, 3), "segments": segs, "words": cap_words,
           "groups": [{"s": g[0]["s"], "e": g[-1]["e"], "words": g} for g in groups]},
          open(sys.argv[2], "w"), indent=1)
print(f"{len(segs)} segments, {t:.2f}s total, {len(groups)} caption groups")
