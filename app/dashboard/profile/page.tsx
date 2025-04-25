"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Clock, FileCheck, Settings, LogOut, Fingerprint, FileText } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getUserData } from "@/lib/storage-utils"
import { TrustScoreIndicator } from "@/components/trust-score-indicator"
import { AccessLevelBadge } from "@/components/access-level-badge"
import { ActivityLogItem } from "@/components/activity-log-item"
import { CredentialCard } from "@/components/credential-card"
import { ShareCredentialDialog } from "@/components/share-credential-dialog"
import { canAccessFeature, getFeatureLimitationMessage } from "@/lib/access-control"
import { shortenDID } from "@/lib/crypto-utils"
import type { User as UserType, VerifiableCredential } from "@/lib/types"
import {
  mockUser,
  mockUserLimited,
  mockUserPartial,
  mockCredentials,
  mockActivityLog,
  mockBiometricData,
  mockDocumentVerification,
} from "@/lib/mock-data"

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const initialTab = searchParams.get("tab") || "overview"
  const [activeTab, setActiveTab] = useState(initialTab)
  const [currentUser, setCurrentUser] = useState<UserType>(mockUser)
  const [selectedCredential, setSelectedCredential] = useState<VerifiableCredential | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

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

  const handleShareCredential = (credential: VerifiableCredential) => {
    if (!canAccessFeature(currentUser, "canShare")) {
      toast({
        title: "Access Restricted",
        description: getFeatureLimitationMessage(currentUser, "canShare"),
        variant: "destructive",
      })
      return
    }

    setSelectedCredential(credential)
    setShareDialogOpen(true)
  }

  const handleLogout = () => {
    router.push("/auth/logout")
  }

  const canAddCredentials = canAccessFeature(currentUser, "canShare")
  const canUseZkp = canAccessFeature(currentUser, "zkpSupport")

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Profile</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={currentUser.profileImage || "/placeholder.svg"} alt={currentUser.name} />
              <AvatarFallback>
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <h3 className="text-2xl font-bold">{currentUser.name}</h3>
                <AccessLevelBadge user={currentUser} />
              </div>
              <p className="text-muted-foreground">{currentUser.email}</p>
              <p className="text-sm text-muted-foreground">{shortenDID(currentUser.did)}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {currentUser.verificationStatus}
                </Badge>
                {currentUser.verificationDate && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Verified: {new Date(currentUser.verificationDate).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <TrustScoreIndicator score={currentUser.trustScore} size="lg" showIcon />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>Your identity verification details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="h-4 w-4 text-primary" />
                      <span className="font-medium">Biometric Registration</span>
                    </div>
                    <Badge variant={currentUser.biometricRegistered ? "default" : "outline"}>
                      {currentUser.biometricRegistered ? "Completed" : "Not Completed"}
                    </Badge>
                  </div>
                  {currentUser.biometricRegistered && mockBiometricData.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Registered: {new Date(mockBiometricData[0].registeredAt || "").toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">Face ID Registration</span>
                    </div>
                    <Badge variant={currentUser.faceIdRegistered ? "default" : "outline"}>
                      {currentUser.faceIdRegistered ? "Completed" : "Not Completed"}
                    </Badge>
                  </div>
                  {currentUser.faceIdRegistered && mockBiometricData.length > 1 && (
                    <div className="text-sm text-muted-foreground">
                      Registered: {new Date(mockBiometricData[1].registeredAt || "").toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium">Document Verification</span>
                    </div>
                    <Badge variant={currentUser.documentVerified ? "default" : "outline"}>
                      {currentUser.documentVerified ? "Completed" : "Not Completed"}
                    </Badge>
                  </div>
                  {currentUser.documentVerified && mockDocumentVerification && (
                    <div className="text-sm text-muted-foreground">
                      {mockDocumentVerification.type} • Verified:{" "}
                      {new Date(mockDocumentVerification.verificationDate || "").toLocaleDateString()}
                    </div>
                  )}
                </div>

                {!currentUser.documentVerified && (
                  <Button onClick={() => router.push("/onboarding")}>Complete Verification</Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Level</CardTitle>
                <CardDescription>Your current access level and features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">
                      {currentUser.accessLevel.level.charAt(0).toUpperCase() + currentUser.accessLevel.level.slice(1)}{" "}
                      Access
                    </h3>
                    <AccessLevelBadge user={currentUser} showTooltip={false} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentUser.accessLevel.level === "full"
                      ? "You have full access to all features including financial services."
                      : currentUser.accessLevel.level === "partial"
                        ? "You have access to most features except financial services."
                        : "You have limited access to basic features."}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Share Credentials</span>
                      <Badge variant={currentUser.accessLevel.features.canShare ? "default" : "destructive"}>
                        {currentUser.accessLevel.features.canShare ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Verify Credentials</span>
                      <Badge variant={currentUser.accessLevel.features.canVerify ? "default" : "destructive"}>
                        {currentUser.accessLevel.features.canVerify ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Offline Support</span>
                      <Badge variant={currentUser.accessLevel.features.offlineSupport ? "default" : "destructive"}>
                        {currentUser.accessLevel.features.offlineSupport ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Metaverse Access</span>
                      <Badge variant={currentUser.accessLevel.features.metaverseAccess ? "default" : "destructive"}>
                        {currentUser.accessLevel.features.metaverseAccess ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Financial Services</span>
                      <Badge variant={currentUser.accessLevel.features.financialAccess ? "default" : "destructive"}>
                        {currentUser.accessLevel.features.financialAccess ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Zero-Knowledge Proofs</span>
                      <Badge variant={currentUser.accessLevel.features.zkpSupport ? "default" : "destructive"}>
                        {currentUser.accessLevel.features.zkpSupport ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {currentUser.accessLevel.level !== "full" && (
                  <Button className="w-full mt-4" onClick={() => router.push("/onboarding")}>
                    Upgrade Access Level
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivityLog.slice(0, 5).map((activity) => (
                  <ActivityLogItem key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab("activity")}>
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockCredentials.map((credential) => (
              <CredentialCard
                key={credential.id}
                credential={credential}
                onShare={handleShareCredential}
                disabled={!canAddCredentials}
              />
            ))}
          </div>

          <Button className="w-full" onClick={() => router.push("/dashboard/credentials")}>
            <FileCheck className="mr-2 h-4 w-4" />
            Manage All Credentials
          </Button>
        </TabsContent>

        <TabsContent value="activity" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Complete history of your actions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivityLog.map((activity) => (
                  <ActivityLogItem key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedCredential && (
        <ShareCredentialDialog
          credential={selectedCredential}
          holderDID={currentUser.did}
          privateKey={currentUser.keyPair.privateKey}
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          zkpEnabled={canUseZkp}
        />
      )}
    </div>
  )
}
