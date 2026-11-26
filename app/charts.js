// Canvas charts for Arunika in Numbers. No library: each function draws one
// chart on a <canvas> with plain 2D calls, sized to the element's attributes.

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width;
  const h = canvas.height;
  canvas.style.aspectRatio = w + " / " + h;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return { ctx, w, h };
}

const INK = "#17323a";
const SOFT = "#6b7d80";
const TEAL = "#0f6b5c";
const AMBER = "#e8a13a";
const RED = "#b3402e";
const GRID = "#e3ddd0";

function axes(ctx, w, h, labels, min, max, unit) {
  const padL = 52, padR = 12, padT = 14, padB = 30;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  ctx.font = "12px -apple-system, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = SOFT;
  ctx.strokeStyle = GRID;
  ctx.lineWidth = 1;
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const v = min + ((max - min) * i) / steps;
    const y = padT + plotH - (plotH * i) / steps;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - padR, y);
    ctx.stroke();
    ctx.textAlign = "right";
    ctx.fillText(formatAxis(v, unit), padL - 8, y + 4);
  }
  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  labels.forEach((label, i) => {
    const x = padL + (plotW * (labels.length === 1 ? 0.5 : i / (labels.length - 1)));
    ctx.fillText(String(label), x, h - 10);
  });
  return { padL, padR, padT, padB, plotW, plotH };
}

function formatAxis(v, unit) {
  if (unit === "%") return v.toFixed(v % 1 === 0 ? 0 : 1) + "%";
  return String(Math.round(v * 10) / 10);
}

function niceBounds(values, pad) {
  let min = Math.min.apply(null, values);
  let max = Math.max.apply(null, values);
  const span = max - min || 1;
  min -= span * pad;
  max += span * pad;
  if (min > 0 && min / max > 0.6) min = 0;
  return { min, max };
}

export function drawLineChart(canvas, points, opts) {
  const { ctx, w, h } = setupCanvas(canvas);
  const values = points.map((p) => p.value);
  const bounds = niceBounds(values, 0.15);
  const a = axes(ctx, w, h, points.map((p) => p.year), bounds.min, bounds.max, opts.unit || "");
  const x = (i) => a.padL + (a.plotW * (points.length === 1 ? 0.5 : i / (points.length - 1)));
  const y = (v) => a.padT + a.plotH - (a.plotH * (v - bounds.min)) / (bounds.max - bounds.min);
  ctx.strokeStyle = TEAL;
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(x(i), y(p.value));
    else ctx.lineTo(x(i), y(p.value));
  });
  ctx.stroke();
  ctx.fillStyle = TEAL;
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(x(i), y(p.value), 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x(i), y(p.value), 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = TEAL;
  });
  const last = points[points.length - 1];
  ctx.fillStyle = INK;
  ctx.font = "bold 13px -apple-system, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "left";
  const label = opts.format ? opts.format(last.value) : String(last.value);
  ctx.fillText(label, Math.min(x(points.length - 1) - 40, w - 90), Math.max(y(last.value) - 12, 16));
}

export function drawBarChart(canvas, points, opts) {
  const { ctx, w, h } = setupCanvas(canvas);
  const values = points.map((p) => p.value);
  const min = Math.min(0, Math.min.apply(null, values));
  const max = Math.max.apply(null, values) * 1.12;
  const a = axes(ctx, w, h, points.map((p) => p.year), min, max, opts.unit || "");
  const slot = a.plotW / points.length;
  const barW = Math.min(44, slot * 0.62);
  const y = (v) => a.padT + a.plotH - (a.plotH * (v - min)) / (max - min);
  points.forEach((p, i) => {
    const bx = a.padL + slot * i + (slot - barW) / 2;
    ctx.fillStyle = p.value < 0 ? RED : (opts.color || TEAL);
    const top = y(Math.max(p.value, 0));
    const bottom = y(Math.min(p.value, 0));
    ctx.fillRect(bx, top, barW, Math.max(bottom - top, 2));
    ctx.fillStyle = INK;
    ctx.font = "12px -apple-system, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    const label = opts.format ? opts.format(p.value) : String(p.value);
    if (p.value < 0) {
      ctx.fillStyle = "#fff";
      ctx.fillText(label, bx + barW / 2, bottom - 6);
    } else {
      ctx.fillText(label, bx + barW / 2, top - 6);
    }
  });
}

export function drawGroupedBars(canvas, series, opts) {
  const { ctx, w, h } = setupCanvas(canvas);
  const values = [];
  series.forEach((s) => { values.push(s.a, s.b); });
  const max = Math.max.apply(null, values) * 1.12;
  const a = axes(ctx, w, h, series.map((s) => s.year), 0, max, opts.unit || "");
  const slot = a.plotW / series.length;
  const barW = Math.min(30, slot * 0.3);
  const y = (v) => a.padT + a.plotH - (a.plotH * v) / max;
  series.forEach((s, i) => {
    const cx = a.padL + slot * i + slot / 2;
    ctx.fillStyle = TEAL;
    ctx.fillRect(cx - barW - 3, y(s.a), barW, a.padT + a.plotH - y(s.a));
    ctx.fillStyle = AMBER;
    ctx.fillRect(cx + 3, y(s.b), barW, a.padT + a.plotH - y(s.b));
  });
  ctx.font = "12px -apple-system, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "left";
  ctx.fillStyle = TEAL;
  ctx.fillRect(w - 150, 2, 12, 12);
  ctx.fillStyle = INK;
  ctx.fillText(opts.labelA, w - 134, 12);
  ctx.fillStyle = AMBER;
  ctx.fillRect(w - 150, 20, 12, 12);
  ctx.fillStyle = INK;
  ctx.fillText(opts.labelB, w - 134, 30);
}

export function drawHorizontalBars(container, rows, opts) {
  container.innerHTML = "";
  const max = Math.max.apply(null, rows.map((r) => r.value));
  rows.forEach((r) => {
    const row = document.createElement("div");
    row.className = "sector-row";
    const name = document.createElement("span");
    name.textContent = r.label;
    const track = document.createElement("div");
    track.className = "bar-track";
    const fill = document.createElement("div");
    fill.className = "bar-fill" + (r.amber ? " amber" : "");
    fill.style.width = Math.max(2, (r.value / max) * 100) + "%";
    track.appendChild(fill);
    const value = document.createElement("span");
    value.className = "bar-value";
    value.textContent = opts.format(r.value);
    row.append(name, track, value);
    container.appendChild(row);
  });
}
