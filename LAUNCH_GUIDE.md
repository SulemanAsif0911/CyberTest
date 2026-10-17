# Cyber Hayat: step-by-step launch guide

Do the parts in order. Each takes a few minutes.

## Part 1. Google Sheet and backend
1. Create a new Google Sheet, name it **Cyber Hayat Data**.
2. **Extensions → Apps Script.** Delete the sample code and paste all of `backend/Code.gs`. Save.
3. **Project Settings (gear) → Script properties → Add**:
   * `SHARED_SECRET`: a long random text you invent (write it down).
   * `LLM_API_KEY`: key from openrouter.ai/keys.
   * `TEAM_NOTIFY_EMAIL`: inbox for urgent-case alerts (if empty, alerts are off).
4. Choose function **`setup`** → **Run** → approve permissions. Tabs, dashboards, templates and a "Cyber Hayat" menu appear.
5. Choose **`testChat`** → **Run** → the log should show `"ok": true` and a reply.
6. **Deploy → New deployment → Web app** → *Execute as: Me*, *Who has access: Anyone* → **Deploy** → copy the `/exec` URL.

## Part 2. Permanent signing key (once only; back it up)
```
keytool -genkeypair -v -keystore ch-release.keystore -alias cyberhayat -keyalg RSA -keysize 4096 -validity 10000
```
(Android Studio's keytool: `"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe"`.)
Then copy it as text (PowerShell): `[Convert]::ToBase64String([IO.File]::ReadAllBytes("ch-release.keystore")) | Set-Clipboard`

## Part 3. GitHub secrets
Repo → **Settings → Secrets and variables → Actions → New repository secret**:
`CH_APPS_SCRIPT_URL`, `CH_SHARED_SECRET` (same as Part 1), `CH_KEYSTORE_BASE64`, `CH_KEYSTORE_PASSWORD`, `CH_KEY_ALIAS` (= `cyberhayat`), `CH_KEY_PASSWORD`.

## Part 4. Upload the project
1. Unzip `CyberHayatApp.zip`.
2. GitHub → **Add file → Upload files**: drag in the **contents** of the folder (not the outer folder). Large uploads: do `app` first, then the rest. Commit.
3. Make sure the `.github/workflows/main.yml` in the repo is the new one (open it, paste the new file's contents if not).
4. If an old `app/src/main/assets/www/assets/js/config.js` exists in the repo, **delete it** (the build generates it).

## Part 5. Build and install
1. **Actions** tab → newest run → wait for the green tick (red = open the step, send me the "What went wrong" lines).
2. Download **CyberHayat-release-apk** from Artifacts, unzip, send `app-release.apk` to your phone.
3. **Uninstall any older Cyber Hayat first** (one last time; later builds will update in place).
4. Install, allowing "unknown sources" if asked.

## Part 6. First-run checklist (10 minutes)
| Check | How |
|---|---|
| Works offline | Airplane mode → open Toolkit → Guided plan |
| Quick exit | Tap the red **Exit** at the top → the app closes |
| Vault | Toolkit → Evidence vault → create passphrase → add a screenshot → **Report** → "Save as PDF" |
| Safety plan | Add yourself as a contact → tap SMS → message is pre-filled |
| Sync | Settings → turn on "Send reports & forms" → submit a story → row appears in the Sheet |
| AI chat | Online → Assistant status shows "AI assistant · online" |
| Disguise | Settings → Disguise the app icon → Notes → check home screen |
| App lock | Settings → App lock on → close and reopen |
| Directory | Edit the *Helpline Directory* tab → open Helplines → new number appears (online, after refresh) |

## Part 7. Using the new tools (for your team)
* **Guided plan:** victims answer 2 questions and get steps for *now / today / this week*.
* **Evidence vault:** encrypted, with SHA-256 fingerprints and a printable summary for NCCIA/FIA.
* **Platform guides + safety plan + calm + learn + checker + parents + kit:** all offline.
* **Sheet menu "Cyber Hayat":** mark rows In progress/Resolved, open reply templates, refresh dashboards. Urgent open rows turn red.
* **Deleting someone's server data:** in Apps Script run `deleteRecordsFor("CASE-ID-OR-EMAIL")`.

## Before you publicise it
* Verify every number marked "Confirm before relying on it" (15, 1122, 115, 1098) and add verified mental-health and legal-aid lines in the *Helpline Directory* tab.
* Have a lawyer read the privacy, terms and any legal wording.
* Test on at least two real phones (small and large) and with Urdu selected.
