/* Background dot grid.
   A wave of brightness radiates outward from the animated dot in the logo,
   so the field reads as a consequence of the mark rather than wallpaper.
   Tune these numbers with tools/dot-grid-study.html, then copy them here. */
const GRID = {
  mode: 'radial',    // 'radial' (from the tittle) | 'diagonal' | 'static'
  spacing: 26,       // px between dots
  dotSize: 1.4,      // px radius
  wavelength: 285,   // px between wave rings
  bandEdge: 1.0,     // >1 thins the bright ring, <1 broadens it
  amplitude: 0.26,   // 0 = flat, 1 = full swing
  period: 9.0,       // seconds per wave cycle
  baseAlpha: 0.030,  // dimmest dot
  alphaRange: 0.080, // dimmest -> brightest
  buckets: 14        // brightness steps; also how many fills we issue per frame
};

const gridCanvas = document.getElementById('grid');

if (gridCanvas) {
  const g = gridCanvas.getContext('2d');
  let W = 0, H = 0;

  function sizeGrid() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = gridCanvas.clientWidth;
    H = gridCanvas.clientHeight;
    gridCanvas.width = Math.round(W * dpr);
    gridCanvas.height = Math.round(H * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', sizeGrid);

  function waveSource() {
    const t = document.getElementById('logo-tittle');
    if (!t) return { x: W / 2, y: H / 2 };
    const r = t.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }

  function drawGrid(now) {
    requestAnimationFrame(drawGrid);
    g.clearRect(0, 0, W, H);

    const s = GRID.spacing;
    const src = waveSource();
    const phase = now * ((2 * Math.PI) / (GRID.period * 1000));
    const buckets = Array.from({ length: GRID.buckets }, () => []);

    for (let y = s / 2; y < H; y += s) {
      for (let x = s / 2; x < W; x += s) {
        let v = 0.5;
        if (GRID.mode === 'radial') {
          const d = Math.hypot(x - src.x, y - src.y);
          v = 0.5 + 0.5 * Math.sin((d / GRID.wavelength) * Math.PI * 2 - phase);
        } else if (GRID.mode === 'diagonal') {
          v = 0.5 + 0.5 * Math.sin(((x + y) / GRID.wavelength) * Math.PI * 2 - phase);
        }
        if (GRID.mode !== 'static' && GRID.bandEdge !== 1) v = Math.pow(v, GRID.bandEdge);
        buckets[Math.min(GRID.buckets - 1, Math.floor(v * GRID.buckets))].push(x, y);
      }
    }

    for (let b = 0; b < GRID.buckets; b++) {
      const pts = buckets[b];
      if (!pts.length) continue;
      const v = (b + 0.5) / GRID.buckets;
      const alpha = GRID.baseAlpha + GRID.alphaRange *
        (GRID.mode === 'static' ? 0.5 : 0.5 + (v - 0.5) * 2 * GRID.amplitude);
      g.fillStyle = 'rgba(255,255,255,' + alpha.toFixed(4) + ')';
      g.beginPath();
      for (let i = 0; i < pts.length; i += 2) {
        g.moveTo(pts[i] + GRID.dotSize, pts[i + 1]);
        g.arc(pts[i], pts[i + 1], GRID.dotSize, 0, Math.PI * 2);
      }
      g.fill();
    }
  }

  sizeGrid();
  requestAnimationFrame(drawGrid);
}
