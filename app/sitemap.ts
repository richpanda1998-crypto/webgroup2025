import { MetadataRoute } from 'next'
import { getAllBrokersFromDB } from './actions/brokers'
import { brokerNameToSlug } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zenprofx.com'
  
  // 获取所有经纪商
  const brokers = await getAllBrokersFromDB()
  
  // 生成经纪商详情页 URL
  const brokerUrls = brokers.map((broker) => ({
    url: `${baseUrl}/broker/${brokerNameToSlug(broker.broker)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...brokerUrls,
  ]
}
