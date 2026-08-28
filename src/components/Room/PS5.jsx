export default function PS5({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.01, 0]} castShadow>
        <boxGeometry args={[0.11, 0.02, 0.15]} />
        <meshStandardMaterial color="#141416" roughness={0.4} metalness={0.4} />
      </mesh>

      <mesh position={[0, 0.19, 0]} castShadow>
        <boxGeometry args={[0.026, 0.34, 0.2]} />
        <meshStandardMaterial color="#131315" roughness={0.35} metalness={0.3} />
      </mesh>

      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.034, 0.215, 0]}
          rotation={[0, 0, -side * 0.07]}
          castShadow
        >
          <boxGeometry args={[0.044, 0.39, 0.22]} />
          <meshStandardMaterial color="#f2f3f5" roughness={0.3} metalness={0.05} />
        </mesh>
      ))}

      <mesh position={[0, 0.028, 0.06]}>
        <boxGeometry args={[0.09, 0.006, 0.02]} />
        <meshStandardMaterial
          color="#3fd0ff"
          emissive="#3fd0ff"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
