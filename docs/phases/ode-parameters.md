# ODE Parameters — Phase 0.5.3 Specification

This document defines the translation of the Σ-Model paper's coupled ODE system into discrete gameplay parameters for GIHA's strategy mode.

## Paper → Game Variable Mapping

| Paper Variable | Paper Range | Game Variable | Game Range | Scale |
|---------------|------------|---------------|------------|-------|
| σ_A (schema coherence) | [0, 1] | σ (coherence gauge) | [0, 100] | ×100 |
| R₀ (basic growth ratio) | ℝ⁺ | R₀ (spread rate) | [0, 5.0] | Direct |
| δ_A (parametric depth) | [0, Δ] | Not tracked | — | Omitted |
| Ω_SL (shortcut pressure) | [0, ∞) | Vulnerability multiplier | [0.85, 1.30] | Per-district |
| P_A (propensity) | [0, 1] | Budget system | — | Renamed |
| α_A (attentional fidelity) | [0, 1] | Literacy rate | [0, 1] | District-level |

## Phase Thresholds

| Phase | Trigger | Game Semantics |
|-------|---------|---------------|
| **Calm** | σ ≥ 60 AND R₀ < 0.8 | City is healthy. Player can focus on long-term investments. |
| **Outbreak** | σ < 60 OR R₀ ≥ 0.8 | Disinformation is spreading. Basic interventions needed. |
| **Crisis** | σ < 40 AND R₀ ≥ 1.5 | Rapid destabilization. Emergency interventions required. |
| **Trap** | σ < 20 for 5+ consecutive ticks | Game over. Low-coherence equilibrium. |

## R₀ Dynamics

### Base R₀ by Phase

| Phase | Base R₀ | Drift/tick | Max R₀ |
|-------|:-------:|:----------:|:------:|
| Calm | 0.6 | +0.005 | 1.0 |
| Outbreak | 0.8 | +0.010 | 2.0 |
| Crisis | 1.5 | +0.020 | 5.0 |
| Trap | 2.0 | +0.030 | 5.0 |

### District Vulnerability Multipliers

| District | Vulnerability | Effective R₀ at City R₀ = 1.0 | Why |
|----------|:------------:|:------------------------------:|-----|
| Foundry | 1.30 | 1.30 | Economic anxiety, lower internet literacy |
| Harborview | 1.15 | 1.15 | Elderly population, social isolation |
| Uptown | 1.00 | 1.00 | Baseline — status-driven but tech-savvy |
| Campus | 0.85 | 0.85 | Educated, digitally native |

Effective R₀ is used only for heatmap coloring and visual feedback; the city-level R₀ drives the simulation.

## σ Dynamics (Logistic Growth)

Adapted from the paper's Sigma ODE for discrete ticks:

```
Δσ = g × σ × (1 − σ/σ_max) − d × (I/N) × σ + Σ(σ_interventions) × (1 − σ/σ_max)
```

### Parameters

| Parameter | Value | Paper Source | Description |
|-----------|:-----:|-------------|-------------|
| g (growth) | 0.15 | ρ · P_A · α_A ≈ 0.15 | Base crystallization rate per tick |
| d (decay) | 0.03 | ε_σ · Ω_SL ≈ 0.03 | Decay per 1% infected population |
| σ_max | 100 | — | Ceiling (clamped) |

### Behavior at Key Levels (no interventions, 10% infected)

| Current σ | Natural Δσ/tick | Feels like |
|:---------:|:---------------:|------------|
| 10 | +0.09 | Stuck — σ-trap pull |
| 30 | +0.20 | Slow crawl |
| 50 | +0.24 | Peak growth — momentum |
| 70 | +0.17 | Slowing — near ceiling |
| 90 | +0.05 | Plateau |

### σ-Trap Mechanics

Per the paper's Proposition 4.1, σ = 0 is a stable fixed point when R₀ < 1. In gameplay terms:
- σ below 20: growth term is severely suppressed (< 2.4/tick max)
- σ below 10: net growth is < 1/tick — recovery requires strong interventions
- σ = 0: growth is zero (the σ factor multiplies the entire RHS)
- Recovery from σ < 20 requires sustained investment in σ-boosting interventions

## S/E/I/R Compartment Model

### Equations (per tick)

```
β = R₀ × recovery_rate
ΔS = -β × S × I / N
ΔE = β × S × I / N - incubation_rate × E
ΔI = incubation_rate × E - recovery_rate × I
ΔR = recovery_rate × I
```

### Parameters

| Parameter | Value | Description |
|-----------|:-----:|-------------|
| recovery_rate (γ) | 0.10 | Base recovery rate per tick |
| incubation_rate (κ) | 0.15 | Rate exposed become infected per tick |

## Intervention Effects

### Effect Values

| Intervention | R₀ Δ | σ Δ (per tick) | Cost | Cooldown | Duration |
|-------------|:----:|:--------------:|:----:|:--------:|:--------:|
| Fact-Check Bureau | −0.20 | 0 | 50 | 30 | 15 |
| School MIL Program | 0 | +2.0 | 80 | 60 | 60 |
| Algorithm Audit | −0.30 | 0 | 120 | 90 | 20 |
| Community Dialog | −0.10 | +1.0 | 40 | 45 | 20 |
| Source Verification | −0.15 | 0 | 60 | 50 | 25 |
| Emergency Broadcast | −0.40 | 0 | 100 | 75 | 10 |

### Stacking Rules

- **R₀ reduction:** max() — only the strongest active R₀ reduction applies
- **σ boost:** additive — multiple σ-boosting interventions stack
- **Effect saturation per intervention:** σ boosting interventions see diminishing returns at high σ via the `(1 − σ/100)` logistic factor

## Budget System

| Event | Amount | Description |
|-------|:-----:|-------------|
| Starting budget | 500 | Deploy ~4 interventions at start |
| Passive income | +5/tick | Covers one cheap intervention every 8 ticks |
| Case solved S grade | +100 | Covers Emergency Broadcast |
| Case solved A grade | +75 | Medium bonus |
| Case solved B grade | +50 | Covers Fact-Check Bureau |
| Case solved C grade | +25 | Small bonus |
| Case failed | +0 | No reward |

## 3-Act Difficulty Ramp

| Act | Ticks | R₀ Curve | σ Curve | Event |
|-----|:-----:|:--------:|:-------:|-------|
| Act 1: Case 1 unlock | 1–40 | 0.6 → 1.0 | 78 → 60–65 | Mayor deepfake outbreak at tick ~20 |
| Act 2: Case 2 unlock | 41–80 | 0.8 → 1.4 | Recovering from Case 1 | Voice scams detected at tick ~50 |
| Act 3: Case 3 unlock | 81–120 | 1.0 → 1.8 | Near 40 | Protest photo crisis at tick ~90 |
| Endgame | 121–150+ | Must descend | Must reach >80 | Victory if maintained for 60s |

## Win/Lose Conditions

| Condition | Type | Trigger |
|-----------|:----:|---------|
| σ ≥ 80, R₀ < 0.8, all 3 cases solved | Win | Maintain for 60 ticks |
| σ < 20 for 5+ ticks | Lose | σ-trap |
| Any district effective R₀ > 3.0 for 30 ticks | Lose | Uncontained outbreak |
| All 3 cases failed | Lose | No more interventions available |

## Numerical Stability

Per the paper's Proposition 3.2, all variables are clamped to their bounds after each tick:
- σ ∈ [0, 100]
- R₀ ∈ [0, 5.0]
- S/E/I/R ∈ [0, N], sum ≤ N
- No unphysical values occur (forward invariance proven in paper)

## Calibration Notes

The following calibration ratios from the paper's Proposition 4.1 apply:
- σ_critical ≈ 20 (game scale): below this, R₀ > 1 makes recovery improbable
- Growth-to-decay ratio (g/d = 5): sustained intervention at >20% infected is needed to maintain σ
- Phase 1→2 transition equivalent occurs when σ crosses ~50 (midpoint of logistic curve)
