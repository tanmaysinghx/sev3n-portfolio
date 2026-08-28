import { ROOM_HEIGHT } from './dimensions'

const SHADE_HEIGHT = 0.26
const SHADE_RADIUS = 0.042
const CAP_HEIGHT = 0.06
const GOLD_ACCENT = '#d4af37'
const WARM_DIFFUSE = '#ffecd0'
const SOFT_AMBER_LIGHT = '#ffd8a6'

export default function PendantLamp({ position, shadeBottomY = 1.10, on = true }) {
  const [x, z] = position
  const shadeTopY = shadeBottomY + SHADE_HEIGHT
  const capY = shadeTopY + CAP_HEIGHT / 2
  const cordLength = ROOM_HEIGHT - (shadeTopY + CAP_HEIGHT)

  return (
    <group position={[x, 0, z]}>
      {/* 1. Slender Matte Black Fabric Cord */}
      <mesh position={[0, shadeTopY + CAP_HEIGHT + cordLength / 2, 0]}>
        <cylinderGeometry args={[0.0018, 0.0018, cordLength, 8]} />
        <meshPhysicalMaterial color="#18191c" roughness={0.6} metalness={0.5} />
      </mesh>

      {/* Ceiling Canopy Plate */}
      <mesh position={[0, ROOM_HEIGHT - 0.012, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 24]} />
        <meshPhysicalMaterial
          color={GOLD_ACCENT}
          roughness={0.25}
          metalness={0.92}
          clearcoat={0.3}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* 2. Brushed Champagne Gold Top Socket Fitting */}
      <mesh position={[0, shadeTopY + CAP_HEIGHT / 2, 0]} castShadow>
        <cylinderGeometry args={[0.016, 0.022, CAP_HEIGHT, 24]} />
        <meshPhysicalMaterial
          color={GOLD_ACCENT}
          roughness={0.22}
          metalness={0.95}
          clearcoat={0.4}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* 3. Luxury Fluted Frosted Opal Glass Cylinder Shade */}
      <mesh position={[0, shadeBottomY + SHADE_HEIGHT / 2, 0]} castShadow>
        <cylinderGeometry args={[SHADE_RADIUS, SHADE_RADIUS, SHADE_HEIGHT, 32, 1, false]} />
        <meshPhysicalMaterial
          color={WARM_DIFFUSE}
          emissive={WARM_DIFFUSE}
          emissiveIntensity={on ? 0.45 : 0}
          roughness={0.2}
          metalness={0.05}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          transmission={0.45}
          ior={1.52}
          toneMapped={true}
        />
      </mesh>

      {/* 4. Internal Subtle Filament Candle Core */}
      <mesh position={[0, shadeBottomY + SHADE_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, SHADE_HEIGHT * 0.5, 16]} />
        <meshStandardMaterial
          color="#ffca7a"
          emissive="#ffca7a"
          emissiveIntensity={on ? 1.2 : 0}
          toneMapped={true}
        />
      </mesh>

      {/* 5. Brushed Brass Bottom Ring & Tapered Finial */}
      <mesh position={[0, shadeBottomY + 0.004, 0]} castShadow>
        <torusGeometry args={[SHADE_RADIUS + 0.001, 0.003, 12, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshPhysicalMaterial
          color={GOLD_ACCENT}
          roughness={0.22}
          metalness={0.95}
          clearcoat={0.4}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <mesh position={[0, shadeBottomY - 0.012, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.002, 0.024, 16]} />
        <meshPhysicalMaterial
          color={GOLD_ACCENT}
          roughness={0.22}
          metalness={0.95}
          clearcoat={0.4}
        />
      </mesh>

      {/* 6. Soft, Photorealistic Bedside Reading Light (No blown-out glare) */}
      {on && (
        <pointLight
          color={SOFT_AMBER_LIGHT}
          intensity={0.28}
          distance={1.6}
          decay={2}
          position={[0, shadeBottomY - 0.04, 0]}
        />
      )}
    </group>
  )
}
