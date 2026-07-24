# GIHA: Build Roadmap

> **Retrospective status (as of August 16, 2026):** All phases 0–10 completed on schedule despite a 3-day late start. Risk R09 (compressed schedule) was triggered but fully absorbed by overlapping P0/P0.5 and starting P1/P2 immediately on July 11. The August 13–16 buffer remained unused. Current build is Phase 10-ready for Gold Master and submission.

## 3.1 Phase Overview

| Phase | Name | Duration | Member | Dependencies | Type |
|:-----:|:-----|:--------:|:------:|:------------:|:----:|
| 0 | Repo & Toolchain Setup | 2 days | M1+M2 | None | Setup |
| 0.5 | Design Lock | 2 days | M1+M2 | Phase 0 | Design |
| 1 | σ-Model ODE Engine | 5 days | M1 | Phase 0.5 | Core |
| 2 | Game Scaffold | 5 days | M2 | Phase 0.5 | Core |
| 3 | Strategy: City Simulation | 4 days | M1 | Phase 1 | Core |
| 4 | Strategy: Interventions | 4 days | M1 | Phase 3 | Core |
| 5 | Detective: Framework | 4 days | M2 | Phase 2 | Core |
| 6 | Detective: Cases | 5 days | M1+M2 | Phase 5 | Core |
| 7 | Forensics Toolkit | 3 days | M1+M2 | Phase 1, 5 | Core |
| 8 | Mode Integration | 3 days | M1+M2 | Phases 4, 6, 7 | Integration |
| 9 | Polish, Animation & Sound | 4 days | M1+M2 | Phase 8 | Delivery |
| 10 | Playtesting & QA | 3 days | M1+M2 | Phase 9 | Delivery |
| 11 | Proposal & Pitch | 4 days | M1+M2 | Phase 10 | Delivery |
| 12 | Submission Package | 2 days | M1+M2 | Phase 11 | Delivery |

**Total calendar days:** 38 (Jul 9 – Aug 16)
**Total person-days:** 76 (38 × 2)

> **Note:** Phase 0 and 0.5 run Jul 9–10 (compressed overlap, both members). P1/P2 start Jul 11.
> Weekend work (Jul 11–12) is optional but recommended to maximize buffer before the Aug 16 deadline.

## 3.2 Parallel Track Structure

```
WEEK 1 (Jul 9–15)          WEEK 2 (Jul 16–22)         WEEK 3 (Jul 23–29)
┌──────────┐               ┌──────────┐               ┌──────────┐
│ P0 (2d)  │               │ Phase 5  │               │ Phase 8  │
│ P0.5(2d) │               │ (4d) M2  │               │ (3d)     │
│ M1+M2    │               └──────────┘               │ M1+M2    │
│ overlap  │               ┌──────────┐               └──────────┘
└──────────┘               │ Phase 3  │               ┌──────────┐
  ┌──────────┐             │ (4d) M1  │               │ Phase 9  │
  │ P1+P2    │             └──────────┘               │ (4d)     │
  │ start    │             ┌──────────┐               │ M1+M2    │
  │ Jul 11   │             │ Phase 4  │               └──────────┘
  └──────────┘             │ (4d) M1  │               ┌──────────┐
┌──────────┐               └──────────┘               │ Phase 6  │
│ Phase 1  │               ┌──────────┐               │ (final)  │
│ (5d) M1  │               │ Phase 6  │               │ M1+M2    │
└──────────┘               │ (start)  │               └──────────┘
┌──────────┐               │ M1+M2    │               ┌──────────┐
│ Phase 2  │               └──────────┘               │ Phase 7  │
│ (5d) M2  │               ┌──────────┐               │ (3d)     │
└──────────┘               │ Phase 7  │               │ M1+M2    │
                            │ (start)  │               └──────────┘
                            │ M1+M2    │
                            └──────────┘

WEEK 4 (Jul 30–Aug 5)     WEEK 5 (Aug 6–12)         WEEK 6 (Aug 13–16)
┌──────────┐               ┌──────────┐               ┌──────────┐
│ Phase 10 │               │ Phase 12 │               │ BUFFER   │
│ (3d)     │               │ (2d)     │               │ +        │
│ M1+M2    │               │ M1+M2    │               │ DEADLINE │
└──────────┘               └──────────┘               └──────────┘
┌──────────┐               ┌──────────┐
│ Phase 11 │               │ DEADLINE │
│ (4d)     │               │ Aug 16   │
│ M1+M2    │               └──────────┘
└──────────┘
```

## 3.3 Critical Path

The critical path determining earliest completion is:
Phase 0 → 0.5 → 1 (M1) & 2 (M2) → 3 (M1) & 5 (M2) → 4 (M1) & 6 (M1+M2) & 7 (M1+M2) → 8 (M1+M2) → 9 (M1+M2) → 10 (M1+M2) → 11 (M1+M2) → 12 (M1+M2)

**Bottleneck:** Phase 1 and Phase 2 must both complete before Phases 3 and 5 can start. If either slips by more than 2 days, the entire critical path shifts.

**Mitigation:** Each phase has a hard scope buffer. If Phase 1 is delayed, M2 picks up a Phase 1 subtask (WASM compilation can be deferred to week 3).

**Start-date adjustment:** Actual start is Jul 9 (3 days later than planned). Recovery: P0+P0.5 run back-to-back Jul 9–10 with both members. P1/P2 start Jul 11. The original 7 buffer days shrink to 4 (Aug 13–16). Any phase slip beyond 2 days triggers scope reduction.

## 3.4 Risk Register

> **See also:** `docs/phases/CC4_risk_register.md` for the technical/quality risk register (11 risks, Likelihood×Impact scoring, escalation triggers). This roadmap risk register covers schedule/budget risks only.

| ID | Risk | Probability | Impact | Mitigation | Trigger |
|:---|:-----|:----------:|:------:|:-----------|:--------|
| R01 | ODE engine produces non-fun gameplay | Medium | High | Playtest early (Phase 3 day 1), tune parameters | Phase 4 starts with unbalanced R₀ curves |
| R02 | Canvas2D performance with 200+ agents | Medium | Medium | Simplify agent AI, reduce to 80 agents, use spatial bucketing | Phase 3 benchmarks below 30fps |
| R03 | Case 3 photo manipulation too complex for 5-day build | High | Medium | Simplify to single-inconsistency case, reduce tool requirement | Phase 6 day 3 behind schedule |
| R04 | Pitch video production takes longer than expected | Medium | High | Use OBS + iMovie, not Premiere | Phase 11 day 2 no footage recorded |
| R05 | M1 sickness or unavailability | Low | Critical | Cross-train M2 on basic ODE parameter tuning by Phase 3 | M1 misses 2+ consecutive days |
| R06 | Case audio assets sound unconvincing | Low | Medium | Use royalty-free voice banks, not AI-generated voices | Phase 6 review finds poor audio quality |
| R07 | Netlify deploy fails due to missing static export config | Low | Low | Test deploy on day 1 (Phase 0) | Phase 12 deploy fails |
| R08 | UNESCO submission form has unexpected format restrictions | Medium | Medium | Prepare proposal in both PDF and DOCX | Phase 12 day 1 |
| R09 | 3-day late start (Jul 9 vs Jul 6) compresses buffer to 0 days | High | Medium | Overlap P0/P0.5, start P1/P2 from Jul 11. Monitor weekly. If any phase slips, cut scope (simplify 1 case, drop 2 tools). | End of Week 2 (Jul 22) |

## 3.5 Milestone Gate Checklist

| Gate | Phase | Criteria | Sign-off |
|:-----|:-----:|:---------|:---------|
| Design Lock | 0.5 | All 3 cases storyboarded, style guide approved, ODE parameters tuned on paper | Both members |
| Core Engine | 1 | ODE produces valid S/E/I/R curves in browser console | M1 |
| Playable Build | 8 | Full game loop playable: strategy → case → detective → verdict → back to strategy | Both members |
| Feature Freeze | 9 | No new features, only polish and bug fixes | Both members |
| Gold Master | 10 | All bugs fixed, all text proofed, balanced gameplay | Both members |
| Submission | 12 | Proposal + pitch video + deployed prototype uploaded to UNESCO | Both members |

## 3.6 Daily Standup Template

```
## Team σ-Trace Standup
**Date:** YYYY-MM-DD

### M1 (AI/Research)
- Yesterday:
- Today:
- Blockers:

### M2 (Security/Dev)
- Yesterday:
- Today:
- Blockers:

### Phase status:
- Current phase: [name] day [n]/[total]
- Next phase start: [date]
- Risk watch: [any red risks triggered]

### Today's goal:
```
