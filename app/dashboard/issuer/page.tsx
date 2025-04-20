"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Award, Check, ChevronRight, FileText, GraduationCap, Heart, Plus, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Mock data for the MVP
const mockIssuers = [
  {
    id: "issuer-1",
    name: "University of Technology",
    type: "education",
    verified: true,
    logo: "/placeholder.svg?height=40&width=40",
    description: "A leading institution for technology education and research",
    credentialsIssued: 1245,
  },
  {
    id: "issuer-2",
    name: "Government of Example",
    type: "government",
    verified: true,
    logo: "/placeholder.svg?height=40&width=40",
    description: "Official government identity and document issuer",
    credentialsIssued: 5678,
  },
  {
    id: "issuer-3",
    name: "Tech Academy",
    type: "education",
    verified: true,
    logo: "/placeholder.svg?height=40&width=40",
    description: "Professional certifications for technology professionals",
    credentialsIssued: 892,
  },
  {
    id: "issuer-4",
    name: "National Health Service",
    type: "health",
    verified: true,
    logo: "/placeholder.svg?height=40&width=40",
    description: "Official health records and vaccination certificates",
    credentialsIssued: 3421,
  },
  {
    id: "issuer-5",
    name: "PM Institute",
    type: "professional",
    verified: true,
    logo: "/placeholder.svg?height=40&width=40",
    description: "Global leader in project management certifications",
    credentialsIssued: 567,
  },
]

const credentialTemplates = [
  {
    id: "template-1",
    name: "University Degree",
    type: "education",
    icon: <GraduationCap className="h-5 w-5" />,
    fields: ["Degree Name", "Major", "GPA", "Graduation Date", "Student ID"],
  },
  {
    id: "template-2",
    name: "National ID",
    type: "identity",
    icon: <User className="h-5 w-5" />,
    fields: ["ID Number", "Full Name", "Date of Birth", "Nationality", "Issue Date", "Expiry Date"],
  },
  {
    id: "template-3",
    name: "Professional Certification",
    type: "professional",
    icon: <Award className="h-5 w-5" />,
    fields: ["Certification Name", "Level", "Score", "Issue Date", "Expiry Date", "Certificate Number"],
  },
  {
    id: "template-4",
    name: "Health Record",
    type: "health",
    icon: <Heart className="h-5 w-5" />,
    fields: ["Record Type", "Date", "Provider", "Details", "Reference Number"],
  },
]

export default function IssuerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIssuer, setSelectedIssuer] = useState(mockIssuers[0])
  const [issuingCredential, setIssuingCredential] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [issuanceSuccess, setIssuanceSuccess] = useState(false)

  const filteredIssuers = mockIssuers.filter((issuer) => issuer.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleIssueCredential = () => {
    setIssuingCredential(true)
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
  }

  const handleSubmitCredential = () => {
    // Simulate credential issuance
    setTimeout(() => {
      setIssuanceSuccess(true)

      // Reset after showing success
      setTimeout(() => {
        setIssuanceSuccess(false)
        setIssuingCredential(false)
        setSelectedTemplate(null)
      }, 3000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">Issuer Dashboard</h1>
          </div>
          <div>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleIssueCredential}>
              <Plus className="h-4 w-4 mr-2" />
              Issue Credential
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Issuers</CardTitle>
                <CardDescription>Select an organization to issue credentials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search issuers..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  {filteredIssuers.map((issuer) => (
                    <button
                      key={issuer.id}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${
                        selectedIssuer.id === issuer.id
                          ? "bg-purple-50 border border-purple-200"
                          : "bg-white border border-gray-200 hover:border-purple-200"
                      }`}
                      onClick={() => setSelectedIssuer(issuer)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img
                            src={issuer.logo || "/placeholder.svg"}
                            alt={issuer.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{issuer.name}</h3>
                          <p className="text-xs text-gray-500 capitalize">{issuer.type}</p>
                        </div>
                      </div>
                      {selectedIssuer.id === issuer.id && <Check className="h-4 w-4 text-purple-600" />}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={selectedIssuer.logo || "/placeholder.svg"}
                      alt={selectedIssuer.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle>{selectedIssuer.name}</CardTitle>
                    <CardDescription>{selectedIssuer.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Credentials Issued</h3>
                    <p className="text-2xl font-bold">{selectedIssuer.credentialsIssued.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      <p className="font-medium">Active</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleIssueCredential}>
                  <Plus className="h-4 w-4 mr-2" />
                  Issue New Credential
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest credentials issued by this organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Bachelor of Computer Science</h4>
                        <p className="text-xs text-gray-500">Issued to: Alex Lee • 2 days ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Award className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Web Development Certification</h4>
                        <p className="text-xs text-gray-500">Issued to: Jamie Smith • 3 days ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Master of Data Science</h4>
                        <p className="text-xs text-gray-500">Issued to: Taylor Johnson • 5 days ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <Button variant="outline" size="sm">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Issue Credential Dialog */}
      <Dialog open={issuingCredential} onOpenChange={setIssuingCredential}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Issue New Credential</DialogTitle>
            <DialogDescription>Create and issue a verifiable credential to a recipient</DialogDescription>
          </DialogHeader>

          {!selectedTemplate && !issuanceSuccess && (
            <div className="py-4">
              <h3 className="text-sm font-medium mb-3">Select a Credential Template</h3>
              <div className="space-y-3 mb-4">
                {credentialTemplates.map((template) => (
                  <button
                    key={template.id}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-purple-300 text-left"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">{template.icon}</div>
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-xs text-gray-500 capitalize">{template.type}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
              <Button variant="outline" className="w-full" onClick={() => setIssuingCredential(false)}>
                Cancel
              </Button>
            </div>
          )}

          {selectedTemplate && !issuanceSuccess && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-full">{selectedTemplate.icon}</div>
                <div>
                  <h3 className="font-medium">{selectedTemplate.name}</h3>
                  <p className="text-xs text-gray-500">Issued by: {selectedIssuer.name}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient DID</Label>
                  <Input id="recipient" placeholder="did:uniid:..." />
                  <p className="text-xs text-gray-500">Enter the Decentralized Identifier of the recipient</p>
                </div>

                {selectedTemplate.fields.map((field, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`field-${index}`}>{field}</Label>
                    <Input id={`field-${index}`} placeholder={`Enter ${field.toLowerCase()}`} />
                  </div>
                ))}

                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea id="notes" placeholder="Add any additional information..." />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedTemplate(null)}>
                  Back
                </Button>
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={handleSubmitCredential}>
                  Issue Credential
                </Button>
              </div>
            </div>
          )}

          {issuanceSuccess && (
            <div className="py-8 flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">Credential Issued</h3>
              <p className="text-center text-gray-600 mb-6">
                The credential has been successfully issued to the recipient
              </p>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  setIssuanceSuccess(false)
                  setIssuingCredential(false)
                  setSelectedTemplate(null)
                }}
              >
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
