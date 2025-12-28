'use client'

interface StatusLabelProps {
  status: 'ready' | 'calculating'
  className?: string
}

export default function StatusLabel({ status, className = '' }: StatusLabelProps) {
  const text = status === 'ready' ? '[SYSTEM READY]' : '[CALCULATING...]'
  const colorClass = status === 'ready' ? 'text-cyber-blue' : 'text-neon-pink'

  return (
    <span
      className={`
        font-share-tech-mono text-xs
        ${colorClass}
        breathing
        ${className}
      `}
    >
      {text}
    </span>
  )
}
