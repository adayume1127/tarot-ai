import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Anthropic from '@anthropic-ai/sdk'
import { MAJOR_ARCANA } from '@/lib/cards-data'

export const revalidate = 86400 // 24時間キャッシュ

function getTodayCard() {
  const now = new Date()
  const jst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))
  const start = new Date(jst.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((jst.getTime() - start.getTime()) / 86400000)
  return MAJOR_ARCANA[dayOfYear % MAJOR_ARCANA.length]
}

function formatDate(date: Date) {
  const jst = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))
  return `${jst.getFullYear()}年${jst.getMonth() + 1}月${jst.getDate()}日`
}

async function getDailyMessage(cardName: string, cardDescription: string): Promise<string> {
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: `あなたはタロット占い師のルナです。今日のカードは「${cardName}」です。
カードの説明: ${cardDescription}

今日1日のメッセージを、以下の構成で書いてください。
・今日のテーマ（1文）
・今日意識してほしいこと（2〜3文）
・今日のキーワード（3つ、箇条書き）

温かく、神秘的な雰囲気で。200文字程度で簡潔に。`,
        },
      ],
    })
    const content = response.content[0]
    return content.type === 'text' ? content.text : ''
  } catch {
    return `${cardName}のエネルギーが今日のあなたを導きます。このカードのメッセージに耳を傾け、直感を大切に過ごしてみてください。`
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const card = getTodayCard()
  const dateStr = formatDate(new Date())
  return {
    title: `今日のタロット ${dateStr}「${card.nameJp}」｜Luna Tarot`,
    description: `${dateStr}の今日のタロットは「${card.nameJp}（${card.nameEn}）」。${card.description.slice(0, 60)}...`,
    keywords: `今日のタロット,デイリータロット,${card.nameJp},タロット占い,${dateStr}`,
    openGraph: {
      title: `今日のタロット ${dateStr}「${card.nameJp}」`,
      description: card.description,
      images: [{ url: card.image }],
    },
  }
}

export default async function DailyPage() {
  const card = getTodayCard()
  const dateStr = formatDate(new Date())
  const message = await getDailyMessage(card.nameJp, card.description)

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #060010 0%, #0d0026 50%, #060010 100%)' }}>
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* ナビ */}
        <nav className="text-sm text-purple-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-purple-300 transition-colors">Luna Tarot</Link>
          <span>›</span>
          <span className="text-purple-200">今日のタロット</span>
        </nav>

        {/* タイトル */}
        <div className="text-center mb-10">
          <p className="text-yellow-400 text-xs tracking-widest mb-2">DAILY TAROT</p>
          <h1 className="font-cinzel text-2xl md:text-3xl text-white mb-1">今日のタロット</h1>
          <p className="text-purple-400 text-sm">{dateStr}</p>
        </div>

        {/* カード */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{
              border: '2px solid rgba(234,179,8,0.4)',
              boxShadow: '0 0 60px rgba(168,85,247,0.4), 0 0 120px rgba(168,85,247,0.1)',
              maxWidth: 200,
            }}
          >
            <Image
              src={card.image}
              alt={`今日のタロット ${card.nameJp}`}
              width={200}
              height={300}
              className="w-full h-auto"
              priority
            />
          </div>
          <h2 className="font-cinzel text-2xl text-white mb-1">{card.nameJp}</h2>
          <p className="text-purple-400 text-sm">{card.nameEn}</p>
        </div>

        {/* AIメッセージ */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)' }}
        >
          <p className="text-yellow-300 text-xs tracking-widest mb-4">✦ 今日のルナからのメッセージ</p>
          <div className="text-purple-100 text-sm leading-relaxed whitespace-pre-line">{message}</div>
        </div>

        {/* カード解説リンク */}
        <div
          className="rounded-2xl p-5 mb-8 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(168,85,247,0.15)' }}
        >
          <p className="text-purple-300 text-sm mb-3">「{card.nameJp}」の詳しい意味を見る</p>
          <Link
            href={`/cards/${card.slug}`}
            className="inline-block px-5 py-2 rounded-full text-xs text-white transition-all duration-300 hover:scale-105"
            style={{ background: 'rgba(168,85,247,0.3)', border: '1px solid rgba(168,85,247,0.5)' }}
          >
            正位置・逆位置・恋愛・仕事の意味を確認 →
          </Link>
        </div>

        {/* CTA */}
        <div className="text-center mb-10">
          <p className="text-purple-300 text-sm mb-3">あなた専用のAI鑑定を受けてみませんか？</p>
          <Link
            href="/login"
            className="inline-block px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              boxShadow: '0 0 20px rgba(168,85,247,0.4)',
              color: 'white',
            }}
          >
            ✦ 無料でAI鑑定を試す
          </Link>
        </div>

        {/* カード一覧リンク */}
        <div className="text-center">
          <Link href="/cards" className="text-purple-500 hover:text-purple-400 text-xs transition-colors">
            タロットカード意味一覧を見る →
          </Link>
        </div>

      </div>
    </div>
  )
}
