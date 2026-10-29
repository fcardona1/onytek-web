(function(){
'use strict';
var d=document,w=window,$=function(s,c){return(c||d).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
var reduce=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=w.matchMedia&&w.matchMedia('(hover:hover) and (pointer:fine)').matches;
var mouse={x:-9999,y:-9999,on:false},shock=[],hidden=false;
d.addEventListener('visibilitychange',function(){hidden=d.hidden});
var CH='ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ONYTEK<>{}/=+'.split('');
function rc(a){return a[Math.floor(Math.random()*a.length)]}
function toast(m){var t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('on');setTimeout(function(){t.classList.remove('on')},3200)}

/* ---- lluvia Matrix ---- */
function Rain(cv,o){
  var ctx=cv.getContext('2d'),W,H,cols,drops,fs=o.fs,dpr=Math.min(w.devicePixelRatio||1,o.dpr||1.5),last=0;
  function size(){var r=cv.getBoundingClientRect();W=Math.max(1,r.width);H=Math.max(1,r.height);cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);cols=Math.ceil(W/fs);drops=[];for(var i=0;i<cols;i++)drops.push({y:Math.random()*-40,v:.4+Math.random()*.9})}
  size();w.addEventListener('resize',size);
  function frame(t){requestAnimationFrame(frame);if(hidden||t-last<(o.gap||40))return;last=t;
    ctx.fillStyle=o.fade;ctx.fillRect(0,0,W,H);ctx.font=fs+'px monospace';
    for(var i=0;i<cols;i++){var dr=drops[i],x=i*fs,y=dr.y*fs;
      if(o.mouse&&mouse.on){var dx=x-mouse.x,dy=y-mouse.y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<170)dr.y+=.9*(1-dist/170)}
      for(var s=0;s<shock.length;s++){var k=shock[s],dd=Math.abs(Math.sqrt((x-k.x)*(x-k.x)+(y-k.y)*(y-k.y))-k.r);if(dd<46)dr.y+=1.4}
      ctx.fillStyle=o.head;ctx.fillText(rc(CH),x,y);ctx.fillStyle=o.tail;ctx.fillText(rc(CH),x,y-fs);
      dr.y+=dr.v*(o.speed||1);if(y>H&&Math.random()>.975){dr.y=Math.random()*-20;dr.v=.4+Math.random()*.9}}}
  if(reduce){ctx.font=fs+'px monospace';for(var i=0;i<cols;i++)for(var j=0;j<H/fs;j+=2){ctx.fillStyle='rgba(92,200,255,'+(Math.random()*.4)+')';ctx.fillText(rc(CH),i*fs,j*fs)}return}
  requestAnimationFrame(frame);
}
var rain=$('#rain');if(rain)Rain(rain,{fs:17,fade:'rgba(28,27,25,.09)',head:'#EAE8E4',tail:'rgba(70,160,255,.85)',gap:42,mouse:true,dpr:1.25});
var gr=$('#gemrain');if(gr)Rain(gr,{fs:11,fade:'rgba(31,30,28,.18)',head:'#FFFFFF',tail:'#5CC8FF',gap:36,dpr:1.5,speed:1.3});
d.addEventListener('pointerdown',function(e){if(e.target.closest('a,button,input,select,textarea'))return;shock.push({x:e.clientX,y:e.clientY,r:0})});
(function loop(){requestAnimationFrame(loop);for(var i=shock.length-1;i>=0;i--){shock[i].r+=14;if(shock[i].r>520)shock.splice(i,1)}})();

/* ---- ratón ---- */
var spot=$('#spot'),gem=$('#gem');
w.addEventListener('pointermove',function(e){
  mouse.x=e.clientX;mouse.y=e.clientY;mouse.on=true;
  if(spot){spot.style.setProperty('--x',e.clientX+'px');spot.style.setProperty('--y',e.clientY+'px')}
  if(gem&&!reduce){var r=gem.parentNode.getBoundingClientRect(),px=(e.clientX-r.left-r.width/2)/r.width,py=(e.clientY-r.top-r.height/2)/r.height;gem.style.transform='rotateY('+(px*22).toFixed(1)+'deg) rotateX('+(-py*18).toFixed(1)+'deg)'}
});

/* ---- tilt ---- */
$$('[data-tilt]').forEach(function(el){
  el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    el.style.setProperty('--gx',(x*100)+'%');el.style.setProperty('--gy',(y*100)+'%');
    if(!reduce&&fine)el.style.transform='perspective(900px) rotateY('+((x-.5)*7).toFixed(2)+'deg) rotateX('+((.5-y)*7).toFixed(2)+'deg)'});
  el.addEventListener('pointerleave',function(){el.style.transform=''});
});

/* ---- scramble + glitch ---- */
function scramble(el,f,dur){if(reduce){el.textContent=f;return}var n=f.length,t0=performance.now();(function s(t){var p=Math.min(1,(t-t0)/(dur||1100)),o='';for(var i=0;i<n;i++)o+=(i<p*n||f[i]===' ')?f[i]:rc(CH);el.textContent=o;if(p<1)requestAnimationFrame(s)})(t0)}
var heroDone=false;
function runHero(){if(heroDone)return;heroDone=true;$$('.scr').forEach(function(e){scramble(e,e.getAttribute('data-t'),1400)});
  var h=$('#h1g');if(h&&!reduce){h.classList.add('go');setTimeout(function(){h.classList.remove('go')},700);setInterval(function(){if(hidden)return;h.classList.add('go');setTimeout(function(){h.classList.remove('go')},480)},7000)}}

/* ---- reveal ---- */
var io=('IntersectionObserver' in w)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -5% 0px'}):null;
$$('.rv').forEach(function(el,i){el.style.transitionDelay=(i%4)*60+'ms';if(io)io.observe(el);else el.classList.add('in')});

/* ---- progreso + nav ---- */
var bar=$('#topbar i'),nav=$('#nav');
function onScroll(){var st=w.scrollY||d.documentElement.scrollTop,h=d.documentElement.scrollHeight-w.innerHeight;if(bar)bar.style.width=(h>0?st/h*100:0)+'%'}
w.addEventListener('scroll',onScroll,{passive:true});onScroll();
var bg=$('#burger'),lk=$('#links');
if(bg)bg.addEventListener('click',function(){var o=lk.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Cerrar menú':'Abrir menú')});
var here=(location.pathname.split('/').pop()||'index').replace('.html','')||'index';
$$('#links a').forEach(function(a){var h=(a.getAttribute('href')||'').replace('.html','').replace('./','');if(h===here||(here==='index'&&(h==='index'||h==='/')))a.classList.add('on')});

/* ---- subnav servicios (scrollspy) ---- */
var sn=$$('.subnav a');
if(sn.length){var cats=sn.map(function(a){return d.getElementById(a.getAttribute('href').slice(1))});
  w.addEventListener('scroll',function(){var m=(w.scrollY||0)+180,cur=0;cats.forEach(function(c,i){if(c&&c.offsetTop<=m)cur=i});sn.forEach(function(a,i){a.classList.toggle('on',i===cur)})},{passive:true})}

/* ---- pastillas ---- */
var pm=$('#pmsgt'),typing=null;
function type(msg){clearInterval(typing);var i=0;pm.textContent='> ';if(reduce){pm.textContent='> '+msg;return}
  typing=setInterval(function(){pm.textContent='> '+msg.slice(0,++i);if(i>=msg.length){clearInterval(typing);pm.innerHTML=pm.textContent+'<i class="caret"></i>'}},22)}
if($('#pb')){
$('#pb').addEventListener('click',function(){d.body.classList.remove('red-mode');type('Todo sigue igual. Tu competencia, no. Cuando cambies de opinión, aquí estaremos.')});
$('#pr').addEventListener('click',function(){d.body.classList.add('red-mode');for(var i=0;i<6;i++)setTimeout(function(){shock.push({x:w.innerWidth/2,y:w.innerHeight/2,r:0})},i*260);
  type('Bienvenido a la realidad digital. Página, portal, automatización o soporte: cuéntame qué quieres construir.');
  setTimeout(function(){location.href='contacto.html'},3800)})}

/* ---- Sortex grid ---- */
var ng=$('#numgrid');if(ng){var cells=[];for(var i=0;i<32;i++){var s=d.createElement('s');ng.appendChild(s);cells.push(s)}[3,9,12,17,22,28].forEach(function(i){cells[i].className='t'});
  if(!reduce)setInterval(function(){if(hidden)return;cells[Math.floor(Math.random()*cells.length)].classList.toggle('t')},700)}

/* ---- FAQ ---- */
$$('.fq button').forEach(function(b){b.addEventListener('click',function(){var f=b.parentNode,o=f.classList.toggle('open');b.setAttribute('aria-expanded',o)})});

/* ---- pestañas de planes ---- */
var pt=$$('.ptabs button'),pp=$$('.pp');
function openPlan(i){pt.forEach(function(t,k){t.classList.toggle('on',k===i);t.setAttribute('aria-selected',k===i)});pp.forEach(function(p,k){p.hidden=k!==i;p.classList.toggle('on',k===i)});try{history.replaceState(null,'','#'+pp[i].id)}catch(_){}}
pt.forEach(function(t,i){t.addEventListener('click',function(){openPlan(i)})});
if(pt.length){var hh=(location.hash||'').slice(1),ix=pp.map(function(p){return p.id}).indexOf(hh);openPlan(ix>=0?ix:0)}

/* ---- contadores ---- */
var cio=('IntersectionObserver' in w)?new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);var el=e.target,to=parseInt(el.getAttribute('data-n'),10),suf=el.getAttribute('data-s')||'';if(reduce){el.textContent=to+suf;return}var t0=performance.now();(function s(t){var p=Math.min(1,(t-t0)/1400);el.textContent=Math.round(to*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(s)})(t0)})},{threshold:.5}):null;
$$('[data-n]').forEach(function(el){if(cio)cio.observe(el);else el.textContent=el.getAttribute('data-n')+(el.getAttribute('data-s')||'')});

/* ---- formulario -> WhatsApp ---- */
var form=$('#form');
if(form)form.addEventListener('submit',function(e){e.preventDefault();var n=$('#f-n'),i=$('#f-i').value,m=$('#f-m').value.trim(),c=$('#f-c');
  if(!n.value.trim()){n.classList.add('bad');n.focus();toast('Dime tu nombre para empezar.');return}
  if(c&&!c.checked){toast('Acepta la política de privacidad para continuar.');return}
  n.classList.remove('bad');w.open('https://wa.me/573002072739?text='+encodeURIComponent('Hola Onytek, soy '+n.value.trim()+'. Necesito: '+i+'.'+(m?' '+m:'')),'_blank','noopener')});

/* ---- botones: imán y chispas ---- */
$$('.btn').forEach(function(b){
  if(fine&&!reduce){b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.12).toFixed(1)+'px '+((e.clientY-r.top-r.height/2)*.2).toFixed(1)+'px'});b.addEventListener('pointerleave',function(){b.style.translate=''})}
  b.addEventListener('click',function(e){if(reduce)return;var r=b.getBoundingClientRect(),x=e.clientX||r.left+r.width/2,y=e.clientY||r.top+r.height/2;
    for(var i=0;i<10;i++){var sp=d.createElement('i');sp.className='spark';var a=Math.random()*6.283,l=30+Math.random()*50;sp.style.left=x+'px';sp.style.top=y+'px';sp.style.setProperty('--dx',Math.cos(a)*l+'px');sp.style.setProperty('--dy',Math.sin(a)*l+'px');sp.style.setProperty('--r',(a*57.3+90)+'deg');d.body.appendChild(sp);setTimeout(function(n){n.remove()},650,sp)}})});

/* ---- rayos del cristal ---- */
(function(){var cv=$('#arcs');if(!cv||reduce)return;var ctx=cv.getContext('2d'),W,H,dpr=Math.min(w.devicePixelRatio||1,1.5),bolts=[],next=0;
  function size(){var r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}size();w.addEventListener('resize',size);
  function bolt(x1,y1,x2,y2,seg,j){var pts=[[x1,y1]],dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy),nx=-dy/len,ny=dx/len;for(var i=1;i<seg;i++){var t=i/seg,o=(Math.random()-.5)*j*(1-Math.abs(t-.5)*.6);pts.push([x1+dx*t+nx*o,y1+dy*t+ny*o])}pts.push([x2,y2]);return pts}
  function spawn(big){var a=Math.random()*6.283,cx=W/2,cy=H/2,rx=W*.2,ry=H*.3,x1=cx+Math.cos(a)*rx,y1=cy+Math.sin(a)*ry*.95,R=W*(.36+Math.random()*.1),x2=cx+Math.cos(a+(Math.random()-.5)*.6)*R,y2=cy+Math.sin(a+(Math.random()-.5)*.6)*R*1.05;
    if(mouse.on){var r=cv.getBoundingClientRect(),mx=mouse.x-r.left,my=mouse.y-r.top;if(Math.hypot(mx-cx,my-cy)<W*.62&&Math.random()<.5){x2=mx;y2=my}}
    var b={p:bolt(x1,y1,x2,y2,7+Math.floor(Math.random()*4),W*.07),life:1,w:big?2.6:1.5,br:[]};
    if(Math.random()<.6){var k=2+Math.floor(Math.random()*3),m=b.p[k];b.br=bolt(m[0],m[1],m[0]+(Math.random()-.5)*W*.2,m[1]+(Math.random()-.2)*H*.15,4,W*.05)}bolts.push(b)}
  function draw(t){requestAnimationFrame(draw);if(hidden)return;ctx.clearRect(0,0,W,H);if(t>next){spawn(Math.random()<.2);if(Math.random()<.4)spawn(false);next=t+260+Math.random()*700}
    for(var i=bolts.length-1;i>=0;i--){var b=bolts[i];b.life-=.07;if(b.life<=0){bolts.splice(i,1);continue}
      [b.p,b.br].forEach(function(p){if(!p.length)return;ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(var k=1;k<p.length;k++)ctx.lineTo(p[k][0],p[k][1]);ctx.globalAlpha=Math.min(1,b.life*1.4);ctx.strokeStyle='#EAE8E4';ctx.lineWidth=b.w;ctx.lineJoin='round';ctx.shadowColor='#5CC8FF';ctx.shadowBlur=14;ctx.stroke()})}
    ctx.globalAlpha=1;ctx.shadowBlur=0}
  requestAnimationFrame(draw);w.addEventListener('pointerdown',function(){if(bolts.length<14)for(var i=0;i<3;i++)spawn(true)})})();

/* ---- easter egg ---- */
var buf='';w.addEventListener('keydown',function(e){if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName||''))return;buf=(buf+e.key.toLowerCase()).slice(-6);
  if(buf==='matrix'&&rain){buf='';rain.style.opacity=1;for(var i=0;i<10;i++)setTimeout(function(){shock.push({x:Math.random()*w.innerWidth,y:Math.random()*w.innerHeight,r:0})},i*180);toast('Despierta, Neo… el sistema te ha encontrado.');setTimeout(function(){rain.style.opacity=''},5000)}});

/* ---- intro (solo inicio, una vez por sesión) ---- */
var boot=$('#boot');
if(!boot){runHero()}else{
  var log=$('#bootlog'),bb=$('#bootbar'),skipped=false,seen=false;try{seen=sessionStorage.getItem('onytek-boot')==='1'}catch(_){}
  function finish(){if(skipped)return;skipped=true;try{sessionStorage.setItem('onytek-boot','1')}catch(_){}boot.classList.add('out');setTimeout(function(){boot.hidden=true},700);d.body.style.overflow='';runHero()}
  if(/[?&]nointro/.test(location.search)||seen||reduce){boot.hidden=true;runHero()}
  else{boot.hidden=false;d.body.style.overflow='hidden';
    var lines=['> iniciando onytek.os …','> conectando con la red … [OK]','> cargando módulos: web · portales · automatización · soporte … [OK]','> verificando propósito … [OK]','> ejecución con precisión … [OK]','','> bienvenido.'],li=0,ci=0;
    (function tick(){if(skipped)return;if(li>=lines.length){bb.style.width='100%';setTimeout(finish,500);return}var L=lines[li];
      if(ci<=L.length){log.textContent=lines.slice(0,li).join('\n')+(li?'\n':'')+L.slice(0,ci);ci+=2;bb.style.width=((li+ci/Math.max(1,L.length))/lines.length*100)+'%';setTimeout(tick,16)}else{li++;ci=0;setTimeout(tick,li===lines.length-1?240:110)}})();
    $('#bootskip').addEventListener('click',finish);d.addEventListener('keydown',function k(e){if(e.key==='Escape'||e.key==='Enter'){finish();d.removeEventListener('keydown',k)}});setTimeout(finish,9000)}}
})();

(function(){var d=document,w=window;
var gs=d.getElementById('gemstage');if(!gs)return;
var g=d.getElementById('gem'),m=w.matchMedia&&w.matchMedia('(prefers-reduced-motion:reduce)').matches;
if(!m&&g){d.addEventListener('mousemove',function(e){var x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);gs.style.setProperty('--px',(x*18).toFixed(1)+'px');gs.style.setProperty('--py',(y*14).toFixed(1)+'px');gs.style.setProperty('--rx',(-y*10).toFixed(1)+'deg');gs.style.setProperty('--ry',(x*12).toFixed(1)+'deg')},{passive:true});}
gs.addEventListener('click',function(){gs.classList.remove('pulse');void gs.offsetWidth;gs.classList.add('pulse')});
})();
(function(){var d=document,bs=[].slice.call(d.querySelectorAll('.sxb'));if(!bs.length)return;
var ps=[].slice.call(d.querySelectorAll('.sxp'));
function open(id,scroll,push){var ok=false;ps.forEach(function(p){var on=p.id===id;p.hidden=!on;if(on)ok=true});if(!ok){id=ps[0].id;ps[0].hidden=false}
bs.forEach(function(b){var on=b.getAttribute('data-t')===id;b.classList.toggle('on',on);b.setAttribute('aria-selected',on);if(on&&b.scrollIntoView&&innerWidth<980)b.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'})});
if(push){try{history.replaceState(null,'','#'+id)}catch(e){}}
if(scroll&&innerWidth<980){var t=d.getElementById(id);if(t)w=t.getBoundingClientRect().top+scrollY-90,scrollTo({top:w,behavior:'smooth'})}}
var w;
bs.forEach(function(b){b.addEventListener('click',function(){open(b.getAttribute('data-t'),true,true)});b.addEventListener('keydown',function(e){var i=bs.indexOf(b);if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();bs[(i+1)%bs.length].focus();bs[(i+1)%bs.length].click()}if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();bs[(i+bs.length-1)%bs.length].focus();bs[(i+bs.length-1)%bs.length].click()}})});
addEventListener('hashchange',function(){open(location.hash.slice(1),true,false)});
open(location.hash.slice(1)||ps[0].id,false,false);
})();
