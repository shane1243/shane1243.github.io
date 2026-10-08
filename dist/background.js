// Abstract contour lines: deterministic edge composition with gentle motion.
const holder = document.getElementById('ambient-background');
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
// Matches the styles.css breakpoint that hides the background on narrow screens.
const narrowScreen = matchMedia('(max-width: 600px)');
holder.dataset.art = 'contours';
let width = 0;
let height = 0;
let frameId = 0;
let lastFrame = 0;
let resizeTimer = 0;

function draw(time = 0) {
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = '#89917855';
  ctx.lineWidth = .8;
  const size = Math.min(width, height);
  const step = Math.max(16, size * .027);
  const phase = reducedMotion.matches ? 0 : time / 40000;
  const centers = [[-width * .035, height * .75], [width * 1.035, height * .16]];
  centers.forEach(([cx, cy], side) => {
    for (let ring = 0; ring < 11; ring++) {
      const radius = Math.max(36, size * .08) + ring * step;
      ctx.beginPath();
      for (let point = 0; point < 120; point++) {
        const angle = point / 120 * Math.PI * 2;
        const warp = 1 + .055 * Math.sin(angle * 3 + side + phase) + .03 * Math.cos(angle * 5 - phase);
        const x = cx + Math.cos(angle) * radius * warp;
        const y = cy + Math.sin(angle) * radius * warp * 1.18;
        if (point === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  });
}

function frame(now) {
  frameId = 0;
  if (document.hidden || reducedMotion.matches || narrowScreen.matches) return;
  if (now - lastFrame >= 1000 / 20) {
    lastFrame = now;
    draw(now);
  }
  frameId = requestAnimationFrame(frame);
}

function resume() {
  if (!frameId && !document.hidden && !reducedMotion.matches && !narrowScreen.matches) frameId = requestAnimationFrame(frame);
}

function resize() {
  cancelAnimationFrame(frameId);
  frameId = 0;
  width = innerWidth;
  height = innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
  resume();
}

resize();
addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(frameId); frameId = 0; }
  else resume();
});
reducedMotion.addEventListener('change', resize);
narrowScreen.addEventListener('change', resize);
addEventListener('pagehide', () => { cancelAnimationFrame(frameId); clearTimeout(resizeTimer); });
addEventListener('pageshow', resume);
