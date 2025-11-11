import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://caizhiwfx.com'),
  title: {
    default: "Forex Broker Reviews | CAIZHIW FX",
    template: "%s | CAIZHIW FX",
  },
  description: "Compare and review top forex brokers. Find legitimate brokers and avoid scams. Independent reviews, ratings, and comparisons.",
  keywords: [
    "forex broker",
    "forex trading",
    "broker reviews",
    "forex comparison",
    "trading platform",
    "regulated brokers",
    "forex scam",
    "broker ratings",
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://caizhiwfx.com',
    siteName: "CAIZHIW FX",
    title: "Forex Broker Reviews - Compare Top Trading Platforms",
    description: "Independent forex broker reviews and comparisons. Find regulated brokers, avoid scams.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forex Broker Reviews | CAIZHIW FX",
    description: "Compare and review top forex brokers. Find legitimate brokers and avoid scams.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // 添加 Google Search Console 验证
    // google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  )
}
