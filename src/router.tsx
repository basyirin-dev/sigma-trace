import { createBrowserRouter } from 'react-router-dom'
import { TestScene } from '@strategy/TestScene'
import { StrategyMode } from '@strategy/StrategyMode'
import { DetectiveMode } from '@detective/DetectiveMode'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TestScene />,
  },
  {
    path: '/strategy',
    element: <StrategyMode />,
  },
  {
    path: '/detective/:caseId',
    element: <DetectiveMode />,
  },
])
