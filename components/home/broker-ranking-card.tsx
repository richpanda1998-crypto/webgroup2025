import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BrokerRiskBadge } from "@/components/broker-risk-badge"
import { Star, Shield } from "lucide-react"
import type { BrokerParsed } from "@/lib/types"

interface BrokerRankingCardProps {
  broker: BrokerParsed
}

function brokerNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function BrokerRankingCard({ broker }: BrokerRankingCardProps) {
  const brokerSlug = brokerNameToSlug(broker.broker)
  const hasLicense = broker.license_info && broker.license_info.trim() !== ""
  
  return (
    <Link href={`/broker/${brokerSlug}`} className="block">
      <Card className="group relative flex w-48 flex-shrink-0 cursor-pointer flex-col gap-4 p-5 transition-all hover:shadow-xl hover:scale-105 hover:border-primary/50 overflow-visible">
        {/* Score Badge */}
        <div className="absolute -top-3 -right-3 z-10">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background">
            <div className="text-center">
              <div className="text-lg font-bold leading-none">{broker.total_score.toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* Logo */}
        {broker.logo ? (
          <div className="relative mx-auto size-20 overflow-hidden rounded-xl bg-white p-2 shadow-sm ring-1 ring-border">
            <Image
              src={broker.logo || "/placeholder.svg"}
              alt={`${broker.broker} logo`}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="mx-auto flex size-20 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-sm">
            <span className="text-3xl font-bold text-primary">{broker.broker.charAt(0)}</span>
          </div>
        )}

        {/* Broker Name */}
        <div className="text-center">
          <p className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
            {broker.broker}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{broker.register_country}</p>
        </div>

        {/* Risk Badge */}
        <div className="flex justify-center">
          <BrokerRiskBadge broker={broker} />
        </div>

        {/* Hover CTA */}
        <div className="mt-auto pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-center text-xs font-medium text-primary">View Details →</p>
        </div>
      </Card>
    </Link>
  )
}
