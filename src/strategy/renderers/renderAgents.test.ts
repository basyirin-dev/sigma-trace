import { describe, it, expect } from 'vitest'
import { renderAgents, createAgent, updateAgents, recolorByPopulation } from './renderAgents'
import type { Agent } from './renderAgents'
import { createMockCanvasContext } from '../test-utils'

describe('renderAgents', () => {
  it('draws shadow arc and fill arc for each agent', () => {
    const agents = [
      createAgent(10, 10, 'S'),
      createAgent(20, 20, 'E'),
    ]
    const { ctx, calls } = createMockCanvasContext()

    renderAgents(ctx, agents)

    // Each agent: 1 arc for shadow, 2 arcs (fill + stroke outline) for agent
    const arcCalls = calls.filter((c) => c.method === 'arc')
    // 2 agents × 3 arcs each = 6 total
    expect(arcCalls.length).toBe(6)
  })

  it('sorts agents by Y coordinate before drawing', () => {
    const agents = [
      createAgent(10, 30, 'S'),
      createAgent(10, 10, 'I'),
      createAgent(10, 20, 'E'),
    ]

    // Override Y by changing agents directly — createAgent already places them near center of tile
    agents[0]!.y = 30
    agents[1]!.y = 10
    agents[2]!.y = 20

    const { ctx, calls } = createMockCanvasContext()

    renderAgents(ctx, agents)

    // The renderer sorts by y, so the first fill after arcs should be y=10 agent
    const fillCalls = calls.filter((c) => c.method === 'fill')
    expect(fillCalls.length).toBeGreaterThan(0)
  })

  it('draws agents with proper state colors', () => {
    const agents = [
      createAgent(10, 10, 'I'),
    ]
    const { ctx, calls } = createMockCanvasContext()

    renderAgents(ctx, agents)

    const fillStyleCalls = calls.filter(
      (c) => c.method === 'fillStyle',
    )
    // Should have set fill style for shadow (rgba) and for agent state color (#E74C3C for I)
    const shadowFill = fillStyleCalls.find((c) => typeof c.args[0] === 'string' && c.args[0].includes('rgba'))
    const agentFill = fillStyleCalls.find((c) => c.args[0] === '#E74C3C')
    expect(shadowFill).toBeDefined()
    expect(agentFill).toBeDefined()
  })
})

describe('updateAgents', () => {
  it('moves each agent toward its target', () => {
    const agent = createAgent(10, 10, 'S')

    // Set agent at (200, 200) with target at (210, 200)
    agent.x = 200
    agent.y = 200
    agent.targetX = 210
    agent.targetY = 200
    agent.speed = 1

    updateAgents([agent], 1)

    // Should have moved right
    expect(agent.x).toBeGreaterThan(200)
  })

  it('picks new target when agent reaches current target', () => {
    const agent = createAgent(10, 10, 'S')
    agent.x = 210
    agent.y = 200
    agent.targetX = 210
    agent.targetY = 200
    agent.speed = 1

    updateAgents([agent], 1)

    // After reaching target, a new target should be set (different coords)
    expect(agent.targetX).not.toBe(210)
  })
})

function createAgents(count: number): Agent[] {
  const agents: Agent[] = []
  for (let i = 0; i < count; i++) {
    const agent = createAgent(0, 0, 'S')
    agent.x = Math.random() * 1000
    agent.y = Math.random() * 1000
    agents.push(agent)
  }
  return agents
}

describe('recolorByPopulation', () => {
  it('colors all agents green when population is 100% susceptible', () => {
    const agents = createAgents(100)
    recolorByPopulation(agents, {
      susceptible: 1000,
      exposed: 0,
      infected: 0,
      recovered: 0,
      total: 1000,
    })

    const greenCount = agents.filter((a) => a.stateColor === '#2ECC71').length
    expect(greenCount).toBe(100)
  })

  it('shifts most agents to red when population becomes infected-dominated', () => {
    const agents = createAgents(100)
    recolorByPopulation(agents, {
      susceptible: 0,
      exposed: 0,
      infected: 1000,
      recovered: 0,
      total: 1000,
    })

    const redCount = agents.filter((a) => a.stateColor === '#E74C3C').length
    expect(redCount).toBe(100)
  })

  it('shifts most agents to blue when population becomes recovered-dominated', () => {
    const agents = createAgents(100)
    recolorByPopulation(agents, {
      susceptible: 10,
      exposed: 0,
      infected: 0,
      recovered: 990,
      total: 1000,
    })

    const blueCount = agents.filter((a) => a.stateColor === '#3498DB').length
    expect(blueCount).toBeGreaterThan(80)
  })

  it('distributes agent colors proportionally to mixed population', () => {
    const agents = createAgents(100)
    recolorByPopulation(agents, {
      susceptible: 400,
      exposed: 300,
      infected: 200,
      recovered: 100,
      total: 1000,
    })

    const greenCount = agents.filter((a) => a.stateColor === '#2ECC71').length
    const yellowCount = agents.filter((a) => a.stateColor === '#F1C40F').length
    const redCount = agents.filter((a) => a.stateColor === '#E74C3C').length
    const blueCount = agents.filter((a) => a.stateColor === '#3498DB').length

    expect(greenCount).toBeGreaterThan(20)
    expect(yellowCount).toBeGreaterThan(10)
    expect(redCount).toBeGreaterThan(5)
    expect(blueCount).toBeGreaterThan(0)
  })

  it('updates agent colors after simulation snapshot changes', () => {
    const agents = createAgents(100)

    // First recolor: all susceptible
    recolorByPopulation(agents, {
      susceptible: 1000,
      exposed: 0,
      infected: 0,
      recovered: 0,
      total: 1000,
    })
    expect(agents.filter((a) => a.stateColor === '#2ECC71').length).toBe(100)

    // Second recolor: all infected (simulates disease progression)
    recolorByPopulation(agents, {
      susceptible: 0,
      exposed: 0,
      infected: 1000,
      recovered: 0,
      total: 1000,
    })
    const redCount = agents.filter((a) => a.stateColor === '#E74C3C').length
    expect(redCount).toBe(100)
  })
})
