import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { Mesh } from 'three'

function RotatingCube() {
  const meshRef = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((_, delta) => {
    meshRef.current.rotation.x += delta * 0.5
    meshRef.current.rotation.y += delta * 0.3
  })

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color={hovered ? '#ff6b6b' : '#4ecdc4'} />
    </mesh>
  )
}

export function TestScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a2e' }}>
      <Canvas camera={{ position: [3, 3, 3], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls enableDamping />
        <RotatingCube />
        <gridHelper args={[10, 10, '#444', '#222']} />
      </Canvas>
    </div>
  )
}
