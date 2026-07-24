# GIHA: Demo Recording Guide

**Pitch format:** Screen recording with voiceover — 3 minutes (±5s)
**Recording tools:** OBS Studio (free) + any microphone
**Resolution:** 1920×1080 or 1366×768
**Frame rate:** 30fps

---

## Shot-by-Shot Schedule

### [00:00–00:15] Hook
| Element | What to do |
|---------|------------|
| SFX | Play phone buzz sound effect (can be added in post) |
| Screen | Dark screen. Text fades in: *"Grandma, it's me — I need bail money, please don't tell Mom."* (This is a text overlay, can be done in OBS or post) |
| Audio | Voiceover reads the hook text. Pause after "she has no way to know the difference." |
| Action | None — this is a static shot |

### [00:15–00:45] The Problem
| Element | What to do |
|---------|------------|
| Screen | Title screen of GIHA. Click "New Game" to enter Strategy Mode. Then rapidly show: deepfake detection tool (frame stepper), audio spectrogram, evidence board. Each for ~3 seconds |
| Audio | Read the problem text. End on: "The problem isn't that people are stupid. The problem is that the ecosystem is designed for maximum viral spread — not maximum coherence." |
| Action | **Capture:** Launch game → Strategy Mode loads → quickly switch between a few tools then settle on the city view |

### [00:45–01:30] The Solution
| Element | What to do |
|---------|------------|
| Screen | **Split screen visual:** Strategy Mode city grid on left, Detective Mode evidence board on right. For strategy: zoom to HUD showing R₀ and σ. Click an intervention (Fact-Check Bureau). Show the R₀ trend graph dipping. For detective: apply spectrogram to an audio evidence item. Show the spectrogram visualization with AI artifact zone highlighted |
| Audio | Explain the two modes. Focus on: player manages city health → case breaks → zoom into evidence → use tools → return to strategy |
| Action | **Capture:** Strategy Mode → deploy an intervention → wait for effect → navigate to Case 1 → Detective Mode loads → apply spectrogram + frame stepper + metadata inspector → show finding results |
| Tips | Set speed to 2× or 5× during strategy to see R₀ move faster. Keep the intervention palette visible |

### [01:30–02:15] The Math Behind It
| Element | What to do |
|---------|------------|
| Screen | No game interaction. Show overlay graphics: sigma gauge (semi-circular), R₀ trend graph with threshold lines, phase indicator showing "Outbreak" or "Crisis" with pulse animation |
| Audio | Explain the σ-model. Emphasize R₀ = 1.0 threshold. Mention the σ-trap. Keep this section concise |
| Action | **Capture:** If possible, let the simulation run until R₀ crosses 1.0 or a phase transition occurs. The HUD's phase change animation (calm → outbreak) is a good visual |

### [02:15–02:50] Why This Matters
| Element | What to do |
|---------|------------|
| Screen | Victory or Game Over screen. Alternatively: navigation to a case, showing the connection lines on the evidence board. Or: game running at strategy mode with budget, sigma, and case progress displayed |
| Audio | Read the global relevance text. Emphasize: web app, no install, works on any browser, costs nothing |
| Action | **Capture:** Endgame screen or mid-game strategy view. Show the URL in the browser bar |

### [02:50–03:00] Call to Action
| Element | What to do |
|---------|------------|
| Screen | GIHA logo on dark background. Text: "Play Your Part." UNESCO Youth Hackathon 2026 logo |
| Audio | "Disinformation leaves a trace. GIHA teaches you to follow it. Play your part." |
| Action | **Capture:** Static title card (can be done entirely in post-production) |

---

## Technical Setup

1. **Open the game** at sigmatrace.io (or local dev server: `npm run dev`)
2. **Set browser window** to 1366×768 or larger
3. **Start OBS** with:
   - Source: Browser tab (select the GIHA tab) — OR Window Capture (select browser window)
   - Audio: Desktop audio (for game sound effects? not needed) + Mic (for voiceover)
   - Resolution: 1920×1080 (or native display resolution)
   - FPS: 30
4. **Pre-load the game**: Start at Title Screen, navigate through all screens to ensure assets are cached
5. **Record the game audio**: Enable browser tab audio in OBS (for intervention SFX, victory theme, etc.)

## Voiceover Tips
- Speak slightly slower than your natural pace — 180 seconds is longer than it feels
- Pause between sections (use the video editor to remove dead air)
- Record voiceover AFTER the screen capture, so you can match the timing exactly
- If using the screen capture as the actual delivery, allow 2-3 seconds per section transition

## Pitch Script Reference
The full timecoded script is at `docs/04-pitch-script.md`.
