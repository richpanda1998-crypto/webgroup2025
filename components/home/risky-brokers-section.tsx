import Link from "next/link"
import Image from "next/image"
import { AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { BrokerParsed } from "@/lib/types"

interface RiskyBrokersSectionProps {
  brokers: BrokerParsed[]
}

function brokerNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function RiskyBrokersSection({ brokers }: RiskyBrokersSectionProps) {
  if (brokers.length === 0) return null

  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-destructive/20 bg-gradient-to-br from-destructive/5 via-destructive/3 to-background p-8 shadow-xl backdrop-blur-sm transition-all hover:border-destructive/30 hover:shadow-2xl">
      {/* 装饰性背景元素 */}
      <div className="absolute -right-12 -top-12 size-32 rounded-full bg-destructive/10 blur-3xl transition-all duration-700 group-hover:scale-150" />
      <div className="absolute -bottom-12 -left-12 size-32 rounded-full bg-destructive/5 blur-3xl transition-all duration-700 group-hover:scale-150" />
      
      <div className="relative mb-8 flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-destructive/20 blur-md" />
          <div className="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 shadow-lg ring-2 ring-destructive/20">
            <AlertTriangle className="size-7 text-destructive drop-shadow-sm" strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="mb-1 flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">⚠️ Risk Warning</span>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground/90">
            These brokers have low ratings, lack proper licenses, or have regulatory concerns. Trade with caution.
          </p>
        </div>
      </div>

      <div className="relative grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {brokers.map((broker) => {
          const brokerSlug = brokerNameToSlug(broker.broker)
          const hasLicense = broker.license_info && broker.license_info.trim() !== ""
          const lowScore = broker.total_score < 5

          return (
            <Link key={broker.code} href={`/broker/${brokerSlug}`}>
              <Card className="group/card relative flex h-full flex-col items-center justify-between gap-4 overflow-hidden border border-border/50 bg-card/80 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-destructive/50 hover:bg-card hover:shadow-2xl cursor-pointer">
                {/* 装饰性背景光晕 */}
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
                
                {/* Logo */}
                {broker.logo ? (
                  <div className="relative size-16 overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-md ring-1 ring-black/5 transition-transform duration-300 group-hover/card:scale-110 group-hover/card:shadow-xl">
                    <Image
                      src={broker.logo || "/placeholder.svg"}
                      alt={`${broker.broker} logo`}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/70 shadow-md ring-1 ring-border/50 transition-transform duration-300 group-hover/card:scale-110">
                    <span className="text-lg font-bold text-muted-foreground">{broker.broker.charAt(0)}</span>
                  </div>
                )}

                {/* Broker Name */}
                <div className="relative z-10 text-center">
                  <p className="text-sm font-semibold leading-tight line-clamp-2 transition-colors group-hover/card:text-primary">{broker.broker}</p>
                </div>

                {/* Risk Indicators */}
                <div className="relative z-10 w-full space-y-2 text-xs">
                  {lowScore && (
                    <div className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-destructive/15 to-destructive/10 px-3 py-1.5 text-destructive shadow-sm ring-1 ring-destructive/20 backdrop-blur-sm transition-all hover:shadow-md">
                      <AlertTriangle className="size-3.5" strokeWidth={2.5} />
                      <span className="font-medium">Low Score: {broker.total_score.toFixed(1)}</span>
                    </div>
                  )}
                  {!hasLicense && (
                    <div className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-destructive/15 to-destructive/10 px-3 py-1.5 text-destructive shadow-sm ring-1 ring-destructive/20 backdrop-blur-sm transition-all hover:shadow-md">
                      <AlertTriangle className="size-3.5" strokeWidth={2.5} />
                      <span className="font-medium">Unlicensed</span>
                    </div>
                  )}
                  {hasLicense && !lowScore && (
                    <div className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-yellow-100/80 to-yellow-50/80 px-3 py-1.5 text-yellow-700 shadow-sm ring-1 ring-yellow-200 backdrop-blur-sm transition-all hover:shadow-md dark:from-yellow-900/30 dark:to-yellow-800/20 dark:text-yellow-500 dark:ring-yellow-800/40">
                      <AlertTriangle className="size-3.5" strokeWidth={2.5} />
                      <span className="font-medium">Review Carefully</span>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
