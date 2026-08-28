import { useMemo } from 'react'
import * as THREE from 'three'
import { BATHROOM, ENSUITE_HEIGHT } from '../Ensuite/dimensions'
import { WALL_THICKNESS } from '../Room/dimensions'

const CORE_WIDTH = 3.20 // Spans from x = -8.00m (Bathroom left wall) to x = -11.20m
const CORE_ORIGIN_X = BATHROOM.farX // -8.00m
const CORE_FAR_X = CORE_ORIGIN_X - CORE_WIDTH // -11.20m
const CORE_CENTER_X = (CORE_ORIGIN_X + CORE_FAR_X) / 2 // -9.60m
const CORE_DEPTH = 7.00 // Matches z = -3.50m to +3.50m
const CORE_HEIGHT = ENSUITE_HEIGHT // 3.35m

const LOBBY_FLOOR = '#181a20'
const ELEVATOR_GOLD = '#d4af37'
const ELEVATOR_DOOR = '#282b33'
const WALL_CHARCOAL = '#1a1c22'
const WARM_LED = '#ffe4b5'
const GREEN_EXIT = '#22c55e'

export { CORE_FAR_X }

// =============================================================================
// 1. PRIVATE RESIDENTIAL ELEVATOR SUITE (BRUSHED GOLD DOORS & OLED PH DISPLAY)
// =============================================================================
function PrivateElevatorSuite({ position, accentOn = true }) {
  const liftW = 1.35 // Door width
  const liftH = 2.45 // Door height
  const liftD = 0.45 // Recess depth

  return (
    <group position={position}>
      {/* 1. Fluted Dark Walnut & Charcoal Portal Casing Frame */}
      <mesh position={[0, liftH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[liftW + 0.30, liftH + 0.25, 0.08]} />
        <meshPhysicalMaterial color={WALL_CHARCOAL} roughness={0.5} metalness={0.2} clearcoat={0.3} />
      </mesh>

      {/* Brushed Champagne Gold Outer Architrave Inlay */}
      <mesh position={[0, liftH / 2, 0.045]}>
        <boxGeometry args={[liftW + 0.34, liftH + 0.29, 0.01]} />
        <meshPhysicalMaterial color={ELEVATOR_GOLD} roughness={0.2} metalness={0.95} />
      </mesh>

      {/* 2. Recessed Elevator Cab Opening */}
      <mesh position={[0, liftH / 2, -liftD / 2]}>
        <boxGeometry args={[liftW, liftH, liftD]} />
        <meshPhysicalMaterial color="#0c0d10" roughness={0.7} />
      </mesh>

      {/* 3. Center-Opening Telescopic Brushed Stainless Doors */}
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
          {/* Vertical Brushed Gold Door Reveal Accent Line */}
          <mesh position={[i === 0 ? liftW / 4 - 0.04 : -liftW / 4 + 0.04, 0, 0.016]}>
            <boxGeometry args={[0.015, liftH * 0.85, 0.005]} />
            <meshPhysicalMaterial color={ELEVATOR_GOLD} roughness={0.2} metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* 4. Overhead OLED Digital Floor Indicator Display ("PH / 72") */}
      <group position={[0, liftH + 0.08, 0.048]}>
        <mesh>
          <boxGeometry args={[0.32, 0.10, 0.01]} />
          <meshPhysicalMaterial color="#08090c" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Glowing Floor Number Indicator */}
        <mesh position={[0, 0, 0.006]}>
          <planeGeometry args={[0.24, 0.06]} />
          <meshStandardMaterial
            color="#ffe4b5"
            emissive="#ffe4b5"
            emissiveIntensity={accentOn ? 3.0 : 0}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* 5. Brushed Brass Elevator Call Button Plate */}
      <group position={[liftW / 2 + 0.22, 1.15, 0.048]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.20, 0.01]} />
          <meshPhysicalMaterial color={ELEVATOR_GOLD} roughness={0.2} metalness={0.95} />
        </mesh>
        {/* Up & Down Illuminated Buttons */}
        {[-0.04, 0.04].map((by, idx) => (
          <mesh key={idx} position={[0, by, 0.006]}>
            <circleGeometry args={[0.014, 16]} />
            <meshStandardMaterial
              color="#ffe4b5"
              emissive="#ffe4b5"
              emissiveIntensity={accentOn ? 2.5 : 0}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* Soft Overhead Downlight grazing the elevator doors */}
      <pointLight
        color={WARM_LED}
        intensity={accentOn ? 0.9 : 0}
        distance={4.0}
        decay={2}
        position={[0, liftH + 0.3, 0.5]}
      />
    </group>
  )
}

// =============================================================================
// 2. ARCHITECTURAL EGRESS STAIRWELL WITH FLOATING TREADS & BRASS RAILS
// =============================================================================
function ArchitecturalStaircase({ position, accentOn = true }) {
  const stepCount = 9
  const stairW = 1.10
  const totalRise = CORE_HEIGHT
  const stepH = totalRise / stepCount
  const stepD = 0.28

  return (
    <group position={position}>
      {/* 1. Cantilevered Floating Walnut Stair Treads */}
      {new Array(stepCount).fill(0).map((_, i) => {
        const sy = (i + 0.5) * stepH
        const sz = -1.2 + i * stepD

        return (
          <group key={i} position={[0, sy, sz]}>
            {/* Solid Walnut Tread */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[stairW, 0.045, stepD - 0.02]} />
              <meshPhysicalMaterial color="#3a2719" roughness={0.6} metalness={0.1} clearcoat={0.2} />
            </mesh>

            {/* Concealed Under-Tread Warm LED Strip */}
            <mesh position={[0, -0.025, stepD / 2 - 0.03]}>
              <boxGeometry args={[stairW - 0.1, 0.008, 0.015]} />
              <meshStandardMaterial
                color={WARM_LED}
                emissive={WARM_LED}
                emissiveIntensity={accentOn ? 2.5 : 0}
                toneMapped={false}
              />
            </mesh>

            {/* Vertical Steel Balustrade Spindles */}
            {[-stairW / 2 + 0.04, stairW / 2 - 0.04].map((bx, idx) => (
              <mesh key={idx} position={[bx, 0.45, 0]}>
                <cylinderGeometry args={[0.006, 0.006, 0.90, 8]} />
                <meshPhysicalMaterial color="#111215" roughness={0.3} metalness={0.9} />
              </mesh>
            ))}
          </group>
        )
      })}

      {/* Continuous Brushed Champagne Gold Handrail */}
      {[-stairW / 2 + 0.04, stairW / 2 - 0.04].map((rx, idx) => (
        <group key={`rail-${idx}`} position={[rx, totalRise / 2 + 0.45, -1.2 + (stepCount * stepD) / 2]}>
          <mesh rotation={[Math.atan2(totalRise, stepCount * stepD), 0, 0]}>
            <cylinderGeometry
              args={[0.016, 0.016, Math.sqrt(totalRise * totalRise + (stepCount * stepD) ** 2), 12]}
            />
            <meshPhysicalMaterial color={ELEVATOR_GOLD} roughness={0.2} metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Emergency Egress Green LED Exit Sign */}
      <group position={[0, CORE_HEIGHT - 0.35, -1.2 + stepCount * stepD]}>
        <mesh>
          <boxGeometry args={[0.35, 0.16, 0.04]} />
          <meshPhysicalMaterial color="#0b0d10" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[0.30, 0.12]} />
          <meshStandardMaterial
            color={GREEN_EXIT}
            emissive={GREEN_EXIT}
            emissiveIntensity={accentOn ? 3.5 : 0}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

// =============================================================================
// 3. MAIN ELEVATOR & STAIR CORE SHELL
// =============================================================================
export default function ElevatorStairCore({ accentOn = true }) {
  return (
    <group position={[CORE_CENTER_X, 0, 0]}>
      {/* 1. Polished Terrazzo Lobby Floor Slab */}
      <mesh position={[0, -WALL_THICKNESS / 2, 0]} receiveShadow>
        <boxGeometry args={[CORE_WIDTH, WALL_THICKNESS, CORE_DEPTH]} />
        <meshPhysicalMaterial color={LOBBY_FLOOR} roughness={0.25} metalness={0.2} clearcoat={0.5} />
      </mesh>

      {/* 2. Structural Ceiling Cap */}
      <mesh position={[0, CORE_HEIGHT + WALL_THICKNESS / 2, 0]} receiveShadow>
        <boxGeometry args={[CORE_WIDTH, WALL_THICKNESS, CORE_DEPTH]} />
        <meshPhysicalMaterial color="#ded7cc" roughness={0.9} metalness={0} />
      </mesh>

      {/* 3. Far Left Exterior Solid Core Wall (x = -11.20m) */}
      <mesh position={[-CORE_WIDTH / 2, CORE_HEIGHT / 2, 0]} receiveShadow>
        <boxGeometry args={[WALL_THICKNESS, CORE_HEIGHT, CORE_DEPTH]} />
        <meshPhysicalMaterial color={WALL_CHARCOAL} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* 4. Rear Exterior Core Wall (z = -3.50m) */}
      <mesh position={[0, CORE_HEIGHT / 2, -CORE_DEPTH / 2 + WALL_THICKNESS / 2]} receiveShadow>
        <boxGeometry args={[CORE_WIDTH, CORE_HEIGHT, WALL_THICKNESS]} />
        <meshPhysicalMaterial color={WALL_CHARCOAL} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* 5. Private Elevator Suite (Facing Front, positioned along rear wall) */}
      <PrivateElevatorSuite position={[0.25, 0, -1.85]} accentOn={accentOn} />

      {/* 6. Emergency & Egress Architectural Staircase (Positioned in front half) */}
      <ArchitecturalStaircase position={[-0.35, 0, 0.45]} accentOn={accentOn} />
    </group>
  )
}
