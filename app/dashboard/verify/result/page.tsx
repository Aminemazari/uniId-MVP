"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Check, AlertTriangle, Shield, FileCheck, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mockCredentials } from "@/lib/mock-data"
import { CredentialTrustBadge } from "@/components/credential-trust-badge"
import { TrustScoreIndicator } from "@/components/trust-score-indicator"

export default function VerificationResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean
    message: string
    credentials?: any[]
    verifier?: {
      name: string
      did: string
      trustScore: number
    }
    timestamp?: string
  }>({
    success: false,
    message: "Initializing verification...",
  })

  useEffect(() => {
    // Get verification ID from URL
    const id = searchParams.get("id")

    if (!id) {
      toast({
        title: "Missing verification ID",
        description: "No verification ID was provided",
        variant: "destructive",
      })
      router.push("/dashboard/verify")
      return
    }

    // Simulate verification result
    setTimeout(() => {
      // For demo purposes, we'll simulate a successful verification
      const mockVerifier = {
        name: "Travel Authority",
        did: "did:uniid:9876543210fedcba",
        trustScore: 85,
      }

      // Get random credentials for demo
      const verifiedCredentials = mockCredentials.slice(0, 2)

      setVerificationResult({
        success: true,
        message: "Verification completed successfully",
        credentials: verifiedCredentials,
        verifier: mockVerifier,
        timestamp: new Date().toISOString(),
      })
    }, 1500)
  }, [router, searchParams, toast])

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/verify")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">Verification Result</h2>
        </div>
        <Badge variant={verificationResult.success ? "default" : "destructive"} className="px-3 py-1">
          {verificationResult.success ? "Verified" : "Failed"}
        </Badge>
      </div>

      {!verificationResult.success && !verificationResult.credentials ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
            <p className="text-center text-muted-foreground">Processing verification...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Verification Summary</CardTitle>
              <CardDescription>
                {verificationResult.success
                  ? "The credentials were successfully verified"
                  : "The verification process failed"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {verificationResult.verifier && (
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-2">Verifier Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="text-sm font-medium">{verificationResult.verifier.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">DID</span>
                      <span className="text-sm font-mono">{verificationResult.verifier.did}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Trust Score</span>
                      <div className="w-32">
                        <TrustScoreIndicator score={verificationResult.verifier.trustScore} size="sm" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {verificationResult.timestamp && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Verification Time</span>
                  <span className="text-sm">{new Date(verificationResult.timestamp).toLocaleString()}</span>
                </div>
              )}

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Verified Credentials</h3>
                {verificationResult.credentials && verificationResult.credentials.length > 0 ? (
                  <div className="space-y-3">
                    {verificationResult.credentials.map((credential, index) => (
                      <div key={index} className="rounded-md border overflow-hidden">
                        <div
                          className="p-3 flex justify-between items-center"
                          style={{
                            backgroundColor: credential.display.backgroundColor || "#f3f4f6",
                            color: credential.display.textColor || "inherit",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <FileCheck
                              className="h-4 w-4"
                              style={{ color: credential.display.textColor || "inherit" }}
                            />
                            <span className="font-medium">{credential.display.title}</span>
                          </div>
                          <CredentialTrustBadge
                            trustLevel={credential.trustLevel}
                            crossBorder={credential.crossBorder}
                          />
                        </div>
                        <div className="p-3 bg-background">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Issuer</span>
                              <span className="text-sm">{credential.issuer.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Issuance Date</span>
                              <span className="text-sm">{new Date(credential.issuanceDate).toLocaleDateString()}</span>
                            </div>
                            {credential.expirationDate && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Expiration Date</span>
                                <span className="text-sm">
                                  {new Date(credential.expirationDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>No credentials verified</AlertTitle>
                    <AlertDescription>No credentials were verified in this process.</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push("/dashboard/verify")}>
                <Check className="mr-2 h-4 w-4" />
                Complete Verification
              </Button>
            </CardFooter>
          </Card>

          <Alert className="bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800">
            <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-300">Privacy Protected</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-400">
              Only the minimum required information was shared during this verification process. Your privacy is
              protected.
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  )
}
