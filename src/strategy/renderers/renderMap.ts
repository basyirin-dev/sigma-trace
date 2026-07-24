import { GRID_COLS, GRID_ROWS, TILE_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } from './renderGrid'
import type { Tile } from './renderGrid'

const TILE_PX = 16

interface Assets {
  grass: HTMLImageElement | null
  stone: HTMLImageElement | null
}

const assets: Assets = { grass: null, stone: null }

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

export async function preloadMapAssets(): Promise<void> {
  const [g, s] = await Promise.all([
    loadImage('/assets/Pixel Art Top Down - Basic v1.2.3/Texture/TX Tileset Grass.png'),
    loadImage('/assets/Pixel Art Top Down - Basic v1.2.3/Texture/TX Tileset Stone Ground.png'),
  ])
  assets.grass = g
  assets.stone = s
}

const DISTRICT_COLORS: Record<number, string> = {
  0: '#8B4513',
  1: '#2C7A7B',
  2: '#B8860B',
  3: '#4A7C59',
}

interface Building {
  x: number
  y: number
  w: number
  h: number
  color: string
  opacity: number
}

const buildings: Building[] = []
let seeded = false

function seededRng(step: number): number {
  let rng = 42 + step
  rng = (rng * 16807) % 2147483647
  return rng / 2147483647
}

function isRoad(col: number, row: number): boolean {
  const mc = GRID_COLS / 2
  const mr = GRID_ROWS / 2
  return (row >= mr - 2 && row <= mr + 1) || (col >= mc - 2 && col <= mc + 1)
}

function getDist(col: number, row: number): number {
  if (col < GRID_COLS / 2 && row < GRID_ROWS / 2) return 0
  if (col >= GRID_COLS / 2 && row < GRID_ROWS / 2) return 1
  if (col < GRID_COLS / 2 && row >= GRID_ROWS / 2) return 2
  return 3
}

function seedBuildings(): Building[] {
  if (seeded) return buildings
  seeded = true

  const clusterCenters: Array<{ col: number; row: number }> = []
  for (let row = 3; row < GRID_ROWS - 3; row += 3 + Math.floor(seededRng(row * GRID_COLS) * 3)) {
    for (let col = 3; col < GRID_COLS - 3; col += 3 + Math.floor(seededRng(row * GRID_COLS + col) * 3)) {
      if (isRoad(col, row)) continue
      if (seededRng(row * GRID_COLS + col + 200) < 0.55) {
        clusterCenters.push({ col, row })
      }
    }
  }

  for (const cc of clusterCenters) {
    const dist = getDist(cc.col, cc.row)
    const color = DISTRICT_COLORS[dist] ?? '#666'
    const count = 1 + Math.floor(seededRng(cc.col * 100 + cc.row) * 3)
    for (let i = 0; i < count; i++) {
      const offCol = (seededRng(cc.col * 1000 + cc.row * 100 + i * 10) - 0.5) * 2.5
      const offRow = (seededRng(cc.col * 2000 + cc.row * 200 + i * 20) - 0.5) * 2.5
      const bw = 6 + Math.floor(seededRng(cc.col * 3000 + cc.row * 300 + i * 30) * 8)
      const bh = 6 + Math.floor(seededRng(cc.col * 4000 + cc.row * 400 + i * 40) * 8)
      const px = Math.round((cc.col + offCol) * TILE_SIZE + (TILE_SIZE - bw) / 2)
      const py = Math.round((cc.row + offRow) * TILE_SIZE + (TILE_SIZE - bh) / 2)
      const opacity = 0.25 + seededRng(cc.col * 5000 + cc.row * 500 + i * 50) * 0.2
      buildings.push({ x: px, y: py, w: bw, h: bh, color, opacity })
    }
  }

  return buildings
}

export function renderGround(ctx: CanvasRenderingContext2D, _tiles: Tile[][]) {
  const grass = assets.grass
  if (!grass || !grass.complete || grass.naturalWidth === 0) {
    ctx.fillStyle = '#5a7a3a'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    return
  }

  ctx.imageSmoothingEnabled = false
  const cols = Math.floor(grass.naturalWidth / TILE_PX)
  const total = cols * Math.floor(grass.naturalHeight / TILE_PX)
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const ti = (row * GRID_COLS + col) % total
      const sx = (ti % cols) * TILE_PX
      const sy = Math.floor(ti / cols) * TILE_PX
      ctx.drawImage(grass, sx, sy, TILE_PX, TILE_PX, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    }
  }
}

export function renderRoads(ctx: CanvasRenderingContext2D) {
  const stone = assets.stone
  const mc = GRID_COLS / 2
  const mr = GRID_ROWS / 2

  if (!stone || stone.naturalWidth === 0) {
    ctx.fillStyle = '#5a5a6a'
    ctx.fillRect(0, (mr - 1) * TILE_SIZE, CANVAS_WIDTH, TILE_SIZE * 3)
    ctx.fillRect((mc - 1) * TILE_SIZE, 0, TILE_SIZE * 3, CANVAS_HEIGHT)
    return
  }

  const sc = Math.floor(stone.naturalWidth / TILE_PX)
  for (let col = 0; col < GRID_COLS; col++) {
    for (let dr = -1; dr <= 0; dr++) {
      const row = mr + dr
      const ti = (col * 7 + row * 3) % 50 + 10
      const sx = (ti % sc) * TILE_PX
      const sy = Math.floor(ti / sc) * TILE_PX
      ctx.drawImage(stone, sx, sy, TILE_PX, TILE_PX, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    }
    for (let dr = 1; dr <= 2; dr++) {
      ctx.fillStyle = '#4a4a5a'
      ctx.fillRect(col * TILE_SIZE, (mr + dr) * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    }
  }

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let dc = -1; dc <= 0; dc++) {
      const col = mc + dc
      const ti = (row * 5 + col * 11) % 50 + 10
      const sx = (ti % sc) * TILE_PX
      const sy = Math.floor(ti / sc) * TILE_PX
      ctx.drawImage(stone, sx, sy, TILE_PX, TILE_PX, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    }
    for (let dc = 1; dc <= 2; dc++) {
      ctx.fillStyle = '#4a4a5a'
      ctx.fillRect((mc + dc) * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
    }
  }

  ctx.fillStyle = '#5a5a6a'
  ctx.fillRect((mc - 1) * TILE_SIZE, (mr - 1) * TILE_SIZE, TILE_SIZE * 4, TILE_SIZE * 4)
}

export function renderBuildings(ctx: CanvasRenderingContext2D) {
  seedBuildings()

  for (const b of buildings) {
    ctx.globalAlpha = b.opacity
    ctx.fillStyle = b.color
    ctx.fillRect(b.x, b.y, b.w, b.h)
    ctx.fillStyle = 'rgba(0,0,0,0.15)'
    ctx.fillRect(b.x + 1, b.y + 1, b.w, b.h)
  }
  ctx.globalAlpha = 1
}

export function renderMap(ctx: CanvasRenderingContext2D, tiles: Tile[][]) {
  renderGround(ctx, tiles)
  renderRoads(ctx)
  renderBuildings(ctx)
}
