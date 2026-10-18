// ============================================================
// CYBER HAYAT — Quick exit. One tap (or Esc twice) leaves the app at once.
// In the Android app it closes the task and clears history; in a browser
// it replaces the page with an ordinary-looking notes page.
// ============================================================
(function(){
  "use strict";
  function go(){
    try{ document.dispatchEvent(new CustomEvent("ch:quick-exit")); }catch(e){}   // locks the vault, stops audio
    try{ sessionStorage.clear(); }catch(e){}
    try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
    if(window.CHNative && typeof window.CHNative.quickExit === "function"){
      try{ window.CHNative.quickExit(); return; }catch(e){}
    }
    location.replace("decoy.html");
  }
  window.CH_EXIT = { go };
  let last = 0;
  document.addEventListener("keydown", e => {
    if(e.key !== "Escape") return;
    const now = Date.now();
    if(now - last < 800) go();
    last = now;
  });
  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest("#quickExit, [data-quick-exit]");
    if(b){ e.preventDefault(); go(); }
  });
})();
