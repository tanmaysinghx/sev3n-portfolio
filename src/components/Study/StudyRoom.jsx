import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  UnifiedBackWindow,
  UnifiedSideWindow,
} from '../Common/UnifiedWindowWall'
import {
  STUDY_CENTER_X,
  STUDY_DEPTH,
  STUDY_FAR_X,
  STUDY_ORIGIN_X,
  STUDY_WIDTH,
} from '../EntranceLanding/dimensions'
import { ROOM_HEIGHT, WALL_THICKNESS } from '../Room/dimensions'
import StudyBookshelf from './StudyBookshelf'
import StudyDesk from './StudyDesk'

const FLOOR_COLOR = '#6b4a34'
const CEILING_COLOR = '#e6e0d2'
const LIGHT_WALL_COLOR = '#eae5db' // Light warm alabaster / limestone wall
const BACK_Z = -STUDY_DEPTH / 2
const RUG_COLOR = '#b8af9f'
const GOLD_ACCENT = '#d4af37'
const WARM_GLOW = '#ffcf8a'
const TRIM_WOOD = '#241a13'
const TRACK_BLACK = '#111215'

const DROP_TIER1 = 0.12
const DROP_TIER2 = 0.22
const TIER1_Y = ROOM_HEIGHT - DROP_TIER1
const TIER2_Y = ROOM_HEIGHT - DROP_TIER2
const COVE1_Y = ROOM_HEIGHT - DROP_TIER1 / 2
const COVE2_Y = TIER1_Y - (DROP_TIER2 - DROP_TIER1) / 2
const STRIP_T = 0.035

function CornerWindowWalls() {
  return (
    <group>
      {/* Heavy Corner Column */}
      <mesh
        position={[STUDY_FAR_X, ROOM_HEIGHT / 2, BACK_Z]}
        castShadow
      >
        <boxGeometry args={[0.24, ROOM_HEIGHT, 0.24]} />
        <meshStandardMaterial color="#1c1c1e" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Unified Back Window */}
      <UnifiedBackWindow
        startX={STUDY_ORIGIN_X}
        width={STUDY_WIDTH}
        backZ={BACK_Z}
        height={ROOM_HEIGHT}
      />

      {/* Unified Right Side Window */}
      <UnifiedSideWindow
        posX={STUDY_FAR_X}
        startZ={BACK_Z}
        depth={STUDY_DEPTH}
        height={ROOM_HEIGHT}
      />
    </group>
  )
}

function StudyDividingWall() {
  // Light-colored wall dividing Study and Foyer with a clean opening in the private front zone (z = +1.10m to +2.90m)
  const startZ = -STUDY_DEPTH / 2 // -3.50m
  const endZ = STUDY_DEPTH / 2 // +3.50m
  const doorStartZ = 1.10 // Starts in front private foyer zone
  const doorOpenLen = 1.80 // 1.80m wide open passage
  const doorEndZ = doorStartZ + doorOpenLen // +2.90m

  const backWallLen = doorStartZ - startZ // 4.60m solid back wall (spans -3.50m to +1.10m)
  const frontWallLen = endZ - doorEndZ // 0.60m front wall (spans +2.90m to +3.50m)

  return (
    <group position={[STUDY_ORIGIN_X, 0, 0]}>
      {/* 1. Back Wall Section (Spanning -3.50m to +1.10m enclosing elevator & foyer) */}
      <mesh
        position={[0, ROOM_HEIGHT / 2, startZ + backWallLen / 2]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, backWallLen]} />
        <meshStandardMaterial color={LIGHT_WALL_COLOR} roughness={0.88} metalness={0.02} />
      </mesh>

      {/* 2. Front Wall Section (Spanning +2.90m to +3.50m) */}
      {frontWallLen > 0 && (
        <mesh
          position={[0, ROOM_HEIGHT / 2, doorEndZ + frontWallLen / 2]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, frontWallLen]} />
          <meshStandardMaterial color={LIGHT_WALL_COLOR} roughness={0.88} metalness={0.02} />
        </mesh>
      )}

      {/* 3. Floor-to-Ceiling Door Jamb Posts */}
      {[doorStartZ, doorEndZ].map((jambZ, i) => (
        <mesh key={i} position={[0, ROOM_HEIGHT / 2, jambZ]} castShadow>
          <boxGeometry args={[WALL_THICKNESS + 0.02, ROOM_HEIGHT, 0.08]} />
          <meshStandardMaterial color="#1a1c22" roughness={0.6} metalness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

function LoungeReadingCorner({ accentOn = true }) {
  // Cozy reading armchair in the front-right corner overlooking the windows
  const posX = STUDY_FAR_X - 1.1
  const posZ = 1.6
  const seatH = 0.42

  return (
    <group position={[posX, 0, posZ]}>
      {/* Cognac Leather Lounge Armchair */}
      <group rotation={[0, -Math.PI / 5, 0]}>
        {/* Seat Cushion */}
        <mesh position={[0, seatH, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.78, 0.16, 0.76]} />
          <meshStandardMaterial color="#8a532d" roughness={0.65} metalness={0.15} />
        </mesh>
        {/* Curved Backrest */}
        <mesh position={[0, seatH + 0.36, -0.32]} rotation={[-0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.78, 0.58, 0.14]} />
          <meshStandardMaterial color="#8a532d" roughness={0.65} metalness={0.15} />
        </mesh>
        {/* Armrests */}
        {[-0.38, 0.38].map((ax) => (
          <mesh key={ax} position={[ax, seatH + 0.18, 0]}>
            <boxGeometry args={[0.1, 0.32, 0.74]} />
            <meshStandardMaterial color="#7a4623" roughness={0.65} metalness={0.15} />
          </mesh>
        ))}
        {/* Brass Legs */}
        {[-0.34, 0.34].map((lx) =>
          [-0.3, 0.3].map((lz) => (
            <mesh key={`${lx}-${lz}`} position={[lx, seatH / 2 - 0.04, lz]}>
              <cylinderGeometry args={[0.015, 0.01, seatH - 0.08, 12]} />
              <meshStandardMaterial color={GOLD_ACCENT} roughness={0.3} metalness={0.85} />
            </mesh>
          )),
        )}
      </group>

      {/* Modern Brass Floor Task Lamp */}
      <group position={[0.7, 0, -0.4]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.04, 16]} />
          <meshStandardMaterial color="#1a1c1f" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 1.7, 10]} />
          <meshStandardMaterial color={GOLD_ACCENT} roughness={0.3} metalness={0.85} />
        </mesh>
        <mesh position={[-0.18, 1.65, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.009, 0.009, 0.35, 10]} />
          <meshStandardMaterial color={GOLD_ACCENT} roughness={0.3} metalness={0.85} />
        </mesh>
        <mesh position={[-0.3, 1.7, 0]} rotation={[0, 0, Math.PI / 3]}>
          <coneGeometry args={[0.08, 0.16, 16, 1, true]} />
          <meshStandardMaterial color="#1a1c1f" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.3, 1.68, 0]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial
            color={WARM_GLOW}
            emissive={WARM_GLOW}
            emissiveIntensity={accentOn ? 2.8 : 0}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

function StudyRug() {
  return (
    <mesh position={[STUDY_CENTER_X + 0.2, 0.008, -2.1]} receiveShadow>
      <boxGeometry args={[2.7, 0.015, 2.5]} />
      <meshStandardMaterial color={RUG_COLOR} roughness={0.95} metalness={0.05} />
    </mesh>
  )
}

function ExecutiveRingChandelier({ position, glowColor }) {
  const ringRef = useRef()

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = clock.getElapsedTime() * 0.14
    }
  })

  return (
    <group position={position}>
      {/* Ceiling Canopy Cap */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.025, 20]} />
        <meshStandardMaterial color={GOLD_ACCENT} roughness={0.25} metalness={0.9} />
      </mesh>
      {/* Suspension Wire */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.45, 8]} />
        <meshStandardMaterial color="#111215" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Rotating Interlocking Gold Halo Ring */}
      <group ref={ringRef}>
        <mesh castShadow>
          <torusGeometry args={[0.42, 0.014, 16, 36]} />
          <meshStandardMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Glowing Center Core */}
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={glowColor}
            emissive={glowColor}
            emissiveIntensity={3.0}
            toneMapped={false}
          />
        </mesh>
      </group>

      <pointLight color={glowColor} intensity={0.8} distance={4.5} decay={2} position={[0, 0, 0]} />
    </group>
  )
}

function LinearMagneticTrack({ position, length }) {
  const width = 0.055
  const depth = 0.035

  return (
    <group position={position}>
      <mesh position={[0, depth / 2, 0]}>
        <boxGeometry args={[width, depth, length]} />
        <meshStandardMaterial color={TRACK_BLACK} roughness={0.6} metalness={0.7} />
      </mesh>
      {/* Micro Magnetic Brass Spots */}
      {[-length * 0.25, length * 0.25].map((offset, i) => (
        <group key={i} position={[0, -0.015, offset]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.04, 12]} />
            <meshStandardMaterial color={GOLD_ACCENT} roughness={0.3} metalness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function LinearACSlotVent({ position, length }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[length, 0.015, 0.12]} />
        <meshStandardMaterial color="#111215" roughness={0.5} metalness={0.6} />
      </mesh>
      {/* Center Louver Deflector */}
      <mesh position={[0, -0.005, 0]}>
        <boxGeometry args={[length - 0.04, 0.01, 0.008]} />
        <meshStandardMaterial color="#8e929a" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  )
}

function StudyFalseCeiling({
  downlightColor = '#fff3da',
  glowColor = '#fff3da',
  intensity = 2.4,
}) {
  const cofferW = STUDY_WIDTH - 0.8 // 4.0m
  const cofferD = STUDY_DEPTH - 0.8 // 6.2m

  const downlightPositions = [
    // Over Desk & Monitors
    [STUDY_CENTER_X - 0.9, TIER2_Y - 0.02, -0.8],
    [STUDY_CENTER_X + 0.9, TIER2_Y - 0.02, -0.8],
    // Over Bookshelf & Reading Lounge
    [STUDY_CENTER_X - 0.9, TIER2_Y - 0.02, 1.4],
    [STUDY_CENTER_X + 0.9, TIER2_Y - 0.02, 1.4],
  ]

  return (
    <group>
      {/* 1. Structural Sub-Ceiling */}
      <mesh position={[STUDY_CENTER_X, ROOM_HEIGHT + WALL_THICKNESS / 2, 0]} receiveShadow>
        <boxGeometry args={[STUDY_WIDTH, WALL_THICKNESS, STUDY_DEPTH]} />
        <meshStandardMaterial color={CEILING_COLOR} roughness={0.95} metalness={0} />
      </mesh>

      {/* 2. Tier 1 Perimeter False Ceiling Drop */}
      <mesh position={[STUDY_CENTER_X, TIER1_Y, 0]} receiveShadow>
        <boxGeometry args={[STUDY_WIDTH - 0.3, 0.04, STUDY_DEPTH - 0.3]} />
        <meshStandardMaterial color="#ded7cc" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* 3. Tier 2 Floating Executive Coffer Tray */}
      <group position={[STUDY_CENTER_X, 0, 0]}>
        <mesh position={[0, TIER2_Y, 0]} receiveShadow>
          <boxGeometry args={[cofferW, 0.045, cofferD]} />
          <meshStandardMaterial color="#e8e3d8" roughness={0.85} metalness={0.05} />
        </mesh>

        {/* 4-Sided Continuous Warm LED Cove Lighting Troughs */}
        <mesh position={[0, COVE2_Y, -cofferD / 2]}>
          <boxGeometry args={[cofferW, STRIP_T, STRIP_T]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={3.0} toneMapped={false} />
        </mesh>
        <mesh position={[0, COVE2_Y, cofferD / 2]}>
          <boxGeometry args={[cofferW, STRIP_T, STRIP_T]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={3.0} toneMapped={false} />
        </mesh>
        <mesh position={[-cofferW / 2, COVE2_Y, 0]}>
          <boxGeometry args={[STRIP_T, STRIP_T, cofferD]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={3.0} toneMapped={false} />
        </mesh>
        <mesh position={[cofferW / 2, COVE2_Y, 0]}>
          <boxGeometry args={[STRIP_T, STRIP_T, cofferD]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={3.0} toneMapped={false} />
        </mesh>

        {/* Linear Magnetic Lighting Tracks */}
        <LinearMagneticTrack position={[-cofferW * 0.28, TIER2_Y - 0.02, 0]} length={cofferD * 0.7} />
        <LinearMagneticTrack position={[cofferW * 0.28, TIER2_Y - 0.02, 0]} length={cofferD * 0.7} />

        {/* Architectural Linear AC Slot Diffusers */}
        <LinearACSlotVent position={[0, TIER2_Y - 0.022, -cofferD / 2 + 0.25]} length={cofferW * 0.8} />
        <LinearACSlotVent position={[0, TIER2_Y - 0.022, cofferD / 2 - 0.25]} length={cofferW * 0.8} />

        {/* Statement Executive Gold Halo Chandelier */}
        <ExecutiveRingChandelier position={[0, TIER2_Y - 0.5, 0.2]} glowColor={glowColor} />
      </group>

      {/* 4. Downlight Diodes with Bloom Emissive Glow */}
      {downlightPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.075, 18]} />
            <meshStandardMaterial color="#1a1a1c" roughness={0.5} metalness={0.4} />
          </mesh>
          <mesh position={[0, -0.005, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.054, 18]} />
            <meshStandardMaterial
              color={downlightColor}
              emissive={downlightColor}
              emissiveIntensity={intensity * 1.4}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function StudyShell({ downlightColor, glowColor, accentOn }) {
  return (
    <group>
      {/* Hardwood Floor */}
      <mesh position={[STUDY_CENTER_X, -WALL_THICKNESS / 2, 0]} receiveShadow>
        <boxGeometry args={[STUDY_WIDTH, WALL_THICKNESS, STUDY_DEPTH]} />
        <meshStandardMaterial color={FLOOR_COLOR} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Light-colored Dividing Wall between Study and Foyer */}
      <StudyDividingWall />

      {/* Dual Aspect Corner Window Walls */}
      <CornerWindowWalls />

      {/* Luxury Executive False Ceiling System */}
      <StudyFalseCeiling
        downlightColor={downlightColor}
        glowColor={glowColor}
        intensity={2.4}
      />
    </group>
  )
}

export default function StudyRoom({
  downlightColor = '#fff3da',
  glowColor = '#fff3da',
  accentOn = true,
}) {
  return (
    <group>
      <StudyShell downlightColor={downlightColor} glowColor={glowColor} accentOn={accentOn} />
      <StudyRug />
      <StudyDesk accentOn={accentOn} />
      <StudyBookshelf accentOn={accentOn} />
      <LoungeReadingCorner accentOn={accentOn} />
    </group>
  )
}
