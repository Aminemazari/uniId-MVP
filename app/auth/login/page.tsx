"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Shield, Fingerprint, AlertTriangle, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { storeUserData } from "@/lib/storage-utils"
import { mockUser, mockUserLimited } from "@/lib/mock-data"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("password")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [biometricAvailable, setBiometricAvailable] = useState(true)

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate inputs
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    // Simulate login process
    setTimeout(() => {
      // For demo purposes, we'll use the mock user
      storeUserData(mockUserLimited, "temp-encryption-key")

      toast({
        title: "Login successful",
        description: "Welcome to UniID",
      })

      router.push("/dashboard")
      setLoading(false)
    }, 1500)
  }

  const handleBiometricLogin = () => {
    setLoading(true)

    // Simulate biometric authentication
    setTimeout(() => {
      // For demo purposes, we'll use the mock user
      storeUserData(mockUser, "temp-encryption-key")

      toast({
        title: "Biometric authentication successful",
        description: "Welcome to UniID",
      })

      router.push("/dashboard")
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl">Welcome to UniID</CardTitle>
          <CardDescription>Your secure decentralized identity wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="biometric">Biometric</TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="mt-4 space-y-4">
              <form onSubmit={handlePasswordLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="biometric" className="mt-4 space-y-4">
              {biometricAvailable ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                    <Fingerprint className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-center text-muted-foreground">
                    Use your fingerprint or face ID to unlock your wallet
                  </p>
                  <Button className="w-full" onClick={handleBiometricLogin} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="mr-2 h-4 w-4" />
                        Authenticate with Biometrics
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Biometric authentication not available</AlertTitle>
                  <AlertDescription>
                    Your device does not support biometric authentication or it is not set up.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Separator className="mb-4" />
          <div className="flex justify-center w-full">
            <Button variant="outline" onClick={() => router.push("/auth/register")}>
              Create New Wallet
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
