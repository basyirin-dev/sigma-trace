# GIHA: Agency Stationery Style Guide

## 7.1 Brand Identity

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **GIHA Navy** | #2C3E50 | Document headers, borders (in-game documents only) |
| **GIHA Gold** | #F39C12 | Accent color, highlights, interactive elements |
| **Alert Orange** | #E67E22 | Warning states, high priority items |
| **Danger Red** | #E74C3C | Critical alerts, high R₀ indicators |
| **Success Green** | #2ECC71 | Positive states, healthy σ values |
| **Neutral Gray** | #7F8C8D | Secondary text, borders, disabled states |
| **Background Dark** | #1A1A2E | Dark mode backgrounds |
| **Background Light** | #ECF0F1 | Light mode backgrounds |
| **White** | #FFFFFF | Document backgrounds, text on dark |

**Logo note:** The production GIHA logo SVG (`public/assets/logo/GIHA-Logo.svg`) uses purple (#863bff). The stationery palette above applies to in-game documents and case files, not the GIHA brand logo itself.

### Typography

| Typeface | Weight | Usage |
|----------|--------|-------|
| **BoldPixels** | Regular (equivalent to 400) | Body text, UI labels, all code/data |
| **BoldPixels** | Bold (equivalent to 700) | Headings, emphasis, data values |

> **Note:** The Phase 0.5 design lock specified Inter + JetBrains Mono. Phase 9 polish finalized **BoldPixels** as the single production font for all UI. See `src/styles/variables.css` for the active `@font-face` definition. The BoldPixels font (CC BY-SA 4.0) is by YukiPixels (yukipixels.itch.io).

### Font Sizes

| Element | Size | Weight |
|---------|------|--------|
| **Document title** | 24px | Bold |
| **Section heading** | 18px | SemiBold |
| **Subheading** | 14px | SemiBold |
| **Body text** | 14px | Regular |
| **Caption/metadata** | 12px | Regular |
| **Data values** | 16px | Mono SemiBold |

---

## 7.2 Document Templates

### Case File Header

```
┌─────────────────────────────────────────────────────────────┐
│ [GIHA Logo]                                                 │
│                                                             │
│ GLOBAL INFORMATION HEALTH AGENCY                            │
│ ─────────────────────────────────────────────────────────── │
│ CASE FILE: [CASE-ID]                    CLASSIFICATION: [X] │
│                                                             │
│ SUBJECT: [Case Name]                                        │
│ LOCATION: Veritas, [District]                               │
│ DATE: [Timestamp]                                           │
│ INVESTIGATOR: [Agent ID]                                    │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│                                                     CONFIDENTIAL
└─────────────────────────────────────────────────────────────┘
```

### Evidence Document Style

| Element | Specification |
|---------|---------------|
| **Background** | White (#FFFFFF) with subtle watermark |
| **Header bar** | GIHA Navy (#2C3E50), 4px height |
| **Title** | Inter Bold, 16px, GIHA Navy |
| **Body** | Inter Regular, 14px, #333333 |
| **Metadata** | JetBrains Mono, 12px, #7F8C8D |
| **Border** | 1px solid #ECF0F1 |
| **Padding** | 16px all sides |
| **Corner radius** | 4px |

### Intelligence Brief Style

| Element | Specification |
|---------|---------------|
| **Paper** | White background |
| **Top rule** | 2px GIHA Navy |
| **Bottom rule** | 1px GIHA Gold |
| **Logo** | Top-left, 40px height |
| **"CONFIDENTIAL"** | Top-right, JetBrains Mono, 10px, #E74C3C, rotated -5° |
| **Title** | Inter Bold, 20px, GIHA Navy |
| **Date/Case ID** | Inter Regular, 12px, #7F8C8D |
| **Body** | Inter Regular, 14px, #333333, 1.6 line-height |

---

## 7.3 UI Component Styles

### Intervention Card

```
┌────────────────────────────────┐
│ [Icon]                         │
│                                │
│ INTERVENTION NAME              │
│ ────────────────────────────── │
│ Cost: [XX]  │  Cooldown: [XXs] │
│                                │
│ Effect description text here   │
│                                │
│ [DEPLOY]                       │
└────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Width** | 220px |
| **Background** | #FFFFFF |
| **Border** | 1px solid #ECF0F1 |
| **Border-left** | 4px solid [status color] |
| **Hover** | Border-color darkens, subtle shadow |
| **Active** | Gold glow (#F39C12 at 20% opacity) |
| **Disabled** | 50% opacity, cursor not-allowed |

### Evidence Card

```
┌────────────────────────────────┐
│ [Type Badge]        [Timestamp]│
│                                │
│ Evidence Title                 │
│ ────────────────────────────── │
│                                │
│ [Preview area]                 │
│                                │
│ Source: [Source]               │
│ District: [District]           │
└────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Width** | 180px |
| **Height** | 240px |
| **Background** | #FFFFFF |
| **Border** | 1px solid #ECF0F1 |
| **Border-top** | 4px solid [type color] |
| **Type badge** | Pill shape, type color background, white text |
| **Draggable** | Yes (evidence board) |

### Tool Button

| State | Appearance |
|-------|------------|
| **Default** | GIHA Navy background, white icon, gold border |
| **Hover** | Gold background, navy icon |
| **Active** | Gold glow, depressed state |
| **Disabled** | 40% opacity, gray background |
| **Cooldown** | Circular progress indicator overlay |

---

## 7.4 HUD Elements

### Top Bar (Strategy Mode)

```
┌─────────────────────────────────────────────────────────────┐
│ [GIHA Logo] σ: [78] │ R₀: [0.6] │ Budget: [500] │ ⏱ [12:34] │
└─────────────────────────────────────────────────────────────┘
```

| Element | Style |
|---------|-------|
| **Background** | GIHA Navy, 90% opacity |
| **Height** | 48px |
| **σ value** | Color-coded (green/yellow/red) |
| **R₀ value** | Color-coded, pulsing when > 1.5 |
| **Budget** | Gold text |
| **Timer** | JetBrains Mono, white |

### Top Bar (Detective Mode)

```
┌─────────────────────────────────────────────────────────────┐
│ [Back] [GIHA Badge] Case: [ID] │ Tools: [X/Y] │ ⏱ [04:23] │
└─────────────────────────────────────────────────────────────┘
```

| Element | Style |
|---------|-------|
| **Background** | GIHA Navy, 90% opacity |
| **Height** | 48px |
| **Case ID** | Inter SemiBold, white |
| **Tool count** | JetBrains Mono, gold |
| **Timer** | JetBrains Mono, white |

### District Health Indicators

| Health Level | Color | Animation |
|--------------|-------|-----------|
| **Healthy** (σ > 60) | Green (#2ECC71) | Solid |
| **Warning** (σ 30-60) | Orange (#E67E22) | Subtle pulse |
| **Critical** (σ < 30) | Red (#E74C3C) | Strong pulse |
| **Collapsed** (σ < 20) | Gray (#7F8C8D) | Desaturated, static |

---

## 7.5 Logo Usage Rules

### Clear Space

- Minimum clear space around logo: 1x logo height on all sides
- Never place logo on busy backgrounds without contrast enhancement

### Minimum Size

- Minimum display size: 24px height (digital), 10mm height (print)
- Below minimum, use text-only "GIHA" mark

### Color Variations

| Context | Logo Version |
|---------|--------------|
| **Dark background** | Full color (navy + gold) |
| **Light background** | Full color (navy + gold) |
| **Monochrome required** | White version on navy, navy version on white |
| **Watermark** | Navy at 10% opacity |

### Logo Don'ts

- Don't stretch or distort
- Don't rotate (except -5° "CONFIDENTIAL" watermark)
- Don't add drop shadows or effects
- Don't place on low-contrast backgrounds
- Don't crop the shield shape

---

## 7.6 Animation Guidelines

### Timing

| Animation | Duration | Easing |
|-----------|----------|--------|
| **Card hover** | 150ms | ease-out |
| **Card drag** | 200ms | ease-in-out |
| **State change** | 300ms | ease-in-out |
| **Alert pulse** | 1000ms | ease-in-out (infinite) |
| **Page transition** | 400ms | ease-in-out |

### Motion Principles

- **Subtle:** Animations should guide attention, not distract
- **Purposeful:** Every animation communicates a state change
- **Consistent:** Same interaction = same animation
- **Accessible:** Respect `prefers-reduced-motion`

---

## 7.7 Accessibility

### Color Contrast

| Combination | Ratio | WCAG Level |
|-------------|-------|------------|
| Navy on White | 12.5:1 | AAA |
| Gold on Navy | 7.2:1 | AAA |
| White on Navy | 12.5:1 | AAA |
| Gray on White | 4.6:1 | AA |

### Focus States

- Visible focus ring: 2px solid #F39C12, 2px offset
- High contrast mode: 3px solid #000000

### Screen Reader Support

- All interactive elements have aria-labels
- Color is never the sole indicator of state
- Alternative text for all visual elements

---

## 7.8 Implementation Notes

- CSS variables for all brand colors: `--giha-navy`, `--giha-gold`, etc.
- Font loading: Inter + JetBrains Mono via Google Fonts
- SVG logo: Delivered — see `public/assets/logo/GIHA-Logo.svg` (purple #863bff)
- Dark/light mode: Toggle in settings, respects system preference
- Responsive: Mobile-first, breakpoints at 768px and 1024px
