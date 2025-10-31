import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, TrendingUp, FileText } from "lucide-react"

export function EducationSection() {
  const topics = [
    {
      icon: BookOpen,
      title: "Forex Basics",
      description: "Learn the fundamentals of forex trading",
    },
    {
      icon: GraduationCap,
      title: "Trading Strategies",
      description: "Master proven trading techniques",
    },
    {
      icon: TrendingUp,
      title: "Market Analysis",
      description: "Understand technical and fundamental analysis",
    },
    {
      icon: FileText,
      title: "Risk Management",
      description: "Protect your capital with smart strategies",
    },
  ]

  return (
    <section className="border-t bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-balance">Educational Resources</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty">
            Comprehensive guides and tutorials to help you become a better trader
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic) => (
            <Card key={topic.title} className="border-dashed transition-colors hover:border-solid">
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <topic.icon className="size-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{topic.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{topic.description}</p>
                <p className="mt-4 text-xs text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
