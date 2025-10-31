import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { List, Plus, Minus } from "lucide-react"
import type { ProsAndCons } from "@/lib/types"

interface ProsConsSectionProps {
  data: ProsAndCons | null
}

export function ProsConsSection({ data }: ProsConsSectionProps) {
  const hasData = data && (data.pros?.length > 0 || data.cons?.length > 0)

  return (
    <Card className={!hasData ? "border-dashed" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="size-5" />
          Pros & Cons
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pros */}
            {data.pros && data.pros.length > 0 && (
              <div className="rounded-lg border border-success/20 bg-success/5 p-5">
                <h4 className="mb-4 flex items-center gap-2 text-base font-semibold text-success">
                  <div className="flex size-6 items-center justify-center rounded-full bg-success/20">
                    <Plus className="size-4" />
                  </div>
                  Advantages
                </h4>
                <ul className="space-y-3">
                  {data.pros.map((pro, index) => (
                    <li key={index} className="flex gap-3 text-sm leading-relaxed">
                      <span className="mt-0.5 flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-success/20 text-xs font-bold text-success">
                        ✓
                      </span>
                      <span className="flex-1">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cons */}
            {data.cons && data.cons.length > 0 && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-5">
                <h4 className="mb-4 flex items-center gap-2 text-base font-semibold text-destructive">
                  <div className="flex size-6 items-center justify-center rounded-full bg-destructive/20">
                    <Minus className="size-4" />
                  </div>
                  Disadvantages
                </h4>
                <ul className="space-y-3">
                  {data.cons.map((con, index) => (
                    <li key={index} className="flex gap-3 text-sm leading-relaxed">
                      <span className="mt-0.5 flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-destructive/20 text-xs font-bold text-destructive">
                        ✗
                      </span>
                      <span className="flex-1">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-muted/50 p-6 text-center">
            <List className="mx-auto mb-3 size-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Detailed advantages and disadvantages of this broker will be displayed here.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Content will be added soon.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
