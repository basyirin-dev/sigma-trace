# Phase 9: Polish, Animation & Sound

**Duration:** 4 days
**Members:** M1+M2
**Dependencies:** Phase 8 (mode integration)
**Output:** Polished, audiovisually complete game

## Tasks

### 9.1 Color Palette & Typography Finalization
- Finalize CSS custom properties in `styles/variables.css`:
  - Primary (deep blue): #1A237E
  - Secondary (teal): #00897B
  - Accent (amber): #FFB300
  - Danger (red): #E53935
  - Success (green): #43A047
  - Surface dark: #1E1E2E
  - Surface light: #F5F5F5
  - Text primary: #E0E0E0 (dark bg) / #212121 (light bg)
- Typography: Inter (UI), JetBrains Mono (code/data), Playfair Display (narrative)
- **Test:** All UI components use CSS variables, no hardcoded colors

### 9.2 Canvas2D Visual Polish
- Add ambient pixel particles floating over city grid (subtle, 50 particles)
- Tile emissive glow when district R₀ spikes ("outbreak glow" — orange pixel overlay)
- Smooth tile color transitions (Lerp-based, 500ms interpolation)
- District pulse animation when R₀ > 1.0 (slow opacity pulse every 2s)
- **Test:** All visual effects maintain 30fps on integrated GPU

### 9.3 UI Animations
- Page transitions: slide + fade (300ms ease-in-out)
- Evidence card flip: CSS 3D transform (600ms)
- Modal open: scale up from center + backdrop fade (200ms)
- Toast notifications: slide in from top, auto-dismiss with slide out
- Score numbers: animated counter (count up from 0 to final value)
- **Test:** All animations smooth at 60fps

### 9.4 Sound Design
- **M2:** Source/CC0-license background music:
  - Title screen: contemplative piano (30s loop)
  - Strategy mode: electronic ambient with subtle tension layer (60s loop)
  - Detective mode: subtle investigative hum (45s loop)
- **M2:** Source/record sound effects:
  - Button hover/click: soft UI pop
  - Intervention deploy: orchestral hit
  - Evidence found: metallic chime
  - Tool result: data processing sound
  - Victory: triumphant crescendo
  - Game over: low drone fade
- **M1:** Implement `useAudioManager.ts` hook:
  - Preload all audio on title screen
  - Context-aware volume (strategy music dims on toast/popup)
  - Fade transitions between tracks (1s crossfade)
  - Mute toggle in settings
- **Test:** Audio plays correctly, transitions are smooth, no audible loops

### 9.5 Loading Screen
- `LoadingScreen.tsx`:
  - Animated σ logo (pulsing)
  - Progress bar (asset loading progress)
  - Tip rotation: "Did you know? The σ in GIHA's sigma model stands for sigma — a measure of societal coherence in information ecosystems."
  - Minimum display time: 2s (even if assets load fast)
- **Test:** Loading screen shows during asset load, transitions to title screen

### 9.6 Title Screen
- `TitleScreen.tsx`:
  - Animated background: Canvas2D scene with floating pixel city silhouette
  - GIHA logo with animated σ symbol
  - "A Two-Mode Game for Media & Information Literacy"
  - Buttons: "New Game", "How to Play" (instructions overlay), "About" (UNESCO context)
  - Σ-Model credit: "Inspired by the Σ-Model — a dynamical systems theory of information ecosystems"
- **Test:** All title screen elements render, buttons navigate correctly

### 9.7 Settings Panel
- `SettingsPanel.tsx`:
  - Music volume slider
  - SFX volume slider
  - Mute toggle
  - FPS display toggle
  - Fullscreen toggle
  - Reset progress button (with confirmation)
- Accessible from HUD gear icon
- **Test:** All settings persist changes in localStorage

### 9.8 Responsive Layout Audit
- Test at: 1920×1080 (desktop), 1366×768 (laptop), 1024×768 (tablet)
- Verify:
  - HUD elements don't overlap at any dimension
  - Evidence board scrollable on smaller screens
  - Intervention palette collapses to icon-only strip at < 1024px
  - Toolbelt wraps to 2 rows at < 768px
- **Test:** Passes visual inspection at all 3 resolutions

## Acceptance Criteria
- [ ] All color/typography variables finalized and applied consistently
- [ ] Canvas2D visual effects (particles, glow, smooth transitions) render at 30fps+
- [ ] UI animations smooth at 60fps
- [ ] Background music + SFX play correctly with crossfade
- [ ] Loading screen with progress bar
- [ ] Title screen with animated city silhouette
- [ ] Settings panel with persistable preferences
- [ ] Responsive layout at 1920×1080, 1366×768, 1024×768
- [ ] Accessible: all interactive elements keyboard-navigable
