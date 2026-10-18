// Hold the "Notes" title for 3 seconds to return to the app.
(function(){
  var t = document.getElementById("t"), timer = null;
  function start(){ timer = setTimeout(function(){ location.replace("index.html"); }, 3000); }
  function stop(){ clearTimeout(timer); }
  t.addEventListener("touchstart", start, { passive: true }); t.addEventListener("touchend", stop); t.addEventListener("touchcancel", stop);
  t.addEventListener("mousedown", start); t.addEventListener("mouseup", stop); t.addEventListener("mouseleave", stop);
})();
