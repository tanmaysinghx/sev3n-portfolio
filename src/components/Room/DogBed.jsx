import { useMemo } from 'react'
import * as THREE from 'three'

function makeNameTexture(name, fabricColor) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = fabricColor
  ctx.beginPath()
  ctx.arc(256, 256, 250, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#2e2620'
  ctx.font = '700 72px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(name, 256, 256)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export default function DogBed({
  position,
  name,
  radius = 0.28,
  fabricColor = '#c9a876',
  rimColor = '#8a6a48',
}) {
  const [x, z] = position
  const texture = useMemo(() => makeNameTexture(name, fabricColor), [name, fabricColor])

  const cushionHeight = radius * 0.24
  const rimTube = radius * 0.16
  const rimRadius = radius * 1.05

  return (
    <group position={[x, 0, z]}>
      {/* 1. Plush Cushion Base */}
      <mesh position={[0, cushionHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, cushionHeight, 32]} />
        <meshPhysicalMaterial color={fabricColor} roughness={0.92} metalness={0.02} />
      </mesh>

      {/* 2. Embroidered Name Label */}
      <mesh position={[0, cushionHeight + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius - 0.03, 32]} />
        <meshStandardMaterial map={texture} roughness={0.88} metalness={0} />
      </mesh>

      {/* 3. Padded Velvet Outer Bolster Rim */}
      <mesh
        position={[0, cushionHeight + rimTube * 0.65, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <torusGeometry args={[rimRadius, rimTube, 16, 36]} />
        <meshPhysicalMaterial color={rimColor} roughness={0.9} metalness={0.02} />
      </mesh>
    </group>
  )
}
