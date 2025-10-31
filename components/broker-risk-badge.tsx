import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle } from "lucide-react"
import type { BrokerParsed } from "@/lib/types"

interface BrokerRiskBadgeProps {
  broker: BrokerParsed
}

export function BrokerRiskBadge({ broker }: BrokerRiskBadgeProps) {
  const hasLicense = broker.license_info && broker.license_info.trim() !== ""
  const isSafe = broker.safe?.is_safe ?? false

  if (hasLicense && isSafe) {
    return (
      <Badge variant="outline" className="gap-1 border-green-300 bg-green-50 text-green-700">
        <Shield className="size-3" />
        Safe
      </Badge>
    )
  }

  if (hasLicense) {
    return (
      <Badge variant="outline" className="gap-1 border-blue-300 bg-blue-50 text-blue-700">
        <Shield className="size-3" />
        Regulated
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="gap-1 border-red-300 bg-red-50 text-red-700">
      <AlertTriangle className="size-3" />
      Risky
    </Badge>
  )
}
