import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, TrendingUp, DollarSign, BarChart3 } from "lucide-react"
import type { BrokerParsed } from "@/lib/types"

interface AccountInfoSectionProps {
  broker: BrokerParsed
}

interface AccountType {
  account_type: string
  is_visible: boolean
  is_active: boolean
  data: Record<string, any>
}

function parseAccountInfo(accountInfoStr: string): AccountType[] | null {
  try {
    const parsed = JSON.parse(accountInfoStr)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function formatValue(value: any): string {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  if (value === '--' || value === '') {
    return 'N/A'
  }
  return String(value)
}

function getFieldLabel(key: string): string {
  const labels: Record<string, string> = {
    'Environment': 'Trading Environment',
    'Currency': 'Account Currency',
    'Maximum Leverage': 'Maximum Leverage',
    'SupportedEA': 'EA Support',
    'Minimum Deposit': 'Minimum Deposit',
    'Minimum Spread': 'Minimum Spread',
    'Depositing Method': 'Deposit Methods',
    'Withdrawal Method': 'Withdrawal Methods',
    'Minimum Position': 'Minimum Position',
    'Commission': 'Commission',
    'Products': 'Trading Products',
  }
  return labels[key] || key
}

export function AccountInfoSection({ broker }: AccountInfoSectionProps) {
  const hasAccountInfoStr = broker.account_info && broker.account_info.trim() !== ""
  const accounts = hasAccountInfoStr ? parseAccountInfo(broker.account_info) : null
  const visibleAccounts = accounts?.filter(acc => acc.is_visible) || []
  const hasValidAccounts = visibleAccounts.length > 0

  // Merge all account data fields
  const allFields = new Map<string, any>()
  visibleAccounts.forEach(account => {
    Object.entries(account.data).forEach(([key, value]) => {
      if (value && value !== '--' && value !== '') {
        allFields.set(key, value)
      }
    })
  })

  return (
    <Card>
      <CardHeader>
        <h2 className="flex items-center gap-2 leading-none font-semibold" data-slot="card-title">
          <Wallet className="size-5" />
          Account Information
        </h2>
      </CardHeader>
      <CardContent>
        {hasValidAccounts ? (
          <div className="space-y-4">
            {/* Account Types Available */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Wallet className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Account Types Available</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {visibleAccounts.map((account) => (
                  <Badge key={account.account_type} variant="secondary" className="text-xs">
                    {account.account_type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Display all merged fields */}
            <div className="grid gap-3">
              {Array.from(allFields.entries()).map(([key, value]) => (
                <div key={key} className="flex items-start justify-between gap-4 rounded-lg border bg-card p-3">
                  <div className="flex items-center gap-2">
                    {key === 'Maximum Leverage' && <TrendingUp className="size-4 text-muted-foreground" />}
                    {key === 'Minimum Deposit' && <DollarSign className="size-4 text-muted-foreground" />}
                    {key === 'Products' && <BarChart3 className="size-4 text-muted-foreground" />}
                    <span className="text-sm font-medium text-muted-foreground">{getFieldLabel(key)}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground text-right max-w-[60%] break-words">{formatValue(value)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No account information available at this time.</p>
        )}
      </CardContent>
    </Card>
  )
}
