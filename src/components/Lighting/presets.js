export const LIGHT_PRESETS = [
  { id: 'white', label: 'White', downlight: '#ffffff', glow: '#ffffff' },
  { id: 'warm', label: 'Warm', downlight: '#ffcf8a', glow: '#ffcf8a' },
  { id: 'off', label: 'Off', downlight: '#000000', glow: '#000000' },
]

export const LIGHTING_PRESETS = LIGHT_PRESETS

export const TIME_OF_DAY = [
  {
    id: 'day',
    label: 'Day',
    skyTop: '#3a7bd5',
    skyMid: '#70b2e8',
    skyBottom: '#eedcc5',
    sunColor: '#fff5e4',
    sunIntensity: 1.8,
    ambientIntensity: 0.38,
    hemiSky: '#c6defa',
    hemiGround: '#755b46',
    sunPosition: [-4, 8, -8],
    windowGlow: 0.25,
    signGlow: 0.8,
    fogColor: '#b4cdf0',
  },
  {
    id: 'evening',
    label: 'Evening',
    skyTop: '#151433',
    skyMid: '#54236a',
    skyBottom: '#e66b27',
    sunColor: '#ff6224',
    sunIntensity: 1.1,
    ambientIntensity: 0.22,
    hemiSky: '#6d28d9',
    hemiGround: '#38160e',
    sunPosition: [-8, 4.5, -9],
    windowGlow: 1.6,
    signGlow: 2.6,
    fogColor: '#241433',
  },
  {
    id: 'night',
    label: 'Night',
    skyTop: '#03050c',
    skyMid: '#080d1e',
    skyBottom: '#14182e',
    sunColor: '#30426b',
    sunIntensity: 0.12,
    ambientIntensity: 0.08,
    hemiSky: '#1e293b',
    hemiGround: '#0a0f1d',
    sunPosition: [-5, 6, -8],
    windowGlow: 2.8,
    signGlow: 3.8,
    fogColor: '#070a14',
  },
]

export const TIME_OF_DAY_PRESETS = TIME_OF_DAY
