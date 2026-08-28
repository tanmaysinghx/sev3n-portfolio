import { useMemo } from 'react'
import * as THREE from 'three'
import { BATHROOM, ENSUITE_HEIGHT, ENSUITE_Z_MAX, ENSUITE_Z_MIN, WARDROBE } from './dimensions'

const GOLD_ACCENT = '#d4af37'
const WARM_GLOW = '#ffcf8a'
const WOOD_DARK = '#241a13'
const SHOWER_STONE = '#181b20'
const SMART_BLUE = '#64b5f6'

// Luxury Aquatic Sapphire Blue Shower Mosaic Texture
function makeBlueShowerFloorTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#0f2b48'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const tileSize = 32
  for (let x = 0; x < canvas.width; x += tileSize) {
    for (let y = 0; y < canvas.height; y += tileSize) {
      const shade = Math.floor(Math.random() * 35)
      ctx.fillStyle = `rgb(${18 + shade}, ${60 + shade * 2}, ${120 + shade * 3})`
      ctx.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2)
    }
  }

  // Thin gold-tinged grout lines
  ctx.strokeStyle = 'rgba(212,175,55,0.4)'
  ctx.lineWidth = 1.5
  for (let x = 0; x <= canvas.width; x += tileSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }
  for (let y = 0; y <= canvas.height; y += tileSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 4)
  return texture
}

// =============================================================================
// 1. FULL WINDOW PANORAMIC WET ZONE (AT THE BACK BY THE WINDOW, z = -3.5 to -1.75)
// =============================================================================
function WindowWetZoneWithBathtubAndShower({ accentOn = true }) {
  const windowZ = ENSUITE_Z_MIN // -3.5m (Rear window wall)
  const wetDepth = 1.75
  const wetCenterZ = windowZ + wetDepth / 2 // -2.625m

  // Left Half = Walk-In Shower (x = -8.0 to -6.7)
  const showerCenterX = (BATHROOM.farX + BATHROOM.centerX) / 2 // ~ -7.35m
  const showerW = BATHROOM.widthX / 2 // ~ 1.30m

  // Right Half = Bathtub (x = -6.7 to -5.4)
  const tubCenterX = (BATHROOM.centerX + BATHROOM.originX) / 2 // ~ -6.05m
  const tubL = 1.65
  const tubW = 0.82
  const tubH = 0.60

  // Center Glass Divider between Shower & Bathtub (Extends floor-to-ceiling ENSUITE_HEIGHT = 3.35m)
  const dividerX = BATHROOM.centerX // ~ -6.70m
  const glassHeight = ENSUITE_HEIGHT

  const blueFloorTexture = useMemo(() => makeBlueShowerFloorTexture(), [])

  return (
    <group>
      {/* ---------------- 1. WALK-IN RAINFALL SHOWER (LEFT HALF BY WINDOW) ---------------- */}
      <group position={[showerCenterX, 0, wetCenterZ]}>
        {/* VIBRANT SAPPHIRE BLUE MOSAIC SHOWER FLOOR SLAB */}
        <mesh position={[0, 0.004, 0]} receiveShadow>
          <boxGeometry args={[showerW - 0.04, 0.008, wetDepth - 0.04]} />
          <meshPhysicalMaterial
            map={blueFloorTexture}
            color="#2563eb"
            roughness={0.12}
            metalness={0.15}
            clearcoat={0.8}
            clearcoatRoughness={0.05}
          />
        </mesh>

        {/* Recessed Backlit Shampoo Niche on Left Wall */}
        <group position={[-showerW / 2 + 0.045, 1.35, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.035, 0.42, 0.85]} />
            <meshPhysicalMaterial color="#0e1014" roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0.19, 0]}>
            <boxGeometry args={[0.03, 0.008, 0.82]} />
            <meshStandardMaterial
              color={WARM_GLOW}
              emissive={WARM_GLOW}
              emissiveIntensity={accentOn ? 3.5 : 0}
              toneMapped={false}
            />
          </mesh>
          {/* Luxury Spa Shampoo & Wash Bottles */}
          {[-0.25, 0, 0.25].map((bz, idx) => (
            <mesh key={idx} position={[0.015, -0.06, bz]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.14, 16]} />
              <meshPhysicalMaterial
                color={idx === 1 ? '#222831' : '#4a3319'}
                roughness={0.2}
                metalness={0.1}
                clearcoat={0.6}
              />
            </mesh>
          ))}
        </group>

        {/* Wall-Mounted Luxury Rainfall Shower System in Brushed Champagne Gold (y = 2.45m) */}
        <group position={[-showerW / 2 + 0.005, 2.45, 0]}>
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.045, 0.045, 0.015, 16]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
          {/* Horizontal Extension Arm */}
          <mesh position={[0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 0.48, 14]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
          {/* Downward Drop Elbow */}
          <mesh position={[0.48, -0.05, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.10, 14]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
          {/* Slim 32cm Rainfall Disc Head */}
          <mesh position={[0.48, -0.10, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.012, 24]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.18} metalness={0.95} />
          </mesh>
        </group>

        {/* Vertical Handheld Slider Rail with Hand Wand & Flexible Hose */}
        <group position={[-showerW / 2 + 0.005, 1.45, 0.35]}>
          <mesh position={[0.01, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.95, 14]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
          {/* Hand Wand */}
          <mesh position={[0.04, 0.18, 0]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.025, 0.22, 0.025]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
          {/* Thermostatic Mixer Dial */}
          <mesh position={[0.02, -0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 0.025, 16]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
        </group>

        {/* Linear Floor Drain Channel along window */}
        <mesh position={[0, 0.009, -wetDepth / 2 + 0.14]}>
          <boxGeometry args={[showerW - 0.15, 0.008, 0.08]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.25} metalness={0.92} />
        </mesh>
      </group>

      {/* ---------------- 2. FULL-HEIGHT CEILING GLASS DIVIDER SCREEN (RUNS FLOOR-TO-CEILING) ---------------- */}
      <group position={[dividerX, 0, wetCenterZ]}>
        {/* Full-Height Frameless Tempered Glass Partition */}
        <mesh position={[0, glassHeight / 2, 0]}>
          <boxGeometry args={[0.012, glassHeight, wetDepth - 0.04]} />
          <meshPhysicalMaterial
            color="#d8e8f8"
            transparent
            opacity={0.25}
            roughness={0.03}
            metalness={0.9}
            clearcoat={1.0}
          />
        </mesh>

        {/* Brushed Champagne Gold Bottom Floor Clamp Channel */}
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.026, 0.024, wetDepth - 0.02]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>

        {/* Top Gold Ceiling Channel Clamp Profile */}
        <mesh position={[0, glassHeight - 0.012, 0]}>
          <boxGeometry args={[0.026, 0.024, wetDepth - 0.02]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
      </group>

      {/* ---------------- 3. FREESTANDING SCULPTURAL BATHTUB (RIGHT HALF BY WINDOW) ---------------- */}
      <group position={[tubCenterX, 0, wetCenterZ]}>
        {/* Solid-Surface Modern Bathtub */}
        <group position={[0, tubH / 2 + 0.02, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[tubW, tubH, tubL]} />
            <meshPhysicalMaterial
              color="#fcfbfa"
              roughness={0.15}
              metalness={0.04}
              clearcoat={0.6}
              clearcoatRoughness={0.05}
            />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[tubW - 0.14, tubH - 0.06, tubL - 0.14]} />
            <meshPhysicalMaterial color="#eaf0f6" roughness={0.1} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[tubW - 0.16, tubL - 0.16]} />
            <meshPhysicalMaterial
              color="#9ecced"
              transparent
              opacity={0.65}
              roughness={0.02}
              metalness={0.8}
              clearcoat={1.0}
            />
          </mesh>
        </group>

        {/* Floor-Mounted Freestanding Brass Tap & Handshower */}
        <group position={[tubW / 2 + 0.14, 0, 0]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
          <mesh position={[0, 0.48, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.92, 14]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
          <mesh position={[-0.1, 0.94, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.014, 0.014, 0.24, 14]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
        </group>

        {/* Natural Teak Bath Caddy Tray Across Tub */}
        <group position={[0, tubH + 0.04, 0.1]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[tubW + 0.08, 0.025, 0.22]} />
            <meshPhysicalMaterial color="#6e4726" roughness={0.5} metalness={0.08} clearcoat={0.2} />
          </mesh>
          {/* Scented Candle in Glass */}
          <mesh position={[-0.18, 0.04, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.06, 14]} />
            <meshPhysicalMaterial
              color="#fffbe6"
              transparent
              opacity={0.6}
              roughness={0.1}
              metalness={0.8}
              clearcoat={1.0}
            />
          </mesh>
          <mesh position={[-0.18, 0.08, 0]}>
            <sphereGeometry args={[0.008, 10, 10]} />
            <meshStandardMaterial
              color={WARM_GLOW}
              emissive={WARM_GLOW}
              emissiveIntensity={accentOn ? 3.0 : 0}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}

// =============================================================================
// 2. SINGLE LUXURY WASH BASIN FLOATING VANITY & PROMINENT ARCHED MIRROR
// =============================================================================
function SingleWashBasinVanity({ accentOn = true }) {
  const vanityW = 0.52 // Depth into room
  const vanityL = 1.35 // Length along Z
  const vanityH = 0.50
  const floatY = 0.45

  // Mounted flush against left wall (x = -8.0)
  const posX = BATHROOM.farX + vanityW / 2 // -8.0 + 0.26 = -7.74m
  const posZ = -0.35 // Centered in dry zone between shower and storage shelf

  return (
    <group position={[posX, floatY, posZ]}>
      {/* 1. Fluted Dark Walnut Floating Cabinet Body */}
      <mesh position={[0, vanityH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[vanityW, vanityH, vanityL]} />
        <meshPhysicalMaterial color={WOOD_DARK} roughness={0.45} metalness={0.15} clearcoat={0.25} />
      </mesh>

      {/* 2. Calacatta Gold Marble Slab Countertop */}
      <mesh position={[0.01, vanityH + 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[vanityW + 0.02, 0.04, vanityL + 0.03]} />
        <meshPhysicalMaterial
          color="#f5efe6"
          roughness={0.18}
          metalness={0.1}
          clearcoat={0.4}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* 3. Under-Cabinet Floating Warm LED Glow */}
      <mesh position={[0, -0.006, 0]}>
        <boxGeometry args={[vanityW - 0.04, 0.008, vanityL - 0.08]} />
        <meshStandardMaterial
          color={WARM_GLOW}
          emissive={WARM_GLOW}
          emissiveIntensity={accentOn ? 2.8 : 0}
          toneMapped={false}
        />
      </mesh>

      {/* 4. Single Under-Mount Porcelain Basin */}
      <mesh position={[0.02, vanityH + 0.02 - 0.04, 0]}>
        <boxGeometry args={[vanityW * 0.65, 0.12, 0.54]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.08} metalness={0.04} />
      </mesh>

      {/* 5. Gooseneck Brushed Brass Faucet */}
      <group position={[-vanityW / 2 + 0.06, vanityH + 0.14, 0]}>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.14, 14]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
        <mesh position={[0.08, 0.14, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.01, 0.01, 0.16, 14]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
      </group>

      {/* 6. PROMINENT GRAND ARCHED LED BACKLIT MIRROR */}
      <group position={[-vanityW / 2 + 0.02, vanityH + 0.65, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.016, 1.15, 0.78]} />
          <meshPhysicalMaterial color="#1a1c22" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0.009, 0, 0]}>
          <boxGeometry args={[0.004, 1.17, 0.80]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
        <mesh position={[0.012, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.74, 1.11]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.0}
            metalness={0.98}
            clearcoat={1.0}
            clearcoatRoughness={0.0}
          />
        </mesh>
        <mesh position={[-0.005, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.78, 1.16]} />
          <meshStandardMaterial
            color={WARM_GLOW}
            emissive={WARM_GLOW}
            emissiveIntensity={accentOn ? 3.5 : 0}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

// =============================================================================
// 3. LEFTMOST MULTI-TIER STORAGE SHELF (IN FRONT OF DOORWAY FOR PAPER & ESSENTIALS)
// =============================================================================
function LeftmostBathroomStorageShelf({ accentOn = true }) {
  const shelfW = 0.36 // Depth into room
  const shelfL = 0.90 // Length along Z
  const shelfH = 2.15 // Tall luxury etagere height

  // Mounted flush on the leftmost wall (x = -8.0), located directly in front of the door (z = 1.35m)
  const posX = BATHROOM.farX + shelfW / 2 // -8.0 + 0.18 = -7.82m
  const posZ = 1.35

  const tierHeights = [0.05, 0.55, 1.05, 1.55, 2.05]

  return (
    <group position={[posX, 0, posZ]}>
      {/* 1. Main Fluted Dark Walnut Backing & Frame */}
      <mesh position={[0, shelfH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[shelfW, shelfH, shelfL]} />
        <meshPhysicalMaterial color={WOOD_DARK} roughness={0.45} metalness={0.15} clearcoat={0.25} />
      </mesh>

      {/* Hollow Interior Niche */}
      <mesh position={[0.02, shelfH / 2, 0]}>
        <boxGeometry args={[shelfW - 0.04, shelfH - 0.08, shelfL - 0.08]} />
        <meshPhysicalMaterial color="#1a1410" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Brushed Champagne Gold Perimeter Reveal Trim */}
      <mesh position={[shelfW / 2 + 0.002, shelfH / 2, 0]}>
        <boxGeometry args={[0.006, shelfH, shelfL]} />
        <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
      </mesh>

      {/* 2. Glass Shelves with Under-Shelf Warm LED Strip Lighting */}
      {tierHeights.map((th, i) => (
        <group key={i} position={[0.02, th, 0]}>
          {/* Tempered Glass Shelf */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[shelfW - 0.04, 0.012, shelfL - 0.08]} />
            <meshPhysicalMaterial
              color="#d8e8f8"
              transparent
              opacity={0.35}
              roughness={0.05}
              metalness={0.9}
              clearcoat={1.0}
            />
          </mesh>
          {/* LED Strip Wash Under Shelf */}
          <mesh position={[0, -0.008, 0]}>
            <boxGeometry args={[shelfW - 0.06, 0.004, shelfL - 0.1]} />
            <meshStandardMaterial
              color={WARM_GLOW}
              emissive={WARM_GLOW}
              emissiveIntensity={accentOn ? 2.5 : 0}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* 3. SHELF CONTENTS */}

      {/* Tier 1 (Bottom): Stored Reserve Toilet Paper Packs */}
      <group position={[0.02, 0.22, 0]}>
        {[-0.26, -0.08, 0.08, 0.26].map((tz, idx) => (
          <group key={idx} position={[0, 0, tz]}>
            {/* 2-Roll Vertical Toilet Paper Stacks */}
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.11, 16]} />
              <meshPhysicalMaterial color="#faf8f5" roughness={0.9} metalness={0.02} />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.11, 16]} />
              <meshPhysicalMaterial color="#faf8f5" roughness={0.9} metalness={0.02} />
            </mesh>
            {/* Gold Wrapping Band */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.056, 0.056, 0.02, 16]} />
              <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Tier 2: Stacked White Spa Bath & Hand Towels */}
      <group position={[0.02, 0.72, 0]}>
        {[-0.18, 0.18].map((tz, idx) => (
          <group key={idx} position={[0, 0, tz]}>
            {[0, 0.045, 0.09].map((ty, yIdx) => (
              <mesh key={yIdx} position={[0, ty, 0]} castShadow>
                <boxGeometry args={[0.24, 0.038, 0.30]} />
                <meshPhysicalMaterial color="#f7f5f0" roughness={0.95} metalness={0.01} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Tier 3: Additional Toilet Rolls & Woven Basket */}
      <group position={[0.02, 1.22, 0]}>
        {/* Natural Rattan Storage Caddy Basket */}
        <mesh position={[0, -0.06, 0.16]} castShadow>
          <boxGeometry args={[0.26, 0.12, 0.38]} />
          <meshPhysicalMaterial color="#8c6239" roughness={0.8} metalness={0.05} />
        </mesh>
        {/* Toilet Paper Rolls in Basket */}
        {[-0.08, 0.08].map((tz, idx) => (
          <mesh key={idx} position={[0, 0.02, 0.16 + tz]}>
            <cylinderGeometry args={[0.052, 0.052, 0.10, 16]} />
            <meshPhysicalMaterial color="#faf8f5" roughness={0.9} metalness={0.02} />
          </mesh>
        ))}
        {/* Amber Glass Bath Salts Jar */}
        <mesh position={[0, -0.02, -0.22]}>
          <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} />
          <meshPhysicalMaterial color="#c68a4c" roughness={0.1} metalness={0.2} clearcoat={0.8} />
        </mesh>
      </group>

      {/* Tier 4: Spa Reed Diffuser & Amber Essential Oils */}
      <group position={[0.02, 1.72, 0]}>
        {/* Glass Diffuser Bottle with Wooden Reeds */}
        <group position={[0, 0, -0.15]}>
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.08, 14]} />
            <meshPhysicalMaterial color="#ffffff" transparent opacity={0.6} roughness={0.05} metalness={0.8} />
          </mesh>
          {[-0.015, 0, 0.015].map((rz, i) => (
            <mesh key={i} position={[0, 0.08, rz]} rotation={[0, 0, (i - 1) * 0.15]}>
              <cylinderGeometry args={[0.003, 0.003, 0.18, 8]} />
              <meshPhysicalMaterial color="#a07a50" roughness={0.7} />
            </mesh>
          ))}
        </group>
        {/* Luxury Spa Lotion Pump */}
        <mesh position={[0, -0.02, 0.15]}>
          <cylinderGeometry args={[0.035, 0.035, 0.13, 14]} />
          <meshPhysicalMaterial color="#222831" roughness={0.2} metalness={0.2} clearcoat={0.5} />
        </mesh>
      </group>

      {/* Tier 5 (Top): Potted Trailing Green Succulent */}
      <group position={[0.02, 2.18, 0]}>
        {/* Matte White Ceramic Planter Pot */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.05, 0.12, 16]} />
          <meshPhysicalMaterial color="#f0eee9" roughness={0.3} metalness={0.05} />
        </mesh>
        {/* Vibrant Green Succulent Foliage */}
        <mesh position={[0, 0.14, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshPhysicalMaterial color="#38703b" roughness={0.7} metalness={0.05} />
        </mesh>
      </group>
    </group>
  )
}

// =============================================================================
// 4. JAPANESE SMART TOILET SUITE WITH CLEAN OPEN LID & HARDWARE
// =============================================================================
function WallHungSmartToiletSuite({ accentOn = true }) {
  const potDepth = 0.56
  const potWidth = 0.38
  const potHeight = 0.34

  // Mounted flush touching the right partition wall at x = -5.4
  const posX = BATHROOM.originX - potDepth / 2 // -5.4 - 0.28 = -5.68m
  const posZ = 0.85 // Centered in dry zone

  return (
    <group position={[posX, 0.22, posZ]}>
      {/* 1. Sculptural Ceramic Toilet Body */}
      <group position={[0, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[potDepth, potHeight, potWidth]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.06}
            metalness={0.02}
            clearcoat={0.8}
            clearcoatRoughness={0.04}
          />
        </mesh>

        {/* Inner Hollow Ceramic Bowl Basin */}
        <mesh position={[-0.04, 0.04, 0]}>
          <boxGeometry args={[potDepth * 0.65, potHeight - 0.08, potWidth * 0.72]} />
          <meshPhysicalMaterial color="#edf2f7" roughness={0.1} metalness={0.02} />
        </mesh>

        {/* Clear Sanitized Water Trap */}
        <mesh position={[-0.04, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[potDepth * 0.55, potWidth * 0.62]} />
          <meshPhysicalMaterial
            color="#a8d5e5"
            transparent
            opacity={0.7}
            roughness={0.02}
            metalness={0.8}
            clearcoat={1.0}
          />
        </mesh>

        {/* Smart Bidet Soft Blue Nightlight Halo */}
        <mesh position={[-0.04, 0.12, 0]}>
          <boxGeometry args={[potDepth * 0.66, 0.006, potWidth * 0.73]} />
          <meshStandardMaterial
            color={SMART_BLUE}
            emissive={SMART_BLUE}
            emissiveIntensity={accentOn ? 2.5 : 0}
            toneMapped={false}
          />
        </mesh>

        {/* Ergonomic Toilet Seat Ring */}
        <group position={[-0.04, potHeight / 2 + 0.012, 0]}>
          <mesh position={[-potDepth * 0.28, 0, 0]}>
            <boxGeometry args={[0.08, 0.02, potWidth * 0.78]} />
            <meshPhysicalMaterial color="#f7f7f7" roughness={0.12} metalness={0.02} />
          </mesh>
          <mesh position={[potDepth * 0.22, 0, 0]}>
            <boxGeometry args={[0.10, 0.02, potWidth * 0.78]} />
            <meshPhysicalMaterial color="#f7f7f7" roughness={0.12} metalness={0.02} />
          </mesh>
          {[-potWidth * 0.34, potWidth * 0.34].map((sz, i) => (
            <mesh key={i} position={[-0.03, 0, sz]}>
              <boxGeometry args={[potDepth * 0.50, 0.02, 0.08]} />
              <meshPhysicalMaterial color="#f7f7f7" roughness={0.12} metalness={0.02} />
            </mesh>
          ))}
        </group>

        {/* OPEN TOILET LID (STANDING UPRIGHT AGAINST WALL) */}
        <group position={[potDepth / 2 - 0.04, potHeight / 2 + 0.22, 0]} rotation={[0, 0, 0.08]}>
          <mesh castShadow>
            <boxGeometry args={[0.022, 0.44, potWidth * 0.82]} />
            <meshPhysicalMaterial
              color="#ffffff"
              roughness={0.06}
              metalness={0.02}
              clearcoat={0.8}
              clearcoatRoughness={0.04}
            />
          </mesh>
          <mesh position={[-0.012, 0.08, 0]}>
            <boxGeometry args={[0.002, 0.08, 0.04]} />
            <meshStandardMaterial
              color="#3a424e"
              emissive="#64b5f6"
              emissiveIntensity={accentOn ? 2.0 : 0}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.016, 0.016, potWidth * 0.75, 16]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
        </group>
      </group>

      {/* 2. Concealed Tank Flush Actuator Plate in Brushed Gold on Right Wall */}
      <group position={[potDepth / 2 + 0.004, 0.62, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.008, 0.15, 0.24]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
        {[-0.045, 0.045].map((bz, i) => (
          <mesh key={i} position={[-0.006, 0, bz]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[i === 0 ? 0.022 : 0.03, 18]} />
            <meshPhysicalMaterial color="#ffffff" roughness={0.3} metalness={0.2} />
          </mesh>
        ))}
      </group>

      {/* 3. PROMINENT BRUSHED GOLD TOILET PAPER ROLL DISPENSER WITH DRAPED TISSUE */}
      <group position={[potDepth / 2 + 0.004, 0.35, 0.38]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.01, 14]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
        <mesh position={[-0.04, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.16, 14]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
        <mesh position={[-0.04, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.14, 20]} />
          <meshPhysicalMaterial color="#faf8f5" roughness={0.92} metalness={0.01} />
        </mesh>
        <mesh position={[-0.105, -0.06, 0]}>
          <boxGeometry args={[0.004, 0.12, 0.13]} />
          <meshPhysicalMaterial color="#faf8f5" roughness={0.92} metalness={0.01} />
        </mesh>
      </group>

      {/* 4. PROMINENT BRUSHED CHAMPAGNE GOLD HEALTH FAUCET / JET SPRAY & BIDET HOSE */}
      <group position={[potDepth / 2 + 0.004, 0.35, -0.38]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.012, 16]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
        </mesh>
        <group position={[-0.04, -0.02, 0]} rotation={[0, 0, -0.2]}>
          <mesh>
            <boxGeometry args={[0.022, 0.16, 0.026]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
          <mesh position={[0, -0.09, 0]}>
            <cylinderGeometry args={[0.014, 0.018, 0.03, 14]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
          <mesh position={[0.015, 0.02, 0]}>
            <boxGeometry args={[0.01, 0.05, 0.016]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.18} metalness={0.95} />
          </mesh>
        </group>
        <mesh position={[-0.04, -0.16, 0]}>
          <torusGeometry args={[0.045, 0.009, 12, 24]} rotation={[0, Math.PI / 2, 0]} />
          <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.3} metalness={0.92} />
        </mesh>
      </group>
    </group>
  )
}

// =============================================================================
// 5. MAIN MODERN BATHROOM EXPORT
// =============================================================================
export default function ModernBathroom({ accentOn = true }) {
  return (
    <group>
      <WindowWetZoneWithBathtubAndShower accentOn={accentOn} />
      <SingleWashBasinVanity accentOn={accentOn} />
      <LeftmostBathroomStorageShelf accentOn={accentOn} />
      <WallHungSmartToiletSuite accentOn={accentOn} />
    </group>
  )
}
