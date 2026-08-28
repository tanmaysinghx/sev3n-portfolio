import {
  BATHROOM,
  ENSUITE_HEIGHT,
  ENSUITE_ORIGIN_X,
  ENSUITE_Z_MAX,
  ENSUITE_Z_MIN,
  WARDROBE,
} from './dimensions'

const CEILING_DROP = 0.10
const CEILING_Y = ENSUITE_HEIGHT - CEILING_DROP
const COVE_Y = ENSUITE_HEIGHT - CEILING_DROP / 2
const STRIP_T = 0.025

function DownlightDiode({ position, color, intensity = 1.6 }) {
  return (
    <group position={position}>
      {/* Outer Flush Matte Black Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.015, 0.028, 20]} />
        <meshPhysicalMaterial color="#141518" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Radiant Diffuser Lens */}
      <mesh position={[0, -0.002, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.014, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 1.4}
          toneMapped={false}
        />
      </mesh>
      {/* Soft Directional Spotlight */}
      <spotLight
        color={color}
        intensity={intensity * 0.6}
        distance={4.2}
        angle={0.4}
        penumbra={0.7}
        decay={2}
        position={[0, -0.01, 0]}
        target-position={[position[0], 0, position[2]]}
      />
    </group>
  )
}

function LinearPerimeterCove({ position, size, color, intensity = 3.6 }) {
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

function LinearACSlotVent({ position, length }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[length, 0.01, 0.06]} />
        <meshPhysicalMaterial color="#111215" roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.003, 0]}>
        <boxGeometry args={[length - 0.03, 0.005, 0.006]} />
        <meshPhysicalMaterial color="#8e929a" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  )
}

export default function EnsuiteLighting({
  downlightColor = '#fff3da',
  glowColor = '#ffcf8a',
  intensity = 1.6,
}) {
  const totalDepth = ENSUITE_Z_MAX - ENSUITE_Z_MIN
  const centerZ = (ENSUITE_Z_MIN + ENSUITE_Z_MAX) / 2
  const totalWidth = ENSUITE_ORIGIN_X - BATHROOM.farX
  const centerX = (ENSUITE_ORIGIN_X + BATHROOM.farX) / 2

  // 1. Bathroom Coffer Tray
  const bathX = BATHROOM.centerX
  const bathW = BATHROOM.widthX - 0.35
  const bathD = totalDepth - 0.6

  // 2. Walk-In Wardrobe Coffer Tray
  const wardX = WARDROBE.centerX
  const wardW = WARDROBE.widthX - 0.35
  const wardD = totalDepth - 0.6

  const downlightPositions = [
    // Shower
    [BATHROOM.farX + 0.75, CEILING_Y - 0.005, ENSUITE_Z_MIN + 0.95],
    // Bathtub
    [BATHROOM.centerX + 0.55, CEILING_Y - 0.005, ENSUITE_Z_MIN + 0.95],
    // Vanity Sinks
    [BATHROOM.farX + 0.45, CEILING_Y - 0.005, 0.2],
    [BATHROOM.farX + 0.45, CEILING_Y - 0.005, 1.1],
    // Smart Toilet
    [WARDROBE.farX - 0.45, CEILING_Y - 0.005, 0.65],
    // Wardrobe Aisle
    [wardX, CEILING_Y - 0.005, -0.85],
    [wardX, CEILING_Y - 0.005, 0.95],
  ]

  return (
    <group>
      {/* 1. Main Solid Perimeter Bulkhead Box (Spans CEILING_Y to ENSUITE_HEIGHT with zero gap) */}
      <group position={[0, CEILING_Y + CEILING_DROP / 2, 0]}>
        {/* Left Boundary Bulkhead Wing */}
        <mesh position={[BATHROOM.farX + 0.175, 0, centerZ]} receiveShadow>
          <boxGeometry args={[0.35, CEILING_DROP, totalDepth]} />
          <meshPhysicalMaterial color="#ede8df" roughness={0.92} metalness={0.01} />
        </mesh>
        {/* Central Divider Bulkhead Wing */}
        <mesh position={[WARDROBE.farX, 0, centerZ]} receiveShadow>
          <boxGeometry args={[0.35, CEILING_DROP, totalDepth]} />
          <meshPhysicalMaterial color="#ede8df" roughness={0.92} metalness={0.01} />
        </mesh>
        {/* Right Boundary Bulkhead Wing */}
        <mesh position={[ENSUITE_ORIGIN_X - 0.175, 0, centerZ]} receiveShadow>
          <boxGeometry args={[0.35, CEILING_DROP, totalDepth]} />
          <meshPhysicalMaterial color="#ede8df" roughness={0.92} metalness={0.01} />
        </mesh>
        {/* Front Return Bulkhead */}
        <mesh position={[centerX, 0, ENSUITE_Z_MAX - 0.15]} receiveShadow>
          <boxGeometry args={[totalWidth, CEILING_DROP, 0.30]} />
          <meshPhysicalMaterial color="#ede8df" roughness={0.92} metalness={0.01} />
        </mesh>
        {/* Rear Return Bulkhead */}
        <mesh position={[centerX, 0, ENSUITE_Z_MIN + 0.15]} receiveShadow>
          <boxGeometry args={[totalWidth, CEILING_DROP, 0.30]} />
          <meshPhysicalMaterial color="#ede8df" roughness={0.92} metalness={0.01} />
        </mesh>
      </group>

      {/* 2. Bathroom Zone Architectural Coffer Tray (Sealed flush at ENSUITE_HEIGHT) */}
      <group position={[bathX, 0, centerZ]}>
        <mesh position={[0, ENSUITE_HEIGHT - 0.005, 0]} receiveShadow>
          <boxGeometry args={[bathW, 0.01, bathD]} />
          <meshPhysicalMaterial color="#f8f6f0" roughness={0.94} metalness={0} />
        </mesh>
        {/* Perimeter Warm LED Line Lights */}
        <LinearPerimeterCove position={[0, COVE_Y, -bathD / 2]} size={[bathW, STRIP_T, STRIP_T]} color={glowColor} />
        <LinearPerimeterCove position={[0, COVE_Y, bathD / 2]} size={[bathW, STRIP_T, STRIP_T]} color={glowColor} />
        <LinearPerimeterCove position={[-bathW / 2, COVE_Y, 0]} size={[STRIP_T, STRIP_T, bathD]} color={glowColor} />
        <LinearPerimeterCove position={[bathW / 2, COVE_Y, 0]} size={[STRIP_T, STRIP_T, bathD]} color={glowColor} />

        <LinearACSlotVent position={[0, CEILING_Y - 0.002, bathD / 2 - 0.25]} length={bathW * 0.75} />
      </group>

      {/* 3. Walk-In Wardrobe Architectural Coffer Tray (Sealed flush at ENSUITE_HEIGHT) */}
      <group position={[wardX, 0, centerZ]}>
        <mesh position={[0, ENSUITE_HEIGHT - 0.005, 0]} receiveShadow>
          <boxGeometry args={[wardW, 0.01, wardD]} />
          <meshPhysicalMaterial color="#f8f6f0" roughness={0.94} metalness={0} />
        </mesh>
        {/* Perimeter Warm LED Line Lights */}
        <LinearPerimeterCove position={[0, COVE_Y, -wardD / 2]} size={[wardW, STRIP_T, STRIP_T]} color={glowColor} />
        <LinearPerimeterCove position={[0, COVE_Y, wardD / 2]} size={[wardW, STRIP_T, STRIP_T]} color={glowColor} />
        <LinearPerimeterCove position={[-wardW / 2, COVE_Y, 0]} size={[STRIP_T, STRIP_T, wardD]} color={glowColor} />
        <LinearPerimeterCove position={[wardW / 2, COVE_Y, 0]} size={[STRIP_T, STRIP_T, wardD]} color={glowColor} />

        <LinearACSlotVent position={[0, CEILING_Y - 0.002, 0]} length={wardW * 0.75} />
      </group>

      {/* 4. Symmetrical Micro-Aperture Downlights */}
      {downlightPositions.map((pos, i) => (
        <DownlightDiode
          key={i}
          position={pos}
          color={downlightColor}
          intensity={intensity}
        />
      ))}
    </group>
  )
}
