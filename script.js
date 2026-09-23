// Tema
const root=document.documentElement;
const themeBtn=document.getElementById('themeToggle');
const saved=localStorage.getItem('nk-theme');
if(saved) root.setAttribute('data-theme',saved);
themeBtn.textContent=root.getAttribute('data-theme')==='dark'?'☀️':'🌙';
themeBtn.onclick=()=>{const n=root.getAttribute('data-theme')==='dark'?'light':'dark';root.setAttribute('data-theme',n);localStorage.setItem('nk-theme',n);themeBtn.textContent=n==='dark'?'☀️':'🌙';};

// Nav mobile + progress + toTop
const ham=document.getElementById('hamburger'),links=document.getElementById('navLinks');
ham.onclick=()=>links.classList.toggle('open');
links.querySelectorAll('a').forEach(a=>a.onclick=()=>links.classList.remove('open'));
const bar=document.getElementById('progressBar'),toTop=document.getElementById('toTop');
addEventListener('scroll',()=>{const h=document.documentElement;const p=h.scrollTop/(h.scrollHeight-h.clientHeight)*100;bar.style.width=p+'%';toTop.style.display=h.scrollTop>600?'block':'none';document.getElementById('navbar').style.transform=h.scrollTop>50?'scale(.99)':'';});
toTop.onclick=()=>scrollTo({top:0,behavior:'smooth'});

// Typing
const phrases=['🎯 Atención de 10-15 minutos… ¡con juego!','💾 Memoria que se guarda con emoción…','❤️ Sin emoción no hay aprendizaje…','🎮 Jugar es aprender en serio…'];
let pi=0,ci=0,del=false;const ty=document.getElementById('typing');
(function type(){const cur=phrases[pi];ty.textContent=cur.slice(0,ci);if(!del){ci++;if(ci>cur.length){del=true;setTimeout(type,1400);return;}}else{ci--;if(ci===0){del=false;pi=(pi+1)%phrases.length;}}setTimeout(type,del?30:60);})();

// Reveal + counters
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');e.target.querySelectorAll('.stat-num').forEach(runCount);if(e.target.classList.contains('stat'))runCount(e.target.querySelector('.stat-num'));}}),{threshold:.15});
document.querySelectorAll('.reveal,.hero-stats').forEach(el=>io.observe(el));
function runCount(el){if(!el||el.dataset.done)return;el.dataset.done=1;const end=+el.dataset.count;let s=0;const t=setInterval(()=>{s+=Math.ceil(end/30);if(s>=end){s=end;clearInterval(t);}el.textContent=s+(end===100?'+':'');},60);}

// Cursor glow + particles
const glow=document.getElementById('cursorGlow');
addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';});
const cv=document.getElementById('particles'),ctx=cv.getContext('2d');let P=[];
function resize(){cv.width=innerWidth;cv.height=innerHeight;}resize();addEventListener('resize',resize);
for(let i=0;i<60;i++)P.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*3+1,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,c:['#7c3aed','#ec4899','#06b6d4','#f59e0b'][i%4]});
(function anim(){ctx.clearRect(0,0,cv.width,cv.height);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>cv.width)p.vx*=-1;if(p.y<0||p.y>cv.height)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fillStyle=p.c;ctx.globalAlpha=.5;ctx.fill();});requestAnimationFrame(anim);})();

// Tabs
document.querySelectorAll('.tab-btn').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tab-content').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(b.dataset.tab).classList.add('active');});

// Actividades toggle + filtro
document.querySelectorAll('.act-toggle').forEach(btn=>btn.onclick=()=>{const body=btn.nextElementSibling;const open=body.classList.toggle('open');btn.textContent=open?'Ocultar plan ▲':'Ver plan completo ▼';});
document.querySelectorAll('.filter-btn').forEach(f=>f.onclick=()=>{document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));f.classList.add('active');const v=f.dataset.filter;document.querySelectorAll('.act-card').forEach(c=>c.style.display=(v==='all'||c.dataset.cat===v)?'flex':'none');});

// Juego atención
let attScore=0,attTimer=null,attLeft=30;
const attGrid=document.getElementById('attGrid'),attS=document.getElementById('attScore'),attT=document.getElementById('attTime');
function drawAtt(){attGrid.innerHTML='';const base=['🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎'];const diffs=['🍏','🍐','🍓','🐸'];const d=diffs[Math.floor(Math.random()*diffs.length)];const pos=Math.floor(Math.random()*20);for(let i=0;i<20;i++){const b=document.createElement('button');b.textContent=i===pos?d:'🍎';b.onclick=()=>{if(i===pos){attScore+=10;attS.textContent='Puntos: '+attScore;drawAtt();}else{attScore=Math.max(0,attScore-2);attS.textContent='Puntos: '+attScore;}};attGrid.appendChild(b);}}
document.getElementById('startAttention').onclick=e=>{attScore=0;attLeft=30;attS.textContent='Puntos: 0';drawAtt();e.target.textContent='↻ Reiniciar';clearInterval(attTimer);attTimer=setInterval(()=>{attLeft--;attT.textContent='⏱ '+attLeft+'s';if(attLeft<=0){clearInterval(attTimer);attGrid.innerHTML='<p style="grid-column:1/-1">🎉 ¡Tiempo! Sacaste <b>'+attScore+' pts</b>. En el aula: premia el intento, no la velocidad.</p>';}},1000);};

// Memoria game
const emojis=['🐶','🐱','🦁','🐸','🐵','🐙','🦋','🐝'];
let memFirst=null,memLock=false,memMoves=0;
function drawMem(){const deck=[...emojis,...emojis].sort(()=>Math.random()-.5);const g=document.getElementById('memGrid');g.innerHTML='';memMoves=0;document.getElementById('memMoves').textContent='Intentos: 0';emojis.length;deck.forEach(e=>{const b=document.createElement('button');b.dataset.v=e;b.textContent='❔';b.onclick=()=>{if(memLock||b.classList.contains('open')||b.classList.contains('done'))return;b.classList.add('open');b.textContent=e;if(!memFirst){memFirst=b;}else{memMoves++;document.getElementById('memMoves').textContent='Intentos: '+memMoves;if(memFirst.dataset.v===e){memFirst.classList.add('done');b.classList.add('done');memFirst=null;if(g.querySelectorAll('.done').length===16)setTimeout(()=>alert('🎉 ¡Increíble! Memoria de elefante en '+memMoves+' intentos'),300);}else{memLock=true;const a=memFirst;memFirst=null;setTimeout(()=>{a.classList.remove('open');b.classList.remove('open');a.textContent='❔';b.textContent='❔';memLock=false;},700);}}};g.appendChild(b);});}
drawMem();document.getElementById('restartMemory').onclick=drawMem;

// Quiz
const QUIZ=[{q:'¿Qué es la neurociencia educativa?',o:['Un puente entre cerebro, mente y educación','Solo estudiar neuronas en laboratorio','Un método para memorizar más rápido'],a:0},{q:'¿Cuánto tiempo sostiene la atención un niño de 4-5 años?',o:['1 hora seguida','10-15 minutos','Todo el día'],a:1},{q:'¿Qué fortalece la memoria a largo plazo?',o:['Gritos y miedo','Emoción + repetición lúdica + sueño','Copiar planas en silencio'],a:1},{q:'¿Qué parte del cerebro controla impulsos y aún está inmadura a los 5 años?',o:['Corteza prefrontal','Hueso frontal','Cerebelo del pie'],a:0},{q:'¿Qué es mejor para motivar?',o:['Solo premios materiales','Curiosidad, elección y celebrar el esfuerzo','Comparar con otros niños'],a:1}];
let qi=0,qs=0;const qQ=document.getElementById('quizQ'),qO=document.getElementById('quizOpts'),qP=document.getElementById('quizProg'),qR=document.getElementById('quizResult');
function showQ(){qR.innerHTML='';const cur=QUIZ[qi];qQ.innerHTML='<h3>'+(qi+1)+'. '+cur.q+'</h3>';qP.textContent='Pregunta '+(qi+1)+'/'+QUIZ.length;qO.innerHTML='';cur.o.forEach((t,i)=>{const b=document.createElement('button');b.textContent=t;b.onclick=()=>{if(i===cur.a){b.classList.add('correct');qs++;}else{b.classList.add('wrong');qO.children[cur.a].classList.add('correct');}setTimeout(()=>{qi++;if(qi<QUIZ.length)showQ();else{qQ.innerHTML='🎓 Quiz terminado';qO.innerHTML='';qP.textContent='';qR.innerHTML='<h2>'+qs+'/5 '+(qs===5?'🏆 ¡PRO NEURO!':'💪 ¡Bien! Repasa y reintenta')+'</h2><button class="btn btn-primary" onclick="location.reload()">Reintentar</button>';}},800);};qO.appendChild(b);});}
showQ();document.getElementById('quizNext').onclick=()=>{qi=(qi+1)%QUIZ.length;showQ();};

// Copiar guion
document.getElementById('copySpeech').onclick=e=>{const t=document.querySelector('.speech p').innerText;navigator.clipboard.writeText(t);e.target.textContent='✅ ¡Copiado!';setTimeout(()=>e.target.textContent='📋 Copiar guion',2000);};
