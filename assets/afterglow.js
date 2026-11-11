import * as T from './vendor/three.module.js';
import {createNebula} from './nebula.js';
// The gallery uses its existing context. Other pages receive one low-resolution backdrop.
if(!document.querySelector('.spatial-canvas')){
 const host=document.createElement('div');host.className='afterglow-backdrop';host.setAttribute('aria-hidden','true');document.body.prepend(host);
 try{
 const renderer=new T.WebGLRenderer({antialias:false,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,.85));host.append(renderer.domElement);const scene=new T.Scene(),camera=new T.Camera(),cloud=createNebula(T,scene);let time=18,last=performance.now(),timer;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let paused=reduced.matches;try{paused=paused||localStorage.getItem('portfolio-motion')==='off';}catch{}
 function render(){clearTimeout(timer);if(document.hidden)return;const now=performance.now();if(!paused)time+=Math.min((now-last)/1000,.15);last=now;cloud.update(time,innerWidth/innerHeight,scrollY/innerHeight,.75,location.pathname.includes('contact')?1:0);renderer.render(scene,camera);if(!paused)timer=setTimeout(render,70);}
 function resize(){renderer.setSize(innerWidth,innerHeight);render();}addEventListener('resize',resize);document.addEventListener('visibilitychange',render);document.addEventListener('portfolio-motion',e=>{paused=!e.detail.enabled;render();});reduced.addEventListener('change',e=>{paused=e.matches;render();});resize();
 }catch{host.remove();}
}
