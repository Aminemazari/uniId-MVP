"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Plus,
  QrCode,
  FileCheck,
  AlertTriangle,
  RefreshCw,
  CalendarIcon,
  Upload,
  X,
  Info,
  Check,
  HelpCircle,
} from "lucide-react"
import { QRScanner } from "@/components/qr-scanner"
import { useToast } from "@/hooks/use-toast"
import { getUserData } from "@/lib/storage-utils"
import { canAccessFeature, getFeatureLimitationMessage } from "@/lib/access-control"
import type { User } from "@/lib/types"
import { mockUser, mockUserLimited, mockUserPartial } from "@/lib/mock-data"

export default function AddCredentialPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("manual")
  const [activeStep, setActiveStep] = useState(1)
  const [scanning, setScanning] = useState(false)
  const [issuanceInProgress, setIssuanceInProgress] = useState(false)
  const [selectedIssuer, setSelectedIssuer] = useState("")
  const [credentialType, setCredentialType] = useState("")
  const [currentUser, setCurrentUser] = useState<User>(mockUser)

  // Form state
  const [formData, setFormData] = useState({
    credentialName: "",
    issuerName: "",
    issuerDid: "",
    description: "",
    issuanceDate: new Date(),
    expirationDate: null as Date | null,
    trustLevel: "medium" as "low" | "medium" | "high" | "verified",
    backgroundColor: "#4338ca",
    textColor: "#ffffff",
    category: "",
    claims: {} as Record<string, string>,
    documentFile: null as File | null,
    logoFile: null as File | null,
    isSelfIssued: false,
  })

  // Dynamic claims fields
  const [claimFields, setClaimFields] = useState<{ id: string; name: string; value: string }[]>([
    { id: "claim-1", name: "", value: "" },
  ])

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

  const canAddCredentials = canAccessFeature(currentUser, "canShare")
  const limitedAccessMessage = getFeatureLimitationMessage(currentUser, "canShare")

  const handleScan = (data: string) => {
    try {
      // In a real app, this would properly decrypt and validate the QR data
      const parsedData = JSON.parse(data)

      setScanning(false)
      setIssuanceInProgress(true)

      // Simulate credential issuance process
      setTimeout(() => {
        setIssuanceInProgress(false)

        toast({
          title: "Credential Added",
          description: "New credential has been added to your wallet",
        })

        router.push("/dashboard/credentials")
      }, 2000)
    } catch (error) {
      setScanning(false)

      toast({
        title: "Invalid QR Code",
        description: "The scanned QR code is not a valid credential issuance request",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleClaimChange = (id: string, field: "name" | "value", value: string) => {
    setClaimFields((prev) => prev.map((claim) => (claim.id === id ? { ...claim, [field]: value } : claim)))
  }

  const addClaimField = () => {
    setClaimFields((prev) => [...prev, { id: `claim-${prev.length + 1}`, name: "", value: "" }])
  }

  const removeClaimField = (id: string) => {
    if (claimFields.length > 1) {
      setClaimFields((prev) => prev.filter((claim) => claim.id !== id))
    }
  }

  const handleFileChange = (field: "documentFile" | "logoFile", file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }))
  }

  const handleNextStep = () => {
    // Validate current step
    if (activeStep === 1) {
      if (!formData.credentialName || !formData.category) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }
    } else if (activeStep === 2) {
      // Validate issuer information
      if (!formData.isSelfIssued && !formData.issuerName) {
        toast({
          title: "Missing information",
          description: "Please provide issuer information",
          variant: "destructive",
        })
        return
      }
    }

    setActiveStep((prev) => Math.min(prev + 1, 4))
  }

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    // Convert claim fields to claims object
    const claims = claimFields.reduce(
      (acc, claim) => {
        if (claim.name && claim.value) {
          acc[claim.name] = claim.value
        }
        return acc
      },
      {} as Record<string, string>,
    )

    // Update form data with claims
    setFormData((prev) => ({
      ...prev,
      claims,
    }))

    setIssuanceInProgress(true)

    // Simulate credential creation process
    setTimeout(() => {
      setIssuanceInProgress(false)

      toast({
        title: "Credential Created",
        description: "Your new credential has been added to your wallet",
      })

      router.push("/dashboard/credentials")
    }, 2000)
  }

  if (!canAddCredentials) {
    return (
      <div className="container space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Add Credential</h2>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Restricted</AlertTitle>
          <AlertDescription>{limitedAccessMessage}</AlertDescription>
        </Alert>

        <Button onClick={() => router.push("/dashboard/credentials")}>Return to Credentials</Button>
      </div>
    )
  }

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plus className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Add New Credential</h2>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/credentials")}>
          Cancel
        </Button>
      </div>

      <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="scan">Scan QR Code</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="mt-6 space-y-4">
          {scanning ? (
            <QRScanner onScan={handleScan} onClose={() => setScanning(false)} />
          ) : issuanceInProgress ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                </div>
                <h3 className="text-xl font-bold mb-2">Processing Credential</h3>
                <p className="text-center text-muted-foreground mb-6">
                  Please wait while we verify and add your credential to your wallet...
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Scan Credential QR Code</CardTitle>
                <CardDescription>Scan a QR code from an issuer to add a credential to your wallet</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                  <QrCode className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-center text-muted-foreground mb-6">
                  Position the QR code within the scanner frame to add a credential
                </p>
                <Button onClick={() => setScanning(true)}>
                  <QrCode className="mr-2 h-4 w-4" />
                  Start Scanning
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manual" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Add Credential Manually</CardTitle>
                  <CardDescription>Fill in the details to add a new credential to your wallet</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Step {activeStep} of 4</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {activeStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="credential-name">
                      Credential Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="credential-name"
                      placeholder="e.g., University Degree, National ID"
                      value={formData.credentialName}
                      onChange={(e) => handleInputChange("credentialName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credential-category">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger id="credential-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="identity">Identity</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="employment">Employment</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="membership">Membership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credential-description">Description</Label>
                    <Textarea
                      id="credential-description"
                      placeholder="Brief description of this credential"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Credential Type</Label>
                      <div className="flex items-center">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-auto p-0">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">About Self-Issued Credentials</h4>
                              <p className="text-sm text-muted-foreground">
                                Self-issued credentials are created by you and are not verified by a third party. They
                                can be useful for personal records but may not be accepted by verifiers.
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <RadioGroup
                      defaultValue="third-party"
                      value={formData.isSelfIssued ? "self-issued" : "third-party"}
                      onValueChange={(value) => handleInputChange("isSelfIssued", value === "self-issued")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="third-party" id="third-party" />
                        <Label htmlFor="third-party">Third-Party Issued</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="self-issued" id="self-issued" />
                        <Label htmlFor="self-issued">Self-Issued</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Issuer Information</h3>

                  {!formData.isSelfIssued ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="issuer-name">
                          Issuer Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="issuer-name"
                          placeholder="e.g., University of Example, Government Authority"
                          value={formData.issuerName}
                          onChange={(e) => handleInputChange("issuerName", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="issuer-did">Issuer DID (optional)</Label>
                        <Input
                          id="issuer-did"
                          placeholder="did:example:123456789abcdefghi"
                          value={formData.issuerDid}
                          onChange={(e) => handleInputChange("issuerDid", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          The Decentralized Identifier of the issuing authority
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="trust-level">Trust Level</Label>
                        <Select
                          value={formData.trustLevel}
                          onValueChange={(value: "low" | "medium" | "high" | "verified") =>
                            handleInputChange("trustLevel", value)
                          }
                        >
                          <SelectTrigger id="trust-level">
                            <SelectValue placeholder="Select trust level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Self-Issued Credential</AlertTitle>
                      <AlertDescription>
                        This credential will be marked as self-issued. You are listed as both the subject and issuer.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="issuance-date">Issuance Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.issuanceDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.issuanceDate ? format(formData.issuanceDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.issuanceDate}
                            onSelect={(date) => handleInputChange("issuanceDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiration-date">Expiration Date (optional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.expirationDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.expirationDate ? (
                              format(formData.expirationDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.expirationDate || undefined}
                            onSelect={(date) => handleInputChange("expirationDate", date)}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Credential Claims</h3>
                  <p className="text-sm text-muted-foreground">
                    Add the specific claims or attributes that this credential verifies
                  </p>

                  {claimFields.map((claim, index) => (
                    <div key={claim.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                      <div className="space-y-2">
                        <Label htmlFor={`claim-name-${claim.id}`}>Claim Name</Label>
                        <Input
                          id={`claim-name-${claim.id}`}
                          placeholder="e.g., firstName, degree, licenseNumber"
                          value={claim.name}
                          onChange={(e) => handleClaimChange(claim.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 relative">
                        <Label htmlFor={`claim-value-${claim.id}`}>Value</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`claim-value-${claim.id}`}
                            placeholder="e.g., John, Bachelor of Science, 12345"
                            value={claim.value}
                            onChange={(e) => handleClaimChange(claim.id, "value", e.target.value)}
                          />
                          {claimFields.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              type="button"
                              onClick={() => removeClaimField(claim.id)}
                              className="h-10 w-10 shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addClaimField} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Claim
                  </Button>
                </div>
              )}

              {activeStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Display & Files</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="background-color">Background Color</Label>
                      <div className="flex gap-2">
                        <div
                          className="h-10 w-10 rounded-md border"
                          style={{ backgroundColor: formData.backgroundColor }}
                        />
                        <Input
                          id="background-color"
                          type="color"
                          value={formData.backgroundColor}
                          onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
                          className="w-full h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="text-color">Text Color</Label>
                      <div className="flex gap-2">
                        <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: formData.textColor }} />
                        <Input
                          id="text-color"
                          type="color"
                          value={formData.textColor}
                          onChange={(e) => handleInputChange("textColor", e.target.value)}
                          className="w-full h-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Document File (optional)</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="document-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 10MB)</p>
                        </div>
                        <input
                          id="document-file"
                          type="file"
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            handleFileChange("documentFile", file)
                          }}
                        />
                      </label>
                    </div>
                    {formData.documentFile && (
                      <div className="flex items-center justify-between p-2 mt-2 rounded-md bg-muted">
                        <span className="text-sm truncate">{formData.documentFile.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleFileChange("documentFile", null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Logo (optional)</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="logo-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, SVG (MAX. 2MB)</p>
                        </div>
                        <input
                          id="logo-file"
                          type="file"
                          className="hidden"
                          accept=".png,.jpg,.jpeg,.svg"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            handleFileChange("logoFile", file)
                          }}
                        />
                      </label>
                    </div>
                    {formData.logoFile && (
                      <div className="flex items-center justify-between p-2 mt-2 rounded-md bg-muted">
                        <span className="text-sm truncate">{formData.logoFile.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleFileChange("logoFile", null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 p-4 border rounded-md bg-muted/50">
                    <h4 className="font-medium mb-2">Preview</h4>
                    <div
                      className="p-4 rounded-md"
                      style={{
                        backgroundColor: formData.backgroundColor,
                        color: formData.textColor,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-5 w-5" />
                          <h4 className="font-medium">{formData.credentialName || "Credential Title"}</h4>
                        </div>
                        <Badge variant="outline" style={{ borderColor: formData.textColor, color: formData.textColor }}>
                          {formData.category || "Category"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm opacity-90">{formData.description || "Credential description"}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {activeStep > 1 ? (
                <Button variant="outline" onClick={handlePrevStep}>
                  Previous
                </Button>
              ) : (
                <Button variant="outline" onClick={() => router.push("/dashboard/credentials")}>
                  Cancel
                </Button>
              )}

              {activeStep < 4 ? (
                <Button onClick={handleNextStep}>Next</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={issuanceInProgress}>
                  {issuanceInProgress ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Create Credential
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
