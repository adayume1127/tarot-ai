'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { TarotCard } from '@/lib/tarot'

const CARD_COLORS: Record<number, { from: string; to: string; accent: string }> = {
  0:  { from: '#1a0a2e', to: '#1a0a2e', accent: '#c084fc' },
  1:  { from: '#0f1a2e', to: '#0f1a2e', accent: '#60a5fa' },
  2:  { from: '#0a1628', to: '#0a1628', accent: '#818cf8' },
  3:  { from: '#1a1200', to: '#1a1200', accent: '#fbbf24' },
  4:  { from: '#1a0000', to: '#1a0000', accent: '#f87171' },
  5:  { from: '#0a100a', to: '#0a100a', accent: '#86efac' },
  6:  { from: '#1a0a1a', to: '#1a0a1a', accent: '#f0abfc' },
  7:  { from: '#0a0a1a', to: '#0a0a1a', accent: '#a5b4fc' },
  8:  { from: '#1a0800', to: '#1a0800', accent: '#fb923c' },
  9:  { from: '#080808', to: '#080808', accent: '#9ca3af' },
  10: { from: '#0a1a0a', to: '#0a1a0a', accent: '#4ade80' },
  11: { from: '#0a0a14', to: '#0a0a14', accent: '#e2e8f0' },
  12: { from: '#141400', to: '#141400', accent: '#facc15' },
  13: { from: '#0a0000', to: '#0a0000', accent: '#dc2626' },
  14: { from: '#001a14', to: '#001a14', accent: '#34d399' },
  15: { from: '#100010', to: '#100010', accent: '#a21caf' },
  16: { from: '#1a0800', to: '#1a0800', accent: '#f97316' },
  17: { from: '#00081a', to: '#00081a', accent: '#38bdf8' },
  18: { from: '#000814', to: '#000814', accent: '#6366f1' },
  19: { from: '#1a1000', to: '#1a1000', accent: '#fde047' },
  20: { from: '#001414', to: '#001414', accent: '#2dd4bf' },
  21: { from: '#0a0a00', to: '#0a0a00', accent: '#eab308' },
}

type Props = {
  card: TarotCard
  isReversed: boolean
  isFlipped: boolean
  position: '過去' | '現在' | '未来'
  positionEn: 'PAST' | 'PRESENT' | 'FUTURE'
  delay?: number
}

export default function SpreadCardFlip({ card, isReversed, isFlipped, position, positionEn }: Props) {
  const [imgError, setImgError] = useState(false)
  const [burst, setBurst] = useState(false)
  const colors = CARD_COLORS[card.id] ?? CARD_COLORS[0]
  const fileName = `${String(card.id).padStart(2, '0')}_${card.nameEn.replace(/\s/g, '_').replace(/[^a-zA-Z_]/g, '').toLowerCase()}`

  useEffect(() => {
    if (isFlipped) {
      const t = setTimeout(() => { setBurst(true); setTimeout(() => setBurst(false), 700) }, 800)
      return () => clearTimeout(t)
    }
  }, [isFlipped])

  return (
    <div className="flex flex-col items-center gap-2">
      {/* ポジションラベル */}
      <div className="text-center">
        <div className="font-cinzel text-[9px] tracking-[0.3em] text-yellow-400/50">{positionEn}</div>
        <div className="font-zen text-xs text-yellow-300/80">{position}</div>
      </div>

      {/* カード */}
      <div className="relative" style={{ width: 100, height: 168, perspective: 800 }}>
        <AnimatePresence>
          {burst && (
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none z-20"
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 0, scale: 2.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.5) 0%, rgba(168,85,247,0.2) 40%, transparent 70%)' }}
            />
          )}
        </AnimatePresence>

        <motion.div
          style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', position: 'relative' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* 裏面 */}
          <div
            style={{ backfaceVisibility: 'hidden' }}
            className="absolute inset-0 rounded-xl overflow-hidden border border-purple-400/50 shadow-lg"
          >
            <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-950 flex flex-col items-center justify-center">
              <div className="text-2xl mb-2">🌟</div>
              <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, transparent, #FFD700, transparent)' }} />
              <p className="font-cinzel text-purple-300/40 text-[8px] mt-2 tracking-[0.3em]">TAROT</p>
              <div className="absolute inset-1 border border-purple-500/20 rounded-lg pointer-events-none" />
            </div>
          </div>

          {/* 表面 */}
          <div
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            className="absolute inset-0 rounded-xl overflow-hidden border border-yellow-400/50 shadow-lg"
          >
            {!imgError ? (
              <div className={`w-full h-full relative ${isReversed ? 'rotate-180' : ''}`}>
                <Image
                  src={`/cards/${fileName}.png`}
                  alt={card.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={() => setImgError(true)}
                  sizes="100px"
                />
              </div>
            ) : (
              <div
                className={`w-full h-full flex flex-col items-center justify-center gap-1 p-1 ${isReversed ? 'rotate-180' : ''}`}
                style={{ background: `linear-gradient(160deg, ${colors.from}, #1a0030)` }}
              >
                <div className="text-xl">{card.emoji}</div>
                <div className="font-zen text-[9px] text-center leading-tight" style={{ color: colors.accent }}>{card.name}</div>
                {isReversed && (
                  <div className="text-[7px] px-1 py-0.5 rounded-full border border-red-400/40 text-red-300">逆</div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* カード名（表示後） */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <div className="font-zen text-[10px] text-yellow-200/70">{card.name}</div>
            <div className={`font-cinzel text-[8px] tracking-wider ${isReversed ? 'text-red-400/60' : 'text-purple-300/50'}`}>
              {isReversed ? 'REVERSED' : 'UPRIGHT'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
