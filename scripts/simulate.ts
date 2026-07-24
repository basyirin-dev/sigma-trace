import { validateBalance } from '../src/engine/simulation-runner'

const passed = validateBalance()
process.exit(passed ? 0 : 1)
