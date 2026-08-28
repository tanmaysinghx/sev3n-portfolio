import { ROOM_DEPTH, ROOM_HEIGHT, ROOM_WIDTH, WALL_THICKNESS } from './dimensions'

const WALL_X = ROOM_WIDTH / 2 // +3.1 (Dividing wall between Master Bedroom and Living Hall)
const WALL_COLOR = '#a89b87'
const TRIM_COLOR = '#241a13'
const GOLD_ACCENT = '#d4af37'

function Floor() {
  return (
    <mesh position={[0, -WALL_THICKNESS / 2, 0]} receiveShadow>
      <boxGeometry args={[ROOM_WIDTH, WALL_THICKNESS, ROOM_DEPTH]} />
      <meshPhysicalMaterial color="#6b4a34" roughness={0.7} metalness={0.08} clearcoat={0.2} />
    </mesh>
  )
}

function Ceiling() {
  return (
    <mesh position={[0, ROOM_HEIGHT + WALL_THICKNESS / 2, 0]} receiveShadow>
      <boxGeometry args={[ROOM_WIDTH, WALL_THICKNESS, ROOM_DEPTH]} />
      <meshPhysicalMaterial color="#e6e0d2" roughness={0.92} metalness={0} />
    </mesh>
  )
}

function RightDividingWall() {
  // Doorway on the opposite side (near rear window from z = -3.4 to z = -2.3)
  const windowStartZ = -ROOM_DEPTH / 2 // -3.5
  const backReturnLength = 0.1 // -3.5 to -3.4
  const doorwayLength = 1.1 // Open passage from -3.4 to -2.3
  const solidStartZ = windowStartZ + backReturnLength + doorwayLength // -2.3
  const solidWallLength = ROOM_DEPTH / 2 - solidStartZ // 5.8m solid wall from -2.3 to +3.5 (behind TV Wall)

  return (
    <group position={[WALL_X, 0, 0]}>
      {/* 1. Window Corner Return Segment (-3.5 to -3.4) */}
      {backReturnLength > 0 && (
        <mesh position={[0, ROOM_HEIGHT / 2, windowStartZ + backReturnLength / 2]} receiveShadow>
          <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, backReturnLength]} />
          <meshPhysicalMaterial color={WALL_COLOR} roughness={0.88} metalness={0.02} />
        </mesh>
      )}

      {/* 2. Main Solid Dividing Wall Behind TV Wall (-2.3 to +3.5) */}
      <mesh position={[0, ROOM_HEIGHT / 2, solidStartZ + solidWallLength / 2]} receiveShadow>
        <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, solidWallLength]} />
        <meshPhysicalMaterial color={WALL_COLOR} roughness={0.88} metalness={0.02} />
      </mesh>

      {/* 3. Architectural Doorway Casing Posts with Brass Inlays (-3.4 and -2.3) */}
      {[windowStartZ + backReturnLength, solidStartZ].map((jambZ, idx) => (
        <group key={`jamb-${idx}`} position={[0, ROOM_HEIGHT / 2, jambZ]}>
          <mesh castShadow>
            <boxGeometry args={[WALL_THICKNESS + 0.04, ROOM_HEIGHT, 0.08]} />
            <meshPhysicalMaterial color={TRIM_COLOR} roughness={0.5} metalness={0.2} clearcoat={0.2} />
          </mesh>
          <mesh position={[-WALL_THICKNESS / 2 - 0.022, 0, 0]}>
            <boxGeometry args={[0.005, ROOM_HEIGHT, 0.018]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.25} metalness={0.92} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function RoomShell() {
  return (
    <group>
      <Floor />
      <Ceiling />
      <RightDividingWall />
    </group>
  )
}
