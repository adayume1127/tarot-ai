'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false })

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      router.push('/reading')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError('メールアドレスかパスワードが間違っています'); setLoading(false); return }
      router.push('/reading')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #0a0014 0%, #0d0026 100%)' }}>
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link href="/" className="block text-center font-cinzel text-2xl font-bold tracking-[0.2em] shimmer-text mb-8">
          LUNA TAROT
        </Link>

        <div
          className="rounded-2xl p-8 gold-border"
          style={{ background: 'linear-gradient(135deg, #12002a, #0d001e)' }}
        >
          <div className="flex rounded-full overflow-hidden border border-purple-500/30 mb-8">
            {(['signin', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2 text-sm font-medium transition-all"
                style={{
                  background: mode === m ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'transparent',
                  color: mode === m ? 'white' : 'rgba(196,181,253,0.6)',
                }}
              >
                {m === 'signin' ? 'ログイン' : '新規登録'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-purple-200/70 text-sm mb-1">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-1 focus:ring-purple-500"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.3)' }}
              />
            </div>
            <div>
              <label className="block text-purple-200/70 text-sm mb-1">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-1 focus:ring-purple-500"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.3)' }}
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-bold text-white mt-2 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
            >
              {loading ? '処理中...' : mode === 'signin' ? '✨ ログイン' : '✨ 登録して占う'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
