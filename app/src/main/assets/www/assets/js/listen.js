// ============================================================
// CYBER HAYAT — "Listen" buttons using the phone's own text-to-speech
// (works offline if the voice is installed). Needs no audio files.
// <button data-listen="#id" data-lang="ur">  reads the text of #id
// ============================================================
(function(){
  "use strict";
  const synth = window.speechSynthesis;
  const toast = (m, k) => window.CH_SUBMIT && window.CH_SUBMIT.toast(m, k);
  let activeBtn = null;

  function pickVoice(code){
    const want = (code === "ur" ? "ur" : "en").toLowerCase();
    const voices = synth ? synth.getVoices() : [];
    return voices.find(v => v.lang && v.lang.toLowerCase().indexOf(want) === 0) || null;
  }
  function stop(){
    if(synth) synth.cancel();
    if(activeBtn){ activeBtn.classList.remove("is-playing"); activeBtn.setAttribute("aria-pressed", "false"); activeBtn = null; }
  }
  function speak(text, code, btn){
    if(!synth || typeof SpeechSynthesisUtterance === "undefined"){ toast("Audio isn’t available on this device.", "error"); return; }
    if(btn && btn === activeBtn){ stop(); return; }
    stop();
    const u = new SpeechSynthesisUtterance(String(text).replace(/\s+/g, " ").trim());
    const v = pickVoice(code);
    if(!v && code === "ur"){ toast("No Urdu voice is installed. In Android Settings, add the Urdu voice for Text-to-speech.", "error"); return; }
    if(v){ u.voice = v; u.lang = v.lang; } else { u.lang = "en-GB"; }
    u.rate = 0.92;
    u.onend = u.onerror = () => { if(btn === activeBtn) stop(); };
    if(btn){ activeBtn = btn; btn.classList.add("is-playing"); btn.setAttribute("aria-pressed", "true"); }
    synth.speak(u);
  }
  window.CH_LISTEN = { speak, stop };

  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest("[data-listen]");
    if(!b) return;
    const el = document.querySelector(b.getAttribute("data-listen"));
    if(!el) return;
    speak(el.innerText || el.textContent, b.getAttribute("data-lang") || el.getAttribute("lang") || "en", b);
  });
  document.addEventListener("ch:quick-exit", stop);
  window.addEventListener("pagehide", stop);
  if(synth && synth.addEventListener) synth.addEventListener("voiceschanged", () => {});
})();
