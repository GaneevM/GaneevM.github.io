import * as T from './vendor/three.module.js';
import {createNebula} from './nebula.js';
let atmosphere,ambientTime=0,lastFrame=performance.now(),ambientTimer;

const root=new URL('../',import.meta.url),asset=p=>new URL(p,root).href;
const projects=[
{name:'VEX Robotics',label:'01 / Builder & scout · 2025–present',copy:'Five competitions. One 2.5-week rebuild. I worked on the mechanisms and scouted other teams with 98549E. Our driver-skills score went from 19 to 30.',path:'robotics/',image:'assets/robotics/robot-overview.png',type:'ROBOTICS',color:0xb4b9a0},
{name:'Northline Web Co.',label:'02 / Founder & developer',copy:'I built five free websites for local businesses and youth entrepreneurs. Menus, galleries, booking details—the things their customers actually need.',path:'northline/',image:'assets/projects/northline-artisan-pizza.png',type:'WEB DESIGN',color:0xe2a16f},
{name:'physiPeak',label:'03 / HackCamp prototype',copy:'A camera-assisted movement journal, with guided calibration and session notes. See the prototype in action and how the pieces fit together.',path:'physipeak/',image:'assets/physipeak/home-screen.png',type:'CAMERA + CODE',color:0xa6bac4},
{name:'Screen-distance reminder',label:'04 / Electronics prototype',copy:'I kept leaning towards my monitor while gaming. So I built a distance reminder with an ultrasonic sensor and an LED.',path:'distance-sensor/',image:'assets/sensor/prototype-alert.png',type:'ELECTRONICS',color:0xc8b3a1},
{name:'Games & experiments',label:'05 / Browser experiments',copy:'Games, circuits, chemistry, and a few ideas I wanted to try. Open a demo and have a go.',path:'games/',image:'assets/projects/zero-signal.png',type:'GAMES + TOOLS',color:0xb8adc7}
];
const isHome=document.body.dataset.gallery==='home';
const intro={name:'Hello. I’m Ganeev.',label:'',copy:'Scroll to explore or pick a project below.',path:'about/',type:'BC, CANADA'};
const items=isHome?[intro,...projects]:projects;
const section=document.querySelector('.spatial-scroll'),pin=document.querySelector('.spatial-pin');
const canvasHost=document.querySelector('.spatial-canvas'),closingScene=document.querySelector('.spatial-footer');
const title=document.querySelector('.gallery-copy h2'),label=document.querySelector('.gallery-category'),copy=document.querySelector('.gallery-copy p'),link=document.querySelector('.gallery-link'),heading=document.querySelector('.gallery-heading'),meta=document.querySelector('.gallery-meta'),fallback=document.querySelector('.gallery-fallback');
let index=-1,target=0,current=0,frame=0,off=matchMedia('(prefers-reduced-motion:reduce)').matches;
try{off=off||localStorage.getItem('portfolio-motion')==='off';}catch{}
const reduced=matchMedia('(prefers-reduced-motion:reduce)');const staticView=new URLSearchParams(location.search).get('view')==='static';if(staticView)off=true;
let renderer,scene,camera,cards=[],shapes=[],width=0,height=0,pointer={x:0,y:0},pal=0;
const palettes=[{paper:'#0b0d10',ink:'#eae6de',accent:'#d8e5e8',muted:'#a7adb7',line:'#eae6de27'},{paper:'#0b0d10',ink:'#eae6de',accent:'#d8e5e8',muted:'#a7adb7',line:'#eae6de27'},{paper:'#0b0d10',ink:'#eae6de',accent:'#d8e5e8',muted:'#a7adb7',line:'#eae6de27'}];
function palette(){const p=palettes[pal];for(const k in p)document.documentElement.style.setProperty('--'+k,p[k]);if(scene)scene.background=new T.Color(p.paper);request();}
const controls=document.querySelector('.gallery-jumps');
items.forEach((p,i)=>{const b=document.createElement('button');b.textContent=i===0&&isHome?'G':String(isHome?i:i+1).padStart(2,'0');b.title=p.name;b.setAttribute('aria-label','Show '+p.name);b.addEventListener('click',()=>go(i));controls.append(b);});
function updateText(i){if(i===index)return;index=i;const p=items[i];title.textContent=p.name;label.textContent=p.label;copy.textContent=p.copy;link.href=asset(p.path);link.textContent=i===0&&isHome?'A little about me ↗':'Explore project ↗';meta.innerHTML=(isHome&&i===0?'PORTFOLIO / 2026':p.type)+'<br>'+String(i+1).padStart(2,'0')+' — '+String(items.length).padStart(2,'0');[...controls.children].forEach((b,n)=>b.setAttribute('aria-current',String(n===i)));if(p.image)fallback.src=asset(p.image);fallback.alt=p.name;}
function go(i){if(off){target=current=i;updateText(i);request();return;}const top=section.getBoundingClientRect().top+scrollY;window.scrollTo({top:top+i/(items.length-1)*(section.offsetHeight-innerHeight),behavior:'smooth'});}
document.querySelector('.gallery-next').addEventListener('click',()=>go(Math.min(index+1,items.length-1)));
function readScroll(){if(!off){target=T.MathUtils.clamp(-section.getBoundingClientRect().top/Math.max(1,section.offsetHeight-innerHeight),0,1)*(items.length-1);}request();}
function request(){if(!frame&&!document.hidden)frame=requestAnimationFrame(draw);}
function setOff(value){const wasVisible=section.getBoundingClientRect().top<=0&&section.getBoundingClientRect().bottom>0;off=value;document.body.classList.toggle('gallery-static',off);if(off){target=current=Math.max(0,index);if(wasVisible)window.scrollTo({top:section.offsetTop,behavior:'instant'});}else readScroll();request();}
reduced.addEventListener('change',e=>setOff(e.matches));
function controlsReady(){const bar=document.querySelector('.chapter-tools');if(!bar)return;const theme=document.createElement('button');theme.className='palette-button';theme.textContent='Light ◐';theme.setAttribute('aria-label','Change atmospheric lighting');theme.addEventListener('click',()=>{pal=(pal+1)%palettes.length;palette();});const motion=document.createElement('button');motion.textContent=off?'Motion off':'Motion on';motion.addEventListener('click',()=>{setOff(!off);motion.textContent=off?'Motion off':'Motion on';try{localStorage.setItem('portfolio-motion',off?'off':'on');}catch{}});bar.prepend(theme,motion);}
controlsReady();setOff(off);updateText(0);
function rounded(w,h,r){const s=new T.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s;}
function mesh(g,m,x,y,z,parent){const o=new T.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;}
try{
 if(staticView)throw new Error('Static image view requested');
 renderer=new T.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<650?1:1.4));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label','Three-dimensional gallery of Ganeev’s projects. Scroll or use the numbered project buttons.');document.querySelector('.spatial-canvas').append(renderer.domElement);
 scene=new T.Scene();atmosphere=createNebula(T,scene);camera=new T.PerspectiveCamera(36,1,.1,100);camera.position.set(0,0,12);
 scene.add(new T.HemisphereLight(0xffffff,0x817768,3));const key=new T.DirectionalLight(0xfff7e8,4);key.position.set(-4,6,7);scene.add(key);const rim=new T.DirectionalLight(0xc1d1e3,2);rim.position.set(5,1,3);scene.add(rim);
 const loader=new T.TextureLoader();
 projects.forEach((p,i)=>{const group=new T.Group();scene.add(group);const w=4.1,h=2.65;const frameMat=new T.MeshStandardMaterial({color:0x171a1f,metalness:.65,roughness:.38});const geo=new T.ExtrudeGeometry(rounded(w+.045,h+.045,.012),{depth:.10,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.008,bevelThickness:.008,curveSegments:8});mesh(geo,frameMat,0,0,-.13,group);
 const screen=mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:0x171a1f}),0,0,.02,group);
 loader.load(asset(p.image),texture=>{texture.colorSpace=T.SRGBColorSpace;const ratio=texture.image.width/texture.image.height;screen.geometry.dispose();screen.geometry=new T.PlaneGeometry(Math.min(w,h*ratio),Math.min(h,w/ratio));screen.material.map=texture;screen.material.color.set(0xffffff);screen.material.needsUpdate=true;request();},undefined,()=>{screen.material.color.set(p.color);request();});
 for(const x of [-w/2+.05,w/2-.05])for(const y of [-h/2+.05,h/2-.05]){const screw=mesh(new T.CylinderGeometry(.009,.009,.012,8),new T.MeshStandardMaterial({color:0x6e7169,metalness:.8,roughness:.3}),x,y,.045,group);screw.rotation.x=Math.PI/2;}
 cards.push(group);});
 // Small machined forms add depth without pretending to be a photographed project.
 const torus=mesh(new T.TorusGeometry(.65,.13,24,80),new T.MeshStandardMaterial({color:0xc74827,metalness:.35,roughness:.3}),2.9,-.9,-1,scene);shapes.push(torus);
 const cube=mesh(new T.BoxGeometry(.38,.38,.38),new T.MeshStandardMaterial({color:0x535f4e,metalness:.6,roughness:.25}),-3,1.5,-1,scene);cube.rotation.set(.5,.4,.6);shapes.push(cube);
 const orbit=mesh(new T.TorusGeometry(2.8,.008,6,100),new T.MeshBasicMaterial({color:0x979b8c,transparent:true,opacity:.35}),.5,.4,-2,scene);orbit.rotation.set(.65,.3,.2);shapes.push(orbit);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();pin.classList.remove('gallery-ready');});renderer.domElement.addEventListener('webglcontextrestored',()=>{pin.classList.add('gallery-ready');request();});pin.classList.add('gallery-ready');palette();
}catch(error){document.body.classList.add('gallery-no-webgl');console.warn('3D gallery unavailable; image and navigation remain available.',error);}
function resize(){width=pin.clientWidth;height=pin.clientHeight;if(renderer){renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}request();}new ResizeObserver(resize).observe(pin);
pin.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&!off){pointer.x=(e.clientX/innerWidth-.5)*.15;pointer.y=(e.clientY/innerHeight-.5)*.08;request();}},{passive:true});pin.addEventListener('pointerleave',()=>{pointer.x=pointer.y=0;request();});
function draw(){frame=0;const now=performance.now();if(!off)ambientTime+=Math.min((now-lastFrame)/1000,.1);lastFrame=now;current=off?target:T.MathUtils.lerp(current,target,.11);if(Math.abs(current-target)<.0005)current=target;updateText(Math.round(current));const closing=closingScene.getBoundingClientRect().top<innerHeight;const destination=closing?closingScene:pin;if(canvasHost.parentElement!==destination)destination.prepend(canvasHost);const mobile=width<650,homeIntro=isHome?Math.max(0,1-current*3):0;pin.classList.toggle('gallery-intro',isHome&&index===0);heading.innerHTML=isHome?'Ganeev<br>Mujral':'Selected work';heading.style.opacity=String(isHome?homeIntro:Math.max(0,1-current*2));heading.style.transform='translateY('+(-current*25)+'px)';
 if(renderer){const selected=Math.max(0,current-(isHome?1:0));cards.forEach((card,i)=>{const d=i-selected,active=Math.exp(-d*d*3);const x=mobile?0:width<1000?1.2:1.75;const farX=mobile?(d<0?-1:1)*(2.9+Math.abs(d)*.22):(d<0?1.3:3.3)+Math.abs(d)*.18;card.position.set(T.MathUtils.lerp(farX,x,active),(mobile?(isHome&&index===0?.65:-.55):.5)+d*.95*(1-active),-Math.min(Math.abs(d)*1.2,8));const s=(mobile?.66:width<1000?.95:1.18)*(.52+.48*active);card.scale.setScalar(s);card.rotation.set(.09*(1-active)+pointer.y,-d*.32+pointer.x-.08*active,.07*Math.sin(d)*(1-active));card.visible=!closing&&Math.abs(d)<5.5&&(!isHome||current>.25||i===0);});shapes[0].visible=false;shapes[1].visible=false;shapes[2].visible=false;shapes[2].rotation.z=current*.2;camera.position.x=pointer.x*.2;camera.position.y=pointer.y*.2;camera.lookAt(0,0,0);atmosphere.update(off?16:ambientTime,width/height,current,closing?.35:0,pal);renderer.render(scene,camera);}
 if(current!==target)request();else if(!off&&section.getBoundingClientRect().bottom>0&&section.getBoundingClientRect().top<innerHeight||!off&&closing){clearTimeout(ambientTimer);ambientTimer=setTimeout(request,40);}}
addEventListener('scroll',readScroll,{passive:true});addEventListener('resize',readScroll);document.addEventListener('visibilitychange',()=>{if(!document.hidden)request();});readScroll();










