'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { drawCard, TarotCard } from '@/lib/tarot'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false })
const TarotCardFlip = dynamic(() => import('@/components/TarotCardFlip'), { ssr: false })
const SpreadCardFlip = dynamic(() => import('@/components/SpreadCardFlip'), { ssr: false })

type Mode = 'single' | 'spread'
type State = 'idle' | 'shuffling' | 'drawn' | 'reading' | 'done'
type DrawnCard = { card: TarotCard; isReversed: boolean }

const SPREAD_POSITIONS = [
  { label: '過去', en: 'PAST' as const },
  { label: '現在', en: 'PRESENT' as const },
  { label: '未来', en: 'FUTURE' as const },
]

const THEMES = [
  { label: '仕事', icon: '💼' },
  { label: '恋愛', icon: '💕' },
  { label: 'お金', icon: '💰' },
  { label: '健康', icon: '🌿' },
  { label: '全般', icon: '🌟' },
]

export default function ReadingPage() {
  const [authChecked, setAuthChecked] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [mode, setMode] = useState<Mode>('single')
  const [state, setState] = useState<State>('idle')
  const [theme, setTheme] = useState<string | null>(null)
  const [question, setQuestion] = useState('')
  const [drawnCard, setDrawnCard] = useState<DrawnCard | null>(null)
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([])
  const [isFlipped, setIsFlipped] = useState(false)
  const [flippedCards, setFlippedCards] = useState([false, false, false])
  const [reading, setReading] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      supabase.from('profiles').select('is_premium').eq('id', user.id).single()
        .then(({ data }) => { setIsPremium(data?.is_premium ?? false) })
      setAuthChecked(true)
    })
  }, [])

  const saveReading = async (readingText: string, cards: DrawnCard[], currentMode: Mode) => {
    await fetch('/api/readings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: currentMode,
        cards: cards.map((d) => ({ id: d.card.id, name: d.card.name, nameEn: d.card.nameEn, isReversed: d.isReversed })),
        question: question || null,
        theme: theme || null,
        reading: readingText,
      }),
    })
  }

  const handleDrawSingle = async () => {
    setState('shuffling')
    setIsFlipped(false)
    setDrawnCard(null)
    setReading('')
    setError('')

    await new Promise((r) => setTimeout(r, 1500))
    const drawn = drawCard()
    setDrawnCard(drawn)
    setState('drawn')

    await new Promise((r) => setTimeout(r, 800))
    setIsFlipped(true)
    await new Promise((r) => setTimeout(r, 1000))
    setState('reading')

    const res = await fetch('/api/reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        theme,
        cardName: drawn.card.name,
        cardNameEn: drawn.card.nameEn,
        isReversed: drawn.isReversed,
        keywords: drawn.isReversed ? drawn.card.reversedKeywords : drawn.card.uprightKeywords,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      if (data.error === 'FREE_LIMIT') { setError(data.message); setState('done'); return }
      setError('占いの読み取りに失敗しました。もう一度お試しください。')
      setState('idle')
      return
    }
    setReading(data.reading)
    setState('done')
    saveReading(data.reading, [drawn], 'single')
  }

  const handleDrawSpread = async () => {
    setState('shuffling')
    setFlippedCards([false, false, false])
    setDrawnCards([])
    setReading('')
    setError('')

    await new Promise((r) => setTimeout(r, 1500))

    const ids = new Set<number>()
    const cards: DrawnCard[] = []
    while (cards.length < 3) {
      const d = drawCard()
      if (!ids.has(d.card.id)) { ids.add(d.card.id); cards.push(d) }
    }
    setDrawnCards(cards)
    setState('drawn')

    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, i === 0 ? 600 : 700))
      setFlippedCards((prev) => { const next = [...prev]; next[i] = true; return next })
    }

    await new Promise((r) => setTimeout(r, 800))
    setState('reading')

    const res = await fetch('/api/reading/spread', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        theme,
        cards: cards.map((d) => ({
          cardName: d.card.name,
          cardNameEn: d.card.nameEn,
          isReversed: d.isReversed,
          keywords: d.isReversed ? d.card.reversedKeywords : d.card.uprightKeywords,
        })),
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      if (data.error === 'PREMIUM_ONLY') { setError(data.message); setState('done'); return }
      setError('占いの読み取りに失敗しました。もう一度お試しください。')
      setState('idle')
      return
    }
    setReading(data.reading)
    setState('done')
    saveReading(data.reading, cards, 'spread')
  }

  const handleReset = () => {
    setState('idle')
    setReading('')
    setError('')
    setDrawnCard(null)
    setDrawnCards([])
    setIsFlipped(false)
    setFlippedCards([false, false, false])
  }

  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/stripe/create-checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setError(data.error ?? '決済ページを開けませんでした')
    } catch {
      setError('決済ページを開けませんでした。もう一度お試しください。')
    }
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0014' }}>
        <div className="font-zen text-purple-300/60 text-sm">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0014 0%, #0d0026 100%)' }}>
      <ParticleBackground />

      {/* ヘッダー */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-cinzel text-sm font-bold tracking-[0.2em] shimmer-text">LUNA TAROT</Link>
        <div className="flex items-center gap-3">
          <Link href="/history" className="font-cinzel text-[10px] text-purple-300/40 hover:text-purple-200 transition-all tracking-wider">
            履歴
          </Link>
          {!isPremium && (
            <button onClick={handleUpgrade} className="font-cinzel px-3 py-1.5 rounded-full text-xs border border-yellow-400/40 text-yellow-300 hover:bg-yellow-400/10 transition-all tracking-wider">
              ✦ Premium
            </button>
          )}
          {isPremium && (
            <span className="font-cinzel px-3 py-1.5 rounded-full text-xs bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 tracking-wider">✦ Premium</span>
          )}
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="text-purple-300/50 text-xs hover:text-purple-200 transition-all">ログアウト</button>
        </div>
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-6 py-6">

        {/* タイトル */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
          <p className="font-cinzel text-xs tracking-[0.4em] text-yellow-400/50 mb-2">— ORACLE —</p>
          <h1 className="font-zen text-2xl font-bold text-white mb-1">今日のタロット</h1>
        </motion.div>

        {/* グローバルエラー（idle時） */}
        {error && state === 'idle' && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl px-4 py-3 mb-4 text-sm font-zen text-red-300"
            style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)' }}>
            {error}
          </motion.div>
        )}

        {/* モード切替 */}
        {state === 'idle' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex rounded-2xl overflow-hidden mb-5"
            style={{ border: '1px solid rgba(168,85,247,0.3)', background: 'rgba(255,255,255,0.03)' }}>
            <button
              onClick={() => setMode('single')}
              className="flex-1 py-2.5 text-xs font-cinzel tracking-wider transition-all"
              style={{
                background: mode === 'single' ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'transparent',
                color: mode === 'single' ? 'white' : 'rgba(196,181,253,0.5)',
              }}
            >
              🔮 ワンオラクル
            </button>
            <button
              onClick={() => isPremium ? setMode('spread') : handleUpgrade()}
              className="flex-1 py-2.5 text-xs font-cinzel tracking-wider transition-all relative"
              style={{
                background: mode === 'spread' ? 'linear-gradient(135deg, #92400e, #78350f)' : 'transparent',
                color: mode === 'spread' ? '#fde047' : 'rgba(253,224,71,0.45)',
              }}
            >
              ✦ スリーカード
              {!isPremium && (
                <span className="ml-1.5 text-[9px] bg-yellow-400/20 px-1.5 py-0.5 rounded-full border border-yellow-400/30">Premium</span>
              )}
            </button>
          </motion.div>
        )}

        {/* ③ テーマ選択 */}
        {state === 'idle' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-5">
            <p className="font-cinzel text-[10px] tracking-[0.3em] text-purple-300/40 mb-2.5 text-center">THEME — テーマを選ぶ（任意）</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {THEMES.map((t) => (
                <button
                  key={t.label}
                  onClick={() => setTheme(theme === t.label ? null : t.label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-zen transition-all"
                  style={{
                    background: theme === t.label ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.04)',
                    border: theme === t.label ? '1px solid rgba(168,85,247,0.6)' : '1px solid rgba(168,85,247,0.2)',
                    color: theme === t.label ? 'rgba(216,180,254,1)' : 'rgba(196,181,253,0.5)',
                  }}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 質問入力 */}
        {(state === 'idle' || state === 'done') && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={theme ? `${theme}について詳しく書くと精度が上がります（任意）` : '悩みや聞きたいことを入力（任意）\n例：仕事の転職はうまくいく？'}
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-1 focus:ring-purple-500 resize-none font-zen"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.3)' }}
            />
            {state === 'idle' && (
              <motion.button
                onClick={mode === 'single' ? handleDrawSingle : handleDrawSpread}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full mt-3 py-3 rounded-xl font-cinzel font-bold text-white text-xs tracking-[0.3em]"
                style={{
                  background: mode === 'spread'
                    ? 'linear-gradient(135deg, #92400e, #b45309)'
                    : theme
                    ? 'linear-gradient(135deg, #1e3a5f, #2563eb)'
                    : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  border: `1px solid ${mode === 'spread' ? 'rgba(253,224,71,0.4)' : theme ? 'rgba(96,165,250,0.5)' : 'rgba(168,85,247,0.5)'}`,
                  boxShadow: `0 0 20px ${mode === 'spread' ? 'rgba(253,224,71,0.2)' : theme ? 'rgba(59,130,246,0.25)' : 'rgba(168,85,247,0.3)'}`,
                }}
              >
                {theme
                  ? `${THEMES.find((t) => t.label === theme)?.icon} ${theme}の深層鑑定`
                  : mode === 'single' ? '🔮 DRAW A CARD' : '✦ DRAW THREE CARDS'}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ─── シングルモード ─── */}
        {mode === 'single' && (
          <div className="flex justify-center mb-8">
            {state === 'idle' && (
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                onClick={handleDrawSingle}
                className="w-48 h-80 rounded-2xl flex flex-col items-center justify-center cursor-pointer gold-border hover:scale-105 transition-all"
                style={{ background: 'linear-gradient(135deg, #12002a, #0d001e)' }}
              >
                <div className="text-5xl mb-3">{theme ? THEMES.find((t) => t.label === theme)?.icon ?? '🌟' : '🌟'}</div>
                <p className="font-cinzel text-yellow-300/60 text-xs tracking-widest">TAP TO DRAW</p>
              </motion.div>
            )}
            {state === 'shuffling' && (
              <motion.div
                animate={{ rotate: [0, 5, -5, 5, -3, 0], scale: [1, 1.05, 0.98, 1.03, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-48 h-80 rounded-2xl flex flex-col items-center justify-center gold-border"
                style={{ background: 'linear-gradient(135deg, #12002a, #0d001e)' }}
              >
                <div className="text-5xl mb-3">✨</div>
                <p className="font-zen text-purple-300/60 text-sm">シャッフル中...</p>
              </motion.div>
            )}
            {(state === 'drawn' || state === 'reading' || state === 'done') && drawnCard && (
              <TarotCardFlip card={drawnCard.card} isReversed={drawnCard.isReversed} isFlipped={isFlipped} />
            )}
          </div>
        )}

        {/* ─── スプレッドモード ─── */}
        {mode === 'spread' && (
          <div className="mb-8">
            {state === 'idle' && (
              <motion.div className="flex justify-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {SPREAD_POSITIONS.map((pos, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="text-center">
                      <div className="font-cinzel text-[9px] tracking-[0.3em] text-yellow-400/40">{pos.en}</div>
                      <div className="font-zen text-xs text-yellow-300/50">{pos.label}</div>
                    </div>
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity }}
                      className="w-24 h-40 rounded-xl flex flex-col items-center justify-center cursor-pointer"
                      style={{ background: 'linear-gradient(135deg, #12002a, #0d001e)', border: '1px solid rgba(253,224,71,0.25)' }}
                      onClick={handleDrawSpread}
                    >
                      <div className="text-2xl">✦</div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            )}
            {state === 'shuffling' && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="text-center py-16 font-zen text-purple-300/60"
              >
                ✨ カードをシャッフル中...
              </motion.div>
            )}
            {(state === 'drawn' || state === 'reading' || state === 'done') && drawnCards.length === 3 && (
              <div className="flex justify-center gap-3">
                {drawnCards.map((dc, i) => (
                  <SpreadCardFlip
                    key={i}
                    card={dc.card}
                    isReversed={dc.isReversed}
                    isFlipped={flippedCards[i]}
                    position={SPREAD_POSITIONS[i].label as '過去' | '現在' | '未来'}
                    positionEn={SPREAD_POSITIONS[i].en}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 読み取り中 */}
        <AnimatePresence>
          {state === 'reading' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center font-zen text-purple-300/60 text-sm">
              <div className="flex items-center justify-center gap-3">
                <span className="animate-spin text-yellow-400">✦</span>
                <span>星の声を読み取っています...</span>
                <span className="animate-spin text-yellow-400" style={{ animationDirection: 'reverse' }}>✦</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 鑑定結果 */}
        <AnimatePresence>
          {state === 'done' && reading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="mb-6"
            >
              {/* ヘッダー */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(234,179,8,0.4))' }} />
                <div className="text-center">
                  <div className="font-cinzel text-xs text-yellow-400/60 tracking-widest">
                    {theme ? `✦ ${theme.toUpperCase()} READING ✦` : mode === 'spread' ? '✦ THREE CARD SPREAD ✦' : '✦ ORACLE MESSAGE ✦'}
                  </div>
                  {mode === 'single' && drawnCard && (
                    <div className="font-zen text-yellow-300 font-bold text-base mt-0.5">{drawnCard.card.name}</div>
                  )}
                </div>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(234,179,8,0.4))' }} />
              </div>

              {/* シングルモード：キーワード */}
              {mode === 'single' && drawnCard && (
                <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                  {(drawnCard.isReversed ? drawnCard.card.reversedKeywords : drawnCard.card.uprightKeywords).map((kw) => (
                    <span key={kw} className="font-zen text-[10px] px-2.5 py-0.5 rounded-full border"
                      style={{ borderColor: 'rgba(234,179,8,0.3)', color: 'rgba(253,224,71,0.8)', background: 'rgba(234,179,8,0.06)' }}>
                      {kw}
                    </span>
                  ))}
                </div>
              )}

              {/* 鑑定文ボックス */}
              <div className="relative rounded-2xl p-6 gold-border" style={{ background: 'linear-gradient(135deg, #100020, #0a0018)' }}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-3">
                  <span className="text-yellow-400/60 text-xs">✦</span>
                  <span className="text-yellow-300/80 text-sm">★</span>
                  <span className="text-yellow-400/60 text-xs">✦</span>
                </div>
                <div className="font-cinzel text-5xl leading-none mb-2 -mt-1" style={{ color: 'rgba(168,85,247,0.22)', fontStyle: 'italic' }}>❝</div>
                <p className="font-zen text-purple-100/90 text-sm leading-loose whitespace-pre-line tracking-wide">{reading}</p>
                <div className="font-cinzel text-5xl leading-none mt-2 text-right" style={{ color: 'rgba(168,85,247,0.22)', fontStyle: 'italic' }}>❞</div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-3">
                  <span className="text-yellow-400/60 text-xs">✦</span>
                  <span className="text-yellow-300/80 text-sm">★</span>
                  <span className="text-yellow-400/60 text-xs">✦</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* エラー */}
          {state === 'done' && error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-6 mb-6"
              style={{ background: 'linear-gradient(135deg, #2d0060, #1a0035)', border: '1px solid rgba(168,85,247,0.5)' }}>
              <p className="font-zen text-purple-200 text-sm mb-4">{error}</p>
              <button onClick={handleUpgrade}
                className="w-full py-2.5 rounded-xl font-cinzel font-bold text-white text-xs tracking-[0.2em]"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                ✦ PREMIUM — ¥500/月
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* もう一度 */}
        {state === 'done' && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            onClick={handleReset}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl font-cinzel font-bold text-white text-xs tracking-[0.25em] mt-2"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.3)' }}>
            🔮 DRAW AGAIN
          </motion.button>
        )}
      </main>
    </div>
  )
}
