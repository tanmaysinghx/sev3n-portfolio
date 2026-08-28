import { ROOM_HEIGHT } from '../Room/dimensions'

const FRAME_THICKNESS = 0.12
const FRAME_DEPTH = 0.16
const MARGIN = 0.03
const FRAME_COLOR = '#1c1c1e'
const GLASS_COLOR = '#bcd2ee'

export function UnifiedBackWindow({ startX, width, backZ = -3.5, height = ROOM_HEIGHT }) {
  // Compute integer column count with standard ~1.15m - 1.20m bay width
  const cols = Math.round(width / 1.18)
  const cellW = width / cols
  const rows = 2
  const cellH = height / rows
  const centerX = startX + width / 2

  const bars = []

  // Top header beam
  bars.push({
    pos: [centerX, height, backZ],
    size: [width, FRAME_THICKNESS * 1.4, FRAME_DEPTH],
  })
  // Bottom sill beam
  bars.push({
    pos: [centerX, 0, backZ],
    size: [width, FRAME_THICKNESS * 1.4, FRAME_DEPTH],
  })
  // Left jamb
  bars.push({
    pos: [startX, height / 2, backZ],
    size: [FRAME_THICKNESS * 1.4, height, FRAME_DEPTH],
  })
  // Right jamb
  bars.push({
    pos: [startX + width, height / 2, backZ],
    size: [FRAME_THICKNESS * 1.4, height, FRAME_DEPTH],
  })

  // Intermediate vertical mullions
  for (let i = 1; i < cols; i++) {
    bars.push({
      pos: [startX + i * cellW, height / 2, backZ],
      size: [FRAME_THICKNESS, height, FRAME_DEPTH],
    })
  }

  // Intermediate horizontal transom rail
  for (let j = 1; j < rows; j++) {
    bars.push({
      pos: [centerX, j * cellH, backZ],
      size: [width, FRAME_THICKNESS, FRAME_DEPTH],
    })
  }

  const panes = []
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      panes.push({
        x: startX + cellW * (c + 0.5),
        y: cellH * (r + 0.5),
        w: cellW - MARGIN,
        h: cellH - MARGIN,
      })
    }
  }

  return (
    <group>
      {/* Frame Mullions & Rails */}
      {bars.map((bar, i) => (
        <mesh key={`b-${i}`} position={bar.pos} castShadow>
          <boxGeometry args={bar.size} />
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.4} metalness={0.6} />
        </mesh>
      ))}

      {/* Double-Pane Low-Iron Tint Glass */}
      {panes.map((p, i) => (
        <mesh key={`p-${i}`} position={[p.x, p.y, backZ + 0.01]}>
          <planeGeometry args={[p.w, p.h]} />
          <meshStandardMaterial
            color={GLASS_COLOR}
            transparent
            opacity={0.16}
            roughness={0.15}
            metalness={0.1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export function UnifiedSideWindow({
  posX,
  startZ = -3.5,
  depth = 7.0,
  height = ROOM_HEIGHT,
}) {
  const cols = Math.round(depth / 1.18) // 6 bays across 7.0m = 1.16m per bay
  const cellD = depth / cols
  const rows = 2
  const cellH = height / rows
  const centerZ = startZ + depth / 2

  const bars = []

  // Top header beam
  bars.push({
    pos: [posX, height, centerZ],
    size: [FRAME_DEPTH, FRAME_THICKNESS * 1.4, depth],
  })
  // Bottom sill beam
  bars.push({
    pos: [posX, 0, centerZ],
    size: [FRAME_DEPTH, FRAME_THICKNESS * 1.4, depth],
  })
  // Front jamb
  bars.push({
    pos: [posX, height / 2, startZ + depth],
    size: [FRAME_DEPTH, height, FRAME_THICKNESS * 1.4],
  })

  // Intermediate vertical mullions along Z
  for (let i = 1; i < cols; i++) {
    bars.push({
      pos: [posX, height / 2, startZ + i * cellD],
      size: [FRAME_DEPTH, height, FRAME_THICKNESS],
    })
  }

  // Intermediate horizontal transom rail
  for (let j = 1; j < rows; j++) {
    bars.push({
      pos: [posX, j * cellH, centerZ],
      size: [FRAME_DEPTH, FRAME_THICKNESS, depth],
    })
  }

  const panes = []
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      panes.push({
        z: startZ + cellD * (c + 0.5),
        y: cellH * (r + 0.5),
        w: cellD - MARGIN,
        h: cellH - MARGIN,
      })
    }
  }

  return (
    <group>
      {bars.map((bar, i) => (
        <mesh key={`sb-${i}`} position={bar.pos} castShadow>
          <boxGeometry args={bar.size} />
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.4} metalness={0.6} />
        </mesh>
      ))}

      {panes.map((p, i) => (
        <mesh
          key={`sp-${i}`}
          position={[posX - 0.01, p.y, p.z]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <planeGeometry args={[p.w, p.h]} />
          <meshStandardMaterial
            color={GLASS_COLOR}
            transparent
            opacity={0.16}
            roughness={0.15}
            metalness={0.1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
