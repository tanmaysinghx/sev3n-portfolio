import { NIGHTSTAND } from './layout'

const WIDTH = NIGHTSTAND.width
const DEPTH = NIGHTSTAND.depth
const HEIGHT = 0.54
const LEG_HEIGHT = 0.12
const TOP_THICKNESS = 0.03
const GOLD_ACCENT = '#d4af37'

export default function Nightstand({ position }) {
  const [x, z] = position
  const bodyHeight = HEIGHT - LEG_HEIGHT - TOP_THICKNESS

  return (
    <group position={[x, 0, z]}>
      {/* 1. Brushed Champagne Gold Tapered Metal Legs */}
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh
            key={`${sx}-${sz}`}
            position={[sx * (WIDTH / 2 - 0.04), LEG_HEIGHT / 2, sz * (DEPTH / 2 - 0.04)]}
            castShadow
          >
            <cylinderGeometry args={[0.012, 0.008, LEG_HEIGHT, 14]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.25} metalness={0.92} />
          </mesh>
        )),
      )}

      {/* 2. Fluted Smoked Walnut Drawer Body */}
      <mesh position={[0, LEG_HEIGHT + bodyHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[WIDTH, bodyHeight, DEPTH]} />
        <meshPhysicalMaterial color="#2e2118" roughness={0.5} metalness={0.08} clearcoat={0.2} />
      </mesh>

      {/* Drawer Seam & Brushed Gold Pull Handle */}
      <group position={[WIDTH / 2 + 0.004, LEG_HEIGHT + bodyHeight / 2, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.004, bodyHeight - 0.04, DEPTH - 0.06]} />
          <meshPhysicalMaterial color="#221811" roughness={0.5} metalness={0.1} />
        </mesh>
        {/* Horizontal Gold Bar Handle */}
        <mesh position={[0.01, 0, 0]} castShadow>
          <boxGeometry args={[0.008, 0.012, 0.16]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
      </group>

      {/* 3. Inset Calacatta Gold Marble Slab Top */}
      <mesh position={[0, LEG_HEIGHT + bodyHeight + TOP_THICKNESS / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[WIDTH + 0.02, TOP_THICKNESS, DEPTH + 0.02]} />
        <meshPhysicalMaterial
          color="#f4eee4"
          roughness={0.2}
          metalness={0.12}
          clearcoat={0.4}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* 4. Luxury Bedside Decor (Ceramic Carafe & Water Tumbler) */}
      <group position={[-0.04, LEG_HEIGHT + bodyHeight + TOP_THICKNESS + 0.06, 0.05]}>
        {/* Water Carafe */}
        <mesh position={[0, 0.04, -0.06]} castShadow>
          <cylinderGeometry args={[0.032, 0.045, 0.14, 16]} />
          <meshPhysicalMaterial
            color="#e8f4fa"
            transparent
            opacity={0.5}
            roughness={0.05}
            metalness={0.8}
            clearcoat={1.0}
          />
        </mesh>
        {/* Tumbler */}
        <mesh position={[0, 0.02, 0.06]} castShadow>
          <cylinderGeometry args={[0.025, 0.02, 0.07, 14]} />
          <meshPhysicalMaterial
            color="#e8f4fa"
            transparent
            opacity={0.5}
            roughness={0.05}
            metalness={0.8}
            clearcoat={1.0}
          />
        </mesh>
      </group>
    </group>
  )
}
