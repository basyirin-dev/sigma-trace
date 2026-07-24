# Phase 0.5: Design Lock

**Duration:** 2 days
**Members:** M1+M2
**Dependencies:** Phase 0
**Output:** Finalized game design, no further scope changes permitted

## Tasks

### 0.5.1 Story Bible
- Write protagonist backstory: "Junior AI Forensics Investigator at GIHA, 3 months on the job"
- Define GIHA as an independent watchdog (non-governmental, non-profit, UN-affiliated)
- Write city of Veritas profile: population 500k, 4 districts, demographics summary
- Define disinformation campaign arc: coordinated attack by anonymous network
- **M1:** Write story arc + character profiles
- **M2:** Design GIHA logo (external designer) + agency stationery style
- **Status:** Complete

### 0.5.2 Case Design (All 3)
- Case 1 "The Viral Mayor": full narrative, evidence list, solution, MIL lesson
- Case 2 "Grandma's Distress Call": full narrative, evidence list, solution, MIL lesson
- Case 3 "The Front Page": full narrative, evidence list, solution, MIL lesson
- **M1:** Write case scripts (dialogue, findings, debrief text)
- **M2:** Sketch evidence board layout for each case
- **Status:** Complete

### 0.5.3 ODE Parameter Tuning (Paper Design)
- Define base R₀ for each scenario phase (calm: 0.6, outbreak: 1.2, crisis: 2.0)
- Define intervention effect sizes that produce visible but non-trivial impact
- Define σ-trap threshold (σ < 20) and recovery rate parameters
- Write parameter table for reference during Phase 1 implementation
- **M1:** Derive parameters from Σ-Model paper, produce specification document
- **M2:** Review for gameplay feel (are the numbers fun?)

### 0.5.4 Visual Style Guide (Pixel Art)
- Color palette: tile district colors (rust #8B4513, teal #2C7A7B, gold #B8860B, green #4A7C59), heatmap (green → yellow → red), UI (navy #1A1A2E, teal #4ECDC4)
- Typography: Inter (UI), JetBrains Mono (data), pixel-style CSS borders and buttons
- Art direction: 20px tiles, 50×50 grid, pixel agents (2-4px dots), pixel-themed detective UI
- **M1:** Create palette + typography spec for pixel theme
- **M2:** Create component mockups in HTML/CSS with pixel classes

### 0.5.5 Scope Lock Sign-Off
- Review all features in game design document
- Check against scope boundaries list
- Both members sign: no new features will be added after this date
- **M1+M2:** Read through and commit
- **Status:** Complete (M1 signed Jul 11; pending M2 signature)

### 0.5.6 Asset Sourcing (External Designer)
- External designer provides: GIHA logo (SVG), city tile sprites, agent sprites, pixel UI elements
- Team provides style guide and spec to designer
- Organize delivered assets in `public/assets/` by type
- **M2:** Coordinate with designer, organize files
- **M1:** Verify assets match spec

## Acceptance Criteria
- [x] All 3 cases fully written with evidence lists and solutions
- [x] ODE parameter table finalized in `docs/phases/ode-parameters.md`
- [x] Style guide created in `docs/phases/visual-style-guide.md` + mocks in `visual-style-guide.html` (M1 approved; pending M2 review)
- [x] Scope lock document signed (M1 signed Jul 11; pending M2 signature)
- [x] Pixel assets collected from itch.io and organized in `public/assets/` (custom assets from friend pending Jul 20)
