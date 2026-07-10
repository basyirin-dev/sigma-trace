# Phase 8: Mode Integration

**Duration:** 3 days
**Members:** M1+M2
**Dependencies:** Phases 4 + 6
**Output:** Seamless two-mode gameplay loop with progression gates

## Tasks

### 8.1 Mode Transition UX
- Between-strategy transition: when player wins/loses strategy mode → modal "CASE UNLOCKED" animation → "Begin Investigation" button
- Between-case transition (detective mode): debrief → "RETURN TO CITY" button → strategy mode resumes with time frozen during case
- Incoming transition animation: screen flash, city fades in
- **Test:** Full loop: Strategy → Detective (Case 1) → Strategy → Detective (Case 2) → Strategy → Detective (Case 3) → Victory screen

### 8.2 Strategy Pause on Case Entry
- When player enters detective mode:
  - Strategy simulation state is frozen (time stopped)
  - Stores latest snapshot in `pausedState`
  - HUD shows "City Paused" indicator
- When player returns:
  - Simulation resumes from frozen state
  - "City Resumed" toast
- **Test:** Strategy state unchanged after detective session

### 8.3 Budget Transfer
- Detective mode case results award budget to strategy mode:
  - S grade: +100
  - A grade: +75
  - B grade: +50
  - C grade: +25
  - F grade: +0
- Award animation on debrief screen
- Strategy HUD shows budget increase on return
- **Test:** Complete Case 1 with S grade → strategy budget increases by 100

### 8.4 Strategy Outcome → Detective Unlock
- Strategy mode outcomes affect which cases are accessible:
  - R₀ kept below 1.5 for entire strategy session → Case 1 unlocked (early detection of disinformation)
  - σ-coherence never dropped below 40 → Case 2 unlocked (high societal trust means voice scams surface)
  - Won game (survived 120 ticks with R₀ < 1.0) → Case 3 unlocked (successful society → deepfake attack on stability)
  - If conditions not met → case is grayed out with hint: "Maintain R₀ < 1.5 to unlock this case"
- **Test:** Bad strategy performance → only Case 1 available

### 8.5 Detective Success → Strategy Buff
- Completing detective cases provides permanent buffs in strategy mode:
  - Case 1 (S/A grade): +10% intervention effectiveness
  - Case 2 (S/A grade): +50 starting budget on future runs
  - Case 3 (S/A grade): Emergency Broadcast intervention unlocked (super-effective, 300 cost, 60s cooldown)
- Buffs displayed in strategy mode HUD under "Active Intelligence"
- **Test:** Complete Case 1 with A → interventions reduce R₀ by 10% more

### 8.6 Endgame Victory Screen
- When all 3 cases solved + strategy mode won:
  - "MISSION COMPLETE" screen with animated background
  - Stats summary: total score, time played, interventions deployed, cases solved, accuracy
  - Grade: S/A/B/C (composite of all modes)
  - MIL achievement badges: "Fact Checker", "Deepfake Hunter", "Voice of Truth", "Master Analyst"
  - "Play Again" button → full reset
  - "Share" button → downloadable scorecard image
- **Test:** End-to-end victory flow produces correct stats

### 8.7 Game Over (Strategy Loss)
- If σ-trap triggers or R₀ exceeds 3.0 for 10 consecutive ticks:
  - "GAME OVER — CIVILIZATION COLLAPSE" screen
  - Post-mortem analysis: what went wrong, which interventions would've helped
  - "Try Again" button → restart strategy mode (detective progress preserved)
- **Test:** Trigger game over intentionally → correct screen and post-mortem

## Acceptance Criteria
- [ ] Full gameplay loop: Strategy → Detective → Strategy → ... → Victory
- [ ] Strategy pauses correctly during detective mode
- [ ] Budget transfers from detective to strategy mode
- [ ] Strategy outcomes gate detective case unlocks
- [ ] Detective success provides permanent strategy buffs
- [ ] Victory screen shows correct stats, grade, and badges
- [ ] Game over screen with helpful post-mortem
- [ ] Player progress preserved between modes
