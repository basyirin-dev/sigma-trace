import { TRAP_SIGMA_THRESHOLD, CALM_SIGMA_THRESHOLD } from '@engine/constants';

export const GAUGE_WIDTH = 340;
export const GAUGE_HEIGHT = 220;

const CX = GAUGE_WIDTH / 2;
const CY = 130;
const RADIUS = 88;
const ARC_WIDTH = 8;
const NEEDLE_LENGTH = RADIUS - 12;

interface ColorBand {
  start: number;
  end: number;
  color: string;
}

const BANDS: ColorBand[] = [
  { start: 0, end: TRAP_SIGMA_THRESHOLD, color: '#E74C3C' },
  { start: TRAP_SIGMA_THRESHOLD, end: 50, color: '#E67E22' },
  { start: 50, end: CALM_SIGMA_THRESHOLD, color: '#F1C40F' },
  { start: CALM_SIGMA_THRESHOLD, end: 100, color: '#2ECC71' },
];

export function valueToAngle(value: number): number {
  return Math.PI + (value / 100) * Math.PI;
}

function bandAngle(percent: number): number {
  return Math.PI + (percent / 100) * Math.PI;
}

function drawPixelArc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  a0: number,
  a1: number,
  color: string,
  thickness: number,
): void {
  ctx.fillStyle = color;
  const step = Math.PI / 12;
  for (let a = a0; a <= a1; a += step) {
    for (let t = -thickness / 2; t <= thickness / 2; t += 1) {
      const r = radius + t;
      const px = Math.round(cx + Math.cos(a) * r);
      const py = Math.round(cy + Math.sin(a) * r);
      ctx.fillRect(px, py, 1, 1);
    }
  }
}

function drawPixelLine(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
  thickness: number = 1,
): void {
  ctx.fillStyle = color;
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    for (let t = 0; t < thickness; t++) {
      ctx.fillRect(x0, y0 + t, 1, 1);
      if (thickness > 1) ctx.fillRect(x0 + t, y0, 1, 1);
    }
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

export function renderGauge(ctx: CanvasRenderingContext2D, value: number): void {
  const clamped = Math.max(0, Math.min(100, value));

  ctx.save();
  ctx.clearRect(0, 0, GAUGE_WIDTH, GAUGE_HEIGHT);

  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = '#0F3460';
  ctx.fillRect(0, 0, GAUGE_WIDTH, GAUGE_HEIGHT);

  ctx.fillStyle = 'rgba(42, 58, 94, 0.3)';
  for (let x = 0; x < GAUGE_WIDTH; x += 8) {
    ctx.fillRect(x, 0, 1, GAUGE_HEIGHT);
  }
  for (let y = 0; y < GAUGE_HEIGHT; y += 8) {
    ctx.fillRect(0, y, GAUGE_WIDTH, 1);
  }

  for (const band of BANDS) {
    const a0 = bandAngle(band.start);
    const a1 = bandAngle(band.end);
    drawPixelArc(ctx, CX, CY, RADIUS, a0, a1, band.color, ARC_WIDTH);
  }

  drawTick(ctx, TRAP_SIGMA_THRESHOLD, '#E74C3C');
  drawTick(ctx, CALM_SIGMA_THRESHOLD, '#2ECC71');

  const angle = valueToAngle(clamped);
  const nx = Math.round(CX + Math.cos(angle) * NEEDLE_LENGTH);
  const ny = Math.round(CY + Math.sin(angle) * NEEDLE_LENGTH);
  drawPixelLine(ctx, CX + 1, CY + 1, nx + 1, ny + 1, 'rgba(0,0,0,0.4)', 2);
  drawPixelLine(ctx, CX, CY, nx, ny, '#E0E0E0', 2);

  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(CX - 3, CY - 3, 6, 6);
  ctx.fillStyle = '#0F3460';
  ctx.fillRect(CX - 1, CY - 1, 2, 2);

  ctx.fillStyle = '#E0E0E0';
  ctx.font = 'bold 36px BoldPixels, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(Math.round(clamped)), CX, CY - 36);

  ctx.font = '16px monospace';
  ctx.fillText('σ', CX, CY + 32);

  ctx.font = '14px monospace';
  ctx.textBaseline = 'top';
  ctx.fillText('0', 14, CY + 6);
  ctx.fillText('100', GAUGE_WIDTH - 20, CY + 6);

  ctx.restore();
}

function drawTick(ctx: CanvasRenderingContext2D, value: number, color: string): void {
  const a = valueToAngle(value);
  const innerR = RADIUS - 8;
  const outerR = RADIUS + 8;
  const x0 = Math.round(CX + Math.cos(a) * innerR);
  const y0 = Math.round(CY + Math.sin(a) * innerR);
  const x1 = Math.round(CX + Math.cos(a) * outerR);
  const y1 = Math.round(CY + Math.sin(a) * outerR);
  drawPixelLine(ctx, x0, y0, x1, y1, color);
}
