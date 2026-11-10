import json, csv, re, os
from spec import *
K = "../capcut-kit"
for d in ["1-placeholders", "2-graphics", "3-audio", "4-captions"]: os.makedirs(f"{K}/{d}", exist_ok=True)
tc = lambda t: f"{int(t//60)}:{t%60:05.2f}"
def fname(p): return f"{p['n']:02d}_S{p['scene']}_{p['id']}"
for p in PIECES:
    p["file"] = fname(p) + ".mp4"; p["dur"] = round(p["tl"][1]-p["tl"][0] + p.get("pad_head",0) + p.get("pad_tail",0), 3)
json.dump(dict(pieces=PIECES, cards=CARDS, gfx=GFX, sfx=SFX, amb=AMBIENCE, lines=LINES), open("spec.json","w"), indent=1)

# captions: 2-4 words, break at punctuation, time shared by word count
caps = []
for L in LINES:
    words = L["text"].split(); groups=[]; cur=[]
    for w in words:
        cur.append(w)
        if len(cur) >= 4 or w[-1] in ".?!," : groups.append(cur); cur=[]
    if cur: groups.append(cur)
    # merge single-word groups into neighbours when short
    merged=[]
    for g in groups:
        if merged and len(g)==1 and len(merged[-1])<=3 and merged[-1][-1][-1] not in ".?!": merged[-1]+=g
        else: merged.append(g)
    a,b = L["tl"]; n=len(words); t=a
    for g in merged:
        d=(b-a)*len(g)/n; caps.append((t, t+d-0.03, " ".join(g), L["scene"])); t+=d
def srt_t(t): 
    ms=int(round(t*1000)); return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"
with open(f"{K}/4-captions/captions.srt","w") as f:
    for i,(a,b,txt,_) in enumerate(caps,1): f.write(f"{i}\n{srt_t(a)} --> {srt_t(b)}\n{txt}\n\n")
json.dump(caps, open("caps.json","w"))

rows=[("Track","Start","End","Length (s)","Item","File","Notes")]
add=lambda *r: rows.append(r)
for p in PIECES:
    a,b=p["tl"]; note=p["title"]+". Out: "+p["join"]
    if p.get("pad_tail"): note+=f". Placeholder is {p['dur']} s: extra 0.5 s tail for the dissolve"
    if p.get("pad_head"): note+=f". Placeholder is {p['dur']} s: extra 0.5 s head for the dissolve"
    add("1 Main video",tc(a),tc(b),b-a,f"{'Flow clip' if p['kind']=='flow' else 'Screen recording' if p['kind']=='rec' else 'Held frame'} {p['id']}", "1-placeholders/"+p["file"], note)
for c in CARDS: add("3 Overlay: cards",tc(c["tl"][0]),tc(c["tl"][1]),round(c["tl"][1]-c["tl"][0],2),f"Recording card {c['id']}",f"1-placeholders/card_{c['id']}.png",c["title"]+". 86% width, rounded, slide in from right 8 frames, out to left")
for s,(a,b) in [(1,(2.0,10.0)),(2,(10.0,13.0)),(4,(30.0,34.0)),(6,(50.0,60.0))]:
    add("2 Overlay: cut-out of the man",tc(a),tc(b),b-a,f"Copy of the clip with auto cut-out (Scene {s})","(made in CapCut)","Sits above the 'behind' graphics. Split at the same frames as the main clip. Feather 2-4")
for g in GFX:
    a,b=g["tl"]; label={"word":"Large word","bubble":"Notification bubble","chip":"Chip","flash":"White flash","lower":"Lower third","endcard":"End card"}[g["kind"]]
    txt=g.get("text","").replace("|"," ")
    anim={"word":"Fade+scale in 6 frames, 3% slow scale-up, fade out 6 frames","bubble":"Pop in 5 frames, fade out together at 0:08","chip":"Pop in 5 frames, fade out 6 frames","flash":"Opacity 0-100-0 over 6 frames","lower":"Slide in from left 8 frames, out 8 frames","endcard":"Fade in 8 frames, hold"}[g["kind"]]
    add("4 Graphics (behind him)" if g["layer"]=="behind" else "5 Graphics (in front)",tc(a),tc(b),round(b-a,2),f"{label}: {txt}".rstrip(": "),f"2-graphics/{g['file']}.png",anim)
for a,b,txt,sc in caps: add("6 Captions",tc(a),tc(b),round(b-a,2),txt,"4-captions/captions.srt",f"Scene {sc}. Re-time to your real voice")
for L in LINES: add("7 Dialogue",tc(L["tl"][0]),tc(L["tl"][1]),round(L["tl"][1]-L["tl"][0],2),f"{L['kind']}: {L['text']}",f"(your recording) vo_scene{L['scene']}.wav","Peaks near -6 dB")
for t,typ,ln,db,pan,note in sorted(SFX): add("8 Sound effects",tc(t),tc(t+ln),ln,note,"3-audio/sfx-only-60s.wav",f"{db} dB, pan {'centre' if pan==0 else ('right' if pan>0 else 'left')}")
for A in AMBIENCE: add("9 Ambience",tc(A["tl"][0]),tc(A["tl"][1]),round(A["tl"][1]-A["tl"][0],2),A["note"],"3-audio/ambience-only-60s.wav",f"{A['db']} dB, 0.5-1 s crossfades")
add("10 Music","0:00.00","1:00.00",60,"None","","No background music anywhere")
csv.writer(open(f"{K}/timeline.csv","w",newline="")).writerows(rows)
print(len(rows)-1,"timeline rows;",len(caps),"captions")
