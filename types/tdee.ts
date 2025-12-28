export type Gender = 'male' | 'female'

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra'

export interface ActivityOption {
  value: ActivityLevel
  label: string
  factor: number
}

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  { value: 'sedentary', label: '久坐', factor: 1.2 },
  { value: 'light', label: '輕度', factor: 1.375 },
  { value: 'moderate', label: '中度', factor: 1.55 },
  { value: 'very', label: '高度', factor: 1.725 },
  { value: 'extra', label: '極高', factor: 1.9 },
]

export interface TDEEData {
  height: number
  weight: number
  age: number
  gender: Gender
  activityLevel: ActivityLevel
}

export interface TDEEResult {
  bmr: number
  tdee: number
}
