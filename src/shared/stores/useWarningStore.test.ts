import { describe, it, expect, beforeEach } from 'vitest'
import { useWarningStore } from './useWarningStore'

beforeEach(() => {
  useWarningStore.getState().clearAll()
})

describe('useWarningStore', () => {
  it('initializes with empty warnings', () => {
    expect(useWarningStore.getState().warnings).toEqual([])
  })

  it('addWarning creates a warning with id and message', () => {
    useWarningStore.getState().addWarning('Outbreak detected')
    const warnings = useWarningStore.getState().warnings
    expect(warnings).toHaveLength(1)
    expect(warnings[0]!.message).toBe('Outbreak detected')
    expect(warnings[0]!.id).toBe('warn-0')
  })

  it('addWarning assigns incrementing ids', () => {
    useWarningStore.getState().addWarning('First')
    useWarningStore.getState().addWarning('Second')
    const warnings = useWarningStore.getState().warnings
    expect(warnings[0]!.id).toBe('warn-0')
    expect(warnings[1]!.id).toBe('warn-1')
  })

  it('dismissWarning removes the warning by id', () => {
    useWarningStore.getState().addWarning('Outbreak detected')
    useWarningStore.getState().addWarning('Critical coherence loss')
    const ws = useWarningStore.getState().warnings
    expect(ws).toHaveLength(2)

    useWarningStore.getState().dismissWarning(ws[0]!.id)
    const remaining = useWarningStore.getState().warnings
    expect(remaining).toHaveLength(1)
    expect(remaining[0]!.message).toBe('Critical coherence loss')
  })

  it('clearAll removes all warnings', () => {
    useWarningStore.getState().addWarning('First')
    useWarningStore.getState().addWarning('Second')
    useWarningStore.getState().clearAll()
    expect(useWarningStore.getState().warnings).toEqual([])
  })
})
