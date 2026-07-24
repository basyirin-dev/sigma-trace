import { useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { LoadingScreen } from './screens/LoadingScreen'
import { ErrorBoundary } from './shared/ErrorBoundary'
import { DebugOverlay } from './shared/DebugOverlay'
import { MonologueOverlay } from './shared/MonologueOverlay'

function SkipLink() {
  return (
    <a
      href="#main-content"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 0,
        zIndex: 99999,
        padding: '8px 16px',
        background: '#FFB300',
        color: '#000',
        fontFamily: 'monospace',
        fontSize: 14,
        textDecoration: 'none',
      }}
      onFocus={(e) => { e.currentTarget.style.left = '8px' }}
      onBlur={(e) => { e.currentTarget.style.left = '-9999px' }}
    >
      Skip to main content
    </a>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  if (!loaded) {
    return (
      <ErrorBoundary>
        <LoadingScreen onComplete={() => setLoaded(true)} />
      </ErrorBoundary>
    )
  }
  return (
    <ErrorBoundary>
      <SkipLink />
      <RouterProvider router={router} />
      <DebugOverlay />
      <MonologueOverlay />
    </ErrorBoundary>
  )
}
