import { ROOM_DEPTH, ROOM_HEIGHT } from '../components/Room/dimensions'
import { HALL_CENTER_X } from '../components/HallKitchen/dimensions'
import { LANDING_CENTER_X, STUDY_CENTER_X } from '../components/EntranceLanding/dimensions'

export const CAMERA_PRESETS = [
  {
    id: 'whole_view',
    label: '🏢 Whole View',
    position: [4.8, 6.0, 24.0],
    target: [4.8, -1.5, 1.0],
    isFree: true,
  },
  {
    id: 'freestyle',
    label: '🚀 Free Style 360°',
    position: [6.0, 4.8, 11.5],
    target: [6.0, 1.8, 0],
    isFree: true,
  },
  {
    id: 'hallkitchen',
    label: '🛋️ Living & Kitchen',
    position: [HALL_CENTER_X - 2.5, ROOM_HEIGHT * 0.58, 5.8],
    target: [HALL_CENTER_X, ROOM_HEIGHT * 0.38, 0],
  },
  {
    id: 'study',
    label: '💻 Study',
    position: [STUDY_CENTER_X - 1.8, 2.5, 4.2],
    target: [STUDY_CENTER_X, 1.4, 0],
  },
  {
    id: 'bedroom',
    label: '🛏️ Bedroom',
    position: [0.8, ROOM_HEIGHT * 0.55, ROOM_DEPTH * 1.25],
    target: [0, ROOM_HEIGHT * 0.42, 0],
  },
  {
    id: 'ensuite',
    label: '🚿 Ensuite',
    position: [-4.2, 2.6, 3.2],
    target: [-6.8, 1.4, -0.6],
  },
  {
    id: 'entrance',
    label: '🚪 Foyer',
    position: [LANDING_CENTER_X, 2.1, 2.6],
    target: [LANDING_CENTER_X, 1.4, -2.4],
  },
]
