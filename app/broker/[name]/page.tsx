import { notFound } from "next/navigation"
import { getBrokerByCode, getAllBrokers } from "@/app/actions/brokers"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BrokerHeader } from "@/components/broker-detail/broker-header"
import { LicenseSection } from "@/components/broker-detail/license-section"
import { AccountInfoSection } from "@/components/broker-detail/account-info-section"
import { OperatingDetailsSection } from "@/components/broker-detail/operating-details-section"
import { WhyChooseSection } from "@/components/broker-detail/why-choose-section"
import { SafetySection } from "@/components/broker-detail/safety-section"
import { ProsConsSection } from "@/components/broker-detail/pros-cons-section"
import { FAQSection } from "@/components/broker-detail/faq-section"
import { RecommendedBrokers } from "@/components/broker-detail/recommended-brokers"
import { BrokerSchema, BreadcrumbSchema, FAQSchema } from "@/components/structured-data"
import type { Metadata } from "next"

interface BrokerPageProps {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: BrokerPageProps): Promise<Metadata> {
  const { name } = await params
  const broker = await getBrokerByCode(name)

  if (!broker) {
    return {
      title: "Broker Not Found",
    }
  }

  const siteName = "Zenpro FX"
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zenprofx.com'
  const brokerUrl = `${baseUrl}/broker/${name}`
  
  // 提取监管信息
  const regulationStatus = broker.license_info ? 'Regulated' : 'Unregulated'
  
  return {
    title: `${broker.broker} Review - Forex Broker Rating ${broker.total_score.toFixed(1)}/10`,
    description: `Complete ${broker.broker} review: ${regulationStatus} broker from ${broker.register_country}. Rating: ${broker.total_score.toFixed(1)}/10. Operating period: ${broker.operating_period}. Read detailed analysis of licenses, spreads, leverage, and trading conditions.`,
    keywords: [
      broker.broker,
      `${broker.broker} review`,
      `${broker.broker} forex`,
      'forex broker',
      broker.register_country,
      regulationStatus.toLowerCase(),
      'trading platform',
      'broker rating',
    ],
    openGraph: {
      title: `${broker.broker} Review - ${regulationStatus} Forex Broker`,
      description: `Rating: ${broker.total_score.toFixed(1)}/10. ${regulationStatus} broker from ${broker.register_country}. Operating: ${broker.operating_period}.`,
      url: brokerUrl,
      type: 'article',
      images: broker.logo ? [{
        url: broker.logo,
        width: 800,
        height: 600,
        alt: `${broker.broker} logo`,
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${broker.broker} Review - Rating ${broker.total_score.toFixed(1)}/10`,
      description: `${regulationStatus} forex broker from ${broker.register_country}. Detailed review and analysis.`,
      images: broker.logo ? [broker.logo] : [],
    },
    alternates: {
      canonical: brokerUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      // 地理位置元数据 - 基于经纪商注册国家
      'geo.region': broker.register_country,
      'geo.placename': broker.register_country,
    },
  }
}

export default async function BrokerPage({ params }: BrokerPageProps) {
  const { name } = await params
  const broker = await getBrokerByCode(name)

  if (!broker) {
    notFound()
  }

  // 获取所有经纪商用于推荐
  const allBrokers = await getAllBrokers()

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zenprofx.com'
  
  return (
    <div className="min-h-screen bg-background">
      <BrokerSchema broker={broker} />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Brokers', url: `${baseUrl}/#brokers` },
          { name: broker.broker, url: `${baseUrl}/broker/${name}` }
        ]} 
      />
      {broker.faq && broker.faq.length > 0 && <FAQSchema faqs={broker.faq} />}
      <Header />

      <main className="container mx-auto px-4 py-8">
        <BrokerHeader broker={broker} />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            <LicenseSection broker={broker} />
            <AccountInfoSection broker={broker} />
            <WhyChooseSection data={broker.whychose} brokerName={broker.broker} />
            <SafetySection data={broker.safe} brokerName={broker.broker} />
            <ProsConsSection data={broker.pros} />
            <FAQSection data={broker.faq} brokerName={broker.broker} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <OperatingDetailsSection broker={broker} />
            <RecommendedBrokers currentBrokerCode={broker.code} allBrokers={allBrokers} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
