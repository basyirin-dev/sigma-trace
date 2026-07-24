# GIHA: Technical Architecture

## 2.1 Stack Overview

| Layer | Technology | Rationale |
|:------|:-----------|:----------|
| Bundler | Vite 8 | Fast HMR, static export, TypeScript native |
| Framework | React 19 | Component model, ecosystem |
| State | Zustand 5 | Minimal boilerplate, TypeScript-first, 8+ atomic stores |
| Strategy rendering | Canvas2D (pixel art) | Strategy mode city visualization (1000×1000px, 50×50 tiles) |
| 2D UI | React + CSS Modules | Detective mode point-and-click interface |
| Simulation | TypeScript ODE engine | Discrete-time SEIR + σ-coherence model, ported from Python Σ-Model |
| Tests | Vitest + v8 coverage | Unit + integration |
| CI | GitHub Actions | Lint, type-check, test, build |
| Hosting | Netlify (free tier) | Static site, zero server cost |

## 2.2 Directory Structure

```
giha/
├── package.json
├── vite.config.ts
├── public/
│   ├── cases/
│   │   ├── case-01/          # "The Viral Mayor"
│   │   ├── case-02/          # "Grandma's Distress Call"
│   │   └── case-03/          # "The Front Page"
│   ├── audio/                 # Music + SFX (see audio/ subdirectories)
│   └── assets/                # Fonts, logo
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── router.tsx
│   │
│   ├── engine/                # σ-Model ODE simulation
│   │   ├── types.ts           # PopulationState, District, Phase, SimulationConfig
│   │   ├── constants.ts       # All tunable parameters (gamma, kappa, sigma decay, thresholds)
│   │   ├── simulate.ts        # Discrete-time simulation step (SEIR + sigma + R0)
│   │   ├── sigma.ts           # Sigma coherence computation (decay + intervention recovery)
│   │   ├── r0.ts              # R₀ computation with mitigation factors
│   │   ├── sigma-trap.ts      # Sigma trap detection (5+ consecutive ticks < threshold)
│   │   ├── interventions.ts   # Intervention definitions + color mappings
│   │   ├── districts.ts       # District definitions + effective R0 computation
│   │   └── active-effects.ts  # Active effect lifecycle (creation + ticking)
│   │
│   ├── strategy/              # Strategy mode
│   │   ├── StrategyMode.tsx     # Main strategy mode orchestrator
│   │   ├── CityCanvas.tsx       # Canvas2D pixel scene with DPI scaling
│   │   ├── CityGrid.tsx
│   │   ├── useCityLoop.ts      # Game loop (requestAnimationFrame + tick management)
│   │   ├── useSimulation.ts    # Simulation tick bridge to engine
│   │   ├── useActiveEffects.ts # Intervention deployment + effect wiring
│   │   ├── useWarningDetection.ts # R0/sigma warning thresholds
│   │   ├── useCaseUnlocks.ts   # Case unlock conditions based on simulation state
│   │   ├── renderers/          # Canvas2D rendering functions
│   │   │   ├── renderGrid.ts     # Tile grid, tile glow, district quadrants
│   │   │   ├── renderMap.ts      # Ground, roads, buildings with sprite support
│   │   │   ├── renderHeatmap.ts  # Per-district heatmap overlay + district pulse
│   │   │   ├── renderAgents.ts   # Population agent dots with stable threshold coloring
│   │   │   ├── renderParticles.ts # Floating particle system
│   │   │   ├── renderGauge.ts    # Sigma coherence gauge (semi-circular)
│   │   │   ├── renderR0Trend.ts  # R₀ historical trend graph
│   │   │   └── renderInterventionRings.ts  # Active effect ring visualization
│   │   ├── InterventionCard.tsx
│   │   ├── InterventionPalette.tsx
│   │   ├── InterventionTimeline.tsx
│   │   ├── DeployConfirmModal.tsx
│   │   ├── TimeControls.tsx
│   │   ├── R0TrendGraph.tsx
│   │   ├── CoherenceGauge.tsx
│   │   ├── CaseSelector.tsx
│   │   └── buffs.ts           # Case completion buffs
│   │
│   ├── detective/             # Detective mode
│   │   ├── DetectiveMode.tsx    # Main detective orchestrator
│   │   ├── CaseLoader.ts        # Case data fetcher + JSON validator
│   │   ├── CaseState.ts         # 5-state machine (intro→investigation→evidence→verdict→debrief)
│   │   ├── EvidenceBoard.tsx    # Draggable evidence cards + SVG connection lines
│   │   ├── EvidenceCard.tsx     # Flip card with type preview + connect handle
│   │   ├── Toolbelt.tsx         # 6-tool toolbar
│   │   ├── ToolResultModal.tsx  # Finding display + confidence bar
│   │   ├── VerdictPanel.tsx     # Verdict selection + justification textarea
│   │   ├── DebriefScreen.tsx    # Score breakdown + MIL lesson
│   │   ├── ScoringEngine.ts     # 5-component scoring algorithm
│   │   ├── tools/
│   │   │   ├── constants.ts     # Shared tool definitions (id, label, icon, affinity, tooltip)
│   │   │   ├── types.ts         # Tool + ToolResult interfaces
│   │   │   ├── BaseTool.ts      # Abstract base class
│   │   │   ├── SpectrogramTool.ts | Spectrogram.tsx
│   │   │   ├── FrameStepperTool.ts | FrameStepper.ts | FrameStepper.tsx
│   │   │   ├── MetadataInspectorTool.ts | MetadataInspector.tsx
│   │   │   ├── SourceTracerTool.ts | SourceTracer.tsx
│   │   │   ├── InconsistencyHighlighterTool.ts | InconsistencyHighlighter.tsx
│   │   │   └── TimelineCrossReferencerTool.ts | TimelineCrossReferencer.tsx
│   │   ├── ToolTutorialOverlay.tsx
│   │   ├── useDetectiveStore.ts  # Detective runtime state
│   │   └── useToolTutorialStore.ts
│   │
│   ├── shared/                # Shared components
│   │   ├── HUD.tsx
│   │   ├── Modal.tsx
│   │   ├── Button.tsx
│   │   ├── Tooltip.tsx
│   │   ├── SettingsPanel.tsx
│   │   ├── WarningToast.tsx
│   │   ├── ErrorFallback.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── useAudioManager.ts
│   │   ├── saveManager.ts
│   │   ├── stores/
│   │   │   ├── gameStore.ts           # Core game state (budget, mode, cases, status)
│   │   │   ├── useSimulationStore.ts  # Simulation state (population, sigma, r0, tick)
│   │   │   ├── useWarningStore.ts     # Warning toast queue
│   │   │   ├── useAudioStore.ts       # Audio settings with localStorage persistence
│   │   │   ├── useInterventionLogStore.ts  # Deployment history
│   │   │   └── index.ts               # Barrel exports
│   │   └── types.ts
│   │
│   ├── screens/               # Standalone screens
│   │   ├── TitleScreen.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── TransitionScreen.tsx
│   │   ├── VictoryScreen.tsx
│   │   ├── GameOverScreen.tsx
│   │   └── NotFound.tsx
│   │
│   └── styles/
│       ├── global.css
│       ├── variables.css      # CSS custom properties (colors, typography, spacing)
│       ├── animations.css
│       └── pixel-theme.css    # Pixel art CSS classes
```

## 2.3 Data Flow

### 2.3.1 State Architecture (Zustand — Atomic Stores)

```
┌──────────────────────────────────────────────────────────┐
│                    gameStore                               │
│  budget, mode, caseResults, cooldowns, interventionUse,   │
│  gameStatus, cityPaused, unlockFlags                      │
├──────────────────────────────────────────────────────────┤
│                  useSimulationStore                        │
│  population, sigma, r0, tick, phase, activeEffects,       │
│  isRunning, speed, r0History, sigmaHistory                 │
├──────────────────────────────────────────────────────────┤
│                  useDetectiveStore                         │
│  caseData, connections, usedTools, activeTool,            │
│  verdict, justification, startTime                         │
├──────────────────────────────────────────────────────────┤
│                  useCaseStateStore                         │
│  phase (CaseProgress), introFrameIndex                     │
├──────────────────────────────────────────────────────────┤
│                useInterventionLogStore                     │
│  entries (deployment history)                              │
├──────────────────────────────────────────────────────────┤
│                  useWarningStore                           │
│  warnings array (toast queue)                              │
├──────────────────────────────────────────────────────────┤
│                  useAudioStore                             │
│  musicVolume, sfxVolume, muted, showFps, currentTrack      │
├──────────────────────────────────────────────────────────┤
│              useToolTutorialStore                          │
│  dismissed (which tool tutorials have been seen)           │
└──────────────────────────────────────────────────────────┘
```

### 2.3.2 Simulation Tick

Each tick approximates 1 second of game time:

```
1. Apply active effects: decrement remainingTicks, filter expired

2. Compute sigma coherence:
   σ(t+1) = σ(t) - D × (I/N) × (σ(t)/100) + Σ(σ_interventions × (1 - σ(t)/100))
   where D = 2.0, sigma_capped ∈ [0, 100]

3. Compute R₀ from population state + config + active effects:
   R₀(t+1) = computeR0(population, config, activeEffects)
   (mitigation: literacy, factCheck, audit; intervention deltas; susceptible ratio)

4. Compute S/E/I/R transitions:
   ΔS = -β × S × I / N
   ΔE = +β × S × I / N - κ × E
   ΔI = +κ × E - γ × I
   ΔR = +γ × I
   where β = R₀ × γ, γ = recovery_rate, κ = incubation_rate

5. Detect phase transitions and σ-trap:
   Phase = classifyPhase(σ, R₀)
   σ-trap = detectSigmaTrap(sigmaHistory)  // 5+ consecutive < 20

6. Apply income: budget += 0.5 + σ/100 × 1.5 per tick
   Decrement intervention cooldowns
```

Source: `src/engine/simulate.ts`, `src/engine/sigma.ts`, `src/engine/r0.ts`

## 2.4 Case Data Schema

Case files live in `public/cases/{case-id}/`:

| File | Content |
|------|---------|
| `metadata.json` | Case ID, title, brief, MIL lesson, correct verdict, solution spec (connections, tool pairs, keywords), outcome deltas |
| `script.json` | Intro cutscene frames, evidence findings (per-evidence text), tool hints, conclusion text, MIL lesson |
| `evidence-items.json` | Array of `{id, type, label, description, isRedHerring, src}` |
| `evidence-board.json` | Node positions, required connections, hint connections |

Source: `src/detective/CaseLoader.ts` (with full JSON validation)

## 2.5 Mode Integration Bridge

```
Strategy → Detective:
  1. Player clicks "Investigate" on a case card
  2. gameStore.startCase(caseId) → pauses simulation, sets cityPaused, switches mode
  3. navigate('/transition', { state: { direction: 'to-detective', caseId, ... }})
  4. Transition screen → navigate(`/detective/${caseId}`)

Detective → Strategy:
  1. Player submits verdict → score is calculated + debrief shown
  2. Player clicks "Return to City" → handleReturnToCity()
  3. gameFinishCase(r0Delta, sigmaDelta, budgetBonus) applies outcome
  4. recordCaseGrade() stores the grade
  5. navigate('/transition', { state: { direction: 'to-strategy', deltas }})
  6. Transition screen shows case outcome → navigate('/strategy')
```

Source: `src/strategy/StrategyMode.tsx`, `src/detective/DetectiveMode.tsx`

## 2.6 Tool API Contract

Each forensic tool follows this interface (defined in `src/detective/tools/types.ts`):

```typescript
interface ToolResult {
  findings: string[]     // bullet points discovered
  confidence: number     // 0–1 how conclusive
  evidenceId: string
  timestamp: number
}

interface Tool {
  id: string
  name: string
  icon: string
  description: string
  eligibility: (evidence: EvidenceItem) => boolean   // can this tool apply to this evidence?
  apply: (evidence: EvidenceItem, caseData: CaseData) => ToolResult
}
```

Each tool has a corresponding React component for interactive visualization (e.g., `Spectrogram.tsx` for real-time audio spectrogram, `FrameStepper.tsx` for video frame stepping). Tool implementations read findings from `caseData.script.evidenceFindings[evidence.id]` to provide case-specific investigation results.

Source: `src/detective/tools/types.ts`, `src/detective/tools/BaseTool.ts`

## 2.7 Performance Budget

| Metric | Current | Target | Notes |
|:-------|:-------:|:------:|:------|
| Bundle size (JS gzip) | ~325 KB | < 800 KB | Measured from Vite build output |
| Bundle size (total) | ~5 MB | < 5 MB | Includes audio, evidence media, and fonts |
| FPS (strategy mode) | — | 60 fps | Benchmark pending — requestAnimationFrame loop with 80 agents |
| FPS (detective mode) | — | 60 fps | 2D UI only, no heavy rendering |
| Browser support | Chrome, Firefox, Safari (last 2 major) | 95% of youth users | Confirm with actual testing |
| Load time | — | < 2s first paint | Benchmark pending — static SPA, no blocking requests |
| Offline | Full | Full | No API calls after initial load |
| Memory | — | < 200 MB | No persistent state (estimated — no streaming or large datasets) |

## 2.8 Deployment

```
GitHub Repo → push → GitHub Actions (CI/CD) → lint → typecheck → test → build → Netlify

Netlify serves:
  /            → index.html (React SPA)
  /cases/*     → Case JSON + evidence media files
  /audio/*     → Music + SFX
  /assets/*    → Fonts, logo, tile sprites
```

No server. No database. No authentication. A single-page static application deployed from a GitHub push.

## 2.9 Stores Quick Reference

| Store File | Module | Key State | Connected Components |
|-----------|--------|-----------|---------------------|
| `stores/gameStore.ts` | Shared | budget, mode, caseResults, cooldowns, badges, bestCaseResults | HUD, Palette, SettingsPanel, VictoryScreen |
| `stores/useSimulationStore.ts` | Shared | population, sigma, r0, tick, phase | StrategyMode, HUD, R0TrendGraph |
| `stores/useWarningStore.ts` | Shared | warnings[] | WarningToast |
| `stores/useAudioStore.ts` | Shared | musicVolume, sfxVolume, muted, showFps | SettingsPanel, useAudioManager |
| `stores/useInterventionLogStore.ts` | Shared | entries (deployment history) | InterventionTimeline |
| `detective/useDetectiveStore.ts` | Detective | caseData, connections, usedTools | DetectiveMode, EvidenceBoard |
| `detective/CaseState.ts` | Detective | phase (CaseProgress), introFrameIndex | DetectiveMode, CutscenePlayer |
| `detective/useToolTutorialStore.ts` | Detective | dismissed[] | ToolTutorialOverlay |
| `stores/useHintStore.ts` | Shared | cooldowns, active hints | HintToast |
| `stores/usePlaytestStore.ts` | Shared | events[], isDevMode | DebugOverlay |
