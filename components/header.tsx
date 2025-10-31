"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Menu, Shield, TrendingUp, Award, ChevronDown } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-bold">C</span>
          </div>
          <span className="text-xl font-bold">CAIZHIW FX</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 lg:flex">
          {/* Best Brokers Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 text-sm font-medium">
                <Award className="size-4" />
                Best Brokers
                <ChevronDown className="size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[320px]">
              <DropdownMenuItem asChild>
                <Link href="/#top-rated" className="flex flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2 font-medium">
                    <TrendingUp className="size-4 text-warning" />
                    Top Rated Brokers
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Highest scoring brokers based on our comprehensive review
                  </p>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#regulated" className="flex flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2 font-medium">
                    <Shield className="size-4 text-success" />
                    Best Regulated Brokers
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Brokers with top-tier regulatory licenses
                  </p>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#experienced" className="flex flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2 font-medium">
                    <Award className="size-4 text-accent" />
                    Most Experienced
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Long-standing brokers with proven track records
                  </p>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Broker Reviews */}
          <Button variant="ghost" asChild className="text-sm font-medium">
            <Link href="/">Broker Reviews</Link>
          </Button>

          {/* Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 text-sm font-medium">
                Tools
                <ChevronDown className="size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[280px]">
              <DropdownMenuItem asChild>
                <Link href="/search" className="flex flex-col items-start gap-1 py-3">
                  <div className="font-medium">Search Brokers</div>
                  <p className="text-xs text-muted-foreground">
                    Find the perfect broker for your needs
                  </p>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#compare" className="flex flex-col items-start gap-1 py-3">
                  <div className="font-medium">Compare Brokers</div>
                  <p className="text-xs text-muted-foreground">
                    Side-by-side comparison of features and fees
                  </p>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* About */}
          <Button variant="ghost" asChild className="text-sm font-medium">
            <Link href="#about">About Us</Link>
          </Button>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <Button variant="ghost" size="icon" asChild className="hidden lg:inline-flex">
            <Link href="/search" aria-label="Search brokers">
              <Search className="size-5" />
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="font-bold">C</span>
                  </div>
                  CAIZHIW FX
                </Link>

                <div className="mt-4 flex flex-col gap-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Best Brokers
                  </div>
                  <Link
                    href="/#top-rated"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <TrendingUp className="size-4" />
                    Top Rated Brokers
                  </Link>
                  <Link
                    href="/#regulated"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="size-4" />
                    Best Regulated
                  </Link>
                  <Link
                    href="/#experienced"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Award className="size-4" />
                    Most Experienced
                  </Link>

                  <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tools
                  </div>
                  <Link
                    href="/search"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Search className="size-4" />
                    Search Brokers
                  </Link>

                  <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    More
                  </div>
                  <Link
                    href="/"
                    className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Broker Reviews
                  </Link>
                  <Link
                    href="#about"
                    className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
