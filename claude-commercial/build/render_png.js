const {chromium} = require('playwright');
const fs = require('fs');
const spec = JSON.parse(fs.readFileSync('spec.json','utf8'));
const F = '/home/user/Jire/jire-brand-video/node_modules/@fontsource/montserrat/files/montserrat-latin-';
const b64 = (w) => fs.readFileSync(`${F}${w}-normal.woff2`).toString('base64');
const css = `@font-face{font-family:M;font-weight:300;src:url(data:font/woff2;base64,${b64(300)})}
@font-face{font-family:M;font-weight:500;src:url(data:font/woff2;base64,${b64(500)})}
@font-face{font-family:M;font-weight:900;src:url(data:font/woff2;base64,${b64(900)})}
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:M,Inter,sans-serif;overflow:hidden}`;
const tc = (t) => `${Math.floor(t/60)}:${(t%60).toFixed(1).padStart(4,'0')}`;
const looks = {dusk:['#3a2418','#b5653a'], night:['#070d22','#1b2c5c'], morning:['#dfe6ef','#f7f3ea'], screen:['#f4f1ea','#ffffff']};
const page = (body) => `<style>${css}</style>${body}`;
function placeholder(p){
  const [a,b] = looks[p.look]; const dark = p.look==='dusk'||p.look==='night'; const ink = dark?'#fff':'#0B1430';
  const what = p.kind==='flow'?'REPLACE WITH GOOGLE FLOW CLIP':p.kind==='rec'?'REPLACE WITH SCREEN RECORDING':'REPLACE WITH LAST FRAME OF 6A';
  return page(`<div style="width:1080px;height:1920px;background:linear-gradient(160deg,${a},${b});color:${ink};display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:90px;border:14px dashed ${dark?'rgba(255,255,255,.35)':'rgba(11,20,48,.3)'}">
  <div style="font-weight:500;font-size:44px;letter-spacing:6px;opacity:.75">SCENE ${p.scene} · PIECE ${p.n} OF 15</div>
  <div style="font-weight:900;font-size:300px;line-height:1;margin:40px 0 20px">${p.id}</div>
  <div style="font-weight:500;font-size:54px;line-height:1.25;max-width:860px">${p.title}</div>
  <div style="font-weight:900;font-size:64px;margin-top:70px">${tc(p.tl[0])} – ${tc(p.tl[1])}</div>
  <div style="font-weight:300;font-size:44px;margin-top:14px">clip length ${p.dur} s</div>
  <div style="font-weight:500;font-size:36px;margin-top:90px;padding:20px 34px;border-radius:999px;background:${dark?'rgba(255,255,255,.14)':'rgba(11,20,48,.08)'}">${what}</div></div>`);
}
function card(c){ return page(`<div style="position:absolute;left:76px;top:210px;width:928px;height:560px;border-radius:44px;background:#fff;box-shadow:0 40px 80px -20px rgba(0,0,0,.6);display:flex;flex-direction:column;justify-content:center;align-items:center;color:#0B1430;text-align:center;padding:50px;border:8px dashed rgba(11,20,48,.25)">
  <div style="font-weight:900;font-size:150px;line-height:1">${c.id}</div><div style="font-weight:500;font-size:44px;margin-top:16px">${c.title}</div><div style="font-weight:300;font-size:34px;margin-top:22px">REPLACE WITH SCREEN RECORDING (card)</div></div>`); }
function gfx(g){
  if(g.kind==='word'){ const lines=g.text.split('|'); const longest=Math.max(...lines.map(l=>l.length)); const size=Math.min(230,Math.floor(960/(longest*0.80)));
    return page(`<div style="position:absolute;top:250px;left:30px;right:30px;text-align:center;color:${g.color};font-weight:900;font-size:${size}px;line-height:.95;letter-spacing:${-size*0.05}px">${lines.join('<br>')}</div>`); }
  if(g.kind==='bubble') return page(`<div style="position:absolute;left:${g.pos[0]}px;top:${g.pos[1]}px;background:#fff;color:#0B1430;border-radius:34px;padding:22px 32px 22px 26px;font-weight:500;font-size:38px;box-shadow:0 18px 40px -12px rgba(0,0,0,.55);display:flex;align-items:center;gap:18px"><span style="width:22px;height:22px;border-radius:50%;background:#E5484D;display:inline-block"></span>${g.text}</div>`);
  if(g.kind==='chip') return page(`<div style="position:absolute;left:${g.pos[0]}px;top:${g.pos[1]}px;background:#fff;color:#0A2463;border-radius:999px;padding:20px 36px;font-weight:500;font-size:44px;box-shadow:0 16px 36px -12px rgba(0,0,0,.45)">${g.text}</div>`);
  if(g.kind==='flash') return page(`<div style="width:1080px;height:1920px;background:#fff"></div>`);
  if(g.kind==='lower') return page(`<div style="position:absolute;left:60px;top:1210px;display:flex;align-items:stretch"><div style="width:12px;background:#0A2463;border-radius:6px"></div><div style="background:rgba(255,255,255,.96);padding:18px 40px 20px 26px;border-radius:0 22px 22px 0;box-shadow:0 16px 36px -12px rgba(0,0,0,.4)"><div style="font-weight:900;font-size:60px;color:#0B1430;line-height:1.05">${g.text}</div><div style="font-weight:500;font-size:36px;color:#3D5A9E">${g.sub}</div></div></div>`);
  if(g.kind==='endcard') return page(`<div style="position:absolute;top:240px;left:60px;right:60px;text-align:center;color:#0A2463"><div style="font-weight:300;font-size:92px;line-height:1.08">What would you<br>create with it?</div></div>
   <div style="position:absolute;top:1500px;left:0;right:0;text-align:center"><span style="font-weight:900;font-size:96px;color:#fff;background:#0A2463;padding:14px 44px 18px;border-radius:999px">@jire_ai</span></div>
   <div style="position:absolute;top:1690px;left:0;right:0;text-align:center;font-weight:500;font-size:30px;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.7)">Independent creator video · Made with AI</div>`);
}
(async()=>{ const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:1080,height:1920}});
  const shot=async(html,out,transparent)=>{ await pg.setContent(html); await pg.evaluate(()=>document.fonts.ready); await pg.screenshot({path:out,omitBackground:transparent}); };
  fs.mkdirSync('cards',{recursive:true});
  for(const p of spec.pieces) await shot(placeholder(p),`cards/${p.file.replace('.mp4','.png')}`,false);
  for(const c of spec.cards) await shot(card(c),`../capcut-kit/1-placeholders/card_${c.id}.png`,true);
  for(const g of spec.gfx) await shot(gfx(g),`../capcut-kit/2-graphics/${g.file}.png`,g.kind!=='flash');
  await br.close(); console.log('png done'); })();
