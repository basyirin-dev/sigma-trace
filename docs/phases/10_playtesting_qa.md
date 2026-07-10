# Phase 10: Playtesting & QA

**Duration:** 3 days
**Members:** M1+M2 + external playtesters
**Dependencies:** Phase 9 (polish)
**Output:** Bug-free, balanced, playable game

## Tasks

### 10.1 Internal Playtest (M1+M2)
- Each person plays full game twice (different decisions)
- Document all bugs, confusing UI, unclear instructions
- Time each session (target: 12–18 min for complete playthrough)
- Note emotional response: exciting moments, frustrating moments
- **Output:** Bug list + experience report

### 10.2 External Playtest Round 1 (3 testers)
- Recruit 3 non-team members who haven't seen the game
- Observe silently (or screen record with permission)
- Tasks: play through without any instructions from team
- Document:
  - Where did they get stuck?
  - What did they misinterpret?
  - What was their favorite/least favorite part?
  - Did the MIL lessons come through clearly?
- **Output:** Tester feedback document

### 10.3 Priority Bug Fixes
- Fix all blockers (game crashes, broken flows, wrong scoring)
- Fix all high-priority issues (confusing UI, unclear instructions, misaligned elements)
- Triage medium/low priority: fix if time permits, document known issues
- Re-test all fixes
- **Output:** Changelog

### 10.4 Balance Pass Based on Feedback
- Adjust intervention costs/effects if strategy mode feels too easy/hard
- Adjust evidence discoverability if players consistently miss key clues
- Adjust scoring thresholds if grades feel unfair
- Adjust time pressure (cutscene speeds, evidence count)
- Re-test after each balance change
- **Output:** Final balance parameters

### 10.5 External Playtest Round 2 (3 testers)
- Same process as Round 1, but with fixed + balanced version
- Verify previous issues are resolved
- Check new issues haven't been introduced
- **Output:** Tester feedback document (should be cleaner than Round 1)

### 10.6 Final Bug Fixing Sprint
- Fix all remaining issues from Round 2
- If time is short: focus on correctness (scoring, game logic) over aesthetics
- Create known-issues list for any unfixed minor bugs
- **Output:** Release candidate build

### 10.7 Performance Profiling
- Profile with Chrome DevTools:
  - Identify memory leaks (heap snapshots before/after mode transitions)
  - Identify render bottlenecks (Three.js draw calls, React re-renders)
  - Fix top 3 performance issues
- Test on mid-range device (integrated GPU, 8GB RAM)
  - Target: consistent 30fps
  - If below target: reduce particle count, simplify building geometry, lower render resolution
- **Output:** Performance report

### 10.8 Accessibility Check
- Keyboard navigation: Tab through all interactive elements
- Screen reader: basic NVDA/VoiceOver check
- Color contrast: verify all text meets WCAG AA (4.5:1 ratio)
- Test with Windows high-contrast mode enabled
- **Output:** Accessibility compliance report

## Acceptance Criteria
- [ ] Zero blockers or crash-level bugs
- [ ] All high-priority issues fixed
- [ ] Strategy mode feels balanced (player can win with smart play)
- [ ] Detective mode puzzles are solvable without hints
- [ ] Full playthrough target: 12–18 minutes
- [ ] External testers report clear MIL lessons
- [ ] Performance: 30fps on integrated GPU
- [ ] Accessibility: keyboard navigable, WCAG AA contrast
- [ ] Known-issues list documented for any unfixed bugs
