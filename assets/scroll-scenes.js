(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let disabled=reduced.matches,queued=false;
 try{disabled=disabled||localStorage.getItem('portfolio-motion')==='off';}catch{}
 const records=[],clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
 const narrow=()=>innerWidth<=760;
 const label=document.createElement('button');label.type='button';label.className='motion-switch';
 const tools=document.querySelector('.chapter-tools');tools?.prepend(label);
 function preference(){document.documentElement.classList.toggle('motion-off',disabled);label.textContent=disabled?'Motion off':'Motion on';label.setAttribute('aria-pressed',String(!disabled));document.dispatchEvent(new CustomEvent('portfolio-motion',{detail:{enabled:!disabled}}));update();}
 label.addEventListener('click',()=>{disabled=!disabled;try{localStorage.setItem('portfolio-motion',disabled?'off':'on');}catch{}preference();});
 reduced.addEventListener('change',()=>{disabled=reduced.matches;preference();});
 const observe=(el,draw)=>{records.push({el,draw});};
 // A scene remains in place while the normal document scroll supplies its progress.
 document.querySelectorAll('.studio-strip,.project-case').forEach((article,i)=>{
   article.classList.add('scroll-chapter');
   const scene=document.createElement('div');scene.className='scroll-chapter-inner';
   while(article.firstChild)scene.append(article.firstChild);article.append(scene);
   const rail=document.createElement('span');rail.className='scene-coordinate';rail.setAttribute('aria-hidden','true');rail.textContent=String(i+1).padStart(2,'0')+' / SCROLL TO INSPECT';scene.append(rail);
   observe(article,p=>{article.style.setProperty('--chapter-p',p.toFixed(4));});
 });
 // Titles unfold as their actual section passes through the viewport.
 document.querySelectorAll('main h1,.field-heading h2,.why-grid h2,.studio-work-heading h2,.contact h2').forEach(el=>{
   el.classList.add('scroll-title');observe(el,p=>el.style.setProperty('--title-p',p.toFixed(4)));
 });
 document.querySelectorAll('.experience-item,.sports-card,.steps article,.timeline article,.result-strip>div,.robotics-frame,.sensor-photos figure,.project-card').forEach((el,i)=>{
   el.classList.add('scroll-detail');el.style.setProperty('--detail-order',i%3);observe(el,p=>el.style.setProperty('--detail-p',p.toFixed(4)));
 });
 const path=location.pathname;
 // Northline and Experiments: the selected screenshot advances with page scroll.
 const sources=path.includes('/northline/')?[...document.querySelectorAll('.client-card')]:path.includes('/games/')?[...document.querySelectorAll('.project-case,.project-card')]:[];
 if(sources.length){
   const items=sources.map((card,i)=>({title:card.querySelector('h3').textContent,img:card.querySelector('img'),desc:card.querySelector('p')?.textContent||'',links:[...card.querySelectorAll('.text-links a')],card,i}));
   const section=document.createElement('section');section.className='scroll-showroom';section.setAttribute('aria-label',path.includes('northline')?'Website showcase':'Playable project showcase');
   const inner=document.createElement('div');inner.className='showroom-inner shell';
   const stage=document.createElement('div');stage.className='showroom-stage';
   const counter=document.createElement('span');counter.className='showroom-counter';counter.setAttribute('aria-hidden','true');
   const slides=items.map((item,i)=>{const slide=document.createElement('div');slide.className='showroom-slide';slide.setAttribute('aria-hidden',String(i!==0));const image=item.img.cloneNode();image.loading=i===0?'eager':'lazy';slide.append(image);stage.append(slide);return slide;});stage.append(counter);
   const copy=document.createElement('div');copy.className='showroom-copy';
   const eyebrow=document.createElement('span');eyebrow.className='section-number';eyebrow.textContent=path.includes('northline')?'Northline / Live client work':'Experiments / Playable builds';
   const title=document.createElement('h2'),desc=document.createElement('p'),actions=document.createElement('div');actions.className='text-links';
   const tabs=document.createElement('div');tabs.className='showroom-selectors';tabs.setAttribute('aria-label','Choose a project');
   const buttons=items.map((item,i)=>{const b=document.createElement('button');b.type='button';b.textContent=String(i+1).padStart(2,'0')+' / '+item.title;b.addEventListener('click',()=>{if(disabled){select(i);return;}const start=section.getBoundingClientRect().top+scrollY;const extent=section.offsetHeight-innerHeight;window.scrollTo({top:start+(i+.15)/items.length*extent,behavior:reduced.matches?'instant':'smooth'});});tabs.append(b);return b;});
   const note=document.createElement('p');note.className='showroom-hint';note.textContent='Scroll to browse · Or choose a project below';copy.append(eyebrow,title,desc,actions,tabs,note);inner.append(stage,copy);section.append(inner);
   const insert=document.querySelector('.client-grid')?document.querySelector('.gallery'):document.querySelector('.featured-work');insert.before(section);
   let selected=-1;
   function select(i){if(selected===i)return;selected=i;section.dataset.selected=String(i);title.textContent=items[i].title;desc.textContent=items[i].desc;actions.replaceChildren(...items[i].links.map(a=>a.cloneNode(true)));buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));slides.forEach((s,j)=>{s.classList.toggle('is-current',j===i);s.setAttribute('aria-hidden',String(j!==i));s.style.setProperty('--stack-offset',j-i);});counter.textContent=String(i+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');}
   observe(section,p=>{if(!disabled){const index=Math.min(items.length-1,Math.floor(p*items.length));select(index);section.style.setProperty('--showroom-p',p.toFixed(4));section.style.setProperty('--slide-p',Math.min(1,p*items.length-index).toFixed(4));}});select(0);
   // Keep full build notes accessible without repeating all the same screenshots.
   const detailWrap=document.createElement('details');detailWrap.className='build-details';const summary=document.createElement('summary');summary.textContent=path.includes('northline')?'Read all website build notes':'Read all project build notes';detailWrap.append(summary);
   if(path.includes('northline')){const grid=document.querySelector('.client-grid');grid.before(detailWrap);detailWrap.append(grid);}else{const full=document.querySelector('.featured-work'),more=document.querySelector('.more-work');full.before(detailWrap);detailWrap.append(full);if(more)detailWrap.append(more);}
 }
 // A reading timeline: the line and the current milestone advance with scrolling.
 document.querySelectorAll('.timeline,.experience-list').forEach(container=>{
   container.classList.add('reading-timeline');observe(container,p=>container.style.setProperty('--timeline-p',p.toFixed(4)));
 });
 // Sensor page micro-demo: the slider moves the reading, marker and LED together.
 if(path.includes('/distance-sensor/')){
   const demo=document.createElement('section');demo.className='sensor-live-demo shell';
   demo.innerHTML='<span class="section-number">Try the idea / Illustrative threshold</span><h2>A small movement.<br>An immediate reminder.</h2><div class="sensor-track" aria-hidden="true"><span class="sensor-screen"></span><span class="sensor-target"></span><span class="sensor-limit"></span></div><div class="sensor-readings"><output id="live-distance" for="live-distance-control">60 cm</output><span class="live-led">LED off</span></div><label for="live-distance-control">Adjust the illustrated distance</label><input type="range" id="live-distance-control" min="15" max="90" value="60"><p class="note">Concept demonstration. The 40 cm trigger is an example, not a safety recommendation.</p>';
   document.querySelector('.hero').after(demo);const range=demo.querySelector('input');let controlled=false;const render=()=>{const v=Number(range.value);demo.style.setProperty('--distance',String((v-15)/75));demo.querySelector('output').textContent=v+' cm';demo.querySelector('.live-led').textContent=v<40?'LED on · move back':'LED off';demo.classList.toggle('led-on',v<40);};range.addEventListener('input',()=>{controlled=true;render();});render();observe(demo,p=>{demo.style.setProperty('--detail-p',p.toFixed(4));if(!disabled&&!controlled){range.value=String(Math.round(85-p*65));render();}});
 }
 // Physics notes become a real parameter-driven demonstration, with honest units.
 if(path.includes('/physics/')){
   const demo=document.createElement('section');demo.className='physics-live-demo';demo.innerHTML='<span class="section-number">Momentum / Interactive study</span><h2>Change the input.<br>Watch the difference.</h2><div class="momentum-track" aria-hidden="true"><span></span></div><label for="momentum-speed">Velocity <output id="speed-label">3 m/s</output></label><input id="momentum-speed" type="range" min="1" max="8" value="3"><div class="momentum-readouts"><p>Mass<strong>2 kg</strong></p><p>Momentum<strong id="momentum-value">6 kg·m/s</strong></p><p>Kinetic energy<strong id="energy-value">9 J</strong></p></div><button type="button" class="button momentum-play">Run motion</button><p class="note">Constant-velocity illustration. The travel animation is schematic; the momentum and energy readouts use p = mv and E = ½mv².</p>';
   document.querySelector('main').append(demo);observe(demo,p=>demo.style.setProperty('--physics-p',p.toFixed(4)));const speed=demo.querySelector('input'),ball=demo.querySelector('.momentum-track span');let run;speed.addEventListener('input',()=>{const v=+speed.value;demo.querySelector('#speed-label').textContent=v+' m/s';demo.querySelector('#momentum-value').textContent=2*v+' kg·m/s';demo.querySelector('#energy-value').textContent=v*v+' J';run?.cancel();});demo.querySelector('button').addEventListener('click',()=>{run?.cancel();run=ball.animate([{transform:'translateX(0)'},{transform:'translateX('+Math.max(0,demo.querySelector('.momentum-track').clientWidth-50)+'px)'}],{duration:disabled?1:6000/+speed.value,easing:'linear',fill:'forwards'});});
 }
 if(path.includes('/contact/')){
   const contact=document.querySelector('.page-contact');const compass=document.createElement('div');compass.className='contact-compass';compass.innerHTML='<svg viewBox="0 0 300 300" aria-hidden="true"><g class="compass-ring" fill="none" stroke="currentColor"><circle cx="150" cy="150" r="118" opacity=".25"/><path d="M150 20v30m0 200v30M20 150h30m200 0h30"/><circle cx="150" cy="150" r="82" stroke-dasharray="1 9"/><path d="M150 70 215 188 85 188Z"/><circle cx="150" cy="150" r="8" fill="currentColor"/></g></svg><a class="compass-work" href="../work/">Build / Work ↗</a><a class="compass-about" href="../about/">People / About ↗</a><a class="compass-play" href="../games/">Explore / Experiments ↗</a>';
   contact.append(compass);observe(contact,p=>compass.style.setProperty('--compass-p',p.toFixed(4)));
 }
 if(path.includes('/physipeak/')){const frame=document.querySelector('.physipeak-case-video');if(frame){frame.classList.add('film-chapter');observe(frame,p=>frame.style.setProperty('--film-p',p.toFixed(4)));}}
 // Native cross-document View Transitions enhance real URLs and preserve Back.
 document.documentElement.classList.add('scroll-scenes-ready');
 function update(){queued=false;const vh=innerHeight;for(const {el,draw}of records){const r=el.getBoundingClientRect();if(r.bottom < -vh || r.top > vh*2)continue;let p;if((el.matches('.scroll-showroom')||el.matches('.scroll-chapter,.film-chapter')&&!narrow())&&!disabled)p=clamp(-r.top/Math.max(1,r.height-vh));else p=clamp((vh*.92-r.top)/Math.max(1,Math.min(vh*.7,r.height)));draw(disabled?1:p);}}
 function queue(){if(!queued){queued=true;requestAnimationFrame(update);}}
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);document.addEventListener('toggle',queue,true);document.addEventListener('visibilitychange',()=>{if(!document.hidden)queue();});preference();
})();
