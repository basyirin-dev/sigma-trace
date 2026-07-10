# σ-Trace: UNESCO Submission Proposal Outline

## Document Structure

**Format:** PDF, ≤10MB
**Language:** English

---

## Section 1: Team Members

- Name, age, country, background for each member
- Brief statement: "We are an AI researcher and a cybersecurity engineer who combined our skills to build σ-Trace"
- Link to team website / LinkedIn / GitHub
- Photo (optional)

## Section 2: Problem Statement

**2.1 The Disinformation Crisis (1 paragraph)**
- AI-generated content is accelerating faster than detection
- Fact-checking is reactive and slow
- The information ecosystem has structural vulnerabilities (algorithmic amplification, echo chambers, low MIL literacy)

**2.2 The Gap (1 paragraph)**
- Existing MIL tools are either passive (curricula, quizzes) or inaccessible (complex, requiring training)
- No tool combines systems-level understanding with hands-on forensic investigation
- Youth engagement with traditional MIL education is low

**2.3 Why This Matters to UNESCO (1 paragraph)**
- Alignment with "Youth Designing the Future of MIL"
- Directly addresses AI-generated disinformation
- Scalable, low-cost, locally deployable

## Section 3: Our Solution — σ-Trace

**3.1 Concept Overview (2 paragraphs)**
- Two-mode game: Strategy Simulation + Detective Investigation
- Player is an AI Forensics Investigator at the Global Information Health Agency
- Teaches MIL through systems thinking and hands-on casework

**3.2 The Strategy Mode (1 paragraph + screenshot)**
- City population simulation governed by Σ-Model ODE
- R₀ (spread rate) tracking, σ-coherence monitoring
- 6 intervention types teaching real MIL strategies
- Visual phase transitions showing information ecosystem collapse

**3.3 The Detective Mode (1 paragraph + screenshot)**
- 3 hand-crafted cases: deepfake video, AI voice scam, manipulated photo
- 6 forensic tools: spectrogram, frame stepper, metadata inspector, source tracer, inconsistency highlighter, timeline cross-referencer
- Each tool teaches a real MIL verification skill

**3.4 The Mathematical Foundation (1 paragraph)**
- Discrete-time adaptation of the Σ-Model ODE system
- σ-coherence metric measuring population-level information health
- R₀ threshold for phase transitions (transcritical bifurcation at R₀ = 1.0)
- Validation: curves match known disinformation spread patterns from academic literature

**3.5 Technical Implementation (1 paragraph)**
- Web-based (static site, no server)
- React + Three.js + Zustand
- Runs in browser, no install, no data collection
- Fully local — suitable for low-bandwidth environments

## Section 4: Target Audience & Impact

**4.1 Primary Audience (1 paragraph)**
- Youth aged 18–30 globally
- No prior MIL knowledge required
- Accessible on $150 Chromebooks, works offline

**4.2 Reach Potential (1 paragraph)**
- Web-deployable with zero infrastructure cost
- Estimated addressable: 500M+ youth with browser access
- Localizable through JSON translation files

**4.3 Impact Measurement (1 paragraph)**
- In-game metrics: pre/post case accuracy improvement, intervention strategy evolution
- Planned: optional pre/post quiz for measurable MIL skill gain
- Target: 30% improvement in deepfake detection accuracy after 3 cases

**4.4 Inclusion & Marginalized Communities (1 paragraph)**
- No signup, no tracking, no data collection
- Low bandwidth: entire app < 5MB
- Visual-heavy interface reduces language barriers
- Cases designed to be culturally adaptable

## Section 5: Innovation & Creativity

**5.1 What Makes σ-Trace Different (1 paragraph)**
- First MIL tool to combine systems dynamics simulation with hands-on forensic investigation
- First to adapt neural network training dynamics (Σ-Model σ-coherence) to information literacy
- Game-based approach achieves higher engagement than traditional MIL curricula

**5.2 Comparison to Existing Solutions (table)**
| Tool | Type | Our advantage |
|:-----|:-----|:-------------|
| Fact-checking websites | Reactive | σ-Trace is proactive — teaches system dynamics |
| MIL curricula | Passive | σ-Trace is interactive — learn by doing |
| Deepfake detectors | Arms race | σ-Trace teaches underlying verification skills, not tool dependency |
| Other MIL games | Single-mode | σ-Trace has dual modes reinforcing each other |

## Section 6: Feasibility & Sustainability

**6.1 Development Status (1 paragraph)**
- Built in 6 weeks by 2 developers
- Fully functional prototype with 3 complete cases
- Static web deployment

**6.2 Sustainability Plan (1 paragraph)**
- Open-source (MIT license)
- Community translation model for localization
- Potential NGO/academic partnerships for case content
- Roadmap: expand to user-generated cases, classroom dashboard, additional languages

**6.3 Resource Requirements (1 paragraph)**
- Zero recurring infrastructure costs
- Low maintenance (static site)
- All assets are CC0 or original

## Section 7: Consistency with Theme

**7.1 "Youth Designing the Future of MIL" (1 paragraph)**
- Built by youth (both members 18–30)
- Designed for youth — game format, not classroom
- Players become designers of their own MIL knowledge through investigation

**7.2 Alignment with UNESCO MIL Values (1 paragraph)**
- Promotes freedom of expression (by enabling informed participation)
- Respects diversity (localization-friendly design)
- Peace-building (counters disinformation that sparks violence)

## Section 8: Appendices

- A: Architecture diagram
- B: Case design documents (3 cases)
- C: Σ-Model ODE mathematical specification
- D: Pilot playtest results (if available)
- E: References and inspirations
