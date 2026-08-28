import { UnifiedBackWindow } from '../Common/UnifiedWindowWall'
import { LANDING_DOOR } from '../EntranceLanding/dimensions'
import { ROOM_HEIGHT, WALL_THICKNESS } from '../Room/dimensions'
import {
  HALL_CENTER_X,
  HALL_DEPTH,
  HALL_FAR_X,
  HALL_HEIGHT,
  HALL_ORIGIN_X,
  HALL_WIDTH,
} from './dimensions'

const FLOOR_COLOR = '#6b4a34'
const WALL_DARK_BASE = '#15171b'
const LOUVER_WOOD = '#241a13'
const GOLD_ACCENT = '#d4af37'
const WARM_LED = '#ffe4b5'
const CEILING_COLOR = '#e6e0d2'

function Floor() {
  return (
    <mesh position={[HALL_CENTER_X, -WALL_THICKNESS / 2, 0]} receiveShadow>
      <boxGeometry args={[HALL_WIDTH, WALL_THICKNESS, HALL_DEPTH]} />
      <meshStandardMaterial color={FLOOR_COLOR} roughness={0.85} metalness={0.05} />
    </mesh>
  )
}

function Ceiling() {
  return (
    <mesh position={[HALL_CENTER_X, HALL_HEIGHT + WALL_THICKNESS / 2, 0]} receiveShadow>
      <boxGeometry args={[HALL_WIDTH, WALL_THICKNESS, HALL_DEPTH]} />
      <meshStandardMaterial color={CEILING_COLOR} roughness={0.95} metalness={0} />
    </mesh>
  )
}

// Louver slat section generator
function LouverSlatPanel({ startZ, length, height = HALL_HEIGHT }) {
  const slatW = 0.038
  const slatD = 0.028
  const spacing = 0.072
  const count = Math.floor(length / spacing)
  const centerZ = startZ + length / 2

  return (
    <group>
      {/* Dark Backer Board */}
      <mesh position={[0, height / 2, centerZ]} receiveShadow>
        <boxGeometry args={[0.02, height, length]} />
        <meshStandardMaterial color={WALL_DARK_BASE} roughness={0.9} metalness={0} />
      </mesh>

      {/* Vertical Acoustic Walnut Louver Slats */}
      {new Array(count).fill(0).map((_, i) => {
        const sz = startZ + spacing * (i + 0.5)
        return (
          <mesh
            key={i}
            position={[-slatW / 2 - 0.01, height / 2, sz]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[slatW, height, slatD]} />
            <meshPhysicalMaterial
              color={LOUVER_WOOD}
              roughness={0.5}
              metalness={0.12}
              clearcoat={0.2}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Curated Gallery Backlit Art Niche
function LouverArtNiche({ position, accentOn = true }) {
  const nicheW = 0.12
  const nicheH = 1.35
  const nicheL = 1.05

  return (
    <group position={position}>
      {/* 1. Recessed Niche Box Frame */}
      <mesh receiveShadow>
        <boxGeometry args={[nicheW, nicheH, nicheL]} />
        <meshPhysicalMaterial color="#0e1013" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* 2. Perimeter Brushed Champagne Gold Inner Reveal Band */}
      <mesh position={[-nicheW / 2 + 0.005, 0, 0]}>
        <boxGeometry args={[0.006, nicheH - 0.04, nicheL - 0.04]} />
        <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
      </mesh>

      {/* 3. Luxury Abstract Gold-Foil Artwork Canvas */}
      <mesh position={[-nicheW / 2 + 0.012, 0, 0]}>
        <boxGeometry args={[0.006, nicheH - 0.10, nicheL - 0.10]} />
        <meshPhysicalMaterial
          color="#1e1914"
          roughness={0.35}
          metalness={0.4}
          clearcoat={0.5}
        />
      </mesh>

      {/* 4. Warm Ambient Perimeter LED Halo Glow */}
      <mesh position={[-nicheW / 2 + 0.008, 0, 0]}>
        <boxGeometry args={[0.002, nicheH - 0.02, nicheL - 0.02]} />
        <meshStandardMaterial
          color={WARM_LED}
          emissive={WARM_LED}
          emissiveIntensity={accentOn ? 3.5 : 0}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function LouveredFarRightWall({ accentOn = true }) {
  const startZ = -HALL_DEPTH / 2 // -3.5
  const doorZ = LANDING_DOOR.centerZ // 1.90
  const doorW = LANDING_DOOR.width // 2.80m wide grand portal!

  const doorStartZ = doorZ - doorW / 2 // 0.50m
  const backWallLength = doorStartZ - startZ // 4.00m (spans -3.5 to +0.50)

  const doorEndZ = doorZ + doorW / 2 // 3.30m
  const frontStartZ = doorEndZ // 3.30m
  const frontWallLength = HALL_DEPTH / 2 - frontStartZ // 0.20m front return wall (+3.30 to +3.50)

  return (
    <group position={[HALL_FAR_X, 0, 0]}>
      {/* 1. Solid Structural Partition Wall */}
      <mesh position={[0, HALL_HEIGHT / 2, startZ + backWallLength / 2]} receiveShadow>
        <boxGeometry args={[WALL_THICKNESS, HALL_HEIGHT, backWallLength]} />
        <meshPhysicalMaterial color="#ded7cc" roughness={0.88} metalness={0.02} />
      </mesh>

      {/* 2. Louvered Section with Integrated Art Niche (on Living Room side) */}
      <LouverSlatPanel startZ={startZ} length={backWallLength} />
      <LouverArtNiche
        position={[-0.08, 1.9, startZ + 1.8]}
        accentOn={accentOn}
      />

      {/* 3. Baseboard Warm LED Wash Strip */}
      <mesh position={[-0.04, 0.03, startZ + backWallLength / 2]}>
        <boxGeometry args={[0.02, 0.015, backWallLength - 0.1]} />
        <meshStandardMaterial
          color={WARM_LED}
          emissive={WARM_LED}
          emissiveIntensity={accentOn ? 2.2 : 0}
          toneMapped={false}
        />
      </mesh>

      {/* 4. Front Wall Return Section (Past the 2.80m Doorway) */}
      {frontWallLength > 0 && (
        <group>
          <mesh position={[0, HALL_HEIGHT / 2, frontStartZ + frontWallLength / 2]} receiveShadow>
            <boxGeometry args={[WALL_THICKNESS, HALL_HEIGHT, frontWallLength]} />
            <meshPhysicalMaterial color="#ded7cc" roughness={0.88} metalness={0.02} />
          </mesh>
          <LouverSlatPanel startZ={frontStartZ} length={frontWallLength} />
          <mesh position={[-0.04, 0.03, frontStartZ + frontWallLength / 2]}>
            <boxGeometry args={[0.02, 0.015, frontWallLength - 0.02]} />
            <meshStandardMaterial
              color={WARM_LED}
              emissive={WARM_LED}
              emissiveIntensity={accentOn ? 2.2 : 0}
              toneMapped={false}
            />
          </mesh>
        </group>
      )}

      {/* 5. Full Floor-to-Ceiling Grand Portal Jamb Casing Posts with Brass Inlays */}
      {[doorStartZ, doorEndZ].map((jambZ, i) => (
        <group key={i} position={[0, HALL_HEIGHT / 2, jambZ]}>
          <mesh castShadow>
            <boxGeometry args={[WALL_THICKNESS + 0.04, HALL_HEIGHT, 0.08]} />
            <meshStandardMaterial color={LOUVER_WOOD} roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh position={[-WALL_THICKNESS / 2 - 0.022, 0, 0]}>
            <boxGeometry args={[0.005, HALL_HEIGHT, 0.018]} />
            <meshStandardMaterial color={GOLD_ACCENT} roughness={0.3} metalness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function HallKitchenShell({ accentOn = true }) {
  return (
    <group>
      <Floor />
      <Ceiling />
      {/* Unified Panoramic Window matching Master Bedroom Window Architecture */}
      <UnifiedBackWindow
        startX={HALL_ORIGIN_X}
        width={HALL_WIDTH}
        backZ={-HALL_DEPTH / 2}
        height={HALL_HEIGHT}
      />
      <LouveredFarRightWall accentOn={accentOn} />
    </group>
  )
}
