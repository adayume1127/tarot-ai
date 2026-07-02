import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Luna Tarot | AIタロット占い',
  description: 'ルナが導く神秘のタロット占い。あなたの運命のカードを引いてみましょう。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Zen+Old+Mincho:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full" style={{ background: '#0a0014' }}>
        {children}
      </body>
    </html>
  )
}
