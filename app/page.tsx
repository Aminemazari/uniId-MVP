"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, ArrowRight, Check, Lock, FileCheck, Globe, CreditCard } from "lucide-react"
import { getUserData } from "@/lib/storage-utils"

export default function LandingPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    const userData = getUserData("temp-encryption-key")
    if (userData) {
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <span>UniID</span>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push("/auth/login")}>
                Login
              </Button>
              <Button onClick={() => router.push("/auth/register")}>Get Started</Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Your Secure Digital Identity Wallet
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Take control of your digital identity with UniID. Securely store, manage, and share your credentials while
              maintaining your privacy.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" onClick={() => router.push("/auth/register")}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/auth/login")}>
                Login to Your Wallet
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Key Features</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              UniID provides a comprehensive solution for managing your digital identity
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure Storage</h3>
                <p className="text-center text-muted-foreground">
                  Your credentials are securely stored on your device with end-to-end encryption
                </p>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span>Biometric protection</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span>Zero-knowledge proofs</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Verifiable Credentials</h3>
                <p className="text-center text-muted-foreground">
                  Store and share digital versions of your important documents and credentials
                </p>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span>Government IDs</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span>Educational certificates</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Metaverse Ready</h3>
                <p className="text-center text-muted-foreground">
                  Connect your digital identity to metaverse platforms securely
                </p>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span>Cross-platform identity</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span>Selective disclosure</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Financial Services</h3>
                <p className="text-center text-muted-foreground">
                  Access financial services with your verified digital identity
                </p>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span>Secure transactions</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span>Cross-border compatibility</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Privacy First</h3>
                <p className="text-center text-muted-foreground">
                  You control what information is shared and with whom
                </p>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span>Selective disclosure</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span>Consent management</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Get Started Now</h3>
                <p className="text-center text-muted-foreground">Create your digital identity wallet in minutes</p>
                <Button onClick={() => router.push("/auth/register")}>Create Your Wallet</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">UniID</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © 2025 UniID. All rights reserved. Your secure digital identity wallet.
          </p>
        </div>
      </footer>
    </div>
  )
}
