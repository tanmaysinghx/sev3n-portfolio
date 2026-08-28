import { STUDY_DEPTH, STUDY_ORIGIN_X } from '../EntranceLanding/dimensions'

const SHELF_W = 0.4
const SHELF_L = 2.75
const SHELF_H = 2.7
const WOOD_DARK = '#221912'
const WARM_LED = '#ffcf8a'
const GOLD_ACCENT = '#d4af37'

const BOOK_COLORS = ['#c0392b', '#2980b9', '#27ae60', '#f39c12', '#8e44ad', '#34495e', '#d35400', '#16a085', '#7f8c8d']

function BooksRow({ zOffset, count = 8 }) {
  const books = [
    { w: 0.04, h: 0.23, color: BOOK_COLORS[0] },
    { w: 0.05, h: 0.27, color: BOOK_COLORS[1] },
    { w: 0.035, h: 0.21, color: BOOK_COLORS[2] },
    { w: 0.055, h: 0.25, color: BOOK_COLORS[3] },
    { w: 0.045, h: 0.24, color: BOOK_COLORS[4] },
    { w: 0.03, h: 0.19, color: BOOK_COLORS[5] },
    { w: 0.048, h: 0.26, color: BOOK_COLORS[6] },
    { w: 0.038, h: 0.22, color: BOOK_COLORS[7] },
  ].slice(0, count)

  let curZ = zOffset
  return (
    <group>
      {books.map((b, i) => {
        const z = curZ + b.w / 2
        curZ += b.w + 0.006
        return (
          <mesh key={i} position={[0, b.h / 2, z]} castShadow>
            <boxGeometry args={[SHELF_W - 0.12, b.h, b.w]} />
            <meshPhysicalMaterial color={b.color} roughness={0.5} metalness={0.1} clearcoat={0.15} />
          </mesh>
        )
      })}
    </group>
  )
}

function SucculentPlant({ position }) {
  return (
    <group position={position}>
      {/* Ceramic Pot */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.05, 0.1, 16]} />
        <meshPhysicalMaterial color="#ded7cc" roughness={0.35} metalness={0.1} clearcoat={0.3} />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 0.13, 0]} castShadow>
        <sphereGeometry args={[0.075, 14, 14]} />
        <meshPhysicalMaterial color="#387a4a" roughness={0.7} metalness={0.05} />
      </mesh>
    </group>
  )
}

export default function StudyBookshelf({ accentOn = true }) {
  const windowZ = -STUDY_DEPTH / 2
  const posX = STUDY_ORIGIN_X + SHELF_W / 2 + 0.03
  const posZ = windowZ + SHELF_L / 2 + 0.04
  const shelfCount = 6
  const shelfSpacing = 0.46

  return (
    <group position={[posX, 0, posZ]}>
      {/* Vertical Dividing Panels with Brass Front Inlays */}
      {[-SHELF_L / 2, 0, SHELF_L / 2].map((sz, idx) => (
        <group key={idx} position={[0, SHELF_H / 2, sz]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[SHELF_W, SHELF_H, 0.035]} />
            <meshPhysicalMaterial color={WOOD_DARK} roughness={0.45} metalness={0.1} clearcoat={0.25} />
          </mesh>
          <mesh position={[SHELF_W / 2 + 0.002, 0, 0]}>
            <boxGeometry args={[0.005, SHELF_H, 0.035]} />
            <meshPhysicalMaterial color={GOLD_ACCENT} roughness={0.2} metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Back Wall Board */}
      <mesh position={[-SHELF_W / 2 + 0.01, SHELF_H / 2, 0]} receiveShadow>
        <boxGeometry args={[0.02, SHELF_H, SHELF_L]} />
        <meshPhysicalMaterial color="#16171a" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Horizontal Shelves with Integrated Warm LED Strips */}
      {new Array(shelfCount).fill(0).map((_, i) => {
        const y = 0.16 + i * shelfSpacing
        return (
          <group key={i}>
            <mesh position={[0, y, 0]} castShadow receiveShadow>
              <boxGeometry args={[SHELF_W, 0.03, SHELF_L - 0.04]} />
              <meshPhysicalMaterial color={WOOD_DARK} roughness={0.45} metalness={0.1} clearcoat={0.25} />
            </mesh>

            {/* Warm LED Under-Shelf Glow */}
            <mesh position={[0, y - 0.016, 0]}>
              <boxGeometry args={[SHELF_W - 0.06, 0.006, SHELF_L - 0.08]} />
              <meshStandardMaterial
                color={WARM_LED}
                emissive={WARM_LED}
                emissiveIntensity={accentOn ? 2.6 : 0}
                toneMapped={false}
              />
            </mesh>

            {/* Books & Decor */}
            {i % 2 === 0 && (
              <group position={[0, y + 0.015, 0]}>
                <BooksRow zOffset={-SHELF_L / 2 + 0.1} count={7} />
                <BooksRow zOffset={0.08} count={6} />
              </group>
            )}
            {i % 2 === 1 && (
              <group position={[0, y + 0.015, 0]}>
                <SucculentPlant position={[0, 0, -SHELF_L / 4]} />
                <BooksRow zOffset={0.12} count={8} />
              </group>
            )}
          </group>
        )
      })}
    </group>
  )
}
