'use client'

import type { Gender } from '@/types/tdee'

interface GenderSelectorProps {
  value: Gender
  onChange: (value: Gender) => void
}

export default function GenderSelector({ value, onChange }: GenderSelectorProps) {
  const options: { value: Gender; label: string }[] = [
    { value: 'male', label: '男性' },
    { value: 'female', label: '女性' },
  ]

  return (
    <div className="w-full">
      <label className="block mb-3 font-share-tech-mono text-cyber-blue text-sm">
        性別
      </label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                px-4 py-3
                font-share-tech-mono text-base
                border-2 transition-all duration-300
                ${
                  isSelected
                    ? 'border-cyber-blue bg-cyber-blue/20 text-cyber-blue shadow-cyber-glow'
                    : 'border-cyber-blue/50 bg-transparent text-cyber-blue/70 hover:border-cyber-blue hover:text-cyber-blue'
                }
                relative overflow-hidden
              `}
            >
              <span className="relative z-10">{option.label}</span>
              {isSelected && (
                <span className="absolute inset-0 bg-cyber-blue/10 animate-pulse"></span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
