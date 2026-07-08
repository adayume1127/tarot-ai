'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { LifePathMeaning } from '@/lib/numerology'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false })

type State = 'idle' | 'reading' | 'done'

export default function NumerologyPage() {
  const [authChecked, setAuthChecked] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [birthdate, setBirthdate] = useState('')
  const [state, setState] = useState<State>('idle')
  const [reading, setReading] = useState('')
  const [meaning, setMeaning] = useState<LifePathMeaning | null>(null)
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

  const handleSubmit = async () => {
    if (!birthdate) { setError('生年月日を入力してください'); return }
    setError('')
    setState('reading')
    setReading('')
    setMeaning(null)

    const res = await fetch('/api/numerology', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birthdate }),
    })
    const data = await res.json()
    if (!res.ok) {
      if (data.error === 'FREE_LIMIT') { setError(data.message); setState('done'); return }
      setError(data.error ?? '鑑定に失敗しました。もう一度お試しください。')
      setState('idle')
      return
    }
    setReading(data.reading)
    setMeaning(data.meaning)
    setState('done')
  }

  const handleReset = () => {
    setState('idle')
    setReading('')
    setMeaning(null)
    setError('')
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

      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-cinzel text-sm font-bold tracking-[0.2em] shimmer-text">LUNA TAROT</Link>
        <div className="flex items-center gap-3">
          {!isPremium && (
            <button onClick={handleUpgrade} className="font-cinzel px-3 py-1.5 rounded-full text-xs border border-yellow-400/40 text-yellow-300 hover:bg-yellow-400/10 transition-all tracking-wider">
              ✦ Premium
            </button>
          )}
          {isPremium && (
            <span className="font-cinzel px-3 py-1.5 rounded-full text-xs bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 tracking-wider">✦ Premium</span>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
          <p className="font-cinzel text-xs tracking-[0.4em] text-yellow-400/50 mb-2">— NUMEROLOGY —</p>
          <h1 className="font-zen text-2xl font-bold text-white mb-1">数秘術占い</h1>
          <p className="font-zen text-purple-300/50 text-xs mt-2">生年月日からあなたのライフパスナンバーを読み解きます</p>
        </motion.div>

        {error && state === 'idle' && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl px-4 py-3 mb-4 text-sm font-zen text-red-300"
            style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)' }}>
            {error}
          </motion.div>
        )}

        {(state === 'idle' || state === 'done') && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <label className="font-cinzel text-[10px] tracking-[0.3em] text-purple-300/40 mb-2 block text-center">BIRTHDATE — 生年月日</label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-1 focus:ring-purple-500 font-zen"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.3)' }}
            />
            {state === 'idle' && (
              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full mt-3 py-3 rounded-xl font-cinzel font-bold text-white text-xs tracking-[0.3em]"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  border: '1px solid rgba(168,85,247,0.5)',
                  boxShadow: '0 0 20px rgba(168,85,247,0.3)',
                }}
              >
                🔮 READ MY NUMBER
              </motion.button>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {state === 'reading' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center font-zen text-purple-300/60 text-sm py-10">
              <div className="flex items-center justify-center gap-3">
                <span className="animate-spin text-yellow-400">✦</span>
                <span>数字の声を読み取っています...</span>
                <span className="animate-spin text-yellow-400" style={{ animationDirection: 'reverse' }}>✦</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {state === 'done' && reading && meaning && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }} className="mb-6">
              <div className="flex flex-col items-center mb-5">
                <div className="text-5xl mb-2">{meaning.emoji}</div>
                <div className="font-cinzel text-xs text-yellow-400/60 tracking-widest">LIFE PATH {meaning.number}</div>
                <div className="font-zen text-yellow-300 font-bold text-xl mt-1">{meaning.title}</div>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                {meaning.keywords.map((kw) => (
                  <span key={kw} className="font-zen text-[10px] px-2.5 py-0.5 rounded-full border"
                    style={{ borderColor: 'rgba(234,179,8,0.3)', color: 'rgba(253,224,71,0.8)', background: 'rgba(234,179,8,0.06)' }}>
                    {kw}
                  </span>
                ))}
              </div>

              <div className="relative rounded-2xl p-6 gold-border" style={{ background: 'linear-gradient(135deg, #100020, #0a0018)' }}>
                <p className="font-zen text-purple-100/90 text-sm leading-loose whitespace-pre-line tracking-wide">{reading}</p>
              </div>
            </motion.div>
          )}

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

        {state === 'done' && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            onClick={handleReset}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl font-cinzel font-bold text-white text-xs tracking-[0.25em] mt-2"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.3)' }}>
            🔮 もう一度占う
          </motion.button>
        )}
      </main>
    </div>
  )
}
