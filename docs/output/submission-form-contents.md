# GIHA — UNESCO Youth Hackathon 2026 Submission Form Contents

**Phase 12.2 deliverable** — pre-filled answers for the UNESCO submission portal.
Copy each field below into the portal. Fields marked **[TBD]** must be confirmed
before upload (see 12.4).

**Hackathon theme:** "Youth Designing the Future of MIL"

---

## 1. Team Information

| Field          | Value                                                                                                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Team name      | GIHA Team                                                                                                                                                                                 |
| Members        | 2 (within the 2–6 allowed)                                                                                                                                                                |
| Member 1       | Basyirin Amsyar Basri — AI Researcher (dynamical systems, ODE modeling, strategy mode)                                                                                                    |
| Member 2       | **[TBD name]** — Cybersecurity Developer (detective mode, forensics tools, CI/CD)                                                                                                         |
| Team statement | We are an AI researcher and a cybersecurity engineer who combined our skills to build GIHA — the only MIL tool that teaches systems thinking AND hands-on investigation in a single game. |

## 2. Project Information

| Field             | Value                                        |
| ----------------- | -------------------------------------------- |
| Project title     | GIHA (Global Information Health Agency)      |
| Solution category | Games & Interactive (education through play) |
| Live demo         | https://sigma-trace.netlify.app              |
| GitHub            | https://github.com/basyirin-dev/sigma-trace  |
| Target audience   | Youth aged 14–24                             |

### Brief description (~100 words)

> GIHA (Global Information Health Agency) is a free, two-mode web game that
> builds Media and Information Literacy by making players both city manager and
> forensic investigator. In Strategy Mode, players manage a simulated city's
> information health through an ODE-driven model of how disinformation spreads.
> In Detective Mode, they investigate fabricated evidence — deepfakes, cloned
> voices, misattributed photos — using six forensic tools that teach real
> verification skills. Built by two youth developers, GIHA requires no account,
> no install, and no data collection, making advanced MIL education accessible
> to anyone with a browser. (94 words)

### How it addresses the theme (~200 words)

> "Youth Designing the Future of MIL" asks for youth-built solutions that
> reimagine media and information literacy. GIHA is built by two youth
> developers (both under 30), for youth, in the medium youth already engage
> with: games. Every mechanic maps to a MIL competency. Strategy Mode teaches
> systems thinking: the R₀ metric shows how a false narrative can become
> epidemic, the σ-coherence gauge models a population's critical resilience,
> and interventions (fact-check bureaus, school MIL programs, algorithm audits)
> demonstrate how institutions respond to an information crisis. Detective Mode
> teaches hands-on verification: spectrogram analysis for synthetic audio,
> frame stepping for deepfake video, metadata inspection for provenance, source
> tracing for propagation, timeline cross-referencing for context, and
> inconsistency highlighting for critical observation. Connecting evidence and
> justifying a verdict with written reasoning builds evidence-based
> argumentation. The two modes form a feedback loop — good detective work
> improves city health, and a healthy city unlocks harder cases — showing MIL as
> continuous practice, not a one-time lesson. With no account, install, or data
> collection and a ~530KB bundle, GIHA makes advanced MIL education free and
> accessible to every youth with a browser. (196 words)

### Technical implementation (~100 words)

> GIHA is a static single-page application built with React 19, TypeScript 6
> (strict mode), and Vite 8. Strategy Mode renders a pixel-art city simulation
> on Canvas2D driven by a pure-TypeScript ODE solver (S/E/I/R compartments with
> R₀ and σ-coherence dynamics). Detective Mode runs entirely on static JSON case
> data with procedurally generated forensics. State is managed with Zustand.
> The project ships with 650+ Vitest tests, a GitHub Actions CI pipeline, and
> is hosted free on Netlify. The game is fully local: no server, no API, no
> accounts, no tracking. (90 words)

## 3. Submission Materials

| Material         | Requirement                                                                        | Status                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Project proposal | PDF or Word, **max 10 MB**                                                         | ✅ `sigma-trace-unesco-proposal.pdf` — 1.1 MB (docs/output/, copied to submission-package/) |
| Video pitch      | Publicly accessible link — no permission request, no sign-in, no download required | ⏳ `pitch-video-final.mp4` packaged; hosting link **[TBD]** (see 12.4)                      |
| Video captions   | Not required by portal, included for accessibility                                 | ✅ `pitch-video-captions.srt`                                                               |

## 4. Confirmation Checklist (after upload)

- [ ] Screenshot of the successful submission confirmation
- [ ] Confirmation email/PDF saved to `submission-package/`
- [ ] Video link publicly verified (incognito browser, no sign-in)
- [ ] Proposal file verified ≤ 10 MB on the portal
