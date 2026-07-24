# Phase 3: Strategy Mode — City Simulation

**Duration:** 4 days
**Member:** M1
**Dependencies:** Phase 1 (ODE engine)
**Output:** Interactive pixel city grid with heatmap, agents, σ-coherence gauge, time controls

## Tasks

### 3.1 ODE → Canvas Data Bridge
- Create `useSimulation.ts` hook that:
  - Initializes PopulationState from store
  - Runs `simulateStep()` on each animation frame (throttled to 1 game-tick per second real-time)
  - Updates Zustand store with latest snapshot
  - Returns current state for rendering
- **Test:** Watching console.log shows state updating every second

### 3.2 Tile Grid Rendering
- Build 50×50 tile grid via Canvas2D `fillRect`, 20px per tile
- Color each tile based on its district:
  - Foundry: rust/terracotta (#8B4513)
  - Harborview: teal (#2C7A7B)
  - Uptown: gold (#B8860B)
  - Campus: forest green (#4A7C59)
- Draw 1px boundary borders at district edges
- **Test:** Grid renders with correct district colors and visible boundaries

### 3.3 District Heatmap Overlay
- Render semi-transparent color wash over each district via Canvas2D `fillRect` with `globalAlpha`
- Opacity proportional to σ severity:
  - σ ≥ 80 → green (#2ECC71, 10%)
  - σ ≥ 60 → yellow-green (#A8E063, 20%)
  - σ ≥ 40 → yellow (#F1C40F, 35%)
  - σ ≥ 20 → orange (#E67E22, 55%)
  - σ < 20 → red (#E74C3C, 80%)
- **Test:** Heatmap opacity changes as σ value changes

### 3.4 Population Agent Visualization
- Render small 2px-4px dots via Canvas2D `arc`
- Color by state: green (S), yellow (E), red (I), blue (R)
- Count: 80 agents, distributed across 4 districts
- Agents move with random-walk within district bounds, Y-sorted for depth
- Drop shadow under each agent (1px offset)
- **Test:** Agent colors shift as simulation progresses

### 3.5 σ-Coherence Gauge
- Semi-circular gauge in top-right HUD area
- Range: 0–100, gradient green (80–100) → yellow (50–80) → orange (20–50) → red (0–20)
- Needle animates smoothly to current value
- Threshold markers at 20 (trap warning) and 80 (goal)
- **Test:** Gauge follows simulation sigma value with smooth animation

### 3.6 Time Controls
- Play/Pause button
- Speed slider: 1×, 2×, 5×, 10× (changes tick rate)
- Step button: advance one tick manually (when paused)
- Timer display: "Day [n]" (1 tick = 1 day)
- **Test:** Speed slider correctly changes simulation rate

### 3.7 R₀ Trend Graph
- Small line graph (200px wide) in bottom HUD
- Shows R₀ over last 60 ticks
- Red threshold line at R₀ = 1.0
- Green zone below 0.8, red zone above 1.5
- Auto-scrolling (newest at right edge)
- **Test:** Line trends upward without interventions, drops when interventions applied

### 3.8 Warning System
- Toast notification when R₀ crosses 1.0: "⚠️ Outbreak detected"
- Warning when σ drops below 30: "⚠️ Critical coherence loss"
- Warning when any district R₀ > 2.0: "⚠️ District X: uncontained spread"
- Warning persists for 5 seconds or until dismissed
- **Test:** Manual-trigger each warning level

## Acceptance Criteria
- [ ] City grid renders with district colors that update every tick
- [ ] Heatmap opacity changes with σ severity
- [ ] Population agents shift colors correctly
- [ ] σ-coherence gauge animates smoothly
- [ ] Time controls (play/pause/speed/step) work correctly
- [ ] R₀ trend graph shows scrolling history
- [ ] Warning notifications trigger at correct thresholds
- [ ] All Canvas2D rendering maintains 30fps on integrated GPU
