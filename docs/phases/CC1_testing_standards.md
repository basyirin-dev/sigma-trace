# Cross-Cutting 1: Testing Standards

**Owner:** M2
**Applies to:** All phases (P1–P12)

## Philosophy
- Tests exist to catch regressions, not to prove correctness
- Prioritize integration tests over unit tests (game is stateful)
- Canvas2D rendering: visual tests use snapshot comparison (not pixel-perfect)

## Test Pyramid

### Unit Tests (Vitest)
- Pure functions only: ODE solver, scoring engine, intervention math, case state machine
- No mocking of Canvas2D or React
- **Coverage target:** 90%+ for utility functions
- **Files:** `src/**/*.test.ts`
- **Command:** `npx vitest run`

### Component Tests (React Testing Library)
- UI components with props-only logic: InterventionCard, EvidenceCard, VerdictPanel, ToolResultModal, LoadingScreen, TitleScreen
- Verify render states (available/disabled, open/closed)
- No tests for drag-and-drop, canvas rendering, or audio
- **Coverage target:** 80% for listed components
- **Files:** `src/**/*.test.tsx`
- **Command:** `npx vitest run`

### Integration Tests (Playwright)
- Critical user flows:
  1. Title screen → New Game → Strategy mode loads
  2. Strategy → deploy intervention → R₀ changes
  3. Strategy → R₀ > 1.5 → Case 1 unlocks → Detective mode loads
  4. Detective → find evidence → use tool → score → return to strategy
  5. Full victory path (strategy win + all 3 cases solved)
- **Target:** 3 E2E tests covering flows 1, 4, 5
- **Files:** `e2e/*.spec.ts`
- **Command:** `npx playwright test`

### Performance Tests
- Canvas2D render loop: assert < 33ms frame time (30fps) with 80 agents
- Zustand store: assert < 1ms per state update (1000 sequential ticks)
- Evidence board: assert < 100ms for 20 evidence cards re-render
- **Tool:** Custom `performance.now()` assertions in vitest

## CI Pipeline
- On push to main:
  1. `npm run lint` (ESLint + Prettier)
  2. `npx vitest run` (unit + component tests)
  3. `npx playwright test` (E2E, only if vitest passes)
  4. `npm run build` (Vite production build)
- Pipeline must complete in < 5 minutes
- **Config:** `.github/workflows/ci.yml`

## Acceptance Criteria per Phase
- Phase 1: ODE solver unit tests (all edge cases: σ-trap, R₀ = 0, negative params)
- Phase 2: Scaffold renders without crash (component test)
- Phase 3: City grid renders correct colors (component test, snapshot mock)
- Phase 4: Intervention deploy updates store correctly (unit test)
- Phase 5: Case state machine transitions (unit test), VerdictPanel render states (component)
- Phase 6: All 3 cases load without schema validation errors (integration)
- Phase 7: Each tool returns correct result type (unit test)
- Phase 8: Full strategy→detective→strategy loop (Playwright E2E)
- Phase 9: Loading screen → title screen transition (component test)
- Phase 10: Final E2E regression pass (Playwright)
- Phase 11-12: No new tests (proposal/video phase)
