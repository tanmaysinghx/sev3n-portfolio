import * as THREE from 'three'
import { ROOM_DEPTH, ROOM_HEIGHT, ROOM_WIDTH } from '../Room/dimensions'

const GOLD_ACCENT = '#d4af37'
const CEILING_FINISH = '#ede8df'
const CEILING_INNER = '#fdfbf7'

// Symmetrical coffer dimensions
const MARGIN_X = 0.55
const MARGIN_Z = 0.55
const COFFER_W = ROOM_WIDTH - MARGIN_X * 2 // ~5.1m
const COFFER_D = ROOM_DEPTH - MARGIN_Z * 2 // ~5.9m
const COFFER_DROP = 0.12
const COFFER_Y = ROOM_HEIGHT - COFFER_DROP

// Small, discrete micro-aperture round corner spotlight
function CornerMicroDownlight({ position, color = '#fff3da', intensity = 0.8 }) {
  const outerR = 0.02
  const innerR = 0.013

  return (
    <group position={position}>
      {/* Outer Flush Matte Black Bezel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerR, outerR, 24]} />
        <meshPhysicalMaterial color="#141518" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Brushed Champagne Gold Inner Ring */}
      <mesh position={[0, -0.001, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerR * 0.65, innerR, 20]} />
        <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.25} metalness={0.92} />
      </mesh>
      {/* Anti-Glare Lens */}
      <mesh position={[0, -0.002, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[innerR * 0.6, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 1.2}
          toneMapped={false}
        />
      </mesh>
      {/* Downward Directional Spotlight Cone */}
      <spotLight
        color={color}
        intensity={intensity * 0.8}
        distance={4.2}
        angle={0.35}
        penumbra={0.8}
        decay={2}
        position={[0, -0.02, 0]}
        target-position={[position[0], 0, position[2]]}
      />
    </group>
  )
}

function PerimeterLinearLineLights({ y, width, depth, color = '#ffcf8a' }) {
  const halfW = width / 2
  const halfD = depth / 2
  const stripW = 0.032
  const stripH = 0.01

  const channels = [
    { size: [width, stripH, stripW], pos: [0, y, -halfD] },
    { size: [width, stripH, stripW], pos: [0, y, halfD] },
    { size: [stripW, stripH, depth - stripW * 2], pos: [-halfW, y, 0] },
    { size: [stripW, stripH, depth - stripW * 2], pos: [halfW, y, 0] },
  ]

  return (
    <group>
      {channels.map((ch, idx) => (
        <group key={idx} position={ch.pos}>
          {/* Flush Matte Black Recessed Channel Housing */}
          <mesh>
            <boxGeometry args={[ch.size[0] + 0.008, ch.size[1], ch.size[2] + 0.008]} />
            <meshPhysicalMaterial color="#121316" roughness={0.4} metalness={0.8} />
          </mesh>
          {/* Radiant Frosted Opal Linear Diffuser Strip */}
          <mesh position={[0, -0.002, 0]}>
            <boxGeometry args={[ch.size[0], ch.size[1] + 0.002, ch.size[2]]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={3.8}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function LinearSlotDiffuser({ position, length = 2.4 }) {
  const slotCount = 2
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[length, 0.01, 0.08]} />
        <meshPhysicalMaterial color="#0e0f12" roughness={0.7} metalness={0.5} />
      </mesh>
      {new Array(slotCount).fill(0).map((_, i) => (
        <mesh key={i} position={[0, -0.003, (i - 0.5) * 0.03]}>
          <boxGeometry args={[length - 0.04, 0.004, 0.008]} />
          <meshPhysicalMaterial color="#1a1c20" roughness={0.4} metalness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

export default function FalseCeiling({
  downlightColor = '#fff3da',
  glowColor = '#ffcf8a',
  intensity = 1.0,
}) {
  const bulkheadY = COFFER_Y + COFFER_DROP / 2 // Centered vertically so top connects exactly at ROOM_HEIGHT

  // 4 Small Corner Micro-Downlights Placed Symmetrically in the Bulkhead Corners
  const cornerDownlights = [
    [-COFFER_W / 2 + 0.25, COFFER_Y + 0.002, -COFFER_D / 2 + 0.25],
    [COFFER_W / 2 - 0.25, COFFER_Y + 0.002, -COFFER_D / 2 + 0.25],
    [-COFFER_W / 2 + 0.25, COFFER_Y + 0.002, COFFER_D / 2 - 0.25],
    [COFFER_W / 2 - 0.25, COFFER_Y + 0.002, COFFER_D / 2 - 0.25],
  ]

  return (
    <group>
      {/* 1. Main Suspended Perimeter Drywall Bulkhead (Fully Solid from COFFER_Y up to ROOM_HEIGHT, 0 gap) */}
      <group position={[0, bulkheadY, 0]}>
        {/* Left Bulkhead Wing */}
        <mesh position={[-ROOM_WIDTH / 2 + MARGIN_X / 2, 0, 0]} receiveShadow>
          <boxGeometry args={[MARGIN_X, COFFER_DROP, ROOM_DEPTH]} />
          <meshPhysicalMaterial color={CEILING_FINISH} roughness={0.92} metalness={0.01} />
        </mesh>
        {/* Right Bulkhead Wing */}
        <mesh position={[ROOM_WIDTH / 2 - MARGIN_X / 2, 0, 0]} receiveShadow>
          <boxGeometry args={[MARGIN_X, COFFER_DROP, ROOM_DEPTH]} />
          <meshPhysicalMaterial color={CEILING_FINISH} roughness={0.92} metalness={0.01} />
        </mesh>
        {/* Front Bulkhead Wing */}
        <mesh position={[0, 0, ROOM_DEPTH / 2 - MARGIN_Z / 2]} receiveShadow>
          <boxGeometry args={[COFFER_W, COFFER_DROP, MARGIN_Z]} />
          <meshPhysicalMaterial color={CEILING_FINISH} roughness={0.92} metalness={0.01} />
        </mesh>
        {/* Rear Bulkhead Wing (over window alcove) */}
        <mesh position={[0, 0, -ROOM_DEPTH / 2 + MARGIN_Z / 2]} receiveShadow>
          <boxGeometry args={[COFFER_W, COFFER_DROP, MARGIN_Z]} />
          <meshPhysicalMaterial color={CEILING_FINISH} roughness={0.92} metalness={0.01} />
        </mesh>
      </group>

      {/* 2. Recessed Coffer Tray Ceiling Surface (Sealed at ROOM_HEIGHT) */}
      <mesh position={[0, ROOM_HEIGHT - 0.005, 0]} receiveShadow>
        <boxGeometry args={[COFFER_W, 0.01, COFFER_D]} />
        <meshPhysicalMaterial color={CEILING_INNER} roughness={0.94} metalness={0} />
      </mesh>

      {/* 3. Perimeter Champagne Brass Shadow Reveal Trim */}
      {[-COFFER_W / 2, COFFER_W / 2].map((bx, idx) => (
        <mesh key={`rx-${idx}`} position={[bx, COFFER_Y + 0.008, 0]}>
          <boxGeometry args={[0.008, 0.016, COFFER_D]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.25} metalness={0.92} />
        </mesh>
      ))}
      {[-COFFER_D / 2, COFFER_D / 2].map((bz, idx) => (
        <mesh key={`rz-${idx}`} position={[0, COFFER_Y + 0.008, bz]}>
          <boxGeometry args={[COFFER_W, 0.016, 0.008]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.25} metalness={0.92} />
        </mesh>
      ))}

      {/* 4. Sleek Architectural Continuous Linear Profile Line Lights Running on All 4 Borders */}
      <PerimeterLinearLineLights
        y={COFFER_Y - 0.002}
        width={COFFER_W - 0.08}
        depth={COFFER_D - 0.08}
        color={glowColor}
      />

      {/* 5. 4 Small Micro-Aperture Round Downlights in the 4 Corners */}
      {cornerDownlights.map((pos, idx) => (
        <CornerMicroDownlight
          key={idx}
          position={pos}
          color={downlightColor}
          intensity={intensity}
        />
      ))}

      {/* 6. Concealed Linear HVAC Slot Diffusers */}
      <LinearSlotDiffuser position={[0, COFFER_Y - 0.002, -COFFER_D / 2 + 0.35]} length={2.6} />
      <LinearSlotDiffuser position={[0, COFFER_Y - 0.002, COFFER_D / 2 - 0.35]} length={2.6} />
    </group>
  )
}
