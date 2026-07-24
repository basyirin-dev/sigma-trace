# Scope Lock Sign-Off — Phase 0.5.5

This document freezes all feature decisions for the GIHA project.
No new features, mechanics, or visual changes shall be added after sign-off.

---

## Section 1: Features In Scope

### Strategy Mode

| Feature | Specification | Source |
|---------|--------------|--------|
| Tile grid | 50 × 50, 20px tiles, 1000×1000 canvas | Phase 3, Style Guide |
| District colors | Rust (#8B4513), Teal (#2C7A7B), Gold (#B8860B), Green (#4A7C59) | Phase 0.5.4 |
| District borders | 1px darker (#1A1A2E) at district boundaries | Phase 0.5.4 |
| Pixel agents | 80 dots, 2px radius, random-walk AI, Y-sorted | Phase 3 |
| Agent colors | Green (S), Yellow (E), Red (I), Blue (R) | Phase 0.5.4 |
| Heatmap overlay | 5-stop green→yellow→red, opacity by σ severity | Phase 3 |
| Population model | S/E/I/R compartments with logistic σ ODE | Phase 1, ODE Params |
| σ gauge | 0–100, semi-circular, smooth Lerp animation | Phase 3 |
| Phase system | 4 states: calm / outbreak / crisis / trap | Phase 1 |
| Phase indicators | CSS keyframes: pulse-alert (crisis), pulse-trap (trap) | Phase 0.5.4 |
| R₀ dynamics | City-level R₀, district multiplier scaling | ODE Params |
| 6 interventions | Fact-Check, School MIL, Algorithm Audit, Community Dialog, Source Verification, Emergency Broadcast | Phase 4 |
| Intervention UI | Card component, palette sidebar, confirm modal | Phase 4 |
| Intervention stacking | R₀: max() strongest wins. σ: additive with logistic ceiling | ODE Params |
| Budget system | Start 500, +5/tick, case bonuses (S: +100 down to F: +0) | ODE Params |
| Time controls | Play/pause, speed 1×/2×/5×/10×, step (manual tick) | Phase 3 |
| Timer display | "Day [n]", 1 tick = 1 day | Phase 3 |
| Warning toasts | R₀ > 1.0, σ < 30, district R₀ > 2.0 | Phase 3 |
| 3-act difficulty ramp | Act 1 (1–40), Act 2 (41–80), Act 3 (81–120) with escalating R₀ | ODE Params |
| Win condition | σ ≥ 80, R₀ < 0.8, all 3 cases solved → maintain 60 ticks | ODE Params |
| Lose condition | σ < 20 for 5 ticks (trap) or district R₀ > 3.0 for 30 ticks | ODE Params |
| Canvas2D rendering | requestAnimationFrame loop, 30fps target | Phase C |
| image-rendering CSS | pixelated on all canvas elements | Phase 0.5.4 |

### Detective Mode

| Feature | Specification | Source |
|---------|--------------|--------|
| Case state machine | 5 states: intro → investigation → evidence board → verdict → debrief | Phase 5 |
| Intro cutscene | Text cards, typewriter effect, auto-advance + click-to-skip | Phase 5 |
| Evidence board | Draggable cards, connection lines, right-click tool menu | Phase 5 |
| 3 cases | "The Viral Mayor", "Grandma's Distress Call", "The Front Page" | Phase 0.5.2 |
| Evidence items | 5 per case (mixed video, audio, image, text, metadata) | Phase 0.5.2 |
| Evidence cards | Thumbnail, type badge, new/revealed/red-herring badges | Phase 5 |
| Red herrings | 1 per case, plausible but irrelevant | Phase 0.5.2 |
| 6 forensics tools | Spectrogram, Frame Stepper, Metadata Inspector, Source Tracer, Inconsistency Highlighter, Timeline Cross-Referencer | Phase 7 |
| Toolbelt | 6 tool icons, selection highlights, used checkmarks | Phase 5 |
| Tool hints | General description when selected, not specific guidance | Phase 0.5.2 |
| Tool result modal | Findings cards, confidence score, add to board | Phase 7 |
| Verdict panel | 3 buttons (Real/Manipulated/Uncertain) + justification textarea | Phase 5 |
| Scoring engine | 5 components: accuracy (50%), tools (20%), connections (15%), justification (15%), time (±5%) | Phase 5 |
| Scoring grades | S / A / B / C / F | Phase 5 |
| Debrief screen | Narrative conclusion, MIL lesson, score breakdown | Phase 5 |
| MIL lesson | One-sentence at case completion, full lesson in debrief | Phase 0.5.2 |
| Pixel UI theme | pixel-card, pixel-btn, pixel-badge, pixel-input, pixel-hud classes | Phase 0.5.4 |

### Cross-Mode Integration

| Feature | Specification | Source |
|---------|--------------|--------|
| Mode transition | Newspaper headline card, 2.5s animation | Phase 2 |
| Strategy pause during detective | Simulation frozen, "City Paused" indicator | Phase 8 |
| Budget transfer | Detective grade → strategy budget bonus | Phase 8 |
| Case unlock gating | Based on strategy performance (R₀, σ thresholds) | Phase 8 |
| Victory screen | Stats, grade, MIL badges, play again / share | Phase 8 |
| Game over screen | Post-mortem analysis, try again | Phase 8 |
| End-to-end loop | Strategy → Detective (Case 1) → Strategy → Detective (Case 2) → Strategy → Detective (Case 3) → Victory | Phase 8 |

### Audio

| Feature | Specification | Source |
|---------|--------------|--------|
| Strategy ambient | Electronic ambient hum, pitch distorts as σ drops | Phase 9 |
| Detective sounds | Focused silence + UI clicks, "aha" chime on correct match | Phase 9 |
| Sound effects | Button hover/click, intervention deploy, victory, game over | Phase 9 |
| Audio source | CC0 samples or Web Audio API synthesis | Phase 9 |

### Visual Polish

| Feature | Specification | Source |
|---------|--------------|--------|
| Pixel particles | 50 floating dots over city grid | Phase 9 |
| Tile glow | Outbreak glow overlay when R₀ spikes | Phase 9 |
| Tile transitions | Smooth color interpolation (500ms Lerp) | Phase 9 |
| District pulse | Slow opacity pulse on district with R₀ > 1.0 (2s cycle) | Phase 9 |
| UI animations | FadeIn, slideUp, scale-up modal, card flip | Phase 9 |

### Platform

| Feature | Specification | Source |
|---------|--------------|--------|
| Build | Vite 8, React 19, TypeScript 6 (strict) | Phase 0 |
| State | Zustand | Phase 0 |
| Test | Vitest + v8 coverage | Phase 0 |
| CI | GitHub Actions (lint → typecheck → test → build) | Phase 0 |
| Hosting | Netlify (static SPA, free tier) | Phase 0 |
| Target browsers | Chrome 120+, Firefox 120+, Safari 17+ | Phase 0 |
| Minimum resolution | 1366×768 desktop | Phase 0 |
| Target playtime | 12–18 minutes | GDD |

---

## Section 2: Features Explicitly Cut

| Feature | Cut Reason |
|---------|-----------|
| Full continuous ODE system (WASM/NumPy) | Discrete-time JS approximation sufficient |
| Real LLM inference | All AI tool effects are pre-simulated |
| Multiplayer | Auth, networking, balancing complexity exceeds scope |
| Save/load system | Single-session game, ~15 min playtime |
| Tutorial overlay | Tooltip-only onboarding (tooltips, hint text) |
| Custom difficulty | Single difficulty tuned to 18–30 youth audience |
| Real reverse image search API | Simulated search against pre-baked database |
| Audio recording for Case 2 | Pre-recorded audio clips provided |
| Mobile/tablet support | Desktop-only target (1366px+ min width) |
| Localization | English only |
| Screen reader support | Cut; keyboard navigation + WCAG AA contrast retained |
| Three.js / R3F / 3D rendering | Replaced by Canvas2D pixel art (Phase 0.5 pivot) |
| Save data loss on refresh | Acceptable for short play session |
| Leaderboards | No server, no persistence |
| Analytics / telemetry | No tracking |

---

## Section 3: Asset Dependency (External Designer)

| Asset | Provider | Deadline | Fallback |
|-------|----------|----------|----------|
| GIHA logo (SVG) | External designer | Jul 20, 2026 | Generated CSS placeholder |
| City tile sprites | External designer | Jul 20, 2026 | Generated colors (already implemented) |
| Agent pixel sprites | External designer | Jul 20, 2026 | 2px colored dots (already implemented) |
| Pixel UI elements | External designer | Jul 20, 2026 | CSS-only pixel UI (already implemented) |

---

## Section 4: Signatures

```
M1 (AI/Research — ODE, Strategy, Σ-Model):
Name: Basyirin Amsyar Basri
Signed: ________________________
Date: 11 July 2026

M2 (Security/Dev — Scaffold, Detective, CI/CD):
Name: ________________________
Signed: ________________________
Date: ________________________
```

---

## Section 5: Scope Change Protocol

If either member identifies a necessary scope change after sign-off:

1. Write a brief proposal describing the change and rationale
2. Both members must respond within 24 hours
3. Unanimous written agreement required for approval
4. Document the change as an addendum to this document
5. Re-assess schedule impact before proceeding

---

## Verification

This scope lock was reviewed against:

- [x] `docs/01-game-design-document.md` (GDD)
- [x] `docs/02-technical-architecture.md` (Architecture)
- [x] `docs/03-build-roadmap.md` (Roadmap)
- [x] `docs/phases/00_5_design_lock.md` (Phase 0.5)
- [x] `docs/phases/visual-style-guide.md` (Style Guide)
- [x] `docs/phases/ode-parameters.md` (ODE Parameters)
- [x] All source code in `src/engine/`, `src/strategy/`, `src/detective/`, `src/shared/`, `src/styles/`
- [x] `public/cases/` case data files
- [x] `docs/story-bible/` narrative assets
