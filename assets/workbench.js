const stage=document.querySelector('.mechanism-stage');
const fallback=stage.querySelector('.scene-fallback');
const pause=document.querySelector('.model-pause');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const captions={build:'01 / BUILD — Inspect the links, bearings, and tool assembly. Drag or use the arrow keys to orbit.',simulate:'02 / SIMULATE — Separate the components to see how the assembly fits together.',impact:'03 / APPLY — An original mechanism study. Continue below for the actual VEX robot I worked on.'};
let savedMotionOff=false;try{savedMotionOff=localStorage.getItem('portfolio-motion')==='off';}catch{}
let mode='build',paused=reduced.matches||savedMotionOff,renderOnce=()=>{},setMode=()=>{};
document.querySelector('.model-caption').textContent=captions.build;
document.querySelectorAll('[data-model]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.model;document.querySelectorAll('[data-model]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('.model-caption').textContent=captions[mode];setMode(mode);renderOnce();}));
pause.textContent=paused?'Enable 3D':'Pause motion';pause.setAttribute('aria-pressed',String(paused));
async function start(){
const T=await import('./vendor/three.module.js');
const renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x10191d,0);renderer.outputColorSpace=T.SRGBColorSpace;stage.append(renderer.domElement);renderer.domElement.setAttribute('aria-label','Interactive modular engineering arm. Drag horizontally to orbit.');renderer.domElement.setAttribute('role','img');
const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,60);camera.position.set(5.5,3.8,6.6);camera.lookAt(.1,1.4,0);
renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
// Small procedural softbox environment for controlled metal reflections.
const room=new T.Scene();room.background=new T.Color(0x4b555b);const panelMat=new T.MeshBasicMaterial({color:0xffffff});
for(const [x,y,z,w,h] of [[-5,4,0,3,7],[5,5,-3,4,8],[0,7,0,8,3]]){const p=new T.Mesh(new T.PlaneGeometry(w,h),panelMat);p.position.set(x,y,z);p.lookAt(0,1,0);room.add(p);}
const pmrem=new T.PMREMGenerator(renderer);const env=pmrem.fromScene(room,.04);scene.environment=env.texture;pmrem.dispose();room.traverse(o=>o.geometry?.dispose());panelMat.dispose();
scene.add(new T.HemisphereLight(0xeeede6,0x10191d,1.8));const light=new T.DirectionalLight(0xfff9eb,4.5);light.position.set(-3,7,5);light.castShadow=true;light.shadow.mapSize.set(1024,1024);Object.assign(light.shadow.camera,{left:-5,right:5,top:6,bottom:-4,near:.1,far:22});light.shadow.bias=-.001;light.shadow.normalBias=.025;scene.add(light);const blueLight=new T.DirectionalLight(0x6d8aff,3);blueLight.position.set(4,3,-5);scene.add(blueLight);
const metal=new T.MeshStandardMaterial({color:0xb5bcb8,metalness:.75,roughness:.3}),dark=new T.MeshStandardMaterial({color:0x253238,metalness:.7,roughness:.35}),blue=new T.MeshStandardMaterial({color:0x3558f3,metalness:.4,roughness:.25}),ceramic=new T.MeshStandardMaterial({color:0xeeede6,metalness:.15,roughness:.3});
const rig=new T.Group();scene.add(rig);const parts=[];
function mesh(geo,mat,x,y,z,parent=rig){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(w,h,d,mat,x,y,z,parent){return mesh(new T.BoxGeometry(w,h,d),mat,x,y,z,parent);}
function cylinder(r,h,mat,x,y,z,parent){return mesh(new T.CylinderGeometry(r,r,h,40),mat,x,y,z,parent);}
const recess=new T.MeshStandardMaterial({color:0x071116,metalness:.25,roughness:.5});
function plate(w,h,d,mat,parent=rig){const s=new T.Shape(),r=Math.min(w,h)*.22,x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);const g=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.025,bevelThickness:.025,curveSegments:8});g.translate(0,0,-d/2);return mesh(g,mat,0,0,0,parent);}
function bolt(x,y,z,parent=rig){const b=mesh(new T.CylinderGeometry(.045,.045,.035,6),metal,x,y,z,parent);b.rotation.x=Math.PI/2;box(.035,.009,.005,recess,x,y,z+.02,parent);}
function bearing(parent,r){const shaft=cylinder(r,.5,dark,0,0,0,parent);shaft.rotation.x=Math.PI/2;for(const z of [-.29,.29]){const face=cylinder(r*.84,.065,metal,0,0,z,parent);face.rotation.x=Math.PI/2;mesh(new T.TorusGeometry(r*.61,.018,8,48),blue,0,0,z+Math.sign(z)*.04,parent);const hub=cylinder(r*.31,.085,dark,0,0,z+Math.sign(z)*.05,parent);hub.rotation.x=Math.PI/2;for(let i=0;i<6;i++){const a=i*Math.PI/3;bolt(Math.cos(a)*r*.63,Math.sin(a)*r*.63,z+Math.sign(z)*.08,parent);}}}
const table=plate(4.8,3.2,.12,dark);table.rotation.x=-Math.PI/2;table.position.y=-.21;
for(let i=-10;i<=10;i++)box(.012,.006,i%5===0?.2:.08,metal,i*.21,-.12,1.28);
for(const x of [-2.05,2.05])for(const z of [-1.2,1.2])cylinder(.048,.02,recess,x,-.12,z);
cylinder(.77,.14,metal,-.78,-.05,0);cylinder(.65,.16,recess,-.78,.07,0);cylinder(.57,.13,blue,-.78,.19,0);
for(let i=0;i<12;i++){const a=i*Math.PI/6;cylinder(.024,.02,metal,-.78+Math.cos(a)*.64,.05,Math.sin(a)*.64);}
const shoulder=new T.Group();shoulder.position.set(-.78,.53,0);rig.add(shoulder);bearing(shoulder,.34);
const arm=new T.Group();arm.position.set(-.78,.53,0);arm.rotation.z=-.2;rig.add(arm);
for(const z of [-.29,.29]){const link=plate(.32,1.7,.11,ceramic,arm);link.position.set(0,.76,z);const slot=plate(.105,1.01,.012,recess,arm);slot.position.set(0,.78,z+Math.sign(z)*.065);for(const y of [.12,1.35])bolt(0,y,z+Math.sign(z)*.09,arm);}
const elbow=new T.Group();elbow.position.set(-.47,2.03,0);rig.add(elbow);bearing(elbow,.29);
const forearm=new T.Group();forearm.position.copy(elbow.position);forearm.rotation.z=-1.19;rig.add(forearm);
for(const z of [-.23,.23]){const link=plate(.25,1.55,.1,ceramic,forearm);link.position.set(0,.72,z);const slot=plate(.075,.86,.012,dark,forearm);slot.position.set(0,.73,z+Math.sign(z)*.06);}
box(.16,1.12,.15,blue,0,.72,0,forearm);
const wrist=new T.Group();wrist.position.set(.92,2.59,0);rig.add(wrist);bearing(wrist,.22);
const tool=new T.Group();tool.position.set(1.13,2.31,0);rig.add(tool);box(.44,.16,.55,dark,0,0,0,tool);
for(const z of [-.25,.25]){box(.1,.42,.1,metal,0,-.23,z,tool);box(.22,.09,.11,ceramic,-.06,-.44,z,tool);bolt(0,-.08,z+.055,tool);}
const core=mesh(new T.IcosahedronGeometry(.22,0),blue,1.1,1.56,0);const ring=mesh(new T.TorusGeometry(.46,.012,8,64),blue,1.1,1.19,0);ring.rotation.x=Math.PI/2;
const cablePath=new T.CatmullRomCurve3([new T.Vector3(-.84,.34,-.39),new T.Vector3(-1.04,1.1,-.4),new T.Vector3(-.65,2.15,-.4),new T.Vector3(.2,2.48,-.35),new T.Vector3(.9,2.6,-.31)]);mesh(new T.TubeGeometry(cablePath,40,.028,8,false),recess,0,0,0);
for(const [m,dx,dy] of [[shoulder,-.12,.1],[arm,-.34,.24],[elbow,0,.57],[forearm,.18,.9],[wrist,.5,1.1],[tool,.73,.7],[core,.73,.1]])parts.push({m,origin:m.position.clone(),dx,dy});
const floor=new T.Mesh(new T.PlaneGeometry(30,30),new T.ShadowMaterial({opacity:.36}));floor.rotation.x=-Math.PI/2;floor.position.y=-.3;floor.receiveShadow=true;scene.add(floor);
let yaw=0,targetYaw=0,velocity=0,drag=false,px=0,py=0,visible=true,last=0,explosion=0,targetExplosion=0,frame=0,progress=0,idle=0;
const resize=()=>{const b=stage.getBoundingClientRect();renderer.setSize(b.width,b.height);camera.aspect=b.width/b.height;camera.updateProjectionMatrix();renderOnce();};
function paint(){rig.rotation.y=yaw-progress*.27;parts.forEach(({m,origin,dx,dy})=>{m.position.copy(origin);m.position.x+=explosion*dx;m.position.y+=explosion*dy;});camera.position.set(5.5-progress*.5,3.8+progress*.65,6.6-progress*.2);camera.lookAt(.1,1.4+explosion*.3,0);renderer.render(scene,camera);stage.dataset.view=explosion>.3?'exploded':'assembled';stage.dataset.orbit=yaw.toFixed(3);const label=document.querySelector('.mechanism-annotation');if(label)label.textContent=explosion>.3?'02 / ASSEMBLY · exploded view':'01 / ASSEMBLY · assembled';}
renderOnce=paint;setMode=value=>{targetExplosion=value==='simulate'?.78:value==='impact'?.2:0;blue.emissive.setHex(value==='impact'?0x152570:0x000000);if(paused){explosion=targetExplosion;paint();}else resume();};
const canvas=renderer.domElement;
canvas.addEventListener('pointerdown',e=>{drag=true;px=e.clientX;py=e.clientY;velocity=0;canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-px,dy=e.clientY-py;if(e.pointerType==='touch'&&Math.abs(dy)>Math.abs(dx)*1.3){drag=false;return;}targetYaw=Math.max(-.8,Math.min(.8,targetYaw+dx*.006));yaw=targetYaw;px=e.clientX;py=e.clientY;paint();});
canvas.addEventListener('pointerup',()=>{drag=false;resume();});canvas.addEventListener('pointercancel',()=>{drag=false;resume();});
canvas.tabIndex=0;canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home'].includes(e.key)){e.preventDefault();targetYaw=e.key==='Home'?0:Math.max(-.8,Math.min(.8,targetYaw+(e.key==='ArrowLeft'?-.15:.15)));if(paused){yaw=targetYaw;paint();}else resume();}});
function tick(t){frame=0;if(paused||!visible||document.hidden)return;const dt=Math.min((t-last)/1000||.016,.035);last=t;velocity+=(90*(targetYaw-yaw)-19*velocity)*dt;yaw+=velocity*dt;const goal=Math.max(targetExplosion,progress*.85);explosion+=(goal-explosion)*Math.min(1,dt*7);paint();idle=Math.abs(goal-explosion)>.0006||Math.abs(targetYaw-yaw)>.0004||Math.abs(velocity)>.002?0:idle+1;if(idle<3)frame=requestAnimationFrame(tick);}
function resume(){idle=0;if(!frame&&!paused&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}}
pause.onclick=()=>{paused=!paused;pause.textContent=paused?'Resume motion':'Pause motion';pause.setAttribute('aria-pressed',String(paused));if(paused)cancelAnimationFrame(frame);frame=0;resume();};
document.addEventListener('portfolio-motion',e=>{const stop=!e.detail.enabled;if(stop!==paused){paused=stop;pause.textContent=paused?'Resume motion':'Pause motion';pause.setAttribute('aria-pressed',String(paused));if(paused){cancelAnimationFrame(frame);frame=0;}else resume();}});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else resume();}).observe(stage);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resume();});
const hero=document.querySelector('.studio-hero');function scrollScene(){if(!paused&&!reduced.matches){const rect=hero.getBoundingClientRect();progress=innerWidth>800?Math.max(0,Math.min(1,-rect.top/Math.max(1,hero.offsetHeight-innerHeight))):0;hero.style.setProperty('--scene-progress',progress.toFixed(4));resume();}}addEventListener('scroll',scrollScene,{passive:true});scrollScene();
reduced.addEventListener('change',()=>{if(reduced.matches){paused=true;cancelAnimationFrame(frame);frame=0;canvas.hidden=true;fallback.hidden=false;pause.textContent='Enable 3D';pause.setAttribute('aria-pressed','true');pause.onclick=()=>{if(canvas.hidden){canvas.hidden=false;fallback.hidden=true;paused=false;}else paused=!paused;pause.textContent=paused?'Resume motion':'Pause motion';pause.setAttribute('aria-pressed',String(paused));if(paused){cancelAnimationFrame(frame);frame=0;}else resume();};}});
canvas.addEventListener('webglcontextlost',()=>{paused=true;cancelAnimationFrame(frame);canvas.hidden=true;fallback.hidden=false;});
new ResizeObserver(resize).observe(stage);resize();fallback.hidden=true;resume();
}
pause.addEventListener('click',()=>{if(!stage.querySelector('canvas')){paused=false;pause.textContent='Pause motion';start().catch(()=>{fallback.hidden=false;pause.hidden=true;});}},{once:true});
if(!reduced.matches&&!savedMotionOff&&!navigator.connection?.saveData)start().catch(()=>{fallback.hidden=false;pause.hidden=true;});
