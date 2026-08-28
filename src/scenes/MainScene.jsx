import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import Ensuite from '../components/Ensuite/Ensuite'
import { LIGHTING_PRESETS, TIME_OF_DAY_PRESETS } from '../components/Lighting/presets'
import Bed from '../components/Room/Bed'
import BedWallPanel from '../components/Room/BedWallPanel'
import Carpet from '../components/Room/Carpet'
import Dog from '../components/Room/Dog'
import DogBed from '../components/Room/DogBed'
import DogBowls from '../components/Room/DogBowls'
import FalseCeiling from '../components/Lighting/FalseCeiling'
import HallKitchen from '../components/HallKitchen/HallKitchen'
import LandingFoyer from '../components/EntranceLanding/LandingFoyer'
import Lighting from '../components/Lighting/Lighting'
import Nightstand from '../components/Room/Nightstand'
import PendantLamp from '../components/Room/PendantLamp'
import RoomShell from '../components/Room/RoomShell'
import SlidingBathroomDoor from '../components/Room/SlidingBathroomDoor'
import TVTable from '../components/Room/TVTable'
import TVWall from '../components/Room/TVWall'
import WallConsole from '../components/Room/WallConsole'
import Window from '../components/Room/Window'
import { ROOM_WIDTH, WALL_THICKNESS } from '../components/Room/dimensions'
import { BED, NIGHTSTAND, TV_WALL } from '../components/Room/layout'
import StudyRoom from '../components/Study/StudyRoom'
import PenthouseBuildingStructure from '../components/Building/PenthouseBuildingStructure'
import CameraRig from './CameraRig'
import { CAMERA_PRESETS } from './cameraPresets'

const LEFT_WALL_X = -ROOM_WIDTH / 2 + WALL_THICKNESS / 2
const RIGHT_WALL_X = ROOM_WIDTH / 2 - WALL_THICKNESS / 2
const LAMP_Z_OFFSET = 1.35 // Placed symmetrically over the left and right nightstands
const LAMP_X = LEFT_WALL_X + NIGHTSTAND.width / 2 + 0.04

const DOG_BED_X = RIGHT_WALL_X - 0.65
const DOG_BED_Z1 = 1.60
const DOG_BED_Z2 = 2.22

export default function MainScene({
  presetIndex = 0,
  timeOfDayIndex = 1,
  roomIndex = 0,
  bedLampsOn = true,
  accentOn = true,
  onConsoleClick = () => {},
}) {
  const controlsRef = useRef()
  const preset = LIGHTING_PRESETS[presetIndex] || LIGHTING_PRESETS[0]
  const timeOfDay = TIME_OF_DAY_PRESETS[timeOfDayIndex] || TIME_OF_DAY_PRESETS[1]

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{
        powerPreference: 'high-performance',
        antialias: false,
        stencil: false,
        depth: true,
      }}
      camera={{ position: CAMERA_PRESETS[0].position, fov: 42 }}
    >
      <color attach="background" args={[timeOfDay.fogColor]} />
      <fog attach="fog" args={[timeOfDay.fogColor, 18, 75]} />

      <Lighting timeOfDay={timeOfDay} />

      {/* Grounding Luxury Skyscraper Building Tower Base & Rooftop Crown */}
      <PenthouseBuildingStructure accentOn={accentOn} />

      <RoomShell />
      <Window timeOfDay={timeOfDay} />
      <Carpet />
      <Bed />
      <BedWallPanel accentOn={accentOn} />
      <PendantLamp position={[LAMP_X, BED.centerZ - LAMP_Z_OFFSET]} shadeBottomY={1.10} on={bedLampsOn} />
      <PendantLamp position={[LAMP_X, BED.centerZ + LAMP_Z_OFFSET]} shadeBottomY={1.10} on={bedLampsOn} />
      <Nightstand position={[LAMP_X, BED.centerZ - LAMP_Z_OFFSET]} />
      <Nightstand position={[LAMP_X, BED.centerZ + LAMP_Z_OFFSET]} />
      <TVWall accentOn={accentOn} />
      <TVTable accentOn={accentOn} />
      <DogBed position={[DOG_BED_X, DOG_BED_Z1]} name="Fluffy" radius={0.21} fabricColor="#e8c9a0" rimColor="#a97c4f" />
      <DogBed position={[DOG_BED_X, DOG_BED_Z2]} name="Chiku" radius={0.34} fabricColor="#c9d6d8" rimColor="#5f7678" />
      <DogBowls position={[DOG_BED_X, 0, 1.05]} />
      <Dog
        position={[DOG_BED_X, DOG_BED_Z1]}
        groundY={0.072}
        breed="pomeranian"
        coatColor="#f5f2ea"
        bellyColor="#ffffff"
        collarColor="#a97c4f"
        scale={0.85}
      />
      <Dog
        position={[DOG_BED_X, DOG_BED_Z2]}
        groundY={0.117}
        breed="labrador"
        coatColor="#1c1a17"
        bellyColor="#2c2824"
        collarColor="#5f7678"
        scale={1.25}
      />
      <WallConsole onClick={onConsoleClick} />
      <SlidingBathroomDoor />
      <FalseCeiling downlightColor={preset.downlight} glowColor={preset.glow} />

      <Ensuite
        downlightColor={preset.downlight}
        glowColor={preset.glow}
        accentOn={accentOn}
      />

      <HallKitchen
        downlightColor={preset.downlight}
        glowColor={preset.glow}
        accentOn={accentOn}
      />

      <LandingFoyer
        downlightColor={preset.downlight}
        glowColor={preset.glow}
        accentOn={accentOn}
      />

      <StudyRoom
        downlightColor={preset.downlight}
        glowColor={preset.glow}
        accentOn={accentOn}
      />

      <CameraRig roomIndex={roomIndex} controlsRef={controlsRef} />

      <OrbitControls
        ref={controlsRef}
        minDistance={1.2}
        maxDistance={35}
        minPolarAngle={0.05}
        maxPolarAngle={Math.PI * 0.85}
        enablePan={true}
        enableDamping={true}
        dampingFactor={0.06}
      />

      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom
          luminanceThreshold={0.65}
          luminanceSmoothing={0.3}
          intensity={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  )
}
