import { useMemo } from 'react'
import * as THREE from 'three'
import PS5 from '../Room/PS5'
import { STUDY_CENTER_X, STUDY_DEPTH } from '../EntranceLanding/dimensions'

const DESK_LENGTH = 2.55
const DESK_DEPTH = 0.92
const DESK_HEIGHT = 1.02 // Standing Desk Elevation
const TOP_T = 0.045
const GOLD_ACCENT = '#d4af37'
const RGB_CYAN = '#00f0ff'
const RGB_PURPLE = '#c934f5'
const RGB_MAGENTA = '#ff1493'
const RGB_AMBER = '#ffaa00'

// ============================================================================
// 1. PROCEDURAL ULTRA-DETAILED SCREEN TEXTURES
// ============================================================================

function makeSuperUltrawideTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 288
  const ctx = canvas.getContext('2d')

  // Deep Obsidian IDE Background
  ctx.fillStyle = '#080a0f'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Top Title Bar & Window Controls
  ctx.fillStyle = '#10141d'
  ctx.fillRect(0, 0, canvas.width, 24)
  // macOS Traffic Lights
  ctx.fillStyle = '#ff5f57'; ctx.beginPath(); ctx.arc(15, 12, 5, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#febc2e'; ctx.beginPath(); ctx.arc(31, 12, 5, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#28c840'; ctx.beginPath(); ctx.arc(47, 12, 5, 0, Math.PI * 2); ctx.fill()

  ctx.fillStyle = '#8f9ba8'
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('Project: Antigravity Penthouse 3D — SuperUltrawide Workspace', 70, 16)

  // LEFT PANE (0 to 512): High-Density VS Code IDE
  ctx.fillStyle = '#131822'
  ctx.fillRect(0, 24, 46, canvas.height - 24) // Activity Bar
  ctx.fillStyle = '#181f2c'
  ctx.fillRect(46, 24, 130, canvas.height - 24) // File Explorer

  // File tree items
  ctx.fillStyle = '#58a6ff'; ctx.fillText('📁 src', 56, 45)
  ctx.fillStyle = '#8b949e'; ctx.fillText('  📁 components', 64, 63)
  ctx.fillStyle = '#7ee787'; ctx.fillText('    📄 StudyDesk.jsx', 72, 81)
  ctx.fillStyle = '#e3b341'; ctx.fillText('    📄 MainScene.jsx', 72, 99)
  ctx.fillStyle = '#d2a8ff'; ctx.fillText('    📄 Ensuite.jsx', 72, 117)

  // Syntax Highlighting Editor
  const colors = ['#c586c0', '#569cd6', '#4ec9b0', '#ce9178', '#9cdcfe', '#dcdcaa', '#e5c07b', '#61afef']
  const rand = (() => {
    let s = 23
    return () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
  })()

  let y = 44
  const lineHeight = 15
  const indents = [190, 190, 220, 250, 250, 220, 190, 190, 220, 220, 190, 190, 220, 250]
  for (const indent of indents) {
    if (y > canvas.height - 16) break
    const segments = 1 + Math.floor(rand() * 4)
    let x = indent
    for (let s = 0; s < segments; s++) {
      const w = 22 + rand() * 105
      ctx.fillStyle = colors[Math.floor(rand() * colors.length)]
      ctx.fillRect(x, y, w, 7)
      x += w + 8
    }
    y += lineHeight
  }

  // CENTER SEAM
  ctx.fillStyle = '#262d3d'
  ctx.fillRect(518, 24, 3, canvas.height - 24)

  // RIGHT PANE (521 to 1024): 3D Real-time Telemetry & Cyberpunk HUD
  ctx.fillStyle = '#0a0d14'
  ctx.fillRect(521, 24, canvas.width - 521, canvas.height - 24)

  // Neon Perspective Grid
  ctx.strokeStyle = 'rgba(0,240,255,0.35)'
  ctx.lineWidth = 1.2
  for (let gy = 110; gy < canvas.height; gy += 22) {
    ctx.beginPath()
    ctx.moveTo(528, gy)
    ctx.lineTo(canvas.width - 8, gy)
    ctx.stroke()
  }
  for (let gx = 540; gx < canvas.width; gx += 38) {
    ctx.beginPath()
    ctx.moveTo(gx, 110)
    ctx.lineTo(gx - (gx - 770) * 0.45, canvas.height)
    ctx.stroke()
  }

  // Cyberpunk Vector Terrain
  ctx.strokeStyle = '#c934f5'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(550, 140)
  ctx.lineTo(640, 60)
  ctx.lineTo(750, 130)
  ctx.lineTo(860, 45)
  ctx.lineTo(970, 140)
  ctx.stroke()

  // Circular Radar Display
  ctx.strokeStyle = '#00f0ff'
  ctx.beginPath()
  ctx.arc(880, 80, 32, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = 'rgba(0,240,255,0.15)'
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function makeVerticalCodeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#0c0f14'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Title Bar
  ctx.fillStyle = '#141a22'
  ctx.fillRect(0, 0, canvas.width, 24)
  ctx.fillStyle = '#58a6ff'
  ctx.font = 'bold 11px sans-serif'
  ctx.fillText('App.tsx — Studio Penthouse', 10, 16)

  // Code Lines
  const colors = ['#ff7b72', '#79c0ff', '#7ee787', '#ffa657', '#d2a8ff', '#a5d6ff', '#e3b341']
  const rand = (() => {
    let s = 47
    return () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
  })()

  let y = 36
  const lineHeight = 13
  for (let l = 1; l <= 35; l++) {
    ctx.fillStyle = '#444c56'
    ctx.fillText(`${l}`, 6, y + 6)

    const indents = [34, 46, 58, 70, 58, 46, 34, 46, 58, 70, 82, 70, 58, 46, 34]
    let startX = indents[l % indents.length]
    const tokenCount = 1 + Math.floor(rand() * 4)
    for (let t = 0; t < tokenCount; t++) {
      const w = 16 + rand() * 42
      ctx.fillStyle = colors[Math.floor(rand() * colors.length)]
      ctx.fillRect(startX, y, w, 7)
      startX += w + 5
    }
    y += lineHeight
  }

  // Terminal Logs
  ctx.fillStyle = '#020408'
  ctx.fillRect(0, 424, canvas.width, 88)
  ctx.fillStyle = '#3fb950'
  ctx.font = '10px monospace'
  ctx.fillText('⚡ Vite v5.4.2 ready in 184ms', 10, 444)
  ctx.fillText('➜ Local: http://localhost:5173/', 10, 462)
  ctx.fillStyle = '#8b949e'
  ctx.fillText('  watching for file changes...', 10, 480)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function makeMacBookScreenTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 320
  const ctx = canvas.getContext('2d')

  // macOS Sonoma Radiant Gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 320)
  grad.addColorStop(0, '#15132d')
  grad.addColorStop(0.5, '#3a1e50')
  grad.addColorStop(1, '#162b46')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Menu Bar
  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  ctx.fillRect(0, 0, canvas.width, 18)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 10px sans-serif'
  ctx.fillText('  Code  File  Edit  View  Terminal  Help', 12, 13)

  // Floating Editor Window
  ctx.fillStyle = 'rgba(13,16,24,0.92)'
  ctx.fillRect(36, 34, 440, 224)
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.fillRect(36, 34, 440, 20)
  ctx.fillStyle = '#ff5f57'; ctx.beginPath(); ctx.arc(48, 44, 4, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#febc2e'; ctx.beginPath(); ctx.arc(60, 44, 4, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#28c840'; ctx.beginPath(); ctx.arc(72, 44, 4, 0, Math.PI * 2); ctx.fill()

  ctx.fillStyle = '#61afef'
  ctx.font = '10px monospace'
  ctx.fillText('const studioServer = await startProduction({ port: 3000 })', 52, 78)
  ctx.fillStyle = '#98c379'
  ctx.fillText('console.log("🚀 Server running at http://localhost:3000")', 52, 100)
  ctx.fillStyle = '#e5c07b'
  ctx.fillText('// React Three Fiber Photorealistic Penthouse Suite', 52, 122)
  ctx.fillStyle = '#c678dd'
  ctx.fillText('export default function StudioApp() { return <Penthouse /> }', 52, 144)

  // Bottom macOS Dock
  ctx.fillStyle = 'rgba(255,255,255,0.24)'
  ctx.fillRect(155, 284, 202, 28)
  const appColors = ['#007aff', '#ff9500', '#34c759', '#af52de', '#ff2d55', '#5856d6', '#00c7be']
  appColors.forEach((col, idx) => {
    ctx.fillStyle = col
    ctx.fillRect(165 + idx * 27, 289, 18, 18)
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// ============================================================================
// 2. 49" SUPER ULTRAWIDE 32:9 1000R CURVED GAMING MONITOR
// ============================================================================

function SuperUltrawideMonitor() {
  const texture = useMemo(() => makeSuperUltrawideTexture(), [])
  const screenW = 1.45
  const screenH = 0.42

  return (
    <group position={[0.08, DESK_HEIGHT + TOP_T / 2 + 0.02, -0.22]}>
      {/* Heavy-Duty Desktop Monitor Base with Cable Grommet */}
      <mesh position={[0, 0.015, -0.06]} castShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.03, 20]} />
        <meshPhysicalMaterial color="#111317" roughness={0.3} metalness={0.85} clearcoat={0.2} />
      </mesh>
      {/* Dual Heavy Articulated Metal Arm Columns */}
      <mesh position={[-0.14, 0.18, -0.09]} castShadow>
        <cylinderGeometry args={[0.02, 0.022, 0.34, 16]} />
        <meshPhysicalMaterial color="#14171d" roughness={0.3} metalness={0.88} />
      </mesh>
      <mesh position={[0.14, 0.18, -0.09]} castShadow>
        <cylinderGeometry args={[0.02, 0.022, 0.34, 16]} />
        <meshPhysicalMaterial color="#14171d" roughness={0.3} metalness={0.88} />
      </mesh>

      {/* Curved Screen Group */}
      <group position={[0, 0.32, 0]}>
        {/* Main Center Screen Panel (Facing User at +Z) */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[screenW * 0.5, screenH]} />
          <meshPhysicalMaterial
            map={texture}
            emissiveMap={texture}
            emissive="#ffffff"
            emissiveIntensity={1.4}
            roughness={0.15}
            metalness={0.05}
            side={THREE.FrontSide}
            toneMapped={false}
          />
        </mesh>
        {/* Left Wing Curved Inward towards User */}
        <mesh position={[-screenW * 0.36, 0, 0.045]} rotation={[0, 0.22, 0]}>
          <planeGeometry args={[screenW * 0.26, screenH]} />
          <meshPhysicalMaterial
            map={texture}
            emissiveMap={texture}
            emissive="#ffffff"
            emissiveIntensity={1.4}
            roughness={0.15}
            metalness={0.05}
            side={THREE.FrontSide}
            toneMapped={false}
          />
        </mesh>
        {/* Right Wing Curved Inward towards User */}
        <mesh position={[screenW * 0.36, 0, 0.045]} rotation={[0, -0.22, 0]}>
          <planeGeometry args={[screenW * 0.26, screenH]} />
          <meshPhysicalMaterial
            map={texture}
            emissiveMap={texture}
            emissive="#ffffff"
            emissiveIntensity={1.4}
            roughness={0.15}
            metalness={0.05}
            side={THREE.FrontSide}
            toneMapped={false}
          />
        </mesh>

        {/* Outer Rear Sculpted Bezel & Shell */}
        <mesh position={[0, 0, -0.012]}>
          <boxGeometry args={[screenW + 0.02, screenH + 0.025, 0.02]} />
          <meshPhysicalMaterial color="#0c0e12" roughness={0.4} metalness={0.7} clearcoat={0.1} />
        </mesh>

        {/* Rear Infinity Core RGB Halo Ring */}
        <mesh position={[0, 0, -0.024]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.11, 0.014, 16, 32]} />
          <meshStandardMaterial
            color={RGB_CYAN}
            emissive={RGB_CYAN}
            emissiveIntensity={3.4}
            toneMapped={false}
          />
        </mesh>

        {/* Ambient Underglow Light Bar */}
        <mesh position={[0, -screenH / 2 - 0.005, 0]}>
          <boxGeometry args={[screenW * 0.9, 0.008, 0.012]} />
          <meshStandardMaterial
            color={RGB_CYAN}
            emissive={RGB_CYAN}
            emissiveIntensity={2.6}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

// ============================================================================
// 3. 27" VERTICAL PIVOT CODING & TERMINAL MONITOR
// ============================================================================

function VerticalCodingMonitor() {
  const texture = useMemo(() => makeVerticalCodeTexture(), [])
  const monW = 0.38
  const monH = 0.64

  return (
    <group
      position={[-0.78, DESK_HEIGHT + TOP_T / 2 + 0.02, -0.15]}
      rotation={[0, 0.28, 0]}
    >
      {/* Heavy-Duty Desktop Monitor Base */}
      <mesh position={[0, 0.015, -0.06]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.025, 16]} />
        <meshPhysicalMaterial color="#141517" roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Articulated Gas-Spring Arm */}
      <mesh position={[0, 0.22, -0.08]} castShadow>
        <cylinderGeometry args={[0.018, 0.02, 0.42, 14]} />
        <meshPhysicalMaterial color="#141517" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Vertical Screen Display */}
      <group position={[0, 0.36, 0]}>
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[monW, monH]} />
          <meshPhysicalMaterial
            map={texture}
            emissiveMap={texture}
            emissive="#ffffff"
            emissiveIntensity={1.3}
            roughness={0.15}
            metalness={0.05}
            side={THREE.FrontSide}
            toneMapped={false}
          />
        </mesh>

        {/* Outer Slim Bezel Frame */}
        <mesh position={[0, 0, -0.008]}>
          <boxGeometry args={[monW + 0.02, monH + 0.02, 0.018]} />
          <meshPhysicalMaterial color="#0d0f12" roughness={0.35} metalness={0.8} />
        </mesh>

        {/* Rear Subtle Cyan Accent Glow */}
        <mesh position={[0, 0, -0.018]}>
          <boxGeometry args={[monW * 0.8, monH * 0.8, 0.005]} />
          <meshStandardMaterial
            color={RGB_CYAN}
            emissive={RGB_CYAN}
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

// ============================================================================
// 4. 16" MACBOOK PRO ON ELEVATED BRUSHED ALUMINUM STAND
// ============================================================================

function MacBookProOnStand() {
  const screenTexture = useMemo(() => makeMacBookScreenTexture(), [])

  // Procedural Chamfered MacBook Unibody Shape
  const unibodyGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    const w = 0.34, d = 0.23, r = 0.012
    shape.moveTo(-w / 2 + r, -d / 2)
    shape.lineTo(w / 2 - r, -d / 2)
    shape.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r)
    shape.lineTo(w / 2, d / 2 - r)
    shape.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2)
    shape.lineTo(-w / 2 + r, d / 2)
    shape.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r)
    shape.lineTo(-w / 2, -d / 2 + r)
    shape.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2)

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.012,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.002,
      bevelThickness: 0.002,
    })
  }, [])

  return (
    <group
      position={[-0.98, DESK_HEIGHT + TOP_T / 2, 0.02]}
      rotation={[0, 0.26, 0]}
    >
      {/* 1. Brushed Aluminum Ergonomic Riser Stand */}
      <group>
        {/* Desktop Base Foot Plate */}
        <mesh position={[0, 0.004, 0]} castShadow>
          <boxGeometry args={[0.24, 0.008, 0.2]} />
          <meshPhysicalMaterial color="#8a8e96" roughness={0.25} metalness={0.92} clearcoat={0.2} />
        </mesh>
        {/* Angled Neck Riser Column */}
        <mesh position={[0, 0.065, -0.04]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.16, 0.12, 0.008]} />
          <meshPhysicalMaterial color="#8a8e96" roughness={0.25} metalness={0.92} clearcoat={0.2} />
        </mesh>
        {/* Angled Laptop Cradle Bed with Front Retention Lip */}
        <group position={[0, 0.12, 0]} rotation={[0.2, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.25, 0.008, 0.19]} />
            <meshPhysicalMaterial color="#8a8e96" roughness={0.25} metalness={0.92} />
          </mesh>
          <mesh position={[0, 0.012, 0.095]}>
            <boxGeometry args={[0.25, 0.016, 0.008]} />
            <meshPhysicalMaterial color="#8a8e96" roughness={0.25} metalness={0.92} />
          </mesh>
        </group>
      </group>

      {/* 2. 16" Space Gray MacBook Pro Body */}
      <group position={[0, 0.128, 0]} rotation={[0.2, 0, 0]}>
        {/* Procedural CNC Unibody Base */}
        <mesh
          geometry={unibodyGeometry}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.006, 0]}
          castShadow
        >
          <meshPhysicalMaterial color="#4a4d56" roughness={0.22} metalness={0.92} clearcoat={0.15} />
        </mesh>

        {/* MagSafe 3 & Thunderbolt 4 Ports */}
        <mesh position={[-0.171, 0.006, -0.06]}>
          <boxGeometry args={[0.002, 0.004, 0.012]} />
          <meshPhysicalMaterial color="#1a1a1c" roughness={0.5} metalness={0.8} />
        </mesh>
        <mesh position={[-0.171, 0.006, -0.035]}>
          <boxGeometry args={[0.002, 0.003, 0.008]} />
          <meshPhysicalMaterial color="#1a1a1c" roughness={0.5} metalness={0.8} />
        </mesh>
        <mesh position={[-0.171, 0.006, -0.015]}>
          <boxGeometry args={[0.002, 0.003, 0.008]} />
          <meshPhysicalMaterial color="#1a1a1c" roughness={0.5} metalness={0.8} />
        </mesh>

        {/* Anodized Keyboard Well & Magic Keyboard */}
        <mesh position={[0, 0.0135, -0.025]}>
          <boxGeometry args={[0.27, 0.001, 0.11]} />
          <meshPhysicalMaterial color="#0e0f12" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Force Touch Glass Trackpad */}
        <mesh position={[0, 0.0135, 0.062]}>
          <boxGeometry args={[0.115, 0.001, 0.065]} />
          <meshPhysicalMaterial color="#3c3e45" roughness={0.2} metalness={0.85} clearcoat={0.3} />
        </mesh>

        {/* 3. Open Liquid Retina XDR Screen Lid */}
        <group position={[0, 0.012, -0.112]} rotation={[-1.15, 0, 0]}>
          <mesh position={[0, 0.11, 0]} castShadow>
            <boxGeometry args={[0.34, 0.22, 0.006]} />
            <meshPhysicalMaterial color="#4a4d56" roughness={0.22} metalness={0.92} clearcoat={0.15} />
          </mesh>
          <mesh position={[0, 0.11, 0.004]}>
            <planeGeometry args={[0.32, 0.205]} />
            <meshPhysicalMaterial
              map={screenTexture}
              emissiveMap={screenTexture}
              emissive="#ffffff"
              emissiveIntensity={1.3}
              roughness={0.12}
              metalness={0.05}
              side={THREE.FrontSide}
              toneMapped={false}
            />
          </mesh>
          {/* Centered Camera Notch */}
          <mesh position={[0, 0.208, 0.005]}>
            <boxGeometry args={[0.035, 0.007, 0.002]} />
            <meshStandardMaterial color="#000000" roughness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

// ============================================================================
// 5. PANORAMIC DUAL-GLASS ARGB SHOWCASE GAMING PC
// ============================================================================

function CustomShowcaseRGBGamingPC({ accentOn = true }) {
  const pcW = 0.24
  const pcH = 0.46
  const pcD = 0.44

  return (
    <group position={[1.02, DESK_HEIGHT + TOP_T / 2 + pcH / 2 + 0.01, -0.05]}>
      {/* 1. Structural Open-Frame Base & Panels */}
      <mesh position={[0, -pcH / 2 + 0.01, 0]} castShadow receiveShadow>
        <boxGeometry args={[pcW, 0.02, pcD]} />
        <meshPhysicalMaterial color="#111215" roughness={0.4} metalness={0.85} />
      </mesh>
      <mesh position={[0, pcH / 2 - 0.01, 0]} castShadow>
        <boxGeometry args={[pcW, 0.02, pcD]} />
        <meshPhysicalMaterial color="#111215" roughness={0.4} metalness={0.85} />
      </mesh>
      <mesh position={[0, 0, -pcD / 2 + 0.01]} receiveShadow>
        <boxGeometry args={[pcW, pcH - 0.04, 0.02]} />
        <meshPhysicalMaterial color="#14161a" roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[pcW / 2 - 0.01, 0, 0]} receiveShadow>
        <boxGeometry args={[0.02, pcH - 0.04, pcD - 0.04]} />
        <meshPhysicalMaterial color="#14161a" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* 2. Transparent Seamless Tempered Glass Panels with Clearcoat Refraction */}
      {/* Front Glass Panel (+Z towards room) */}
      <mesh position={[0, 0, pcD / 2 - 0.005]}>
        <boxGeometry args={[pcW - 0.02, pcH - 0.03, 0.006]} />
        <meshPhysicalMaterial
          color="#d0e4f5"
          transparent
          opacity={0.22}
          roughness={0.04}
          metalness={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>
      {/* Left Glass Panel (-X towards user) */}
      <mesh position={[-pcW / 2 + 0.005, 0, 0]}>
        <boxGeometry args={[0.006, pcH - 0.03, pcD - 0.02]} />
        <meshPhysicalMaterial
          color="#d0e4f5"
          transparent
          opacity={0.22}
          roughness={0.04}
          metalness={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* 3. Triple ARGB Glowing Fans with Infinity Mirrors */}
      {[-0.12, 0, 0.12].map((fz, i) => (
        <group key={i} position={[pcW / 2 - 0.04, fz, -0.06]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.05, 0.008, 16, 32]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? RGB_CYAN : RGB_PURPLE}
              emissive={i % 2 === 0 ? RGB_CYAN : RGB_PURPLE}
              emissiveIntensity={accentOn ? 3.5 : 0}
              toneMapped={false}
            />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.045, 20]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? RGB_CYAN : RGB_PURPLE}
              emissive={i % 2 === 0 ? RGB_CYAN : RGB_PURPLE}
              emissiveIntensity={accentOn ? 2.4 : 0}
              transparent
              opacity={0.75}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* 4. Top Radiator Exhaust Fans */}
      {[-0.08, 0.08].map((tz, i) => (
        <mesh key={i} position={[0, pcH / 2 - 0.03, tz]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.045, 0.007, 12, 24]} />
          <meshStandardMaterial
            color={RGB_MAGENTA}
            emissive={RGB_MAGENTA}
            emissiveIntensity={accentOn ? 3.2 : 0}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* 5. AIO Liquid Cooler Circular LCD Pump Cap with Glowing Core */}
      <group position={[0.02, 0.06, 0.06]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 24]} rotation={[Math.PI / 2, 0, 0]} />
          <meshPhysicalMaterial color="#0e0f12" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <ringGeometry args={[0.024, 0.034, 28]} />
          <meshStandardMaterial
            color={RGB_CYAN}
            emissive={RGB_CYAN}
            emissiveIntensity={accentOn ? 3.8 : 0}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* 6. Dual Glowing ARGB DDR5 RAM Sticks */}
      {[-0.015, 0.015].map((rx, i) => (
        <mesh key={i} position={[rx + 0.04, 0.12, 0.06]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[0.01, 0.036, 0.006]} />
          <meshStandardMaterial
            color={RGB_PURPLE}
            emissive={RGB_PURPLE}
            emissiveIntensity={accentOn ? 3.6 : 0}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* 7. Flagship GPU with Glowing RGB Edge Lightstrip */}
      <group position={[0.02, -0.08, 0.04]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.05, 0.04]} />
          <meshPhysicalMaterial color="#1a1c22" roughness={0.3} metalness={0.85} />
        </mesh>
        <mesh position={[0, 0.026, 0]}>
          <boxGeometry args={[0.24, 0.006, 0.038]} />
          <meshStandardMaterial
            color={RGB_CYAN}
            emissive={RGB_CYAN}
            emissiveIntensity={accentOn ? 3.4 : 0}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* 8. Dedicated Internal Chassis RGB Fill Light */}
      {accentOn && (
        <pointLight
          color="#00e5ff"
          intensity={0.85}
          distance={2.0}
          decay={2}
          position={[-0.04, 0.05, 0.05]}
        />
      )}
    </group>
  )
}

// ============================================================================
// 6. HIGH-END ERGONOMIC RACING GAMING CHAIR
// ============================================================================

function HighEndGamingChair() {
  const seatH = 0.52
  const chairZ = 0.65

  // Procedural Ergonomic Winged Backrest Shape
  const backrestGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    // Ergonomic racing bucket contour with lumbar curve and flared shoulder wings
    shape.moveTo(-0.22, 0)
    shape.lineTo(0.22, 0)
    shape.lineTo(0.23, 0.22) // Lower lumbar taper
    shape.lineTo(0.28, 0.52) // Flared shoulder wings
    shape.lineTo(0.18, 0.72) // Top headrest taper
    shape.lineTo(-0.18, 0.72)
    shape.lineTo(-0.28, 0.52)
    shape.lineTo(-0.23, 0.22)
    shape.lineTo(-0.22, 0)

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.016,
      bevelThickness: 0.016,
    })
  }, [])

  return (
    <group position={[0.05, 0, chairZ]}>
      {/* 1. 5-Star Aluminum Caster Wheelbase */}
      <group position={[0, 0.04, 0]}>
        {new Array(5).fill(0).map((_, i) => {
          const angle = (i * Math.PI * 2) / 5
          const legLen = 0.32
          const lx = Math.cos(angle) * legLen
          const lz = Math.sin(angle) * legLen
          return (
            <group key={i}>
              <mesh position={[lx / 2, 0.03, lz / 2]} rotation={[0, -angle, 0]} castShadow>
                <boxGeometry args={[legLen, 0.024, 0.035]} />
                <meshPhysicalMaterial color="#1a1c20" roughness={0.3} metalness={0.88} clearcoat={0.2} />
              </mesh>
              <mesh position={[lx, -0.015, lz]}>
                <cylinderGeometry args={[0.025, 0.025, 0.02, 14]} rotation={[0, 0, Math.PI / 2]} />
                <meshPhysicalMaterial color="#0e0e10" roughness={0.6} metalness={0.2} />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* 2. Pneumatic Gas-Lift Piston & Chrome Cylinder */}
      <mesh position={[0, seatH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.032, seatH - 0.06, 20]} />
        <meshPhysicalMaterial color="#111215" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0, seatH - 0.08, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.12, 20]} />
        <meshPhysicalMaterial color="#f0f4f8" roughness={0.08} metalness={0.98} />
      </mesh>

      {/* 3. Ergonomic Contoured Bucket Seat Base */}
      <group position={[0, seatH, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.54, 0.12, 0.52]} />
          <meshPhysicalMaterial color="#18191c" roughness={0.65} metalness={0.12} clearcoat={0.15} />
        </mesh>
        {/* Side Thigh Bolsters */}
        {[-0.24, 0.24].map((bx) => (
          <mesh key={bx} position={[bx, 0.04, 0]} rotation={[0, 0, bx > 0 ? -0.2 : 0.2]} castShadow>
            <boxGeometry args={[0.08, 0.1, 0.48]} />
            <meshPhysicalMaterial color="#222428" roughness={0.6} metalness={0.15} clearcoat={0.15} />
          </mesh>
        ))}
        {/* Gold Accent Stripe Inlays */}
        {[-0.16, 0.16].map((sx) => (
          <mesh key={sx} position={[sx, 0.062, 0]}>
            <boxGeometry args={[0.025, 0.006, 0.44]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.25} metalness={0.88} />
          </mesh>
        ))}
      </group>

      {/* 4. High-Back Procedural Ergonomic Winged Backrest */}
      <group position={[0, seatH + 0.08, 0.24]} rotation={[-0.08, 0, 0]}>
        <mesh geometry={backrestGeometry} castShadow>
          <meshPhysicalMaterial color="#18191c" roughness={0.65} metalness={0.12} clearcoat={0.15} />
        </mesh>
        {/* Anatomical Lumbar Support Pillow */}
        <mesh position={[0, 0.18, -0.05]} castShadow>
          <boxGeometry args={[0.34, 0.16, 0.06]} />
          <meshPhysicalMaterial color="#111215" roughness={0.7} metalness={0.1} />
        </mesh>
        {/* Ergonomic Headrest Pillow with Embroidered Gold Crest */}
        <group position={[0, 0.62, -0.04]}>
          <mesh castShadow>
            <boxGeometry args={[0.26, 0.14, 0.07]} />
            <meshPhysicalMaterial color="#111215" roughness={0.7} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0, -0.038]}>
            <boxGeometry args={[0.12, 0.03, 0.005]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.25} metalness={0.92} />
          </mesh>
        </group>
        {/* Dual Harness Pass-Through Cutouts */}
        {[-0.1, 0.1].map((cx) => (
          <mesh key={cx} position={[cx, 0.52, 0]}>
            <boxGeometry args={[0.07, 0.04, 0.1]} />
            <meshPhysicalMaterial color="#0b0b0d" roughness={0.35} metalness={0.6} />
          </mesh>
        ))}
      </group>

      {/* 5. 4D Multi-Directional Armrests with Brushed Metal Stanchions */}
      {[-0.3, 0.3].map((ax) => (
        <group key={ax} position={[ax, seatH + 0.18, 0.04]}>
          <mesh position={[0, -0.08, 0]} castShadow>
            <boxGeometry args={[0.035, 0.18, 0.04]} />
            <meshPhysicalMaterial color="#1a1c20" roughness={0.3} metalness={0.88} />
          </mesh>
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.08, 0.035, 0.28]} />
            <meshPhysicalMaterial color="#0e0e10" roughness={0.5} metalness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ============================================================================
// 7. MAIN EXECUTIVE MOTORIZED STANDING DESK SUITE
// ============================================================================

export default function StudyDesk({ accentOn = true }) {
  const windowZ = -STUDY_DEPTH / 2 // -3.5
  const posX = STUDY_CENTER_X + 0.24
  const posZ = windowZ + DESK_DEPTH / 2 + 0.15 // -2.89

  return (
    <group position={[posX, 0, posZ]}>
      {/* 1. Solid Dark Walnut Motorized Standing Desktop Slab with Chamfered Edges */}
      <mesh position={[0, DESK_HEIGHT, 0]} castShadow receiveShadow>
        <boxGeometry args={[DESK_LENGTH, TOP_T, DESK_DEPTH]} />
        <meshPhysicalMaterial
          color="#1a1c20"
          roughness={0.38}
          metalness={0.06}
          clearcoat={0.22}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Front Ergonomic Wrist Bevel Inset Strip */}
      <mesh position={[0, DESK_HEIGHT + TOP_T / 2 - 0.002, DESK_DEPTH / 2 - 0.025]}>
        <boxGeometry args={[DESK_LENGTH - 0.1, 0.003, 0.04]} />
        <meshPhysicalMaterial color="#121316" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* 2. Dual Telescopic Motorized Standing Lift Columns with Brushed Black Metal */}
      {[-DESK_LENGTH / 2 + 0.26, DESK_LENGTH / 2 - 0.26].map((lx) => (
        <group key={lx} position={[lx, 0, 0]}>
          {/* Lower Outer Stage */}
          <mesh position={[0, (DESK_HEIGHT - TOP_T / 2) * 0.35, 0]} castShadow>
            <boxGeometry args={[0.075, (DESK_HEIGHT - TOP_T / 2) * 0.7, 0.075]} />
            <meshPhysicalMaterial color="#111215" roughness={0.35} metalness={0.88} />
          </mesh>
          {/* Upper Telescopic Stage */}
          <mesh position={[0, (DESK_HEIGHT - TOP_T / 2) * 0.8, 0]} castShadow>
            <boxGeometry args={[0.065, (DESK_HEIGHT - TOP_T / 2) * 0.45, 0.065]} />
            <meshPhysicalMaterial color="#18191c" roughness={0.28} metalness={0.92} />
          </mesh>
          {/* Heavy Floor Foot Pad with Rounded Ends */}
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.08, 0.038, DESK_DEPTH * 0.85]} />
            <meshPhysicalMaterial color="#111215" roughness={0.35} metalness={0.88} />
          </mesh>
        </group>
      ))}

      {/* 3. Digital OLED Height Controller Keypad on Front Bevel */}
      <group position={[DESK_LENGTH / 2 - 0.22, DESK_HEIGHT - TOP_T / 2 - 0.015, DESK_DEPTH / 2 - 0.04]}>
        <mesh castShadow>
          <boxGeometry args={[0.13, 0.022, 0.05]} />
          <meshPhysicalMaterial color="#0e0e10" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* OLED Screen */}
        <mesh position={[-0.03, -0.011, 0]}>
          <boxGeometry args={[0.04, 0.005, 0.018]} />
          <meshStandardMaterial
            color="#8fe0ff"
            emissive="#8fe0ff"
            emissiveIntensity={2.0}
            toneMapped={false}
          />
        </mesh>
        {/* Memory Preset Buttons (1, 2, 3, Sit/Stand) */}
        {[-0.005, 0.015, 0.035].map((bx, i) => (
          <mesh key={i} position={[bx, -0.011, 0]}>
            <circleGeometry args={[0.004, 12]} rotation={[-Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#2d3340" />
          </mesh>
        ))}
      </group>

      {/* 4. Mechanical RGB Custom Keyboard with Double-Shot Keycaps */}
      <group position={[0.05, DESK_HEIGHT + TOP_T / 2, 0.18]}>
        <mesh position={[0, 0.01, 0]} castShadow>
          <boxGeometry args={[0.42, 0.02, 0.14]} />
          <meshPhysicalMaterial color="#17181a" roughness={0.45} metalness={0.4} clearcoat={0.1} />
        </mesh>
        {/* RGB Underglow Diffuser */}
        <mesh position={[0, 0.022, 0]}>
          <boxGeometry args={[0.38, 0.005, 0.11]} />
          <meshStandardMaterial
            color="#7a5cff"
            emissive="#7a5cff"
            emissiveIntensity={accentOn ? 1.8 : 0}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* 5. Extra Large Micro-Weave Felt Desk Mat & Gaming Mouse */}
      <mesh position={[0.05, DESK_HEIGHT + TOP_T / 2 + 0.002, 0.06]} receiveShadow>
        <boxGeometry args={[0.94, 0.004, 0.42]} />
        <meshPhysicalMaterial color="#1b1d22" roughness={0.92} metalness={0.02} />
      </mesh>
      {/* Ergonomic Wireless Gaming Mouse with Sensor Base */}
      <mesh position={[0.38, DESK_HEIGHT + TOP_T / 2 + 0.018, 0.18]} castShadow>
        <boxGeometry args={[0.07, 0.036, 0.11]} />
        <meshPhysicalMaterial color="#1c1d20" roughness={0.35} metalness={0.4} clearcoat={0.2} />
      </mesh>

      {/* 6. Studio Desktop Monitor Speakers (Audioengine Style with Brass Driver Cones) */}
      {[-0.62, 0.72].map((sx, i) => (
        <group key={i} position={[sx, DESK_HEIGHT + TOP_T / 2 + 0.11, -0.16]} rotation={[0, sx > 0 ? -0.2 : 0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.11, 0.2, 0.14]} />
            <meshPhysicalMaterial color="#111215" roughness={0.35} metalness={0.7} />
          </mesh>
          {/* Gold Brass Woofer Cone */}
          <mesh position={[0, -0.03, 0.071]}>
            <circleGeometry args={[0.035, 20]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.25} metalness={0.92} />
          </mesh>
          {/* Silk Dome Tweeter */}
          <mesh position={[0, 0.05, 0.071]}>
            <circleGeometry args={[0.015, 16]} />
            <meshPhysicalMaterial color="#2d3038" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* 7. Flagship Multi-Display Engineering Workstation */}
      {/* 49" Super Ultrawide 32:9 Curved Main Display */}
      <SuperUltrawideMonitor />

      {/* 27" Vertical Coding & Terminal Secondary Display */}
      <VerticalCodingMonitor />

      {/* 16" MacBook Pro on Elevated Brushed Aluminum Stand */}
      <MacBookProOnStand />

      {/* Panoramic Dual-Glass RGB Showcase Gaming PC */}
      <CustomShowcaseRGBGamingPC accentOn={accentOn} />

      {/* PS5 Console */}
      <PS5 position={[1.12, DESK_HEIGHT + TOP_T / 2, -0.26]} />

      {/* 8. Luxury Ergonomic High-End Racing Gaming Chair */}
      <HighEndGamingChair />
    </group>
  )
}
