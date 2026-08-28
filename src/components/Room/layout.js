import { ROOM_DEPTH, ROOM_HEIGHT, ROOM_WIDTH, WALL_THICKNESS } from './dimensions'

// Bed is centered at z = 0.5
export const BED = {
  width: 1.9,
  length: 2.3,
  centerZ: 0.5,
}
BED.headX = -ROOM_WIDTH / 2 + WALL_THICKNESS / 2 + 0.04
BED.footX = BED.headX + BED.length
BED.centerX = BED.headX + BED.length / 2

export const NIGHTSTAND = {
  width: 0.46,
  depth: 0.42,
}

const DESK_WALL_GAP = 0.15
const DESK_WINDOW_GAP = 0.15

export const DESK = {
  depth: 0.8,
  length: 2.3,
  height: 1.1,
  backZ: -ROOM_DEPTH / 2 + DESK_WINDOW_GAP,
}
DESK.x = ROOM_WIDTH / 2 - WALL_THICKNESS / 2 - DESK_WALL_GAP - DESK.depth / 2
DESK.frontX = DESK.x - DESK.depth / 2
DESK.backX = DESK.x + DESK.depth / 2
DESK.frontZ = DESK.backZ + DESK.length
DESK.centerZ = DESK.backZ + DESK.length / 2

const TV_DIAGONAL_M = 100 * 0.0254
const TV_ASPECT_W = 16
const TV_ASPECT_H = 9
const TV_HYP = Math.sqrt(TV_ASPECT_W * TV_ASPECT_W + TV_ASPECT_H * TV_ASPECT_H)
const PANEL_MARGIN = 0.4

// TV Wall aligned at z = 0.5
export const TV_WALL = {
  width: TV_DIAGONAL_M * (TV_ASPECT_W / TV_HYP),
  height: TV_DIAGONAL_M * (TV_ASPECT_H / TV_HYP),
  towerWidth: 0.45,
  centerZ: 0.5,
}
TV_WALL.panelWidth = TV_WALL.width + PANEL_MARGIN
TV_WALL.assemblyWidth = TV_WALL.panelWidth + TV_WALL.towerWidth * 2
TV_WALL.assemblyBackZ = TV_WALL.centerZ - TV_WALL.assemblyWidth / 2
TV_WALL.assemblyFrontZ = TV_WALL.centerZ + TV_WALL.assemblyWidth / 2
TV_WALL.panelBackZ = TV_WALL.centerZ - TV_WALL.panelWidth / 2

const DOOR_WINDOW_GAP = 0.1

export const DOOR = {
  width: 1.0,
  height: ROOM_HEIGHT,
}
DOOR.backZ = -ROOM_DEPTH / 2 + DOOR_WINDOW_GAP
DOOR.frontZ = DOOR.backZ + DOOR.width
DOOR.centerZ = DOOR.backZ + DOOR.width / 2

// Ensuite door at z = 2.60 (z = 2.15 to 3.05), leaving a generous 0.45m wall to the left of the door
export const BATH_DOOR = {
  width: 0.9,
  height: ROOM_HEIGHT,
  centerZ: 2.60,
}
BATH_DOOR.backZ = 2.15
BATH_DOOR.frontZ = 3.05
