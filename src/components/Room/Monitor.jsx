import { useMemo } from 'react'
import * as THREE from 'three'
import { DESK } from './layout'

const SCREEN_WIDTH = 0.9
const SCREEN_HEIGHT = 0.32
const CURVE_RADIUS = 0.85
const THETA_LENGTH = SCREEN_WIDTH / CURVE_RADIUS
const THETA_START = Math.PI / 2 - THETA_LENGTH / 2

function makeCodeScreenTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 200
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#0a0e14'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#12161f'
  ctx.fillRect(0, 0, canvas.width, 16)
  ctx.fillStyle = '#ff5f57'
  ctx.beginPath()
  ctx.arc(12, 8, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#febc2e'
  ctx.beginPath()
  ctx.arc(26, 8, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#28c840'
  ctx.beginPath()
  ctx.arc(40, 8, 4, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#1a1f2b'
  ctx.fillRect(0, 16, 34, canvas.height - 16)

  const colors = ['#c586c0', '#569cd6', '#4ec9b0', '#ce9178', '#9cdcfe', '#dcdcaa']
  const rand = (() => {
    let s = 7
    return () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
  })()

  let y = 34
  const lineHeight = 13
  const indents = [40, 40, 60, 80, 80, 60, 40, 40, 60, 60, 40]
  for (const indent of indents) {
    if (y > canvas.height - 12) break
    const segments = 1 + Math.floor(rand() * 3)
    let x = indent
    for (let s = 0; s < segments; s++) {
      const w = 20 + rand() * 90
      ctx.fillStyle = colors[Math.floor(rand() * colors.length)]
      ctx.fillRect(x, y, w, 6)
      x += w + 8
    }
    y += lineHeight
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function CurvedScreen() {
  const texture = useMemo(() => makeCodeScreenTexture(), [])

  return (
    <group>
      <mesh>
        <cylinderGeometry
          args={[CURVE_RADIUS, CURVE_RADIUS, SCREEN_HEIGHT, 24, 1, true, THETA_START, THETA_LENGTH]}
        />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={1.1}
          roughness={0.3}
          metalness={0.1}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <cylinderGeometry
          args={[
            CURVE_RADIUS + 0.015,
            CURVE_RADIUS + 0.015,
            SCREEN_HEIGHT + 0.035,
            24,
            1,
            true,
            THETA_START - 0.025,
            THETA_LENGTH + 0.05,
          ]}
        />
        <meshStandardMaterial color="#101012" roughness={0.5} metalness={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Stand({ height }) {
  return (
    <group>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[0.05, height, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.01, 0]} castShadow>
        <boxGeometry args={[0.2, 0.02, 0.22]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}

export default function Monitor() {
  const z = DESK.centerZ - 0.15
  const deskSurfaceY = DESK.height + 0.025
  const standHeight = 0.16
  const screenCenterY = standHeight + SCREEN_HEIGHT / 2 + 0.02
  const screenSurfaceX = DESK.frontX + 0.15

  return (
    <group position={[screenSurfaceX, deskSurfaceY, z]}>
      <Stand height={standHeight} />
      <group position={[-CURVE_RADIUS, screenCenterY, 0]}>
        <CurvedScreen />
      </group>
    </group>
  )
}
