// Stacked time-series waveforms: noise-driven signals drift slowly leftwards in the page margins.
import { createNoise2D } from './vendor/simplex-noise.js';

const holder = document.getElementById('ambient-background');
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');
const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
// Matches the styles.css breakpoint that turns the background into a bottom band.
const narrowScreen = matchMedia('(max-width: 600px)');
holder.dataset.art = 'signals';

// Deterministic seed so every visit draws the same composition.
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6d2b79f5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const noise = createNoise2D(mulberry32(20261003));

let width = 0;
let height = 0;
let frameId = 0;
let lastFrame = 0;
let resizeTimer = 0;
let colors = { line: '#8885', fill: '#fff' };

function readColors() {
  const style = getComputedStyle(root);
  colors = {
    line: style.getPropertyValue('--ambient-line').trim() || colors.line,
    fill: style.getPropertyValue('--background').trim() || colors.fill,
  };
}

// Regions left free by the text column; the CSS mask softens their inner edges.
function regions() {
  if (narrowScreen.matches) return [[0, width]];
  const column = document.querySelector('.content-column');
  const box = column ? column.getBoundingClientRect() : { left: width / 2, right: width / 2 };
  return [[0, Math.max(0, box.left - 8)], [Math.min(width, box.right + 8), width]]
    .filter(([from, to]) => to - from > 48);
}

function signal(x, row, shift) {
  const t = (x + shift) / 260;
  const base = noise(t, row * .37) * .55 + noise(t * 3.1, row * .37 + 40) * .2;
  // Sparse "events": smooth bursts that make each line read like a measured series.
  const burst = Math.max(0, noise(t * .35, row * .21 + 90)) ** 2 * 3.4;
  return base * (.3 + burst);
}

function draw(time = 0) {
  ctx.clearRect(0, 0, width, height);
  const gap = narrowScreen.matches ? 14 : 20;
  const amplitude = gap * 1.9;
  // Keep the header row clear on wide screens; the narrow-screen band sits at the bottom.
  const top = narrowScreen.matches ? height - 100 : 120;
  const rows = Math.floor((height - top) / gap);
  const shift = reducedMotion.matches ? 0 : time * .012;
  const step = 4;
  ctx.lineWidth = .8;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = colors.line;
  ctx.fillStyle = colors.fill;
  const centre = width / 2;
  for (const [from, to] of regions()) {
    // Top to bottom, so each row occludes the peaks of the rows behind it.
    for (let row = 0; row < rows; row++) {
      const y0 = top + row * gap;
      ctx.beginPath();
      ctx.moveTo(from, y0);
      const ys = [];
      for (let x = from; x <= to + step; x += step) {
        // Signals grow calmer towards the text column and livelier towards the edges.
        const envelope = narrowScreen.matches ? .8 : .45 + .75 * Math.min(1, Math.abs(x - centre) / centre) ** 1.5;
        const y = y0 - Math.max(-.25, signal(x, row, shift)) * amplitude * envelope;
        ys.push(y);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(to + step, y0 + gap);
      ctx.lineTo(from, y0 + gap);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ys.forEach((y, index) => {
        if (index) ctx.lineTo(from + index * step, y);
        else ctx.moveTo(from, y);
      });
      ctx.stroke();
    }
  }
}

function frame(now) {
  frameId = 0;
  if (document.hidden || reducedMotion.matches) return;
  if (now - lastFrame >= 1000 / 15) {
    lastFrame = now;
    draw(now);
  }
  frameId = requestAnimationFrame(frame);
}

function resume() {
  if (!frameId && !document.hidden && !reducedMotion.matches) frameId = requestAnimationFrame(frame);
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
  readColors();
  draw(lastFrame);
  resume();
}

resize();
addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(frameId); frameId = 0; }
  else resume();
});
// Redraw with the new palette whenever the theme changes.
new MutationObserver(() => { readColors(); draw(lastFrame); })
  .observe(root, { attributes: true, attributeFilter: ['data-theme'] });
reducedMotion.addEventListener('change', resize);
narrowScreen.addEventListener('change', resize);
addEventListener('pagehide', () => { cancelAnimationFrame(frameId); clearTimeout(resizeTimer); });
addEventListener('pageshow', resume);
