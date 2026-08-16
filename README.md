# GIHA: The Game

[![CI](https://github.com/basyirin-dev/sigma-trace/actions/workflows/ci.yml/badge.svg)](https://github.com/basyirin-dev/sigma-trace/actions/workflows/ci.yml)
[![Deploy](https://img.shields.io/badge/deploy-netlify-00C7B7?logo=netlify)](https://sigma-trace.netlify.app)

Two-mode MIL (Media & Information Literacy) education game for the UNESCO Youth Hackathon 2026.  
Players alternate between **Strategy Mode** (city-scale simulation with Canvas2D pixel art) and **Detective Mode** (forensic analysis of fabricated evidence).

**Live demo:** [sigma-trace.netlify.app](https://sigma-trace.netlify.app)

---

## UNESCO Youth Hackathon 2026

Built for the **UNESCO Youth Hackathon 2026** — _"Youth Designing the Future of MIL"_ —
by a two-person youth team (an AI researcher and a cybersecurity engineer).

- **Category:** Games & Interactive
- **Theme fit:** Strategy Mode teaches systems thinking about how disinformation
  spreads (R₀, σ-coherence, interventions); Detective Mode teaches hands-on
  verification skills (spectrogram, frame stepping, metadata, source tracing).
- **Team:** two-person youth team — Basyirin Amsyar bin Basri and Muhamad Na'im Naqiuddin Bin Mohd Saiful Hazmi.
- **Submission:** see [`docs/output/submission-form-contents.md`](docs/output/submission-form-contents.md)
  and the `v1.0.0-submission` release tag.

---

## Installation

### Prerequisites

- **Node.js 20+** ([download](https://nodejs.org/))
- **npm 10+** (ships with Node.js)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/basyirin-dev/sigma-trace.git
cd sigma-trace

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# The dev server runs at http://localhost:5173
```

### Available Scripts

| Command              | Action                                  |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Start development server (Vite)         |
| `npm run build`      | Type-check + build for production       |
| `npm run preview`    | Preview production build locally        |
| `npm run lint`       | Run ESLint on all source files          |
| `npm run typecheck`  | Run TypeScript strict type checks       |
| `npm test`           | Run Vitest unit tests (697+ tests)      |
| `npm run test:e2e`   | Run Playwright E2E tests (6 test cases) |
| `npm run test:watch` | Run tests in watch mode                 |
| `npm run format`     | Format code with Prettier               |

### Dev Mode

Append `?dev` to the URL to enable developer console:

```
http://localhost:5173/?dev
```

Press **Ctrl+Shift+D** for the debug overlay panel.  
Open the browser console (F12) and use `window.__GIHA_DEV__` API for game state manipulation.

### E2E Tests

```bash
npx playwright install chromium
npm run test:e2e
```

---

## Quick Start (Play the Game)

1. Run `npm run dev`
2. Open `http://localhost:5173`
3. Click **"New Game"** on the title screen
4. Deploy interventions in Strategy Mode to keep σ ≥ 70 and R₀ < 1.2
5. Complete all 3 detective cases (each takes 3-5 minutes)
6. Win: σ ≥ 70, R₀ < 1.2, 3 cases, 30 stable ticks

**Full playtest guide:** [`docs/playtest-guide.md`](docs/playtest-guide.md)

---

## Project Structure

```
sigma-trace/
├── src/
│   ├── engine/          # ODE solver, S/E/I/R model, phase classifier, sigma-trap
│   ├── strategy/        # City simulation (Canvas2D), interventions, timeline
│   │   └── renderers/   # Canvas2D render pipeline (grid, agents, heatmap, particles, rings, gauge, R0 trend)
│   ├── detective/       # Detective mode — case viewer, evidence board, tools
│   │   └── tools/       # 6 forensic tools (Spectrogram, FrameStepper, etc.)
│   ├── shared/          # UI components (HUD, Modal, Button, Toast), Zustand stores
│   │   └── stores/      # gameStore, simulationStore, warningStore, audioStore, etc.
│   ├── screens/         # Title, Loading, Transition, Victory, GameOver
│   └── styles/          # CSS variables, pixel theme, animations
├── public/
│   ├── audio/           # Music (3 tracks) + SFX (6 files)
│   ├── assets/          # Pixel art packs, fonts, logo
│   └── cases/           # 3 detective cases (JSON scripts + evidence media)
├── docs/                # GDD, architecture, playtest guide, asset registry
├── e2e/                 # Playwright E2E tests
└── .github/workflows/   # CI pipeline (lint → typecheck → test → build → e2e)
```

---

## Tech Stack

| Layer              | Technology                        |
| ------------------ | --------------------------------- |
| Build              | Vite 8                            |
| UI                 | React 19                          |
| State              | Zustand                           |
| Strategy rendering | Canvas2D (pixel art)              |
| Language           | TypeScript 6 (strict)             |
| Test               | Vitest + Playwright + v8 coverage |
| CI                 | GitHub Actions                    |
| Hosting            | Netlify (static SPA)              |

---

## License

MIT — see [`LICENSE`](LICENSE).  
Third-party assets have separate licenses — see [`ASSETS.md`](ASSETS.md) and [`public/assets/README.md`](public/assets/README.md).
