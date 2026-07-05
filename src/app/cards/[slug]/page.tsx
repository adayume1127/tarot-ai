import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MAJOR_ARCANA, getCardBySlug } from '@/lib/cards-data'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return MAJOR_ARCANA.map((card) => ({ slug: card.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const card = getCardBySlug(slug)
  if (!card) return {}
  return {
    title: `${card.nameJp}（${card.nameEn}）タロット意味｜正位置・逆位置・恋愛・仕事・金運【Luna Tarot】`,
    description: `タロットカード「${card.nameJp}」の意味を詳しく解説。正位置は「${card.upright.summary.slice(0, 30)}」。逆位置・恋愛・仕事・金運・健康への影響も紹介。`,
    keywords: `${card.nameJp},${card.nameEn},タロット,意味,正位置,逆位置,${card.keywords.join(',')}`,
    openGraph: {
      title: `${card.nameJp}タロットの意味｜正位置・逆位置解説`,
      description: card.description,
      images: [{ url: card.image, width: 400, height: 600, alt: card.nameJp }],
      type: 'article',
    },
  }
}

const CONTEXTS = [
  { key: 'love' as const, label: '恋愛', icon: '❤️' },
  { key: 'work' as const, label: '仕事', icon: '💼' },
  { key: 'money' as const, label: '金運', icon: '💰' },
  { key: 'health' as const, label: '健康', icon: '🌿' },
]

export default async function CardPage({ params }: Props) {
  const { slug } = await params
  const card = getCardBySlug(slug)
  if (!card) notFound()

  const currentIndex = MAJOR_ARCANA.findIndex((c) => c.slug === slug)
  const prevCard = currentIndex > 0 ? MAJOR_ARCANA[currentIndex - 1] : null
  const nextCard = currentIndex < MAJOR_ARCANA.length - 1 ? MAJOR_ARCANA[currentIndex + 1] : null

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #060010 0%, #0d0026 50%, #060010 100%)' }}>
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* パンくず */}
        <nav className="text-sm text-purple-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-purple-300 transition-colors">Luna Tarot</Link>
          <span>›</span>
          <Link href="/cards" className="hover:text-purple-300 transition-colors">カード一覧</Link>
          <span>›</span>
          <span className="text-purple-200">{card.nameJp}</span>
        </nav>

        {/* メインコンテンツ */}
        <div className="grid md:grid-cols-[280px_1fr] gap-8 mb-12">

          {/* カード画像 */}
          <div className="flex flex-col items-center">
            <div
              className="rounded-2xl overflow-hidden mb-4"
              style={{
                border: '2px solid rgba(234,179,8,0.4)',
                boxShadow: '0 0 40px rgba(168,85,247,0.3), 0 0 80px rgba(168,85,247,0.1)',
                maxWidth: 240,
              }}
            >
              <Image
                src={card.image}
                alt={`${card.nameJp}（${card.nameEn}）タロットカード`}
                width={240}
                height={360}
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="text-center">
              <p className="text-yellow-300 text-xs mb-1">
                大アルカナ {card.id === 0 ? 'No.0' : `No.${card.id}`}
              </p>
              <div className="flex flex-wrap gap-1 justify-center">
                {card.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs px-2 py-0.5 rounded-full text-purple-200"
                    style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* タイトルと説明 */}
          <div>
            <h1 className="font-cinzel text-3xl md:text-4xl text-white mb-1">{card.nameJp}</h1>
            <p className="text-purple-400 text-lg mb-4">{card.nameEn}</p>
            <p className="text-purple-100 leading-relaxed text-sm md:text-base">{card.description}</p>
          </div>
        </div>

        {/* 正位置 */}
        <section className="mb-8">
          <div
            className="rounded-2xl p-6"
            style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)' }}
          >
            <h2 className="font-cinzel text-xl text-yellow-300 mb-4 flex items-center gap-2">
              ▲ 正位置の意味
            </h2>
            <p className="text-purple-100 text-sm leading-relaxed mb-6">{card.upright.summary}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {CONTEXTS.map(({ key, label, icon }) => (
                <div
                  key={key}
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(168,85,247,0.15)' }}
                >
                  <p className="text-yellow-300 text-sm font-medium mb-2">{icon} {label}</p>
                  <p className="text-purple-200 text-xs leading-relaxed">{card.upright[key]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 逆位置 */}
        <section className="mb-12">
          <div
            className="rounded-2xl p-6"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <h2 className="font-cinzel text-xl text-red-300 mb-4 flex items-center gap-2">
              ▼ 逆位置の意味
            </h2>
            <p className="text-purple-100 text-sm leading-relaxed mb-6">{card.reversed.summary}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {CONTEXTS.map(({ key, label, icon }) => (
                <div
                  key={key}
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}
                >
                  <p className="text-red-300 text-sm font-medium mb-2">{icon} {label}</p>
                  <p className="text-purple-200 text-xs leading-relaxed">{card.reversed[key]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div
          className="rounded-2xl p-6 text-center mb-10"
          style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(168,85,247,0.3)' }}
        >
          <p className="text-white text-sm mb-4">
            {card.nameJp}のカードが気になる方へ — AIが詳しくリーディングします
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              boxShadow: '0 0 20px rgba(168,85,247,0.4)',
              color: 'white',
            }}
          >
            ✦ 無料でAIタロット占いを試す
          </Link>
        </div>

        {/* 前後カードナビ */}
        <nav className="flex justify-between items-center">
          {prevCard ? (
            <Link
              href={`/cards/${prevCard.slug}`}
              className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors text-sm"
            >
              <span>←</span>
              <span>{prevCard.nameJp}</span>
            </Link>
          ) : <span />}

          <Link href="/cards" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
            一覧へ
          </Link>

          {nextCard ? (
            <Link
              href={`/cards/${nextCard.slug}`}
              className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors text-sm"
            >
              <span>{nextCard.nameJp}</span>
              <span>→</span>
            </Link>
          ) : <span />}
        </nav>

      </div>
    </div>
  )
}
