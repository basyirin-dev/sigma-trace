import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'
import './styles/variables.css'
import './styles/animations.css'
import './styles/pixel-theme.css'
import { initDevTools } from './shared/devTools'

initDevTools()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
