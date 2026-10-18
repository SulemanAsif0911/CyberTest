// ============================================================
// CYBER HAYAT — shared site behaviour
// ============================================================
(function(){
  "use strict";

  /* ---------- mobile nav menu ---------- */
  const menuBtn   = document.getElementById('menuToggle');
  const navMenu   = document.getElementById('navMenu');
  const closeBtn  = document.getElementById('navMenuClose');

  function openMenu(){
    if(!navMenu) return;
    navMenu.classList.add('open');
    document.documentElement.classList.add('scroll-locked');
    requestAnimationFrame(()=> navMenu.classList.add('visible'));
    menuBtn && menuBtn.setAttribute('aria-expanded','true');
  }
  function closeMenu(){
    if(!navMenu) return;
    navMenu.classList.remove('visible');
    document.documentElement.classList.remove('scroll-locked');
    menuBtn && menuBtn.setAttribute('aria-expanded','false');
    setTimeout(()=> navMenu.classList.remove('open'), 350);
  }
  menuBtn && menuBtn.addEventListener('click', openMenu);
  closeBtn && closeBtn.addEventListener('click', closeMenu);
  navMenu && navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });

  /* settings toggle should close the mobile nav overlay first, so the
     drawer isn't hidden behind it */
  document.querySelectorAll('[data-settings-toggle]').forEach(btn=>{
    btn.addEventListener('click', closeMenu);
  });

  /* ---------- mark active nav link ---------- */
  const path = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('[data-nav-link]').forEach(a=>{
    const href = (a.getAttribute('href')||'').split('/').pop();
    if(href === path || (path === '' && href === 'index.html')){
      a.classList.add('is-active');
    }
  });

  /* ---------- back to top ---------- */
  const backBtn = document.getElementById('backToTop');
  if(backBtn){
    window.addEventListener('scroll', ()=>{
      backBtn.classList.toggle('visible', window.scrollY > 700);
    }, { passive:true });
    backBtn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
  }

  /* ---------- copy-to-clipboard (helplines, IDs, etc.) ---------- */
  document.querySelectorAll('[data-copy]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const value = btn.getAttribute('data-copy');
      try{
        await navigator.clipboard.writeText(value);
        const original = btn.innerHTML;
        btn.innerHTML = 'Copied';
        btn.classList.add('is-copied');
        setTimeout(()=>{ btn.innerHTML = original; btn.classList.remove('is-copied'); }, 1600);
      }catch(e){
        alert('Number: ' + value);
      }
    });
  });

  /* ---------- reveal-on-scroll ---------- */
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold:.14 }) : null;
  document.querySelectorAll('.reveal').forEach(el=>{
    if(io) io.observe(el); else el.classList.add('is-visible');
  });

  /* ---------- simple accordion (FAQ / library) ---------- */
  document.querySelectorAll('[data-accordion]').forEach(acc=>{
    acc.querySelectorAll('.acc-trigger').forEach(trigger=>{
      trigger.addEventListener('click', ()=>{
        const item = trigger.closest('.acc-item');
        const wasOpen = item.classList.contains('open');
        acc.querySelectorAll('.acc-item').forEach(i=> i.classList.remove('open'));
        if(!wasOpen) item.classList.add('open');
      });
    });
  });

  /* ---------- tabs (Urdu/English switch etc.) ---------- */
  document.querySelectorAll('[data-tabs]').forEach(group=>{
    const buttons = group.querySelectorAll('[data-tab-btn]');
    const panels  = group.querySelectorAll('[data-tab-panel]');
    buttons.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const target = btn.getAttribute('data-tab-btn');
        buttons.forEach(b=> b.classList.toggle('is-active', b===btn));
        panels.forEach(p=> p.classList.toggle('is-active', p.getAttribute('data-tab-panel')===target));
      });
    });
  });

  /* ---------- banner carousel (auto-sliding) ---------- */
  document.querySelectorAll('[data-carousel]').forEach(root=>{
    const slides = Array.from(root.querySelectorAll('.banner-slide'));
    const dotsWrap = root.querySelector('.banner-carousel-dots');
    const prevBtn = root.querySelector('[data-carousel-prev]');
    const nextBtn = root.querySelector('[data-carousel-next]');
    if(!slides.length) return;
    let index = slides.findIndex(s => s.classList.contains('is-active'));
    if(index < 0) index = 0;
    let dots = [];
    if(dotsWrap){
      dotsWrap.innerHTML = '';
      slides.forEach((_, i)=>{
        const d = document.createElement('button');
        d.setAttribute('aria-label', 'Go to slide ' + (i+1));
        d.addEventListener('click', ()=> goTo(i));
        dotsWrap.appendChild(d);
      });
      dots = Array.from(dotsWrap.children);
    }
    function render(){
      slides.forEach((s,i)=> s.classList.toggle('is-active', i===index));
      dots.forEach((d,i)=> d.classList.toggle('is-active', i===index));
    }
    function goTo(i){ index = (i + slides.length) % slides.length; render(); resetTimer(); }
    function next(){ goTo(index+1); }
    function prev(){ goTo(index-1); }
    nextBtn && nextBtn.addEventListener('click', next);
    prevBtn && prevBtn.addEventListener('click', prev);
    let timer = setInterval(next, 4200);
    function resetTimer(){ clearInterval(timer); timer = setInterval(next, 4200); }
    root.addEventListener('mouseenter', ()=> clearInterval(timer));
    root.addEventListener('mouseleave', resetTimer);
    render();
  });

})();
