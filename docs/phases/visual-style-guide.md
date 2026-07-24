# GIHA Visual Style Guide — Pixel Art

## 1. Color System

### 1.1 Background Tones

| Token | Hex | Usage |
|-------|:---:|-------|
| `--color-bg` | `#1E1E2E` | Page background, canvas frame |
| `--color-surface` | `#2A2A3E` | Card backgrounds, HUD panels |
| `--color-surface-alt` | `#16213E` | Input backgrounds, hover states |

### 1.2 District Tile Colors

| Token | Hex | District |
|-------|:---:|----------|
| — | `#8B4513` | Foundry (rust/terracotta) |
| — | `#2C7A7B` | Harborview (teal) |
| — | `#B8860B` | Uptown (gold) |
| — | `#4A7C59` | Campus (forest green) |

### 1.3 Heatmap Overlay

| Token | Hex | Opacity | σ Range |
|-------|:---:|:-------:|:-------:|
| — | `#2ECC71` | 10% | 80–100 |
| — | `#A8E063` | 20% | 60–79 |
| — | `#F1C40F` | 35% | 40–59 |
| — | `#E67E22` | 55% | 20–39 |
| — | `#E74C3C` | 80% | 0–19 |

### 1.4 UI Colors

| Token | Hex | Usage |
|-------|:---:|-------|
| `--color-primary` | `#1A237E` | Primary brand, deep navy |
| `--color-secondary` | `#00897B` | Interactive elements, selected borders, buttons |
| `--color-danger` | `#E53935` | Delete, critical alerts |
| `--color-warning` | `#FB8C00` | Warnings, caution |
| `--color-text` | `#E0E0E0` | Primary text |
| `--color-text-muted` | `#9E9E9E` | Secondary text, labels, timestamps |

### 1.5 Phase Status Colors

| Token | Hex | Phase | Animation |
|-------|:---:|-------|-----------|
| `--color-phase-calm` | `#43A047` | Calm | None |
| `--color-phase-outbreak` | `#FFB300` | Outbreak | None |
| `--color-phase-crisis` | `#FB8C00` | Crisis | `pulse-alert` (2s) |
| `--color-phase-trap` | `#E53935` | Trap | `pulse-trap` (1s) |

### 1.6 Evidence Type Badges

| Token | Hex | Evidence Type |
|-------|:---:|---------------|
| `--color-evidence-video` | `#E53935` | Video clips |
| `--color-evidence-audio` | `#FFB300` | Audio clips |
| `--color-evidence-image` | `#43A047` | Images |
| `--color-evidence-text` | `#1E88E5` | Text |
| `--color-evidence-metadata` | `#8E24AA` | Metadata |

### 1.7 In-Game Document Palette (Stationery)

GIHA case files, evidence documents, and intelligence briefs use a separate brand palette defined in the agency stationery guide (`docs/story-bible/07-stationery-style.md`):

| Color | Hex | Usage |
|-------|:---:|-------|
| GIHA Navy | `#2C3E50` | Document headers |
| GIHA Gold | `#F39C12` | Document accents |
| Alert Orange | `#E67E22` | Document warnings |
| Danger Red | `#E74C3C` | Critical findings |
| Success Green | `#2ECC71` | Verified findings |
| Background Light | `#ECF0F1` | Document page bg |

This is intentional — the player's HUD and the evidence they analyze have distinct visual identities. The UI palette (above) is for game chrome; the stationery palette is for in-game narrative documents.

## 2. Typography

### 2.1 Font Families

| Token | Font | Usage |
|-------|------|-------|
| `--pixel-font` | **BoldPixels** (custom pixel font) | All UI text: headings, buttons, descriptions (defined in `src/styles/variables.css`) |
| `--pixel-font-mono` | **BoldPixels** (custom pixel font, monospace variant) | Data: σ/R₀ values, timestamps, evidence IDs |

### 2.2 Type Scale

| Token | Size | Weight | Usage |
|-------|:----:|:------:|-------|
| `--text-display` | 28px | 700 | Phase labels, score grades, big numbers |
| `--text-heading` | 20px | 600 | Panel titles, section headers |
| `--text-body` | 14px | 400 | Descriptions, evidence text, tool names |
| `--text-caption` | 12px | 400 | Cooldown counters, hint text, timestamps |
| `--text-mono` | 13px | 400 | σ/R₀ values, tick count, budget display |
| `--text-mono-sm` | 10px | 500 | Evidence type badges, metadata labels |

### 2.3 Text Transform

- All buttons: `uppercase` with `letter-spacing: 1px`
- All phase labels: `uppercase` with `letter-spacing: 1px`
- All evidence type badges: `uppercase` with `letter-spacing: 0.5px`
- All HUD labels: `uppercase` with `letter-spacing: 1px`
- Body text: normal case

## 3. Pixel Border System

| Class | Width | Color | Usage |
|-------|:----:|-------|-------|
| `.pixel-border` | 2px | `#333` | Default card border |
| `.pixel-card--selected` | 2px | `#4ECDC4` | Selected card |
| `.pixel-card--danger` | 2px | `#FF6B6B` | Critical card |
| Canvas frame | 2px | `#333` | Strategy mode canvas border |

- All borders use `border-radius: 0` (sharp pixel corners)
- No box shadows (keeps pixel-art flat look)
- Active button state: `translate(1px, 1px)` for subtle press effect

## 4. Pixel Spacing Scale

| Token | Size | Usage |
|-------|:----:|-------|
| — | 4px | Inner padding for badges |
| — | 8px | Dense padding (HUD items, small cards) |
| — | 12px | Standard card padding |
| — | 16px | Button side padding, HUD group gaps |
| — | 24px | Section spacing |
| — | 32px | Page margins |

## 5. Component Specs

### 5.1 Pixel Button

| State | Background | Border | Text |
|-------|:----------:|:------:|:----:|
| Default | Transparent | `#4ECDC4` | `#4ECDC4` |
| Hover | `#4ECDC4` | `#4ECDC4` | `#1A1A2E` |
| Active | `#4ECDC4` | `#4ECDC4` | `#1A1A2E` (translate 1,1) |
| Disabled | Transparent | `#555` | `#555` |
| Danger (default) | Transparent | `#FF6B6B` | `#FF6B6B` |
| Danger (hover) | `#FF6B6B` | `#FF6B6B` | `#1A1A2E` |

### 5.2 Pixel Card

- Background: `#16213E` (surface)
- Border: `2px solid #333`
- Padding: 12px
- Selected state: border color → `#4ECDC4`
- No border-radius (sharp corners)

### 5.3 Pixel Input

- Background: `#0F3460` (surface-alt)
- Border: `2px solid #333`
- Padding: 8px 12px
- Font: JetBrains Mono, 13px
- Focus state: border → `#4ECDC4`

### 5.4 Phase Indicator

- Layout: inline-flex with icon + label
- Font: JetBrains Mono, 12px, uppercase, letter-spacing 1px
- Border: `2px solid currentColor`
- Colors per phase status (Section 1.5)
- Crisis and Trap states have pulse animations

### 5.5 HUD Bar

- Layout: horizontal flex, gap 16px
- Background: `rgba(22, 33, 62, 0.9)` (semi-transparent surface)
- Border: `2px solid #333`
- Value font: 18px, 700 weight
- Label font: 10px, uppercase, letter-spacing 1px, muted color

### 5.6 Pixel Gauge

- Container: 120px × 8px, border `2px solid #333`, bg `#0F3460`
- Fill: full height, transition `width 0.3s ease, background-color 0.3s ease`
- Fill color transitions with value (green → yellow → red)

## 6. Canvas2D Rendering Specs

### 6.1 Tile Grid

- Resolution: 50 × 50 tiles
- Tile size: 20px × 20px
- Canvas size: 1000px × 1000px
- CSS: `image-rendering: pixelated`
- Frame border: `2px solid #333`, `border-radius: 4px`

### 6.2 District Tiles

- Each tile filled with district base color
- 1px darker border at district boundaries (`#1A1A2E`)
- Base colors per Section 1.2

### 6.3 Pixel Agents

- Shape: circle (2px radius)
- Drop shadow: 1px offset black
- Count: 80 agents distributed across 4 districts
- Colors per state:
  - S (susceptible): `#2ECC71` (green)
  - E (exposed): `#F1C40F` (yellow)
  - I (infected): `#E74C3C` (red)
  - R (resistant): `#3498DB` (blue)
- Rendering order: Y-sorted (bottom-most drawn last)

### 6.4 Heatmap Overlay

- Semi-transparent `fillRect` per district
- Opacity proportional to σ severity (Section 1.3)
- Applied after tile colors, before agents
- `globalAlpha` reset to 1 after each district

## 7. Animations

### 7.1 CSS Keyframes

```css
/* σ-trap: urgent red pulse, 1s cycle */
@keyframes pulse-trap { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

/* R₀ crisis: warning orange pulse, 2s cycle */
@keyframes pulse-alert { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

/* Phase transition: smooth fade-in */
@keyframes phase-fade { from { opacity: 0; } to { opacity: 1; } }
```

### 7.2 Canvas Animations

- Phase transitions: 500ms interpolation on heatmap opacity
- Agent movement: smooth per-frame interpolation (no discrete jumps)
- σ gauge: 300ms color transition when σ changes

## 8. Usage Guidelines

1. **All UI elements use pixel-perfect borders** — no border-radius, no box-shadow
2. **Text is never anti-aliased** — Inter and JetBrains Mono render cleanly at UI sizes
3. **Canvas elements use `image-rendering: pixelated`** — no blurring on pixel art
4. **HUD overlays are semi-transparent** — city must be visible beneath HUD text
5. **Evidence type badges use currentColor** — text color from badge class, not hardcoded
6. **Phase animations convey urgency** — calm and outbreak don't animate; crisis and trap do
7. **Accessibility:** minimum 4.5:1 contrast ratio for all text/background combinations

## 9. References

- `src/styles/variables.css` — all CSS custom property definitions
- `src/styles/pixel-theme.css` — all pixel CSS classes and animations
- `src/styles/global.css` — base reset and body styles
- `docs/phases/visual-style-guide.html` — interactive mockup with live CSS
