import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, CheckCircle2, AlertTriangle } from "lucide-react"
import type { SafetyInfo } from "@/lib/types"

interface SafetySectionProps {
  data: SafetyInfo | null
  brokerName?: string
}

export function SafetySection({ data, brokerName }: SafetySectionProps) {
  const hasData = data && data.reasons && data.reasons.length > 0
  const title = brokerName ? `Is ${brokerName} Safe?` : "Safety & Security"

  return (
    <Card className={!hasData ? "border-dashed" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="size-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="space-y-4">
            <Alert className={data.is_safe ? "border-success bg-success/5" : "border-warning bg-warning/5"}>
              {data.is_safe ? (
                <CheckCircle2 className="size-4 text-success" />
              ) : (
                <AlertTriangle className="size-4 text-warning" />
              )}
              <AlertTitle className={data.is_safe ? "text-success" : "text-warning"}>
                {data.is_safe ? "Generally Safe" : "Exercise Caution"}
              </AlertTitle>
              <AlertDescription className="mt-2 text-foreground">
                Based on our analysis, here are the key safety considerations:
              </AlertDescription>
            </Alert>
            <ul className="space-y-2">
              {data.reasons.map((reason, index) => (
                <li key={index} className="flex gap-2 text-sm">
                  <span className="text-muted-foreground">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-lg bg-muted/50 p-6 text-center">
            <Shield className="mx-auto mb-3 size-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Comprehensive safety analysis and security measures will be displayed here.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Content will be added soon.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
