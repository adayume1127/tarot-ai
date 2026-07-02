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
    .select('is_premium, free_readings_today, last_reading_date')
    .eq('id', user.id)
    .single()

  const today = new Date().toISOString().split('T')[0]
  const isSameDay = profile?.last_reading_date === today

  if (!profile?.is_premium) {
    const todayCount = isSameDay ? (profile?.free_readings_today ?? 0) : 0
    if (todayCount >= 1) {
      return NextResponse.json(
        { error: 'FREE_LIMIT', message: '無料プランは1日1回まで。プレミアムに登録すると無制限で楽しめます。' },
        { status: 403 }
      )
    }
  }

  const { question, theme, cardName, cardNameEn, isReversed, keywords } = await req.json()

  const position = isReversed ? '逆位置' : '正位置'
  const themeContext = theme ? `テーマ: ${theme}に関する深層鑑定\n` : ''
  const questionContext = question ? `相談内容: ${question}\n` : ''

  const prompt = `あなたはプロのタロット占い師です。神秘的で詩的な日本語で占いの結果を伝えてください。

引いたカード: ${cardName}（${cardNameEn}）- ${position}
キーワード: ${keywords.join('、')}
${themeContext}${questionContext}
以下の構成で${theme ? '300〜380' : '200〜300'}文字程度で答えてください：
1. カードのメッセージ（このカードが伝えること）
2. ${theme ? `【${theme}】への具体的なアドバイス` : 'あなたへのアドバイス'}
3. 締めくくりの言葉（前向きに）

神秘的で温かみのある言葉で、読んだ人が希望を持てるように伝えてください。`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  })

  const reading = (message.content[0] as { type: string; text: string }).text

  const newCount = isSameDay ? (profile?.free_readings_today ?? 0) + 1 : 1
  await supabase.from('profiles').upsert({
    id: user.id,
    free_readings_today: newCount,
    last_reading_date: today,
  })

  return NextResponse.json({ reading })
}
