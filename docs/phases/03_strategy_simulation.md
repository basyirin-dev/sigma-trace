# Phase 3: Strategy Mode — City Simulation

**Duration:** 4 days
**Member:** M1
**Dependencies:** Phase 1 (ODE engine)
**Output:** Interactive city grid with heatmap, σ-coherence gauge, time controls

## Tasks

### 3.1 ODE → Three.js Data Bridge
- Create `useSimulation.ts` hook that:
  - Initializes PopulationState from store
  - Runs `simulateStep()` on each animation frame (throttled to 1 game-tick per second real-time)
  - Updates Zustand store with latest snapshot
  - Returns current state for rendering
- **Test:** Watching console.log shows state updating every second

### 3.2 City Grid Rendering
- Build `CityGrid.tsx` with 10×10 grid of instanced mesh buildings
- Color each building based on its district's infection level:
  - S > 75% → green (#2ECC71)
  - E > 25% → yellow (#F1C40F)
  - I > 15% → orange (#E67E22)
  - I > 30% → red (#E74C3C)
  - σ-trap → gray (#2C3E50)
- Add subtle height variation (randomize building height within district)
- **Test:** Grid renders with correct colors, changes as simulation progresses

### 3.3 District Heatmap Overlay
- Render semi-transparent colored plane over each district
- Color intensity corresponds to R₀ (higher = more saturated)
- Pulse animation when district R₀ > 1.0 (slow pulse every 2s)
- **Test:** Heatmap pulses red when R₀ crosses threshold

### 3.4 Population Agent Visualization
- Render small dots (CircleGeometry) moving within each district
- Color by state: green (S), yellow (E), red (I), blue (R)
- Count proportional to actual S/E/I/R distribution (1 agent = 1000 people)
- Agents move randomly within district bounds
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
- [ ] Heatmap pulses red when R₀ > 1.0
- [ ] Population agents shift colors correctly
- [ ] σ-coherence gauge animates smoothly
- [ ] Time controls (play/pause/speed/step) work correctly
- [ ] R₀ trend graph shows scrolling history
- [ ] Warning notifications trigger at correct thresholds
- [ ] All Three.js rendering maintains 30fps on integrated GPU
