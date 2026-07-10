# Phase 1: σ-Model ODE Engine

**Duration:** 5 days
**Member:** M1 (AI/Research)
**Dependencies:** Phase 0.5
**Output:** Working discrete-time simulation in browser console

## Tasks

### 1.1 Type Definitions
- Define `PopulationState`: `{ susceptible, exposed, infected, recovered, total }`
- Define `SimulationParameters`: `{ baseR0, literacyRate, factCheckCoverage, algorithmAuditActive, recoveryRate, incubationRate, noise }`
- Define `SimulationSnapshot`: `{ state, r0, sigma, phase, timestamp, interventions }`
- Define `Phase`: `'calm' | 'outbreak' | 'crisis' | 'trap'`
- **Test:** Types compile, no implicit any

### 1.2 Simulation Step Function
- Implement `simulateStep(state, params, dt): SimulationSnapshot`
- Core S/E/I/R update using discrete SIR-like model:
  - `β = params.baseR0 * params.recoveryRate`
  - `ΔS = -β * state.susceptible * state.infected / state.total`
  - `ΔE = β * state.susceptible * state.infected / state.total - params.incubationRate * state.exposed`
  - `ΔI = params.incubationRate * state.exposed - params.recoveryRate * state.infected`
  - `ΔR = params.recoveryRate * state.infected`
- Apply intervention modifiers to β before computation
- **Test:** Running 100 steps produces expected S-curve (infected rises then falls)

### 1.3 R₀ Computation
- Implement `computeR0(state, params, activeEffects): number`
- Base R₀ modified by: `literacyRate * 0.3 + factCheckCoverage * 0.4 + algorithmAuditActive * 0.3`
- Add small random noise: `Math.random() * 0.1 - 0.05`
- **Test:** R₀ decreases when interventions are active, increases without them

### 1.4 σ-Coherence Computation
- Implement `computeSigma(state, prevSigma, interventions, dt): number`
- Natural decay: `−0.5 * (infected / total) * (prevSigma / 100) * dt`
- Intervention recovery: `+sum(effect * coverage * dt)`
- Clamp to [0, 100]
- **Test:** Sigma drops when infected population grows, recovers with interventions

### 1.5 σ-Trap Detector
- Implement `detectSigmaTrap(sigmaHistory: number[]): boolean`
- If sigma < 20 for 5+ consecutive ticks → σ-trap
- If sigma < 20 but an intervention is active → countdown paused
- **Test:** Returns true after 5 ticks below threshold, false otherwise

### 1.6 Phase Classifier
- Implement `classifyPhase(r0, sigma): Phase`
- `calm`: R₀ < 0.8, σ > 60
- `outbreak`: R₀ ≥ 0.8, σ ≤ 60
- `crisis`: R₀ ≥ 1.5, σ ≤ 40
- `trap`: σ < 20
- **Test:** All 4 phase transitions produce correct classification

### 1.7 District Model
- Define 4 districts: Downtown (high internet, high literacy), Suburbs (medium), Industrial (low internet, low literacy), Rural (very low internet, lowest literacy)
- Each district has independent S/E/I/R but shares σ city-wide
- District vulnerability modifier: `baseR0 * (1 - literacyFactor - internetAccessFactor)`
- **Test:** Industrial district reaches R₀ > 1 before Downtown under same conditions

### 1.8 WASM / JS Export
- Export simulation functions as pure functions usable from any JS environment
- Bundle as ES module: `import { simulateStep, computeR0, computeSigma, detectSigmaTrap, classifyPhase } from '@engine'`
- **Test:** Import and call all functions from browser console

### 1.9 Console-Based Validation
- Run 200-step simulation with no interventions → verify infected curve peaks and falls
- Run 200-step simulation with fact-check intervention at step 50 → verify R₀ drops
- Run 200-step simulation with no interventions and high baseR₀ → verify σ-trap triggers
- Log all snapshots to console for visual inspection
- **M1:** Record console output as validation evidence

### 1.10 Parameter Tuning
- Adjust baseR₀, recoveryRate, incubationRate until gameplay feels right:
  - σ-trap should be reachable but avoidable (not too easy, not too hard)
  - Interventions should produce visible but delayed impact
  - District disparities should be meaningful
- **M1:** Tune and commit final parameter set

## Acceptance Criteria
- [ ] All type definitions finished and exported
- [ ] `simulateStep()` produces correct S/E/I/R curves
- [ ] R₀ computation responds to intervention modifiers
- [ ] σ-coherence decays and recovers as expected
- [ ] σ-trap detector fires correctly
- [ ] Phase classifier maps all 4 states correctly
- [ ] 4 districts with distinct vulnerability profiles
- [ ] All functions importable from `@engine`
- [ ] 200-step simulation produces expected curves (console validation)
- [ ] Parameter set tuned for fun + educational gameplay
