import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MAJOR_ARCANA } from '@/lib/cards-data'

export const metadata: Metadata = {
  title: 'タロットカード意味一覧｜大アルカナ22枚の正位置・逆位置解説【Luna Tarot】',
  description: 'タロットカード大アルカナ22枚の意味を一覧で解説。愚者・魔術師・女帝・恋人・塔など各カードの正位置・逆位置、恋愛・仕事・金運・健康への意味を詳しく紹介します。',
  keywords: 'タロット,タロットカード,大アルカナ,意味,正位置,逆位置,恋愛,仕事,金運',
  openGraph: {
    title: 'タロットカード意味一覧｜大アルカナ22枚の解説【Luna Tarot】',
    description: 'タロットカード大アルカナ22枚の意味を一覧で解説。正位置・逆位置、恋愛・仕事・金運・健康への意味を詳しく紹介します。',
    type: 'website',
  },
}

export default function CardsPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #060010 0%, #0d0026 50%, #060010 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* ヘッダー */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6 text-purple-400 hover:text-purple-300 text-sm transition-colors">
            ← Luna Tarot トップへ
          </Link>
          <h1 className="font-cinzel text-3xl md:text-4xl text-white mb-4">
            タロットカード 意味一覧
          </h1>
          <p className="text-purple-200 text-lg mb-2">大アルカナ 22枚</p>
          <p className="text-purple-300 text-sm max-w-2xl mx-auto leading-relaxed">
            タロットカードの大アルカナ22枚を完全解説。各カードの正位置・逆位置の意味、
            恋愛・仕事・金運・健康への影響を詳しくご紹介します。
          </p>
        </div>

        {/* カードグリッド */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {MAJOR_ARCANA.map((card) => (
            <Link
              key={card.id}
              href={`/cards/${card.slug}`}
              className="group block"
            >
              <div
                className="rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
              >
                <div className="relative aspect-[2/3] w-full">
                  <Image
                    src={card.image}
                    alt={`${card.nameJp}（${card.nameEn}）タロットカード`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-2 text-center">
                  <p className="text-yellow-300 text-xs font-medium">
                    {card.id === 0 ? '0' : card.id}. {card.nameJp}
                  </p>
                  <p className="text-purple-400 text-xs mt-0.5">{card.nameEn}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO補足テキスト */}
        <div className="mt-16 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(168,85,247,0.15)' }}>
          <h2 className="font-cinzel text-xl text-white mb-4">大アルカナとは</h2>
          <p className="text-purple-200 text-sm leading-relaxed mb-4">
            タロットカードは全78枚で構成され、そのうち22枚が「大アルカナ（メジャーアルカナ）」と呼ばれます。
            0番の「愚者」から21番の「世界」まで、人生の旅路と魂の成長を象徴する重要なカードです。
          </p>
          <p className="text-purple-200 text-sm leading-relaxed">
            各カードには「正位置」と「逆位置」の2つの意味があります。
            正位置はカードが正しい向きで出た場合、逆位置はカードが逆さまに出た場合の解釈です。
            カードの意味は恋愛・仕事・金運・健康など、人生のさまざまな側面に対して読み解くことができます。
          </p>
        </div>

        {/* CTAバナー */}
        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-block px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              boxShadow: '0 0 30px rgba(168,85,247,0.4)',
              color: 'white',
            }}
          >
            ✦ AIタロット占いを試してみる
          </Link>
        </div>

        {/* 放置ゲームバナー */}
        <div className="mt-6">
          <a
            href="https://tsukiyo-tarot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl p-5 text-center transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, rgba(15,0,40,0.8), rgba(10,0,30,0.9))',
              border: '1px solid rgba(234,179,8,0.35)',
              boxShadow: '0 0 30px rgba(234,179,8,0.08)',
            }}
          >
            <p className="font-cinzel text-yellow-400 text-xs tracking-widest mb-1">LUNA IDLE GAME</p>
            <p className="text-white text-base mb-1">月夜のタロット放置ゲーム</p>
            <p className="text-purple-300 text-xs">ルナと一緒にカードを集めて育てる放置ゲーム。無料プレイ →</p>
          </a>
        </div>
      </div>
    </div>
  )
}
