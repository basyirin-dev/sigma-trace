# GIHA: The Game — UNESCO Submission Proposal

**Format:** PDF, ≤10MB
**Language:** English
**Submission:** UNESCO Youth Hackathon 2026 — "Youth Designing the Future of MIL"

---

## Section 1: Team Members

- **M1 — Game Developer & Proposal Writer:** Basyirin Amsyar bin Basri
- **M2 — Video Editor:** Muhamad Na'im Naqiuddin Bin Mohd Saiful Hazmi

---

## Section 2: Problem Statement

### 2.1 The Disinformation Crisis

AI-generated content is accelerating faster than detection technology can keep up. In 2025-2026, deepfake video quality reached the point where untrained viewers cannot reliably distinguish synthetic from authentic content. Voice cloning requires only 3 seconds of audio — a sample that can be captured through a browser game shared via text message. Photos can be misattributed across thousands of kilometers with a single caption rewrite. The common MIL advice — "check your sources" — is too slow and too abstract for a world where a fabricated video can reach 50,000 shares in 3 hours.

### 2.2 The Gap

Existing Media and Information Literacy tools fall into two categories: passive (curricula, online courses, quizzes) or specialized (deepfake detection tools, reverse image search platforms). Passive tools fail to engage the 18–30 demographic that spends most of its information-consumption time on algorithmically-driven social platforms. Specialized tools require technical knowledge and don't teach the underlying verification framework. No existing tool combines a systems-level understanding of how disinformation spreads with the hands-on skills needed to investigate a specific case. No game puts the player in the dual role of city manager AND forensic investigator.

### 2.3 Why This Matters to UNESCO

GIHA directly addresses the 2026 UNESCO Youth Hackathon theme: "Youth Designing the Future of MIL." Built by two youth developers (both aged 18–30), designed for youth engagement through a game format rather than traditional classroom instruction, and deployable at zero marginal cost — GIHA makes advanced MIL education accessible to anyone with a browser. It specifically addresses AI-generated disinformation, which UNESCO has identified as a priority area for MIL curricula.

---

## Section 3: Our Solution — GIHA

### 3.1 Concept Overview

GIHA (Global Information Health Agency) is a two-mode web game that teaches Media and Information Literacy through systems thinking and hands-on forensic investigation. The player takes the role of an AI forensics investigator at GIHA, protecting the fictional city of Veritas from a coordinated disinformation campaign. In Strategy Mode, the player manages the city's information ecosystem health using a discrete-time ODE simulation adapted from research on neural network coherence dynamics. In Detective Mode, the player investigates individual disinformation cases using 6 forensic tools — each of which teaches a real-world MIL verification skill. The two modes reinforce each other: solving cases improves city health, while city management determines which cases become available.

**Tone and influences:** Investigative thriller with educational grounding, drawing from the methodical investigation of _Spotlight_, the digital forensics systems thinking of _Mr. Robot_, and the real-world urgency of _The Social Dilemma_. The tone shifts by mode: analytical and bird's-eye in Strategy, intimate and focused in Detective.

### 3.2 The Strategy Mode

The strategy mode simulates a city population of 500,000 with the following state variables:

| Variable        | Description                                                          |
| --------------- | -------------------------------------------------------------------- |
| S/E/I/R         | Susceptible / Exposed / Infected / Resistant population compartments |
| σ (σ-coherence) | Population-level resilience to disinformation, 0–100                 |
| R₀              | Basic reproduction number of the dominant narrative, 0–5.0           |

The player monitors R₀ and σ in a heads-up display. When R₀ rises or σ drops, the player can deploy 6 types of interventions (Fact-Check Bureau, School MIL Program, Algorithm Audit, Community Dialog, Source Verification Campaign, Emergency Broadcast), each with unique cost, cooldown, duration, and direction of effect (R₀ reduction, σ boost, or both).

The city is visualized as a top-down pixel art tile grid (50×50 tiles, 20px each, 1000×1000 canvas), with 4 color-coded districts, a semi-transparent heatmap overlay showing per-district σ levels, animated population agent dots (80 agents in S/E/I/R colors), and intervention rings that pulse on active effects. The simulation runs continuously with play/pause, speed control (1–10×), and a manual step mode.

### 3.3 The Detective Mode

The detective mode presents 3 hand-crafted cases, each teaching a distinct MIL verification skill:

| Case | Title                   | MIL Lesson                                                                                        |
| :--: | ----------------------- | ------------------------------------------------------------------------------------------------- |
|  1   | The Viral Mayor         | Deepfake detection through multi-modal analysis (audio spectrogram + frame inspection + metadata) |
|  2   | Grandma's Distress Call | AI voice cloning awareness: verify urgent requests through independent channels                   |
|  3   | The Front Page          | Reverse image search and geolocation: context is everything                                       |

Each case follows a 5-state flow: Intro cutscene → Free-form investigation on an evidence board → Evidence connection mapping → Verdict (Real / Manipulated / Uncertain) with written justification → Debrief with score breakdown and real-world MIL lesson.

Six forensic tools are available: Spectrogram (detects synthetic audio artifacts), Frame Stepper (inspects video frame-by-frame for lip-sync mismatches), Metadata Inspector (extracts timestamps, GPS, software signatures), Source Tracer (traces provenance through propagation graphs), Inconsistency Highlighter (detects lighting and shadow anomalies), and Timeline Cross-Referencer (flags impossible creation-to-publication windows). Each tool is tied to an evidence type affinity and returns confidence-annotated findings.

Players connect evidence items on the board to build relationships, and the scoring engine evaluates accuracy (50%), tool efficiency (20%), connections made (15%), justification quality (15%), and time bonus (±5%).

### 3.4 The Mathematical Foundation

GIHA's strategy mode runs on a discrete-time adaptation of the Σ-Model — a dynamical systems formalism originally developed for analyzing neural network coherence and adapted here for population-level information health. The core metric σ-coherence (0–100) measures the population's ability to distinguish authentic content from disinformation. The R₀ threshold (transcritical bifurcation at R₀ = 1.0) marks when disinformation transitions from containable to epidemic. At σ < 20, the city enters a stable low-coherence equilibrium — the "σ-trap" — from which no intervention can recover. The S/E/I/R compartment model tracks population exposure dynamics.

Parameter values (recovery rate, incubation rate, decay coefficients, intervention effects) were calibrated against the Σ-Model paper's Proposition 4.1 and adjusted through internal playtesting to achieve a target playtime of 15–20 minutes per session. The full mathematical specification is available in `docs/phases/ode-parameters.md`.

### 3.5 Technical Implementation

- **Build:** Vite 8, React 19, TypeScript 6 (strict), Zustand state management
- **Rendering:** Canvas2D with pixel-art aesthetic for strategy mode; CSS Modules with pixel-themed UI for detective mode
- **Engine:** Pure TypeScript ODE solver (ported from the Python Σ-Model reference implementation)
- **Tests:** Vitest with v8 coverage
- **CI/CD:** GitHub Actions (lint, typecheck, test, build)
- **Hosting:** Netlify free tier (static SPA, zero recurring cost)
- **Data:** Fully local — no API calls, no server, no database after initial load
- **Bundle:** ~325KB JS gzipped, no runtime dependencies beyond React and Zustand

The entire application is a single-page static site that runs entirely in the browser. Frame data for forensic tools is procedurally generated; case content comes from static JSON files in `public/cases/`. No data is collected from players, no accounts are required, and the game functions fully offline after the initial page load.

---

## Section 4: Target Audience & Impact

### 4.1 Primary Audience

Youth aged 18–30 globally, with no prior Media and Information Literacy knowledge required. The game is designed to be accessible on a $200 Chromebook or any modern desktop/laptop running Chrome, Firefox, or Safari. No install, no account, no payment — open the URL and play. According to ITU data (2024), 71% of youth aged 15–24 worldwide use the internet, representing approximately 830 million potential users. GIHA requires only a browser, making it one of the most accessible advanced MIL interventions available.

### 4.2 Reach Potential

As a static web application with zero server-side infrastructure, GIHA can be deployed at effectively zero marginal cost per user. Estimated bandwidth: ~5MB per game session (bundle + assets + case data). Netlify's free tier (100GB/month) supports approximately 20,000 full game sessions at zero hosting cost. Localization-ready: all case text (evidence findings, cutscenes, tool descriptions) is in JSON files that can be translated without code changes.

### 4.3 Impact Measurement

The game measures in-session metrics: per-case verdict accuracy, tool usage efficiency, evidence connection quality, and composite score grade. These metrics are purely local and are not transmitted. A pre/post quiz module is planned for classroom deployments to measure MIL skill improvement — the design target is a 30% improvement in deepfake detection accuracy after completing all 3 cases.

### 4.4 Inclusion & Marginalized Communities

GIHA requires no personal data, no signup, no tracking, and no internet connection after initial load. The total bundle is under 5MB, making it accessible in low-bandwidth environments. The visual-heavy interface reduces language barriers, and all text content is JSON-based for easy localization. Cases were designed to be culturally adaptable — the mechanics work with any story, and the MIL lessons are universal.

---

## Section 5: Innovation & Creativity

### 5.1 What Makes GIHA Different

GIHA is the only MIL tool that combines a real-time systems dynamics simulation with hands-on forensic investigation in a single game. The player manages the health of an entire information ecosystem BEFORE diving into a specific case — building an intuitive understanding of how R₀, σ, and population dynamics interact. The forensic tools don't just tell the player what the answer is; they teach the player how to investigate by presenting raw data (spectrogram, metadata, frame-by-frame video) and letting the player draw conclusions.

The two modes create a feedback loop that no single-mode MIL game achieves: good detective work improves the city's health, and a healthy city unlocks harder cases. The player experiences disinformation as both a population-level phenomenon AND an individual forensic challenge.

### 5.2 Comparison to Existing Solutions

| Tool/Platform                                      |                              Type                               | How GIHA Differs                                                                                                                                |
| :------------------------------------------------- | :-------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bad News / Get Bad News** (DROG/Cambridge, 2018) | Single-player web game, one mode (social media feed simulation) | GIHA adds a real population simulation layer with ODE dynamics, a separate forensic investigation mode, and a connection-mapping evidence board |
| **Go Viral!** (WHO/UK Govt, 2020)                  |           Short-form browser game teaching prebunking           | GIHA teaches hands-on investigation skills (spectrogram reading, metadata inspection) in addition to the strategy-level understanding           |
| **Troll Factory** (YLE Finland, 2019)              |            Role-playing as a disinformation creator             | GIHA places the player on the DEFENSE side — not how to create disinfo, but how to detect and mitigate it                                       |
| **Factitious** (American University, 2017)         |               Swipe-based news authenticity game                | GIHA requires multi-modal evidence analysis and connection-drawing, not binary swipe decisions                                                  |
| **Traditional MIL curricula**                      |                       Textbook/quiz-based                       | GIHA is game-based with real-time ODE feedback — the player feels the consequences of their decisions within minutes, not weeks                 |

---

## Section 6: Feasibility & Sustainability

### 6.1 Development Status

GIHA is fully functional and playable. Development began July 9, 2026 with a 2-person team working within a 6-week build window (compressed from 7 weeks due to a 3-day late start). As of the submission date (August 16, 2026), all phases through Phase 10 (Playtesting & QA) are complete. The game includes 3 complete cases, 6 functional forensic tools, a working ODE simulation engine, a pixel-art city visualization, and end-to-end mode integration with budget transfer, case unlocking, and win/loss conditions. Approximately 650+ unit tests pass with zero type errors and zero lint errors.

### 6.2 Sustainability Plan

- **Open-source:** MIT-licensed. Full source at [repo URL]. Contributions welcome.
- **Translation:** Community-driven localization via JSON. A crowd translation model (GitHub issues + PRs) allows any language community to create and contribute translations.
- **Case expansion:** The case JSON schema is documented. New cases can be authored by anyone with JSON+basic image editing skills. Planned roadmap: user-generated case submission pipeline.
- **Classroom support:** Planned: session scoring dashboard (local-only, no server), printable report cards with MIL skill breakdown, classroom discussion guides.
- **Partnerships:** Potential collaborations with journalism schools, MIL NGOs, and ed-tech platforms for case content and distribution.

### 6.3 Resource Requirements

- **Hosting:** Netlify free tier (100GB/month bandwidth). Estimated cost: $0/month for up to ~20K players.
- **Domain:** ~$12/year.
- **Development:** $0 — all tools are open source (Vite, React, TypeScript, Vitest, Zustand).
- **Assets:** All visual assets are CSS-generated, procedurally rendered Canvas2D, or custom pixel art. Audio tracks are original or CC0-licensed. No paid asset licenses.
- **Maintenance:** Zero server maintenance. Static SPA requires no patch management, no database, no runtime security updates.
- **Long-term cost projection:** ~$12/year for domain registration. All other costs are zero.

---

## Section 7: Consistency with Theme

### 7.1 "Youth Designing the Future of MIL"

GIHA is built by youth (both members under 30), designed for youth engagement (15-minute game session, no prerequisite knowledge, game-based motivation loop), and fundamentally about empowering youth to navigate the information ecosystem. The game treats the player not as a passive learner but as an active investigator — someone who must ask questions, test hypotheses, and draw evidence-based conclusions. This is the core of MIL competence, delivered through the medium that youth already engage with: games.

### 7.2 Alignment with UNESCO MIL Values

| UNESCO MIL Principle    | How GIHA Addresses It                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| Freedom of expression   | Enables informed participation by building critical information-consumption skills                    |
| Diversity and inclusion | No-cost browser access; visual-heavy design reduces language barriers; JSON-based localization        |
| Peace-building          | Directly counters disinformation that has been documented to spark real-world violence                |
| Youth empowerment       | Player takes the role of an investigator who makes real decisions — not a passive consumer of content |
| Digital citizenship     | Teaches the skills needed to participate in digital society safely and effectively                    |

---

## Appendices

### A: Architecture Diagram

See `docs/02-technical-architecture.md` for the full technical architecture document.

### B: Case Design Documents

Case data files are located in `public/cases/case-01/`, `public/cases/case-02/`, and `public/cases/case-03/`. Each directory contains `metadata.json`, `script.json`, `evidence-items.json`, `evidence-board.json`, and corresponding evidence media files.

### C: Σ-Model ODE Mathematical Specification

See `docs/phases/ode-parameters.md` for the full discrete-time ODE parameter specification and mapping from the Σ-Model paper.

### D: Pilot Playtest Results

Internal playtesting by the development team throughout the build process. External playtest sessions scheduled for Phase 10 (August 5-7, 2026). Preliminary findings: average completion time 14 minutes, median score grade B+, positive qualitative feedback on the forensics tools and mode transition flow.

### E: References and Inspirations

1. Roozenbeek, J., & van der Linden, S. (2019). "Fake news game confers psychological resistance against online misinformation." _Nature Communications_, 10(1), 1-10.
2. Basol, M., Roozenbeek, J., & van der Linden, S. (2020). "Good News about Bad News: Gamified Inoculation Boosts Confidence and Cognitive Immunity Against Fake News." _Journal of Cognition_, 3(1), 1-15.
3. UNESCO. (2021). "Media and Information Literacy Curriculum for Educators and Learners." UNESCO Publishing.
4. Sunstein, C. R. (2009). "Going to Extremes: How Like Minds Unite and Divide." Oxford University Press.
5. Pennycook, G., & Rand, D. G. (2021). "The Psychology of Fake News." _Trends in Cognitive Sciences_, 25(5), 388-402.

---

_Submitted to UNESCO Youth Hackathon 2026 — "Youth Designing the Future of MIL"_
