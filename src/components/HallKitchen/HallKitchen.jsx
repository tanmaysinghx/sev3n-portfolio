import HallCeilingLighting from './HallCeilingLighting'
import HallKitchenShell from './HallKitchenShell'
import Kitchenette from './Kitchenette'
import LivingArea from './LivingArea'

export default function HallKitchen({
  downlightColor = '#fff3da',
  glowColor = '#fff3da',
  accentOn = true,
}) {
  return (
    <group>
      <HallKitchenShell accentOn={accentOn} />
      <LivingArea accentOn={accentOn} />
      <Kitchenette accentOn={accentOn} />
      <HallCeilingLighting downlightColor={downlightColor} glowColor={glowColor} />
    </group>
  )
}
