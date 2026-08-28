import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { ROOM_HEIGHT, WALL_THICKNESS } from '../Room/dimensions'
import { LANDING_CENTER_X, LANDING_WIDTH } from './dimensions'

const FLOOR_COLOR = '#181a20' // Polished dark terrazzo foyer floor
const WALL_DARK_BASE = '#15171b'
const LOUVER_WOOD = '#241a13'
const GOLD_ACCENT = '#d4af37'
const WARM_GLOW = '#ffcf8a'
const WARM_LED = '#ffe4b5'
const CEILING_COLOR = '#e6e0d2'
const ELEVATOR_DOOR = '#282b33'
const GLASS_SMOKED = '#1c222c'

const FOYER_DEPTH = 7.00
const BACK_Z = -FOYER_DEPTH / 2 // -3.50m (Flush with building rear wall)

function FloorAndCeiling() {
  return (
    <group>
      {/* 1. Seamless Polished Terrazzo Lobby & Foyer Floor (z = -3.5m to +3.5m) */}
      <mesh position={[LANDING_CENTER_X, -WALL_THICKNESS / 2, 0]} receiveShadow>
        <boxGeometry args={[LANDING_WIDTH, WALL_THICKNESS, FOYER_DEPTH]} />
        <meshPhysicalMaterial color={FLOOR_COLOR} roughness={0.25} metalness={0.2} clearcoat={0.6} />
      </mesh>

      {/* Inlaid Brushed Gold Floor Perimeter Border */}
      <mesh position={[LANDING_CENTER_X, 0.005, 0]}>
        <boxGeometry args={[LANDING_WIDTH - 0.20, 0.005, FOYER_DEPTH - 0.20]} />
        <meshStandardMaterial color={GOLD_ACCENT} roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[LANDING_CENTER_X, 0.006, 0]}>
        <boxGeometry args={[LANDING_WIDTH - 0.26, 0.006, FOYER_DEPTH - 0.26]} />
        <meshPhysicalMaterial color={FLOOR_COLOR} roughness={0.25} metalness={0.2} />
      </mesh>

      {/* 2. Structural Ceiling Cap */}
      <mesh position={[LANDING_CENTER_X, ROOM_HEIGHT + WALL_THICKNESS / 2, 0]} receiveShadow>
        <boxGeometry args={[LANDING_WIDTH, WALL_THICKNESS, FOYER_DEPTH]} />
        <meshPhysicalMaterial color={CEILING_COLOR} roughness={0.92} metalness={0} />
      </mesh>

      {/* 3. Solid Rear Architectural Exterior Wall (z = -3.50m) */}
      <mesh position={[LANDING_CENTER_X, ROOM_HEIGHT / 2, BACK_Z + WALL_THICKNESS / 2]} receiveShadow>
        <boxGeometry args={[LANDING_WIDTH, ROOM_HEIGHT, WALL_THICKNESS]} />
        <meshPhysicalMaterial color={WALL_DARK_BASE} roughness={0.8} metalness={0.1} />
      </mesh>
    </group>
  )
}

function FoyerStatementChandelier({ position, glowColor = WARM_GLOW }) {
  const chandelierRef = useRef()

  useFrame(({ clock }) => {
    if (chandelierRef.current) {
      chandelierRef.current.rotation.y = clock.getElapsedTime() * 0.12
    }
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.03, 20]} />
        <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.45, 10]} />
        <meshPhysicalMaterial color="#111215" roughness={0.3} metalness={0.9} />
      </mesh>

      <group ref={chandelierRef} position={[0, -0.05, 0]}>
        <mesh castShadow>
          <torusGeometry args={[0.45, 0.018, 16, 32]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.18} metalness={0.95} clearcoat={0.3} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.32, 0.016, 16, 32]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.18} metalness={0.95} clearcoat={0.3} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial
            color={glowColor}
            emissive={glowColor}
            emissiveIntensity={3.4}
            toneMapped={false}
          />
        </mesh>
      </group>

      <pointLight
        color={glowColor}
        intensity={1.2}
        distance={6.0}
        decay={2}
        position={[0, -0.05, 0]}
      />
    </group>
  )
}

// =============================================================================
// 1. GRAND DIRECT PRIVATE PENTHOUSE HIGH-SPEED ELEVATOR SUITE (z = -3.38m)
// =============================================================================
function GrandPrivateElevatorSuite({ position, accentOn = true }) {
  const liftW = 1.55 // Wide luxury penthouse elevator doors
  const liftH = 2.55 // High ceiling clearance
  const liftD = 0.35

  return (
    <group position={position}>
      {/* 1. Fluted Dark Walnut & Champagne Gold Portal Enclosure */}
      <mesh position={[0, liftH / 2 + 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[liftW + 0.45, liftH + 0.36, 0.08]} />
        <meshPhysicalMaterial color="#181a20" roughness={0.5} metalness={0.2} clearcoat={0.3} />
      </mesh>
      <mesh position={[0, liftH / 2 + 0.06, 0.045]}>
        <boxGeometry args={[liftW + 0.49, liftH + 0.40, 0.01]} />
        <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
      </mesh>

      {/* 2. Recessed Elevator Cab Opening */}
      <mesh position={[0, liftH / 2, -liftD / 2]}>
        <boxGeometry args={[liftW, liftH, liftD]} />
        <meshPhysicalMaterial color="#0b0c0e" roughness={0.7} />
      </mesh>

      {/* 3. Center-Opening Telescopic Brushed Stainless & Gold Doors */}
      {[-liftW / 4 + 0.005, liftW / 4 - 0.005].map((dx, i) => (
        <group key={i} position={[dx, liftH / 2, -0.02]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[liftW / 2 - 0.015, liftH - 0.04, 0.03]} />
            <meshPhysicalMaterial
              color={ELEVATOR_DOOR}
              roughness={0.2}
              metalness={0.92}
              clearcoat={0.4}
            />
          </mesh>
          {/* Vertical Brushed Gold Reveal Line */}
          <mesh position={[i === 0 ? liftW / 4 - 0.04 : -liftW / 4 + 0.04, 0, 0.016]}>
            <boxGeometry args={[0.018, liftH * 0.88, 0.005]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* 4. Large OLED Digital Floor Indicator ("PH 72 / PENTHOUSE") */}
      <group position={[0, liftH + 0.10, 0.048]}>
        <mesh>
          <boxGeometry args={[0.42, 0.11, 0.01]} />
          <meshPhysicalMaterial color="#08090c" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.006]}>
          <planeGeometry args={[0.34, 0.07]} />
          <meshStandardMaterial
            color="#ffe4b5"
            emissive="#ffe4b5"
            emissiveIntensity={accentOn ? 3.2 : 0}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* 5. Brushed Brass Elevator Call Button Plate */}
      <group position={[liftW / 2 + 0.28, 1.15, 0.048]}>
        <mesh castShadow>
          <boxGeometry args={[0.09, 0.22, 0.01]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
        {[-0.045, 0.045].map((by, idx) => (
          <mesh key={idx} position={[0, by, 0.006]}>
            <circleGeometry args={[0.015, 16]} />
            <meshStandardMaterial
              color="#ffe4b5"
              emissive="#ffe4b5"
              emissiveIntensity={accentOn ? 2.8 : 0}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* Recessed Ceiling Downlight grazing elevator threshold */}
      <pointLight
        color={WARM_LED}
        intensity={accentOn ? 2.0 : 0}
        distance={5.5}
        decay={2}
        position={[0, liftH + 0.35, 0.5]}
      />
    </group>
  )
}

// =============================================================================
// 2. LUXURY MOTORIZED DOUBLE SLIDING ENTRANCE DOORS FROM LIFT AREA (z = -1.25m)
// =============================================================================
function MainHouseSlidingEntranceDoor({ position, accentOn = true }) {
  const doorHeight = 2.85
  const CLOSED_OFFSET = 0.38
  const OPEN_OFFSET = 1.25

  const [isOpen, setIsOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const leftRef = useRef()
  const rightRef = useRef()
  const currentOffset = useRef(CLOSED_OFFSET)

  useFrame((_, delta) => {
    const target = isOpen ? OPEN_OFFSET : CLOSED_OFFSET
    currentOffset.current += (target - currentOffset.current) * Math.min(1, delta * 5)
    if (leftRef.current) leftRef.current.position.x = -currentOffset.current
    if (rightRef.current) rightRef.current.position.x = currentOffset.current
  })

  const toggle = (e) => {
    e.stopPropagation()
    setIsOpen((v) => !v)
  }
  const hoverOn = (e) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }
  const hoverOff = (e) => {
    e.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  return (
    <group position={position}>
      {/* 1. Heavy Overhead Concealed Track Beam with Gold Inlay Reveal */}
      <group position={[0, doorHeight + 0.08, 0]}>
        <mesh castShadow>
          <boxGeometry args={[LANDING_WIDTH - 0.04, 0.16, 0.12]} />
          <meshPhysicalMaterial color="#1a1c22" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Brushed Gold Lower Reveal */}
        <mesh position={[0, -0.07, 0.062]}>
          <boxGeometry args={[LANDING_WIDTH - 0.04, 0.015, 0.005]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
        {/* Integrated Downlight grazing the sliding entrance doorway */}
        <pointLight
          color={WARM_LED}
          intensity={accentOn ? 1.8 : 0}
          distance={4.5}
          decay={2}
          position={[0, -0.1, 0.2]}
        />
      </group>

      {/* 2. Left & Right Fixed Smoked Glass Sidelite Panels */}
      {[-LANDING_WIDTH / 2 + 0.50, LANDING_WIDTH / 2 - 0.50].map((sx, idx) => (
        <group key={idx} position={[sx, doorHeight / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.95, doorHeight, 0.02]} />
            <meshPhysicalMaterial
              color={GLASS_SMOKED}
              transparent
              opacity={0.45}
              roughness={0.05}
              metalness={0.9}
              clearcoat={1.0}
            />
          </mesh>
        </group>
      ))}

      {/* 3. Left Sliding Glass Door Leaf — click either leaf to open/close */}
      <group
        ref={leftRef}
        position={[-CLOSED_OFFSET, doorHeight / 2, 0.035]}
        onClick={toggle}
        onPointerOver={hoverOn}
        onPointerOut={hoverOff}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.75, doorHeight - 0.04, 0.025]} />
          <meshPhysicalMaterial
            color={hovered ? '#2c333d' : GLASS_SMOKED}
            transparent
            opacity={0.55}
            roughness={0.04}
            metalness={0.92}
            clearcoat={1.0}
          />
        </mesh>
        {/* Full-Length Vertical Brushed Brass Tubular Door Handle */}
        <group position={[0.32, 0, 0.025]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.014, 0.014, doorHeight * 0.65, 16]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
        </group>
      </group>

      {/* 4. Right Sliding Glass Door Leaf with Smart Biometric Lock */}
      <group
        ref={rightRef}
        position={[CLOSED_OFFSET, doorHeight / 2, 0.035]}
        onClick={toggle}
        onPointerOver={hoverOn}
        onPointerOut={hoverOff}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.75, doorHeight - 0.04, 0.025]} />
          <meshPhysicalMaterial
            color={hovered ? '#2c333d' : GLASS_SMOKED}
            transparent
            opacity={0.55}
            roughness={0.04}
            metalness={0.92}
            clearcoat={1.0}
          />
        </mesh>
        {/* Full-Length Vertical Brushed Brass Tubular Door Handle */}
        <group position={[-0.32, 0, 0.025]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.014, 0.014, doorHeight * 0.65, 16]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
          {/* Smart Biometric Fingerprint Lock Sensor with Cyan Ambient Glow */}
          <mesh position={[0, 0.12, 0.015]}>
            <boxGeometry args={[0.02, 0.08, 0.01]} />
            <meshStandardMaterial
              color="#090a0d"
              emissive="#64b5f6"
              emissiveIntensity={accentOn ? 2.2 : 0}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}

// =============================================================================
// 3. INTERIOR PRIVATE FOYER WITH MARBLE CONSOLE & BACKLIT MIRROR (z = +1.45m)
// =============================================================================
function InteriorPrivateFoyerArea({ accentOn = true }) {
  const wallW = 1.90
  const wallH = ROOM_HEIGHT

  return (
    <group position={[LANDING_CENTER_X - 1.0, 0, 1.45]}>
      {/* Dark Walnut Fluted Accent Panel Backing */}
      <mesh position={[0, wallH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallW, wallH, 0.04]} />
        <meshPhysicalMaterial color={LOUVER_WOOD} roughness={0.5} metalness={0.1} clearcoat={0.2} />
      </mesh>

      {/* Large Circular Backlit Vanity Mirror */}
      <group position={[0, wallH * 0.56, 0.035]}>
        <mesh castShadow>
          <circleGeometry args={[0.60, 32]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.02} metalness={0.98} clearcoat={1.0} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <circleGeometry args={[0.64, 32]} />
          <meshStandardMaterial
            color={WARM_GLOW}
            emissive={WARM_GLOW}
            emissiveIntensity={accentOn ? 3.0 : 0}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Floating Calacatta Marble Console Table */}
      <group position={[0, 0.88, 0.22]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[wallW * 0.85, 0.06, 0.36]} />
          <meshPhysicalMaterial
            color="#f4eee4"
            roughness={0.18}
            metalness={0.12}
            clearcoat={0.4}
            clearcoatRoughness={0.1}
          />
        </mesh>
        {/* Brushed Gold Key Dish */}
        <mesh position={[-0.35, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.03, 16]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
      </group>
    </group>
  )
}

// =============================================================================
// 4. MAIN LANDING FOYER EXPORT
// =============================================================================
export default function LandingFoyer({ accentOn = true, glowColor = WARM_GLOW }) {
  const elevatorPos = [LANDING_CENTER_X, 0, BACK_Z + 0.08]
  const slidingDoorPos = [LANDING_CENTER_X, 0, -1.25]
  const chandelierPos = [LANDING_CENTER_X, ROOM_HEIGHT - 0.75, 1.45]

  return (
    <group>
      <FloorAndCeiling />

      {/* 1. Grand Direct-Access Private Penthouse Elevator Suite (z = -3.42m) */}
      <GrandPrivateElevatorSuite position={elevatorPos} accentOn={accentOn} />

      {/* 2. Luxury Motorized Double Sliding Glass Entrance Doors from Lift Area (z = -1.25m) */}
      <MainHouseSlidingEntranceDoor position={slidingDoorPos} accentOn={accentOn} />

      {/* 3. Interior Private Luxury Foyer (z = -1.25m to +3.50m) */}
      <FoyerStatementChandelier position={chandelierPos} glowColor={glowColor} />
      <InteriorPrivateFoyerArea accentOn={accentOn} />
    </group>
  )
}
