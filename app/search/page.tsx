import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, AlertCircle, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BrokerCard } from "@/components/broker-card"
import { getAllBrokers } from "@/app/actions/brokers"

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
  }>
}

export const metadata = {
  title: "Search Brokers | CAIZHIW FX",
  description: "Search and find forex brokers",
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q?.trim().toLowerCase() || ""

  let results = []
  let hasSearched = false

  if (query) {
    hasSearched = true
    const allBrokers = await getAllBrokers()
    results = allBrokers.filter(
      (broker) =>
        broker.broker.toLowerCase().includes(query) ||
        broker.register_country?.toLowerCase().includes(query) ||
        broker.license_info?.toLowerCase().includes(query)
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="border-b bg-gradient-to-b from-primary/5 to-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="size-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Search Brokers</h1>
          </div>

          <form method="GET" className="flex gap-2 max-w-2xl">
            <Input
              type="search"
              name="q"
              placeholder="Search by broker name, country, license..."
              defaultValue={query}
              className="h-12 text-base"
              autoFocus
            />
            <Button type="submit" size="lg" className="gap-2">
              <Search className="size-4" />
              Search
            </Button>
          </form>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 flex-1">
        {!hasSearched ? (
          <div className="mx-auto max-w-2xl rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 p-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Search className="size-8 text-primary" />
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold">Enter a search query</h2>
            <p className="text-muted-foreground">
              Search by broker name, country, or license information
            </p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                Search Results{" "}
                <span className="text-primary">({results.length})</span>
              </h2>
              <p className="text-muted-foreground mt-2">
                Found {results.length} broker{results.length !== 1 ? "s" : ""} matching "{query}"
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((broker) => (
                <BrokerCard key={broker.code} broker={broker} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-lg border-2 border-dashed border-destructive/20 bg-destructive/5 p-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="size-8 text-destructive" />
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold">No brokers found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find any brokers matching "{query}". Try a different search term.
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
