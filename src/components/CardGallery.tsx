'use client'

import Image from 'next/image'
import { useState } from 'react'
import { TAROT_CARDS } from '@/lib/tarot'

const ACCENT: Record<number, string> = {
  0: '#c084fc', 1: '#60a5fa', 2: '#818cf8', 3: '#fbbf24', 4: '#f87171',
  5: '#86efac', 6: '#f0abfc', 7: '#a5b4fc', 8: '#fb923c', 9: '#9ca3af',
  10: '#4ade80', 11: '#e2e8f0', 12: '#facc15', 13: '#dc2626', 14: '#34d399',
  15: '#a855f7', 16: '#f97316', 17: '#38bdf8', 18: '#6366f1', 19: '#fde047',
  20: '#2dd4bf', 21: '#eab308',
}

function MiniCard({ card }: { card: typeof TAROT_CARDS[0] }) {
  const [imgError, setImgError] = useState(false)
  const fileName = `${String(card.id).padStart(2, '0')}_${card.nameEn.replace(/\s/g, '_').replace(/[^a-zA-Z_]/g, '').toLowerCase()}`
  const accent = ACCENT[card.id] ?? '#c084fc'

  return (
    <div className="relative group" style={{ paddingBottom: '160%' }}>
      <div
        className="absolute inset-0 rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:z-10"
        style={{ border: `1px solid ${accent}50`, boxShadow: `0 4px 12px rgba(0,0,0,0.5)` }}
      >
        {!imgError ? (
          <Image
            src={`/cards/${fileName}.png`}
            alt={card.name}
            fill
            sizes="100px"
            style={{ objectFit: 'cover' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-1"
            style={{ background: `linear-gradient(160deg, #0d0020, #160030)` }}
          >
            <div className="text-base">{card.emoji}</div>
            <div className="text-[7px] font-zen text-center px-0.5 leading-tight" style={{ color: accent }}>
              {card.name}
            </div>
          </div>
        )}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-1 px-0.5"
          style={{ background: `linear-gradient(to top, ${accent}cc 0%, transparent 60%)` }}
        >
          <span className="text-white text-[7px] font-cinzel tracking-wide text-center leading-tight">
            {card.nameEn.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function CardGallery() {
  return (
    <section className="relative z-10 px-4 py-12 max-w-4xl mx-auto w-full">
      <div className="text-center mb-8">
        <p className="font-cinzel text-xs tracking-[0.5em] text-yellow-400/60 mb-2">LUNA&apos;S CARDS</p>
        <h2 className="font-zen text-xl font-bold text-white mb-1">大アルカナ 22枚</h2>
        <p className="font-zen text-purple-200/40 text-xs">ルナが描く神秘のタロット</p>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-11 gap-2">
        {TAROT_CARDS.map((card) => (
          <MiniCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  )
}
