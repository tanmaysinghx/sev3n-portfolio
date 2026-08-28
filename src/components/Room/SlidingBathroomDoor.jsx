import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { ROOM_HEIGHT, ROOM_WIDTH, WALL_THICKNESS } from './dimensions'
import { BATH_DOOR } from './layout'

const WALL_X = -ROOM_WIDTH / 2 + WALL_THICKNESS / 2 // -3.0
const PANEL_THICKNESS = 0.035
const RAIL_HEIGHT = 0.04
const GOLD_ACCENT = '#d4af37'

const CLOSED_Z = BATH_DOOR.centerZ // 2.60
const OPEN_Z = BATH_DOOR.centerZ + 0.40 // Slides smoothly to +Z

export default function SlidingBathroomDoor() {
  const [isOpen, setIsOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef()
  const currentZ = useRef(CLOSED_Z)

  useFrame((_, delta) => {
    const targetZ = isOpen ? OPEN_Z : CLOSED_Z
    currentZ.current += (targetZ - currentZ.current) * Math.min(1, delta * 6)
    if (groupRef.current) {
      groupRef.current.position.z = currentZ.current
    }
  })

  return (
    <group>
      {/* 1. Overhead Matte Black & Brass Sliding Track */}
      <mesh position={[WALL_X + 0.035, ROOM_HEIGHT - 0.04, (CLOSED_Z + OPEN_Z) / 2]}>
        <boxGeometry args={[0.05, RAIL_HEIGHT, BATH_DOOR.width + 0.6]} />
        <meshPhysicalMaterial color="#141518" roughness={0.35} metalness={0.88} />
      </mesh>

      {/* 2. Sliding Smoked Fluted Glass Door Leaf */}
      <group
        ref={groupRef}
        position={[WALL_X + 0.035, 0, CLOSED_Z]}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen((v) => !v)
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
        {/* Outer Matte Black Metal Frame */}
        <mesh position={[0, (ROOM_HEIGHT - 0.1) / 2, 0]} castShadow>
          <boxGeometry args={[PANEL_THICKNESS, ROOM_HEIGHT - 0.12, BATH_DOOR.width]} />
          <meshPhysicalMaterial
            color={hovered ? '#2a2e36' : '#17191d'}
            roughness={0.4}
            metalness={0.85}
          />
        </mesh>

        {/* Smoked Fluted Glass Inset */}
        <mesh position={[0, (ROOM_HEIGHT - 0.1) / 2, 0]}>
          <boxGeometry args={[PANEL_THICKNESS - 0.015, ROOM_HEIGHT - 0.22, BATH_DOOR.width - 0.08]} />
          <meshPhysicalMaterial
            color="#22262d"
            transparent
            opacity={0.55}
            roughness={0.12}
            metalness={0.8}
            clearcoat={1.0}
          />
        </mesh>

        {/* Brushed Champagne Gold Vertical Bar Handle */}
        <mesh position={[0.024, (ROOM_HEIGHT - 0.1) * 0.45, -BATH_DOOR.width / 2 + 0.06]}>
          <cylinderGeometry args={[0.008, 0.008, 0.45, 12]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
      </group>
    </group>
  )
}
