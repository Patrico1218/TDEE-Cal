'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CyberButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export default function CyberButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
}: CyberButtonProps) {
  const glitchVariants = {
    rest: {
      x: 0,
      y: 0,
      color: variant === 'primary' ? '#00f3ff' : '#ff0055',
    },
    hover: {
      x: [0, -2, 2, -2, 2, 0],
      y: [0, 2, -2, 2, -2, 0],
      color: variant === 'primary' ? '#00f3ff' : '#ff0055',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  }

  const borderColor = variant === 'primary' ? 'border-cyber-blue' : 'border-neon-pink'
  const textColor = variant === 'primary' ? 'text-cyber-blue' : 'text-neon-pink'
  const shadowColor =
    variant === 'primary'
      ? 'shadow-[0_0_15px_rgba(0,243,255,0.5)]'
      : 'shadow-[0_0_15px_rgba(255,0,85,0.5)]'
  const hoverShadowColor =
    variant === 'primary'
      ? 'hover:shadow-[0_0_20px_rgba(0,243,255,0.8)]'
      : 'hover:shadow-[0_0_20px_rgba(255,0,85,0.8)]'

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      variants={glitchVariants}
      initial="rest"
      whileHover={disabled ? 'rest' : 'hover'}
      whileTap={disabled ? 'rest' : { scale: 0.98 }}
      className={`
        px-6 py-3
        font-share-tech-mono text-lg
        border-2 ${borderColor}
        bg-transparent
        ${textColor}
        ${shadowColor}
        ${hoverShadowColor}
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
        relative overflow-hidden
      `}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
