# GIHA — Project Retrospective

**Team:** GIHA Team (2 members: AI Researcher + Cybersecurity Developer)
**Project:** GIHA — two-mode MIL education game, UNESCO Youth Hackathon 2026
**Build window:** July 9 – August 16, 2026 (6 weeks, compressed from 7 due to a 3-day late start)
**Status:** Submitted (v1.0.0-submission)

---

## What went well

- **Scope discipline.** Locking the design in Phase 0.5 and keeping two tightly
  scoped modes (strategy simulation + detective forensics) meant we shipped a
  complete, playable game instead of a demo of many half-finished ideas.
- **The math-first engine.** Building the ODE engine (S/E/I/R, R₀, σ-coherence,
  σ-trap) before the UI meant every strategy mechanic was grounded in real
  dynamics. The σ-trap emergent failure state became the game's best teaching
  moment — and we didn't plan it; the model produced it.
- **Strict engineering from day one.** Strict TypeScript (no `any`), linted,
  tested. 693 unit tests passing at submission meant we could polish screens
  fearlessly in the final week — the refactors were cheap because the safety
  net was real.
- **Asset discipline.** No paid assets, no server, no accounts. A ~530 kB JS/CSS
  bundle and a fully offline-capable static site made the "accessible to anyone
  with a browser" claim literally true, and the audit was trivial to pass.
- **The handoff between modes.** The strategy→detective feedback loop (solve
  cases to heal the city, heal the city to unlock harder cases) is the feature
  reviewers remember. It came from the design lock, and it held.

## What was harder than expected

- **The video.** Recording a clean 3-minute pitch with voiceover, matching the
  timestamped script, took far longer than writing the game's pitch document.
  We ended up re-shooting after the first take didn't match the script's
  screen cues. Packaging (132 MB QuickTime → 26 MB H.264) and generating
  captions from script timestamps were the last-mile chores nobody budgets for.
- **GitHub's 100 MB file limit.** Audio packs and the video kept bumping into
  it. We learned to gitignore large media and ship them in the release zip
  instead — earlier than this would have saved a couple of cleanup commits.
- **Playtest availability.** External playtesters are scarce; we leaned on
  internal testing. The difficulty tuning (win at σ ≥ 70, R₀ < 1.2 across
  30 stable ticks) is plausible but not externally validated.
- **Submission logistics.** The UNESCO portal's requirements (public video
  link, ≤10 MB proposal, 2–6 member team info) forced rework of how we
  packaged the video — hosting + link, not a file upload.

## What we'd do differently

- Start the pitch video in week 3, not week 7 — and record the screen
  capture with captions in mind (cleaner scene boundaries).
- Do one external playtest session in week 4 instead of waiting for the
  QA phase; tuning feedback would have arrived while the engine was still
  cheap to change.
- Verify the gh/GitHub token situation before release day — an invalid
  `GITHUB_TOKEN` blocked release creation at the worst moment.

## Key lessons

1. A strong mathematical core generates emergent gameplay you couldn't design
   by hand — and it makes the educational claims verifiable.
2. Strict typing + tests is not overhead; it's what lets a 2-person team
   compress a 7-week plan into 6 weeks.
3. Last-mile deliverables (video, packaging, submission forms, backups) are
   real project work — schedule them like features.
4. "No server, no data, no cost" is a genuinely differentiating constraint
   for an education game; it shaped every architecture decision for the better.

---

_Written as part of Phase 12 (Submission Package). Publishable as a blog post
or GitHub Discussions thread._
