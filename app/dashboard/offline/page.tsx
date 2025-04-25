"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wifi, WifiOff, Download, FileCheck, AlertTriangle, Lock, RefreshCw, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getUserData } from "@/lib/storage-utils"
import { canAccessFeature, getFeatureLimitationMessage } from "@/lib/access-control"
import type { User } from "@/lib/types"
import { mockUser, mockUserLimited, mockUserPartial, mockCredentials } from "@/lib/mock-data"
import { CredentialCard } from "@/components/credential-card"

export default function OfflinePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("status")
  const [currentUser, setCurrentUser] = useState<User>(mockUser)
  const [isOnline, setIsOnline] = useState(true)
  const [syncingStatus, setSyncingStatus] = useState<"idle" | "syncing" | "synced" | "failed">("idle")
  const [lastSynced, setLastSynced] = useState<Date | null>(null)

  // Load user data
  useEffect(() => {
    const userData = getUserData("temp-encryption-key")
    if (userData) {
      // For demo purposes, we'll use mock users based on verification status
      if (userData.verificationStatus === "verified") {
        setCurrentUser(mockUser)
      } else if (userData.verificationStatus === "partial") {
        setCurrentUser(mockUserPartial)
      } else {
        setCurrentUser(mockUserLimited)
      }
    }
  }, [])

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Set initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const canUseOfflineMode = canAccessFeature(currentUser, "offlineSupport")
  const offlineAccessMessage = getFeatureLimitationMessage(currentUser, "offlineSupport")

  const handleSync = () => {
    setSyncingStatus("syncing")

    // Simulate syncing process
    setTimeout(() => {
      setSyncingStatus("synced")
      setLastSynced(new Date())

      toast({
        title: "Sync completed",
        description: "Your credentials are now available offline",
      })
    }, 2000)
  }

  if (!canUseOfflineMode) {
    return (
      <div className="container space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Offline Mode</h2>
          </div>
        </div>

        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertTitle>Access Restricted</AlertTitle>
          <AlertDescription>{offlineAccessMessage}</AlertDescription>
        </Alert>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <WifiOff className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Offline Mode Locked</h3>
            <p className="text-center text-muted-foreground mb-6 max-w-md">
              Face ID verification is required to enable offline mode. This ensures your credentials remain secure when
              used without an internet connection.
            </p>
            <Button onClick={() => router.push("/onboarding?step=2")}>
              <Lock className="mr-2 h-4 w-4" />
              Complete Face ID Verification
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi className="h-6 w-6 text-primary" /> : <WifiOff className="h-6 w-6 text-primary" />}
          <h2 className="text-2xl font-bold">Offline Mode</h2>
        </div>
        <Badge variant={isOnline ? "default" : "secondary"}>{isOnline ? "Online" : "Offline"}</Badge>
      </div>

      <Tabs defaultValue="status" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="credentials">Offline Credentials</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>
                {isOnline
                  ? "You are currently online. Your credentials are being synced."
                  : "You are currently offline. Using locally stored credentials."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div
                  className={`h-24 w-24 rounded-full flex items-center justify-center ${isOnline ? "bg-green-100" : "bg-amber-100"}`}
                >
                  {isOnline ? (
                    <Wifi className="h-12 w-12 text-green-600" />
                  ) : (
                    <WifiOff className="h-12 w-12 text-amber-600" />
                  )}
                </div>
              </div>

              <Alert variant={isOnline ? "default" : "warning"}>
                {isOnline ? (
                  <>
                    <Check className="h-4 w-4" />
                    <AlertTitle>Online Mode</AlertTitle>
                    <AlertDescription>
                      All features are available. Your credentials are being synced with the latest updates.
                    </AlertDescription>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Offline Mode</AlertTitle>
                    <AlertDescription>
                      Limited features are available. Using locally stored credentials.
                    </AlertDescription>
                  </>
                )}
              </Alert>

              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Sync Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Synced</span>
                    <span className="text-sm">{lastSynced ? lastSynced.toLocaleString() : "Never"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Credentials Available Offline</span>
                    <span className="text-sm">{mockCredentials.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Storage Used</span>
                    <span className="text-sm">2.4 MB</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSync} disabled={!isOnline || syncingStatus === "syncing"}>
                {syncingStatus === "syncing" ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Sync Credentials for Offline Use
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Offline Settings</CardTitle>
              <CardDescription>Configure how your credentials are stored and used offline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    <span className="font-medium">Auto-Sync Credentials</span>
                  </div>
                  <div className="flex h-5 w-10 items-center rounded-full bg-primary p-1">
                    <div className="h-4 w-4 rounded-full bg-white transition-transform translate-x-5"></div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pl-6">Automatically sync credentials when online</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="font-medium">Require Authentication</span>
                  </div>
                  <div className="flex h-5 w-10 items-center rounded-full bg-primary p-1">
                    <div className="h-4 w-4 rounded-full bg-white transition-transform translate-x-5"></div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Require biometric authentication for offline access
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                    <span className="font-medium">Offline Expiry</span>
                  </div>
                  <span className="text-sm">7 days</span>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Credentials will expire after 7 days without syncing
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="mt-6 space-y-4">
          <Alert>
            <FileCheck className="h-4 w-4" />
            <AlertTitle>Offline Credentials</AlertTitle>
            <AlertDescription>
              These credentials are available for offline use. They will work even when you don't have an internet
              connection.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockCredentials.map((credential) => (
              <CredentialCard
                key={credential.id}
                credential={credential}
                onShare={() => {}}
                disabled={!isOnline}
                compact
              />
            ))}
          </div>

          <Button className="w-full" onClick={handleSync} disabled={!isOnline || syncingStatus === "syncing"}>
            {syncingStatus === "syncing" ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Update Offline Credentials
              </>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
