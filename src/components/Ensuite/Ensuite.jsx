import EnsuiteLighting from './EnsuiteLighting'
import EnsuiteShell from './EnsuiteShell'
import ModernBathroom from './ModernBathroom'
import WalkInWardrobe from './WalkInWardrobe'

export default function Ensuite({ downlightColor = '#fff3da', glowColor = '#fff3da', accentOn = true }) {
  return (
    <group>
      <EnsuiteShell />
      <WalkInWardrobe accentOn={accentOn} />
      <ModernBathroom accentOn={accentOn} />
      <EnsuiteLighting downlightColor={downlightColor} glowColor={glowColor} intensity={2.4} />
    </group>
  )
}
