import { ROOM_DEPTH, ROOM_HEIGHT } from '../Room/dimensions'

export default function Lighting({ timeOfDay }) {
  const sunColor = timeOfDay?.sunColor || '#ffd9a8'
  const sunIntensity = timeOfDay?.sunIntensity ?? 1.6
  const ambientIntensity = timeOfDay?.ambientIntensity ?? 0.28
  const hemiSky = timeOfDay?.hemiSky || '#bcd2f0'
  const hemiGround = timeOfDay?.hemiGround || '#4a3626'
  const sunPosition = timeOfDay?.sunPosition || [-3, ROOM_HEIGHT * 1.4, -ROOM_DEPTH * 0.9]

  return (
    <group>
      <ambientLight intensity={ambientIntensity} />
      <hemisphereLight args={[hemiSky, hemiGround, 0.45]} />

      <directionalLight
        position={sunPosition}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-10}
        shadow-camera-right={24}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.5}
        shadow-camera-far={45}
        shadow-bias={-0.0015}
      />
    </group>
  )
}
