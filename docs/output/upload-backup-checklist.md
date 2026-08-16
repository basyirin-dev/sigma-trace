# Phase 12.4 + 12.7 — Upload & Backup Checklist

**Owner:** Manual steps for the GIHA team (portal upload requires the UNESCO
account; backup requires the external drive / cloud credentials).
**Deadline:** August 16, 2026 (target: July 28).

---

## 12.4 — Submission Upload

### Step 1: Host the video pitch (public link)

The UNESCO portal does NOT accept a video file — it requires a publicly
accessible link that reviewers can view **directly, without requesting
permission, signing in, or downloading**.

1. Upload `submission-package/pitch-video-final.mp4` (26 MB) to YouTube
   (recommended — plays in-browser, no sign-in) or a Drive/Dropbox public link.
2. Set visibility to **Public** (not unlisted — reviewers must not need a link
   from us; the portal will display it to unknown reviewers).
3. If using YouTube, optionally attach `submission-package/pitch-video-captions.srt`
   as the caption track (accessibility).
4. **Verify:** open the link in an incognito window, on a different network,
   and confirm it plays without any prompt. Paste the URL into
   `docs/output/submission-form-contents.md` (Video pitch row).

### Step 2: Fill the portal

Use `docs/output/submission-form-contents.md` as the source — all fields are
pre-filled (team GIHA Team, category Games & Interactive, title, description,
theme, technical summary, audience 14–24). Complete the two placeholders
before submitting:

- [ ] Member 2 name (team needs 2–6 named members)
- [ ] Video pitch public URL

### Step 3: Upload materials

- [ ] Attach `submission-package/giha-unesco-proposal.pdf` (1.1 MB — portal cap
      is 10 MB, verified OK)
- [ ] Paste the video link
- [ ] Optionally link the repo: https://github.com/basyirin-dev/sigma-trace
      and live demo: https://sigma-trace.netlify.app

### Step 4: Save confirmation

- [ ] Screenshot the successful-submission confirmation page
- [ ] Save the confirmation email / generated PDF
- [ ] Store both in `submission-package/` (and cloud backup)

---

## 12.7 — Backup & Preservation

### What to back up (from the repo root and workspace)

| Item                       | Location                                           |
| -------------------------- | -------------------------------------------------- |
| Source code                | `sigma-trace/` (repo, tag `v1.0.0-submission`)     |
| Submission package         | `submission-package/` + `giha-submission-2026.zip` |
| Proposal + submission docs | `docs/output/` (proposal, audit, form contents)    |
| Pitch video (final)        | `submission-package/pitch-video-final.mp4`         |
| **Raw footage**            | `IMG_0274.mov` (132 MB — NOT in git; only local)   |
| All assets                 | `public/` (audio, sprite packs, case media)        |

### Steps

1. [ ] Copy the above to an **external drive** (whole `UYH2026/` workspace is fine)
2. [ ] Upload the same set to **cloud storage** (Google Drive / Dropbox /
       OneDrive) — note the raw video is 132 MB
3. [ ] Confirm both copies are readable (open the zip, play the video,
       `git clone` a fresh copy of the repo)
4. [ ] Ensure all team members have access to the cloud copy
5. [ ] Record the backup date + locations in `docs/output/audit-checklist.md`

---

## Acceptance mapping

- [x] Production build error-free, bundle < 10 MB — audit-checklist.md (PASS, 530 kB)
- [x] All submission assets packaged + verified — `giha-submission-2026.zip` (integrity OK)
- [x] Submission form pre-filled — `submission-form-contents.md`
- [ ] Successful upload to UNESCO portal — **this checklist, Step 2–4**
- [ ] Confirmation saved — **this checklist, Step 4**
- [x] Public GitHub repo + README + MIT — repo pushed; **visibility switch pending
      gh auth** (see plan_step_16 handoff)
- [x] Retrospective written — `RETROSPECTIVE.md`
- [ ] All project files backed up — **this checklist, 12.7**
