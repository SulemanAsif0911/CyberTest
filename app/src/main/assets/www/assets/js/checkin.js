// ============================================================
// CYBER HAYAT — gentle check-in on the home screen, a few days after someone
// saved a report or built a plan. Local only: it reads dates already on this device.
// ============================================================
(function(){
  "use strict";
  const F = window.CH_FMT, DAY = 86400000;
  function lastActivity(){
    let t = 0;
    try{
      Object.keys(localStorage).forEach(k => { if(k.indexOf("ch_incident_") === 0){ try{ const d = JSON.parse(localStorage.getItem(k)); if(d && d.savedAt > t) t = d.savedAt; }catch(e){} } });
      const tr = JSON.parse(localStorage.getItem("ch_triage") || "null"); if(tr && tr.built && tr.updated > t) t = tr.updated;
    }catch(e){}
    return t;
  }
  document.addEventListener("DOMContentLoaded", () => {
    const sec = document.getElementById("checkInSec"); if(!sec) return;
    const t = lastActivity(); if(!t || Date.now() - t < 3 * DAY) return;
    let last = 0; try{ last = (JSON.parse(localStorage.getItem("ch_checkin") || "{}").last) || 0; }catch(e){}
    if(Date.now() - last < 7 * DAY) return;
    sec.hidden = false;
    const days = Math.max(3, Math.floor((Date.now() - t) / DAY));
    document.getElementById("checkIn").innerHTML = `<div class="checkin" role="region" aria-label="Check-in">
      <h3>How are you doing?</h3><p>It has been ${F.plural(days, "day")} since you last worked on your plan or report. There’s no right answer, and support is here if you need it.</p>
      <div class="acts" style="margin-top:.8rem"><button class="act" data-ci="ok">I’m okay</button><a class="act" href="triage.html" data-ci="plan">Continue my plan</a><a class="act call" href="chatbot.html" data-ci="help">I need support</a><button class="act" data-ci="later">Remind me later</button></div></div>`;
    sec.addEventListener("click", e => {
      const b = e.target.closest("[data-ci]"); if(!b) return;
      try{ localStorage.setItem("ch_checkin", JSON.stringify({ last: Date.now(), answer: b.dataset.ci })); }catch(x){}
      if(b.tagName === "BUTTON"){ sec.hidden = true; if(b.dataset.ci === "ok" && window.CH_SUBMIT) CH_SUBMIT.toast("Glad to hear it. We’re here whenever you need us."); }
    });
  });
})();
