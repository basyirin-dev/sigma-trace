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
- **M2:** Design GIHA logo (simple SVG) + agency stationery style

### 0.5.2 Case Design (All 3)
- Case 1 "The Viral Mayor": full narrative, evidence list, solution, MIL lesson
- Case 2 "Grandma's Distress Call": full narrative, evidence list, solution, MIL lesson
- Case 3 "The Front Page": full narrative, evidence list, solution, MIL lesson
- **M1:** Write case scripts (dialogue, findings, debrief text)
- **M2:** Sketch evidence board layout for each case

### 0.5.3 ODE Parameter Tuning (Paper Design)
- Define base R₀ for each scenario phase (calm: 0.6, outbreak: 1.2, crisis: 2.0)
- Define intervention effect sizes that produce visible but non-trivial impact
- Define σ-trap threshold (σ < 20) and recovery rate parameters
- Write parameter table for reference during Phase 1 implementation
- **M1:** Derive parameters from Σ-Model paper, produce specification document
- **M2:** Review for gameplay feel (are the numbers fun?)

### 0.5.4 Visual Style Guide
- Color palette: healthy (green #2ECC71, blue #3498DB), warning (orange #E67E22), danger (red #E74C3C), σ-trap (gray #2C3E50, dark #1A1A2E)
- Typography: Inter (headings/body), JetBrains Mono (code/data)
- UI component mockups: intervention card, evidence card, tool button, HUD
- **M1:** Create palette + typography spec
- **M2:** Create component mockups in Figma or HTML/CSS

### 0.5.5 Scope Lock Sign-Off
- Review all features in game design document
- Check against scope boundaries list
- Both members sign: no new features will be added after this date
- **M1+M2:** Read through and commit

### 0.5.6 Asset Sourcing
- Identify CC0 sources for: city building icons, evidence card styling, UI sounds
- Download test placeholder assets
- Organize in `public/assets/` by type
- **M2:** Source and organize, **M1:** Verify license compliance

## Acceptance Criteria
- [ ] All 3 cases fully written with evidence lists and solutions
- [ ] ODE parameter table finalized on paper
- [ ] Style guide approved by both members
- [ ] Scope lock document signed (verbal + git commit message)
- [ ] All placeholder assets organized in `public/assets/`
