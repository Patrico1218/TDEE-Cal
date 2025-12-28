'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface NeonInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  unit?: string
  min?: number
  max?: number
  step?: number
}

export default function NeonInput({
  label,
  value,
  onChange,
  unit = '',
  min = 0,
  max,
  step = 1,
}: NeonInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value) || 0
    onChange(numValue)
  }

  const handleClear = () => {
    onChange(0)
  }

  const hasValue = value && value > 0

  return (
    <div className="w-full">
      <label className="block mb-2 font-share-tech-mono text-cyber-blue text-sm">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value || ''}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          min={min}
          max={max}
          step={step}
          className={`
            w-full px-4 py-3 ${hasValue && unit ? 'pr-16' : hasValue ? 'pr-10' : unit ? 'pr-12' : 'pr-4'}
            font-share-tech-mono text-base sm:text-lg
            bg-transparent
            border-2 transition-all duration-300
            outline-none
            ${
              isFocused
                ? 'border-neon-pink shadow-[0_0_15px_rgba(255,0,85,0.5)] text-neon-pink'
                : 'border-cyber-blue shadow-cyber-glow text-cyber-blue'
            }
            focus:border-neon-pink focus:shadow-[0_0_15px_rgba(255,0,85,0.5)]
            placeholder:text-cyber-blue/50
          `}
          placeholder="0"
        />
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute ${unit ? 'right-10' : 'right-2'} top-1/2 -translate-y-1/2 p-1 text-cyber-blue/70 hover:text-neon-pink transition-colors z-10`}
            aria-label="清空"
          >
            <X size={16} />
          </button>
        )}
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-share-tech-mono text-cyber-blue/70 pointer-events-none text-sm">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}
