import sys, json, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
print([v for v in k.get_voices() if v[0] in "ab" and v[1]=="m"])
LINES = [
 "Running a business isn't easy. Between customers, marketing, emails, and endless paperwork... sometimes it feels like there aren't enough hours in the day.",
 "Then one evening, while searching for a smarter way to work, I discovered something interesting. An AI assistant, called Claude.",
 "I started by asking it to help me organise my business tasks, develop marketing ideas, and write better responses to my customers.",
 "Suddenly, I had a clearer direction. My ideas were organised, my tasks were easier to plan, and I could focus on growing my business.",
 "From brainstorming to research, writing and planning, Claude became part of my daily workflow. And the best part? I was still in control.",
 "Sometimes, you don't need more hands. You need a smarter way to work. Discover Claude. What would you create with it?",
]
voice = sys.argv[1]; speed = float(sys.argv[2])
only = [int(x) for x in sys.argv[3].split(",")] if len(sys.argv) > 3 else range(1, 7)
for i, t in enumerate(LINES, 1):
    if i not in only: continue
    a, sr = k.create(t, voice=voice, speed=speed, lang="en-gb")
    sf.write(f"{voice}_{i}.wav", a, sr); print(i, round(len(a)/sr, 2), "s")
