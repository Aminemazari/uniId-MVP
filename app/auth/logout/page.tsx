"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, RefreshCw } from "lucide-react"
import { clearAllData } from "@/lib/storage-utils"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear all stored data
    clearAllData()

    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      router.push("/auth/login")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl">Logging Out</CardTitle>
          <CardDescription>Securely signing out of your wallet</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-center text-muted-foreground">Please wait while we securely log you out...</p>
        </CardContent>
      </Card>
    </div>
  )
}
