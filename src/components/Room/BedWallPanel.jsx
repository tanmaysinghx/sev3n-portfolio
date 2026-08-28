import { useMemo } from 'react'
import * as THREE from 'three'
import { ROOM_HEIGHT, ROOM_WIDTH, WALL_THICKNESS } from './dimensions'
import { BED } from './layout'

const WALL_X = -ROOM_WIDTH / 2 + WALL_THICKNESS / 2 // -3.0
const WOOD_DARK = '#241a13'
const GOLD_ACCENT = '#d4af37'
const WARM_GLOW = '#ffcf8a'

function makeMarbleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#f3eee6'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const veins = [
    { start: [0, 80], cp1: [180, 140], cp2: [320, 40], end: [512, 120], color: 'rgba(180,165,145,0.4)', w: 4 },
    { start: [60, 0], cp1: [140, 220], cp2: [380, 360], end: [460, 512], color: 'rgba(140,145,150,0.3)', w: 3 },
    { start: [0, 380], cp1: [200, 420], cp2: [340, 300], end: [512, 450], color: 'rgba(195,175,130,0.35)', w: 2 },
  ]

  veins.forEach((v) => {
    ctx.strokeStyle = v.color
    ctx.lineWidth = v.w
    ctx.beginPath()
    ctx.moveTo(v.start[0], v.start[1])
    ctx.bezierCurveTo(v.cp1[0], v.cp1[1], v.cp2[0], v.cp2[1], v.end[0], v.end[1])
    ctx.stroke()
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export default function BedWallPanel({ accentOn = true }) {
  const marbleTexture = useMemo(() => makeMarbleTexture(), [])
  // Main back wall spans from rear window (z = -3.5) to ensuite doorway (z = +2.15)
  const mainW = 5.65
  const wallH = ROOM_HEIGHT - 0.05
  const mainCenterZ = (-3.5 + 2.15) / 2 // -0.675m

  // Front wall return section to the left of the doorway from z = +3.05 to z = +3.50 (0.45m wide)
  const frontW = 0.45
  const frontCenterZ = (3.05 + 3.50) / 2 // +3.275m

  const slatW = 0.04
  const slatGap = 0.018

  return (
    <group>
      {/* ========================================================================= */}
      {/* 1. MAIN HEADBOARD WALL SECTION (z = -3.5 to z = +2.15) */}
      {/* ========================================================================= */}
      <group position={[WALL_X + 0.015, wallH / 2, mainCenterZ]}>
        {/* Dark Walnut Acoustic Backing Slab */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.02, wallH, mainW]} />
          <meshPhysicalMaterial color={WOOD_DARK} roughness={0.5} metalness={0.1} clearcoat={0.2} />
        </mesh>

        {/* Central Bookmatched Calacatta Gold Marble Feature Slab (Centered behind bed at z = 0.5) */}
        <group position={[0.012, 0, BED.centerZ - mainCenterZ]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[0.015, wallH - 0.18, 2.15]} />
            <meshPhysicalMaterial
              map={marbleTexture}
              roughness={0.2}
              metalness={0.12}
              clearcoat={0.35}
              clearcoatRoughness={0.1}
            />
          </mesh>

          {/* Brushed Champagne Gold Vertical Frame Borders */}
          {[-1.075, 1.075].map((bz, idx) => (
            <mesh key={idx} position={[0.01, 0, bz]} castShadow>
              <boxGeometry args={[0.008, wallH - 0.18, 0.022]} />
              <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
            </mesh>
          ))}

          {/* Vertical Warm LED Cove Channels Flanking Central Marble */}
          {[-1.095, 1.095].map((lz, idx) => (
            <mesh key={`led-${idx}`} position={[0.012, 0, lz]}>
              <boxGeometry args={[0.006, wallH - 0.2, 0.016]} />
              <meshStandardMaterial
                color={WARM_GLOW}
                emissive={WARM_GLOW}
                emissiveIntensity={accentOn ? 3.2 : 0}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>

        {/* Fluted Acoustic Dark Walnut Louvers on Left Wing (from window z = -3.5 up to bed marble slab) */}
        {new Array(28).fill(0).map((_, i) => {
          const sz = -mainW / 2 + (i + 0.5) * (slatW + slatGap) + 0.04
          return (
            <mesh key={`slat-l-${i}`} position={[0.014, 0, sz]} castShadow>
              <boxGeometry args={[0.016, wallH, slatW]} />
              <meshPhysicalMaterial color="#1a130e" roughness={0.65} metalness={0.15} />
            </mesh>
          )
        })}

        {/* Fluted Acoustic Dark Walnut Louvers on Right Wing (from bed marble slab up to doorway z = +2.15) */}
        {new Array(8).fill(0).map((_, i) => {
          const sz = mainW / 2 - (i + 0.5) * (slatW + slatGap) - 0.04
          return (
            <mesh key={`slat-r-${i}`} position={[0.014, 0, sz]} castShadow>
              <boxGeometry args={[0.016, wallH, slatW]} />
              <meshPhysicalMaterial color="#1a130e" roughness={0.65} metalness={0.15} />
            </mesh>
          )
        })}
      </group>

      {/* ========================================================================= */}
      {/* 2. EXPANDED RETURN WALL SECTION TO THE LEFT OF DOORWAY (z = +3.05 to +3.50) */}
      {/* ========================================================================= */}
      <group position={[WALL_X + 0.015, wallH / 2, frontCenterZ]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.02, wallH, frontW]} />
          <meshPhysicalMaterial color={WOOD_DARK} roughness={0.5} metalness={0.1} clearcoat={0.2} />
        </mesh>
        {/* 7 Louvers across the 0.45m wide front wall section */}
        {new Array(7).fill(0).map((_, i) => {
          const sz = -frontW / 2 + (i + 0.5) * (slatW + slatGap) + 0.02
          return (
            <mesh key={`slat-front-${i}`} position={[0.014, 0, sz]} castShadow>
              <boxGeometry args={[0.016, wallH, slatW]} />
              <meshPhysicalMaterial color="#1a130e" roughness={0.65} metalness={0.15} />
            </mesh>
          )
        })}
      </group>

      {/* ========================================================================= */}
      {/* 3. FLUTED DOORWAY ARCHITECTURAL CASING JAMBS (at z = 2.15 and z = 3.05) */}
      {/* ========================================================================= */}
      {[2.15, 3.05].map((jambZ, idx) => (
        <group key={`jamb-${idx}`} position={[WALL_X + 0.015, wallH / 2, jambZ]}>
          <mesh castShadow>
            <boxGeometry args={[0.05, wallH, 0.06]} />
            <meshPhysicalMaterial color={WOOD_DARK} roughness={0.4} metalness={0.2} clearcoat={0.25} />
          </mesh>
          <mesh position={[0.026, 0, 0]}>
            <boxGeometry args={[0.005, wallH, 0.015]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
