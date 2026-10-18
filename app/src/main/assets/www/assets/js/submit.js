// ============================================================
// CYBER HAYAT — submission layer (privacy-first, offline-first)
//  • No forced email or consent: everything works anonymously.
//  • Syncing reports/forms to the support team is a choice the person
//    makes once (changeable in Settings). Chat transcripts are NEVER
//    uploaded unless they switch that on in Settings.
//  • The shared secret is added only at POST time — never stored in
//    the offline queue. Queue items expire, have attempt limits and a
//    size cap so one bad item can't block the rest.
// ============================================================
(function(){
  "use strict";

  const K = {
    sync:   "ch_sync_choice",    // "yes" | "no"  (absent = not asked yet)
    email:  "ch_user_email",     // optional
    optin:  "ch_email_optin",    // "1" if they want confirmation emails
    share:  "ch_share_chats",    // "1" only if they opted in to upload transcripts
    queue:  "ch_queue"
  };
  const QUEUE_MAX = 50, MAX_ATTEMPTS = 6, MAX_AGE_MS = 14 * 24 * 3600 * 1000;
  const RE_EMAIL = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[A-Za-z]{2,24}$/;

  const get = k => { try{ return localStorage.getItem(k); }catch(e){ return null; } };
  function set(k, v){ try{ localStorage.setItem(k, v); return true; }catch(e){ return false; } }

  const getEmail   = () => get(K.email) || "";
  const syncChoice = () => get(K.sync);
  const shareChats = () => get(K.share) === "1";
  const isValidEmail = e => RE_EMAIL.test(e);

  /* ---------- toast ---------- */
  let toastTimer = null;
  function toast(message, kind){
    let el = document.getElementById("chToast");
    if(!el){ el = document.createElement("div"); el.id = "chToast"; el.className = "ch-toast"; el.setAttribute("role","status"); document.body.appendChild(el); }
    el.textContent = message;
    el.className = "ch-toast open" + (kind ? " " + kind : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("open"), 3800);
  }

  /* ---------- optional sync dialog (never blocks anything) ---------- */
  function injectDialog(){
    if(document.getElementById("syncModal")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
<div class="consent-backdrop" id="syncBackdrop"></div>
<div class="consent-modal" id="syncModal" role="dialog" aria-modal="true" aria-labelledby="syncTitle">
  <img src="assets/img/logo.png" alt="" class="consent-mark" />
  <h2 id="syncTitle">Send this to the support team?</h2>
  <p>You can keep everything <strong>only on this device</strong>, or also send it to the Cyber Hayat support team so
  they can follow up. Your choice applies to forms and reports (not to chats) and you can change it any time in Settings.</p>
  <div class="field">
    <label for="syncEmail">Email <span style="font-weight:400">(optional)</span></label>
    <input type="email" id="syncEmail" placeholder="you@example.com" autocomplete="email" inputmode="email">
  </div>
  <label class="field-check">
    <input type="checkbox" id="syncOptin">
    Email me a confirmation (only if I entered an email).
  </label>
  <p style="font-size:.78rem;opacity:.75;margin-top:.5rem">Sent data is stored in the team's Google Sheet. See the <a href="privacy.html">Privacy Policy</a>.</p>
  <div class="consent-actions">
    <button type="button" id="syncLocal" class="btn btn-outline btn-sm">Keep on this device</button>
    <button type="button" id="syncYes" class="btn btn-primary btn-sm">Send to team</button>
  </div>
</div>`;
    document.body.appendChild(wrap);
  }

  let pendingDone = null;
  function closeDialog(){
    ["syncBackdrop","syncModal"].forEach(id => { const e = document.getElementById(id); if(e) e.classList.remove("open"); });
  }
  function finish(){ const cb = pendingDone; pendingDone = null; if(cb) cb(); }

  document.addEventListener("click", e => {
    const id = e.target && e.target.id;
    if(id === "syncBackdrop" || id === "syncLocal"){
      if(!syncChoice()) set(K.sync, "no");     // remember: local only
      closeDialog(); finish();
    }
    if(id === "syncYes"){
      const em = (document.getElementById("syncEmail").value || "").trim();
      if(em && !isValidEmail(em)){ document.getElementById("syncEmail").classList.add("is-error"); return; }
      set(K.sync, "yes");
      if(em) set(K.email, em); else { try{ localStorage.removeItem(K.email); }catch(x){} }
      set(K.optin, (em && document.getElementById("syncOptin").checked) ? "1" : "0");
      closeDialog(); toast("Preference saved."); finish();
    }
  });

  /**
   * Called at the moment a form is submitted. Always proceeds: if a choice has been
   * made it just continues; otherwise it asks once, and dismissing means "keep local".
   */
  function askSync(refocusEl, onDone){
    if(syncChoice()){ onDone(); return; }
    injectDialog();
    pendingDone = onDone;
    document.getElementById("syncBackdrop").classList.add("open");
    document.getElementById("syncModal").classList.add("open");
    setTimeout(() => { const i = document.getElementById("syncEmail"); i && i.focus(); }, 60);
  }

  /* ---------- offline queue ---------- */
  function readQ(){
    try{
      const q = JSON.parse(localStorage.getItem(K.queue) || "[]");
      return Array.isArray(q) ? q.filter(x => x && typeof x === "object" && typeof x.qid === "string") : [];
    }catch(e){ return []; }
  }
  function writeQ(q){
    try{ localStorage.setItem(K.queue, JSON.stringify(q)); }
    catch(e){ return false; }
    document.dispatchEvent(new CustomEvent("ch:queue-changed"));
    return true;
  }
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

  async function post(body, timeoutMs){
    const cfg = window.CH_CONFIG || {};
    if(!cfg.APPS_SCRIPT_URL || !cfg.SHARED_SECRET) throw new Error("not-configured");
    const ctl = ("AbortController" in window) ? new AbortController() : null;
    const t = ctl ? setTimeout(() => ctl.abort(), timeoutMs || 20000) : null;
    try{
      const res = await fetch(cfg.APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },          // simple request: no CORS preflight
        body: JSON.stringify(Object.assign({}, body, { secret: cfg.SHARED_SECRET })), // secret added ONLY here
        credentials: "omit", referrerPolicy: "no-referrer", cache: "no-store",
        signal: ctl ? ctl.signal : undefined
      });
      return await res.json();
    } finally { if(t) clearTimeout(t); }
  }

  let flushing = false;
  async function flush(manual){
    if(flushing || !navigator.onLine) return;
    const cfg = window.CH_CONFIG || {};
    if(!cfg.APPS_SCRIPT_URL || !cfg.SHARED_SECRET) return;
    flushing = true;
    try{
      const now = Date.now();
      let q = readQ();
      const keep = [];
      let consecutiveNetFails = 0, rateLimited = false;
      for(const item of q){
        const expired = now - (item.createdAt || now) > MAX_AGE_MS;
        if(expired || (item.attempts || 0) >= MAX_ATTEMPTS) continue;       // drop
        if(rateLimited || consecutiveNetFails >= 2){ keep.push(item); continue; } // pause, try later
        let r = null;
        try{
          const { attempts, createdAt, ...wire } = item;
          r = await post(wire, 20000);
          consecutiveNetFails = 0;
        }catch(e){
          consecutiveNetFails++;
          item.attempts = (item.attempts || 0) + 1;                          // poison items age out
          keep.push(item); continue;
        }
        if(r && (r.ok || r.error === "duplicate")) continue;                 // delivered
        if(r && (r.error === "bad_request" || r.error === "too_large")) continue; // permanent: drop
        if(r && r.error === "rate_limited"){ rateLimited = true; keep.push(item); continue; }
        item.attempts = (item.attempts || 0) + 1; keep.push(item);           // unauthorized / server_error
      }
      writeQ(keep);
      if(manual) toast(keep.length ? "Some items are still waiting to sync." : "All data synced.");
    } finally { flushing = false; }
  }

  /**
   * send(type, payload): saves to the offline queue, then tries to deliver.
   * Returns { ok, localOnly?, queued?, synced?, error? }
   */
  async function send(type, payload){
    const isChat = type === "chatbot_conversation";
    const isDeletion = type === "deletion_request";
    if(isChat && !shareChats()) return { ok: true, localOnly: true };
    if(!isChat && !isDeletion && syncChoice() !== "yes") return { ok: true, localOnly: true };

    const email = isChat ? "" : getEmail();
    const body = Object.assign({
      type, qid: uid(),
      page: (location.pathname.split("/").pop() || "index.html").slice(0, 60),
      createdAt: Date.now(), attempts: 0
    }, payload);
    if(email){ body.email = email; body.emailOptIn = get(K.optin) === "1"; }
    if(isChat) body.consent = true;

    const q = readQ();
    if(q.length >= QUEUE_MAX){
      if(isChat) return { ok: true, localOnly: true };                       // chats are best-effort
      return { ok: false, error: "queue_full" };
    }
    q.push(body);
    if(!writeQ(q)) return { ok: false, error: "storage" };                   // never claim success if the write failed

    if(navigator.onLine) await flush(false);
    const pending = readQ().some(x => x.qid === body.qid);
    return pending ? { ok: true, queued: true } : { ok: true, synced: true };
  }

  /** Live AI answer (Llama via the backend). Never queued, never stores the secret. */
  async function chat(messages, lang, sessionId){
    if(!navigator.onLine) throw new Error("offline");
    const data = await post({ action: "chat", sessionId, lang, messages }, 30000);
    if(!data || !data.ok || !data.reply) throw new Error((data && data.error) || "no-reply");
    return data;
  }

  /** Live helpline directory from the team's Sheet (cached; the app always has a built-in list). */
  async function directory(){
    if(!navigator.onLine) throw new Error("offline");
    const data = await post({ action: "directory" }, 15000);
    if(!data || !data.ok || !Array.isArray(data.items)) throw new Error((data && data.error) || "no-directory");
    return data.items;
  }

  function wipeLocalData(){
    try{
      Object.keys(localStorage).filter(k => k.indexOf("ch_") === 0).forEach(k => localStorage.removeItem(k));
    }catch(e){}
    document.dispatchEvent(new CustomEvent("ch:queue-changed"));
    document.dispatchEvent(new CustomEvent("ch:chats-cleared"));
  }

  window.addEventListener("online", () => flush(false));
  document.addEventListener("DOMContentLoaded", () => setTimeout(() => flush(false), 1500));

  window.CH_SUBMIT = { askSync, send, chat, directory, flush, toast, getEmail, syncChoice, shareChats, isValidEmail,
                       queueLength: () => readQ().length, wipeLocalData, keys: K };
})();
