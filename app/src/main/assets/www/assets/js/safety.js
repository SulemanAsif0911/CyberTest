// ============================================================
// CYBER HAYAT — Safety plan: trusted contacts + one-tap alert (stored on this device).
// ============================================================
(function(){
  "use strict";
  const F = window.CH_FMT, $ = id => document.getElementById(id);
  const KEY = "ch_safety";
  const DEFAULT_MSG = "I need help. Someone is threatening or harassing me online and I’m worried. Please call me as soon as you can, or come to me. I’m safe at: [PLACE]";
  const CHECK = [
    "I know where I can go if I need to leave quickly",
    "At least one person knows what is happening",
    "My important accounts have new passwords and two-step verification",
    "My evidence is saved in the vault and backed up",
    "I have saved NCCIA 1799 and FIA 9911 in my phone",
    "I have turned off location sharing on photos and apps"
  ];
  let st = load();
  function load(){
    try{ const s = JSON.parse(localStorage.getItem(KEY) || "{}");
      return { contacts: Array.isArray(s.contacts) ? s.contacts.slice(0, 3).map(c => ({ name: String(c.name || "").slice(0, 60), phone: String(c.phone || "").slice(0, 25) })) : [],
               msg: typeof s.msg === "string" && s.msg ? s.msg.slice(0, 400) : DEFAULT_MSG, done: s.done && typeof s.done === "object" ? s.done : {} };
    }catch(e){ return { contacts: [], msg: DEFAULT_MSG, done: {} }; }
  }
  const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(st)); }catch(e){ CH_SUBMIT.toast("Couldn’t save on this device.", "error"); } };

  function renderContacts(){
    $("contacts").innerHTML = st.contacts.length ? st.contacts.map((c, i) => `
      <div class="vt-item"><div class="vt-thumb">${CH_ICON("users", 22)}</div>
        <div class="vt-body"><div class="field" style="margin:0 0 .5rem"><label for="cn${i}">Name</label><input id="cn${i}" data-i="${i}" data-k="name" value="${F.esc(c.name)}" maxlength="60" placeholder="e.g. Ayesha (sister)" dir="auto"></div>
        <div class="field" style="margin:0"><label for="cp${i}">Phone</label><input id="cp${i}" data-i="${i}" data-k="phone" value="${F.esc(c.phone)}" maxlength="25" placeholder="0300 1234567" inputmode="tel" dir="ltr"></div>
        <div class="vt-act"><button class="act" data-del="${i}">Remove</button></div></div></div>`).join("")
      : `<div class="empty">${CH_ICON("users", 36)}<strong>No one added yet</strong>Add a sibling, friend or relative you trust.</div>`;
    $("addContact").hidden = st.contacts.length >= 3;
  }
  function validPhone(p){ const d = F.dial(p).replace(/\D/g, ""); return d.length >= 7; }
  function renderAlerts(){
    const ok = st.contacts.filter(c => c.name && validPhone(c.phone));
    if(!ok.length){ $("alerts").innerHTML = `<div class="empty">Add at least one trusted person with a phone number to enable one-tap alerts.</div>`; return; }
    const body = encodeURIComponent(st.msg);
    $("alerts").innerHTML = ok.map(c => {
      const dial = F.dial(c.phone), digits = dial.replace(/\D/g, "");
      return `<div class="vt-item"><div class="vt-body"><h4 dir="auto">${F.esc(c.name)}</h4><div class="vt-meta"><span dir="ltr">${F.esc(F.phone(c.phone))}</span></div>
        <div class="acts"><a class="act call" href="tel:${F.esc(dial)}">${CH_ICON("phone", 14)} Call</a><a class="act" href="sms:${F.esc(dial)}?body=${body}">SMS</a><a class="act" href="https://wa.me/${F.esc(digits)}?text=${body}" target="_blank" rel="noopener">WhatsApp ↗</a></div></div></div>`;
    }).join("");
  }
  function renderChecklist(){
    $("checklist").innerHTML = CHECK.map((t, i) => `<div class="task${st.done[i] ? " done" : ""}" data-i="${i}"><input type="checkbox" id="ck${i}" ${st.done[i] ? "checked" : ""}><label class="chk" for="ck${i}">${CH_ICON("check", 14)}</label><div class="task-body"><h4>${F.esc(t)}</h4></div></div>`).join("");
  }
  function count(){ $("msgCount").textContent = st.msg.length + " of 400 characters"; }

  document.addEventListener("DOMContentLoaded", () => {
    $("msg").value = st.msg; count(); renderContacts(); renderAlerts(); renderChecklist();
    $("addContact").addEventListener("click", () => { if(st.contacts.length < 3){ st.contacts.push({ name: "", phone: "" }); save(); renderContacts(); renderAlerts(); } });
    $("contacts").addEventListener("input", e => { const i = e.target.dataset.i; if(i == null) return; st.contacts[i][e.target.dataset.k] = e.target.value; save(); renderAlerts(); });
    $("contacts").addEventListener("click", e => { const d = e.target.closest("[data-del]"); if(!d) return; st.contacts.splice(+d.dataset.del, 1); save(); renderContacts(); renderAlerts(); });
    $("msg").addEventListener("input", () => { st.msg = $("msg").value; save(); count(); renderAlerts(); });
    $("msgReset").addEventListener("click", () => { st.msg = DEFAULT_MSG; $("msg").value = st.msg; save(); count(); renderAlerts(); });
    $("checklist").addEventListener("change", e => { const row = e.target.closest(".task"); if(!row) return; st.done[row.dataset.i] = e.target.checked; row.classList.toggle("done", e.target.checked); save(); });
  });
})();
