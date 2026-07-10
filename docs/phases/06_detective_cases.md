# Phase 6: Detective Cases

**Duration:** 5 days
**Members:** M1+M2
**Dependencies:** Phase 5 (detective framework)
**Output:** 3 complete, playable, polished cases

## Tasks

### 6.1 Case Data Files (All 3)
- Create `public/cases/case-01/`, `case-02/`, `case-03/` with:
  - `script.json`: all dialogue, narration, tooltips, debrief text
  - `metadata.json`: evidence definitions, solution, connections, findings, scoring
  - `evidence/`: all video, audio, image, text assets
- **M1:** Write scripts + metadata, **M2:** Source/create evidence assets

### 6.2 Case 1 "The Viral Mayor" (M1+M2)
- **M1 M2:** Video clip creation: record 15s clip of person speaking, then create deepfake variant (using free/demo AI tool or manual editing). Export both as MP4.
  - Real clip: "I am working hard for this city every day"
  - Deepfake: "I resign effective immediately"
- **M2:** Build video player with frame-stepper integration
- **M1:** Write spectrogram puzzle — deepfake audio has missing high frequencies
- **M2:** Create "source trace" data — tracking earliest appearance of video
- **M1:** Write intro cutscene: "Breaking news — the mayor's video just went viral"
- **M2:** Wire all evidence, tools, and scoring for this case
- **Test:** Full playthrough of Case 1 from intro to debrief

### 6.3 Case 2 "Grandma's Distress Call" (M1+M2)
- **M2:** Record two voice clips: real human voice + AI-cloned variant (using ElevenLabs or similar, ensure free tier usage)
- **M1:** Build spectrogram analyzer — real voice has natural frequency variation, AI voice has uniform frequencies
- **M2:** Create phone number spoofing puzzle — trace the call origin
- **M1:** Write call transcript evidence with inconsistencies
- **M2:** Create "call timeline" visualization showing impossible call routing
- **M1:** Write intro cutscene: "Elderly residents are receiving calls from family members asking for bail money"
- **M2:** Wire all evidence, tools, and scoring
- **Test:** Full playthrough of Case 2

### 6.4 Case 3 "The Front Page" (M1+M2)
- **M2:** Create two photos using free stock photos or original photography:
  - Real photo: a protest scene in a specific location (note lighting, shadows, building details)
  - Manipulated photo: same protest scene but with added violence elements from another photo
- **M1:** Build inconsistency highlighter — detects mismatched lighting angles, compressed vs. original quality zones
- **M2:** Build geolocation puzzle — the building in the photo doesn't exist in Veritas
- **M1:** Create metadata evidence — EXIF data shows original creation date doesn't match claimed date
- **M2:** Wire all evidence, tools, and scoring
- **Test:** Full playthrough of Case 3

### 6.5 Case Narrative Polish
- **M1:** Review all dialogue for tone consistency (professional but accessible)
- **M1:** Ensure MIL lessons are clear and actionable
- **M2:** Review timing of cutscene text (not too fast, not too slow)
- **M2:** Ensure debrief is satisfying
- **Test:** Read all narrative text aloud — sound natural?

### 6.6 Red Herring Audit
- **M1+M2:** Review each case's red herring evidence:
  - Is it plausible enough to be believed?
  - Is it signposted subtly enough to be distinguishable from real clues?
  - Does it teach a useful secondary MIL lesson?
- Adjust as needed

### 6.7 Case Balance Pass
- **M1+M2:** Play through all 3 cases sequentially (as a player would)
- Verify difficulty progression: Case 1 easiest, Case 2 medium, Case 3 hardest
- Adjust evidence discoverability, tool hint strength, time pressure
- **Test:** Non-expert player can solve Case 1 in under 5 minutes

## Acceptance Criteria
- [ ] Case 1 complete: video, spectrogram puzzle, source trace, 5+ evidence items
- [ ] Case 2 complete: audio clips, spectrogram puzzle, call trace, 5+ evidence items
- [ ] Case 3 complete: photo pair, inconsistency puzzle, geolocation, 5+ evidence items
- [ ] All 3 cases have intro cutscenes, evidence boards, working tools, verdict, debrief
- [ ] Difficulty ramps from case 1 → case 3
- [ ] All MIL lessons are explicit and actionable
- [ ] Red herrings present but fair
- [ ] Total evidence count across all 3 cases: ≥ 18 items
