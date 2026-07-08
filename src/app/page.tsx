'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false })
const CardGallery = dynamic(() => import('@/components/CardGallery'), { ssr: false })

const FAN_CARDS = [
  { src: '/cards/00_the_fool.png',     name: '愚者',    rotate: -22, x: -90, y: 20,  z: 1 },
  { src: '/cards/03_the_empress.png',  name: '女帝',    rotate: -11, x: -45, y: 8,   z: 2 },
  { src: '/cards/06_the_lovers.png',   name: '恋人',    rotate: 0,   x: 0,   y: 0,   z: 3 },
  { src: '/cards/09_the_hermit.png',   name: '隠者',    rotate: 11,  x: 45,  y: 8,   z: 2 },
  { src: '/cards/11_justice.png',      name: '正義',    rotate: 22,  x: 90,  y: 20,  z: 1 },
]

const features = [
  { icon: '🎴', title: '大アルカナ22枚', desc: '古来より伝わる22枚のタロットカードがあなたの運命を読み解きます' },
  { icon: '✦',  title: 'AI深層解読',    desc: 'Claude AIがあなたの質問とカードを組み合わせパーソナルな鑑定を生成' },
  { icon: '🌙', title: '毎日の導き',    desc: '毎日カードを引いて、日々の気づきと指針を受け取りましょう' },
]

const plans = [
  {
    name: 'Free',
    price: '¥0',
    period: '',
    features: ['1日1回カードを引ける', 'AI鑑定付き', '大アルカナ22枚'],
    cta: '無料で始める',
    href: '/login',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '¥500',
    period: '/月',
    features: ['無制限でカードを引ける', '詳細なAI鑑定', 'スリーカードスプレッド', '鑑定履歴の保存・閲覧'],
    cta: '今すぐ始める',
    href: '/login',
    highlight: true,
  },
]

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(160deg, #060010 0%, #0d0026 50%, #060010 100%)' }}>
      <ParticleBackground />

      {/* ヘッダー */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="font-cinzel text-xl font-bold tracking-[0.2em] shimmer-text">LUNA TAROT</div>
        <Link
          href="/login"
          className="font-cinzel px-5 py-2 rounded-full text-xs tracking-widest border border-purple-500/40 text-purple-200 hover:border-yellow-400/60 hover:text-yellow-200 transition-all duration-300"
        >
          ENTER
        </Link>
      </header>

      {/* ヒーロー */}
      <section className="relative z-10 text-center px-6 pt-10 pb-20">

        {/* ファンカード */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative flex justify-center items-end mb-14"
          style={{ height: 280 }}
        >
          {FAN_CARDS.map((card, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0"
              style={{
                width: 110,
                height: 185,
                rotate: card.rotate,
                x: card.x,
                y: card.y,
                zIndex: card.z,
                transformOrigin: 'bottom center',
              }}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.12 }}
              whileHover={{ y: -18, zIndex: 10, transition: { duration: 0.2 } }}
            >
              <div className="w-full h-full rounded-xl overflow-hidden relative shadow-2xl"
                style={{ border: '1px solid rgba(234,179,8,0.5)', boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(168,85,247,0.2)' }}>
                <Image src={card.src} alt={card.name} fill style={{ objectFit: 'cover' }} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* タイトル */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <p className="font-cinzel text-xs tracking-[0.5em] text-yellow-400/60 mb-4">— AI TAROT ORACLE —</p>
          <h1 className="font-zen text-4xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="shimmer-text">星が語る、</span>
            <br />
            <span className="text-white">あなたの真実</span>
          </h1>
          <p className="font-zen text-purple-200/60 text-base mb-10 max-w-sm mx-auto leading-loose">
            ルナがカードを引き、AIが深層を読み解く<br />神秘のタロット鑑定
          </p>

          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="font-cinzel glow-card px-12 py-4 rounded-full text-sm font-semibold text-white tracking-[0.2em]"
              style={{
                background: 'linear-gradient(135deg, #5b21b6, #4338ca)',
                border: '1px solid rgba(168,85,247,0.6)',
              }}
            >
              DRAW A CARD
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* 区切り線 */}
      <div className="relative z-10 max-w-xs mx-auto h-px mb-16" style={{ background: 'linear-gradient(to right, transparent, rgba(234,179,8,0.4), transparent)' }} />

      {/* 特徴 */}
      <section className="relative z-10 px-6 py-8 max-w-4xl mx-auto">
        <h2 className="text-center font-cinzel text-sm tracking-[0.4em] text-yellow-400/70 mb-10">FEATURES</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="p-6 rounded-2xl text-center gold-border"
              style={{ background: 'linear-gradient(135deg, #0e0020, #0a0018)' }}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-zen text-yellow-300 font-bold mb-2 text-sm tracking-wider">{f.title}</h3>
              <p className="font-zen text-purple-200/50 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 区切り線 */}
      <div className="relative z-10 max-w-xs mx-auto h-px my-16" style={{ background: 'linear-gradient(to right, transparent, rgba(234,179,8,0.4), transparent)' }} />

      {/* 料金 */}
      <section className="relative z-10 px-6 py-8 max-w-3xl mx-auto">
        <h2 className="text-center font-cinzel text-sm tracking-[0.4em] text-yellow-400/70 mb-10">PLANS</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`p-8 rounded-2xl ${plan.highlight ? 'glow-card' : ''}`}
              style={{
                background: plan.highlight
                  ? 'linear-gradient(135deg, #1e0045, #120030)'
                  : 'linear-gradient(135deg, #0e0020, #0a0018)',
                border: plan.highlight
                  ? '1px solid rgba(168,85,247,0.5)'
                  : '1px solid rgba(234,179,8,0.15)',
              }}
            >
              {plan.highlight && (
                <div className="font-cinzel text-[10px] text-yellow-400 font-bold mb-3 tracking-[0.3em]">RECOMMENDED</div>
              )}
              <h3 className="font-cinzel text-white text-xl font-bold mb-1 tracking-widest">{plan.name}</h3>
              <div className="font-zen text-3xl font-bold text-yellow-300 mb-6">
                {plan.price}<span className="text-base text-purple-300">{plan.period}</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="font-zen text-purple-200/70 text-sm flex items-center gap-2">
                    <span className="text-yellow-400 text-xs">✦</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href}>
                <button
                  className="font-cinzel w-full py-3 rounded-full text-xs font-semibold tracking-[0.2em] transition-all hover:scale-105"
                  style={{
                    background: plan.highlight ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'transparent',
                    border: plan.highlight ? 'none' : '1px solid rgba(168,85,247,0.4)',
                    color: 'white',
                  }}
                >
                  {plan.cta.toUpperCase()}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 区切り線 */}
      <div className="relative z-10 max-w-xs mx-auto h-px my-16" style={{ background: 'linear-gradient(to right, transparent, rgba(234,179,8,0.4), transparent)' }} />

      {/* ⑥ カードギャラリー */}
      <CardGallery />

      {/* 占いメニュー */}
      <section className="relative z-10 px-6 py-8 max-w-3xl mx-auto">
        <h2 className="text-center font-cinzel text-sm tracking-[0.4em] text-yellow-400/70 mb-8">MORE FORTUNES</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { href: '/numerology', icon: '🌟', title: '数秘術占い', desc: '生年月日からライフパスナンバーを診断' },
            { href: '/guardian-animal', icon: '🐺', title: '守護動物診断', desc: '生年月日からあなたを守る動物を診断' },
            { href: '/name-fortune', icon: '🌸', title: '名前占い', desc: 'お名前からあなたの運気を診断' },
          ].map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="block rounded-2xl p-5 text-center gold-border transition-all duration-300 hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg, #0e0020, #0a0018)' }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-zen text-yellow-300 font-bold mb-1 text-sm tracking-wider">{f.title}</h3>
              <p className="font-zen text-purple-200/50 text-xs leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* デイリータロットバナー */}
      <section className="relative z-10 px-6 pb-4 max-w-3xl mx-auto">
        <Link
          href="/daily"
          className="block rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(168,85,247,0.3)',
            boxShadow: '0 0 30px rgba(168,85,247,0.1)',
          }}
        >
          <p className="font-cinzel text-purple-300 text-xs tracking-widest mb-2">DAILY TAROT</p>
          <p className="text-white text-lg mb-1">今日のタロット</p>
          <p className="text-purple-300 text-sm">ルナが今日のあなたへメッセージを届けます →</p>
        </Link>
      </section>

      {/* 放置ゲームバナー */}
      <section className="relative z-10 px-6 pb-4 max-w-3xl mx-auto">
        <a
          href="https://tsukiyo-tarot.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(234,179,8,0.3)',
            boxShadow: '0 0 30px rgba(234,179,8,0.08)',
          }}
        >
          <p className="font-cinzel text-yellow-300 text-xs tracking-widest mb-2">LUNA IDLE GAME</p>
          <p className="text-white text-lg mb-1">月夜のタロット放置ゲーム</p>
          <p className="text-purple-300 text-sm">ルナと一緒にカードを集めて育てる放置ゲーム。無料プレイ →</p>
        </a>
      </section>

      {/* カード辞典バナー */}
      <section className="relative z-10 px-6 py-8 max-w-3xl mx-auto">
        <Link
          href="/cards"
          className="block rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(234,179,8,0.3)',
            boxShadow: '0 0 30px rgba(168,85,247,0.1)',
          }}
        >
          <p className="font-cinzel text-yellow-300 text-xs tracking-widest mb-2">TAROT DICTIONARY</p>
          <p className="text-white text-lg mb-1">タロットカード 意味辞典</p>
          <p className="text-purple-300 text-sm">大アルカナ22枚の正位置・逆位置、恋愛・仕事・金運を詳しく解説 →</p>
        </Link>
      </section>

      <footer className="relative z-10 text-center py-10 mt-8">
        <div className="font-cinzel text-xs tracking-[0.4em] text-purple-300/20 mb-3">LUNA TAROT © 2026</div>
        <Link href="/privacy" className="text-purple-500 hover:text-purple-400 text-xs transition-colors">
          プライバシーポリシー
        </Link>
      </footer>
    </div>
  )
}
