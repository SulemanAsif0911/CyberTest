// ============================================================
// CYBER HAYAT — Scam and fake-profile checker (runs entirely on this device).
// ============================================================
(function(){
  "use strict";
  const F = window.CH_FMT, $ = id => document.getElementById(id);
  const SETS = {
    message: { title: "Check a message", intro: "Tick everything that applies to the message, call or email you received.",
      flags: [
        ["money",   3, "It asks for money, a gift card, crypto or a “small fee” to release something"],
        ["otp",     4, "It asks for an OTP, PIN, password, CNIC or card details"],
        ["urgent",  2, "It pushes you to act immediately or threatens consequences"],
        ["official",2, "It claims to be a bank, courier, FIA, tax office or government scheme, but came from an ordinary number or account"],
        ["link",    3, "It contains a link or an app to install"],
        ["prize",   3, "It says you won a prize, loan or support payment you didn’t apply for"],
        ["secret",  2, "It tells you to keep it secret or not to tell family"],
        ["photos",  4, "It asks for private photos, a video call or intimate content"],
        ["switch",  1, "It wants to move the chat to another app straight away"],
        ["threat",  4, "It threatens to share your photos, messages or information"]
      ] },
    profile: { title: "Check a profile", intro: "Tick everything that applies to the account that contacted you.",
      flags: [
        ["new",     2, "The account is new, or has very few posts"],
        ["photos",  2, "The photos look like a model or stock photos, or match another person online"],
        ["fast",    2, "It became very friendly, romantic or intense within days"],
        ["video",   3, "It always has an excuse not to do a live video call"],
        ["private", 4, "It asks for private photos or to share yours first"],
        ["money",   4, "It asks for money, a gift or help with an emergency"],
        ["story",   2, "The story changes or doesn’t add up"],
        ["copy",    4, "It looks like a copy of someone you know"],
        ["followers",1,"It has many followers but almost no real comments"],
        ["offplat", 1, "It wants to continue on a private app straight away"]
      ] }
  };
  let mode = "message";

  function render(){
    const s = SETS[mode];
    $("ckTitle").textContent = s.title; $("ckIntro").textContent = s.intro;
    $("ckList").innerHTML = s.flags.map(f => `<label class="settings-switch"><span><strong>${F.esc(f[2])}</strong></span><input type="checkbox" data-w="${f[1]}" data-k="${f[0]}"><i></i></label>`).join("");
    $("ckOut").hidden = true;
    document.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-pressed", b.dataset.mode === mode));
  }
  function check(){
    const on = Array.from(document.querySelectorAll("#ckList input:checked"));
    const score = on.reduce((a, c) => a + (+c.dataset.w), 0);
    const hard = on.some(c => ["otp", "photos", "private", "threat", "money"].indexOf(c.dataset.k) !== -1 && +c.dataset.w >= 4);
    let level, text, cls, pct;
    if(!on.length){ level = "No red flags ticked"; text = "Nothing suspicious was selected. Stay careful: scammers can be convincing. Verify anything unexpected using an official number you look up yourself."; cls = "ok"; pct = 6; }
    else if(score >= 8 || hard){ level = "High risk"; cls = "danger"; pct = Math.min(100, 55 + score * 4);
      text = mode === "message" ? "Treat this as a scam or blackmail attempt. Don’t reply, click, pay or share any code. Save a screenshot, then block and report." : "Treat this account as unsafe. Don’t send photos or money. Stop contact, save screenshots, and report the account."; }
    else if(score >= 4){ level = "Be careful"; cls = "warn"; pct = 40 + score * 4; text = "Several warning signs. Pause, don’t share anything private, and check independently before replying."; }
    else { level = "Low to moderate"; cls = "info"; pct = 20 + score * 4; text = "A few signs worth noting. Keep checking, and don’t share sensitive details until you can verify who this is."; }
    const reasons = on.map(c => `<li>${F.esc(c.closest("label").querySelector("strong").textContent)}</li>`).join("");
    $("ckOut").innerHTML = `<div class="gauge"><div class="meter${cls === "ok" ? " ok" : ""}"><i style="width:${Math.min(100, pct)}%"></i></div><strong>${level}</strong></div>
      <div class="callout ${cls}" style="margin-top:.8rem"><span>${CH_ICON("alert", 20)}</span><div>${F.esc(text)}</div></div>
      ${reasons ? `<h3 style="font-size:.95rem;margin:1rem 0 .4rem">Why</h3><ul class="reasons">${reasons}</ul>` : ""}
      <div class="acts" style="margin-top:1rem"><a class="act" href="vault.html">Save evidence</a><a class="act" href="platforms.html">Report it</a><a class="act call" href="tel:1799" dir="ltr">${CH_ICON("phone", 14)} NCCIA 1799</a></div>`;
    $("ckOut").hidden = false; $("ckOut").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  document.addEventListener("DOMContentLoaded", () => {
    render();
    document.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => { mode = b.dataset.mode; render(); }));
    $("ckGo").addEventListener("click", check);
  });
})();
