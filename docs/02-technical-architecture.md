# σ-Trace: Technical Architecture

## 2.1 Stack Overview

| Layer | Technology | Rationale |
|:------|:-----------|:----------|
| Bundler | Vite 6 | Fast HMR, static export, TypeScript native |
| Framework | React 19 | Component model, ecosystem, shared with existing Σ-Model work |
| State | Zustand | Minimal boilerplate, TypeScript-first, middleware support |
| 3D/Canvas | React Three Fiber + Three.js | Strategy mode city visualization |
| 2D UI | React + CSS Modules | Detective mode point-and-click interface |
| Simulation | Python → WASM (pyodide) or JS port | ODE engine ported from Σ-Model |
| Tests | Vitest + Playwright | Unit + integration + E2E |
| CI | GitHub Actions | Lint, type-check, test, build |
| Hosting | Netlify / Vercel | Static site, zero server cost |

## 2.2 Directory Structure

```
sigma-trace/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   ├── cases/
│   │   ├── case-01/
│   │   │   ├── evidence/
│   │   │   ├── script.json
│   │   │   └── metadata.json
│   │   ├── case-02/
│   │   └── case-03/
│   └── sounds/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── router.tsx
│   │
│   ├── engine/                 # σ-Model ODE simulation
│   │   ├── types.ts
│   │   ├── simulate.ts         # Discrete-time simulation step
│   │   ├── interventions.ts    # Intervention effect functions
│   │   ├── sigma-trap.ts       # σ-trap classification
│   │   └── r0.ts              # R₀ computation
│   │
│   ├── strategy/               # Strategy mode
│   │   ├── StrategyMode.tsx
│   │   ├── CityGrid.tsx        # Three.js scene
│   │   ├── DistrictHeatmap.tsx
│   │   ├── CoherenceGauge.tsx
│   │   ├── InterventionPalette.tsx
│   │   ├── InterventionCard.tsx
│   │   ├── Timeline.tsx
│   │   └── store.ts
│   │
│   ├── detective/              # Detective mode
│   │   ├── DetectiveMode.tsx
│   │   ├── CaseLoader.ts
│   │   ├── EvidenceBoard.tsx
│   │   ├── EvidenceCard.tsx
│   │   ├── Toolbelt.tsx
│   │   ├── tools/
│   │   │   ├── Spectrogram.tsx
│   │   │   ├── FrameStepper.tsx
│   │   │   ├── MetadataInspector.tsx
│   │   │   ├── SourceTracer.tsx
│   │   │   ├── InconsistencyHighlighter.tsx
│   │   │   └── TimelineCrossReferencer.tsx
│   │   ├── VerdictPanel.tsx
│   │   ├── ScoringEngine.ts
│   │   └── store.ts
│   │
│   ├── shared/                 # Shared components
│   │   ├── HUD.tsx
│   │   ├── Modal.tsx
│   │   ├── Button.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Transition.tsx      # Mode-switch animation
│   │   └── types.ts            # Shared types
│   │
│   └── styles/
│       ├── global.css
│       ├── variables.css
│       └── animations.css
```

## 2.3 Data Flow

### 2.3.1 State Architecture (Zustand)

```
┌─────────────────────────────────────────────────────────────┐
│                      GameStore                               │
│                                                             │
│  strategy: {                                                 │
│    population: CityPopulation,     // S, E, I, R counts     │
│    sigma: number,                  // 0–100                  │
│    r0: number,                     // 0–5.0                  │
│    budget: number,                                            │
│    time: number,                                              │
│    phase: Phase,                    // calm / outbreak / trap │
│    districtStates: District[],                                │
│    interventionHistory: LogEntry[],                           │
│    activeEffects: ActiveEffect[]                              │
│  },                                                          │
│                                                             │
│  detective: {                                                │
│    currentCase: Case | null,                                 │
│    progress: 'intro' | 'investigation' | 'evidence' |       │
│              'verdict' | 'debrief',                          │
│    evidence: EvidenceItem[],                                 │
│    connections: Connection[],                                │
│    usedTools: string[],                                      │
│    startTime: number,                                        │
│    verdict: Verdict | null                                   │
│  },                                                          │
│                                                             │
│  meta: {                                                     │
│    mode: 'strategy' | 'detective' | 'transition',           │
│    caseQueue: string[],      // pending cases                │
│    completedCases: number,                                   │
│    gameStatus: 'playing' | 'won' | 'lost'                    │
│  }                                                          │
│                                                             │
│  actions: {                                                  │
│    strategyTick(), deployIntervention(),                     │
│    startCase(), useTool(), makeConnection(), submitVerdict(),│
│    applyOutcome(), switchMode(),                             │
│    reset()                                                    │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

### 2.3.2 Simulation Tick

```
Each tick (every 1 second of game time, 60x real-time speed):

1. Calculate new R₀ from current parameters:
   R₀(t+1) = baseR₀ × (1 − literacyRate × 0.3)
            × (1 − factCheckCoverage × 0.4)
            × (1 − algorithmAuditActive × 0.3)
            × randomNoise(±0.05)

2. Update S/E/I/R populations using discrete SIR-like model:
   ΔS = −β × S × I / N        (exposure)
   ΔE = +β × S × I / N − κ × E (incubation: exposed → infected)
   ΔI = +κ × E − γ × I        (recovery: infected → σ-aware)
   ΔR = +γ × I
   where β = R₀ × γ, γ = 0.1, κ = 0.15

3. Update σ-coherence:
   σ(t+1) = σ(t) + Δσ_interventions − Δσ_disinformation
   where Δσ_interventions = sum of active intervention effects
   and Δσ_disinformation = 0.5 × (I / N) × (100 − σ(t))

4. Check phase transitions:
   if R₀ > 1.0 for >5s → enter Outbreak phase
   if σ < 30 → trigger Critical warning
   if σ < 20 → GAME OVER (σ-trap reached)

5. Calculate district-level statistics from city aggregates
```

## 2.4 Case Data Schema

```typescript
interface Case {
  id: string;
  title: string;
  brief: string;
  milLesson: string;
  introCutscene: CutsceneFrame[];
  evidence: EvidenceItem[];
  correctVerdict: 'real' | 'manipulated' | 'uncertain';
  solution: {
    requiredConnections: [string, string][];
    requiredToolEvidencePairs: [string, string][];
    justificationKeywords: string[];
  };
  outcome: {
    successR0Delta: number;
    successSigmaDelta: number;
    failR0Delta: number;
    failSigmaDelta: number;
  };
}

interface EvidenceItem {
  id: string;
  type: 'video' | 'audio' | 'image' | 'text' | 'metadata';
  src: string;                 // path to asset
  label: string;
  description: string;
  isRedHerring: boolean;
  metadata?: Record<string, string>;
  revealsWithTool?: string;    // tool id that unlocks additional info
  hiddenFinding?: string;      // revealed when correct tool applied
}
```

## 2.5 Mode Integration Bridge

```typescript
function applyCaseOutcome(store: GameStore, verdict: Verdict, caseData: Case): void {
  const isCorrect = verdict.classification === caseData.correctVerdict;
  const isTimely = (Date.now() - store.detective.startTime) < 180000; // 3 min

  if (isCorrect && isTimely) {
    store.strategy.r0 += caseData.outcome.successR0Delta * 1.5; // −0.45
    store.strategy.sigma += caseData.outcome.successSigmaDelta * 1.5; // +7.5
    store.strategy.budget += 50; // bonus
  } else if (isCorrect && !isTimely) {
    store.strategy.r0 += caseData.outcome.successR0Delta;
    store.strategy.sigma += caseData.outcome.successSigmaDelta;
  } else {
    store.strategy.r0 += caseData.outcome.failR0Delta; // +0.4
    store.strategy.sigma += caseData.outcome.failSigmaDelta; // −5
  }

  store.meta.mode = 'transition';
  // 3-second animated transition back to strategy mode
}
```

## 2.6 Tool API Contract

Each forensics tool in `src/detective/tools/` exports:

```typescript
interface ForensicsTool {
  id: string;
  name: string;
  icon: string;             // icon component or path
  description: string;
  canApplyTo: EvidenceType[];
  apply(evidence: EvidenceItem): ToolResult;
}

interface ToolResult {
  findings: string[];       // bullet points discovered
  confidence: number;       // 0–1 how conclusive
  revealsId?: string;       // new evidence unlocked
  triggerAha?: boolean;     // triggers correct-tool animation
}
```

## 2.7 Performance Budget

| Metric | Target | Notes |
|:-------|:------:|:------|
| Load time (first paint) | < 2s | Under 500kB JS bundle, image preloading |
| FPS (strategy mode) | 60fps | LOD for population agents, instanced rendering |
| FPS (detective mode) | 60fps | 2D UI only, no heavy rendering |
| Bundle size (total) | < 800kB | Code splitting by mode |
| Memory | < 200MB | No persistent state, no streaming |
| Offline | Full | No API calls after initial load |
| Browser support | Chrome, Firefox, Safari (last 2 major) | Target 95% of youth users |

## 2.8 Deployment

```
                           ┌──────────────┐
                           │  GitHub Repo  │
                           └──────┬───────┘
                                  │ push
                                  ▼
                           ┌──────────────┐
                           │ GitHub Actions│
                           │  (CI/CD)      │
                           └──────┬───────┘
                                  │ build + deploy
                                  ▼
                    ┌─────────────────────────┐
                    │  Netlify / Vercel        │
                    │  (static site)           │
                    │                          │
                    │  /.                       │ → index.html
                    │  /cases/*                │ → case assets
                    │  /sounds/*               │ → sound files
                    └─────────────────────────┘
```

No server. No database. No authentication. A single-page static application deployed from a GitHub push.
