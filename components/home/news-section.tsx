import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, Calendar } from "lucide-react"

export function NewsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-balance">Latest News & Updates</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty">
            Stay informed with the latest forex market news and broker updates
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-dashed">
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-accent/10">
                  <Newspaper className="size-6 text-accent" />
                </div>
                <CardTitle className="text-lg">News Article {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="size-3" />
                  <span>Date placeholder</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Latest forex market news and analysis will be displayed here.
                </p>
                <p className="mt-4 text-xs text-muted-foreground">Content coming soon</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
