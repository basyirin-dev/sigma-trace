import type { ActiveEffect } from './types'
import { INTERVENTIONS, getEscalatedCost } from './interventions'
import { simulateTick, buildDefaultConfig } from './simulate'
import { createActiveEffect } from './active-effects'
import { POPULATION_INITIAL, STARTING_STATE, INCOME, INTERVENTION_DEFAULTS, SIGMA_TRAP, WIN_CONDITIONS, LOSS_CONDITIONS, CASE_BUDGET_BONUSES } from './tuning'

export interface RunnerOptions {
  maxTicks?: number
  autoDeployInterval?: number
  strategy?: 'optimal' | 'random' | 'none'
  verbose?: boolean
}

export interface SimulationResult {
  won: boolean
  lost: boolean
  totalTicks: number
  finalSigma: number
  finalR0: number
  finalBudget: number
  interventionsDeployed: number
  completedCases: number
  tickLog: Array<{ tick: number; sigma: number; r0: number; budget: number; phase: string }>
}

function pickIntervention(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)]!
}

function getBestIntervention(currentR0: number, currentSigma: number, onCooldown: Set<string>): string | null {
  const available = INTERVENTIONS.filter((i) => !onCooldown.has(i.id))
  if (available.length === 0) return null

  if (currentR0 > 1.5) {
    const r0Control = available.filter((i) => i.effect.r0Delta < 0)
    if (r0Control.length > 0) return r0Control.sort((a, b) => a.effect.r0Delta - b.effect.r0Delta)[0]!.id
  }

  if (currentSigma < 40) {
    const sigmaBoost = available.filter((i) => i.effect.sigmaDelta > 0)
    if (sigmaBoost.length > 0) return sigmaBoost.sort((a, b) => b.effect.sigmaDelta - a.effect.sigmaDelta)[0]!.id
  }

  if (currentR0 > 1.0) {
    const r0Control = available.filter((i) => i.effect.r0Delta < 0)
    if (r0Control.length > 0) return r0Control.sort((a, b) => a.effect.r0Delta - b.effect.r0Delta)[0]!.id
  }

  const sigmaBoost = available.filter((i) => i.effect.sigmaDelta > 0)
  if (sigmaBoost.length > 0) return sigmaBoost.sort((a, b) => b.effect.sigmaDelta - a.effect.sigmaDelta)[0]!.id

  return available[0]?.id ?? null
}

export function runSimulation(options: RunnerOptions = {}): SimulationResult {
  const { maxTicks = 200, autoDeployInterval = 5, strategy = 'optimal', verbose = false } = options

  let population = { ...POPULATION_INITIAL }
  let sigma = STARTING_STATE.sigma
  let infectionR0 = STARTING_STATE.r0
  let phase: string
  let activeEffects: ActiveEffect[] = []

  let budget = STARTING_STATE.budget
  const interventionUseCounts: Record<string, number> = {}
  const onCooldown: Record<string, number> = {}
  let lastDeployId: string | null = null
  let lastDeployTick = -10
  let r0DangerCount = 0
  let stableTicks = 0
  let completedCases = 0
  let totalDeployed = 0
  let permanentR0Modifier = 0

  const sigmaHistory: number[] = []
  const tickLog: Array<{ tick: number; sigma: number; r0: number; budget: number; phase: string }> = []

  for (let tick = 1; tick <= maxTicks; tick++) {
    const income = INCOME.BASE + (sigma / 100) * INCOME.SCALE
    budget += income

    for (const [id, remaining] of Object.entries(onCooldown)) {
      if (remaining <= 1) delete onCooldown[id]
      else onCooldown[id] = remaining - 1
    }

    if (tick % autoDeployInterval === 0 && strategy !== 'none') {
      const displayR0 = Math.max(0, infectionR0 + permanentR0Modifier)
      const cooldownSet = new Set(Object.keys(onCooldown))
      let chosenId: string | null = null

      if (strategy === 'optimal') {
        chosenId = getBestIntervention(displayR0, sigma, cooldownSet)
      } else {
        const available = INTERVENTIONS.filter((i) => !cooldownSet.has(i.id))
        if (available.length > 0) chosenId = pickIntervention(available.map((i) => i.id))
      }

      if (chosenId) {
        const intervention = INTERVENTIONS.find((i) => i.id === chosenId)
        if (intervention) {
          const useCount = interventionUseCounts[chosenId] ?? 0
          const cost = getEscalatedCost(intervention.cost, useCount)
          if (budget >= cost) {
            budget -= cost
            totalDeployed++
            interventionUseCounts[chosenId] = useCount + 1
            onCooldown[chosenId] = intervention.cooldown

            const synergyScaling = (chosenId !== lastDeployId && tick - lastDeployTick <= INTERVENTION_DEFAULTS.SYNERGY_WINDOW_TICKS)
              ? INTERVENTION_DEFAULTS.SYNERGY_MULTIPLIER : 1.0

            lastDeployId = chosenId
            lastDeployTick = tick

            const base = createActiveEffect(intervention)
            activeEffects.push({ ...base, r0Delta: base.r0Delta * synergyScaling, sigmaDelta: base.sigmaDelta * synergyScaling })
          }
        }
      }
    }

    const tickConfig = buildDefaultConfig(tick)
    const params = { population, sigma, r0: infectionR0, activeEffects, time: tick }
    const result = simulateTick(params, tickConfig)

    population = result.state
    sigma = result.sigma
    infectionR0 = result.r0
    phase = result.phase
    activeEffects = result.interventions
    sigmaHistory.push(sigma)

    let displayR0 = Math.max(0, infectionR0 + permanentR0Modifier)

    if (strategy !== 'none') {
      const r = CASE_BUDGET_BONUSES.CASE_R0_REDUCTION
      const sb = CASE_BUDGET_BONUSES.CASE_SIGMA_BOOST
      if (tick === 5) { completedCases++; permanentR0Modifier -= r; sigma = Math.min(100, sigma + sb); budget += 100 }
      if (tick === 30 && sigma >= 40) { completedCases++; permanentR0Modifier -= r; sigma = Math.min(100, sigma + sb); budget += 100 }
      if (tick >= 105 && completedCases >= 2 && sigma >= 60 && displayR0 < 1.0 && completedCases < 3) {
        completedCases++; permanentR0Modifier -= r; sigma = Math.min(100, sigma + sb); budget += 100
      }
      displayR0 = Math.max(0, infectionR0 + permanentR0Modifier)
    }

    if (displayR0 > LOSS_CONDITIONS.CITY_R0_THRESHOLD) {
      r0DangerCount++
      if (r0DangerCount >= LOSS_CONDITIONS.CITY_R0_TICKS) {
        if (verbose) console.log(`[Simulate] LOST: R0 > 2.0 for 30 ticks at tick ${tick}`)
        tickLog.push({ tick, sigma, r0: displayR0, budget, phase })
        return { won: false, lost: true, totalTicks: tick, finalSigma: sigma, finalR0: displayR0, finalBudget: budget, interventionsDeployed: totalDeployed, completedCases, tickLog }
      }
    } else {
      r0DangerCount = 0
    }

    if (sigma < SIGMA_TRAP.THRESHOLD && sigmaHistory.length >= SIGMA_TRAP.CONSECUTIVE_TICKS) {
      const lastN = sigmaHistory.slice(-SIGMA_TRAP.CONSECUTIVE_TICKS)
      if (lastN.every((v) => v < SIGMA_TRAP.THRESHOLD)) {
        if (verbose) console.log(`[Simulate] LOST: sigma trap at tick ${tick}`)
        tickLog.push({ tick, sigma, r0: displayR0, budget, phase })
        return { won: false, lost: true, totalTicks: tick, finalSigma: sigma, finalR0: displayR0, finalBudget: budget, interventionsDeployed: totalDeployed, completedCases, tickLog }
      }
    }

    if (completedCases >= WIN_CONDITIONS.REQUIRED_CASES && sigma >= WIN_CONDITIONS.SIGMA_THRESHOLD && displayR0 < WIN_CONDITIONS.R0_THRESHOLD) {
      stableTicks++
      if (stableTicks >= WIN_CONDITIONS.STABLE_TICKS) {
        if (verbose) console.log(`[Simulate] WON at tick ${tick}`)
        tickLog.push({ tick, sigma, r0: displayR0, budget, phase })
        return { won: true, lost: false, totalTicks: tick, finalSigma: sigma, finalR0: displayR0, finalBudget: budget, interventionsDeployed: totalDeployed, completedCases, tickLog }
      }
    } else {
      stableTicks = 0
    }

    if (tick % 10 === 0 || verbose) {
      tickLog.push({ tick, sigma, r0: displayR0, budget: Math.round(budget), phase })
    }
  }

  const displayR0 = Math.max(0, infectionR0 + permanentR0Modifier)
  return { won: false, lost: false, totalTicks: maxTicks, finalSigma: sigma, finalR0: displayR0, finalBudget: Math.round(budget), interventionsDeployed: totalDeployed, completedCases, tickLog }
}

export function validateBalance(): boolean {
  console.log('=== GIHA Balance Validation ===\n')

  const strategies: Array<{ name: string; opts: RunnerOptions }> = [
    { name: 'Optimal play', opts: { strategy: 'optimal', autoDeployInterval: 3, verbose: false, maxTicks: 200 } },
    { name: 'Random play', opts: { strategy: 'random', autoDeployInterval: 5, verbose: false, maxTicks: 200 } },
    { name: 'No intervention', opts: { strategy: 'none', verbose: false, maxTicks: 200 } },
  ]

  let allPassed = true

  for (const { name, opts } of strategies) {
    const result = runSimulation(opts)
    const status = result.won ? 'WON' : result.lost ? 'LOST' : 'TIMEOUT'
    console.log(`  ${name}: ${status} (${result.totalTicks} ticks, σ=${result.finalSigma.toFixed(1)}, R₀=${result.finalR0.toFixed(2)}, budget=${result.finalBudget}, interventions=${result.interventionsDeployed})`)

    if (name === 'Optimal play' && !result.won) {
      console.log(`  ⚠  Optimal play should win but did not. Balance may need tuning.`)
      allPassed = false
    }
    if (name === 'No intervention' && !result.lost) {
      console.log(`  ⚠  Doing nothing should lose but did not. Balance may need tuning.`)
      allPassed = false
    }
  }

  console.log(`\n  ${allPassed ? '✓ ALL CHECKS PASSED' : '✗ SOME CHECKS FAILED'}`)
  return allPassed
}
