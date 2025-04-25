"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileCheck,
  Share2,
  ArrowLeft,
  Clock,
  AlertTriangle,
  Check,
  Globe,
  Shield,
  Download,
  Smartphone,
  Lock,
  QrCode,
} from "lucide-react"
import { ShareCredentialDialog } from "@/components/share-credential-dialog"
import { CredentialTrustBadge } from "@/components/credential-trust-badge"
import { useToast } from "@/hooks/use-toast"
import { getUserData } from "@/lib/storage-utils"
import { canAccessFeature, getFeatureLimitationMessage } from "@/lib/access-control"
import { isCredentialExpired, isCredentialRevoked } from "@/lib/credential-utils"
import type { User, VerifiableCredential } from "@/lib/types"
import { mockUser, mockUserLimited, mockUserPartial, mockCredentials } from "@/lib/mock-data"

export default function CredentialDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [credential, setCredential] = useState<VerifiableCredential | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User>(mockUser)
  const [activeTab, setActiveTab] = useState("details")

  // Load user data and credential
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

    // Find credential by ID
    const id = params.id as string
    const foundCredential = mockCredentials.find((cred) => cred.id.includes(id))

    if (foundCredential) {
      setCredential(foundCredential)
    } else {
      toast({
        title: "Credential not found",
        description: "The requested credential could not be found",
        variant: "destructive",
      })
      router.push("/dashboard/credentials")
    }
  }, [params.id, router, toast])

  const canShareCredentials = canAccessFeature(currentUser, "canShare")
  const canUseZkp = canAccessFeature(currentUser, "zkpSupport")
  const limitedAccessMessage = getFeatureLimitationMessage(currentUser, "canShare")

  const handleShare = () => {
    if (!canShareCredentials) {
      toast({
        title: "Access Restricted",
        description: limitedAccessMessage,
        variant: "destructive",
      })
      return
    }

    if (credential) {
      setShareDialogOpen(true)
    }
  }

  const getStatusBadge = () => {
    if (!credential) return null

    if (isCredentialExpired(credential)) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Expired
        </Badge>
      )
    } else if (isCredentialRevoked(credential)) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Revoked
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Check className="h-3 w-3" />
          Active
        </Badge>
      )
    }
  }

  if (!credential) {
    return (
      <div className="container flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading credential...</p>
        </div>
      </div>
    )
  }

  const isExpired = isCredentialExpired(credential)
  const isRevoked = isCredentialRevoked(credential)
  const isInactive = isExpired || isRevoked

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/credentials")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">Credential Details</h2>
        </div>
        <Button onClick={handleShare} disabled={isInactive || !canShareCredentials}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      {isInactive && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{isExpired ? "Expired Credential" : "Revoked Credential"}</AlertTitle>
          <AlertDescription>
            {isExpired
              ? "This credential has expired and can no longer be used for verification."
              : "This credential has been revoked by the issuer and is no longer valid."}
          </AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden">
        <div
          className="p-6"
          style={{
            backgroundColor: credential.display.backgroundColor || "#f3f4f6",
            color: credential.display.textColor || "inherit",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCheck className="h-8 w-8" style={{ color: credential.display.textColor || "inherit" }} />
              <div>
                <h3 className="text-xl font-bold">{credential.display.title}</h3>
                <p className="text-sm opacity-90">{credential.display.description}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {getStatusBadge()}
              <CredentialTrustBadge trustLevel={credential.trustLevel} crossBorder={credential.crossBorder} />
            </div>
          </div>
        </div>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="px-6 pt-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="p-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Issuer</h4>
                  <p className="font-medium">{credential.issuer.name}</p>
                  {credential.issuer.country && (
                    <p className="text-sm text-muted-foreground">Country: {credential.issuer.country}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                  <p className="font-medium capitalize">{credential.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Issuance Date</h4>
                  <p className="font-medium">{new Date(credential.issuanceDate).toLocaleDateString()}</p>
                </div>
                {credential.expirationDate && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Expiration Date</h4>
                    <p className="font-medium">{new Date(credential.expirationDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Credential ID</h4>
                <p className="text-sm font-mono break-all">{credential.id}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Issuer DID</h4>
                <p className="text-sm font-mono break-all">{credential.issuer.id}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Subject DID</h4>
                <p className="text-sm font-mono break-all">{credential.credentialSubject.id}</p>
              </div>

              {credential.crossBorder && (
                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800">
                  <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertTitle className="text-blue-800 dark:text-blue-300">Cross-Border Credential</AlertTitle>
                  <AlertDescription className="text-blue-700 dark:text-blue-400">
                    This credential is recognized across international borders and can be used for verification
                    globally.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="claims" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Credential Claims</h3>
              <p className="text-sm text-muted-foreground">
                These are the claims contained in this credential that can be shared during verification.
              </p>

              <div className="rounded-md border">
                <div className="bg-muted px-4 py-2 rounded-t-md">
                  <h4 className="font-medium">Claim Data</h4>
                </div>
                <div className="p-4 space-y-3">
                  {Object.entries(credential.credentialSubject)
                    .filter(([key]) => key !== "id")
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between items-start border-b pb-2 last:border-0 last:pb-0">
                        <span className="font-medium">{key}</span>
                        <span className="text-sm text-muted-foreground max-w-[50%] text-right break-words">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {canUseZkp && (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-800 dark:text-green-300">
                    Zero-Knowledge Proofs Available
                  </AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    You can share this credential using zero-knowledge proofs to reveal only specific information
                    without exposing all data.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="verification" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Verification Options</h3>
              <p className="text-sm text-muted-foreground">
                These are the ways you can share and verify this credential.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">QR Code Sharing</CardTitle>
                    <CardDescription>Share via QR code</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <div className="h-32 w-32 bg-muted flex items-center justify-center rounded-md">
                        <QrCode className="h-16 w-16 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={handleShare}
                      disabled={isInactive || !canShareCredentials}
                    >
                      {!canShareCredentials ? (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Access Restricted
                        </>
                      ) : (
                        <>
                          <QrCode className="mr-2 h-4 w-4" />
                          Generate QR Code
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">NFC Sharing</CardTitle>
                    <CardDescription>Share via NFC tap</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <div className="h-32 w-32 bg-muted flex items-center justify-center rounded-md">
                        <Smartphone className="h-16 w-16 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline" disabled={isInactive || !canShareCredentials}>
                      {!canShareCredentials ? (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Access Restricted
                        </>
                      ) : (
                        <>
                          <Smartphone className="mr-2 h-4 w-4" />
                          Enable NFC Sharing
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Download Credential</CardTitle>
                  <CardDescription>Download this credential for offline use</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    You can download this credential in various formats for offline use or backup purposes.
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 sm:flex-row">
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download as JSON
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download as PDF
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {credential && (
        <ShareCredentialDialog
          credential={credential}
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
