# Cross-Cutting 2: Documentation Standards

**Owner:** M1
**Applies to:** All phases

## Principle
- Documents explain WHY, not HOW. Code explains HOW.
- Each document should be readable standalone (within reason).
- Documents are written during the phase, not after.

## Required Documents

### Per-Phase Documents (auto-generated from this plan)
- Each phase folder in `docs/phases/` serves as the phase document
- Update the phase doc as decisions change during implementation
- At phase completion: mark acceptance criteria as [x] or add notes

### Architecture Reference
- `docs/02-technical-architecture.md` — living document, update when architecture changes
- Key sections to keep current: data flow diagram, directory structure, simulation math, tool API

### API Contract (if applicable)
- Tools must document their interface even if no external API
- See Tool interface in `src/detective/tools/types.ts` — update contract if interface changes

## Code Documentation

### JSDoc Required For
- All exported functions
- All tool classes
- Zustand store actions
- Simulation functions
- React component props (TypeScript interface is sufficient)

### JSDoc Format
```typescript
/**
 * Description of what this does (not how).
 * @param {Type} paramName - description
 * @returns {Type} description
 */
```

### Inline Comments
- Only for non-obvious code (e.g., mathematical formulas, workaround for browser bug)
- Do NOT comment obvious code (`// increment counter`)
- Do NOT comment TypeScript types (the type system IS the documentation)

## Asset Documentation
- All evidence assets in `public/cases/*/evidence/` must have a companion `.md` file:
  - Source: where the asset came from (e.g., "Recorded with phone camera, then processed through DeepFaceLab")
  - License: CC0 / original / used with permission
  - Notes: any processing steps taken
- Example: `bail-call-real.mp3.md`:
  ```markdown
  # bail-call-real.mp3
  Source: Recorded by M2 using Phone voice recorder, 2026-07-15
  License: Original work, all rights granted to UNESCO for hackathon
  Notes: Recorded in quiet room, normalized to -3dB peak
  ```

## Changelog
- `CHANGELOG.md` in project root
- Format:
  ```markdown
  # Changelog
  ## [Unreleased]
  ### Added
  - Feature X
  ### Fixed
  - Bug Y
  ### Changed
  - Behavior Z
  ```
- Update on each phase completion

## README
- Project root README.md updated at Phase 12
- Sections: Description, How to Run, How to Play, Tech Stack, Credits, UNESCO Context, License

## Document Review Process
- Before marking phase complete: M2 reviews M1's documents, M1 reviews M2's code
- Goal: catch misconceptions early, not to correct grammar
- Reviewer checks: "Does this match what we discussed? Is anything missing?"

## Template for New Documents
```markdown
# Title

**Status:** Draft / Final
**Author:** M1/M2
**Last Updated:** YYYY-MM-DD

## Purpose
One-sentence description.

## Content
...
```
