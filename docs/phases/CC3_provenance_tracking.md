# Cross-Cutting 3: Provenance & Asset Tracking

**Owner:** M2
**Applies to:** All phases, especially P6 (assets) and P11 (video)

## Principle
- Every non-code asset in the project must have a documented, verifiable origin.
- Judges and evaluators must be able to see exactly what was created vs. sourced.
- This protects against accidental license violations and strengthens credibility.

## Asset Categories

| Category | Examples | License Required | Source Tracking |
|---|---|---|---|
| Original gameplay footage | Recorded OBS captures | None (our work) | `assets/source/footage/` |
| Original audio recordings | Voice clips for Case 2 | None (our work) | Recorded by team member |
| Original photography | Photos for Case 3 | None (our work) | Shot by team member |
| CC0/Public Domain assets | Background music, UI sounds | CC0 or Public Domain | URL + downloaded file hash |
| AI-generated content | Deepfake video, AI voice clone | Per-platform terms | Tool name + version + prompt |
| Free-tier tool outputs | ElevenLabs voices | Per-platform terms | Account email + date |
| Modified assets | Cropped/colored CC0 images | Original license | Original source + modification log |

## Asset Tracking System

### For Each Asset
Create an entry in `docs/asset-registry.md`:

```markdown
## ASSET-001: mayor-resign-deepfake.mp4
- **Type:** Video (deepfake)
- **Created by:** M2
- **Source material:** mayor-resign-real.mp4 (original, recorded by M1)
- **Tool:** DeepFaceLab 2.0 (free version)
- **Processing:** Face-swap with source actor, 200 epochs, output at 720p
- **License:** Original work derived from original recording
- **Location:** `public/cases/case-01/evidence/mayor-resign-deepfake.mp4`
- **Integrity:** SHA-256: a1b2c3d4...
```

### Automated Integrity Checking
- Script: `scripts/check-asset-integrity.sh`
- For each asset in registry, verify SHA-256 matches
- Run before each release build
- **Command:** `npm run verify-assets`

## Attribution File
- `ASSETS.md` in project root:
  - List every external asset with author, license, and URL
  - Template:
    ```markdown
    ## Music
    - "Ambient Investigation" by SoundArtist (CC0) — https://example.com/ambient
    ## Sound Effects
    - "UI Click Soft" by FXDesigner (CC0) — https://example.com/ui-click
    ```
- Do NOT include original/team-created assets (they are self-attributed)

## For UNESCO Submission
- Judges may ask: "Where did this video come from?"
- Be prepared to answer: "We recorded the original with a phone camera, then used DeepFaceLab (free research tier) to create the deepfake variant for educational purposes."
- Include a brief "Asset Ethics Statement" in the proposal appendix:
  - All AI-generated content is clearly labeled as such in-game
  - No real persons depicted without consent
  - All deepfakes are clearly fictional and educational

## Deletion Policy
- Delete any asset where provenance is uncertain
- If a free-trial asset's license is ambiguous, replace with original work
- Final check before submission: run `npm run verify-assets` — zero failures required
