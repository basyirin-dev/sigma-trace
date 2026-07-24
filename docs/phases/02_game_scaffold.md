# Phase 2: Game Scaffold

**Duration:** 5 days
**Member:** M2 (Security/Dev)
**Dependencies:** Phase 0.5
**Output:** React app with routing, shared components, Zustand store, Canvas2D pixel scene

## Tasks

### 2.1 Router Setup
- Install react-router-dom v7
- Define routes:
  - `/` → title screen (Start / About / Credits)
  - `/strategy` → StrategyMode (main city simulation)
  - `/detective/:caseId` → DetectiveMode (specific case)
  - `/transition` → Mode transition animation screen
- Lazy-load strategy and detective routes for code splitting
- **Test:** Navigate between all routes, verify lazy loading

### 2.2 Zustand Store (Base)
- Create `src/shared/stores/` directory with atomic store per concern (`gameStore.ts`, `useSimulationStore.ts`, etc.)
- Initialize with default state values (calm city, no active case)
- Implement actions (initially as stubs): `deployIntervention`, `startCase`, `useTool`, `submitVerdict`, `switchMode`, `reset`
- **Test:** Store initializes with correct defaults, actions dispatch without errors

### 2.3 Shared Component Library
- `HUD.tsx`: top bar showing σ score, R₀ value, budget, phase indicator. Props interface defined.
- `Modal.tsx`: generic overlay with title, content, close button. Supports lightbox and confirmation variants.
- `Button.tsx`: primary, secondary, danger, ghost variants. Loading state. Tooltip support.
- `Tooltip.tsx`: hover-activated info popup. Position-aware (doesn't overflow viewport).
- All components accept `className` prop for styling flexibility. All use CSS Modules.
- **Test:** Each component renders in storybook-style manual verification

### 2.4 Canvas2D Strategy Scene
- Create `CityCanvas.tsx`: wrapper component with:
  - Canvas ref + requestAnimationFrame game loop
  - 50×50 tile grid (20px tiles, 1000×1000 canvas)
  - Image-rendering: pixelated CSS
  - Responsive layout within strategy viewport
- Wire render loop: grid → heatmap → agents → HUD overlay
- **Test:** Canvas renders tile grid at 60fps on Chrome, distict colors visible

### 2.5 Title Screen
- GIHA logo (SVG, animated entrance)
- Start button → navigates to `/strategy`
- About button → modal with project description
- Credits button → modal with team info + asset licenses
- Background: animated Canvas2D pixel particles
- **Test:** Title screen is visually complete, all buttons navigate/work

### 2.6 Mode Transition Animation
- Create `TransitionScreen.tsx`: shown when switching between strategy and detective modes
- Content: newspaper headline announcing the case (strategy → detective) or case outcome (detective → strategy)
- Animation: 2.5s fade-in hold 1s fade-out, auto-proceeds to target route
- **Test:** Transition triggers correctly in both directions

### 2.7 Global Styles
- Implement CSS variables from style guide (colors, typography, spacing)
- Global reset + base typography
- Animation keyframes: fadeIn, slideUp, pulse, shake
- **Test:** All pages use consistent styling

### 2.8 Error Boundary
- Wrap each route in React error boundary
- Fallback: "Something went wrong. [Reload] / [Report]" with screenshot of error state
- Log error details to console
- **Test:** Intentionally throw error, verify boundary catches and displays fallback

## Acceptance Criteria
- [x] Router works with lazy loading (check Network tab for separate chunks)
- [x] Zustand store initializes correctly
- [x] All shared components render correctly in isolation
- [x] Canvas2D scene displays 50×50 colored tile grid at 60fps
- [x] Title screen complete with logo and working navigation
- [x] Transition animation plays in both directions
- [x] Global styles applied consistently
- [x] Error boundary catches and displays fallback
- [x] Total bundle size < 200kB (measured with `npx vite-bundle-visualizer`)
