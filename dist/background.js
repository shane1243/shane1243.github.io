// Ambient background art for the page margins. Plum growth adapted from antfu.me (MIT), vendor/antfu.LICENSE.
import { createNoise3D } from './vendor/simplex-noise.js';

const holder = document.getElementById('ambient-background');
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');
const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
// Matches the styles.css breakpoint for narrow screens.
const narrowScreen = matchMedia('(max-width: 600px)');
const artName = new URLSearchParams(location.search).get('bg') || 'plum';
holder.dataset.art = artName;

// Deterministic seed so every visit draws the same composition.
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6d2b79f5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const noise = createNoise3D(mulberry32(20261003));

let width = 0;
let height = 0;
let frameId = 0;
let lastFrame = 0;
let resizeTimer = 0;
let lineColor = '#8885';

// Regions left free by the text column; the CSS mask softens their inner edges.
function regions() {
  if (narrowScreen.matches) return [[0, width]];
  const column = document.querySelector('.content-column');
  const box = column ? column.getBoundingClientRect() : { left: width / 2, right: width / 2 };
  return [[0, Math.max(0, box.left - 8)], [Math.min(width, box.right + 8), width]]
    .filter(([from, to]) => to - from > 48);
}

// Branches grow from the viewport edges, split at small random angles, then stop.
const plum = (() => {
  const length = 6;
  const spread = Math.PI / 12;
  let random;
  let segments = [];
  let pending = [];
  let drawn = 0;
  return {
    fps: 40,
    reset() {
      random = mulberry32(1243);
      segments = [];
      drawn = 0;
      const middle = () => random() * .6 + .2;
      pending = [
        [middle() * width, -5, Math.PI / 2], [middle() * width, height + 5, -Math.PI / 2],
        [-5, middle() * height, 0], [width + 5, middle() * height, Math.PI],
      ].map(([x, y, angle]) => ({ x, y, angle, counter: { value: 0 } }));
      if (reducedMotion.matches) while (pending.length) this.grow();
    },
    grow() {
      const next = [];
      for (const { x, y, angle, counter } of pending) {
        const nx = x + Math.cos(angle) * length;
        const ny = y + Math.sin(angle) * length;
        segments.push([x, y, nx, ny]);
        counter.value++;
        if (nx < -100 || nx > width + 100 || ny < -100 || ny > height + 100) continue;
        const rate = counter.value <= 30 ? .8 : .5;
        if (random() < rate) next.push({ x: nx, y: ny, angle: angle + random() * spread, counter });
        if (random() < rate) next.push({ x: nx, y: ny, angle: angle - random() * spread, counter });
      }
      pending = next;
    },
    get done() { return !pending.length && drawn === segments.length; },
    draw(full) {
      if (full) { ctx.clearRect(0, 0, width, height); drawn = 0; }
      else this.grow();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (; drawn < segments.length; drawn++) {
        const [x, y, nx, ny] = segments[drawn];
        ctx.moveTo(x, y);
        ctx.lineTo(nx, ny);
      }
      ctx.stroke();
    },
  };
})();

// A grid of dots whose size breathes with a slowly drifting noise field.
const dots = {
  fps: 15,
  done: false,
  reset() {},
  draw(full, time = 0) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = lineColor;
    const spacing = 18;
    const z = reducedMotion.matches ? 0 : time / 9000;
    ctx.beginPath();
    for (const [from, to] of regions()) {
      for (let x = Math.ceil(from / spacing) * spacing; x < to; x += spacing) {
        for (let y = spacing; y < height; y += spacing) {
          const radius = .5 + Math.max(0, noise(x / 340, y / 340, z)) * 1.6;
          ctx.moveTo(x + radius, y);
          ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
      }
    }
    ctx.fill();
  },
};

// Topographic contours: marching squares over a slowly drifting noise field.
const contours = {
  fps: 10,
  done: false,
  reset() {},
  draw(full, time = 0) {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = .9;
    const cell = 10;
    const z = reducedMotion.matches ? 0 : time / 40000;
    const field = (x, y) => noise(x / 420, y / 420, z) * .75 + noise(x / 160, y / 160, z + 9) * .25;
    ctx.beginPath();
    for (const [from, to] of regions()) {
      const cols = Math.ceil((to - from) / cell) + 1;
      const rows = Math.ceil(height / cell) + 1;
      const values = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) values[j * cols + i] = field(from + i * cell, j * cell);
      for (let level = -.7; level <= .71; level += .14) {
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const a = values[j * cols + i], b = values[j * cols + i + 1];
            const c = values[(j + 1) * cols + i + 1], d = values[(j + 1) * cols + i];
            const x = from + i * cell, y = j * cell;
            const points = [];
            if ((a < level) !== (b < level)) points.push([x + (level - a) / (b - a) * cell, y]);
            if ((b < level) !== (c < level)) points.push([x + cell, y + (level - b) / (c - b) * cell]);
            if ((d < level) !== (c < level)) points.push([x + (level - d) / (c - d) * cell, y + cell]);
            if ((a < level) !== (d < level)) points.push([x, y + (level - a) / (d - a) * cell]);
            for (let k = 0; k + 1 < points.length; k += 2) {
              ctx.moveTo(points[k][0], points[k][1]);
              ctx.lineTo(points[k + 1][0], points[k + 1][1]);
            }
          }
        }
      }
    }
    ctx.stroke();
  },
};

const art = { plum, dots, contours }[artName] || plum;

function frame(now) {
  frameId = 0;
  if (document.hidden || reducedMotion.matches || art.done) return;
  if (now - lastFrame >= 1000 / art.fps) {
    lastFrame = now;
    art.draw(false, now);
  }
  frameId = requestAnimationFrame(frame);
}

function resume() {
  if (!frameId && !document.hidden && !reducedMotion.matches && !art.done) frameId = requestAnimationFrame(frame);
}

function readColor() {
  lineColor = getComputedStyle(root).getPropertyValue('--ambient-line').trim() || lineColor;
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
  readColor();
  art.reset();
  art.draw(true, lastFrame);
  resume();
}

resize();
addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(frameId); frameId = 0; }
  else resume();
});
// Redraw with the new palette whenever the theme changes.
new MutationObserver(() => { readColor(); art.draw(true, lastFrame); })
  .observe(root, { attributes: true, attributeFilter: ['data-theme'] });
reducedMotion.addEventListener('change', resize);
narrowScreen.addEventListener('change', resize);
addEventListener('pagehide', () => { cancelAnimationFrame(frameId); clearTimeout(resizeTimer); });
addEventListener('pageshow', resume);
