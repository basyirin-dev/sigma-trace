import { describe, it, expect, vi } from 'vitest'
import { createMockCanvasContext } from '../test-utils'
import { createParticles, updateParticles, renderParticles, type Particle } from './renderParticles'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './renderGrid'

describe('createParticles', () => {
  it('creates requested number of particles', () => {
    const particles = createParticles(50)
    expect(particles.length).toBe(50)
  })

  it('each particle has required properties', () => {
    const particles = createParticles(5)
    for (const p of particles) {
      expect(p).toHaveProperty('x')
      expect(p).toHaveProperty('y')
      expect(p).toHaveProperty('vx')
      expect(p).toHaveProperty('vy')
      expect(p).toHaveProperty('size')
      expect(p).toHaveProperty('color')
    }
  })

  it('particles are positioned within canvas bounds', () => {
    const particles = createParticles(20)
    for (const p of particles) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(CANVAS_WIDTH)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(CANVAS_HEIGHT)
    }
  })
})

describe('updateParticles', () => {
  it('moves particles over time', () => {
    const particles: Particle[] = [
      { x: 500, y: 500, vx: 0.2, vy: -0.1, size: 1, color: 'rgba(255,255,255,0.1)' },
    ]
    const before = { x: particles[0]!.x, y: particles[0]!.y }
    updateParticles(particles, 1)
    expect(particles[0]!.x).not.toBe(before.x)
    expect(particles[0]!.y).not.toBe(before.y)
  })

  it('wraps particles around canvas edges', () => {
    const particles: Particle[] = [
      { x: -5, y: 500, vx: -0.1, vy: 0, size: 1, color: 'rgba(255,255,255,0.1)' },
    ]
    updateParticles(particles, 1)
    expect(particles[0]!.x).toBeGreaterThanOrEqual(0)
  })
})

describe('renderParticles', () => {
  it('calls fillRect for each particle', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const { ctx, calls } = createMockCanvasContext()
    const particles = createParticles(5)
    renderParticles(ctx, particles)
    const fillRects = calls.filter((c) => c.method === 'fillRect')
    expect(fillRects.length).toBe(5)
    vi.restoreAllMocks()
  })
})
