import { CANVAS_WIDTH, CANVAS_HEIGHT } from './renderGrid'

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
}

export function createParticles(count: number): Particle[] {
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() < 0.7 ? 1 : 2,
      color: `rgba(255, 255, 255, ${0.06 + Math.random() * 0.08})`,
    })
  }
  return particles
}

export function updateParticles(particles: Particle[], _dt: number): void {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]!
    const isBurst = p.color.startsWith('rgba(231, 76, 60')

    if (isBurst) {
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.95
      p.vy *= 0.95
      p.size *= 0.97
      if (p.size < 0.3) {
        particles.splice(i, 1)
        continue
      }
    } else {
      p.x += p.vx
      p.y += p.vy

      if (Math.random() < 0.005) {
        p.vx += (Math.random() - 0.5) * 0.3
        p.vy += (Math.random() - 0.5) * 0.3
        const maxSpeed = 0.6
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed
          p.vy = (p.vy / speed) * maxSpeed
        }
      }

      if (p.x < -2) p.x = CANVAS_WIDTH + 2
      if (p.x > CANVAS_WIDTH + 2) p.x = -2
      if (p.y < -2) p.y = CANVAS_HEIGHT + 2
      if (p.y > CANVAS_HEIGHT + 2) p.y = -2
    }
  }
}

export function renderParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  for (const p of particles) {
    ctx.fillStyle = p.color
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
  }
}
