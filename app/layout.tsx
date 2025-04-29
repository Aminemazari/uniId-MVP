import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { MobileDeviceFrame } from "@/components/mobile-device-frame"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="mobile-container">
            <div className="mobile-screen">
              <MobileDeviceFrame>{children}</MobileDeviceFrame>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
