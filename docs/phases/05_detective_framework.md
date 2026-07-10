# Phase 5: Detective Mode — Framework

**Duration:** 4 days
**Member:** M2
**Dependencies:** Phase 2 (game scaffold)
**Output:** Case state machine, evidence board, verdict panel, scoring engine

## Tasks

### 5.1 Case State Machine
- Implement 5-state machine in `src/detective/CaseState.ts`:
  - `intro` → plays cutscene text cards, auto-advances after 5s or click
  - `investigation` → free-form evidence exploration (core gameplay)
  - `evidence` → evidence board for connecting clues
  - `verdict` → player selects classification + writes justification
  - `debrief` → narrative conclusion with MIL lesson
- State transition actions: `advanceTo(state)`, `autoAdvance()`
- **Test:** Walk through all 5 states programmatically

### 5.2 Cutscene System
- `CutscenePlayer.tsx`: displays series of text cards with optional background image
- Auto-advance (configurable per card, default 5s) or click-to-advance
- Text appears character-by-character (typewriter effect, 30ms per char)
- Skip button (visible after 2s) → jumps to investigation
- **Test:** All 3 cases' intro cutscenes play correctly

### 5.3 Evidence Board
- `EvidenceBoard.tsx`: large grid area where evidence cards are placed
- Evidence cards are draggable (react-dnd or native HTML5 drag)
- Cards can be connected with lines (drag from one card to another)
- Connections snap to nearest card center
- Right-click on card → "Inspect with..." → tool selection menu
- **Test:** Cards can be dragged, connected, and inspected

### 5.4 Evidence Card Component
- `EvidenceCard.tsx`:
  - Thumbnail/preview (video: first frame, audio: waveform, image: thumbnail, text: excerpt)
  - Type badge (video/audio/image/text/metadata)
  - "New" badge if not yet examined
  - "Revealed" badge if additional info unlocked with tool
  - "Red Herring" badge (only visible after verdict)
- Flip animation on click (front: preview, back: metadata/details)
- **Test:** All evidence types render correctly, flip animation works

### 5.5 Toolbelt Framework
- `Toolbelt.tsx`: horizontal bar at bottom, 6 tool icons
- Tool selected on click → highlight → cursor changes to crosshair
- Click on eligible evidence → tool applies → result modal appears
- Ineligible evidence → cursor shows "no entry" briefly
- Used tools show checkmark badge (encourages variety)
- **Test:** Select tool → click eligible evidence → result modal appears

### 5.6 Verdict Panel
- `VerdictPanel.tsx`: 3 buttons — Real / Manipulated / Uncertain
- Justification text area (min 20 characters to enable submit)
- "Submit" button (enabled only when classification selected + justification filled)
- Submit triggers scoring computation
- **Test:** Submit only works when all conditions met

### 5.7 Scoring Engine
- `ScoringEngine.ts`:
  - `calculateScore(caseData, playerActions, timeMs): Score`
  - `Score`: `{ total: number, components: { accuracy, toolEfficiency, connections, justification, timeBonus }, maxScore: number, grade: 'S' | 'A' | 'B' | 'C' | 'F' }`
- Accuracy component: verdict match (50 pts), correct tools used on correct evidence (20 pts)
- Tool efficiency: used minimum necessary tools (20 pts), subtract 5 per extra tool
- Connections: each correct connection on evidence board (10 pts, max 30)
- Justification: keyword overlap with solution keywords (15 pts), subtract 5 if < 50 chars
- Time bonus: under 3 min +10, 3–5 min 0, over 5 min −10
- **Test:** Perfect solution returns 100 pts, wrong verdict returns ≤ 50 pts

### 5.8 Debrief Screen
- `DebriefScreen.tsx`:
  - Narrative conclusion paragraph (case-specific)
  - MIL lesson box: "What you just learned applies to real life: [lesson]"
  - Score display: grade (S/A/B/C/F) + numerical score + component breakdown
  - "Return to Strategy" button → triggers mode transition
- **Test:** Debrief displays correct score and narrative for each case

### 5.9 Case Loader
- `CaseLoader.ts`: async function that loads case data from `public/cases/{caseId}/`
- Validates loaded JSON against Case schema
- Returns typed Case object
- Error handling: if case data missing → redirect to strategy mode with error toast
- **Test:** Load all 3 cases, verify schema validation passes

## Acceptance Criteria
- [ ] Case state machine all 5 states with transitions
- [ ] Cutscene player with typewriter effect + skip
- [ ] Evidence board with draggable cards and connectable lines
- [ ] All 6 evidence types render correctly
- [ ] Toolbelt selection → apply → result flow works
- [ ] Verdict panel enforces classification + justification
- [ ] Scoring engine produces correct scores for known inputs
- [ ] Debrief screen with grade, score breakdown, MIL lesson
- [ ] Case loader validates all 3 cases correctly
