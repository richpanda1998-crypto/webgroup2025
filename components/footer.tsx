import Link from "next/link"
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  const footerLinks = {
    Company: [
      { label: "About Us", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
    Resources: [
      { label: "Blog", href: "#" },
      { label: "Education", href: "#" },
      { label: "Market News", href: "#" },
      { label: "Trading Tools", href: "#" },
    ],
    Legal: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Disclaimer", href: "#" },
    ],
    Support: [
      { label: "Help Center", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Report a Broker", href: "#" },
      { label: "Submit Review", href: "#" },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ]

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-lg font-bold">C</span>
              </div>
              <span className="text-xl font-bold">CAIZHIW FX</span>
            </Link>
            <p className="mb-4 text-sm text-muted-foreground">
              Independent forex broker reviews and ratings. Compare brokers, check licenses, and make informed trading decisions.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex size-9 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-accent"
                  aria-label={social.label}
                >
                  <social.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="mb-4 rounded-lg border border-warning/20 bg-warning/5 p-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-foreground">Risk Warning:</strong> Trading forex and CFDs involves significant risk of loss. 
              Leverage can work against you. This website provides information for educational purposes only and does not constitute investment advice. 
              Always verify broker licenses and regulations before opening an account. Past performance is not indicative of future results.
            </p>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} CAIZHIW FX. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">
              Independent reviews • Unbiased ratings • Transparent comparisons
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
