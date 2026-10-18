// ============================================================
// CYBER HAYAT — native bridge (Android shell)
// The Android app calls window.CH_setInsets(top,right,bottom,left)
// with the real system-bar / cutout sizes (in CSS px). Outside the
// app, the browser's env(safe-area-inset-*) values are used instead.
// ============================================================
(function(){
  "use strict";
  var root = document.documentElement;
  function setInsets(t, r, b, l){
    root.style.setProperty("--safe-top",    (t||0) + "px");
    root.style.setProperty("--safe-right",  (r||0) + "px");
    root.style.setProperty("--safe-bottom", (b||0) + "px");
    root.style.setProperty("--safe-left",   (l||0) + "px");
    root.classList.add("in-app");
  }
  window.CH_setInsets = setInsets;
  // Native may have injected values before this script ran.
  if (window.__CH_INSETS) setInsets.apply(null, window.__CH_INSETS);

  // Keep the visible viewport height in a variable (fixes 100vh jumps with
  // the on-screen keyboard and browser bars).
  function vh(){ root.style.setProperty("--vh", (window.innerHeight * 0.01) + "px"); }
  vh(); window.addEventListener("resize", vh);

  // Offline / online indicator
  function banner(){
    var el = document.getElementById("chNet");
    if (!el){
      el = document.createElement("div");
      el.id = "chNet"; el.className = "ch-net"; el.setAttribute("role","status");
      document.addEventListener("DOMContentLoaded", function(){ document.body.appendChild(el); });
      if (document.body) document.body.appendChild(el);
    }
    return el;
  }
  function update(){
    var el = banner();
    if (navigator.onLine){ el.classList.remove("show"); }
    else { el.textContent = "You’re offline — everything still works. Anything you send will sync when you’re back online."; el.classList.add("show"); }
  }
  window.addEventListener("online", update); window.addEventListener("offline", update);
  document.addEventListener("DOMContentLoaded", update);
})();
