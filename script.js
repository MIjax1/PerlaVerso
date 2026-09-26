const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

const audio = $('#bgMusic');
const enterBtn = $('#enterBtn');
const musicPlayer = $('#musicPlayer');
const musicToggle = $('#musicToggle');
const musicMini = $('#musicMini');
const musicMiniIcon = $('#musicMiniIcon');
const volumeBtn = $('#volumeBtn');
const audioProgress = $('#audioProgress');
const audioProgressFill = $('#audioProgressFill');
const toast = $('#toast');
const topbar = $('#topbar');
const roadFill = $('#roadFill');
let toastTimer;

function showToast(message, duration = 2600) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

async function playMusic() {
  try {
    await audio.play();
    musicPlayer.classList.add('visible');
    musicToggle.classList.add('playing');
    musicMini.classList.add('playing');
    musicMiniIcon.textContent = 'Ⅱ';
  } catch (error) {
    musicPlayer.classList.add('visible');
    showToast('Coloca tu MP3 en assets/audio/caminando-por-la-vida.mp3 para activar la música.', 5000);
  }
}

function pauseMusic() {
  audio.pause();
  musicToggle.classList.remove('playing');
  musicMini.classList.remove('playing');
  musicMiniIcon.textContent = '♫';
}

function toggleMusic() {
  if (audio.paused) playMusic();
  else pauseMusic();
}

enterBtn?.addEventListener('click', async () => {
  await playMusic();
  $('#coincidencias').scrollIntoView({ behavior: 'smooth' });
});
musicToggle?.addEventListener('click', toggleMusic);
musicMini?.addEventListener('click', toggleMusic);

volumeBtn?.addEventListener('click', () => {
  audio.muted = !audio.muted;
  volumeBtn.textContent = audio.muted ? '×' : '◖';
  showToast(audio.muted ? 'Música en silencio' : 'Sonido activado');
});

audio?.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const p = (audio.currentTime / audio.duration) * 100;
  audioProgressFill.style.width = `${p}%`;
});

audioProgress?.addEventListener('click', (e) => {
  if (!audio.duration) return;
  const rect = audioProgress.getBoundingClientRect();
  audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
});

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => observer.observe(el));

function updateScrollUI() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - innerHeight;
  const progress = max > 0 ? scrollY / max : 0;
  roadFill.style.height = `${Math.min(100, progress * 100)}%`;
  topbar.classList.toggle('scrolled', scrollY > 40);
}
addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

// Starfield
const canvas = $('#sky');
const ctx = canvas.getContext('2d');
let stars = [];
let dpr = Math.min(devicePixelRatio || 1, 2);

function resizeSky() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(170, Math.max(70, Math.floor(innerWidth / 8)));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.25 + 0.2,
    a: Math.random() * 0.65 + 0.1,
    s: Math.random() * 0.25 + 0.04,
    phase: Math.random() * Math.PI * 2
  }));
}

function drawSky(t = 0) {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const s of stars) {
    const twinkle = s.a + Math.sin(t * 0.001 * s.s + s.phase) * 0.12;
    ctx.beginPath();
    ctx.fillStyle = `rgba(220,235,255,${Math.max(.05, twinkle)})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(drawSky);
}
resizeSky();
addEventListener('resize', resizeSky);
requestAnimationFrame(drawSky);

// Cursor sparks (desktop only)
let lastSpark = 0;
addEventListener('pointermove', (e) => {
  if (innerWidth < 800) return;
  const now = performance.now();
  if (now - lastSpark < 48 || Math.random() > .62) return;
  lastSpark = now;
  const spark = document.createElement('i');
  spark.className = 'cursor-spark';
  spark.style.left = `${e.clientX}px`;
  spark.style.top = `${e.clientY}px`;
  spark.style.setProperty('--sx', `${(Math.random() - .5) * 36}px`);
  spark.style.setProperty('--sy', `${Math.random() * 30 + 10}px`);
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 800);
});

// Call simulation
const callModal = $('#callModal');
const callStage = $('#callStage');
const callBtn = $('#callBtn');
const simulateCallBtn = $('#simulateCallBtn');
const endCallBtn = $('#endCallBtn');
const phoneStatus = $('#phoneStatus');
let callTimer;
let callIndex = 0;
const callStages = [
  'Llamando…',
  'Conectando…',
  'Perla fue por agua 😅',
  'Intentando de nuevo…',
  'El micrófono decidió no colaborar',
  'Ahora sí: conectados ✓',
  '“Solo unos minutos”… ajá 😌'
];

function startCall() {
  clearInterval(callTimer);
  callIndex = 0;
  callStage.textContent = callStages[0];
  callModal.classList.add('open');
  callModal.setAttribute('aria-hidden', 'false');
  phoneStatus.textContent = 'Llamando…';
  callTimer = setInterval(() => {
    callIndex++;
    if (callIndex >= callStages.length) {
      clearInterval(callTimer);
      return;
    }
    callStage.textContent = callStages[callIndex];
    phoneStatus.textContent = callStages[callIndex];
  }, 1450);
}

function endCall() {
  clearInterval(callTimer);
  callModal.classList.remove('open');
  callModal.setAttribute('aria-hidden', 'true');
  phoneStatus.textContent = '¿Hacemos llamada?';
}
callBtn?.addEventListener('click', startCall);
simulateCallBtn?.addEventListener('click', startCall);
endCallBtn?.addEventListener('click', endCall);
callModal?.addEventListener('click', (e) => { if (e.target === callModal) endCall(); });

// Route map
const routeMessages = {
  Puno: 'Puno · punto de partida de muchas historias y proyectos.',
  Arequipa: 'Arequipa · donde “a ver si coincidimos” terminó en coincidencia.',
  Lima: 'Lima · reuniones, conexiones, eventos y nuevas rutas.',
  Huaraz: 'Huaraz · ruta desbloqueada; otra visita quedó como misión pendiente.',
  Tacna: 'Tacna · “Tacnicaaa es la voz” + misión cevichocho ⚡'
};
const routeTooltip = $('#routeTooltip');
$$('.map-point').forEach(point => {
  point.addEventListener('click', () => {
    $$('.map-point').forEach(p => p.classList.remove('active'));
    point.classList.add('active');
    const key = point.dataset.route;
    routeTooltip.textContent = routeMessages[key];
    showToast(routeMessages[key]);
  });
});

// Constellation
const starDetail = $('#starDetail');
$$('.star-event').forEach(star => {
  star.addEventListener('click', () => {
    $$('.star-event').forEach(s => s.classList.remove('active'));
    star.classList.add('active');
    starDetail.innerHTML = `<span>✦</span><div><strong>${star.dataset.title}</strong><p>${star.dataset.text}</p></div>`;
  });
});

// Word cloud playful interactions
$$('#wordCloud button').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.remove('jump');
    void btn.offsetWidth;
    btn.style.setProperty('--jx', `${(Math.random() - .5) * 60}px`);
    btn.style.setProperty('--jy', `${-(Math.random() * 30 + 10)}px`);
    btn.style.setProperty('--jr', `${(Math.random() - .5) * 18}deg`);
    btn.classList.add('jump');
    const messages = {
      'Pipipi': 'Pipipi detectado 🥺',
      'Perlitaaaa': 'Nivel de entusiasmo: 100%',
      'Cevichocho': 'Misión secundaria todavía activa 🥗',
      '¿Llamada?': 'Probabilidad de durar “unos minutos”: cuestionable ☎',
      'Perlaverso ⚡': 'El Perlaverso sí existe. Confirmado.',
      'Mori': '…pero sobrevivió 😌'
    };
    showToast(messages[btn.textContent.trim()] || `${btn.textContent.trim()} ✦`);
  });
});

// Final interaction
const continueBtn = $('#continueBtn');
const nextMission = $('#nextMission');
continueBtn?.addEventListener('click', () => {
  nextMission.innerHTML = '<strong>PRÓXIMA MISIÓN: AÚN NO DESBLOQUEADA ⚡</strong><br><span>Destino no definido. Y quizá ahí está lo divertido.</span>';
  continueBtn.textContent = 'PERLAVERSO +1';
  burst(window.innerWidth / 2, window.innerHeight / 2, 34);
});

// Tiny easter egg: tap logo five times
let brandClicks = 0;
let brandReset;
$('.brand')?.addEventListener('click', (e) => {
  brandClicks++;
  clearTimeout(brandReset);
  brandReset = setTimeout(() => brandClicks = 0, 1600);
  if (brandClicks >= 5) {
    e.preventDefault();
    showToast('⚡ Perlaverso fortalecido +1');
    burst(innerWidth * .18, 90, 26);
    brandClicks = 0;
  }
});

function burst(x, y, amount = 24) {
  for (let i = 0; i < amount; i++) {
    const spark = document.createElement('i');
    spark.className = 'cursor-spark';
    spark.style.left = `${x + (Math.random() - .5) * 40}px`;
    spark.style.top = `${y + (Math.random() - .5) * 40}px`;
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 100;
    spark.style.setProperty('--sx', `${Math.cos(angle) * dist}px`);
    spark.style.setProperty('--sy', `${Math.sin(angle) * dist}px`);
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 800);
  }
}

// Keyboard accessibility for Escape
addEventListener('keydown', (e) => {
  if (e.key === 'Escape') endCall();
});

// Show the player after some scrolling even if audio isn't started yet
addEventListener('scroll', () => {
  if (scrollY > innerHeight * .45) musicPlayer.classList.add('visible');
}, { passive: true });


// PERLAVERSO V3 - AMOR + DINAMICA
const pvChapters = $$('.chapter');
const pvDots = $$('.chapter-dot');
const pvLabel = $('#currentChapterLabel');
const pvNext = $('#nextChapter');
const pvPrev = $('#prevChapter');
let pvActive = 0;

function pvGo(index){
  index=Math.max(0,Math.min(pvChapters.length-1,index));
  pvActive=index;
  pvChapters[index]?.scrollIntoView({behavior:'smooth',block:'start'});
}
function pvSetActive(index){
  pvActive=index;
  const ch=pvChapters[index];
  if(!ch)return;
  pvDots.forEach((d,i)=>d.classList.toggle('active',i===index));
  if(pvLabel)pvLabel.textContent=ch.dataset.chapterLabel||ch.id;
  if(pvPrev)pvPrev.disabled=index===0;
  if(pvNext)pvNext.disabled=index===pvChapters.length-1;
  if(ch.id==='coincidencias')pvAnimateMeter();
  if(ch.id==='logros')$$('.achievement-card').forEach((c,i)=>setTimeout(()=>c.classList.add('pv-unlocked'),i*130));
}
pvDots.forEach((d,i)=>d.addEventListener('click',()=>pvGo(i)));
pvNext?.addEventListener('click',()=>pvGo(pvActive+1));
pvPrev?.addEventListener('click',()=>pvGo(pvActive-1));
const pvObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting&&e.intersectionRatio>.52){
    const i=pvChapters.indexOf(e.target);
    if(i>=0)pvSetActive(i);
  }
}),{threshold:[.52,.7]});
pvChapters.forEach(c=>pvObserver.observe(c));
addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey||/input|textarea|select/i.test(document.activeElement?.tagName||''))return;
  if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();pvGo(pvActive+1)}
  if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();pvGo(pvActive-1)}
});
function pvAnimateMeter(){
  const bar=$('#coincidenceBar'),val=$('#coincidenceValue');
  if(!bar||!val)return;
  let n=0;bar.style.width='0%';val.textContent='0%';
  clearInterval(window.pvMeterTimer);
  window.pvMeterTimer=setInterval(()=>{
    n+=3;
    if(n>=87){n=87;clearInterval(window.pvMeterTimer)}
    bar.style.width=n+'%';val.textContent=n+'%';
  },28);
}
pvSetActive(0);

const pvHeartLayer=$('#heartLayer');
const pvLoveRain=$('#loveRainBtn');
const pvHeartHero=$('#heartHeroBtn');
const pvBigHeart=$('#bigHeartBtn');
const pvLoveNote=$('#loveNoteBtn');
const pvLoveModal=$('#loveModal');
const pvLoveClose=$('#loveModalClose');
const pvLoveLetterRain=$('#loveLetterRain');
let pvHeartRainActive=false;
const pvHeartShapes=['♡','♥','💗','💖','💕','✨'];

function pvHeartShape(){
  const r=Math.random();
  return r<.52?'♡':r<.72?'♥':r<.84?'💗':r<.91?'💖':r<.96?'💕':'✨';
}
function pvFallingHeart(delay,intensity){
  setTimeout(()=>{
    if(!pvHeartLayer)return;
    const h=document.createElement('span');
    h.className='falling-heart';h.textContent=pvHeartShape();
    h.style.left=(Math.random()*100)+'%';
    h.style.setProperty('--size',(14+Math.random()*25*(intensity||1))+'px');
    h.style.setProperty('--duration',(4.8+Math.random()*3.8)+'s');
    h.style.setProperty('--drift',((Math.random()-.5)*180)+'px');
    h.style.setProperty('--spin',((Math.random()>.5?1:-1)*(180+Math.random()*420))+'deg');
    if(h.textContent==='♡'||h.textContent==='♥')h.style.color=Math.random()>.5?'#ff8db2':'#ffd1df';
    pvHeartLayer.appendChild(h);
    h.addEventListener('animationend',()=>h.remove(),{once:true});
  },delay||0);
}
function pvHeartRain(amount,duration){
  if(pvHeartRainActive)return;
  pvHeartRainActive=true;
  amount=amount||85;duration=duration||5000;
  showToast('💗 Perlaverso en modo corazones');
  for(let i=0;i<amount;i++)pvFallingHeart(Math.random()*duration,1+Math.random()*.28);
  for(let i=0;i<12;i++)pvFallingHeart(i*45,1.2);
  setTimeout(()=>pvHeartRainActive=false,duration+1800);
}
function pvHeartBurst(x,y,amount){
  amount=amount||12;
  for(let i=0;i<amount;i++){
    const el=document.createElement('span');el.className='heart-pop';
    el.textContent=pvHeartShapes[Math.floor(Math.random()*5)];
    const a=Math.random()*Math.PI*2,d=35+Math.random()*110;
    el.style.left=x+'px';el.style.top=y+'px';
    el.style.setProperty('--px',(Math.cos(a)*d)+'px');
    el.style.setProperty('--py',(Math.sin(a)*d)+'px');
    el.style.setProperty('--pr',((Math.random()-.5)*180)+'deg');
    el.style.setProperty('--psize',(13+Math.random()*19)+'px');
    document.body.appendChild(el);setTimeout(()=>el.remove(),1050);
  }
}
function pvBurstElement(el,amount){
  if(!el)return;const r=el.getBoundingClientRect();pvHeartBurst(r.left+r.width/2,r.top+r.height/2,amount);
}
function pvOpenLove(){
  pvLoveModal?.classList.add('open');pvLoveModal?.setAttribute('aria-hidden','false');
  pvHeartBurst(innerWidth/2,innerHeight/2,18);
}
function pvCloseLove(){pvLoveModal?.classList.remove('open');pvLoveModal?.setAttribute('aria-hidden','true')}
pvLoveRain?.addEventListener('click',()=>{pvBurstElement(pvLoveRain,15);pvHeartRain(95,5600)});
pvHeartHero?.addEventListener('click',()=>{pvBurstElement(pvHeartHero,26);pvHeartRain(65,4000);setTimeout(pvOpenLove,650)});
pvBigHeart?.addEventListener('click',()=>{pvBurstElement(pvBigHeart,32);pvHeartRain(125,6500)});
pvLoveNote?.addEventListener('click',pvOpenLove);
pvLoveClose?.addEventListener('click',pvCloseLove);
pvLoveModal?.addEventListener('click',e=>{if(e.target===pvLoveModal)pvCloseLove()});
pvLoveLetterRain?.addEventListener('click',()=>{pvBurstElement(pvLoveLetterRain,25);pvHeartRain(115,6200);pvCloseLove()});
addEventListener('dblclick',e=>{if(e.target.closest('button,a,input,textarea'))return;pvHeartBurst(e.clientX,e.clientY,10)});
let pvTrail=0;
addEventListener('pointermove',e=>{
  if(innerWidth<800||Math.random()>.12)return;
  const now=performance.now();if(now-pvTrail<230)return;pvTrail=now;
  const h=document.createElement('span');h.className='heart-pop';h.textContent='♡';
  h.style.left=e.clientX+'px';h.style.top=e.clientY+'px';h.style.color='#ff9fbd';h.style.opacity='.55';
  h.style.setProperty('--px',((Math.random()-.5)*22)+'px');h.style.setProperty('--py',(-25-Math.random()*20)+'px');
  h.style.setProperty('--pr',((Math.random()-.5)*40)+'deg');h.style.setProperty('--psize',(10+Math.random()*6)+'px');
  document.body.appendChild(h);setTimeout(()=>h.remove(),1050);
});
setInterval(()=>{if(!document.hidden&&!pvHeartRainActive)pvFallingHeart(0,.65)},2600);
