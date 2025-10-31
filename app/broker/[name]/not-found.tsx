import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="mb-4 size-16 text-muted-foreground" />
        <h1 className="mb-2 text-3xl font-bold">Broker Not Found</h1>
        <p className="mb-6 text-muted-foreground">The broker you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/">Back to Broker List</Link>
        </Button>
      </div>
    </div>
  )
}
