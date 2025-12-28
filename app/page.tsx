'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTDEE } from '@/hooks/useTDEE'
import NeonInput from '@/components/NeonInput'
import GenderSelector from '@/components/GenderSelector'
import ActivitySelector from '@/components/ActivitySelector'
import CyberButton from '@/components/CyberButton'
import NumberTicker from '@/components/NumberTicker'
import StatusLabel from '@/components/StatusLabel'

export default function Home() {
  const {
    data,
    result,
    isValid,
    updateHeight,
    updateWeight,
    updateAge,
    updateGender,
    updateActivityLevel,
  } = useTDEE()

  const [isResetting, setIsResetting] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const handleReset = () => {
    setIsResetting(true)
    
    // Glitch 動畫持續 300ms，然後清空數值
    setTimeout(() => {
      updateHeight(0)
      updateWeight(0)
      updateAge(0)
      updateGender('male')
      updateActivityLevel('sedentary')
      setFormKey(prev => prev + 1) // 強制重新渲染表單
      setIsResetting(false)
    }, 300)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <main className="min-h-screen bg-background scanline">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-4xl">
        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl font-bold text-cyber-blue mb-2">
            CyberTDEE
          </h1>
          <p className="font-share-tech-mono text-cyber-blue/70 text-xs sm:text-sm md:text-base">
            賽博風格代謝計算機
          </p>
        </motion.div>

        {/* 表單容器 */}
        <motion.div
          key={formKey}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`space-y-6 mb-8 ${isResetting ? 'glitch-animation' : ''}`}
        >
          {/* 輸入區域 Card */}
          <motion.div
            variants={itemVariants}
            className="p-4 sm:p-6 md:p-8 border-2 border-cyber-blue shadow-cyber-glow bg-background/50 backdrop-blur-sm"
          >
            <div className="space-y-6">
              {/* 身高、體重、年齡 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <NeonInput
                  label="身高"
                  value={data.height}
                  onChange={updateHeight}
                  unit="cm"
                  min={0}
                />
                <NeonInput
                  label="體重"
                  value={data.weight}
                  onChange={updateWeight}
                  unit="kg"
                  min={0}
                />
                <NeonInput
                  label="年齡"
                  value={data.age}
                  onChange={updateAge}
                  unit="歲"
                  min={0}
                />
              </div>

              {/* 性別選擇 */}
              <motion.div variants={itemVariants}>
                <GenderSelector value={data.gender} onChange={updateGender} />
              </motion.div>

              {/* 活動量選擇 */}
              <motion.div variants={itemVariants}>
                <ActivitySelector
                  value={data.activityLevel}
                  onChange={updateActivityLevel}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* 結果顯示 Card */}
          {isValid && result.bmr > 0 && (
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 sm:p-8 border-2 border-cyber-blue shadow-cyber-glow bg-background/50 backdrop-blur-sm scanline"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
                <h2 className="font-orbitron text-xl sm:text-2xl md:text-3xl text-cyber-blue">
                  計算結果
                </h2>
                <StatusLabel status="ready" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="font-share-tech-mono text-cyber-blue/70 text-xs sm:text-sm mb-2">
                    BMR (基礎代謝率)
                  </p>
                  <p className="font-share-tech-mono text-3xl sm:text-4xl md:text-5xl text-cyber-blue text-glow-blue break-all">
                    <NumberTicker value={result.bmr} />
                  </p>
                  <p className="font-share-tech-mono text-cyber-blue/50 text-xs mt-1">
                    kcal/日
                  </p>
                </div>
                <div>
                  <p className="font-share-tech-mono text-cyber-blue/70 text-xs sm:text-sm mb-2">
                    TDEE (總熱量消耗)
                  </p>
                  <p className="font-share-tech-mono text-3xl sm:text-4xl md:text-5xl text-neon-pink text-glow-pink break-all">
                    <NumberTicker value={result.tdee} />
                  </p>
                  <p className="font-share-tech-mono text-cyber-blue/50 text-xs mt-1">
                    kcal/日
                  </p>
                </div>
              </div>
              <p className="font-share-tech-mono text-[10px] sm:text-xs text-cyber-blue/40 mt-4 sm:mt-6 text-center">
                [NOTICE: DATA FOR REFERENCE ONLY. CONSULT A CYBER-DOC IF NEEDED.]
              </p>
            </motion.div>
          )}

          {/* 重置按鈕 */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <CyberButton onClick={handleReset} variant="secondary">
              重設
            </CyberButton>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
