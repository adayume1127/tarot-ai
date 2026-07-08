import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { calculateNameNumber, NAME_FORTUNE_MEANINGS } from '@/lib/name-fortune'

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

  const { name } = await req.json()
  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: '名前を入力してください' }, { status: 400 })
  }
  if (name.length > 30) {
    return NextResponse.json({ error: '名前は30文字以内で入力してください' }, { status: 400 })
  }

  const nameNumber = calculateNameNumber(name)
  const meaning = NAME_FORTUNE_MEANINGS[nameNumber]

  const prompt = `あなたはルナという名のプロの姓名占い師です。神秘的で温かみのある日本語で鑑定してください。

名前: ${name}
名前の数: ${nameNumber}（${meaning.title}）
キーワード: ${meaning.keywords.join('、')}
基本の意味: ${meaning.description}

以下の構成で250〜350文字程度で答えてください：
1. この名前が持つ運気・第一印象・対人関係の傾向
2. 恋愛や仕事の場面で活かせる強み
3. 締めくくりの前向きなメッセージ

神秘的で優しい言葉で、読んだ人が自分の名前に誇りを持てるように伝えてください。`

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

  return NextResponse.json({ reading, nameNumber, meaning })
}
