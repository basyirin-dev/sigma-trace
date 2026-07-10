# Cross-Cutting 4: Risk Register

**Owner:** M1
**Applies to:** Entire project, updated weekly

## Risk Scoring
- **Likelihood:** 1 (rare) – 5 (almost certain)
- **Impact:** 1 (negligible) – 5 (project failure)
- **Score:** Likelihood × Impact (1–25)
- **Response:** Avoid / Mitigate / Transfer / Accept

## Active Risks

| # | Risk | L | I | S | Response | Owner | Status |
|---|---|---|---|---|---|---|---|
| R01 | Team member drops out (illness, life event) | 2 | 5 | 10 | Cross-train: M1 can do basic Three.js, M2 can do basic React. Document all architecture decisions for handover. | M1 | Monitor |
| R02 | Deepfake tool breaks mid-project (API deprecation, paid tier) | 4 | 3 | 12 | **Mitigate:** Generate all deepfake assets in Week 1 (Phase 0.5). Save outputs locally. Never rely on live API during production. | M2 | Watch |
| R03 | Three.js performance issues on low-end hardware | 3 | 4 | 12 | **Mitigate:** Set performance budget (30fps target). Implement quality slider (low/med/high). Fallback to 2D Canvas rendering if WebGL unavailable. | M1 | Active |
| R04 | Browser compatibility (Safari WebGL quirks) | 3 | 3 | 9 | **Mitigate:** Test on Safari weekly. Use Three.js with WebGL 1.0 fallback. No WebGL2-only features. | M1 | Monitor |
| R05 | Evidence assets (video/audio) exceed file size limits | 4 | 2 | 8 | **Mitigate:** Compress to 720p, 30fps, 1Mbps video; 128kbps audio. Max 3 minutes per evidence item. | M2 | Active |
| R06 | ODE solver has numerical instability (NaN, oscillations) | 2 | 5 | 10 | **Mitigate:** Clamp all state variables to [0,1]. Add NaN guard in simulateStep(). Unit test edge cases (R₀=0, extreme parameter values). | M1 | Monitor |
| R07 | React re-render performance with frequent store updates | 3 | 3 | 9 | **Mitigate:** Use Zustand selectors (shallow equality). Batch ODE updates to 10 ticks per render frame. Profile with React DevTools weekly. | M1 | Active |
| R08 | Case puzzles are too hard / too easy after playtesting | 4 | 3 | 12 | **Mitigate:** Build adjustable difficulty parameter in case metadata. Run 2 rounds of playtesting with buffer time for rebalancing. | M1+M2 | Watch |
| R09 | Pitch video exceeds 180s limit | 3 | 4 | 12 | **Mitigate:** Time script at 170s (10s buffer). Record multiple takes with varying pace. Final edit enforces hard cut at 180s. | M1 | Plan |
| R10 | UNESCO submission portal issues (late opening, upload limits) | 2 | 3 | 6 | **Accept:** Submit 1 week before deadline. Keep backup submission channel (email if portal fails). | M1 | Monitor |
| R11 | 3-day late start (Jul 9) compresses buffer | 4 | 3 | 12 | **Mitigate:** P0+P0.5 compressed to 2 days, P1/P2 start Jul 11. If any phase slips > 1 day, trigger scope reduction (drop 2 tools or 1 case). | M1 | Active |

## Mitigation Progress

| Risk | Mitigation Step | Deadline | Status |
|---|---|---|---|
| R02 | Generate all deepfake assets | Phase 0.5 (Jul 10) | Pending |
| R03 | Implement quality slider | Phase 9 | Pending |
| R05 | Compress all video assets | Phase 6 | Pending |
| R06 | NaN guard + unit tests | Phase 1 | Pending |
| R07 | Zustand selector audit | Phase 3 | Pending |
| R08 | Playtesting buffer | Phase 10 | Pending |
| R09 | Voiceover recording + timing | Phase 11 | Pending |

## Contingency Budget
- Total buffer: 4 days (Jul 9 start compressed the original 7-day buffer; Aug 13–16 reserved for deadline)
- Allocation:
  - 2 days: for playtesting fixes + submission issues (combined, Phase 10/12)
  - 2 days: for pitch video re-edits (Phase 11)
- If buffer exceeds 2 days used before Phase 9: reduce scope (cut 1 case to 2, drop 2 tools)
- Scope reduction triggers: Phase 3 day 3 behind → cut 2 tools. Phase 6 day 4 behind → cut Case 3 to simplified version. Phase 10 day 1 → cut external playtest round 2.

## Escalation Triggers
- **YELLOW:** Any risk hits impact ≥ 4 and likelihood ≥ 3 → daily check-in until resolved
- **RED:** R01 triggers (team member unavailable > 3 days) OR R06 causes game-breaking simulation bug in production
- On RED: pause all feature work, focus entirely on resolution. If unresolvable after 2 days: scope reduction.
