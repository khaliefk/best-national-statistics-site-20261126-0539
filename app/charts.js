// Canvas charts for Arunika in Numbers. No chart library: every chart
// is drawn with plain 2D canvas calls. Each plotter takes a <canvas>,
// an array of x labels, an array of numbers, and a formatter, and draws
// axes, gridlines and the series in the site's own palette.

const NAVY = "#20264d";
const MUTED = "#5a6472";
const CORAL = "#e4572e";
const GOLD = "#f2a541";
const TEAL = "#2a7f6f";
const CRIMSON = "#b3402e";
const GRIDLINE = "#e6e1d4";
const FONT = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const FONT_BOLD = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// Size a canvas for the device pixel ratio and hand back its context
// plus the logical width and height its attributes declare. The base
// size is remembered on the element, so painting the same chart again
// (for example after leaving the page and coming back) does not keep
// multiplying the pixel size by the ratio.
function prep(canvas) {
  const ratio = window.devicePixelRatio || 1;
  if (!canvas.dataset.baseW) {
    canvas.dataset.baseW = String(canvas.width);
    canvas.dataset.baseH = String(canvas.height);
  }
  const w = Number(canvas.dataset.baseW);
  const h = Number(canvas.dataset.baseH);
  canvas.style.aspectRatio = w + " / " + h;
  canvas.width = Math.round(w * ratio);
  canvas.height = Math.round(h * ratio);
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  return { ctx, w, h };
}

// Pick axis limits that cover the values with a little headroom, and
// start at zero whenever the smallest value is close to it.
function limits(values, headroom) {
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  const span = hi - lo || 1;
  lo -= span * headroom;
  hi += span * headroom;
  if (lo > 0 && lo / hi > 0.55) lo = 0;
  return { lo, hi };
}

// Draw the gridlines, the y labels and the x labels, and return the
// plot area plus mappers from value and index to pixels.
function frame(ctx, w, h, labels, lo, hi, tick) {
  const left = 56, right = 14, top = 16, bottom = 32;
  const pw = w - left - right;
  const ph = h - top - bottom;
  ctx.font = FONT;
  ctx.strokeStyle = GRIDLINE;
  ctx.lineWidth = 1;
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const v = lo + ((hi - lo) * i) / steps;
    const y = top + ph - (ph * i) / steps;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(w - right, y);
    ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.textAlign = "right";
    ctx.fillText(tick(v), left - 8, y + 4);
  }
  ctx.fillStyle = NAVY;
  ctx.textAlign = "center";
  labels.forEach((label, i) => {
    const x = labels.length === 1
      ? left + pw / 2
      : left + (pw * i) / (labels.length - 1);
    ctx.fillText(String(label), x, h - 10);
  });
  return {
    left, top, pw, ph,
    px: (i) => labels.length === 1 ? left + pw / 2 : left + (pw * i) / (labels.length - 1),
    py: (v) => top + ph - (ph * (v - lo)) / (hi - lo),
  };
}

function axisTick(v, unit) {
  if (unit === "%") return (Number.isInteger(v) ? v : v.toFixed(1)) + "%";
  return String(Math.round(v * 10) / 10);
}

// A line chart with a dot on every point and the last value labelled.
export function plotLine(canvas, labels, values, fmt, unit) {
  const { ctx, w, h } = prep(canvas);
  const { lo, hi } = limits(values, 0.18);
  const f = frame(ctx, w, h, labels, lo, hi, (v) => axisTick(v, unit || ""));
  ctx.strokeStyle = CORAL;
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.beginPath();
  values.forEach((v, i) => {
    if (i === 0) ctx.moveTo(f.px(i), f.py(v));
    else ctx.lineTo(f.px(i), f.py(v));
  });
  ctx.stroke();
  values.forEach((v, i) => {
    ctx.fillStyle = CORAL;
    ctx.beginPath();
    ctx.arc(f.px(i), f.py(v), 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(f.px(i), f.py(v), 2, 0, Math.PI * 2);
    ctx.fill();
  });
  const last = values[values.length - 1];
  ctx.fillStyle = NAVY;
  ctx.font = FONT_BOLD;
  ctx.textAlign = "left";
  ctx.fillText(
    fmt ? fmt(last) : String(last),
    Math.min(f.px(values.length - 1) - 44, w - 96),
    Math.max(f.py(last) - 12, 18),
  );
}

// A column chart. Negative columns hang below the zero line in crimson
// and carry their label inside the bar.
export function plotBars(canvas, labels, values, fmt, unit, color) {
  const { ctx, w, h } = prep(canvas);
  const lo = Math.min(0, ...values);
  const hi = Math.max(...values) * 1.12;
  const f = frame(ctx, w, h, labels, lo, hi, (v) => axisTick(v, unit || ""));
  const slot = f.pw / values.length;
  const bw = Math.min(46, slot * 0.6);
  values.forEach((v, i) => {
    const bx = f.left + slot * i + (slot - bw) / 2;
    const top = f.py(Math.max(v, 0));
    const bottom = f.py(Math.min(v, 0));
    ctx.fillStyle = v < 0 ? CRIMSON : (color || TEAL);
    ctx.fillRect(bx, top, bw, Math.max(bottom - top, 2));
    ctx.font = FONT;
    ctx.textAlign = "center";
    const text = fmt ? fmt(v) : String(v);
    if (v < 0) {
      ctx.fillStyle = "#fff";
      ctx.fillText(text, bx + bw / 2, bottom - 6);
    } else {
      ctx.fillStyle = NAVY;
      ctx.fillText(text, bx + bw / 2, top - 6);
    }
  });
}

// Two grouped columns per label, for comparing two series side by side.
export function plotPairs(canvas, labels, first, second, nameA, nameB) {
  const { ctx, w, h } = prep(canvas);
  const hi = Math.max(...first, ...second) * 1.12;
  const f = frame(ctx, w, h, labels, 0, hi, (v) => String(Math.round(v)));
  const slot = f.pw / labels.length;
  const bw = Math.min(28, slot * 0.28);
  labels.forEach((_, i) => {
    const cx = f.left + slot * i + slot / 2;
    ctx.fillStyle = TEAL;
    ctx.fillRect(cx - bw - 3, f.py(first[i]), bw, f.top + f.ph - f.py(first[i]));
    ctx.fillStyle = GOLD;
    ctx.fillRect(cx + 3, f.py(second[i]), bw, f.top + f.ph - f.py(second[i]));
  });
  ctx.font = FONT;
  ctx.textAlign = "left";
  ctx.fillStyle = TEAL;
  ctx.fillRect(w - 158, 2, 12, 12);
  ctx.fillStyle = NAVY;
  ctx.fillText(nameA, w - 142, 12);
  ctx.fillStyle = GOLD;
  ctx.fillRect(w - 158, 20, 12, 12);
  ctx.fillStyle = NAVY;
  ctx.fillText(nameB, w - 142, 30);
}

// Horizontal bars built as DOM rows, for ranked lists such as sectors.
// Each row is [label, value, highlight?]; the widest bar sets the scale.
export function barList(el, rows, fmt) {
  el.innerHTML = "";
  const peak = Math.max(...rows.map((r) => r[1]));
  rows.forEach(([label, value, hot]) => {
    const row = document.createElement("div");
    row.className = "hbar";
    const name = document.createElement("span");
    name.className = "hbar-name";
    name.textContent = label;
    const track = document.createElement("div");
    track.className = "hbar-track";
    const fill = document.createElement("div");
    fill.className = "hbar-fill" + (hot ? " hot" : "");
    fill.style.width = Math.max(2, (value / peak) * 100) + "%";
    track.appendChild(fill);
    const num = document.createElement("span");
    num.className = "hbar-num";
    num.textContent = fmt(value);
    row.append(name, track, num);
    el.appendChild(row);
  });
}
