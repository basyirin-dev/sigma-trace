import '@testing-library/jest-dom';
import { vi } from 'vitest';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

vi.mock('@react-three/fiber', () => ({
  Canvas: () => <div data-testid="r3f-canvas" />,
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
}));
