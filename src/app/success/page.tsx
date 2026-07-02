'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false })

export default function SuccessPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #0a0014 0%, #0d0026 100%)' }}>
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-sm"
      >
        <div className="float-animation text-7xl mb-6">⭐</div>
        <h1 className="text-2xl font-bold text-white mb-3">
          <span className="shimmer-text">プレミアム登録完了！</span>
        </h1>
        <p className="text-purple-200/70 text-sm mb-8 leading-relaxed">
          星の扉が開かれました。<br />
          無制限でタロット占いをお楽しみください。
        </p>
        <Link href="/reading">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="glow-card px-8 py-3 rounded-full font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
          >
            ✨ 占いを始める
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}
