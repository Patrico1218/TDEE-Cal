'use client'

import { ACTIVITY_OPTIONS, type ActivityLevel } from '@/types/tdee'

interface ActivitySelectorProps {
  value: ActivityLevel
  onChange: (value: ActivityLevel) => void
}

export default function ActivitySelector({ value, onChange }: ActivitySelectorProps) {
  return (
    <div className="w-full">
      <label className="block mb-3 font-share-tech-mono text-cyber-blue text-sm">
        活動量
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {ACTIVITY_OPTIONS.map((option) => {
          const isSelected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                px-4 py-3
                font-share-tech-mono text-sm
                border-2 transition-all duration-300
                ${
                  isSelected
                    ? 'border-neon-pink bg-neon-pink/20 text-neon-pink shadow-[0_0_15px_rgba(255,0,85,0.5)]'
                    : 'border-cyber-blue/50 bg-transparent text-cyber-blue/70 hover:border-cyber-blue hover:text-cyber-blue'
                }
                relative overflow-hidden
              `}
            >
              <span className="relative z-10">{option.label}</span>
              {isSelected && (
                <span className="absolute inset-0 bg-neon-pink/10 animate-pulse"></span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
