import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single()

  if (!profile?.is_premium) {
    return NextResponse.json(
      { error: 'PREMIUM_ONLY', message: 'スリーカードスプレッドはプレミアム限定機能です。' },
      { status: 403 }
    )
  }

  const { question, theme, cards } = await req.json()
  const positions = ['過去', '現在', '未来']

  const cardLines = cards.map((c: { cardName: string; cardNameEn: string; isReversed: boolean; keywords: string[] }, i: number) =>
    `【${positions[i]}】${c.cardName}（${c.cardNameEn}）${c.isReversed ? '逆位置' : '正位置'} ／ キーワード: ${c.keywords.join('・')}`
  ).join('\n')

  const themeContext = theme ? `テーマ: ${theme}に関する深層鑑定\n` : ''
  const questionContext = question ? `相談内容: ${question}\n` : ''

  const prompt = `あなたはプロのタロット占い師です。3枚のタロットカードによるスプレッド鑑定を、神秘的で詩的な日本語でお伝えください。

${cardLines}
${themeContext}${questionContext}
以下の構成で450〜550文字で答えてください：

【過去】このカードが示す、あなたの来た道と根底にあるエネルギー（80〜100文字）
【現在】今この瞬間のテーマと向き合うべきこと（80〜100文字）
【未来】カードが示す、これから開いていく可能性（80〜100文字）
【総括】${theme ? `【${theme}】の視点から` : ''}3枚のカードを通じた魂へのメッセージ（150〜200文字）

各セクションは改行で区切り、温かみのある言葉で希望が持てるように伝えてください。`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 900,
    messages: [{ role: 'user', content: prompt }],
  })

  const reading = (message.content[0] as { type: string; text: string }).text

  return NextResponse.json({ reading })
}
