# Cyber Hayat — Android app

Kotlin + Jetpack Compose shell hosting the Cyber Hayat web app from `app/src/main/assets/www/`.
**Offline-first**, light theme only, edge-to-edge, anonymous by default.

## Build secrets (nothing sensitive lives in the repo)
`assets/js/config.js` is **generated at build time** and git-ignored. Use `config.example.js` as the template.

GitHub → repo **Settings → Secrets and variables → Actions**, add:

| Secret | What |
|---|---|
| `CH_APPS_SCRIPT_URL` | Apps Script web-app `/exec` URL (see `backend/SETUP.md`) |
| `CH_SHARED_SECRET` | same value as the `SHARED_SECRET` Script property |
| `CH_KEYSTORE_BASE64` | your permanent release keystore, base64 encoded |
| `CH_KEYSTORE_PASSWORD`, `CH_KEY_ALIAS`, `CH_KEY_PASSWORD` | keystore credentials |

> Anything shipped inside an APK can be extracted. The secret is only a speed bump; real protection is
> the server-side rate limits, caps and validation in `backend/Code.gs`.
> **If an earlier secret was ever committed, treat it as burned and rotate it** (SETUP.md §3).

### Create the permanent keystore (once; back it up safely, losing it means users can't update)
```
keytool -genkeypair -v -keystore ch-release.keystore -alias cyberhayat -keyalg RSA -keysize 4096 -validity 10000
```
Encode it: Linux/macOS `base64 -w0 ch-release.keystore` · Windows PowerShell
`[Convert]::ToBase64String([IO.File]::ReadAllBytes("ch-release.keystore"))` → paste into `CH_KEYSTORE_BASE64`.

## Build
* **CI:** push → Actions → *Build APK*. Version code/name come from the run number. Release builds **fail** if signing is not configured.
* **Local:** `./gradlew :app:assembleRelease -PchKeystore=... ` with the `CH_*` env vars, or `assembleDebug` for a debug build.
* **Gradle wrapper:** the wrapper *properties* are committed; the binary `gradle-wrapper.jar` could not be generated offline.
  Run `gradle wrapper --gradle-version 8.13` once and commit `gradlew`, `gradlew.bat`, `gradle/wrapper/gradle-wrapper.jar`
  (CI generates it automatically if missing).

## Stack
AGP 8.11.1 · Gradle 8.13 · Kotlin 2.1.20 · Compose BOM 2025.06.01 · compileSdk/targetSdk 36 (Google Play requires API 36
for new apps and updates since 31 Aug 2026) · minSdk 24.

## Privacy & security model
* Works anonymously. Email and syncing to the team are optional; chat transcripts upload only if the user turns that on.
* WebView: only `https://appassets…` pages; `tel:`/`mailto:`/`http(s)` open in system apps; every other scheme is ignored;
  only `script.google.com` and `script.googleusercontent.com` are reachable; CSP on every page; no cleartext; no debugging.
* Optional FLAG_SECURE (hide in recents + block screenshots, default ON for Assistant/Resources) and optional app lock (biometric / device credential).
* **Known limitation:** chats and saved reports live in the WebView's plain localStorage on the device (not encrypted).
  Mitigations: app lock, screen lock, "Delete all local data", `allowBackup=false`. A future step would be encrypted storage.
