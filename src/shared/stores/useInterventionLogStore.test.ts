import { describe, it, expect, beforeEach } from 'vitest'
import { useInterventionLogStore } from './useInterventionLogStore'

beforeEach(() => {
  useInterventionLogStore.getState().reset()
})

describe('useInterventionLogStore', () => {
  it('initializes with empty entries', () => {
    expect(useInterventionLogStore.getState().entries).toEqual([])
  })

  it('addEntry pushes to entries', () => {
    useInterventionLogStore.getState().addEntry({
      interventionId: 'fact-check',
      tick: 10,
      r0AtDeploy: 1.2,
      sigmaAtDeploy: 78,
    })
    expect(useInterventionLogStore.getState().entries).toHaveLength(1)
    expect(useInterventionLogStore.getState().entries[0]!.interventionId).toBe('fact-check')
    expect(useInterventionLogStore.getState().entries[0]!.tick).toBe(10)
    expect(useInterventionLogStore.getState().entries[0]!.r0AtDeploy).toBe(1.2)
  })

  it('multiple addEntry calls accumulate in order', () => {
    useInterventionLogStore.getState().addEntry({
      interventionId: 'fact-check',
      tick: 5,
      r0AtDeploy: 0.6,
      sigmaAtDeploy: 78,
    })
    useInterventionLogStore.getState().addEntry({
      interventionId: 'mil-school',
      tick: 12,
      r0AtDeploy: 0.8,
      sigmaAtDeploy: 70,
    })
    useInterventionLogStore.getState().addEntry({
      interventionId: 'algorithm-audit',
      tick: 20,
      r0AtDeploy: 1.5,
      sigmaAtDeploy: 55,
    })

    const entries = useInterventionLogStore.getState().entries
    expect(entries).toHaveLength(3)
    expect(entries[0]!.interventionId).toBe('fact-check')
    expect(entries[1]!.interventionId).toBe('mil-school')
    expect(entries[2]!.interventionId).toBe('algorithm-audit')
  })

  it('reset clears all entries', () => {
    useInterventionLogStore.getState().addEntry({
      interventionId: 'fact-check',
      tick: 5,
      r0AtDeploy: 0.6,
      sigmaAtDeploy: 78,
    })
    useInterventionLogStore.getState().reset()
    expect(useInterventionLogStore.getState().entries).toEqual([])
  })
})
