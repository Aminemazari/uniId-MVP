"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell, AlertTriangle, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  mockUser,
  mockUserLimited,
  mockUserPartial,
  mockCredentials,
  mockVerificationRequests,
  mockActivityLog,
} from "@/lib/mock-data"
import { shortenDID } from "@/lib/crypto-utils"
import { ActivityLogItem } from "@/components/activity-log-item"
import { VerificationRequestCard } from "@/components/verification-request-card"
import { useToast } from "@/hooks/use-toast"
import { getUserData } from "@/lib/storage-utils"
import { AccessLevelBadge } from "@/components/access-level-badge"
import { TrustScoreIndicator } from "@/components/trust-score-indicator"
import { canAccessFeature, getFeatureLimitationMessage } from "@/lib/access-control"
import { CredentialCard } from "@/components/credential-card"
import type { User } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user data
  useEffect(() => {
    // Simulate loading delay
    const loadData = async () => {
      try {
        setIsLoading(true)
        const userData = getUserData("temp-encryption-key")

        // For demo purposes, we'll use mock users based on verification status
        if (userData) {
          if (userData.verificationStatus === "verified") {
            setCurrentUser(mockUser)
          } else if (userData.verificationStatus === "partial") {
            setCurrentUser(mockUserPartial)
          } else {
            setCurrentUser(mockUserLimited)
          }
        } else {
          // Default to mockUser if no user data is found
          setCurrentUser(mockUser)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        // Fallback to mockUser in case of error
        setCurrentUser(mockUser)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleApproveRequest = (requestId: string) => {
    toast({
      title: "Request approved",
      description: "Credentials have been shared securely",
    })
  }

  const handleRejectRequest = (requestId: string) => {
    toast({
      title: "Request rejected",
      description: "No credentials were shared",
    })
  }

  const handleShareCredential = (credential: any) => {
    if (!currentUser || !canAccessFeature(currentUser, "canShare")) {
      toast({
        title: "Access Restricted",
        description: currentUser ? getFeatureLimitationMessage(currentUser, "canShare") : "User data not loaded",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Sharing credential",
      description: `Preparing to share ${credential.display.title}`,
    })

    // In a real app, this would open the share dialog
    router.push(`/dashboard/credentials/share?id=${credential.id}`)
  }

  // If still loading or no user data, show loading state
  if (isLoading || !currentUser) {
    return (
      <div className="container space-y-6 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Loading dashboard...</h2>
        </div>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Digital Identity</CardTitle>
            <CardDescription>Securely stored on your device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const canAddCredentials = canAccessFeature(currentUser, "canShare")
  const limitedAccessMessage = getFeatureLimitationMessage(currentUser, "canShare")

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Welcome, {currentUser.name.split(" ")[0]}</h2>
        <AccessLevelBadge user={currentUser} />
      </div>

      {currentUser.verificationStatus !== "verified" && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Verification Incomplete</AlertTitle>
          <AlertDescription>
            {currentUser.verificationStatus === "unverified"
              ? "Complete your identity verification to unlock all features."
              : "Continue your verification process to access all features."}
            <Button variant="link" className="h-auto p-0 pl-1" onClick={() => router.push("/onboarding")}>
              Complete verification
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Digital Identity</CardTitle>
          <CardDescription>Securely stored on your device</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentUser.profileImage || "/placeholder.svg"} alt="Profile" />
              <AvatarFallback>
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-sm text-muted-foreground">{shortenDID(currentUser.did)}</p>
              {currentUser.verificationStatus === "verified" && currentUser.verificationDate && (
                <p className="text-sm text-muted-foreground">
                  Verified: {new Date(currentUser.verificationDate).toLocaleDateString()}
                </p>
              )}
              <div className="mt-2 w-full">
                <TrustScoreIndicator score={currentUser.trustScore} showIcon />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests" className="relative">
            Requests
            {mockVerificationRequests.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {mockVerificationRequests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Recent Credentials</h3>
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/credentials")}>
                View all
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {mockCredentials.slice(0, 2).map((credential) => (
                <CredentialCard
                  key={credential.id}
                  credential={credential}
                  onShare={handleShareCredential}
                  disabled={!canAddCredentials}
                  compact
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Recent Activity</h3>
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/profile?tab=activity")}>
                View all
              </Button>
            </div>

            <div className="space-y-3">
              {mockActivityLog.slice(0, 3).map((activity) => (
                <ActivityLogItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            onClick={() => router.push("/dashboard/credentials")}
            disabled={!canAddCredentials}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Manage Credentials
          </Button>

          {!canAddCredentials && <p className="text-center text-sm text-muted-foreground">{limitedAccessMessage}</p>}
        </TabsContent>

        <TabsContent value="requests" className="mt-4 space-y-4">
          {mockVerificationRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-center text-muted-foreground">No pending verification requests</p>
              </CardContent>
            </Card>
          ) : (
            mockVerificationRequests.map((request) => (
              <VerificationRequestCard
                key={request.id}
                request={request}
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
