'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false })

type CardEntry = { id: number; name: string; nameEn: string; isReversed: boolean }
type Reading = {
  id: string
  mode: 'single' | 'spread'
  cards: CardEntry[]
  question: string | null
  theme: string | null
  reading: string
  created_at: string
}

const THEME_ICONS: Record<string, string> = {
  仕事: '💼', 恋愛: '💕', お金: '💰', 健康: '🌿', 全般: '🌟',
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function HistoryPage() {
  const [readings, setReadings] = useState<Reading[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/readings')
      .then((r) => r.json())
      .then((d) => {
        if (d.error === 'unauthorized') { router.push('/login'); return }
        setReadings(d.readings ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="relative min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0014 0%, #0d0026 100%)' }}>
      <ParticleBackground />

      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-cinzel text-sm font-bold tracking-[0.2em] shimmer-text">LUNA TAROT</Link>
        <Link href="/reading" className="font-cinzel text-xs text-purple-300/60 hover:text-purple-200 transition-all tracking-wider">
          ← 占いに戻る
        </Link>
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-6 py-4 pb-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
          <p className="font-cinzel text-xs tracking-[0.4em] text-yellow-400/50 mb-2">— HISTORY —</p>
          <h1 className="font-zen text-2xl font-bold text-white">鑑定履歴</h1>
        </motion.div>

        {loading && (
          <div className="text-center font-zen text-purple-300/50 text-sm py-16">読み込み中...</div>
        )}

        {!loading && readings.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🌙</div>
            <p className="font-zen text-purple-300/50 text-sm">まだ鑑定履歴がありません</p>
            <Link href="/reading">
              <button className="mt-6 font-cinzel text-xs px-6 py-2.5 rounded-full border border-purple-400/40 text-purple-200 hover:bg-purple-400/10 transition-all tracking-wider">
                占いを始める
              </button>
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {readings.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #100020, #0a0018)', border: '1px solid rgba(168,85,247,0.2)' }}
            >
              {/* ヘッダー行 */}
              <button
                className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-white/5 transition-all"
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
              >
                <div className="text-xl flex-shrink-0">
                  {r.theme ? (THEME_ICONS[r.theme] ?? '🌟') : (r.mode === 'spread' ? '✦' : '🔮')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-zen text-xs text-white/90 truncate">
                      {r.cards.map((c) => `${c.name}${c.isReversed ? '（逆）' : ''}`).join(' · ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.theme && (
                      <span className="font-zen text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(234,179,8,0.12)', color: 'rgba(253,224,71,0.7)', border: '1px solid rgba(234,179,8,0.2)' }}>
                        {r.theme}
                      </span>
                    )}
                    {r.mode === 'spread' && (
                      <span className="font-cinzel text-[9px] text-yellow-400/50 tracking-wider">3CARDS</span>
                    )}
                    {r.question && (
                      <span className="font-zen text-[10px] text-purple-300/40 truncate">{r.question}</span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="font-zen text-[10px] text-purple-300/40">{formatDate(r.created_at)}</div>
                  <div className="text-purple-400/40 text-xs mt-1">{expanded === r.id ? '▲' : '▼'}</div>
                </div>
              </button>

              {/* 展開：鑑定文 */}
              <AnimatePresence>
                {expanded === r.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-purple-500/10">
                      <div className="relative rounded-xl p-4 mt-3"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(234,179,8,0.1)' }}>
                        <div className="font-cinzel text-3xl leading-none mb-1"
                          style={{ color: 'rgba(168,85,247,0.2)', fontStyle: 'italic' }}>❝</div>
                        <p className="font-zen text-purple-100/80 text-xs leading-loose whitespace-pre-line">{r.reading}</p>
                        <div className="font-cinzel text-3xl leading-none mt-1 text-right"
                          style={{ color: 'rgba(168,85,247,0.2)', fontStyle: 'italic' }}>❞</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
