import { useEffect, useRef, useCallback } from 'react'
import { TILE_SIZE, GRID_COLS, GRID_ROWS } from './renderers'

export interface TileInteraction {
  hoveredTile: { col: number; row: number } | null
  selectedDistrict: number | null
  isHovering: boolean
}

export function useTileInteraction(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onDistrictClick?: (districtId: number) => void,
) {
  const stateRef = useRef<TileInteraction>({
    hoveredTile: null,
    selectedDistrict: null,
    isHovering: false,
  })
  const onClickRef = useRef(onDistrictClick)

  useEffect(() => {
    onClickRef.current = onDistrictClick
  })

  const getTile = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const col = Math.floor(x / TILE_SIZE)
    const row = Math.floor(y / TILE_SIZE)
    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) return null
    return { col, row }
  }, [canvasRef])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseMove = (e: MouseEvent) => {
      const tile = getTile(e.clientX, e.clientY)
      if (tile) {
        stateRef.current.hoveredTile = tile
        stateRef.current.isHovering = true
      } else {
        stateRef.current.hoveredTile = null
        stateRef.current.isHovering = false
      }
    }

    const handleMouseLeave = () => {
      stateRef.current.hoveredTile = null
      stateRef.current.isHovering = false
    }

    const handleClick = (e: MouseEvent) => {
      const tile = getTile(e.clientX, e.clientY)
      if (tile && onClickRef.current) {
        const districtId = getDistrictId(tile.col, tile.row)
        stateRef.current.selectedDistrict = districtId
        onClickRef.current(districtId)
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('click', handleClick)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('click', handleClick)
    }
  }, [canvasRef, getTile])

  return stateRef
}

function getDistrictId(col: number, row: number): number {
  const midCol = GRID_COLS / 2
  const midRow = GRID_ROWS / 2
  if (col < midCol && row < midRow) return 0
  if (col >= midCol && row < midRow) return 1
  if (col < midCol && row >= midRow) return 2
  return 3
}
