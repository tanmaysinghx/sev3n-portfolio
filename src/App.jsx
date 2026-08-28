import { useState } from 'react'
import RoomControlPanel from './components/UI/RoomControlPanel'
import RoomNav from './components/UI/RoomNav'
import MainScene from './scenes/MainScene'

export default function App() {
  const [presetIndex, setPresetIndex] = useState(0)
  const [timeOfDayIndex, setTimeOfDayIndex] = useState(1) // Default to NYC Golden Hour Evening
  const [roomIndex, setRoomIndex] = useState(0)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [bedLampsOn, setBedLampsOn] = useState(true)
  const [accentOn, setAccentOn] = useState(true)
  const [acOn, setAcOn] = useState(false)

  return (
    <div className="w-screen h-screen">
      <MainScene
        presetIndex={presetIndex}
        timeOfDayIndex={timeOfDayIndex}
        roomIndex={roomIndex}
        bedLampsOn={bedLampsOn}
        accentOn={accentOn}
        onConsoleClick={() => setIsPanelOpen((v) => !v)}
      />
      <RoomNav roomIndex={roomIndex} onSelectRoom={setRoomIndex} />
      <RoomControlPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        presetIndex={presetIndex}
        onSelectPreset={setPresetIndex}
        timeOfDayIndex={timeOfDayIndex}
        onSelectTimeOfDay={setTimeOfDayIndex}
        bedLampsOn={bedLampsOn}
        onToggleBedLamps={() => setBedLampsOn((v) => !v)}
        accentOn={accentOn}
        onToggleAccent={() => setAccentOn((v) => !v)}
        acOn={acOn}
        onToggleAc={() => setAcOn((v) => !v)}
      />
    </div>
  )
}
