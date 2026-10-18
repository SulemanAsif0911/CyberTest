// ============================================================
// CYBER HAYAT — Helpline directory. A built-in list always works offline;
// when online, the team can add or correct numbers from their Sheet (cached 24 h).
// ============================================================
(function(){
  "use strict";
  const F = window.CH_FMT, $ = id => document.getElementById(id);
  const CATS = [["all","All"],["cyber","Cybercrime"],["women","Women"],["children","Children"],["mental","Mental health"],["legal","Legal aid"],["emergency","Emergency"]];
  const BASE = [
    { id:"nccia", name:"National Cyber Crime Investigation Agency (NCCIA)", cat:"cyber", num:"1799", note:"Report cyber harassment, blackmail and online fraud.", verified:"2026-10" },
    { id:"fia", name:"Federal Investigation Agency (FIA) cybercrime", cat:"cyber", num:"9911", note:"Federal cybercrime complaints.", verified:"2026-10" },
    { id:"pcsw", name:"Punjab Commission on the Status of Women", cat:"women", region:"Punjab", num:"1043", note:"Toll-free women’s helpline.", verified:"2026-10" },
    { id:"drf", name:"Digital Rights Foundation helpline", cat:"cyber", num:"0800-39393", note:"Free guidance on online harassment and digital safety.", verified:"2026-10" },
    { id:"police", name:"Police emergency", cat:"emergency", num:"15", note:"Immediate danger.", confirm:true },
    { id:"rescue", name:"Rescue 1122", cat:"emergency", num:"1122", note:"Ambulance, fire and rescue. Coverage varies by district.", confirm:true },
    { id:"edhi", name:"Edhi ambulance", cat:"emergency", num:"115", note:"Ambulance service.", confirm:true },
    { id:"madadgaar", name:"Madadgaar child protection helpline", cat:"children", num:"1098", note:"Help for children in danger or being abused.", confirm:true }
  ];
  let list = BASE.slice(), cat = "all", q = "";

  const clean = x => x && typeof x.id === "string" && typeof x.name === "string" && /^[\d\s+\-]{3,20}$/.test(x.num || "") && CATS.some(c => c[0] === x.cat && c[0] !== "all");
  function cached(){ try{ const c = JSON.parse(localStorage.getItem("ch_directory") || "null"); return c && Array.isArray(c.items) ? c : null; }catch(e){ return null; } }
  function merge(remote){
    const map = new Map(BASE.map(b => [b.id, b]));
    remote.filter(clean).forEach(r => map.set(r.id, { id: r.id, name: r.name.slice(0, 120), cat: r.cat, num: r.num, region: (r.region || "").slice(0, 60), note: (r.note || "").slice(0, 200), verified: (r.verified || "").slice(0, 10) }));
    list = Array.from(map.values());
  }
  function verifiedText(x){
    if(x.confirm) return `<span class="badge badge-high">Confirm before relying on it</span>`;
    if(!x.verified) return "";
    const m = /^(\d{4})-(\d{2})/.exec(x.verified); const d = m ? new Date(Date.UTC(+m[1], +m[2] - 1, 1)) : null;
    return `<span class="badge badge-ok">Checked ${d ? F.esc(new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" }).format(d)) : F.esc(x.verified)}</span>`;
  }
  function render(){
    const t = q.trim().toLowerCase();
    const items = list.filter(x => (cat === "all" || x.cat === cat) && (!t || (x.name + " " + x.note + " " + (x.region || "") + " " + x.num).toLowerCase().indexOf(t) !== -1));
    $("dirList").innerHTML = items.length ? items.map(x => `<div class="dir-item"><div class="nm"><h4>${F.esc(x.name)}</h4><small>${F.esc(x.note || "")}${x.region ? " · " + F.esc(x.region) : ""}</small><div style="margin-top:.35rem">${verifiedText(x)}</div></div>
      <a class="num" href="tel:${F.esc(x.num.replace(/[^\d+]/g, ""))}" aria-label="Call ${F.esc(x.name)}">${F.esc(x.num)}</a></div>`).join("")
      : `<div class="empty"><strong>No match</strong>Try a different word or choose All.</div>`;
    $("dirCount").textContent = F.plural(items.length, "number") + (cat !== "all" || t ? " shown" : "");
  }
  document.addEventListener("DOMContentLoaded", async () => {
    if(!$("dirList")) return;
    $("dirChips").innerHTML = CATS.map(c => `<button type="button" data-c="${c[0]}" aria-pressed="${c[0] === "all"}">${c[1]}</button>`).join("");
    $("dirChips").addEventListener("click", e => { const b = e.target.closest("[data-c]"); if(!b) return; cat = b.dataset.c; $("dirChips").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); render(); });
    $("dirQ").addEventListener("input", e => { q = e.target.value; render(); });
    const c = cached(); if(c) merge(c.items);
    render();
    const stale = !c || Date.now() - (c.ts || 0) > 24 * 3600 * 1000;
    if(stale && navigator.onLine && window.CH_CONFIG && CH_CONFIG.APPS_SCRIPT_URL){
      try{ const items = await CH_SUBMIT.directory(); localStorage.setItem("ch_directory", JSON.stringify({ ts: Date.now(), items })); merge(items); render(); }catch(e){ /* built-in list stays */ }
    }
  });
})();
