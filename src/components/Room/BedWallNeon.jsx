import { ROOM_WIDTH, WALL_THICKNESS } from './dimensions'
import { BED } from './layout'

const WALL_X = -ROOM_WIDTH / 2 + WALL_THICKNESS / 2 // -3.0
const BAR_LENGTH = 1.3
const Y = 2.35

export default function BedWallNeon({ on = true }) {
  const z = BED.centerZ
  const glowIntensity = on ? 2.4 : 0

  return (
    <group position={[WALL_X + 0.035, Y, z]}>
      {/* Matte Black Backing Plate */}
      <mesh position={[-0.01, 0, 0]} castShadow>
        <boxGeometry args={[0.02, 0.4, BAR_LENGTH + 0.14]} />
        <meshPhysicalMaterial color="#0b0c10" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Horizontal Neon Cyan Bar */}
      <mesh position={[0.008, 0, 0]}>
        <boxGeometry args={[0.015, 0.045, BAR_LENGTH]} />
        <meshStandardMaterial
          color="#4fd8ff"
          emissive="#4fd8ff"
          emissiveIntensity={glowIntensity}
          toneMapped={false}
        />
      </mesh>
      {/* Vertical Side Accent Bars */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0.008, 0, side * (BAR_LENGTH / 2 - 0.02)]}>
          <boxGeometry args={[0.015, 0.16, 0.045]} />
          <meshStandardMaterial
            color="#4fd8ff"
            emissive="#4fd8ff"
            emissiveIntensity={glowIntensity}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}
