import { useMemo } from 'react'
import * as THREE from 'three'
import { UnifiedBackWindow } from '../Common/UnifiedWindowWall'
import { WALL_THICKNESS } from '../Room/dimensions'
import {
  BATHROOM,
  ENSUITE_DOOR,
  ENSUITE_HEIGHT,
  ENSUITE_ORIGIN_X,
  ENSUITE_Z_MAX,
  ENSUITE_Z_MIN,
  WARDROBE,
} from './dimensions'

const WALL_COLOR = '#eae5dc'
const CEILING_COLOR = '#e6e0d2'
const GOLD_ACCENT = '#d4af37'
const TRIM_WOOD = '#241a13'

const TOTAL_DEPTH_Z = ENSUITE_Z_MAX - ENSUITE_Z_MIN
const TOTAL_WIDTH_X = ENSUITE_ORIGIN_X - BATHROOM.farX
const CENTER_X = (ENSUITE_ORIGIN_X + BATHROOM.farX) / 2
const CENTER_Z = (ENSUITE_Z_MIN + ENSUITE_Z_MAX) / 2

// 1. PURE STATUARIO WHITE MARBLE FLOOR TEXTURE (Large Format 120x120cm slabs)
function makeStatuarioWhiteFloorTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#f8f6f2'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Delicate Champagne Gold & Soft Feathered Grey Veins
  const veins = [
    { start: [0, 140], cp1: [300, 220], cp2: [650, 80], end: [1024, 160], color: 'rgba(190,160,120,0.35)', w: 3.5 },
    { start: [100, 0], cp1: [320, 380], cp2: [700, 680], end: [900, 1024], color: 'rgba(160,165,175,0.25)', w: 2.5 },
    { start: [0, 620], cp1: [380, 780], cp2: [680, 580], end: [1024, 820], color: 'rgba(195,165,130,0.3)', w: 2 },
  ]

  veins.forEach((v) => {
    ctx.strokeStyle = v.color
    ctx.lineWidth = v.w
    ctx.beginPath()
    ctx.moveTo(v.start[0], v.start[1])
    ctx.bezierCurveTo(v.cp1[0], v.cp1[1], v.cp2[0], v.cp2[1], v.end[0], v.end[1])
    ctx.stroke()
  })

  // Subtle Gold Grout Grid
  ctx.strokeStyle = 'rgba(212,175,55,0.35)'
  ctx.lineWidth = 2
  ctx.strokeRect(0, 0, 1024, 1024)
  ctx.strokeRect(0, 512, 1024, 512)
  ctx.strokeRect(512, 0, 512, 1024)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(BATHROOM.widthX / 2.0, TOTAL_DEPTH_Z / 2.0)
  return texture
}

// 2. LUXURY BOOKMATCHED CALACATTA GOLD SLAB WALL TILES
function makeLuxuryCalacattaWallTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#f5f2eb'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Elegant Bookmatched Gold & Soft Slate Veins
  const veins = [
    { start: [0, 80], cp1: [250, 180], cp2: [550, 60], end: [1024, 140], color: 'rgba(185,150,105,0.45)', w: 4 },
    { start: [60, 0], cp1: [220, 280], cp2: [620, 520], end: [850, 1024], color: 'rgba(145,150,160,0.3)', w: 3 },
    { start: [0, 480], cp1: [320, 560], cp2: [720, 380], end: [1024, 540], color: 'rgba(195,160,115,0.4)', w: 3.5 },
    { start: [0, 820], cp1: [380, 920], cp2: [700, 780], end: [1024, 880], color: 'rgba(150,155,165,0.25)', w: 2 },
  ]

  veins.forEach((v) => {
    ctx.strokeStyle = v.color
    ctx.lineWidth = v.w
    ctx.beginPath()
    ctx.moveTo(v.start[0], v.start[1])
    ctx.bezierCurveTo(v.cp1[0], v.cp1[1], v.cp2[0], v.cp2[1], v.end[0], v.end[1])
    ctx.stroke()
  })

  // Horizontal Large-Format Tile Reveals with Brushed Champagne Brass Inlays
  for (let y = 256; y <= 768; y += 256) {
    ctx.strokeStyle = 'rgba(212,175,55,0.65)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1.5, 2)
  return texture
}

function Floor() {
  const woodColor = '#6b4a34'
  const whiteFloorTexture = useMemo(() => makeStatuarioWhiteFloorTexture(), [])

  return (
    <group>
      {/* Walk-In Wardrobe Hardwood Floor */}
      <mesh position={[WARDROBE.centerX, -WALL_THICKNESS / 2, CENTER_Z]} receiveShadow>
        <boxGeometry args={[WARDROBE.widthX, WALL_THICKNESS, TOTAL_DEPTH_Z]} />
        <meshStandardMaterial color={woodColor} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Master Bathroom Pure Statuario White Marble Floor */}
      <mesh position={[BATHROOM.centerX, -WALL_THICKNESS / 2 + 0.001, CENTER_Z]} receiveShadow>
        <boxGeometry args={[BATHROOM.widthX, WALL_THICKNESS, TOTAL_DEPTH_Z]} />
        <meshPhysicalMaterial
          map={whiteFloorTexture}
          roughness={0.14}
          metalness={0.1}
          clearcoat={0.6}
          clearcoatRoughness={0.08}
        />
      </mesh>
    </group>
  )
}

function Ceiling() {
  return (
    <mesh position={[CENTER_X, ENSUITE_HEIGHT + WALL_THICKNESS / 2, CENTER_Z]} receiveShadow>
      <boxGeometry args={[TOTAL_WIDTH_X, WALL_THICKNESS, TOTAL_DEPTH_Z]} />
      <meshStandardMaterial color={CEILING_COLOR} roughness={0.95} metalness={0} />
    </mesh>
  )
}

function EnclosingWalls() {
  const leftX = BATHROOM.farX - WALL_THICKNESS / 2 // Far Left Wall
  const doorWidth = ENSUITE_DOOR.width
  const doorZ = ENSUITE_DOOR.centerZ

  const partitionWallStartZ = ENSUITE_Z_MIN
  const partitionWallEndZ = ENSUITE_Z_MAX

  const seg1Len = (doorZ - doorWidth / 2) - partitionWallStartZ
  const seg1CenterZ = partitionWallStartZ + seg1Len / 2

  const seg2Start = doorZ + doorWidth / 2
  const seg2Len = partitionWallEndZ - seg2Start
  const seg2CenterZ = seg2Start + seg2Len / 2

  const wallMarbleTexture = useMemo(() => makeLuxuryCalacattaWallTexture(), [])

  return (
    <group>
      {/* 1. Far Left Wall Finished in Bookmatched Calacatta Gold Marble Slabs */}
      <mesh position={[leftX, ENSUITE_HEIGHT / 2, CENTER_Z]} receiveShadow>
        <boxGeometry args={[WALL_THICKNESS, ENSUITE_HEIGHT, TOTAL_DEPTH_Z]} />
        <meshPhysicalMaterial
          map={wallMarbleTexture}
          roughness={0.18}
          metalness={0.1}
          clearcoat={0.4}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* 2. Mid Partition Wall between Wardrobe and Bathroom with Portal Opening */}
      <group position={[WARDROBE.farX, 0, 0]}>
        {seg1Len > 0 && (
          <mesh position={[0, ENSUITE_HEIGHT / 2, seg1CenterZ]} receiveShadow>
            <boxGeometry args={[WALL_THICKNESS, ENSUITE_HEIGHT, seg1Len]} />
            <meshPhysicalMaterial color={WALL_COLOR} roughness={0.88} metalness={0.02} />
          </mesh>
        )}
        {seg2Len > 0 && (
          <mesh position={[0, ENSUITE_HEIGHT / 2, seg2CenterZ]} receiveShadow>
            <boxGeometry args={[WALL_THICKNESS, ENSUITE_HEIGHT, seg2Len]} />
            <meshPhysicalMaterial color={WALL_COLOR} roughness={0.88} metalness={0.02} />
          </mesh>
        )}

        {/* Portal Architrave Trim with Gold Reveal */}
        <group position={[0, ENSUITE_HEIGHT / 2, doorZ - doorWidth / 2]}>
          <mesh castShadow>
            <boxGeometry args={[WALL_THICKNESS + 0.03, ENSUITE_HEIGHT, 0.08]} />
            <meshPhysicalMaterial color={TRIM_WOOD} roughness={0.4} metalness={0.2} clearcoat={0.2} />
          </mesh>
          <mesh position={[-WALL_THICKNESS / 2 - 0.016, 0, 0]}>
            <boxGeometry args={[0.004, ENSUITE_HEIGHT, 0.015]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
        </group>
        <group position={[0, ENSUITE_HEIGHT / 2, doorZ + doorWidth / 2]}>
          <mesh castShadow>
            <boxGeometry args={[WALL_THICKNESS + 0.03, ENSUITE_HEIGHT, 0.08]} />
            <meshPhysicalMaterial color={TRIM_WOOD} roughness={0.4} metalness={0.2} />
          </mesh>
          <mesh position={[-WALL_THICKNESS / 2 - 0.016, 0, 0]}>
            <boxGeometry args={[0.004, ENSUITE_HEIGHT, 0.015]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
        </group>
      </group>

      {/* 3. Unified Panoramic Window on the Rear Wall (Matches Bedroom Window Grid) */}
      <UnifiedBackWindow
        startX={BATHROOM.farX}
        width={TOTAL_WIDTH_X}
        backZ={ENSUITE_Z_MIN}
        height={ENSUITE_HEIGHT}
      />
    </group>
  )
}

export default function EnsuiteShell() {
  return (
    <group>
      <Floor />
      <Ceiling />
      <EnclosingWalls />
    </group>
  )
}
