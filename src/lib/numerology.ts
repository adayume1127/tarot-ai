export type LifePathNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22 | 33

export type LifePathMeaning = {
  number: LifePathNumber
  title: string
  emoji: string
  keywords: string[]
  description: string
}

export const LIFE_PATH_MEANINGS: Record<LifePathNumber, LifePathMeaning> = {
  1: {
    number: 1,
    title: '開拓者',
    emoji: '🌟',
    keywords: ['独立', 'リーダーシップ', '先駆け', '意志力'],
    description: '自らの力で道を切り開く開拓者の数。誰かの後ろに従うより、先頭に立つことで輝く運命。',
  },
  2: {
    number: 2,
    title: '調停者',
    emoji: '🌙',
    keywords: ['調和', '協調', '感受性', '思いやり'],
    description: '人と人との間に橋をかける調停者の数。二人三脚のパートナーシップで真価を発揮する。',
  },
  3: {
    number: 3,
    title: '表現者',
    emoji: '🎨',
    keywords: ['創造性', '表現力', '社交性', '楽観'],
    description: '言葉や芸術で世界を彩る表現者の数。明るさとひらめきで周囲を照らす存在。',
  },
  4: {
    number: 4,
    title: '構築者',
    emoji: '🏛️',
    keywords: ['安定', '誠実', '努力', '継続'],
    description: '一つ一つ積み上げて確かな土台を築く構築者の数。地道な努力が最大の武器になる。',
  },
  5: {
    number: 5,
    title: '自由人',
    emoji: '🌬️',
    keywords: ['自由', '変化', '冒険', '好奇心'],
    description: '風のように自由を求める旅人の数。変化と刺激の中でこそ本領を発揮する。',
  },
  6: {
    number: 6,
    title: '慈愛者',
    emoji: '💐',
    keywords: ['愛情', '責任感', '奉仕', '調和'],
    description: '家族や仲間を守り育む慈愛者の数。誰かの支えになることに深い喜びを感じる。',
  },
  7: {
    number: 7,
    title: '探求者',
    emoji: '🔮',
    keywords: ['探求', '内省', '直感', '神秘'],
    description: '目に見えない真理を追い求める探求者の数。一人の時間の中で深い洞察を得る。',
  },
  8: {
    number: 8,
    title: '達成者',
    emoji: '👑',
    keywords: ['成功', '力', '野心', '実行力'],
    description: '現実を動かす力を持つ達成者の数。目標に向かって着実に結果を出していく星回り。',
  },
  9: {
    number: 9,
    title: '賢者',
    emoji: '✨',
    keywords: ['博愛', '完成', '寛容', '奉仕'],
    description: '広い視野で世界全体を見渡す賢者の数。多くの人を導き癒す使命を帯びている。',
  },
  11: {
    number: 11,
    title: '直感の使者',
    emoji: '🌠',
    keywords: ['霊感', '直感', '理想', '啓示'],
    description: '数秘術における特別なマスターナンバー。強い直感力と精神性で人々に気づきを与える存在。',
  },
  22: {
    number: 22,
    title: '大いなる建築家',
    emoji: '🏰',
    keywords: ['大志', '実現力', '理想の具現化', '影響力'],
    description: '壮大な理想を現実の形にする力を持つマスターナンバー。大きな夢を成し遂げる可能性を秘めている。',
  },
  33: {
    number: 33,
    title: '無償の癒し手',
    emoji: '💫',
    keywords: ['無償の愛', '癒し', '奉仕', '慈悲'],
    description: '最も稀なマスターナンバー。見返りを求めない深い愛で、多くの人を癒し導く運命。',
  },
}

function reduceToLifePath(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n)
      .split('')
      .reduce((sum, d) => sum + Number(d), 0)
  }
  return n
}

export function calculateLifePathNumber(birthdate: string): LifePathNumber {
  const digits = birthdate.replace(/[^0-9]/g, '')
  const sum = digits.split('').reduce((s, d) => s + Number(d), 0)
  return reduceToLifePath(sum) as LifePathNumber
}
