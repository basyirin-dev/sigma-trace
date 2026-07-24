# Asset Provenance

Non-code asset inventory for GIHA, documenting origin, license, and attribution.
Per CC3 provenance tracking policy (`docs/phases/CC3_provenance_tracking.md`).

## Audio Assets

See `docs/asset-registry.md` for complete audio inventory:
- 3 music tracks (CC0, public domain)
- 6 game SFX (CC0, public domain)
- 3 case evidence audio files (1 CC0, 2 team recordings)
- 2 reference audio packs (Noah Kuehne CC BY 4.0, PixelLoops royalty-free)

## Pixel Art Assets

See `public/assets/README.md` for complete pixel-art pack inventory:
- **Pixel Art Top Down - Basic v1.2.3** (Cainos, itch.io) — actively used for grass + stone tiles. License: free/commercial use OK, no redistribution, credit not required
- **BoldPixels Font** (YukiPixels, CC BY-SA 4.0) — actively used for all UI typography
- **Mini World Sprites** (lnsanity.itch.io) — collected, not used
- **Industrial Tileset** (Atomic Realm / P.A.R-T) — collected, not used
- **Pixel Crawler - Free Pack** (Anokolisa) — collected, not used
- **32rogues** (Seth Boyles, 2024) — collected, not used
- **Complete UI Essential Pack** (Crusenho Agus Hennihuno, CC BY 4.0) — collected, not used
- **Dungeon Tileset II** (0x72) — collected, not used

## Logo

| Asset | File | Creator | License |
|-------|------|---------|---------|
| GIHA Logo (SVG) | `public/assets/logo/GIHA-Logo.svg` | External designer | Project-owned |
| GIHA Logo (JPEG) | `public/assets/logo/GIHA-Logo.jpeg` | External designer | Project-owned |
| Favicon | `public/favicon.svg` | Derived from logo | Project-owned |

**Note:** The logo renders in purple (#863bff). The stationery palette (navy #2C3E50 + gold #F39C12) is used for in-game documents, not the GIHA brand logo itself.

## Case Evidence Media

| Case | Asset | File | Source | License |
|------|-------|------|--------|---------|
| Case 1 | Deepfake video | `public/cases/case-01/evidence/deepfake-video.mp4` | CC0 footage + team editing | Public domain |
| Case 1 | Reference photo | `public/cases/case-01/evidence/reference-photo.jpg` | CC0 stock image | Public domain |
| Case 1 | Spectrogram audio | `public/cases/case-01/evidence/spectrogram-audio.wav` | CC0 sample | Public domain |
| Case 2 | Scammer profile | `public/cases/case-02/evidence/scammer-profile.jpg` | CC0 stock image | Public domain |
| Case 2 | Cloned voicemail | `public/cases/case-02/evidence/voicemail-cloned.wav` | Team recording (M2, 2026-07-15) | Original work |
| Case 2 | Voiceprint data | `public/cases/case-02/evidence/voiceprint-data.wav` | Team recording | Original work |
| Case 3 | Protest photo | `public/cases/case-03/evidence/protest-photo.jpg` | CC0 stock image | Public domain |
| Case 3 | Lighting analysis | `public/cases/case-03/evidence/lighting-analysis.png` | Team-created (processed) | Original work |

## Font

| Asset | File(s) | Creator | License | Notes |
|-------|---------|---------|---------|-------|
| BoldPixels | `public/assets/fonts/BoldPixels.woff2`, `.woff` | YukiPixels (yukipixels.itch.io) | CC BY-SA 4.0 | Pixel font used for all UI typography |

## Asset Integrity

No automated integrity checking (`scripts/check-asset-integrity.sh`) is implemented. All assets are manually tracked in this document and the referenced sub-documents. SHA-256 hashes are not computed — the project uses a lightweight manual verification process appropriate for its scope.

For the submission build, run:
- `npm run build` — verifies all imports resolve and the build completes
- Manual review of `dist/` to confirm all expected files are present
