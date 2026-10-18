// ============================================================
// CYBER HAYAT — Guided plan UI (offline). State lives only on this device.
// ============================================================
(function(){
  "use strict";
  const D = window.CH_TRIAGE, F = window.CH_FMT;
  const KEY = "ch_triage";
  const $ = id => document.getElementById(id);
  const L = () => (localStorage.getItem("ch_lang") === "ur" ? "ur" : "en");
  const pick = o => (o && (o[L()] || o.en)) || "";
  const isUr = o => L() === "ur" && o && o.ur;
  const lt = o => isUr(o) ? ' lang="ur" class="ur"' : "";

  const LABEL = { "1799":"NCCIA", "9911":"FIA", "1043":"PCSW", "15":"Police", "1122":"Rescue", "1098":"Child helpline" };
  const UI = {
    en: { now:"Now", nowSub:"First hour", today:"Today", todaySub:"Within 24 hours", week:"This week", weekSub:"Over the next few days",
          urgent:"Urgent", high:"High priority", moderate:"Moderate",
          rUrgent:"You told us you may be in danger. Please get somewhere safe and contact emergency services or someone you trust first. The rest of this plan can wait.",
          rHigh:"This situation can escalate quickly, so the first steps matter most. Work through them in order and ask someone you trust to help.",
          rMod:"This is serious, but you have time to work through it calmly. Do the first steps today.",
          done:"done", of:"of", steps:"steps", call:"Call", everyone:"This happens to people of every gender and age. If you are a man or a boy, you are not alone, and the same steps apply.",
          note:"Urdu text is available for blackmail, account hacking, fake profiles and harassment. Other situations are shown in English.", saved:"Plan saved on this device only." },
    ur: { now:"ابھی", nowSub:"پہلا گھنٹہ", today:"آج", todaySub:"24 گھنٹوں کے اندر", week:"اس ہفتے", weekSub:"آئندہ چند دنوں میں",
          urgent:"فوری", high:"اعلیٰ ترجیح", moderate:"درمیانی",
          rUrgent:"آپ نے بتایا کہ آپ خطرے میں ہو سکتے ہیں۔ پہلے کسی محفوظ جگہ جائیں اور ایمرجنسی سروس یا کسی قابلِ اعتماد شخص سے رابطہ کریں۔ باقی منصوبہ بعد میں بھی ہو سکتا ہے۔",
          rHigh:"یہ صورتِ حال تیزی سے بگڑ سکتی ہے، اس لیے ابتدائی اقدامات سب سے اہم ہیں۔ انہیں ترتیب سے کریں اور کسی قابلِ اعتماد شخص سے مدد لیں۔",
          rMod:"یہ سنجیدہ معاملہ ہے مگر آپ کے پاس سکون سے آگے بڑھنے کا وقت ہے۔ پہلے اقدامات آج کریں۔",
          done:"مکمل", of:"میں سے", steps:"اقدامات", call:"کال",
          everyone:"یہ ہر جنس اور عمر کے لوگوں کے ساتھ ہوتا ہے۔ اگر آپ مرد یا لڑکے ہیں تو بھی آپ اکیلے نہیں، یہی اقدامات آپ کے لیے ہیں۔",
          note:"اردو متن بلیک میلنگ، اکاؤنٹ ہیک، جعلی پروفائل اور ہراسانی کے لیے دستیاب ہے۔ باقی صورتیں انگریزی میں دکھائی جاتی ہیں۔", saved:"منصوبہ صرف اسی ڈیوائس پر محفوظ ہے۔" }
  };
  const U = k => UI[L()][k];

  let st = load();
  function load(){
    try{ const s = JSON.parse(localStorage.getItem(KEY) || "null");
      if(s && typeof s === "object" && D.STEPS[s.scenario]) return { scenario: s.scenario, answers: s.answers || {}, done: s.done || {}, built: !!s.built };
    }catch(e){}
    return { scenario: null, answers: {}, done: {}, built: false };
  }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(Object.assign({}, st, { updated: Date.now() }))); }catch(e){} }

  /* ---------- step 1 + 2 ---------- */
  function renderScenarios(){
    $("scGrid").innerHTML = D.SCENARIOS.map(s => `
      <button type="button" class="opt" data-sc="${s.id}" aria-pressed="${st.scenario === s.id}">
        ${window.CH_ICON(s.icon, 22)}<span${lt(s.t)}>${F.esc(pick(s.t))}</span><small${lt(s.s)}>${F.esc(pick(s.s))}</small>
      </button>`).join("");
  }
  function renderQuestions(){
    $("qList").innerHTML = D.QUESTIONS.map(q => `
      <label class="settings-switch"><span><strong${lt(q.t)}>${F.esc(pick(q.t))}</strong><small${lt(q.d)}>${F.esc(pick(q.d))}</small></span>
      <input type="checkbox" data-q="${q.id}" ${st.answers[q.id] ? "checked" : ""}><i></i></label>`).join("");
  }

  /* ---------- plan ---------- */
  function buildSteps(){
    const base = (D.STEPS[st.scenario] || []).map(x => Object.assign({}, x));
    const mods = ["danger","minor","paid","shared","knows"].filter(k => st.answers[k]).flatMap(k => D.MODS[k]);
    const all = [];
    ["now","today","week"].forEach(w => {
      mods.filter(m => m.w === w).forEach(m => all.push(m));
      base.filter(b => b.w === w).forEach(b => all.push(b));
    });
    return all;
  }
  function risk(){
    if(st.answers.danger) return "urgent";
    if(st.answers.minor || st.answers.paid || st.answers.shared || ["blackmail","leaked","stalking"].indexOf(st.scenario) !== -1) return "high";
    return "moderate";
  }
  function actHtml(a){
    if(typeof a === "string"){ const d = D.ACTIONS[a]; return d ? `<a class="act" href="${d.href}">${F.esc(pick(d.label))}</a>` : ""; }
    if(a.call) return `<a class="act call" href="tel:${a.call}" dir="ltr">${window.CH_ICON("phone", 14)} ${F.esc(U("call"))} ${F.esc(LABEL[a.call] || "")} ${F.esc(a.call)}</a>`;
    if(a.link) return `<a class="act" href="${F.esc(a.link)}" target="_blank" rel="noopener">${F.esc(a.label)} ↗</a>`;
    return "";
  }
  function taskHtml(s){
    const done = !!st.done[s.id];
    return `<div class="task${done ? " done" : ""}" data-id="${s.id}">
      <input type="checkbox" id="t_${s.id}" ${done ? "checked" : ""} aria-label="Mark done">
      <label class="chk" for="t_${s.id}">${window.CH_ICON("check", 14).replace('class="svg-icon stroke"', '')}</label>
      <div class="task-body">
        <h4${lt(s.t)}>${F.esc(pick(s.t))}</h4>
        <p${lt(s.d)}>${F.esc(pick(s.d))}</p>
        ${s.a && s.a.length ? `<div class="acts">${s.a.map(actHtml).join("")}</div>` : ""}
      </div></div>`;
  }
  function renderPlan(){
    const sc = D.SCENARIOS.find(x => x.id === st.scenario);
    const steps = buildSteps(), r = risk();
    const rs = { urgent: U("rUrgent"), high: U("rHigh"), moderate: U("rMod") }[r];
    const badge = { urgent: "badge-urgent", high: "badge-high", moderate: "badge-mod" }[r];
    const n = steps.length, d = steps.filter(s => st.done[s.id]).length;
    const sec = (w, title, sub) => {
      const items = steps.filter(s => s.w === w); if(!items.length) return "";
      return `<div class="plan-sec"><h3><span class="when ${w}">${F.esc(title)}</span><span class="tk-muted">${F.esc(sub)}</span></h3>${items.map(taskHtml).join("")}</div>`;
    };
    const hasUr = L() === "ur" && !(D.STEPS[st.scenario][0].t.ur);
    $("planOut").innerHTML = `
      <div class="plan-head">
        <div><h2${lt(sc.t)}>${F.esc(pick(sc.t))}</h2><div class="tk-row" style="margin-top:.5rem"><span class="badge ${badge}">${F.esc(U(r))}</span><span class="tk-muted tk-num" id="planCount"></span></div></div>
        <div class="tk-row">
          <button type="button" class="listen" data-listen="#planBody" data-lang="${L()}" aria-pressed="false">${window.CH_ICON("volume", 16)} Listen</button>
          <button type="button" class="listen" id="planShare">${window.CH_ICON("share", 16)} Share</button>
        </div>
      </div>
      <div class="meter" style="margin:.9rem 0" role="progressbar" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${d}"><i id="planBar"></i></div>
      <div class="callout ${r === "urgent" ? "danger" : r === "high" ? "warn" : "info"}"${isUr({ur:1}) ? ' dir="auto"' : ""}><span>${window.CH_ICON("alert", 20)}</span><div>${F.esc(rs)}</div></div>
      ${["blackmail","leaked","deepfake"].indexOf(st.scenario) !== -1 ? `<div class="callout ok" style="margin-top:.7rem"><span>${window.CH_ICON("heart", 20)}</span><div>${F.esc(U("everyone"))}</div></div>` : ""}
      ${hasUr ? `<p class="tk-muted" style="margin-top:.7rem">${F.esc(U("note"))}</p>` : ""}
      <div id="planBody">${sec("now", U("now"), U("nowSub"))}${sec("today", U("today"), U("todaySub"))}${sec("week", U("week"), U("weekSub"))}</div>
      <div class="tk-row" style="margin-top:1.4rem"><button type="button" class="btn btn-outline btn-sm" id="planEdit">Edit my answers</button><button type="button" class="btn btn-outline btn-sm" id="planReset">Start over</button></div>
      <p class="tk-muted" style="margin-top:.8rem">${F.esc(U("saved"))}</p>`;
    updateProgress(steps);
  }
  function updateProgress(steps){
    steps = steps || buildSteps();
    const n = steps.length, d = steps.filter(s => st.done[s.id]).length;
    const bar = $("planBar"), cnt = $("planCount");
    if(bar){ bar.style.width = (n ? d / n * 100 : 0) + "%"; bar.parentElement.classList.toggle("ok", d === n && n > 0); bar.parentElement.setAttribute("aria-valuenow", d); }
    if(cnt) cnt.textContent = d + " " + U("of") + " " + n + " " + U("steps") + " " + U("done");
  }

  function show(which){
    $("panelA").hidden = which !== "A"; $("panelB").hidden = which !== "B"; $("panelC").hidden = which !== "C";
  }
  function planText(){
    const sc = D.SCENARIOS.find(x => x.id === st.scenario);
    const lines = ["Cyber Hayat: my plan", pick(sc.t) + " · " + U(risk()), ""];
    buildSteps().forEach(s => lines.push((st.done[s.id] ? "[x] " : "[ ] ") + pick(s.t)));
    return lines.join("\n");
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderScenarios(); renderQuestions();
    show(st.built ? "C" : (st.scenario ? "B" : "A"));
    if(st.built) renderPlan();

    $("scGrid").addEventListener("click", e => {
      const b = e.target.closest("[data-sc]"); if(!b) return;
      st.scenario = b.dataset.sc; st.built = false; save(); renderScenarios(); show("B");
      $("panelB").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    $("qList").addEventListener("change", e => { const q = e.target.dataset.q; if(q){ st.answers[q] = e.target.checked; save(); } });
    $("buildPlan").addEventListener("click", () => { st.built = true; save(); renderPlan(); show("C"); window.scrollTo({ top: 0, behavior: "smooth" }); });
    $("backA").addEventListener("click", () => show("A"));
    $("planOut").addEventListener("change", e => {
      const row = e.target.closest(".task"); if(!row) return;
      st.done[row.dataset.id] = e.target.checked; row.classList.toggle("done", e.target.checked); save(); updateProgress();
    });
    $("planOut").addEventListener("click", e => {
      if(e.target.closest("#planEdit")){ show("B"); }
      if(e.target.closest("#planReset")){ if(confirm("Delete this plan and start again?")){ st = { scenario: null, answers: {}, done: {}, built: false }; save(); renderScenarios(); renderQuestions(); show("A"); } }
      if(e.target.closest("#planShare")){
        const t = planText();
        if(window.CHNative && CHNative.shareText){ CHNative.shareText(t); }
        else if(navigator.clipboard){ navigator.clipboard.writeText(t).then(() => window.CH_SUBMIT.toast("Plan copied.")); }
      }
    });
    document.addEventListener("ch:lang-changed", () => { renderScenarios(); renderQuestions(); if(st.built) renderPlan(); });
  });
})();
