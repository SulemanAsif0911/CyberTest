// ============================================================
// CYBER HAYAT — motion layer (progressive enhancement)
// Scroll progress, scroll-reveal with stagger, split-word headline,
// tap ripples, topbar elevation. Everything is disabled when the
// device asks for reduced motion, and content is never hidden if
// this script fails to run.
// ============================================================
(function(){
  "use strict";
  const root = document.documentElement;
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ready = fn => document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn) : fn();

  ready(function(){
    /* ---- topbar elevation + scroll progress ---- */
    const bar = document.querySelector(".topbar");
    let prog = null;
    if(!document.body.classList.contains("cb-body")){
      prog = document.createElement("div");
      prog.className = "ch-progress"; prog.setAttribute("aria-hidden", "true");
      document.body.appendChild(prog);
    }
    let ticking = false;
    function onScroll(){
      if(ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        if(bar) bar.classList.toggle("is-scrolled", y > 6);
        if(prog){
          const h = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
          prog.style.transform = "scaleX(" + Math.min(1, y / h) + ")";
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    /* ---- split-word headline on the home hero ---- */
    const h1 = document.querySelector(".hm-hero h1");
    if(h1 && !reduce){
      let i = 0;
      const walk = node => {
        Array.from(node.childNodes).forEach(n => {
          if(n.nodeType === 3){
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(tok => {
              if(!tok) return;
              if(/^\s+$/.test(tok)){ frag.appendChild(document.createTextNode(" ")); return; }
              const w = document.createElement("span"); w.className = "w"; w.setAttribute("aria-hidden", "true");
              const s = document.createElement("span"); s.style.setProperty("--i", i++); s.textContent = tok;
              w.appendChild(s); frag.appendChild(w);
            });
            n.replaceWith(frag);
          } else if(n.nodeType === 1){ walk(n); }
        });
      };
      h1.setAttribute("aria-label", h1.textContent.trim());
      walk(h1);
      h1.classList.add("is-split");
    }

    /* ---- scroll reveal with stagger ---- */
    const SEL = [".hm-head", ".hm-call", ".hm-tile", ".hm-step", ".hm-chip", ".hm-about", ".hm-trust li",
                 ".card", ".card-sm", ".acc-item", ".helpline-card", ".err-screen > *"].join(",");
    const targets = Array.from(document.querySelectorAll(SEL)).filter(el => !el.classList.contains("reveal") && !el.closest(".reveal"));
    if(reduce || !("IntersectionObserver" in window)){ return; }
    root.classList.add("js-motion");
    const groups = new Map();
    targets.forEach(el => {
      const p = el.parentElement; const n = groups.get(p) || 0; groups.set(p, n + 1);
      el.setAttribute("data-m", ""); el.style.setProperty("--d", Math.min(n, 7) * 70 + "ms");
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add("m-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    targets.forEach(el => io.observe(el));
    // safety net: never leave anything hidden
    setTimeout(() => targets.forEach(el => { const r = el.getBoundingClientRect(); if(r.top < innerHeight) el.classList.add("m-in"); }), 1800);

    /* ---- tap ripple ---- */
    if(!reduce){
      document.addEventListener("pointerdown", e => {
        const host = e.target.closest && e.target.closest(".btn, .hm-tile, .hm-call, .cb-topic, .cb-chip, .cb-send, .helpline-card .btn");
        if(!host || host.disabled) return;
        const r = host.getBoundingClientRect();
        const d = Math.max(r.width, r.height) * 1.6;
        const s = document.createElement("span");
        s.className = "ripple";
        s.style.cssText = "width:" + d + "px;height:" + d + "px;left:" + (e.clientX - r.left - d / 2) + "px;top:" + (e.clientY - r.top - d / 2) + "px";
        host.appendChild(s);
        setTimeout(() => s.remove(), 650);
      }, { passive: true });
    }
  });
})();
