# String Catalog — GIHA

Inventory of all user-facing strings for localization readiness.
Total: ~200+ strings across ~30 files.

## UI Labels

| String | Location | Type |
|--------|----------|------|
| "Media Literacy" | `src/shared/HUD.tsx:73` | Stat label |
| "Spread Rate" | `src/shared/HUD.tsx:80` | Stat label |
| "Budget" | `src/shared/HUD.tsx:88` | Stat label |
| "Cases" | `src/shared/HUD.tsx:110` | Stat label |
| "INTEL" | `src/shared/HUD.tsx:115` | Buffs label |
| "ACTIVE" | `src/shared/HUD.tsx:125` | Active effects label |
| "Calm" / "Outbreak" / "Crisis" / "SIGMA TRAP" | `src/shared/HUD.tsx:29-32` | Phase labels |
| Phase descriptors (4) | `src/shared/HUD.tsx:43-46` | Phase descriptions |
| "CITY PAUSED" | `src/shared/HUD.tsx:92` | Paused overlay |
| "Main Menu" | `src/shared/HUD.tsx:162` | Home button aria |
| "Settings" | `src/shared/HUD.tsx:171` | Settings button aria |
| "Help" | `src/shared/HUD.tsx:153` | Help button aria |
| "?" | `src/shared/HUD.tsx:155` | Help button text |
| "New Game" | `src/screens/TitleScreen.tsx` | Button |
| "Continue" | `src/screens/TitleScreen.tsx` | Button |
| "How to Play" | `src/screens/TitleScreen.tsx` | Button |
| "About" | `src/screens/TitleScreen.tsx` | Button |
| "Credits" | `src/screens/TitleScreen.tsx` | Button |
| "Records" | `src/screens/TitleScreen.tsx` | Button |
| "Start New Game?" | `src/screens/TitleScreen.tsx` | Modal title |
| "Save Data Error" | `src/screens/TitleScreen.tsx` | Modal title |
| "Cancel" | `src/screens/TitleScreen.tsx` | Button |
| "Start Fresh" | `src/screens/TitleScreen.tsx` | Button |
| "Delete & Start Fresh" | `src/screens/TitleScreen.tsx` | Button |
| "Mission Complete" | `src/screens/VictoryScreen.tsx:102` | Header |
| "Composite Grade" | `src/screens/VictoryScreen.tsx:148` | Label |
| "MIL Lessons Applied" | `src/screens/VictoryScreen.tsx:199` | Section header |
| "Achievements" | `src/screens/VictoryScreen.tsx:186` | Section header |
| "Share Scorecard" | `src/screens/VictoryScreen.tsx:213` | Button |
| "Continue Playing" | `src/screens/VictoryScreen.tsx:220` | Button |
| "Play Again" | `src/screens/VictoryScreen.tsx:227` | Button |
| "Game Over" | `src/screens/GameOverScreen.tsx:86` | Header |
| "MISSION COMPLETE" | `src/screens/TransitionScreen.tsx:45` | Badge |
| "CIVILIZATION COLLAPSE" | `src/screens/TransitionScreen.tsx:46` | Badge |
| "CASE RESOLVED" | `src/screens/TransitionScreen.tsx:47` | Badge |
| "CASE UNLOCKED" | `src/screens/TransitionScreen.tsx:44` | Badge |
| "Begin Investigation" | `src/screens/TransitionScreen.tsx:51` | Action button |
| "View Results" | `src/screens/TransitionScreen.tsx:52` | Action button |
| "View Analysis" | `src/screens/TransitionScreen.tsx:53` | Action button |
| "Return to City" | `src/screens/TransitionScreen.tsx:54` | Action button |
| "REAL" / "MANIPULATED" / "UNCERTAIN" | `src/detective/VerdictPanel.tsx:14-18` | Verdict options |
| "Select a verdict and explain your reasoning" | `src/detective/VerdictPanel.tsx` | Hint text |
| "Write at least 20 characters" | `src/detective/VerdictPanel.tsx` | Validation hint |
| "Collapse in N" | `src/shared/HUD.tsx:99` | Danger countdown |

## Tutorials

| String | Location | Type |
|--------|----------|------|
| 4 Strategy tutorial steps | `src/strategy/StrategyTutorial.tsx:11-32` | Tutorial overlay |
| 6 Tool tutorial tips | `src/detective/toolTutorials.ts:7-53` | Tutorial overlays |
| 7 Loading screen tips | `src/screens/LoadingScreen.tsx:7-15` | Rotating tips |
| "How to Play" modal text | `src/screens/TitleScreen.tsx:276-293` | Instructions |
| GIHA Field Manual content | `src/shared/HUD.tsx:176-208` | Reference modal |

## Game Data — Interventions

| String | Location | Type |
|--------|----------|------|
| 6 intervention names | `src/engine/interventions.ts:19-73` | Name |
| 6 intervention descriptions | `src/engine/interventions.ts:19-73` | Description |

## Game Data — Cases

| String | Location | Type |
|--------|----------|------|
| Case 1 title/brief/MIL lesson | `public/cases/case-01/metadata.json` | Metadata |
| Case 2 title/brief/MIL lesson | `public/cases/case-02/metadata.json` | Metadata |
| Case 3 title/brief/MIL lesson | `public/cases/case-03/metadata.json` | Metadata |
| 6 evidence items per case | `public/cases/*/evidence-items.json` | Names + descriptions |
| 6-7 evidence findings per case | `public/cases/*/script.json` | Narrative paragraphs |
| 3 conclusion texts (×3 for Mira) | `public/cases/*/script.json` | Narrative paragraphs |
| 6 tool hints per case | `public/cases/*/script.json` | Hint text |
| Cutscene frames (4-6 per case) | `public/cases/*/script.json` | Narrative text |

## Narrative Builders (in code)

| String | Location | Type |
|--------|----------|------|
| Case metadata dicts (3 cases) | `src/detective/narrativeBuilders.ts` | In-game metadata |
| Source trace events (3 cases) | `src/detective/narrativeBuilders.ts` | Timeline events |
| Source trace summaries (3 cases) | `src/detective/narrativeBuilders.ts` | Analysis text |
| Timeline events (3 cases) | `src/detective/narrativeBuilders.ts` | Timeline labels |
| Timeline cross-ref summaries (3) | `src/detective/narrativeBuilders.ts` | Analysis text |
| Inconsistency feedback (2 items) | `src/detective/narrativeBuilders.ts` | Forensic analysis |

## Systemic Narrative

| String | Location | Type |
|--------|----------|------|
| 5 warning messages | `src/strategy/useWarningDetection.ts:7-13` | Threshold-triggered |
| 5 game hints | `src/strategy/useHintDetection.ts` | State-triggered |
| 4 monologue moments | `docs/story-bible/01-protagonist.md:49-58` | Story-beat-triggered |

## MIL Lessons (Victory Screen)

| String | Location | Type |
|--------|----------|------|
| "Always verify evidence through multiple independent analyses" | `src/screens/VictoryScreen.tsx:201` | Lesson |
| "Metadata and timestamps reveal manipulation history" | `src/screens/VictoryScreen.tsx:202` | Lesson |
| "Cross-referencing sources detects coordinated disinformation" | `src/screens/VictoryScreen.tsx:203` | Lesson |

## Achievement Badges

| String | Location | Type |
|--------|----------|------|
| Fact Checker | `src/shared/badgeUtils.ts` | Badge name |
| Deepfake Hunter | `src/shared/badgeUtils.ts` | Badge name |
| Voice of Truth | `src/shared/badgeUtils.ts` | Badge name |
| Master Analyst | `src/shared/badgeUtils.ts` | Badge name |

## Notes for Localization

- **i18n framework**: None. All strings are hardcoded in source or JSON.
- **String count**: ~200+ user-facing strings across ~30 files.
- **Priority targets for extraction**: `public/cases/*/` (bulk narrative), `src/detective/narrativeBuilders.ts` (procedural narrative), `src/shared/HUD.tsx` (UI labels), tutorial files.
- **No pluralization or gender-sensitive strings** present (all English, no inflection).
- **Date/time formatting**: Minimal (time-ago in TitleScreen only).
- **Character encoding**: All strings use standard Unicode; smart quotes present in narrative text.
