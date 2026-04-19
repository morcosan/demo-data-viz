import type { GeoContinent } from '@app/shared/utils/geo-data/types'
import { Keyboard } from '@ds/core'
import { type ChoroView, type EAreaCoords, type EViewConfig } from '../_types'

export const MOVE_SPEED = 8
export const ZOOM_SPEED = 1.1
export const MIN_ZOOM = 1.2
export const MAX_ZOOM = 40

export const MOVE_KEY_DELTA = {
  [Keyboard.ARROW_LEFT]: [-1, 0],
  [Keyboard.ARROW_RIGHT]: [1, 0],
  [Keyboard.ARROW_UP]: [0, 1],
  [Keyboard.ARROW_DOWN]: [0, -1],
} as const

export const ZOOM_KEY_DELTA = {
  [Keyboard.PLUS]: 1,
  [Keyboard.EQUAL]: 1,
  [Keyboard.MINUS]: -1,
} as const

export const HANDLED_KEYS = [
  Keyboard.SPACE,
  Keyboard.ESCAPE,
  ...Object.keys(MOVE_KEY_DELTA),
  ...Object.keys(ZOOM_KEY_DELTA),
] as const

export const VIEW_CONFIGS: Record<ChoroView, EViewConfig> = {
  world: { center: [0, 13], zoom: 1.2 },
  europe: { center: [15, 52.5], zoom: 4.75 },
  'north-america': { center: [-100, 45], zoom: 2.3 },
  'south-america': { center: [-60, -22], zoom: 2.6 },
  africa: { center: [20, 1], zoom: 2.45 },
  asia: { center: [80, 33], zoom: 1.95 },
  oceania: { center: [140, -27], zoom: 4.1 },
} as const

export const COORDS_BY_AREA: Record<GeoContinent, EAreaCoords> = {
  europe: { lng: [-25, 45], lat: [34, 72] },
  'north-america': { lng: [-170, -50], lat: [7, 83] },
  'south-america': { lng: [-92, -30], lat: [-56, 13] },
  africa: { lng: [-20, 55], lat: [-35, 37] },
  asia: { lng: [25, 180], lat: [-10, 82] },
  oceania: { lng: [110, 180], lat: [-50, 0] },
} as const
