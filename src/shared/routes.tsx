import { TitleScreen } from '../screens/TitleScreen'
import { TransitionScreen } from '../screens/TransitionScreen'
import { VictoryScreen } from '../screens/VictoryScreen'
import { GameOverScreen } from '../screens/GameOverScreen'
import { LoadingScreen } from '../screens/LoadingScreen'
import { NotFound } from '../screens/NotFound'
import { ErrorFallback } from './ErrorFallback'
import type { RouteObject } from 'react-router-dom'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <TitleScreen />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/victory',
    element: <VictoryScreen />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/gameover',
    element: <GameOverScreen />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/strategy',
    errorElement: <ErrorFallback />,
    hydrateFallbackElement: <LoadingScreen onComplete={() => {}} />,
    lazy: async () => {
      const { StrategyMode } = await import('../strategy/StrategyMode')
      return { Component: StrategyMode }
    },
  },
  {
    path: '/detective/:caseId',
    errorElement: <ErrorFallback />,
    hydrateFallbackElement: <LoadingScreen onComplete={() => {}} />,
    lazy: async () => {
      const { DetectiveMode } = await import('../detective/DetectiveMode')
      return { Component: DetectiveMode }
    },
  },
  {
    path: '/transition',
    element: <TransitionScreen />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '*',
    element: <NotFound />,
    errorElement: <ErrorFallback />,
  },
]
