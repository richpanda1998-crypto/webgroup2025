import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, ExternalLink } from "lucide-react"
import type { BrokerParsed } from "@/lib/types"

interface BrokerHeaderProps {
  broker: BrokerParsed
}

export function BrokerHeader({ broker }: BrokerHeaderProps) {
  const scoreColor =
    broker.total_score >= 8 ? "text-success" : broker.total_score >= 6 ? "text-warning" : "text-destructive"

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {broker.logo ? (
            <div className="relative size-16 overflow-hidden rounded-lg border bg-white md:size-20">
              <Image
                src={broker.logo || "/placeholder.svg"}
                alt={`${broker.broker} logo`}
                fill
                className="object-contain p-2"
              />
            </div>
          ) : (
            <div className="flex size-16 items-center justify-center rounded-lg border bg-muted md:size-20">
              <span className="text-2xl font-bold text-muted-foreground">{broker.broker.charAt(0)}</span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-balance md:text-3xl">{broker.broker}</h1>
            <p className="text-muted-foreground">{broker.register_country}</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 text-4xl font-bold ${scoreColor}`}>
              <Star className="size-8 fill-current" />
              {broker.total_score.toFixed(1)}
            </div>
            <span className="text-sm text-muted-foreground">/ 10</span>
          </div>
          <Button asChild size="lg" className="w-full md:w-auto">
            <a href={broker.official_link} target="_blank" rel="nofollow noopener noreferrer">
              Visit Official Website
              <ExternalLink className="ml-2 size-4" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  )
}
