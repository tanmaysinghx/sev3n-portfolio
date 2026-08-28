import { ROOM_DEPTH, ROOM_HEIGHT, ROOM_WIDTH } from '../Room/dimensions'
import { BATH_DOOR } from '../Room/layout'

// Unified High-Ceiling Penthouse Height across all rooms (4.20m)
export const ENSUITE_HEIGHT = ROOM_HEIGHT

export const ENSUITE_DOOR = {
  centerZ: 2.60,
  width: 0.9,
  height: Math.min(BATH_DOOR.height, 2.70),
}

// Origin is the bedroom's left wall (x = -ROOM_WIDTH/2 = -3.1)
export const ENSUITE_ORIGIN_X = -ROOM_WIDTH / 2

// Full depth alignment with the house (-3.5 to +3.5 = 7.0m total depth)
export const ENSUITE_Z_MIN = -ROOM_DEPTH / 2 // -3.5 (Window Wall)
export const ENSUITE_Z_MAX = ROOM_DEPTH / 2 // +3.5 (Full House Depth)

export const WARDROBE = {
  widthX: 2.3,
}
WARDROBE.originX = ENSUITE_ORIGIN_X
WARDROBE.farX = WARDROBE.originX - WARDROBE.widthX
WARDROBE.centerX = (WARDROBE.originX + WARDROBE.farX) / 2

export const BATHROOM = {
  widthX: 2.6,
}
BATHROOM.originX = WARDROBE.farX
BATHROOM.farX = BATHROOM.originX - BATHROOM.widthX
BATHROOM.centerX = (BATHROOM.originX + BATHROOM.farX) / 2

export const TOTAL_ENSUITE_WIDTH = WARDROBE.widthX + BATHROOM.widthX
