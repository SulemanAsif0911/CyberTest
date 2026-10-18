// ============================================================
// CYBER HAYAT — Ambassador kit: QR generator, printable posters, event sign-up.
// ============================================================
(function(){
  "use strict";
  const F = window.CH_FMT, $ = id => document.getElementById(id);
  function printHtml(html){
    const root = $("reportRoot");
    root.innerHTML = `<div class="rpt"><div class="no-print rpt-bar"><button class="btn btn-primary btn-sm" id="pPrint">${CH_ICON("printer", 14)} Print or save as PDF</button><button class="btn btn-outline btn-sm" id="pClose">Close</button></div>${html}</div>`;
    document.body.classList.add("vt-printing"); window.scrollTo(0, 0);
    $("pClose").addEventListener("click", () => document.body.classList.remove("vt-printing"));
    $("pPrint").addEventListener("click", () => { if(window.CHNative && CHNative.printPage) CHNative.printPage(); else window.print(); });
  }
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-poster]").forEach(b => b.addEventListener("click", () => {
      const p = document.getElementById(b.dataset.poster); if(p) printHtml(p.outerHTML);
    }));
    $("qrGo").addEventListener("click", () => {
      const t = $("qrText").value.trim();
      if(!t) return CH_SUBMIT.toast("Enter a link or text first.", "error");
      if(!CH_QR.draw($("qrCanvas"), t, 320)) return CH_SUBMIT.toast("That is too long for a QR code here (106 characters max).", "error");
      $("qrBox").hidden = false; $("qrLabel").textContent = t;
    });
    $("qrPrint").addEventListener("click", () => {
      const t = $("qrText").value.trim(); if(!t) return;
      printHtml(`<h1>Scan me</h1><img src="${$("qrCanvas").toDataURL("image/png")}" alt="QR code" style="width:240pt;height:240pt"><p class="sub" dir="ltr">${F.esc(t)}</p>`);
    });
    $("qrText").addEventListener("input", () => { $("qrCount").textContent = new TextEncoder().encode($("qrText").value).length + " of 106 bytes"; });

    $("evForm").addEventListener("submit", e => {
      e.preventDefault();
      const d = { name: $("evName").value.trim(), contact: $("evContact").value.trim(), university: $("evOrg").value.trim(), city: $("evVenue").value.trim(),
                  why: ("Event: " + ($("evWhen").value || "date not set") + " · expected " + ($("evN").value || "?") + " people. " + $("evNote").value.trim()).slice(0, 2900) };
      if(!d.name || !d.contact) return CH_SUBMIT.toast("Add your name and a phone or email.", "error");
      CH_SUBMIT.askSync(null, async () => {
        const res = await CH_SUBMIT.send("event_signup", { name: d.name, contact: d.contact, institution: d.university, venue: d.city,
          eventDate: $("evWhen").value ? $("evWhen").value.slice(0, 16) : "", attendees: Math.max(0, Math.min(5000, +$("evN").value || 0)), note: $("evNote").value.trim().slice(0, 600) });
        let m = "Sent to the team.";
        if(!res.ok) m = "Couldn’t save on this device.";
        else if(res.localOnly) m = "Saved on this device only. Nothing was sent.";
        else if(res.queued) m = "Saved. It will be sent when you’re online.";
        $("evResult").textContent = m; CH_SUBMIT.toast(m, res.ok ? "" : "error"); if(res.ok) $("evForm").reset();
      });
    });
  });
})();
