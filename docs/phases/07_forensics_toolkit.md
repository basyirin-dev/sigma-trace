# Phase 7: Forensics Toolkit

**Duration:** 3 days
**Members:** M1+M2
**Dependencies:** Phase 5 (detective framework)
**Output:** All 6 forensics tools functional and polished

## Tasks

### 7.1 Tool API Refinement
- Define strict Tool interface in `src/detective/tools/types.ts`:
  - `id`, `name`, `icon`, `description`, `eligibility: (evidence: Evidence) => boolean`
  - `apply: (evidence: Evidence, caseData: Case) => ToolResult`
  - `ToolResult`: `{ findings: string[], confidence: number, evidenceId: string, timestamp: number }`
- Implement abstract `BaseTool` class with shared validation
- **Test:** All 6 tools implement interface correctly

### 7.2 Spectrogram Analyzer
- `SpectrogramAnalyzer.ts`:
  - Renders spectrogram visualization of audio evidence using Canvas API
  - Real audio: show irregular frequency distribution
  - AI audio: show unnaturally uniform frequency bands
  - Highlight suspicious regions with red overlay
  - Playback-synced — cursor moves along spectrogram as audio plays
- **Test:** Real vs. AI audio produce visually distinct spectrograms

### 7.3 Frame Stepper
- `FrameStepper.ts`:
  - Video player with frame-by-frame controls (`<` and `>` buttons)
  - Current frame number display
  - Highlight button: toggles edge-detection overlay on current frame
  - Deepfake detection: look for inconsistent edge artifacts around mouth/eyes (visual overlay marks high anomaly regions)
- **Test:** Step through deepfake video — find the frame with lip-sync glitch

### 7.4 Metadata Inspector
- `MetadataInspector.ts`:
  - Parse EXIF data from images (using exif-js or similar)
  - Display formatted output: Camera, Date, GPS, Software, Edit History
  - Highlight suspicious entries: "⚠️ Software: Adobe Photoshop 2026"
  - Show file hash and compare against known-origin database
- **Test:** Normal photo shows clean metadata, manipulated photo shows edit history

### 7.5 Source Tracer
- `SourceTracer.ts`:
  - Visual graph showing information propagation path
  - Nodes: source accounts, shares, screenshots
  - Edges: shared from, screenshot of, reposted
  - Root-source detection: highlight earliest known appearance
  - Clean path: single source → screenshot → repost
  - Suspicious path: multiple origin accounts, impossible sharing speed
- **Test:** Clean vs. suspicious propagation graphs look different

### 7.6 Inconsistency Highlighter
- `InconsistencyHighlighter.ts`:
  - Load image onto Canvas
  - Run Canny edge detection or simple gradient analysis
  - Overlay heatmap: red zones where gradient direction mismatches neighbors (compositing artifacts)
  - Highlight regions with inconsistent lighting direction
  - Manual comparison mode: split screen, side-by-side with reference image
- **Test:** Composite photo shows red patches at seam boundaries

### 7.7 Timeline Cross-Referencer
- `TimelineCrossReferencer.ts`:
  - Scrollable timeline of all events in the case
  - Evidence items placed at their claimed timestamps
  - Conflicts highlighted: "⚠️ Evidence A timestamp conflicts with Evidence B"
  - Cross-reference mode: select two evidence items → show timestamp delta analysis
  - Visual: color-coded zones (confirmed, conflicting, unverified)
- **Test:** Case 1 timeline shows red conflict between video claim time and metadata time

### 7.8 Tool Result Modal
- `ToolResultModal.tsx`:
  - Modal slide-up from bottom (mobile-friendly)
  - Animated score bar: "Confidence: 78%"
  - Finding cards: each finding is a card with icon + text
  - "Add to Evidence Board" button: places finding as new evidence card
  - "Re-examine" button: reopens the tool on same evidence
- **Test:** Tool result generates correct finding cards, adding to board works

### 7.9 Tutorial Overlay for Tools
- First time each tool is opened: overlay explaining what to look for
- "Did you know" tip: e.g., "AI-generated voices often have uniform frequency distribution because they lack natural vocal variation"
- Dismiss permanently with "Got it" button
- Replayable from help menu
- **Test:** Tutorial shows once per tool, never again after dismiss

## Acceptance Criteria
- [ ] All 6 tools produce correct, game-relevant results on their target evidence
- [ ] Spectrogram visually distinguishes real vs. AI audio
- [ ] Frame stepper finds deepfake artifacts
- [ ] Metadata inspector flags suspicious edits
- [ ] Source tracer shows propagation graph
- [ ] Inconsistency highlighter marks composite seams
- [ ] Timeline cross-referencer detects timestamp conflicts
- [ ] Tool result modal correctly adds findings to board
- [ ] Tutorial overlay shows once per tool
- [ ] Performance: all tools respond within 500ms on mid-range device
