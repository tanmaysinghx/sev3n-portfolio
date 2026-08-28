import { CAMERA_PRESETS } from '../../scenes/cameraPresets'

export default function RoomNav({ roomIndex, onSelectRoom }) {
  return (
    <div className="fixed top-5 left-1/2 z-20 flex max-w-[95vw] -translate-x-1/2 flex-wrap items-center justify-center gap-1.5 rounded-3xl border border-white/15 bg-black/70 p-1.5 text-white backdrop-blur-md shadow-xl">
      {CAMERA_PRESETS.map((preset, i) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelectRoom(i)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
            i === roomIndex
              ? 'border border-white/40 bg-white/20 text-white shadow-sm'
              : 'border border-transparent text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white'
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  )
}
