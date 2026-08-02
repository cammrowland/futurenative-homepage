const canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = 32;
const ctx = canvas.getContext('2d');
const link = document.querySelector("link[rel~='icon']");
const tittle = document.getElementById('logo-tittle');

let hue = 210;

function updateFavicon() {
  ctx.clearRect(0, 0, 32, 32);
  ctx.beginPath();
  ctx.arc(16, 16, 14, 0, Math.PI * 2);
  const color = `hsl(${hue}, 80%, 55%)`;
  ctx.fillStyle = color;
  ctx.fill();
  if (tittle) tittle.setAttribute('fill', color);
  link.href = canvas.toDataURL('image/png');
  hue = (hue + 1) % 360;
}

setInterval(updateFavicon, 150);
updateFavicon();
