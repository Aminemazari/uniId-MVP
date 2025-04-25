"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { QrCode, Smartphone, AlertTriangle, Share2, BadgeCheck, ShieldCheck, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { generateSelectiveDisclosureProof, generateCredentialOwnershipProof } from "@/lib/zkp-utils"
import { mockCredentials, mockUser } from "@/lib/mock-data"

export default function VerifyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("qr")
  const [qrGenerated, setQrGenerated] = useState(false)
  const [zkpGenerated, setZkpGenerated] = useState(false)
  const [selectedFields, setSelectedFields] = useState({
    fullName: true,
    dateOfBirth: true,
    idNumber: true,
    photo: true,
    address: false,
    nationality: false,
  })

  // Generate QR code with ZKP
  const generateQRWithZKP = () => {
    // Simulate generating a ZKP for the ID
    const privateKey = mockUser.privateKey || "mock-private-key"
    const credentialId = mockCredentials[0].id

    // Generate credential ownership proof
    const ownershipProof = generateCredentialOwnershipProof(credentialId, mockUser.did, privateKey)

    // Generate selective disclosure proof for the selected fields
    const attributes = Object.keys(selectedFields).filter((key) => selectedFields[key as keyof typeof selectedFields])
    const values = attributes.map((attr) => {
      switch (attr) {
        case "fullName":
          return mockUser.name
        case "dateOfBirth":
          return mockUser.dateOfBirth
        case "idNumber":
          return mockUser.idNumber
        case "photo":
          return "photo_data_hash"
        case "address":
          return mockUser.address
        case "nationality":
          return mockUser.nationality
        default:
          return ""
      }
    })

    const disclosureProof = generateSelectiveDisclosureProof(credentialId, attributes, values, privateKey)

    // Set states to show QR is generated with ZKP
    setQrGenerated(true)
    setZkpGenerated(true)

    toast({
      title: "ZKP Generated",
      description: "Zero-Knowledge Proof has been generated for your ID",
    })
  }

  // Toggle field selection
  const toggleField = (field: keyof typeof selectedFields) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))

    // Reset QR when fields change
    if (qrGenerated) {
      setQrGenerated(false)
      setZkpGenerated(false)
    }
  }

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Share ID</h2>
        </div>
      </div>

      <Tabs defaultValue="qr" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="qr">QR Code</TabsTrigger>
          <TabsTrigger value="nfc">NFC</TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Share Your ID with Zero-Knowledge Proof</CardTitle>
              <CardDescription>
                Generate a QR code with ZKP to securely share your ID without revealing unnecessary information
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              {qrGenerated ? (
                <div className="flex flex-col items-center">
                  <div className="h-48 w-48 border-2 border-primary rounded-lg flex items-center justify-center mb-6 relative">
                    <QrCode className="h-24 w-24 text-primary" />
                    {zkpGenerated && (
                      <div className="absolute bottom-2 right-2 bg-primary text-white rounded-full p-1">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-6">
                    <Badge variant="outline" className="bg-primary/10">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      ZKP Protected
                    </Badge>
                    <Badge variant="outline">Expires in 5:00</Badge>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQrGenerated(false)
                      setZkpGenerated(false)
                    }}
                    className="mb-4"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate New QR
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                    <QrCode className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-center text-muted-foreground mb-6">
                    Generate a QR code with Zero-Knowledge Proof to share your ID securely
                  </p>
                  <Button onClick={generateQRWithZKP} className="mb-4">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Generate ZKP QR Code
                  </Button>
                </div>
              )}

              <div className="w-full max-w-md border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Select information to share:</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${selectedFields.fullName ? "border-primary bg-primary/5" : "border-muted"}`}
                    onClick={() => toggleField("fullName")}
                  >
                    <div
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center ${selectedFields.fullName ? "bg-primary border-primary" : "border-muted-foreground"}`}
                    >
                      {selectedFields.fullName && <BadgeCheck className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm">Full Name</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${selectedFields.dateOfBirth ? "border-primary bg-primary/5" : "border-muted"}`}
                    onClick={() => toggleField("dateOfBirth")}
                  >
                    <div
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center ${selectedFields.dateOfBirth ? "bg-primary border-primary" : "border-muted-foreground"}`}
                    >
                      {selectedFields.dateOfBirth && <BadgeCheck className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm">Date of Birth</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${selectedFields.idNumber ? "border-primary bg-primary/5" : "border-muted"}`}
                    onClick={() => toggleField("idNumber")}
                  >
                    <div
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center ${selectedFields.idNumber ? "bg-primary border-primary" : "border-muted-foreground"}`}
                    >
                      {selectedFields.idNumber && <BadgeCheck className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm">ID Number</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${selectedFields.photo ? "border-primary bg-primary/5" : "border-muted"}`}
                    onClick={() => toggleField("photo")}
                  >
                    <div
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center ${selectedFields.photo ? "bg-primary border-primary" : "border-muted-foreground"}`}
                    >
                      {selectedFields.photo && <BadgeCheck className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm">Photo</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${selectedFields.address ? "border-primary bg-primary/5" : "border-muted"}`}
                    onClick={() => toggleField("address")}
                  >
                    <div
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center ${selectedFields.address ? "bg-primary border-primary" : "border-muted-foreground"}`}
                    >
                      {selectedFields.address && <BadgeCheck className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm">Address</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${selectedFields.nationality ? "border-primary bg-primary/5" : "border-muted"}`}
                    onClick={() => toggleField("nationality")}
                  >
                    <div
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center ${selectedFields.nationality ? "bg-primary border-primary" : "border-muted-foreground"}`}
                    >
                      {selectedFields.nationality && <BadgeCheck className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm">Nationality</span>
                  </div>
                </div>
              </div>
            </CardContent>
            {qrGenerated && (
              <CardFooter className="flex flex-col items-start gap-2 border-t px-6 py-4">
                <h3 className="text-sm font-medium">Shared with Zero-Knowledge Proof:</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedFields).map(
                    ([key, value]) =>
                      value && (
                        <Badge key={key} variant="outline" className="flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3 text-primary" />
                          {key === "fullName"
                            ? "Full Name"
                            : key === "dateOfBirth"
                              ? "Date of Birth"
                              : key === "idNumber"
                                ? "ID Number"
                                : key === "photo"
                                  ? "Photo"
                                  : key === "address"
                                    ? "Address"
                                    : "Nationality"}
                        </Badge>
                      ),
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Zero-Knowledge Proof allows you to prove the validity of your ID without revealing the actual data
                </p>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="nfc" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Share via NFC with Zero-Knowledge Proof</CardTitle>
              <CardDescription>Share your ID by tapping your device to another NFC-enabled device</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                <Smartphone className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-center text-muted-foreground mb-6">
                Tap your device to another NFC-enabled device to share your ID with Zero-Knowledge Proof
              </p>
              <Alert variant="warning" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>NFC Support</AlertTitle>
                <AlertDescription>
                  NFC sharing requires a device with NFC capabilities. Make sure NFC is enabled on your device.
                </AlertDescription>
              </Alert>
              <Button>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Start NFC Sharing with ZKP
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 border-t px-6 py-4">
              <h3 className="text-sm font-medium">Shared with Zero-Knowledge Proof:</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedFields).map(
                  ([key, value]) =>
                    value && (
                      <Badge key={key} variant="outline" className="flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-primary" />
                        {key === "fullName"
                          ? "Full Name"
                          : key === "dateOfBirth"
                            ? "Date of Birth"
                            : key === "idNumber"
                              ? "ID Number"
                              : key === "photo"
                                ? "Photo"
                                : key === "address"
                                  ? "Address"
                                  : "Nationality"}
                      </Badge>
                    ),
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Zero-Knowledge Proof allows you to prove the validity of your ID without revealing the actual data
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
