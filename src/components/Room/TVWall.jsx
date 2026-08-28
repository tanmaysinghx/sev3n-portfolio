import { useMemo } from 'react'
import * as THREE from 'three'
import { ROOM_HEIGHT, ROOM_WIDTH, WALL_THICKNESS } from './dimensions'
import { TV_WALL } from './layout'

const TV_WIDTH = TV_WALL.width
const TV_HEIGHT = TV_WALL.height

const WALL_X = ROOM_WIDTH / 2 - WALL_THICKNESS / 2
const TV_Z = TV_WALL.centerZ
const TV_Y = 1.95

const PANEL_WIDTH = TV_WALL.panelWidth
const PANEL_HEIGHT = ROOM_HEIGHT - 0.04 // Full ceiling height
const PANEL_CENTER_Y = ROOM_HEIGHT / 2
const PANEL_THICKNESS = 0.035

const GLOW_COLOR = '#ffcf8a'
const GOLD_ACCENT = '#d4af37'
const WOOD_DARK = '#241a13'

function makeMarbleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#f2ede4'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Calacatta Gold Marble Veins
  const veins = [
    { start: [0, 60], cp1: [180, 160], cp2: [340, 50], end: [512, 110], color: 'rgba(185,155,110,0.45)', w: 4 },
    { start: [40, 0], cp1: [160, 200], cp2: [360, 340], end: [480, 512], color: 'rgba(140,140,145,0.3)', w: 3 },
    { start: [0, 360], cp1: [210, 420], cp2: [330, 310], end: [512, 430], color: 'rgba(195,165,120,0.4)', w: 2 },
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

function makeTVScreenTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 576
  const ctx = canvas.getContext('2d')

  // Vibrant HDR Cinema Scene
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
  grad.addColorStop(0, '#0a192f')
  grad.addColorStop(0.4, '#1b3b6f')
  grad.addColorStop(0.7, '#f77f00')
  grad.addColorStop(1, '#fcbf49')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Sunset Sun & Silhouette Mountains
  ctx.fillStyle = '#fff3b0'
  ctx.beginPath()
  ctx.arc(512, 380, 70, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#0b0f19'
  ctx.beginPath()
  ctx.moveTo(0, 420)
  ctx.lineTo(200, 340)
  ctx.lineTo(420, 410)
  ctx.lineTo(620, 320)
  ctx.lineTo(840, 390)
  ctx.lineTo(1024, 330)
  ctx.lineTo(1024, 576)
  ctx.lineTo(0, 576)
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function OLEDTV({ on }) {
  const tvTexture = useMemo(() => makeTVScreenTexture(), [])

  return (
    <group position={[WALL_X - PANEL_THICKNESS - 0.04, TV_Y, TV_Z]}>
      {/* 1. Titanium TV Bezel Outer Chassis */}
      <mesh castShadow>
        <boxGeometry args={[0.015, TV_HEIGHT + 0.018, TV_WIDTH + 0.018]} />
        <meshPhysicalMaterial color="#111215" roughness={0.2} metalness={0.95} />
      </mesh>

      {/* 2. 85" OLED HDR Screen Flush Surface */}
      <mesh position={[-0.008, 0, 0]}>
        <boxGeometry args={[0.002, TV_HEIGHT - 0.01, TV_WIDTH - 0.01]} />
        <meshPhysicalMaterial
          map={tvTexture}
          emissiveMap={tvTexture}
          emissive="#ffffff"
          emissiveIntensity={on ? 1.4 : 0.05}
          roughness={0.1}
          metalness={0.05}
          clearcoat={0.8}
          clearcoatRoughness={0.05}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Slim Acoustic Soundbar with Metallic Mesh Grille */}
      <group position={[-0.012, -TV_HEIGHT / 2 - 0.08, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.045, 0.055, TV_WIDTH * 0.75]} />
          <meshPhysicalMaterial color="#14161a" roughness={0.35} metalness={0.85} />
        </mesh>
        {/* Status Diode LED */}
        <mesh position={[-0.024, 0, 0]}>
          <sphereGeometry args={[0.003, 10, 10]} />
          <meshStandardMaterial
            color="#80d0ff"
            emissive="#80d0ff"
            emissiveIntensity={on ? 2.5 : 0}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

function MarbleAndSlatsMediaWall({ on }) {
  const marbleTexture = useMemo(() => makeMarbleTexture(), [])

  return (
    <group position={[WALL_X, PANEL_CENTER_Y, TV_Z]}>
      {/* 1. Full-Height Bookmatched Calacatta Gold Marble Slab */}
      <mesh receiveShadow>
        <boxGeometry args={[PANEL_THICKNESS, PANEL_HEIGHT, PANEL_WIDTH]} />
        <meshPhysicalMaterial
          map={marbleTexture}
          roughness={0.22}
          metalness={0.12}
          clearcoat={0.35}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Perimeter Warm LED Halo Glow */}
      {[-PANEL_WIDTH / 2, PANEL_WIDTH / 2].map((pz, i) => (
        <mesh key={`v-${i}`} position={[-PANEL_THICKNESS / 2 - 0.005, 0, pz]}>
          <boxGeometry args={[0.01, PANEL_HEIGHT, 0.02]} />
          <meshStandardMaterial
            color={GLOW_COLOR}
            emissive={GLOW_COLOR}
            emissiveIntensity={on ? 3.0 : 0}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* 2. Full-Height Fluted Dark Walnut Acoustic Slats flanking the marble */}
      {[-1, 1].map((side) => {
        const slatCount = 14
        const slatW = 0.034
        const startZ = side * (PANEL_WIDTH / 2 + 0.02)
        return (
          <group key={side} position={[0, 0, startZ]}>
            {new Array(slatCount).fill(0).map((_, idx) => (
              <mesh
                key={idx}
                position={[-0.01, 0, side * (idx * (slatW + 0.015) + slatW / 2)]}
                castShadow
              >
                <boxGeometry args={[0.025, PANEL_HEIGHT, slatW]} />
                <meshPhysicalMaterial color={WOOD_DARK} roughness={0.65} metalness={0.1} />
              </mesh>
            ))}
          </group>
        )
      })}
    </group>
  )
}

export default function TVWall({ accentOn = true }) {
  return (
    <group>
      <MarbleAndSlatsMediaWall on={accentOn} />
      <OLEDTV on={accentOn} />
    </group>
  )
}
