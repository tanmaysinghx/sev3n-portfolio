import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { HALL_HEIGHT, HALL_ORIGIN_X } from './dimensions'

const SOFA_FABRIC = '#272b34'
const SOFA_CUSHION = '#323742'
const ACCENT_GOLD = '#d4af37'
const ACCENT_ROSE = '#c4687d'
const ACCENT_TEAL = '#2a9d8f'
const ACCENT_OCHRE = '#e09f3e'
const RUG_COLOR = '#c4bcb0'
const WOOD_DARK = '#241a13'
const WARM_GLOW = '#ffcf8a'
const WARM_LED = '#ffe4b5'

function makeMarbleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#f5f2eb'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Golden Amber & Slate Veining
  ctx.strokeStyle = 'rgba(195,160,115,0.5)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(0, 40)
  ctx.bezierCurveTo(160, 140, 340, 30, 512, 110)
  ctx.stroke()

  ctx.strokeStyle = 'rgba(145,150,160,0.35)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(60, 0)
  ctx.bezierCurveTo(240, 220, 380, 320, 460, 512)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// =============================================================================
// 1. LUXURY FLUTED WALNUT LOUVERS & BOOKMATCHED MARBLE FEATURE WALL BEHIND SOFA
// =============================================================================
function FeatureLouveredBackWall({ accentOn = true }) {
  const wallX = HALL_ORIGIN_X + 0.02
  const wallH = HALL_HEIGHT
  const wallStartZ = -2.25 // From near window doorway edge
  const wallEndZ = 3.45 // To front
  const totalLength = wallEndZ - wallStartZ // ~ 5.70m

  const marbleTexture = useMemo(() => makeMarbleTexture(), [])

  // Center Marble Slab Span (z = -0.70 to +1.30 = 2.0m wide)
  const marbleCenterZ = 0.30
  const marbleWidthZ = 2.40

  // Left Louver Section (-2.25 to -0.90 = 1.35m)
  const leftLouverStartZ = wallStartZ
  const leftLouverLength = (marbleCenterZ - marbleWidthZ / 2) - leftLouverStartZ

  // Right Louver Section (+1.50 to +3.45 = 1.95m)
  const rightLouverStartZ = marbleCenterZ + marbleWidthZ / 2
  const rightLouverLength = wallEndZ - rightLouverStartZ

  const slatSpacing = 0.068
  const slatW = 0.034
  const slatD = 0.026

  return (
    <group position={[wallX, 0, 0]}>
      {/* 1. Dark Walnut Backer Board */}
      <mesh position={[0, wallH / 2, (wallStartZ + wallEndZ) / 2]} receiveShadow>
        <boxGeometry args={[0.02, wallH, totalLength]} />
        <meshPhysicalMaterial color="#121316" roughness={0.9} metalness={0} />
      </mesh>

      {/* 2. Left Wing Fluted Dark Walnut Louver Slats */}
      {leftLouverLength > 0 &&
        new Array(Math.floor(leftLouverLength / slatSpacing)).fill(0).map((_, i) => {
          const sz = leftLouverStartZ + slatSpacing * (i + 0.5)
          return (
            <mesh key={`left-${i}`} position={[slatD / 2, wallH / 2, sz]} castShadow receiveShadow>
              <boxGeometry args={[slatD, wallH, slatW]} />
              <meshPhysicalMaterial color={WOOD_DARK} roughness={0.45} metalness={0.15} clearcoat={0.2} />
            </mesh>
          )
        })}

      {/* 3. Center Grand Bookmatched Calacatta Gold Marble Slab */}
      <group position={[0.015, wallH / 2, marbleCenterZ]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.03, wallH, marbleWidthZ]} />
          <meshPhysicalMaterial
            map={marbleTexture}
            roughness={0.18}
            metalness={0.1}
            clearcoat={0.6}
            clearcoatRoughness={0.06}
          />
        </mesh>

        {/* Brushed Champagne Gold Vertical Inlay Reveal Bands (Left & Right of Marble) */}
        {[-marbleWidthZ / 2 + 0.01, marbleWidthZ / 2 - 0.01].map((bz, i) => (
          <mesh key={i} position={[0.018, 0, bz]}>
            <boxGeometry args={[0.008, wallH, 0.018]} />
            <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.2} metalness={0.95} />
          </mesh>
        ))}

        {/* Vertical Ambient Warm LED Reveal Glow along Marble Edges */}
        {[-marbleWidthZ / 2 - 0.01, marbleWidthZ / 2 + 0.01].map((gz, i) => (
          <mesh key={i} position={[0.01, 0, gz]}>
            <boxGeometry args={[0.004, wallH - 0.2, 0.012]} />
            <meshStandardMaterial
              color={WARM_LED}
              emissive={WARM_LED}
              emissiveIntensity={accentOn ? 3.5 : 0}
              toneMapped={false}
            />
          </mesh>
        ))}

        {/* Floating Minimalist Backlit Art / Photo Display Ledge */}
        <group position={[0.04, -0.65, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.12, 0.03, marbleWidthZ * 0.85]} />
            <meshPhysicalMaterial color={WOOD_DARK} roughness={0.4} metalness={0.2} clearcoat={0.3} />
          </mesh>
          {/* Framed Fine Art Photographs Leaning on Shelf */}
          {[-0.55, 0, 0.55].map((fz, idx) => (
            <group key={idx} position={[0, 0.22, fz]} rotation={[0, 0, -0.06]}>
              <mesh castShadow>
                <boxGeometry args={[0.015, 0.38, 0.32]} />
                <meshPhysicalMaterial color="#111215" roughness={0.3} metalness={0.8} />
              </mesh>
              {/* Photo Matting & Monochrome Print */}
              <mesh position={[-0.009, 0, 0]}>
                <planeGeometry args={[0.26, 0.32]} />
                <meshPhysicalMaterial
                  color={idx === 1 ? '#e8e2d5' : '#22262d'}
                  roughness={0.5}
                  metalness={0.1}
                />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* 4. Right Wing Fluted Dark Walnut Louver Slats */}
      {rightLouverLength > 0 &&
        new Array(Math.floor(rightLouverLength / slatSpacing)).fill(0).map((_, i) => {
          const sz = rightLouverStartZ + slatSpacing * (i + 0.5)
          return (
            <mesh key={`right-${i}`} position={[slatD / 2, wallH / 2, sz]} castShadow receiveShadow>
              <boxGeometry args={[slatD, wallH, slatW]} />
              <meshPhysicalMaterial color={WOOD_DARK} roughness={0.45} metalness={0.15} clearcoat={0.2} />
            </mesh>
          )
        })}

      {/* 5. Continuous Floor Baseboard Warm LED Grazing Strip */}
      <mesh position={[0.025, 0.02, (wallStartZ + wallEndZ) / 2]}>
        <boxGeometry args={[0.015, 0.012, totalLength - 0.1]} />
        <meshStandardMaterial
          color={WARM_LED}
          emissive={WARM_LED}
          emissiveIntensity={accentOn ? 2.5 : 0}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function AreaRug() {
  return (
    <mesh position={[HALL_ORIGIN_X + 2.1, 0.008, 0.3]} receiveShadow>
      <boxGeometry args={[4.4, 0.015, 5.2]} />
      <meshPhysicalMaterial color={RUG_COLOR} roughness={0.95} metalness={0.02} />
    </mesh>
  )
}

function SectionalSofa() {
  const baseX = HALL_ORIGIN_X + 0.55
  const baseZ = 0.3
  const sofaLength = 4.5
  const seatH = 0.45
  const cushionT = 0.19
  const backH = 0.45
  const backT = 0.22

  const cushionOffsets = [-1.65, -0.55, 0.55, 1.65]

  return (
    <group position={[baseX, 0, baseZ]}>
      {/* Main Sofa Base Frame */}
      <mesh position={[0, (seatH - cushionT) / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.06, seatH - cushionT, sofaLength]} />
        <meshPhysicalMaterial color="#141518" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* 4 Deep Modular Seat Cushions with Fabric Sheen */}
      {cushionOffsets.map((zOffset, i) => (
        <mesh
          key={i}
          position={[0.02, seatH - cushionT / 2, zOffset]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.02, cushionT, 1.06]} />
          <meshPhysicalMaterial color={SOFA_CUSHION} roughness={0.82} metalness={0.05} clearcoat={0.1} />
        </mesh>
      ))}

      {/* Backrest along wall */}
      <mesh
        position={[-0.53 + backT / 2, seatH + backH / 2 - 0.02, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[backT, backH, sofaLength]} />
        <meshPhysicalMaterial color={SOFA_FABRIC} roughness={0.82} metalness={0.05} />
      </mesh>

      {/* 4 Plush Angled Back Pillows */}
      {cushionOffsets.map((zOffset, i) => (
        <mesh
          key={`back-${i}`}
          position={[-0.29, seatH + backH / 2, zOffset]}
          rotation={[0, 0, 0.1]}
          castShadow
        >
          <boxGeometry args={[0.19, backH - 0.06, 1.02]} />
          <meshPhysicalMaterial color={SOFA_CUSHION} roughness={0.85} metalness={0.05} />
        </mesh>
      ))}

      {/* Far Armrest */}
      <mesh position={[0, seatH + 0.14, -sofaLength / 2 - 0.09]} castShadow>
        <boxGeometry args={[1.06, 0.36, 0.18]} />
        <meshPhysicalMaterial color={SOFA_FABRIC} roughness={0.82} metalness={0.05} />
      </mesh>

      {/* Wide Chaise Lounge Extension */}
      <group position={[0.95, 0, 1.65]}>
        <mesh position={[0, (seatH - cushionT) / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.45, seatH - cushionT, 1.06]} />
          <meshPhysicalMaterial color="#141518" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0, seatH - cushionT / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.45, cushionT, 1.06]} />
          <meshPhysicalMaterial color={SOFA_CUSHION} roughness={0.82} metalness={0.05} clearcoat={0.1} />
        </mesh>
        {/* Throw Blanket */}
        <mesh position={[0.25, seatH + 0.015, 0]} rotation={[0, 0.12, 0]} castShadow>
          <boxGeometry args={[0.82, 0.02, 0.94]} />
          <meshPhysicalMaterial color={ACCENT_ROSE} roughness={0.7} metalness={0.1} clearcoat={0.2} />
        </mesh>
      </group>

      {/* Velvet Accent Throw Pillows */}
      {[
        { pos: [-0.15, seatH + 0.16, -1.8], col: ACCENT_TEAL, rot: 0.15 },
        { pos: [-0.15, seatH + 0.16, -0.6], col: ACCENT_OCHRE, rot: -0.1 },
        { pos: [-0.15, seatH + 0.16, 0.4], col: ACCENT_ROSE, rot: 0.2 },
        { pos: [0.35, seatH + 0.16, 1.65], col: ACCENT_TEAL, rot: -0.15 },
      ].map((p, idx) => (
        <mesh key={`pillow-${idx}`} position={p.pos} rotation={[0, p.rot, 0]} castShadow>
          <boxGeometry args={[0.34, 0.34, 0.14]} />
          <meshPhysicalMaterial color={p.col} roughness={0.65} metalness={0.12} clearcoat={0.25} />
        </mesh>
      ))}
    </group>
  )
}

// =============================================================================
// 2. FLOS ARCO STYLE DESIGNER CURVED BRASS FLOOR LAMP
// =============================================================================
function DesignerArcFloorLamp({ position, accentOn = true }) {
  return (
    <group position={position}>
      {/* 1. Heavy Calacatta Marble Cube Base */}
      <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.26, 0.48, 0.26]} />
        <meshPhysicalMaterial
          color="#f4eee4"
          roughness={0.18}
          metalness={0.1}
          clearcoat={0.5}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* 2. Sweeping Grand Curved Brass Arch Stem */}
      <group position={[0, 0.48, 0]}>
        {/* Vertical Riser */}
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.50, 16]} />
          <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.18} metalness={0.95} />
        </mesh>
        {/* Forward Arching Arm */}
        <mesh position={[0.45, 1.65, 0.45]} rotation={[0.4, 0, -0.4]}>
          <cylinderGeometry args={[0.01, 0.01, 1.30, 16]} />
          <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.18} metalness={0.95} />
        </mesh>
        {/* Top Drop Stem */}
        <mesh position={[0.85, 1.85, 0.85]}>
          <cylinderGeometry args={[0.008, 0.008, 0.45, 14]} />
          <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.18} metalness={0.95} />
        </mesh>

        {/* 3. Spun Brass Bell Shade */}
        <group position={[0.85, 1.60, 0.85]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.24, 0.18, 24]} />
            <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.18} metalness={0.95} clearcoat={0.3} />
          </mesh>
          {/* Glowing Diffuser Lens */}
          <mesh position={[0, -0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.22, 24]} />
            <meshStandardMaterial
              color={WARM_GLOW}
              emissive={WARM_GLOW}
              emissiveIntensity={accentOn ? 3.5 : 0}
              toneMapped={false}
            />
          </mesh>
          {/* Soft Downlight Glow */}
          <pointLight
            color={WARM_GLOW}
            intensity={accentOn ? 1.4 : 0}
            distance={5.0}
            decay={2}
            position={[0, -0.15, 0]}
          />
        </group>
      </group>
    </group>
  )
}

// =============================================================================
// 3. END TABLE WITH DESIGNER OPAL GLASS MUSHROOM TABLE LAMP
// =============================================================================
function SofaSideTableAndLamp({ position, accentOn = true }) {
  const tableH = 0.52
  const tableR = 0.24

  return (
    <group position={position}>
      {/* 1. Fluted Dark Walnut Pedestal Table with Brushed Gold Rim */}
      <mesh position={[0, tableH / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[tableR, tableR * 0.85, tableH, 24]} />
        <meshPhysicalMaterial color={WOOD_DARK} roughness={0.45} metalness={0.15} clearcoat={0.25} />
      </mesh>
      {/* Table Gold Top Bezel */}
      <mesh position={[0, tableH + 0.01, 0]}>
        <cylinderGeometry args={[tableR + 0.015, tableR + 0.015, 0.02, 24]} />
        <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.2} metalness={0.95} />
      </mesh>

      {/* 2. Designer Opal Glass & Brass Mushroom Table Lamp */}
      <group position={[0, tableH + 0.02, 0]}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.045, 0.065, 0.16, 18]} />
          <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.18} metalness={0.95} />
        </mesh>
        <mesh position={[0, 0.24, 0]} castShadow>
          <sphereGeometry args={[0.14, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={WARM_GLOW}
            emissive={WARM_GLOW}
            emissiveIntensity={accentOn ? 2.8 : 0}
            toneMapped={false}
          />
        </mesh>
        <pointLight
          color={WARM_GLOW}
          intensity={accentOn ? 0.75 : 0}
          distance={3.5}
          decay={2}
          position={[0, 0.22, 0]}
        />
      </group>
    </group>
  )
}

// =============================================================================
// 4. SCULPTURAL CERAMIC FLOOR PLANTER WITH FIDDLE LEAF FIG TREE
// =============================================================================
function FiddleLeafFigPlanter({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.18, 0.64, 24]} />
        <meshPhysicalMaterial color="#ede6dc" roughness={0.8} metalness={0.02} />
      </mesh>
      <mesh position={[0, 0.63, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.02, 20]} />
        <meshPhysicalMaterial color="#1a140f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.10, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.035, 1.0, 12]} />
        <meshPhysicalMaterial color="#4a3728" roughness={0.8} />
      </mesh>
      {[
        { pos: [0.12, 1.0, 0.08], rot: [0.3, 0.5, 0.2], s: 0.26 },
        { pos: [-0.14, 1.2, 0.05], rot: [-0.2, -0.8, -0.3], s: 0.28 },
        { pos: [0.05, 1.35, -0.15], rot: [0.6, 2.1, 0.1], s: 0.30 },
        { pos: [-0.08, 1.50, 0.12], rot: [-0.4, 0.3, -0.2], s: 0.32 },
        { pos: [0.10, 1.65, -0.05], rot: [0.2, -1.2, 0.3], s: 0.28 },
        { pos: [0.0, 1.78, 0.0], rot: [0.0, 0.0, 0.0], s: 0.26 },
      ].map((leaf, idx) => (
        <group key={idx} position={leaf.pos} rotation={leaf.rot} scale={[leaf.s, leaf.s * 1.4, leaf.s]}>
          <mesh castShadow>
            <sphereGeometry args={[0.6, 12, 8]} />
            <meshPhysicalMaterial
              color="#2d5e30"
              roughness={0.4}
              metalness={0.05}
              clearcoat={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// =============================================================================
// 5. NESTED COFFEE TABLES & CURATED DECOR (BOOKS, TRAY, CANDLE, CERAMIC VASE)
// =============================================================================
function NestedCoffeeTables() {
  const tableX = HALL_ORIGIN_X + 2.35
  const tableZ = 0.05

  return (
    <group position={[tableX, 0, tableZ]}>
      {/* 1. Main Calacatta Gold Marble Oval Table */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.28, 0.36, 20]} />
          <meshPhysicalMaterial color={ACCENT_GOLD} roughness={0.2} metalness={0.95} />
        </mesh>
        <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.04, 0.85]} />
          <meshPhysicalMaterial
            color="#f5efe6"
            roughness={0.18}
            metalness={0.12}
            clearcoat={0.4}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Stack of Luxury Architecture Hardcover Books */}
        <group position={[-0.35, 0.40, -0.12]}>
          <mesh position={[0, 0.015, 0]} rotation={[0, 0.08, 0]} castShadow>
            <boxGeometry args={[0.26, 0.028, 0.34]} />
            <meshPhysicalMaterial color="#1a1c22" roughness={0.4} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.042, 0]} rotation={[0, -0.05, 0]} castShadow>
            <boxGeometry args={[0.24, 0.024, 0.32]} />
            <meshPhysicalMaterial color="#c4a47c" roughness={0.5} metalness={0.1} />
          </mesh>
        </group>

        {/* Travertine Catchall Tray with Scented Glass Candle */}
        <group position={[0.25, 0.40, -0.10]}>
          <mesh position={[0, 0.01, 0]} castShadow>
            <boxGeometry args={[0.32, 0.02, 0.24]} />
            <meshPhysicalMaterial color="#e6dfd5" roughness={0.7} metalness={0.05} />
          </mesh>
          <mesh position={[0.06, 0.05, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.07, 14]} />
            <meshPhysicalMaterial color="#ffffff" transparent opacity={0.65} roughness={0.1} clearcoat={1.0} />
          </mesh>
          <mesh position={[0.06, 0.09, 0]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshStandardMaterial color={WARM_GLOW} emissive={WARM_GLOW} emissiveIntensity={3.0} toneMapped={false} />
          </mesh>
        </group>

        {/* Organic Ceramic Vase with Dried Bunny Tails */}
        <group position={[-0.05, 0.40, 0.18]}>
          <mesh position={[0, 0.10, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.08, 0.20, 16]} />
            <meshPhysicalMaterial color="#ded7cc" roughness={0.7} metalness={0.05} />
          </mesh>
          {[-0.02, 0, 0.02].map((fx, i) => (
            <mesh key={i} position={[fx, 0.26, (i - 1) * 0.02]} rotation={[0.1, (i - 1) * 0.3, 0]}>
              <cylinderGeometry args={[0.003, 0.003, 0.18, 6]} />
              <meshPhysicalMaterial color="#c8bca8" roughness={0.9} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 2. Secondary Smoked Glass Round Satellite Table */}
      <group position={[0.75, 0, 0.45]}>
        <mesh position={[0, 0.21, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.22, 0.42, 18]} />
          <meshPhysicalMaterial color="#1a1c22" roughness={0.3} metalness={0.88} />
        </mesh>
        <mesh position={[0, 0.44, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.02, 28]} />
          <meshPhysicalMaterial
            color="#2a2e38"
            transparent
            opacity={0.5}
            roughness={0.04}
            metalness={0.9}
            clearcoat={1.0}
          />
        </mesh>
      </group>
    </group>
  )
}

// =============================================================================
// 6. MAIN LIVING AREA EXPORT
// =============================================================================
export default function LivingArea({ accentOn = true }) {
  // Designer Arc floor lamp in sofa corner
  const lampPos = [HALL_ORIGIN_X + 0.35, 0, -2.15]
  // Side table with mushroom lamp
  const sideTablePos = [HALL_ORIGIN_X + 0.40, 0, 2.65]

  return (
    <group>
      {/* 1. Floor-to-Ceiling Fluted Walnut Louvers & Marble Feature Wall */}
      <FeatureLouveredBackWall accentOn={accentOn} />

      {/* 2. Furniture & Styling */}
      <AreaRug />
      <SectionalSofa />
      <NestedCoffeeTables />
      <DesignerArcFloorLamp position={lampPos} accentOn={accentOn} />
      <SofaSideTableAndLamp position={sideTablePos} accentOn={accentOn} />
    </group>
  )
}
