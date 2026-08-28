import { DESK } from './layout'

const TOP_THICKNESS = 0.05

function DeskTop() {
  return (
    <mesh position={[DESK.x, DESK.height, DESK.centerZ]} castShadow receiveShadow>
      <boxGeometry args={[DESK.depth, TOP_THICKNESS, DESK.length]} />
      <meshStandardMaterial color="#111214" roughness={0.35} metalness={0.1} />
    </mesh>
  )
}

function ControlPanel() {
  const x = DESK.backX - 0.1
  const z = DESK.frontZ - 0.22
  const y = DESK.height - TOP_THICKNESS / 2 - 0.018
  return (
    <group position={[x, y, z]}>
      <mesh castShadow>
        <boxGeometry args={[0.08, 0.02, 0.14]} />
        <meshStandardMaterial color="#0e0e10" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.011, -0.02]}>
        <boxGeometry args={[0.05, 0.006, 0.028]} />
        <meshStandardMaterial
          color="#8fe0ff"
          emissive="#8fe0ff"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, -0.011, 0.03 + side * 0.028]}>
          <cylinderGeometry args={[0.009, 0.009, 0.006, 12]} />
          <meshStandardMaterial color="#2a2a2e" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function TLeg({ z }) {
  const legHeight = DESK.height - TOP_THICKNESS / 2
  const footLength = DESK.depth * 0.82
  return (
    <group position={[DESK.x, 0, z]}>
      <mesh position={[0, legHeight / 2, 0]} castShadow>
        <boxGeometry args={[0.06, legHeight, 0.05]} />
        <meshStandardMaterial color="#121214" roughness={0.4} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0.022, 0]} castShadow>
        <boxGeometry args={[footLength, 0.045, 0.06]} />
        <meshStandardMaterial color="#121214" roughness={0.4} metalness={0.55} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (footLength / 2), 0.022, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.0225, 0.0225, 0.045, 12]} />
          <meshStandardMaterial color="#0c0c0d" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function DeskLegs() {
  const inset = 0.18
  return (
    <group>
      <TLeg z={DESK.backZ + inset} />
      <TLeg z={DESK.frontZ - inset} />
      <ControlPanel />
    </group>
  )
}

function Keyboard() {
  const z = DESK.centerZ + 0.3
  return (
    <group position={[DESK.frontX + 0.18, DESK.height + TOP_THICKNESS / 2, z]}>
      <mesh position={[0, 0.011, 0]} castShadow>
        <boxGeometry args={[0.12, 0.022, 0.38]} />
        <meshStandardMaterial color="#17181a" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.024, 0]}>
        <boxGeometry args={[0.1, 0.004, 0.34]} />
        <meshStandardMaterial
          color="#7a5cff"
          emissive="#7a5cff"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function Mouse() {
  const z = DESK.centerZ + 0.62
  return (
    <mesh
      position={[DESK.frontX + 0.1, DESK.height + TOP_THICKNESS / 2 + 0.018, z]}
      castShadow
    >
      <boxGeometry args={[0.065, 0.036, 0.11]} />
      <meshStandardMaterial color="#1c1d20" roughness={0.4} metalness={0.3} />
    </mesh>
  )
}

function MacBook() {
  const z = DESK.centerZ - 0.62
  const baseX = DESK.x
  const baseY = DESK.height + TOP_THICKNESS / 2
  return (
    <group position={[baseX, baseY, z]}>
      <mesh position={[0, 0.008, 0]} castShadow>
        <boxGeometry args={[0.3, 0.016, 0.21]} />
        <meshStandardMaterial color="#c7c9cc" roughness={0.35} metalness={0.7} />
      </mesh>
      <group position={[0, 0.016, -0.1]} rotation={[-1.78, 0, 0]}>
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.008]} />
          <meshStandardMaterial color="#d3d5d8" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.1, -0.005]}>
          <planeGeometry args={[0.26, 0.165]} />
          <meshStandardMaterial color="#0d1117" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.1, 0.0045]}>
          <circleGeometry args={[0.014, 16]} />
          <meshStandardMaterial
            color="#e8e8ea"
            emissive="#e8e8ea"
            emissiveIntensity={0.9}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

function GamingChair() {
  const z = DESK.centerZ
  const chairX = DESK.frontX - 0.8
  const seatHeight = 0.47
  return (
    <group position={[chairX, 0, z]}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.05, 12]} />
        <meshStandardMaterial color="#121212" roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[0, seatHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, seatHeight, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, seatHeight + 0.04, 0]} rotation={[0, 0, 0.05]} castShadow>
        <boxGeometry args={[0.42, 0.08, 0.44]} />
        <meshStandardMaterial color="#181818" roughness={0.8} metalness={0.05} />
      </mesh>
      <group position={[-0.19, seatHeight + 0.08, 0]} rotation={[0, 0, -0.18]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.09, 0.6, 0.44]} />
          <meshStandardMaterial color="#181818" roughness={0.8} metalness={0.05} />
        </mesh>
        <mesh position={[0.046, 0.3, 0]}>
          <boxGeometry args={[0.01, 0.5, 0.06]} />
          <meshStandardMaterial color="#b3122e" roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[0.02, 0.62, 0]} castShadow>
          <boxGeometry args={[0.08, 0.14, 0.28]} />
          <meshStandardMaterial color="#181818" roughness={0.8} metalness={0.05} />
        </mesh>
      </group>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0.02, seatHeight + 0.14, side * 0.24]} castShadow>
          <boxGeometry args={[0.32, 0.05, 0.05]} />
          <meshStandardMaterial color="#181818" roughness={0.7} metalness={0.1} />
        </mesh>
      ))}
    </group>
  )
}

export default function Desk() {
  return (
    <group>
      <DeskTop />
      <DeskLegs />
      <Keyboard />
      <Mouse />
      <MacBook />
      <GamingChair />
    </group>
  )
}
