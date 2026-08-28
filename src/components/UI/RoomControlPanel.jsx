import { LIGHT_PRESETS, TIME_OF_DAY } from '../Lighting/presets'

function ToggleRow({ on, onLabel, onToggle, activeClass }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition ${
        on ? activeClass : 'border-white/10 text-white/60'
      }`}
    >
      <span>{on ? onLabel : 'Off'}</span>
      <span className={`h-4 w-8 rounded-full transition ${on ? 'bg-white/70' : 'bg-white/20'}`}>
        <span
          className={`block h-4 w-4 rounded-full bg-white shadow transition ${
            on ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  )
}

export default function RoomControlPanel({
  isOpen,
  onClose,
  presetIndex,
  onSelectPreset,
  timeOfDayIndex = 1,
  onSelectTimeOfDay = () => {},
  bedLampsOn,
  onToggleBedLamps,
  accentOn,
  onToggleAccent,
  acOn,
  onToggleAc,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed bottom-5 right-5 z-20 w-72 rounded-2xl border border-white/15 bg-black/75 p-4 text-white backdrop-blur-md shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold">Penthouse Controls</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Exterior Time of Day */}
      <div className="mb-3">
        <div className="mb-1.5 text-xs uppercase tracking-wide text-white/50 flex items-center justify-between">
          <span>NYC Skyline & Sun</span>
          <span className="text-[10px] text-amber-300 font-mono">
            {TIME_OF_DAY[timeOfDayIndex]?.label}
          </span>
        </div>
        <div className="flex gap-1.5">
          {TIME_OF_DAY.map((tod, i) => (
            <button
              key={tod.id}
              type="button"
              onClick={() => onSelectTimeOfDay(i)}
              className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition ${
                i === timeOfDayIndex
                  ? 'border-amber-300/80 bg-amber-400/20 text-amber-200 shadow-sm'
                  : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white'
              }`}
            >
              {tod.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interior Ceiling Lights */}
      <div className="mb-3">
        <div className="mb-1.5 text-xs uppercase tracking-wide text-white/50">Ceiling Lights</div>
        <div className="flex gap-1.5">
          {LIGHT_PRESETS.map((preset, i) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(i)}
              className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition ${
                i === presetIndex
                  ? 'border-white/60 bg-white/15 text-white'
                  : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bedside & Desk Lamps */}
      <div className="mb-3">
        <div className="mb-1.5 text-xs uppercase tracking-wide text-white/50">Pendant Lamps</div>
        <ToggleRow
          on={bedLampsOn}
          onLabel="On"
          onToggle={onToggleBedLamps}
          activeClass="border-amber-300/60 bg-amber-400/15 text-amber-100"
        />
      </div>

      {/* Neon & RGB Accent Lighting */}
      <div className="mb-3">
        <div className="mb-1.5 text-xs uppercase tracking-wide text-white/50">Neon & RGB Accents</div>
        <ToggleRow
          on={accentOn}
          onLabel="On"
          onToggle={onToggleAccent}
          activeClass="border-fuchsia-300/60 bg-fuchsia-400/15 text-fuchsia-100"
        />
      </div>

      {/* Climate AC */}
      <div>
        <div className="mb-1.5 text-xs uppercase tracking-wide text-white/50">Climate AC</div>
        <ToggleRow
          on={acOn}
          onLabel="Cooling On"
          onToggle={onToggleAc}
          activeClass="border-sky-300/60 bg-sky-400/15 text-sky-100"
        />
      </div>
    </div>
  )
}
