import { useState } from 'react'
import { ROOM_WIDTH, WALL_THICKNESS } from './dimensions'
import { DOOR } from './layout'

const WALL_X = ROOM_WIDTH / 2 - WALL_THICKNESS / 2
const CONSOLE_Y = 1.25
const CONSOLE_Z = DOOR.frontZ + 0.3

export default function WallConsole({ onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <group
      position={[WALL_X, CONSOLE_Y, CONSOLE_Z]}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <mesh castShadow>
        <boxGeometry args={[0.02, 0.11, 0.075]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[-0.012, 0, 0]}>
        <boxGeometry args={[0.004, 0.09, 0.058]} />
        <meshStandardMaterial
          color={hovered ? '#8fe0ff' : '#3a3f47'}
          emissive={hovered ? '#8fe0ff' : '#5fa9c9'}
          emissiveIntensity={hovered ? 1.6 : 0.7}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-0.015, 0.026, 0]}>
        <circleGeometry args={[0.006, 16]} />
        <meshStandardMaterial
          color="#eaf9ff"
          emissive="#eaf9ff"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
      {[-1, 0, 1].map((row) => (
        <mesh key={row} position={[-0.015, row * 0.015, 0]}>
          <boxGeometry args={[0.002, 0.006, 0.04]} />
          <meshStandardMaterial
            color="#eaf9ff"
            emissive="#eaf9ff"
            emissiveIntensity={0.8}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}
