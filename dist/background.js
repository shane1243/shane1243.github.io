// Static graph-paper grid in the page margins, aligned to the text column.
const holder = document.getElementById('ambient-background');
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');
const root = document.documentElement;
holder.dataset.art = 'graph';

const cell = 16;
const majorEvery = 5;
let resizeTimer = 0;

function draw() {
  const width = innerWidth;
  const height = innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = getComputedStyle(root).getPropertyValue('--ambient-line').trim() || '#8884';
  // Start a major line on the column's left edge so the grid frames the text.
  const column = document.querySelector('.content-column');
  const originX = column ? column.getBoundingClientRect().left % (cell * majorEvery) : 0;
  const pixel = .5 / dpr;
  for (const [major, alpha, lineWidth] of [[false, .45, .6], [true, 1, .8]]) {
    ctx.globalAlpha = alpha;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    for (let index = 0, x = originX - cell * majorEvery; x <= width; index++, x += cell) {
      if ((index % majorEvery === 0) !== major) continue;
      ctx.moveTo(Math.round(x) + pixel, 0);
      ctx.lineTo(Math.round(x) + pixel, height);
    }
    for (let index = 0, y = 0; y <= height; index++, y += cell) {
      if ((index % majorEvery === 0) !== major) continue;
      ctx.moveTo(0, Math.round(y) + pixel);
      ctx.lineTo(width, Math.round(y) + pixel);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

draw();
addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(draw, 120); });
// Redraw with the new palette whenever the theme changes.
new MutationObserver(draw).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
