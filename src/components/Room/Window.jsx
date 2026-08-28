import NYCSkyline from '../Skyline/NYCSkyline'
import { UnifiedBackWindow } from '../Common/UnifiedWindowWall'
import { ROOM_DEPTH, ROOM_HEIGHT, ROOM_WIDTH } from './dimensions'

export default function Window({ timeOfDay }) {
  return (
    <group>
      <NYCSkyline timeOfDay={timeOfDay} />
      <UnifiedBackWindow
        startX={-ROOM_WIDTH / 2}
        width={ROOM_WIDTH}
        backZ={-ROOM_DEPTH / 2}
        height={ROOM_HEIGHT}
      />
    </group>
  )
}
