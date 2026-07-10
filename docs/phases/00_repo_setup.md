# Phase 0: Repo & Toolchain Setup

**Duration:** 2 days
**Members:** M1+M2
**Dependencies:** None
**Output:** Working dev environment, CI passing, directory scaffolded

## Tasks

### 0.1 Initialize Monorepo
- Create Vite + React + TypeScript project: `npm create vite@latest sigma-trace -- --template react-ts`
- Install dependencies: @react-three/fiber, @react-three/drei, three, zustand, react-router-dom
- Install dev dependencies: vitest, @playwright/test, eslint, prettier, husky, lint-staged
- Configure TypeScript: strict mode, path aliases (`@engine/*`, `@strategy/*`, `@detective/*`, `@shared/*`)
- Configure Vite: static asset handling for case files, base URL for deployment
- **M1:** Scaffold configs (tsconfig, vite.config, eslint, prettier)
- **M2:** Install and verify Three.js renders a test scene

### 0.2 Directory Structure
- Create all directories per `02-technical-architecture.md`
- Add placeholder files in each directory with typed module exports
- **M1:** src/engine/, src/strategy/
- **M2:** src/detective/, src/shared/, public/cases/

### 0.3 CI Pipeline
- GitHub Actions workflow: lint → type-check → test → build
- Add status badge to README
- **M1:** Write workflow YAML
- **M2:** Verify build passes

### 0.4 Pre-commit Hooks
- Configure husky + lint-staged
- Runs: eslint, prettier, tsc --noEmit
- **M1+M2:** Test with intentional error, verify hook blocks commit

### 0.5 Test Infrastructure
- Configure vitest with coverage reporter
- Write placeholder test: "engine types compile correctly"
- Write placeholder test: "app renders without crashing"
- **M1:** vitest config + engine test
- **M2:** React test setup + app render test

### 0.6 Deployment Preview
- Connect to Netlify (or Vercel) via GitHub
- Configure build command: `npm run build`
- Configure publish directory: `dist/`
- Verify deploy produces a live URL
- **M1:** Netlify account + project setup
- **M2:** Push trigger + verify deploy

### 0.7 Opencode MCP/LSP/Plugin Setup
- Create `opencode.json` at project root with:
  - `name: "sigma-trace"`, team metadata, UNESCO hackathon context
  - MCP server: `codebase-memory-mcp` with `"autoIndex": true`, `"mode": "moderate"`
  - LSP: TypeScript enabled, strict mode, path alias resolution (`@engine/*`, `@strategy/*`, `@detective/*`, `@shared/*`)
  - Custom commands: `"dev": "npm run dev"`, `"test": "npx vitest run"`, `"lint": "npm run lint"`, `"build": "npm run build"`
  - Agent instructions path: `".opencode/instructions.md"`
- Create `.opencode/instructions.md` with:
  - Project: σ-Trace, two-mode game for UNESCO Youth Hackathon 2026
  - Tech stack: React, Three.js, Zustand, Vite, TypeScript
  - Team: M1 (AI/Research — ODE, strategy, Σ-Model), M2 (Security/Dev — scaffold, detective, tools)
  - Phase tracking header: "**Currently in Phase:** [0–12]" — update after each phase completion
  - Reference: `docs/01-game-design-document.md` (North Star), `docs/03-build-roadmap.md` (dependencies + schedule)
- Index repo in codebase-memory-mcp: `opencode run codebase-memory-mcp_index_repository`
- **M1:** Write opencode.json + instructions
- **M2:** Verify `search_graph` returns project symbols, TypeScript LSP provides completions

## Acceptance Criteria
- [ ] `npm run dev` starts development server
- [ ] `npm run build` produces static site in `dist/`
- [ ] `npm test` runs vitest with coverage
- [ ] `npm run lint` passes with zero errors
- [ ] GitHub Actions passes all checks on push
- [ ] Netlify deploy produces live URL
- [ ] Three.js test scene renders colored cube
- [ ] opencode.json validates (no syntax errors)
- [ ] TypeScript LSP resolves `@engine/*` path aliases
- [ ] codebase-memory-mcp responds to search queries on this project
