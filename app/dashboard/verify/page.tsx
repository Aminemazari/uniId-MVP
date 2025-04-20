"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, QrCode, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VerifyPage() {
  const [verificationState, setVerificationState] = useState("idle") // idle, scanning, success, failed
  const [verifiedCredential, setVerifiedCredential] = useState(null)

  const handleStartScan = () => {
    setVerificationState("scanning")

    // Simulate scanning process
    setTimeout(() => {
      // For demo purposes, randomly succeed or fail
      const success = Math.random() > 0.3

      if (success) {
        setVerificationState("success")
        setVerifiedCredential({
          type: "education",
          title: "Bachelor of Computer Science",
          issuer: "University of Technology",
          issuedTo: "Alex Lee",
          issueDate: "2022-05-15",
          expiryDate: "2032-05-15",
          status: "Valid",
        })
      } else {
        setVerificationState("failed")
      }
    }, 2000)
  }

  const handleReset = () => {
    setVerificationState("idle")
    setVerifiedCredential(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verify Credentials</CardTitle>
            <CardDescription>Scan a QR code to verify a UniID credential</CardDescription>
          </CardHeader>

          <Tabs defaultValue="scan" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scan">Scan QR</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="scan" className="p-4">
              <div className="flex flex-col items-center">
                {verificationState === "idle" && (
                  <>
                    <div className="bg-gray-100 rounded-lg p-8 mb-6 w-full max-w-xs flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-gray-400" />
                    </div>
                    <p className="text-center text-gray-600 mb-6">
                      Position the QR code in the center of the camera view
                    </p>
                    <Button onClick={handleStartScan} className="w-full bg-purple-600 hover:bg-purple-700">
                      Start Camera
                    </Button>
                  </>
                )}

                {verificationState === "scanning" && (
                  <>
                    <div className="bg-gray-100 rounded-lg p-8 mb-6 w-full max-w-xs flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-scan"></div>
                      <QrCode className="h-24 w-24 text-gray-800" />
                    </div>
                    <div className="flex items-center gap-2 text-purple-600 mb-6">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Scanning...</span>
                    </div>
                    <Button onClick={handleReset} variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </>
                )}

                {verificationState === "success" && (
                  <>
                    <div className="bg-green-50 rounded-full p-4 mb-6">
                      <Check className="h-12 w-12 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-700 mb-2">Verification Successful</h3>
                    <p className="text-center text-gray-600 mb-6">The credential has been verified successfully</p>

                    {verifiedCredential && (
                      <div className="bg-white border rounded-lg p-4 w-full mb-6">
                        <h4 className="font-medium mb-3">{verifiedCredential.title}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Issued to:</span>
                            <span>{verifiedCredential.issuedTo}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Issuer:</span>
                            <span>{verifiedCredential.issuer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Issue Date:</span>
                            <span>{new Date(verifiedCredential.issueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Expiry Date:</span>
                            <span>{new Date(verifiedCredential.expiryDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Status:</span>
                            <span className="text-green-600">{verifiedCredential.status}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button onClick={handleReset} className="w-full bg-purple-600 hover:bg-purple-700">
                      Verify Another
                    </Button>
                  </>
                )}

                {verificationState === "failed" && (
                  <>
                    <div className="bg-red-50 rounded-full p-4 mb-6">
                      <X className="h-12 w-12 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-red-700 mb-2">Verification Failed</h3>
                    <p className="text-center text-gray-600 mb-6">Unable to verify the credential. Please try again.</p>
                    <Button onClick={handleReset} className="w-full bg-purple-600 hover:bg-purple-700">
                      Try Again
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="p-4">
              <div className="flex flex-col items-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 w-full flex flex-col items-center justify-center">
                  <div className="bg-gray-100 rounded-full p-3 mb-4">
                    <QrCode className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-center text-gray-600 mb-2">Drag and drop a QR code image here</p>
                  <p className="text-center text-gray-400 text-sm mb-4">or click to browse files</p>
                  <Button variant="outline" size="sm">
                    Browse Files
                  </Button>
                </div>
                <Button disabled className="w-full bg-purple-600 hover:bg-purple-700">
                  Verify
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <CardFooter className="flex flex-col text-center text-sm text-gray-500 pt-0">
            <p>UniID uses cryptographic verification to ensure the authenticity of credentials.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
