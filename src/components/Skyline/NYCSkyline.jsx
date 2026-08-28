import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { ROOM_HEIGHT } from '../Room/dimensions'

const TEXTURES = {
  day: '/textures/nyc_skyline_day.jpg',
  evening: '/textures/nyc_skyline_evening.jpg',
  night: '/textures/nyc_skyline_night.jpg',
}

export default function NYCSkyline({ timeOfDay }) {
  const [texture, setTexture] = useState(null)
  const loaderRef = useRef(new THREE.TextureLoader())
  const cacheRef = useRef({})

  const modeId = timeOfDay?.id || 'evening'

  useEffect(() => {
    const loader = loaderRef.current
    const path = TEXTURES[modeId] || TEXTURES.evening

    if (cacheRef.current[path]) {
      setTexture(cacheRef.current[path])
      return
    }

    loader.load(path, (loadedTex) => {
      loadedTex.colorSpace = THREE.SRGBColorSpace
      loadedTex.wrapS = THREE.ClampToEdgeWrapping
      loadedTex.wrapT = THREE.ClampToEdgeWrapping
      cacheRef.current[path] = loadedTex
      setTexture(loadedTex)
    })
  }, [modeId])

  // Soft glowing atmospheric backlight intensity based on time of day
  const emissiveIntensity =
    modeId === 'night' ? 0.35 : modeId === 'evening' ? 0.25 : 0.05

  return (
    <group position={[8.0, ROOM_HEIGHT * 0.45, -28]}>
      {/* Expansive Cylindrical Panorama Curved Around the Apartment */}
      <mesh position={[0, 8.5, 0]}>
        <cylinderGeometry
          args={[38, 38, 32, 64, 1, true, Math.PI * 0.62, Math.PI * 0.76]}
        />
        {texture ? (
          <meshBasicMaterial
            map={texture}
            side={THREE.BackSide}
            fog={false}
            depthWrite={false}
          />
        ) : (
          <meshBasicMaterial
            color={timeOfDay?.skyBottom || '#151433'}
            side={THREE.BackSide}
            fog={false}
          />
        )}
      </mesh>

      {/* Subtle Ambient City Glow Plane */}
      <mesh position={[0, 4.0, -1]}>
        <planeGeometry args={[120, 28]} />
        <meshBasicMaterial
          color={timeOfDay?.skyBottom || '#ff8844'}
          transparent
          opacity={emissiveIntensity}
          fog={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
