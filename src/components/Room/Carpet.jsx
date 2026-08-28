import { BED } from './layout'

const CARPET_WIDTH_X = 4.2 // Spans from headboard under bed towards TV
const CARPET_LENGTH_Z = 4.2 // Spans across left nightstand, bed, and right nightstand
const CENTER_X = -0.65
const RUG_BASE = '#dcd5c9'
const RUG_BORDER = '#c8bfb0'

export default function Carpet() {
  const centerZ = BED.centerZ // 0.5 (Aligned with the bed and TV)

  return (
    <group>
      {/* 1. Main Plush Woven Area Rug */}
      <mesh position={[CENTER_X, 0.006, centerZ]} receiveShadow>
        <boxGeometry args={[CARPET_WIDTH_X, 0.012, CARPET_LENGTH_Z]} />
        <meshPhysicalMaterial color={RUG_BASE} roughness={0.95} metalness={0.02} />
      </mesh>

      {/* 2. Inset Woven Accent Border */}
      <mesh position={[CENTER_X, 0.013, centerZ]}>
        <boxGeometry args={[CARPET_WIDTH_X - 0.35, 0.003, CARPET_LENGTH_Z - 0.35]} />
        <meshPhysicalMaterial color={RUG_BORDER} roughness={0.92} metalness={0.02} />
      </mesh>
    </group>
  )
}
