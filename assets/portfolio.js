(() => {
  'use strict';
  const root = document.documentElement;
  const nav = document.querySelector('.nav-inner');
  const script = document.currentScript;
  const base = new URL('../', script.src);
  const home = path => new URL(path, base).href;
  const makeButton = (label, text, cls = '') => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'icon-button ' + cls;
    button.setAttribute('aria-label', label); button.title = label; button.textContent = text;
    return button;
  };
  const theme = makeButton('Switch color theme', '◐');
  let saved; try { saved = localStorage.getItem('portfolio-theme'); } catch {}
  const setTheme = value => {
    root.dataset.theme = value;
    theme.setAttribute('aria-label', value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    theme.title = theme.getAttribute('aria-label');
  };
  setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  theme.addEventListener('click', () => {
    const value = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(value); try { localStorage.setItem('portfolio-theme', value); } catch {}
  });
  if (nav) {
    const tools = document.createElement('div'); tools.className = 'nav-tools';
    const quick = makeButton('Quick navigation (Ctrl or Command K)', '⌘', 'command-trigger');
    tools.append(quick, theme); nav.append(tools);
    const links = nav.querySelector('.nav-links, .page-nav');
    if (links) {
      links.id = 'navigation-links';
      const menu = makeButton('Open navigation', '☰', 'menu-toggle');
      menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-controls', links.id);
      const close = () => { nav.classList.remove('nav-open'); menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation'); menu.textContent='☰'; };
      menu.addEventListener('click', () => { const open = nav.classList.toggle('nav-open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); menu.textContent = open ? '×' : '☰'; });
      links.addEventListener('click', e => { if(e.target.closest('a')) close(); });
      document.addEventListener('keydown', e => { if(e.key === 'Escape') close(); });
      tools.append(menu);
    }
    const dialog = document.createElement('dialog'); dialog.className='command-dialog'; dialog.setAttribute('aria-labelledby','quick-heading');
    const heading = document.createElement('div'); heading.className='command-heading';
    const title = document.createElement('h2'); title.id='quick-heading'; title.textContent='Where to?';
    const close = makeButton('Close quick navigation', '×'); close.addEventListener('click',()=>dialog.close()); heading.append(title,close);
    const list=document.createElement('div'); list.className='command-links';
    for(const [label,path] of [['Selected work','#work'],['Monitor-distance sensor','distance-sensor/'],['VEX Robotics','robotics/'],['Northline websites','northline/'],['Games & simulations','games/'],['Community experience','#experience'],['Resume ↗','resume.pdf?v=20261010-hackcamp'],['Contact','#contact']]) {
      const a=document.createElement('a'); a.textContent=label; a.href=home(path); a.addEventListener('click',()=>dialog.close()); list.append(a);
    }
    const hint=document.createElement('p'); hint.className='command-hint'; hint.textContent='Tab to move · Enter to open · Esc to close';
    dialog.append(heading,list,hint);document.body.append(dialog);
    const open=()=>{if(!dialog.open){dialog.showModal();list.querySelector('a').focus();}};
    quick.addEventListener('click',open);
    document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open();}});
    dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
  }
  root.classList.add('js-ready');
  const range=document.querySelector('#distance-control');
  if(range){const update=()=>{const value=Number(range.value);document.querySelector('#distance-value').textContent=value+' cm';document.querySelector('#distance-status').textContent=value<40?'LED on · move back':'LED off';document.querySelector('.sensor-widget').classList.toggle('is-close',value<40);document.querySelector('.distance-person').style.transform='translateX('+((value-60)*1.55)+'px)';};range.addEventListener('input',update);update();}
  const filters=document.querySelector('.project-filters');
  if(filters){filters.hidden=false;const cards=[...document.querySelectorAll('[data-category]')];const select=filter=>{let count=0;cards.forEach(c=>{c.hidden=filter!=='all'&&c.dataset.category!==filter;if(!c.hidden)count++;});filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));document.querySelector('.filter-status').textContent=count+' projects shown';};filters.addEventListener('click',e=>{const b=e.target.closest('button');if(b)select(b.dataset.filter);});const restore=()=>{if(['#northline','#sensor','#robotics'].includes(location.hash))select('all');};window.addEventListener('hashchange',restore);document.querySelectorAll('a[href="#northline"]').forEach(a=>a.addEventListener('click',()=>select('all')));restore();}
  const copy=document.querySelector('.copy-email');
  if(copy&&navigator.clipboard){copy.hidden=false;copy.addEventListener('click',async()=>{const status=document.querySelector('.copy-status');try{await navigator.clipboard.writeText('smganeev@gmail.com');copy.textContent='Copied ✓';status.textContent='Email address copied.';setTimeout(()=>copy.textContent='Copy email',2500);}catch{status.textContent='Copy unavailable. Use the email link beside this button.';copy.textContent='Use email link';}});}
  const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  let queued=false;const updateScroll=()=>{const extent=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(extent>0?scrollY/extent:0)+')';queued=false;};addEventListener('scroll',()=>{if(!queued){requestAnimationFrame(updateScroll);queued=true;}},{passive:true});addEventListener('resize',updateScroll);updateScroll();
  if('IntersectionObserver' in window){
    const motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){if(motion)entry.target.classList.add('reveal');reveal.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.feature-card,.section-heading,.project-case,.client-card').forEach(el=>reveal.observe(el));
    const active=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('.nav-links a[href^="#"]').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}),{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main section[id]').forEach(el=>active.observe(el));
  }
})();
