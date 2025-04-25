"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Fingerprint, Check, AlertTriangle, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getUserData, storeUserData } from "@/lib/storage-utils"
import { updateVerificationStatus, getAccessLevel, calculateTrustScore } from "@/lib/access-control"
import { FaceIdCapture } from "@/components/face-id-capture"
import { DocumentUpload } from "@/components/document-upload"

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [biometricRegistered, setBiometricRegistered] = useState(false)
  const [faceIdRegistered, setFaceIdRegistered] = useState(false)
  const [documentUploaded, setDocumentUploaded] = useState(false)
  const [processingBiometric, setProcessingBiometric] = useState(false)
  const [processingFaceId, setProcessingFaceId] = useState(false)
  const [processingDocument, setProcessingDocument] = useState(false)
  const totalSteps = 3

  // Load user data
  useEffect(() => {
    const userData = getUserData("temp-encryption-key")
    if (userData) {
      setBiometricRegistered(userData.biometricRegistered || false)
      setFaceIdRegistered(userData.faceIdRegistered || false)
      setDocumentUploaded(userData.documentVerified || false)

      // If user has already completed some steps, start at the appropriate step
      if (userData.biometricRegistered && !userData.faceIdRegistered) {
        setStep(2)
      } else if (userData.biometricRegistered && userData.faceIdRegistered && !userData.documentVerified) {
        setStep(3)
      }
    }
  }, [])

  const handleBiometricRegistration = (success: boolean) => {
    if (success) {
      setBiometricRegistered(true)

      // Update user data
      const userData = getUserData("temp-encryption-key")
      if (userData) {
        const updatedUser = {
          ...userData,
          biometricRegistered: true,
          verificationStatus: updateVerificationStatus(
            userData,
            true,
            userData.faceIdRegistered,
            userData.documentVerified,
          ),
        }

        // Recalculate trust score and access level
        updatedUser.trustScore = calculateTrustScore(
          updatedUser.verificationStatus,
          true,
          userData.faceIdRegistered,
          userData.documentVerified,
          0,
          0,
        )
        updatedUser.accessLevel = getAccessLevel(updatedUser)

        storeUserData(updatedUser, "temp-encryption-key")
      }
    }
  }

  const handleFaceIdCapture = (success: boolean) => {
    if (success) {
      setFaceIdRegistered(true)

      // Update user data
      const userData = getUserData("temp-encryption-key")
      if (userData) {
        const updatedUser = {
          ...userData,
          faceIdRegistered: true,
          verificationStatus: updateVerificationStatus(
            userData,
            userData.biometricRegistered,
            true,
            userData.documentVerified,
          ),
        }

        // Recalculate trust score and access level
        updatedUser.trustScore = calculateTrustScore(
          updatedUser.verificationStatus,
          userData.biometricRegistered,
          true,
          userData.documentVerified,
          0,
          0,
        )
        updatedUser.accessLevel = getAccessLevel(updatedUser)

        storeUserData(updatedUser, "temp-encryption-key")
      }
    }
  }

  const handleDocumentUpload = (success: boolean) => {
    if (success) {
      setDocumentUploaded(true)

      // Update user data
      const userData = getUserData("temp-encryption-key")
      if (userData) {
        const updatedUser = {
          ...userData,
          documentVerified: true,
          verificationStatus: updateVerificationStatus(
            userData,
            userData.biometricRegistered,
            userData.faceIdRegistered,
            true,
          ),
        }

        // Recalculate trust score and access level
        updatedUser.trustScore = calculateTrustScore(
          updatedUser.verificationStatus,
          userData.biometricRegistered,
          userData.faceIdRegistered,
          true,
          0,
          0,
        )
        updatedUser.accessLevel = getAccessLevel(updatedUser)

        storeUserData(updatedUser, "temp-encryption-key")

        toast({
          title: "Document verification successful",
          description: "You now have full access to all features including financial services",
        })
      }
    }
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      setLoading(true)

      // Update user verification status
      const userData = getUserData("temp-encryption-key")
      if (userData) {
        const updatedUser = {
          ...userData,
          verificationStatus: updateVerificationStatus(
            userData,
            biometricRegistered,
            faceIdRegistered,
            documentUploaded,
          ),
          verificationDate: new Date().toISOString(),
          biometricRegistered,
          faceIdRegistered,
          documentVerified: documentUploaded,
        }

        // Recalculate trust score and access level
        updatedUser.trustScore = calculateTrustScore(
          updatedUser.verificationStatus,
          biometricRegistered,
          faceIdRegistered,
          documentUploaded,
          0,
          0,
        )
        updatedUser.accessLevel = getAccessLevel(updatedUser)

        storeUserData(updatedUser, "temp-encryption-key")
      }

      // Simulate completion process
      setTimeout(() => {
        setLoading(false)
        toast({
          title: "Onboarding complete",
          description: documentUploaded
            ? "Your identity has been fully verified and your wallet is ready to use with full access to financial services"
            : "Your identity has been partially verified. Financial services access requires document verification.",
        })
        router.push("/dashboard")
      }, 1500)
    }
  }

  const handleSkip = () => {
    // Only allow skipping if biometric and face ID are registered
    if (!biometricRegistered || !faceIdRegistered) {
      toast({
        title: "Cannot skip",
        description: "Biometric and Face ID registration are required to create your account",
        variant: "destructive",
      })
      return
    }

    // Update user data with current verification state
    const userData = getUserData("temp-encryption-key")
    if (userData) {
      const updatedUser = {
        ...userData,
        verificationStatus: updateVerificationStatus(userData, biometricRegistered, faceIdRegistered, documentUploaded),
        biometricRegistered,
        faceIdRegistered,
        documentVerified: documentUploaded,
      }

      // Recalculate trust score and access level
      updatedUser.trustScore = calculateTrustScore(
        updatedUser.verificationStatus,
        biometricRegistered,
        faceIdRegistered,
        documentUploaded,
        0,
        0,
      )
      updatedUser.accessLevel = getAccessLevel(updatedUser)

      storeUserData(updatedUser, "temp-encryption-key")
    }

    toast({
      title: "Limited access mode",
      description: "Financial services are restricted without document verification",
      variant: "warning",
    })
    router.push("/dashboard")
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Identity Verification</CardTitle>
          <CardDescription>
            Step {step} of {totalSteps}
          </CardDescription>
          <Progress value={(step / totalSteps) * 100} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Biometric Registration</h3>
              <p className="text-sm text-muted-foreground">
                Register your biometric data to secure your identity wallet. This data is stored only on your device.
              </p>
              <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8">
                {biometricRegistered ? (
                  <div className="flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="mt-4 text-center text-sm font-medium text-green-600">
                      Biometric registration complete
                    </p>
                  </div>
                ) : (
                  <>
                    <Fingerprint className="h-12 w-12 text-muted-foreground" />
                    <p className="text-center text-sm text-muted-foreground">
                      Tap to scan your fingerprint or use facial recognition
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setProcessingBiometric(true)
                        // Simulate biometric registration
                        setTimeout(() => {
                          handleBiometricRegistration(true)
                          setProcessingBiometric(false)
                        }, 2000)
                      }}
                      disabled={processingBiometric}
                    >
                      <Fingerprint className="mr-2 h-4 w-4" />
                      {processingBiometric ? "Processing..." : "Start Biometric Scan"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Face ID Registration</h3>
              <p className="text-sm text-muted-foreground">
                Register your face ID for enhanced security and verification. This is required for full access.
              </p>

              {!biometricRegistered && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Biometric registration required</AlertTitle>
                  <AlertDescription>
                    You must complete biometric registration before proceeding with face ID registration.
                  </AlertDescription>
                </Alert>
              )}

              {biometricRegistered && (
                <div className="rounded-lg border border-dashed p-4">
                  {faceIdRegistered ? (
                    <div className="flex flex-col items-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="mt-4 text-center text-sm font-medium text-green-600">
                        Face ID registration complete
                      </p>
                    </div>
                  ) : (
                    <FaceIdCapture
                      onCapture={handleFaceIdCapture}
                      processing={processingFaceId}
                      setProcessing={setProcessingFaceId}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Document Verification</h3>
              <p className="text-sm text-muted-foreground">
                Upload an official ID document to verify your identity. This is required for financial services access.
              </p>

              <Alert variant="warning">
                <Building className="h-4 w-4" />
                <AlertTitle>Financial Services Access</AlertTitle>
                <AlertDescription>
                  Document verification is required to access financial services. Without verified documents, your
                  access will be limited.
                </AlertDescription>
              </Alert>

              {!faceIdRegistered && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Face ID registration required</AlertTitle>
                  <AlertDescription>
                    You must complete face ID registration before proceeding with document verification.
                  </AlertDescription>
                </Alert>
              )}

              {faceIdRegistered && (
                <div className="rounded-lg border border-dashed p-4">
                  {documentUploaded ? (
                    <div className="flex flex-col items-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="mt-4 text-center text-sm font-medium text-green-600">
                        Document verification complete
                      </p>
                      <p className="text-center text-sm text-green-600">
                        You now have full access to all features including financial services
                      </p>
                    </div>
                  ) : (
                    <DocumentUpload
                      onUpload={handleDocumentUpload}
                      processing={processingDocument}
                      setProcessing={setProcessingDocument}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            onClick={handleNext}
            className="w-full"
            disabled={
              loading ||
              (step === 1 && !biometricRegistered) ||
              (step === 2 && !faceIdRegistered) ||
              (step === 3 && !documentUploaded && faceIdRegistered) ||
              processingBiometric ||
              processingFaceId ||
              processingDocument
            }
          >
            {loading ? "Processing..." : step < totalSteps ? "Next Step" : "Complete Verification"}
          </Button>
          {step === 3 && (
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="w-full"
              disabled={loading || !biometricRegistered || !faceIdRegistered}
            >
              Skip document verification (Limited Access)
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
