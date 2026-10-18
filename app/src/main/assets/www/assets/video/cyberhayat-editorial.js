// ── SLIDESHOW LOGIC ──
const DURATIONS = [4000, 5000, 6000, 6000, 6000, 6000, 6000, 6000, 7000, 7000, 8000];
const DARK_SCENES = new Set(['s1','s4','s5','s8','s9','s11']);

let current = 0;
let timer = null;
let paused = false;
let started = false;

const progressBar = document.getElementById('progressBar');
const slideNum    = document.getElementById('slideNum');
const pauseBtn    = document.getElementById('pauseBtn');
const nextBtn     = document.getElementById('nextBtn');
const restartBtn  = document.getElementById('restartBtn');
const controls    = document.getElementById('controls');
const bodyEl      = document.body;

function getScenes() {
  return document.querySelectorAll('.scene');
}

function restartAnimations(el) {
  const animated = el.querySelectorAll('*');
  animated.forEach(child => {
    child.style.animation = 'none';
    child.offsetHeight; // reflow
    child.style.animation = '';
  });
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = '';
}

function showScene(idx) {
  const scenes = getScenes();
  const totalScenes = scenes.length;

  scenes.forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });

  const target = scenes[idx];
  target.style.display = 'flex';
  target.offsetHeight;
  restartAnimations(target);
  target.classList.add('active');

  bodyEl.classList.toggle('on-dark', DARK_SCENES.has(target.id));

  const pct = ((idx + 1) / totalScenes) * 100;
  progressBar.style.width = pct + '%';
  slideNum.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(totalScenes).padStart(2, '0');
}

function advance() {
  const totalScenes = getScenes().length;
  if (current < totalScenes - 1) {
    current++;
    showScene(current);
    if (!paused) scheduleNext();
  } else {
    onFinished();
  }
}

function onFinished(){
  clearTimeout(timer);
  pauseBtn.style.display = 'none';
  nextBtn.style.display = 'none';
  restartBtn.style.display = 'flex';
}

function resetControlsForPlayback(){
  pauseBtn.style.display = 'flex';
  nextBtn.style.display = 'flex';
  restartBtn.style.display = 'none';
  pauseBtn.textContent = 'Pause';
  paused = false;
}

function scheduleNext() {
  clearTimeout(timer);
  const totalScenes = getScenes().length;
  if (current < totalScenes - 1) {
    timer = setTimeout(advance, DURATIONS[current]);
  }
}

function startVideo() {
  document.getElementById('playBtn').style.display = 'none';
  controls.style.display = 'flex';
  started = true;
  getScenes().forEach(s => { s.style.display = 'none'; s.classList.remove('active'); });
  showScene(0);
  scheduleNext();
}

document.getElementById('playBtn').addEventListener('click', startVideo);

restartBtn.addEventListener('click', () => {
  current = 0;
  resetControlsForPlayback();
  showScene(current);
  scheduleNext();
});

nextBtn.addEventListener('click', () => {
  clearTimeout(timer);
  const totalScenes = getScenes().length;
  if (current < totalScenes - 1) { current++; showScene(current); if (!paused) scheduleNext(); }
  else { onFinished(); }
});

document.getElementById('prevBtn').addEventListener('click', () => {
  clearTimeout(timer);
  if (current > 0) { current--; showScene(current); if (!paused) scheduleNext(); }
});

document.getElementById('pauseBtn').addEventListener('click', () => {
  paused = !paused;
  pauseBtn.textContent = paused ? 'Play' : 'Pause';
  if (paused) clearTimeout(timer);
  else scheduleNext();
});

document.addEventListener('keydown', e => {
  if (!started) return;
  if (e.key === 'ArrowRight' || e.key === ' ') document.getElementById('nextBtn').click();
  if (e.key === 'ArrowLeft') document.getElementById('prevBtn').click();
  if (e.key === 'p' || e.key === 'P') document.getElementById('pauseBtn').click();
});
