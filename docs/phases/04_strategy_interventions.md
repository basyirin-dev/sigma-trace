# Phase 4: Strategy Mode — Interventions

**Duration:** 4 days
**Member:** M1
**Dependencies:** Phase 3
**Output:** Fully functional intervention system with cards, effects, and timeline

## Tasks

### 4.1 Intervention Definition
- Define `INTERVENTIONS` constant array in `src/strategy/interventions/data.ts`:
  - Each entry: `{ id, name, description, cost, cooldown, duration, effects: { r0Delta, sigmaDelta, literacyBoost }, icon }`
  - 6 interventions: FactCheckBureau, SchoolMILProgram, AlgorithmAudit, CommunityDialog, SourceVerificationCampaign, EmergencyBroadcast
- **Test:** All 6 interventions defined with valid parameters

### 4.2 Intervention Card Component
- `InterventionCard.tsx`: displays icon, name, cost, cooldown progress, brief description
- States: available (clickable), on-cooldown (grayed, countdown), locked (insufficient budget)
- Hover: tooltip with full description + effect values
- **Test:** All 3 states render correctly

### 4.3 Intervention Palette
- `InterventionPalette.tsx`: sidebar containing all 6 cards, arranged by cost
- Scrollable if cards exceed viewport height
- "Deploy" button at bottom (disabled if no card selected)
- Selected card has highlight border
- **Test:** Select card → deploy button enables → click → card enters cooldown

### 4.4 Deployment Confirmation
- Modal when deploy is clicked: "Deploy [Intervention Name]? Cost: [n]"
- Shows preview of estimated effect: "Estimated R₀ reduction: −0.2 for 15s"
- Cancel and Confirm buttons
- **Test:** Confirm deducts budget and activates effect, Cancel returns to palette

### 4.5 Effect Wiring to ODE
- `useActiveEffects.ts`: runs alongside simulation, tracks which interventions are active
- On deploy: create `ActiveEffect` with startTime and duration
- Pass active effects to `simulateStep()` via modified params
- Effects expire automatically after duration
- **Test:** Deploy FactCheckBureau → next tick shows modified R₀

### 4.6 Intervention Timeline Log
- `InterventionTimeline.tsx`: vertical timeline showing all deployed interventions
- Each entry: timestamp, intervention name, cost, effect applied
- Color-coded by success (effect was active during high R₀ → red, low R₀ → green)
- Auto-scrolls to latest entry
- **Test:** Deploy 3 interventions → timeline shows all 3 in correct order

### 4.7 Budget System
- Start budget: 500
- Income: +5 per tick (passive), +50 per case solved
- Cost: subtracted on deploy
- UI: budget display in HUD, flash red when insufficient
- **Test:** Budget decreases on deploy, increases on tick and case solve

### 4.8 Intervention Effectiveness Visualization
- When an intervention is active, show a colored pixel-ring overlay on affected district tiles
- Ring thickness = remaining duration (in tiles)
- Ring color matches intervention type
- **Test:** Deploy intervention → ring appears → ring shrinks → ring disappears

## Acceptance Criteria
- [ ] All 6 interventions defined with distinct effects and costs
- [ ] Intervention card shows correct state (available/cooldown/locked)
- [ ] Palette renders with selection and deploy
- [ ] Confirmation modal shows estimated effect
- [ ] Effects propagate to ODE simulation correctly
- [ ] Timeline logs all deployments with timestamps
- [ ] Budget system works (spend, earn, flash on insufficient)
- [ ] Visual ring shows active intervention duration
- [ ] Gameplay feels balanced: player can win with smart intervention timing
