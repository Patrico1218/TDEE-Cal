'use client'

import { useEffect, useState, useRef } from 'react'

interface NumberTickerProps {
  value: number
  duration?: number
  className?: string
}

// 數位亂碼字符集
const GLITCH_CHARS = '0123456789ABCDEF?!#%&*'

export default function NumberTicker({
  value,
  duration = 1.5,
  className = '',
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [glitchText, setGlitchText] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const glitchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const startValueRef = useRef(value)

  useEffect(() => {
    // 如果值相同，直接返回
    if (value === displayValue) {
      startValueRef.current = value
      return
    }

    // 清理之前的動畫
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (glitchTimeoutRef.current) {
      clearTimeout(glitchTimeoutRef.current)
    }

    const startValue = startValueRef.current
    const endValue = value
    const difference = endValue - startValue

    startValueRef.current = value // 更新開始值為目標值

    // 數字跳動動畫
    const startTime = Date.now()
    const steps = 60 // 60fps
    let frameCount = 0

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)

      // 使用 easeOutCubic 緩動函數
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      const currentValue = Math.round(startValue + difference * easedProgress)
      setDisplayValue(currentValue)

      // 在動畫過程中隨機產生數位亂碼效果
      frameCount++
      if (frameCount % 8 === 0 && progress < 0.95) {
        // 每隔幾幀，有 30% 機率顯示亂碼
        if (Math.random() < 0.3) {
          const glitchStr = currentValue
            .toString()
            .split('')
            .map(() => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)])
            .join('')
          setGlitchText(glitchStr)

          // 30-50ms 後恢復
          glitchTimeoutRef.current = setTimeout(() => {
            setGlitchText(null)
          }, 30 + Math.random() * 20)
        }
      }

      if (progress >= 1) {
        setDisplayValue(endValue)
        setGlitchText(null)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        if (glitchTimeoutRef.current) {
          clearTimeout(glitchTimeoutRef.current)
        }
      }
    }, 1000 / steps)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current)
      }
    }
  }, [value, duration])

  // 顯示亂碼或正常數字
  const displayText = glitchText !== null 
    ? glitchText 
    : displayValue.toLocaleString()

  return (
    <span className={className}>
      {displayText}
    </span>
  )
}
