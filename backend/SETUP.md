# Backend setup (Google Sheet + Apps Script)

**Security model.** Anything inside an APK can be extracted, so `SHARED_SECRET` is only a speed bump.
The real protection is server-side in `Code.gs`: global and per-session rate limits, per-email and daily
caps, strict validation, size limits, opt-in email. Treat any secret that was ever committed as burned.

## 1. Create the sheet and script
1. New Google Sheet → **Extensions → Apps Script** → delete the sample → paste `Code.gs`.
2. **Project Settings (gear) → Script properties → Add**:

| Name | Required | Value |
|---|---|---|
| `SHARED_SECRET` | yes | a NEW long random string (never reuse an old one) |
| `LLM_API_KEY` | for AI answers | key from openrouter.ai/keys |
| `TEAM_NOTIFY_EMAIL` | **strongly recommended** | inbox that should receive urgent-case alerts. If empty, urgent alerts are OFF |
| `LLM_MODELS` | no | comma-separated model ids, tried in order |
| `LLM_DAILY_CAP` / `EMAIL_DAILY_CAP` | no | defaults 400 AI calls / 60 emails per day |

3. Run **`setup`** (authorize). The log tells you what is still missing.
4. Run **`testChat`**: the log should show `"ok": true` with a reply.
5. **Deploy → New deployment → Web app** (Execute as *Me*, access *Anyone*). Copy the `/exec` URL.

## 2. Put the URL and secret into the app BUILD (not the repo)
GitHub → repo **Settings → Secrets and variables → Actions → New repository secret**:
`CH_APPS_SCRIPT_URL`, `CH_SHARED_SECRET` (same value as `SHARED_SECRET` above) plus the signing secrets
listed in the README. The workflow writes `config.js` during the build. `config.js` is git-ignored.
For a local build, copy `config.example.js` to `config.js` or pass `-PchAppsScriptUrl=… -PchSharedSecret=…`.

## 3. Rotating the secret (do this now if an old one was ever committed)
1. Change `SHARED_SECRET` in Script properties. Old APKs are rejected immediately.
2. Update the `CH_SHARED_SECRET` GitHub secret to the same value and rebuild/publish the app.
3. Items queued on users' phones with the old secret are dropped after a few attempts; users re-submit.

## 4. Data deletion requests
Users can send a request from **Settings → Request deletion** (or by contacting the team with their case ID/email).
It lands in the **Deletion Requests** tab as *Pending*. To fulfil it, run in the Apps Script editor:
`deleteRecordsFor("CASE-ID-OR-EMAIL")`. This removes matching rows from every data tab and marks the request *Done*.
Local data on the user's phone is separate: **Settings → Delete chat history / Delete local data**.

## 5. Updating later
Deploy → Manage deployments → Edit → **New version** (the URL stays the same).

## 6. New in v3.1: team tools and the live helpline list
* `setup()` now also creates **Helpline Directory**, **Reply Templates**, **Case Dashboard** and **Impact (anonymous)** tabs, plus a **Cyber Hayat** menu in the Sheet (mark selected rows In progress or Resolved, open reply templates, refresh dashboards).
* **Upgrading from an earlier version?** The Incident Reports tab gained *Assignee* and *Internal Notes* columns and there is a new *Event Signups* tab. Delete the old tabs (or start a fresh Sheet) before running `setup()` so the columns line up.
* **Helpline Directory:** add or correct numbers in that tab. The app downloads active rows (cached 24 hours) and falls back to its built-in list offline. Only add numbers you have verified, and put the month in *Verified*.
* **Event Signups** receives registrations from the Ambassador kit.
* **Impact (anonymous)** shows counts only, which is safe to share with the university or donors.
