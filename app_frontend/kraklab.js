/* =============== SON (Web Audio, hors-ligne) =============== */
let AC=null,muted=false;
function ac(){if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();}if(AC.state==='suspended')AC.resume();return AC;}
window.addEventListener('pointerdown',()=>{if(!muted)ac();},{once:false});
function tone(freq,dur,type,vol,slideTo){if(muted)return;const c=ac();const o=c.createOscillator(),g=c.createGain();
  o.type=type||'sine';o.frequency.value=freq;if(slideTo)o.frequency.exponentialRampToValueAtTime(slideTo,c.currentTime+dur);
  g.gain.setValueAtTime((vol||.2),c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+dur);
  o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+dur);}
function noise(dur,vol,filterFreq){if(muted)return;const c=ac();const n=Math.floor(c.sampleRate*dur);
  const buf=c.createBuffer(1,n,c.sampleRate),d=buf.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
  const s=c.createBufferSource();s.buffer=buf;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=filterFreq||1000;
  const g=c.createGain();g.gain.value=vol||.3;s.connect(f).connect(g).connect(c.destination);s.start();}
const sfx={
  pour(){tone(420,.18,'sine',.12,260);},
  click(){tone(300,.05,'square',.08);},
  pop(){tone(180,.12,'sine',.4,60);noise(.1,.25,800);},
  precip(){tone(700,.25,'sine',.15,500);},
  fizz(){noise(.6,.25,2500);},
  spark(){noise(.08,.4,5000);tone(900,.05,'sawtooth',.1);},
  bubble(){tone(500+Math.random()*200,.08,'sine',.06,300);},
  boom(){const c=ac();noise(.7,.6,500);tone(90,.6,'sine',.5,30);tone(140,.4,'triangle',.3,40);if(navigator.vibrate)navigator.vibrate(120);},
};
function toggleMute(){muted=!muted;document.getElementById('mute').textContent=muted?'🔇':'🔊';}

/* =============== FUMÉE / ÉTINCELLES / SECOUSSE =============== */
function smokeBurst(cx,cy,n,color){for(let i=0;i<(n||14);i++){const p=document.createElement('div');
  p.style.cssText=`position:fixed;left:${cx}px;top:${cy}px;width:${14+Math.random()*22}px;height:${14+Math.random()*22}px;
   border-radius:50%;background:${color||'rgba(120,130,135,.55)'};pointer-events:none;z-index:9000;filter:blur(3px);transition:transform 1.4s ease-out,opacity 1.4s;`;
  document.body.appendChild(p);const ang=Math.random()*Math.PI*2,dist=40+Math.random()*120;
  requestAnimationFrame(()=>{p.style.transform=`translate(${Math.cos(ang)*dist}px,${Math.sin(ang)*dist-90}px) scale(${1.4+Math.random()})`;p.style.opacity='0';});
  setTimeout(()=>p.remove(),1450);}}
function sparkBurst(cx,cy,n){for(let i=0;i<(n||16);i++){const s=document.createElement('div');
  s.style.cssText=`position:fixed;left:${cx}px;top:${cy}px;width:4px;height:4px;border-radius:50%;
   background:${Math.random()>.5?'#ffd23f':'#ff8a00'};pointer-events:none;z-index:9001;box-shadow:0 0 6px #ffae2e;transition:transform .6s ease-out,opacity .6s;`;
  document.body.appendChild(s);const ang=Math.random()*Math.PI*2,dist=60+Math.random()*140;
  requestAnimationFrame(()=>{s.style.transform=`translate(${Math.cos(ang)*dist}px,${Math.sin(ang)*dist}px)`;s.style.opacity='0';});
  setTimeout(()=>s.remove(),650);}}
function shake(){document.body.animate([{transform:'translate(0,0)'},{transform:'translate(-8px,5px)'},{transform:'translate(7px,-4px)'},{transform:'translate(-5px,3px)'},{transform:'translate(0,0)'}],{duration:380});}

/* =============== RÉACTIFS =============== */
const R={
  eau:{n:"Eau",f:"H₂O",c:"#cfeaf7",g:"Base"},
  // acides
  hcl:{n:"Acide",f:"HCl",c:"#e6f3fa",g:"Acides"}, h2so4:{n:"H₂SO₄",f:"sulfurique",c:"#eef3f7",g:"Acides"},
  hno3:{n:"HNO₃",f:"nitrique",c:"#f3efe6",g:"Acides"}, vinaigre:{n:"Vinaigre",f:"CH₃COOH",c:"#f1efe2",g:"Acides"},
  // bases
  naoh:{n:"Soude",f:"NaOH",c:"#e8f4ee",g:"Bases"}, koh:{n:"Potasse",f:"KOH",c:"#e9f3ef",g:"Bases"},
  nh3:{n:"Ammoniac",f:"NH₃",c:"#eef2f6",g:"Bases"}, chaux:{n:"Eau chaux",f:"Ca(OH)₂",c:"#f0f4f2",g:"Bases"},
  // sels colorés
  cuso4:{n:"CuSO₄",f:"cuivre II",c:"#1f8fe0",g:"Sels"}, fecl3:{n:"FeCl₃",f:"fer III",c:"#c98a2f",g:"Sels"},
  feso4:{n:"FeSO₄",f:"fer II",c:"#bfe0c8",g:"Sels"}, niso4:{n:"NiSO₄",f:"nickel",c:"#2fae7a",g:"Sels"},
  cocl2:{n:"CoCl₂",f:"cobalt",c:"#e58fb0",g:"Sels"}, znso4:{n:"ZnSO₄",f:"zinc",c:"#eef6f5",g:"Sels"},
  mgso4:{n:"MgSO₄",f:"magnés.",c:"#eef5f6",g:"Sels"}, cacl2:{n:"CaCl₂",f:"calcium",c:"#eef5f7",g:"Sels"},
  bacl2:{n:"BaCl₂",f:"baryum",c:"#eef4f7",g:"Sels"}, pbno3:{n:"Pb(NO₃)₂",f:"plomb",c:"#eef2f5",g:"Sels"},
  agno3:{n:"AgNO₃",f:"argent",c:"#eef2f6",g:"Sels"}, nacl:{n:"NaCl",f:"sel",c:"#eef5fa",g:"Sels"},
  ki:{n:"KI",f:"iodure",c:"#f0f2f6",g:"Sels"}, na2co3:{n:"Na₂CO₃",f:"carbonate",c:"#eef3ef",g:"Sels"},
  bicar:{n:"Bicarb.",f:"NaHCO₃",c:"#f3f3ec",g:"Sels"}, k2cro4:{n:"K₂CrO₄",f:"chromate",c:"#e8c83a",g:"Sels"},
  // oxydants / réducteurs
  kmno4:{n:"KMnO₄",f:"permang.",c:"#8e2bb0",g:"Oxydo-réduction"}, k2cr:{n:"K₂Cr₂O₇",f:"dichrom.",c:"#e8861f",g:"Oxydo-réduction"},
  iode:{n:"Diiode",f:"I₂",c:"#7a4a22",g:"Oxydo-réduction"}, so2:{n:"SO₂",f:"dioxy. soufre",c:"#eef3ea",g:"Oxydo-réduction"},
  h2o2:{n:"Eau oxy.",f:"H₂O₂",c:"#eef6fb",g:"Oxydo-réduction"},
  // indicateurs
  pheno:{n:"Phéno.",f:"indicateur",c:"#f5f5f5",g:"Indicateurs"}, helia:{n:"Hélian.",f:"indicateur",c:"#f2b34a",g:"Indicateurs"},
  amidon:{n:"Amidon",f:"empois",c:"#f3f1e4",g:"Indicateurs"},
  // organique
  glyce:{n:"Glycérine",f:"C₃H₈O₃",c:"#eef0ea",g:"Organique"},
};
const ACIDS=['hcl','h2so4','hno3','vinaigre'], BASES=['naoh','koh','nh3','chaux'];
const SULFATES=['cuso4','feso4','niso4','znso4','mgso4','h2so4'];
const CHLORURES=['nacl','bacl2','cacl2','cocl2','fecl3'];
function bottleSVG(col){const id="b"+Math.random().toString(36).slice(2,7);return `
<svg width="36" height="48" viewBox="0 0 38 50">
 <rect x="13" y="2" width="12" height="7" rx="2" fill="#cfd9de"/>
 <path d="M11 9 h16 v6 l5 9 v22 a4 4 0 0 1 -4 4 h-18 a4 4 0 0 1 -4 -4 v-22 l5 -9 z" fill="#fff" stroke="#b9c7ce" stroke-width="1.4"/>
 <clipPath id="${id}"><path d="M11 9 h16 v6 l5 9 v22 a4 4 0 0 1 -4 4 h-18 a4 4 0 0 1 -4 -4 v-22 l5 -9 z"/></clipPath>
 <rect x="6" y="29" width="26" height="23" fill="${col}" opacity=".9" clip-path="url(#${id})"/>
 <rect x="13" y="11" width="3" height="33" rx="1.5" fill="#fff" opacity=".45"/></svg>`;}
const shelf=document.getElementById('shelf'),catbar=document.getElementById('catbar'),selName=document.getElementById('selName');
let selected=null;
const CATS=['Tous','Acides','Bases','Sels','Oxydo-réduction','Indicateurs','Organique'];
let curCat='Tous';
CATS.forEach(cat=>{const b=document.createElement('button');b.className='catchip'+(cat==='Tous'?' on':'');b.textContent=cat;
  b.onclick=()=>{sfx.click();curCat=cat;document.querySelectorAll('.catchip').forEach(x=>x.classList.toggle('on',x.textContent===cat));renderShelf();};catbar.appendChild(b);});
function renderShelf(){shelf.innerHTML='';
  for(const k in R){if(curCat!=='Tous'&&R[k].g!==curCat)continue;
    const el=document.createElement('div');el.className='reagent'+(selected===k?' sel':'');el.dataset.key=k;
    el.innerHTML=bottleSVG(R[k].c)+`<small><b>${R[k].n}</b><br>${R[k].f}</small>`;
    el.addEventListener('pointerdown',e=>{sfx.click();selectReagent(k);});
    shelf.appendChild(el);}}
function selectReagent(k){selected=k;selName.textContent='✔ '+R[k].n+' ('+R[k].f+')';
  document.querySelectorAll('.reagent').forEach(x=>x.classList.toggle('sel',x.dataset.key===k));}
renderShelf();

/* quantité */
let dose=20;const volEl=document.getElementById('vol');
document.getElementById('plus').onclick=()=>{dose=Math.min(dose+5,60);volEl.textContent=dose+' mL';};
document.getElementById('minus').onclick=()=>{dose=Math.max(dose-5,5);volEl.textContent=dose+' mL';};

/* =============== BÉCHER =============== */
const CAP=150;let gid=0,beakers=[];const bench=document.getElementById('bench');
function beakerSVG(u){return `
<svg viewBox="0 0 110 142"><defs>
 <clipPath id="cl${u}"><path d="M24 30 L24 118 Q24 128 34 128 L76 128 Q86 128 86 118 L86 30 Z"/></clipPath>
 <linearGradient id="sh${u}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#7e97a1" stop-opacity=".18"/></linearGradient>
 </defs>
 <ellipse cx="55" cy="133" rx="33" ry="5" fill="rgba(20,40,50,.13)"/>
 <g clip-path="url(#cl${u})">
   <rect class="lq" x="22" y="128" width="66" height="0" fill="#cfeaf7"/>
   <ellipse class="mn" cx="55" cy="128" rx="32" ry="3.4" fill="#fff" opacity="0"/>
   <rect class="pr" x="22" y="128" width="66" height="0" fill="#fff" opacity=".92"/>
   <g class="bb"></g></g>
 <g class="gs"></g>
 <path d="M16 23 L24 30 L24 118 Q24 128 34 128 L76 128 Q86 128 86 118 L86 30 L94 23" fill="none" stroke="#7e97a1" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
 <path d="M16 23 L94 23" stroke="#aebfc7" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>
 <g stroke="#aebfc7" stroke-width="1.1" font-size="6.5" fill="#8aa0aa" font-family="'IBM Plex Mono',monospace">
   <line x1="78" y1="54" x2="86" y2="54"/><text x="60" y="57">150</text>
   <line x1="78" y1="80" x2="86" y2="80"/><text x="60" y="83">100</text>
   <line x1="80" y1="106" x2="86" y2="106"/><text x="64" y="109">50</text></g>
 <rect x="32" y="34" width="6" height="84" rx="3" fill="url(#sh${u})"/></svg>`;}
function makeBeaker(x,y){const u=gid++;const b=document.createElement('div');b.className='beaker';b.style.left=x+'px';b.style.top=y+'px';
  b.innerHTML=`<span class="vlabel">vide</span>`+beakerSVG(u);bench.appendChild(b);
  const o={el:b,vol:{},lc:'#cfeaf7',pc:'#fff',precip:0,
    lq:b.querySelector('.lq'),mn:b.querySelector('.mn'),pr:b.querySelector('.pr'),bb:b.querySelector('.bb'),gs:b.querySelector('.gs'),lbl:b.querySelector('.vlabel')};
  b._o=o;beakers.push(o);b.addEventListener('pointerdown',e=>startDrag(e,o));
  let lt=0;b.addEventListener('pointerup',()=>{if(moved)return;const t=Date.now();
    if(t-lt<320){empty(o);lt=0;return;}lt=t;
    if(selected)addR(o,selected);});return o;}
makeBeaker(60,130);makeBeaker(210,130);
document.getElementById('addBeaker').onclick=()=>{if(beakers.length<6)makeBeaker(40+Math.random()*220,120+Math.random()*60);};
document.getElementById('reset').onclick=()=>{beakers.forEach(empty);clearJ();};
function total(o){let s=0;for(const k in o.vol)s+=o.vol[k];return s;}
function empty(o){o.vol={};o.precip=0;render(o);}
function render(o){const t=total(o);const h=Math.min(t/CAP*92,92);const top=128-h;
  o.lq.style.transition='all .45s';o.lq.setAttribute('height',h);o.lq.setAttribute('y',top);o.lq.setAttribute('fill',o.lc);
  o.mn.setAttribute('cy',top);o.mn.setAttribute('opacity',h>3?.5:0);
  const ph=Math.min(o.precip,30);o.pr.setAttribute('height',ph);o.pr.setAttribute('y',128-ph);o.pr.setAttribute('fill',o.pc);
  const ks=Object.keys(o.vol);o.lbl.textContent=ks.length?ks.map(k=>R[k].n).join('+')+' · '+Math.round(t)+'mL':'vide';}

/* =============== VERSER (drag flacon) =============== */
let ghost=null,pk=null;
function startPour(e,k){e.preventDefault();pk=k;ghost=document.createElement('div');
  ghost.style.cssText='position:fixed;z-index:99;pointer-events:none';ghost.innerHTML=bottleSVG(R[k].c);
  document.body.appendChild(ghost);mg(e);window.addEventListener('pointermove',mg);window.addEventListener('pointerup',ep);}
function mg(e){if(ghost){ghost.style.left=(e.clientX-18)+'px';ghost.style.top=(e.clientY-24)+'px';}}
function ep(e){window.removeEventListener('pointermove',mg);window.removeEventListener('pointerup',ep);
  if(ghost)ghost.remove();ghost=null;const t=bAt(e.clientX,e.clientY);if(t)addR(t,pk);pk=null;}
function bAt(x,y){for(const o of beakers){const r=o.el.getBoundingClientRect();if(x>r.left&&x<r.right&&y>r.top&&y<r.bottom)return o;}return null;}
function addR(o,k){o.vol[k]=(o.vol[k]||0)+dose;sfx.pour();react(o);render(o);o.el.classList.remove('glow');void o.el.offsetWidth;o.el.classList.add('glow');}

/* =============== DÉPLACER / MÉLANGER =============== */
let drag=null,ox=0,oy=0,moved=false,sx=0,sy=0,pid=null;
function startDrag(e,o){
  if(drag)return;                 // une seule manip à la fois
  e.preventDefault();
  drag=o;moved=false;sx=e.clientX;sy=e.clientY;pid=e.pointerId;
  o.el.classList.add('drag');
  const r=o.el.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;
  try{o.el.setPointerCapture(e.pointerId);}catch(_){}
  o.el.addEventListener('pointermove',md);
  o.el.addEventListener('pointerup',ed);
  o.el.addEventListener('pointercancel',ed);
}
function md(e){if(!drag||e.pointerId!==pid)return;
  if(!moved && Math.hypot(e.clientX-sx,e.clientY-sy)<9)return; // seuil tap/glissement
  moved=true;const br=bench.getBoundingClientRect();
  drag.el.style.left=(e.clientX-br.left-ox)+'px';drag.el.style.top=(e.clientY-br.top-oy)+'px';}
function ed(e){if(!drag)return;const o=drag,el=o.el;
  el.removeEventListener('pointermove',md);el.removeEventListener('pointerup',ed);el.removeEventListener('pointercancel',ed);
  try{el.releasePointerCapture(pid);}catch(_){}
  el.classList.remove('drag');
  if(moved){for(const t of beakers){if(t===o)continue;const r=t.el.getBoundingClientRect();
    if(e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom){mix(o,t);break;}}}
  drag=null;pid=null;}
function mix(f,t){pourAnim(f,t);}
function pourAnim(f,t){
  if(total(f)<=0){doMix(f,t);return;}
  const fr=f.el.getBoundingClientRect(),tr=t.el.getBoundingClientRect();
  const right=tr.left+tr.width/2 < fr.left+fr.width/2; // verser vers la gauche ?
  f.el.style.transformOrigin=right?'left bottom':'right bottom';
  f.el.style.transition='transform .35s ease';
  f.el.style.transform=`rotate(${right?60:-60}deg)`;
  f.el.style.zIndex=40;
  sfx.pour();
  const sx=right?fr.left+12:fr.right-12, sy=fr.top+18;
  const tx=tr.left+tr.width/2, ty=tr.top+24;
  const col=f.lc;let drops=0;
  const di=setInterval(()=>{drops++;const d=document.createElement('div');
    d.style.cssText=`position:fixed;left:${sx}px;top:${sy}px;width:6px;height:12px;border-radius:3px;background:${col};z-index:8500;pointer-events:none;transition:transform .45s ease-in,opacity .45s;`;
    document.body.appendChild(d);requestAnimationFrame(()=>{d.style.transform=`translate(${tx-sx}px,${ty-sy}px)`;d.style.opacity=.2;});
    setTimeout(()=>d.remove(),470);
    if(drops>=6)clearInterval(di);},70);
  setTimeout(()=>{f.el.style.transform='';f.el.style.zIndex='';doMix(f,t);},620);
}
function doMix(f,t){for(const k in f.vol)t.vol[k]=(t.vol[k]||0)+f.vol[k];react(t);render(t);empty(f);
  t.el.classList.remove('glow');void t.el.offsetWidth;t.el.classList.add('glow');}

/* =============== COULEURS & RÉACTIONS =============== */
function hx(c){c=c.replace('#','');return[parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)];}
function blend(o){let r=0,g=0,b=0,s=0;for(const k in o.vol){const v=o.vol[k],[R1,G1,B1]=hx(R[k].c);r+=R1*v;g+=G1*v;b+=B1*v;s+=v;}
  if(!s)return'#cfeaf7';return'#'+[r,g,b].map(x=>Math.round(x/s).toString(16).padStart(2,'0')).join('');}
function bcen(o){const r=o.el.getBoundingClientRect();return[r.left+r.width/2,r.top+18];}
function react(o){const c=o.vol,has=k=>c[k]>0,any=a=>a.some(k=>c[k]>0);o.precip=0;o.pc='#fff';clrB(o);clrG(o);o.lc=blend(o);
  const aci=any(ACIDS),bas=any(BASES);
  if(has('pheno'))o.lc = bas&&!aci?'#e8479f':o.lc;
  if(has('helia'))o.lc = aci?'#e8443a': bas?'#f2c83a':o.lc;
  // 💥 permanganate + glycérine (s'enflamme)
  if(has('kmno4')&&has('glyce')){o.lc='#2a1830';o.vol={};o.precip=0;
    const[cx,cy]=bcen(o);sfx.boom();shake();
    smokeBurst(cx,cy,22,'rgba(90,70,110,.6)');setTimeout(()=>smokeBurst(cx,cy,18),200);sparkBurst(cx,cy,24);
    const fl=document.createElement('div');fl.style.cssText=`position:fixed;left:${cx-60}px;top:${cy-60}px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,#fff,#ffae2e,transparent);z-index:8999;pointer-events:none;opacity:.95;transition:.4s;`;
    document.body.appendChild(fl);requestAnimationFrame(()=>{fl.style.transform='scale(2)';fl.style.opacity='0';});setTimeout(()=>fl.remove(),450);
    log("KMnO₄ + glycérine → 💥 combustion","Inflammation spontanée : flamme violette, fumée et chaleur !");render(o);return;}
  // neutralisation
  if(aci&&bas){fizz(o,5);sfx.fizz();log("acide + base → sel + eau","Neutralisation, le mélange chauffe.");}
  // précipités d'hydroxydes (cation + base)
  if(has('cuso4')&&bas){o.precip=Math.min(c.cuso4/4,28);o.pc='#1f6db0';sfx.precip();log("Cu²⁺ + 2 OH⁻ → Cu(OH)₂↓","Précipité bleu (cuivre).");}
  if(has('fecl3')&&bas){o.precip=Math.min(c.fecl3/4,28);o.pc='#a5471f';sfx.precip();log("Fe³⁺ + 3 OH⁻ → Fe(OH)₃↓","Précipité rouille (fer III).");}
  if(has('feso4')&&bas){o.precip=Math.min(c.feso4/4,28);o.pc='#3f7d4a';sfx.precip();log("Fe²⁺ + 2 OH⁻ → Fe(OH)₂↓","Précipité vert (fer II).");}
  if(has('niso4')&&bas){o.precip=Math.min(c.niso4/4,28);o.pc='#2f8f5f';sfx.precip();log("Ni²⁺ + 2 OH⁻ → Ni(OH)₂↓","Précipité vert pomme (nickel).");}
  if(has('cocl2')&&bas){o.precip=Math.min(c.cocl2/4,28);o.pc='#4a6fc0';sfx.precip();log("Co²⁺ + 2 OH⁻ → Co(OH)₂↓","Précipité bleu (cobalt).");}
  if((has('znso4')||has('mgso4'))&&bas){o.precip=Math.min((c.znso4||c.mgso4)/4,28);o.pc='#f0f0f0';sfx.precip();log("M²⁺ + 2 OH⁻ → M(OH)₂↓","Précipité blanc (zinc / magnésium).");}
  // test des chlorures (Ag⁺)
  if(has('agno3')&&any(CHLORURES)){o.precip=Math.min(c.agno3/3,28);o.pc='#f0f0f0';sfx.precip();log("Ag⁺ + Cl⁻ → AgCl↓","Précipité blanc qui noircit à la lumière.");}
  // iodure + argent → AgI jaune
  if(has('agno3')&&has('ki')){o.precip=Math.min(c.ki/3,28);o.pc='#e8d24a';sfx.precip();log("Ag⁺ + I⁻ → AgI↓","Précipité jaune pâle.");}
  // test des sulfates (Ba²⁺)
  if(has('bacl2')&&any(SULFATES)){o.precip=Math.min(c.bacl2/4,28);o.pc='#f4f4f4';sfx.precip();log("Ba²⁺ + SO₄²⁻ → BaSO₄↓","Précipité blanc (test des sulfates).");}
  // pluie d'or : plomb + iodure
  if(has('pbno3')&&has('ki')){o.precip=Math.min(Math.min(c.pbno3,c.ki)/3,28);o.pc='#f2c531';o.lc='#f7e08a';sfx.precip();log("Pb²⁺ + 2 I⁻ → PbI₂↓","Précipité jaune d'or (« pluie d'or »).");}
  // carbonate / bicarbonate + acide → CO₂
  if((has('bicar')||has('na2co3'))&&aci){fizz(o,14);sfx.fizz();gas(o);const[cx,cy]=bcen(o);smokeBurst(cx,cy,6,'rgba(200,210,215,.5)');log("CO₃²⁻ + 2 H⁺ → H₂O + CO₂↑","Effervescence : dégagement de CO₂.");}
  // test de l'amidon (empois + diiode)
  if(has('amidon')&&has('iode')){o.lc='#171f4d';log("Amidon + I₂ → complexe bleu-noir","Test de l'amidon : coloration bleu très foncé.");}
  // décoloration du permanganate (réducteur)
  if(has('kmno4')&&(has('so2')||has('h2o2')||has('feso4'))){o.lc='#eef5f7';fizz(o,6);sfx.fizz();
    const red=has('so2')?"SO₂":has('h2o2')?"H₂O₂":"Fe²⁺";
    log("2 MnO₄⁻ + réducteur ("+red+") → 2 Mn²⁺","Le permanganate violet se décolore : oxydoréduction.");}
}
function fizz(o,n){o.el.classList.remove('fizz');void o.el.offsetWidth;o.el.classList.add('fizz');clrB(o);
  const t=total(o),top=128-Math.min(t/CAP*92,86);
  for(let i=0;i<n;i++){const cy=122-Math.random()*(122-top);
    const b=document.createElementNS('http://www.w3.org/2000/svg','circle');
    b.setAttribute('cx',30+Math.random()*44);b.setAttribute('cy',cy);b.setAttribute('r',1.5+Math.random()*1.8);b.setAttribute('fill','#fff');b.setAttribute('opacity','.8');
    const a=document.createElementNS('http://www.w3.org/2000/svg','animate');
    a.setAttribute('attributeName','cy');a.setAttribute('from',cy);a.setAttribute('to',top);a.setAttribute('dur',(.8+Math.random()*.7)+'s');a.setAttribute('repeatCount','indefinite');
    b.appendChild(a);o.bb.appendChild(b);}setTimeout(()=>clrB(o),2600);}
function clrB(o){o.bb.innerHTML='';}
function gas(o){clrG(o);for(let i=0;i<3;i++){const p=document.createElementNS('http://www.w3.org/2000/svg','circle');
  p.setAttribute('cx',44+(i-1)*10);p.setAttribute('cy',24);p.setAttribute('r',4);p.setAttribute('fill','#cfd9de');p.setAttribute('opacity','.6');
  const a1=document.createElementNS('http://www.w3.org/2000/svg','animate');a1.setAttribute('attributeName','cy');a1.setAttribute('from','24');a1.setAttribute('to','-6');a1.setAttribute('dur','1.6s');a1.setAttribute('begin',(i*.3)+'s');a1.setAttribute('repeatCount','indefinite');
  const a2=document.createElementNS('http://www.w3.org/2000/svg','animate');a2.setAttribute('attributeName','opacity');a2.setAttribute('from','.6');a2.setAttribute('to','0');a2.setAttribute('dur','1.6s');a2.setAttribute('begin',(i*.3)+'s');a2.setAttribute('repeatCount','indefinite');
  p.appendChild(a1);p.appendChild(a2);o.gs.appendChild(p);}setTimeout(()=>clrG(o),3000);}
function clrG(o){o.gs.innerHTML='';}

/* journal */
const jl=document.getElementById('jlist');let lastEq='';
function log(eq,obs){if(eq===lastEq)return;lastEq=eq;if(jl.querySelector('.jempty'))jl.innerHTML='';
  const it=document.createElement('div');it.className='jitem';it.innerHTML=`<div class="jeq">${eq}</div><div class="jobs">${obs}</div>`;
  jl.prepend(it);while(jl.children.length>8)jl.lastChild.remove();}
function clearJ(){jl.innerHTML='<div class="jempty">Aucune réaction…</div>';lastEq='';}

/* =============== ONGLETS =============== */
document.querySelectorAll('.tab[data-v]').forEach(t=>t.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));t.classList.add('active');document.getElementById(t.dataset.v).classList.add('active');});

/* =============== ÉLECTROLYSE : CIRCUIT À MONTER =============== */
const board=document.getElementById('board');
board.innerHTML=`
<svg id="wires" viewBox="0 0 360 480"><defs>
 <linearGradient id="cur" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd23f"/><stop offset="1" stop-color="#ff8a00"/></linearGradient></defs>
 <g id="wireG"></g><path id="temp" stroke="#9aa" stroke-width="4" stroke-dasharray="4 4" fill="none"/></svg>

<div class="comp" style="left:30px;top:0;width:300px;height:200px">
 <svg width="300" height="200" viewBox="0 0 300 200">
  <rect x="10" y="60" width="280" height="135" rx="8" fill="rgba(127,200,240,.16)" stroke="#8ea7b1" stroke-width="2.5"/>
  <rect id="liqE" x="10" y="120" width="280" height="75" rx="6" fill="rgba(80,160,210,.30)"/>
  <g stroke="#8ea7b1" stroke-width="2.5" fill="rgba(255,255,255,.4)"><rect x="78" y="30" width="30" height="130" rx="6"/><rect x="192" y="30" width="30" height="130" rx="6"/></g>
  <clipPath id="tL"><rect x="80" y="32" width="26" height="126" rx="5"/></clipPath><clipPath id="tR"><rect x="194" y="32" width="26" height="126" rx="5"/></clipPath>
  <rect id="gH" x="80" y="158" width="26" height="0" fill="rgba(120,200,255,.6)" clip-path="url(#tL)"/>
  <rect id="gO" x="194" y="158" width="26" height="0" fill="rgba(255,150,150,.6)" clip-path="url(#tR)"/>
  <text x="93" y="24" font-size="11" text-anchor="middle">H₂</text><text x="207" y="24" font-size="11" text-anchor="middle">O₂</text>
  <rect x="89" y="95" width="8" height="100" fill="#9aa6ab"/><rect x="203" y="95" width="8" height="100" fill="#9aa6ab"/>
  <g class="eb" id="ebL"></g><g class="eb" id="ebR"></g>
 </svg>
</div>
<div class="term" id="t_EL_L" style="left:79px;top:6px"></div>
<div class="term" id="t_EL_R" style="left:223px;top:6px"></div>

<div class="comp" style="left:130px;top:215px;width:100px;height:70px">
 <svg width="100" height="70" viewBox="0 0 100 70"><circle id="bulb" cx="50" cy="30" r="22" fill="#f3f3d6" stroke="#caa" stroke-width="2"/>
  <path d="M40 45 h20 M42 52 h16" stroke="#999" stroke-width="2"/><path id="fil" d="M44 30 q6 -10 12 0" stroke="#caa" stroke-width="2" fill="none"/></svg></div>
<div class="term" id="t_BU_A" style="left:128px;top:245px"></div>
<div class="term" id="t_BU_R" style="left:214px;top:245px"></div>

<div class="comp switch-comp" id="swComp" style="left:20px;top:320px;width:120px;height:60px">
 <svg width="120" height="60" viewBox="0 0 120 60"><circle cx="20" cy="40" r="6" fill="#444"/><circle cx="100" cy="40" r="6" fill="#444"/>
  <line id="swArm" x1="20" y1="40" x2="92" y2="14" stroke="#444" stroke-width="5" stroke-linecap="round"/>
  <text x="60" y="58" font-size="10" text-anchor="middle" fill="#67808c">interrupteur</text></svg></div>
<div class="term" id="t_SW_A" style="left:31px;top:351px"></div>
<div class="term" id="t_SW_R" style="left:111px;top:351px"></div>

<div class="comp" style="left:90px;top:400px;width:180px;height:60px">
 <svg width="180" height="60" viewBox="0 0 180 60"><rect x="20" y="14" width="140" height="30" rx="5" fill="#2f3a40"/>
  <rect x="150" y="20" width="10" height="18" fill="#888"/><text x="35" y="34" font-size="16" fill="#fff">+</text><text x="140" y="34" font-size="16" fill="#fff">−</text>
  <text x="90" y="58" font-size="10" text-anchor="middle" fill="#67808c">pile 4,5 V</text></svg></div>
<div class="term pos" id="t_BAT_P" style="left:101px;top:421px"></div>
<div class="term neg" id="t_BAT_N" style="left:251px;top:421px"></div>
`;
// positions des bornes (coordonnées board, centre)
const TERM={t_EL_L:[88,15],t_EL_R:[232,15],t_BU_A:[137,254],t_BU_R:[223,254],t_SW_A:[40,360],t_SW_R:[120,360],t_BAT_P:[110,430],t_BAT_N:[260,430]};
let wires=[],swClosed=false,elyte='salt';
const wireG=document.getElementById('wireG'),tempP=document.getElementById('temp');
// interrupteur
document.getElementById('swComp').onclick=()=>{swClosed=!swClosed;sfx.click();
  document.getElementById('swArm').setAttribute('x2',swClosed?112:92);document.getElementById('swArm').setAttribute('y2',swClosed?40:14);update();};
// électrolyte
document.querySelectorAll('#elyte button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#elyte button').forEach(x=>x.classList.remove('on'));b.classList.add('on');elyte=b.dataset.e;update();});
document.getElementById('clearW').onclick=()=>{wires=[];drawWires();update();};
// tirer un fil
let from=null;
function bp(id){const r=board.getBoundingClientRect();const c=TERM[id];return c;}
function pt(e){const r=board.getBoundingClientRect();const sx=360/r.width,sy=480/r.height;return[(e.clientX-r.left)*sx,(e.clientY-r.top)*sy];}
Object.keys(TERM).forEach(id=>{const el=document.getElementById(id);el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();from=id;
  window.addEventListener('pointermove',wmove);window.addEventListener('pointerup',wup);});});
function wmove(e){if(!from)return;const[a,b]=bp(from);const[x,y]=pt(e);tempP.setAttribute('d',`M${a} ${b} L${x} ${y}`);}
function wup(e){window.removeEventListener('pointermove',wmove);window.removeEventListener('pointerup',wup);tempP.setAttribute('d','');
  if(!from)return;const[x,y]=pt(e);let best=null,bd=30;for(const id in TERM){if(id===from)continue;const[a,b]=TERM[id];const d=Math.hypot(a-x,b-y);if(d<bd){bd=d;best=id;}}
  if(best){wires.push([from,best]);drawWires();update();}from=null;}
function drawWires(){wireG.innerHTML='';wires.forEach((w,i)=>{const[a,b]=TERM[w[0]],[c,d]=TERM[w[1]];
  const l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',a);l.setAttribute('y1',b);l.setAttribute('x2',c);l.setAttribute('y2',d);
  l.setAttribute('class','wire'+(liveWires?' live':''));l.dataset.i=i;l.addEventListener('pointerdown',ev=>{ev.stopPropagation();wires.splice(i,1);drawWires();update();});wireG.appendChild(l);});}
// connectivité
function edges(testRemove){let E=wires.slice();if(swClosed)E.push(['t_SW_A','t_SW_R']);E.push(['t_BU_A','t_BU_R']);E.push(['t_EL_L','t_EL_R']);
  if(testRemove)E=E.filter(e=>!(e[0]===testRemove[0]&&e[1]===testRemove[1]));return E;}
function reach(s,t,E){const adj={};E.forEach(([a,b])=>{(adj[a]=adj[a]||[]).push(b);(adj[b]=adj[b]||[]).push(a);});
  const seen={},q=[s];while(q.length){const n=q.pop();if(n===t)return true;if(seen[n])continue;seen[n]=1;(adj[n]||[]).forEach(m=>q.push(m));}return false;}
let liveWires=false,elT=null,elH=0,elO=0,wasActive=false;
const gH=document.getElementById('gH'),gO=document.getElementById('gO');
function update(){
  const E=edges();const flow=reach('t_BAT_P','t_BAT_N',E);
  // électrolyse en série ?
  const Ee=edges(['t_EL_L','t_EL_R']);
  const cellWired=(reach('t_BAT_P','t_EL_L',Ee)&&reach('t_BAT_N','t_EL_R',Ee))||(reach('t_BAT_P','t_EL_R',Ee)&&reach('t_BAT_N','t_EL_L',Ee));
  const Eb=edges(['t_BU_A','t_BU_R']);
  const bulbWired=(reach('t_BAT_P','t_BU_A',Eb)&&reach('t_BAT_N','t_BU_R',Eb))||(reach('t_BAT_P','t_BU_R',Eb)&&reach('t_BAT_N','t_BU_A',Eb));
  const active=flow&&cellWired&&swClosed;
  if(active&&!wasActive){sfx.spark();}wasActive=active;
  liveWires=flow&&swClosed;drawWires();
  document.getElementById('bulb').setAttribute('fill', (flow&&bulbWired&&swClosed)?'#ffe04a':'#f3f3d6');
  document.getElementById('bulb').parentElement.classList.toggle('pulse',flow&&bulbWired&&swClosed);
  clearInterval(elT);
  if(active){
    const slow=elyte==='pure';
    document.getElementById('eread').textContent=slow?'🔌 Courant faible (eau pure conduit mal)…':'⚡ Le courant passe ! Électrolyse en cours…';
    elT=setInterval(()=>{const step=slow?0.4:1.6;elH=Math.min(elH+step*2,126);elO=Math.min(elO+step,126);
      gH.setAttribute('height',elH);gH.setAttribute('y',158-elH);gO.setAttribute('height',elO);gO.setAttribute('y',158-elO);
      eBub();if(Math.random()<.4)sfx.bubble();
      const vh=Math.round(elH/126*40),vo=Math.round(elO/126*20);
      document.getElementById('eread').textContent=elH>=126?'✅ H₂ = '+vh+' mL · O₂ = '+vo+' mL → rapport 2:1 vérifié !':
        '⚡ H₂ = '+vh+' mL · O₂ = '+vo+' mL (le H₂ monte 2× plus vite)';},150);
  } else {
    if(flow&&swClosed&&!cellWired&&!bulbWired)document.getElementById('eread').textContent='⚠️ Court-circuit ! Fais passer le courant par la cellule.';
    else if(!swClosed)document.getElementById('eread').textContent='Interrupteur ouvert — touche-le pour fermer.';
    else document.getElementById('eread').textContent='Circuit incomplet — relie pile → électrodes.';
  }
}
function eBub(){['ebL','ebR'].forEach(id=>{const g=document.getElementById(id);if(g.children.length>6)return;
  const x=id==='ebL'?93:207;const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
  c.setAttribute('cx',x+(Math.random()*8-4));c.setAttribute('cy',150);c.setAttribute('r',2);c.setAttribute('fill','#fff');c.setAttribute('opacity','.8');g.appendChild(c);
  let y=150;const f=setInterval(()=>{y-=4;c.setAttribute('cy',y);if(y<120){clearInterval(f);c.remove();}},40);});}
document.getElementById('testH').onclick=()=>{if(elH>30){sfx.pop();const r=board.getBoundingClientRect();sparkBurst(r.left+r.width*0.27,r.top+40,12);}document.getElementById('eread').textContent=elH>30?'💥 « Pop ! » → dihydrogène H₂ confirmé':'⚠️ Pas assez de gaz.';};
document.getElementById('testO').onclick=()=>{if(elO>30)sfx.spark();document.getElementById('eread').textContent=elO>30?'🔥 La bûchette se rallume → dioxygène O₂ confirmé':'⚠️ Pas assez de gaz.';};
drawWires();update();

/* =============== SYNTHÈSE / TESTS DES GAZ =============== */
let gasType='h2';
const gtubeFill=document.getElementById('gtubeFill'),gtubeLabel=document.getElementById('gtubeLabel');
const GASCOL={h2:'rgba(120,210,255,.30)',o2:'rgba(255,150,150,.32)',mix:'rgba(190,180,255,.34)'};
const GASLBL={h2:'H₂',o2:'O₂',mix:'2 H₂ + O₂'};
function setGas(g){gasType=g;gtubeFill.style.background=GASCOL[g];gtubeLabel.textContent=GASLBL[g];
  document.getElementById('sread').textContent='Approche la bûchette de l\'ouverture du tube…';
  document.getElementById('waterDrops').innerHTML='';}
document.querySelectorAll('#gasSel button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#gasSel button').forEach(x=>x.classList.remove('on'));b.classList.add('on');sfx.click();setGas(b.dataset.g);});
setGas('h2');

const matchEl=document.getElementById('match'),stage=document.getElementById('tubeStage');
let mdrag=false,mox=0,moy=0;
matchEl.addEventListener('pointerdown',e=>{e.preventDefault();mdrag=true;matchEl.classList.add('drag');
  const r=matchEl.getBoundingClientRect();mox=e.clientX-r.left;moy=e.clientY-r.top;
  window.addEventListener('pointermove',mmove);window.addEventListener('pointerup',mup);});
function mmove(e){if(!mdrag)return;const sr=stage.getBoundingClientRect();
  matchEl.style.left=(e.clientX-sr.left-mox)+'px';matchEl.style.top=(e.clientY-sr.top-moy)+'px';}
function mup(e){window.removeEventListener('pointermove',mmove);window.removeEventListener('pointerup',mup);
  if(!mdrag)return;mdrag=false;matchEl.classList.remove('drag');
  const tube=document.getElementById('gtube').getBoundingClientRect();
  const fx=e.clientX,fy=e.clientY; // position de la flamme ≈ pointeur
  if(fx>tube.left-30&&fx<tube.right+30&&fy>tube.top-30&&fy<tube.top+70){ignite();}
}
function ignite(){const tube=document.getElementById('gtube').getBoundingClientRect();
  const cx=tube.left+tube.width/2,cy=tube.top+20;const sr=document.getElementById('sread');
  if(gasType==='h2'){sfx.pop();sparkBurst(cx,cy,10);const f=document.getElementById('flash');f.classList.remove('pop');void f.offsetWidth;f.classList.add('pop');
    sr.textContent='💥 « Pop ! » — détonation sèche : c\'est du dihydrogène H₂.';}
  else if(gasType==='o2'){sfx.spark();const fl=document.getElementById('mflame');fl.style.transition='.3s';fl.style.transform='scale(1.8)';setTimeout(()=>fl.style.transform='',600);
    sr.textContent='🔥 La flamme se ravive vivement : c\'est du dioxygène O₂.';}
  else{sfx.boom();shake();const f=document.getElementById('flash');f.classList.remove('pop');void f.offsetWidth;f.classList.add('pop');
    sparkBurst(cx,cy,26);smokeBurst(cx,cy,18);
    const wd=document.getElementById('waterDrops');wd.innerHTML='';
    [[20,150],[44,120],[30,180],[52,90]].forEach(([l,t])=>{const d=document.createElement('div');d.className='wdrop';d.style.left=l+'px';d.style.top=t+'px';wd.appendChild(d);requestAnimationFrame(()=>d.style.opacity=1);});
    gtubeFill.style.background='rgba(120,210,255,.15)';
    sr.textContent='💥 BOOM ! 2 H₂ + O₂ → 2 H₂O — de l\'eau se forme sur les parois.';}
}

/* =============== COMBUSTION DU CARBONE =============== */
const carbon=document.getElementById('carbon'),cFlame=document.getElementById('cFlame'),
  milk=document.getElementById('milk'),cBub=document.getElementById('cBub'),cread=document.getElementById('cread');
let burnT=null;
function burnCarbon(){if(burnT)return;sfx.spark();
  carbon.style.transition='fill 1s';carbon.setAttribute('fill','#ff5a2a');
  carbon.style.filter='drop-shadow(0 0 10px #ff7a2a)';cFlame.style.transition='.4s';cFlame.setAttribute('opacity','1');
  cread.textContent='🔥 Le carbone rougeoie et brûle : C + O₂ → CO₂';
  let p=0;burnT=setInterval(()=>{p++;
    if(Math.random()<.6)sfx.bubble();
    // bulles de CO₂ dans l'eau de chaux
    const b=document.createElementNS('http://www.w3.org/2000/svg','circle');
    b.setAttribute('cx',244+Math.random()*22);b.setAttribute('cy',236);b.setAttribute('r',1.6+Math.random()*1.6);
    b.setAttribute('fill','#fff');b.setAttribute('opacity','.85');
    const a=document.createElementNS('http://www.w3.org/2000/svg','animate');
    a.setAttribute('attributeName','cy');a.setAttribute('from','236');a.setAttribute('to','152');
    a.setAttribute('dur',(.7+Math.random()*.5)+'s');a.setAttribute('repeatCount','1');
    b.appendChild(a);cBub.appendChild(b);setTimeout(()=>b.remove(),1200);
    // l'eau de chaux se trouble progressivement
    milk.setAttribute('opacity',Math.min(p/22,.92));
    if(p>=22){clearInterval(burnT);burnT='done';
      cread.textContent='✅ L\'eau de chaux s\'est troublée (blanc laiteux) : le gaz est bien du CO₂.';}
  },180);
}
function resetCarbon(){if(burnT&&burnT!=='done')clearInterval(burnT);burnT=null;
  carbon.setAttribute('fill','#2a2a2a');carbon.style.filter='';cFlame.setAttribute('opacity','0');
  milk.setAttribute('opacity','0');cBub.innerHTML='';cread.textContent='Le carbone (noir) attend dans le dioxygène.';}
document.getElementById('burnC').onclick=burnCarbon;
document.getElementById('resetC').onclick=()=>{sfx.click();resetCarbon();};

/* =============== BIOLOGIE =============== */
document.querySelectorAll('.bioTab').forEach(t=>t.onclick=()=>{document.querySelectorAll('.bioTab').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.bioView').forEach(x=>x.classList.remove('active'));t.classList.add('active');document.getElementById(t.dataset.b).classList.add('active');sfx.click();});

/* ---- microscope : échantillons + zoom ---- */
const scopeC=document.getElementById('scopeC'),tag=document.getElementById('tag');
const microDesc=document.getElementById('microDesc');
let sample='vegetal',zoom=1.4;
function showTag(e,txt){e.stopPropagation();tag.textContent=txt;const sr=document.querySelector('.scope').getBoundingClientRect();
  tag.style.left=Math.max(4,e.clientX-sr.left-30)+'px';tag.style.top=Math.max(4,e.clientY-sr.top-28)+'px';tag.style.opacity=1;clearTimeout(tag._t);tag._t=setTimeout(()=>tag.style.opacity=0,1900);}
function rnd(a,b){return a+Math.random()*(b-a);}
function buildSample(){scopeC.innerHTML='';
  if(sample==='vegetal'||sample==='animal'){
    const cell=document.createElement('div');cell.className='cell'+(sample==='animal'?' acell':'');scopeC.appendChild(cell);
    const org=[['nucleus','54%','34%','Noyau · contient l\'ADN'],['mito','18%','56%','Mitochondrie · énergie (ATP)'],['vacuole','16%','24%','Vacuole · réserve d\'eau']];
    if(sample==='vegetal')org.push(['chloro','30%','24%','Chloroplaste · photosynthèse']);
    org.forEach(([cl,l,t,n])=>{const d=document.createElement('div');d.className='organ '+cl;d.style.left=l;d.style.top=t;d.dataset.n=n;
      d.addEventListener('pointerdown',e=>showTag(e,n));cell.appendChild(d);});
    microDesc.textContent=sample==='vegetal'?'Cellule végétale : paroi, vacuole et chloroplastes. Touche un organite.':'Cellule animale : pas de paroi ni de chloroplaste. Touche un organite.';
  } else { // sang
    for(let i=0;i<46;i++){const d=document.createElement('div');d.className='rbc';d.style.left=rnd(6,80)+'%';d.style.top=rnd(6,80)+'%';
      d.addEventListener('pointerdown',e=>showTag(e,'Globule rouge (hématie) · transporte l\'O₂'));scopeC.appendChild(d);}
    for(let i=0;i<4;i++){const d=document.createElement('div');d.className='wbc';d.style.left=rnd(15,70)+'%';d.style.top=rnd(15,70)+'%';
      d.addEventListener('pointerdown',e=>showTag(e,'Globule blanc (leucocyte) · défense'));scopeC.appendChild(d);}
    for(let i=0;i<8;i++){const d=document.createElement('div');d.className='plt';d.style.left=rnd(8,85)+'%';d.style.top=rnd(8,85)+'%';
      d.addEventListener('pointerdown',e=>showTag(e,'Plaquette · coagulation'));scopeC.appendChild(d);}
    microDesc.textContent='Frottis sanguin : beaucoup de globules rouges, quelques globules blancs et des plaquettes. Touche une cellule.';
  }
}
function applyZoom(){scopeC.style.transform=`scale(${zoom})`;document.getElementById('zlabel').textContent='×'+Math.round(zoom*28);}
document.querySelectorAll('#sample button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#sample button').forEach(x=>x.classList.remove('on'));b.classList.add('on');sample=b.dataset.s;sfx.click();buildSample();});
document.getElementById('zoom').oninput=e=>{zoom=+e.target.value;applyZoom();};
buildSample();applyZoom();

/* ---- photosynthèse ---- */
const light=document.getElementById('light'),sun=document.getElementById('sun'),plant=document.getElementById('plant');
setInterval(()=>{const v=+light.value;if(v<5)return;if(Math.random()<v/130){const b=document.createElement('div');b.className='obub';b.style.left=(42+Math.random()*55)+'%';b.style.bottom='146px';plant.appendChild(b);
  let y=146;const f=setInterval(()=>{y+=4;b.style.bottom=y+'px';b.style.opacity=Math.max(0,1-(y-146)/80);if(y>230){clearInterval(f);b.remove();}},40);}},240);
light.oninput=()=>{const v=+light.value;sun.style.setProperty('--glow',(12+v/2.5)+'px');sun.style.opacity=.4+v/170;document.getElementById('oread').textContent='Production O₂ : '+(v<20?'faible':v<60?'moyenne':'forte');};
light.oninput();

/* ---- osmose (Dutrochet) ---- */
const sugar=document.getElementById('sugar'),osLiq=document.getElementById('osLiq'),osArrows=document.getElementById('osArrows');
let osLevel=88; // hauteur de liquide dans le tube
function osTick(){const conc=+sugar.value;
  // plus c'est concentré, plus l'eau entre et plus le niveau monte
  const target=40+conc*1.6; // hauteur cible
  osLevel+=(target-osLevel)*0.08;
  const h=Math.max(6,Math.min(osLevel,226));osLiq.setAttribute('height',h);osLiq.setAttribute('y',238-h);
  document.getElementById('osread').textContent=conc<8?'Équilibre : pas de mouvement net.':
    conc<50?'Endosmose lente : l\'eau entre, le niveau monte un peu.':'Endosmose forte : l\'eau entre vite, le niveau monte beaucoup !';
}
setInterval(osTick,60);
// petites flèches d'eau qui entrent
sugar.oninput=()=>{osArrows.innerHTML='';const conc=+sugar.value;const n=Math.round(conc/25);
  for(let i=0;i<n;i++){const a=document.createElementNS('http://www.w3.org/2000/svg','text');a.setAttribute('x',60+i*40);a.setAttribute('y',236);a.setAttribute('font-size','13');a.setAttribute('fill','#2b8fe0');a.textContent='→';osArrows.appendChild(a);}};
sugar.oninput();

/* =============== TP : MISSIONS PRATIQUES =============== */
const TP=[
 {cat:"💧 L'eau",items:[
   {ic:"⚡",t:"Décomposer l'eau",goal:"Monte le circuit, recueille H₂ et O₂.",mode:"electro"},
   {ic:"💧",t:"Synthétiser l'eau",goal:"Choisis le mélange 2 H₂ + O₂ et approche la bûchette.",mode:"synth"},
   {ic:"🔥",t:"Reconnaître un gaz",goal:"Teste H₂ (pop) et O₂ (la flamme se ravive).",mode:"synth"},
 ]},
 {cat:"🔥 Combustions",items:[
   {ic:"🔥",t:"Combustion du carbone",goal:"Brûle le carbone : le CO₂ trouble l'eau de chaux.",mode:"combustion"},
 ]},
 {cat:"🧪 Ions & précipités",items:[
   {ic:"🔵",t:"Identifier un métal",goal:"Verse de la soude sur CuSO₄, FeCl₃ ou NiSO₄.",mode:"chimie"},
   {ic:"⚪",t:"Test des chlorures",goal:"Ajoute AgNO₃ à du NaCl → précipité blanc.",mode:"chimie"},
   {ic:"⬜",t:"Test des sulfates",goal:"Ajoute BaCl₂ à un sulfate → précipité blanc.",mode:"chimie"},
   {ic:"🟡",t:"Pluie d'or",goal:"Mélange Pb(NO₃)₂ et KI → PbI₂ jaune.",mode:"chimie"},
 ]},
 {cat:"⚗️ Acides, bases, oxydo-réduction",items:[
   {ic:"🌸",t:"Acide ou base ?",goal:"Teste avec les indicateurs, puis neutralise.",mode:"chimie"},
   {ic:"🟣",t:"Décolorer le permanganate",goal:"Ajoute SO₂ ou H₂O₂ à KMnO₄.",mode:"chimie"},
   {ic:"💥",t:"Réaction explosive",goal:"Mélange KMnO₄ et glycérine… recule !",mode:"chimie"},
 ]},
 {cat:"🧬 Biologie",items:[
   {ic:"🩸",t:"Observer le sang",goal:"Choisis la lame Sang et zoome sur les cellules.",mode:"bio"},
   {ic:"💧",t:"Osmose de Dutrochet",goal:"Règle le sucre et regarde l'eau traverser la membrane.",mode:"bio"},
   {ic:"🌿",t:"Photosynthèse",goal:"Augmente la lumière, compte les bulles d'O₂.",mode:"bio"},
 ]},
];
const tpList=document.getElementById('tpList');
function renderTP(){tpList.innerHTML='';
  TP.forEach(g=>{const h=document.createElement('div');h.className='tpcat';h.textContent=g.cat;tpList.appendChild(h);
    g.items.forEach(e=>{const card=document.createElement('div');card.className='tpcard';
      card.innerHTML=`<span class="ic">${e.ic}</span><div style="flex:1"><div class="t">${e.t}</div><div class="q">${e.goal}</div></div><span class="tpgo">▶</span>`;
      card.onclick=()=>{sfx.click();launchTP(e);};tpList.appendChild(card);});});}
function launchTP(e){document.querySelector(`.tab[data-v="${e.mode}"]`).click();toast(e.ic+' '+e.t+' — '+e.goal);}
function toast(msg){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t);}
  t.textContent=msg;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),4500);}
renderTP();

/* =============== TABLEAU PÉRIODIQUE (118 éléments) =============== */
const PT=`1 H Hydrogène nm 1 1
2 He Hélium ng 18 1
3 Li Lithium am 1 2
4 Be Béryllium ae 2 2
5 B Bore met 13 2
6 C Carbone nm 14 2
7 N Azote nm 15 2
8 O Oxygène nm 16 2
9 F Fluor hal 17 2
10 Ne Néon ng 18 2
11 Na Sodium am 1 3
12 Mg Magnésium ae 2 3
13 Al Aluminium ptm 13 3
14 Si Silicium met 14 3
15 P Phosphore nm 15 3
16 S Soufre nm 16 3
17 Cl Chlore hal 17 3
18 Ar Argon ng 18 3
19 K Potassium am 1 4
20 Ca Calcium ae 2 4
21 Sc Scandium tm 3 4
22 Ti Titane tm 4 4
23 V Vanadium tm 5 4
24 Cr Chrome tm 6 4
25 Mn Manganèse tm 7 4
26 Fe Fer tm 8 4
27 Co Cobalt tm 9 4
28 Ni Nickel tm 10 4
29 Cu Cuivre tm 11 4
30 Zn Zinc tm 12 4
31 Ga Gallium ptm 13 4
32 Ge Germanium met 14 4
33 As Arsenic met 15 4
34 Se Sélénium nm 16 4
35 Br Brome hal 17 4
36 Kr Krypton ng 18 4
37 Rb Rubidium am 1 5
38 Sr Strontium ae 2 5
39 Y Yttrium tm 3 5
40 Zr Zirconium tm 4 5
41 Nb Niobium tm 5 5
42 Mo Molybdène tm 6 5
43 Tc Technétium tm 7 5
44 Ru Ruthénium tm 8 5
45 Rh Rhodium tm 9 5
46 Pd Palladium tm 10 5
47 Ag Argent tm 11 5
48 Cd Cadmium tm 12 5
49 In Indium ptm 13 5
50 Sn Étain ptm 14 5
51 Sb Antimoine met 15 5
52 Te Tellure met 16 5
53 I Iode hal 17 5
54 Xe Xénon ng 18 5
55 Cs Césium am 1 6
56 Ba Baryum ae 2 6
57 La Lanthane ln 4 9
58 Ce Cérium ln 5 9
59 Pr Praséodyme ln 6 9
60 Nd Néodyme ln 7 9
61 Pm Prométhium ln 8 9
62 Sm Samarium ln 9 9
63 Eu Europium ln 10 9
64 Gd Gadolinium ln 11 9
65 Tb Terbium ln 12 9
66 Dy Dysprosium ln 13 9
67 Ho Holmium ln 14 9
68 Er Erbium ln 15 9
69 Tm Thulium ln 16 9
70 Yb Ytterbium ln 17 9
71 Lu Lutécium ln 18 9
72 Hf Hafnium tm 4 6
73 Ta Tantale tm 5 6
74 W Tungstène tm 6 6
75 Re Rhénium tm 7 6
76 Os Osmium tm 8 6
77 Ir Iridium tm 9 6
78 Pt Platine tm 10 6
79 Au Or tm 11 6
80 Hg Mercure tm 12 6
81 Tl Thallium ptm 13 6
82 Pb Plomb ptm 14 6
83 Bi Bismuth ptm 15 6
84 Po Polonium ptm 16 6
85 At Astate hal 17 6
86 Rn Radon ng 18 6
87 Fr Francium am 1 7
88 Ra Radium ae 2 7
89 Ac Actinium an 4 10
90 Th Thorium an 5 10
91 Pa Protactinium an 6 10
92 U Uranium an 7 10
93 Np Neptunium an 8 10
94 Pu Plutonium an 9 10
95 Am Américium an 10 10
96 Cm Curium an 11 10
97 Bk Berkélium an 12 10
98 Cf Californium an 13 10
99 Es Einsteinium an 14 10
100 Fm Fermium an 15 10
101 Md Mendélévium an 16 10
102 No Nobélium an 17 10
103 Lr Lawrencium an 18 10
104 Rf Rutherfordium tm 4 7
105 Db Dubnium tm 5 7
106 Sg Seaborgium tm 6 7
107 Bh Bohrium tm 7 7
108 Hs Hassium tm 8 7
109 Mt Meitnérium tm 9 7
110 Ds Darmstadtium tm 10 7
111 Rg Roentgenium tm 11 7
112 Cn Copernicium tm 12 7
113 Nh Nihonium ptm 13 7
114 Fl Flérovium ptm 14 7
115 Mc Moscovium ptm 15 7
116 Lv Livermorium ptm 16 7
117 Ts Tennesse hal 17 7
118 Og Oganesson ng 18 7`;
const FAM={am:"Métal alcalin",ae:"Métal alcalino-terreux",tm:"Métal de transition",ptm:"Métal pauvre",
  met:"Métalloïde",nm:"Non-métal",hal:"Halogène",ng:"Gaz noble",ln:"Lanthanide",an:"Actinide",unk:"Inconnu"};
const NOTE={H:"Le plus léger ; forme l'eau avec l'oxygène.",O:"Indispensable à la combustion et à la respiration.",
  C:"Base de la chimie organique et du vivant.",N:"≈ 78 % de l'air que tu respires.",S:"Le soufre ; son dérivé SO₂ décolore le permanganate.",
  Fe:"Le fer ; ions Fe³⁺ → précipité rouille avec la soude.",Cu:"Le cuivre ; ions Cu²⁺ → précipité bleu.",
  Na:"Sodium ; avec le chlore donne le sel (NaCl).",Cl:"Chlore ; l'ion Cl⁻ se révèle par AgNO₃.",
  Ca:"Calcium ; l'eau de chaux sert à détecter le CO₂.",Al:"Aluminium ; métal léger très répandu.",
  Au:"L'or ; métal noble, ne s'oxyde pas.",Ag:"L'argent ; AgCl précipite en blanc.",
  Mn:"Manganèse ; le permanganate KMnO₄ est violet.",K:"Potassium ; métal alcalin très réactif."};
const grid=document.getElementById('ptgrid');
PT.trim().split('\n').forEach(line=>{const[z,sym,nom,cat,g,p]=line.trim().split(/\s+/);
  const el=document.createElement('div');el.className='elem '+cat;el.style.gridColumn=g;el.style.gridRow=p;
  el.innerHTML=`<small>${z}</small>${sym}`;
  el.onclick=()=>{sfx.click();const info=document.getElementById('einfo');
    info.innerHTML=`<div class="big">${sym}</div><div class="meta"><b>${nom}</b> · Z = ${z}
      <div class="fam">${FAM[cat]}</div>${NOTE[sym]?`<div class="note">${NOTE[sym]}</div>`:''}</div>`;};
  grid.appendChild(el);});
const leg=document.getElementById('legend');
Object.keys(FAM).filter(k=>k!=='unk').forEach(k=>{const s=document.createElement('span');s.innerHTML=`<i class="${k}" style="background:${getComputedStyle(document.querySelector('.'+k)).backgroundColor}"></i>${FAM[k]}`;leg.appendChild(s);});