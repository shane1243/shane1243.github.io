// Canvas adaptation of Anthony Fu's ArtDots and ArtPlum (MIT).
// Original: https://github.com/antfu/antfu.me — license: vendor/antfu.LICENSE.
import { createNoise3D } from './vendor/simplex-noise.js';

const holder = document.getElementById('ambient-background');
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const art = holder.dataset.art || (Math.random() > 0.5 ? 'plum' : 'dots');
holder.dataset.art = art;
const noise = createNoise3D();
let width = 0;
let height = 0;
let points = [];
let branches = [];
let drawn = 0;
let frameId = 0;
let lastFrame = 0;
let resizeTimer = 0;

function dots(time) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#cccccc';
  const t = time / 10000;
  for (const point of points) {
    const angle = (noise(point.x / 200, point.y / 200, t) - 0.5) * Math.PI * 2;
    const length = (noise(point.x / 200, point.y / 200, t * 2) + 0.5) * 5;
    ctx.globalAlpha = (Math.abs(Math.cos(angle)) * 0.8 + 0.2) * point.opacity;
    ctx.beginPath();
    ctx.arc(point.x + Math.cos(angle) * length, point.y + Math.sin(angle) * length, 1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function branchStep(branch) {
  const length = Math.random() * 6;
  const x = branch.x + length * Math.cos(branch.angle);
  const y = branch.y + length * Math.sin(branch.angle);
  branch.counter.value++;
  ctx.beginPath();
  ctx.moveTo(branch.x, branch.y);
  ctx.lineTo(x, y);
  ctx.stroke();
  drawn++;
  if (x < -100 || x > width + 100 || y < -100 || y > height + 100) return;
  const rate = branch.counter.value <= 30 ? 0.8 : 0.5;
  for (const direction of [1, -1]) {
    if (Math.random() < rate && branches.length < 1200) {
      branches.push({ x, y, angle: branch.angle + direction * Math.random() * Math.PI / 12, counter: branch.counter });
    }
  }
}

function plumTick(staticFrame = false) {
  const current = branches;
  branches = [];
  for (const branch of current) {
    if (drawn >= 24000) break;
    if (!staticFrame && Math.random() < 0.5) branches.push(branch);
    else branchStep(branch);
  }
  if (drawn >= 24000) branches = [];
}

function frame(now) {
  frameId = 0;
  if (document.hidden || reducedMotion.matches) return;
  if (now - lastFrame >= 1000 / 40) {
    lastFrame = now;
    if (art === 'dots') dots(Date.now());
    else plumTick();
  }
  if (art === 'dots' || branches.length) frameId = requestAnimationFrame(frame);
}

function resume() {
  if (!frameId && !document.hidden && !reducedMotion.matches && (art === 'dots' || branches.length)) {
    frameId = requestAnimationFrame(frame);
  }
}

function resize() {
  cancelAnimationFrame(frameId);
  frameId = 0;
  width = innerWidth;
  height = innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  points = [];
  branches = [];
  drawn = 0;
  if (art === 'dots') {
    for (let x = -7.5; x < width + 15; x += 15) {
      for (let y = -7.5; y < height + 15; y += 15) {
        points.push({ x, y, opacity: Math.random() * 0.5 + 0.5 });
      }
    }
    dots(Date.now());
  } else {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#88888825';
    const middle = () => Math.random() * 0.6 + 0.2;
    branches = [
      { x: middle() * width, y: -5, angle: Math.PI / 2, counter: { value: 0 } },
      { x: middle() * width, y: height + 5, angle: -Math.PI / 2, counter: { value: 0 } },
      { x: -5, y: middle() * height, angle: 0, counter: { value: 0 } },
      { x: width + 5, y: middle() * height, angle: Math.PI, counter: { value: 0 } }
    ];
    if (width < 500) branches = branches.slice(0, 2);
    if (reducedMotion.matches) {
      for (let i = 0; i < 800 && branches.length; i++) plumTick(true);
    } else plumTick();
  }
  resume();
}

resize();
addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(frameId); frameId = 0; }
  else resume();
});
reducedMotion.addEventListener('change', resize);
addEventListener('pagehide', () => { cancelAnimationFrame(frameId); clearTimeout(resizeTimer); });
addEventListener('pageshow', resume);
