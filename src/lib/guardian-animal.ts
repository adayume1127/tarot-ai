export type GuardianAnimal = {
  id: number
  name: string
  emoji: string
  keywords: string[]
  description: string
}

export const GUARDIAN_ANIMALS: GuardianAnimal[] = [
  { id: 0, name: '銀狼', emoji: '🐺', keywords: ['忠誠', '孤高', '本能'], description: '群れの絆と一匹狼の自立心を併せ持つ。信じた道を最後まで走り抜く強さがある。' },
  { id: 1, name: '黒猫', emoji: '🐈‍⬛', keywords: ['直感', '独立', '神秘'], description: '夜の気配を読む鋭い直感の持ち主。自分のペースを大切にしながら物事を見通す。' },
  { id: 2, name: '白鹿', emoji: '🦌', keywords: ['優雅', '静けさ', '導き'], description: '静かな佇まいの奥に強い意志を秘める。迷う人に道を示す導き手の資質がある。' },
  { id: 3, name: '梟', emoji: '🦉', keywords: ['知恵', '観察', '洞察'], description: '物事の本質を静かに見極める観察者。夜更けにこそ冴える知性の持ち主。' },
  { id: 4, name: '白鳥', emoji: '🦢', keywords: ['気品', '純粋', '変容'], description: '見た目以上に芯の強さを秘めた変容の象徴。困難を美しく乗り越える力がある。' },
  { id: 5, name: '黒豹', emoji: '🐆', keywords: ['情熱', '瞬発力', '独自性'], description: '静と動を使い分けるしなやかな存在。ここぞという時の集中力と決断力が武器。' },
  { id: 6, name: '月兎', emoji: '🐇', keywords: ['繊細', '調和', '優しさ'], description: '周囲の空気を敏感に読み取る優しさの持ち主。穏やかな関係作りが得意。' },
  { id: 7, name: '蒼鷹', emoji: '🦅', keywords: ['野心', '俯瞰', '突破力'], description: '高い視点から物事全体を見渡す力を持つ。目標に向かって一直線に突き進む。' },
  { id: 8, name: '玄亀', emoji: '🐢', keywords: ['忍耐', '安定', '長期視点'], description: '焦らず着実に歩みを進める安定型。長い目で見て大きな成果を積み上げる。' },
  { id: 9, name: '銀狐', emoji: '🦊', keywords: ['機転', '好奇心', '社交'], description: '状況に応じて柔軟に立ち回る機転の持ち主。新しいことへの好奇心が尽きない。' },
  { id: 10, name: '天馬', emoji: '🐎', keywords: ['自由', '行動力', '疾走'], description: '一度決めたら迷わず駆け出す行動派。自由を求める心が人生を切り開く。' },
  { id: 11, name: '月龍', emoji: '🐉', keywords: ['神秘', '大局観', '再生'], description: '大きな流れを見通す神秘的な存在。何度でも自分を作り変える再生力を持つ。' },
]

export function calculateGuardianAnimal(birthdate: string): GuardianAnimal {
  const digits = birthdate.replace(/[^0-9]/g, '')
  const sum = digits.split('').reduce((s, d) => s + Number(d), 0)
  return GUARDIAN_ANIMALS[sum % GUARDIAN_ANIMALS.length]
}
