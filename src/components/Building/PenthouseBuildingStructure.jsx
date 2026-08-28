import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ROOM_HEIGHT, WALL_THICKNESS } from '../Room/dimensions'

const STEEL_BLACK = '#1c1c1e'
const SLAB_CONCRETE = '#24252a'
const ROOF_CONCRETE = '#e0dbd2'  // Light warm concrete for roof
const ACCENT_GOLD = '#d4af37'
const GLASS_TINTED = '#161c28'
const WARM_WINDOW_GLOW = '#ffe0b2'
const NEON_COLOR = '#ff1a1a'  // Red neon for SEV3N

const ROOM_COLUMN_LINES = [-8.00, -5.40, -3.10, 3.10, 8.60, 12.80, 17.60]

const BUILDING_MIN_X = -8.00
const BUILDING_MAX_X = 17.60
const BUILDING_WIDTH = BUILDING_MAX_X - BUILDING_MIN_X // 25.60m
const BUILDING_CENTER_X = (BUILDING_MIN_X + BUILDING_MAX_X) / 2 // +4.80m
const BUILDING_DEPTH = 7.00
const BUILDING_CENTER_Z = 0.0

// ============================================================================
// "7" SYMBOL NEON SIGN + "SEVEN TOWERS" SUBTITLE
// ============================================================================
function NeonSign({ accentOn = true }) {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    const flicker = 0.90 + 0.10 * Math.sin(t * 2.3) * Math.cos(t * 0.8)
    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material?.name === 'neon-tube') {
        child.material.emissiveIntensity = accentOn ? 5.5 * flicker : 0
      }
      if (child.isMesh && child.material?.name === 'neon-sub') {
        child.material.emissiveIntensity = accentOn ? 3.0 * flicker : 0
      }
    })
  })

  // ── "7" symbol geometry ──
  // NOTE: parent sign group has rotation.y = PI (faces outward), so x is flipped.
  // All x values are PRE-MIRRORED here so the "7" reads correctly from outside.

  const T = 0.10          // tube thickness
  const H = 2.20          // total numeral height
  const W = 1.40          // total numeral width

  const sevenSegs = [
    // Top horizontal bar (symmetric — no change needed)
    { x: 0,          y: H / 2,    w: W,        h: T,   rz: 0 },
    // Mid serif — mirrored: was -W*0.10, now +W*0.10
    { x: W * 0.10,   y: H * 0.15, w: W * 0.55, h: T,   rz: 0 },
    // Main diagonal stroke — mirrored x, negated rz
    { x: -W * 0.05,  y: H * 0.17, w: T,         h: H * 0.82, rz: -Math.PI / 6 },
  ]

  // ── "SEVEN TOWERS" subtitle (small tube letters using thin boxes) ──
  const subText = 'SEVEN TOWERS'
  const subT = 0.028
  const subLW = 0.12
  const subLH = 0.22
  const subGap = 0.16
  const spaceGap = 0.10
  const subTotalW = subText.split('').reduce((acc, c) => acc + (c === ' ' ? spaceGap : subGap), 0)
  let subX = -subTotalW / 2

  const subSegs = []
  subText.split('').forEach((char, ci) => {
    if (char === ' ') { subX += spaceGap; return }
    // Simple 3-bar letter representation (top, mid, bot horizontal stubs)
    subSegs.push({ x: subX + subLW / 2, y: subLH,       w: subLW, h: subT })
    subSegs.push({ x: subX + subLW / 2, y: subLH / 2,   w: subLW, h: subT })
    subSegs.push({ x: subX + subLW / 2, y: 0,            w: subLW, h: subT })
    subSegs.push({ x: subX + subT / 2,  y: subLH * 0.75, w: subT,  h: subLH * 0.50 })
    subX += subGap
  })

  return (
    <group ref={groupRef}>
      {/* Dark anodised backing panel */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[W + 1.20, H + 0.80, 0.08]} />
        <meshPhysicalMaterial color="#09090b" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Gold border frame */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[W + 1.24, H + 0.84, 0.02]} />
        <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.2} metalness={0.95} wireframe />
      </mesh>

      {/* Big "7" neon tubes */}
      {sevenSegs.map((s, i) => (
        <mesh key={`7-${i}`} position={[s.x, s.y, 0.05]} rotation={[0, 0, s.rz]} castShadow>
          <boxGeometry args={[s.w, s.h, T * 0.7]} />
          <meshStandardMaterial
            name="neon-tube"
            color={NEON_COLOR}
            emissive={NEON_COLOR}
            emissiveIntensity={accentOn ? 5.5 : 0}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* "SEVEN TOWERS" subtitle strip */}
      <group position={[0, -H / 2 - 0.28, 0.05]}>
        {subSegs.map((s, i) => (
          <mesh key={`sub-${i}`} position={[s.x, s.y, 0]}>
            <boxGeometry args={[s.w, s.h, subT]} />
            <meshStandardMaterial
              name="neon-sub"
              color={NEON_COLOR}
              emissive={NEON_COLOR}
              emissiveIntensity={accentOn ? 3.0 : 0}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* Static (non-animated) soft red ambient wash — tiny range, no flicker */}
      <pointLight color={NEON_COLOR} intensity={accentOn ? 1.2 : 0} distance={2.5} decay={2} position={[0, 0, 0.8]} />
    </group>
  )
}

// ============================================================================
// AIRCRAFT WARNING BEACON (red blinking obstruction light)
// ============================================================================

function AircraftWarningLight({ position }) {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    // ICAO double-flash: two 120ms pulses per 1.4s cycle
    const cycle = t % 1.4
    const isOn = (cycle >= 0.0 && cycle < 0.12) || (cycle >= 0.30 && cycle < 0.42)

    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material?.name === 'beacon-bulb') {
        child.material.emissiveIntensity = isOn ? 9.0 : 0.04
        child.material.color.setHex(isOn ? 0xff1010 : 0x880000)
      }
      if (child.isMesh && child.material?.name === 'beacon-halo') {
        child.material.opacity = isOn ? 0.55 : 0.0
      }
    })
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Steel mast */}
      <mesh position={[0, 0.50, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.028, 1.0, 10]} />
        <meshPhysicalMaterial color="#2a2a2e" roughness={0.4} metalness={0.85} />
      </mesh>
      {/* Outer dark red dome */}
      <mesh position={[0, 1.08, 0]} castShadow>
        <sphereGeometry args={[0.090, 20, 14]} />
        <meshPhysicalMaterial color="#5a0000" roughness={0.2} metalness={0.5} clearcoat={0.9} />
      </mesh>
      {/* Glowing emissive bulb — blink driven entirely by emissiveIntensity */}
      <mesh position={[0, 1.08, 0]}>
        <sphereGeometry args={[0.072, 20, 14]} />
        <meshStandardMaterial
          name="beacon-bulb"
          color="#880000"
          emissive="#ff1010"
          emissiveIntensity={0.04}
          toneMapped={false}
        />
      </mesh>
      {/* Soft halo sphere that fades in when ON — no pointLight, no floor spill */}
      <mesh position={[0, 1.08, 0]}>
        <sphereGeometry args={[0.18, 16, 10]} />
        <meshStandardMaterial
          name="beacon-halo"
          color="#ff2020"
          emissive="#ff2020"
          emissiveIntensity={1.0}
          transparent
          opacity={0.0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// ============================================================================
// PENTHOUSE ROOFTOP
// ============================================================================
function PenthouseRoof({ penthouseTopY, accentOn = true }) {
  const roofT = 0.30
  const parapetH = 0.95
  const signH = 1.10 + 0.55  // LH + padding

  // Roof slab Y center
  const roofY = penthouseTopY + roofT / 2
  // Parapet top Y
  const parapetTopY = penthouseTopY + roofT + parapetH
  const parapetCenterY = penthouseTopY + roofT + parapetH / 2

  // Sign sits on REAR exterior face — pushed fully outside parapet (parapet depth = 0.22m, center at -3.60m, so exterior face ~= -3.71m)
  const signZRear = -(BUILDING_DEPTH / 2 + 0.42)  // fully outside exterior parapet face
  const signY = penthouseTopY + roofT + parapetH * 0.55  // slightly above parapet mid

  return (
    <group>
      {/* ── 1. MAIN FLAT CONCRETE ROOF SLAB (light warm, flush) ── */}
      <mesh position={[BUILDING_CENTER_X, roofY, BUILDING_CENTER_Z]} castShadow receiveShadow>
        <boxGeometry args={[BUILDING_WIDTH, roofT, BUILDING_DEPTH]} />
        <meshPhysicalMaterial color={ROOF_CONCRETE} roughness={0.75} metalness={0.05} />
      </mesh>

      {/* ── 2. SLIM GOLD EDGE FASCIA AROUND ROOF PERIMETER ── */}
      {/* Front edge */}
      <mesh position={[BUILDING_CENTER_X, penthouseTopY + roofT, BUILDING_DEPTH / 2]}>
        <boxGeometry args={[BUILDING_WIDTH, 0.06, 0.12]} />
        <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.18} metalness={0.95} />
      </mesh>
      {/* Rear edge */}
      <mesh position={[BUILDING_CENTER_X, penthouseTopY + roofT, -BUILDING_DEPTH / 2]}>
        <boxGeometry args={[BUILDING_WIDTH, 0.06, 0.12]} />
        <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.18} metalness={0.95} />
      </mesh>
      {/* Left edge */}
      <mesh position={[BUILDING_MIN_X, penthouseTopY + roofT, BUILDING_CENTER_Z]}>
        <boxGeometry args={[0.12, 0.06, BUILDING_DEPTH]} />
        <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.18} metalness={0.95} />
      </mesh>
      {/* Right edge */}
      <mesh position={[BUILDING_MAX_X, penthouseTopY + roofT, BUILDING_CENTER_Z]}>
        <boxGeometry args={[0.12, 0.06, BUILDING_DEPTH]} />
        <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.18} metalness={0.95} />
      </mesh>

      {/* ── 3. PARAPET WALLS (all 4 sides, same light concrete as roof) ── */}
      {/* Rear parapet — holds the neon sign, rotate sign group to face outward */}
      <mesh position={[BUILDING_CENTER_X, parapetCenterY, -BUILDING_DEPTH / 2 - 0.10]} castShadow>
        <boxGeometry args={[BUILDING_WIDTH + 0.20, parapetH, 0.22]} />
        <meshPhysicalMaterial color={ROOF_CONCRETE} roughness={0.75} metalness={0.05} />
      </mesh>
      {/* Front parapet — holds the neon sign */}
      <mesh position={[BUILDING_CENTER_X, parapetCenterY, BUILDING_DEPTH / 2 + 0.10]} castShadow>
        <boxGeometry args={[BUILDING_WIDTH + 0.20, parapetH, 0.22]} />
        <meshPhysicalMaterial color={ROOF_CONCRETE} roughness={0.75} metalness={0.05} />
      </mesh>
      {/* Left parapet */}
      <mesh position={[BUILDING_MIN_X - 0.10, parapetCenterY, BUILDING_CENTER_Z]} castShadow>
        <boxGeometry args={[0.22, parapetH, BUILDING_DEPTH + 0.40]} />
        <meshPhysicalMaterial color={ROOF_CONCRETE} roughness={0.75} metalness={0.05} />
      </mesh>
      {/* Right parapet */}
      <mesh position={[BUILDING_MAX_X + 0.10, parapetCenterY, BUILDING_CENTER_Z]} castShadow>
        <boxGeometry args={[0.22, parapetH, BUILDING_DEPTH + 0.40]} />
        <meshPhysicalMaterial color={ROOF_CONCRETE} roughness={0.75} metalness={0.05} />
      </mesh>

      {/* ── 4. GOLD PARAPET CAP RAIL ── */}
      <mesh position={[BUILDING_CENTER_X, parapetTopY, BUILDING_CENTER_Z]}>
        <boxGeometry args={[BUILDING_WIDTH + 0.44, 0.07, BUILDING_DEPTH + 0.44]} />
        <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.18} metalness={0.95} />
      </mesh>

      {/* ── 5. SEV3N NEON SIGN on REAR PARAPET FACE (rotated to face outward) ── */}
      <group position={[BUILDING_CENTER_X, signY, signZRear]} rotation={[0, Math.PI, 0]}>
        <NeonSign accentOn={accentOn} />
      </group>

      {/* ── 6. AIRCRAFT OBSTRUCTION WARNING LIGHTS ── */}
      {/* Central top beacon on mast */}
      <AircraftWarningLight
        position={[BUILDING_CENTER_X, parapetTopY, BUILDING_CENTER_Z]}
      />
      {/* Left corner beacon */}
      <AircraftWarningLight
        position={[BUILDING_MIN_X + 0.50, parapetTopY, BUILDING_CENTER_Z]}
      />
      {/* Right corner beacon */}
      <AircraftWarningLight
        position={[BUILDING_MAX_X - 0.50, parapetTopY, BUILDING_CENTER_Z]}
      />
    </group>
  )
}

// ============================================================================
// INSTANCED STEEL MULLIONS + COLUMNS (all floors combined into one draw call)
// ============================================================================
function SteelFrameInstances({ boxes }) {
  const meshRef = useRef()

  useLayoutEffect(() => {
    if (!meshRef.current) return
    const m = new THREE.Matrix4()
    const pos = new THREE.Vector3()
    const scale = new THREE.Vector3()
    const quat = new THREE.Quaternion()
    boxes.forEach((b, i) => {
      pos.set(b.position[0], b.position[1], b.position[2])
      scale.set(b.scale[0], b.scale[1], b.scale[2])
      m.compose(pos, quat, scale)
      meshRef.current.setMatrixAt(i, m)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [boxes])

  return (
    <instancedMesh ref={meshRef} args={[null, null, boxes.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={STEEL_BLACK} roughness={0.35} metalness={0.85} />
    </instancedMesh>
  )
}

// ============================================================================
// MAIN BUILDING STRUCTURE EXPORT
// ============================================================================
export default function PenthouseBuildingStructure({ accentOn = true }) {
  const floorHeight = ROOM_HEIGHT // 4.20m
  // Only the floors visible from the "Whole View" / "Freestyle" presets are rendered —
  // the tower reads as tall from that angle without paying for floors nothing ever frames.
  const totalFloors = 3
  const baySpacing = 1.18
  const penthouseTopY = ROOM_HEIGHT + WALL_THICKNESS

  const steelBoxes = useMemo(() => {
    const boxes = []
    const colH = floorHeight - 0.24
    const mullionCount = Math.round(BUILDING_WIDTH / baySpacing) + 1

    for (let fIdx = 0; fIdx < totalFloors; fIdx++) {
      const floorBaseY = -(fIdx + 1) * floorHeight
      const floorCenterY = floorBaseY + floorHeight / 2

      // Room boundary columns (front + rear, per column line)
      ROOM_COLUMN_LINES.forEach((colX) => {
        boxes.push({ position: [colX, floorCenterY, -BUILDING_DEPTH / 2], scale: [0.16, colH, 0.18] })
        boxes.push({ position: [colX, floorCenterY, BUILDING_DEPTH / 2], scale: [0.16, colH, 0.18] })
      })

      // Mullions along the rear glazing
      for (let bIdx = 0; bIdx < mullionCount; bIdx++) {
        const mx = BUILDING_MIN_X + bIdx * baySpacing
        if (mx > BUILDING_MAX_X) continue
        boxes.push({ position: [mx, floorCenterY, -BUILDING_DEPTH / 2], scale: [0.06, colH, 0.14] })
      }

      // Mid transom rail
      boxes.push({
        position: [BUILDING_CENTER_X, floorBaseY + floorHeight * 0.50, -BUILDING_DEPTH / 2],
        scale: [BUILDING_WIDTH, 0.06, 0.12],
      })
    }

    return boxes
  }, [floorHeight, totalFloors, baySpacing])

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Structural Slab under Penthouse Floor — y=-0.20 so top=−0.05, no z-fight with foyer floor at y=0 */}
      <group position={[BUILDING_CENTER_X, -0.20, BUILDING_CENTER_Z]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[BUILDING_WIDTH, 0.30, BUILDING_DEPTH]} />
          <meshPhysicalMaterial color={SLAB_CONCRETE} roughness={0.7} metalness={0.2} />
        </mesh>
        <mesh>
          <boxGeometry args={[BUILDING_WIDTH + 0.02, 0.06, BUILDING_DEPTH + 0.02]} />
          <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.2} metalness={0.95} />
        </mesh>
      </group>

      {/* 2. Repeating Lower Floors — slabs + glazing per floor, steel framing instanced below */}
      {new Array(totalFloors).fill(0).map((_, fIdx) => {
        const floorBaseY = -(fIdx + 1) * floorHeight
        const floorCenterY = floorBaseY + floorHeight / 2
        return (
          <group key={`floor-${fIdx}`}>
            {/* Floor slab */}
            <mesh position={[BUILDING_CENTER_X, floorBaseY, BUILDING_CENTER_Z]} receiveShadow>
              <boxGeometry args={[BUILDING_WIDTH, 0.24, BUILDING_DEPTH]} />
              <meshPhysicalMaterial color={SLAB_CONCRETE} roughness={0.65} metalness={0.25} />
            </mesh>
            <mesh position={[BUILDING_CENTER_X, floorBaseY, BUILDING_CENTER_Z]}>
              <boxGeometry args={[BUILDING_WIDTH + 0.02, 0.04, BUILDING_DEPTH + 0.02]} />
              <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.25} metalness={0.9} />
            </mesh>

            {/* Rear glazing */}
            <mesh position={[BUILDING_CENTER_X, floorCenterY, -BUILDING_DEPTH / 2]}>
              <boxGeometry args={[BUILDING_WIDTH - 0.04, floorHeight - 0.24, 0.04]} />
              <meshPhysicalMaterial color={GLASS_TINTED} transparent opacity={0.52} roughness={0.04} metalness={0.92} clearcoat={1.0} />
            </mesh>
            <mesh position={[BUILDING_CENTER_X, floorCenterY, -BUILDING_DEPTH / 2 + 0.15]}>
              <planeGeometry args={[BUILDING_WIDTH - 0.1, floorHeight - 0.3]} />
              <meshStandardMaterial color={WARM_WINDOW_GLOW} emissive={WARM_WINDOW_GLOW} emissiveIntensity={(fIdx % 2 === 0 ? 0.30 : 0.15) * (accentOn ? 1.0 : 0.2)} toneMapped={false} />
            </mesh>

            {/* Side glazing */}
            {[BUILDING_MIN_X, BUILDING_MAX_X].map((sx, sIdx) => (
              <mesh key={`sg-${sIdx}`} position={[sx, floorCenterY, BUILDING_CENTER_Z]}>
                <boxGeometry args={[0.04, floorHeight - 0.24, BUILDING_DEPTH - 0.04]} />
                <meshPhysicalMaterial color={GLASS_TINTED} transparent opacity={0.52} roughness={0.04} metalness={0.92} clearcoat={1.0} />
              </mesh>
            ))}
          </group>
        )
      })}

      {/* Instanced steel columns + mullions + transom rails for all 10 floors (1 draw call instead of ~370 meshes) */}
      <SteelFrameInstances boxes={steelBoxes} />

      {/* 3. Penthouse Rooftop with Parapet & SEV3N Neon Sign */}
      <PenthouseRoof penthouseTopY={penthouseTopY} accentOn={accentOn} />
    </group>
  )
}
