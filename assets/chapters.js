(() => {
 const base=new URL('../',document.currentScript.src),url=p=>new URL(p,base).href;
 const links=[['01','Home',''],['02','Selected work','work/'],['03','About & community','about/'],['04','Experiments','games/'],['05','Northline websites','northline/'],['06','Robotics','robotics/'],['07','physiPeak','physipeak/'],['08','Distance sensor','distance-sensor/'],['09','Yo Bro Yo Girl','yo-bro-yo-girl/'],['10','Contact','contact/']];
 const bar=document.createElement('header');bar.className='chapter-bar';
 const brand=document.createElement('a');brand.href=url('');brand.className='chapter-brand';brand.textContent='Ganeev Mujral';
 const right=document.createElement('div');right.className='chapter-tools';
 const resume=document.createElement('a');resume.href=url('resume.pdf?v=20261010-hackcamp');resume.textContent='Résumé ↗';
 const button=document.createElement('button');button.type='button';button.textContent='MENU +';button.setAttribute('aria-label','Open site menu');button.setAttribute('aria-expanded','false');
 right.append(resume,button);bar.append(brand,right);document.body.prepend(bar);
 const dialog=document.createElement('dialog');dialog.className='chapter-menu';dialog.setAttribute('aria-label','Portfolio pages');dialog.id='portfolio-pages';button.setAttribute('aria-controls',dialog.id);
 const head=document.createElement('div');head.className='menu-heading';head.textContent='GANEEV MUJRAL / INDEX';
 const close=document.createElement('button');close.textContent='CLOSE ×';close.type='button';close.setAttribute('aria-label','Close site menu');head.append(close);
 const nav=document.createElement('nav');nav.setAttribute('aria-label','All portfolio pages');
 for(const [number,label,path] of links){const a=document.createElement('a');a.href=url(path);const n=document.createElement('span');n.textContent=number;const name=document.createElement('strong');name.textContent=label;const arrow=document.createElement('span');arrow.textContent='↗';a.append(n,name,arrow);if(new URL(a.href).pathname===location.pathname)a.setAttribute('aria-current','page');nav.append(a);}
 const foot=document.createElement('div');foot.className='menu-footer';const email=document.createElement('a');email.href='mailto:smganeev@gmail.com';email.textContent='smganeev@gmail.com ↗';const github=document.createElement('a');github.href='https://github.com/GaneevM';github.textContent='GitHub ↗';foot.append(email,github);dialog.append(head,nav,foot);document.body.append(dialog);
 function dismiss(){dialog.close();button.setAttribute('aria-expanded','false');document.documentElement.classList.remove('menu-showing');button.focus();}
 button.addEventListener('click',()=>{dialog.showModal();button.setAttribute('aria-expanded','true');document.documentElement.classList.add('menu-showing');});close.addEventListener('click',dismiss);dialog.addEventListener('cancel',e=>{e.preventDefault();dismiss();});
 const progress=document.createElement('div');progress.className='chapter-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 let pending=false;const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(max?scrollY/max:0)+')';pending=false;};addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});
 if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){const obs=new IntersectionObserver(items=>items.forEach(e=>{if(e.isIntersecting){e.target.classList.add('chapter-arrived');obs.unobserve(e.target);}}),{threshold:.1});document.querySelectorAll('.studio-strip,.timeline article').forEach(e=>obs.observe(e));}
})();
