import { HALL_FAR_X } from '../HallKitchen/dimensions'

// Extended Grand Private Elevator & Stair Foyer (4.20m wide)
export const LANDING_WIDTH = 4.20
export const LANDING_ORIGIN_X = HALL_FAR_X // +8.60m
export const LANDING_FAR_X = LANDING_ORIGIN_X + LANDING_WIDTH // +12.80m
export const LANDING_CENTER_X = (LANDING_ORIGIN_X + LANDING_FAR_X) / 2 // +10.70m

// Grand Portal Doorway between Foyer and Living Hall (2.10m wide)
export const LANDING_DOOR = {
  centerZ: 2.15,
  width: 2.10,
  height: 3.40,
}

export const STUDY_WIDTH = 4.80
export const STUDY_DEPTH = 7.00 // Perfectly aligned with Hall, Bedroom, and Foyer depth (7.0m)
export const STUDY_ORIGIN_X = LANDING_FAR_X // +12.80m
export const STUDY_FAR_X = STUDY_ORIGIN_X + STUDY_WIDTH // +17.60m
export const STUDY_CENTER_X = (STUDY_ORIGIN_X + STUDY_FAR_X) / 2 // +15.20m
