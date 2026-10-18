// ============================================================
// CYBER HAYAT — presentation helpers: dates, sizes, numbers, phones, hashes.
// One place so every screen formats information the same way.
// ============================================================
(function(){
  "use strict";
  const lang = () => localStorage.getItem("ch_lang") || "en";
  // Latin digits everywhere (case numbers, phones and hashes must stay readable); Urdu keeps its own month names.
  const loc = () => (lang() === "ur" ? "ur-PK-u-nu-latn" : "en-GB");
  const fmt = (ts, opts) => { try{ return new Intl.DateTimeFormat(loc(), opts).format(new Date(ts)); }catch(e){ return new Date(ts).toLocaleString(); } };

  const F = {
    date:     ts => fmt(ts, { day: "numeric", month: "short", year: "numeric" }),
    time:     ts => fmt(ts, { hour: "numeric", minute: "2-digit" }),
    dateTime: ts => fmt(ts, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }),
    iso:      ts => new Date(ts).toISOString().replace(".000Z", "Z"),                 // unambiguous, for reports
    num:      n  => { try{ return new Intl.NumberFormat("en-GB").format(n); }catch(e){ return String(n); } },
    bytes(n){
      if(!isFinite(n) || n < 0) return "—";
      if(n < 1024) return n + " B";
      const u = ["KB", "MB", "GB"]; let i = -1;
      do{ n /= 1024; i++; }while(n >= 1024 && i < u.length - 1);
      return (n >= 100 ? n.toFixed(0) : n.toFixed(1)).replace(/\.0$/, "") + " " + u[i];
    },
    plural: (n, one, many) => F.num(n) + " " + (n === 1 ? one : (many || one + "s")),
    rel(ts){
      const s = Math.round((ts - Date.now()) / 1000), a = Math.abs(s);
      if(a < 45) return "just now";
      try{
        const r = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
        if(a < 3600) return r.format(Math.round(s / 60), "minute");
        if(a < 86400) return r.format(Math.round(s / 3600), "hour");
        if(a < 86400 * 14) return r.format(Math.round(s / 86400), "day");
      }catch(e){}
      return F.date(ts);
    },
    // "0300 1234567" / "+923001234567" -> "0300 1234567"; short codes (1799) untouched
    phone(p){
      const d = String(p || "").replace(/[^\d+]/g, "");
      if(/^\+92\d{10}$/.test(d)) return "0" + d.slice(3, 6) + " " + d.slice(6);
      if(/^0\d{10}$/.test(d)) return d.slice(0, 4) + " " + d.slice(4);
      return String(p || "");
    },
    // E.164-ish digits for tel:/sms:/wa.me links (Pakistan default)
    dial(p){
      let d = String(p || "").replace(/[^\d+]/g, "");
      if(d.startsWith("00")) d = "+" + d.slice(2);
      if(/^0\d{10}$/.test(d)) d = "+92" + d.slice(1);
      return d;
    },
    hash: h => String(h || "").replace(/(.{8})/g, "$1 ").trim(),
    esc: s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c])),
    // keep numbers/latin fragments readable inside right-to-left text
    ltr: s => '<bdi dir="ltr">' + F.esc(s) + "</bdi>"
  };
  window.CH_FMT = F;
})();
