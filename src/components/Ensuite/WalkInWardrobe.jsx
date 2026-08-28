import { useMemo } from 'react'
import * as THREE from 'three'
import { ENSUITE_HEIGHT, ENSUITE_Z_MAX, ENSUITE_Z_MIN, WARDROBE } from './dimensions'

const WOOD_DARK = '#201914'
const GOLD_ACCENT = '#d4af37'
const WARM_LED = '#ffcf8a'
const MIRROR_FRAME = '#181a1e'

// =============================================================================
// 1. ICONIC AIR JORDAN 1 HIGH SNEAKER COMPONENT
// =============================================================================
function AirJordan1High({ position, colorway = 'chicago', rotation = [0, 0, 0] }) {
  const themes = {
    chicago: { primary: '#b81d24', secondary: '#ffffff', black: '#121316', sole: '#f4f3ee' },
    travis: { primary: '#5c4033', secondary: '#f7f4ea', black: '#151618', sole: '#eae4d3' },
    royal: { primary: '#1c3d73', secondary: '#ffffff', black: '#121316', sole: '#f4f3ee' },
    bred: { primary: '#b81d24', secondary: '#121316', black: '#121316', sole: '#f4f3ee' },
    shadow: { primary: '#7a8088', secondary: '#ffffff', black: '#121316', sole: '#f4f3ee' },
  }
  const theme = themes[colorway] || themes.chicago

  return (
    <group position={position} rotation={rotation}>
      {/* Rubber Outsole & Midsole */}
      <mesh position={[0, 0.015, 0]} castShadow>
        <boxGeometry args={[0.09, 0.024, 0.22]} />
        <meshPhysicalMaterial color={theme.sole} roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.003, 0]}>
        <boxGeometry args={[0.092, 0.006, 0.222]} />
        <meshPhysicalMaterial color={theme.primary} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Leather Toe Box & Front Vamp */}
      <mesh position={[0, 0.04, 0.055]} castShadow>
        <boxGeometry args={[0.084, 0.035, 0.095]} />
        <meshPhysicalMaterial color={theme.secondary} roughness={0.4} metalness={0.08} />
      </mesh>
      {/* Toe Cap Mudguard Overlay */}
      <mesh position={[0, 0.032, 0.085]} castShadow>
        <boxGeometry args={[0.088, 0.025, 0.045]} />
        <meshPhysicalMaterial color={theme.primary} roughness={0.45} metalness={0.08} />
      </mesh>

      {/* Midfoot Quarter Panels */}
      <mesh position={[0, 0.055, -0.01]} castShadow>
        <boxGeometry args={[0.08, 0.055, 0.08]} />
        <meshPhysicalMaterial color={theme.secondary} roughness={0.4} metalness={0.08} />
      </mesh>

      {/* Iconic Nike Swoosh on Lateral & Medial Sides */}
      {[-0.043, 0.043].map((sx, idx) => (
        <mesh key={idx} position={[sx, 0.052, -0.005]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.004, 0.018, 0.09]} />
          <meshPhysicalMaterial color={theme.black} roughness={0.35} metalness={0.1} />
        </mesh>
      ))}

      {/* High-Top Padded Ankle Collar */}
      <mesh position={[0, 0.095, -0.055]} rotation={[-0.18, 0, 0]} castShadow>
        <boxGeometry args={[0.076, 0.065, 0.065]} />
        <meshPhysicalMaterial color={theme.primary} roughness={0.45} metalness={0.08} />
      </mesh>
      {/* Ankle Collar Black Lining */}
      <mesh position={[0, 0.115, -0.062]} rotation={[-0.18, 0, 0]} castShadow>
        <boxGeometry args={[0.07, 0.025, 0.055]} />
        <meshPhysicalMaterial color={theme.black} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Padded Tongue & Black Lacing */}
      <mesh position={[0, 0.072, 0.018]} rotation={[0.32, 0, 0]} castShadow>
        <boxGeometry args={[0.062, 0.075, 0.02]} />
        <meshPhysicalMaterial color={theme.secondary} roughness={0.65} metalness={0.02} />
      </mesh>
      <mesh position={[0, 0.068, 0.028]} rotation={[0.32, 0, 0]}>
        <boxGeometry args={[0.054, 0.06, 0.008]} />
        <meshPhysicalMaterial color={theme.black} roughness={0.8} metalness={0.02} />
      </mesh>
    </group>
  )
}

// =============================================================================
// 2. CLOSED LUXURY WARDROBE ON THE EXTERIOR BACK WALL (z = -3.5)
// =============================================================================
function ExteriorClosedWardrobe({ accentOn = true }) {
  const widthX = WARDROBE.widthX - 0.15 // ~2.15m wide
  const depthZ = 0.60
  const heightY = 3.2
  const centerX = WARDROBE.centerX
  const centerZ = ENSUITE_Z_MIN + depthZ / 2 + 0.04 // Sits flush against the exterior back wall at z = -3.5
  const bays = 3
  const bayW = widthX / bays

  const GARMENT_COLORS = ['#1e2229', '#2c3539', '#8b5a3e', '#3e5c52', '#a89f91', '#8c3838']

  return (
    <group position={[centerX, 0, centerZ]}>
      {/* 1. Main Dark Walnut Cabinet Carcass */}
      <mesh position={[0, heightY / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[widthX, heightY, depthZ]} />
        <meshPhysicalMaterial color={WOOD_DARK} roughness={0.45} metalness={0.15} clearcoat={0.25} />
      </mesh>

      {/* 2. Top Storage Shelves & Designer Leather Luggage Boxes */}
      {new Array(bays).fill(0).map((_, i) => {
        const bx = -widthX / 2 + (i + 0.5) * bayW
        return (
          <group key={`shelf-${i}`}>
            <mesh position={[bx, heightY - 0.65, 0]} castShadow receiveShadow>
              <boxGeometry args={[bayW - 0.02, 0.03, depthZ - 0.04]} />
              <meshPhysicalMaterial color="#1a1410" roughness={0.4} metalness={0.2} />
            </mesh>
            <mesh position={[bx, heightY - 0.45, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.26, 20]} />
              <meshPhysicalMaterial
                color={i % 2 === 0 ? '#422817' : '#22252a'}
                roughness={0.45}
                metalness={0.2}
                clearcoat={0.2}
              />
            </mesh>
          </group>
        )
      })}

      {/* 3. Hanging Rails with Tailored Suits & Overcoats */}
      {new Array(bays).fill(0).map((_, i) => {
        const bx = -widthX / 2 + (i + 0.5) * bayW
        const garmentCount = 5
        return (
          <group key={`rail-${i}`} position={[bx, heightY - 0.85, 0]}>
            {/* Brushed Gold Hanging Rod */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, bayW - 0.04, 16]} />
              <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
            </mesh>
            {/* Hanging Clothes */}
            {new Array(garmentCount).fill(0).map((_, j) => {
              const gx = -(bayW - 0.1) / 2 + ((j + 0.5) * (bayW - 0.1)) / garmentCount
              const gColor = GARMENT_COLORS[(i * garmentCount + j) % GARMENT_COLORS.length]
              const gHeight = 0.9 + (j % 3) * 0.15
              return (
                <mesh key={j} position={[gx, -gHeight / 2 - 0.04, 0]} castShadow>
                  <boxGeometry args={[0.08, gHeight, depthZ - 0.16]} />
                  <meshPhysicalMaterial color={gColor} roughness={0.82} metalness={0.04} />
                </mesh>
              )
            })}
          </group>
        )
      })}

      {/* 4. Smoked Bronze Glass Front Doors with Full-Height Brushed Gold Handles */}
      {new Array(bays).fill(0).map((_, i) => {
        const bx = -widthX / 2 + (i + 0.5) * bayW
        return (
          <group key={`door-${i}`} position={[bx, heightY / 2, depthZ / 2 + 0.005]}>
            {/* Smoked Bronze Glass Panel */}
            <mesh>
              <boxGeometry args={[bayW - 0.015, heightY - 0.08, 0.006]} />
              <meshPhysicalMaterial
                color="#302922"
                transparent
                opacity={0.4}
                roughness={0.06}
                metalness={0.85}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
              />
            </mesh>
            {/* Full-Height Gold Door Handle Profile */}
            <mesh position={[bayW / 2 - 0.012, 0, 0.008]}>
              <boxGeometry args={[0.016, heightY - 0.06, 0.016]} />
              <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// =============================================================================
// 3. OPEN HANGING TOWELS & SPA SHELVING (ON THE BATHROOM DIVIDING WALL)
// =============================================================================
function OpenTowelAndRobesDisplay({ posX, posZ, accentOn = true }) {
  const widthZ = 1.6
  const heightY = 2.4
  const depthX = 0.28

  return (
    <group position={[posX, 0, posZ]}>
      {/* Dark Walnut Accent Wall Panel Backing */}
      <mesh position={[depthX / 2, heightY / 2, 0]} receiveShadow>
        <boxGeometry args={[0.02, heightY, widthZ]} />
        <meshPhysicalMaterial color={WOOD_DARK} roughness={0.5} metalness={0.1} clearcoat={0.2} />
      </mesh>

      {/* Brushed Champagne Gold Heated Multi-Tier Towel Rails */}
      {[0.75, 1.25, 1.75].map((ry, idx) => (
        <group key={`rail-${idx}`} position={[depthX / 2 + 0.08, ry, 0]}>
          {/* Gold Horizontal Heated Rail Bar */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, widthZ * 0.75, 16]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>

          {/* Draped Plush Hanging Bath Towels */}
          {[-0.25, 0.25].map((tz, j) => {
            const towelColor = (idx + j) % 2 === 0 ? '#faf8f5' : '#736b63'
            return (
              <mesh key={j} position={[0.02, -0.26, tz]} castShadow>
                <boxGeometry args={[0.05, 0.52, 0.32]} />
                <meshPhysicalMaterial color={towelColor} roughness={0.92} metalness={0.02} />
              </mesh>
            )
          })}
        </group>
      ))}

      {/* Top Shelf with Rolled Spa Towels & Amber Reed Diffuser */}
      <group position={[depthX / 2 + 0.06, heightY - 0.15, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.18, 0.02, widthZ * 0.8]} />
          <meshPhysicalMaterial color={WOOD_DARK} roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Rolled Spa Towels */}
        {[-0.35, -0.15, 0.05].map((rz, i) => (
          <mesh key={i} position={[0.04, 0.045, rz]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.14, 16]} />
            <meshPhysicalMaterial color="#edeae3" roughness={0.9} metalness={0.02} />
          </mesh>
        ))}
        {/* Amber Glass Fragrance Diffuser */}
        <mesh position={[0.04, 0.06, 0.35]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.09, 16]} />
          <meshPhysicalMaterial color="#b36200" transparent opacity={0.85} roughness={0.1} metalness={0.1} />
        </mesh>
      </group>
    </group>
  )
}

// =============================================================================
// 4. ILLUMINATED JORDAN SNEAKER SHOWCASE TOWER
// =============================================================================
function JordanSneakerTower({ posX, posZ, accentOn = true }) {
  const towerW = 0.85
  const towerD = 0.52
  const towerH = 3.2
  const shelfCount = 5

  const sneakerTiers = [
    { color: 'chicago', name: 'AJ1 High Chicago' },
    { color: 'travis', name: 'AJ1 High Travis Scott' },
    { color: 'royal', name: 'AJ1 High Royal' },
    { color: 'bred', name: 'AJ1 High Bred Banned' },
    { color: 'shadow', name: 'AJ1 High Shadow' },
  ]

  return (
    <group position={[posX, 0, posZ]}>
      {/* Smoked Dark Walnut & Aluminum Frame Carcass */}
      <mesh position={[0, towerH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[towerD, towerH, towerW]} />
        <meshPhysicalMaterial color={WOOD_DARK} roughness={0.5} metalness={0.2} clearcoat={0.3} />
      </mesh>

      {/* Champagne Gold Vertical Frame Trim Reveal */}
      {[-towerD / 2, towerD / 2].map((tx, idx) => (
        <mesh key={idx} position={[tx - 0.002, towerH / 2, 0]}>
          <boxGeometry args={[0.008, towerH, towerW + 0.01]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
      ))}

      {/* 5 Illuminated Display Shelves */}
      {sneakerTiers.map((tier, idx) => {
        const sy = 0.42 + idx * 0.58
        return (
          <group key={idx} position={[-0.02, sy, 0]}>
            {/* Tempered Glass Shelf Slab */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[towerD - 0.06, 0.016, towerW - 0.06]} />
              <meshPhysicalMaterial
                color="#eef5fb"
                transparent
                opacity={0.65}
                roughness={0.1}
                metalness={0.1}
                clearcoat={1.0}
              />
            </mesh>

            {/* Backlit Warm LED Strip */}
            <mesh position={[towerD / 2 - 0.06, 0.012, 0]}>
              <boxGeometry args={[0.012, 0.008, towerW - 0.08]} />
              <meshStandardMaterial
                color={WARM_LED}
                emissive={WARM_LED}
                emissiveIntensity={accentOn ? 3.5 : 0}
                toneMapped={false}
              />
            </mesh>

            {/* Angled Acrylic Display Risers with Jordan 1 Pair */}
            <AirJordan1High
              position={[-0.02, 0.015, -0.18]}
              colorway={tier.color}
              rotation={[0.08, -0.45, 0.04]}
            />
            <AirJordan1High
              position={[-0.02, 0.015, 0.18]}
              colorway={tier.color}
              rotation={[0.08, 0.45, -0.04]}
            />
          </group>
        )
      })}
    </group>
  )
}

// =============================================================================
// 5. FULL-HEIGHT LUXURY ARCHED LED DRESSING MIRROR
// =============================================================================
function LuxuryDressingMirror({ posX, posZ, accentOn = true }) {
  const mirrorW = 1.15
  const mirrorH = 2.7
  const frameD = 0.06

  return (
    <group position={[posX, 0, posZ]}>
      {/* 1. Dark Walnut Floor Backing Board */}
      <mesh position={[0, mirrorH / 2, 0]} castShadow>
        <boxGeometry args={[frameD, mirrorH, mirrorW]} />
        <meshPhysicalMaterial color={MIRROR_FRAME} roughness={0.6} metalness={0.3} />
      </mesh>

      {/* 2. Brushed Champagne Gold Arched Outer Frame */}
      <mesh position={[-frameD / 2 - 0.004, mirrorH / 2, 0]} castShadow>
        <boxGeometry args={[0.012, mirrorH + 0.04, mirrorW + 0.04]} />
        <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
      </mesh>

      {/* 3. Perimeter Warm LED Halo Glow */}
      <mesh position={[-frameD / 2 - 0.006, mirrorH / 2, 0]}>
        <boxGeometry args={[0.006, mirrorH + 0.02, mirrorW + 0.02]} />
        <meshStandardMaterial
          color={WARM_LED}
          emissive={WARM_LED}
          emissiveIntensity={accentOn ? 3.0 : 0}
          toneMapped={false}
        />
      </mesh>

      {/* 4. Ultra-Clear Highly Reflective Mirror Glass */}
      <mesh position={[-frameD / 2 - 0.008, mirrorH / 2, 0]}>
        <boxGeometry args={[0.004, mirrorH - 0.06, mirrorW - 0.06]} />
        <meshPhysicalMaterial
          color="#f4f8fb"
          roughness={0.0}
          metalness={0.98}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          reflectivity={1.0}
        />
      </mesh>
    </group>
  )
}

// =============================================================================
// 6. MAIN EXPORT: WALK-IN WARDROBE
// =============================================================================
export default function WalkInWardrobe({ accentOn = true }) {
  // Left Dividing Wall (Adjacent to Bathroom): Open Towel Display + Jordan Sneaker Shelf
  const leftWallX = WARDROBE.farX + 0.28
  const towelZ = -0.85
  const jordanZ = 0.95

  // Right Dividing Wall (Adjacent to Bedroom): Full-Height Dressing Mirror
  const mirrorX = WARDROBE.originX - 0.08
  const mirrorZ = 0.0

  return (
    <group>
      {/* 1. Closed Luxury Wardrobe on Exterior Back Wall (where window would be) */}
      <ExteriorClosedWardrobe accentOn={accentOn} />

      {/* 2. Open Hanging Towel & Spa Display on Bathroom Dividing Wall */}
      <OpenTowelAndRobesDisplay posX={leftWallX} posZ={towelZ} accentOn={accentOn} />

      {/* 3. Illuminated Jordan Sneaker Showcase Shelf beside Towel Display */}
      <JordanSneakerTower posX={leftWallX + 0.12} posZ={jordanZ} accentOn={accentOn} />

      {/* 4. Full-Height Backlit Dressing Mirror on Bedroom Partition Wall */}
      <LuxuryDressingMirror posX={mirrorX} posZ={mirrorZ} accentOn={accentOn} />
    </group>
  )
}
