'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { TarotCard } from '@/lib/tarot'

type Props = {
  card: TarotCard
  isReversed: boolean
  isFlipped: boolean
  onClick?: () => void
}

const CARD_COLORS: Record<number, { from: string; via: string; to: string; accent: string }> = {
  0:  { from: '#1a0a2e', via: '#2d1b4e', to: '#1a0a2e', accent: '#c084fc' },
  1:  { from: '#0f1a2e', via: '#1e3a5f', to: '#0f1a2e', accent: '#60a5fa' },
  2:  { from: '#0a1628', via: '#1e2d5a', to: '#0a1628', accent: '#818cf8' },
  3:  { from: '#1a1200', via: '#3d2c00', to: '#1a1200', accent: '#fbbf24' },
  4:  { from: '#1a0000', via: '#3d0000', to: '#1a0000', accent: '#f87171' },
  5:  { from: '#0a100a', via: '#1a2e1a', to: '#0a100a', accent: '#86efac' },
  6:  { from: '#1a0a1a', via: '#3d1a3d', to: '#1a0a1a', accent: '#f0abfc' },
  7:  { from: '#0a0a1a', via: '#1a1a4e', to: '#0a0a1a', accent: '#a5b4fc' },
  8:  { from: '#1a0800', via: '#3d1e00', to: '#1a0800', accent: '#fb923c' },
  9:  { from: '#080808', via: '#1a1a1a', to: '#080808', accent: '#9ca3af' },
  10: { from: '#0a1a0a', via: '#1a3d1a', to: '#0a1a0a', accent: '#4ade80' },
  11: { from: '#0a0a14', via: '#1a1a2e', to: '#0a0a14', accent: '#e2e8f0' },
  12: { from: '#141400', via: '#2e2e00', to: '#141400', accent: '#facc15' },
  13: { from: '#0a0000', via: '#200000', to: '#0a0000', accent: '#dc2626' },
  14: { from: '#001a14', via: '#003d2e', to: '#001a14', accent: '#34d399' },
  15: { from: '#100010', via: '#200020', to: '#100010', accent: '#a21caf' },
  16: { from: '#1a0800', via: '#3d1400', to: '#1a0800', accent: '#f97316' },
  17: { from: '#00081a', via: '#001040', to: '#00081a', accent: '#38bdf8' },
  18: { from: '#000814', via: '#001028', to: '#000814', accent: '#6366f1' },
  19: { from: '#1a1000', via: '#3d2800', to: '#1a1000', accent: '#fde047' },
  20: { from: '#001414', via: '#002e2e', to: '#001414', accent: '#2dd4bf' },
  21: { from: '#0a0a00', via: '#1a1a00', to: '#0a0a00', accent: '#eab308' },
}

function CardPlaceholder({ card, isReversed }: { card: TarotCard; isReversed: boolean }) {
  const colors = CARD_COLORS[card.id] ?? CARD_COLORS[0]
  const keywords = isReversed ? card.reversedKeywords : card.uprightKeywords

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-between p-3 ${isReversed ? 'rotate-180' : ''}`}
      style={{ background: `linear-gradient(160deg, ${colors.from}, ${colors.via}, ${colors.to})` }}
    >
      {/* 上部装飾 */}
      <div className="w-full flex flex-col items-center pt-1">
        <div className="text-[10px] tracking-[0.3em] opacity-60" style={{ color: colors.accent }}>
          {String(card.id).padStart(2, '0')} ✦ MAJOR ARCANA
        </div>
        <div className="w-3/4 h-px mt-1 opacity-40" style={{ background: `linear-gradient(to right, transparent, ${colors.accent}, transparent)` }} />
      </div>

      {/* 中央 */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-5xl filter drop-shadow-lg" style={{ filter: `drop-shadow(0 0 12px ${colors.accent}88)` }}>
          {card.emoji}
        </div>
        <div className="text-center">
          <div
            className="text-lg font-bold tracking-widest leading-tight"
            style={{ color: colors.accent, textShadow: `0 0 16px ${colors.accent}99` }}
          >
            {card.name}
          </div>
          <div className="text-[10px] tracking-widest mt-0.5 opacity-50" style={{ color: colors.accent }}>
            {card.nameEn.toUpperCase()}
          </div>
        </div>
        {/* キーワード */}
        <div className="flex flex-wrap justify-center gap-1 mt-1">
          {keywords.slice(0, 2).map((kw) => (
            <span
              key={kw}
              className="text-[9px] px-1.5 py-0.5 rounded-full border opacity-70"
              style={{ borderColor: `${colors.accent}50`, color: colors.accent, background: `${colors.accent}15` }}
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* 下部装飾 */}
      <div className="w-full flex flex-col items-center pb-1">
        <div className="w-3/4 h-px mb-1 opacity-40" style={{ background: `linear-gradient(to right, transparent, ${colors.accent}, transparent)` }} />
        {isReversed && (
          <div
            className="text-[9px] px-2 py-0.5 rounded-full border opacity-80"
            style={{ borderColor: '#f8717150', color: '#f87171', background: '#f8717115' }}
          >
            逆位置
          </div>
        )}
      </div>

      {/* 内枠 */}
      <div
        className="absolute inset-2 rounded-xl pointer-events-none"
        style={{ border: `1px solid ${colors.accent}30` }}
      />
      <div
        className="absolute inset-[6px] rounded-lg pointer-events-none"
        style={{ border: `1px solid ${colors.accent}15` }}
      />
    </div>
  )
}

export default function TarotCardFlip({ card, isReversed, isFlipped, onClick }: Props) {
  const [imgError, setImgError] = useState(false)
  const [burst, setBurst] = useState(false)
  const fileName = `${String(card.id).padStart(2, '0')}_${card.nameEn.replace(/\s/g, '_').replace(/[^a-zA-Z_]/g, '').toLowerCase()}`
  const imgSrc = `/cards/${fileName}.png`

  useEffect(() => {
    if (isFlipped) {
      const t = setTimeout(() => { setBurst(true); setTimeout(() => setBurst(false), 700) }, 800)
      return () => clearTimeout(t)
    }
  }, [isFlipped])

  return (
    <div
      className="relative cursor-pointer"
      style={{ width: 200, height: 340, perspective: 1000 }}
      onClick={onClick}
    >
      {/* フリップ時バーストエフェクト */}
      <AnimatePresence>
        {burst && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none z-20"
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ opacity: 0, scale: 2.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, rgba(168,85,247,0.3) 40%, transparent 70%)' }}
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
          className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-purple-400/60 shadow-[0_0_30px_rgba(168,85,247,0.5)]"
        >
          <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-950 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🌟</div>
              <div className="w-32 h-px mx-auto" style={{ background: 'linear-gradient(to right, transparent, #FFD700, transparent)' }} />
              <p className="text-purple-300/60 text-xs mt-3 tracking-[0.4em]">MYSTIC TAROT</p>
            </div>
            <div className="absolute inset-2 border border-purple-500/30 rounded-xl pointer-events-none" />
            <div className="absolute inset-4 border border-purple-600/20 rounded-lg pointer-events-none" />
          </div>
        </div>

        {/* 表面 */}
        <div
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-yellow-400/60 shadow-[0_0_40px_rgba(234,179,8,0.4)]"
        >
          {!imgError ? (
            <div className="w-full h-full relative">
              <div className={`w-full h-full relative ${isReversed ? 'rotate-180' : ''}`}>
                <Image
                  src={imgSrc}
                  alt={card.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={() => setImgError(true)}
                  priority
                />
              </div>
              {isReversed && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-red-900/80 border border-red-400/50 text-red-300 text-[9px] whitespace-nowrap z-10 backdrop-blur-sm">
                  逆位置
                </div>
              )}
            </div>
          ) : (
            <CardPlaceholder card={card} isReversed={isReversed} />
          )}
        </div>
      </motion.div>
    </div>
  )
}
