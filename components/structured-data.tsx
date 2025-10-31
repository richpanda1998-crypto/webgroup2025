import type { BrokerParsed } from "@/lib/types"

/**
 * 网站整体结构化数据
 */
export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Zenpro FX",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "http://caizhiw.com",
    "description": "Independent forex broker reviews and comparisons",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "http://caizhiw.com"}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * 经纪商详情页结构化数据
 */
export function BrokerSchema({ broker }: { broker: BrokerParsed }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": broker.broker,
    "image": broker.logo,
    "description": `${broker.broker} forex broker review - Licensed ${broker.license_info ? 'and regulated' : 'broker'} operating since ${broker.operating_period}`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": broker.total_score.toFixed(1),
      "bestRating": "10",
      "worstRating": "0",
      "ratingCount": "1"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": broker.register_country
    },
    "url": broker.official_link,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * 面包屑导航结构化数据
 */
export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * FAQ 结构化数据（对 AI 搜索引擎非常重要）
 */
export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  if (!faqs || faqs.length === 0) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
