import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  HALL_CENTER_X,
  HALL_DEPTH,
  HALL_HEIGHT,
  HALL_ORIGIN_X,
  HALL_WIDTH,
} from './dimensions'

const DROP_TIER1 = 0.12
const DROP_TIER2 = 0.22
const TIER1_Y = HALL_HEIGHT - DROP_TIER1
const TIER2_Y = HALL_HEIGHT - DROP_TIER2
const COVE1_Y = HALL_HEIGHT - DROP_TIER1 / 2
const COVE2_Y = TIER1_Y - (DROP_TIER2 - DROP_TIER1) / 2

const GOLD_ACCENT = '#d4af37'
const TRACK_BLACK = '#111215'

function CoveLightingStrip({ position, size, color, intensity = 2.4 }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
        toneMapped={false}
      />
    </mesh>
  )
}

function DownlightSpot({ position, color, intensity }) {
  return (
    <group position={position}>
      {/* Outer Flush Bezel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.075, 24]} />
        <meshStandardMaterial color="#1a1a1c" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Inner Lens */}
      <mesh position={[0, -0.004, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.052, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity}
          toneMapped={false}
        />
      </mesh>
      <spotLight
        color={color}
        intensity={intensity * 0.75}
        distance={3.8}
        angle={0.5}
        penumbra={0.65}
        decay={2}
        position={[0, 0, 0]}
        target-position={[position[0], 0, position[2]]}
      />
    </group>
  )
}

function LinearMagneticTrack({ position, length, isRotated = false }) {
  const width = 0.055
  const depth = 0.035
  const size = isRotated ? [length, depth, width] : [width, depth, length]

  return (
    <group position={position}>
      {/* Recessed Black Track Channel */}
      <mesh position={[0, depth / 2, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={TRACK_BLACK} roughness={0.6} metalness={0.7} />
      </mesh>
      {/* Micro Magnetic Spots in Track */}
      {[-length * 0.28, length * 0.28].map((offset, i) => (
        <group
          key={i}
          position={isRotated ? [offset, -0.02, 0] : [0, -0.02, offset]}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.045, 16]} />
            <meshStandardMaterial color={GOLD_ACCENT} roughness={0.3} metalness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function LinearACSlotVent({ position, length, isRotated = false }) {
  const width = 0.16
  const height = 0.022
  const slotCount = 10
  const size = isRotated ? [width, height, length] : [length, height, width]

  return (
    <group position={position}>
      {/* Outer Flanged Housing Frame in Matte Black */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#111215" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Recessed Air Slot Cavity */}
      <mesh position={[0, -0.006, 0]}>
        <boxGeometry
          args={
            isRotated
              ? [width - 0.03, 0.01, length - 0.04]
              : [length - 0.04, 0.01, width - 0.03]
          }
        />
        <meshStandardMaterial color="#050608" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Continuous Center Louver Deflector Blades */}
      {[-0.035, 0, 0.035].map((off, idx) => (
        <mesh
          key={idx}
          position={isRotated ? [off, -0.008, 0] : [0, -0.008, off]}
        >
          <boxGeometry
            args={
              isRotated
                ? [0.006, 0.014, length - 0.06]
                : [length - 0.06, 0.014, 0.006]
            }
          />
          <meshStandardMaterial color="#8e929a" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}

      {/* Segment Spacers */}
      {new Array(slotCount).fill(0).map((_, i) => {
        const offset = -length / 2 + ((i + 0.5) * length) / slotCount
        return (
          <mesh
            key={`s-${i}`}
            position={isRotated ? [0, -0.006, offset] : [offset, -0.006, 0]}
          >
            <boxGeometry
              args={isRotated ? [width - 0.02, 0.012, 0.012] : [0.012, 0.012, width - 0.02]}
            />
            <meshStandardMaterial color="#22252a" roughness={0.4} metalness={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

function StatementLivingChandelier({ position, glowColor }) {
  const ringRef1 = useRef()
  const ringRef2 = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.15
    if (ringRef1.current) {
      ringRef1.current.rotation.y = t * 0.4
      ringRef1.current.rotation.x = Math.sin(t * 0.3) * 0.08
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y = -t * 0.35 + Math.PI / 4
      ringRef2.current.rotation.z = Math.cos(t * 0.25) * 0.08
    }
  })

  return (
    <group position={position}>
      {/* Suspension Wire */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.8, 8]} />
        <meshStandardMaterial color="#111215" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Ceiling Canopy Cap */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.025, 24]} />
        <meshStandardMaterial color={GOLD_ACCENT} roughness={0.25} metalness={0.9} />
      </mesh>

      {/* Primary Interlocking Halo Ring */}
      <group ref={ringRef1} position={[0, 0.05, 0]} rotation={[0.15, 0, 0.1]}>
        <mesh castShadow>
          <torusGeometry args={[0.62, 0.018, 16, 48]} />
          <meshStandardMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.62, 0.012, 16, 48]} />
          <meshStandardMaterial
            color={glowColor}
            emissive={glowColor}
            emissiveIntensity={2.8}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Secondary Nested Halo Ring */}
      <group ref={ringRef2} position={[0, -0.15, 0]} rotation={[-0.2, 0.4, -0.1]}>
        <mesh castShadow>
          <torusGeometry args={[0.42, 0.016, 16, 48]} />
          <meshStandardMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.42, 0.01, 16, 48]} />
          <meshStandardMaterial
            color={glowColor}
            emissive={glowColor}
            emissiveIntensity={2.6}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Warm Ambient Center Point Light */}
      <pointLight
        color={glowColor}
        intensity={0.65}
        distance={3.8}
        decay={2}
        position={[0, -0.05, 0]}
      />
    </group>
  )
}

export default function HallCeilingLighting({
  downlightColor = '#fff3da',
  glowColor = '#fff3da',
  intensity = 1.8,
}) {
  // Living Area Coffer Tray Dimensions (Left half of Hall)
  const livingX = HALL_ORIGIN_X + 2.6
  const livingZ = 0.4
  const livingW = 4.4
  const livingD = 4.8

  // Kitchen / Dining Island Coffer Tray Dimensions (Right half of Hall)
  const kitchenX = HALL_ORIGIN_X + 7.0
  const kitchenZ = -0.5
  const kitchenW = 3.6
  const kitchenD = 4.4

  const stripT = 0.035

  const downlightPositions = [
    // Living Area downlights
    [livingX - 1.5, TIER2_Y - 0.02, livingZ - 1.6],
    [livingX + 1.5, TIER2_Y - 0.02, livingZ - 1.6],
    [livingX - 1.5, TIER2_Y - 0.02, livingZ + 1.6],
    [livingX + 1.5, TIER2_Y - 0.02, livingZ + 1.6],

    // Kitchen Area downlights
    [kitchenX - 1.1, TIER1_Y - 0.02, kitchenZ - 1.5],
    [kitchenX + 1.1, TIER1_Y - 0.02, kitchenZ - 1.5],
    [kitchenX - 1.1, TIER1_Y - 0.02, kitchenZ + 1.5],
    [kitchenX + 1.1, TIER1_Y - 0.02, kitchenZ + 1.5],
  ]

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. PRIMARY PERIMETER FALSE CEILING DROP TIER 1               */}
      {/* ============================================================ */}
      <mesh position={[HALL_CENTER_X, TIER1_Y, 0]} receiveShadow>
        <boxGeometry args={[HALL_WIDTH - 0.4, 0.04, HALL_DEPTH - 0.4]} />
        <meshStandardMaterial color="#ded7cb" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Perimeter Ambient Halo Cove Lighting */}
      <CoveLightingStrip
        position={[HALL_CENTER_X, COVE1_Y, -(HALL_DEPTH - 0.4) / 2]}
        size={[HALL_WIDTH - 0.4, stripT, stripT]}
        color={glowColor}
      />
      <CoveLightingStrip
        position={[HALL_CENTER_X, COVE1_Y, (HALL_DEPTH - 0.4) / 2]}
        size={[HALL_WIDTH - 0.4, stripT, stripT]}
        color={glowColor}
      />
      <CoveLightingStrip
        position={[HALL_ORIGIN_X + 0.2, COVE1_Y, 0]}
        size={[stripT, stripT, HALL_DEPTH - 0.4]}
        color={glowColor}
      />
      <CoveLightingStrip
        position={[HALL_ORIGIN_X + HALL_WIDTH - 0.2, COVE1_Y, 0]}
        size={[stripT, stripT, HALL_DEPTH - 0.4]}
        color={glowColor}
      />

      {/* ============================================================ */}
      {/* 2. ARCHITECTURAL LIVING AREA COFFER TRAY (Floating Tier 2)  */}
      {/* ============================================================ */}
      <group position={[livingX, 0, livingZ]}>
        <mesh position={[0, TIER2_Y, 0]} receiveShadow>
          <boxGeometry args={[livingW, 0.045, livingD]} />
          <meshStandardMaterial color="#e5e0d5" roughness={0.85} metalness={0.05} />
        </mesh>

        {/* Cove lighting around Living Coffer */}
        {[-1, 1].map((side) => (
          <CoveLightingStrip
            key={`lh-${side}`}
            position={[0, COVE2_Y, side * (livingD / 2)]}
            size={[livingW, stripT, stripT]}
            color={glowColor}
            intensity={2.8}
          />
        ))}
        {[-1, 1].map((side) => (
          <CoveLightingStrip
            key={`lv-${side}`}
            position={[side * (livingW / 2), COVE2_Y, 0]}
            size={[stripT, stripT, livingD]}
            color={glowColor}
            intensity={2.8}
          />
        ))}

        {/* Linear Magnetic Lighting Tracks embedded in Coffer */}
        <LinearMagneticTrack
          position={[-livingW * 0.32, TIER2_Y - 0.02, 0]}
          length={livingD * 0.72}
        />
        <LinearMagneticTrack
          position={[livingW * 0.32, TIER2_Y - 0.02, 0]}
          length={livingD * 0.72}
        />

        {/* Prominent Linear AC Slot Diffuser on Front Edge of Living Coffer */}
        <LinearACSlotVent
          position={[0, TIER2_Y - 0.024, livingD / 2 - 0.25]}
          length={livingW * 0.82}
        />

        {/* Prominent Linear AC Slot Diffuser on Rear Edge of Living Coffer */}
        <LinearACSlotVent
          position={[0, TIER2_Y - 0.024, -livingD / 2 + 0.25]}
          length={livingW * 0.82}
        />

        {/* Statement Modern Sculptural Gold Ring Chandelier */}
        <StatementLivingChandelier
          position={[0, TIER2_Y - 0.6, 0]}
          glowColor={glowColor}
        />
      </group>

      {/* ============================================================ */}
      {/* 3. KITCHEN / ISLAND ARCHITECTURAL LIGHTING TRAY             */}
      {/* ============================================================ */}
      <group position={[kitchenX, 0, kitchenZ]}>
        <mesh position={[0, TIER2_Y, 0]} receiveShadow>
          <boxGeometry args={[kitchenW, 0.045, kitchenD]} />
          <meshStandardMaterial color="#e5e0d5" roughness={0.85} metalness={0.05} />
        </mesh>

        {/* Cove lighting around Kitchen Tray */}
        {[-1, 1].map((side) => (
          <CoveLightingStrip
            key={`kh-${side}`}
            position={[0, COVE2_Y, side * (kitchenD / 2)]}
            size={[kitchenW, stripT, stripT]}
            color={glowColor}
            intensity={2.6}
          />
        ))}
        {[-1, 1].map((side) => (
          <CoveLightingStrip
            key={`kv-${side}`}
            position={[side * (kitchenW / 2), COVE2_Y, 0]}
            size={[stripT, stripT, kitchenD]}
            color={glowColor}
            intensity={2.6}
          />
        ))}

        {/* Transverse Magnetic Light Track over island */}
        <LinearMagneticTrack
          position={[0, TIER2_Y - 0.02, 0]}
          length={kitchenW * 0.75}
          isRotated={true}
        />

        {/* Prominent Linear AC Slot Diffuser over Kitchen / Dining Zone */}
        <LinearACSlotVent
          position={[0, TIER2_Y - 0.024, kitchenD / 2 - 0.25]}
          length={kitchenW * 0.8}
        />
      </group>

      {/* ============================================================ */}
      {/* 4. RECESSED DOWNLIGHTS                                       */}
      {/* ============================================================ */}
      {downlightPositions.map((pos, i) => (
        <DownlightSpot
          key={i}
          position={pos}
          color={downlightColor}
          intensity={intensity}
        />
      ))}
    </group>
  )
}
