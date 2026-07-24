# GIHA: Game Design Document

## 1.1 Concept

GIHA is a two-mode web game that teaches Media and Information Literacy (MIL) through systems thinking and hands-on investigation. Players alternate between **Strategy Mode** (managing a city's information ecosystem health) and **Detective Mode** (investigating specific disinformation cases).

**Target audience:** Youth aged 18–30, no prior MIL knowledge required.
**Platform:** Web (static site, no server needed after deployment).
**Build window:** 6 weeks (July 9 – August 16, 2026). *(Started 3 days behind schedule; initial phases compressed.)*
**Team:** 2 developers.

### Key Terms (Plain Language)

| Term | What It Means | Why It Matters |
|:-----|:--------------|:---------------|
| **σ (sigma)** | The city's "immune system" score (0–100). High = people can spot fake news. Low = people believe everything. | If σ drops below 20, the city is trapped in a state where truth and falsehood are indistinguishable — game over. |
| **R₀ (R-naught)** | How fast disinformation spreads. If R₀ > 1, each piece of disinfo creates more than 1 new believer — it's spreading faster than it can be stopped. Like the R₀ for COVID-19, but for fake news. | If R₀ stays above 1.5 too long, districts collapse. |
| **S / E / I / R** | Population compartments: **S**usceptible (haven't seen it), **E**xposed (saw it, don't believe yet), **I**nfected (believe it), **R**esistant (MIL-literate, immune). | These shift as disinformation spreads and interventions work. |
| **σ-trap** | When σ drops below 20, the population can't distinguish truth from falsehood — game over. | A low-coherence equilibrium where no intervention can recover. |
| **Intervention** | An action you take to fight disinformation (fact-checking, education, algorithm audits). | Each has a cost, cooldown, and specific effect on R₀ or σ. |

## 1.2 Narrative Framing

**Player role:** AI Forensics Investigator at the **Global Information Health Agency (GIHA)** — an independent watchdog that monitors and protects information ecosystems worldwide.

**Setting:** A fictional mid-sized city named *Veritas*. Each playthrough begins with baseline statistics: population 500k, σ-coherence 78/100, R₀ 0.6. City districts have varying vulnerability levels based on demographics (internet access, education levels, language diversity).

**Story arc:** A coordinated disinformation campaign targets Veritas. A deepfake video of the mayor surfaces (Case 1). An AI voice scam targets elderly residents (Case 2). A manipulated news photo goes viral (Case 3). The player must investigate each case while managing the city's overall information health. Failure causes the city to enter the σ-trap.

## 1.3 Core Loop

```
                    ┌─────────────────────────┐
                    │   STRATEGY MODE          │
                    │   Monitor R₀, σ,         │
                    │   Deploy interventions   │
                    └───────────┬─────────────┘
                                │
                    Disinformation outbreak detected
                                │
                                ▼
                    ┌─────────────────────────┐
                    │   DETECTIVE MODE         │
                    │   Investigate case       │
                    │   Use forensics tools    │
                    │   Deliver verdict        │
                    └───────────┬─────────────┘
                                │
                    Verdict affects simulation
                                │
                                ▼
                    ┌─────────────────────────┐
                    │   STRATEGY MODE (resume) │
                    │   See consequences       │
                    │   Adapt strategy         │
                    └─────────────────────────┘
```

## 1.4 Strategy Mode Mechanics

### City State Vector
| Parameter | Description | Range |
|:----------|:------------|:------|
| Population | Total simulated citizens | 500,000 (fixed) |
| S | Susceptible (uninformed, vulnerable) | 0–500k |
| E | Exposed (encountered disinformation) | 0–500k |
| I | Infected (believes disinformation) | 0–500k |
| R | σ-Aware (MIL-literate, resistant) | 0–500k |
| σ | Schema Coherence (population-level) | 0–100 |
| R₀ | Basic reproduction number of current dominant narrative | 0–5.0 |

### Interventions
| Intervention | Cost | Cooldown | Effect | Description |
|:-------------|:----:|:--------:|:-------|:------------|
| Fact-Check Bureau | 50 | 30s | −0.2 R₀ for 15s | Deploys professional fact-checkers |
| School MIL Program | 80 | 60s | +2 σ/tick for 60s | Funds media literacy education in schools |
| Algorithm Audit | 120 | 90s | −0.3 R₀ for 20s | Investigates and adjusts platform algorithms |
| Community Dialog | 40 | 45s | +1 σ/tick + −0.1 R₀ for 20s | Funds community discussion groups |
| Source Verification Campaign | 60 | 50s | −0.15 R₀ for 25s | Public campaign teaching source-checking |
| Emergency Broadcast | 100 | 75s | −0.4 R₀ for 10s | City-wide fact-correcting alert |

R₀ above 1.0 means the disinformation is spreading faster than it can be contained. Extended R₀ > 1.5 triggers district collapses (visual desaturation, icon changes). σ below 30 triggers game-over warning.

## 1.5 Detective Mode Mechanics

### Case Structure
Each case follows a 5-step state machine:
1. **Intro** — Cutscene briefing the case (15–30s text/title cards)
2. **Investigation** — Free-form exploration of evidence (unlimited time, but speed bonus)
3. **Evidence Board** — Drag clues into relationship map (must connect ≥3 to proceed)
4. **Verdict** — Select: Real / Manipulated / Uncertain + written justification
5. **Debrief** — Narrative conclusion showing real-world parallel

### Evidence Types
| Type | Examples | Max per case |
|:-----|:---------|:------------:|
| Video clips | News footage, social media posts | 2 |
| Audio clips | Phone calls, voicemails, broadcasts | 2 |
| Images | Photographs, screenshots, documents | 3 |
| Text | Messages, articles, emails | 3 |
| Metadata | Headers, timestamps, geolocation | 2 |

### Forensics Tools
| Tool | Function | Used on |
|:-----|:---------|:--------|
| Spectrogram Analyzer | Visualizes audio frequency spectrum, detects synthetic artifacts | Audio clips |
| Frame Stepper | Advances video frame by frame, highlights compression artifacts | Video clips |
| Metadata Inspector | Extracts EXIF, file headers, creation timestamps | Images, videos |
| Source Tracer | Simulates reverse image search, shows first-known publication | Images, videos |
| Inconsistency Highlighter | Detects lighting/shadow/perspective anomalies | Images |
| Timeline Cross-Referencer | Plots events on a timeline, shows impossible sequences | All evidence |

### Scoring
| Component | Weight | Detail |
|:----------|:------:|:-------|
| Verdict accuracy | 50% | Correct classification |
| Tool usage efficiency | 20% | Used minimum necessary tools |
| Evidence connected | 15% | Connections on evidence board |
| Justification quality | 15% | Key terms present, coherent reasoning |
| Time bonus | ±5% | Under 3 minutes = +5%, over 5 minutes = −5% |

### Case Synopses

**Case 1: "The Viral Minister"** — A video of the city mayor saying "I resign effective immediately" goes viral. The player must determine if the video is real or AI-generated. The clue is a subtle audio artifact in the spectrogram and inconsistent lip-sync timing. *MIL lesson: deepfake detection through multi-modal analysis.*

**Case 2: "Grandma's Distress Call"** — Elderly residents receive AI-generated voicemails from a familiar voice (cloned) claiming to be a grandchild needing bail money. The player traces the call origin and analyzes the audio for synthetic markers. *MIL lesson: AI voice cloning awareness and verification protocols.*

**Case 3: "The Front Page"** — A photo of a violent protest appears on social media, purportedly from Veritas. The player must verify: was this photo taken here, and is it authentic? The clue is inconsistent lighting angles and a building that doesn't exist in Veritas. *MIL lesson: reverse image search and geolocation verification.*

## 1.6 Cross-Mode Integration

| Detective outcome | Strategy effect |
|:-----------------|:----------------|
| Case solved correctly, fast | R₀ −0.3, σ +5, one-time budget bonus +50 |
| Case solved correctly, slow | R₀ −0.2, σ +3 |
| Case failed (wrong verdict) | R₀ +0.4, σ −5, district enters vulnerable state |
| Case partially solved (uncertain) | R₀ −0.1, σ +1 |

## 1.7 Win / Lose Conditions

| Condition | Type | Trigger |
|:----------|:----:|:--------|
| City σ ≥ 80 and R₀ < 0.8 for 60s | **Win** | Player successfully managed city through all 3 cases |
| City σ < 20 | **Lose** | Population trapped in σ-trap (low-coherence equilibrium) |
| Any district at R₀ > 2.0 for 30s | **Lose** | Uncontained narrative collapse |

## 1.8 Scope Boundaries (Explicitly Cut)

| Feature | Status | Reason |
|:--------|:------:|:-------|
| Full ODE system (continuous) | Cut | Discrete-time approximation sufficient for gameplay |
| Real LLM inference | Cut | All AI tool effects are pre-simulated/baked |
| Multiplayer | Cut | Adds auth, networking, balancing complexity |
| Save/load system | Implemented | localStorage-based, auto-save every 5 ticks + on key events |
| Tutorial overlay | Cut | Tooltip-only onboarding |
| Custom difficulty | Cut | Single difficulty tuned to target experience |
| Real reverse image search API | Cut | Simulated search against pre-baked database |
| Audio recording for Case 2 | Cut | Pre-recorded audio clips provided |

## 1.9 Art Style

- **Strategy mode:** Top-down pixel art tile grid (50×50, 20px tiles). Four district color zones (rust, teal, gold, green) with 1px boundary borders. Semi-transparent heatmap overlay (green → red severity). Pixel agent dots moving with random-walk AI. Dark navy background.
- **Detective mode:** 2D pixel-themed UI with pixel-bordered cards, monoline type badges, dark background. Evidence cards with flip animation, tool buttons with pixel styling.
- **Typography:** BoldPixels (custom pixel font for all UI). See `src/styles/variables.css` for font definitions.
- **Logo:** SVG at `public/assets/logo/GIHA-Logo.svg` — purple (#863bff) shield design.
- **City tiles:** 16px tiles from a third-party pixel pack (grass + stone), procedurally rendered buildings.
- **Agents:** 5px colored circles (S/E/I/R) via Canvas2D — no character sprites.
- **All additional assets:** Collected third-party pixel art packs (itch.io) with per-pack licensing.

## 1.10 Sound

- **Strategy mode:** Static ambient loop. Music auto-dims to 30% volume during warning toasts. Mode switching uses 1-second crossfade.
- **Detective mode:** Static ambient loop. "Aha" chime on correct tool-evidence match.
- **Case solved:** Short affirming melody.
- **σ-trap game over:** Descending drone, cut to silence.
- **Mode switching:** Automatic track switching via Zustand subscription + 1-second linear crossfade.
- **Volume control:** Two sliders (music, SFX) + mute toggle, all persisted to localStorage.
- **Preloading:** All audio preloaded at app start via `useAudioManager.preloadAll()`. SFX served from a pooled array of `HTMLAudioElement` instances with round-robin cycling.
- **All sounds:** Pre-rendered MP3/WAV files sourced from CC0 sample libraries. No Web Audio API synthesis or real-time DSP (the Spectrogram tool uses `AudioContext` + `AnalyserNode` for read-only frequency analysis).
