import { GRID_COLS, GRID_ROWS, TILE_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } from './renderGrid';
import type { Tile } from './renderGrid';

const TILE_PX = 16;

interface GrassAssets {
  grass: HTMLImageElement | null;
  plant: HTMLImageElement | null;
}

const grassAssets: GrassAssets = { grass: null, plant: null };

interface NyknckBuilding {
  img: HTMLImageElement;
  scale: number;
}

interface DistrictBuildingSet {
  primary: NyknckBuilding;
  secondary: NyknckBuilding | null;
  fallbackColor: string;
}

const nyknckBuildings: Record<string, NyknckBuilding> = {};
const districtBuildings: Record<number, DistrictBuildingSet> = {};

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function preloadMapAssets(): Promise<void> {
  const [g, p] = await Promise.all([
    loadImage('/assets/Pixel Art Top Down - Basic v1.2.3/Texture/TX Tileset Grass.png'),
    loadImage('/assets/Pixel Art Top Down - Basic v1.2.3/Texture/TX Plant.png'),
  ]);
  grassAssets.grass = g;
  grassAssets.plant = p;

  const nyknckDefs: Array<{ key: string; file: string; scale: number }> = [
    { key: 'red', file: '/assets/tiles/buildings/nyknck/red_48x96.png', scale: 1 },
    { key: 'blue', file: '/assets/tiles/buildings/nyknck/blue_48x96.png', scale: 1 },
    { key: 'cyan', file: '/assets/tiles/buildings/nyknck/cyan_48x96.png', scale: 1 },
    { key: 'hex', file: '/assets/tiles/buildings/nyknck/hex_80x96.png', scale: 1 },
    { key: 'green_shop', file: '/assets/tiles/buildings/nyknck/green_shop_64x48.png', scale: 1 },
    { key: 'teal_shop', file: '/assets/tiles/buildings/nyknck/teal_shop_48x48.png', scale: 1 },
    { key: 'purple_shop', file: '/assets/tiles/buildings/nyknck/purple_shop_48x48.png', scale: 1 },
  ];

  const imgs = await Promise.all(nyknckDefs.map((d) => loadImage(d.file)));
  nyknckDefs.forEach((d, i) => {
    const img = imgs[i];
    if (img) nyknckBuildings[d.key] = { img, scale: d.scale };
  });

  districtBuildings[0] = {
    primary: nyknckBuildings['red']!,
    secondary: nyknckBuildings['blue']!,
    fallbackColor: '#A0522D',
  };
  districtBuildings[1] = {
    primary: nyknckBuildings['cyan']!,
    secondary: nyknckBuildings['teal_shop']!,
    fallbackColor: '#2C7A7B',
  };
  districtBuildings[2] = {
    primary: nyknckBuildings['blue']!,
    secondary: nyknckBuildings['hex']!,
    fallbackColor: '#B8860B',
  };
  districtBuildings[3] = {
    primary: nyknckBuildings['green_shop']!,
    secondary: nyknckBuildings['purple_shop']!,
    fallbackColor: '#4A7C59',
  };
}

const DISTRICT_GROUND_TINTS: Record<number, string> = {
  0: 'rgba(139, 69, 19, 0.14)',
  1: 'rgba(44, 122, 123, 0.12)',
  2: 'rgba(184, 134, 11, 0.10)',
  3: 'rgba(74, 124, 89, 0.12)',
};

const DISTRICT_LABELS: Record<number, string> = {
  0: 'FOUNDRY',
  1: 'HARBORVIEW',
  2: 'UPTOWN',
  3: 'CAMPUS',
};

const DISTRICT_LABEL_COLORS: Record<number, string> = {
  0: '#A0522D',
  1: '#3D8B8C',
  2: '#D4A017',
  3: '#5B8C5C',
};

interface SpritePlacement {
  x: number;
  y: number;
  w: number;
  h: number;
  districtId: number;
  useSecondary: boolean;
}

const placements: SpritePlacement[] = [];
let seeded = false;

function seededRng(step: number): number {
  let rng = (step * 2654435761) >>> 0;
  rng = ((rng ^ (rng >>> 16)) * 0x45d9f3b) >>> 0;
  rng = ((rng ^ (rng >>> 16)) * 0x45d9f3b) >>> 0;
  rng = (rng ^ (rng >>> 16)) >>> 0;
  return rng / 4294967296;
}

function isMainRoad(col: number, row: number): boolean {
  const mc = GRID_COLS / 2;
  const mr = GRID_ROWS / 2;
  return (row >= mr - 2 && row <= mr + 1) || (col >= mc - 2 && col <= mc + 1);
}

function isSubRoad(col: number, row: number, distId: number): boolean {
  const rng = seededRng(distId * 1000 + row * GRID_COLS + col);
  return rng < 0.06;
}

function getDist(col: number, row: number): number {
  if (col < GRID_COLS / 2 && row < GRID_ROWS / 2) return 0;
  if (col >= GRID_COLS / 2 && row < GRID_ROWS / 2) return 1;
  if (col < GRID_COLS / 2 && row >= GRID_ROWS / 2) return 2;
  return 3;
}

function seedPlacements(): void {
  if (seeded) return;

  const hasAny = Object.values(districtBuildings).some((d) => d?.primary);
  if (!hasAny) return;

  seeded = true;

  const districtPositions: Array<{
    dist: number;
    col: number;
    row: number;
    useSecondary: boolean;
  }> = [
    { dist: 0, col: 6, row: 6, useSecondary: false },
    { dist: 0, col: 14, row: 10, useSecondary: true },
    { dist: 0, col: 8, row: 18, useSecondary: false },
    { dist: 0, col: 18, row: 6, useSecondary: true },
    { dist: 0, col: 12, row: 15, useSecondary: false },
    { dist: 1, col: 32, row: 6, useSecondary: false },
    { dist: 1, col: 40, row: 12, useSecondary: true },
    { dist: 1, col: 36, row: 18, useSecondary: false },
    { dist: 1, col: 44, row: 6, useSecondary: true },
    { dist: 1, col: 34, row: 14, useSecondary: false },
    { dist: 2, col: 6, row: 32, useSecondary: false },
    { dist: 2, col: 14, row: 38, useSecondary: true },
    { dist: 2, col: 8, row: 44, useSecondary: false },
    { dist: 2, col: 18, row: 34, useSecondary: true },
    { dist: 2, col: 12, row: 42, useSecondary: false },
    { dist: 3, col: 32, row: 32, useSecondary: false },
    { dist: 3, col: 40, row: 38, useSecondary: true },
    { dist: 3, col: 36, row: 44, useSecondary: false },
    { dist: 3, col: 44, row: 34, useSecondary: true },
    { dist: 3, col: 34, row: 40, useSecondary: false },
  ];

  for (const pos of districtPositions) {
    const dbs = districtBuildings[pos.dist];
    if (!dbs) continue;

    const bld = pos.useSecondary && dbs.secondary ? dbs.secondary : dbs.primary;
    if (!bld) continue;

    const sw = bld.img.naturalWidth * bld.scale;
    const sh = bld.img.naturalHeight * bld.scale;
    const cx = (pos.col + 0.5) * TILE_SIZE;
    const cy = (pos.row + 0.5) * TILE_SIZE;

    placements.push({
      x: Math.round(cx - sw / 2),
      y: Math.round(cy - sh / 2),
      w: sw,
      h: sh,
      districtId: pos.dist,
      useSecondary: pos.useSecondary,
    });
  }
}

export function renderGround(ctx: CanvasRenderingContext2D, tiles: Tile[][]) {
  const grass = grassAssets.grass;
  if (!grass || !grass.complete || grass.naturalWidth === 0) {
    ctx.fillStyle = '#5a7a3a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    return;
  }

  ctx.imageSmoothingEnabled = false;
  const cols = Math.floor(grass.naturalWidth / TILE_PX);
  const total = cols * Math.floor(grass.naturalHeight / TILE_PX);
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const ti = (row * GRID_COLS + col) % total;
      const sx = (ti % cols) * TILE_PX;
      const sy = Math.floor(ti / cols) * TILE_PX;
      ctx.drawImage(
        grass,
        sx,
        sy,
        TILE_PX,
        TILE_PX,
        col * TILE_SIZE,
        row * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
      );
    }
  }

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const tile = tiles[row]?.[col];
      if (!tile) continue;
      const tint = DISTRICT_GROUND_TINTS[tile.districtId];
      if (tint) {
        ctx.fillStyle = tint;
        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

export function renderRoads(ctx: CanvasRenderingContext2D) {
  const mc = GRID_COLS / 2;
  const mr = GRID_ROWS / 2;

  ctx.fillStyle = '#2a2a3e';
  ctx.fillRect(0, (mr - 1) * TILE_SIZE, CANVAS_WIDTH, TILE_SIZE * 3);
  ctx.fillRect((mc - 1) * TILE_SIZE, 0, TILE_SIZE * 3, CANVAS_HEIGHT);

  ctx.fillStyle = '#3a3a5e';
  ctx.fillRect(0, (mr - 1) * TILE_SIZE + 2, CANVAS_WIDTH, TILE_SIZE * 3 - 4);
  ctx.fillRect((mc - 1) * TILE_SIZE + 2, 0, TILE_SIZE * 3 - 4, CANVAS_HEIGHT);

  ctx.fillStyle = '#5a5a7e';
  ctx.fillRect(0, mr * TILE_SIZE, CANVAS_WIDTH, 1);
  ctx.fillRect(mc * TILE_SIZE, 0, 1, CANVAS_HEIGHT);

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      if (isMainRoad(col, row)) continue;
      const dist = getDist(col, row);
      if (isSubRoad(col, row, dist)) {
        ctx.fillStyle = '#2a2a3e';
        ctx.fillRect(col * TILE_SIZE + 4, row * TILE_SIZE + 8, TILE_SIZE - 8, 4);
        ctx.fillStyle = '#4a4a6e';
        ctx.fillRect(col * TILE_SIZE + 5, row * TILE_SIZE + 9, TILE_SIZE - 10, 1);
      }
    }
  }
}

export function renderBuildings(ctx: CanvasRenderingContext2D) {
  seedPlacements();

  for (const p of placements) {
    const dbs = districtBuildings[p.districtId];
    if (!dbs) continue;

    const bld = p.useSecondary ? dbs.secondary : dbs.primary;
    if (!bld || !bld.img.complete || bld.img.naturalWidth === 0) continue;

    ctx.drawImage(bld.img, 0, 0, bld.img.naturalWidth, bld.img.naturalHeight, p.x, p.y, p.w, p.h);
  }
}

export function renderDistrictLabels(ctx: CanvasRenderingContext2D) {
  const quadrants = [
    { colStart: 0, rowStart: 0, colEnd: GRID_COLS / 2, rowEnd: GRID_ROWS / 2, id: 0 },
    { colStart: GRID_COLS / 2, rowStart: 0, colEnd: GRID_COLS, rowEnd: GRID_ROWS / 2, id: 1 },
    { colStart: 0, rowStart: GRID_ROWS / 2, colEnd: GRID_COLS / 2, rowEnd: GRID_ROWS, id: 2 },
    {
      colStart: GRID_COLS / 2,
      rowStart: GRID_ROWS / 2,
      colEnd: GRID_COLS,
      rowEnd: GRID_ROWS,
      id: 3,
    },
  ];

  for (const q of quadrants) {
    const cx = ((q.colStart + q.colEnd) / 2) * TILE_SIZE;
    const cy = ((q.rowStart + q.rowEnd) / 2) * TILE_SIZE;

    ctx.save();
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    const label = DISTRICT_LABELS[q.id] ?? '';
    const metrics = ctx.measureText(label);
    const padX = 6;
    const padY = 4;
    ctx.fillRect(
      cx - metrics.width / 2 - padX,
      cy - 10 - padY,
      metrics.width + padX * 2,
      22 + padY * 2,
    );

    ctx.fillStyle = DISTRICT_LABEL_COLORS[q.id] ?? '#ccc';
    ctx.globalAlpha = 0.7;
    ctx.fillText(label, cx, cy);

    ctx.globalAlpha = 0.25;
    ctx.fillStyle = DISTRICT_LABEL_COLORS[q.id] ?? '#ccc';
    const labelW = ctx.measureText(label).width;
    ctx.fillRect(cx - labelW / 2, cy + 10, labelW, 1);
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

export function renderMap(ctx: CanvasRenderingContext2D, tiles: Tile[][]) {
  renderGround(ctx, tiles);
  renderRoads(ctx);
  renderBuildings(ctx);
  renderDistrictLabels(ctx);
}
