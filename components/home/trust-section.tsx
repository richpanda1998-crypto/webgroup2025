import { Shield, Users, Award, CheckCircle } from "lucide-react"

export function TrustSection() {
  const stats = [
    {
      icon: Shield,
      value: "500+",
      label: "Verified Brokers",
    },
    {
      icon: Users,
      value: "1M+",
      label: "Active Users",
    },
    {
      icon: Award,
      value: "50+",
      label: "Countries Covered",
    },
    {
      icon: CheckCircle,
      value: "10K+",
      label: "Reviews Published",
    },
  ]

  return (
    <section className="border-y bg-gradient-to-b from-background to-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-balance">Trusted by Traders Worldwide</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-pretty">
            Your reliable source for forex broker information and reviews
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="size-8 text-primary" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              <div className="mt-2 text-xs text-muted-foreground/70">(Placeholder data)</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
