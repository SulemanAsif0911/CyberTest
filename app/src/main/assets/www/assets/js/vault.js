// ============================================================
// CYBER HAYAT — Evidence vault (offline, encrypted on this device)
//  • AES-256-GCM, key derived from your passphrase with PBKDF2 (250,000 rounds).
//  • Files, notes and links are encrypted before they touch storage. Nothing is uploaded.
//  • Each file gets a SHA-256 fingerprint when it is added, so any later change is detectable.
//  • Auto-locks after 3 minutes idle, when the app is hidden, and on Quick exit.
//  The passphrase cannot be recovered. This is a careful record, not a certified forensic tool.
// ============================================================
(function(){
  "use strict";
  const F = window.CH_FMT;
  const $ = id => document.getElementById(id);
  const enc = new TextEncoder(), dec = new TextDecoder();
  const MAX_FILE = 15 * 1024 * 1024, IDLE_MS = 3 * 60 * 1000, HIDE_MS = 20 * 1000, PBKDF2_ITER = 250000;
  const PLATFORMS = ["Instagram","Facebook","WhatsApp","Snapchat","TikTok","X (Twitter)","YouTube","Telegram","SMS / phone call","Email","Other"];

  let db = null, key = null, items = [], filter = "all", urls = [], idleT = null, hiddenAt = 0;

  /* ---------- storage ---------- */
  function openDb(){
    return new Promise((res, rej) => {
      const r = indexedDB.open("ch_vault", 1);
      r.onupgradeneeded = () => { r.result.createObjectStore("meta", { keyPath: "k" }); r.result.createObjectStore("items", { keyPath: "id" }); };
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
  }
  const req = r => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const store = (n, m) => db.transaction(n, m || "readonly").objectStore(n);

  /* ---------- crypto ---------- */
  async function derive(pass, salt){
    const base = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: PBKDF2_ITER, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  }
  async function seal(bytes){ const iv = crypto.getRandomValues(new Uint8Array(12)); return { iv, ct: await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, bytes) }; }
  async function unseal(iv, ct){ return new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct)); }
  async function sha256hex(buf){ return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", buf))).map(b => b.toString(16).padStart(2, "0")).join(""); }
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const toast = (m, k) => window.CH_SUBMIT && window.CH_SUBMIT.toast(m, k);

  /* ---------- item persistence ---------- */
  async function saveItem(meta, dataBuf){
    const m = await seal(enc.encode(JSON.stringify(meta)));
    const d = dataBuf ? await seal(dataBuf) : null;
    const rec = { id: meta.id, miv: m.iv, meta: m.ct, div: d && d.iv, data: d && d.ct };
    await req(store("items", "readwrite").put(rec));
  }
  async function loadAll(){
    const recs = await req(store("items").getAll());
    const out = [];
    for(const r of recs){
      try{ const meta = JSON.parse(dec.decode(await unseal(r.miv, r.meta))); meta._hasData = !!r.data; out.push(meta); }catch(e){ /* corrupt record is skipped */ }
    }
    return out.sort((a, b) => b.addedAt - a.addedAt);
  }
  async function readData(id){
    const r = await req(store("items").get(id));
    return r && r.data ? unseal(r.div, r.data) : null;
  }

  /* ---------- lock / idle ---------- */
  function lock(msg){
    key = null; items = []; urls.forEach(u => URL.revokeObjectURL(u)); urls = [];
    clearTimeout(idleT); document.body.classList.remove("vt-printing");
    const rr = $("reportRoot"); if(rr) rr.innerHTML = "";
    render(); if(msg) toast(msg);
  }
  function bump(){ clearTimeout(idleT); if(key) idleT = setTimeout(() => lock("Vault locked after 3 minutes of inactivity."), IDLE_MS); }
  ["pointerdown","keydown","scroll"].forEach(ev => document.addEventListener(ev, bump, { passive: true }));
  document.addEventListener("visibilitychange", () => {
    if(document.hidden){ hiddenAt = Date.now(); }
    else if(key && hiddenAt && Date.now() - hiddenAt > HIDE_MS){ lock("Vault locked while the app was in the background."); }
  });
  document.addEventListener("ch:quick-exit", () => lock());

  /* ---------- rendering ---------- */
  const kindIcon = k => ({ file: "file", image: "image", note: "note", link: "link" }[k] || "file");
  function typeOf(m){ return m.kind === "file" && /^image\//.test(m.mime || "") ? "image" : m.kind; }
  function typeLabel(m){ return { image: "Screenshot / image", file: "File", note: "Note", link: "Link" }[typeOf(m)]; }

  async function render(){
    const root = $("vtRoot");
    if(!window.crypto || !crypto.subtle || !window.indexedDB){
      root.innerHTML = `<div class="callout danger"><span>${CH_ICON("alert",20)}</span><div><strong>This device can’t run the vault</strong>Secure storage isn’t available in this browser. Open the Cyber Hayat app instead.</div></div>`; return;
    }
    if(!db) db = await openDb();
    const cfg = await req(store("meta").get("cfg"));
    if(!cfg) return renderSetup(root);
    if(!key) return renderLocked(root, cfg);
    return renderOpen(root);
  }

  function renderSetup(root){
    root.innerHTML = `<div class="vt-card" style="max-width:34rem;margin-inline:auto">
      <div class="tk-ic" style="margin-bottom:.8rem">${CH_ICON("lock",22)}</div>
      <h2 style="font-size:1.35rem">Create your vault</h2>
      <p class="tk-muted" style="margin:.4rem 0 1rem">Choose a passphrase. Everything you add is encrypted with it, on this phone only.</p>
      <form id="setupForm" class="vt-form" autocomplete="off">
        <div class="field"><label for="p1">Passphrase</label><input id="p1" type="password" minlength="8" required autocomplete="new-password"><span class="hint">At least 8 characters. Three or four random words is strong and easy to remember.</span></div>
        <div class="field"><label for="p2">Repeat passphrase</label><input id="p2" type="password" required autocomplete="new-password"></div>
        <label class="field-check"><input type="checkbox" id="pshow"> Show passphrase</label>
        <div class="callout warn"><span>${CH_ICON("alert",20)}</span><div><strong>No recovery</strong>If you forget this passphrase, your evidence cannot be opened by anyone, including us. Write it somewhere safe that is not on this phone.</div></div>
        <button class="btn btn-primary btn-lg" type="submit" id="setupBtn">Create vault</button>
      </form></div>`;
    $("pshow").addEventListener("change", e => { $("p1").type = $("p2").type = e.target.checked ? "text" : "password"; });
    $("setupForm").addEventListener("submit", async e => {
      e.preventDefault();
      const a = $("p1").value, b = $("p2").value;
      if(a.length < 8) return toast("Use at least 8 characters.", "error");
      if(a !== b) return toast("The two passphrases don’t match.", "error");
      $("setupBtn").disabled = true; $("setupBtn").textContent = "Creating…";
      try{
        const salt = crypto.getRandomValues(new Uint8Array(16));
        key = await derive(a, salt);
        const c = await seal(enc.encode("ch-vault-ok"));
        await req(store("meta", "readwrite").put({ k: "cfg", salt, civ: c.iv, check: c.ct, created: Date.now(), v: 1, iter: PBKDF2_ITER }));
        if(navigator.storage && navigator.storage.persist) navigator.storage.persist();
        items = []; bump(); toast("Vault created and unlocked."); render();
      }catch(err){ key = null; toast("Couldn’t create the vault on this device.", "error"); render(); }
    });
  }

  function failState(){ try{ return JSON.parse(localStorage.getItem("ch_vault_fail") || "{}"); }catch(e){ return {}; } }
  function renderLocked(root, cfg){
    root.innerHTML = `<div class="vt-card" style="max-width:30rem;margin-inline:auto">
      <div class="tk-ic" style="margin-bottom:.8rem">${CH_ICON("lock",22)}</div>
      <h2 style="font-size:1.35rem">Vault locked</h2>
      <p class="tk-muted" style="margin:.4rem 0 1rem">Created ${F.date(cfg.created)}. Enter your passphrase to open it.</p>
      <form id="unlockForm" class="vt-form" autocomplete="off">
        <div class="field"><label for="up">Passphrase</label><input id="up" type="password" required autocomplete="current-password"></div>
        <label class="field-check"><input type="checkbox" id="ushow"> Show passphrase</label>
        <button class="btn btn-primary btn-lg" type="submit" id="unlockBtn">Unlock</button>
      </form>
      <p style="margin-top:1.2rem"><button type="button" class="tk-muted" id="wipeVault" style="text-decoration:underline">Forgot it? Delete the vault</button></p></div>`;
    $("ushow").addEventListener("change", e => { $("up").type = e.target.checked ? "text" : "password"; });
    $("wipeVault").addEventListener("click", wipe);
    $("unlockForm").addEventListener("submit", async e => {
      e.preventDefault();
      const fs = failState();
      if(fs.until && fs.until > Date.now()) return toast("Too many attempts. Try again in " + Math.ceil((fs.until - Date.now()) / 1000) + " seconds.", "error");
      $("unlockBtn").disabled = true; $("unlockBtn").textContent = "Unlocking…";
      try{
        const k = await derive($("up").value, cfg.salt);
        const ok = dec.decode(new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: cfg.civ }, k, cfg.check)));
        if(ok !== "ch-vault-ok") throw new Error("bad");
        key = k; localStorage.removeItem("ch_vault_fail");
        items = await loadAll(); bump(); render();
      }catch(err){
        key = null;
        const n = (fs.n || 0) + 1, wait = n >= 3 ? Math.min(300, 5 * Math.pow(2, n - 3)) : 0;
        localStorage.setItem("ch_vault_fail", JSON.stringify({ n, until: wait ? Date.now() + wait * 1000 : 0 }));
        toast(wait ? "Incorrect passphrase. Wait " + wait + " seconds." : "Incorrect passphrase.", "error");
        $("unlockBtn").disabled = false; $("unlockBtn").textContent = "Unlock";
      }
    });
  }

  function stats(){
    const files = items.filter(i => i.kind === "file"), bytes = files.reduce((a, b) => a + (b.size || 0), 0);
    const last = items.length ? items[0].addedAt : null;
    return `<div class="vt-stats">
      <div class="vt-stat"><b>${F.num(items.length)}</b><span>Items</span></div>
      <div class="vt-stat"><b>${F.num(files.length)}</b><span>Files</span></div>
      <div class="vt-stat"><b>${F.bytes(bytes)}</b><span>Stored</span></div></div>
      ${last ? `<p class="tk-muted" style="margin-bottom:.8rem">Last added ${F.esc(F.rel(last))} (<time datetime="${F.iso(last)}">${F.esc(F.dateTime(last))}</time>)</p>` : ""}`;
  }
  const FILTERS = [["all","All"],["image","Images"],["file","Files"],["note","Notes"],["link","Links"]];

  function renderOpen(root){
    const list = items.filter(i => filter === "all" || typeOf(i) === filter || (filter === "file" && i.kind === "file"));
    root.innerHTML = `<div class="vt-card">
      <div class="vt-bar">
        <h2 style="font-size:1.25rem">Your evidence</h2>
        <div class="tk-row"><button class="btn btn-outline btn-sm" id="exportBtn" ${items.length ? "" : "disabled"}>${CH_ICON("printer",14)} Report</button><button class="btn btn-outline btn-sm" id="lockBtn">${CH_ICON("lock",14)} Lock</button></div>
      </div>
      <div class="tk-row" style="margin:1rem 0">
        <button class="btn btn-primary btn-sm" id="addFiles">${CH_ICON("image",14)} Add files</button>
        <button class="btn btn-outline btn-sm" id="addNote">${CH_ICON("note",14)} Add note</button>
        <button class="btn btn-outline btn-sm" id="addLink">${CH_ICON("link",14)} Add link</button>
      </div>
      ${stats()}
      <div class="vt-filters" role="group" aria-label="Filter">${FILTERS.map(([k, t]) => `<button type="button" data-f="${k}" aria-pressed="${filter === k}">${t}</button>`).join("")}</div>
      <div class="vt-list" id="vtList">${list.length ? list.map(itemHtml).join("") : emptyHtml()}</div>
      <p class="tk-muted" style="margin-top:1.1rem">Auto-locks after 3 minutes of inactivity. Evidence stays on this phone.</p>
      <p style="margin-top:.5rem"><button type="button" class="tk-muted" id="wipeVault" style="text-decoration:underline">Delete the whole vault</button></p>
    </div>`;
    $("lockBtn").addEventListener("click", () => lock("Vault locked."));
    $("exportBtn").addEventListener("click", exportReport);
    $("addFiles").addEventListener("click", () => openDlg("dlgFiles"));
    $("addNote").addEventListener("click", () => openDlg("dlgNote"));
    $("addLink").addEventListener("click", () => openDlg("dlgLink"));
    $("wipeVault").addEventListener("click", wipe);
    root.querySelectorAll("[data-f]").forEach(b => b.addEventListener("click", () => { filter = b.dataset.f; renderOpen(root); }));
    root.querySelector("#vtList").addEventListener("click", onItemClick);
    hydrateThumbs();
  }
  const emptyHtml = () => `<div class="empty">${CH_ICON("lock",36)}<strong>${filter === "all" ? "Nothing saved yet" : "Nothing in this view"}</strong>Add screenshots, messages, links or your own notes. Each file gets a fingerprint when you add it.</div>`;

  function itemHtml(m){
    const t = typeOf(m);
    const meta = [typeLabel(m), m.size ? F.bytes(m.size) : "", m.platform || ""].filter(Boolean).map(x => `<span>${F.esc(x)}</span>`).join("");
    return `<article class="vt-item" data-id="${F.esc(m.id)}">
      <div class="vt-thumb" data-thumb="${t === "image" ? "1" : ""}">${CH_ICON(kindIcon(t), 24)}</div>
      <div class="vt-body">
        <h4 dir="auto">${F.esc(m.title || m.fileName || "Untitled")}</h4>
        <div class="vt-meta">${meta}</div>
        <div class="vt-meta"><span>Added <time datetime="${F.iso(m.addedAt)}">${F.esc(F.dateTime(m.addedAt))}</time></span>${m.lastModified ? `<span>File date ${F.esc(F.date(m.lastModified))}</span>` : ""}</div>
        ${m.url ? `<div class="vt-note tk-mono" dir="ltr">${F.esc(m.url)}</div>` : ""}
        ${m.note ? `<div class="vt-note" dir="auto">${F.esc(m.note)}</div>` : ""}
        ${m.sha256 ? `<div class="vt-hash tk-mono" dir="ltr"><b>SHA-256</b> ${F.esc(F.hash(m.sha256))}</div>` : ""}
        <div class="vt-act">
          ${t === "image" ? `<button class="act" data-a="view">View</button>` : ""}
          ${m.sha256 ? `<button class="act" data-a="hash">Copy fingerprint</button>` : ""}
          ${m.url ? `<button class="act" data-a="copyurl">Copy link</button>` : ""}
          <button class="act" data-a="del">Delete</button>
        </div>
      </div></article>`;
  }

  async function hydrateThumbs(){
    for(const el of document.querySelectorAll('.vt-thumb[data-thumb="1"]')){
      if(!key) return;
      const id = el.closest(".vt-item").dataset.id, m = items.find(i => i.id === id);
      if(!m || m.size > 6 * 1024 * 1024) continue;
      try{
        const bytes = await readData(id); if(!bytes || !key) continue;
        const u = URL.createObjectURL(new Blob([bytes], { type: m.mime || "image/png" })); urls.push(u);
        el.innerHTML = `<img alt="" src="${u}">`;
      }catch(e){}
    }
  }

  async function onItemClick(e){
    const b = e.target.closest("[data-a]"); if(!b) return;
    const id = b.closest(".vt-item").dataset.id, m = items.find(i => i.id === id); if(!m) return;
    const a = b.dataset.a;
    if(a === "hash") return copy(m.sha256, "Fingerprint copied.");
    if(a === "copyurl") return copy(m.url, "Link copied.");
    if(a === "del"){
      if(!confirm("Delete this item from the vault? This cannot be undone.")) return;
      await req(store("items", "readwrite").delete(id)); items = items.filter(i => i.id !== id); toast("Deleted."); return renderOpen($("vtRoot"));
    }
    if(a === "view"){
      const bytes = await readData(id); if(!bytes) return;
      const u = URL.createObjectURL(new Blob([bytes], { type: m.mime || "image/png" })); urls.push(u);
      $("viewImg").src = u; $("viewCap").textContent = m.title || m.fileName || ""; openDlg("dlgView");
    }
  }
  function copy(text, msg){
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => toast(msg), () => toast("Couldn’t copy.", "error"));
    else toast("Copy isn’t available on this device.", "error");
  }

  /* ---------- dialogs ---------- */
  function openDlg(id){ const d = $(id); if(d.showModal) d.showModal(); else d.setAttribute("open", ""); }
  function closeDlg(id){ const d = $(id); if(d.close) d.close(); else d.removeAttribute("open"); }

  async function addFiles(e){
    e.preventDefault();
    const files = Array.from($("fFiles").files || []);
    if(!files.length) return toast("Choose at least one file.", "error");
    const platform = $("fPlat").value, note = $("fNote").value.trim();
    $("fSave").disabled = true; $("fSave").textContent = "Encrypting…";
    let added = 0, skipped = 0;
    for(const f of files){
      if(f.size > MAX_FILE){ skipped++; continue; }
      try{
        const buf = await f.arrayBuffer();
        const meta = { id: uid(), kind: "file", title: f.name, fileName: f.name, mime: f.type || "application/octet-stream", size: f.size, lastModified: f.lastModified || 0, platform, note, addedAt: Date.now(), sha256: await sha256hex(buf) };
        await saveItem(meta, buf); items.unshift(meta); added++;
      }catch(err){ skipped++; }
    }
    $("fSave").disabled = false; $("fSave").textContent = "Encrypt and save";
    closeDlg("dlgFiles"); $("formFiles").reset(); bump();
    toast(added ? F.plural(added, "file") + " saved" + (skipped ? ", " + skipped + " skipped (over 15 MB or unreadable)" : ".") : "Nothing was saved. Files must be under 15 MB.", added ? "" : "error");
    renderOpen($("vtRoot"));
  }
  async function addNote(e){
    e.preventDefault();
    const title = $("nTitle").value.trim() || "Note", note = $("nText").value.trim();
    if(!note) return toast("Write something first.", "error");
    const meta = { id: uid(), kind: "note", title, note, addedAt: Date.now() };
    try{ await saveItem(meta, null); items.unshift(meta); closeDlg("dlgNote"); $("formNote").reset(); bump(); toast("Note saved."); renderOpen($("vtRoot")); }
    catch(err){ toast("Couldn’t save on this device.", "error"); }
  }
  async function addLink(e){
    e.preventDefault();
    const url = $("lUrl").value.trim();
    if(!/^https?:\/\/\S+$/i.test(url)) return toast("Enter a full link starting with http:// or https://", "error");
    const meta = { id: uid(), kind: "link", title: $("lTitle").value.trim() || url.replace(/^https?:\/\//i, "").slice(0, 60), url, platform: $("lPlat").value, note: $("lNote").value.trim(), addedAt: Date.now() };
    try{ await saveItem(meta, null); items.unshift(meta); closeDlg("dlgLink"); $("formLink").reset(); bump(); toast("Link saved."); renderOpen($("vtRoot")); }
    catch(err){ toast("Couldn’t save on this device.", "error"); }
  }

  async function wipe(){
    if(!confirm("Delete the entire vault and everything in it from this phone?\n\nThis cannot be undone.")) return;
    key = null; items = []; if(db){ db.close(); db = null; }
    await new Promise(res => { const r = indexedDB.deleteDatabase("ch_vault"); r.onsuccess = r.onerror = r.onblocked = () => res(); });
    localStorage.removeItem("ch_vault_fail"); toast("Vault deleted."); render();
  }

  /* ---------- printable evidence summary ---------- */
  async function exportReport(){
    if(!items.length) return;
    const root = $("reportRoot"), now = Date.now();
    const sorted = items.slice().sort((a, b) => a.addedAt - b.addedAt);
    const fp = await sha256hex(enc.encode(sorted.map(m => [m.id, m.sha256 || "", m.addedAt].join("|")).join("\n")));
    const rows = sorted.map((m, i) => `<tr><td>${i + 1}</td><td>${F.esc(typeLabel(m))}</td><td>${F.esc(m.title || "")}${m.url ? `<br><span class="h">${F.esc(m.url)}</span>` : ""}${m.note ? `<br><em>${F.esc(m.note)}</em>` : ""}${m.platform ? `<br>Source: ${F.esc(m.platform)}` : ""}</td>
      <td>${F.esc(F.iso(m.addedAt))}</td><td>${m.lastModified ? F.esc(F.iso(m.lastModified)) : "—"}</td><td>${m.size ? F.esc(F.bytes(m.size)) : "—"}</td>
      <td class="h">${m.sha256 ? F.esc(m.sha256.slice(0, 32)) + "<br>" + F.esc(m.sha256.slice(32)) : "—"}</td></tr>`).join("");
    const imgs = [];
    for(const m of sorted.filter(x => typeOf(x) === "image" && x.size <= 6 * 1024 * 1024).slice(0, 24)){
      try{ const b = await readData(m.id); if(!b) continue; const u = URL.createObjectURL(new Blob([b], { type: m.mime })); urls.push(u); imgs.push(`<figure><img src="${u}" alt=""><figcaption>${F.esc(m.title || "")}</figcaption></figure>`); }catch(e){}
    }
    root.innerHTML = `<div class="rpt">
      <div class="no-print rpt-bar"><button class="btn btn-primary btn-sm" id="rptPrint">${CH_ICON("printer",14)} Print or save as PDF</button><button class="btn btn-outline btn-sm" id="rptClose">Close</button></div>
      <h1>Evidence summary</h1>
      <div class="sub">Prepared with Cyber Hayat PK on ${F.esc(F.dateTime(now))} (<span class="h">${F.esc(F.iso(now))}</span>). ${F.plural(sorted.length, "item")}.</div>
      <h2>Items</h2>
      <table><thead><tr><th>No.</th><th>Type</th><th>Title and details</th><th>Added (UTC)</th><th>File date (UTC)</th><th>Size</th><th>SHA-256 fingerprint</th></tr></thead><tbody>${rows}</tbody></table>
      ${imgs.length ? `<h2>Image previews</h2><div class="thumbs">${imgs.join("")}</div>` : ""}
      <h2>Summary fingerprint</h2><div class="h">${F.esc(fp)}</div>
      <p class="note"><strong>About this document.</strong> Each fingerprint was calculated on the device when the file was added. If a file is later changed, even by one pixel, its fingerprint will no longer match. Dates are recorded by the phone’s clock. This summary is a careful personal record to support a complaint; it is not a certified forensic report. Keep the original files, and give copies to the investigating officer on request.</p>
      <div class="sig"><div>Name</div><div>Signature</div><div>Date</div></div></div>`;
    document.body.classList.add("vt-printing"); window.scrollTo(0, 0);
    $("rptClose").addEventListener("click", () => { document.body.classList.remove("vt-printing"); });
    $("rptPrint").addEventListener("click", () => { if(window.CHNative && CHNative.printPage) CHNative.printPage(); else window.print(); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("formFiles").addEventListener("submit", addFiles);
    $("formNote").addEventListener("submit", addNote);
    $("formLink").addEventListener("submit", addLink);
    document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => closeDlg(b.dataset.close)));
    const opt = '<option value="">Not sure / other</option>' + PLATFORMS.map(p => `<option>${p}</option>`).join("");
    $("fPlat").innerHTML = opt; $("lPlat").innerHTML = opt;
    render();
  });
})();
