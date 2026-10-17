# Changelog — security, privacy, build and UI pass

## P0 security / privacy
* `backend/Code.gs` (rewritten, v3): secret from Script properties (constant-time compare); global per-minute limit; per-email and
  per-session limits; daily caps for LLM calls, emails, team alerts; payload size limit; strict per-type validation with whitelisted
  fields; confirmation emails **opt-in**, per-recipient/day cap, none on chat start; duplicate check + cache write **inside the lock**
  (plus Client ID column); generic client errors, details via `console.error`; Roman-Urdu/English/Urdu urgent phrases; `TEAM_NOTIFY_EMAIL`
  from properties with a warning in `setup()`; `deletion_request` type and `deleteRecordsFor()` helper.
* `backend/SETUP.md`: properties table, TEAM_NOTIFY_EMAIL, secret rotation, deletion process.
* `assets/js/config.js` removed → `config.example.js`; `app/build.gradle.kts` generates `config.js` from secrets; `.gitignore`.
* `assets/js/submit.js` (rewritten): secret added only at POST; no secret/attempt data on the wire; storage-write failure returns an error;
  queue cap 50, 14-day expiry, 6 attempts, no head-of-line blocking; optional "send to team?" instead of a forced email/consent gate.
* `assets/js/chatbot.js`: anonymous use; no `chatbot_started`; transcripts only if opted in; ids escaped; localStorage validated; language fallback notice.
* `assets/js/settings.js`: Privacy & sharing toggles, optional email, device protection (FLAG_SECURE / app lock), honest delete wording, deletion request.
* `privacy.html`, `terms.html`: rewritten to match behaviour (Google Sheets, OpenRouter/Llama, opt-in email, local storage risk, deletion).
* `ui/CyberHayatApp.kt`: scheme allow-list (http/https/tel/mailto), exact backend hosts, `onReceivedError`/HTTP error → `offline.html`,
  render-process recovery, JS bridge `CHNative`; `AndroidManifest.xml`: network security config, no backup, predictive back;
  all pages: CSP + no-referrer; `MainActivity.kt`, `NativeBridge.kt`, `NativePrefs.kt`: FLAG_SECURE and biometric/device-credential app lock.

## P1 build / release
* `.github/workflows/main.yml`: persistent keystore from secrets, secret checks, version from run number, keystore removed after build.
* `app/build.gradle.kts`: no debug-key fallback (release fails without a keystore); AGP 8.11.1, Kotlin 2.1.20 + Compose plugin, compileSdk/targetSdk 36
  (verified Play requirement), BOM 2025.06.01; adaptive + monochrome icon, separate legacy round icon; wrapper properties (jar: see README).

## P2 content / bugs
* `i18n.js`: removed Gemini / dark-mode / old chat strings in every language. `cyberhayat-editorial.html`: no Google Fonts, script externalised.
* `resources.js` + `resources.html`: password tester note + weak-pattern check; "track by reference" wording is honest (device-only lookup).

## UI
* New `motion.js` + CSS: animated hero (aurora, grid, floating emblem, split-word headline), scroll reveal with stagger, scroll progress,
  ripples, pulsing call buttons, animated chat bubbles, iOS-style switches. All disabled under `prefers-reduced-motion`.

## Assumptions
* CSP keeps `style-src 'unsafe-inline'` because pages use inline `style=""` attributes; scripts are `'self'` only.
* App lock never engages if the phone has no screen lock (prevents lock-out).

## Manual test plan
1. **Offline submit → reconnect:** airplane mode, Settings → send to team ON, submit a story; turn network on → row appears in the Sheet; Settings shows "nothing waiting".
2. **Anonymous chat:** fresh install, open Assistant, send a message with no email → no dialog; Sheet shows no chat row. Turn on "Back up my chat transcripts" → rows appear (no email).
3. **Storage full:** fill localStorage in DevTools (or low-storage device), submit a report → error toast, no false "saved".
4. **Blocked external URL:** a page link to `intent://…`/`file://` does nothing; `tel:`/`mailto:` open system apps; other https hosts return blocked.
5. **Install over previous version:** build twice with the same keystore, install v1 then v2 without uninstalling.
6. **Rotate the secret:** change `SHARED_SECRET` in Script properties + `CH_SHARED_SECRET` GitHub secret, rebuild; old APK is rejected, new one syncs.
7. **FLAG_SECURE / lock:** open Assistant → screenshot blocked, recents blank; enable App lock → reopen app → prompt.
8. **Rate limits:** send >20 chat requests quickly → server answers `rate_limited`, app falls back to offline guidance.


# v3.1: Toolkit release
**New pages:** Toolkit hub, Guided plan (triage), Evidence vault, Platform guides, Safety plan, Calm, Learn and share, Scam checker, Parents and teachers, Ambassador kit, Quick-exit decoy, offline error page.
**Safety:** Quick exit (header button, Esc twice, native task close, vault lock); icon disguise (Notes/Calculator via launcher aliases); FLAG_SECURE also on vault, safety plan, guided plan and checker.
**Vault:** AES-256-GCM, PBKDF2 250k, SHA-256 per file, auto-lock, throttled unlock, printable summary through Android print (Save as PDF).
**Team (Code.gs):** `directory` and `event_signup` actions, Assignee/Internal Notes columns, status dropdown, urgent row highlighting, Case Dashboard, Impact (anonymous), Reply Templates, "Cyber Hayat" menu.
**Presentation:** `fmt.js` (dates, sizes, numbers, phones, hashes), responsive data tables, badges, callouts, Urdu typography blocks, typographic apostrophes, consistent titles.
**Android:** file picker for the vault, print/share bridge, `sms:` links, disguise aliases.
**Verified here:** 28 automated browser checks (all pages, 3 widths, CSP, vault crypto, QR decode with an independent reader, offline queue). Kotlin/Gradle not compiled in this environment.
