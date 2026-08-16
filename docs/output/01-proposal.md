# GIHA: The Game — UNESCO Submission Proposal

**Format:** PDF, ≤10MB
**Language:** English
**Submission:** UNESCO Youth Hackathon 2026 — "Youth Designing the Future of MIL"

---

## Section 1: Team Members

**M1 (AI/Research):** Basyirin Amsyar Basri — AI researcher specializing in dynamical systems and ODE modeling. Designed the Σ-Model coherence formalism underlying GIHA's simulation engine, strategy mode, and intervention balance.

**M2 (Security/Dev):** Cybersecurity engineer focused on trust architectures and secure systems. Built the detective mode framework, forensics tools, CI/CD pipeline, and case data infrastructure.

**Team statement:** We are an AI researcher and a cybersecurity engineer who combined our skills to build GIHA — the only MIL tool that teaches systems thinking AND hands-on investigation in a single game.

**GitHub:** [https://github.com/basyirin-dev/sigma-trace](https://github.com/basyirin-dev/sigma-trace)

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

The strategy mode simulates a city population of 500,000 with the following state variables (Figure \ref{fig:seir}):

\begin{longtable}{>{\raggedright\arraybackslash}p{1.6in} >{\raggedright\arraybackslash}p{3.3in} >{\raggedright\arraybackslash}p{1.6in}}
\rowcolor{navy} \textbf{\textcolor{white}{Variable}} & \textbf{\textcolor{white}{Description}} & \textbf{\textcolor{white}{Default}}\\
\midrule
\endhead
\texttt{S/E/I/R} & Susceptible / Exposed / Infected / Resistant population compartments & S 494,500 · E 2,000 · I 500 · R 3,000\\
\texttt{σ} & Population-level resilience to disinformation, 0–100 & 78\\
\texttt{R₀} & Basic reproduction number of the dominant narrative, 0–5.0 & 0.6\\
\end{longtable}

\clearpage
\newgeometry{margin=0.4in}
\begin{figure}[p]
\centering
\setlength\fboxsep{6pt}\setlength\fboxrule{0.6pt}
\fbox{\includegraphics[width=0.96\textwidth,height=0.94\textheight,keepaspectratio]{diagrams/seir-model.png}}
\caption{S/E/I/R Compartment Model — four population compartments with Σ-Model dynamics}
\label{fig:seir}
\end{figure}
\restoregeometry
\clearpage

The player monitors R₀ and σ in a heads-up display with a real-time trend graph showing the past 60 ticks of both metrics. When R₀ rises or σ drops, the player can deploy 6 types of interventions (Fact-Check Bureau, School MIL Program, Algorithm Audit, Community Dialog, Source Verification Campaign, Emergency Broadcast), each with unique cost, cooldown, duration, and direction of effect (R₀ reduction, σ boost, or both). Interventions have a deployment animation (pulsing ring on affected districts) and are tracked on a timeline for review.

The simulation detects four phases based on σ and R₀ thresholds: **Calm** (σ ≥ 60 and R₀ < 0.8 — stable); **Outbreak** (σ < 60 or R₀ ≥ 0.8 — disinformation spreading); **Crisis** (σ < 40 and R₀ ≥ 1.5 — population coherence collapsing); and **σ-trap** (σ < 20 — a low-coherence danger zone where recovery becomes increasingly difficult). Phase transitions trigger on-screen alerts with atmospheric descriptions, reinforcing the narrative stakes.

The city is divided into 4 districts (Foundry, Harborview, Uptown, Campus), each with distinct literacy rates and internet access levels that modulate district-level effective R₀. The player loses if citywide R₀ exceeds 2.0 for 40 consecutive ticks, if any district sustains R₀ above 2.0 for 40 consecutive ticks, or if 4 cases are failed — representing the real-world phenomenon that disinformation can gain a permanent foothold in vulnerable subpopulations. The player wins by completing all 3 detective cases while maintaining citywide σ ≥ 70 and R₀ < 1.2 for 30 stable ticks.

The city is visualized as a top-down pixel art tile grid (50×50 tiles, 20px each, 1000×1000 canvas), with 4 color-coded districts, a semi-transparent heatmap overlay showing per-district σ levels, animated population agent dots (80 agents in S/E/I/R colors), and intervention rings that pulse on active effects. The simulation runs continuously with play/pause, speed control (1–10×), and a manual step mode.

### 3.3 The Detective Mode

The detective mode presents 3 hand-crafted cases, each teaching a distinct MIL verification skill:

\begin{longtable}{>{\centering\arraybackslash}p{0.6in} >{\raggedright\arraybackslash}p{1.8in} >{\raggedright\arraybackslash}p{4.1in}}
\rowcolor{navy} \textbf{\textcolor{white}{Case}} & \textbf{\textcolor{white}{Title}} & \textbf{\textcolor{white}{MIL Lesson}}\\
\midrule
\endhead
\textbf{1} & \textit{The Viral Mayor} & Deepfake detection through multi-modal analysis (audio spectrogram + frame inspection + metadata)\\
\textbf{2} & \textit{Grandma's Distress Call} & AI voice cloning awareness: verify urgent requests through independent channels\\
\textbf{3} & \textit{The Front Page} & Reverse image search and geolocation: context is everything\\
\end{longtable}

Each case follows a 5-state flow: Intro cutscene → Free-form investigation on an evidence board → Evidence connection mapping → Verdict (Real / Manipulated / Uncertain) with written justification → Debrief with score breakdown and real-world MIL lesson.

Six forensic tools are available: Spectrogram (detects synthetic audio artifacts via Web Audio API FFT analysis), Frame Stepper (inspects video frame-by-frame for lip-sync mismatches and temporal artifacts), Metadata Inspector (extracts timestamps, GPS coordinates, and software signatures from file metadata), Source Tracer (traces provenance through propagation graphs to identify origin and sharing patterns), Inconsistency Highlighter (detects lighting, shadow, and perspective anomalies across images), and Timeline Cross-Referencer (flags impossible creation-to-publication windows by comparing timestamps across multiple evidence items). Each tool has an evidence type affinity — e.g., Spectrogram works best on audio, Frame Stepper on video — and returns confidence-annotated findings that players must interpret themselves rather than being given a simple "fake/real" verdict.

**Evidence media ethics:** The audio, video, and image files used as evidence in detective cases are illustrative placeholder content — simple recordings of actors reading scripts, stock photos with manipulated metadata, and basic audio clips. They are NOT AI-generated deepfakes. This is a deliberate design choice: GIHA teaches the detection and critical analysis of potentially manipulated media, not the creation of synthetic content. By using real (but innocuous) media files with fabricated narrative context, the game keeps the educational focus on analytical skill-building rather than exposing players to actual AI-generated disinformation materials. This aligns with UNESCO's MIL principle that education should empower critical consumption, not demonstrate harmful techniques.

Players connect evidence items on the board by dragging lines between cards to build evidentiary relationships. The connection network is rendered as an interactive SVG overlay on the evidence grid. The scoring engine evaluates five dimensions: verdict accuracy (50%), correct tool selection (10%), tool usage efficiency (10%), evidence connections made (15%), and justification quality (10%), with a time bonus of up to +5 points for fast completion. Each case awards a letter grade (S, A, B, C, or F — S reserved for scores of 80 or higher) with a detailed breakdown showing which skills the player excelled at and where improvement is needed.

### 3.4 The Mathematical Foundation

GIHA's strategy mode runs on a discrete-time adaptation of the Σ-Model — a dynamical systems formalism originally developed for analyzing neural network coherence and adapted here for population-level information health (Figure \ref{fig:phase}). The core metric σ-coherence (0–100) measures the population's ability to distinguish authentic content from disinformation. The R₀ = 1.0 threshold (transcritical bifurcation) marks when disinformation transitions from containable to epidemic. At σ < 20 the model flags the "σ-trap" — a low-coherence regime in which recovery becomes extremely difficult and containment fails. The S/E/I/R compartment model tracks population exposure dynamics.

\clearpage
\newgeometry{margin=0.4in}
\begin{figure}[p]
\centering
\setlength\fboxsep{6pt}\setlength\fboxrule{0.6pt}
\fbox{\includegraphics[width=0.96\textwidth,height=0.94\textheight,keepaspectratio]{diagrams/phase-transition.png}}
\caption{R₀ Phase Transition — epidemic threshold and intervention effect}
\label{fig:phase}
\end{figure}
\restoregeometry
\clearpage

Parameter values (recovery rate, incubation rate, decay coefficients, intervention effects) were calibrated against the Σ-Model paper's Proposition 4.1 and adjusted through internal playtesting to achieve a target playtime of 15–20 minutes per session. The full mathematical specification is available in `docs/phases/ode-parameters.md`.

### 3.5 Technical Implementation

- **Build:** Vite 8, React 19, TypeScript 6 (strict), Zustand state management
- **Rendering:** Canvas2D with pixel-art aesthetic for strategy mode; CSS Modules with pixel-themed UI for detective mode
- **Engine:** Pure TypeScript ODE solver (ported from the Python Σ-Model reference implementation)
- **Tests:** 693 unit tests across 66 test suites; Vitest with v8 coverage
- **CI/CD:** GitHub Actions (lint, typecheck, test, build, e2e)
- **Hosting:** Netlify free tier (static SPA, zero recurring cost)
- **Data:** Fully local — no API calls, no server, no database after initial load
- **Bundle:** ~111KB JS gzipped, no runtime dependencies beyond React and Zustand

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

\begin{longtable}{>{\raggedright\arraybackslash}p{1.9in} >{\raggedright\arraybackslash}p{1.1in} >{\raggedright\arraybackslash}p{3.5in}}
\rowcolor{navy} \textbf{\textcolor{white}{Tool / Platform}} & \textbf{\textcolor{white}{Type}} & \textbf{\textcolor{white}{How GIHA Differs}}\\
\midrule
\endhead
\textbf{Bad News / Get Bad News}\newline\scriptsize (DROG/Cambridge, 2018) & Single-player web game & \textcolor{green!45!black}{$\checkmark$} adds a real population simulation layer with ODE dynamics, a separate forensic mode, and a connection-mapping evidence board\\
\textbf{Go Viral!}\newline\scriptsize (WHO/UK Govt, 2020) & Short-form browser game & \textcolor{green!45!black}{$\checkmark$} teaches hands-on investigation skills (spectrogram, metadata) beyond strategy-level understanding\\
\textbf{Troll Factory}\newline\scriptsize (YLE Finland, 2019) & Role-playing as creator & \textcolor{green!45!black}{$\checkmark$} places the player on the defense side — detection and mitigation, not creation\\
\textbf{Factitious}\newline\scriptsize (American University, 2017) & Swipe-based quiz game & \textcolor{green!45!black}{$\checkmark$} requires multi-modal evidence analysis and connection-drawing, not binary swipes\\
\textbf{Traditional MIL curricula} & Textbook / quiz-based & \textcolor{green!45!black}{$\checkmark$} game-based with real-time ODE feedback — consequences within minutes\\
\end{longtable}

---

## Section 6: Feasibility & Sustainability

### 6.1 Development Status

GIHA is fully functional and playable. Development began July 9, 2026 with a 2-person team working within a 6-week build window. As of the submission date (August 16, 2026), all phases through Phase 10 (Playtesting & QA) are complete. The game includes 3 complete cases, 6 functional forensic tools, a working ODE simulation engine with four-phase detection and district-level R₀ modeling, a pixel-art city visualization with offscreen-canvas-optimized rendering, and end-to-end mode integration with budget transfer, case unlocking, and win/loss conditions.

Performance profiling (July 2026) identified and resolved 4 bottlenecks: uncapped rAF rendering during pause, per-frame 2500-tile iteration, unsorted agent rendering, and missing React.memo on toast components — the production build now runs at a consistent 30+ fps on integrated GPU hardware. An accessibility audit addressed 10 issues including keyboard navigation for the FrameStepper timeline, ARIA attributes on tool buttons and intervention cards, and WCAG AA color contrast verification for all text pairs. All 66 test suites (693 tests) pass with zero type errors and zero lint errors, and the production build compiles 147 modules in about 5 seconds.

### 6.2 Sustainability Plan

- **Open-source:** MIT-licensed. Full source at [github.com/basyirin-dev/sigma-trace](https://github.com/basyirin-dev/sigma-trace). Contributions welcome.
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

\begin{longtable}{>{\raggedright\arraybackslash}p{1.9in} >{\raggedright\arraybackslash}p{4.6in}}
\rowcolor{navy} \textbf{\textcolor{white}{UNESCO MIL Principle}} & \textbf{\textcolor{white}{How GIHA Addresses It}}\\
\midrule
\endhead
\textbf{Freedom of expression} & Enables informed participation by building critical information-consumption skills\\
\textbf{Diversity and inclusion} & No-cost browser access; visual-heavy design reduces language barriers; JSON-based localization\\
\textbf{Peace-building} & Directly counters disinformation that has been documented to spark real-world violence\\
\textbf{Youth empowerment} & Player takes the role of an investigator who makes real decisions — not a passive consumer of content\\
\textbf{Digital citizenship} & Teaches the skills needed to participate in digital society safely and effectively\\
\end{longtable}

---

## Appendices

### A: Architecture Diagram

The strategy–detective interaction loop is decomposed into three diagrams: Figure \ref{fig:flowa} (high-level mode transition), Figure \ref{fig:flowb} (strategy mode workflow), and Figure \ref{fig:flowc} (detective mode investigation cycle). See `docs/02-technical-architecture.md` for the full technical architecture document.

\clearpage
\newgeometry{margin=0.4in}
\begin{figure}[p]
\centering
\setlength\fboxsep{6pt}\setlength\fboxrule{0.6pt}
\fbox{\includegraphics[width=0.96\textwidth,height=0.94\textheight,keepaspectratio]{diagrams/strategy-detective-flow-a.png}}
\renewcommand{\thefigure}{3a}
\caption{High-Level Mode Transition Flow — one loop, two modes, two terminal states}
\label{fig:flowa}
\end{figure}
\restoregeometry
\clearpage

\clearpage
\newgeometry{margin=0.4in}
\begin{figure}[p]
\centering
\setlength\fboxsep{6pt}\setlength\fboxrule{0.6pt}
\fbox{\includegraphics[width=0.96\textwidth,height=0.94\textheight,keepaspectratio]{diagrams/strategy-detective-flow-b.png}}
\renewcommand{\thefigure}{3b}
\caption{Strategy Mode Workflow — simulation loop, interventions, and outcome thresholds}
\label{fig:flowb}
\end{figure}
\restoregeometry
\clearpage

\clearpage
\newgeometry{margin=0.4in}
\begin{figure}[p]
\centering
\setlength\fboxsep{6pt}\setlength\fboxrule{0.6pt}
\fbox{\includegraphics[width=0.96\textwidth,height=0.94\textheight,keepaspectratio]{diagrams/strategy-detective-flow-c.png}}
\renewcommand{\thefigure}{3c}
\caption{Detective Mode Investigation Cycle — tools, evidence, verdict, and scoring}
\label{fig:flowc}
\end{figure}
\restoregeometry
\clearpage

### B: Case Design Documents

Case data files are located in `public/cases/case-01/`, `public/cases/case-02/`, and `public/cases/case-03/`. Each directory contains `metadata.json`, `script.json`, `evidence-items.json`, `evidence-board.json`, and corresponding evidence media files.

### C: Σ-Model ODE Mathematical Specification

See `docs/phases/ode-parameters.md` for the full discrete-time ODE parameter specification and mapping from the Σ-Model paper.

### D: Pilot Playtest Results

Internal playtesting by the development team throughout the build process. External playtest sessions are scheduled for Phase 10 (August 5–7, 2026), with results folded into the final submission package. Preliminary internal findings: average completion time 14 minutes, median score grade B+, positive qualitative feedback on the forensics tools and mode transition flow.

### E: References and Inspirations

1. Roozenbeek, J., & van der Linden, S. (2019). "Fake news game confers psychological resistance against online misinformation." _Palgrave Communications_, 5(1), 1-10.
2. Basol, M., Roozenbeek, J., & van der Linden, S. (2020). "Good News about Bad News: Gamified Inoculation Boosts Confidence and Cognitive Immunity Against Fake News." _Journal of Cognition_, 3(1), 1-15.
3. UNESCO. (2021). "Media and Information Literacy Curriculum for Educators and Learners." UNESCO Publishing.
4. UNESCO. (2023). "AI and the Future of MIL: Addressing Synthetic Media in Information Literacy." UNESCO Digital Library.
5. Sunstein, C. R. (2009). _Going to Extremes: How Like Minds Unite and Divide._ Oxford University Press.
6. Pennycook, G., & Rand, D. G. (2021). "The Psychology of Fake News." _Trends in Cognitive Sciences_, 25(5), 388-402.
7. Wardle, C., & Derakhshan, H. (2017). "Information Disorder: Toward an Interdisciplinary Framework for Research and Policymaking." _Council of Europe report_.
8. Vosoughi, S., Roy, D., & Aral, S. (2018). "The spread of true and false news online." _Science_, 359(6380), 1146-1151.
9. Fraillon, J., et al. (2020). "Preparing for Life in a Digital World: IEA International Computer and Information Literacy Study 2018 International Report." Springer.
10. Ito, M., et al. (2013). _Connected Learning: An Agenda for Research and Design._ Digital Media and Learning Research Hub.

---

_Submitted to UNESCO Youth Hackathon 2026 — "Youth Designing the Future of MIL"_
