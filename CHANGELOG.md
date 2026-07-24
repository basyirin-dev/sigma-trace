# Changelog

All notable changes to GIHA are documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- CHANGELOG.md (this file)
- ASSETS.md — asset provenance documentation
- Mutual cross-references between roadmap risk register and CC4 risk register

### Fixed
- GDD Section 1.8: save/load status updated from "Cut" to "Implemented"

## Phase 9 — Polish (Jul 30 – Aug 4)

### Added
- FPS counter overlay toggle in CityCanvas
- Debug overlay panel (Ctrl+Shift+D, `?dev` query param)
- Session event logger (usePlaytestStore + usePlaytestLogger)
- Dev console commands (completeCase, exportLog, toggleDevMode on `window.__GIHA_DEV__`)
- Monologue overlay (4 protagonist internal monologue moments)
- Contextual hint system (useHintDetection, HintToast)
- Diegetic Help Desk / "GIHA Field Manual" modal in HUD
- Keyboard shortcuts: number keys 1-6 for detective tools
- Skip-to-content link for keyboard users
- Focus trapping in Modal component
- aria-live regions on WarningToast and HintToast
- Track best grade per case (bestCaseResults)
- Achievement badge persistence across sessions
- "Records" modal on TitleScreen showing earned badges and grades
- Button-click and tool-result SFX wired (were preloaded but orphaned)
- Consolidated duplicate audio preloading (useAudioManager is now sole source)

### Changed
- Visual style guide colors aligned with production variables.css
- Stationery guide typography updated to BoldPixels (was Inter/JetBrains Mono)
- Narrative builders extracted from DetectiveMode.tsx to separate file
- Badge computation extracted to shared utility (badgeUtils.ts)
- hasSave() now validates save data structure, not just key existence
- loadGame() uses atomic validate-then-apply pattern
- New Game shows confirmation modal when save exists
- Save data version bumped to 4 (added earnedBadges, bestCaseResults, failedCaseCount)
- localStorage key registry centralized (localStorageKeys.ts)
- Button component now plays click SFX
- TitleScreen Credits modal expanded with all third-party asset packs
- CSS module fallback values aligned with actual variables
- Brand docs updated to reflect production purple logo
- GDD sound spec updated to match implementation (static MP3 loops, no adaptive pitch)
- Modern Interiors Free pack removed (non-commercial license)
- AGENTS.md updated with MCP usage and coding conventions

## Phase 8 — Mode Integration (Jul 23 – 25)

### Added
- Full gameplay loop: Strategy → Detective → Strategy → ... → Victory
- Strategy pauses correctly during detective mode
- Budget transfers from detective to Strategy mode
- Strategy outcomes gate detective case unlocks
- Detective success provides permanent strategy buffs
- Victory screen with stats, grade, and badges
- Game over screen with procedural post-mortem analysis
- Player progress preserved between modes

### Changed
- Case unlock gating: case 1 always open, case 2 at σ≥40, case 3 at tick≥120 + R₀<1.0

## Phase 7 — Forensics Toolkit (Jul 22 – 24)

### Added
- 6 forensic analysis tools: Spectrogram, Frame Stepper, Metadata Inspector, Source Tracer, Inconsistency Highlighter, Timeline Cross-Referencer
- Tool tutorials with overlay on first use
- Tool result modal with analyzing animation
- Scoring engine (accuracy 50%, tool efficiency 20%, connections 15%, justification 15%, time bonus ±5%)
- Debrief screen with grade, score breakdown, MIL lesson

## Phase 6 — Detective Cases (Jul 16 – 22)

### Added
- 3 detective cases: "The Viral Mayor", "Grandma's Distress Call", "The Front Page"
- Case evidence files (video, audio, images) in `/public/cases/`
- Cutscene system with typewriter effect
- Evidence board with drag-and-drop connections
- Verdict panel with classification + justification
- Conclusion narratives with Mira outcome branching

## Phase 5 — Detective Framework (Jul 16 – 21)

### Added
- Case state machine (intro → investigation → evidence → verdict → debrief)
- Cutscene player with skip functionality
- Evidence board with connections and context menu
- Evidence card component with type badges and flip animation
- Toolbelt with tool selection and used/cooldown badges

## Phase 4 — Strategy Interventions (Jul 16 – 21)

### Added
- 6 interventions: Fact-Check Bureau, School MIL Program, Algorithm Audit, Community Dialog, Source Verification Campaign, Emergency Broadcast
- Intervention card with cost/cooldown/effect display
- Intervention palette with filtering
- Deploy confirmation modal showing estimated effect
- Cooldown tracking per intervention
- Budget system (start 500, +5/tick income, grade bonuses)
- Intervention rings on the city canvas

## Phase 3 — Strategy Simulation (Jul 16 – 21)

### Added
- Canvas2D city rendering with 50×50 tile grid
- 4 district quadrants with color coding
- Agent population system (80 agents, S/E/I/R compartments)
- Agent movement with random-walk and district affinity
- Sigma-coherence gauge with smooth animation
- R₀ trend graph with scrolling history
- Time controls (play/pause/speed/step)
- Phase transition animations (flash/dim)
- Warning notification system
- Hint detection system
- City heatmap overlay

## Phase 2 — Game Scaffold (Jul 11 – 15)

### Added
- React Router setup with lazy-loaded routes (/strategy, /detective/:caseId)
- Zustand stores (gameStore, useSimulationStore, useWarningStore, useAudioStore, useInterventionLogStore)
- Shared component library (HUD, Modal, Button, Tooltip)
- Canvas2D strategy scene with pixel-art rendering
- Title screen with logo animation and menu
- Mode transition animation screen
- Global CSS variables and pixel theme
- Error boundary with fallback UI

## Phase 1 — ODE Engine (Jul 11 – 15)

### Added
- S/E/I/R compartment model with discrete-time simulation
- R₀ computation with intervention modifiers
- σ-coherence dynamics (decay + recovery)
- σ-trap detection logic
- Phase classifier mapping 4 states (calm/outbreak/crisis/trap)
- 4 districts with distinct vulnerability profiles
- 3-act difficulty ramp with escalating R₀
- Win/loss conditions (σ ≥ 80 + R₀ < 0.8 + 3 cases completed or loss by collapse/failed cases)

## Phase 0.5 — Design Lock (Jul 10 – 11)

### Added
- Scope lock document (all features finalized)
- Story bible (narrative overview, protagonist, GIHA agency, Veritas city, 4 districts, campaign arc)
- Visual style guide (markdown + interactive HTML mockup)
- Stationery style guide (GIHA brand identity + document templates)
- ODE parameter tuning specification
- AGENTS.md with team and coding conventions

## Phase 0 — Repo Setup (Jul 9 – 10)

### Added
- Vite + React 19 + TypeScript 6 project scaffold
- ESLint + Prettier configuration
- Vitest test setup with jsdom and React Testing Library
- GitHub Actions CI (lint → typecheck → test → build)
- Netlify deployment configuration
- Directory structure with barrel exports
- Placeholder tests
- Canvas2D test scene
- Husky pre-commit hooks
- Basic AGENTS.md
