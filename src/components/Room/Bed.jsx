import { BED } from './layout'

const LEG_HEIGHT = 0.08
const PLATFORM_HEIGHT = 0.26
const PLATFORM_TOP = LEG_HEIGHT + PLATFORM_HEIGHT // 0.34
const MATTRESS_HEIGHT = 0.26
const GOLD_ACCENT = '#d4af37'
const WARM_GLOW = '#ffcf8a'

// Headboard positioned safely in front of the marble feature wall (x = -2.965)
const HEADBOARD_X = -2.92
const HEADBOARD_THICKNESS = 0.06

function FloatingPlatformBase() {
  return (
    <group>
      {/* 1. Recessed Floating Base Plinth */}
      <mesh position={[BED.centerX, LEG_HEIGHT / 2, BED.centerZ]} castShadow>
        <boxGeometry args={[BED.length - 0.35, LEG_HEIGHT, BED.width - 0.35]} />
        <meshPhysicalMaterial color="#181412" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Under-bed Warm Amber Floating Halo Glow */}
      <mesh position={[BED.centerX, 0.035, BED.centerZ]}>
        <boxGeometry args={[BED.length - 0.38, 0.015, BED.width - 0.38]} />
        <meshStandardMaterial
          color={WARM_GLOW}
          emissive={WARM_GLOW}
          emissiveIntensity={2.6}
          toneMapped={false}
        />
      </mesh>

      {/* 2. Smoked Dark Walnut Bed Platform */}
      <mesh position={[BED.centerX, LEG_HEIGHT + PLATFORM_HEIGHT / 2, BED.centerZ]} castShadow receiveShadow>
        <boxGeometry args={[BED.length + 0.08, PLATFORM_HEIGHT, BED.width + 0.08]} />
        <meshPhysicalMaterial
          color="#2a1f18"
          roughness={0.45}
          metalness={0.08}
          clearcoat={0.2}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* 3. Distinct Brushed Gold Accent Plinth Inlay Reveal (Recessed, Non-Overlapping) */}
      <mesh position={[BED.centerX, PLATFORM_TOP - 0.02, BED.centerZ]}>
        <boxGeometry args={[BED.length + 0.086, 0.012, BED.width + 0.086]} />
        <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
      </mesh>
    </group>
  )
}

function FlutedChannelHeadboard() {
  const height = 1.05
  const panelCount = 7
  const totalW = BED.width + 0.1
  const panelW = totalW / panelCount

  return (
    <group position={[HEADBOARD_X, LEG_HEIGHT + height / 2, BED.centerZ]}>
      {/* Vertical Fluted Bouclé Upholstery Channels with Gold Inlays */}
      {new Array(panelCount).fill(0).map((_, i) => {
        const pz = -totalW / 2 + (i + 0.5) * panelW
        return (
          <group key={i} position={[0, 0, pz]}>
            {/* Cushion Channel */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[HEADBOARD_THICKNESS, height, panelW - 0.015]} />
              <meshPhysicalMaterial
                color={i % 2 === 0 ? '#ded6c8' : '#d2c8b8'}
                roughness={0.88}
                metalness={0.02}
                clearcoat={0.05}
              />
            </mesh>
            {/* Brass Inlay Seam */}
            {i < panelCount - 1 && (
              <mesh position={[HEADBOARD_THICKNESS / 2 + 0.002, 0, panelW / 2 - 0.007]}>
                <boxGeometry args={[0.004, height, 0.005]} />
                <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.25} metalness={0.92} />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}

function DeepPlushMattress() {
  return (
    <group position={[BED.centerX, PLATFORM_TOP + MATTRESS_HEIGHT / 2, BED.centerZ]}>
      {/* Main Pocket-Spring Mattress Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[BED.length - 0.04, MATTRESS_HEIGHT, BED.width - 0.04]} />
        <meshPhysicalMaterial color="#f0eae0" roughness={0.9} metalness={0.02} />
      </mesh>

      {/* Layered Bedding: Dark Rust Velvet Quilted Duvet */}
      <mesh position={[0.2, MATTRESS_HEIGHT / 2 + 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[BED.length - 0.45, 0.06, BED.width + 0.04]} />
        <meshPhysicalMaterial color="#7a3426" roughness={0.94} metalness={0.01} />
      </mesh>

      {/* Folded Taupe Wool Throw Blanket Across Foot of Bed */}
      <mesh position={[BED.length / 2 - 0.35, MATTRESS_HEIGHT / 2 + 0.065, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.03, BED.width + 0.08]} />
        <meshPhysicalMaterial color="#3e3630" roughness={0.92} metalness={0.02} />
      </mesh>

      {/* 4 Ergonomic Layered Sleeping & Accent Pillows */}
      {[-0.45, 0.45].map((pz, idx) => (
        <group key={idx} position={[-BED.length / 2 + 0.38, MATTRESS_HEIGHT / 2 + 0.08, pz]}>
          {/* Back White Egyptian Cotton King Pillow */}
          <mesh rotation={[0, 0, 0.2]} castShadow receiveShadow>
            <boxGeometry args={[0.38, 0.12, 0.62]} />
            <meshPhysicalMaterial color="#faf8f5" roughness={0.88} metalness={0.01} />
          </mesh>
          {/* Front Velvet Accent Pillow */}
          <mesh position={[0.15, -0.01, 0]} rotation={[0, 0, 0.35]} castShadow receiveShadow>
            <boxGeometry args={[0.22, 0.1, 0.48]} />
            <meshPhysicalMaterial color="#54251c" roughness={0.95} metalness={0.01} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function Bed() {
  return (
    <group>
      <FloatingPlatformBase />
      <FlutedChannelHeadboard />
      <DeepPlushMattress />
    </group>
  )
}
