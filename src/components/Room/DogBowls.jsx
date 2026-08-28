import * as THREE from 'three'

const STAND_WIDTH = 0.52
const STAND_DEPTH = 0.28
const STAND_HEIGHT = 0.08
const BOWL_RADIUS = 0.095
const BOWL_DEPTH = 0.065
const GOLD_ACCENT = '#d4af37'
const WOOD_DARK = '#241a13'

export default function DogBowls({ position = [2.2, 0, 1.0], rotation = [0, 0, 0] }) {
  const [x, y, z] = position

  return (
    <group position={[x, y, z]} rotation={rotation}>
      {/* 1. Silicone Non-Slip Floor Mat with Gold Edge */}
      <mesh position={[0, 0.003, 0]} receiveShadow>
        <boxGeometry args={[STAND_WIDTH + 0.12, 0.006, STAND_DEPTH + 0.1]} />
        <meshPhysicalMaterial color="#1e2024" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.006, 0]}>
        <boxGeometry args={[STAND_WIDTH + 0.1, 0.002, STAND_DEPTH + 0.08]} />
        <meshPhysicalMaterial color="#2d3036" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* 2. Elevated Dark Walnut & Brushed Brass Feeder Stand */}
      <mesh position={[0, STAND_HEIGHT / 2 + 0.006, 0]} castShadow receiveShadow>
        <boxGeometry args={[STAND_WIDTH, STAND_HEIGHT, STAND_DEPTH]} />
        <meshPhysicalMaterial
          color={WOOD_DARK}
          roughness={0.4}
          metalness={0.15}
          clearcoat={0.3}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Brushed Gold Top Inset Frame */}
      <mesh position={[0, STAND_HEIGHT + 0.007, 0]}>
        <boxGeometry args={[STAND_WIDTH + 0.01, 0.004, STAND_DEPTH + 0.01]} />
        <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.25} metalness={0.92} />
      </mesh>

      {/* 3. Dual Bowls (Left: Water Bowl with Translucent Liquid, Right: Food Bowl) */}
      {[-0.14, 0.14].map((bx, idx) => (
        <group key={idx} position={[bx, STAND_HEIGHT + 0.008, 0]}>
          {/* Ceramic / Stainless Bowl Rim */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[BOWL_RADIUS, BOWL_RADIUS * 0.75, BOWL_DEPTH, 28, 1, false]} />
            <meshPhysicalMaterial
              color="#f8f6f0"
              roughness={0.15}
              metalness={0.1}
              clearcoat={0.8}
              clearcoatRoughness={0.05}
            />
          </mesh>

          {/* Champagne Gold Outer Rim Ring */}
          <mesh position={[0, BOWL_DEPTH / 2, 0]}>
            <torusGeometry args={[BOWL_RADIUS, 0.005, 12, 28]} rotation={[Math.PI / 2, 0, 0]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>

          {/* Bowl Contents */}
          {idx === 0 ? (
            /* Water Bowl with Translucent Physical Water Shader */
            <mesh position={[0, BOWL_DEPTH / 4, 0]}>
              <cylinderGeometry args={[BOWL_RADIUS - 0.012, BOWL_RADIUS * 0.72, 0.02, 24]} />
              <meshPhysicalMaterial
                color="#64b5f6"
                transparent
                opacity={0.7}
                roughness={0.02}
                metalness={0.1}
                clearcoat={1.0}
                clearcoatRoughness={0.02}
                transmission={0.6}
                ior={1.333}
              />
            </mesh>
          ) : (
            /* Kibble Food Bowl */
            <mesh position={[0, BOWL_DEPTH / 4, 0]}>
              <cylinderGeometry args={[BOWL_RADIUS - 0.012, BOWL_RADIUS * 0.72, 0.025, 24]} />
              <meshPhysicalMaterial
                color="#5a3d28"
                roughness={0.9}
                metalness={0.05}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}
