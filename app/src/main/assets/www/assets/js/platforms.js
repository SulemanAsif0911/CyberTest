// Copy buttons for platform report templates.
(function(){
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-copy]"); if(!b) return;
    const el = document.querySelector(b.dataset.copy); if(!el) return;
    const t = el.innerText;
    const ok = () => window.CH_SUBMIT && CH_SUBMIT.toast("Message copied. Replace the text in [BRACKETS].");
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, () => CH_SUBMIT.toast("Couldn’t copy.", "error"));
    else CH_SUBMIT.toast("Copy isn’t available on this device.", "error");
  });
})();
