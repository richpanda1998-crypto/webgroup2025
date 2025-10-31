import Link from "next/link"
import { getAllBrokers } from "./actions/brokers"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, TrendingUp, Shield, Zap, Award } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BrokerRankingCard } from "@/components/home/broker-ranking-card"
import { BrokerCarousel } from "@/components/home/broker-carousel"
import { getLicenseDisplay } from "@/lib/license-parser"
import { sortByRegulation, sortByScore, sortByExperience, getRiskyBrokers } from "@/lib/broker-sort"
import { RiskyBrokersSection } from "@/components/home/risky-brokers-section"
import { brokerNameToSlug } from "@/lib/utils"
import { WebsiteSchema } from "@/components/structured-data"

export const metadata = {
  title: "Forex Broker Reviews - Compare Top Trading Platforms | CAIZHIW FX",
  description:
    "CAIZHIW FX: Compare and review top forex brokers. Read detailed reviews covering licenses, spreads, leverage, and user feedback. Find legitimate brokers and avoid scams.",
}

export default async function HomePage() {
  const brokers = await getAllBrokers()

  const topBrokers = sortByScore(brokers).slice(0, 10)
  const licensedBrokers = brokers.filter((b) => b.license_info && b.license_info.trim() !== "")
  const bestRegulatedBrokers = sortByRegulation(licensedBrokers).slice(0, 5)
  const highestRatedBrokers = sortByScore(brokers).slice(0, 5)
  const mostExperiencedBrokers = sortByExperience(brokers).slice(0, 5)
  const riskyBrokers = getRiskyBrokers(brokers, 8)

  const isPreviewWithNoData = brokers.length === 0 && typeof window === "undefined"

  return (
    <div className="min-h-screen bg-background">
      <WebsiteSchema />
      <Header />

      {/* Hero Section */}
      <section className="relative border-b bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-primary/10 blur-3xl" />
        
        <div className="container relative mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            {/* Trust Badge */}
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <Shield className="size-4 text-success" />
                <span>Trusted by 70,000+ traders worldwide</span>
              </div>
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Find Your Perfect <span className="text-primary">Forex Broker</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Compare top-rated brokers, verify licenses, read independent reviews.
              <br className="hidden md:block" />
              Make informed trading decisions with our expert analysis.
            </p>

            {/* Search Bar */}
            <form action="/search" method="GET" className="mx-auto mb-8 flex max-w-2xl gap-2">
              <Input
                type="search"
                name="q"
                placeholder="Search brokers by name..."
                className="h-14 text-base shadow-lg"
              />
              <Button type="submit" size="lg" className="h-14 gap-2 px-8 shadow-lg">
                <Search className="size-5" />
                Search
              </Button>
            </form>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{brokers.length}+</div>
                <div className="text-sm text-muted-foreground">Brokers Reviewed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Independent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Updated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {isPreviewWithNoData ? (
          <div className="mx-auto max-w-2xl rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Shield className="size-8 text-primary" />
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold">Database Connection Only Available After Deployment</h2>
            <p className="mb-6 text-muted-foreground">
              The preview environment does not support PostgreSQL connections. Please visit your deployed Vercel site to view actual broker data.
            </p>
            <div className="rounded-lg bg-background p-4 text-left">
              <p className="mb-2 text-sm font-semibold">How to view your data:</p>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Click the "Publish" button in the top right to deploy to Vercel (if not yet deployed)</li>
                <li>2. After deployment, visit your Vercel project URL</li>
                <li>3. Ensure database environment variables are configured in Vercel project settings</li>
              </ol>
            </div>
          </div>
        ) : (
          <>
            {/* Top Rated Brokers Carousel */}
            <section id="top-rated" className="mb-20 scroll-mt-20">
              <div className="mb-10 text-center md:text-left">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                  <Award className="size-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">Featured Brokers</span>
                </div>
                <h2 className="text-3xl font-bold md:text-4xl">Top Rated Brokers</h2>
                <p className="mt-2 text-muted-foreground">Hand-picked brokers with the highest ratings</p>
              </div>

              {topBrokers.length > 0 ? (
                <BrokerCarousel brokers={topBrokers} />
              ) : (
                <div className="rounded-lg border bg-card p-12 text-center">
                  <p className="text-muted-foreground">No broker data available</p>
                </div>
              )}
            </section>

            {/* Broker Rankings */}
            <section className="mb-20 scroll-mt-20">
              <div className="mb-10 text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                  <TrendingUp className="size-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">Rankings</span>
                </div>
                <h2 className="text-3xl font-bold md:text-4xl">Broker Rankings</h2>
                <p className="mt-2 text-muted-foreground">Compare brokers by regulation, ratings, and experience</p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Best Regulated */}
                <div id="regulated" className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-10 items-center justify-center rounded-full bg-success/10">
                        <Shield className="size-5 text-success" />
                      </div>
                      <h3 className="text-lg font-semibold">Best Regulated</h3>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {bestRegulatedBrokers.map((broker, idx) => (
                      <Link key={broker.code} href={`/broker/${brokerNameToSlug(broker.broker)}`} className="group block">
                        <div className="flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-success/20 hover:bg-success/5 hover:shadow-sm">
                          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-success/20 to-success/5 font-bold text-success">
                            {idx + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold transition-colors group-hover:text-success">{broker.broker}</p>
                            <p className="truncate text-xs text-muted-foreground">{getLicenseDisplay(broker.license_info)}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-success">{broker.total_score.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">score</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Highest Rated */}
                <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-10 items-center justify-center rounded-full bg-warning/10">
                        <Zap className="size-5 text-warning" />
                      </div>
                      <h3 className="text-lg font-semibold">Highest Rated</h3>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {highestRatedBrokers.map((broker, idx) => (
                      <Link key={broker.code} href={`/broker/${brokerNameToSlug(broker.broker)}`} className="group block">
                        <div className="flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-warning/20 hover:bg-warning/5 hover:shadow-sm">
                          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-warning/20 to-warning/5 font-bold text-warning">
                            {idx + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold transition-colors group-hover:text-warning">{broker.broker}</p>
                            <p className="text-xs text-muted-foreground">{broker.register_country}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-warning">{broker.total_score.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">score</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Most Experienced */}
                <div id="experienced" className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-10 items-center justify-center rounded-full bg-accent/10">
                        <TrendingUp className="size-5 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold">Most Experienced</h3>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {mostExperiencedBrokers.map((broker, idx) => (
                      <Link key={broker.code} href={`/broker/${brokerNameToSlug(broker.broker)}`} className="group block">
                        <div className="flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-accent/20 hover:bg-accent/5 hover:shadow-sm">
                          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/5 font-bold text-accent">
                            {idx + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold transition-colors group-hover:text-accent">{broker.broker}</p>
                            <p className="text-xs text-muted-foreground">{broker.operating_period}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-accent">{broker.total_score.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">score</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Risk Warning Section */}
            {riskyBrokers.length > 0 && (
              <section className="mb-12">
                <RiskyBrokersSection brokers={riskyBrokers} />
              </section>
            )}

            {/* How We Review Section */}
            <section className="mb-20">
              <div className="mb-12 text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                  <Shield className="size-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">Our Process</span>
                </div>
                <h2 className="text-3xl font-bold md:text-4xl">How We Review Brokers</h2>
                <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
                  Our comprehensive evaluation process ensures you get accurate, unbiased information
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border bg-card p-6 text-center transition-shadow hover:shadow-lg">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="size-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">License Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    We verify regulatory licenses from top-tier financial authorities worldwide
                  </p>
                </div>

                <div className="rounded-lg border bg-card p-6 text-center transition-shadow hover:shadow-lg">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <TrendingUp className="size-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Trading Conditions</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyze spreads, leverage, fees, and execution speed for each broker
                  </p>
                </div>

                <div className="rounded-lg border bg-card p-6 text-center transition-shadow hover:shadow-lg">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <Award className="size-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Real User Reviews</h3>
                  <p className="text-sm text-muted-foreground">
                    Collect and verify feedback from actual traders using these platforms
                  </p>
                </div>

                <div className="rounded-lg border bg-card p-6 text-center transition-shadow hover:shadow-lg">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <Search className="size-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Independent Testing</h3>
                  <p className="text-sm text-muted-foreground">
                    Our team tests platforms, customer service, and withdrawal processes
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {/* CTA Section */}
      <section className="border-y bg-gradient-to-br from-primary/5 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Start Trading?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Compare brokers, read reviews, and find the perfect platform for your trading needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="gap-2 shadow-lg">
                <Link href="/">
                  <Award className="size-5" />
                  View All Brokers
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2">
                <Link href="/search">
                  <Search className="size-5" />
                  Search Brokers
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
