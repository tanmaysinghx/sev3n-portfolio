import { useMemo } from 'react'
import * as THREE from 'three'
import { DESK } from './layout'

const CASE_WIDTH = 0.24
const CASE_HEIGHT = 0.52
const CASE_DEPTH = 0.46

function Chassis() {
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[CASE_WIDTH, CASE_HEIGHT, CASE_DEPTH]} />
        <meshStandardMaterial color="#0e0f11" roughness={0.35} metalness={0.7} />
      </mesh>
      <mesh position={[-CASE_WIDTH / 2 - 0.006, 0, 0]}>
        <boxGeometry args={[0.008, CASE_HEIGHT - 0.02, CASE_DEPTH - 0.02]} />
        <meshStandardMaterial
          color="#bcd2ee"
          transparent
          opacity={0.22}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[CASE_WIDTH / 2 + 0.004, 0, CASE_DEPTH / 2 - 0.02]}>
        <boxGeometry args={[0.01, CASE_HEIGHT - 0.03, 0.02]} />
        <meshStandardMaterial
          color="#ff2fd0"
          emissive="#ff2fd0"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function RgbFan({ position, color }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.02, 16]} />
        <meshStandardMaterial color="#141416" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.011, 0]}>
        <ringGeometry args={[0.045, 0.07, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.4}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -0.011, 0]}>
        <ringGeometry args={[0.045, 0.07, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.4}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function Tubing() {
  const color = '#22e0ff'
  const curves = useMemo(() => {
    const topFan = new THREE.Vector3(-CASE_WIDTH / 2 + 0.02, CASE_HEIGHT / 2 - 0.1, -0.12)
    const pump = new THREE.Vector3(0, 0.02, 0.08)
    const bottomFan = new THREE.Vector3(-CASE_WIDTH / 2 + 0.02, -CASE_HEIGHT / 2 + 0.1, -0.12)

    const outbound = new THREE.CatmullRomCurve3([
      topFan,
      new THREE.Vector3(0.03, CASE_HEIGHT / 2 - 0.16, -0.02),
      new THREE.Vector3(0.05, 0.15, 0.06),
      pump,
    ])
    const inbound = new THREE.CatmullRomCurve3([
      pump,
      new THREE.Vector3(0.05, -0.15, 0.06),
      new THREE.Vector3(0.03, -CASE_HEIGHT / 2 + 0.16, -0.02),
      bottomFan,
    ])
    return [outbound, inbound]
  }, [])

  return (
    <group>
      {curves.map((curve, i) => (
        <mesh key={i} castShadow>
          <tubeGeometry args={[curve, 24, 0.012, 8, false]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.6}
            roughness={0.2}
            metalness={0}
            toneMapped={false}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.02, 0.09]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.09, 12]} />
        <meshStandardMaterial color="#1a1c1f" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.02, 0.09]}>
        <cylinderGeometry args={[0.046, 0.046, 0.01, 12]} />
        <meshStandardMaterial
          color="#22e0ff"
          emissive="#22e0ff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export default function PC() {
  const x = DESK.x + 0.05
  const z = DESK.backZ + 0.32
  const y = CASE_HEIGHT / 2

  return (
    <group position={[x, y, z]}>
      <Chassis />
      <group position={[-CASE_WIDTH / 2 - 0.012, 0, 0]}>
        <RgbFan position={[0, CASE_HEIGHT / 2 - 0.1, -0.12]} color="#22e0ff" />
        <RgbFan position={[0, -CASE_HEIGHT / 2 + 0.1, -0.12]} color="#a238ff" />
        <Tubing />
      </group>
    </group>
  )
}
