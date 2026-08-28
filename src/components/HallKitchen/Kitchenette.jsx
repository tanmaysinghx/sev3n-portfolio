import { useMemo } from 'react'
import * as THREE from 'three'
import { HALL_FAR_X, HALL_HEIGHT } from './dimensions'

const COUNTER_HEIGHT = 0.92
const COUNTER_DEPTH = 0.65
const QUARTZ_COLOR = '#ebe7df'
const CABINET_COLOR = '#17191d'
const WOOD_ACCENT = '#241a13'
const GOLD_ACCENT = '#d4af37'
const WARM_LED = '#ffe4b5'
const FRIDGE_STEEL = '#262930'
const SMART_BLUE = '#64b5f6'

function makeQuartzTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#f5f2eb'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Calacatta Gold Marble Veining
  ctx.strokeStyle = 'rgba(195,160,115,0.45)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(0, 60)
  ctx.bezierCurveTo(150, 120, 320, 40, 512, 90)
  ctx.stroke()

  ctx.strokeStyle = 'rgba(150,155,165,0.3)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(80, 0)
  ctx.bezierCurveTo(220, 200, 380, 340, 480, 512)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// =============================================================================
// 1. LUXURY FRENCH DOUBLE-DOOR REFRIGERATOR (TOUCHING THE WINDOW WALL, z = -2.85)
// =============================================================================
function DoubleDoorFrenchFridge({ position, accentOn = true }) {
  const fridgeW = 0.70 // Depth into room
  const fridgeL = 1.05 // Width along wall
  const fridgeH = 2.15 // Height

  return (
    <group position={position}>
      {/* 1. Main Stainless Steel Cabinet Casing */}
      <mesh position={[0, fridgeH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[fridgeW, fridgeH, fridgeL]} />
        <meshPhysicalMaterial
          color={FRIDGE_STEEL}
          roughness={0.25}
          metalness={0.88}
          clearcoat={0.3}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Top Header Reveal & Ventilation Grille */}
      <mesh position={[0, fridgeH - 0.04, 0]}>
        <boxGeometry args={[fridgeW + 0.01, 0.08, fridgeL + 0.01]} />
        <meshPhysicalMaterial color="#111215" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* 2. Top Double French Doors (Left & Right) */}
      {[-fridgeL / 4 + 0.005, fridgeL / 4 - 0.005].map((dz, i) => (
        <group key={i} position={[-fridgeW / 2 - 0.012, fridgeH * 0.65, dz]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.024, fridgeH * 0.58, fridgeL / 2 - 0.015]} />
            <meshPhysicalMaterial
              color="#20232a"
              roughness={0.2}
              metalness={0.92}
              clearcoat={0.35}
            />
          </mesh>

          {/* Full-Length Vertical Brushed Champagne Gold Tubular Door Handle */}
          <group position={[-0.03, 0, i === 0 ? fridgeL / 4 - 0.05 : -fridgeL / 4 + 0.05]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.012, 0.012, fridgeH * 0.48, 16]} />
              <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
            </mesh>
            {/* Top & Bottom Standoff Mounts */}
            {[-fridgeH * 0.22, fridgeH * 0.22].map((sy, idx) => (
              <mesh key={idx} position={[0.015, sy, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.01, 0.01, 0.03, 14]} />
                <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* 3. Smart Touch Ice & Sparkling Water Dispenser on Left Door */}
      <group position={[-fridgeW / 2 - 0.026, fridgeH * 0.66, -fridgeL / 4 + 0.02]}>
        <mesh>
          <boxGeometry args={[0.015, 0.32, 0.22]} />
          <meshPhysicalMaterial color="#0c0d10" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[-0.008, 0.10, 0]}>
          <boxGeometry args={[0.002, 0.08, 0.16]} />
          <meshStandardMaterial
            color="#08090b"
            emissive={SMART_BLUE}
            emissiveIntensity={accentOn ? 2.2 : 0}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[-0.008, -0.06, 0]}>
          <boxGeometry args={[0.004, 0.08, 0.06]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
      </group>

      {/* 4. Bottom Pull-Out Freezer Drawers */}
      {[0.16, 0.34].map((fy, i) => (
        <group key={i} position={[-fridgeW / 2 - 0.012, fy, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.024, 0.16, fridgeL - 0.02]} />
            <meshPhysicalMaterial color="#20232a" roughness={0.2} metalness={0.92} />
          </mesh>
          <group position={[-0.025, 0.02, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.01, 0.01, fridgeL * 0.6, 16]} />
              <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}

// =============================================================================
// 2. ULTRA-SLIM MINIMALIST RANGE HOOD (ELEVATED AT y = 2.45m, SLIM DUCT)
// =============================================================================
function SlimArchitecturalChimneyHood({ position, accentOn = true }) {
  const hoodW = 0.48 // Depth from wall
  const hoodL = 0.78 // Length across stove
  const hoodH = 0.14 // Slim modern canopy
  const ductW = 0.22
  const ductL = 0.26
  const ductH = HALL_HEIGHT - 2.45

  return (
    <group position={position}>
      {/* 1. Ultra-Slim Matte Black & Brushed Steel Canopy */}
      <mesh position={[0, hoodH / 2, 0]} castShadow>
        <boxGeometry args={[hoodW, hoodH, hoodL]} />
        <meshPhysicalMaterial color="#14161a" roughness={0.35} metalness={0.85} clearcoat={0.3} />
      </mesh>

      {/* 2. Brushed Champagne Gold Perimeter Accent Trim */}
      <mesh position={[0, 0.008, 0]}>
        <boxGeometry args={[hoodW + 0.012, 0.016, hoodL + 0.012]} />
        <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
      </mesh>

      {/* 3. Slim Stainless Steel Flue Duct to Ceiling */}
      <mesh position={[0, hoodH + ductH / 2, 0]} castShadow>
        <boxGeometry args={[ductW, ductH, ductL]} />
        <meshPhysicalMaterial color="#1a1c20" roughness={0.35} metalness={0.75} />
      </mesh>

      {/* 4. Touch Capacitive Glass Control Strip */}
      <mesh position={[-hoodW / 2 - 0.002, 0.04, 0]}>
        <boxGeometry args={[0.004, 0.04, 0.35]} />
        <meshStandardMaterial
          color="#111215"
          emissive="#64b5f6"
          emissiveIntensity={accentOn ? 1.5 : 0}
          toneMapped={false}
        />
      </mesh>

      {/* 5. Integrated High-CRI LED Cooktop Worklights */}
      <mesh position={[0, -0.004, 0]}>
        <boxGeometry args={[hoodW - 0.10, 0.008, hoodL - 0.12]} />
        <meshStandardMaterial
          color={WARM_LED}
          emissive={WARM_LED}
          emissiveIntensity={accentOn ? 3.6 : 0}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// =============================================================================
// 3. CONTINUOUS LINEAR PERIMETER KITCHEN COUNTER (TUCKED SAFELY FROM DOORWAY)
// =============================================================================
function PerimeterWallKitchenCounter({ position, accentOn = true }) {
  const quartzTexture = useMemo(() => makeQuartzTexture(), [])
  const counterLength = 3.10 // Spans z = -2.30 to +0.80, finishing before the doorway!
  const counterDepth = COUNTER_DEPTH

  return (
    <group position={position}>
      {/* 1. Base Cabinets Body (Fluted Charcoal Walnut) */}
      <mesh position={[0, COUNTER_HEIGHT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[counterDepth, COUNTER_HEIGHT, counterLength]} />
        <meshPhysicalMaterial color={CABINET_COLOR} roughness={0.4} metalness={0.1} clearcoat={0.2} />
      </mesh>

      {/* 2. Calacatta Gold Marble Slab Countertop */}
      <mesh position={[0, COUNTER_HEIGHT + 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[counterDepth + 0.03, 0.04, counterLength + 0.02]} />
        <meshPhysicalMaterial
          map={quartzTexture}
          roughness={0.18}
          metalness={0.12}
          clearcoat={0.4}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* ---------------- A. 4-BURNER INDUCTION STOVE (z = -1.00m, deep inside near window) ---------------- */}
      <group position={[0, COUNTER_HEIGHT + 0.041, -1.00]}>
        <mesh receiveShadow>
          <boxGeometry args={[counterDepth * 0.78, 0.006, 0.74]} />
          <meshPhysicalMaterial
            color="#0b0c0e"
            roughness={0.04}
            metalness={0.92}
            clearcoat={1.0}
          />
        </mesh>
        {/* 4 Glowing Induction Heating Rings */}
        {[-0.14, 0.14].map((cx, i) =>
          [-0.18, 0.18].map((cz, j) => (
            <mesh key={`${i}-${j}`} position={[cx, 0.004, cz]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.06, 0.07, 22]} />
              <meshStandardMaterial
                color="#ff4500"
                emissive="#ff4500"
                emissiveIntensity={accentOn ? 2.8 : 0}
                toneMapped={false}
              />
            </mesh>
          )),
        )}
        {/* Chef Sauté Pan on front burner */}
        <group position={[-0.14, 0.025, -0.18]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.10, 0.08, 0.035, 20]} />
            <meshPhysicalMaterial color="#1a1c22" roughness={0.3} metalness={0.85} />
          </mesh>
          {/* Pan Brass Handle */}
          <mesh position={[-0.12, 0.02, 0]} rotation={[0, 0, Math.PI / 12]}>
            <boxGeometry args={[0.14, 0.014, 0.022]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
        </group>
      </group>

      {/* ---------------- B. UTENSILS & PREP STATION (z = -0.35m) ---------------- */}
      <group position={[0, COUNTER_HEIGHT + 0.04, -0.35]}>
        <mesh position={[0, 0.012, 0]} castShadow>
          <boxGeometry args={[counterDepth * 0.6, 0.024, 0.36]} />
          <meshPhysicalMaterial color="#6e4726" roughness={0.6} metalness={0.05} />
        </mesh>
        <group position={[counterDepth / 2 - 0.12, 0.10, 0.22]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.15, 16]} />
            <meshPhysicalMaterial color="#d8dce2" roughness={0.15} metalness={0.92} />
          </mesh>
          {[-0.018, 0, 0.018].map((uz, idx) => (
            <mesh key={idx} position={[0, 0.10, uz]} rotation={[0, 0, (idx - 1) * 0.15]}>
              <cylinderGeometry args={[0.004, 0.004, 0.16, 10]} />
              <meshPhysicalMaterial color={idx === 1 ? GOLD_ACCENT : '#222831'} roughness={0.2} />
            </mesh>
          ))}
        </group>
        <mesh position={[counterDepth / 2 - 0.12, 0.12, -0.22]} castShadow>
          <cylinderGeometry args={[0.032, 0.032, 0.16, 14]} />
          <meshPhysicalMaterial color="#8ca63a" transparent opacity={0.7} roughness={0.1} metalness={0.2} />
        </mesh>
      </group>

      {/* ---------------- C. UNDERMOUNT SINK BASIN & FAUCET (z = +0.30m) ---------------- */}
      <group position={[0.02, COUNTER_HEIGHT + 0.02, 0.30]}>
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[counterDepth * 0.65, 0.16, 0.62]} />
          <meshPhysicalMaterial color="#1a1c20" roughness={0.2} metalness={0.85} />
        </mesh>
        <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[counterDepth * 0.58, 0.55]} />
          <meshPhysicalMaterial
            color="#a8d5e5"
            transparent
            opacity={0.6}
            roughness={0.02}
            metalness={0.8}
            clearcoat={1.0}
          />
        </mesh>
        {/* Gooseneck Brushed Brass Pull-Down Kitchen Faucet */}
        <group position={[counterDepth / 2 - 0.08, 0.14, 0]}>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.18, 14]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
          <mesh position={[-0.10, 0.22, 0]} rotation={[0, 0, -Math.PI / 3]}>
            <cylinderGeometry args={[0.012, 0.012, 0.22, 14]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
          <mesh position={[-0.20, 0.16, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.06, 14]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
        </group>
      </group>

      {/* ---------------- D. INTEGRATED DISHWASHER (z = +0.95m, front edge) ---------------- */}
      <group position={[-counterDepth / 2 - 0.01, COUNTER_HEIGHT * 0.5, 0.95]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.02, COUNTER_HEIGHT * 0.88, 0.55]} />
          <meshPhysicalMaterial color="#22252c" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Horizontal Gold Handle */}
        <mesh position={[-0.02, COUNTER_HEIGHT * 0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 0.42, 14]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
        {/* Digital Status Indicator Light */}
        <mesh position={[-0.012, COUNTER_HEIGHT * 0.42, 0.20]}>
          <circleGeometry args={[0.008, 12]} rotation={[0, -Math.PI / 2, 0]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={accentOn ? 2.5 : 0}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ---------------- E. OVERHEAD UPPER CABINETS WITH LED WASH ---------------- */}
      <group position={[counterDepth * 0.15, 2.15, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[counterDepth * 0.7, 0.85, counterLength]} />
          <meshPhysicalMaterial color={WOOD_ACCENT} roughness={0.45} metalness={0.15} clearcoat={0.2} />
        </mesh>
        <mesh position={[-counterDepth * 0.35 + 0.01, -0.42, 0]}>
          <boxGeometry args={[0.02, 0.008, counterLength - 0.1]} />
          <meshStandardMaterial
            color={WARM_LED}
            emissive={WARM_LED}
            emissiveIntensity={accentOn ? 3.5 : 0}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

// =============================================================================
// 4. WATERFALL QUARTZ ISLAND & ITALIAN BARSTOOLS (IN FRONT FOR DINING/BAR)
// =============================================================================
function WaterfallQuartzIsland({ position, accentOn = true }) {
  const quartzTexture = useMemo(() => makeQuartzTexture(), [])
  const islandW = 0.75
  const islandL = 2.00
  const islandH = COUNTER_HEIGHT

  return (
    <group position={position}>
      {/* 1. Main Island Body */}
      <mesh position={[0, islandH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[islandW, islandH, islandL]} />
        <meshPhysicalMaterial color={CABINET_COLOR} roughness={0.4} metalness={0.1} clearcoat={0.2} />
      </mesh>

      {/* 2. Waterfall Quartz Countertop Slab */}
      <mesh position={[0, islandH + 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[islandW + 0.04, 0.04, islandL + 0.04]} />
        <meshPhysicalMaterial
          map={quartzTexture}
          roughness={0.18}
          metalness={0.12}
          clearcoat={0.4}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* Waterfall Left & Right End Slabs */}
      {[-islandL / 2 - 0.01, islandL / 2 + 0.01].map((ez, i) => (
        <mesh key={i} position={[0, islandH / 2, ez]} castShadow receiveShadow>
          <boxGeometry args={[islandW + 0.04, islandH, 0.04]} />
          <meshPhysicalMaterial
            map={quartzTexture}
            roughness={0.18}
            metalness={0.12}
            clearcoat={0.4}
            clearcoatRoughness={0.08}
          />
        </mesh>
      ))}

      {/* Chrome Professional Espresso Machine on Island Corner */}
      <group position={[0.08, islandH + 0.04, -0.55]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.26, 0.32, 0.28]} />
          <meshPhysicalMaterial color="#d8dce2" roughness={0.15} metalness={0.95} clearcoat={0.4} />
        </mesh>
        <mesh position={[-0.14, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, 0.08, 12]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
      </group>
    </group>
  )
}

function ItalianBarstools({ islandPos }) {
  const stoolCount = 3
  const spacing = 0.62
  const stoolH = 0.68

  return (
    <group position={[islandPos[0] - 0.55, 0, islandPos[2]]}>
      {new Array(stoolCount).fill(0).map((_, i) => {
        const sz = -(stoolCount - 1) * spacing * 0.5 + i * spacing
        return (
          <group key={i} position={[0, 0, sz]}>
            {/* Tapered Black Metal Legs */}
            {[-0.14, 0.14].map((lx) =>
              [-0.14, 0.14].map((lz) => (
                <mesh key={`${lx}-${lz}`} position={[lx, stoolH / 2, lz]} castShadow>
                  <cylinderGeometry args={[0.01, 0.014, stoolH, 12]} />
                  <meshPhysicalMaterial color="#111215" roughness={0.3} metalness={0.85} />
                </mesh>
              )),
            )}
            {/* Brushed Brass Footrest Ring */}
            <mesh position={[0, 0.24, 0]}>
              <torusGeometry args={[0.18, 0.008, 12, 24]} rotation={[Math.PI / 2, 0, 0]} />
              <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
            </mesh>
            {/* Curved Velvet Seat Cushion */}
            <mesh position={[0, stoolH + 0.04, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.08, 20]} />
              <meshPhysicalMaterial color="#303540" roughness={0.7} metalness={0.1} clearcoat={0.15} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// =============================================================================
// 5. MAIN KITCHENETTE EXPORT
// =============================================================================
export default function Kitchenette({ accentOn = true }) {
  // Perimeter Wall Position along far right wall
  const wallX = HALL_FAR_X - COUNTER_DEPTH / 2 - 0.04

  // 1. Double-door French fridge on the left side touching the window (z = -3.5 + 0.55 = -2.95m)
  const fridgePos = [wallX, 0, -2.85]

  // 2. Continuous perimeter counter along the wall (centered at z = -0.75m, finishes at z = +0.80m)
  const counterPos = [wallX, 0, -0.75]

  // 3. Ultra-Slim Wall Chimney directly over the induction stove at z = -0.75 + (-1.00) = -1.75m (deep near window!)
  const chimneyPos = [wallX, 2.45, -1.75]

  // 4. Central Dining / Breakfast Island (centered at z = -0.75m)
  const islandPos = [HALL_FAR_X - 1.70, 0, -0.75]

  return (
    <group>
      <DoubleDoorFrenchFridge position={fridgePos} accentOn={accentOn} />
      <PerimeterWallKitchenCounter position={counterPos} accentOn={accentOn} />
      <SlimArchitecturalChimneyHood position={chimneyPos} accentOn={accentOn} />
      <WaterfallQuartzIsland position={islandPos} accentOn={accentOn} />
      <ItalianBarstools islandPos={islandPos} />
    </group>
  )
}
