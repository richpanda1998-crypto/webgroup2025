import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, TrendingUp } from "lucide-react"
import type { BrokerParsed } from "@/lib/types"
import { brokerNameToSlug } from "@/lib/utils"

interface RecommendedBrokersProps {
  currentBrokerCode: string
  allBrokers: BrokerParsed[]
}

/**
 * Get random recommended brokers (exclude current broker and low-score brokers)
 */
function getRandomRecommendedBrokers(
  allBrokers: BrokerParsed[],
  currentBrokerCode: string,
  count: number = 5
): BrokerParsed[] {
  // Filter out current broker and brokers with score < 6
  const eligibleBrokers = allBrokers.filter(
    broker => broker.code !== currentBrokerCode && broker.total_score >= 6
  )

  // If eligible brokers are less than needed, return all eligible
  if (eligibleBrokers.length <= count) {
    return eligibleBrokers
  }

  // Shuffle randomly and take first count items
  const shuffled = [...eligibleBrokers].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function RecommendedBrokers({ currentBrokerCode, allBrokers }: RecommendedBrokersProps) {
  const recommendedBrokers = getRandomRecommendedBrokers(allBrokers, currentBrokerCode, 5)

  if (recommendedBrokers.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="flex items-center gap-2 text-lg leading-none font-semibold" data-slot="card-title">
          <TrendingUp className="size-5" />
          More Brokers
        </h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendedBrokers.map((broker) => {
            const scoreColor =
              broker.total_score >= 8
                ? "text-success"
                : broker.total_score >= 6
                ? "text-warning"
                : "text-muted-foreground"

            return (
              <Link
                key={broker.code}
                href={`/broker/${brokerNameToSlug(broker.broker)}`}
                className="group block rounded-lg border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  {/* Logo */}
                  <div className="relative size-12 flex-shrink-0 overflow-hidden rounded-lg border bg-white">
                    {broker.logo ? (
                      <Image
                        src={broker.logo}
                        alt={`${broker.broker} logo`}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-muted">
                        <span className="text-lg font-bold text-muted-foreground">
                          {broker.broker.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold leading-tight group-hover:text-primary">
                      {broker.broker}
                    </p>
                    <p className="text-xs text-muted-foreground">{broker.register_country}</p>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-end">
                    <div className={`flex items-center gap-1 text-lg font-bold ${scoreColor}`}>
                      <Star className="size-4 fill-current" />
                      {broker.total_score.toFixed(1)}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
