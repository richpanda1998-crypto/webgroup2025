import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, CheckCircle2, FileText } from "lucide-react"
import type { BrokerParsed } from "@/lib/types"

interface LicenseSectionProps {
  broker: BrokerParsed
}

interface LicenseInfo {
  'Regulatory Status'?: string
  'License Information'?: string
  '监管状态'?: string  // Chinese fallback
  '牌照信息'?: string  // Chinese fallback
}

function parseLicenseInfo(licenseStr: string): LicenseInfo[] | null {
  try {
    const parsed = JSON.parse(licenseStr)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function LicenseSection({ broker }: LicenseSectionProps) {
  const hasLicenseStr = broker.license_info && broker.license_info.trim() !== ""
  const licenses = hasLicenseStr ? parseLicenseInfo(broker.license_info) : null
  const hasValidLicense = licenses && licenses.length > 0

  return (
    <Card>
      <CardHeader>
        <h2 className="flex items-center gap-2 leading-none font-semibold" data-slot="card-title">
          <Shield className="size-5" />
          Regulatory License
        </h2>
      </CardHeader>
      <CardContent>
        {hasValidLicense ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 p-3">
              <CheckCircle2 className="size-5 text-success" />
              <span className="font-semibold text-success">Licensed Broker</span>
              <Badge variant="outline" className="ml-auto border-success/30 text-success">{licenses.length}</Badge>
            </div>
            
            <div className="grid gap-3">
              {licenses.map((license, index) => {
                const licenseInfo = license['License Information'] || license['牌照信息'] || 'N/A'
                const regulatoryStatus = license['Regulatory Status'] || license['监管状态'] || 'N/A'
                
                // Check if exceeded
                const isExceeded = regulatoryStatus.toLowerCase().includes('exceeded') || 
                                   regulatoryStatus.includes('超限')
                
                return (
                  <div key={index} className={`group rounded-lg border bg-card p-4 transition-all hover:shadow-sm ${
                    isExceeded ? 'hover:border-warning/30' : 'hover:border-success/30'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <p className="font-medium leading-tight text-foreground">{licenseInfo}</p>
                        <div className="flex items-center gap-2">
                          <div className={isExceeded ? 'size-2 rounded-full bg-warning' : 'size-2 rounded-full bg-success'}></div>
                          <span className={isExceeded ? 'text-sm text-warning font-medium' : 'text-sm text-muted-foreground'}>
                            {regulatoryStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Warning: No Valid Regulatory Information Found</AlertTitle>
            <AlertDescription className="mt-2">
              No valid regulatory information has been verified. Please be aware of the risks!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
