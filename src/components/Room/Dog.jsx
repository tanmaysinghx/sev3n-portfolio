import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Simple low-poly stylized sitting dog, built entirely from primitives to match
// the rest of the scene's procedural-geometry style. Faces -X (away from the
// right-hand wall, into the room), matching where the dog beds sit.

const EYE_COLOR = '#150f0a'
const NOSE_COLOR = '#100b08'

function Paw({ position, scale = 1, color }) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <sphereGeometry args={[0.032, 10, 8]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  )
}

function FloppyEar({ position, rotation, color }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <sphereGeometry args={[0.075, 10, 8]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  )
}

function PointedEar({ position, rotation, color }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <coneGeometry args={[0.045, 0.12, 8]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  )
}

// Fixed "fur poof" offsets for the fluffy breed — small clumps scattered over
// the torso/neck/chest to break up the silhouette without any per-frame cost.
const FUR_CLUMPS = [
  [0.05, 0.30, 0.07], [-0.03, 0.33, 0.09], [0.10, 0.24, 0.10],
  [-0.10, 0.26, 0.08], [0.02, 0.20, 0.13], [-0.08, 0.19, 0.11],
  [0.06, 0.14, -0.09], [-0.06, 0.15, -0.10], [0.00, 0.09, -0.12],
  [0.11, 0.11, -0.04], [-0.11, 0.10, -0.05], [0.00, 0.34, 0.02],
]

export default function Dog({
  position = [0, 0],
  groundY = 0,
  breed = 'labrador', // 'labrador' | 'pomeranian'
  coatColor = '#1a1a1a',
  bellyColor = '#2a2a2a',
  collarColor = '#d4af37',
  scale = 1,
}) {
  const [x, z] = position
  const tailRef = useRef()
  const headRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 3.2) * 0.18
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.6) * 0.08
    }
  })

  const isPom = breed === 'pomeranian'

  return (
    <group position={[x, groundY, z]} rotation={[0, -Math.PI / 2, 0]} scale={scale}>
      {/* Haunches (rear, tall — sitting silhouette) */}
      <mesh position={[-0.06, 0.155, 0]} scale={[1, 1.55, 1.05]} castShadow receiveShadow>
        <sphereGeometry args={[0.115, 16, 14]} />
        <meshStandardMaterial color={coatColor} roughness={0.88} />
      </mesh>

      {/* Chest (front, upright) */}
      <mesh position={[0.075, 0.20, 0]} scale={[0.85, 1.25, 0.85]} castShadow receiveShadow>
        <sphereGeometry args={[0.095, 16, 14]} />
        <meshStandardMaterial color={bellyColor} roughness={0.88} />
      </mesh>

      {/* Front legs */}
      <mesh position={[0.09, 0.075, 0.055]} castShadow>
        <cylinderGeometry args={[0.024, 0.021, 0.15, 10]} />
        <meshStandardMaterial color={coatColor} roughness={0.88} />
      </mesh>
      <mesh position={[0.09, 0.075, -0.055]} castShadow>
        <cylinderGeometry args={[0.024, 0.021, 0.15, 10]} />
        <meshStandardMaterial color={coatColor} roughness={0.88} />
      </mesh>
      <Paw position={[0.09, 0.005, 0.055]} color={coatColor} />
      <Paw position={[0.09, 0.005, -0.055]} color={coatColor} />

      {/* Neck */}
      <mesh position={[0.10, 0.32, 0]} rotation={[0, 0, -0.35]} castShadow>
        <cylinderGeometry args={[0.06, 0.075, 0.11, 12]} />
        <meshStandardMaterial color={coatColor} roughness={0.88} />
      </mesh>

      {/* Head group (subtle idle look-around) */}
      <group ref={headRef} position={[0.155, 0.395, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.072, 16, 14]} />
          <meshStandardMaterial color={coatColor} roughness={0.85} />
        </mesh>
        {/* Snout */}
        <mesh position={[0.075, -0.018, 0]} scale={[1, 0.85, 0.85]} castShadow>
          <sphereGeometry args={[isPom ? 0.032 : 0.042, 12, 10]} />
          <meshStandardMaterial color={isPom ? coatColor : bellyColor} roughness={0.85} />
        </mesh>
        {/* Nose */}
        <mesh position={[isPom ? 0.108 : 0.118, -0.018, 0]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshStandardMaterial color={NOSE_COLOR} roughness={0.4} />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.045, 0.015, 0.045]}>
          <sphereGeometry args={[0.009, 6, 6]} />
          <meshStandardMaterial color={EYE_COLOR} roughness={0.3} />
        </mesh>
        <mesh position={[0.045, 0.015, -0.045]}>
          <sphereGeometry args={[0.009, 6, 6]} />
          <meshStandardMaterial color={EYE_COLOR} roughness={0.3} />
        </mesh>

        {/* Ears */}
        {isPom ? (
          <>
            <PointedEar position={[-0.01, 0.078, 0.05]} rotation={[0, 0, -0.15]} color={coatColor} />
            <PointedEar position={[-0.01, 0.078, -0.05]} rotation={[0, 0, 0.15]} color={coatColor} />
          </>
        ) : (
          <>
            <FloppyEar position={[-0.03, 0.03, 0.075]} rotation={[0.2, 0, 0.5]} color={coatColor} />
            <FloppyEar position={[-0.03, 0.03, -0.075]} rotation={[-0.2, 0, 0.5]} color={coatColor} />
          </>
        )}
      </group>

      {/* Tail */}
      {isPom ? (
        <group ref={tailRef} position={[-0.16, 0.30, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.075, 12, 10]} />
            <meshStandardMaterial color={coatColor} roughness={0.9} />
          </mesh>
          <mesh position={[-0.03, 0.03, 0]}>
            <sphereGeometry args={[0.05, 10, 8]} />
            <meshStandardMaterial color={coatColor} roughness={0.9} />
          </mesh>
        </group>
      ) : (
        <mesh ref={tailRef} position={[-0.175, 0.19, 0]} rotation={[0, 0, 0.7]} castShadow>
          <coneGeometry args={[0.028, 0.26, 10]} />
          <meshStandardMaterial color={coatColor} roughness={0.85} />
        </mesh>
      )}

      {/* Fluffy fur clumps (pomeranian only) — static, no per-frame cost */}
      {isPom &&
        FUR_CLUMPS.map((p, i) => (
          <mesh key={i} position={p} castShadow>
            <sphereGeometry args={[0.045, 8, 7]} />
            <meshStandardMaterial color={coatColor} roughness={0.95} />
          </mesh>
        ))}

      {/* Collar + tag, colored to match the dog's own bed */}
      <mesh position={[0.11, 0.345, 0]} rotation={[0, 0, -0.35]}>
        <torusGeometry args={[0.068, 0.009, 8, 20]} />
        <meshStandardMaterial color={collarColor} roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  )
}
