// ============================================================
// CYBER HAYAT — Settings drawer (shared across pages)
// Language · privacy & sharing · offline sync · device protection
// · deletion requests. Light theme only; no API keys in the app.
// ============================================================
(function(){
  "use strict";
  const LANG_KEY = "ch_lang";

  window.CH_LANGUAGES = [
    { code: "en", label: "English" }, { code: "ur", label: "اردو (Urdu)" }, { code: "sd", label: "سنڌي (Sindhi)" },
    { code: "pa", label: "پنجابی (Punjabi)" }, { code: "ps", label: "پښتو (Pashto)" }, { code: "bal", label: "بلوچی (Balochi)" },
    { code: "skr", label: "سرائیکی (Saraiki)" }, { code: "hns", label: "ہندکو (Hindko)" }, { code: "brh", label: "براہوئی (Brahui)" }
  ];

  try{ localStorage.removeItem("ch_theme"); }catch(e){}
  document.documentElement.removeAttribute("data-theme");

  const $ = id => document.getElementById(id);
  const S = () => window.CH_SUBMIT;
  const native = () => (window.CHNative && typeof window.CHNative.getSecureScreens === "function") ? window.CHNative : null;

  document.addEventListener("DOMContentLoaded", init);

  function init(){
    injectDrawer();
    const backdrop = $("settingsBackdrop"), drawer = $("settingsDrawer");
    const open = () => { refresh(); backdrop.classList.add("open"); drawer.classList.add("open"); };
    const close = () => { backdrop.classList.remove("open"); drawer.classList.remove("open"); };
    document.querySelectorAll("[data-settings-toggle]").forEach(b => b.addEventListener("click", open));
    $("settingsClose").addEventListener("click", close);
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", e => { if(e.key === "Escape") close(); });

    const langSelect = $("langSelect");
    langSelect.innerHTML = window.CH_LANGUAGES.map(l => `<option value="${l.code}">${l.label}</option>`).join("");
    langSelect.value = localStorage.getItem(LANG_KEY) || "en";
    langSelect.addEventListener("change", () => {
      localStorage.setItem(LANG_KEY, langSelect.value);
      document.dispatchEvent(new CustomEvent("ch:lang-changed"));
    });

    // --- privacy & sharing ---
    $("setSync").addEventListener("change", e => { localStorage.setItem(S().keys.sync, e.target.checked ? "yes" : "no"); refresh(); });
    $("setShareChats").addEventListener("change", e => {
      if(e.target.checked && !confirm("Chat transcripts will be uploaded to the support team’s Google Sheet when you are online. Turn this on?")){ e.target.checked = false; return; }
      localStorage.setItem(S().keys.share, e.target.checked ? "1" : "0");
    });
    $("setEmailSave").addEventListener("click", () => {
      const v = $("setEmail").value.trim();
      if(v && !S().isValidEmail(v)){ S().toast("That email doesn’t look right.", "error"); return; }
      if(v) localStorage.setItem(S().keys.email, v); else localStorage.removeItem(S().keys.email);
      localStorage.setItem(S().keys.optin, (v && $("setEmailOptin").checked) ? "1" : "0");
      S().toast(v ? "Contact email saved on this device." : "Email removed from this device.");
    });

    // --- device protection (Android app only) ---
    const n = native();
    $("settingsDeviceDiv").hidden = !n;
    if(n){
      $("settingsDevice").hidden = false;
      $("setSecure").checked = !!n.getSecureScreens();
      $("setSecure").addEventListener("change", e => n.setSecureScreens(e.target.checked));
      const canLock = !!(n.canAppLock && n.canAppLock());
      $("setLock").disabled = !canLock;
      $("setLock").checked = canLock && !!n.getAppLock();
      $("setLockHint").textContent = canLock ? "Ask for your fingerprint, face or phone PIN when the app is opened." : "Set up a screen lock on your phone to use this.";
      $("setLock").addEventListener("change", e => n.setAppLock(e.target.checked));
      $("setDisguise").value = (n.getDisguise && n.getDisguise()) || "default";
      $("setDisguise").addEventListener("change", e => { n.setDisguise(e.target.value); S().toast("Icon updated. It may take a moment to change."); });
    }

    // --- sync / local data ---
    $("settingsSyncNow").addEventListener("click", async () => { await S().flush(true); refresh(); });
    $("settingsClearChats").addEventListener("click", () => {
      if(confirm("Delete chat history stored ON THIS DEVICE?\n\nThis does not delete anything that was already sent to the support team. Use \"Request deletion\" for that.")){
        localStorage.removeItem("ch_chats"); localStorage.removeItem("ch_chat_current");
        S().toast("Chat history deleted from this device.");
        document.dispatchEvent(new CustomEvent("ch:chats-cleared"));
      }
    });
    $("settingsWipe").addEventListener("click", () => {
      if(confirm("Delete ALL Cyber Hayat data on this device (chats, saved reports, preferences, unsent items)?\n\nThis cannot be undone and does not delete records already sent to the support team.")){
        S().wipeLocalData(); S().toast("All local data deleted."); refresh();
      }
    });
    $("delSend").addEventListener("click", async () => {
      const v = $("delIdent").value.trim();
      const isMail = v.indexOf("@") !== -1;
      if(!v || (isMail && !S().isValidEmail(v)) || (!isMail && !/^[A-Za-z0-9-]{4,40}$/.test(v))){ S().toast("Enter your case reference or the email you used.", "error"); return; }
      const res = await S().send("deletion_request", isMail ? { email: v, note: "Requested from app" } : { caseId: v, note: "Requested from app" });
      if(res.ok){ S().toast(res.queued ? "Saved. The request will be sent when you’re online." : "Deletion request sent. The team will confirm."); $("delIdent").value = ""; }
      else S().toast("Couldn’t save the request on this device.", "error");
    });

    document.addEventListener("ch:queue-changed", refresh);
    window.addEventListener("online", refresh); window.addEventListener("offline", refresh);
  }

  function refresh(){
    if(!$("setSync") || !window.CH_SUBMIT) return;
    $("setSync").checked = S().syncChoice() === "yes";
    $("setShareChats").checked = S().shareChats();
    if(document.activeElement !== $("setEmail")) $("setEmail").value = S().getEmail();
    $("setEmailOptin").checked = localStorage.getItem(S().keys.optin) === "1";
    const n = S().queueLength();
    const cfg = window.CH_CONFIG || {};
    const el = $("settingsSyncStatus");
    const net = navigator.onLine ? "Online" : "Offline";
    const link = (cfg.APPS_SCRIPT_URL && cfg.SHARED_SECRET) ? "" : " · team sync not configured";
    el.textContent = net + " · " + (n ? n + " item" + (n > 1 ? "s" : "") + " waiting to send" : "nothing waiting") + link;
    el.classList.toggle("is-live", navigator.onLine && !n);
  }

  function injectDrawer(){
    if($("settingsDrawer")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
<div class="settings-backdrop" id="settingsBackdrop"></div>
<aside class="settings-drawer" id="settingsDrawer" aria-label="Settings">
  <div class="settings-head">
    <h2 data-i18n="settings.title">Settings</h2>
    <button class="settings-close" id="settingsClose" aria-label="Close settings">
      <svg class="svg-icon stroke" viewBox="0 0 24 24" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="settings-body">

    <div class="settings-section">
      <div class="settings-section-title" data-i18n="settings.language">Language</div>
      <div class="field">
        <label for="langSelect" data-i18n="settings.languageLabel">Assistant &amp; interface language</label>
        <select id="langSelect"></select>
        <span class="hint" data-i18n="settings.languageHint">Changes the site interface and the language the Chatbot replies in.</span>
      </div>
    </div>

    <div class="settings-divider"></div>
    <div class="settings-section">
      <div class="settings-section-title">Privacy &amp; sharing</div>
      <label class="settings-switch"><span><strong>Send reports &amp; forms to the support team</strong><small>Off = everything stays only on this device.</small></span><input type="checkbox" id="setSync"><i></i></label>
      <label class="settings-switch"><span><strong>Back up my chat transcripts</strong><small>Off by default. When on, chats are uploaded to the team's Google Sheet. Nothing is uploaded otherwise.</small></span><input type="checkbox" id="setShareChats"><i></i></label>
      <div class="field" style="margin-top:.85rem">
        <label for="setEmail">Contact email <span style="font-weight:400">(optional)</span></label>
        <input type="email" id="setEmail" placeholder="you@example.com" autocomplete="email" inputmode="email">
      </div>
      <label class="field-check"><input type="checkbox" id="setEmailOptin"> Email me confirmations for reports I send</label>
      <div class="key-row"><button type="button" id="setEmailSave" class="btn btn-outline btn-sm">Save email choice</button></div>
    </div>

    <div class="settings-divider" id="settingsDeviceDiv"></div>
    <div class="settings-section" id="settingsDevice" hidden>
      <div class="settings-section-title">Protect this device</div>
      <label class="settings-switch"><span><strong>Hide screen in recent apps &amp; block screenshots</strong><small>On by default for the Assistant and Resources pages.</small></span><input type="checkbox" id="setSecure"><i></i></label>
      <label class="settings-switch"><span><strong>App lock</strong><small id="setLockHint"></small></span><input type="checkbox" id="setLock"><i></i></label>
      <div class="field" style="margin-top:.85rem"><label for="setDisguise">Disguise the app icon</label>
        <select id="setDisguise"><option value="default">Cyber Hayat (normal)</option><option value="notes">Notes</option><option value="calc">Calculator</option></select>
        <span class="hint">Changes the name and icon on your home screen. Some launchers take a few seconds to update, or may close the app once.</span></div>
      <div class="key-row"><button type="button" class="btn btn-outline btn-sm" data-quick-exit>Try Quick exit now</button></div>
      <p class="settings-note" style="margin-top:.6rem">The red <b>Exit</b> button at the top of every screen closes the app instantly. On the Notes screen shown in a browser, hold the title for 3 seconds to return.</p>
    </div>

    <div class="settings-divider"></div>
    <div class="settings-section">
      <div class="settings-section-title">Offline &amp; sync</div>
      <div class="settings-row"><span class="settings-row-sub" id="settingsSyncStatus">—</span></div>
      <div class="key-row"><button type="button" id="settingsSyncNow" class="btn btn-primary btn-sm">Sync now</button></div>
    </div>

    <div class="settings-divider"></div>
    <div class="settings-section">
      <div class="settings-section-title">Your data</div>
      <p class="settings-note" style="margin-bottom:.75rem">These buttons delete data <strong>on this device only</strong>.</p>
      <div class="key-row">
        <button type="button" id="settingsClearChats" class="btn btn-outline btn-sm">Delete chat history</button>
        <button type="button" id="settingsWipe" class="btn btn-outline btn-sm">Delete all local data</button>
      </div>
      <div class="field" style="margin-top:1.1rem">
        <label for="delIdent">Request deletion of records the team holds</label>
        <input type="text" id="delIdent" placeholder="Case reference or email you used" autocomplete="off">
        <span class="hint">The team removes matching records from their Google Sheet and may confirm by email if you gave one.</span>
      </div>
      <div class="key-row"><button type="button" id="delSend" class="btn btn-outline btn-sm">Send deletion request</button></div>
    </div>

    <div class="settings-divider"></div>
    <p class="settings-note">Everything works offline. Chats and saved reports are stored on this device in plain, unencrypted browser storage, so anyone who can unlock your phone could read them. Use a screen lock, and the app lock if available.</p>
  </div>
</aside>`;
    document.body.appendChild(wrap);
  }
})();
