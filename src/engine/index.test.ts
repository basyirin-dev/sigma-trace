import { describe, it, expect } from 'vitest'
import {
  simulateTick,
  computeR0,
  computeSigma,
  detectSigmaTrap,
  classifyPhase,
  getDistrict,
  DISTRICTS,
  getIntervention,
  INTERVENTIONS,
} from './index'
import type {
  PopulationState,
  District,
  Phase,
  ActiveEffect,
  SimulationSnapshot,
  Intervention,
  SimulationParams,
  SimulationConfig,
} from './index'
import { buildDefaultConfig } from './simulate'

const config = buildDefaultConfig()

describe('engine barrel exports', () => {
  it('simulateTick is callable and returns complete snapshot', () => {
    const params: SimulationParams = {
      population: { susceptible: 100, exposed: 0, infected: 0, recovered: 0, total: 100 },
      sigma: 78,
      r0: 1.2,
      activeEffects: [],
      time: 0,
    }
    const result = simulateTick(params, config)
    expect(result.state.total).toBe(100)
    expect(result.sigma).not.toBe(0)
    expect(result.phase).not.toBe('')
  })

  it('computeR0 is callable', () => {
    const state: PopulationState = { susceptible: 100, exposed: 0, infected: 0, recovered: 0, total: 100 }
    const params: SimulationConfig = {
      baseR0: 2.0, literacyRate: 0, factCheckCoverage: 0,
      algorithmAuditActive: false, recoveryRate: 0.1, incubationRate: 0.2,
    }
    const r0 = computeR0(state, params)
    expect(r0).toBeGreaterThan(0)
  })

  it('computeSigma is callable', () => {
    const state: PopulationState = { susceptible: 80, exposed: 0, infected: 20, recovered: 0, total: 100 }
    const sigma = computeSigma(state, 50, [], 1.0)
    expect(sigma).toBeGreaterThanOrEqual(0)
  })

  it('detectSigmaTrap is callable', () => {
    expect(detectSigmaTrap([25, 22, 14, 15, 16, 17, 9, 8, 7, 6, 5])).toBe(true)
    expect(detectSigmaTrap([30, 45, 55])).toBe(false)
  })

  it('SimulationParams type is importable from barrel', () => {
    const params: SimulationParams = {
      population: { susceptible: 100, exposed: 0, infected: 0, recovered: 0, total: 100 },
      sigma: 50,
      r0: 1.0,
      activeEffects: [],
      time: 0,
    }
    expect(params.sigma).toBe(50)
  })

  it('classifyPhase is callable', () => {
    expect(classifyPhase(80, 0.5)).toBe('calm')
    expect(classifyPhase(15, 0.5)).toBe('trap')
  })

  it('getDistrict returns correct district', () => {
    const foundry = getDistrict('foundry')
    expect(foundry).toBeDefined()
    expect(foundry!.name).toBe('Foundry')
  })

  it('DISTRICTS has 4 entries', () => {
    expect(DISTRICTS).toHaveLength(4)
  })

  it('getIntervention returns correct intervention', () => {
    const fc = getIntervention('fact-check')
    expect(fc).toBeDefined()
    expect(fc!.name).toBe('Fact-Check Bureau')
  })

  it('INTERVENTIONS has entries', () => {
    expect(INTERVENTIONS.length).toBeGreaterThan(0)
  })

  it('types are importable from barrel', () => {
    const d: District = DISTRICTS[0]!
    expect(d.id).toBe('foundry')

    const phase: Phase = 'calm'
    expect(phase).toBe('calm')

    const effect: ActiveEffect = { interventionId: 'test', remainingTicks: 1, r0Delta: 0, sigmaDelta: 0 }
    expect(effect.interventionId).toBe('test')

    const snapshot: SimulationSnapshot = {
      state: { susceptible: 100, exposed: 0, infected: 0, recovered: 0, total: 100 },
      r0: 1, sigma: 80, phase: 'calm', time: 0, interventions: [],
    }
    expect(snapshot.sigma).toBe(80)

    const intervention: Intervention = INTERVENTIONS[0]!
    expect(intervention.id).toBe('fact-check')
  })
})
