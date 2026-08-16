export const GRID_COLS = 50;
export const GRID_ROWS = 50;
export const TILE_SIZE = 20;
export const CANVAS_WIDTH = GRID_COLS * TILE_SIZE;
export const CANVAS_HEIGHT = GRID_ROWS * TILE_SIZE;

export const DISTRICT_QUADRANTS: Array<{
  id: string;
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
}> = [
  { id: 'foundry', colStart: 0, colEnd: GRID_COLS / 2, rowStart: 0, rowEnd: GRID_ROWS / 2 },
  {
    id: 'harborview',
    colStart: GRID_COLS / 2,
    colEnd: GRID_COLS,
    rowStart: 0,
    rowEnd: GRID_ROWS / 2,
  },
  { id: 'uptown', colStart: 0, colEnd: GRID_COLS / 2, rowStart: GRID_ROWS / 2, rowEnd: GRID_ROWS },
  {
    id: 'campus',
    colStart: GRID_COLS / 2,
    colEnd: GRID_COLS,
    rowStart: GRID_ROWS / 2,
    rowEnd: GRID_ROWS,
  },
];

export interface Tile {
  col: number;
  row: number;
  districtId: number;
}

const DISTRICT_COLORS: Record<number, string> = {
  0: '#8B4513',
  1: '#2C7A7B',
  2: '#B8860B',
  3: '#4A7C59',
};

const DISTRICT_NAMES = ['foundry', 'harborview', 'uptown', 'campus'];
const DISTRICT_BORDER = '#1a1a2e';

export function renderGrid(ctx: CanvasRenderingContext2D, tiles: Tile[][]): void {
  for (let row = 0; row < GRID_ROWS; row++) {
    const tileRow = tiles[row];
    if (!tileRow) continue;
    for (let col = 0; col < GRID_COLS; col++) {
      const tile = tileRow[col];
      if (!tile) continue;
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;

      ctx.fillStyle = DISTRICT_COLORS[tile.districtId] ?? '#333';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

      const neighborRight = col < GRID_COLS - 1 ? tileRow[col + 1] : undefined;
      const neighborBottom = row < GRID_ROWS - 1 ? tiles[row + 1]?.[col] : undefined;

      const isRightBorder =
        neighborRight !== undefined && neighborRight.districtId !== tile.districtId;
      const isBottomBorder =
        neighborBottom !== undefined && neighborBottom.districtId !== tile.districtId;

      if (isRightBorder || isBottomBorder) {
        ctx.fillStyle = DISTRICT_BORDER;
        if (isRightBorder) ctx.fillRect(x + TILE_SIZE - 1, y, 1, TILE_SIZE);
        if (isBottomBorder) ctx.fillRect(x, y + TILE_SIZE - 1, TILE_SIZE, 1);
      }
    }
  }
}

let glowCanvas: HTMLCanvasElement | null = null;
let lastGlowKey = '';

function buildGlowKey(tiles: Tile[][], r0ByDistrict: Record<string, number>): string {
  // Only district-level R0 values affect the glow, so key on those + tile count
  return `${r0ByDistrict.foundry},${r0ByDistrict.harborview},${r0ByDistrict.uptown},${r0ByDistrict.campus}_t${tiles.length}`;
}

export function renderTileGlow(
  ctx: CanvasRenderingContext2D,
  tiles: Tile[][],
  r0ByDistrict: Record<string, number>,
): void {
  const key = buildGlowKey(tiles, r0ByDistrict);
  if (key === lastGlowKey && glowCanvas) {
    ctx.drawImage(glowCanvas, 0, 0);
    return;
  }

  if (!glowCanvas) {
    glowCanvas = document.createElement('canvas');
    glowCanvas.width = CANVAS_WIDTH;
    glowCanvas.height = CANVAS_HEIGHT;
  }

  const offCtx = glowCanvas.getContext('2d');
  if (!offCtx) {
    // Fallback: render directly
    renderTileGlowDirect(ctx, tiles, r0ByDistrict);
    return;
  }

  offCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  renderTileGlowDirect(offCtx, tiles, r0ByDistrict);
  lastGlowKey = key;
  ctx.drawImage(glowCanvas, 0, 0);
}

export function invalidateGlowCache(): void {
  lastGlowKey = '';
  glowCanvas = null;
}

function renderTileGlowDirect(
  ctx: CanvasRenderingContext2D,
  tiles: Tile[][],
  r0ByDistrict: Record<string, number>,
): void {
  for (let row = 0; row < GRID_ROWS; row++) {
    const tileRow = tiles[row];
    if (!tileRow) continue;
    for (let col = 0; col < GRID_COLS; col++) {
      const tile = tileRow[col];
      if (!tile) continue;
      const districtName = DISTRICT_NAMES[tile.districtId];
      if (!districtName) continue;
      const r0 = r0ByDistrict[districtName] ?? 0;
      if (r0 <= 1.0) continue;

      const intensity = Math.min(0.35, (r0 - 1.0) * 0.15);
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;
      ctx.fillStyle = `rgba(255, 165, 0, ${intensity.toFixed(3)})`;
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    }
  }
}

export function createDistrictTiles(districtMap: number[][]): Tile[][] {
  const tiles: Tile[][] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    const mapRow = districtMap[row];
    const tileRow: Tile[] = [];
    for (let col = 0; col < GRID_COLS; col++) {
      const districtId = mapRow?.[col] ?? 0;
      tileRow.push({ col, row, districtId });
    }
    tiles.push(tileRow);
  }
  return tiles;
}
