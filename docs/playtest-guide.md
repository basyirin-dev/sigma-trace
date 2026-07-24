# GIHA Playtest Guide — Comprehensive Walkthrough

Two playthroughs designed to exercise every feature in the game.
Playthrough A wins; Playthrough B loses.

---

## How to Win: Core Strategy Reference

### Win Condition
```
σ ≥ 70  AND  R₀ < 1.2  AND  3 cases completed  AND  30 stable ticks
```

### Loss Conditions (avoid all of these)
```
1. City-wide R₀ > 2.0 for 40 consecutive ticks
2. Any district R₀ > 2.0 for 40 consecutive ticks
3. σ < 10 for 5 consecutive ticks (sigma trap)
4. 4 failed detective cases (grade F)
```

### Key Thresholds
```
Case 2 unlocks:  σ ≥ 40
Case 3 unlocks:  tick ≥ 80  AND  R₀ < 1.5
Budget income:   base $1.0/tick + σ/100 × $5.0
Difficulty ramp: Act 1 (ticks 1-40, R₀ 0.8→1.2)
                 Act 2 (ticks 41-80, R₀ 1.2→1.7)
                 Act 3 (ticks 81-120, R₀ 1.7→2.15)
                 Endgame (tick 121+, R₀=2.15)
```

### Intervention Reference
```
Fact-Check Bureau      $50 | R₀ -0.4, σ +2 | cooldown 10 ticks
School MIL Program     $80 | σ +4           | cooldown 15 ticks
Algorithm Audit        $60 | R₀ -0.3, σ +1 | cooldown 12 ticks
Community Dialog       $40 | σ +3           | cooldown 8 ticks
Source Verification    $70 | R₀ -0.5, σ +1 | cooldown 14 ticks
Emergency Broadcast   $120 | R₀ -0.8, σ +5 | cooldown 20 ticks
```

### Case Grade Calculation
```
S = score ≥ 80    → $100 budget bonus
A = score ≥ 70    → $75 budget bonus
B = score ≥ 55    → $50 budget bonus
C = score ≥ 40    → $25 budget bonus
F = score < 40    → $0 budget bonus, counts as failed case
```

---

## Playthrough A: The Winning Path

Play optimally. Complete all 3 cases with S/A grades. Achieve victory.

---

### Phase A1 — Title Screen

**What to do:**

1. Open the game. The Title Screen displays:
   - Animated canvas background with floating pixel particles
   - GIHA Logo (purple shield, alt text: "GIHA Logo")
   - Subtitle: *"A Two-Mode Game for Media & Information Literacy"*
   - Buttons: New Game, How to Play, About, Credits

2. **Click "How to Play"** — Read the modal explaining the two modes and the win condition. Press Escape to close.

3. **Click "About"** — Read the project description. Close.

4. **Click "Credits"** — Read the credits showing team, tech stack, and all 8 third-party asset packs (Pixel Art Top Down, Industrial Tileset, Mini-World Sprites, Pixel Crawler, 32rogues, UI Essentials, Dungeon Tileset, BoldPixels). Close.

5. **Click "New Game"** — You enter Strategy Mode directly. (If a save exists, a confirmation modal appears: "Start Fresh?" — click "Start Fresh".)

**Features tested:** animated canvas, logo rendering, How to Play modal, About modal, Credits modal (8 pack attributions), New Game button, confirmation modal (if save exists).

---

### Phase A2 — Strategy Mode: First 40 Ticks (Act 1)

**What to do:**

1. **Dismiss the Strategy Tutorial:** A 4-step overlay appears explaining the game. Click "Got It" to dismiss.

2. **Immediately deploy Fact-Check Bureau:**
   - Open the Intervention Palette (right sidebar)
   - Click "Fact-Check Bureau" ($50, R₀ -0.4, σ +2)
   - Click "Confirm" in the deployment modal
   - You hear the intervention-deploy SFX
   - A colored intervention ring appears on the city canvas

3. **Speed up to 2x:** Press **2** on your keyboard. Simulation runs faster.

4. **Open Settings:** Click the gear icon (⚙) in the HUD. Adjust the Music Volume slider to your preference. Close Settings.

5. **When Fact-Check comes off cooldown** (10 ticks), deploy it again.

6. **Alternate:** Fact-Check → wait 10 ticks → Fact-Check again. Do this until tick 25.

7. **At tick 25, switch to:** Deploy "School MIL Program" ($80, σ +4). This boosts σ to keep it above 40.

8. **Monitor your budget target:** Keep budget ≥ $100 at all times. Budget income is $1.0/tick + (σ/100 × $5.0). At σ=60, that's $1 + ($60/100 × $5)=$4/tick.

9. **By tick 40, your goal state:**
   - σ ≥ 45 (above 40 for Case 2 unlock)
   - R₀ between 0.8 and 1.2 (Act 1 baseline)
   - Budget ≥ $100
   - 2-3 fact-checks deployed

**Features tested:** City canvas (4 district colors, procedural buildings, agent dots), HUD (σ, R₀, Budget, Phase), intervention deploy + cooldown + ring animation, Settings panel (volume sliders), keyboard speed shortcuts (1-4 keys), Space to pause, S to step, district targeting via canvas click.

---

### Phase A3 — Strategy Mode: Ticks 41-80 (Act 2)

**What to do:**

1. **R₀ will increase** naturally through Act 2 (1.2 → 1.7). Deploy "Algorithm Audit" ($60, R₀ -0.3, σ +1) alternating with Fact-Check.

2. **Case 2 unlocks** when σ ≥ 40. If you've kept σ above 40, the Case Selector opens in the right sidebar.

3. **DO NOT start the case yet.** First, stabilize the city:
   - Deploy "Community Dialog" ($40, σ +3) — cheap, quick cooldown (8 ticks), great for stabilizing σ
   - Keep R₀ below 1.5. If R₀ exceeds 1.5, deploy Source Verification ($70, R₀ -0.5)
   - Run speed 5x (press **3**) or 10x (press **4**)

4. **Your strategy mid-game:**
   ```
   Cycle 1: Fact-Check (cost $50)         → wait 10 ticks
   Cycle 2: Algorithm Audit (cost $60)    → wait 12 ticks
   Cycle 3: Fact-Check (cost $50)         → wait 10 ticks
   Cycle 4: Fact-Check or Community Dialog → wait...
   ```

5. **When ready (σ ≥ 50, R₀ ≤ 1.2, budget ≥ $150):**
   - Click "The Viral Mayor" (Case 1) in the Case Selector
   - Click "Start"

6. **Transition Screen** appears with newspaper headline. Click "Begin Investigation."

**Features tested:** Case unlock gating (σ ≥ 40), Case Selector UI in sidebar, locked/unlocked states, Transition Screen animation, music crossfade (strategy→detective, 1-second).

---

### Phase A4 — Detective Mode: Case 1 "The Viral Mayor"

**How to get S grade (score ≥ 90):**

**Objective:** Prove the mayor's resignation video is a deepfake.

**Evidence items:**
```
E01: Mayor's Resignation Video   (video)     — the main video file
E02: Audio Spectrogram Data      (audio)     — audio frequency analysis
E03: Upload Metadata             (metadata)  — file creation + upload details
E04: Lip-Sync Analysis           (video)     — frame-by-frame lip movement
E05: Source Trace Report         (text)      — upload timeline
E06: Financial Trail             (text)      — VeraTech shell company
```

**Step-by-step:**

1. **Cutscene advances:** Press Enter or Space to advance through 6 frames of typewriter text. Click "Skip" after 2 seconds to skip all remaining frames.

2. **Press 1 → Spectrogram tool:** Click E02 (Audio Spectrogram Data). The tool analyzes frequency bands. The finding mentions 2-4kHz AI artifacts. Click "Add to Board."

3. **Press 2 → Frame Stepper tool:** Click E01 (Mayor's Resignation Video). Step through frames 120-150. The finding mentions lip-sync mismatch. Click "Add to Board."

4. **Press 3 → Metadata Inspector:** Click E03 (Upload Metadata). Shows Vegas Pro 21.0, 2:47 AM creation, VM fingerprint. Click "Add to Board."

5. **Press 4 → Source Tracer:** Click E05 (Source Trace Report). Shows a 25-minute creation-to-publish window. Click "Add to Board."

6. **Press 6 → Timeline Cross-Referencer:** Click E01. Checks 5/6 events flagged. Click "Add to Board."

7. **Connect evidence on the board:**
   - Drag from E01's gold connect handle to E04 (video ↔ lip-sync)
   - Drag from E03 to E05 (metadata ↔ timeline)
   - Drag from E01 to E06 (video ↔ financial trail)
   - You need ≥ 3 connections for maximum connection score. Gold SVG lines animate between cards.

8. **Click "Submit Verdict."** The Verdict Panel appears.

9. **Select "MANIPULATED"** (the correct verdict — the video is a deepfake).

10. **Write a justification** (minimum 20 characters, longer for higher score):
    ```
    The 25-minute creation-to-publish window is impossible for authentic video. Vegas Pro metadata + VM fingerprint + 2-4kHz AI audio artifacts confirm deepfake.
    ```

11. **Click "Submit Verdict."**

12. **Score calculation:** accuracy (50%) + tool efficiency (20%) + connections (15%) + justification (15%) + time bonus (±5%). You should get S (98-100).

13. **Debrief Screen:**
    - Animated score counter (counts up)
    - Grade: S in gold (#f39c12)
    - Score breakdown bars (accuracy, tool efficiency, connections, justification, time bonus)
    - Conclusion text (narrative outcome)
    - Budget bonus: $100 for S grade
    - MIL Lesson: *"Always verify evidence through multiple independent analyses"*
    - Click "Return to City" to go back to Strategy Mode

14. **Monologue appears:** *"One down. Two to go. They're getting smarter."* Click to dismiss.

15. **Back in Strategy Mode:**
    - Completed Cases: 1/3
    - Budget increased by $100
    - R₀ lowered, σ boosted (from detective outcome)
    - "Fact Checker" badge earned if you deployed 3+ fact-check interventions

**Features tested:** Cutscene (typewriter, Enter/Space advance, Skip after 2s), 6 forensic tool modals (Spectrogram, Frame Stepper, Metadata Inspector, Source Tracer, Inconsistency Highlighter — not used, Timeline Cross-Referencer), tool tutorials on first use, evidence board connections (drag handles, SVG line animation), verdict panel (REAL/MANIPULATED/UNCERTAIN buttons), justification textarea (20 char minimum + character counter), grade calculation (5 components), debrief screen (animated score, grade color, breakdown bars, conclusion text, budget bonus, MIL lesson), keyboard shortcuts (1-6 for tools, Enter/Space for card selection, Shift+F10 for context menu), monologue trigger, Case 1 reward applied.

---

### Phase A5 — Strategy Mode: Ticks 81-120 (Act 3)

**What to do:**

1. **Act 3 is the hardest phase.** R₀ ramps from 1.7 to 2.15. If R₀ exceeds 1.8 for 30 ticks, you lose. You MUST deploy aggressively.

2. **Deploy Source Verification** ($70, R₀ -0.5) — the strongest R₀ reducer. Alternate with Fact-Check.

3. **If R₀ spikes above 1.5:** Deploy Emergency Broadcast ($120, R₀ -0.8, σ +5). This is your panic button. Use sparingly due to 20-tick cooldown.

4. **Maintain σ above 50:** Deploy School MIL Program ($80, σ +4) every 15 ticks.

5. **Case 3 unlock condition:** tick ≥ 120 AND R₀ < 1.0. To reach R₀ < 1.0 in Act 3:
   ```
   Deploy Source Verification → waits 14 ticks → Deploy Fact-Check → wait 10 ticks
   → Deploy Algorithm Audit → wait 12 ticks → repeat cycle
   ```

6. **When R₀ < 1.0 and tick ≥ 120:** Case 3 unlocks. Select "The Front Page" and click "Start."

**Features tested:** Case 3 unlock gating (tick ≥ 120 + R₀ < 1.0), Emergency Broadcast intervention, R₀ danger countdown in HUD (*"Collapse in N"*).

---

### Phase A6 — Detective Mode: Case 2 "Grandma's Distress Call"

**How to get S grade (score ≥ 90):**

**Objective:** Prove the voicemail is an AI-cloned voice scam.

**Evidence items:**
```
E01: Voicemail Recording    (audio)     — the actual voicemail
E02: Call Metadata          (metadata)  — call routing details
E03: Voiceprint Analysis    (audio)     — frequency comparison
E04: Browser Game           (text)      — audio capture mechanism
E05: Financial Trail        (text)      — VeraTech payment
E06: Bank Transfer          (text)      — numbered account
```

**Step-by-step:**

1. **Press 1 → Spectrogram:** Click E01 (Voicemail Recording). The 2-4kHz range shows AI voice uniformity. Click "Add to Board."

2. **Press 1 → Spectrogram again:** Click E03 (Voiceprint Analysis). Same pattern. Add to Board.

3. **Press 3 → Metadata Inspector:** Click E02 (Call Metadata). Shows call routing impossible in <1 second. Add to Board.

4. **Press 4 → Source Tracer:** Click E05 (Financial Trail). Shows VeraTech $5,000 payment and timeline. Add to Board.

5. **Press 6 → Timeline Cross-Referencer:** Click E01. Shows 3/6 events suspicious. Add to Board.

6. **Connect 3+ evidence pairs on the board.**

7. **Submit verdict: "MANIPULATED"** — the voicemail is AI-cloned.

8. **Justification:**
   ```
   The call routing traversed 4 countries in under 1 second — physically impossible. AI voice uniformity in 2-4kHz band confirms cloning.
   ```

9. **Grade: S (or A if you missed a tool).** Budget bonus: $100 (S) or $75 (A).

0. **Back in Strategy Mode:**
   - Completed Cases: 2/3
   - "Voice of Truth" badge earned (Case 2 S/A grade)
   - Case 2 S/A gives you +50 starting budget bonus on future runs

**Features tested:** Case 2 evidence items (audio + metadata), Spectrogram tool on audio evidence, Metadata Inspector on VoIP call data, Source Tracer on financial trail, persistent buff (Case 2 S/A → +50 starting budget), second case debrief.

---

### Phase A7 — Detective Mode: Case 3 "The Front Page"

**How to get S grade (score ≥ 90):**

**Objective:** Prove the protest photo is a misattributed stock image from 2,000km away.

**Evidence items (8 total):**
```
E01: Viral Protest Photo      (image)     — main photo, has architecture evidence
E02: Lighting Analysis        (image)     — sun position data, has inconsistency annotations
E03: Photo Metadata           (metadata)  — camera + GPS data
E04: Bot Amplification Report (text)      — bot share analysis
E05: Mira Petrova Profile     (text)      — triggers Mira monologue
E06: Internal Memo            (text)      — VeraTech internal comms
E07: Geolocation Data         (metadata)  — coordinates mismatched
E08: Encrypted Message        (text)      — intercepted communication
```

**Step-by-step:**

1. **Press 5 → Inconsistency Highlighter:** Click E01 (Viral Protest Photo). Shows European architecture + metric signage annotations. Add to Board.

2. **Press 5 again:** Click E02 (Lighting Analysis). Shows 15° sun position discrepancy — definitive proof. Annotations: "Actual Sun (40° NE)" and "Expected Sun (25° SE)" with colored bounding boxes. Add to Board.

3. **Press 2 → Frame Stepper:** Not applicable (no video). Skip this tool.

4. **Press 3 → Metadata Inspector:** Click E03 (Photo Metadata). Shows Canon 5D Mark IV, GPS at 48.8566° N, 2.3522° E (Locations is 2,000km from Veritas). Add to Board.

5. **Press 4 → Source Tracer:** Click any evidence. Shows 7-event photo manipulation timeline. Add to Board.

6. **Press 6 → Timeline Cross-Referencer:** Click any evidence. Shows 4/7 events suspicious. Add to Board.

7. **Click E05 (Mira Petrova Profile)** with any tool. Monologue appears:
   *"Oh no. She's not a villain. She's a victim."* Click to dismiss.

8. **Connect 3+ evidence pairs** on the board.

9. **Submit verdict: "MANIPULATED"** — the photo is falsely attributed.

10. **Justification:**
    ```
    Sun position analysis shows 15° discrepancy — photo was taken at a location 2,000km NE of Veritas. GPS coordinates confirm European city. Bot amplification was 78% from VeraTech IPs.
    ```

11. **Grade: S.** Budget bonus: $100.

12. **Back in Strategy Mode:**
    - Completed Cases: 3/3
    - "Master Analyst" badge earned (all 3 cases S/A)
    - "Deepfake Hunter" badge earned (Case 1 S/A)
    - Case 3 S/A upgrades Emergency Broadcast
    - All 4 achievement badges earned

**Features tested:** Case 3 (8 evidence items), Inconsistency Highlighter with image annotations (sun position analysis, European architecture), Source Tracer (7-event timeline), Timeline Cross-Referencer, Mira reveal monologue trigger, persistent buffs (Case 3 S/A → upgraded Emergency Broadcast), achievement badges (3/4 + Master Analyst), all 6 tools used across the 3 cases.

---

### Phase A8 — Strategy Mode: Endgame & Victory

**What to do:**

1. **All 3 cases completed.** Now your goal is:
   ```
   σ ≥ 80  AND  R₀ < 0.8  AND  45 stable ticks
   ```

2. **If σ < 80:** Deploy School MIL Program ($80, σ +4) and Community Dialog ($40, σ +3) on cycle.

3. **If R₀ ≥ 0.8:** Deploy Source Verification ($70, R₀ -0.5) and Fact-Check ($50, R₀ -0.4).

4. **At this point you have active buffs from all 3 cases:**
   - Case 1 S/A: +10% intervention effectiveness
   - Case 2 S/A: +50 starting budget
   - Case 3 S/A: Upgraded Emergency Broadcast

5. **Monitor the HUD.** When σ ≥ 80, R₀ < 0.8, and 45 ticks pass, victory triggers.

6. **Transition Screen** → "MISSION COMPLETE" → "View Results."

7. **Victory Screen:**
   - **Grade circle:** Composite grade based on average of 3 case grades
     - S = avg ≥ 4.5, A = avg ≥ 3.5, B = avg ≥ 2.5, C = avg ≥ 1.5, F = avg < 1.5
     - Three S grades → avg 5.0 → composite S (gold)
   - **Stats grid:** σ value, R₀ value, Cases Solved (3/3), Budget, Interventions Deployed, Ticks Survived
   - **Badges section:** "Fact Checker," "Deepfake Hunter," "Voice of Truth," "Master Analyst" — all 4 shown
   - **MIL Lessons list:** 3 lessons displayed
   - **"Share Scorecard"** — click to download a 400×500 PNG
   - **"Continue Playing"** — return to strategy mode
   - **"Play Again"** — full reset to Title Screen

8. **Click "Share Scorecard"** — a PNG downloads with your stats and grade.

**Features tested:** Victory condition (σ ≥ 80 + R₀ < 0.8 + 3 cases + 45 ticks), victory screen (grade circle, stats grid, badges, MIL lessons), Share Scorecard (Canvas2D PNG export), Continue Playing, Play Again (full reset), all 4 achievement badges displayed.

---

### Phase A9 — Save/Load & Records Verification

**What to do:**

1. **Back on Title Screen** (after Play Again), verify:

2. **"Continue" button** appears with timestamp: *"Continue (X min ago)"*

3. **"Records" button** appears (since you have completed cases). Click it:
   - Best composite grade: S (gold)
   - Badges Earned: shows "Fact Checker," "Deepfake Hunter," "Voice of Truth," "Master Analyst"
   - Best Case Grades: Case 1: S, Case 2: S, Case 3: S

4. **Click "Continue"** — game restores from localStorage.
   - Budget, σ, R₀, tick all restored
   - Active effects restored
   - Completed cases: 3/3

5. **Click "New Game"** — confirmation modal appears: *"A saved game exists. Starting a new game will delete it."*
   - Click "Cancel" → modal closes
   - Click "New Game" again → "Start Fresh" → save is cleared, new game starts

6. **Check debug overlay:** Press **Ctrl+Shift+D** — a dark bar at the bottom shows σ, R₀, budget, tick, phase, speed, mode, status, active effects, and recent session events. Press again to hide.

**Features tested:** Save/load (localStorage), Continue button with timestamp, Records modal (composite grade, badges, best grades), New Game confirmation / save overwrite, corrupt save recovery modal, debug overlay toggle (Ctrl+Shift+D), session event log.

---

## Playthrough B: The Losing Path

Make deliberately poor decisions to trigger every failure state.

---

### Phase B1 — Title Screen & Fresh Start

1. On Title Screen, if "Continue" button appears, click "New Game" → "Start Fresh."

2. If the save is corrupt (simulated by manually mangling localStorage), the "Continue" button won't appear. If you somehow trigger it, you see a "Save Data Error" modal with "Delete & Start Fresh" option.

**Features tested:** New Game confirmation (save overwrite), corrupt save handling.

---

### Phase B2 — Strategy Mode: Neglect Interventions

**Objective:** Let R₀ grow unchecked. Do NOT deploy any interventions.

1. Dismiss the Strategy Tutorial.

2. **Press 4** for 10x speed. Watch the simulation run.

3. **Do nothing.** Let R₀ climb.

4. **Observe:**
   - Warning toasts slide in as R₀ crosses 1.0 and 1.5
   - Background music drops to 30% volume during warnings
   - HUD shows "Collapse in N" countdown
   - Phase changes cascade: Calm (green) → Outbreak (amber) → Crisis (orange, pulsing) → eventually Sigma Trap (red)
   - σ drops toward 0

5. **Three possible loss triggers** (whichever happens first):
   - R₀ > 1.8 for 30 ticks → game over
   - σ < 20 for 5 ticks → sigma trap → game over
   - After 3 consecutive failed case verdicts (later phases)

6. **Game Over Screen:**
   - Red title with pulse-danger animation (1.5s)
   - Procedural post-mortem analysis listing which interventions would have helped
   - "Try Again" button

7. **Click "Try Again":**
   - Game-over SFX stops immediately
   - All SFX + music stop
   - Strategy resets to fresh state
   - Detective progress preserved (completed case results stay)
   - Budget bonus from previous detective work preserved (startingBudgetBonus)

**Features tested:** All 3 loss conditions (R₀ > 1.8, σ-trap, σ<20), R₀ danger countdown, phase transitions (every direction), warning toast (5 narrative messages, slide animation, aria-live), audio dim (30% during warnings), game over screen (procedural post-mortem, pulse-danger animation), Try Again (SFX/music stop, strategy reset, detective preservation).

---

### Phase B3 — Detective Mode: Fail Cases

**Objective:** Submit wrong verdicts for all 3 cases to trigger the 3-failed-cases loss.

1. Start Case 1.

2. **Don't use any tools.** Don't connect any evidence.

3. **Submit verdict: "REAL"** (wrong — the video is manipulated).

4. Write a justification under 20 characters: "looks real" — this is too short and will fail validation. Write exactly 20 characters: "looks real to me   . " (spaces count).

5. **Click "Submit Verdict."** Score: F (likely 20-30).

6. **Debrief:** Grade F in red (`#e74c3c`), $0 budget bonus, conclusion text says you were wrong.

7. Repeat for Case 2 (submit "REAL" — wrong) and Case 3 (submit "REAL" — wrong).

8. **On the 3rd failed case,** the 3-strike loss triggers.

9. **Game Over Screen** with post-mortem noting failed cases.

10. Click "Try Again."

**Features tested:** Wrong verdict submission, F grade display (red color), score breakdown (all bars very low), zero budget award, 3-strike loss condition, failed case tracking.

---

### Phase B4 — Debug Overlay & Dev Console

**What to do (open the game with `?dev` query param):**

1. **Refresh to Title Screen.** Add `?dev` to the URL: `http://localhost:5173/?dev`

2. **Open browser console (F12).** You should see:
   ```
   [GIHA Dev] Dev mode active. Use window.__GIHA_DEV__ API
   [GIHA Dev] Commands: setSigma(), setR0(), setBudget(), ...
   ```

3. **Test each console command:**
   ```js
   window.__GIHA_DEV__.setSigma(75)       // σ = 75
   window.__GIHA_DEV__.setR0(0.5)         // R₀ = 0.5
   window.__GIHA_DEV__.setBudget(999)     // budget = $999
   window.__GIHA_DEV__.setTick(50)        // tick = 50
   window.__GIHA_DEV__.unlockAll()        // case 2 + 3 unlocked
   window.__GIHA_DEV__.skipCooldowns()    // all cooldowns cleared
   window.__GIHA_DEV__.state()            // prints game + sim state
   window.__GIHA_DEV__.addIncome(100)     // +$100 budget
   window.__GIHA_DEV__.forceWin()         // triggers victory
   window.__GIHA_DEV__.forceLoss()        // triggers game over
   window.__GIHA_DEV__.toggleSpeed()      // 1x→2x→5x→10x→1x
   window.__GIHA_DEV__.completeCase('case-01', 'S')  // complete case 1 with S
   window.__GIHA_DEV__.exportLog()        // download session log JSON
   window.__GIHA_DEV__.toggleDevMode()    // show/hide debug overlay
   ```

4. **Check the debug overlay:** Press **Ctrl+Shift+D** — overlay shows all state. `toggleDevMode()` does the same.

5. **Export session log:** Run `exportLog()` — a JSON file downloads with all recorded events (mode switches, deploys, case starts/ends, game status changes).

**Features tested:** Dev mode (?dev query param), all 14 window.__GIHA_DEV__ commands (setSigma, setR0, setBudget, setTick, unlockAll, skipCooldowns, state, addIncome, forceWin, forceLoss, toggleSpeed, completeCase, exportLog, toggleDevMode), debug overlay (Ctrl+Shift+D), session event logger + JSON export.

---

### Phase B5 — Accessibility Tests

**What to do (on any fresh playthrough):**

1. **Skip-to-content link:** Tab immediately after page loads. A gold link "*Skip to main content*" appears. Press Enter — focus jumps to `#main-content`.

2. **Modal focus trapping:** Open Settings (⚙). Tab repeatedly — focus stays within the modal (Tab cycles forward, Shift+Tab cycles backward). Press Escape — modal closes. All modals have `role="dialog"` and `aria-modal="true"`.

3. **Toast accessibility:** Warning and hint toasts have `role="status"` and `aria-live="polite"` — screen readers announce them.

4. **Button aria-labels:** HUD buttons have `aria-label="Help"`, `"Main Menu"`, `"Settings"`. Modal close buttons have `aria-label="Close"`.

5. **Evidence card keyboard navigation:** In Detective Mode, Tab to evidence cards. Each has `tabIndex={0}` and `role="button"`. Enter/Space activates. Shift+F10 opens context menu.

6. **Tool number shortcuts:** Press 1-6 to select detective tools by index. Press same number to deselect.

7. **FPS counter:** Open Settings → check "Show FPS Counter" → green FPS text appears on the city canvas.

**Features tested:** Skip-to-content link, modal focus trapping (Tab/Shift+Tab), dialog ARIA properties, aria-live regions, button aria-labels, evidence card keyboard navigation, tool number shortcuts (1-6), FPS counter toggle.

---

### Phase B6 — 404 & Edge Cases

1. Navigate to `/nonexistent-route` — should show *"The page you're looking for doesn't exist in this sector of Veritas."*

2. Navigate directly to `/victory` — Victory Screen renders with empty stats (0 cases solved).

3. Navigate directly to `/gameover` — Game Over screen renders with empty post-mortem.

4. Navigate directly to `/detective/case-01` without having played — the case loads with its cutscene (detective mode is designed to work standalone).

5. Navigate rapidly between strategy and detective modes by clicking Start → Begin Investigation → Return to City → Start again. Each transition shows the animation and plays the music crossfade.

**Features tested:** 404 page, direct route access, rapid mode switching, standalone detective mode.

---

## Feature Master Checklist

### Strategy Mode (25 items)
- [ ] City canvas renders 50×50 tile grid with 4 district colors
- [ ] Procedural building generation (seeded, varying sizes + colors)
- [ ] Grass + stone tile textures loaded from spritesheets
- [ ] 80 agent dots with S/E/I/R compartment coloring
- [ ] Agent random-walk movement with district affinity
- [ ] Agent repulsion (S agents flee I agents within 30px)
- [ ] Heatmap overlay (green→red by σ severity)
- [ ] District pulse animation (orange when R₀ > 1.0)
- [ ] Intervention deploy ring animation (colored stroke, 400ms pulse)
- [ ] HUD displays: σ, R₀, Budget, Phase, Cases, income rate
- [ ] Phase transitions calm→outbreak→crisis→trap (colors + animations)
- [ ] Warning toast (5 narrative messages, slide animation)
- [ ] Hint toast (5 gameplay hints, slide animation)
- [ ] Audio dim to 30% during warnings
- [ ] 6 interventions with deploy confirmation modal
- [ ] Cooldown tracking per intervention
- [ ] Intervention Timeline log (history of deploys)
- [ ] Budget system (+ income/tick, spend, low-budget indicator)
- [ ] Time controls: Space (play/pause), S (step), 1-4 (speed)
- [ ] Canvas tile click → district targeting
- [ ] Case unlock gating (σ≥40 for case 2, tick≥120+R₀<1.0 for case 3)
- [ ] Case Selector in right sidebar
- [ ] Strategy Tutorial (4 steps, replayable in Settings)
- [ ] Settings panel (music/SFX sliders, mute, FPS toggle)
- [ ] Auto-save every 5 ticks

### Detective Mode (22 items)
- [ ] 3 cases with distinct evidence sets (6/6/8 items each)
- [ ] Cutscene (typewriter text, blinking cursor, Enter/Space advance)
- [ ] Skip button appears after 2 seconds
- [ ] Evidence board with draggable cards
- [ ] Evidence card flip animation (type-colored badges)
- [ ] Evidence connection (gold SVG line, drag from connect handle)
- [ ] Evidence card keyboard navigation (tabIndex, role, Enter/Space/Shift+F10)
- [ ] Spectrogram tool (32 frequency bands, 2-4kHz AI artifact zone)
- [ ] Frame Stepper (previous/next frame, play/pause)
- [ ] Metadata Inspector (metadata table display)
- [ ] Source Tracer (timeline events with suspicious flags)
- [ ] Inconsistency Highlighter (image annotations, colored boxes)
- [ ] Timeline Cross-Referencer (summary with event count)
- [ ] Tool tutorial overlays (first-use per tool)
- [ ] Tool tutorial help (replay from ? button in toolbelt)
- [ ] Tool result modal (analyzing state, progress bar, finding text)
- [ ] Verdict panel (REAL/MANIPULATED/UNCERTAIN buttons)
- [ ] Justification textarea (20 char minimum, character counter)
- [ ] 5-component scoring (accuracy, tool efficiency, connections, justification, time)
- [ ] Grade S/A/B/C/F with colors + animated score counter
- [ ] Debrief screen (score breakdown bars, conclusion text, MIL lesson)
- [ ] Mira outcome branching (3 conclusion texts)

### Cross-Mode (10 items)
- [ ] Transition Screen (4 directions: to-detective, to-strategy, to-victory, to-gameover)
- [ ] Music crossfade on mode switch (1-second linear)
- [ ] Budget transfer from detective to strategy
- [ ] Permanent buffs from case grades (3 types)
- [ ] Victory screen (composite grade, stats, badges, MIL lessons, share scorecard)
- [ ] Game over screen (procedural post-mortem, Try Again preserves detective)
- [ ] Play Again (full reset to Title Screen)
- [ ] Save/load (localStorage with version validation)
- [ ] Records modal (composite grade, badges, best grades)
- [ ] Achievement badges (Fact Checker, Deepfake Hunter, Voice of Truth, Master Analyst)

### UI/Accessibility (9 items)
- [ ] Skip-to-content link (visible on focus from Tab)
- [ ] Modal focus trapping (Tab/Shift+Tab cycle)
- [ ] dialog role + aria-modal on modals
- [ ] aria-live="polite" + role="status" on toasts
- [ ] Button aria-labels (Help, Main Menu, Settings, Close)
- [ ] Evidence card keyboard navigation
- [ ] 404 page with in-lore error message
- [ ] Debug overlay (Ctrl+Shift+D)
- [ ] Dev console (window.__GIHA_DEV__ with 14 commands)

### Monologue Moments (4 items)
- [ ] *"There it is. The tell."* — Case 1, Metadata Inspector on evidence-01
- [ ] *"Oh no. She's not a villain. She's a victim."* — Case 3, any tool on evidence-05
- [ ] *"The truth is never simple. But it's always worth finding."* — Debrief screen mount
- [ ] *"One down. Two to go. They're getting smarter."* — First case completion

---

## Appendix A: Exact Case Answers (Verified from Game Data)

### How to Use Tools & Save Findings
1. Press a number key **(1-6)** to select a tool
2. Click the **specific evidence card** listed in the tables below
3. Wait for the modal, then close it (× or Escape)
4. The finding is **automatically saved** — a green confirmation appears

### How to Connect Evidence
1. Hover over a card — a **gold circle** at bottom-right
2. **Click and hold** the gold circle, **drag** to another card, **release**
3. A gold line appears between them
4. Make ALL required connections listed below for full score

---

### Case 1 — "The Viral Mayor"

**Correct verdict: MANIPULATED**

**Required Tool-Evidence Pairs:**
| Tool | Must click this evidence card |
|------|------------------------------|
| **Spectrogram** (press 1) | **Audio Spectrogram Data** |
| **Frame Stepper** (press 2) | **Mayor's Resignation Video** |
| **Metadata Inspector** (press 3) | **Upload Server Logs** |

**Required Connections (make all 4):**
1. Mayor's Resignation Video ⟷ Audio Spectrogram Data
2. Mayor's Resignation Video ⟷ Video File Metadata
3. Video File Metadata ⟷ Official Reference Photo
4. Video File Metadata ⟷ Upload Server Logs

**Keywords to include:** `lip-sync`, `audio artifact`, `synthetic`, `deepfake`, `shell company`

**Example justification:**
```
Lip-sync mismatch and 2-4kHz audio artifacts confirm deepfake. Vegas Pro at 2:47 AM contradicts alibi. Shell company VeraTech traced via VPN logs.
```

---

### Case 2 — "Grandma's Distress Call"

**Correct verdict: MANIPULATED**

**Required Tool-Evidence Pairs:**
| Tool | Must click this evidence card |
|------|------------------------------|
| **Spectrogram** (press 1) | **Voicemail Recording** |
| **Metadata Inspector** (press 3) | **Call Origin Metadata** |
| **Source Tracer** (press 4) | **Bank Transaction Records** |

**Required Connections (make all 4):**
1. Voicemail Recording ⟷ Voiceprint Comparison
2. Voicemail Recording ⟷ Call Origin Metadata
3. Call Origin Metadata ⟷ Suspicious Text Messages
4. Call Origin Metadata ⟷ Bank Transaction Records

**Keywords:** `voice clone`, `synthetic audio`, `spoofed caller`, `VoIP`, `shell company`

**Example justification:**
```
Voice clone confirmed by 200-400Hz spectral divergence. Call routed via VeraTech VoIP through 3 countries. Shell company funded $5,000 payment.
```

---

### Case 3 — "The Front Page"

**Correct verdict: MANIPULATED**

**Required Tool-Evidence Pairs:**
| Tool | Must click this evidence card |
|------|------------------------------|
| **Source Tracer** (press 4) | **Viral Protest Photo** |
| **Inconsistency Highlighter** (press 5) | **Lighting Analysis Overlay** |
| **Metadata Inspector** (press 3) | **Bot Network Amplification Data** |

**Required Connections (make all 5):**
1. Viral Protest Photo ⟷ Lighting Analysis Overlay
2. Viral Protest Photo ⟷ Photo Metadata
3. Lighting Analysis Overlay ⟷ Source Trace Result
4. Photo Metadata ⟷ Bot Network Amplification Data
5. Source Trace Result ⟷ Bot Network Amplification Data

**Keywords:** `geolocation`, `lighting mismatch`, `misattributed`, `reverse image`, `bot amplification`

**Example justification:**
```
Geolocation mismatch confirmed by 15° lighting discrepancy. Reverse image search shows photo from 2 years ago, not Veritas. Bot amplification 78% from VeraTech IPs.
```

---

### Getting S Grade Checklist
- [ ] Submit **correct verdict** (manipulated for all 3 cases)
- [ ] Use tools on the **exact evidence items** listed above
- [ ] Make **all required connections** listed above
- [ ] Include **3+ keywords** in your justification
- [ ] Write **50+ characters** of justification
- [ ] Complete within reasonable time (180s = bonus, 300s+ = no penalty)

### Quick Reference per Case
| Case | Verdict | Key Tool | Key Evidence |
|------|---------|----------|--------------|
| 1 | MANIPULATED | Metadata Inspector | Upload Server Logs |
| 2 | MANIPULATED | Metadata Inspector | Call Origin Metadata |
| 3 | MANIPULATED | Inconsistency Highlighter | Lighting Analysis Overlay |
