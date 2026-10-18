// ============================================================
// CYBER HAYAT — "What would you do?" scenarios and shareable safety cards.
// ============================================================
(function(){
  "use strict";
  const F = window.CH_FMT, $ = id => document.getElementById(id);
  const KEY = "ch_learn";
  const SC = [
    { id:"job", title:"The job offer", intro:"Practise spotting a trap that starts as an opportunity.", steps:[
      { story:"A stranger messages you: “We saw your profile. Paid online shoot. Just send a few photos first so we can check.”", opts:[
        ["Send a few photos. It’s only a test.", 0, "Once photos are sent you can’t control where they go. “Test photos” are a common start to blackmail."],
        ["Ask for the company website, a written contract and independent reviews. Send nothing.", 2, "Correct. Real employers don’t need private photos up front, and you can verify them without sending anything."],
        ["Reply with questions about pay and keep chatting.", 1, "Asking questions is fine, but long chats give scammers time to pressure you. Verify independently and keep your photos private."] ] },
      { story:"You pushed back. Now they write: “Send the photos or we will share your chats with your family.”", opts:[
        ["Pay or send photos to make it stop.", 0, "Giving in usually brings more demands. It rarely ends it."],
        ["Screenshot everything, stop replying and tell someone you trust. Then report.", 2, "Correct. Evidence plus support is the strongest response. Report to NCCIA (1799) or FIA (9911)."],
        ["Delete the chat and block them.", 1, "Blocking helps, but deleting destroys your evidence. Save screenshots first."] ] } ] },
    { id:"friend", title:"The “friend” who needs money", intro:"A familiar name does not always mean a familiar person.", steps:[
      { story:"A friend messages on WhatsApp: “I’m stuck and need Rs 15,000 right now. Please send to this number, I’ll explain later.”", opts:[
        ["Send it. They’re a friend in trouble.", 0, "Hacked accounts are often used to ask the owner’s contacts for money."],
        ["Call your friend on their usual number to check.", 2, "Correct. Always verify through a second channel you already trust."],
        ["Ask a question only they would know, in the same chat.", 1, "Better than nothing, but a hacker may be reading the chat. A phone call is safer."] ] },
      { story:"It was fake. The “friend” now says: “Wait, you’ll get a code by SMS. Please read it out to me.”", opts:[
        ["Read out the code. It’s probably to confirm.", 0, "That code lets them take over your account. Never share an OTP."],
        ["Refuse, report the account and warn mutual friends.", 2, "Correct. Don’t share codes, and tell others so they aren’t tricked."],
        ["Ask why they need it.", 1, "Don’t engage. Anyone asking for a code is trying to break in."] ] } ] },
    { id:"fake", title:"A profile with your photos", intro:"Respond calmly, and in the right order.", steps:[
      { story:"You find an account using your photos and name. It has been messaging people you know.", opts:[
        ["Message them angrily to take it down.", 0, "Confronting them can escalate things and warn them to hide evidence."],
        ["Screenshot the profile and its messages, then report it as impersonation.", 2, "Correct. Evidence first, then the platform’s impersonation form."],
        ["Ignore it and hope it goes away.", 1, "It may not. The longer it stays, the more people it can mislead."] ] },
      { story:"A friend says they got a strange money request from “you”.", opts:[
        ["Delete your own account to stay safe.", 0, "That doesn’t remove the fake account and loses your own evidence of what’s yours."],
        ["Post a short notice on your real account and ask friends to report the fake.", 2, "Correct. A short, calm notice protects your contacts and speeds up removal."],
        ["Say nothing. It will blow over.", 0, "Silence leaves your contacts exposed to the scam."] ] } ] },
    { id:"group", title:"The group chat", intro:"Handling humiliation, and the “it’s just a joke” response.", steps:[
      { story:"Classmates share an edited image of you in a group chat, with jokes.", opts:[
        ["Leave the group and say nothing.", 1, "Understandable, but you lose the chance to save evidence and stop it spreading."],
        ["Save screenshots, then report to the platform and tell a trusted adult or the school.", 2, "Correct. Evidence first, then people who can act."],
        ["Share an edited image of them to get even.", 0, "That escalates the harm and could put you in legal trouble too."] ] },
      { story:"Someone writes: “It’s just a joke, don’t be dramatic.”", opts:[
        ["Stay quiet so you’re not the problem.", 0, "Silence can let it continue. You aren’t the problem."],
        ["Say clearly it isn’t okay, and involve the school or a trusted adult.", 2, "Correct. Naming it and getting support helps you and others who may be next."],
        ["Argue in the group until they stop.", 1, "Understandable, but arguing in public rarely stops it. Use official routes."] ] } ] },
    { id:"prize", title:"The prize SMS", intro:"A small click can become a big loss.", steps:[
      { story:"An SMS says you’ve won a support payment. “Open this link and enter your CNIC and the code we send.”", opts:[
        ["Open the link. It could be real money.", 0, "This is a classic phishing message. Real schemes don’t ask for OTP codes by link."],
        ["Don’t click. Check the official website or helpline yourself, then delete and report the number.", 2, "Correct. Look up the official source on your own."],
        ["Forward it to friends to warn them.", 1, "Warning is kind, but forwarding spreads the link. Tell them in your own words instead."] ] },
      { story:"You already clicked and typed an OTP. A minute later you get a message that money left your wallet.", opts:[
        ["Wait and see if it fixes itself.", 0, "Every minute counts. Delay makes recovery harder."],
        ["Call your bank or wallet provider at once, change passwords, then report to NCCIA or FIA.", 2, "Correct. Speed is key, so contact your provider first."],
        ["Message the sender and ask for a refund.", 0, "The sender is the scammer. Stay away and contact your bank."] ] } ] }
  ];
  const CARDS = [
    ["Myth and fact", "Myth: “If I sent a photo, it’s my fault.” Fact: Blackmail is a crime. The blame is on the person who threatens you.", "غلط فہمی: ’میں نے تصویر بھیجی تو میرا قصور ہے۔‘ حقیقت: بلیک میلنگ جرم ہے۔ قصور دھمکی دینے والے کا ہے۔"],
    ["Blackmail", "Don’t pay a blackmailer. Save evidence, stop replying, tell someone you trust, and report to NCCIA: 1799.", "بلیک میلر کو پیسے نہ دیں۔ ثبوت محفوظ کریں، جواب دینا بند کریں، کسی قابلِ اعتماد شخص کو بتائیں اور NCCIA کو 1799 پر رپورٹ کریں۔"],
    ["OTP safety", "Never share an OTP or PIN. No bank, courier or “support agent” will ever need it.", "OTP یا PIN کبھی کسی کو نہ بتائیں۔ کوئی بینک، کوریئر یا سپورٹ ایجنٹ اسے نہیں مانگتا۔"],
    ["Screenshots first", "Screenshot first, then block. Show the username, the date and the full conversation.", "پہلے اسکرین شاٹ، پھر بلاک۔ یوزر نیم، تاریخ اور پوری گفتگو نظر آنی چاہیے۔"],
    ["Two-step", "Turn on two-step verification on email and social media. It stops most account takeovers.", "ای میل اور سوشل میڈیا پر ٹو اسٹیپ ویریفیکیشن آن کریں۔ یہ زیادہ تر اکاؤنٹ ہیکنگ روکتا ہے۔"],
    ["You’re not alone", "Help is free and private: NCCIA 1799 · FIA 9911 · PCSW 1043 · DRF 0800-39393.", "مدد مفت اور خفیہ ہے: NCCIA 1799 · FIA 9911 · PCSW 1043 · DRF 0800-39393"]
  ];

  let st = (() => { try{ const s = JSON.parse(localStorage.getItem(KEY) || "{}"); return { a: s.a && typeof s.a === "object" ? s.a : {} }; }catch(e){ return { a: {} }; } })();
  const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(st)); }catch(e){} };
  const score = id => (st.a[id] || []).reduce((a, i, k) => a + (i == null ? 0 : SC.find(s => s.id === id).steps[k].opts[i][1]), 0);
  const total = () => SC.reduce((a, s) => a + score(s.id), 0), MAX = SC.length * 4;
  let open = null;

  function medal(){
    const t = total(), m = t >= 16 ? ["gold", "Gold"] : t >= 10 ? ["silver", "Silver"] : t >= 4 ? ["", "Bronze"] : ["none", "No badge yet"];
    return `<div class="score-row"><span class="medal ${m[0]}"><i></i>${m[1]}</span><span class="tk-muted tk-num">${t} of ${MAX} points</span></div>
      <div class="meter ${t === MAX ? "ok" : ""}" style="margin-top:.6rem"><i style="width:${t / MAX * 100}%"></i></div>`;
  }
  function list(){
    $("scBadge").innerHTML = medal();
    $("scList").innerHTML = SC.map(s => {
      const done = (st.a[s.id] || []).filter(x => x != null).length, sc = score(s.id);
      return `<button type="button" class="tk-card" data-s="${s.id}" style="text-align:start;width:100%"><span class="tk-ic c-amber">${CH_ICON("star", 22)}</span><span><h3>${F.esc(s.title)}</h3><p>${F.esc(s.intro)}</p><span class="badge ${done === 2 ? (sc === 4 ? "badge-ok" : "badge-mod") : "badge-neutral"}">${done === 2 ? sc + " of 4 points" : done ? "In progress" : "Not started"}</span></span></button>`;
    }).join("");
  }
  function play(id){
    open = id; const s = SC.find(x => x.id === id); st.a[id] = st.a[id] || [];
    const answered = st.a[id].filter(x => x != null).length, k = Math.min(answered, 1), step = s.steps[k];
    let html = `<div class="sc-card"><div class="tk-row" style="justify-content:space-between"><span class="badge badge-neutral">Step ${answered >= 2 ? 2 : k + 1} of 2</span><button class="act" id="scBack">All scenarios</button></div><h3 style="margin-top:.7rem">${F.esc(s.title)}</h3>`;
    for(let i = 0; i <= Math.min(answered, 1); i++){
      const stp = s.steps[i], pick = st.a[id][i];
      html += `<p class="sc-story">${F.esc(stp.story)}</p>` + stp.opts.map((o, j) => `<button type="button" class="choice${pick != null ? (j === pick ? (o[1] === 2 ? " good" : o[1] === 1 ? " ok" : " bad") : "") : ""}" data-i="${i}" data-j="${j}" ${pick != null ? "disabled" : ""}>${F.esc(o[0])}</button>`).join("");
      if(pick != null) html += `<div class="fb"><strong>${["Not quite", "Partly right", "Best choice"][stp.opts[pick][1]]}.</strong> ${F.esc(stp.opts[pick][2])}</div>`;
    }
    if(answered >= 2) html += `<div class="callout ok" style="margin-top:1rem"><span>${CH_ICON("check", 20)}</span><div><strong>Scenario complete: ${score(id)} of 4 points.</strong>${score(id) < 4 ? "You can retry to improve your score." : "Perfect score."}</div></div><div class="tk-row" style="margin-top:.8rem"><button class="btn btn-outline btn-sm" id="scRetry">Try again</button></div>`;
    $("scPlay").innerHTML = html + "</div>"; $("scPlay").hidden = false; $("scList").hidden = true; $("scBadge").hidden = true;
    $("scPlay").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function cards(){
    $("cards").innerHTML = CARDS.map((c, i) => `<div class="share-card"><span class="k">${F.esc(c[0])}</span><p>${F.esc(c[1])}</p><p class="ur" lang="ur">${F.esc(c[2])}</p><div class="row"><button class="btn btn-sm" data-share="${i}" data-l="en">Share English</button><button class="btn btn-sm" data-share="${i}" data-l="ur">شیئر اردو</button></div></div>`).join("");
  }
  function share(text){
    const t = text + "\n\n— Cyber Hayat PK";
    if(window.CHNative && CHNative.shareText) CHNative.shareText(t);
    else if(navigator.clipboard) navigator.clipboard.writeText(t).then(() => CH_SUBMIT.toast("Copied. Paste it into a chat."));
  }
  document.addEventListener("DOMContentLoaded", () => {
    list(); cards();
    $("scList").addEventListener("click", e => { const b = e.target.closest("[data-s]"); if(b) play(b.dataset.s); });
    $("scPlay").addEventListener("click", e => {
      const c = e.target.closest(".choice");
      if(c){ st.a[open][+c.dataset.i] = +c.dataset.j; save(); return play(open); }
      if(e.target.closest("#scBack")){ $("scPlay").hidden = true; $("scList").hidden = false; $("scBadge").hidden = false; list(); }
      if(e.target.closest("#scRetry")){ st.a[open] = []; save(); play(open); }
    });
    $("cards").addEventListener("click", e => { const b = e.target.closest("[data-share]"); if(!b) return; const c = CARDS[+b.dataset.share]; share(b.dataset.l === "ur" ? c[2] : c[1]); });
  });
})();
