// ============================================================
// CYBER HAYAT — Calm and ground: box breathing, 5-4-3-2-1 grounding, reassurance.
// ============================================================
(function(){
  "use strict";
  const $ = id => document.getElementById(id);
  const L = () => (localStorage.getItem("ch_lang") === "ur" ? "ur" : "en");
  const PH = [["Breathe in", "in"], ["Hold", "hold-in"], ["Breathe out", "out"], ["Hold", "hold-out"]];
  let running = false, timer = null, step = 0, rounds = 0;

  function tick(){
    if(!running) return;
    const [label, cls] = PH[step % 4];
    const el = $("breath");
    el.className = "breath " + cls;
    $("breathLabel").textContent = label;
    if(step % 4 === 0) { rounds++; $("breathRounds").textContent = rounds + (rounds === 1 ? " round" : " rounds"); }
    step++;
    timer = setTimeout(tick, 4000);
  }
  function toggleBreath(){
    running = !running;
    $("breathBtn").textContent = running ? "Stop" : "Start breathing";
    $("breathBtn").setAttribute("aria-pressed", running);
    if(running){ step = 0; rounds = 0; tick(); }
    else { clearTimeout(timer); $("breath").className = "breath"; $("breathLabel").textContent = "Ready when you are"; }
  }

  const GROUND = [["5", "things you can see", "Look around slowly. Name five things, such as a lamp, a cup, a window."],
                  ["4", "things you can touch", "Feel your sleeves, the chair, the floor, a cool surface."],
                  ["3", "things you can hear", "Notice sounds near you, then sounds further away."],
                  ["2", "things you can smell", "Or remember two smells you like."],
                  ["1", "thing you can taste", "A sip of water, or the taste in your mouth."]];
  const AFFIRM = {
    en: ["This is not your fault.", "Being targeted says everything about them, and nothing about you.", "You don’t have to solve everything today. One step is enough.",
         "Asking for help is a strong thing to do.", "Your feelings make sense. Anyone would be shaken by this.", "You are not alone, and people want to help.",
         "Your worth hasn’t changed because of what someone else did.", "You can take a break. The steps will still be here."],
    ur: ["اس میں آپ کا کوئی قصور نہیں۔", "نشانہ بنانا اُن کے بارے میں سب کچھ بتاتا ہے، آپ کے بارے میں کچھ نہیں۔", "آج سب کچھ حل کرنا ضروری نہیں۔ ایک قدم کافی ہے۔",
         "مدد مانگنا ہمت کی بات ہے۔", "آپ کے احساسات درست ہیں۔ کوئی بھی اس سے ہل جاتا۔", "آپ اکیلے نہیں ہیں، لوگ مدد کرنا چاہتے ہیں۔",
         "کسی اور کے عمل سے آپ کی قدر کم نہیں ہوتی۔", "آپ وقفہ لے سکتے ہیں۔ اقدامات یہیں رہیں گے۔"]
  };
  let ai = 0;
  function showAffirm(){
    const list = AFFIRM[L()], el = $("affirm");
    el.style.opacity = 0;
    setTimeout(() => { el.textContent = list[ai % list.length]; el.setAttribute("lang", L()); el.classList.toggle("ur", L() === "ur"); el.style.opacity = 1; }, 250);
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("breathBtn").addEventListener("click", toggleBreath);
    $("ground").innerHTML = GROUND.map((g, i) => `<button type="button" class="g" data-i="${i}" aria-pressed="false"><b>${g[0]}</b><span><strong>${g[1]}</strong><br><span class="tk-muted">${g[2]}</span></span></button>`).join("");
    $("ground").addEventListener("click", e => {
      const b = e.target.closest(".g"); if(!b) return;
      const on = !b.classList.contains("on"); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on);
      const n = document.querySelectorAll("#ground .g.on").length;
      $("groundMsg").textContent = n === 5 ? "Well done. Take one slow breath. You can repeat this any time." : n + " of 5 done";
    });
    $("affNext").addEventListener("click", () => { ai++; showAffirm(); });
    $("affirm").textContent = AFFIRM[L()][0];
    document.addEventListener("ch:lang-changed", () => { ai = 0; showAffirm(); });
    document.addEventListener("ch:quick-exit", () => { running = false; clearTimeout(timer); });
    window.addEventListener("pagehide", () => { running = false; clearTimeout(timer); });
  });
})();
