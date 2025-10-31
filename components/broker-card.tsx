import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Shield, AlertTriangle, ExternalLink } from "lucide-react"
import type { BrokerParsed } from "@/lib/types"
import { brokerNameToSlug } from "@/lib/utils"

interface BrokerCardProps {
  broker: BrokerParsed
}

function parseLicenseAbbr(licenseInfo?: string | null): { abbr: string; isLicensed: boolean } {
  if (!licenseInfo || licenseInfo.trim() === "") {
    return { abbr: "No License Info", isLicensed: false }
  }
  
  try {
    // Try to parse as JSON
    if (licenseInfo.startsWith("[")) {
      const parsed = JSON.parse(licenseInfo)
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Extract abbreviations from English field or Chinese field
        const abbrs = parsed
          .map((item: any) => {
            // Try English field first
            if (item.abbreviation) return item.abbreviation
            // Try to extract from Chinese field
            if (item.监管状态) {
              // Extract regulatory abbreviation from Chinese text
              const match = item.监管状态.match(/([A-Z]+)/)
              return match ? match[1] : ""
            }
            return ""
          })
          .filter((abbr: string) => abbr !== "")
        if (abbrs.length > 0) {
          return { abbr: abbrs.join(", "), isLicensed: true }
        } else {
          return { abbr: "Unregulated", isLicensed: false }
        }
      }
    } else if (licenseInfo.startsWith("{")) {
      const parsed = JSON.parse(licenseInfo)
      if (parsed.abbreviation) {
        return { abbr: parsed.abbreviation, isLicensed: true }
      } else if (parsed.监管状态) {
        const match = parsed.监管状态.match(/([A-Z]+)/)
        const abbr = match ? match[1] : "Regulated"
        return { abbr, isLicensed: true }
      } else {
        return { abbr: "Unregulated", isLicensed: false }
      }
    }
  } catch (e) {
    // If parsing fails, treat as unregulated
    return { abbr: "Invalid License Data", isLicensed: false }
  }
  return { abbr: licenseInfo, isLicensed: true }
}

export function BrokerCard({ broker }: BrokerCardProps) {
  const { abbr: licenseAbbr, isLicensed } = parseLicenseAbbr(broker.license_info)
  const scoreColor =
    broker.total_score >= 8 ? "text-success" : broker.total_score >= 6 ? "text-warning" : "text-destructive"

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-lg">
      <CardContent className="flex-1 p-6">
        {/* Header with Logo and Score */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {broker.logo ? (
              <div className="relative size-12 overflow-hidden rounded-lg border bg-white">
                <Image
                  src={broker.logo || "/placeholder.svg"}
                  alt={`${broker.broker} logo`}
                  fill
                  className="object-contain p-1"
                />
              </div>
            ) : (
              <div className="flex size-12 items-center justify-center rounded-lg border bg-muted">
                <span className="text-lg font-bold text-muted-foreground">{broker.broker.charAt(0)}</span>
              </div>
            )}
            <div>
              <h3 className="font-semibold leading-tight">{broker.broker}</h3>
              <p className="text-xs text-muted-foreground">{broker.register_country}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className={`flex items-center gap-1 text-2xl font-bold ${scoreColor}`}>
              <Star className="size-5 fill-current" />
              {broker.total_score.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
        </div>

        {/* License Status */}
        <div className="mb-4">
          {isLicensed ? (
            <Badge variant="outline" className="gap-1 border-success text-success">
              <Shield className="size-3" />
              Licensed
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 border-destructive text-destructive">
              <AlertTriangle className="size-3" />
              Unregulated
            </Badge>
          )}
        </div>

        {/* Key Info */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Operating Period:</span>
            <span className="font-medium">{broker.operating_period || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">License:</span>
            {!isLicensed ? (
              <span className="flex items-center gap-1 text-xs font-medium text-destructive">
                <AlertTriangle className="size-3" />
                {licenseAbbr}
              </span>
            ) : (
              <span className="text-right font-medium text-sm">{licenseAbbr}</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <Button asChild className="w-full" size="sm">
          <Link href={`/broker/${brokerNameToSlug(broker.broker)}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
