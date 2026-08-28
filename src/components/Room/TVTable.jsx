import { useMemo } from 'react'
import * as THREE from 'three'
import { ROOM_WIDTH, WALL_THICKNESS } from './dimensions'
import { TV_WALL } from './layout'
import PS5 from './PS5'

// Sleek, reduced width and lowered mount height
const TABLE_WIDTH = TV_WALL.panelWidth * 0.78 // ~1.95m wide
const TABLE_DEPTH = 0.40
const CONSOLE_HEIGHT = 0.24
const TOP_THICKNESS = 0.03
const GOLD_TRIM = 0.01

// Lowered floating mount height
const MOUNT_Y = 0.62
const WALL_X = ROOM_WIDTH / 2 - WALL_THICKNESS / 2
const TABLE_X = WALL_X - 0.05 - TABLE_DEPTH / 2
const TABLE_Z = TV_WALL.centerZ

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

export default function TVTable({ accentOn = true }) {
  const marbleTexture = useMemo(() => makeMarbleTexture(), [])
  const drawerCount = 3
  const drawerWidth = TABLE_WIDTH / drawerCount

  return (
    <group position={[TABLE_X, MOUNT_Y, TABLE_Z]}>
      {/* 1. Main Floating Cabinet Body in Smoked Dark Walnut */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[TABLE_DEPTH, CONSOLE_HEIGHT, TABLE_WIDTH]} />
        <meshPhysicalMaterial
          color={WOOD_DARK}
          roughness={0.45}
          metalness={0.15}
          clearcoat={0.3}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* 2. Fluted Drawer Fronts with Champagne Gold Reveal Inlays */}
      {new Array(drawerCount).fill(0).map((_, i) => {
        const dz = -TABLE_WIDTH / 2 + (i + 0.5) * drawerWidth
        return (
          <group key={i} position={[-TABLE_DEPTH / 2 - 0.005, 0, dz]}>
            {/* Drawer Face */}
            <mesh castShadow>
              <boxGeometry args={[0.01, CONSOLE_HEIGHT - 0.025, drawerWidth - 0.015]} />
              <meshPhysicalMaterial color="#1a130e" roughness={0.6} metalness={0.2} />
            </mesh>
            {/* Minimalist Brushed Gold Horizontal Bar Pull */}
            <mesh position={[-0.008, 0, 0]} castShadow>
              <boxGeometry args={[0.008, 0.012, drawerWidth * 0.42]} />
              <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.25} metalness={0.95} />
            </mesh>
          </group>
        )
      })}

      {/* 3. Brushed Gold Accent Perimeter Reveal Trim */}
      <mesh position={[0, CONSOLE_HEIGHT / 2 + GOLD_TRIM / 2, 0]}>
        <boxGeometry args={[TABLE_DEPTH + 0.012, GOLD_TRIM, TABLE_WIDTH + 0.012]} />
        <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
      </mesh>

      {/* 4. Bookmatched Calacatta Gold Marble Slab Top */}
      <mesh position={[0, CONSOLE_HEIGHT / 2 + GOLD_TRIM + TOP_THICKNESS / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[TABLE_DEPTH + 0.025, TOP_THICKNESS, TABLE_WIDTH + 0.025]} />
        <meshPhysicalMaterial
          map={marbleTexture}
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.4}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* 5. Recessed Under-Cabinet Ambient LED Wash Down the Wall */}
      <mesh position={[0, -CONSOLE_HEIGHT / 2 - 0.006, 0]}>
        <boxGeometry args={[TABLE_DEPTH - 0.05, 0.008, TABLE_WIDTH - 0.05]} />
        <meshStandardMaterial
          color={WARM_GLOW}
          emissive={WARM_GLOW}
          emissiveIntensity={accentOn ? 2.8 : 0}
          toneMapped={false}
        />
      </mesh>

      {/* 6. PS5 Console Mounted Gracefully on the Credenza Top */}
      <PS5
        position={[-0.03, CONSOLE_HEIGHT / 2 + GOLD_TRIM + TOP_THICKNESS, TABLE_WIDTH * 0.28]}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </group>
  )
}
