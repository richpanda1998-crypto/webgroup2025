import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Shield, List, HelpCircle, type LucideIcon } from "lucide-react"

interface PlaceholderSectionProps {
  title: string
  description: string
  icon: "target" | "shield" | "list" | "help"
}

const iconMap: Record<string, LucideIcon> = {
  target: Target,
  shield: Shield,
  list: List,
  help: HelpCircle,
}

export function PlaceholderSection({ title, description, icon }: PlaceholderSectionProps) {
  const Icon = iconMap[icon]

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-muted/50 p-6 text-center">
          <Icon className="mx-auto mb-3 size-12 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="mt-2 text-xs text-muted-foreground">Content will be added soon.</p>
        </div>
      </CardContent>
    </Card>
  )
}
