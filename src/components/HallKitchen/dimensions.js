import { ROOM_DEPTH, ROOM_HEIGHT, ROOM_WIDTH } from '../Room/dimensions'
import { DOOR } from '../Room/layout'

export const HALL_WIDTH = 9.2 // Expanded to 9.2m for an expansive, luxurious Grand Living Hall & Kitchen
export const HALL_HEIGHT = ROOM_HEIGHT
export const HALL_DEPTH = ROOM_DEPTH

// Origin is placed adjacent to the TV wall (x = +ROOM_WIDTH/2 = +3.1)
export const HALL_ORIGIN_X = ROOM_WIDTH / 2
export const HALL_CENTER_X = HALL_ORIGIN_X + HALL_WIDTH / 2
export const HALL_FAR_X = HALL_ORIGIN_X + HALL_WIDTH

export const HALL_DOOR = {
  centerZ: DOOR.centerZ,
  width: DOOR.width,
  height: DOOR.height,
}
