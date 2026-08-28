import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CAMERA_PRESETS } from './cameraPresets'

export default function CameraRig({ roomIndex, controlsRef }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(...CAMERA_PRESETS[0].position))
  const targetLookAt = useRef(new THREE.Vector3(...CAMERA_PRESETS[0].target))
  const isTransitioning = useRef(true)

  useEffect(() => {
    const preset = CAMERA_PRESETS[roomIndex] || CAMERA_PRESETS[0]
    targetPos.current.set(...preset.position)
    targetLookAt.current.set(...preset.target)
    isTransitioning.current = true
  }, [roomIndex])

  useFrame((_, delta) => {
    if (!isTransitioning.current) return

    const alpha = Math.min(1, delta * 2.8)
    camera.position.lerp(targetPos.current, alpha)

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, alpha)
      controlsRef.current.update()
    }

    const posDist = camera.position.distanceTo(targetPos.current)
    const lookDist = controlsRef.current
      ? controlsRef.current.target.distanceTo(targetLookAt.current)
      : 0

    // Snap exactly to target once close enough — prevents infinite lerp jitter
    if (posDist < 0.15 && lookDist < 0.15) {
      camera.position.copy(targetPos.current)
      if (controlsRef.current) {
        controlsRef.current.target.copy(targetLookAt.current)
        controlsRef.current.update()
      }
      isTransitioning.current = false
    }
  })

  // Listen to user manual interaction to release transition immediately
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const handleStart = () => {
      isTransitioning.current = false
    }

    controls.addEventListener('start', handleStart)
    return () => {
      controls.removeEventListener('start', handleStart)
    }
  }, [controlsRef])

  return null
}
