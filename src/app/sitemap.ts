import type { MetadataRoute } from 'next'
import { MAJOR_ARCANA } from '@/lib/cards-data'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tarot-ai-three.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const cardPages = MAJOR_ARCANA.map((card) => ({
    url: `${BASE_URL}/cards/${card.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/cards`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...cardPages,
  ]
}
