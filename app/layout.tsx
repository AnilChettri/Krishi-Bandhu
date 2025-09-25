import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
// import { PWAInstall } from "@/components/pwa-install"
import "./globals.css"
import { Suspense } from "react"
import { LanguageProvider } from "@/contexts/language-context"

export const metadata: Metadata = {
  title: "Krishi Bandhu - Smart Crop Advisory System",
  description:
    "Empowering small & marginal farmers with localized crop advisory, weather alerts, market insights, and AI-powered farming assistance",
  generator: "Krishi Bandhu",
  manifest: "/manifest.json",
  keywords: ["farming", "agriculture", "crop advisory", "weather", "market prices", "AI assistant", "offline"],
  authors: [{ name: "Krishi Bandhu Team" }],
  creator: "Krishi Bandhu",
  publisher: "Krishi Bandhu",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://krishibandhu.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Krishi Bandhu",
    title: "Krishi Bandhu - Smart Crop Advisory System",
    description:
      "Empowering small & marginal farmers with localized crop advisory, weather alerts, market insights, and AI-powered farming assistance",
    images: [
      {
        url: "/icon-512.jpg",
        width: 512,
        height: 512,
        alt: "Krishi Bandhu Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krishi Bandhu - Smart Crop Advisory System",
    description:
      "Empowering small & marginal farmers with localized crop advisory, weather alerts, market insights, and AI-powered farming assistance",
    images: ["/icon-512.jpg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Krishi Bandhu",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Krishi Bandhu",
    "application-name": "Krishi Bandhu",
    "msapplication-TileColor": "#15803d",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#15803d",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192.jpg" />
        <link rel="apple-touch-icon" href="/icon-192.jpg" />
        <meta name="theme-color" content="#15803d" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <LanguageProvider>{children}</LanguageProvider>
          {/* <PWAInstall /> */}
        </Suspense>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
