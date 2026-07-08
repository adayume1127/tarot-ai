export type NameNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type NameFortuneMeaning = {
  number: NameNumber
  title: string
  emoji: string
  keywords: string[]
  description: string
}

export const NAME_FORTUNE_MEANINGS: Record<NameNumber, NameFortuneMeaning> = {
  1: { number: 1, title: '先導の名', emoji: '🔥', keywords: ['第一印象が強い', '主導権', '存在感'], description: 'その名を聞いた人の記憶に強く残るタイプ。人の輪の中で自然と前に立つ運命を持つ名前。' },
  2: { number: 2, title: '寄り添いの名', emoji: '🤍', keywords: ['信頼されやすい', '協調', '聞き上手'], description: '周囲から親しみを持たれやすい名前。誰かの隣に寄り添うことで力を発揮するタイプ。' },
  3: { number: 3, title: '華やぎの名', emoji: '🌸', keywords: ['社交運', '明るい印象', '人気運'], description: '場を明るくする華やかな運気を持つ名前。人が自然と集まってくる人気運がある。' },
  4: { number: 4, title: '信頼の名', emoji: '🪨', keywords: ['堅実', '誠実さが伝わる', '長続きする縁'], description: '誠実で堅実な印象を与える名前。一度結んだ縁が長く続きやすい運気を持つ。' },
  5: { number: 5, title: '変化の名', emoji: '🌀', keywords: ['行動的', '縁が広がる', '刺激を呼ぶ'], description: '新しい出会いや変化を引き寄せやすい名前。人生の転機に強い運気を持つ。' },
  6: { number: 6, title: '慈しみの名', emoji: '🕊️', keywords: ['愛情運', '家庭運', '安心感'], description: '周囲に安心感を与える名前。愛情運・家庭運に恵まれやすい傾向がある。' },
  7: { number: 7, title: '神秘の名', emoji: '🌌', keywords: ['個性的', '独自の世界観', '直感が鋭い'], description: '他とは違う独自の魅力を放つ名前。直感や感性の鋭さが強みになるタイプ。' },
  8: { number: 8, title: '成功の名', emoji: '🏆', keywords: ['実力運', '達成運', '評価されやすい'], description: '努力が正当に評価されやすい名前。仕事や目標達成の場面で強い運気を発揮する。' },
  9: { number: 9, title: '包容の名', emoji: '🌕', keywords: ['包容力', '広い人脈', '調停役'], description: '多くの人から慕われる包容力を持つ名前。人と人をつなぐ調停役になりやすい。' },
}

function reduceToSingleDigit(n: number): number {
  while (n > 9) {
    n = String(n)
      .split('')
      .reduce((sum, d) => sum + Number(d), 0)
  }
  return n
}

export function calculateNameNumber(name: string): NameNumber {
  const trimmed = name.trim()
  const sum = Array.from(trimmed).reduce((s, ch) => s + ch.codePointAt(0)!, 0)
  const reduced = reduceToSingleDigit(sum)
  return (reduced === 0 ? 9 : reduced) as NameNumber
}
