import { useState, useEffect, useMemo } from 'react'
import type { Gender, ActivityLevel, TDEEData, TDEEResult } from '@/types/tdee'
import { ACTIVITY_OPTIONS } from '@/types/tdee'

const STORAGE_KEY = 'cyber-tdee-data'

/**
 * 根據 Mifflin-St Jeor 公式計算 BMR
 */
function calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
  if (weight <= 0 || height <= 0 || age <= 0) {
    return 0
  }

  const baseBMR = 10 * weight + 6.25 * height - 5 * age
  return gender === 'male' ? baseBMR + 5 : baseBMR - 161
}

/**
 * 根據活動量計算 TDEE
 */
function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  if (bmr <= 0) {
    return 0
  }

  const activityFactor = ACTIVITY_OPTIONS.find(opt => opt.value === activityLevel)?.factor ?? 1.2
  return bmr * activityFactor
}

/**
 * 驗證輸入值是否有效
 */
function isValidInput(value: number): boolean {
  return !isNaN(value) && value > 0 && isFinite(value)
}

/**
 * 驗證所有輸入是否有效
 */
function areInputsValid(data: TDEEData): boolean {
  return (
    isValidInput(data.height) &&
    isValidInput(data.weight) &&
    isValidInput(data.age) &&
    data.gender !== undefined &&
    data.activityLevel !== undefined
  )
}

/**
 * TDEE 計算機 Hook
 */
const DEFAULT_DATA: TDEEData = {
  height: 0,
  weight: 0,
  age: 0,
  gender: 'male',
  activityLevel: 'sedentary',
}

export function useTDEE() {
  const [data, setData] = useState<TDEEData>(DEFAULT_DATA)

  const [isInitialized, setIsInitialized] = useState(false)

  // 從 LocalStorage 讀取數據
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as TDEEData
        // 驗證存儲的數據是否有效
        if (
          parsed &&
          typeof parsed.height === 'number' &&
          typeof parsed.weight === 'number' &&
          typeof parsed.age === 'number' &&
          (parsed.gender === 'male' || parsed.gender === 'female') &&
          ['sedentary', 'light', 'moderate', 'very', 'extra'].includes(parsed.activityLevel)
        ) {
          setData(parsed)
        } else {
          // Invalid data format, use defaults
          setData(DEFAULT_DATA)
        }
      } else {
        // No stored data, use defaults
        setData(DEFAULT_DATA)
      }
    } catch (error) {
      // Silently handle localStorage errors
      // Default values will be used if loading fails
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // 寫入 LocalStorage
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      // Silently handle localStorage errors (e.g., quota exceeded, private mode)
    }
  }, [data, isInitialized])

  // 計算 BMR 和 TDEE
  const result: TDEEResult = useMemo(() => {
    if (!areInputsValid(data)) {
      return { bmr: 0, tdee: 0 }
    }

    const bmr = calculateBMR(data.weight, data.height, data.age, data.gender)
    const tdee = calculateTDEE(bmr, data.activityLevel)

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
    }
  }, [data])

  // 更新函數
  const updateHeight = (height: number) => {
    setData(prev => ({ ...prev, height }))
  }

  const updateWeight = (weight: number) => {
    setData(prev => ({ ...prev, weight }))
  }

  const updateAge = (age: number) => {
    setData(prev => ({ ...prev, age }))
  }

  const updateGender = (gender: Gender) => {
    setData(prev => ({ ...prev, gender }))
  }

  const updateActivityLevel = (activityLevel: ActivityLevel) => {
    setData(prev => ({ ...prev, activityLevel }))
  }

  // 驗證狀態
  const isValid = areInputsValid(data)

  return {
    // 數據狀態
    data,
    // 計算結果
    result,
    // 驗證狀態
    isValid,
    // 更新函數
    updateHeight,
    updateWeight,
    updateAge,
    updateGender,
    updateActivityLevel,
    // 初始化狀態
    isInitialized,
  }
}
