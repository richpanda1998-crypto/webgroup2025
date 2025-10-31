import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Calendar, Globe } from "lucide-react"
import type { BrokerParsed } from "@/lib/types"

interface OperatingDetailsSectionProps {
  broker: BrokerParsed
}

export function OperatingDetailsSection({ broker }: OperatingDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg leading-none font-semibold" data-slot="card-title">Broker Details</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Building2 className="mt-0.5 size-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Registered Country</p>
            <p className="text-sm text-muted-foreground">{broker.register_country || "Not specified"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 size-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Operating Period</p>
            <p className="text-sm text-muted-foreground">{broker.operating_period || "Not specified"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Globe className="mt-0.5 size-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Official Website</p>
            <a
              href={broker.official_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline"
            >
              Visit Website
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
