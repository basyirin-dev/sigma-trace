# Phase 12: Submission Package

**Duration:** 2 days
**Members:** M1+M2
**Dependencies:** Phase 11 (proposal + video)
**Output:** Complete UNESCO submission ready for upload

## Tasks

### 12.1 Final Build & Asset Audit (M1)
- `npm run build` → production build
- Verify all assets included:
  - Images in `public/cases/*/evidence/` — all present
  - Audio in `public/audio/` — all present
  - Video in `public/cases/*/evidence/` — all present
- Check bundle size: target < 5MB (excluding evidence media)
- If > 10MB, compress images (WebP), reduce audio bitrate (128kbps)
- **Output:** Pass/fail audit checklist

### 12.2 Submission Form Preparation (M1)
- Access UNESCO Youth Hackathon 2026 submission portal (after July 6)
- Pre-fill all fields in a local document:
  - Team name: [TBD]
  - Team members: [TBD] — AI Researcher, Cybersecurity Developer
  - Project title: σ-Trace
  - Category: [Choose relevant track]
  - Description (100 words): concise summary
  - How it addresses the theme (200 words): link each mechanic to MIL
  - Technical implementation (100 words): React, Three.js, static site
  - Target audience: youth aged 14–24
- **Output:** `submission-form-contents.md`

### 12.3 Submission Asset Packaging (M2)
- Create `submission-package/` directory:
  - `sigma-trace-unesco-proposal.pdf`
  - `pitch-video-final.mp4`
  - `pitch-video-captions.srt`
  - `sigma-trace-game.zip` (production build — `npm run build` output)
  - `README.txt`: instructions for judges — how to run the game locally
  - `source-code.zip` (optional, if required)
- Compress to ZIP: `sigma-trace-submission-2026.zip`
- Verify ZIP opens correctly on another machine
- **Output:** `sigma-trace-submission-2026.zip`

### 12.4 Submission Upload (M1)
- Submit via UNESCO portal
- Take screenshots of submission confirmation
- Save confirmation email/PDF
- Note: submission deadline August 16, 2026 (we aim for July 28)
- **Output:** Confirmation screenshot

### 12.5 Open-Source Release (M1)
- Push final code to public GitHub repository
- Add README with:
  - Game description
  - How to run locally (`npm install && npm run dev`)
  - UNESCO Youth Hackathon context
  - License: MIT
- Add `.env.example` if needed (likely none — no secrets)
- Tag release: `v1.0.0-submission`
- **Output:** GitHub release

### 12.6 Project Retrospective (M1+M2)
- Write ~500-word retrospective:
  - What went well?
  - What was harder than expected?
  - What would we do differently?
  - Key lessons learned for next project
- Publish as blog post or on GitHub Discussions
- **Output:** `RETROSPECTIVE.md`

### 12.7 Backup & Preservation (M2)
- Backup all project files to external drive + cloud storage
- Include: source code, assets, documents, proposal, video, raw footage
- Ensure all team members have access
- **Output:** Backup verification

## Acceptance Criteria
- [ ] Production build is error-free and under 10MB
- [ ] All submission assets packaged and verified
- [ ] Submission form pre-filled and ready
- [ ] Successful upload to UNESCO portal
- [ ] Confirmation saved
- [ ] Public GitHub repository with README and MIT license
- [ ] Retrospective written
- [ ] All project files backed up
